# Auditoria de Produto, Design, Arquitetura e Tecnologia

## Objetivo do documento

Registrar os achados de uma auditoria completa cobrindo quatro dimensões — funcionalidades (aderência ao que é esperado do produto), design/UX (beleza e experiência visual), arquitetura/estrutura (organização do código) e tecnologia/stack (atualização e adequação das dependências) — com recomendações, sem implementá-las aqui.

## Quando deve ser utilizado

Consulte antes de planejar um ciclo de melhorias amplo do site, ao avaliar "o que falta para o site ser referência no mercado de decoração de eventos", ou como ponto de partida para dividir trabalho entre as Skills de domínio (Frontend, Design, Backend, Infraestrutura).

## Documentos referenciados

- [[00-auditoria-seguranca]], [[01-auditoria-performance]], [[02-auditoria-codigo]] — dimensões de Segurança, Performance e Código já cobertas anteriormente; esta auditoria não as repete, apenas complementa com as quatro dimensões restantes.
- `../06-knowledge/04-decisoes-futuras.md` — decisões já adiadas conscientemente (papéis/permissões, shadcn/ui incompleto, cache, analytics); não repetidas aqui.
- `../01-product/`, `../03-design/`, `../02-architecture/` — referências de "esperado" usadas nesta auditoria.

## Escopo desta execução

Auditoria solicitada cobrindo 4 das 8 dimensões possíveis: **Funcionalidades**, **Design/UX/Beleza**, **Arquitetura/Estrutura** e **Tecnologia/Stack**. Documentação, Segurança, Performance e Código ficam fora desta execução por já terem auditoria própria (Segurança/Performance/Código) ou por não terem sido solicitadas (Documentação).

---

## Achados — Prioridade Alta

### 1. Categorias fora do mapeamento fixo de temas somem do site público sem aviso
`components/catalog/CatalogView.tsx` (linhas ~24-31) só exibe produtos cuja categoria esteja em uma lista fixa de 6 slugs (`casamento`, `aniversario`, `debutante`, `festa-infantil`, `cha-de-bebe`, `cha-revelacao`), mapeados para 4 temas de aba. `lib/gallery-constants.ts` usa a mesma lista fechada para a Galeria. O formulário de categoria no admin (`/admin/categorias/nova`) aceita qualquer nome/slug livremente, sem nenhum aviso de que ele pode não corresponder a nenhum tema conhecido.

**Impacto**: se a equipe cadastrar uma categoria fora dessa lista (ex. "Formatura", "Corporativo", "Batizado"), qualquer produto marcado como disponível nela desaparece completamente do Catálogo e da Galeria públicos — sem erro, aviso ou log em lugar nenhum. No admin, tudo parece certo (produto cadastrado, disponível=true); no site, o item simplesmente nunca aparece para nenhum cliente.

**Recomendação**: adicionar um aviso explícito no admin quando a categoria escolhida não corresponde a nenhum tema conhecido, ou tornar o mapeamento tema↔categoria administrável em vez de fixo no código.

### 2. `next` com vulnerabilidades de alta severidade — quadro mudou desde a auditoria de segurança
A auditoria de segurança (`00-auditoria-seguranca.md`, achado 6) registrava 4 vulnerabilidades restritas a ferramentas de build. Uma nova checagem de `npm audit` hoje mostra **8 vulnerabilidades (1 moderada, 7 altas)**, agora incluindo o próprio **`next`** (não mais só dependências de build), com CVEs conhecidos de HTTP request smuggling em rewrites, DoS em Server Components/Image Optimization, bypass de middleware/proxy, cache poisoning e XSS via CSP nonces.

**Versão instalada**: `15.5.12`. **Versão disponível na mesma linha** (sem mudança de major): `15.5.21` — resolveria a maior parte sem risco de quebra.

**Recomendação**: atualizar `next` para `15.5.21` o quanto antes — deixou de ser só uma questão de ferramentas de build e passou a envolver o próprio framework em produção.

### 3. Projeto nunca teve uma configuração de ESLint de fato
Não existe `.eslintrc*`, `eslint.config.*` nem `eslintConfig` em `package.json`. Rodar `npm run lint` hoje dispara o assistente interativo de primeira configuração do Next.js — que nunca foi concluído. Ou seja, lint nunca rodou de verdade neste projeto, apesar de `docs/02-architecture/01-stack-tecnologica.md` listar ESLint como parte da qualidade de código em vigor. Some a isso o fato de que `next lint` está oficialmente descontinuado, com remoção prevista no Next.js 16.

**Recomendação**: gerar a configuração agora (`next lint` → modo "Strict") e, dado o aviso de depreciação, já considerar migrar direto para ESLint CLI (`npx @next/codemod@canary next-lint-to-eslint-cli .`) em vez de configurar algo que será removido em breve.

