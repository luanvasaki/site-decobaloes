# Design System

## Objetivo do documento

Documentar os elementos visuais reutilizáveis do projeto — cores, tipografia, espaçamento, sombras, ícones, componentes e animações — como referência para manter consistência visual em qualquer tela nova.

## Quando deve ser utilizado

Consulte antes de escrever uma cor, tamanho ou espaçamento "no olho" em uma tela nova, ou ao criar um componente visual que deveria seguir um padrão já existente.

## Documentos referenciados

- [[01-identidade-visual]]
- [[02-fluxos-ux]]
- `../04-development/01-padroes-codigo.md`

---

## Cores

### Paleta de marca (definida no tema)

| Cor | Uso | Valor |
|---|---|---|
| **Primary (rosa)** | Cor "amigável" da marca — fundos suaves, estado ativo de navegação, anéis de foco | `#F9A8D4`, com escala de 50 (`#fdf2f8`, quase branco) até 500 (`#ec4899`, rosa mais saturado) |
| **Gold (dourado)** | Acento "premium" — preços, estrelas de avaliação, borda da miniatura ativa na galeria, rótulos de destaque, metade "balões" da logo | `#D4AF37`, com variação clara `#E8C84A` e escura `#B8960F` |
| **Slate (grafite/azul-marinho)** | Texto principal, títulos, fundo de seções sérias (rodapé, menu do admin) — quase sempre usado com opacidade (`/70`, `/50`, `/40`...) em vez da escala de tons | `#1E293B` |
| **WhatsApp (verde)** | Reservada exclusivamente para os botões de WhatsApp — nunca reaproveitada como "verde de sucesso" genérico | `#25D366`, com variações mais escuras para hover |

### Cores semânticas (usadas principalmente no admin)

O site público quase não usa cores fora da paleta de marca. O admin, por lidar com estado/dados, usa a paleta padrão do Tailwind para comunicar significado:

- **Perigo/destrutivo** (excluir, "Indisponível", status "Cancelado", pagamento "Pendente"): tons de vermelho.
- **Sucesso** (disponível, "Concluído", pagamento "Pago", "Montagem inclusa"): tons de verde.
- **Atenção** ("Em andamento", pagamento "Parcial", avisos de upload): tons de amarelo/âmbar.
- **Neutro/informativo** (status "Confirmado"): tons de azul.

### Mapa de cor de status de evento (referência exata)

| Status do evento | Cor |
|---|---|
| Orçamento | cinza |
| Confirmado | azul |
| Em andamento | amarelo |
| Concluído | verde |
| Cancelado | vermelho |

| Status de pagamento | Cor |
|---|---|
| Pendente | vermelho |
| Parcial | amarelo |
| Pago | verde |

### Observação técnica

O projeto também tem um conjunto de variáveis de cor "estilo shadcn" (tokens semânticos como `border`, `background`, `destructive`) definidas para dar suporte à biblioteca de componentes — mas, na prática, quase nenhum componente usa esses tokens diretamente; a maioria dos componentes escreve a cor da marca diretamente (em hexadecimal) em vez de referenciar o token semântico. Um novo desenvolvedor não deve presumir que mudar o token vai mudar a aparência do site — a maior parte das cores está "hardcoded" nos próprios componentes.

## Tipografia

### Fontes

- **Nunito** — fonte do corpo do texto, em praticamente todos os pesos (de fino a extra-negrito).
- **Playfair Display** — fonte de destaque, usada de forma bastante restrita: só em peso negrito e itálico, e só para **uma palavra de destaque dentro de um título**, nunca para um título inteiro (ex.: "Decorações que *encantam* cada momento", com "encantam" em Playfair itálico rosa). É um recurso de assinatura visual, não uma fonte de uso geral.

### Hierarquia de peso

Da mais usada para a menos usada: **extra-negrito** (títulos, preços, nome da marca) → **negrito** (botões, badges) → **semi-negrito** (rótulos, links de navegação, títulos de cartão) → médio (uso raro).

