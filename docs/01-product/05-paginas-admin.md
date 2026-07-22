# Páginas do Painel Administrativo — Detalhamento Completo

## Objetivo do documento

Descrever em profundidade cada página do painel administrativo: objetivo, quem utiliza, componentes, fluxo do usuário, estados possíveis, erros possíveis, regras, SEO, acessibilidade e responsividade.

## Quando deve ser utilizado

Consulte ao alterar, revisar ou testar qualquer página do painel administrativo, ou ao especificar uma funcionalidade nova nessa área.

## Documentos referenciados

- [[00-visao-produto]]
- [[01-funcionalidades]]
- [[06-fluxos-navegacao]]

---

## Elementos compartilhados por todas as páginas do admin

### Proteção de acesso
Toda rota que começa com `/admin` exige login, com uma única exceção: a própria tela de login. Quem tenta acessar qualquer página do admin sem estar autenticado é redirecionado silenciosamente para a tela de login, sem mensagem de erro. Quem já está logado e tenta acessar a tela de login é redirecionado direto para o Dashboard. Não existem papéis diferentes de usuário — qualquer login válido tem acesso total a todas as funcionalidades administrativas.

### Navegação (chrome comum)
- **Desktop**: menu lateral fixo, sempre visível, com os 5 destinos (Dashboard, Eventos, Produtos, Categorias, Galeria), um link para abrir o site público em nova aba, e a opção de sair.
- **Celular/tablet**: menu inferior fixo com os mesmos ícones, mais um cabeçalho simples no topo com a logo.
- Não existem "migalhas de pão" (breadcrumbs) estruturadas reutilizáveis — cada página implementa seu próprio link "Voltar" manualmente.

### Sistema de feedback ao usuário
Diferente do que se poderia esperar, o admin **não usa notificações do tipo toast** para confirmar ações (embora o componente exista instalado, não é usado em lugar nenhum). O feedback ao usuário acontece de formas mais simples e locais:
- Caixas de erro em vermelho, embutidas na própria tela.
- Avisos em âmbar para situações não-bloqueantes (ex. upload de foto que falhou).
- Botões que mudam de texto/ícone temporariamente para confirmar sucesso (ex. um botão de salvar que exibe "Salvo!" por alguns segundos).
- Caixas de diálogo nativas do navegador (a mesma janela de confirmação "OK/Cancelar" do sistema) para confirmar exclusões e para avisos simples de erro de upload.

Não existe uma tela de carregamento customizada nem uma tela de erro customizada em nenhuma rota do admin — o comportamento padrão do navegador/Next.js é usado quando não há tratamento específico dentro do próprio componente.

### SEO
Nenhuma página do admin é pensada para aparecer em buscadores. A exclusão é feita de forma central (um arquivo de regras bloqueia todo o prefixo `/admin/` para os buscadores, e nenhuma URL administrativa aparece no mapa do site) — não é feita individualmente em cada página.

---

## Página: Login (`/admin/login`)

### Objetivo
Autenticar a equipe interna antes de liberar o acesso ao restante do painel.

### Quem utiliza
A gestora do negócio (ou qualquer pessoa da equipe com credenciais válidas) — usuário único de staff, sem distinção de papéis.

### Componentes
Formulário centralizado na tela com campos de e-mail e senha, botão "Entrar", e um ícone de olho que alterna a visibilidade da senha digitada.

### Fluxo do usuário
Digita e-mail e senha → clica em "Entrar" → em caso de sucesso, é levado direto ao Dashboard → em caso de falha, vê uma mensagem de erro e pode tentar novamente.

### Estados possíveis
Formulário vazio (estado inicial); enviando (botão mostra um indicador de carregamento e fica desabilitado, com o texto "Entrando..."); erro de validação em algum campo; erro de autenticação.

### Erros possíveis
Campo de e-mail em formato inválido ou senha muito curta (validado antes mesmo de tentar autenticar); credenciais incorretas (mensagem genérica "E-mail ou senha incorretos" — deliberadamente não informa se o problema foi o e-mail ou a senha, por segurança).

### Regras
E-mail precisa ter formato válido; senha precisa ter no mínimo 6 caracteres. Não existe fluxo de "esqueci minha senha" nem de cadastro dentro do site — uma conta nova só pode ser criada diretamente na plataforma do banco de dados, fora da aplicação.

