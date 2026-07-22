# Checklists — Pull Request, Merge e Release

## Objetivo do documento

Dar um roteiro objetivo de verificação em três momentos do ciclo de uma mudança: antes de abrir um Pull Request, antes de mesclar (merge) e antes de publicar (release) — compensando a ausência de verificação automática (CI) neste projeto com disciplina manual.

## Quando deve ser utilizado

Consulte nesses três momentos específicos de qualquer mudança de código, do menor ajuste ao maior recurso novo.

## Documentos referenciados

- [[03-fluxo-git]] — convenção de commits e branches usada como base destes checklists
- [[04-testes]] — por que a verificação manual substitui a automática neste projeto
- [[05-convencoes-tecnicas]]
- [[06-performance-boas-praticas]]

---

## Contexto importante antes de usar estes checklists

Hoje, o desenvolvimento deste projeto acontece majoritariamente direto na branch `main`, sem um fluxo formal de Pull Request estabelecido (ver [[03-fluxo-git]]). Os checklists abaixo servem para dois cenários: **(a)** se e quando a equipe adotar um fluxo de Pull Request, e **(b)** como um roteiro de autoverificação mesmo ao commitar direto na `main`, já que os princípios de qualidade valem independentemente de como o código chega até lá.

## Checklist antes de abrir um Pull Request

- [ ] A mudança resolve exatamente o que se propôs — sem alterações não relacionadas misturadas no mesmo conjunto de commits.
- [ ] O código segue as convenções documentadas em [[05-convencoes-tecnicas]] (nomenclatura, estrutura de componente, Server vs. Client Component, uso de `interface` para props).
- [ ] Nenhuma cor, espaçamento ou classe Tailwind foi escrita "no olho" sem checar `../03-design/00-design-system.md`.
- [ ] Mensagens de commit seguem o padrão `fix:`/`feat:` (ou `debug:` só se temporário e com intenção de limpar depois) — ver [[03-fluxo-git]].
- [ ] `npm run lint` roda sem erros.
- [ ] A mudança foi testada manualmente no navegador — não só "parece certo" olhando o código.
- [ ] Se a mudança envolve um formulário, os estados de erro/validação foram testados de propósito, não só o caminho feliz.
- [ ] Se a mudança envolve dado gravado no banco, qualquer dado de teste criado durante o desenvolvimento foi removido (lembrete: o banco local é o mesmo da produção — ver [[02-ambiente-local]]).
- [ ] A descrição da mudança (na própria mensagem de commit, já que não há um template de PR estabelecido) explica o "porquê", não só o "o quê".

## Checklist antes do Merge

- [ ] Todos os itens do checklist de Pull Request acima já foram conferidos.
- [ ] Se houver revisão de outra pessoa disponível, ela foi de fato feita — hoje o projeto não impõe isso tecnicamente (não há proteção de branch nem exigência de aprovação configurada), então é uma disciplina de equipe, não uma trava do sistema.
- [ ] A branch está atualizada com a `main` mais recente, e qualquer conflito foi resolvido com atenção (não resolvido às pressas aceitando um lado sem entender o outro).
- [ ] `npm run build` roda sem erros — pega problemas que só aparecem no build de produção, não no modo de desenvolvimento (já houve, no histórico deste projeto, uma correção dedicada a um erro que só quebrava o build — ver `../06-knowledge/03-licoes-aprendidas.md`).
- [ ] Nenhum código de depuração temporário (`console.log` de investigação, mensagens de erro cruas expostas ao usuário) ficou para trás — o projeto já teve commits inteiros dedicados só a remover esse tipo de resíduo.
- [ ] Se a mudança tocou em uma área com histórico de bug conhecido (upload de foto, reordenação de galeria, formulários com campo numérico, comportamento no Safari iOS), reveja as lições relacionadas em `../06-knowledge/03-licoes-aprendidas.md` antes de mesclar.

## Checklist antes do Release (publicar em produção)

Lembrete: publicar é um passo manual e separado de mesclar código — ver [[03-fluxo-git]]. Fazer merge na `main` não publica nada sozinho.

- [ ] Todos os itens dos dois checklists acima já foram conferidos para tudo que está prestes a ser publicado.
- [ ] O projeto roda localmente sem erro (`npm run dev`) e a(s) tela(s) alteradas foram conferidas visualmente mais uma vez, já com o código final.
- [ ] `npm run build` foi rodado com sucesso imediatamente antes do deploy (não só em algum momento anterior do desenvolvimento — o código pode ter mudado desde então).
- [ ] As variáveis de ambiente necessárias estão configuradas corretamente no ambiente de produção da Vercel (não só localmente) — especialmente se a mudança introduziu uma variável nova.
- [ ] Se a mudança envolve alteração de schema do banco de dados (uma tabela ou coluna nova), o script SQL correspondente já foi aplicado manualmente no Supabase antes do deploy do código que depende dele — a ordem importa, já que não há uma ferramenta de migração automática neste projeto (ver `../02-architecture/02-modelo-dados.md`).
- [ ] Depois do deploy, o site em produção foi verificado de verdade (não só presumido como certo) — navegando a(s) página(s) alteradas no ambiente real.
- [ ] Se algo der errado depois do deploy, existe um plano imediato de reversão (voltar ao deploy anterior pela própria Vercel) — não é preciso reverter código e fazer um novo deploy do zero para isso.

## Por que estes checklists existem, dado que o processo é manual

Sem CI, sem testes automatizados e sem revisão obrigatória configurada no repositório (ver `../06-knowledge/01-decisoes-tecnicas.md`, ADR 5 e ADR 8), a única coisa que impede uma regressão de chegar à produção é a disciplina de quem está desenvolvendo. Estes checklists existem para tornar essa disciplina repetível e menos dependente de lembrar tudo de cabeça a cada mudança.
