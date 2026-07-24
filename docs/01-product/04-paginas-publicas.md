# Páginas Públicas — Detalhamento Completo

## Objetivo do documento

Descrever em profundidade cada página do site público: objetivo, quem utiliza, componentes, fluxo do usuário, estados possíveis, erros possíveis, regras, SEO, acessibilidade e responsividade.

## Quando deve ser utilizado

Consulte ao alterar, revisar ou testar qualquer página do site público, ou ao especificar uma funcionalidade nova nessa área.

## Documentos referenciados

- [[00-visao-produto]]
- [[01-funcionalidades]]
- [[06-fluxos-navegacao]]

---

## Elementos compartilhados por todas as páginas públicas

Antes de entrar em cada página, estes elementos aparecem em todas elas e são descritos uma única vez aqui.

### Layout raiz e cabeçalho/rodapé

- **Idioma da página**: português do Brasil.
- **Fontes**: Nunito (texto) e Playfair Display (destaques em itálico, ex. "encantam", "ocasião").
- **Navbar** (cabeçalho, fixo no topo): transparente até o visitante rolar a página, depois ganha fundo branco. Contém logo + nome da marca (link para Início), 4 links (Início, Catálogo, Sobre, Contato — o link da página atual fica destacado), um botão "Pedir orçamento" que abre o WhatsApp, e um menu hambúrguer em telas pequenas que abre um painel com os mesmos links.
- **Footer** (rodapé, em 3 colunas): marca, navegação (mesmos 4 links), informações de contato (endereço, WhatsApp, e-mail, Instagram). No rodapé de baixo, além dos direitos autorais, existe um pequeno ícone de cadeado quase invisível — é o único caminho de acesso à área administrativa a partir do site público.
- **Botão flutuante de WhatsApp**: aparece no canto inferior direito, em toda página (inclusive na 404), com uma leve animação de entrada e um efeito pulsante. Abre uma conversa de WhatsApp com uma mensagem genérica pré-preenchida.
- **Página 404** (qualquer URL que não exista): mensagem "Página não encontrada" com um único botão para voltar ao Início. Não tem o cabeçalho/rodapé do site — é uma tela isolada.

### O mecanismo de conversão do site

Toda "chamada para ação" do site público — seja no cabeçalho, num botão de página ou no botão flutuante — leva ao WhatsApp com uma mensagem já escrita. Existem dois tipos de mensagem:
- **Genérica**: usada no botão flutuante, no cabeçalho e nas páginas Início/Sobre/Contato — algo como "Olá Decobalões! Gostaria de mais informações sobre seus produtos."
- **Específica de produto**: usada na página de detalhe de um item — menciona o nome do produto, perguntando sobre disponibilidade para a festa do visitante.

Não existe, em nenhuma página pública, um formulário de contato, carrinho de compras ou qualquer forma de finalizar um pedido dentro do site.

### Infraestrutura de SEO (aplicada a todas as páginas)

- Todas as páginas públicas estão listadas em um mapa do site (sitemap) gerado automaticamente, incluindo uma entrada para cada produto individual e para cada combinação de categoria do catálogo.
- Um arquivo de regras para buscadores libera a indexação de todo o site público e bloqueia explicitamente a área administrativa.
- Existe um manifesto de aplicativo (permite "instalar" o site como um atalho no celular), com nome, cor de tema e ícone da marca.
- Não há nenhum dado estruturado (o tipo de marcação que ajuda o Google a mostrar informações ricas nos resultados de busca, como endereço/telefone de negócio local) em nenhuma página — uma oportunidade de melhoria ainda não aproveitada, especialmente na página de Contato.

---

## Página: Início (`/`)

### Objetivo
Primeira impressão da marca — gerar confiança através de estatísticas de experiência e portfólio, e conduzir o visitante ao Catálogo ou direto ao WhatsApp.

### Quem utiliza
A maioria absoluta dos visitantes — quem chega por indicação, redes sociais ou busca cai aqui primeiro.

### Componentes
1. **Seção Hero**: foto grande em destaque (com duas etiquetas sobrepostas: "+25 anos" e "+13.000 festas realizadas") ao lado de um bloco de texto com título, descrição, estatísticas (98% satisfação / +13.000 festas / +25 anos) e dois botões — WhatsApp e "Ver Catálogo".
2. **Seção de Serviços**: grade de 4 cartões grandes com foto, cada um representando uma categoria de festa (ex. Casamentos, Aniversários) — todos levam ao Catálogo. As fotos e os títulos desses 4 cartões são editáveis pela equipe no admin.
3. **Seção de Portfólio**: galeria horizontal (arrasta/rola para o lado) de fotos de trabalhos realizados, com indicadores de posição (bolinhas) e um botão de WhatsApp abaixo.
4. **Chamada final**: seção de fundo escuro convidando a planejar a festa, com botão de WhatsApp e link para o Catálogo.

