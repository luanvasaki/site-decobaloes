# Conflitos entre Especialistas

## Objetivo do documento

Definir como lidar com o momento em que duas Skills de domínios diferentes chegam a recomendações incompatíveis para a mesma tarefa — para que o conflito seja resolvido de forma previsível, ou corretamente escalado quando não há uma resposta objetiva.

## Quando deve ser utilizado

Consulte sempre que uma tarefa envolver mais de uma Skill de Domínio (diretamente ou através de uma Skill de Processo orquestradora) e as recomendações resultantes não coincidirem.

## Documentos referenciados

- [[00-visao-arquitetura-skills]]
- [[02-composicao-entre-skills]] — o papel do orquestrador, também responsável pela mediação inicial de um conflito
- [[04-sobreposicao-e-limites]] — conflitos costumam surgir exatamente nas fronteiras já mapeadas ali
- [[06-registro-de-decisoes]] — todo conflito resolvido é candidato a virar um registro permanente

---

## Cenário típico

Duas Skills especialistas, cada uma competente dentro do seu próprio domínio, chegam a recomendações que não podem coexistir para a mesma tarefa — por exemplo, uma Skill de Performance recomenda remover uma animação para reduzir peso de JavaScript, enquanto uma Skill de Design recomenda mantê-la porque faz parte da identidade visual da marca. As duas estão certas dentro do próprio domínio; o conflito é entre domínios, não um erro de uma das duas.

## Regra número um: o conflito deve ser tornado visível

Nunca resolver um conflito escolhendo silenciosamente um lado e seguindo em frente como se não houvesse outra posição válida. A existência do conflito — as duas posições, com seus respectivos motivos — deve aparecer explicitamente no resultado apresentado, mesmo quando uma ordem de precedência (abaixo) permite um desempate objetivo.

## Ordem de precedência para desempates objetivos

Quando existe uma hierarquia clara de qual tipo de preocupação deveria vencer em caso de incompatibilidade real (não apenas preferência), a ordem proposta é:

1. **Segurança** — nunca cede espaço para nenhuma outra preocupação.
2. **Integridade de dados e regras de negócio** — um conflito que arriscaria dados incorretos ou uma regra de negócio violada vence sobre preocupações técnicas ou visuais.
3. **Funcionamento correto** — a tarefa precisa funcionar antes de ser otimizada ou embelezada.
4. **Performance** — depois de garantir segurança, integridade e funcionamento, performance tem precedência sobre estética.
5. **Estética/preferência visual** — o nível mais baixo da hierarquia, cedendo a todos os anteriores em caso de conflito real.

**Importante**: essa ordem resolve o desempate técnico de qual ação tomar, mas não anula nem invalida a posição da Skill que "perdeu" o desempate — a recomendação dela continua registrada como parte do histórico da decisão (ver [[06-registro-de-decisoes]]), para o caso de as circunstâncias mudarem no futuro (ex. a restrição de performance que motivou a escolha deixar de existir).

## Quando a precedência não resolve

Nem todo conflito tem um vencedor objetivo pela hierarquia acima — por exemplo, um conflito entre Design e Negócio sobre uma decisão de experiência que afeta conversão não tem uma resposta técnica certa, é uma escolha de negócio genuína. Nesses casos:

- **Não existe desempate automático.**
- O conflito deve ser **escalado ao humano**, com as posições de cada Skill especialista resumidas lado a lado — não com uma Skill "escolhendo por conta própria" uma posição de negócio em nome do humano.

## O papel do orquestrador na mediação

Quando uma Skill de Processo está coordenando várias Skills de Domínio (ver [[02-composicao-entre-skills]]), ela é responsável pela primeira etapa da mediação: reunir as posições das Skills especialistas envolvidas, verificar se o conflito se encaixa na ordem de precedência objetiva acima ou não, e só então agir (se resolvível) ou escalar (se não for). O orquestrador nunca deveria inventar uma terceira posição própria — sua função é mediar entre as posições dos especialistas, não substituí-las.

## Todo conflito escalado é um registro de decisão em potencial

Um conflito que precisou ser escalado ao humano e teve uma resolução deveria, por padrão, ser considerado candidato a um registro permanente em `docs/06-knowledge/01-decisoes-tecnicas.md` (ver [[06-registro-de-decisoes]]) — a mesma discussão entre os mesmos dois domínios provavelmente vai aparecer de novo, e a resolução anterior (com seu contexto e motivo) evita repetir o debate do zero.
