# Convenções Técnicas — Componentes, TypeScript, React, Next.js e Tailwind

## Objetivo do documento

Detalhar, tópico por tópico, as convenções técnicas concretas já em uso no projeto — estrutura interna de componentes, tipagem, padrões de React e Next.js, e uso do Tailwind — para que um código novo seja indistinguível do restante em termos de estilo.

## Quando deve ser utilizado

Consulte ao escrever um componente, hook, página ou classe Tailwind novos — principalmente se você vem de outro projeto com convenções diferentes.

## Documentos referenciados

- [[01-padroes-codigo]] — padrões arquiteturais de mais alto nível (onde colocar cada arquivo, Server vs. Client Component, tratamento de erro)
- `../02-architecture/06-padroes-arquiteturais.md`
- `../03-design/00-design-system.md` — a paleta/tokens que as classes Tailwind devem usar
- [[06-performance-boas-praticas]]
- [[07-checklists]]

---

## Estrutura de componentes

- **Um componente por arquivo**, nome do arquivo em PascalCase idêntico ao nome do componente exportado (ex.: `ProductCard.tsx` exporta `ProductCard`).
- **Exportação nomeada, não `export default`** — todo componente do projeto (fora dos arquivos de rota do Next.js, que exigem `export default` por convenção do próprio framework) usa `export function NomeDoComponente(...)`. Não introduza `export default` em um componente novo só porque é um hábito comum em outros projetos — quebraria a convenção estabelecida aqui.
- **Tipagem de props via `interface`, não `type`** — a convenção observada no projeto é declarar uma `interface NomeDoComponenteProps` logo acima do componente, e não um `type` equivalente. Use `interface` para se manter consistente.
- **Sem arquivo de estilo separado** — não existe CSS Module nem styled-components; as classes Tailwind vão diretamente no JSX do próprio componente.
- **Sem arquivo "barril" (`index.ts`)** — nenhuma pasta de `components/` reexporta seu conteúdo por um índice; os imports sempre apontam direto para o arquivo do componente.
- **Ordem interna comum**: importações → declaração da interface de props → função do componente → (se houver) pequenas funções auxiliares locais usadas só por aquele componente, declaradas depois do componente ou no topo do arquivo, conforme o tamanho.

## Convenções TypeScript

- O projeto roda em modo `strict`, mas com `noImplicitAny` desligado — ou seja, nem todo `any` implícito é barrado pelo compilador. Não conte com o compilador para pegar toda falta de tipagem; tipe explicitamente por disciplina, não só porque o compilador exige.
- Use sempre o alias `@/` para importar a partir da raiz do projeto (`@/components/...`, `@/lib/...`, `@/services/...`, `@/types`) em vez de caminhos relativos longos (`../../../`).
- Os tipos de domínio compartilhados (`Product`, `Category`, `Event`, `EventItem`, `Rental`, `AdminStats`) vivem centralizados em `types/index.ts` — reaproveite-os em vez de recriar um tipo equivalente em outro arquivo.
- Evite `// @ts-nocheck` e `// @ts-ignore` — existe um único uso de `@ts-nocheck` no projeto hoje (`lib/supabase/server.ts`), tratado como uma exceção conhecida, não como um padrão a seguir. Um novo `@ts-nocheck` deveria ser uma exceção rara e justificada, não um atalho para resolver um erro de tipo rapidamente.

## Convenções React

- **Server Component é o padrão** — toda página nova começa como uma função assíncrona sem `'use client'`, buscando seus próprios dados. Só adicione `'use client'` ao componente que realmente precisa de interatividade, estado local, animação (`framer-motion`) ou uma chamada ao Supabase feita pelo navegador — e, quando precisar, isole essa necessidade no menor componente possível em vez de marcar a página inteira. Ver `../02-architecture/06-padroes-arquiteturais.md` para o raciocínio completo.
- **Estado local com `useState`, sem gerenciador global** — o projeto não usa Redux, Zustand nem Context API para estado compartilhado. Se um dado precisa ser conhecido por vários componentes, ele desce como prop a partir do componente pai que o busca ou controla — não introduza uma solução de estado global para resolver isso sem alinhar antes.
- **Hooks customizados são raros** — existe um único hook customizado no projeto (`use-toast.ts`, do sistema de notificação instalado mas não utilizado). Antes de criar um hook customizado novo, considere se a lógica não seria mais simples como uma função utilitária comum ou diretamente dentro do componente.
- **`useTransition`/`startTransition`**: cuidado ao combinar com atualizações funcionais de estado — uma chamada de transição feita de dentro do "updater" de um `setState` já causou um erro real neste projeto (ver `../06-knowledge/03-licoes-aprendidas.md`). Mantenha a chamada de `startTransition` sempre fora da função de atualização de estado.
- **Atualizações de estado baseadas no valor anterior devem usar a forma funcional** (`setState(prev => ...)`), nunca capturar o valor de uma renderização anterior diretamente — especialmente em interações que o usuário pode disparar repetidamente e rápido (outra lição já registrada no histórico do projeto).

