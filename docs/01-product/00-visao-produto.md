# Visão de Produto

## Objetivo do documento

Servir como ponto de entrada para quem quer entender **todas as páginas** que compõem o produto Decobalões — o mapa do site antes de mergulhar no detalhe de cada tela.

## Quando deve ser utilizado

Leia este documento primeiro, antes de [[04-paginas-publicas]], [[05-paginas-admin]] e [[06-fluxos-navegacao]]. Volte a ele para lembrar rapidamente "quantas páginas existem" e "onde cada uma está documentada".

## Documentos referenciados

- [[01-funcionalidades]] — matriz resumida de todas as páginas
- [[04-paginas-publicas]] — detalhamento completo das páginas do site público
- [[05-paginas-admin]] — detalhamento completo das páginas do painel administrativo
- [[06-fluxos-navegacao]] — mapas de navegação e jornadas completas de usuário

---

## O produto tem duas metades

1. **Site público** — vitrine da empresa, sem login, feita para qualquer visitante. 5 páginas de conteúdo + 1 página de erro (404) global.
2. **Painel administrativo** — ferramenta interna, atrás de login, usada só pela equipe da Decobalões. 6 áreas (login, dashboard e 4 módulos de gestão), sendo que 3 delas têm sub-telas de listar/criar/editar.

As duas metades vivem no mesmo site (mesmo domínio), mas não compartilham layout, navegação nem propósito — um visitante comum nunca precisa saber que o admin existe (o único link entre as duas metades é um ícone de cadeado discreto no rodapé do site público).

## Mapa rápido de todas as páginas

### Site público

| Página | Rota | Em uma frase |
|---|---|---|
| Início | `/` | Vitrine de marca — hero, serviços, portfólio, chamada para WhatsApp/catálogo. |
| Catálogo | `/catalogo` | Navegação por decorações (por tema) e materiais para locação. |
| Produto | `/produto/[slug]` | Detalhe de um item específico, com CTA de WhatsApp já preenchido. |
| Sobre | `/sobre` | História da marca e da fundadora, para gerar confiança. |
| Contato | `/contato` | Todos os canais de contato reunidos (WhatsApp, e-mail, Instagram, endereço, horário). |
| Não encontrado | qualquer URL inválida | Página 404 padrão do site. |

### Painel administrativo

| Página | Rota | Em uma frase |
|---|---|---|
| Login | `/admin/login` | Autenticação da equipe. |
| Dashboard | `/admin` | Indicadores do negócio no mês corrente + calendário de eventos. |
| Produtos | `/admin/produtos` (+ `novo`, `[id]/editar`) | Cadastro do catálogo (decorações e materiais). |
| Categorias | `/admin/categorias` (+ `nova`, `[id]/editar`) | Cadastro das categorias usadas por produtos e eventos. |
| Galeria | `/admin/galeria` | Gestão das fotos do site público (capa, home, portfólio por categoria) e dos títulos dos cards de serviço. |
| Eventos | `/admin/eventos` (+ `novo`, `[id]`, `[id]/editar`) | Gestão de orçamentos/eventos contratados — o "CRM" do negócio. |

Total: **11 rotas** no site público (contando variações dinâmicas como uma só) e **13 rotas** no admin (contando listar/novo/editar como três).

## Como usar a documentação desta pasta

- Para entender uma página específica em profundidade (objetivo, componentes, estados, erros, regras, SEO, acessibilidade, responsividade), vá direto para [[04-paginas-publicas]] ou [[05-paginas-admin]].
- Para entender como as páginas se conectam entre si — todos os links de saída de cada tela e as jornadas completas de um visitante ou de um administrador — vá para [[06-fluxos-navegacao]].
- Para uma visão tabular rápida de todas as páginas de uma vez, use [[01-funcionalidades]].
