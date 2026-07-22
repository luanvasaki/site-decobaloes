# Sobreposição e Limites entre Skills

## Objetivo do documento

Definir as regras que impedem duas Skills de disputarem a mesma responsabilidade, e mapear as fronteiras mais prováveis de conflito neste projeto especificamente.

## Quando deve ser utilizado

Consulte antes de propor uma Skill nova (para checar se o domínio já tem uma dona) e ao definir a seção de "fora de escopo" de qualquer Skill.

## Documentos referenciados

- [[00-visao-arquitetura-skills]]
- [[01-organizacao]] — o catálogo central que torna esta regra verificável
- [[03-delegacao]]
- [[07-conflitos-entre-especialistas]] — o que fazer quando, apesar de tudo, duas Skills chegam a recomendações conflitantes

---

## Regra central: um domínio, uma Skill dona

Cada área de responsabilidade tem exatamente **uma** Skill dona. Nunca duas Skills cobrindo o mesmo domínio "porque uma é mais simples e outra mais completa", ou "uma é a versão antiga e outra a nova" — isso é fragmentação de responsabilidade, não especialização, e é exatamente o tipo de situação que torna impossível saber qual Skill invocar para uma tarefa específica.

## Checagem obrigatória antes de criar uma Skill

Antes de qualquer Skill nova ser criada, o catálogo central (ver [[01-organizacao]]) deve ser consultado para responder: **este domínio já tem uma Skill dona?**

- Se sim, a resposta correta é **estender a Skill existente** (ampliar seu escopo declarado, se fizer sentido) — nunca criar uma segunda Skill paralela para o mesmo domínio.
- Se não, a Skill nova pode ser criada, mas seu domínio precisa ser registrado no catálogo central antes/junto da criação, para que a próxima checagem (da próxima Skill proposta) já a encontre.

## Seção obrigatória: "Fora de escopo"

Toda Skill, ao ser definida, deve incluir uma seção explícita listando o que ela **não** faz — principalmente as tarefas que poderiam parecer relacionadas o suficiente para "só fazer de passagem". Essa seção existe para conter a tendência natural de uma Skill ir um pouco além do seu escopo original porque "já está ali mesmo". Uma Skill sem uma seção de "fora de escopo" declarada deveria ser considerada incompleta.

## Fronteiras de maior risco de sobreposição neste projeto

Com base no mapa de domínios em vigor (ver [[01-organizacao]]), estas são as fronteiras onde a sobreposição é mais provável, e a regra de corte para cada uma:

### Frontend vs. Design
**Risco**: as duas tratam da experiência de uma tela — uma implementando, outra decidindo a aparência.
**Regra de corte**: `design-manager` **decide** como algo deve se parecer (cor, espaçamento, animação, componente visual) e registra em `docs/03-design/`; `frontend-manager` **implementa** essa decisão em código (componentes React, classes Tailwind). `frontend-manager` nunca introduz uma cor, espaçamento ou padrão visual novo por conta própria — se precisar de uma decisão visual que a documentação ainda não cobre, para e delega a `design-manager` (ver [[03-delegacao]]) em vez de decidir sozinho.

### Frontend vs. Backend
**Risco**: as duas tocam código de aplicação; a linha entre "componente que busca dado" e "como o dado é buscado" pode parecer difusa.
**Regra de corte**: `backend-manager` é dono do padrão de acesso a dados (`services/`, Server Actions, autenticação, upload) e decide *como* os dados fluem; `frontend-manager` é dono de como a tela usa esses dados (componentes, estado local, interação). `frontend-manager` não cria uma nova função de acesso a dado nem altera uma política de RLS; `backend-manager` não decide como um componente visual se comporta.

### Backend vs. Database
**Risco**: os dois lidam com "como os dados são estruturados e acessados", podiam parecer o mesmo domínio.
**Regra de corte**: `database-manager` é dono do **schema** (tabelas, colunas, relacionamentos, RLS, migrações — `supabase/*.sql`); `backend-manager` é dono de **como a aplicação consome** esse schema (padrão de consulta, camada de serviço, autenticação). Uma mudança de schema é sempre proposta/aplicada por `database-manager`, mesmo que motivada por uma necessidade identificada pelo `backend-manager` — que, nesse caso, delega em vez de alterar o SQL diretamente.

### Backend vs. Infrastructure
**Risco**: os dois lidam com configuração do projeto (variáveis de ambiente, arquivos de configuração de build).
**Regra de corte**: `infrastructure-manager` é dono do ambiente de execução (deploy, variáveis de ambiente, processo de release, ambiente local); `backend-manager` é dono da lógica que roda dentro desse ambiente. Adicionar uma variável de ambiente nova, mudar a configuração de build ou tocar no processo de deploy é sempre `infrastructure-manager` — mesmo que a necessidade tenha vindo de uma mudança de backend.

### QA vs. Project Auditor
**Risco**: as duas "olham para o projeto em busca de problemas" — a diferença não é óbvia à primeira vista.
**Regra de corte**: `qa-manager` **escreve e mantém testes automatizados**, e corrige o próprio código de teste quando ele está errado — é uma Skill de execução, com um artefato próprio (a suíte de testes) que ela é dona de criar e alterar. `project-auditor` **nunca escreve nem corrige nada** — faz uma revisão pontual, sob demanda, e produz um relatório; não é dona de nenhum artefato de código, nem mesmo de testes. Quando um teste do `qa-manager` revela um bug em código de outro domínio (ex. Backend), `qa-manager` corrige o teste (se o teste estiver errado) ou relata o bug e delega a correção ao domínio dono do código — nunca corrige código de produção fora do seu domínio.