## Convenções Next.js (App Router)

- **Estrutura de rota**: uma pasta em `app/` por rota, com `page.tsx` para o conteúdo e `layout.tsx` quando um grupo de rotas precisa de um invólucro comum. Siga o agrupamento já usado — rotas públicas dentro de `app/(public)/`, rotas administrativas dentro de `app/admin/`.
- **Toda rota dinâmica pública ou administrativa usa `export const dynamic = 'force-dynamic'`** — nenhuma página do projeto depende de cache/ISR do Next.js hoje. Siga esse padrão em uma página nova, a menos que haja uma decisão deliberada de introduzir cache (o que hoje não é o padrão do projeto — ver `../07-audits/01-auditoria-performance.md` para a discussão sobre isso).
- **`generateMetadata`** é usado nas páginas que precisam de SEO específico (ex. página de produto) — siga esse padrão em vez de deixar a página herdar só o metadata genérico do layout raiz, especialmente em qualquer página pública nova.
- **`notFound()`** é o mecanismo usado para tratar um identificador inválido em uma rota dinâmica (ex. um slug de produto ou id de evento inexistente) — não crie uma tela de erro customizada alternativa para esse caso.
- **Server Actions são a exceção, não a regra** — hoje só existe um arquivo de Server Actions no projeto inteiro (`app/actions/settings.ts`). A maioria das escritas do admin é feita diretamente do componente client, chamando o Supabase do navegador. Não presuma que toda escrita nova deveria virar uma Server Action — siga o padrão já estabelecido (ver ADR relevante em `../06-knowledge/01-decisoes-tecnicas.md`) a menos que haja um motivo específico para desviar dele.
- **Não crie rotas em `app/api/`** sem alinhar antes — o projeto não tem nenhuma API própria hoje, por design (ver `../02-architecture/08-api-autenticacao.md`).

## Tailwind

- **Classes Tailwind direto no JSX** — sem `@apply` em CSS separado (fora dos utilitários customizados já existentes em `globals.css`, como `.gradient-pink-gold`), sem CSS-in-JS.
- **Use os tokens de cor da marca já definidos**, não hexadecimais soltos — consulte `../03-design/00-design-system.md` antes de escrever uma cor nova. Se a cor que você precisa não existir no tema, é mais provável que você deva reutilizar uma cor já definida do que adicionar uma nova.
- **Siga a progressão de breakpoints já estabelecida** em qualquer grade nova (1 coluna no celular, crescendo com `sm:`/`md:`/`lg:`/`xl:`) — não deixe uma grade sem nenhum breakpoint responsivo (esse é, inclusive, um problema já identificado em uma tela existente do projeto, ver `../03-design/00-design-system.md`, seção Grid).
- **`cn()`** (utilitário em `lib/utils.ts`, que combina `clsx` e `tailwind-merge`) deve ser usado sempre que uma classe é condicional ou combinada dinamicamente — evita conflitos de classes Tailwind concorrentes (ex. duas classes de cor de fundo diferentes aplicadas ao mesmo elemento por engano).
- **Cantos arredondados generosos e sombras suaves são a assinatura visual do projeto** (ver `../03-design/00-design-system.md`) — um componente novo do site público deve seguir essa linguagem, não introduzir cantos retos ou sombras duras.

## Nomenclaturas

| Tipo de arquivo | Convenção | Exemplo |
|---|---|---|
| Componente React | PascalCase | `ProductCard.tsx` |
| Utilitário / serviço / configuração (`lib/`, `services/`) | kebab-case | `category-mapping.ts` |
| Hook customizado | kebab-case com prefixo `use-` | `use-toast.ts` |
| Página de rota (Next.js) | sempre `page.tsx`, dentro de uma pasta nomeada pela rota | `app/admin/produtos/novo/page.tsx` |
| Componente exportado | PascalCase, idêntico ao nome do arquivo | `export function ProductCard(...)` |
| Interface de props | nome do componente + sufixo `Props` | `ProductCardProps` |
| Variável/função comum | camelCase | `formatCurrency`, `getWhatsAppLink` |

## Organização

Siga a organização por domínio já estabelecida (detalhada por completo em `../02-architecture/05-estrutura-pastas.md`):
- Componente exclusivo de uma área → subpasta daquela área (`components/admin/`, `components/home/`, `components/products/`, `components/catalog/`).
- Componente usado em mais de uma área pública → `components/shared/`.
- Função de leitura de dados usada por uma página → `services/`, um arquivo por entidade.
- Constante/mapeamento de negócio → `lib/`.

Antes de criar uma pasta nova dentro de `components/`, `lib/` ou `services/`, verifique se o conteúdo não se encaixa em uma pasta já existente — o projeto tem poucas categorias bem definidas, e multiplicar pastas novas sem necessidade dificulta encontrar as coisas depois.
