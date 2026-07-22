# Como cada Skill Consulta a Documentação

## Objetivo do documento

Definir o protocolo pelo qual toda Skill deste projeto deve consultar a pasta `docs/` — para que a documentação já construída seja, de fato, a fonte de verdade usada em cada execução, e não apenas um material de referência ocasional.

## Quando deve ser utilizado

Consulte ao desenhar o início do fluxo de qualquer Skill nova, e ao investigar por que uma Skill tomou uma decisão que contradiz algo já documentado.

## Documentos referenciados

- [[00-visao-arquitetura-skills]]
- [[01-organizacao]] — o mapeamento de domínio → pasta de documentação autoritativa
- [[06-registro-de-decisoes]] — o que fazer quando a documentação e a realidade divergem

---

## Regra fundamental: reler, nunca presumir de memória

Nenhuma Skill deve confiar em um resumo memorizado ou numa impressão geral sobre o projeto — toda Skill deve **reler os documentos relevantes de `docs/` no início de cada execução**, porque a documentação pode ter mudado desde a última vez que a Skill (ou quem a definiu) a consultou. Este é o mesmo princípio já aplicado durante a construção da documentação: nenhuma afirmação sobre o projeto deveria vir de suposição quando existe uma fonte verificável para conferir.

## Mapeamento de autoridade documental por domínio

Cada Skill deve declarar, na sua própria definição, exatamente quais documentos de `docs/` são autoritativos para ela — reaproveitando o mapeamento já estabelecido em [[01-organizacao]]:

| Domínio da Skill | Documentação autoritativa primária | Consulta obrigatória adicional |
|---|---|---|
| Produto | `docs/01-product/` | `docs/00-vision/` (contexto de negócio por trás das páginas) |
| Arquitetura/Backend | `docs/02-architecture/` | `docs/06-knowledge/01-decisoes-tecnicas.md` |
| Design/Frontend visual | `docs/03-design/` | `docs/01-product/` (para não alterar fluxo ao mexer em aparência) |
| Desenvolvimento/Processo | `docs/04-development/` | `docs/02-architecture/06-padroes-arquiteturais.md` |
| Negócio | `docs/05-business/` | `docs/00-vision/00-visao-geral.md` |
| Auditoria | `docs/07-audits/` | Todas as pastas — auditoria é transversal por definição |
| **Toda Skill, sem exceção** | `docs/06-knowledge/` | Sempre, antes de agir (ver ordem de leitura abaixo) |

## Ordem de leitura recomendada dentro de uma execução

1. **Glossário** (`docs/06-knowledge/00-glossario.md`) — para garantir que a Skill usa o vocabulário certo do projeto (ex. "evento" e não "pedido" ao se referir ao sistema real).
2. **Decisões já tomadas relevantes ao domínio** (`docs/06-knowledge/01-decisoes-tecnicas.md` e `docs/06-knowledge/05-escolhas-de-tecnologia.md`) — para não propor algo que já foi conscientemente decidido de outra forma, com um motivo registrado.
3. **Documentação específica do domínio da tarefa** — a fonte primária listada na tabela acima.
4. **Decisões futuras em aberto** (`docs/06-knowledge/04-decisoes-futuras.md`) — para checar se a tarefa atual não está pisando em uma pergunta deliberadamente ainda não respondida (se estiver, ver [[03-delegacao]]).

## Quando a documentação diverge do comportamento real

Uma Skill pode encontrar, durante a execução, uma divergência entre o que a documentação descreve e o que o código/produto realmente faz. Nesse caso:

- **Nunca corrigir a documentação silenciosamente** como efeito colateral de uma tarefa não relacionada a documentar.
- **Nunca decidir sozinha qual das duas versões (documento ou código) está certa.**
- Se a tarefa puder continuar sem depender do ponto divergente, seguir o comportamento real do código (fonte de verdade operacional) e registrar a divergência encontrada (ver [[06-registro-de-decisoes]]).
- Se a tarefa depender diretamente do ponto divergente, parar e escalar (ver [[03-delegacao]]).

## Skills não devem duplicar a documentação dentro de si mesmas

Uma Skill não deve colar o conteúdo de um documento (ex. a paleta de cores inteira, ou a lista de status de evento) dentro das próprias instruções — deve referenciar o documento e instruir a consulta-lo no momento da execução. Duplicar conteúdo cria uma segunda cópia que pode ficar desatualizada independentemente da original, exatamente o problema que esta arquitetura existe para evitar.