### SEO vs. Frontend
**Risco**: metadados de SEO (`generateMetadata`, `sitemap.ts`, `robots.ts`) são código dentro das mesmas páginas que `frontend-manager` implementa.
**Regra de corte**: `seo-manager` é dono da superfície técnica estreita de SEO (metadados, sitemap, robots, dados estruturados) e pode editar esses trechos específicos diretamente; `frontend-manager` é dono do restante da página. Nenhuma das duas deveria alterar a parte da outra sem delegar — `frontend-manager` não decide o conteúdo de uma tag de metadado, e `seo-manager` não altera a estrutura visual/de layout da página.

### Content vs. Design
**Risco**: as duas tratam de "como a marca fala/se apresenta" — uma escrevendo o texto real, outra decidindo o tom.
**Regra de corte**: `design-manager` decide e documenta as **diretrizes** de tom de voz (`docs/03-design/01-identidade-visual.md`); `content-specialist` **escreve o texto real** de cada página/foto seguindo essas diretrizes. `content-specialist` nunca redefine o tom de voz da marca por conta própria — se um texto exigir um tom que a diretriz atual não cobre, para e delega a `design-manager`.

### Content vs. SEO
**Risco**: título e descrição de página são, ao mesmo tempo, texto de marca e metadado técnico.
**Regra de corte**: `seo-manager` decide e implementa a superfície técnica estreita (a tag de metadado em si, sitemap, robots, dados estruturados); `content-specialist` pode propor o texto de título/descrição do ponto de vista de copy/marca, mas quem aplica na tag técnica é `seo-manager`. Nenhuma das duas decide sozinha o texto final de metadado sem a outra.

### Content vs. Frontend
**Risco**: o texto e as fotos escolhidos por `content-specialist` precisam ser colocados na tela por código.
**Regra de corte**: `content-specialist` decide **o quê** dizer e **quais fotos usar/como organizá-las** (curadoria); `frontend-manager` implementa isso no componente (upload técnico, disposição em grid, comportamento). `content-specialist` não edita componentes React; `frontend-manager` não decide o texto nem escolhe a foto por conta própria.

### Business vs. Frontend
**Risco**: regras de negócio (ex. a regra do preço "A combinar") aparecem diretamente na tela.
**Regra de corte**: `business-manager` decide **a regra** (o que é permitido, como o preço funciona, quais políticas existem — `docs/05-business/`); `frontend-manager` decide **como a regra se manifesta na tela** (onde aparece, como é exibida), sempre implementando uma regra já decidida, nunca inventando uma nova.

### Project Auditor vs. todo o resto
**Risco**: Auditoria é transversal por natureza (lê tudo), o que pode parecer autorização para também *alterar* tudo.
**Regra de corte**: `project-auditor` **lê e relata** — encontra e documenta problemas (o padrão já usado em `docs/07-audits/`), mas não corrige nada diretamente. Qualquer correção decorrente de um achado de auditoria deve ser delegada à Skill de Domínio dona daquela área, nunca aplicada pela própria `project-auditor`.

## Princípio: achado nunca é o mesmo domínio que correção

Generalizando a regra acima (formalizada em 2026-07-21 depois de avaliar as propostas de "Bug Hunter", "Refactoring Specialist", "Technical Debt Specialist", "Security Specialist" e "Performance Optimizer" — ver [[../06-knowledge/01-decisoes-tecnicas]], ADR 13): **nenhuma Skill nova deveria ser criada só para "encontrar e corrigir X"** (bug, dívida técnica, falha de segurança, problema de performance), porque X pode estar em qualquer domínio do código, e uma Skill corretora genérica teria que ter permissão de escrita sobre todos os domínios ao mesmo tempo — o oposto do princípio de "um domínio, uma Skill dona".

O padrão correto sempre que essa proposta surgir de novo:
- **Encontrar** já é papel do `project-auditor` (padrões, código, arquitetura, documentação, UX, performance, SEO, acessibilidade, riscos — as 8 dimensões já cobertas).
- **Corrigir** é sempre da Skill de Domínio dona do código afetado (`frontend-manager` corrige um bug de componente, `database-manager` corrige uma política RLS insegura, `backend-manager` corrige uma falha de autenticação, e assim por diante) — nunca de uma Skill "corretora" à parte.
- Manutenção rotineira e de baixo risco que hoje não tem dono claro (ex. manter dependências do `package.json` atualizadas, rodar `npm audit` periodicamente) deve ser absorvida como responsabilidade extra da Skill de Domínio mais próxima (ver `infrastructure-manager`), não virar uma Skill nova.

## Composição entre estas Skills, por enquanto: nenhuma chamada direta

Nenhuma das Skills de Domínio listadas acima invoca outra diretamente hoje (ver [[02-composicao-entre-skills]], regra de profundidade máxima) — todas declaram "Quais Skills pode chamar: nenhuma" em sua definição. Quando uma tarefa cruza a fronteira de duas Skills, a Skill atual **para e delega** (ver [[03-delegacao]]), recomendando qual Skill deveria assumir o restante, em vez de chamá-la diretamente. Chamada direta entre Skills de Domínio fica reservada para quando uma Skill de Processo orquestradora existir (ver [[01-organizacao]]) — hoje nenhuma foi criada.

## Revisão do mapa de escopos

O mapa de domínios e as regras de corte acima não são definitivos — à medida que Skills novas forem propostas, novas fronteiras podem aparecer. Qualquer fronteira nova identificada deve ser adicionada a este documento **antes** da Skill que a provocou ser criada, não depois, para que a regra de corte já exista no momento em que a ambiguidade poderia surgir na prática.
