# Catálogo Central de Skills

## Objetivo do documento

Ser o índice único e vivo de toda Skill já criada neste projeto — o primeiro documento a consultar antes de propor uma Skill nova (para checar se um domínio já tem dona) e o primeiro a atualizar depois que uma Skill é criada ou alterada.

## Quando deve ser utilizado

Consulte antes de criar qualquer Skill nova (obrigatório, ver `docs/08-skills/04-sobreposicao-e-limites.md`), e sempre que precisar saber quais Skills existem, o que cada uma cobre, e como elas podem se chamar.

## Documentos referenciados

- [[00-visao-arquitetura-skills]]
- [[01-organizacao]]
- [[04-sobreposicao-e-limites]]
- [[08-template-oficial-de-skill]]

---

## Como ler esta tabela

Cada linha corresponde a uma Skill já criada, com seu domínio dono, um resumo de escopo, e o grafo de composição (quem ela chama / quem a chama) — usado para verificar ausência de ciclos (ver [[02-composicao-entre-skills]]).

| Skill | Categoria | Domínio dono | Escopo resumido | Chama | É chamada por | Definição completa |
|---|---|---|---|---|---|---|
| `frontend-manager` | Skill de Domínio | Frontend | Implementa páginas/componentes/fluxos em React/Next.js/Tailwind, aplicando decisões de Design/SEO/Business já documentadas. Não decide visual, regra de negócio ou acesso a dado novo. | `delivery-reviewer` | Nenhuma hoje | `.claude/skills/frontend-manager/SKILL.md` |
| `backend-manager` | Skill de Domínio | Backend | Mantém padrões de acesso a dados (`services/`, Server Actions), autenticação e uploads. Não altera schema nem ambiente. | `delivery-reviewer` | Nenhuma hoje | `.claude/skills/backend-manager/SKILL.md` |
| `design-manager` | Skill de Domínio | Design | Decide e documenta o design system (paleta, tipografia, componentes visuais, UX, acessibilidade visual). Nunca edita código. | `delivery-reviewer` | Nenhuma hoje | `.claude/skills/design-manager/SKILL.md` |
| `database-manager` | Skill de Domínio | Database | Decide e implementa schema, relacionamentos, RLS e migrações (`supabase/*.sql`). Nunca aplica migração em produção sem autorização explícita. | `delivery-reviewer` | Nenhuma hoje | `.claude/skills/database-manager/SKILL.md` |
| `infrastructure-manager` | Skill de Domínio | Infrastructure | Mantém deploy, ambiente local, variáveis de ambiente e checklists de release. Nunca publica em produção sem autorização explícita. | `delivery-reviewer` | Nenhuma hoje | `.claude/skills/infrastructure-manager/SKILL.md` |
| `qa-manager` | Skill de Domínio | QA | Escreve e mantém testes automatizados; corrige testes, não código de produção fora do seu domínio. | `delivery-reviewer` | Nenhuma hoje | `.claude/skills/qa-manager/SKILL.md` |
| `seo-manager` | Skill de Domínio | SEO | Metadados, sitemap, robots, dados estruturados. Superfície técnica estreita, distinta de Frontend. | `delivery-reviewer` | Nenhuma hoje | `.claude/skills/seo-manager/SKILL.md` |
| `business-manager` | Skill de Domínio | Business (Negócio) | Decide e documenta precificação, políticas, catálogo comercial, objetivos e métricas. Nunca edita código. | `delivery-reviewer` | Nenhuma hoje | `.claude/skills/business-manager/SKILL.md` |
| `project-auditor` | Skill de Domínio | Auditoria | Revisa padrões, código, arquitetura, documentação, UX, performance, SEO, acessibilidade e riscos; gera relatório final. Nunca corrige nem implementa. | `delivery-reviewer` | Nenhuma hoje | `.claude/skills/project-auditor/SKILL.md` |
| `content-specialist` | Skill de Domínio | Content | Escreve copy de página e cura fotos da Galeria/Catálogo, aplicando o tom de voz do `design-manager` e os limites técnicos do `seo-manager`. Nunca redefine tom de voz nem edita metadado técnico ou componentes diretamente. | `delivery-reviewer` | Nenhuma hoje | `.claude/skills/content-specialist/SKILL.md` |
| `delivery-reviewer` | Skill de Processo | Controle de Qualidade de Entregas | Revisa toda decisão não trivial de qualquer Skill de Domínio contra dois critérios — fidelidade ao pedido do usuário e qualidade real (padrão "digno de elogio", não só "sem erro") — antes da entrega ser apresentada como concluída. Aprova silenciosamente; reprova de forma visível, com motivo específico. Nunca corrige nem decide o mérito de questões sem resposta objetiva. | Nenhuma hoje | Todas as 10 Skills de Domínio | `.claude/skills/delivery-reviewer/SKILL.md` |

## Composição: nenhuma chamada direta entre Domínios, exceto para revisão de entrega

As 10 Skills de Domínio continuam declarando "Quais Skills pode chamar: nenhuma [Skill de Domínio]" — quando uma tarefa cruza a fronteira de duas, a Skill atual **para e delega** (ver [[03-delegacao]]) em vez de invocar a outra diretamente, seguindo a regra de profundidade de [[02-composicao-entre-skills]] (chamada direta entre Skills de Domínio fica reservada para quando uma Skill de Processo orquestradora **de domínio** existir — nenhuma foi criada ainda).

