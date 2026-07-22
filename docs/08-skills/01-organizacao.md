# Organização das Skills

## Objetivo do documento

Definir como as Skills serão nomeadas, estruturadas e catalogadas — a base para que a arquitetura inteira seja previsível antes que qualquer Skill exista.

## Quando deve ser utilizado

Consulte antes de propor a criação de uma Skill nova, para saber onde ela se encaixa e como deve ser nomeada e registrada.

## Documentos referenciados

- [[00-visao-arquitetura-skills]]
- [[04-sobreposicao-e-limites]] — o catálogo central descrito aqui é a principal ferramenta contra sobreposição
- [[08-template-oficial-de-skill]] — toda Skill listada no catálogo central deve ter sido criada a partir deste template
- `../02-architecture/05-estrutura-pastas.md` — o mesmo princípio de organização por domínio já aplicado ao código

---

## Domínios de Skill, espelhando (não copiando) a estrutura de `docs/`

Cada Skill deve declarar um único domínio dono, inspirado nas áreas já mapeadas pela documentação do projeto — não porque toda pasta de `docs/` precisa virar uma Skill, mas porque reaproveitar o mesmo mapa mental evita inventar uma segunda forma de dividir o projeto.

**Mapa de domínios em vigor** (revisado em 2026-07-21, quando o domínio único "Arquitetura" foi desmembrado e "Produto"/"Desenvolvimento" foram absorvidos por domínios de execução técnica — ver histórico de decisão em [[../06-knowledge/01-decisoes-tecnicas]]):

| Domínio de Skill | Skill dona | Documentação autoritativa | Tipo de tarefa que cobre | Decide ou implementa? |
|---|---|---|---|---|
| Frontend | `frontend-manager` | `docs/01-product/`, aplicando `docs/03-design/` | Implementação técnica de páginas, componentes e fluxos em React/Next.js/Tailwind | Implementa (decisão de fluxo/conteúdo vem de negócio/produto documentado; decisão visual vem do Design) |
| Backend | `backend-manager` | `docs/02-architecture/06,07,08,09` e `01-stack-tecnologica.md` | Padrões de API/dados, autenticação, service layer, uploads | Implementa e mantém os padrões estruturais |
| Design | `design-manager` | `docs/03-design/` | Paleta, tipografia, espaçamento, componentes visuais, UX, acessibilidade visual | Decide e documenta (não implementa código) |
| Database | `database-manager` | `docs/02-architecture/02-modelo-dados.md` | Schema, relacionamentos, RLS, migrações | Decide e implementa (SQL) |
| Infrastructure | `infrastructure-manager` | `docs/02-architecture/04-infraestrutura-deploy.md`, `docs/04-development/02-ambiente-local.md`, `03-fluxo-git.md`, `07-checklists.md` | Deploy, ambiente, variáveis de ambiente, processo de release | Decide e aplica o processo (não faz deploy sem autorização — ver [[03-delegacao]]) |
| QA | `qa-manager` | `docs/04-development/04-testes.md` | Testes automatizados — criação e manutenção | Implementa (escreve/corrige testes; não corrige código de produção) |
| SEO | `seo-manager` | Seções de SEO em `docs/01-product/04-paginas-publicas.md` | Metadados, sitemap, robots, dados estruturados | Decide e implementa (superfície técnica estreita: metadata/sitemap/robots) |
| Business | `business-manager` | `docs/05-business/` | Precificação, catálogo comercial, políticas, objetivos e métricas de negócio | Decide a regra (não implementa código) |
| Content | `content-specialist` | Texto/copy das páginas e curadoria de fotos, aplicando o tom de voz (`docs/03-design/01-identidade-visual.md`) e os limites técnicos de SEO (`seo-manager`) já decididos | Redação de copy de página e escolha/organização de fotos para a Galeria e o Catálogo | Escreve/cura conteúdo aplicando regras já decididas por Design e SEO — não redecide tom de voz nem metadados técnicos |
| Auditoria | `project-auditor` | Todas — transversal | Revisão de padrões, código, arquitetura, documentação, UX, performance, SEO, acessibilidade, riscos | Só lê e relata — nunca decide nem implementa |
| Conhecimento/Decisões | — (sem Skill dona) | `docs/06-knowledge/` | Consultado por toda Skill antes de agir; não é domínio exclusivo de uma só |