### SEO
Fora de indexação (protegida pela regra geral do admin).

### Acessibilidade
Campos com rótulos associados corretamente; botão de mostrar/ocultar senha tem identificação para leitores de tela.

### Responsividade
Cartão de login centralizado, funciona bem em qualquer largura de tela.

---

## Página: Dashboard (`/admin`)

### Objetivo
Dar à gestora uma visão geral do negócio no mês corrente — receita, eventos e agenda — para decisões rápidas do dia a dia.

### Quem utiliza
A gestora do negócio, como primeira tela ao entrar no painel.

### Componentes e indicadores exatos
- **4 cartões de indicador**: Receita do mês (soma de eventos concluídos no mês); Eventos confirmados (contagem de eventos confirmados, em andamento ou concluídos no mês); A receber (soma do que falta pagar em eventos não totalmente pagos e não cancelados); Produtos (total cadastrado, com o total de categorias como subtítulo).
- **Calendário mensal**: navegação entre meses, um ponto colorido por status em cada dia com evento, até 2 eventos visíveis por dia (com contador "+N" se houver mais), clique em um dia leva ao detalhe do evento, legenda de cores no rodapé.
- **Lista de próximos eventos** (até 6): cada item leva ao detalhe daquele evento; link "Ver todos" leva à lista completa; estado vazio "Nenhum evento agendado"; atalho para criar um evento novo.
- **Gráfico de receita mensal** (últimos 6 meses, só eventos concluídos): barras com valor visível ao passar o mouse; estado vazio "Nenhum evento concluído ainda".
- **Ranking por tipo de evento**: até 6 categorias ordenadas por receita, com destaque visual para a primeira colocada; estado vazio "Nenhum dado ainda".
- **Atalhos rápidos**: criar evento, criar produto, criar categoria, e um link para abrir o site público em nova aba.

### Fluxo do usuário
Entra no painel → vê os 4 indicadores do mês de relance → consulta o calendário ou a lista de próximos eventos → clica em um evento para ver detalhes, ou usa um atalho rápido para criar algo novo.

### Estados possíveis
Cada widget tem seu próprio estado vazio independente (ver acima) — é normal, em um negócio novo ou em um mês sem movimento, ver vários widgets no estado vazio ao mesmo tempo.

### Erros possíveis
A página busca todos os dados no servidor antes de renderizar — não há estado de carregamento visível nem tratamento de erro exposto ao usuário nesta tela especificamente.

### Regras
Receita do mês só conta eventos com status "concluído". "Eventos confirmados" soma três status diferentes (confirmado, em andamento, concluído). "A receber" ignora eventos cancelados.

### SEO
Fora de indexação.

### Acessibilidade
Sem observações específicas além do padrão do restante do admin (rótulos em formulários, nenhum aqui; conteúdo majoritariamente informativo).

### Responsividade
Os widgets se reorganizam em coluna única em telas pequenas.

---

## Página: Produtos — Lista (`/admin/produtos`)

### Objetivo
Gerenciar o catálogo de itens alugáveis (decorações e materiais) — ver tudo o que está cadastrado, ativar/desativar disponibilidade e acessar criação/edição.

### Quem utiliza
Equipe interna responsável por manter o catálogo atualizado.

### Componentes
Lista/tabela de produtos com miniatura, nome, categoria, preço e um interruptor de disponibilidade; botão "Novo produto"; ação de editar (lápis) e excluir (lixeira, com confirmação) em cada linha.

### Fluxo do usuário
Vê a lista completa → pode alternar a disponibilidade de um produto diretamente na lista (sem abrir o formulário) → clica para editar (abre o formulário preenchido) → ou exclui (com confirmação) → ou clica em "Novo produto" para cadastrar um item do zero.

### Estados possíveis
Lista vazia ("Nenhum produto cadastrado", com atalho para criar o primeiro); lista populada; uma linha específica "carregando" enquanto uma ação (excluir ou alternar disponibilidade) está em andamento naquela linha.

### Erros possíveis
As ações de excluir e alternar disponibilidade não mostram uma mensagem de erro explícita se a operação falhar no servidor — o indicador de carregamento da linha simplesmente termina, sem confirmação visível de sucesso ou falha.

