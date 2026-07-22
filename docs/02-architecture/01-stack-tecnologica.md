# Stack Tecnológica

## Objetivo do documento

Listar e explicar cada tecnologia usada no projeto — framework, linguagem, bibliotecas e ferramentas — e como elas se encaixam.

## Quando deve ser utilizado

Consulte antes de instalar uma dependência nova (para não duplicar algo que já existe) ou ao tentar entender por que determinado padrão de código aparece no projeto.

## Documentos referenciados

- [[00-visao-arquitetura]]
- [[06-padroes-arquiteturais]]
- [[05-estrutura-pastas]]

---

## Framework e linguagem

- **Next.js 15** (App Router) — roteamento por pastas em `app/`, Server Components por padrão, Server Actions disponíveis.
- **React 18**.
- **TypeScript 5**, com `strict: true` no `tsconfig.json`, mas `noImplicitAny: false` (o modo estrito não é 100% rígido — variáveis podem ficar implicitamente `any` em certos casos). Alias de importação `@/*` aponta para a raiz do projeto (ex.: `@/components`, `@/lib`, `@/services`). Um arquivo específico (`lib/supabase/server.ts`) está marcado para ser ignorado pela checagem de tipos.
- Não há `engines` no `package.json` nem `.nvmrc` — a versão exata do Node.js a usar não está travada/documentada no repositório.

## Gerenciador de pacotes

**npm** (existe `package-lock.json`; não há `yarn.lock` nem `pnpm-lock.yaml`).

## Scripts disponíveis

- `dev` — inicia o servidor de desenvolvimento.
- `build` — build de produção.
- `start` — roda o build de produção localmente.
- `lint` — roda o linter do Next.js.
- Não existe script de teste — não há framework de testes configurado no projeto.

## Estilização

- **Tailwind CSS 3.4** com o plugin `tailwindcss-animate`.
- Tema customizado com as cores da marca: rosa (`primary`), dourado (`gold`, `#D4AF37`), azul-marinho escuro (`slate`, `#1E293B`) e verde do WhatsApp.
- Duas fontes: Nunito (corpo do texto) e Playfair Display (itálico, usado em palavras de destaque nos títulos) — carregadas via tags `<link>` do Google Fonts no layout raiz, e não pelo mecanismo `next/font` do Next.js.
- Utilitário customizado `scrollbar-hide` (esconde a barra de rolagem em áreas de scroll horizontal, como carrosséis e abas).
- `darkMode` está configurado no Tailwind, mas o modo escuro **não está implementado de fato** — não há nenhum controle na interface para alternar tema.

## Componentes de UI

- **shadcn/ui** está configurado (`components.json`), mas na prática **só o componente de toast/notificação** foi gerado e é usado (`components/ui/toast.tsx`, `components/ui/toaster.tsx`, hook `hooks/use-toast.ts`).
- Diversas dependências do Radix UI (base do shadcn/ui) estão instaladas — diálogo, dropdown, abas, seletor, switch, etc. — mas **não são usadas em nenhum lugar do código**. Um novo desenvolvedor não deve presumir que existe uma biblioteca de componentes pronta para usar; a maior parte da interface (botões, cartões, abas, filtros) é HTML nativo estilizado diretamente com classes Tailwind.

## Formulários e validação

- **react-hook-form** para controle de formulários.
- **zod** para definição de esquemas de validação, com **@hookform/resolvers** conectando os dois.
- Usado nos quatro formulários do admin (produto, categoria, evento, login). Não há formulários no site público.
- Cada formulário define seu próprio esquema Zod localmente (não há esquemas compartilhados entre telas), incluindo normalizações específicas para o formato brasileiro (ex.: aceitar vírgula decimal em vez de ponto).

## Animação

**framer-motion**, usado em componentes da home, produtos, catálogo, cabeçalho e na página "Sobre" — transições de entrada, fade entre imagens da galeria, menu mobile animado.

## Ícones

**lucide-react** em todo o projeto.

## Datas, gráficos e estado

- **Não há biblioteca de datas** (nem date-fns, nem dayjs) — cálculos de data (ex.: receita mensal, calendário de eventos) usam o objeto `Date` nativo do JavaScript diretamente.
- **Não há biblioteca de gráficos** — o gráfico de barras de receita no dashboard do admin é construído manualmente com `<div>`s estilizados, não uma lib como Recharts/Chart.js.
- **Não há gerenciador de estado global** (sem Redux, Zustand, Context API compartilhada, TanStack Query). Todo estado é local a cada componente.

## Backend como serviço

**Supabase** — banco de dados Postgres, autenticação e armazenamento de arquivos, acessado através dos pacotes `@supabase/supabase-js` e `@supabase/ssr` (este último para autenticação com cookies em Server Components/Middleware). Detalhes em [[08-api-autenticacao]], [[02-modelo-dados]] e [[09-uploads-imagens]].

## Qualidade de código

- **ESLint** (via `eslint-config-next`) para lint.
- Não há Prettier configurado.
- Não há testes automatizados de nenhum tipo (unitário, integração ou end-to-end).