### Escala de tamanho na prática

- Corpo de texto e rótulos: predominantemente pequenos (o tamanho mais comum do projeto, especialmente no admin).
- Títulos de seção: médios a grandes.
- Título principal (hero da home): o maior tamanho do site, crescendo bastante do celular para o desktop.
- Rótulos "eyebrow" (pequenos textos acima de um título, ex. "Especialidades"): sempre em caixa alta, negrito, tamanho pequeno, com letras bem espaçadas.

## Espaçamento e layout

- **Padding vertical de seção**: praticamente toda seção do site público usa um respiro generoso entre o conteúdo e as bordas superior/inferior — não existe seção "apertada" no site público.
- **Largura de conteúdo**: a maior parte das páginas limita o conteúdo a uma largura confortável de leitura, centralizada, com margem lateral mínima garantida; o hero da home é a seção mais larga do site, e páginas de texto (Sobre, Contato) são mais estreitas que páginas de grade (Catálogo).
- **Grades de produto/portfólio**: sempre começam em 1 coluna no celular e crescem progressivamente (2 → 3 → 4 colunas) conforme a tela aumenta.

## Grid

O projeto não usa um sistema de grid formal (sem número fixo de "colunas" declarado globalmente, como um grid de 12 colunas) — cada seção define sua própria grade conforme o conteúdo, usando o sistema de grade do Tailwind ponto a ponto. Ainda assim, alguns padrões se repetem o suficiente para funcionar como convenção:

- **Largura de contêiner**: o conteúdo de página fica sempre centralizado, com uma margem lateral mínima garantida. A largura mais comum acomoda a maioria das seções e páginas de grade (ex. Catálogo); uma largura mais estreita é reservada para páginas de leitura/texto corrido (Sobre, Contato); e a largura mais generosa do site é usada uma única vez, na seção principal da Home (hero).
- **Progressão de colunas em grades de cartão** (produtos, fotos de portfólio): sempre `1 coluna → 2 (telas pequenas) → 3 (telas médias/grandes) → 4 (telas grandes)`, nessa ordem, sem pular etapas. Nenhuma grade do site público começa em mais de 1 coluna no celular.
- **Grades administrativas** (formulários, cartões de indicador do Dashboard): mais simples, tipicamente `1 coluna → 2 colunas`, com aumento adicional para 3 apenas em pontos específicos (ex. cartões de indicador do Dashboard).
- **Espaçamento entre itens de grade (gap)**: pequeno e consistente em grades de cartão (fotos, produtos); maior nas grandes divisões de seção de duas colunas (ex. hero, blocos "imagem + texto").
- **Exceção conhecida**: como já registrado na seção de Responsividade abaixo, algumas grades internas do formulário de produto não seguem essa progressão — ficam fixas em 2-3 colunas independentemente do tamanho de tela, quebrando o padrão do restante do projeto.

## Bordas, sombras e cantos

- **Cantos arredondados generosos** são a assinatura visual do projeto — não existe elemento de canto reto no site público. Cartões e imagens usam arredondamento médio a grande; botões usam arredondamento médio a total (pílula); badges/selos são sempre totalmente arredondados (pílula).
- **Sombras suaves**, nunca duras — usadas para dar profundidade a cartões e imagens em destaque, com uma versão mais intensa reservada para o estado de "passar o mouse" (hover).
- **Ponto de atenção técnico**: existem duas definições diferentes para a mesma sombra "suave" em dois arquivos de configuração diferentes do projeto, uma sobrescrevendo a outra silenciosamente. Não é um problema visual grave (os dois valores são próximos), mas é um resíduo de duplicação que um novo desenvolvedor não deve replicar — se for mexer nessa sombra, unifique a definição em um só lugar.

## Ícones

