# Decisões Técnicas (ADR)

## Objetivo do documento

Registrar as decisões de arquitetura mais importantes do projeto no formato de ADR (Architecture Decision Record) — contexto, decisão tomada e consequências — para que ninguém precise "redescobrir" por que o projeto é do jeito que é.

## Quando deve ser utilizado

Consulte antes de propor mudar algo estrutural (ex. "vamos adicionar uma API REST", "vamos criar papéis de usuário") — a decisão já pode ter sido tomada conscientemente, com um motivo documentado aqui.

## Documentos referenciados

- `../02-architecture/00-visao-arquitetura.md` — resumo das mesmas decisões, em formato de visão geral
- [[00-glossario]]
- [[03-licoes-aprendidas]]
- [[05-escolhas-de-tecnologia]] — por que cada tecnologia da stack foi escolhida (este documento foca em como as peças se organizam)
- [[04-decisoes-futuras]] — perguntas em aberto que, se respondidas, viram um ADR novo aqui

---

## ADR 1 — Sem camada de API REST própria

**Contexto**: o site tem um único consumidor de dados (ele mesmo) — não há aplicativo mobile, integração de terceiros nem parceiro externo consumindo dados do site.

**Decisão**: Server Components e Server Actions leem/gravam o Supabase diretamente, sem passar por rotas de API do Next.js (`app/api/` não existe).

**Alternativas descartadas**: criar rotas `app/api/` como camada intermediária (rejeitada por adicionar uma camada sem consumidor que a justificasse); usar um backend separado (Express/Fastify) na frente do Supabase (rejeitada por duplicar o que o Supabase já resolve, sem necessidade real de lógica de servidor customizada além do que Server Actions já cobrem).

**Consequências**: menos código para manter (sem rotas, sem serialização própria); em compensação, a lógica de acesso a dados fica acoplada ao SDK do Supabase diretamente na camada de UI, e não há um ponto único de entrada caso um consumidor externo precise ser adicionado no futuro (nesse caso, essa decisão precisaria ser revisitada).

**Status**: em vigor.

---

## ADR 2 — Camada de serviço só para leitura, escrita direta nos componentes

**Contexto**: leituras são reaproveitadas por várias páginas (ex. listar produtos aparece no Catálogo, na Home e no admin); escritas costumam ser específicas de um único formulário.

**Decisão**: `services/` centraliza as funções de leitura; as operações de escrita (criar/editar/excluir) ficam implementadas dentro do próprio componente do admin que as usa, sem uma camada equivalente de "repositório de escrita".

**Alternativas descartadas**: criar um `services/` simétrico também para escrita (ex. `createProduct`, `updateEvent`) — não chegou a ser adotado porque cada escrita tende a ser específica de um único formulário, sem reuso real entre telas que justificasse a abstração extra no momento em que o código foi escrito.

**Consequências**: leitura é consistente e fácil de reaproveitar; escrita tem alguma duplicação entre formulários (cada um monta sua própria chamada ao Supabase), aceita como um custo baixo dado o tamanho do projeto.

**Status**: em vigor.

---

## ADR 3 — Autorização via Row Level Security, não via papéis de aplicação

**Contexto**: o negócio tem, na prática, uma única operadora usando o admin.

**Decisão**: a segurança de quem pode ler/escrever cada tabela é decidida pelas políticas RLS do Postgres — qualquer usuário autenticado no Supabase Auth é tratado como administrador com acesso total; não existe conceito de papel/permissão no código da aplicação.

**Alternativas descartadas**: modelar papéis de usuário (ex. tabela de perfis com um campo de função, políticas RLS condicionadas a esse campo) — descartada por complexidade desnecessária para uma operação com uma única pessoa usando o admin; ver [[04-decisoes-futuras]] para quando isso deveria ser reconsiderado.

**Consequências**: simplicidade total hoje; se a equipe crescer e precisar de acessos diferenciados (ex. um freelancer que só deveria mexer na galeria, não em valores financeiros de eventos), essa decisão precisará ser revisitada — hoje não há como restringir isso.

