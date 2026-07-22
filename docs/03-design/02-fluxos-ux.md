# Fluxos de UX

## Objetivo do documento

Descrever os padrões de experiência do usuário que se repetem pelo projeto — como o sistema dá feedback, como trata estados vazios/erro, e como formulários se comportam — para que uma tela nova siga a mesma linguagem de interação do resto do produto.

## Quando deve ser utilizado

Consulte antes de projetar uma tela nova ou uma interação nova (confirmação, mensagem de sucesso, estado de carregamento), para manter o mesmo vocabulário de UX já estabelecido.

## Documentos referenciados

- [[00-design-system]]
- [[01-identidade-visual]]
- `../01-product/06-fluxos-navegacao.md` — os fluxos de navegação entre páginas (este documento foca em padrões de interação dentro de uma página)

---

## Como o sistema dá feedback ao usuário

Um ponto importante para quem for desenhar uma tela nova: o projeto **tem um sistema de notificações do tipo toast instalado, mas ele não é usado em nenhum lugar**. Não presuma que existe esse canal de feedback disponível — o padrão real do projeto usa outros três mecanismos, dependendo da situação:

1. **Caixas de mensagem embutidas na própria tela** (fundo colorido — vermelho para erro) — usadas para erros de validação de formulário ou falha ao salvar.
2. **Diálogos nativos do navegador** (a janela de confirmação padrão do sistema, com "OK/Cancelar") — usados para confirmar ações destrutivas, como excluir um produto, categoria ou foto, e para avisos simples (ex. "esta foto é grande demais").
3. **O próprio botão muda de aparência temporariamente** — em vez de uma notificação separada, um botão de salvar troca seu texto/ícone para indicar progresso ("Salvando...") e depois sucesso ("Salvo!", com um ícone de confirmação), voltando ao normal sozinho depois de alguns segundos.

Se uma tela nova precisar de um mecanismo de confirmação, siga um destes três padrões — não introduza um quarto padrão (como ativar o sistema de toast) sem alinhar antes, para não fragmentar a linguagem de feedback do produto.

## Estados de carregamento

Todo carregamento **dentro de uma página já carregada** continua sendo local e proporcional ao que está carregando:
- Um ícone pequeno girando, dentro do próprio botão, quando uma ação está em andamento.
- Um ícone maior girando, centralizado, quando uma seção inteira de conteúdo está sendo buscada (ex. trocar de aba na galeria do admin).
- Um indicador que substitui só o ícone de ação daquela linha específica, quando uma operação (excluir, alternar disponibilidade) afeta um único item de uma lista — o resto da lista permanece interativo enquanto isso.

**Decisão (2026-07-22) — carregamento de rota inteira (`loading.tsx` do App Router)**: o padrão acima nunca cobriu o momento em que a própria rota ainda está buscando dados no servidor pela primeira vez (Server Component ainda não terminou de renderizar) — como nenhuma rota dinâmica usa cache (ver `../07-audits/01-auditoria-performance.md`, achado 1, e a pergunta em aberto correspondente em `../06-knowledge/04-decisoes-futuras.md`), esse momento existe a cada visita e hoje se resolve como tela em branco. Isso deixou de ser aceitável e passa a ter um padrão próprio, **sem contradizer o espírito "local e proporcional"**: o loading de rota deve ocupar o mesmo espaço que o conteúdo final ocuparia (não uma sobreposição/spinner genérico cobrindo tudo), então funciona como uma extensão do padrão existente, não um quarto padrão novo:

- **Site público**: um esqueleto (*skeleton*) que ecoa a forma real do conteúdo — blocos com os mesmos cantos arredondados generosos do resto do projeto (`rounded-2xl`/`rounded-3xl`), na progressão de grade já documentada (1 → 2 → 3 → 4 colunas) quando a página final é uma grade de cartões (Catálogo, Galeria), ou um bloco de título + parágrafo quando a página final é predominantemente texto (Sobre, Produto). Tom de cor: gradiente suave usando o rosa de marca em baixa opacidade (`primary-50`/`primary-100`, o mesmo par já usado no placeholder de "sem foto") pulsando lentamente (`animate-pulse`) — nunca cinza neutro genérico, para o carregamento continuar parecendo "da marca" mesmo vazio.
- **Admin**: reaproveitar o padrão já existente de "ícone maior girando, centralizado" (não um skeleton) — o admin já é documentado como o ambiente de "quase nenhuma animação de entrada" e prioridade em clareza/velocidade sobre encantamento visual (ver seção "Diferença de peso de UX" abaixo); introduzir um skeleton elaborado ali destoaria desse tom.