Uma única biblioteca de ícones é usada em todo o projeto (site público e admin), sem exceções. Tamanhos pequenos predominam (ícones inline em botões e textos); tamanhos grandes e bem apagados (baixa opacidade) são reservados para ilustrar estados vazios. Um ícone sozinho, sem texto ao lado, sempre tem uma descrição para leitor de tela associada ao botão/link que o contém.

## Componentes de UI reutilizáveis

- **Botão principal**: dois estilos convivem — um escuro (grafite) para ações "sérias" (salvar um formulário) e um em tom de marca (rosa/dourado) para chamadas mais leves. Botões de WhatsApp têm sua própria identidade visual fixa (verde, arredondado, texto branco em negrito) e nunca usam outra cor.
- **Botão secundário**: contorno sutil, fundo claro/transparente, sempre ao lado de um botão principal em formulários (padrão "salvar + cancelar").
- **Cartões de produto**: sem borda nem sombra em repouso — o destaque visual acontece só ao passar o mouse (a imagem aumenta ligeiramente e um selo "Ver detalhes" desliza para cima sobre uma camada escura).
- **Cartões de listagem do admin**: fundo levemente destacado do branco, com uma borda muito sutil, sem sombra.
- **Selos/badges**: sempre em formato de pílula, texto pequeno e em negrito, cor de fundo clara pareada com texto da mesma família de cor mais escura (ex. fundo verde claro + texto verde escuro).
- **Campos de formulário**: cantos arredondados, borda sutil em repouso, anel de foco rosa ao clicar, borda e anel vermelhos quando o campo está com erro. Rótulos em negrito pequeno; mensagens de erro em vermelho pequeno logo abaixo do campo.
- **Interruptor de disponibilidade** (produtos): não é um "switch" tradicional — é um ícone que alterna entre dois estados visuais (ligado/desligado) com um indicador de carregamento durante a operação.
- **Grade "bento"** (2026-07-21, `ServicesSection`): quando uma grade tem um item que merece mais destaque que os outros (ex. o primeiro serviço/categoria), usar um layout bento em telas grandes — um bloco maior (2 colunas × 2 linhas) para o item de destaque, um bloco largo (2×1) e dois pequenos (1×1) para o restante — em vez de uma grade uniforme. Em telas pequenas, cai para 1 coluna normalmente.
- **Placeholder de "sem foto"**: nunca usar duas tonalidades quase idênticas de rosa (ex. ícone `primary-200` sobre fundo `primary-50`) — o contraste fica baixo demais e o card parece quebrado/vazio em vez de comunicar "sem foto ainda". Usar o rosa de marca (`#F9A8D4`) para o ícone sobre um gradiente sutil, com um texto pequeno explicando o estado (ex. "Foto em breve").
- **Composição em camadas** (2026-07-21, Hero da Home): quando uma seção tem uma foto grande de destaque, considerar sobrepor uma segunda foto menor, estilo "polaroid" (borda branca grossa, sombra, leve rotação), escapando da moldura da foto principal — dá um ar editorial/boutique em vez de uma única foto isolada. Usar como acento decorativo (pode ser uma imagem estática, não precisa ser configurável pelo admin); esconder em telas pequenas se o layout empilhado ficar apertado.
- **Fotos levemente desalinhadas** (2026-07-21, portfólio da Home): em galerias de fotos reais (não produtos comerciais), uma leve rotação alternada (±1°) e cantos assimétricos (um canto bem mais arredondado que os outros) reforçam a sensação de "fotos reais coladas", em vez de uma grade perfeitamente geométrica. Desfazer a rotação no hover (`hover:rotate-0`) para o item ganhar destaque ao ser observado de perto. Não aplicar esse tratamento a cartões de produto/comerciais — lá a grade permanece limpa e alinhada de propósito, para comunicar organização/confiabilidade.

## Animação e microinterações