**Status**: em vigor. Ver [[02-faq]] para a pergunta "posso dar acesso limitado a alguém?".

---

## ADR 4 — Um único banco de dados para todos os ambientes

**Contexto**: manter múltiplos projetos Supabase (dev/preview/produção) tem custo de configuração e, possivelmente, financeiro.

**Decisão**: as mesmas credenciais de Supabase são usadas em desenvolvimento local, preview e produção.

**Alternativas descartadas**: um segundo projeto Supabase dedicado a desenvolvimento/preview, com dados de exemplo — não chegou a ser criado, provavelmente por custo/esforço de manutenção extra (manter os dois schemas sincronizados) frente ao tamanho do projeto até agora.

**Consequências**: simplicidade de configuração; em contrapartida, qualquer teste local grava/apaga dados reais do negócio, sem rede de segurança. Ver `../04-development/02-ambiente-local.md` para os cuidados práticos que essa decisão exige.

**Status**: em vigor, mas é o ponto de maior risco operacional do projeto — candidato natural a revisão caso o negócio ou a equipe técnica cresçam.

---

## ADR 5 — Deploy manual, sem CI/CD

**Contexto**: projeto pequeno, sem testes automatizados que um pipeline pudesse rodar de qualquer forma.

**Decisão**: publicar uma mudança é um comando manual da CLI da Vercel — não há nenhuma automação disparada por `git push`.

**Alternativas descartadas**: conectar o repositório diretamente à Vercel para deploy automático a cada push (o fluxo "padrão" da própria Vercel) — não foi adotado neste projeto; o motivo histórico exato não está registrado, mas a prática atual sugere uma preferência por controlar manualmente o momento exato de cada publicação.

**Consequências**: nenhuma verificação automática acontece antes de uma mudança ir ao ar; a disciplina de testar manualmente antes de publicar recai inteiramente sobre quem está desenvolvendo (ver `../04-development/03-fluxo-git.md`).

**Status**: em vigor.

---

## ADR 6 — Sem gerenciador de estado global nem React Context

**Contexto**: a maior parte do estado da aplicação é local a uma única tela (formulário, lista, galeria).

**Decisão**: nenhuma biblioteca de estado global foi adotada; sincronização entre telas depois de uma escrita é feita recarregando os dados da rota (`router.refresh()`) ou invalidando cache (`revalidatePath()`), não por um estado compartilhado em memória.

**Alternativas descartadas**: Context API do React para estado compartilhado (ex. sessão do usuário); uma biblioteca de data-fetching com cache no cliente (ex. TanStack Query/SWR). Nenhuma das duas chegou a ser necessária porque o padrão Server Component + recarregar a rota já resolveu os casos reais encontrados até agora.

**Consequências**: menos uma camada de abstração para aprender/manter; o custo é que qualquer necessidade futura de estado verdadeiramente compartilhado entre partes distantes da árvore de componentes (ex. um carrinho, uma sessão de usuário exibida em vários lugares) exigiria introduzir esse padrão pela primeira vez.

**Status**: em vigor.

---

## ADR 7 — Uso apenas parcial do shadcn/ui

**Contexto**: o projeto foi configurado para usar shadcn/ui (biblioteca de componentes sobre Radix UI), mas a maior parte da interface acabou sendo construída com Tailwind puro.

**Decisão** (constatada, não necessariamente deliberada desde o início): hoje, apenas o componente de notificação toast foi de fato gerado e usado — e mesmo esse não é chamado em lugar nenhum do código. O restante das dependências Radix instaladas não é utilizado.

**Alternativas descartadas (de fato, ou por omissão)**: adotar shadcn/ui de forma completa (gerar botão, card, select, dialog) e usá-los consistentemente; ou remover a configuração e as dependências desde o início e usar só Tailwind puro, deliberadamente. Nenhuma das duas foi escolhida com clareza — o projeto ficou num meio-termo não intencional, o que motiva o próprio registro deste ADR.

