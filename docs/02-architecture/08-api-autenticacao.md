# API e Autenticação

## Objetivo do documento

Explicar como os dados são acessados (já que não existe uma API própria no formato tradicional) e como funciona o login/proteção do painel administrativo.

## Quando deve ser utilizado

Consulte ao investigar um problema de acesso negado, ao adicionar uma rota nova que precise de proteção, ou para entender por que uma chamada de dados não passa por uma rota `/api/`.

## Documentos referenciados

- [[00-visao-arquitetura]]
- [[02-modelo-dados]] — as políticas de segurança (RLS) que na prática decidem quem pode escrever o quê
- [[07-fluxo-de-dados]]

---

## Não existe uma API REST própria

O projeto **não tem** uma pasta `app/api/` nem nenhuma rota de API do Next.js. Isso é uma decisão deliberada, não uma lacuna: como só existe um consumidor dos dados (o próprio site), não há necessidade de expor endpoints HTTP próprios. Em vez disso, existem três formas de acessar dados:

1. **Leitura no servidor** — dentro de Server Components, chamando funções da camada `services/`, que por sua vez chamam o Supabase usando um cliente que roda no servidor.
2. **Escrita a partir do navegador** — dentro de componentes marcados como client, chamando o Supabase diretamente usando um cliente que roda no navegador. Não existe uma rota de API no meio do caminho — o navegador conversa diretamente com o banco de dados hospedado no Supabase.
3. **Server Actions** (usadas apenas para as configurações da home — foto de capa, fotos da página inicial, títulos dos cards de serviço) — funções que rodam no servidor mas podem ser chamadas diretamente por um botão/formulário do navegador, sem precisar definir uma rota de API para isso.

## Quem garante a segurança, já que não há uma API no meio?

A segurança de "quem pode ler/escrever o quê" é garantida pelo próprio banco de dados, através de Row Level Security (RLS) — ver [[02-modelo-dados]]. Resumo: qualquer visitante (mesmo sem login) pode ler os dados públicos (produtos, categorias, fotos, configurações); só um usuário autenticado no Supabase Auth pode escrever em qualquer tabela. Não existem papéis diferentes — um único nível de "autenticado" cobre todo o painel administrativo.

## Autenticação: Supabase Auth com e-mail e senha

O login do admin usa o Supabase Auth no modo mais simples: e-mail e senha (não há login social, link mágico ou autenticação em duas etapas). Não existe fluxo de cadastro dentro do site — uma conta de administrador só pode ser criada diretamente no painel do Supabase, fora da aplicação.

### Como a sessão é mantida

A sessão do usuário logado é guardada em cookies (usando o pacote `@supabase/ssr`), o que permite que tanto o navegador quanto o servidor (dentro de Server Components e do middleware) saibam se há alguém autenticado.

Existem três formas diferentes de "cliente" Supabase no código, cada uma para um contexto:
- Um cliente para o **navegador** (usado pelos formulários e telas interativas do admin).
- Um cliente para o **servidor** (usado pelas páginas Server Component e pelo middleware, lê a sessão a partir dos cookies da requisição).
- Um cliente **público**, sem sessão, usado em alguns pontos específicos de leitura que não precisam saber se há alguém logado.

### Como a proteção das rotas `/admin/*` funciona

Há um único arquivo de middleware na raiz do projeto, configurado para interceptar todas as rotas que começam com `/admin`. A cada requisição a essa área, o middleware verifica se existe uma sessão válida:
- Se **não** houver sessão e a rota não for a própria página de login, o visitante é redirecionado para `/admin/login`.
- Se **houver** sessão e o visitante tentar acessar a página de login, ele é redirecionado direto para o painel (`/admin`).

Essa verificação do middleware é a **única** camada de proteção de rota — as páginas dentro de `app/admin/` não fazem sua própria checagem de autenticação; elas confiam inteiramente que, se chegaram a ser renderizadas, é porque o middleware já validou a sessão.

### Login e logout

A tela de login valida o formato do e-mail e o tamanho mínimo da senha antes de tentar autenticar; em caso de falha, mostra sempre a mesma mensagem genérica ("E-mail ou senha incorretos"), sem revelar se o problema foi o e-mail ou a senha — uma prática comum de segurança para não facilitar tentativas de adivinhação. Após um login bem-sucedido, o visitante é enviado para o painel principal. O logout (disponível no menu lateral e no menu mobile) encerra a sessão e volta para a tela de login.

## Uma chave "reservada" que não está em uso

O projeto documenta, no exemplo de variáveis de ambiente, uma chave de acesso privilegiado do Supabase (`SUPABASE_SERVICE_ROLE_KEY`) que ignoraria as políticas de segurança do banco. Na prática, **essa chave não é usada em nenhum lugar do código hoje** — toda operação, incluindo as escritas do admin, usa a chave pública/anônima e depende inteiramente das políticas de RLS para autorização. Isso é importante para um novo desenvolvedor saber: não existe, hoje, nenhum caminho no código que "passe por cima" das regras de segurança do banco.
