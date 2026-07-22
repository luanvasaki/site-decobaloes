# Precificação e Promoções

## Objetivo do documento

Detalhar como o preço de um item ou de um evento é definido e comunicado neste negócio, e deixar claro o que existe (e o que não existe) em termos de promoções.

## Quando deve ser utilizado

Consulte ao cadastrar o preço de um produto novo, ao negociar um valor de evento, ou ao considerar introduzir algum tipo de promoção/campanha.

## Documentos referenciados

- [[00-modelo-negocio]] — de onde vem a regra "A combinar"
- [[03-catalogo-produtos-categorias]]
- `../01-product/05-paginas-admin.md` — campos de preço no formulário de produto e de evento

---

## Precificação de produtos do catálogo

Cada produto tem um valor de locação "por evento" — não por dia, não por unidade avulsa fora de um evento. Esse valor pode ser:

- **Um valor fixo**, exibido diretamente no Catálogo e na página do produto.
- **Indefinido ("A combinar")** — o campo de preço é deixado em branco de propósito, e o site mostra "A combinar" no lugar de um número. Não é uma falha de cadastro; é uma opção deliberada para itens cujo valor real depende de detalhes do evento (tamanho do espaço, combinação com outros itens, distância, etc.) que só ficam claros numa conversa.

Não existe, hoje, nenhuma regra automática de precificação (ex. preço por convidado, por metro quadrado, por dia da semana) — cada produto tem um único valor de referência, cadastrado manualmente pela equipe.

## Precificação de um evento (o valor final combinado)

O valor que efetivamente conta para o negócio não é necessariamente igual à soma dos preços de catálogo dos itens escolhidos — é um **valor total definido manualmente** pela equipe ao registrar o evento, que pode levar em conta itens do catálogo, itens avulsos combinados especificamente para aquela festa, e qualquer ajuste feito na negociação. O sistema até soma os itens vinculados a um evento como referência, mas essa soma e o valor total final são campos independentes — a equipe decide o valor final, não uma fórmula automática.

## Sinal e forma de pagamento

Todo evento carrega um valor de sinal/entrada (pago antecipadamente para confirmar a reserva) e a data em que foi pago, além da forma de pagamento (Pix, cartão, dinheiro ou transferência) e o status de pagamento (Pendente, Parcial ou Pago) — ver [[00-modelo-negocio]] para o detalhe completo da estrutura financeira de um evento.

## Promoções

**Não existe, hoje, nenhuma funcionalidade de promoção no sistema** — sem cupom de desconto, sem preço "de/por", sem campanha sazonal automatizada, sem nenhum mecanismo para sinalizar um item em oferta no Catálogo público. Se a Decobalões praticar algum tipo de promoção comercial (ex. um valor especial combinado verbalmente para um cliente específico, ou uma condição sazonal), isso acontece inteiramente fora do sistema — na conversa de WhatsApp e no valor final registrado manualmente no evento — sem nenhum registro estruturado de "isto foi uma promoção" em lugar nenhum do banco de dados.

**Se uma funcionalidade de promoções vier a ser considerada no futuro**, valeria pensar em pelo menos: um período de validade, se aplica a um produto específico ou a uma categoria inteira, e como isso deveria (ou não) aparecer no Catálogo público — nenhuma dessas decisões foi tomada ainda, porque a necessidade nunca chegou a ser modelada no sistema.
