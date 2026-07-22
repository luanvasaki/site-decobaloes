# Template Oficial de Skill

## Objetivo do documento

Fornecer o modelo único e obrigatório que toda Skill futura deste projeto deve seguir — para que qualquer Skill, não importa quem a escreva ou quando, tenha a mesma estrutura, a mesma profundidade de definição, e se encaixe automaticamente nas regras já estabelecidas no restante de `docs/08-skills/`.

## Quando deve ser utilizado

Use este template como ponto de partida **sempre** que uma Skill nova for criada — copie a estrutura completa e preencha cada seção antes de considerar a Skill pronta. Também consulte ao revisar se uma Skill já existente está de acordo com o padrão.

## Documentos referenciados

- [[00-visao-arquitetura-skills]]
- [[01-organizacao]] — convenção de nomenclatura e catálogo central, referenciados nas seções "Nome" e "Responsabilidades" abaixo
- [[02-composicao-entre-skills]] — base das seções "Quais Skills pode chamar" e "Quais Skills podem chamá-la"
- [[03-delegacao]] — base do "Processo de trabalho"
- [[04-sobreposicao-e-limites]] — base de "O que NÃO pode alterar"
- [[05-consulta-documentacao]] — base de "Quais documentos consulta"
- [[06-registro-de-decisoes]] — base dos "Critérios de conclusão"

---

## Regra de obrigatoriedade

Nenhuma Skill deve ser considerada pronta, nem entrar no catálogo central de Skills (ver [[01-organizacao]]), sem que **todas** as seções deste template estejam preenchidas. Uma seção deixada em branco não significa "não se aplica" — se genuinamente não se aplicar, a seção deve dizer isso explicitamente (ex. "Esta Skill não chama nenhuma outra Skill hoje"), nunca ser omitida silenciosamente.

---

# TEMPLATE — copiar a partir daqui