### Regras
Nenhuma regra de negócio própria desta tela além de refletir o estado salvo no banco.

### SEO
Fora de indexação.

### Acessibilidade
Os botões de ação (editar/excluir) têm identificação para leitores de tela na versão em lista de cartões (celular); na versão em tabela (desktop), alguns botões dependem só do ícone visual, sem rótulo explícito — um ponto fraco de acessibilidade a melhorar.

### Responsividade
Lista de cartões empilhados no celular; tabela completa com colunas em telas maiores.

---

## Página: Produtos — Novo e Editar (`/admin/produtos/novo`, `/admin/produtos/[id]/editar`)

Usam o mesmo formulário, preenchido (edição) ou vazio (criação).

### Objetivo
Cadastrar ou atualizar um item do catálogo, incluindo suas fotos.

### Quem utiliza
Equipe interna.

### Componentes
- Seletor visual de tipo de item: "Decoração" ou "Material" — muda quais campos aparecem em seguida.
- Se **Decoração**: campos de paleta de cores (texto livre), porte do evento (pequeno/médio/grande ou "não especificar"), e uma opção "Inclui montagem e desmontagem".
- Se **Material**: campos de altura/largura/profundidade (com formatação automática de casas decimais), quantidade total em estoque e quantidade disponível.
- Campo de preço, com uma opção "a combinar" que, quando marcada, esconde o campo de valor.
- Seletor de categoria (se ainda não existir nenhuma categoria cadastrada, é substituído por um aviso com atalho para criar uma).
- Opção "Disponível para aluguel".
- Upload de múltiplas fotos, com pré-visualização em grade e opção de remover cada uma antes de salvar — a primeira foto é a principal.
- Botões "Criar item"/"Salvar alterações" e "Cancelar".

### Fluxo do usuário
Escolhe o tipo de item → preenche os campos específicos daquele tipo → define preço (ou marca "a combinar") → escolhe categoria → adiciona fotos → salva. Ao salvar com sucesso, volta para a lista de produtos.

### Estados possíveis
Formulário vazio (novo) ou preenchido (edição); campos condicionais mudando conforme o tipo escolhido; fotos sendo adicionadas/removidas antes de salvar; enviando (salvando).

### Erros possíveis
- **Validação**: nome obrigatório, preço maior que zero quando não está marcado "a combinar", quantidades mínimas para materiais — um resumo aparece no topo do formulário e a tela rola automaticamente até o primeiro campo com problema.
- **Upload de foto**: arquivos maiores que 10MB são recusados já na seleção, com aviso claro. Se uma foto falhar durante o envio (ex. instabilidade de rede), **o produto é salvo normalmente mesmo assim** — apenas um aviso não-bloqueante lista quais fotos especificamente falharam, sugerindo tentar novamente com um arquivo menor. Isso vale tanto ao criar quanto ao editar um produto.
- **Erro genérico de salvamento**: mensagem "Erro ao salvar. Tente novamente." em vermelho.

### Regras
Campos específicos de decoração são zerados ao salvar um material, e vice-versa (o formulário nunca salva "sujeira" de um tipo no outro). A categoria é opcional apenas se nenhuma existir ainda no sistema. A disponibilidade controla se o item aparece no catálogo público.

### SEO
Fora de indexação.

### Acessibilidade
Todos os campos de texto têm rótulo associado. As opções de tipo/porte, mesmo sendo cartões clicáveis visualmente, são operáveis por teclado (usam um controle de seleção real por baixo do visual customizado). Botões de remover foto têm identificação para leitores de tela.

### Responsividade
Formulário de largura controlada, colapsa para uma coluna em telas pequenas — porém algumas grades internas (tipo de item, porte do evento) permanecem fixas em 2-3 colunas mesmo em telas muito estreitas, podendo apertar visualmente no celular.

---

## Página: Categorias — Lista (`/admin/categorias`)

### Objetivo
Gerenciar as categorias usadas tanto por produtos quanto por eventos.

### Quem utiliza
Equipe interna.

### Componentes
Lista com nome, identificador técnico (slug) e data de criação de cada categoria; ações de editar e excluir.

### Fluxo do usuário
Vê a lista → cria uma categoria nova, edita ou exclui uma existente.