### 4. Nenhum `loading.tsx`/`error.tsx` de rota no App Router
Nenhuma página em `app/(public)/` ou `app/admin/` define os arquivos de convenção `loading.tsx` ou `error.tsx` do App Router, e não existe nenhum componente de skeleton (`animate-pulse`) em todo o projeto. Combinado com o achado já documentado em `01-auditoria-performance.md` (toda rota busca dados frescos, sem cache), uma consulta lenta ao Supabase produz tela em branco em vez de um estado de carregamento desenhado — destoando do cuidado visual do resto do site. Uma falha de leitura também não tem tela de erro dedicada (hoje vira estado vazio silencioso "sem produtos", que pode comunicar a mensagem errada quando na verdade houve uma falha).

**Recomendação**: criar `loading.tsx` com skeleton de marca para Catálogo/Produto/Home, e um `error.tsx` de rota no mesmo tom visual da página 404 existente.

## Achados — Prioridade Média

### 5. Mapeamento categoria→tema duplicado em dois lugares
`lib/category-mapping.ts` (`CATEGORY_TO_THEME`) é a fonte usada em `app/(public)/produto/[slug]/page.tsx`, mas `CatalogView.tsx` mantém uma cópia inline separada da mesma lógica (ligada ao achado 1). Hoje as duas cópias estão sincronizadas, mas nada impede que uma alteração futura seja feita em um lugar e esquecida no outro, fazendo o selo de categoria na página de Produto apontar para um tema diferente do que o Catálogo realmente usa.

**Recomendação**: unificar em `lib/category-mapping.ts` como fonte única, usada também por `CatalogView.tsx`.

### 6. Exclusão de produto usado em evento passado apaga o nome do item no histórico
`event_items.product_id` usa `on delete set null`, e a exibição do nome do item (`app/admin/eventos/[id]/page.tsx`) é calculada em tempo real via join (`item.products?.name ?? item.custom_name ?? 'Item avulso'`), não uma cópia salva no momento da venda. Excluir do catálogo um produto usado em um evento já concluído faz o histórico desse evento passar a mostrar "Item avulso" no lugar do nome real — quantidade e preço unitário continuam corretos, mas a identificação do item se perde silenciosamente.

**Recomendação**: gravar um `product_name` (snapshot) em `event_items` no momento de salvar o evento, em vez de depender do join com `products` para exibição.

### 7. Leituras feitas fora da camada `services/` em um ponto do admin
`app/admin/page.tsx` (função `getDashboardData`) chama `supabase.from('products')`, `supabase.from('categories')` e `supabase.from('events')` diretamente, misturado com chamadas corretas à camada `services/` na mesma função — o único ponto do projeto que quebra o padrão descrito em `docs/02-architecture/06-padroes-arquiteturais.md` ("toda leitura... passa pela camada `services/`").

**Recomendação**: mover essas 3 consultas para funções novas em `services/products.ts` e `services/categories.ts`, por consistência com o resto do projeto e para manter a documentação verdadeira.

### 8. Arquivos SQL soltos e duplicados em `supabase/`, sem indicação de qual é autoritativo
`supabase/gallery.sql` e `supabase/migration-settings.sql` criam as tabelas `gallery_photos` e `settings` de um jeito; `supabase/migration-gallery-and-settings-setup.sql` as recria do zero, com um comentário interno afirmando que as duas anteriores "nunca foram criadas em produção". Um novo desenvolvedor lendo `gallery.sql` isoladamente veria uma versão desatualizada do schema (sem `sort_order`, por exemplo) sem nenhum sinal de que o arquivo foi substituído.

**Recomendação**: arquivar/remover os arquivos superados, ou ao menos adicionar um comentário de topo indicando qual arquivo é o vigente.

### 9. Next.js duas versões atrás mesmo dentro da própria linha, e Next 16 traria ganho direto já identificado
Além da urgência de segurança do achado 2, vale registrar separadamente a oportunidade: Next 16 (Cache Components/PPR nativos) endereçaria diretamente o achado #1 da auditoria de performance (ausência de cache em rotas dinâmicas). Sem suíte de testes automatizados (decisão já registrada como em aberto), uma migração de major exige validação manual cuidadosa — não é urgente, mas vale planejar depois de resolver o patch de segurança.

### 10. React 18 vs React 19 já disponível
`react`/`react-dom` em `18.3.1`; `19.2.8` disponível. As dependências relevantes (Radix, react-hook-form, framer-motion) já suportam React 19, então o caminho técnico está livre — mas, pela mesma razão do achado 9 (ausência de testes), a migração dependeria de verificação manual completa antes de ser considerada segura.