```
# Skill: [nome-da-skill]

## Nome

[nome-da-skill em kebab-case, seguindo a convenção domínio+ação de docs/08-skills/01-organizacao.md]

Categoria: [Skill de Domínio | Skill de Processo | Skill Utilitária]
Domínio dono: [um único domínio — Produto | Arquitetura | Design | Desenvolvimento | Negócio | Auditoria | outro]

## Objetivo

[Uma ou duas frases descrevendo o propósito desta Skill — que tarefa recorrente ela resolve, e para quem. Deve ser específico o suficiente para que alguém saiba, só lendo isto, se esta é a Skill certa para uma tarefa dada.]

## Responsabilidades

[Lista do que esta Skill efetivamente faz — as tarefas fim que ela executa. Deve estar alinhada a um único domínio dono (docs/08-skills/04-sobreposicao-e-limites.md) e não invadir a responsabilidade de nenhuma outra Skill já registrada no catálogo central.]

- [Responsabilidade 1]
- [Responsabilidade 2]
- [...]

## O que pode alterar

[Lista explícita e concreta do que esta Skill tem permissão de criar, editar ou excluir — arquivos, tipos de dado, documentos. Sem generalidades como "o necessário"; se a Skill mexe em código, dizer em quais pastas; se mexe em dados, dizer em quais tabelas/entidades; se mexe em documentação, dizer em quais arquivos de docs/.]

- [Permissão 1]
- [Permissão 2]
- [...]

## O que NÃO pode alterar

[Seção obrigatória por docs/08-skills/04-sobreposicao-e-limites.md — a lista do que está fora de escopo, com ênfase no que poderia *parecer* relacionado o suficiente para ser alterado "de passagem", mas não deve. Inclui explicitamente qualquer ação de alto risco (deploy, exclusão em massa, mudança de schema) que não seja a responsabilidade central desta Skill.]

- [Fora de escopo 1]
- [Fora de escopo 2]
- [...]

## Quais documentos consulta

[Segue a tabela de autoridade documental de docs/08-skills/05-consulta-documentacao.md. Listar a documentação primária (o domínio dono desta Skill) e a consulta obrigatória adicional (docs/06-knowledge/, sempre).]

- Documentação primária: [ex. docs/0X-dominio/]
- Consulta obrigatória adicional: docs/06-knowledge/00-glossario.md, docs/06-knowledge/01-decisoes-tecnicas.md, docs/06-knowledge/04-decisoes-futuras.md
- Outras consultas relevantes: [se houver]

## Quais Skills pode chamar

[Lista fechada — só Skills já existentes no catálogo central, seguindo docs/08-skills/02-composicao-entre-skills.md. Se esta lista incluir outra Skill, o contrato de entrada/saída dessa Skill chamada deve ser respeitado sem reimplementar sua lógica. Verificar, antes de preencher, que nenhum ciclo é criado (se a Skill X está aqui, esta Skill não pode aparecer na lista de "Skills que X pode chamar").]

- [Skill relacionada 1] — quando: [em que situação esta Skill a invoca]
- [Skill relacionada 2] — quando: [...]
- (ou) "Esta Skill não chama nenhuma outra Skill hoje."

## Quais Skills podem chamá-la

[O inverso da seção anterior — mantido para que o catálogo central consiga montar o grafo completo de composição e verificar ausência de ciclos. Deve ser atualizado sempre que uma Skill nova declarar esta Skill em sua própria lista de "Quais Skills pode chamar".]

- [Skill chamadora 1]
- [Skill chamadora 2]
- (ou) "Nenhuma Skill chama esta hoje."

## Processo de trabalho

[Passo a passo de como esta Skill executa uma tarefa típica, do início ao fim. Deve incluir, no mínimo:]

1. Ler a documentação relevante (ordem recomendada em docs/08-skills/05-consulta-documentacao.md).
2. Verificar se a tarefa está dentro do escopo desta Skill (seções "Responsabilidades" e "O que NÃO pode alterar" acima) — se não estiver, seguir o processo de delegação (docs/08-skills/03-delegacao.md) em vez de continuar.
3. [Passos específicos do trabalho fim desta Skill.]
4. Se uma decisão não trivial precisar ser tomada durante a execução, registrá-la (docs/08-skills/06-registro-de-decisoes.md).
5. Se um conflito com outra Skill/especialista surgir, seguir docs/08-skills/07-conflitos-entre-especialistas.md.
6. Verificar os critérios de conclusão (abaixo) antes de considerar a tarefa terminada.

## Checklist

[Lista de verificação objetiva a ser conferida antes de entregar o resultado desta Skill — específica do domínio dela, no mesmo espírito dos checklists já usados em docs/04-development/07-checklists.md.]

- [ ] [Item de verificação 1]
- [ ] [Item de verificação 2]
- [ ] [...]
- [ ] Nenhuma ação fora da lista de "O que pode alterar" foi executada.
- [ ] Toda decisão não trivial tomada durante a execução foi registrada.

## Critérios de conclusão

[Definição objetiva de quando esta Skill considera uma tarefa terminada — não "parece pronto", mas condições verificáveis.]

- [Critério 1]
- [Critério 2]
- [...]
- O resultado foi comunicado de forma que quem pediu a tarefa entenda o que foi feito, o que não foi feito (e por quê, se aplicável), e qualquer decisão relevante tomada no caminho.

## Exemplos de uso

[Pelo menos dois exemplos concretos e realistas de quando esta Skill deveria ser usada — e, se fizer sentido, um exemplo de uma tarefa parecida que **não** deveria acionar esta Skill, para reforçar os limites de escopo.]

**Exemplo 1**: [situação] → esta Skill [ação esperada].
**Exemplo 2**: [situação] → esta Skill [ação esperada].
**Contraexemplo**: [situação parecida, mas fora de escopo] → esta Skill deveria delegar para [outra Skill] ou escalar ao humano, não agir diretamente.

## Limitações

[Restrições conhecidas desta Skill que não são "fora de escopo" por decisão deliberada, mas sim limites práticos ou técnicos — coisas que ela não consegue garantir, situações em que seu resultado deve ser conferido manualmente, dependências de que a documentação esteja atualizada, etc.]

- [Limitação 1]
- [Limitação 2]
- [...]
```

---

## Checklist de conformidade do template (para quem revisa uma Skill nova)

Antes de aceitar uma Skill nova no catálogo central, confirmar:

- [ ] Todas as 13 seções do template estão presentes e preenchidas (nenhuma omitida).
- [ ] O domínio dono declarado não colide com o de nenhuma Skill já existente (ver [[04-sobreposicao-e-limites]]).
- [ ] A lista de "Quais Skills pode chamar" não cria nenhum ciclo no grafo de composição (ver [[02-composicao-entre-skills]]).
- [ ] "O que NÃO pode alterar" cobre explicitamente qualquer ação de alto risco adjacente ao domínio da Skill.
- [ ] A documentação listada em "Quais documentos consulta" bate com o mapeamento oficial em [[05-consulta-documentacao]].
- [ ] O catálogo central foi atualizado com esta Skill nova (nome, domínio, escopo resumido, Skills relacionadas) — ver [[01-organizacao]].
