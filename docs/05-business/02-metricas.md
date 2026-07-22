# Métricas de Negócio

## Objetivo do documento

Explicar quais números o negócio acompanha hoje (através do Dashboard do admin), como cada um é calculado em termos de regra de negócio, e quais métricas relevantes ainda não são medidas pelo sistema.

## Quando deve ser utilizado

Consulte ao interpretar um número do Dashboard, ao propor uma métrica nova, ou ao explicar para alguém de negócio "de onde vem" cada indicador exibido no admin.

## Documentos referenciados

- [[00-modelo-negocio]]
- [[06-politicas-e-objetivos-comerciais]] — os objetivos comerciais que estas métricas deveriam, no futuro, ajudar a medir
- `../01-product/05-paginas-admin.md` — descrição funcional completa do Dashboard e seus widgets
- `../02-architecture/02-modelo-dados.md` — os campos de banco de dados por trás de cada métrica

---

## Isto é um Dashboard de KPIs?

No sentido estrito, um KPI (indicador-chave de performance) é uma métrica formalmente escolhida para medir o progresso em direção a um objetivo, geralmente com uma meta numérica associada. O Dashboard do admin **exibe métricas de negócio genuínas**, mas nenhuma delas tem uma meta declarada em lugar nenhum do sistema (ex. "receita mensal deveria ser X") — funcionam mais como um **painel de acompanhamento** do que como um painel de KPIs no sentido formal. Isso não diminui sua utilidade prática, apenas deixa claro que "bater" ou "não bater" um número aqui é uma leitura que cabe a quem interpreta, não uma comparação automática contra uma meta.

## Métricas já acompanhadas hoje (Dashboard)

| Métrica | O que significa | Como é calculada |
|---|---|---|
| **Receita do mês** | Quanto dinheiro o negócio já faturou de fato no mês corrente | Soma do valor total dos eventos com status **Concluído** cuja data cai no mês atual — eventos ainda em andamento ou só orçados não entram nessa conta, mesmo que já tenham valor definido |
| **Eventos confirmados** | Quantos eventos do mês já são compromissos reais, não apenas possibilidades | Contagem de eventos do mês com status Confirmado, Em andamento ou Concluído |
| **A receber** | Quanto dinheiro ainda falta entrar, de eventos que o negócio já considera certos | Soma de (valor total − sinal pago) dos eventos do mês que não estão totalmente pagos e não foram cancelados |
| **Produtos** | Tamanho do catálogo ativo | Contagem total de produtos cadastrados, com o total de categorias como referência complementar |
| **Receita mensal (últimos 6 meses)** | Tendência de faturamento ao longo do tempo, incluindo sazonalidade | Mesma regra da "Receita do mês", repetida mês a mês, só para eventos concluídos |
| **Receita por categoria de evento** | Quais tipos de festa (casamento, aniversário, etc.) trazem mais retorno | Soma de receita agrupada por categoria, mesma base de eventos concluídos |
| **Calendário / próximos eventos** | Visão operacional da agenda | Lista de eventos futuros, não é propriamente uma métrica financeira, mas é o principal indicador de carga de trabalho à frente |

## Como interpretar essas métricas corretamente

- **"Receita" no Dashboard nunca inclui orçamentos em aberto** — é sempre dinheiro de eventos já realizados e marcados como concluídos. Um mês pode "parecer" fraco no gráfico de receita simplesmente porque vários eventos daquele mês ainda não foram marcados como concluídos no sistema (não necessariamente porque o negócio teve pouco movimento).
- **"A receber" depende de disciplina de registro** — se a equipe não atualizar o sinal pago ou o status de pagamento no evento, esse número fica desatualizado. É uma métrica tão confiável quanto o cuidado no preenchimento do formulário de evento.
- **Status do evento e status de pagamento são independentes** — um evento "Concluído" não significa necessariamente "Pago" (ver `../00-vision/00-visao-geral.md`, regras de negócio). Ao ler o Dashboard, vale sempre olhar "A receber" junto com "Receita", não um sozinho.

## Métricas relevantes que o sistema NÃO mede hoje

Vale ter clareza sobre essas lacunas — elas não aparecem em lugar nenhum do produto atual, mas seriam naturalmente úteis ao negócio:

- **Taxa de conversão do site**: quantos visitantes clicam no botão de WhatsApp, e quantos desses viram evento de fato. Não há nenhuma ferramenta de analytics instalada no site (ver `../02-architecture/03-integracoes.md`) — hoje não há como saber quantas pessoas visitam o site ou clicam nos botões de contato.
- **Taxa de conversão de orçamento**: quantos eventos criados com status "Orçamento" avançam até "Confirmado" (versus os que ficam parados ou são cancelados). Os dados para calcular isso já existem no banco (contando eventos por status ao longo do tempo), mas não há nenhum indicador pronto no Dashboard para esse número hoje.
- **Ticket médio por evento** e **ticket médio por categoria**: não é exibido diretamente, ainda que calculável a partir dos mesmos dados de receita por categoria já somados.
- **Taxa de cancelamento**: quantos eventos avançam para "Cancelado" em vez de "Concluído" — hoje eventos cancelados só aparecem misturados na seção de "Histórico" da lista de eventos, sem um indicador dedicado.
- **Itens/decorações mais alugados**: não há um ranking de quais produtos aparecem com mais frequência nos itens de evento, apesar de essa informação existir na tabela que liga eventos a produtos.
- **Clientes recorrentes**: não há nenhuma forma de identificar se um cliente já contratou a Decobalões antes — cada evento é um registro independente, sem vínculo a um cadastro de cliente reutilizável.
- **Satisfação do cliente**: não há nenhuma coleta de avaliação/feedback pós-evento dentro do sistema.

Nenhuma dessas lacunas é um defeito do sistema — reflete simplesmente o estágio atual de maturidade das ferramentas do negócio. Vale considerá-las como possíveis evoluções futuras do Dashboard, priorizadas conforme a necessidade real da operação.

## Conversão — o funil resumido em pontos mensuráveis (e não mensuráveis)

Retomando o funil comercial completo descrito em [[00-modelo-negocio]], cada etapa representa um ponto de conversão em potencial — aqui está o que é medido e o que não é, hoje:

| Etapa do funil | É medida hoje? |
|---|---|
| Visitante → clique em WhatsApp | Não — sem analytics instalado |
| Contato no WhatsApp → evento registrado como "Orçamento" | Não — a conversa acontece fora do sistema, e nem todo contato vira necessariamente um registro |
| "Orçamento" → "Confirmado" | Os dados existem no banco (histórico de status por evento), mas não há um indicador pronto calculando essa taxa |
| "Confirmado" → "Concluído" (execução sem cancelamento) | Mesma situação — calculável, não calculado |
| Cliente "Concluído" → volta a contratar de novo | Não — não há identificação de cliente recorrente (ver [[05-clientes-e-pedidos]]) |

Na prática, a única conversão "medida" de ponta a ponta hoje é indireta: a receita de eventos concluídos, que representa o resultado final de todo o funil, sem visibilidade sobre onde ao longo do caminho os clientes em potencial se perdem.
