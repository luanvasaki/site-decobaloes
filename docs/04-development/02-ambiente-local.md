# Ambiente Local

## Objetivo do documento

Explicar passo a passo como colocar o projeto para rodar em uma máquina nova, e os cuidados específicos deste projeto ao desenvolver localmente.

## Quando deve ser utilizado

Consulte na primeira vez que for configurar o projeto em uma máquina, ou sempre que precisar lembrar quais variáveis de ambiente são necessárias.

## Documentos referenciados

- [[00-guia-desenvolvimento]]
- `../02-architecture/04-infraestrutura-deploy.md` — detalhe técnico completo de variáveis de ambiente e do banco compartilhado
- `../02-architecture/08-api-autenticacao.md` — como funciona o login, necessário para acessar o admin localmente

---

## Pré-requisitos

- **Node.js** — o projeto não trava uma versão específica (não há `.nvmrc` nem campo `engines` no `package.json`), então use uma versão recente com suporte a Next.js 15 (Node 18 ou mais novo).
- **npm** — é o gerenciador de pacotes usado pelo projeto (existe `package-lock.json`; não use `yarn` nem `pnpm` para não gerar um lockfile conflitante).
- Acesso às credenciais do projeto Supabase (URL e chave anônima) — peça a quem já tem acesso ao projeto, já que são as mesmas credenciais usadas em produção (ver aviso abaixo).

## Passo a passo

1. Clone o repositório.
2. Rode a instalação de dependências (`npm install`).
3. Crie um arquivo de variáveis de ambiente local a partir do exemplo (`.env.local.example` → `.env.local`) e preencha com as credenciais reais do Supabase.
4. Rode o servidor de desenvolvimento (`npm run dev`).
5. Acesse o site público na raiz, e o painel administrativo em `/admin/login`.

## Variáveis de ambiente necessárias

| Variável | Obrigatória para rodar localmente? | Observação |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | Endereço do projeto Supabase — o mesmo usado em produção. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Chave pública do Supabase — usada tanto para leitura pública quanto para as escritas do admin (a autorização real é decidida pelas políticas de segurança do banco, não por uma chave privilegiada). |
| `SUPABASE_SERVICE_ROLE_KEY` | Não | Documentada no exemplo, mas não é lida em nenhum lugar do código hoje — pode deixar vazia. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Recomendada | Sem ela, o código usa um número de exemplo como reserva — para testar o fluxo de WhatsApp de verdade, defina o número real. |
| `NEXT_PUBLIC_SITE_URL` | Recomendada | Usada para gerar SEO/sitemap; tem um valor de reserva no código se não for definida. |
| `NEXT_PUBLIC_SITE_NAME` | Não | Documentada no exemplo, mas não é lida em nenhum lugar do código hoje. |

## Acessando o painel administrativo localmente

Não existe cadastro pelo próprio site — uma conta de administrador só pode ser criada diretamente no painel do Supabase (fora da aplicação). Use uma conta já existente, ou peça para alguém com acesso ao Supabase criar uma para você. Depois de logado, o acesso ao `/admin` funciona localmente exatamente como em produção — porque, na prática, é o mesmo banco.

## Aviso crítico — banco de dados compartilhado

**Não existe separação entre o banco de desenvolvimento, o de preview e o de produção.** As credenciais do Supabase que você coloca no seu `.env.local` são as mesmas usadas pelo site real. Isso significa, na prática:

- Um produto, categoria, evento ou foto que você criar "só para testar" localmente **aparece no site público de verdade** imediatamente.
- Excluir algo localmente **exclui de verdade**, sem chance de desfazer.
- Rodar qualquer rotina de teste em massa (por exemplo, um script que cria vários registros para popular a tela) impacta os dados reais da empresa.

Recomendação prática: ao testar uma funcionalidade que grava dados, use nomes claramente identificáveis como teste (ex. "TESTE — apagar depois") e lembre de apagar o que criou ao terminar. Nunca rode um comando de exclusão em massa sem ter certeza absoluta do que está sendo afetado.

## Rodando o build de produção localmente

Para testar o comportamento de produção antes de publicar, rode o build (`npm run build`) seguido do start (`npm run start`) — isso ainda vai usar o mesmo banco compartilhado, então o mesmo aviso acima se aplica.