### 11. Página "Sobre" usa placeholder decorativo no lugar de foto real da fundadora
`app/(public)/sobre/page.tsx` (~linhas 65-90) renderiza um ícone de coração sobre blobs decorativos no lugar de uma foto real de Miriam Vasaki. Isso contradiz diretamente `docs/03-design/01-identidade-visual.md` ("não há estilo de fotografia de estoque genérica — as fotos usadas são de trabalhos reais da empresa"), justamente na seção mais pessoal do site (fundadora, 25+ anos, "boutique").

**Recomendação**: substituir por foto real da fundadora — ganho de autenticidade relevante num segmento onde a relação pessoal pesa na decisão de compra.

### 12. Lightbox de fotos sem contenção de foco (focus trap)
`components/shared/PhotoLightbox.tsx` trata Escape/setas e trava o scroll do body, mas não prende o foco de teclado dentro do modal — um usuário navegando por Tab pode sair do lightbox para elementos da página por trás, invisíveis atrás do overlay.

**Recomendação**: prender o foco ao abrir (mover para o botão fechar, ciclar Tab dentro do modal, devolver foco ao elemento que abriu o lightbox ao fechar).

## Achados — Prioridade Baixa

### 13. `schema.sql` desatualizado em relação ao estado real do banco
`schema.sql` define `price_rental` como `not null`, mas uma migration posterior (`migration-price-rental-nullable.sql`) tornou o campo aceitável como nulo — mudança da qual depende a regra de negócio "preço nulo = 'A combinar'". Quem ler só `schema.sql` concluiria (incorretamente) que o preço é obrigatório.

**Recomendação**: mesma do achado 8 — comentário indicando que `schema.sql` é só o ponto de partida histórico, não o estado atual.

### 14. Afinação de toque ausente no `ProductCard`
O CTA "Ver detalhes" só aparece via `group-hover` — em touch, o cartão nunca mostra essa affordance (embora o cartão inteiro já seja clicável, então não há perda funcional, só de clareza visual).

**Recomendação**: opcional — considerar exibir o rótulo de forma sutil por padrão em telas sem hover (`@media (hover: none)`).

### 15. `@supabase/ssr` muito atrás da versão atual
`0.5.2` instalado vs `0.12.3` disponível — o maior salto relativo entre as dependências do projeto. Vale checar o changelog por mudanças na API de cookies/middleware antes de atualizar, já que sustenta a autenticação via Server Components.

### 16. Ausência de `engines`/`.nvmrc`
Nenhuma trava de versão de Node no repositório (`v24.14.1` em uso localmente) — comportamento não garantido em outra máquina com Node mais antigo.

### 17. `tsconfig.json` com `target: "ES2017"` conservador
Não é um bug, mas está defasado frente ao runtime real (Vercel/Node 24) — poderia ser um alvo mais moderno sem perda de compatibilidade real.

---

## Pergunta em aberto identificada (proposta de registro)

Esta auditoria identificou uma pergunta genuinamente nova, candidata a entrada em `../06-knowledge/04-decisoes-futuras.md` (registro proposto aqui, não aplicado):

> **O mapeamento categoria↔tema deveria ser administrável, em vez de fixo no código?**
> Hoje (achado 1), a lista de categorias que aparecem no Catálogo/Galeria públicos é uma constante no código, enquanto o cadastro de categorias no admin é livre — permitindo criar categorias "invisíveis" sem querer. Enquanto isso não é decidido, o padrão atual funciona apenas porque a equipe conhece de cor as 6 categorias válidas; o gatilho para revisitar seria a primeira vez que uma nova categoria for cadastrada fora dessa lista.

## Pontos positivos identificados

- Estados vazios são consistentes ponta a ponta (ícone + mensagem + ação) em todas as listagens públicas e admin — disciplina rara de se manter em todo um projeto.
- A composição visual do hero e do "bento grid" de serviços são decisões de design com identidade própria — diferenciam o site de um template genérico de decoração.
- A estrutura real de pastas (`app/`, `components/`, `services/`, `lib/`, `types/`) bate quase integralmente com o que está documentado em `05-estrutura-pastas.md`, e as políticas RLS seguem um padrão único e correto em todas as tabelas.
- A geração de link/mensagem de WhatsApp é centralizada em `lib/whatsapp.ts`, sem duplicação entre os pontos de conversão do site.
- Nenhum TODO/FIXME foi encontrado em `app/`, `components/`, `services/` ou `lib/` — indício de que o time não deixa trabalho conscientemente incompleto no código.
- Nenhuma tecnologia da stack está abandonada ou sem manutenção upstream; as escolhas registradas em `06-knowledge/05-escolhas-de-tecnologia.md` continuam adequadas ao porte do projeto.