**Consequências**: um novo desenvolvedor não deve presumir que existe uma biblioteca de componentes pronta para usar (botão, modal, select) — precisaria gerar o componente shadcn correspondente antes de usá-lo pela primeira vez, ou seguir o padrão de HTML+Tailwind já estabelecido no resto do projeto.

**Status**: parcialmente obsoleto — vale considerar remover as dependências Radix não usadas em uma limpeza futura, ou decidir adotar shadcn/ui de forma mais completa.

---

## ADR 8 — Sem testes automatizados

**Contexto**: projeto pequeno, sem processo de revisão formal, com foco em entregar rápido.

**Decisão**: nenhum framework de teste foi configurado; validação de mudanças é sempre manual.

**Alternativas descartadas**: configurar testes desde o início do projeto (ex. Vitest/Jest para lógica pura, Playwright/Cypress para fluxos críticos) — não chegou a ser priorizado frente à velocidade de entrega inicial; ver [[04-decisoes-futuras]] para os candidatos mais valiosos a cobrir primeiro, se essa decisão for revisitada.

**Consequências**: detalhadas em `../04-development/04-testes.md` — sem rede de segurança para refatoração, dependência total de teste manual disciplinado.

**Status**: em vigor.

---

## ADR 9 — Preço opcional ("A combinar") como regra de primeira classe

**Contexto**: nem todo orçamento de decoração tem um preço fixo determinável de antemão.

**Decisão**: o campo de preço do produto aceita valor nulo no banco de dados, com uma função central (`formatCurrency`) decidindo exibir "A combinar" sempre que o valor não existir — em vez de forçar todo produto a ter um preço, mesmo que arbitrário.

**Alternativas descartadas**: exigir sempre um preço, mesmo estimado ("a partir de R$ X"); ou um campo de texto livre separado para "observação de preço" em vez de permitir preço nulo. A opção de preço nulo foi preferida por ser mais simples de tratar de forma consistente em todo o site (uma única condição: "tem valor ou não tem"), em vez de dois campos concorrentes.

**Consequências**: reflete melhor a realidade comercial do negócio; qualquer tela nova que exiba preço precisa lembrar de tratar esse caso (usar a função central, não formatar o valor manualmente).

**Status**: em vigor. Introduzida depois do lançamento inicial do site — ver [[03-licoes-aprendidas]].

---

## ADR 10 — Reordenação por botões de seta, não por arrastar-e-soltar

**Contexto**: a galeria de fotos precisa de uma forma de definir a ordem de exibição.

**Decisão**: reordenar itens (fotos da galeria, fotos da home) é feito clicando em setas de mover, não arrastando os itens.

**Alternativas descartadas**: arrastar-e-soltar (drag-and-drop), com uma biblioteca como `dnd-kit` — descartada por exigir mais código e uma camada extra de acessibilidade (alternativa por teclado) que os botões de seta já oferecem nativamente, sem esforço adicional.

**Consequências**: interação mais simples de implementar e naturalmente acessível por teclado, ao custo de ser mais lenta para reordenar uma lista grande de uma vez. Mesmo com essa escolha mais simples, a funcionalidade já teve dois bugs de estabilidade corrigidos (ver [[03-licoes-aprendidas]] e `../02-architecture/09-uploads-imagens.md`).

**Status**: em vigor.

---

## ADR 11 — React/Next.js/TypeScript/Tailwind/Animação como lentes internas do `frontend-manager`, não Skills separadas

**Contexto**: foi proposta uma cadeia de 7 Skills especialistas (Frontend Manager → React → Next.js → TypeScript → Tailwind → Animation → Accessibility → Performance Specialist) para o trabalho de frontend.

**Decisão**: React, Next.js, TypeScript, Tailwind e Animação continuam sendo verificados dentro de uma única Skill (`frontend-manager`), como cinco lentes aplicadas juntas em cada mudança — não como Skills separadas nem em cadeia. Acessibilidade visual permanece decisão do `design-manager`; revisão de performance e de acessibilidade em profundidade permanece exclusiva do `project-auditor`.

