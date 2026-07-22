# Funcionalidades

## Objetivo do documento

Apresentar uma matriz resumida de todas as páginas do sistema — o que cada uma faz e quem a usa — como referência rápida antes de entrar no detalhamento completo de cada uma.

## Quando deve ser utilizado

Consulte quando precisar de uma visão geral rápida de "o que existe" sem entrar nos detalhes de componentes/estados/erros de cada página (esses estão em [[04-paginas-publicas]] e [[05-paginas-admin]]).

## Documentos referenciados

- [[00-visao-produto]]
- [[04-paginas-publicas]]
- [[05-paginas-admin]]

---

## Matriz de páginas — Site público

| Página | Quem utiliza | Funcionalidade principal | Ação de conversão |
|---|---|---|---|
| Início (`/`) | Qualquer visitante, geralmente primeira visita | Apresentar a marca, gerar confiança (estatísticas, portfólio) | WhatsApp genérico ou ir ao Catálogo |
| Catálogo (`/catalogo`) | Visitante comparando opções para um evento específico | Navegar decorações por tema e materiais para locação, ver fotos de trabalhos realizados | Abrir um produto ou falar no WhatsApp |
| Produto (`/produto/[slug]`) | Visitante avaliando um item específico | Ver fotos, preço, disponibilidade e especificações de um item | WhatsApp com mensagem sobre aquele item específico |
| Sobre (`/sobre`) | Visitante em fase de decisão, buscando confiança | Contar a história da marca e da fundadora | WhatsApp ou ir ao Catálogo |
| Contato (`/contato`) | Visitante que já decidiu falar com a empresa | Reunir todos os canais de contato em um só lugar | WhatsApp, e-mail ou Instagram |
| Não encontrado | Qualquer um que acesse um link inválido/quebrado | Informar que a página não existe | Voltar ao Início |

## Matriz de páginas — Painel administrativo

| Página | Quem utiliza | Funcionalidade principal |
|---|---|---|
| Login (`/admin/login`) | Equipe interna | Autenticar antes de acessar qualquer outra tela do admin |
| Dashboard (`/admin`) | Gestora do negócio | Ver receita do mês, eventos confirmados, valores a receber, calendário e ranking de categorias |
| Produtos (`/admin/produtos` e sub-telas) | Equipe interna | Cadastrar, editar, ativar/desativar e excluir itens do catálogo |
| Categorias (`/admin/categorias` e sub-telas) | Equipe interna | Cadastrar, editar e excluir categorias usadas por produtos e eventos |
| Galeria (`/admin/galeria`) | Equipe interna | Fazer upload e organizar fotos do site público, escolher foto de capa e fotos da home, editar títulos dos cards de serviço |
| Eventos (`/admin/eventos` e sub-telas) | Equipe interna | Registrar orçamentos, acompanhar status do evento e do pagamento até a conclusão |

## Componentes compartilhados entre várias páginas

Estes elementos aparecem em mais de uma tela e são descritos uma única vez em [[04-paginas-publicas]]/[[05-paginas-admin]] em vez de repetidos em cada página:

- **Site público**: `Navbar` e `Footer` (em todas as páginas públicas), `FloatingWhatsAppButton` (botão flutuante de WhatsApp, presente literalmente em toda página do site, inclusive na 404), `WhatsAppButton` (botão de WhatsApp embutido no conteúdo de várias páginas), `ProductCard` (cartão de produto, usado no Catálogo).
- **Admin**: `AdminSidebar`/`AdminMobileNav` (menu do painel, em toda página admin exceto login), formulários reutilizados entre "novo" e "editar" da mesma entidade (`ProductForm`, `CategoryForm`, `EventForm`).

## O que NÃO existe em nenhuma página

Para deixar claro por omissão: nenhuma página do site (pública ou admin) tem carrinho de compras, checkout, pagamento online, avaliações/comentários, ou cadastro de conta para o cliente final. A única "conversão" possível em qualquer página pública é abrir uma conversa de WhatsApp.