### Fluxo do usuário
Visitante chega → lê a proposta de valor e as estatísticas → pode clicar em WhatsApp ou "Ver Catálogo" a qualquer momento → rola até os 4 cartões de serviço (todos levam ao Catálogo geral, não a um tema específico) → rola/arrasta a galeria de portfólio (fotos apenas, não abrem em tela cheia) → chega à chamada final → clica em WhatsApp ou Catálogo. Nenhum conteúdo da página leva diretamente a Sobre ou Contato — só o cabeçalho/rodapé alcançam essas páginas.

### Estados possíveis
Praticamente sempre "cheia" — se a equipe ainda não configurou fotos/títulos no admin, a página usa fotos e textos padrão de reserva, então nunca aparece vazia ou quebrada para o visitante.

### Erros possíveis
Se a busca de configurações (fotos, títulos) falhar por qualquer motivo, a página simplesmente usa os valores padrão de reserva — o visitante não percebe nenhuma falha visível.

### Regras
A(s) foto(s) de capa, as fotos da home e os títulos dos 4 cartões de serviço são configuráveis pela equipe no admin; os títulos só são aplicados se exatamente 4 forem definidos, caso contrário os padrões são usados. Se mais de uma foto de capa for configurada, elas alternam automaticamente no Hero a cada 5 segundos, com transição suave (2026-07-21).

### SEO
Não define título/descrição própria — usa o título e a descrição padrão de todo o site ("Decobalões — Decorações para Festas"). É a página de maior prioridade no mapa do site.

### Acessibilidade
Estrutura semântica com um título principal (H1) na seção de introdução. As fotos têm texto alternativo, mas o das fotos da seção de Portfólio é genérico e repetido (não descreve cada foto individualmente); as fotos dos 4 cartões de serviço usam o próprio título do serviço como texto alternativo (mais descritivo). As bolinhas indicadoras da galeria têm identificação individual para leitores de tela.

### Responsividade
Layout empilha em coluna única no celular e vira duas colunas lado a lado em telas maiores. A grade de serviços vai de 1 para 2 colunas. Os cartões da galeria horizontal ajustam a largura conforme o tamanho da tela.

---

## Página: Catálogo (`/catalogo`)

### Objetivo
Página comercial central — navegar todo o inventário (decorações organizadas por tema de festa, e materiais disponíveis para locação) e levar o visitante a um produto específico ou direto ao WhatsApp.

### Quem utiliza
Visitantes já comparando opções para um tipo de evento específico (casamento, aniversário, festa infantil, chá de bebê) ou procurando itens avulsos para alugar.

### Componentes
- Duas abas principais: "Decorações" e "Aluguel de Materiais".
- Dentro de Decorações, sub-abas por tema (Casamentos, Aniversários, Festa Infantil, Chá Revelação), cada uma mostrando a grade de "Pacotes disponíveis" (cartões de produto daquele tema).
- Faixa de fotos reais daquele tema (até 4, com link "Ver todas" para a Galeria completa) — ver nota de mudança de 2026-07-23 abaixo.
- Dentro de Materiais: grade de produtos do tipo material, ou um aviso "Em breve" se ainda não há nenhum cadastrado.
- **Cartão de produto**: foto (ou ícone de espaço reservado se não houver foto), selo da categoria, nome, preço (ou "A combinar"), indicação de "Montagem inclusa" quando aplicável — o cartão inteiro é clicável e leva à página do produto.

> **Nota de mudança (2026-07-21)**: até esta data, cada tema também exibia uma grade de fotos de portfólio ("Trabalhos realizados") acima dos produtos, com um visualizador de fotos em tela cheia. Essa seção foi removida do Catálogo por decisão de design — o mesmo tratamento visual das duas grades (fotos quadradas, cantos arredondados, mesmo efeito de hover) gerava confusão sobre o que era alugável e o que era só uma foto de referência. O portfólio geral continua disponível na Home; ver ADR correspondente em `../06-knowledge/01-decisoes-tecnicas.md`.

