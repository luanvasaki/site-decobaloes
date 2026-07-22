# Políticas Comerciais e Objetivos

## Objetivo do documento

Reunir as políticas comerciais que já podem ser inferidas do funcionamento real do sistema (mesmo sem estarem escritas formalmente em lugar nenhum), e os objetivos comerciais que orientam o negócio.

## Quando deve ser utilizado

Consulte antes de assumir que uma regra comercial existe ou não existe, e ao alinhar prioridades com foco em crescimento do negócio, não só em funcionalidade do sistema.

## Documentos referenciados

- [[00-modelo-negocio]]
- [[05-clientes-e-pedidos]]
- [[02-metricas]]
- `../00-vision/01-objetivos.md` — objetivos do produto/site (diferente dos objetivos comerciais tratados aqui)

---

## Políticas comerciais observáveis no sistema

**Importante**: a Decobalões não documenta políticas comerciais formais em nenhum lugar do produto (não há um "termos de serviço" nem uma página de políticas no site público). O que segue são regras **implícitas**, inferidas de como o sistema foi construído — não uma declaração oficial da empresa. Se houver uma política real diferente da descrita aqui, o sistema deveria ser considerado desatualizado em relação à prática real do negócio, não o contrário.

- **Preço não é obrigatório no primeiro contato** — a existência da opção "A combinar" institucionaliza a prática de negociar preço em vez de exigir um valor fixo publicado sempre (ver [[04-precificacao-e-promocoes]]).
- **Confirmação de evento depende de sinal** — o próprio fluxo do sistema (um evento só avança de "Orçamento" para "Confirmado" quando a equipe registra um valor de sinal) sugere que a prática comercial real exige algum pagamento antecipado para reservar uma data, embora nada no sistema *force* tecnicamente essa regra — é possível marcar um evento como "Confirmado" sem sinal registrado, já que não há validação impedindo isso.
- **Cancelamento não tem penalidade automática** — um evento pode ser marcado como "Cancelado" a qualquer momento do seu ciclo de vida, sem que o sistema calcule ou sugira nenhuma retenção de valor já pago. Qualquer política de retenção de sinal em caso de cancelamento, se existir na prática, é aplicada manualmente fora do sistema.
- **Disponibilidade de itens não é reservada automaticamente por data** — cadastrar um evento com um item de material não bloqueia esse mesmo item para outro evento na mesma data; a responsabilidade de evitar conflito de agenda é inteiramente humana.
- **Acesso administrativo não distingue função** — não existe uma política de "quem pode aprovar o quê" dentro do sistema; qualquer pessoa com login tem autoridade total sobre preços, cadastro e dados de clientes (ver `../06-knowledge/01-decisoes-tecnicas.md`, ADR 3).

## Objetivos comerciais

Assim como não há políticas formalmente documentadas, também não há metas comerciais formalmente declaradas (números de faturamento-alvo, meta de novos clientes, etc.) registradas em nenhum lugar do produto ou desta documentação. Os objetivos abaixo são inferidos do propósito do negócio (`../00-vision/00-visao-geral.md`) e da forma como o sistema foi construído — não são compromissos numéricos, e sim direções de negócio observáveis:

- **Converter visibilidade em conversas reais**: todo o desenho do site público (catálogo, portfólio, página Sobre) existe para levar o visitante a um único ponto de conversão — o contato via WhatsApp. O objetivo comercial implícito é maximizar esse encontro entre "alguém buscando decoração" e "uma conversa com a Decobalões", não maximizar cliques ou tempo no site por si só.
- **Reduzir a dependência de canais informais**: o próprio módulo de eventos existe para tirar o controle do negócio de planilhas/papel/memória, sugerindo um objetivo de profissionalizar a operação conforme o volume de eventos cresce.
- **Priorizar categorias de maior retorno**: a existência de "Receita por categoria de evento" no Dashboard (ver [[02-metricas]]) sugere que decidir onde investir esforço de marketing/portfólio por tipo de festa é (ou deveria ser) uma decisão orientada por dado, não só por preferência.
- **Manter o atendimento pessoal como diferencial**, mesmo crescendo — a ausência deliberada de automação de vendas (sem checkout, sem chatbot) no site indica uma escolha de manter a conversa humana como parte do valor entregue, não apenas como uma limitação técnica atual.

## Onde isso deveria evoluir

Se a Decobalões quiser tornar essas políticas e objetivos mais do que inferências, os passos naturais seriam: registrar formalmente (mesmo que fora do sistema, por enquanto) as políticas reais de sinal/cancelamento, e transformar os objetivos comerciais listados acima em metas mensuráveis a partir das métricas já existentes ou das lacunas identificadas em [[02-metricas]].