- **Entrada de elementos**: o padrão do projeto é aparecer com um leve deslizamento (de baixo para cima, ou lateralmente em seções de duas colunas) combinado com um esmaecimento (fade), disparado quando o elemento entra na tela ao rolar a página. Elementos em sequência (como cartões de uma grade) entram em cascata, com um pequeno atraso entre um e outro.
- **Interações de toque/clique**: botões e o botão flutuante de WhatsApp reagem com uma leve mudança de escala (cresce um pouco ao passar o mouse, encolhe um pouco ao clicar).
- **Menu mobile**: abre e fecha com uma animação suave de altura/opacidade, não é um corte abrupto.
- **Troca de foto na galeria do produto**: transição suave de esmaecimento combinada com um leve zoom, não é um corte abrupto entre uma foto e outra.
- **Botão flutuante de WhatsApp**: tem um efeito de "pulso" contínuo (um anel que se expande e desaparece) chamando atenção para o botão sem ser intrusivo.
- **Duração**: interações pequenas (hover de botão) são rápidas; transições de imagem maiores (zoom de foto de produto) são mais lentas e suaves.
- **Indicador deslizante em abas** (2026-07-21, abas de tema do Catálogo): quando várias opções de aba compartilham exatamente o mesmo estilo de "ativo" (mesma cor), usar um indicador (`pill`) que desliza suavemente de uma aba para outra (`framer-motion`, `layoutId` compartilhado) em vez de só trocar a cor de fundo instantaneamente — sensação mais polida. Não usar esse padrão quando abas vizinhas têm cores de "ativo" intencionalmente diferentes (ex. as abas Decorações/Materiais do Catálogo, rosa vs. dourado) — nesse caso a cor já comunica a diferença, e um pill compartilhado misturaria o código de cor.

## Responsividade — convenção de breakpoints

O projeto segue consistentemente a progressão padrão do Tailwind (celular → tablet pequeno → tablet/desktop pequeno → desktop grande), com o ponto de tablet/desktop pequeno sendo o mais usado no projeto inteiro — é onde o menu do admin troca de barra inferior (celular) para menu lateral (desktop), e onde a maioria das grades de conteúdo ganha sua segunda coluna.

**Inconsistência conhecida**: o formulário de produto tem algumas grades internas (seletor de tipo de item, opções de porte do evento) que **não** têm nenhum ajuste por tamanho de tela — ficam fixas em 2 ou 3 colunas mesmo no celular, diferente de todas as outras grades do projeto, que sempre reduzem para 1 coluna em telas pequenas. Isso pode apertar visualmente esses trechos específicos em celulares estreitos. Vale corrigir ao mexer nesse formulário, seguindo o mesmo padrão responsivo do resto do projeto (ver também `../07-audits/02-auditoria-codigo.md`).

## Dark Mode

**Não existe modo escuro implementado neste projeto.** O arquivo de configuração do Tailwind tem a opção de dark mode habilitada na configuração (`darkMode: ['class']`) — provavelmente um resíduo da inicialização do shadcn/ui, que ativa essa opção por padrão — mas:

- Não há nenhum controle na interface (botão, menu) para alternar entre claro e escuro, em nenhuma página pública ou do admin.
- Não há nenhuma classe `dark:` aplicada a nenhum componente do projeto — mesmo que o modo escuro fosse ativado manualmente (ex. via ferramenta de desenvolvedor do navegador), a aparência do site não mudaria, porque nenhum estilo alternativo foi escrito.
- As cores da marca (rosa claro, dourado, fundo branco) foram pensadas para um fundo claro — não há garantia de contraste ou legibilidade adequados se um modo escuro fosse introduzido sem um trabalho de adaptação dedicado.

**Se o modo escuro vier a ser considerado no futuro**, não é uma tarefa de "ativar uma opção" — exigiria revisar a paleta inteira (a cor `slate` usada como texto principal, por exemplo, precisaria de um par claro equivalente) e adicionar as variantes `dark:` correspondentes componente por componente.

## Acessibilidade visual

