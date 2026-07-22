# Guia de Desenvolvimento

## Objetivo do documento

Ser o ponto de partida de qualquer pessoa que vá escrever código neste projeto — o que fazer antes de abrir o editor, e para onde ir em seguida.

## Quando deve ser utilizado

Leia este documento primeiro, antes dos demais desta pasta.

## Documentos referenciados

- [[02-ambiente-local]] — como rodar o projeto na sua máquina
- [[01-padroes-codigo]] — padrões gerais de código (onde colocar arquivos, Server vs. Client Component, tratamento de erro)
- [[05-convencoes-tecnicas]] — convenções detalhadas de componentes, TypeScript, React, Next.js, Tailwind e nomenclatura
- [[06-performance-boas-praticas]] — como não degradar a performance e boas práticas gerais
- [[03-fluxo-git]] — como versionar e publicar uma mudança (commits, branches, deploy)
- [[07-checklists]] — checklists antes de Pull Request, Merge e Release
- [[04-testes]] — o que existe (e o que não existe) de testes automatizados
- `../02-architecture/00-visao-arquitetura.md` — o mapa técnico completo do projeto

---

## Antes de começar

Este projeto (Decobalões) é pequeno, sem equipe de desenvolvimento dedicada, sem testes automatizados e sem pipeline de deploy automático. Isso muda como você deve trabalhar nele: mais cautela manual, menos rede de segurança automatizada. O ponto mais importante para internalizar antes de qualquer coisa:

> **O ambiente de desenvolvimento local usa o mesmo banco de dados que a produção.** Não existe um banco separado para testar. Qualquer produto, evento ou foto criada "só para testar" localmente aparece no site real, e qualquer exclusão feita localmente apaga de verdade. Veja [[02-ambiente-local]] para o detalhe completo.

## Ordem recomendada de leitura

1. **[[02-ambiente-local]]** — configure o projeto na sua máquina primeiro.
2. **`../02-architecture/00-visao-arquitetura.md`** — entenda o mapa geral (stack, pastas, padrões) antes de tocar em qualquer arquivo.
3. **[[01-padroes-codigo]]** e **[[05-convencoes-tecnicas]]** — como o código deste projeto é escrito, para que sua contribuição pareça "do mesmo autor" que o resto.
4. **[[06-performance-boas-praticas]]** — o que ter em mente para não degradar a performance ao escrever código novo.
5. **[[03-fluxo-git]]** — como commitar e como publicar (são processos distintos e manuais neste projeto).
6. **[[07-checklists]]** — use antes de abrir PR, mesclar e publicar qualquer mudança.
7. **[[04-testes]]** — o que fazer, já que não há testes automatizados, para verificar que sua mudança não quebrou nada.

## Resumo do que este projeto é (para quem nunca viu)

Um site Next.js (App Router) com um catálogo público de decorações de festa e um painel administrativo interno, ambos conversando diretamente com um banco de dados Supabase — sem API própria no meio. Hospedado na Vercel, com deploy manual via linha de comando (dar `git push` não publica nada sozinho). Para o contexto de negócio completo, veja a pasta `../00-vision/`; para as páginas do sistema, `../01-product/`; para a arquitetura técnica completa, `../02-architecture/`.

## Regra de ouro deste projeto

Como não há testes automatizados nem ambiente de banco isolado, a disciplina manual substitui a automação: teste suas mudanças rodando o site localmente antes de considerar qualquer tarefa concluída, e tenha cuidado redobrado com qualquer ação de exclusão ou edição em massa mesmo em desenvolvimento.
