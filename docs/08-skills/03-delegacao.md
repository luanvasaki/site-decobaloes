# Delegação — Quando uma Skill Deve Parar

## Objetivo do documento

Definir critérios objetivos para o momento em que uma Skill deve interromper sua própria execução e passar a tarefa adiante — para uma outra Skill ou para o humano — em vez de continuar tentando resolver algo fora do seu escopo.

## Quando deve ser utilizado

Consulte ao desenhar o comportamento de uma Skill em situações-limite, ou ao revisar por que uma Skill continuou uma tarefa que deveria ter interrompido.

## Documentos referenciados

- [[00-visao-arquitetura-skills]]
- [[02-composicao-entre-skills]] — a diferença entre delegar para outra Skill e simplesmente invocá-la como parte do fluxo normal
- [[04-sobreposicao-e-limites]]
- [[06-registro-de-decisoes]]

---

## Critérios objetivos para parar

Uma Skill deve interromper sua execução no momento em que qualquer um destes critérios for verdadeiro — não é uma questão de julgamento subjetivo caso a caso, é uma checagem que deveria fazer parte do comportamento declarado de toda Skill:

1. **A tarefa toca uma área de documentação que não é a dona declarada da Skill atual** (ver a tabela de domínios em [[01-organizacao]]) — ex. uma Skill de Design percebe que precisaria alterar uma regra de precificação.
2. **A tarefa exige uma decisão de um tipo diferente do que a Skill foi desenhada para tomar** — uma Skill técnica se deparando com uma decisão de negócio (ou o contrário) deve parar, mesmo que tecnicamente "consiga" prosseguir.
3. **A tarefa exige uma ação de alto risco ou irreversível fora do escopo original da Skill** — ex. uma exclusão de dados em massa, um deploy de produção, uma mudança de schema de banco — essas ações pertencem a um processo/Skill específico (ver os checklists em `docs/04-development/07-checklists.md` como exemplo de processo já formalizado) e não deveriam ser "só mais um passo" dentro de uma Skill de Domínio não relacionada.
4. **A Skill encontra uma pergunta já registrada como decisão futura em aberto** (`docs/06-knowledge/04-decisoes-futuras.md`) — isso é, por definição, uma pergunta que já foi identificada como precisando de uma decisão consciente, não algo para resolver de passagem dentro de outra tarefa.
5. **A Skill encontra uma contradição entre a documentação e o comportamento real do código/produto** — não é papel de nenhuma Skill decidir sozinha qual das duas fontes está certa; isso é sinal de parar e registrar a divergência (ver [[06-registro-de-decisoes]]).

## O que "delegar" significa na prática

Delegar não é "tentar até quase terminar e então perguntar" — é parar assim que um critério acima é identificado, declarar explicitamente **qual critério foi acionado** (não só "não consigo continuar"), e então: invocar a Skill correta (se o caso for de domínio, seguindo [[02-composicao-entre-skills]]) ou escalar diretamente ao humano (se o caso for de decisão de negócio, ação de alto risco, ou pergunta em aberto).

## Delegar para outra Skill vs. escalar para o humano

Nem toda interrupção deveria virar uma chamada a outra Skill — alguns casos devem ir direto ao humano, sem tentar primeiro passar para outro especialista automatizado:

| Situação | Ação correta |
|---|---|
| Tarefa toca outro domínio técnico/de produto/design já coberto por uma Skill existente | Delegar para a Skill correspondente |
| Tarefa exige uma decisão de negócio sem regra clara já documentada | Escalar direto ao humano — nenhuma Skill deveria "decidir por" o negócio |
| Ação de alto risco/irreversível | Escalar direto ao humano, mesmo que uma Skill de Processo formalmente cubra o fluxo — a autorização final para uma ação irreversível não deveria ser automática |
| Pergunta já registrada como decisão futura em aberto | Escalar direto ao humano, citando o item correspondente em `docs/06-knowledge/04-decisoes-futuras.md` |
| Contradição entre documentação e comportamento real | Registrar a divergência (ver [[06-registro-de-decisoes]]) e escalar ao humano antes de agir com base em qualquer uma das duas versões |

## Sinal de alerta no meio da execução, não só no início

O critério de parar não se aplica só antes de começar uma tarefa — uma Skill pode começar dentro do seu escopo e, no meio do caminho, esbarrar em um dos critérios acima (ex. ao cadastrar um produto, perceber que precisaria mudar a regra de "A combinar"). Nesse caso, o comportamento correto é parar exatamente naquele ponto, preservar o que já foi feito de forma segura (sem deixar um estado incompleto silencioso), e delegar/escalar a partir dali — não desfazer o trabalho já correto só porque uma parte da tarefa saiu do escopo.
