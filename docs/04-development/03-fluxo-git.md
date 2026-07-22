# Fluxo de Git e Deploy

## Objetivo do documento

Explicar como as mudanças são versionadas neste projeto (convenção de commits, uso de branches) e deixar claro que versionar uma mudança e publicá-la são dois passos manuais e separados.

## Quando deve ser utilizado

Consulte antes de criar um commit, e sempre antes de publicar uma mudança em produção.

## Documentos referenciados

- [[00-guia-desenvolvimento]]
- `../02-architecture/04-infraestrutura-deploy.md` — detalhe técnico completo do deploy manual via Vercel CLI

---

## Estratégia de branches

O histórico do projeto mostra um fluxo simples de branch única: praticamente todo o desenvolvimento acontece diretamente na branch `main` (não há evidência de um fluxo de feature branches seguido de Pull Request neste repositório). Um novo desenvolvedor não deve presumir que existe um processo formal de revisão de código via PR configurado — se a equipe quiser adotar um, isso precisa ser combinado e documentado à parte, não é o padrão atual.

## Convenção de mensagens de commit

O projeto segue um estilo próximo de "conventional commits", mas simplificado e em português — um prefixo de tipo, dois-pontos, e uma descrição curta e direta do que mudou, sempre em português. Os tipos observados no histórico do projeto, do mais para o menos frequente:

- **`fix:`** — correção de um comportamento incorreto (o tipo mais comum no histórico). Ex.: `fix: crash ao reordenar fotos da página inicial`.
- **`feat:`** — uma funcionalidade nova ou alteração de comportamento existente. Ex.: `feat: permite cadastrar produto sem preço definido (a combinar)`.
- **`debug:`** — commits temporários usados para investigar um problema em produção (ex. adicionar `console.log` ou expor uma mensagem de erro mais detalhada) — que depois são revertidos por um commit `fix:` posterior restaurando o comportamento limpo. Use esse tipo com moderação e sempre com a intenção de reverter/limpar em seguida.

Não há uso de escopo (ex. `feat(admin):`) nem de corpo de commit detalhado — as mensagens são curtas e ficam na linha de assunto.

## O que um `git push` faz — e o que ele NÃO faz

Enviar uma mudança para o repositório remoto **não publica nada no site**. Não existe integração automática entre o GitHub e a Vercel neste projeto (sem GitHub Actions, sem gatilho de deploy configurado). Publicar uma mudança é um passo manual e separado, feito rodando o comando de deploy da Vercel diretamente — veja `../02-architecture/04-infraestrutura-deploy.md` para o detalhe completo.

Consequência prática: depois de fazer commit e push de uma mudança, ela **não estará no ar** até que alguém rode o deploy manualmente. Não presuma que uma correção "já subiu" só porque foi commitada.

## Antes de publicar

Como não há verificação automática (sem CI, sem testes automatizados — ver [[04-testes]]), a checagem antes de publicar é inteiramente manual:
1. Rode o projeto localmente e teste a mudança de verdade no navegador (site público e/ou admin, conforme o que foi alterado).
2. Rode o lint (`npm run lint`).
3. Rode o build de produção localmente (`npm run build`) para garantir que não há erro de build antes de publicar — um erro de build só apareceria durante o deploy real, sem essa checagem prévia.
4. Só então rode o deploy manual.

## Lembrete sobre o banco compartilhado

Qualquer teste feito localmente antes de publicar já está mexendo no mesmo banco de dados da produção (ver [[02-ambiente-local]]) — "testar antes de publicar" neste projeto não isola os dados, só isola o código que ainda não está no ar.
