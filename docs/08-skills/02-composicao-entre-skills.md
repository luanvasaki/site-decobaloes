# Composição entre Skills — Como uma Skill Chama Outra

## Objetivo do documento

Definir o modelo de composição entre Skills — como e quando uma Skill pode invocar outra, evitando cadeias imprevisíveis ou ciclos.

## Quando deve ser utilizado

Consulte ao desenhar uma Skill que pode precisar do trabalho de outra Skill como parte do seu próprio fluxo, ou ao investigar por que uma execução passou por várias Skills em sequência.

## Documentos referenciados

- [[00-visao-arquitetura-skills]]
- [[01-organizacao]] — categorias de Skill (Domínio, Processo, Utilitária) referenciadas aqui
- [[03-delegacao]] — a diferença entre "chamar outra Skill" e "delegar/parar"
- [[07-conflitos-entre-especialistas]]

---

## Modelo geral: invocação explícita, nunca implícita

Uma Skill não "importa" outra como uma função reaproveitada silenciosamente dentro do seu próprio raciocínio — ela invoca a outra Skill de forma explícita, em um ponto declarado do seu fluxo, e trata o resultado dessa invocação como uma entrada externa, não como uma extensão do seu próprio processamento. Isso mantém rastreável, a qualquer momento, qual Skill fez o quê.

## Regra: só invocar quem está declarado como relacionado

Uma Skill só pode invocar outra Skill que já esteja listada nas suas "Skills relacionadas" declaradas (parte do que o catálogo central, descrito em [[01-organizacao]], registra). Não existe invocação "descoberta em tempo real" de uma Skill não prevista — isso mantém o comportamento de uma Skill prescritível: quem a lê sabe, de antemão, todo o conjunto de Skills que ela pode acionar.

## Padrão preferido: orquestrador + especialistas, não cadeia profunda

Quando uma tarefa precisa de mais de um domínio, o padrão recomendado é ter uma **Skill de Processo** funcionando como orquestradora — ela invoca cada **Skill de Domínio** relevante, uma de cada vez, e integra os resultados. O padrão a evitar é uma cadeia profunda (Skill A chama B, que chama C, que chama D), porque isso dificulta identificar depois onde uma decisão específica foi realmente tomada.

**Limite recomendado de profundidade**: no máximo dois níveis — um orquestrador chamando especialistas diretamente. Uma Skill de Domínio, ao perceber que precisaria acionar outra Skill de Domínio para continuar, deveria devolver o controle ao orquestrador com uma recomendação explícita ("isto também precisa da Skill de Design"), em vez de chamar a outra Skill de Domínio diretamente por conta própria.

## Contrato de entrada e saída

Toda Skill que pode ser invocada por outra deve declarar, na sua própria definição: o que ela espera receber como contexto de entrada, e o formato do que ela devolve ao final. Isso permite que quem for compor uma Skill de Processo saiba usar uma Skill de Domínio sem precisar ler as instruções internas dela — só o contrato de entrada/saída.

## Proibição de ciclos

O grafo de "quem pode chamar quem" (formado pelas listas de Skills relacionadas de cada Skill, mantidas no catálogo central) nunca pode conter um ciclo — se a Skill A pode chamar a Skill B, a Skill B não pode ter A na sua própria lista de Skills relacionadas que ela invoca. Ciclos tornam impossível prever se uma execução vai terminar, e tornam ambíguo quem é responsável pela decisão final. Ao propor uma Skill nova, verificar essa ausência de ciclo no catálogo central é parte da checagem obrigatória antes da criação.

## Skills Utilitárias como exceção controlada

Skills Utilitárias (ver [[01-organizacao]]) são a única categoria que pode ser invocada livremente por qualquer outra Skill, sem precisar estar listada individualmente como relacionada — desde que a Skill Utilitária, por definição, não tome nenhuma decisão de negócio ou técnica, apenas execute uma sub-tarefa mecânica e bem definida (ex. consultar um glossário, formatar uma saída). Essa exceção existe para não poluir toda declaração de "Skills relacionadas" com utilitários triviais — mas não se aplica a Skills de Domínio ou de Processo, que sempre precisam estar declaradas explicitamente.
