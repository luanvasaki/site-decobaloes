# Clientes e Pedidos

## Objetivo do documento

Explicar como o negócio se relaciona com seus clientes e como um "pedido" (uma festa contratada) é entendido e registrado neste sistema.

## Quando deve ser utilizado

Consulte ao registrar um evento novo, ao pensar em como melhorar o relacionamento com clientes recorrentes, ou ao explicar para alguém de negócio o que o sistema entende por "pedido".

## Documentos referenciados

- [[00-modelo-negocio]]
- `../05-business/01-stakeholders.md` — o perfil dos clientes como stakeholders
- `../01-product/05-paginas-admin.md` — o módulo de Eventos, onde pedidos são registrados

---

## Clientes

### Como o negócio conhece um cliente

Um cliente é identificado, dentro do sistema, apenas pelos dados informados em cada evento: nome, telefone e (opcionalmente) e-mail. **Não existe um cadastro de cliente independente e reutilizável** — cada evento registrado é uma entrada isolada, mesmo que a mesma pessoa já tenha contratado a Decobalões antes. Isso tem uma consequência direta: hoje não há como o sistema apontar automaticamente "este cliente já é recorrente" ou consultar o histórico de festas de uma mesma pessoa sem procurar manualmente pelo nome ou telefone entre os eventos.

### Relacionamento e ciclo de vida do cliente

Do ponto de vista de negócio, um cliente passa por três momentos:
1. **Visitante/lead** — ainda não conversou com a empresa; existe só como uma visita anônima ao site (não rastreada, ver [[02-metricas]]).
2. **Em negociação** — já entrou em contato via WhatsApp; pode ou não já ter um evento registrado como "Orçamento" no sistema.
3. **Cliente confirmado** — tem um evento com status "Confirmado" ou além, com sinal pago.

Não existe, no sistema, nenhuma etapa que represente "ex-cliente satisfeito, candidato a contratar de novo" — um cliente que já teve um evento "Concluído" não recebe nenhum tratamento diferenciado automático (sem lembrete de aniversário, sem campanha de reengajamento).

## Pedidos

### O que "pedido" significa aqui

Não existe um conceito de "pedido" separado do conceito de "evento" — no vocabulário deste sistema, um **evento é o pedido**: o registro de uma festa contratada (ou em fase de orçamento), com tudo que ela envolve — cliente, data, itens, valores. Ver o glossário (`../06-knowledge/00-glossario.md`) para os termos completos.

### O que compõe um pedido

- Dados do cliente (nome, telefone, e-mail).
- Dados do evento em si (data, horário, local, tema, número de convidados).
- Os itens contratados — vindos do catálogo ou combinados especificamente para aquela festa (ex. um item avulso sem correspondência no catálogo).
- Valores (total combinado, sinal, forma e status de pagamento).
- Notas internas, visíveis só à equipe.

### O ciclo de vida comercial de um pedido

Do ponto de vista comercial (não técnico — a versão técnica completa está em `../01-product/05-paginas-admin.md`): um pedido nasce como uma possibilidade (**Orçamento**), vira um compromisso real quando o cliente confirma e paga o sinal (**Confirmado**), entra em execução perto da data da festa (**Em andamento** — cobre inclusive a montagem/desmontagem quando fazem parte do serviço), e se encerra como sucesso (**Concluído**) ou como desistência (**Cancelado**, que pode acontecer a partir de qualquer etapa anterior).

### O que o sistema não garante sobre um pedido

- Não há confirmação automática de disponibilidade de data/item — nada no sistema impede, por exemplo, dois eventos serem registrados no mesmo dia com o mesmo item de material reservado para os dois. Essa verificação, se acontecer, é manual (olhando o calendário do Dashboard) e depende da atenção de quem está cadastrando.
- Não há nenhuma política de cancelamento aplicada automaticamente (ex. reter parte do sinal) — qualquer regra desse tipo, se existir na prática do negócio, é aplicada manualmente na conversa com o cliente, não pelo sistema.
