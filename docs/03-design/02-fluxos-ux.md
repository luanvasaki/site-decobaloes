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

Não existe um padrão de tela de carregamento em página inteira (nem uma sobreposição cobrindo a tela toda) em nenhum lugar do projeto. Todo carregamento é **local e proporcional ao que está carregando**:
- Um ícone pequeno girando, dentro do próprio botão, quando uma ação está em andamento.
- Um ícone maior girando, centralizado, quando uma seção inteira de conteúdo está sendo buscada (ex. trocar de aba na galeria do admin).
- Um indicador que substitui só o ícone de ação daquela linha específica, quando uma operação (excluir, alternar disponibilidade) afeta um único item de uma lista — o resto da lista permanece interativo enquanto isso.

## Estados vazios

Existe um padrão visual consistente e repetido em praticamente toda lista do sistema (produtos, categorias, eventos, fotos de uma categoria da galeria, itens de um tema no catálogo): um ícone grande e discreto (baixa opacidade), uma mensagem curta e direta ("Nenhum produto cadastrado"), e, quando faz sentido, um atalho para resolver o vazio imediatamente ("Criar primeiro produto"). Uma tela nova que precise representar "nada aqui ainda" deve seguir exatamente esse formato — ícone + mensagem + ação, não apenas uma mensagem de texto solta.

## Estado de erro/página não encontrada

A página 404 foge um pouco do padrão de ícone neutro — usa o emoji de balão 🎈 em vez de um ícone do sistema, reforçando a identidade de marca mesmo numa tela de erro, com uma mensagem curta e um único botão de saída ("Voltar ao início"). Não existe uma página de erro genérica além dessa (não há tratamento customizado para "algo deu errado no servidor") — um erro inesperado de leitura de dados tende a se manifestar como um estado vazio (ver acima) em vez de uma tela de erro dedicada, já que a maior parte das funções de busca de dados foi projetada para nunca lançar um erro visível ao usuário.

## Padrão de UX de formulário

Todo formulário segue a mesma jornada: preencher → tentar salvar → se houver erro de validação, um resumo aparece no topo e a tela rola automaticamente até o primeiro campo com problema (o usuário nunca precisa procurar manualmente qual campo está errado) → campo com erro fica com borda e anel vermelhos, com uma mensagem curta abaixo dele → ao corrigir e reenviar, o botão indica "salvando" → em caso de sucesso, o usuário é levado de volta à listagem correspondente.

Uma exceção notada: o formulário de evento não tem o comportamento de rolar automaticamente até o primeiro erro (diferente do formulário de produto) — um ponto de inconsistência a observar se for revisado no futuro.

## Confirmação de ações destrutivas

Toda exclusão (produto, categoria, foto) pede confirmação através do diálogo nativo do navegador antes de executar — nunca uma exclusão acontece direto ao primeiro clique. A mensagem de confirmação, quando relevante, já avisa a consequência real da ação (por exemplo, excluir uma categoria avisa que os produtos daquela categoria ficam sem categoria, em vez de serem excluídos junto).

## Reordenação (arrastar vs. clicar)

O projeto não usa arrastar-e-soltar (drag-and-drop) em nenhum lugar — toda reordenação (fotos da galeria, fotos da página inicial) é feita por botões de seta (mover para cima/baixo, ou para os lados). Essa escolha tem uma vantagem de UX relevante: a interação já funciona nativamente por teclado e clique, sem precisar de uma alternativa de acessibilidade separada, ao custo de ser um pouco mais lenta para reordenar muitos itens de uma vez.

## Diferença de "peso" de UX entre site público e admin

O site público prioriza uma jornada de leitura/descoberta contemplativa — animações de entrada suaves ao rolar, transições de imagem elegantes, poucos cliques até a ação (WhatsApp). O admin prioriza velocidade e clareza operacional — quase nenhuma animação de entrada, feedback instantâneo em vez de decorativo, e mais densidade de informação por tela (tabelas, listas). Uma tela nova deve adotar o "peso" de UX correspondente à área onde ela vive, não misturar o estilo contemplativo do site público dentro do admin ou vice-versa.
