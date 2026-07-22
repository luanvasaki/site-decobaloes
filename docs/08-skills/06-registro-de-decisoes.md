# Registro de Decisões Durante a Execução

## Objetivo do documento

Definir como uma Skill registra as decisões que toma ao longo de uma execução, conectando a arquitetura de Skills ao registro de conhecimento já existente em `docs/06-knowledge/`.

## Quando deve ser utilizado

Consulte ao desenhar o comportamento de encerramento de qualquer Skill, e ao decidir se uma decisão tomada durante uma tarefa merece virar um registro permanente.

## Documentos referenciados

- [[00-visao-arquitetura-skills]]
- `../06-knowledge/01-decisoes-tecnicas.md` — o formato ADR que todo registro permanente deve seguir
- `../06-knowledge/04-decisoes-futuras.md` — decisões em aberto que uma Skill pode encontrar, mas não deve resolver sozinha
- [[03-delegacao]]
- [[07-conflitos-entre-especialistas]]

---

## Dois níveis de decisão

Nem toda decisão tomada durante uma execução tem o mesmo peso — a arquitetura distingue dois níveis:

- **Decisão de execução**: pequena, local, específica daquela tarefa (ex. "escolhi nomear esta variável assim", "organizei esta seção nesta ordem"). Não precisa de registro permanente.
- **Decisão arquitetural/recorrente**: afeta o projeto além da tarefa atual — resolveu uma ambiguidade que provavelmente vai reaparecer, escolheu entre duas abordagens válidas de um jeito que outras Skills deveriam seguir também, ou contornou uma divergência entre documentação e código. **Esse é o tipo de decisão que alguém vai perguntar "por que foi feito assim" daqui a meses** — exatamente o problema que o registro de decisões em `docs/06-knowledge/` já existe para evitar.

## O que toda Skill deve fazer ao final de uma execução

Se a execução envolveu qualquer decisão não trivial (o segundo tipo acima), a Skill deve relatar isso explicitamente como parte do seu resultado — não deixar a decisão existir apenas implicitamente no resultado final, sem explicação. O relato mínimo inclui: qual foi a decisão, por que foi tomada daquele jeito, e quais alternativas existiam.

## Fluxo de dois passos: registro leve → promoção a registro permanente

1. **Registro leve, no momento**: toda decisão não trivial é relatada ao usuário como parte do resumo da execução da Skill. Isso é parte do trabalho considerado "terminado" — uma execução que tomou uma decisão relevante e não a relatou está incompleta.
2. **Promoção a registro permanente**: se a decisão for do tipo arquitetural/recorrente, ela deve virar uma entrada nova em `docs/06-knowledge/01-decisoes-tecnicas.md`, seguindo exatamente o mesmo formato ADR já estabelecido (Contexto / Decisão / Alternativas descartadas / Consequências / Status).

## Quem decide se um registro leve vira permanente

Qualquer Skill pode **propor** que uma decisão vire um registro permanente — mas a confirmação final cabe ao humano, seguindo a mesma lógica já usada em [[03-delegacao]]: uma Skill não decide sozinha algo que vai durar além da tarefa atual. Isso evita que o documento de decisões arquiteturais seja inflado por decisões pequenas demais para merecer esse peso, e garante que só entra ali o que de fato tem valor de ser lembrado no futuro.

## Encontrar uma decisão futura em aberto não é autorização para resolvê-la

Se, durante uma execução, uma Skill encontra uma pergunta que já está registrada em `docs/06-knowledge/04-decisoes-futuras.md`, isso não deve ser tratado como uma decisão de execução comum — aquele documento existe justamente para perguntas que exigem uma decisão consciente e humana, não uma escolha automática feita de passagem dentro de outra tarefa. O comportamento correto é parar e escalar (ver [[03-delegacao]]), citando o item correspondente.

## Conflitos resolvidos também são decisões a registrar

Quando um conflito entre Skills especialistas chega a ser escalado e resolvido (ver [[07-conflitos-entre-especialistas]]), o resultado dessa resolução é, por definição, candidato a virar um registro permanente — para que a mesma discussão não precise ser refeita do zero na próxima vez que o mesmo tipo de conflito aparecer.