Pontos relevantes de acessibilidade ligados especificamente à aparência (cor, contraste, tamanho) — para acessibilidade de interação (teclado, leitores de tela, rótulos), ver `../01-product/04-paginas-publicas.md`, `../01-product/05-paginas-admin.md` e `../02-fluxos-ux.md`.

- **Nenhuma informação depende só da cor**: os selos de status (evento e pagamento) sempre combinam cor com texto escrito ("Confirmado", "Pago") — quem não distingue bem as cores ainda consegue ler o estado pelo texto. Isso é uma boa prática já seguida de forma consistente no projeto.
- **Texto principal usa grafite escuro (`#1E293B`), não preto puro** — uma escolha estética comum (suaviza o visual), mas que reduz ligeiramente o contraste em relação a um preto absoluto. Não foi medido formalmente neste projeto se todas as combinações de texto sobre fundo atingem os níveis recomendados de contraste (WCAG AA) — é uma verificação recomendada, especialmente em textos usados com opacidade reduzida (`/70`, `/50`, `/40`), que ficam ainda mais claros e podem se aproximar do limite de legibilidade sobre fundo branco.
- **Anel de foco rosa claro** (`#F9A8D4` a 40% de opacidade) é o indicador visual de foco em campos de formulário e botões — visível sobre fundo branco/claro, mas não foi verificado sobre todos os fundos possíveis do site (ex. seções com fundo colorido).
- **Texto sobre fotos** (cartões de serviço da Home) sempre usa uma camada escura em gradiente por trás do texto branco, especificamente para garantir legibilidade sobre uma imagem de fundo variável — um cuidado de contraste já aplicado corretamente.
- **Tamanho mínimo de texto**: o tamanho de fonte mais pequeno usado no projeto ainda é legível em tela, mas é usado com frequência (rótulos, texto de tabela no admin) — vale atenção redobrada a não reduzir ainda mais esse tamanho em telas novas.
- **Recomendação geral**: nenhuma auditoria formal de contraste (com ferramenta automatizada) foi rodada neste projeto até o momento desta documentação — os pontos acima são observações de padrão, não medições. Vale considerar rodar uma verificação de contraste automatizada antes de publicar uma peça visual nova que dependa de texto sobre uma cor de fundo não testada antes.

## Boas práticas

Resumo prático para quem for criar uma tela ou componente novo, reunindo as recomendações já detalhadas acima:

- **Não escreva uma cor em hexadecimal "no olho"** — use uma das cores já documentadas na paleta de marca ou uma cor semântica já estabelecida (vermelho/verde/amarelo/azul) conforme o significado, não uma cor nova.
- **Reserve o verde do WhatsApp exclusivamente para ações de WhatsApp** — nunca o reaproveite como "verde de sucesso" genérico; use os tons de verde padrão do Tailwind para isso.
- **Use a fonte Playfair apenas como destaque de uma palavra dentro de um título**, nunca para um título inteiro ou para corpo de texto.
- **Siga a progressão de grade já estabelecida** (1 coluna no celular, crescendo por breakpoint) em qualquer grade nova — não deixe uma grade fixa em várias colunas sem ajuste responsivo (é exatamente o erro já identificado no formulário de produto).
- **Cantos arredondados e sombras suaves são a assinatura visual do projeto** — evite cantos retos ou sombras duras em elementos novos do site público.
- **Nunca comunique um estado só pela cor** — sempre combine cor com texto ou ícone reconhecível (como já é feito nos selos de status).
- **Não presuma que existe um sistema de notificação toast disponível** — ele está instalado mas não é usado; siga os padrões reais de feedback documentados em `../02-fluxos-ux.md`.
- **Teste o contraste de qualquer combinação de cor nova** (texto sobre fundo colorido ou sobre foto), já que nenhuma auditoria formal de contraste foi feita até hoje.
- **Ao criar um componente reutilizável, confira primeiro se um padrão equivalente já existe** (botão, badge, card, input) antes de inventar um novo — a consistência visual do projeto depende de reaproveitar os padrões já documentados aqui, não de multiplicar variações.
