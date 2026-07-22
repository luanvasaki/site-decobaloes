# Perguntas Frequentes

## Objetivo do documento

Responder rapidamente às perguntas mais comuns de quem está chegando ao projeto agora — de negócio ou técnicas — sem precisar procurar a resposta espalhada pela documentação.

## Quando deve ser utilizado

Consulte antes de perguntar a alguém da equipe algo que provavelmente já foi perguntado antes. Se a pergunta não estiver aqui, considere adicioná-la depois de descobrir a resposta.

## Documentos referenciados

- [[00-glossario]]
- [[01-decisoes-tecnicas]]
- `../00-vision/00-visao-geral.md`

---

## Perguntas de negócio

**Por que o site não tem carrinho de compras?**
Porque o negócio não vende produtos de prateleira — aluga decorações personalizadas para eventos, cujo valor final quase sempre depende de uma conversa. O site funciona como vitrine + gerador de contato via WhatsApp; a negociação e o fechamento acontecem fora da plataforma. Ver `../05-business/00-modelo-negocio.md`.

**Por que alguns produtos não mostram preço?**
Porque nem todo item tem um valor fixo — alguns dependem de detalhes do evento. Nesse caso, o site mostra "A combinar" em vez de um número. Ver ADR 9 em [[01-decisoes-tecnicas]].

**Quem pode acessar o painel administrativo?**
Qualquer pessoa com uma conta de login válida no Supabase Auth do projeto — não existem papéis diferentes (todo mundo que loga tem acesso total). Contas novas só podem ser criadas diretamente no painel do Supabase, não pelo próprio site.

**Como sei se um evento já foi pago?**
O status de pagamento (Pendente/Parcial/Pago) é um campo próprio de cada evento, independente do andamento do evento em si (status Orçamento/Confirmado/Em andamento/Concluído/Cancelado). Um evento "Concluído" não significa automaticamente "Pago" — os dois precisam ser conferidos separadamente.

**Dá para saber quantas pessoas visitam o site?**
Não hoje — não há nenhuma ferramenta de analytics instalada. Ver `../05-business/02-metricas.md` para outras métricas que também não são acompanhadas ainda.

## Perguntas técnicas

**Por que dar `git push` não publica o site?**
Porque não existe integração automática entre o repositório e a Vercel neste projeto — o deploy é sempre um comando manual à parte. Ver `../04-development/03-fluxo-git.md`.

**Posso testar uma mudança localmente sem medo de estragar alguma coisa?**
Com cuidado, sim, mas com uma ressalva importante: o ambiente local usa **o mesmo banco de dados da produção** — não existe um banco de testes separado. Qualquer dado criado ou apagado localmente afeta o site real. Ver `../04-development/02-ambiente-local.md`.

**Por que não existem testes automatizados?**
É o estado real do projeto até agora, não uma lacuna temporária — não há framework de teste configurado, nem pipeline de CI. A verificação de qualquer mudança é manual. Ver `../04-development/04-testes.md`.

**Por que alguns componentes em `components/home/` não aparecem em lugar nenhum do site?**
São resíduos de uma versão anterior do design da home — código que ficou no repositório mas não está mais conectado a nenhuma página. Não devem ser usados como referência de padrão atual; são candidatos a limpeza futura.

**O projeto usa uma biblioteca de componentes (shadcn/ui, Radix)?**
Está configurado para isso, mas na prática só o componente de notificação (toast) foi gerado — e nem esse é usado em nenhum lugar. A maior parte da interface é HTML puro estilizado com Tailwind. Ver ADR 7 em [[01-decisoes-tecnicas]].

**Por que o sistema de notificação toast existe mas nunca aparece na tela?**
Foi instalado (provavelmente como parte do setup inicial do shadcn/ui) mas o projeto nunca passou a chamá-lo — o feedback ao usuário real acontece por outros meios (mensagens inline, diálogos nativos do navegador, mudança de texto no próprio botão). Ver `../03-design/02-fluxos-ux.md`.

**Existe uma API própria que eu possa chamar de fora do site?**
Não — não há nenhuma rota de API neste projeto. Todo acesso a dados acontece de dentro da própria aplicação Next.js, direto no Supabase. Ver ADR 1 em [[01-decisoes-tecnicas]].

**Posso dar a alguém um acesso "limitado" ao admin (ex. só mexer na galeria)?**
Não com o sistema como está hoje — não existe controle de permissão por área; qualquer login tem acesso a tudo. Ver ADR 3 em [[01-decisoes-tecnicas]].

**Por que a tabela `rentals` existe no banco mas não aparece em nenhuma tela?**
É uma tabela preparada para um modelo de locação mais simples, criada no schema inicial, mas nunca conectada a nenhuma funcionalidade do admin ou do site público até agora — código/estrutura morta, não um bug.

**Onde fica documentado o motivo de uma decisão técnica específica?**
Em [[01-decisoes-tecnicas]], no formato de ADR (contexto, decisão, consequências).
