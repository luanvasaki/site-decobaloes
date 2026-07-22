# Visão Geral da Arquitetura de Skills

## Objetivo do documento

Apresentar, antes de qualquer implementação, o desenho completo de como as Skills deste projeto vão se organizar, se comunicar e se limitar entre si — o ponto de partida para quem for ler o restante da pasta `docs/08-skills/`.

## Quando deve ser utilizado

Leia este documento primeiro, antes dos demais desta pasta. Volte a ele sempre que for avaliar se uma Skill nova se encaixa na arquitetura já pensada, antes de propor sua criação.

## Documentos referenciados

- [[01-organizacao]]
- [[02-composicao-entre-skills]]
- [[03-delegacao]]
- [[04-sobreposicao-e-limites]]
- [[05-consulta-documentacao]]
- [[06-registro-de-decisoes]]
- [[07-conflitos-entre-especialistas]]
- [[08-template-oficial-de-skill]] — o modelo obrigatório que toda Skill futura deve seguir
- [[09-catalogo-de-skills]] — o índice vivo de toda Skill já criada
- `../06-knowledge/01-decisoes-tecnicas.md` — o registro de decisões que esta arquitetura vai alimentar

---

## O que é uma Skill, neste projeto

Uma Skill é um conjunto empacotado de instruções — o equivalente a um "especialista" com escopo declarado, que sabe como executar um tipo específico de tarefa dentro deste projeto (ex. cadastrar um produto seguindo todas as regras de negócio, revisar uma tela contra o design system, preparar um release seguindo os checklists). Uma Skill não é um agente genérico — quanto mais restrito e explícito o escopo, mais confiável ela é.

## Por que desenhar a arquitetura antes de criar qualquer Skill

Este projeto acabou de passar por um esforço grande de documentação (pasta `docs/`, 8 áreas cobertas) justamente para que decisões, regras e contexto parem de depender da memória de uma única pessoa. Criar Skills sem uma arquitetura prévia repetiria o mesmo problema em uma camada nova: Skills se sobrepondo, decisões tomadas durante execuções não registradas em lugar nenhum, especialistas conflitando sem um jeito claro de resolver, e ninguém sabendo mais "por que a Skill X faz as coisas assim" daqui a alguns meses — o mesmo problema que a pasta `docs/` inteira já existe para evitar. Esta arquitetura aplica os mesmos princípios de documentação viva a um sistema de Skills, antes de qualquer Skill existir.

## Princípios gerais da arquitetura

1. **Cada Skill tem exatamente um domínio dono** — nunca duas Skills competindo pelo mesmo espaço de responsabilidade (ver [[04-sobreposicao-e-limites]]).
2. **A documentação em `docs/` é a fonte de verdade** — nenhuma Skill deve confiar em conhecimento memorizado sobre o projeto; toda Skill relê a documentação relevante a cada execução (ver [[05-consulta-documentacao]]).
3. **Nenhuma Skill decide sozinha algo fora do seu domínio** — o critério de quando parar e passar adiante é explícito, não uma questão de julgamento caso a caso (ver [[03-delegacao]]).
4. **Toda decisão não trivial tomada durante uma execução é registrada** — a arquitetura de Skills se conecta diretamente ao registro de decisões já existente em `docs/06-knowledge/` (ver [[06-registro-de-decisoes]]).
5. **Conflito entre especialistas é tornado visível, nunca resolvido silenciosamente** — existe uma ordem de precedência para os casos objetivos, e escalada ao humano para os que não têm um vencedor claro (ver [[07-conflitos-entre-especialistas]]).
6. **Composição entre Skills é explícita e rasa** — uma Skill só invoca outra que declarou estar disponível para isso, e a arquitetura evita cadeias profundas de delegação que dificultem rastrear de onde uma ação veio (ver [[02-composicao-entre-skills]]).

## Como os documentos desta pasta se encaixam

| Documento | Pergunta que responde |
|---|---|
| [[01-organizacao]] | Como as Skills serão organizadas? |
| [[02-composicao-entre-skills]] | Como uma Skill chama outra? |
| [[03-delegacao]] | Quando uma Skill deve parar e delegar? |
| [[04-sobreposicao-e-limites]] | Como evitar sobreposição entre Skills? |
| [[05-consulta-documentacao]] | Como cada Skill consulta a documentação? |
| [[06-registro-de-decisoes]] | Como registrar decisões durante a execução? |
| [[07-conflitos-entre-especialistas]] | Como lidar com conflitos entre especialistas? |
| [[08-template-oficial-de-skill]] | Qual modelo toda Skill futura deve seguir? |

## O que este documento (e esta pasta) deliberadamente não faz

Não define nenhuma Skill específica, não propõe nomes finais, não cria nenhum arquivo de Skill executável — nem mesmo o [[08-template-oficial-de-skill]] é uma Skill, é o molde vazio que toda Skill futura deve preencher. A criação da primeira Skill é um passo separado e posterior, que deve ser feito preenchendo esse template e consultando esta arquitetura já pronta, não em paralelo a ela.
