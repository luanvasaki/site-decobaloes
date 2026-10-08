# Auditoria de UX e Estética Visual

## Objetivo do documento

Registrar os achados de uma auditoria focada em **experiência do usuário e beleza visual** do site em produção (`https://decobaloes.com.br`), página por página, com recomendações do que melhorar para o site ficar mais bonito e mais convincente — sem implementá-las aqui.

## Quando deve ser utilizado

Consulte antes de planejar um ciclo de polimento visual, ao decidir o que entra na próxima rodada de design (`design-manager` → `frontend-manager`), ou ao revisar o conteúdo das páginas com o `content-specialist`.

## Documentos referenciados

- [[03-auditoria-produto-design-arquitetura-tecnologia]] — auditoria anterior; achados já registrados lá não são repetidos, só atualizados quando mudaram.
- `../03-design/00-design-system.md`, `../03-design/01-identidade-visual.md`, `../03-design/02-fluxos-ux.md` — referência do que é "esperado".
- `../06-knowledge/01-decisoes-tecnicas.md` (ADRs 14–20) — decisões de design já tomadas, conferidas antes de reportar qualquer coisa como problema.

## Escopo e método desta execução

- **Dimensão**: UX + estética visual (com a parte de acessibilidade que afeta a aparência: contraste e sobreposição).
- **Páginas**: Início, Catálogo, Galeria, Produto (decoração e material), Sobre, Contato, 404 e tela de login do admin — em desktop (1440px) e celular (390px), com o site em produção, em 2026-10-08.
- **Fora do escopo**: as telas internas do admin (dashboard, formulários) não foram vistas renderizadas, porque exigiriam login com credenciais reais; foram avaliadas só pela tela de login e pela leitura do código.
- **Lentes aplicadas**: design visual (`design-manager`), texto e fotos (`content-specialist`), viabilidade de implementação (`frontend-manager`).

### Contexto importante: trabalho em andamento não publicado

Durante a auditoria, o repositório local tinha alterações **não commitadas** na Home (novas seções "Como funciona", "Depoimentos", modal de orçamento, mudanças no Hero, em `AboutSection` e em `lib/whatsapp.ts`). Essas mudanças **não estão no ar** e foram avaliadas apenas por leitura — os achados 2 e 3 abaixo se referem a elas.

---

## Achados — Prioridade Alta

### 1. Galeria — a página mais bonita do site está escondida
`/galeria` tem hoje 41 fotos reais (Casamentos 14, Aniversários 13, Festa Infantil 8, Chá Revelação 6) e é visualmente a página mais forte do site, mas não aparece no menu nem no rodapé. Ela foi tirada da navegação de propósito (commit `fbe2cb1`, 2026-07-23) por **dois** motivos: (a) o Catálogo passou a ter uma faixa embutida de fotos reais por tema, cobrindo a mesma necessidade sem sair da página; (b) 2 dos 4 temas estavam sem fotos. O motivo (b) não vale mais; o motivo (a) continua valendo — então devolver a Galeria ao menu é **reverter uma decisão consciente**, não corrigir um esquecimento. O `sitemap.ts` já lista `/galeria` e as variações por tema com fotos, então não precisa de mudança.

**Recomendação**: decisão do humano (`design-manager` + `seo-manager` opinam) — devolver ou não "Galeria" ao menu e ao rodapé. Independente disso (`frontend-manager`): ligar os cards "Para cada ocasião" da Home ao Catálogo **já filtrado pelo tema** (hoje os 4 cards levam para `/catalogo` genérico).

**Status (2026-10-08)**: parte dos cards resolvida — cada card leva a `/catalogo?tema=...`. O 4º card também teve o título padrão e a descrição corrigidos para Chá Revelação (resolve o achado 5). Volta da Galeria ao menu: decidida pelo usuário em 2026-10-08 e aplicada (Navbar e Footer).

### 2. (Trabalho em andamento) Depoimentos com nomes e textos inventados
`components/home/TestimonialsSection.tsx` (não commitado) traz depoimentos com nomes de clientes ("Mariana Silveira", "Camila & Lucas", "Renata Albuquerque") e frases que não vêm de clientes reais. Publicar depoimentos fictícios como se fossem reais é propaganda enganosa (Código de Defesa do Consumidor, art. 37) e, se descoberto, destrói justamente a confiança que a seção quer criar.

