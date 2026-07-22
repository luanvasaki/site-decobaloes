# Fluxos Completos de Navegação

## Objetivo do documento

Mapear todos os caminhos possíveis entre as páginas do sistema — tanto no site público quanto no admin — e descrever as jornadas completas que um visitante ou um membro da equipe percorre do início ao fim de uma tarefa.

## Quando deve ser utilizado

Consulte ao planejar uma mudança de navegação, ao verificar se um novo link/página está bem conectado ao resto do site, ou para entender o caminho completo que um usuário percorre até completar uma ação (contato, cadastro, orçamento).

## Documentos referenciados

- [[00-visao-produto]]
- [[04-paginas-publicas]]
- [[05-paginas-admin]]

---

## Grafo de navegação — Site público

**Presentes em toda página (cabeçalho e rodapé)**: Início, Catálogo, Sobre e Contato formam um grupo totalmente interligado — de qualquer uma dessas 4 páginas, dá para chegar a qualquer outra em um clique, através do menu do cabeçalho ou do rodapé. O rodapé também tem um link de e-mail, um link externo para o Instagram, e o ícone discreto de acesso ao admin.

**Links específicos de cada página** (além do cabeçalho/rodapé):

- **Início → Catálogo**: através de 4 cartões de serviço, do botão do hero, e da chamada final — sempre para o Catálogo geral, nunca para um tema específico.
- **Catálogo → Produto**: cada cartão de produto leva à página de detalhe daquele item.
- **Produto → Catálogo**: link "Voltar ao catálogo" (catálogo geral) e o selo da categoria (catálogo já filtrado pelo tema daquele produto).
- **Sobre → Catálogo**: através da chamada final da página.
- **Contato**: não tem nenhum link interno de conteúdo além do cabeçalho/rodapé (só links externos: WhatsApp, e-mail, Instagram).
- **Qualquer URL inválida → 404 → Início**: único caminho de saída da página de erro.

**Conclusão do grafo**: o Catálogo é o centro para onde todo o resto do site converge; a página de Produto só é alcançável a partir do Catálogo (ou de um link direto/externo/busca); e o WhatsApp é o único destino de conversão, presente literalmente em toda página através do botão flutuante, além de estar embutido no conteúdo de Início, Sobre, Contato e Produto.

## Grafo de navegação — Painel administrativo

**Presente em toda página do admin (menu lateral/inferior)**: Dashboard, Eventos, Produtos, Categorias, Galeria, link externo para o site público, e Sair — todos acessíveis de qualquer tela em um clique.

**Links específicos**:

- **Dashboard →**: lista de eventos ("Ver todos"), detalhe de cada evento próximo, criar evento, criar produto, criar categoria, site público.
- **Lista de Produtos →**: criar produto, editar cada produto (por linha).
- **Formulário de Produto →**: se não houver categorias, um aviso leva a "criar categoria"; "Voltar"/"Cancelar" retornam à lista de produtos.
- **Lista de Categorias →**: criar categoria, editar cada categoria (por linha).
- **Galeria**: não linka para outras páginas do admin (é autocontida), mas suas ações afetam diretamente o conteúdo do site público (Início).
- **Lista de Eventos →**: criar evento, detalhe de cada evento (por linha).
- **Detalhe do Evento →**: lista de eventos (link "Eventos"), editar aquele evento.
- **Formulário de Evento →**: "Voltar" leva à lista (se novo) ou ao detalhe (se editando); depois de salvar, **sempre** volta para a lista de eventos, nunca para o detalhe.
- **Sair (Logout) →**: tela de login.

**Conclusão do grafo**: diferente do site público (que converge para um centro único, o Catálogo), o admin tem 4 módulos praticamente independentes entre si (Produtos, Categorias, Galeria, Eventos), todos igualmente acessíveis a partir do menu principal — não há uma hierarquia de "página mais importante" além do Dashboard como ponto de entrada natural.

## A ponte entre as duas metades do site

O único caminho do site público para o admin é um ícone de cadeado quase invisível no rodapé, que leva à tela de login. Não existe, e nunca deveria existir, nenhum outro link visível ao público apontando para `/admin`. No sentido contrário, o admin tem um link explícito e visível ("Ver site público") em toda página, para a equipe conferir rapidamente como uma mudança ficou no ar.

---

## Jornadas completas de usuário

### Jornada 1 — Visitante decidindo contratar uma decoração de casamento