**Alternativas descartadas**: (1) criar as 7 como Skills reais encadeadas — rejeitada por violar o limite de profundidade de composição já definido (máximo 2 níveis, ver `../08-skills/02-composicao-entre-skills.md`) e por não corresponder à forma real de trabalho (um componente é escrito em React+TypeScript+Tailwind+Next.js simultaneamente, não em etapas sequenciais); (2) criar as 7 como Skills paralelas chamadas por um orquestrador novo — rejeitada por exigir criar uma Skill de Processo só para viabilizar uma divisão que não tem tarefa recorrente distinta o suficiente para justificar 7 donos separados (ver `../08-skills/01-organizacao.md`: "nem todo domínio precisa de uma Skill").

**Consequências**: `frontend-manager` continua como domínio único e coeso; nenhuma Skill nova foi criada; Acessibilidade e Performance não duplicam o que `design-manager`/`project-auditor` já cobrem. Se no futuro uma dessas cinco lentes (ex. Tailwind) desenvolver uma tarefa recorrente genuinamente distinta e de peso suficiente, esta decisão pode ser revisitada — mas o padrão de partida é manter unificado.

**Status**: em vigor.

---

## ADR 12 — Content Specialist consolidado, Catalog/Product/Conversion/Marketing/Analytics Specialist não criados

**Contexto**: foram propostos 8 nomes de Skill (Catalog, Product, Photography, Copywriter, SEO Copywriter, Conversion, Marketing, Analytics Specialist) em sequência, para avaliação contra o catálogo já existente.

**Decisão**: apenas uma Skill nova foi criada — `content-specialist` (domínio Content), consolidando Copywriter + SEO Copywriter + Photography Specialist em uma única Skill que escreve copy e cura fotos, aplicando (sem redecidir) o tom de voz do `design-manager` e os limites técnicos do `seo-manager`. As demais sete propostas não foram criadas.

**Alternativas descartadas**:
- Catalog Specialist e Product Specialist — descartadas por já estarem cobertas por `business-manager` (regra de catálogo) e `frontend-manager` (que já absorveu o domínio "Produto", ver ADR anterior de criação do roster).
- Copywriter, SEO Copywriter e Photography Specialist como três Skills separadas — descartada por sobreporem entre si e com `design-manager`/`seo-manager`; consolidadas em `content-specialist`.
- Conversion Specialist e Marketing Specialist — descartadas por serem transversais a Negócio+Design+Frontend sem uma Skill de Processo orquestradora para coordená-las (nenhuma existe ainda); registradas como candidatas futuras em vez de forçadas a um domínio único artificial.
- Analytics Specialist — descartada por depender de uma decisão ainda em aberto (`docs/06-knowledge/04-decisoes-futuras.md`, item 8) que não deveria ser presumida pela criação de uma Skill.

**Consequências**: o roster cresce de forma consciente (9 → 10 Skills), com as fronteiras Content vs. Design, Content vs. SEO e Content vs. Frontend já formalizadas em `../08-skills/04-sobreposicao-e-limites.md`. As sete propostas não criadas ficam registradas em `../08-skills/01-organizacao.md` para não serem reabertas sem esse contexto.

**Status**: em vigor.

---

## ADR 13 — "Achado nunca é o mesmo domínio que correção" formalizado como princípio geral

**Contexto**: foram propostas mais 7 Skills (Bug Hunter, Refactoring Specialist, Technical Debt Specialist, Documentation Specialist, Dependency Manager, Security Specialist, Performance Optimizer), a maioria seguindo o mesmo padrão problemático: "encontrar e corrigir X" em qualquer parte do código.

