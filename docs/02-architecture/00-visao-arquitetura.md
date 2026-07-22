# Visão Geral da Arquitetura

## Objetivo do documento

Dar a um(a) desenvolvedor(a) novo(a) o mapa mental completo do projeto Decobalões — como as peças se encaixam — antes de entrar nos detalhes de cada área. Este é o ponto de partida da pasta `02-architecture`.

## Quando deve ser utilizado

Leia este documento primeiro, antes de qualquer outro em `02-architecture`. Volte a ele sempre que precisar lembrar "onde fica o quê" ou "por que foi feito assim".

## Documentos referenciados

- [[01-stack-tecnologica]]
- [[05-estrutura-pastas]]
- [[06-padroes-arquiteturais]]
- [[07-fluxo-de-dados]]
- [[08-api-autenticacao]]
- [[09-uploads-imagens]]
- [[02-modelo-dados]]
- [[03-integracoes]]
- [[04-infraestrutura-deploy]]

---

## Resumo em uma frase

Uma aplicação **Next.js (App Router)** que fala **diretamente com o Supabase** (Postgres + Auth + Storage) — sem API própria, sem servidor intermediário — hospedada na **Vercel** com deploy manual.

## O quadro geral

Existem dois "lados" na mesma aplicação Next.js:

- **Site público** (`app/(public)/`): páginas majoritariamente Server Components que buscam dados através da camada `services/` e os renderizam. Sem formulários de escrita — a única ação do visitante é ser levado ao WhatsApp.
- **Painel administrativo** (`app/admin/`): protegido por login, onde a maior parte das páginas de listagem também é Server Component, mas toda a interatividade (formulários, upload, reordenação, exclusão) é feita em Client Components que conversam **diretamente com o Supabase pelo navegador** — sem passar por uma API própria do Next.js.

Não existe camada de API REST (`app/api/`) neste projeto. Em vez disso:
- **Leituras no site público e nas listagens do admin** passam pela camada `services/` (funções que rodam no servidor, dentro dos Server Components).
- **Escritas no admin** (criar/editar/excluir produto, categoria, evento, foto; reordenar galeria) são feitas pelo próprio componente client, chamando o Supabase do navegador.
- **Três exceções** usam Server Actions (`app/actions/settings.ts`): definir a foto de capa, as fotos da home e os títulos dos cards de serviço.

A segurança de quem pode escrever no banco não é decidida pelo código da aplicação — é decidida pelo **Row Level Security (RLS)** do Postgres: qualquer usuário autenticado no Supabase Auth pode escrever em qualquer tabela; visitantes anônimos só podem ler o que é público.

## Decisões arquiteturais e o porquê de cada uma

1. **Sem API REST própria** — Server Components e Server Actions leem/gravam o Supabase diretamente. Reduz uma camada inteira de código (rotas de API, serialização) em troca de acoplar a UI ao SDK do Supabase. Faz sentido para um projeto de porte pequeno/médio, com um único consumidor dos dados (o próprio site).
2. **Camada `services/` só para leitura** — toda leitura no site público e nas listagens admin passa por funções nomeadas e centralizadas (`services/products.ts`, `services/events.ts` etc.), mas as escritas ficam espalhadas dentro de cada formulário/componente admin. É uma inconsistência deliberada de baixo custo: leituras se beneficiam de reuso (a mesma consulta é usada em várias páginas), escritas são específicas de cada tela e raramente reaproveitadas.
3. **Autorização via RLS, não via papéis de aplicação** — não existe conceito de "papel" (admin/editor/vendedor) no código; qualquer login válido no Supabase Auth é tratado como administrador com acesso total. Reflete a realidade do negócio: uma única operadora (Miriam) usa o painel.
4. **Um único banco Supabase para dev, preview e produção** — não há separação de ambientes. Isso significa que testar localmente grava dados reais. É uma decisão pragmática de custo/simplicidade para um projeto pequeno, mas exige cuidado redobrado ao mexer em dados durante o desenvolvimento (ver [[04-infraestrutura-deploy]]).
5. **Deploy manual via Vercel CLI, sem CI/CD** — não existe pipeline automático (sem GitHub Actions, sem `vercel.json`/`vercel.ts` de configuração de build). Um `git push` sozinho não publica nada; é preciso rodar o comando de deploy manualmente. Mais simples de operar a um custo de nenhuma verificação automática antes de publicar.
6. **Sem gerenciador de estado global e sem React Context** — todo estado é local a cada componente (`useState`), e a sincronização entre páginas depois de uma escrita é feita chamando `router.refresh()` (recarrega os dados dos Server Components da rota atual) ou `revalidatePath()` (nas Server Actions). Simplicidade em vez de uma camada de cache/estado compartilhado.
7. **Uso parcial do shadcn/ui** — o projeto está configurado para shadcn/ui e tem várias dependências Radix instaladas, mas, na prática, só o componente de toast é usado; todo o resto da interface é Tailwind CSS "na mão", sem biblioteca de componentes. Um desenvolvedor não deve presumir que existe um design system de componentes prontos além do toast.
8. **Sem testes automatizados** — não há framework de testes configurado no projeto. Validação de mudanças depende de teste manual.

## Princípios observados no código

- **Server-first**: por padrão uma página é Server Component; um componente só vira Client Component quando realmente precisa de interatividade, estado local ou uma biblioteca client-only (ex.: `framer-motion`).
- **Degradação graciosa em vez de tela quebrada**: as funções de leitura em `services/` capturam erros do Supabase, registram no console e devolvem um valor "seguro" (lista vazia, `null`) em vez de deixar a exceção subir — uma falha no banco vira um estado vazio na tela, não uma página quebrada. Isso é aplicado de forma consistente em quase todo o projeto (a exceção notável é a rota de produto, que chama `notFound()` quando o slug não existe).
- **Regra de negócio centralizada em poucos pontos**: por exemplo, a regra "preço nulo exibe 'A combinar'" vive em uma única função (`formatCurrency`, em `lib/utils.ts`) e é usada por todos os lugares que mostram preço, evitando duplicar a regra.
- **Resiliência em uploads**: falhas ao enviar uma foto (rede instável, arquivo grande) não derrubam mais o salvamento do restante — cada arquivo é enviado com sua própria captura de erro, e o que falha é reportado separadamente do que teve sucesso (ver [[09-uploads-imagens]]).

## Limitações conhecidas da arquitetura atual

Não são "bugs" a corrigir às pressas, mas pontos que um novo desenvolvedor deve conhecer antes de propor mudanças:

- Sem separação de ambiente de banco entre dev/preview/produção.
- Sem CI/CD — nada impede um deploy manual com erros não detectados.
- Sem verificação de papel/permissão além de "está logado ou não".
- Validação de upload (tamanho/tipo de arquivo) só existe no navegador, não no servidor/Storage.
- Não há cache/ISR — todas as rotas dinâmicas usam `force-dynamic`, então toda visita busca dados frescos no banco a cada requisição.
- Existe uma tabela (`rentals`) e alguns componentes de UI (`AboutSection`, `CategoryPreview`, `FeaturedProducts`, `PhotoGallery` em `components/home/`) que não são usados em lugar nenhum do código atual — código morto/preparado para o futuro que ainda não foi conectado.
