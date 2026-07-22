# Catálogo — Produtos e Categorias

## Objetivo do documento

Explicar, do ponto de vista de negócio, o que são os "produtos" e as "categorias" da Decobalões — o que cada um representa comercialmente, como são organizados, e quem decide o que entra no catálogo.

## Quando deve ser utilizado

Consulte ao decidir como cadastrar um item novo no catálogo, ao criar uma categoria nova, ou ao explicar para alguém de negócio a diferença entre os dois tipos de item vendidos.

## Documentos referenciados

- [[00-modelo-negocio]]
- `../01-product/05-paginas-admin.md` — telas de cadastro de Produtos e Categorias
- `../02-architecture/02-modelo-dados.md` — estrutura de dados por trás do catálogo

---

## O que é um "produto" neste negócio

Diferente de uma loja tradicional, um "produto" aqui nunca é vendido para o cliente levar — é sempre **alugado** para uso durante um evento. Existem dois tipos, tratados de forma diferente tanto no cadastro quanto na precificação:

### Decoração
Uma montagem de decoração pensada para um tipo específico de evento (ex. "Decoração Casamento Rústico"). Carrega três informações comerciais próprias: **paleta de cores**, **porte do evento** (pequeno/médio/grande — geralmente ligado à quantidade de convidados) e se **a montagem e desmontagem estão incluídas** no serviço ou são cobradas/organizadas à parte. É o tipo de item mais alinhado ao core do negócio (decoração de festas).

### Material
Um item físico avulso disponível para locação (ex. mobiliário, estrutura), cobrado separadamente de qualquer decoração. Tem controle de estoque próprio — quantidade total possuída pela empresa e quantidade disponível em um dado momento — porque, diferente de uma decoração (que é montada sob encomenda), um material físico existe em quantidade limitada e pode estar emprestado/reservado.

## Disponibilidade

Cada produto tem um interruptor de "disponível para aluguel" — só produtos marcados como disponíveis aparecem no Catálogo público. Isso permite à equipe manter um item cadastrado (com fotos, descrição, histórico) mesmo temporariamente fora de uso, sem precisar excluí-lo e recriá-lo depois.

## O que é uma "categoria"

Uma categoria é o rótulo que organiza tanto produtos quanto eventos por tipo de festa — Casamentos, Aniversários, Festa Infantil, Chá de Bebê, e outras que a equipe decida criar. A mesma lista de categorias serve aos dois propósitos: classificar um item do catálogo e classificar um evento contratado. Isso significa que criar uma categoria nova tem efeito nos dois lugares ao mesmo tempo — vale pensar nela pelo nome que faça sentido tanto para "que tipo de produto é este" quanto para "que tipo de festa é esta".

## Quem decide o que entra no catálogo

Não existe um processo formal de aprovação — qualquer pessoa com acesso ao painel administrativo pode cadastrar, editar ou desativar um produto ou categoria a qualquer momento (ver `../02-architecture/08-api-autenticacao.md` — não há distinção de papéis hoje). Na prática, hoje isso significa que é uma decisão inteiramente da Miriam.

## Regra ao excluir uma categoria

Excluir uma categoria **não exclui** os produtos ou eventos associados a ela — eles simplesmente ficam sem categoria, continuando a existir normalmente. É uma proteção deliberada contra perda acidental de dados ao reorganizar o catálogo.

## Como o catálogo aparece para o cliente

O visitante nunca vê a lista de categorias "crua" — o site público organiza os produtos do tipo Decoração por um conjunto fixo de "temas" (Casamentos, Aniversários, Festa Infantil, Chá de Bebê), e os do tipo Material em uma aba separada. Esse agrupamento por tema é decidido no código do site, não editável diretamente pela equipe através do admin — cadastrar uma categoria nova de decoração não cria automaticamente uma aba nova no Catálogo público, a menos que o mapeamento entre categoria e tema seja também atualizado (ver `../02-architecture/05-estrutura-pastas.md`, `lib/category-mapping.ts`). Vale ter isso em mente antes de criar uma categoria totalmente nova de decoração, esperando que ela apareça automaticamente como uma aba do site.