**Decisão**: nenhuma das 7 foi criada. Em vez disso, a regra já aplicada à fronteira "Auditoria vs. todo o resto" foi generalizada em um princípio explícito (`../08-skills/04-sobreposicao-e-limites.md`): achado é sempre do `project-auditor` (ou de qualquer Skill que perceba um problema durante seu próprio trabalho); correção é sempre da Skill de Domínio dona do código afetado — nunca de uma Skill corretora genérica. A única exceção prática identificada (manter dependências atualizadas / `npm audit` periódico) foi absorvida como responsabilidade extra de `infrastructure-manager`, não uma Skill nova.

**Alternativas descartadas**: criar uma Skill por tipo de achado (Bug Hunter para bugs, Security Specialist para segurança, etc.) — descartada porque cada uma precisaria de permissão de escrita sobre todos os domínios do código ao mesmo tempo, o oposto direto do princípio "um domínio, uma Skill dona" (ver ADR 3 e `../08-skills/04-sobreposicao-e-limites.md`), e criaria ambiguidade real de qual Skill corrige um achado que cruza domínios (ex. uma falha de segurança na política RLS: `security-specialist` ou `database-manager`?).

**Consequências**: o roster permanece em 10 Skills. Qualquer proposta futura no formato "Skill que encontra e corrige X" deve ser avaliada primeiro contra este princípio antes de ser criada.

**Status**: em vigor.

---

## ADR 14 — Fotos de portfólio removidas do Catálogo (mantidas na Home)

**Contexto**: uma varredura de UX (`project-auditor`, dimensão UX) confirmou um achado do próprio dono do negócio — dentro de cada tema do Catálogo, a grade de fotos de portfólio ("Trabalhos realizados") e a grade de produtos ("Pacotes disponíveis") usavam o mesmo tratamento visual (fotos quadradas, cantos arredondados, mesmo hover), diferenciadas só por um rótulo pequeno de baixo contraste — gerando confusão real sobre o que era alugável e o que era apenas uma foto de referência.

**Decisão**: a seção "Trabalhos realizados" (e o visualizador de fotos em tela cheia associado) foi removida da página de Catálogo. Cada tema agora mostra só os produtos disponíveis (`components/catalog/CatalogView.tsx`). A busca de fotos de galeria (`getGalleryPhotos`) foi removida de `app/(public)/catalogo/page.tsx`, já que não tinha mais consumidor ali.

**Alternativas descartadas** (apresentadas como opções e decididas pelo dono do negócio):
- **B — manter as duas seções, tornando-as visualmente distintas** (título mais forte, texto de apoio, tratamento de cartão diferente) — preservaria a prova social por tema, mas foi preterida em favor de uma solução mais direta.
- **C — remover do Catálogo, mas linkar para a galeria em outro lugar** — meio-termo não escolhido.

**Consequências**: o Catálogo fica mais direto (só o que é alugável aparece), ao custo de perder a prova social específica por tema dentro da jornada de compra — a Home mantém um portfólio geral (não filtrado por tema) através de `PortfolioSection`/`getHomepageImages()`. A função `getGalleryPhotos()` em `services/gallery.ts` ficou sem nenhum consumidor no projeto após esta mudança — mantida por ora (não é código quebrado, só não utilizada), candidata a remoção numa limpeza futura se nenhum novo uso aparecer (ex. uma futura página de Portfólio dedicada, filtrada por tema). Documentação de página atualizada em `../01-product/04-paginas-publicas.md`.

**Status**: em vigor.

---

## ADR 15 — Lote de polimento visual (varredura de design)

**Contexto**: uma varredura de design (`design-manager`, inspecionando o site rodando ao vivo, não só a documentação) identificou quatro oportunidades concretas de deixar o visual mais consistente e "boutique": inconsistência do acento itálico Playfair, ausência de micro-interação nas abas do Catálogo, contraste ruim no placeholder de produto sem foto, e uma grade de serviços genérica na Home.