> **Nota de mudança (2026-07-23)**: um banner que levava à Galeria (`/galeria?tema=X`, navegação completa) foi substituído por uma faixa compacta de até 4 fotos reais daquele mesmo tema, embutida na própria tela — com o tratamento visual "orgânico" reservado a fotos reais (rotação leve, cantos assimétricos), distinto do tratamento limpo dos cartões de produto, evitando repetir a confusão da nota acima. Clicar numa foto abre o visualizador em tela cheia sem sair da página. Um link "Ver todas" ao final da faixa continua levando à Galeria completa daquele tema. A faixa só aparece quando o tema ativo já tem alguma foto real cadastrada.

### Fluxo do usuário
Visitante chega (podendo já vir com um tema pré-selecionado via link) → escolhe entre Decorações ou Materiais → dentro de Decorações, troca de tema → navega os cartões de produto → clica em um cartão → vai para a página de detalhe daquele produto. Toda a navegação de abas/tema é local à página — não recarrega nem busca dados de novo.

### Estados possíveis
Tema com produtos; tema totalmente vazio (mensagem "Nenhum item nesta categoria ainda"); aba de Materiais sem nenhum produto cadastrado ainda (mensagem "Em breve").

### Erros possíveis
Se a busca de produtos ou categorias falhar, a página degrada para os estados vazios descritos acima, sem travar. Um tema inválido ou desconhecido na URL é silenciosamente ignorado, caindo no primeiro tema padrão (Casamentos).

### Regras
Só produtos marcados como disponíveis aparecem no catálogo. Produtos são divididos entre "decoração" e "material". O mapeamento de qual categoria pertence a qual tema é fixo no código, não editável pelo admin. Preço "A combinar" sempre que não houver valor definido.

### SEO
Tem título e descrição próprios ("Catálogo | Decobalões"). Tanto a URL base quanto cada variação por tema estão listadas no mapa do site.

### Acessibilidade
As abas de navegação não usam a marcação de acessibilidade própria para abas — são botões comuns (ainda assim navegáveis por teclado, com indicação visual de foco). Os cartões de produto usam texto alternativo específico do nome do produto (não genérico).

### Responsividade
As abas de tema rolam horizontalmente em telas pequenas. A grade de produtos vai de 2 a 4 colunas dependendo do tamanho da tela.

---

## Página: Galeria (`/galeria`)

*(Adicionada em 2026-07-22 — ver ADR 20 em `../06-knowledge/01-decisoes-tecnicas.md`. Criada para devolver ao visitante uma forma de navegar fotos reais por tema, depois que essa grade foi removida do Catálogo por confundir com os produtos — ver ADR 14.)*

**Atualização (2026-07-23)**: a página saiu do Navbar/Footer (não é mais um destino de navegação principal) depois de uma rodada de discussão entre as Skills de domínio — o Catálogo passou a mostrar uma faixa de fotos reais embutida (com lightbox in-place), cobrindo a mesma necessidade sem exigir sair da página. A rota `/galeria` continua existindo e acessível (sem redirect, sem 404) — só não tem mais link no menu; o único caminho interno restante é o "Ver todas" ao final da faixa de fotos do Catálogo (só aparece quando o tema ativo já tem fotos reais).

### Objetivo
Deixar o cliente navegar por fotos reais de festas já decoradas, organizadas por tema, para se inspirar e decidir o estilo antes de entrar em contato — sem misturar com o catálogo de produtos alugáveis.

### Quem utiliza
Visitantes que chegam direto pela URL (compartilhada ou indexada por busca) ou pelo link "Ver todas" ao final da faixa de fotos do Catálogo, já filtrados pelo mesmo tema ativo.

### Componentes
- Abas por tema (Casamentos, Aniversários, Festa Infantil, Chá Revelação — as mesmas do Catálogo), cada uma com a contagem de fotos entre parênteses e um indicador deslizante animado ao trocar de aba (mesmo padrão do Catálogo).
- Grade de fotos do tema ativo, com o tratamento visual "orgânico" (leve rotação alternada, cantos assimétricos, desfaz ao passar o mouse) — o mesmo estilo já usado no portfólio da Home, reservado para fotos reais (nunca para produtos).
- Clique em qualquer foto abre o visualizador em tela cheia (mesmo componente já usado no site), com navegação por setas/teclado.
- Chamada final de WhatsApp ("Gostou de algum estilo?").

### Fluxo do usuário
Visitante chega (direto, pelo menu, ou pelo link do Catálogo já com um tema pré-selecionado via `?tema=`) → escolhe/confirma o tema → navega a grade de fotos → abre o visualizador em uma foto de interesse, navega entre as fotos daquele tema → fecha o visualizador → clica no WhatsApp ao final da página.

### Estados possíveis
Tema com fotos (grade populada); tema sem nenhuma foto ainda (estado vazio "Ainda não temos fotos nesta categoria"); visualizador de foto aberto ou fechado.