A exceção, desde 2026-08-13, é `delivery-reviewer`: uma Skill de Processo que todas as 10 Skills de Domínio chamam ao final de qualquer decisão não trivial, para aprovação antes de apresentar o resultado como concluído. Isso não cria ciclo nem viola a profundidade máxima — `delivery-reviewer` não chama nenhuma Skill de volta.

## Fronteiras já resolvidas (ver detalhe em [[04-sobreposicao-e-limites]])

| Fronteira | Regra de corte resumida |
|---|---|
| Frontend vs. Design | Design decide a aparência; Frontend implementa. |
| Frontend vs. Backend | Backend decide como os dados fluem; Frontend decide como a tela os usa. |
| Backend vs. Database | Database é dono do schema; Backend consome o schema. |
| Backend vs. Infrastructure | Infrastructure é dono do ambiente de execução; Backend é dono da lógica que roda nele. |
| QA vs. Project Auditor | QA escreve/corrige testes (é dona de um artefato); Auditor só lê e relata, nunca escreve. |
| SEO vs. Frontend | SEO tem uma superfície técnica estreita (metadata/sitemap/robots); Frontend é dono do restante da página. |
| Business vs. Frontend | Business decide a regra; Frontend decide como ela aparece na tela. |
| Content vs. Design | Design decide diretrizes de tom de voz; Content escreve o texto real seguindo-as. |
| Content vs. SEO | SEO aplica a tag técnica de metadado; Content propõe o texto do ponto de vista de copy. |
| Content vs. Frontend | Content decide o quê dizer/quais fotos usar; Frontend implementa em componente. |
| Project Auditor vs. todo o resto | Auditor lê e relata; correção é sempre delegada à Skill de Domínio dona da área. |

## Princípio geral: achado ≠ correção

Nenhuma Skill deveria ser criada só para "encontrar e corrigir X" (bug, dívida técnica, falha de segurança, problema de performance) — achado é sempre do `project-auditor`; correção é sempre da Skill de Domínio dona do código afetado. Ver detalhe em [[04-sobreposicao-e-limites]] e ADR 13 em `../06-knowledge/01-decisoes-tecnicas.md`.

## Domínios ainda sem Skill dona

- **Produto** (`docs/01-product/`) — absorvido como referência primária de `frontend-manager` (não existe uma "Skill de Produto" separada nesta versão do roster).
- **Conhecimento/Decisões** (`docs/06-knowledge/`) — deliberadamente sem Skill dona; é consultado por todas.
- Nenhuma **Skill de Processo orquestradora de domínio** foi criada ainda — é o próximo passo natural se/quando a composição direta entre Skills de Domínio se tornar necessária (candidatos represados: Conversion, Marketing — ver [[01-organizacao]]). A primeira Skill de Processo do projeto, `delivery-reviewer`, é de um tipo diferente: não orquestra Skills de Domínio entre si, é chamada por todas elas para revisar entregas.

## Propostas avaliadas e conscientemente não criadas

Ver a lista completa, com o motivo de cada uma, em [[01-organizacao]] ("Propostas avaliadas e conscientemente não criadas") e ADRs 12–13 em `../06-knowledge/01-decisoes-tecnicas.md`: Catalog Specialist, Product Specialist, Conversion Specialist, Marketing Specialist, Analytics Specialist, Bug Hunter, Refactoring Specialist, Technical Debt Specialist, Security Specialist, Performance Optimizer, Documentation Specialist, Dependency Manager.

## Histórico de alterações neste catálogo

- **2026-08-13** — `delivery-reviewer` criada e registrada: primeira Skill de Processo do projeto. Revisa toda decisão não trivial de qualquer Skill de Domínio (fidelidade ao pedido do usuário + qualidade real) antes da entrega ser apresentada como concluída; aprova silenciosamente, reprova de forma visível. Todas as 10 Skills de Domínio existentes tiveram sua seção "Quais Skills pode chamar" atualizada para incluí-la. Novo domínio "Controle de Qualidade de Entregas" adicionado ao mapa (ver [[01-organizacao]]); fronteira com `project-auditor` documentada em [[04-sobreposicao-e-limites]].
- **2026-07-21** — `project-auditor` criada e registrada. Primeira Skill do projeto.
- **2026-07-21** — Roster expandido: `frontend-manager`, `backend-manager`, `design-manager`, `database-manager`, `infrastructure-manager`, `qa-manager`, `seo-manager` e `business-manager` criadas. Domínio "Arquitetura" desmembrado em Backend/Database/Infrastructure; domínio "Produto" absorvido por Frontend; domínio "Desenvolvimento/Processo" distribuído entre Frontend, Backend, Infrastructure e QA conforme a natureza de cada convenção. Ver [[01-organizacao]] e [[04-sobreposicao-e-limites]] para o mapa atualizado.
- **2026-07-21** — `content-specialist` criada, consolidando Copywriter + SEO Copywriter + Photography Specialist. Catalog/Product/Conversion/Marketing/Analytics Specialist avaliados e não criados (ADR 12).
- **2026-07-21** — Bug Hunter, Refactoring Specialist, Technical Debt Specialist, Documentation Specialist, Dependency Manager, Security Specialist e Performance Optimizer avaliados e não criados; princípio "achado ≠ correção" formalizado; `infrastructure-manager` absorveu a responsabilidade de manter dependências atualizadas (ADR 13).
