# Estrutura de Pastas

## Objetivo do documento

Explicar o que existe em cada pasta do repositório e por que o código está organizado dessa forma.

## Quando deve ser utilizado

Consulte ao procurar onde um determinado tipo de código deveria morar, ou antes de criar um arquivo novo, para segui o mesmo padrão de organização já usado no projeto.

## Documentos referenciados

- [[00-visao-arquitetura]]
- [[06-padroes-arquiteturais]]

---

## `app/` — rotas (App Router do Next.js)

- **`app/(public)/`** — grupo de rotas do site público (o nome entre parênteses não aparece na URL). Tem seu próprio `layout.tsx`, que envolve todas as páginas com o cabeçalho (`Navbar`) e rodapé (`Footer`). Contém: página inicial (`page.tsx`), `catalogo/`, `contato/`, `sobre/`, e `produto/[slug]/` (página dinâmica de detalhe do produto).
- **`app/admin/`** — o painel administrativo. Diferente do site público, não fica dentro de um grupo de rotas — suas URLs começam literalmente em `/admin`. Tem seu próprio `layout.tsx` (menu lateral no desktop, menu inferior no mobile), protegido pelo `middleware.ts` da raiz do projeto. Sub-rotas: `login/` (a única não protegida), a página inicial do dashboard, e uma pasta por entidade (`produtos/`, `categorias/`, `eventos/`, `galeria/`), cada uma com suas páginas de listar/criar/editar.
- **`app/actions/settings.ts`** — o único arquivo de Server Actions do projeto (funções que rodam no servidor mas podem ser chamadas diretamente por um componente client, sem precisar de uma rota de API).
- **`app/layout.tsx`** — layout raiz de toda a aplicação: define o HTML base, os metadados globais de SEO, carrega as fontes, e monta dois componentes que aparecem em toda página (botão flutuante de WhatsApp e o sistema de notificações/toast).
- **Arquivos de convenção do Next.js na raiz de `app/`**: `not-found.tsx` (página 404 padrão do site), `manifest.ts` (manifesto PWA), `robots.ts` e `sitemap.ts` (arquivos de SEO gerados dinamicamente), `globals.css`.
- **Não existe `app/api/`** — o projeto não tem nenhuma rota de API própria (ver [[08-api-autenticacao]]).

## `components/` — organizado por domínio, não por tipo

- **`components/ui/`** — primitivos do shadcn/ui (na prática, só o componente de toast).
- **`components/admin/`** — componentes exclusivos do painel administrativo: tabelas de listagem, formulários (produto, categoria, evento), menu lateral, menu mobile, calendário de eventos.
- **`components/home/`** — seções específicas da página inicial (hero, serviços, portfólio, chamada para ação). Nem todos os arquivos desta pasta estão em uso — alguns são código não conectado a nenhuma página (ver [[00-visao-arquitetura]]).
- **`components/products/`** — cartão de produto, galeria de imagens do produto, filtro de categoria.
- **`components/catalog/`** — o componente principal e mais complexo da página de catálogo (controla abas, tema selecionado, e o estado da galeria em tela cheia).
- **`components/layout/`** — cabeçalho e rodapé, compartilhados por todas as páginas públicas.
- **`components/shared/`** — componentes usados em mais de uma área do site: botão de WhatsApp, botão flutuante de WhatsApp, visualizador de fotos em tela cheia (lightbox).

Convenção de nomes: cada componente é um arquivo em PascalCase (ex.: `ProductCard.tsx`) cujo nome bate exatamente com o componente que ele exporta.

## `hooks/` — hooks customizados

Só existe um hook no projeto: `use-toast.ts`, o hook padrão gerado pelo shadcn/ui para controlar as notificações. Nome em kebab-case, diferente da convenção PascalCase dos componentes.

## `lib/` — utilitários e configuração de baixo nível

- **`lib/supabase/`** — as três formas de criar um cliente Supabase (para o navegador, para o servidor, e um cliente "público" sem sessão), explicadas em [[08-api-autenticacao]].
- **`lib/utils.ts`** — funções pequenas usadas em todo o projeto: formatação de moeda (com a regra do "A combinar"), geração de slug a partir de um texto, e uma função auxiliar para combinar classes CSS.
- **`lib/whatsapp.ts`** — monta os links de WhatsApp com mensagem pré-preenchida.
- **`lib/category-mapping.ts`** e **`lib/gallery-constants.ts`** — mapeiam categorias do banco para os "temas" fixos exibidos no catálogo e na galeria.
- **`lib/service-constants.ts`** — os títulos padrão dos cards de serviço da home, usados como valor de reserva quando o admin ainda não configurou nada.

## `services/` — a camada de leitura de dados

Um arquivo por entidade (`products.ts`, `categories.ts`, `events.ts`, `gallery.ts`, `settings.ts`), cada um exportando funções que buscam dados no Supabase e são chamadas pelas páginas (Server Components). Esta pasta é usada quase exclusivamente para **leitura** — as operações de escrita ficam nos próprios componentes do admin, não aqui (ver [[06-padroes-arquiteturais]]).

## `supabase/` — definição do banco de dados

Arquivos `.sql` soltos: o schema inicial e uma sequência de migrações nomeadas manualmente (sem uma pasta gerenciada por ferramenta de CLI). Ver [[02-modelo-dados]] para o que cada tabela contém.

## `types/` — tipos compartilhados

Um único arquivo, `types/index.ts`, com as interfaces TypeScript usadas em todo o projeto (`Product`, `Category`, `Event`, `EventItem`, `Rental`, `AdminStats`).

## `public/` — arquivos estáticos

Pasta simples, sem subpastas: imagens de marketing/portfólio usadas como conteúdo de reserva (fallback) quando o admin ainda não configurou fotos próprias, e a logo da marca. Os ícones do site (favicon) não ficam aqui — usam a convenção de arquivo do Next.js (`app/icon.png`, `app/apple-icon.png`).

## `middleware.ts` — na raiz do projeto

Um único arquivo de middleware, responsável apenas por proteger as rotas `/admin/*` (detalhado em [[08-api-autenticacao]]).