### Erros possíveis
Se a busca de fotos falhar, a página degrada para o estado vazio em todos os temas, sem travar (mesmo padrão de resiliência das demais páginas). Um tema inválido/desconhecido na URL é ignorado, caindo no primeiro tema padrão.

### Regras
As fotos exibidas são exatamente as mesmas cadastradas pela equipe em Admin → Galeria, por categoria — esta página não tem cadastro próprio, é só uma leitura organizada do mesmo conteúdo. A contagem ao lado de cada aba reflete o número real de fotos daquele tema.

### SEO
Tem título e descrição próprios ("Galeria | Decobalões"). A URL base está listada no mapa do site; cada variação por tema (`?tema=`) só entra no mapa do site se aquele tema já tiver ao menos uma foto real cadastrada — evita indexar como conteúdo uma aba que hoje mostra só o estado vazio (thin content).

### Acessibilidade
Cada foto tem texto alternativo específico (tema + número da foto, não genérico). Botão de ampliar tem rótulo descritivo. O visualizador em tela cheia mantém o mesmo padrão já elogiado do Catálogo (rótulos claros, totalmente navegável por teclado).

### Responsividade
Abas de tema rolam horizontalmente em telas pequenas. A grade de fotos vai de 2 colunas (celular) a 4 colunas (desktop).

---

## Página: Produto (`/produto/[slug]`)

### Objetivo
Converter interesse em uma conversa de WhatsApp sobre um item específico — mostrando fotos, especificações, preço e disponibilidade.

### Quem utiliza
Visitantes que clicaram em um cartão do Catálogo, ou que chegaram por um link direto/compartilhado/indexado no Google.

### Componentes
- Link "Voltar ao catálogo" no topo.
- **Galeria do produto**: foto principal grande com transição suave ao trocar, setas de navegação (só aparecem se houver mais de uma foto), tira de miniaturas abaixo; se não houver nenhuma foto, mostra um espaço reservado no lugar de uma imagem quebrada. **(2026-07-23)** Clicar na foto principal abre o mesmo visualizador em tela cheia usado na Galeria — antes não havia forma nenhuma de ver a foto sem o corte quadrado.
- Selo da categoria (clicável, leva de volta ao Catálogo já filtrado por aquele tema).
- Indicador de disponibilidade (verde "Disponível para aluguel" ou vermelho "Indisponível no momento").
- Bloco de preço (valor formatado ou "A combinar").
- Para itens do tipo decoração: cartões extras com paleta de cores, porte do evento (pequeno/médio/grande, com faixa de convidados) e um aviso de "Montagem inclusa" quando aplicável.
- Parágrafo de descrição (só aparece se o produto tiver uma).
- Bloco de dimensões (só para materiais que têm altura/largura/profundidade cadastradas).
- Linha de quantidade disponível.
- Botão de WhatsApp grande, com a mensagem já mencionando o nome do produto.

### Fluxo do usuário
Chega vindo do Catálogo (ou de um link externo) → navega a galeria de fotos (setas ou miniaturas) → lê especificações, preço e disponibilidade → clica no botão de WhatsApp (com mensagem específica do item) → OU clica no selo da categoria para voltar a um catálogo já filtrado por aquele tema → OU usa o link "Voltar ao catálogo".

### Estados possíveis
Produto disponível ou indisponível (em ambos os casos o botão de WhatsApp continua visível — a indisponibilidade não bloqueia o contato, só informa); com preço definido ou "A combinar"; com ou sem fotos (espaço reservado no lugar); blocos de descrição/dimensões/detalhes de decoração aparecem ou somem de forma independente, dependendo do que foi preenchido no cadastro.

### Erros possíveis
Se o identificador do produto na URL não corresponder a nenhum item existente, o visitante cai na página 404 padrão do site ("Página não encontrada"). Não há tratamento especial para uma foto com link quebrado além do espaço reservado exibido quando não há nenhuma foto cadastrada.

### Regras
Os detalhes específicos de decoração só aparecem para produtos do tipo decoração. O selo de categoria só aparece se o produto tiver uma categoria associada. Mesma regra de preço "A combinar" do restante do site. A disponibilidade é só informativa — nunca esconde ou desabilita o botão de contato.

### SEO
A página com o SEO mais completo do site: título e descrição próprios gerados a partir dos dados de cada produto (incluindo uma versão de descrição diferente quando o preço não está definido), mais informações para compartilhamento em redes sociais (usando a primeira foto do produto). Toda página de produto está listada no mapa do site.