**Recomendação** (`content-specialist`): só publicar a seção com depoimentos reais, autorizados pelos clientes — por exemplo, prints/avaliações do Google ou do Instagram, com primeiro nome e tipo de festa. Sem depoimentos reais, não publicar a seção.

**Status (2026-10-08)**: por decisão do usuário, a seção foi retirada da Home em andamento (`app/(public)/page.tsx`). O componente `TestimonialsSection.tsx` ficou na pasta, sem uso, para ser reaproveitado quando houver depoimentos reais — trocar o conteúdo antes de reativar.

### 3. (Trabalho em andamento) Botão flutuante de WhatsApp duplicado
O botão flutuante já é renderizado em `app/layout.tsx` (vale para o site inteiro). A alteração local em `app/(public)/layout.tsx` adiciona um **segundo** `<FloatingWhatsAppButton />` — ao publicar, as páginas públicas mostrariam dois botões sobrepostos.

**Recomendação** (`frontend-manager`): manter o botão só no layout público e removê-lo de `app/layout.tsx` (isso também resolve o achado 8).

**Status (2026-10-08)**: resolvido — o botão saiu de `app/layout.tsx` e ficou só em `app/(public)/layout.tsx`. Conferido: 1 botão em `/` e `/catalogo`, nenhum em `/admin/login`.

### 4. Contraste de texto abaixo do legível em pontos-chave
Medição de contraste (fórmula WCAG; mínimo recomendado 4,5:1 para texto pequeno):

| Onde | Combinação | Contraste |
|---|---|---|
| Contato — telefone, e-mail e Instagram | rosa `#F9A8D4` sobre branco | **1,8:1** |
| Rótulos "eyebrow" (CATÁLOGO, PORTFÓLIO, ESPECIALIDADES) | dourado `#D4AF37` sobre branco | **2,1:1** |
| Preço "A combinar" (página de produto) | grafite a 50% sobre branco | **3,0:1** |
| Textos de apoio em `/40` | grafite a 40% sobre branco | **2,4:1** |

Os links de contato são exatamente a informação que o cliente procura nessa página e são o texto menos legível dela.

**Recomendação** (`design-manager` decide os tons, `frontend-manager` aplica): links de contato em grafite com ícone rosa; um dourado mais escuro nos eyebrows (o `#B8960F` da paleta ainda dá só 2,8:1); não usar opacidade abaixo de `/70` em texto (`/60` dá 4,0:1, ainda abaixo do mínimo).

**Status (2026-10-08)**: resolvido nas páginas publicadas — novo token `gold-deep` (`#8A6D08`, 4,9:1) nos eyebrows e no "Foto em breve"; links de contato em grafite negrito; textos `/40`–`/50` passaram para `/70`. Regra registrada em `../03-design/00-design-system.md` (Acessibilidade visual). A mesma regra foi aplicada depois à Home nova (`AboutSection`, `HowItWorksSection`, `HeroContent`) antes do commit dela.

---

## Achados — Prioridade Média

### 5. Card "Chá Revelação" da Home com descrição de festa de debutante
O 4º card de "Para cada ocasião" foi renomeado pelo admin para "Chá Revelação" (os títulos são editáveis), mas a descrição está fixa no código: "Ambientes sofisticados para a festa mais aguardada da adolescência" (`components/home/ServicesSection.tsx:26`, texto de debutante). Título e foto falam de uma festa e o texto, de outra.

**Recomendação** (`content-specialist` + `frontend-manager`): corrigir a descrição agora e tornar a descrição editável junto com o título, para os dois não se desencontrarem de novo.

**Status (2026-10-08)**: descrição corrigida ("Cenários delicados para o momento mais esperado da descoberta."). Tornar a descrição editável no admin continua em aberto.

### 6. Páginas Sobre e Contato não têm nenhuma foto
Num negócio vendido pelo visual, as duas páginas são só texto, ícones e um emoji (💬). No Sobre, o lugar da fundadora é um coração decorativo (achado 11 da auditoria anterior, ainda em aberto e aguardando a foto real de Miriam).

**Recomendação** (`content-specialist`): no Sobre, foto real de Miriam e uma faixa com 3–4 fotos de bastidores/montagem; no Contato, uma foto de decoração montada ao lado do cartão de WhatsApp, no lugar do emoji.

### 7. "A combinar" parece preço desativado
Em todos os produtos o preço é "A combinar", mostrado em cinza claro com ícone de cifrão (página de produto) e em cinza no card do catálogo — visualmente parece "indisponível". O design system reserva o dourado para preço.