**Propostas avaliadas e conscientemente não criadas** (registradas para não serem reabertas sem contexto — ver [[../06-knowledge/01-decisoes-tecnicas]], ADRs 12 e 13):
- Catalog Specialist e Product Specialist — já cobertos por `business-manager` + `frontend-manager`.
- Conversion Specialist e Marketing Specialist — transversais; candidatos a uma futura Skill de Processo orquestradora, ainda inexistente.
- Analytics Specialist — depende da decisão em aberto em `docs/06-knowledge/04-decisoes-futuras.md`, item 8.
- Bug Hunter, Refactoring Specialist, Technical Debt Specialist, Security Specialist, Performance Optimizer — todas seriam Skills "corretoras" genéricas cruzando todos os domínios; achado já é do `project-auditor`, correção já é sempre da Skill de Domínio dona do código (ver princípio em [[04-sobreposicao-e-limites]]).
- Documentation Specialist — já distribuído (cada Skill mantém sua própria fatia de `docs/`) e coberto pela dimensão "documentação" do `project-auditor`.
- Dependency Manager — a lacuna real (manter dependências atualizadas, `npm audit` periódico) foi absorvida como responsabilidade extra de `infrastructure-manager`, sem virar Skill própria.

**Nem todo domínio precisa de uma Skill hoje.** Uma Skill só deve ser criada quando existe uma tarefa operacional recorrente que se beneficia de instruções empacotadas — não uma Skill por pasta de documentação só para ter simetria. O catálogo completo, com todas as Skills já criadas, está em [[09-catalogo-de-skills]].

## Convenção de nomenclatura

- Nome da Skill em kebab-case, refletindo **domínio + ação**, nunca um nome genérico (ex. `catalogo-cadastrar-produto`, não `helper` ou `assistente`).
- Uma Skill de domínio amplo (ex. cobre todo o módulo de Eventos) pode ter um nome mais curto (`eventos`), desde que seu escopo completo esteja declarado por escrito na própria Skill.
- Evitar nomes que descrevam a ferramenta em vez da tarefa (ex. `supabase-helper` é pior que `catalogo-cadastrar-produto`, porque amarra o nome a uma tecnologia que pode mudar, não à tarefa que continua existindo).

## Categorias de Skill

1. **Skills de Domínio** — especialistas de uma área (Produto, Arquitetura, Design, Negócio). Fazem o trabalho fim de sua área.
2. **Skills de Processo** — atravessam domínios para executar um fluxo operacional completo (ex. um checklist de release, uma auditoria completa). Coordenam Skills de Domínio em vez de fazer o trabalho fim sozinhas.
3. **Skills Utilitárias** — pequenas, sem estado, reaproveitadas por várias outras (ex. consultar o glossário, formatar uma resposta em um padrão específico). Não tomam decisão de negócio nem técnica sozinhas — só executam uma sub-tarefa bem definida.

Uma Skill de Processo nunca deveria duplicar a lógica de uma Skill de Domínio — deveria invocá-la (ver [[02-composicao-entre-skills]]).

## Catálogo central de Skills

Antes de criar qualquer Skill, deve existir (e ser mantido atualizado) um catálogo central — um único documento listando toda Skill existente, seu domínio dono, seu escopo declarado (incluindo o que está fora de escopo) e as Skills relacionadas que ela pode invocar. Esse catálogo é a primeira coisa a consultar antes de propor uma Skill nova, e a primeira coisa a atualizar depois que uma é criada. Sem esse catálogo, a regra de "um domínio, uma Skill dona" (ver [[04-sobreposicao-e-limites]]) não tem como ser verificada na prática.

Toda entrada do catálogo central corresponde a uma Skill criada a partir do [[08-template-oficial-de-skill]] — o catálogo é essencialmente um resumo indexado das seções "Nome", "Responsabilidades", "Quais Skills pode chamar" e "Quais Skills podem chamá-la" de cada Skill já preenchida com esse template. O catálogo vivo deste projeto é [[09-catalogo-de-skills]].

## Onde as Skills vivem tecnicamente

Skills deste projeto, quando criadas, devem seguir a convenção padrão de Skills de projeto (arquivo de definição por Skill, com nome, descrição curta e instruções). Este documento não define a localização exata em disco — isso é uma decisão de implementação a ser tomada no momento de criar a primeira Skill, não uma decisão de arquitetura antecipada aqui.