**Decisão**: quatro mudanças implementadas, cada uma verificada visualmente (navegador) e via `npm run build` antes de considerada pronta:
1. **`app/(public)/sobre/page.tsx`** — a palavra de destaque do H1 ("duram para sempre") passou a usar `font-playfair italic text-[#EC4899]`, igual ao padrão já usado na Home (`HeroContent.tsx`, palavra "encantam") — a assinatura visual de uma palavra de destaque em itálico agora é consistente nas duas páginas.
2. **`components/catalog/CatalogView.tsx`** — as abas de tema (Casamentos/Aniversários/Festa Infantil/Chá de Bebê) ganharam um indicador deslizante animado (`framer-motion`, `layoutId` compartilhado) em vez de só trocar a cor de fundo instantaneamente. As duas abas principais (Decorações/Materiais) foram mantidas como estavam — usam cores intencionalmente diferentes (rosa/dourado) que um "pill" compartilhado misturaria.
3. **`components/products/ProductCard.tsx`** — o placeholder de produto sem foto tinha um ícone quase invisível (`text-primary-200` sobre `bg-primary-50`, duas tonalidades de rosa quase idênticas). Trocado por um gradiente sutil + ícone na cor de marca (`#F9A8D4`) + texto "Foto em breve", com contraste adequado.
4. **`components/home/ServicesSection.tsx`** — a grade "Para cada ocasião" (2×2 uniforme) virou um layout bento em telas grandes (`lg:`): o primeiro item ocupa um bloco 2×2 em destaque, o segundo uma barra larga, os dois últimos cartões pequenos — quebra a rigidez do grid genérico sem alterar o comportamento em mobile/tablet (que permanece 1/2 colunas, como antes).

**Alternativas descartadas** (por serem mudanças maiores, mais arriscadas de acertar sem iteração visual em conjunto com o usuário): composição de fotos em camadas no Hero; molduras mais orgânicas na galeria/portfólio. Ficam registradas como ideias em aberto, não implementadas nesta rodada.

**Consequências**: nenhuma mudança de comportamento/fluxo — só polimento visual. Todas as quatro foram conferidas com o site rodando localmente (screenshots antes/depois) e com `npm run build` limpo. Um achado do meio do caminho (a página Sobre aparentando "travada" em opacidade baixa) foi investigado e descartado como artefato de hot-reload acumulado do dev server, não um bug real — resolvido reiniciando o servidor com `.next` limpo.

**Status**: em vigor.

---

## ADR 16 — Composição em camadas no Hero e molduras orgânicas no portfólio

**Contexto**: as duas ideias mais arriscadas da varredura de design (ADR 15) tinham ficado de fora por exigirem mais julgamento visual sem iteração em conjunto com o usuário. O usuário autorizou explicitamente prosseguir por conta própria, com a expectativa de reverter manualmente se não gostar (nada estava commitado até este ponto).

**Decisão**:
1. **`components/home/HeroSection.tsx`** — adicionada uma segunda foto menor, estilo "polaroid" (borda branca grossa, sombra, levemente rotacionada `rotate-6`), sobrepondo o canto inferior direito da foto principal do Hero e escapando da moldura arredondada dela — efeito de composição em camadas. Usa uma imagem estática (`/festa-4.jpg`), não a foto configurável do admin, e fica oculta em telas pequenas (`hidden sm:block`) para não sobrecarregar o layout empilhado do mobile.
2. **`components/home/PortfolioSection.tsx`** — cada foto do carrossel horizontal ganhou uma leve rotação alternada (±1°) e cantos assimétricos (um canto bem mais arredondado que os outros, alternando entre fotos pares/ímpares), com a rotação desfazendo ao passar o mouse (`hover:rotate-0`) — efeito "foto real levemente desalinhada" em vez de grade perfeitamente geométrica.

**Alternativas descartadas**: nenhuma alternativa de implementação foi descartada em favor de outra — estas eram as próprias ideias já propostas no ADR 15, agora aprovadas e implementadas.

**Consequências**: visual mais "boutique/editorial", ainda sem alterar nenhum fluxo ou dado. As duas mudanças foram confirmadas visualmente no navegador antes de fechar.