### Estados possíveis
Lista vazia ("Nenhuma categoria cadastrada", com atalho para criar a primeira); lista populada.

### Erros possíveis
Ao tentar excluir, a confirmação já avisa explicitamente a consequência: produtos daquela categoria ficam sem categoria (não são excluídos junto).

### Regras
Excluir uma categoria não excluir os produtos associados a ela — apenas os desvincula.

### SEO
Fora de indexação.

### Acessibilidade
Padrão do restante do admin — ações com ícone, rótulos presentes na maior parte dos casos.

### Responsividade
Lista de cartões no celular, tabela em telas maiores.

---

## Página: Categorias — Nova e Editar (`/admin/categorias/nova`, `/admin/categorias/[id]/editar`)

### Objetivo
Cadastrar ou renomear uma categoria.

### Quem utiliza
Equipe interna.

### Componentes
Formulário simples com um único campo obrigatório: o nome. O identificador técnico (slug) é gerado automaticamente a partir do nome, inclusive ao editar (renomear regenera o identificador).

### Fluxo do usuário
Digita o nome → salva → volta para a lista de categorias.

### Estados possíveis
Vazio (nova) ou preenchido (editar); enviando.

### Erros possíveis
Nome obrigatório (mínimo 2 caracteres). Erro genérico de salvamento menciona que o nome pode já existir (o sistema não distingue tecnicamente essa causa de outras falhas — é uma suposição fixa no texto da mensagem).

### Regras
O identificador técnico da categoria é sempre derivado do nome, nunca digitado manualmente.

### SEO
Fora de indexação.

### Acessibilidade
Campo com rótulo associado.

### Responsividade
Formulário compacto, sem problemas de layout em qualquer tamanho de tela.

---

## Página: Galeria (`/admin/galeria`)

### Objetivo
Gerenciar tudo o que aparece visualmente no site público: a(s) foto(s) de capa, as fotos da página inicial, os títulos dos 4 cards de serviço, e o portfólio de fotos por categoria de evento. É a página mais complexa do admin.

### Quem utiliza
Equipe interna, tipicamente após realizar um evento e querer atualizar o portfólio.

### Componentes
1. **Fotos de capa (Hero)** — grade numerada das fotos escolhidas para a capa (ou um aviso de que nenhuma foi definida — nesse caso usa a foto padrão do site); suporta mais de uma foto, com setas para reordenar e botão para remover, igual ao padrão já usado nas fotos da página inicial. Com mais de uma foto, o Hero da Home alterna entre elas automaticamente (2026-07-21). É alimentada a partir da grade de fotos mais abaixo, marcando/desmarcando "Adicionar à capa" em cada foto.
2. **Fotos da página inicial** — grade numerada das fotos escolhidas para a home, com setas para reordenar e botão para remover.
3. **Nomes dos cards de serviço** — 4 campos de texto (um para cada card exibido no Início) com botão "Salvar nomes".
4. **Abas por categoria de evento** (Casamentos, Aniversários, Festa Infantil, Chá de Bebê) — cada uma com sua própria grade de fotos.
5. **Upload de fotos** — múltiplos arquivos de uma vez, com indicador de progresso.
6. **Grade de fotos da categoria ativa** — cada foto tem, ao passar o mouse, setas para reordenar, indicações visuais de "Capa" e/ou "Página inicial", e botões para incluir/remover da home ou excluir definitivamente.

### Fluxo do usuário
Escolhe a aba da categoria → vê as fotos já cadastradas → adiciona novas fotos → reordena com as setas → marca uma foto como capa do site e/ou inclui na lista da home → ajusta a ordem da lista da home separadamente → edita os títulos dos 4 cards de serviço → remove fotos que não quer mais.

### Estados possíveis
Carregando fotos ao trocar de aba; categoria vazia ("Nenhuma foto nesta categoria"); enviando foto (botão mostra indicador de progresso); excluindo uma foto específica (indicador só naquela foto); confirmações temporárias de sucesso (ex. "Salvo!", "Definida!") que desaparecem sozinhas depois de alguns segundos.

