# Stakeholders

## Objetivo do documento

Identificar todas as pessoas que têm interesse ou são impactadas pelo site Decobalões, e o que cada uma espera dele.

## Quando deve ser utilizado

Consulte ao avaliar o impacto de uma mudança — pergunte "quem, desta lista, é afetado por isso?" antes de alterar uma funcionalidade.

## Documentos referenciados

- `../00-vision/02-publico-alvo.md` — detalhamento dos perfis de visitante do site público
- [[00-modelo-negocio]]
- [[02-metricas]]

---

## Dona do negócio / administradora — Miriam Vasaki

A fundadora e decoradora responsável pela empresa. É, na prática, a única usuária do painel administrativo hoje (o sistema não tem papéis diferentes de usuário — qualquer login é tratado com acesso total). Seus interesses centrais:
- Manter o catálogo público sempre atualizado e bonito, já que é a principal vitrine do negócio.
- Ter uma visão rápida da saúde financeira do mês (receita, valores a receber) sem depender de planilhas.
- Não perder informação de nenhum evento contratado — cliente, data, itens, valores — num único lugar confiável.
- Poder editar o site (fotos, textos de destaque) sem precisar de ajuda técnica para tarefas do dia a dia.

## Equipe operacional (hoje reduzida, potencialmente maior no futuro)

Qualquer pessoa que ajude Miriam na operação e tenha acesso de login ao admin herda automaticamente acesso total (não há permissões restritas por função). Hoje o sistema não distingue "quem fez o quê" de forma detalhada — um ponto a considerar se a equipe crescer.

## Clientes contratantes (quem já fechou negócio)

Pessoas organizando um evento que já entraram em contato e estão em algum ponto do ciclo de vida de um evento (orçamento → confirmado → em andamento → concluído). Não interagem diretamente com nenhuma tela do sistema — toda a relação com eles acontece por WhatsApp e é só *registrada* no admin pela equipe. Seus interesses (inferidos do funcionamento do sistema): clareza sobre o que foi combinado, cumprimento da data e dos detalhes do evento, e transparência sobre valores pagos e pendentes.

## Visitantes do site (clientes em potencial)

Detalhados em `../00-vision/02-publico-alvo.md` — pais organizando aniversário, noivos organizando casamento, organizadores de eventos diversos. Interesse: descobrir rapidamente se a Decobalões atende ao que precisam, ver preço (quando disponível) e ter um caminho simples para perguntar mais.

## Fornecedor de infraestrutura técnica (Supabase e Vercel)

Não são "usuários" no sentido de negócio, mas o funcionamento do site depende inteiramente deles — o banco de dados, a autenticação, o armazenamento de fotos (Supabase) e a hospedagem (Vercel) são de terceiros. Uma interrupção nesses serviços afeta diretamente tanto o site público quanto a operação interna da empresa (ver `../02-architecture/03-integracoes.md`).

## Quem mantém o código (desenvolvedor(es))

Responsável por implementar mudanças, corrigir problemas e publicar atualizações — hoje sem uma equipe de desenvolvimento dedicada nem processo formalizado (ver `../04-development/`). Interesse: entender rapidamente o sistema (esta pasta `docs/` existe justamente para isso) e evitar quebrar o site em produção, já que não há ambiente de teste separado (o mesmo banco de dados é usado em desenvolvimento e produção — ver `../02-architecture/04-infraestrutura-deploy.md`).

## Como os interesses se cruzam (e onde podem conflitar)

- **Miriam quer simplicidade de uso** × **o sistema exige alguma curva de aprendizado técnica** (formulários com várias seções, upload de fotos) — mitigado por um painel relativamente direto, mas ainda assim uma ferramenta de negócio, não um aplicativo de consumo.
- **Clientes querem resposta rápida** × **o modelo depende de atendimento humano via WhatsApp**, sem automação de resposta — a velocidade de resposta depende inteiramente da disponibilidade da equipe, não do sistema.
- **O negócio quer crescer a equipe** × **o sistema hoje não diferencia papéis de usuário** — se mais pessoas passarem a usar o admin, vale revisitar esse ponto (ver `../02-architecture/08-api-autenticacao.md`).
