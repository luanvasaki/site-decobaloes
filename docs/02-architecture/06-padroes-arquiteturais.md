# Padrões Arquiteturais e Princípios

## Objetivo do documento

Descrever os padrões de código que se repetem pelo projeto — como as decisões de "Server vs. Client Component", validação de formulário e tratamento de erro são tomadas — para que um novo código siga a mesma linha em vez de introduzir um estilo diferente.

## Quando deve ser utilizado

Consulte antes de escrever uma página, componente ou formulário novo, para seguir o mesmo padrão do restante do projeto.

## Documentos referenciados

- [[00-visao-arquitetura]]
- [[05-estrutura-pastas]]
- [[07-fluxo-de-dados]]

---

## Server Components por padrão, Client Component só quando necessário

A maioria das páginas (`page.tsx`) é uma função assíncrona que roda no servidor e busca seus próprios dados diretamente (via `services/` ou uma chamada Supabase direta) — sem precisar de uma chamada de rede separada do navegador. A marcação `'use client'` só aparece nos componentes que realmente precisam dela: interatividade (cliques, formulários), estado local (`useState`), animação (`framer-motion`) ou uma chamada ao Supabase feita pelo navegador.

Exemplo do princípio na prática: a página de catálogo é um Server Component que busca produtos/categorias/fotos e repassa tudo como props para um único Client Component (`CatalogView`), que cuida de toda a interação (abas, tema selecionado, abrir/fechar a galeria em tela cheia) sem precisar buscar dados de novo.

Uma exceção notável: a página de galeria do admin é inteira um Client Component (a página em si, não só um pedaço dela) — porque precisa buscar fotos de categorias diferentes conforme o admin troca de aba, o que exige buscar dados a partir de uma interação do usuário.

## Server Actions — usadas com moderação

Existe apenas um arquivo de Server Actions no projeto inteiro (`app/actions/settings.ts`), com três ações: definir a foto de capa, a lista de fotos da home, e os títulos dos cards de serviço. Todas as outras operações de escrita do admin (criar/editar/excluir produto, categoria, evento, foto de galeria) **não** usam Server Actions — são feitas diretamente do componente client, chamando o Supabase do navegador. Não há uma explicação técnica funcional para essa diferença além de como o código foi evoluindo; um novo desenvolvedor não deve presumir que existe uma regra de "quando usar Server Action" além do que já está implementado.

## A camada `services/` é uma camada de leitura

Cada função em `services/` (`getProducts`, `getEvents`, `getGalleryPhotos` etc.) faz uma consulta `select` no Supabase, trata erro e devolve os dados prontos para a página usar. **Não existe o equivalente para escrita** — não há `createProduct`/`updateEvent` centralizados; cada formulário do admin monta sua própria chamada de `insert`/`update`/`delete` diretamente. Ou seja: leituras são centralizadas e reaproveitadas; escritas são específicas de cada tela.

## Padrão de validação de formulário

Todo formulário do admin segue a mesma receita: `react-hook-form` para controlar os campos, um esquema **Zod** definido localmente no próprio arquivo do formulário (não compartilhado entre telas), erros exibidos em um resumo no topo do formulário, e uma rolagem automática até o primeiro campo com erro. Campos numéricos que aceitam formato brasileiro (vírgula como separador decimal) passam por uma normalização antes de serem validados.

## Padrão de tratamento de erro

- **Leituras** (dentro de `services/`): a chamada ao Supabase é envolvida em um bloco de captura de erro; se falhar, o erro é registrado no console e a função devolve um valor "vazio e seguro" (lista vazia ou `null`) em vez de deixar o erro subir até a página. Consequência prática: uma falha no banco vira uma tela com estado vazio, não uma página quebrada.
- **Escritas** (dentro dos componentes do admin): cada chamada de escrita é envolvida em sua própria captura de erro, com uma mensagem exibida localmente naquele formulário/tela (não existe um sistema global de notificação de erro em uso).
- **Não existe uma página de erro customizada** (`error.tsx`) em nenhuma rota do projeto — só existe uma página de "não encontrado" (`not-found.tsx`), usada quando um produto ou evento buscado por identificador não existe.
- **Upload de arquivos** tem um padrão próprio, mais granular: cada arquivo é enviado com sua própria captura de erro, então uma foto que falha não impede as demais de serem enviadas nem impede o restante do formulário (produto ou evento) de ser salvo — ver [[09-uploads-imagens]].

## Comunicação entre páginas depois de uma escrita

Não existe um cache ou uma "store" compartilhada que se atualiza sozinha. Depois de uma escrita bem-sucedida, o próprio componente decide como atualizar a tela:
- A maioria dos formulários do admin chama `router.push()` (para navegar de volta à listagem) seguido de `router.refresh()`, que força o Next.js a buscar os dados de novo no servidor.
- As três Server Actions chamam `revalidatePath('/')`, que invalida o cache da página inicial no servidor.

## Sem Context, sem estado global

Não há nenhum uso de Context API do React em todo o projeto — nem para autenticação, nem para tema, nem para nenhum outro estado compartilhado. Cada componente resolve sozinho o que precisa saber (por exemplo, checar a sessão do usuário sempre que necessário, em vez de ler de um contexto de autenticação global). Isso é consistente com o princípio geral de simplicidade do projeto: menos abstração, mais código direto e local.

## Convenções de nomenclatura

- Componentes React: PascalCase, um componente por arquivo, nome do arquivo igual ao nome do componente exportado.
- Arquivos utilitários (`lib/`, `services/`): kebab-case.
- Não há arquivos "barril" (`index.ts` reexportando tudo de uma pasta) — cada import aponta diretamente para o arquivo do componente/função.

## Princípios gerais que resumem o estilo do projeto

1. **Simplicidade antes de abstração** — prefere-se repetir uma chamada Supabase em três formulários diferentes a criar uma camada extra de abstração para evitar a repetição.
2. **Servidor primeiro** — buscar dados o mais perto possível de onde a página é renderizada, evitando chamadas extras do navegador quando não é necessário.
3. **Falhar de forma silenciosa e visível ao usuário, nunca quebrar a página inteira** — erros de leitura viram estados vazios; erros de escrita/upload viram mensagens locais.
4. **Centralizar só o que é regra de negócio, não o que é implementação** — a regra "preço nulo é 'A combinar'" está em um único lugar; já as chamadas de escrita ao banco, que são implementação, ficam duplicadas por tela sem problema.