1. Chega ao **Início** (por indicação ou busca).
2. Lê a proposta de valor e as estatísticas de experiência.
3. Clica em "Ver Catálogo" (ou em um dos cartões de serviço, ex. "Casamentos").
4. No **Catálogo**, permanece na aba "Decorações", escolhe o tema "Casamentos".
5. Navega as fotos de trabalhos realizados (abre o visualizador em tela cheia, passa por várias fotos).
6. Navega os pacotes disponíveis (cartões de produto) daquele tema.
7. Clica em um cartão de produto que chamou atenção → vai para a página de **Produto**.
8. Vê fotos, preço (ou "A combinar"), disponibilidade e detalhes da decoração (paleta de cores, porte do evento).
9. Clica no botão de WhatsApp — abre uma conversa já com uma mensagem perguntando sobre a disponibilidade daquele item específico.
10. **A partir daqui, a jornada sai do site** — a negociação e o fechamento acontecem inteiramente na conversa de WhatsApp, fora da plataforma.

### Jornada 2 — Visitante em dúvida, buscando confiança antes de decidir

1. Chega ao **Início**, mas não se convence imediatamente.
2. Vai para **Sobre** (pelo cabeçalho), lê a história da fundadora e os valores da marca.
3. Ainda em dúvida, vai para **Contato**, para ver se há mais formas de avaliar a empresa (endereço, redes sociais).
4. Confere o Instagram (link externo) para ver mais fotos/depoimentos fora do site.
5. Volta ao site, vai para o **Catálogo**, agora já mais confiante.
6. Entra em contato pelo WhatsApp a partir de um produto específico ou do cartão de contato em destaque na própria página de Contato.

### Jornada 3 — Equipe registrando um novo orçamento (do primeiro contato ao evento confirmado)

1. Cliente entra em contato pelo WhatsApp (vindo de qualquer jornada pública acima).
2. Membro da equipe acessa o **admin** (via `/admin/login`, autentica).
3. Cai no **Dashboard**, clica no atalho "Novo evento" (ou navega até Eventos → Novo).
4. No **formulário de Evento**, define o status inicial como "Orçamento", preenche dados do cliente, data e detalhes do evento, adiciona itens do catálogo relevantes, define um valor total estimado.
5. Salva — é redirecionado para a **Lista de Eventos**, onde o novo orçamento aparece na seção "Próximos eventos".
6. Depois que o cliente confirma verbalmente/por WhatsApp, a equipe volta ao evento (lista → detalhe → editar), muda o status para "Confirmado", registra o valor do sinal pago e a data.
7. Próximo à data do evento, o status muda para "Em andamento".
8. Depois da festa, o status muda para "Concluído" e o pagamento é marcado como "Pago" — a partir desse momento, o valor do evento passa a contar na receita do mês no Dashboard.

### Jornada 4 — Equipe atualizando o portfólio depois de um evento

1. Acessa **Galeria** no menu do admin.
2. Escolhe a aba da categoria correspondente ao evento realizado (ex. "Aniversários").
3. Faz upload das novas fotos.
4. Reordena as fotos recém-adicionadas usando as setas, colocando as melhores primeiro.
5. Opcionalmente, marca uma das novas fotos como a nova foto de capa do site, ou a inclui na lista de fotos da página inicial.
6. Se a foto virou uma das 4 primeiras da home, opcionalmente atualiza o título do card de serviço correspondente.
7. Abre o link "Ver site público" para conferir como ficou antes de considerar a tarefa concluída.

### Jornada 5 — Equipe cadastrando um produto novo no catálogo

1. Acessa **Produtos** no menu do admin, clica em "Novo produto".
2. Escolhe o tipo (Decoração ou Material) — o formulário se adapta mostrando os campos certos.
3. Se a categoria desejada ainda não existe, usa o atalho para criar a categoria primeiro (leva a **Categorias → Nova**, depois volta ao formulário de produto).
4. Preenche nome, descrição, campos específicos do tipo escolhido, preço (ou marca "a combinar"), disponibilidade.
5. Faz upload das fotos do item.
6. Salva — se alguma foto falhar no envio, o produto ainda assim é salvo, com um aviso sobre a(s) foto(s) que precisam ser reenviadas.
7. É redirecionado para a **Lista de Produtos**, onde o novo item já aparece e pode ter sua disponibilidade alternada diretamente pela lista.
8. O item passa a aparecer no **Catálogo** público, na aba e no tema correspondentes à sua categoria.