## Estados vazios

Existe um padrão visual consistente e repetido em praticamente toda lista do sistema (produtos, categorias, eventos, fotos de uma categoria da galeria, itens de um tema no catálogo): um ícone grande e discreto (baixa opacidade), uma mensagem curta e direta ("Nenhum produto cadastrado"), e, quando faz sentido, um atalho para resolver o vazio imediatamente ("Criar primeiro produto"). Uma tela nova que precise representar "nada aqui ainda" deve seguir exatamente esse formato — ícone + mensagem + ação, não apenas uma mensagem de texto solta.

## Estado de erro/página não encontrada

A página 404 foge um pouco do padrão de ícone neutro — usa o emoji de balão 🎈 em vez de um ícone do sistema, reforçando a identidade de marca mesmo numa tela de erro, com uma mensagem curta e um único botão de saída ("Voltar ao início").

**Decisão (2026-07-22) — página de erro genérica (`error.tsx` do App Router)**: a ausência de uma página de erro além da 404 deixava uma falha real de leitura de dados indistinguível de um estado vazio legítimo ("nenhum produto cadastrado") para o usuário — passa a existir uma tela de erro dedicada, estendendo o mesmo tom já estabelecido pela 404 em vez de criar um novo:

- **Site público**: mesmo emoji 🎈, mesma tipografia extra-negrita do título, mesmo botão de ação rosa arredondado — mas com mensagem própria ("Ops, algo deu errado por aqui" em vez de "página não encontrada") e **dois** botões em vez de um: "Tentar novamente" (botão principal, aciona o `reset()` da rota) e "Voltar ao início" (botão secundário, contorno sutil). Nunca expor o texto técnico do erro ao visitante.
- **Admin**: tom mais utilitário, sem o emoji — título direto ("Algo deu errado ao carregar esta página"), mesmos dois botões de ação, mas sem a moldura decorativa do site público, coerente com o admin já sendo "visualmente muito mais neutro e funcional" (ver `01-identidade-visual.md`).

O caminho de "erro vira estado vazio silencioso" continua válido para falhas que uma função de `services/` já trata deliberadamente (ex. filtro sem resultado) — a tela de erro nova cobre apenas uma exceção não tratada que hoje derrubaria a renderização da rota.

## Padrão de UX de formulário

Todo formulário segue a mesma jornada: preencher → tentar salvar → se houver erro de validação, um resumo aparece no topo e a tela rola automaticamente até o primeiro campo com problema (o usuário nunca precisa procurar manualmente qual campo está errado) → campo com erro fica com borda e anel vermelhos, com uma mensagem curta abaixo dele → ao corrigir e reenviar, o botão indica "salvando" → em caso de sucesso, o usuário é levado de volta à listagem correspondente.

Uma exceção notada: o formulário de evento não tem o comportamento de rolar automaticamente até o primeiro erro (diferente do formulário de produto) — um ponto de inconsistência a observar se for revisado no futuro.

## Confirmação de ações destrutivas

Toda exclusão (produto, categoria, foto) pede confirmação através do diálogo nativo do navegador antes de executar — nunca uma exclusão acontece direto ao primeiro clique. A mensagem de confirmação, quando relevante, já avisa a consequência real da ação (por exemplo, excluir uma categoria avisa que os produtos daquela categoria ficam sem categoria, em vez de serem excluídos junto).

## Reordenação (arrastar vs. clicar)

O projeto não usa arrastar-e-soltar (drag-and-drop) em nenhum lugar — toda reordenação (fotos da galeria, fotos da página inicial) é feita por botões de seta (mover para cima/baixo, ou para os lados). Essa escolha tem uma vantagem de UX relevante: a interação já funciona nativamente por teclado e clique, sem precisar de uma alternativa de acessibilidade separada, ao custo de ser um pouco mais lenta para reordenar muitos itens de uma vez.

## Diferença de "peso" de UX entre site público e admin

O site público prioriza uma jornada de leitura/descoberta contemplativa — animações de entrada suaves ao rolar, transições de imagem elegantes, poucos cliques até a ação (WhatsApp). O admin prioriza velocidade e clareza operacional — quase nenhuma animação de entrada, feedback instantâneo em vez de decorativo, e mais densidade de informação por tela (tabelas, listas). Uma tela nova deve adotar o "peso" de UX correspondente à área onde ela vive, não misturar o estilo contemplativo do site público dentro do admin ou vice-versa.