**Um imprevisto real no caminho** (vale registrar para não se repetir): rodar `npm run build` enquanto `npm run dev` ainda estava ativo corrompeu o estado do servidor de desenvolvimento (os dois processos compartilham a pasta `.next` por padrão), fazendo a Home renderizar em branco/sem imagens até o servidor ser reiniciado com `.next` limpo. **Lição**: nunca rodar `npm run build` com `npm run dev` ativo ao mesmo tempo no mesmo diretório — parar um antes de rodar o outro, ou usar diretórios de build separados se um dia isso for necessário simultaneamente.

**Status**: em vigor.

---

## ADR 17 — Foto de capa do Hero vira uma lista rotativa (`hero_image_url` → `hero_images`)

**Contexto**: o usuário pediu que a foto principal da Home pudesse alternar entre várias fotos, com mais opções no admin para incluir múltiplas fotos nessa área — a configuração existente (`hero_image_url`, uma única foto) não suportava isso.

**Decisão**: a configuração de capa foi migrada de uma foto única para uma lista (`hero_images`, JSON array, mesmo padrão já usado por `homepage_images`):
- `services/settings.ts`: `getHeroImageUrl()` (retornava `string`) substituída por `getHeroImages()` (retorna `string[]`, com fallback de um item). A função `setHeroImageUrl()` (código morto, nunca usada — ver ADR 7) foi removida.
- `app/actions/settings.ts`: `setHeroImageAction(url)` substituída por `setHeroImagesAction(urls[])`, mesmo padrão de `setHomepageImagesAction`.
- `components/home/HeroPhotoCarousel.tsx` (novo, Client Component): recebe a lista de fotos e alterna entre elas a cada 5 segundos com crossfade (`framer-motion`), reaproveitando o mesmo estilo de transição já usado na galeria do produto. Com 0 ou 1 foto, não há rotação perceptível (guarda `if (images.length <= 1) return` no `setInterval`).
- `components/home/HeroSection.tsx`: passou a buscar `getHeroImages()` e renderizar `HeroPhotoCarousel` no lugar da `<Image>` única.
- `app/admin/galeria/page.tsx`: a seção "Foto de Capa do Site" virou "Fotos de Capa (Hero)", com grade numerada, setas de reordenar e botão de remover — exatamente o mesmo padrão já usado em "Fotos da Página Inicial" (`updateHeroImages` espelha `updateHomepageImages`). O botão por foto mudou de "Usar como capa" (define uma só) para um alternador "Adicionar à capa" / "Remover da capa" (multi-seleção). Excluir uma foto da galeria agora também a remove da lista de capa, se estiver lá (mesma proteção já existente para a lista da home).

**Alternativas descartadas**: reaproveitar a lista `homepage_images` já existente para também alimentar o Hero (uma terceira função para a mesma lista, além de cards de serviço e portfólio) — descartada por sobrecarregar um único array com três significados diferentes, o que confundiria a equipe ("se eu adicionar uma 6ª foto, ela entra em qual seção?"). Uma chave de configuração dedicada (`hero_images`) manteve cada seção do admin independente e o texto explicativo de cada uma claro.

**Consequências — atenção real de produção**: como o banco de dados é compartilhado entre desenvolvimento e produção (ver ADR 4), a chave antiga `hero_image_url` já tinha um valor real configurado (uma foto de casamento). Como a chave nova (`hero_images`) começa vazia, **a foto de capa do site volta ao padrão genérico até alguém reabrir Admin → Galeria e adicionar a(s) foto(s) desejada(s) na nova seção "Fotos de Capa (Hero)"** — não foi feita uma migração automática do valor antigo porque isso exigiria uma escrita no banco autenticada (RLS), e decidimos não usar a chave de serviço (`SUPABASE_SERVICE_ROLE_KEY`) para contornar isso a partir de um script, mantendo a política já registrada de que essa chave nunca é usada no projeto (ver ADR relacionado a segurança em `../07-audits/00-auditoria-seguranca.md`).

**Status**: em vigor. Ação pendente do lado do negócio: reconfigurar a(s) foto(s) de capa no admin.