### Erros possíveis
- **Upload**: arquivos maiores que 10MB são recusados antes do envio, com aviso listando os nomes recusados. Arquivos que falham durante o envio real são tratados individualmente — um falhar não impede os demais, e ao final um aviso lista quais falharam (mesmo comportamento de resiliência aplicado ao formulário de produto).
- **Exclusão de foto**: pede confirmação; se a foto excluída estava na lista da home, ela também é removida de lá automaticamente.
- **Histórico de correções de estabilidade**: esta tela já teve dois problemas técnicos corrigidos — um que travava a página inteira ao clicar rapidamente nas setas de mover fotos da home, e outro em que cliques rápidos e sucessivos nas setas de reordenar podiam embaralhar a ordem das fotos incorretamente. Hoje, tanto a reordenação da galeria por categoria quanto a da home são estáveis mesmo com cliques rápidos.

### Regras
A ordem das fotos da home está semanticamente ligada aos títulos dos cards de serviço (a 1ª foto corresponde ao 1º título, e assim por diante). Remover uma foto da galeria também a remove da seleção da home e da seleção de capa, se estiver em alguma delas. As fotos de capa podem ser escolhidas de qualquer categoria, não precisam estar na lista da home, e podem ser mais de uma (a ordem definida vira a ordem de rotação no Hero).

### SEO
Fora de indexação.

### Acessibilidade
Todos os botões de reordenar/remover têm identificação para leitores de tela. A reordenação é feita inteiramente por botões de seta — não é arrastar-e-soltar — o que a torna naturalmente operável por teclado, sem necessidade de uma alternativa separada. As imagens da grade usam um texto alternativo genérico, não descritivo de cada foto.

### Responsividade
Grade de 2 a 4 colunas dependendo do tamanho da tela; abas de categoria rolam horizontalmente em telas pequenas.

---

## Página: Eventos — Lista (`/admin/eventos`)

### Objetivo
Gerenciar orçamentos e eventos contratados — funciona como um mini-CRM de pedidos.

### Quem utiliza
Equipe interna, como principal ferramenta de acompanhamento do dia a dia do negócio.

### Componentes
Lista dividida em duas seções: "Próximos eventos" (datas futuras, não cancelados) e "Histórico" (datas passadas ou eventos cancelados). Cada linha mostra data, nome do cliente, status, tipo de evento, horário, local, telefone, valor total e status de pagamento.

### Fluxo do usuário
Vê a lista dividida em próximos/histórico → clica em uma linha para abrir o detalhe do evento → ou clica em "Novo evento" para começar um orçamento do zero.

### Estados possíveis
Lista totalmente vazia ("Nenhum evento cadastrado", com atalho para criar o primeiro); apenas uma das duas seções populada; ambas populadas.

### Erros possíveis
Nenhum tratamento de erro específico exposto nesta tela — é uma listagem somente leitura.

### Regras
Um evento cai em "Histórico" se a data já passou OU se o status é "cancelado", independentemente da data.

### SEO
Fora de indexação.

### Acessibilidade
Linhas clicáveis com texto suficientemente descritivo.

### Responsividade
Linhas em formato de cartão, que já se adaptam bem a qualquer largura sem precisar de uma versão de tabela separada.

---

## Página: Eventos — Novo e Editar (`/admin/eventos/novo`, `/admin/eventos/[id]/editar`)

O formulário mais extenso do admin, dividido em seções.

### Objetivo
Registrar um orçamento novo ou atualizar todos os detalhes de um evento já existente.

### Quem utiliza
Equipe interna, geralmente durante ou logo após uma conversa de orçamento com o cliente.

### Componentes e seções do formulário
1. **Status** — seletor entre os 5 estados do ciclo de vida do evento (ver seção dedicada abaixo).
2. **Cliente** — nome, WhatsApp (com máscara automática de telefone) e e-mail opcional.
3. **Evento** — data, horário de início, horário de montagem, horário de desmontagem, tipo de evento, tema/estilo livre, número de convidados.
4. **Local** — nome do espaço e endereço (opcionais).
5. **Detalhes da decoração** — cores, tipos de balão, tecidos, peças/itens, referências de inspiração, pedidos especiais (todos texto livre opcional).
6. **Itens do evento** — lista dinâmica: cada item pode vir do catálogo ou ser avulso, com quantidade, preço unitário e observação; soma automática exibida ao final (independente do "Valor total" do evento, que é definido manualmente).
7. **Financeiro** — valor total, sinal/entrada, data do sinal, forma de pagamento, status do pagamento, com um cálculo automático de "saldo a receber".
8. **Notas internas** — texto livre, explicitamente marcado como não visível para o cliente.

