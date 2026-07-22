# Fluxo de Dados e Comunicação entre Componentes

## Objetivo do documento

Mostrar, passo a passo, como um dado sai do banco e chega até a tela (leitura) e como uma ação do administrador chega até o banco (escrita) — além de como os componentes trocam informação entre si dentro de uma mesma tela.

## Quando deve ser utilizado

Consulte ao depurar por que um dado não está aparecendo ou não está atualizando após uma ação, ou antes de conectar um componente novo a dados existentes.

## Documentos referenciados

- [[06-padroes-arquiteturais]]
- [[08-api-autenticacao]]
- [[02-modelo-dados]]

---

## Fluxo de leitura típico — exemplo: página de Catálogo

1. O visitante acessa `/catalogo` (opcionalmente com um filtro de tema na URL, ex. `?tema=casamentos`).
2. A página roda **no servidor**, como uma função assíncrona: ela lê o parâmetro de tema da URL e dispara, em paralelo, as buscas de produtos disponíveis, categorias e fotos da galeria — todas através da camada `services/`.
3. Cada função de `services/` monta uma consulta ao Supabase e devolve os dados já prontos (ou uma lista vazia, em caso de falha).
4. A página repassa esses dados como propriedades para um único componente interativo (`CatalogView`), que roda no navegador.
5. A partir daí, trocar de aba, mudar o tema selecionado ou abrir a galeria em tela cheia **não busca dados de novo** — tudo é filtrado no navegador, a partir dos dados que já vieram prontos do servidor.

Esse padrão se repete em praticamente todas as páginas de leitura do site público e das listagens do admin: a página busca tudo de uma vez no servidor, e a interatividade depois disso é só filtragem/exibição local, sem novas idas ao banco.

Nenhuma rota dinâmica do projeto usa cache do Next.js (todas estão marcadas para buscar dados frescos a cada visita) — ou seja, não há risco de mostrar dados desatualizados por causa de cache, mas também significa que cada visita sempre bate no banco de novo.

## Fluxo de escrita típico — exemplo: admin criando um produto

1. O administrador preenche o formulário de produto (um componente que roda inteiramente no navegador).
2. Ao validar e submeter, o próprio formulário — sem passar por uma rota de API — chama o Supabase diretamente do navegador para inserir o produto.
3. Se houver fotos, cada uma é enviada separadamente para o armazenamento de arquivos, com sua própria captura de erro (uma foto que falha não impede as demais nem impede o produto de ser salvo).
4. Após salvar com sucesso, o formulário redireciona de volta para a lista de produtos e pede ao Next.js para buscar os dados novamente — é assim que a lista "sabe" que há um produto novo, sem precisar de nenhum mecanismo de sincronização automática.
5. Quem garante que esse administrador tinha permissão para essa escrita é a política de segurança do próprio banco (Row Level Security), não uma verificação no código da página — ver [[08-api-autenticacao]].

## Fluxo de escrita típico — exemplo: reordenar fotos da galeria

1. O administrador clica em uma seta para mover uma foto de posição.
2. A ordem é atualizada imediatamente na tela (o componente já reflete a nova ordem antes mesmo de confirmar com o banco).
3. Em seguida, duas atualizações são enviadas ao banco (trocando a posição da foto movida com a da foto vizinha).
4. Não há confirmação visual de que a gravação no banco teve sucesso além da própria tela já mostrar a nova ordem — se a gravação falhar silenciosamente, a tela local e o banco podem ficar temporariamente dessincronizados até a próxima busca de dados.

Este fluxo já passou por duas correções de estabilidade (uma falha ao clicar muito rápido nas setas, e uma outra que derrubava a página inteira) — ver [[09-uploads-imagens]] e o histórico de commits do projeto para o contexto completo.

## Como os componentes trocam informação entre si

- **Props de cima para baixo**: o padrão dominante. Uma página busca os dados e passa como propriedades para os componentes filhos — não há um mecanismo de "puxar" dados de dentro de um componente filho.
- **Nenhum uso de Context do React** em todo o projeto — nem para autenticação, nem para nenhum outro estado compartilhado entre componentes distantes na árvore.
- **Nenhuma biblioteca de estado global** — tudo que um componente precisa lembrar fica em `useState` local a ele mesmo.
- **Parâmetros da URL como filtro compartilhado**: em vez de um estado compartilhado em memória, algumas telas usam os parâmetros da própria URL (ex.: `?tema=`, `?categoria=`) para guardar o filtro ativo — isso tem a vantagem de o filtro sobreviver a um recarregamento de página ou a um link compartilhado.
- **Funções de callback repassadas para os filhos**: quando um componente pai precisa saber que algo aconteceu dentro de um filho (por exemplo, o visitante clicou para fechar a galeria em tela cheia), o pai passa uma função para o filho chamar — o filho nunca decide sozinho seu próprio estado de visibilidade quando o pai é quem controla essa lógica.
- **Atualização "por navegação"**: a forma como uma tela sabe que precisa mostrar dados novos depois de uma escrita em outra tela é, na prática, sempre through navegação — voltar para a lista e pedir para o Next.js buscar tudo de novo (`router.refresh()`) ou invalidar o cache de uma rota específica (`revalidatePath()`), nunca por um evento em tempo real ou uma assinatura de dados.
