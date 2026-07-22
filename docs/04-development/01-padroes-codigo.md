# Padrões de Código

## Objetivo do documento

Descrever como o código deste projeto é escrito na prática — convenções de nomes, organização de arquivos e os padrões que um código novo deve seguir para se manter consistente com o restante do projeto.

## Quando deve ser utilizado

Consulte antes de criar um arquivo novo, um componente novo, ou um formulário novo — para que o resultado pareça ter sido escrito pela mesma pessoa que o resto do código.

## Documentos referenciados

- `../02-architecture/06-padroes-arquiteturais.md` — os padrões arquiteturais de fundo (Server vs. Client Component, camada de serviço, tratamento de erro) que este documento pressupõe
- `../02-architecture/05-estrutura-pastas.md` — onde cada tipo de arquivo deve morar
- [[00-guia-desenvolvimento]]

---

## Linguagem e tipagem

TypeScript em modo `strict`, mas com `noImplicitAny` desligado — ou seja, o projeto não é 100% rígido sobre tipos implícitos; não presuma que todo `any` implícito vai ser barrado pelo compilador. Use o alias `@/` para importar a partir da raiz do projeto (ex.: `@/components/...`, `@/lib/...`, `@/services/...`) em vez de caminhos relativos longos — é assim que o projeto todo importa.

## Convenção de nomes de arquivo

- **Componentes React**: PascalCase, um componente por arquivo, o nome do arquivo é sempre idêntico ao nome do componente exportado (ex.: `ProductCard.tsx` exporta `ProductCard`).
- **Utilitários, serviços e configuração** (`lib/`, `services/`): kebab-case (ex.: `category-mapping.ts`, `whatsapp.ts`).
- Não crie arquivos `index.ts` "barril" reexportando uma pasta inteira — o projeto não usa esse padrão; cada import aponta direto para o arquivo de origem.

## Onde colocar um arquivo novo

Siga a organização por domínio já estabelecida (detalhada em `../02-architecture/05-estrutura-pastas.md`):
- Um componente exclusivo de uma área específica vai na subpasta daquela área (`components/admin/`, `components/home/`, `components/products/`, `components/catalog/`).
- Um componente usado em mais de uma área pública vai em `components/shared/`.
- Uma função que busca dados do Supabase e é usada por uma página (Server Component) vai em `services/`, seguindo o padrão de um arquivo por entidade.
- Uma constante/mapeamento de negócio (ex.: relação entre categoria e tema) vai em `lib/`.

## Server Component é o padrão — Client Component é a exceção

Ao criar uma página nova, comece como Server Component (função assíncrona, busca de dados direto no corpo da função, via `services/`). Só adicione `'use client'` ao componente que efetivamente precisa de interatividade, estado local, animação (`framer-motion`) ou uma chamada ao Supabase feita pelo navegador — e, quando isso acontecer, prefira isolar essa necessidade no menor componente possível (o "folho" da árvore), em vez de marcar a página inteira como client. Veja `../02-architecture/06-padroes-arquiteturais.md` para o raciocínio completo por trás disso.

## Leitura passa por `services/`, escrita fica no componente

Se você está buscando dados para exibir em uma página pública ou numa listagem do admin, adicione (ou reutilize) uma função em `services/` — não faça a consulta ao Supabase direto dentro da página. Se você está implementando uma ação de escrita (criar/editar/excluir) num formulário do admin, siga o padrão já usado: a chamada ao Supabase fica dentro do próprio componente client, não em `services/`. Isso é uma inconsistência deliberada do projeto (ver `../02-architecture/06-padroes-arquiteturais.md`) — não tente "corrigi-la" criando uma camada de escrita centralizada sem alinhar antes, pois seria uma mudança de padrão em todo o projeto.

## Padrão de formulário

Todo formulário novo do admin deve seguir a receita já usada em `ProductForm`, `CategoryForm` e `EventForm`:
1. `react-hook-form` para controlar os campos.
2. Um esquema `zod` definido localmente no próprio arquivo do formulário (não compartilhado entre telas).
3. Normalização de campos numéricos que aceitam o formato brasileiro (vírgula decimal) antes da validação.
4. Um resumo de erros no topo do formulário, com rolagem automática até o primeiro campo inválido.
5. Estado de "enviando" que desabilita o botão de submit e troca seu texto/ícone.

## Padrão de tratamento de erro

- Em funções de leitura (`services/`): capture o erro, registre no console com um prefixo identificando a função, e devolva um valor vazio/seguro (`[]` ou `null`) — nunca deixe o erro subir até quebrar a página.
- Em ações de escrita (componentes client): capture o erro da chamada ao Supabase e mostre uma mensagem local naquela tela (caixa vermelha inline) — o projeto não usa um sistema global de notificação de erro (o componente de toast está instalado mas não é usado em lugar nenhum; não comece a usá-lo sem alinhar antes, para não introduzir dois padrões de feedback ao mesmo tempo).
- Para uploads de arquivo (fotos), siga o padrão de falha isolada por arquivo: cada arquivo é enviado com sua própria captura de erro, para que a falha de um não impeça os demais nem impeça o restante da operação (ex. salvar o produto) de continuar.

## Estilização

Tailwind CSS diretamente nas classes do elemento — o projeto não usa CSS Modules nem styled-components. Antes de escrever uma cor "na mão" em hexadecimal, confira `../03-design/00-design-system.md` para usar a cor certa da paleta da marca. Não presuma que existe um componente de UI pronto (botão, card, badge) para importar — fora o componente de toast, o shadcn/ui não está em uso; a maior parte da interface é HTML nativo estilizado com Tailwind.

## Lint

Rode `npm run lint` (ESLint com a configuração padrão do Next.js) antes de considerar uma mudança pronta. Não há Prettier configurado — não presuma formatação automática ao salvar, a menos que seu próprio editor esteja configurado para isso individualmente.

## Convenção de commits

Veja [[03-fluxo-git]] para o padrão de mensagens de commit usado no histórico deste projeto.