**Recomendação** (`design-manager`): tratar como selo positivo, não como preço apagado — ex. "Orçamento personalizado" em dourado escuro, ou removê-lo do card e deixar o botão falar por si.

### 8. Tela de login do admin mostra menu do admin e o WhatsApp público
Quem não está logado já vê a barra lateral completa (Dashboard, Eventos, Produtos…) e o botão flutuante de WhatsApp do site público.

**Recomendação** (`frontend-manager`): na rota `/admin/login`, esconder a `AdminSidebar` (tela de login em tela cheia) e não renderizar o botão de WhatsApp em nenhuma rota `/admin`.

**Status (2026-10-08)**: resolvido — `AdminSidebar`, `AdminMobileNav` e o novo `AdminMobileHeader` não aparecem em `/admin/login` (tela de login em tela cheia); o botão de WhatsApp já não aparecia no admin desde o achado 3.

### 9. Botão flutuante de WhatsApp cobre conteúdo no celular
No celular ele cai em cima do texto do Hero ("…festas especiais…"), da foto do 2º card do Catálogo e do quadro "Paleta de cores" no Produto. Nas páginas de produto ele também repete o botão grande "Alugar via WhatsApp" que já está na tela.

**Recomendação** (`frontend-manager`): reservar espaço inferior no celular (`padding-bottom` no `main`) ou esconder o botão flutuante quando outro botão de WhatsApp estiver visível.

**Status (2026-10-08)**: resolvido — o botão flutuante some (animação de escala) enquanto um botão grande de WhatsApp da página (`WhatsAppButton`, marcado com `data-whatsapp-cta`) está na tela ou logo abaixo da dobra (margem de 25%), e volta quando não há nenhum. No celular ficou um pouco menor (48px) e mais perto do canto.

### 10. Página de produto termina num beco sem saída
Depois do botão "Alugar via WhatsApp" a página acaba em espaço branco. A descrição costuma repetir o próprio nome ("Decoração casamento" → descrição "Decoração casamento"), e decorações mostram "1 unidade disponível", que soa estranho para um serviço montado sob medida.

**Recomendação**: `frontend-manager` — bloco "Outras decorações deste tema" (3–4 cards) e link "Ver fotos reais deste tema" para a Galeria; `content-specialist` — descrições de verdade (o que inclui, para quantas pessoas, estilo); `business-manager` — decidir se "unidades disponíveis" deve aparecer para decorações (faz sentido para materiais).

**Status (2026-10-08)**: parte de `frontend-manager` resolvida — bloco "Outras decorações deste tema" (até 4 itens disponíveis do mesmo tema; para materiais, "Outros materiais para alugar") com link "Ver todas", e link "Ver fotos reais de festas deste tema" para a Galeria abaixo do botão de WhatsApp. Descrições reais (`content-specialist`) e "unidades disponíveis" em decorações (`business-manager`) continuam em aberto.

### 11. Hero repete os mesmos números três vezes
"+25 anos" e "+13.000 festas" aparecem como selos sobre a foto **e** de novo na linha de estatísticas ao lado. "98% satisfação" não tem fonte visível.

**Recomendação** (`content-specialist`): manter os números só em um lugar (a linha de estatísticas) e usar os selos da foto para algo novo (ex. o tema da festa da foto). Confirmar com a empresa se "98% satisfação" vem de algum dado real; se não, retirar.

### 12. Catálogo no celular: abas cortadas e cabeçalho vazio
As abas de tema ficam cortadas na lateral ("Chá Revelação" some) sem nenhuma indicação de que dá para rolar; as abas Decorações/Materiais ficam empilhadas com larguras diferentes. No desktop, o cabeçalho rosa é uma faixa grande só com título. O selo "Casamento" em cada card repete a aba já selecionada.

**Recomendação** (`frontend-manager`): degradê na borda indicando rolagem (ou quebra em 2 linhas) e abas Decorações/Materiais lado a lado no celular; `design-manager` — subtítulo curto ou mini-colagem de fotos no cabeçalho; esconder o selo de categoria quando já há um tema filtrado.

**Status (2026-10-08)**: parte de `frontend-manager` resolvida — abas Decorações/Materiais lado a lado no celular (rótulo curto "Materiais"), abas de tema sem quebrar texto e com degradê na borda direita indicando rolagem. Cabeçalho do Catálogo e selo de categoria repetido continuam em aberto.

