# Modelo de Negócio

## Objetivo do documento

Explicar como a Decobalões efetivamente ganha dinheiro e como o site (vitrine pública + painel administrativo) se encaixa nesse modelo — do primeiro contato de um cliente até o pagamento final de um evento.

## Quando deve ser utilizado

Consulte ao propor uma funcionalidade nova, para avaliar se ela se encaixa no modelo de negócio real da empresa (serviço sob encomenda, não e-commerce), ou ao explicar o negócio para alguém de fora da área técnica.

## Documentos referenciados

- `../00-vision/00-visao-geral.md` — propósito e problema resolvido pelo negócio
- [[01-stakeholders]]
- [[02-metricas]]
- `../01-product/05-paginas-admin.md` — o módulo de Eventos, onde o ciclo descrito aqui é operado no dia a dia

---

## Tipo de negócio

A Decobalões é uma prestadora de serviço de decoração de festas, não uma loja online. Ela **aluga** decorações montadas e itens/materiais avulsos para eventos — não vende produtos físicos para o cliente levar embora. O site não processa nenhuma venda diretamente; ele existe para atrair o interesse do cliente e, depois, para a equipe organizar internamente o que já foi fechado por fora do site (via WhatsApp).

## As duas fontes de receita

1. **Decorações** — pacotes de decoração montados para um tipo específico de evento (casamento, aniversário, festa infantil, chá de bebê), com paleta de cores e porte de evento (pequeno/médio/grande) definidos. O preço, quando existe, é "por evento" — e a montagem/desmontagem pode estar incluída no valor ou não, dependendo do item.
2. **Materiais** — itens físicos avulsos disponíveis para locação (com controle de estoque: quantidade total e quantidade disponível), cobrados separadamente das decorações.

## Por que o preço às vezes não existe ("A combinar")

Muitos orçamentos de decoração de festa dependem de detalhes que só aparecem numa conversa (tamanho do espaço, quantidade de convidados, combinação de itens) — por isso o catálogo permite cadastrar um item sem preço fixo, mostrando "A combinar" em vez de tentar forçar um valor genérico que não refletiria o orçamento real. Isso não é uma limitação técnica, é reflexo de como o negócio realmente precifica: uma base de referência pública, com ajuste fino feito na conversa.

## O funil comercial completo

1. **Descoberta** — um visitante encontra o site (indicação, redes sociais, busca).
2. **Consideração** — navega o Catálogo (por tema ou tipo de material), vê o Portfólio de trabalhos realizados, eventualmente lê a página Sobre para ganhar confiança.
3. **Contato** — clica em um botão de WhatsApp (genérico ou de um produto específico) e abre uma conversa. **É aqui que o site termina seu papel na venda** — nenhuma negociação, orçamento formal ou fechamento acontece dentro da plataforma.
4. **Negociação** — acontece inteiramente no WhatsApp, fora do sistema.
5. **Registro interno** — a equipe cria um evento no admin com status "Orçamento", já com os detalhes conversados (data, tema, itens, valor estimado).
6. **Confirmação** — quando o cliente confirma e paga um sinal, o status muda para "Confirmado" e o valor/data do sinal são registrados.
7. **Execução** — próximo à data, o status muda para "Em andamento" (cobre inclusive a montagem e desmontagem, quando fazem parte do serviço contratado).
8. **Conclusão e pagamento** — depois da festa, o status vira "Concluído" e o pagamento é marcado como "Pago" quando o saldo é quitado. **É só a partir deste ponto que o valor entra na receita reconhecida pelo negócio** (o Dashboard só soma eventos concluídos na receita do mês).

## Estrutura financeira de um evento

Cada evento carrega dois valores centrais: o **valor total** combinado e o **sinal/entrada** pago antecipadamente — a diferença entre os dois é o "saldo a receber", acompanhado durante todo o ciclo de vida do evento. O pagamento tem seu próprio status (Pendente/Parcial/Pago), independente do andamento operacional do evento — ou seja, a saúde financeira de um evento e o seu andamento logístico são acompanhados separadamente, porque nem sempre andam juntos na prática (um evento pode estar concluído sem estar 100% pago, por exemplo).

## O que o site NÃO faz, e por quê isso é uma escolha de modelo de negócio

Não há carrinho, checkout ou pagamento online — porque o produto real (decoração de um evento específico) não é um item de prateleira com preço fixo e entrega padronizada; é um serviço personalizado que depende de conversa humana antes de qualquer compromisso financeiro. Tentar forçar um fluxo de e-commerce tradicional nesse tipo de negócio tenderia a gerar pedidos incompletos ou mal-configurados. O modelo atual — vitrine + conversa + gestão manual do orçamento — é adequado ao porte e à natureza do negócio (uma operação pequena, de atendimento próximo e personalizado).
