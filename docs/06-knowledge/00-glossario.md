# Glossário

## Objetivo do documento

Definir, em um só lugar, os termos de negócio e os termos técnicos usados ao longo de toda a documentação do projeto — para que ninguém precise adivinhar o que significa "sinal", "slug", "RLS" ou "tema" ao ler outro documento.

## Quando deve ser utilizado

Consulte sempre que encontrar um termo desconhecido em qualquer outro documento desta pasta `docs/`, ou ao escrever uma documentação nova, para usar a mesma palavra que o resto do projeto já usa.

## Documentos referenciados

- `../00-vision/00-visao-geral.md`
- `../02-architecture/00-visao-arquitetura.md`
- [[01-decisoes-tecnicas]]

---

## Termos de negócio

**A combinar** — texto exibido no lugar do preço quando um produto não tem um valor fixo cadastrado. Reflete a realidade do negócio: alguns orçamentos dependem de detalhes que só aparecem numa conversa.

**Categoria** — classificação usada tanto para produtos do catálogo quanto para o tipo de um evento (ex.: Casamentos, Aniversários, Festa Infantil, Chá de Bebê). Uma única tabela de categorias serve aos dois usos.

**Decoração** (tipo de produto) — um dos dois tipos de item do catálogo: uma montagem de decoração para um evento, com paleta de cores e porte de evento (pequeno/médio/grande), podendo incluir montagem e desmontagem no serviço.

**Evento** — um orçamento ou festa contratada, registrado no painel administrativo. Percorre um ciclo de vida de 5 status possíveis (ver "Status do evento" abaixo).

**Material** (tipo de produto) — o outro tipo de item do catálogo: um item físico avulso disponível para locação (ex. mobiliário), com dimensões e controle de quantidade em estoque.

**Orçamento** — o primeiro status de um evento no ciclo de vida, antes de qualquer confirmação; também usado no sentido comum de "valor estimado combinado com o cliente".

**Sinal** (ou entrada) — valor pago antecipadamente pelo cliente para confirmar um evento, registrado com o próprio valor e a data do pagamento.

**Status de pagamento** — campo independente do status do evento, com três valores possíveis: Pendente, Parcial ou Pago.

**Status do evento** — o estágio operacional de um evento, com cinco valores possíveis: Orçamento → Confirmado → Em andamento → Concluído, ou Cancelado (a partir de qualquer ponto).

**Tema** — agrupamento usado no Catálogo e na Galeria do site público para organizar decorações por tipo de festa (Casamentos, Aniversários, Festa Infantil, Chá de Bebê). É um conceito fixo no código da aplicação, distinto (mas relacionado) das categorias cadastradas no banco de dados.

## Termos técnicos

**Admin / Painel administrativo** — a área interna do site (rotas que começam em `/admin`), protegida por login, usada pela equipe para gerenciar produtos, categorias, galeria e eventos.

**App Router** — o sistema de rotas do Next.js usado neste projeto, baseado na estrutura de pastas dentro de `app/`.

**Client Component** — um componente React que roda no navegador do visitante, usado quando é preciso interatividade, estado local ou animação. Contrasta com Server Component.

**Middleware** — o arquivo `middleware.ts` na raiz do projeto, responsável por verificar se há um usuário autenticado antes de liberar o acesso a qualquer rota `/admin/*`.

**RLS (Row Level Security)** — o mecanismo de segurança do banco de dados Postgres/Supabase que decide quem pode ler ou escrever em cada tabela. Neste projeto, é a verdadeira camada de autorização — não existe verificação de permissão no código da aplicação além de "está autenticado ou não".

**Server Action** — uma função que roda no servidor mas pode ser chamada diretamente por um componente do navegador, sem precisar de uma rota de API. Usada neste projeto apenas para as configurações da home (foto de capa, fotos da página inicial, títulos dos cards de serviço).

**Server Component** — o tipo padrão de componente neste projeto: roda no servidor, pode buscar dados diretamente, e nunca envia código JavaScript de interatividade para o navegador.

**Serviço / camada de serviço (`services/`)** — pasta com funções que buscam dados do Supabase para uso pelas páginas (Server Components). Usada quase exclusivamente para leitura, não para escrita.

**Slug** — identificador de texto amigável usado nas URLs (ex. `/produto/decoracao-casamento-rustico`), gerado automaticamente a partir do nome de um produto ou categoria.

**Supabase** — o serviço de terceiros usado como banco de dados (Postgres), autenticação e armazenamento de arquivos deste projeto.

**Vercel** — a plataforma de hospedagem do site; o deploy é feito manualmente por linha de comando, sem integração automática com o repositório de código.