### Fluxo do usuário
Escolhe o status → preenche dados do cliente e do evento → adiciona itens (opcional) → define valores financeiros → adiciona notas internas (opcional) → salva. Depois de salvar, **sempre** volta para a lista de eventos (mesmo ao editar um evento existente — não retorna à tela de detalhe).

### Estados possíveis
Formulário vazio (novo) ou preenchido (editar); lista de itens crescendo/encolhendo conforme itens são adicionados/removidos; enviando.

### Erros possíveis
Validações: nome do cliente, telefone e data são obrigatórios; e-mail precisa ser válido se preenchido. Erro genérico de salvamento ("Erro ao salvar o evento. Tente novamente.") — diferente do formulário de produto, esta tela não rola automaticamente até o primeiro campo com erro.

Um ponto técnico relevante: ao salvar, a lista de itens do evento é inteiramente substituída (os itens antigos são apagados e os atuais são inseridos de novo), em vez de atualizada item a item — na prática, isso não é perceptível para quem usa o formulário, mas significa que uma falha bem no meio desse processo poderia, em teoria, deixar um evento temporariamente sem itens.

### Regras
Não existe nenhuma restrição de transição entre os status do evento — qualquer status pode ser escolhido a qualquer momento, sem confirmação extra, mesmo "pulando" etapas (ex. ir direto de "Orçamento" para "Concluído"). O status de pagamento também é livre, sem exigir que o evento esteja "Concluído" para poder estar "Pago".

### SEO
Fora de indexação.

### Acessibilidade
Campos de texto com rótulos; seletor de status usa cartões clicáveis operáveis por teclado (mesmo padrão do seletor de tipo de produto).

### Responsividade
Formulário de largura controlada, grades que colapsam para coluna única em telas pequenas.

---

## Página: Eventos — Detalhe (`/admin/eventos/[id]`)

### Objetivo
Visão completa e somente leitura de um evento específico, organizada por seções temáticas.

### Quem utiliza
Equipe interna, para consultar rapidamente todos os detalhes de um evento sem precisar abrir o modo de edição.

### Componentes
Cabeçalho com nome do cliente e status; bloco de data/hora; seção "Cliente" (telefone, e-mail, local); seção "Decoração" (só aparece se algum campo estiver preenchido); seção "Itens do evento" (só aparece se houver algum item); seção "Financeiro" (valor total, sinal, saldo a receber com destaque de cor conforme a situação, forma de pagamento); seção "Notas internas" (só aparece se houver alguma nota).

### Fluxo do usuário
Chega a partir da lista de eventos ou do dashboard → lê os detalhes → clica em "Editar" para abrir o formulário → ou volta para a lista de eventos.

### Estados possíveis
Cada seção aparece ou desaparece de forma independente, dependendo do que foi preenchido no cadastro daquele evento.

### Erros possíveis
Se o identificador do evento não existir, a página cai na 404 padrão do site.

### Regras
Nenhuma regra própria — é um espelho somente leitura dos dados cadastrados.

### SEO
Fora de indexação.

### Acessibilidade
Conteúdo estruturado em seções com títulos claros.

### Responsividade
Conteúdo em coluna única, com os cartões financeiros em duas colunas lado a lado.

---

## Ciclo de vida do evento

Um evento tem dois campos de estado, **independentes** um do outro:

- **Status do evento**: Orçamento → Confirmado → Em andamento → Concluído, ou Cancelado (a partir de qualquer ponto). Não há uma "máquina de estados" imposta na interface — qualquer status pode ser escolhido a qualquer momento, em qualquer ordem, sem confirmação extra.
- **Status de pagamento**: Pendente, Parcial ou Pago — também livre, sem estar amarrado ao status do evento (por exemplo, nada impede um evento "Concluído" com pagamento "Pendente").

O status do evento afeta diretamente os números do Dashboard: a receita do mês só soma eventos "Concluídos"; a contagem de "eventos confirmados" soma três status juntos (Confirmado, Em andamento, Concluído); e um evento "Cancelado" sempre aparece na seção de Histórico da lista de eventos, independentemente da data.
