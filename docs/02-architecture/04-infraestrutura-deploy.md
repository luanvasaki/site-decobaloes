# Infraestrutura e Deploy

## Objetivo do documento

Explicar onde e como o projeto é hospedado, como um deploy é feito, e quais variáveis de ambiente ele precisa para funcionar.

## Quando deve ser utilizado

Consulte sempre antes de publicar uma alteração em produção, ou ao configurar o projeto pela primeira vez em uma máquina nova.

## Documentos referenciados

- [[00-visao-arquitetura]]
- [[08-api-autenticacao]]

---

## Hospedagem

O projeto está hospedado na **Vercel**. Existe um arquivo `.vercel/project.json` no repositório (gerado pelo comando de link da CLI) que associa a pasta local ao projeto correto na Vercel — mas esse arquivo é só metadado local, não um gatilho de deploy.

## Deploy é manual — não há CI/CD

**Um `git push` sozinho não publica nada.** Não existe nenhum arquivo de workflow de CI (não há pasta `.github/workflows/`), nem `vercel.json`/`vercel.ts` configurando build automático. O deploy é feito rodando o comando da CLI da Vercel manualmente (deploy de preview ou de produção). Isso significa que:

- Nenhum teste ou verificação automática roda antes de uma alteração ir ao ar (aliás, o projeto não tem testes automatizados de nenhum tipo).
- É responsabilidade de quem está desenvolvendo lembrar de rodar o deploy depois de mesclar/aprovar uma mudança — o GitHub e a Vercel não estão conectados por automação neste projeto.

## Build

O build usa os comandos padrão do Next.js (`next build` para gerar produção, `next start` para rodá-la) — não há configuração especial de saída, monorepo ou build customizado.

## Variáveis de ambiente

Um novo desenvolvedor precisa definir as seguintes variáveis (documentadas em `.env.local.example`) para rodar o projeto localmente:

| Variável | Para que serve |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Endereço do projeto Supabase. Usado por todos os clientes Supabase (browser, servidor e o cliente "público") e pelo middleware de autenticação. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública (anônima) do Supabase — é a única chave que a aplicação usa para conversar com o banco, tanto para leituras públicas quanto para escritas de administrador (a autorização de escrita é decidida pelas políticas RLS do banco, não por uma chave privilegiada). |
| `SUPABASE_SERVICE_ROLE_KEY` | Está documentada no arquivo de exemplo, mas **não é usada em nenhum lugar do código atual** — pode ser considerada uma variável reservada para uso futuro, não uma dependência real hoje. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp usado para montar os links de contato (`wa.me/...`). Tem um valor de fallback no código caso a variável não esteja definida. |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site, usada para gerar o `sitemap.xml`, o `robots.txt` e as tags de SEO (Open Graph). Também tem um valor de fallback no código. |
| `NEXT_PUBLIC_SITE_NAME` | Documentada no arquivo de exemplo, mas não é lida em nenhum lugar do código atual — também não está em uso real hoje. |

Além dessas, quando o projeto é vinculado à Vercel pela CLI, uma variável `VERCEL_OIDC_TOKEN` é adicionada automaticamente ao ambiente local — não precisa ser configurada manualmente.

## Um único banco para todos os ambientes

**Ponto crítico para qualquer pessoa nova no projeto**: não existem projetos Supabase separados para desenvolvimento, preview e produção. As mesmas `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` são usadas em todo lugar. Na prática, isso significa que:

- Rodar o projeto localmente (`npm run dev`) lê e grava dados no **mesmo banco que está em produção**.
- Criar um produto, evento ou foto de teste localmente aparece no site real, e apagar algo "para testar" apaga de verdade.
- Deploys de preview da Vercel também compartilham esse mesmo banco.

Ao desenvolver ou testar localmente, é preciso ter esse cuidado redobrado — não há uma rede de segurança de "banco de desenvolvimento" isolado.
