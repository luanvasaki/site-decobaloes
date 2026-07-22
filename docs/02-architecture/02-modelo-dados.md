# Modelo de Dados

## Objetivo do documento

Descrever todas as tabelas do banco de dados (Postgres, via Supabase), seus campos, relacionamentos e regras de acesso (Row Level Security).

## Quando deve ser utilizado

Consulte antes de criar uma consulta nova, adicionar um campo a uma tabela existente, ou entender por que um dado se comporta de determinada forma (ex.: por que um preço pode ser nulo).

## Documentos referenciados

- [[00-visao-arquitetura]]
- [[08-api-autenticacao]] — como a autenticação se conecta às políticas de acesso descritas aqui
- [[07-fluxo-de-dados]]

---

## Onde vive o schema

A pasta `supabase/` contém os arquivos SQL do banco: um `schema.sql` inicial e vários arquivos de migração incremental nomeados livremente (não existe uma pasta `supabase/migrations/` no formato gerenciado pela CLI do Supabase, nem um arquivo de configuração de projeto Supabase). Isso significa que os scripts precisam ser aplicados manualmente (via editor SQL do Supabase), e não há histórico automático/versionado de qual migração já foi aplicada em qual ambiente.

## Tabelas

### `categories`
Categorias compartilhadas por produtos e eventos (o mesmo conceito de categoria serve para classificar tanto um item do catálogo quanto o tipo de um evento). Campos: `id`, `name`, `slug` (único), `created_at`.

### `products`
O catálogo de itens. Campos principais: `id`, `name`, `slug` (único), `description`, `category_id` (referência a `categories`), `product_type` (`decoracao` ou `material`, com restrição de valor no banco), `price_rental` (numérico, **aceita nulo** — é assim que a regra "A combinar" é implementada), `images_urls` (lista de URLs de imagem), `is_available` (booleano, controla se aparece no catálogo público).

Campos específicos de **decoração**: `color_palette` (paleta de cores, texto livre), `event_size` (`pequeno`, `medio` ou `grande`, com restrição de valor), `includes_setup` (booleano — inclui montagem/desmontagem).

Campos específicos de **material** (item físico para locação): `height`, `width`, `depth` (dimensões em cm), `quantity_total`, `quantity_available` (controle de estoque).

Há índices em `slug`, `category_id` e `is_available` para acelerar as consultas mais comuns (busca por slug, filtro por categoria, filtro de disponibilidade).

### `rentals`
Tabela "preparada para o futuro": `id`, `product_id`, `event_date`, `quantity`, `customer_name`, `customer_phone`, `created_at`. **Não é usada por nenhuma parte do código atual** — nem lida nem escrita em lugar nenhum da aplicação. É um modelo mais simples de locação avulsa que existe no banco mas ainda não foi conectado a nenhuma tela.

### `events`
O núcleo do módulo de gestão de eventos (o "CRM" do admin). Campos agrupados por assunto:
- **Cliente**: `client_name`, `client_phone`, `client_email`.
- **Evento**: `event_date`, `event_time`, `setup_time`, `teardown_time`, `category_id` (tipo do evento), `event_theme`, `guest_count`.
- **Local**: nome do espaço e endereço.
- **Decoração** (texto livre): `decoration_colors`, `balloon_colors`, `balloon_types`, `fabric_colors`, `decoration_pieces`, `inspiration_refs`, `special_requests`.
- **Financeiro**: `total_value`, `deposit_value`, `deposit_paid_at`, `payment_method` (`pix`, `cartao`, `dinheiro` ou `transferencia`, com restrição de valor), `payment_status` (`pendente`, `parcial` ou `pago`, com restrição de valor).
- **Ciclo de vida**: `status` (`orcamento`, `confirmado`, `em_andamento`, `concluido` ou `cancelado`, com restrição de valor).
- `internal_notes` (notas visíveis só para a equipe), timestamps.

Índices em `event_date`, `status` e `category_id`.

Importante: o campo `status` (etapa do evento) e o campo `payment_status` (situação do pagamento) são **independentes** um do outro no banco — nada impede, por exemplo, um evento "concluído" com pagamento "pendente". A consistência entre os dois é responsabilidade de quem preenche o formulário, não é imposta pelo schema.

### `event_items`
Itens vinculados a um evento — a "lista de compras" de cada festa. Campos: `id`, `event_id` (referência a `events`, exclusão em cascata — apagar um evento apaga seus itens), `product_id` (referência a `products`, fica nulo se o produto for excluído do catálogo depois), `custom_name` (para itens avulsos que não vêm do catálogo), `quantity`, `unit_price`, `notes`.

### `gallery_photos`
Fotos de portfólio exibidas no site público. Campos: `id`, `category` (texto livre — os valores usados na prática seguem a lista fixa definida no código da aplicação, não uma restrição do banco), `image_url`, `sort_order` (ordem manual de exibição, controlada pela equipe no admin), `created_at`.

### `settings`
Tabela chave/valor genérica usada para conteúdo editável da home: `key` (chave primária), `value`, `updated_at`. As chaves usadas hoje são `hero_images` (lista de fotos de capa do site, guardada como texto JSON — uma foto só fica estática, mais de uma alterna automaticamente no Hero; substituiu a antiga chave `hero_image_url`, de foto única, em 2026-07-21), `homepage_images` (lista de fotos da home, guardada como texto JSON) e `service_titles` (os 4 títulos dos cards de serviço, também como texto JSON).

## Regras de acesso (Row Level Security)

Segurança de acesso é feita **no banco**, não na aplicação. Row Level Security (RLS) está habilitado em todas as tabelas, seguindo um padrão consistente:

- **Leitura pública (visitante anônimo)**: liberada em `categories`, `products`, `gallery_photos` e `settings` — dados que aparecem no site público. **Não** liberada em `events`, `event_items` nem `rentals` — dados internos do negócio nunca são lidos por um visitante anônimo.
- **Escrita (inserir/atualizar/excluir)**: em **todas** as tabelas, exige apenas que o usuário esteja autenticado no Supabase Auth (`auth.role() = 'authenticated'`) — não existe distinção de papel/permissão além de "logado ou não logado".

O bucket de armazenamento de imagens (`product-images`) segue a mesma lógica: leitura pública, escrita só para usuários autenticados.

Não há funções nem triggers no banco (por exemplo, não há atualização automática de `updated_at` — se um campo desse tipo precisa ser atualizado, isso tem que ser feito explicitamente pelo código da aplicação).