### Acessibilidade
O texto alternativo das fotos da galeria é o mais descritivo do site — identifica o produto e o número da imagem. Títulos em hierarquia correta (H1 para o nome do produto, H2 para as seções de descrição/dimensões).

### Responsividade
Duas colunas lado a lado em telas maiores (galeria de um lado, informações do outro); empilha em coluna única no celular. O bloco de dimensões sempre mostra 3 colunas, o que pode apertar um pouco em telas muito estreitas quando as três medidas estão presentes.

---

## Página: Sobre (`/sobre`)

### Objetivo
Construir confiança através da história da marca e da fundadora — reforçar credenciais (anos de experiência, festas realizadas) antes de o visitante decidir entrar em contato.

### Quem utiliza
Visitantes em fase de decisão, geralmente mais adiante no processo do que quem só está navegando o Início ou o Catálogo.

### Componentes
- Seção de introdução com título de destaque.
- Bloco "nossa história": de um lado um cartão decorativo com o nome da fundadora (Miriam Vasaki) e estatísticas fixas (25+ anos, 13 mil+ festas, 500+ itens); do outro, o texto da narrativa da marca e um botão de WhatsApp.
- Seção de valores: 3 cartões com ícone, título e descrição (paixão pelo trabalho, qualidade premium, atendimento personalizado).
- Chamada final com botão de WhatsApp e link para o Catálogo.

### Fluxo do usuário
Lê a introdução → lê a história/estatísticas (pode clicar em WhatsApp já aqui) → rola pelos 3 cartões de valores → chega à chamada final → clica em WhatsApp ou "Ver catálogo".

### Estados possíveis
Nenhum — a página é inteiramente estática, sem busca de dados nem conteúdo condicional.

### Erros possíveis
Nenhum possível — não há dados dinâmicos nem parâmetros na URL desta página.

### Regras
Nenhuma regra de negócio — é conteúdo institucional fixo.

### SEO
**Ponto de atenção**: esta é a única página pública que não define um título e descrição próprios — herda o título genérico do site inteiro em vez de algo como "Sobre nós | Decobalões". Ainda assim está listada no mapa do site.

### Acessibilidade
Hierarquia de títulos presente (H1/H2). Os ícones usados são sempre acompanhados de texto, nunca carregam significado sozinhos.

### Responsividade
Seções em duas colunas colapsam para coluna única no celular; a grade de valores vai de 1 para 3 colunas.

---

## Página: Contato (`/contato`)

### Objetivo
Reunir todos os canais de contato em um só lugar e reforçar o WhatsApp como o canal mais rápido. **Importante**: apesar do nome, não existe nenhum formulário nesta página — é um diretório de links, não uma captura de lead.

### Quem utiliza
Visitantes que preferem ver todas as opções de contato antes de escolher um canal, ou que estão procurando especificamente horário/endereço/e-mail em vez de WhatsApp.

### Componentes
- Cabeçalho com título e introdução.
- Lista de informações de contato: localização (texto, não é um mapa clicável), WhatsApp (número + link), horário de atendimento (texto fixo), e-mail (abre o aplicativo de e-mail do visitante), Instagram (link externo).
- Um cartão destacado à parte, só com WhatsApp, reforçando que é "a forma mais rápida de falar com a gente".

### Fluxo do usuário
Lê a lista de canais → escolhe o que preferir (WhatsApp abre uma conversa nova, e-mail abre o cliente de e-mail, Instagram abre em nova aba) → OU usa diretamente o cartão de WhatsApp em destaque. Não há nenhum link interno de conteúdo nesta página além do cabeçalho/rodapé padrão.

### Estados possíveis
Nenhum — página inteiramente estática.

### Erros possíveis
Nenhum — não há formulário para falhar, nem dados dinâmicos.

### Regras
Endereço, telefone, e-mail, Instagram e horário são fixos no conteúdo da página — diferente das fotos/títulos da home, não são editáveis pelo admin; mudar qualquer um desses dados exige alteração direta no código.

### SEO
Tem título e descrição próprios. Está listada no mapa do site. Não há nenhuma marcação estruturada de "negócio local" (que ajudaria buscadores a exibir endereço/telefone diretamente no resultado de busca), apesar de a página ter exatamente esse tipo de informação — uma melhoria possível, ainda não implementada.

### Acessibilidade
Cada canal de contato é um link real, alcançável e operável por teclado, com texto visível suficientemente descritivo (ex. o próprio número de telefone como texto do link).

### Responsividade
Duas colunas (lista de contato + cartão de WhatsApp) colapsam para coluna única no celular, com o cartão de WhatsApp aparecendo abaixo da lista.