---

## Achados — Prioridade Baixa

### 13. Mesmas fotos repetidas pela Home
As fotos dos cards "Para cada ocasião" e as primeiras do carrossel "Nossas decorações" são as mesmas (mesa de casamento, arco "Happy Birthday", festa do Stitch). A Galeria também tem algumas fotos quase idênticas lado a lado.

**Recomendação** (`content-specialist`): escolher fotos diferentes para cada seção e retirar quase-duplicatas da Galeria (Admin → Galeria).

### 14. Texto no feminino ("Pronta", "juntas")
"Pronta para planejar sua festa dos sonhos?" (Home e Contato), "vamos criar juntas" (Sobre e Contato) — noivos, pais e clientes corporativos também contratam.

**Recomendação** (`content-specialist`): versões neutras ("Vamos planejar a sua festa dos sonhos?", "vamos criar juntos/em conjunto").

**Status (2026-10-08)**: resolvido — Home ("Vamos planejar a sua festa dos sonhos?"), Contato ("Vamos tirar a sua festa dos sonhos do papel? Entre em contato e criamos algo especial para você.") e Sobre ("vamos criar, lado a lado, uma decoração…").

### 15. Domínio novo, e-mail ainda é Gmail
Com `decobaloes.com.br` no ar, `miriamvasaki@gmail.com` no Contato e no rodapé destoa da imagem "boutique".

**Recomendação** (`infrastructure-manager`): criar `contato@decobaloes.com.br` (ex. Google Workspace ou encaminhamento gratuito via Registro.br/ImprovMX) e trocar no site.

### 16. Página 404 sem menu nem rodapé
A 404 é só balão + mensagem + botão no meio de uma tela branca, sem logo nem menu.

**Recomendação** (`frontend-manager`): mover `not-found.tsx` para dentro do layout público (com Navbar/Footer) e oferecer atalhos (Catálogo, Galeria).

**Status (2026-10-08)**: resolvido — conteúdo comum em `components/shared/NotFoundMessage.tsx` (atalhos Catálogo, Galeria, Início); `app/not-found.tsx` (endereços inexistentes) monta Navbar/Footer/WhatsApp; `app/(public)/not-found.tsx` cobre `notFound()` do site público; novo `app/admin/not-found.tsx` utilitário, para um registro inexistente no admin não cair na 404 com o menu do site público.

**Observação para `seo-manager`** (pré-existente, não causada por esta mudança): `/produto/<slug-inexistente>` responde HTTP 200 em vez de 404 — o `loading.tsx` do layout público faz a resposta começar por streaming antes de `notFound()` ser chamado. O Next já injeta `<meta name="robots" content="noindex">`, então não é indexada, mas é um "soft 404".

### 17. Botão do WhatsApp com texto branco sobre verde claro
Branco sobre `#25D366` dá 2,0:1. É a cor oficial do WhatsApp e o botão é grande/negrito, então o impacto é menor — mas é o botão mais importante do site.

**Recomendação** (`design-manager`): considerar o verde escuro do WhatsApp (`#128C7E`/`#075E54`) no fundo, ou texto grafite. Decisão de marca — o design system já trata o verde como intocável, então precisa de decisão explícita.

---

## Pontos positivos

- A identidade (rosa + dourado + grafite, Playfair só na palavra de destaque, cantos generosos) é coerente em todas as páginas públicas — nada parece "de outro site".
- O layout bento de "Para cada ocasião" e a composição em camadas do Hero dão personalidade real à Home.
- A Galeria tem fotografia autêntica, bem organizada por tema, com contagem por aba — é a melhor vitrine do trabalho da empresa.
- O rodapé escuro e a faixa final "Pronta para planejar…" fecham as páginas com uma chamada clara.
- O celular é bem resolvido no geral: nada quebra, as grades seguem a progressão 1→2→3→4 colunas do design system.

## Ordem sugerida (sugestão — a decisão é de quem recebe o relatório)

1. **Rápidos e de alto efeito**: 1, 4, 5 e 14 — feitos.
2. **Antes de publicar a Home nova**: 2 (depoimentos reais) e 3 (botão duplicado).
3. **Rodada de design**: 7, 10, 11, 12.
4. **Depende de material da empresa**: 6 (fotos da Miriam e de bastidores), 13 (curadoria de fotos), 15 (e-mail).
