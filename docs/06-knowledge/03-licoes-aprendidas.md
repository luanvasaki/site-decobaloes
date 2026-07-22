# Lições Aprendidas

## Objetivo do documento

Registrar problemas reais que já aconteceram neste projeto — o que aconteceu, como cada um foi resolvido, e a lição geral que fica — para que não se repitam por falta de contexto histórico. Cada entrada abaixo segue a mesma estrutura: **problema encontrado** ("O que aconteceu") → **como foi resolvido** → **lição** (o princípio geral a aplicar daqui para frente).

## Quando deve ser utilizado

Consulte antes de mexer em upload de fotos, reordenação de galeria, formulários com campos numéricos, ou qualquer comportamento específico de iOS/Safari — são as áreas com histórico real de bugs neste projeto.

## Documentos referenciados

- `../02-architecture/09-uploads-imagens.md` — detalhe técnico completo das duas lições mais importantes (upload e reordenação)
- [[01-decisoes-tecnicas]]
- [[04-decisoes-futuras]] — perguntas em aberto que nasceram, em parte, destas lições
- `../04-development/04-testes.md`

---

## Falha de upload de uma foto não deve derrubar o salvamento inteiro

**O que aconteceu**: no formulário de produto, se uma única foto falhasse ao enviar (rede instável, arquivo grande), o erro interrompia todo o processo — o produto inteiro deixava de ser salvo, mesmo que todos os outros dados estivessem corretos e as outras fotos tivessem funcionado. O usuário via uma mensagem genérica de erro sem entender que o problema era só uma foto.

**Lição**: uma operação composta por várias partes independentes (aqui, várias fotos) não deveria falhar por inteiro por causa de uma única parte. Cada arquivo passou a ser enviado com sua própria captura de erro; o que falha é reportado separadamente, e o resto (produto + demais fotos) é salvo normalmente.

**Onde isso se aplica agora**: o mesmo padrão foi replicado na tela de Galeria do admin. Qualquer upload novo que for adicionado ao projeto deveria seguir esse mesmo princípio de falha isolada por arquivo.

## Atualização de estado do React dentro de um "transition" pode derrubar a página

**O que aconteceu**: ao reordenar rapidamente as fotos da página inicial, uma chamada de transição do React estava sendo feita de dentro de uma função de atualização de estado — algo que o React não permite — e isso derrubava a página inteira com um erro no navegador.

**Lição**: cuidado ao combinar `useTransition`/`startTransition` com atualizações funcionais de estado (`setState(prev => ...)`) — a chamada de transição precisa ficar fora do "updater", nunca dentro dele. Um erro desse tipo pode passar despercebido em testes manuais casuais porque só aparece com cliques rápidos e sucessivos.

## Cliques rápidos em botões de reordenar podem embaralhar a ordem (stale closure)

**O que aconteceu**: cliques rápidos e sucessivos nas setas de mover fotos (tanto na galeria por categoria quanto na lista da home) às vezes resultavam em uma ordem final incorreta.

**Lição**: uma função que lê o estado atual para calcular o próximo estado deve sempre usar a forma funcional de atualização (`setState(prev => ...)`), nunca capturar o valor do estado de uma renderização anterior — especialmente em interações que o usuário pode disparar repetidamente e rápido, como cliques em setas de reordenar.

## Formulários com campos numéricos precisam aceitar o formato brasileiro

**O que aconteceu**: o formulário de produto inicialmente não aceitava vírgula como separador decimal — um problema real para usuários brasileiros digitando preços e dimensões do jeito que estão acostumados.

**Lição**: qualquer campo numérico voltado ao usuário final brasileiro deve normalizar tanto vírgula quanto ponto como separador decimal antes de validar/salvar — não presumir o formato americano por padrão.

## Mensagens de erro genéricas escondem a causa real do problema

**O que aconteceu**: o formulário de produto passou por uma sequência de ajustes (visível no histórico de commits) até chegar num tratamento de erro satisfatório — começou com uma mensagem de erro genérica que não ajudava a diagnosticar o problema, passou por uma fase temporária de expor o erro técnico bruto do Supabase para depuração, até chegar no formato atual: uma mensagem que aponta o campo específico com problema, com rolagem automática até ele.

**Lição**: uma mensagem de erro genérica ("Erro ao salvar") sem indicar o que exatamente falhou custa tempo de suporte e frustra quem está preenchendo o formulário. Vale sempre investir em identificar e comunicar a causa específica antes de considerar um formulário "pronto" — mas sem deixar mensagens de depuração bruta (erros técnicos do banco) visíveis na versão final para o usuário.

## Comportamento do iOS Safari com formulários exige atenção extra

**O que aconteceu**: o histórico do projeto registra mais de uma correção específica para o Safari no iOS — um botão de posição fixa ("sticky") que impedia o clique de funcionar corretamente, e um problema de submissão do formulário que só acontecia nesse navegador específico.

**Lição**: testar um formulário só no navegador de desenvolvimento (geralmente Chrome/desktop) não é suficiente — comportamentos de toque, posicionamento fixo e submissão de formulário podem se comportar de forma diferente no Safari iOS, que é provavelmente o navegador mais usado pelos clientes reais deste negócio (celular). Vale testar formulários críticos em um iPhone real ou simulador antes de considerar uma mudança pronta.

## Erros de build só aparecem no momento do deploy

**O que aconteceu**: houve pelo menos uma correção dedicada a "erros de build para deploy no Vercel" — ou seja, um problema que não impedia o funcionamento em desenvolvimento local, mas quebrava especificamente o processo de build de produção.

**Lição**: reforça a recomendação já registrada em `../04-development/03-fluxo-git.md` — sempre rodar o build de produção localmente (`npm run build`) antes de publicar, já que não existe nenhuma verificação automática de build antes do deploy manual.

## `npm run build` e `npm run dev` não devem rodar ao mesmo tempo

**O que aconteceu**: durante uma sessão de ajustes visuais, `npm run build` foi rodado enquanto `npm run dev` ainda estava ativo no mesmo diretório. Os dois processos compartilham a mesma pasta `.next` por padrão — o build de produção sobrescreveu/corrompeu os artefatos que o servidor de desenvolvimento estava usando, e a Home passou a renderizar em branco (sem imagens, sem a maior parte do conteúdo) até o servidor ser reiniciado.

**Como foi resolvido**: parar o servidor de dev, apagar a pasta `.next`, e reiniciar do zero.

**Lição**: nunca rodar `npm run build` com `npm run dev` ativo no mesmo diretório do projeto. Parar um antes de rodar o outro. Se um sintoma "impossível" aparecer (imagens que existem não carregam, seções inteiras somem) logo depois de rodar os dois em paralelo, suspeitar primeiro de `.next` corrompido antes de investigar o código.

## Selecionar várias fotos rápido demais podia perder a seleção (capa/home da Galeria)

**O que aconteceu**: em produção, a administradora marcou algumas fotos para a nova seção "Fotos de Capa (Hero)" e saiu da tela logo em seguida — a lista salva ficou vazia (`hero_images: []`), mesmo com um `updated_at` recente confirmando que uma gravação de fato aconteceu. Duas causas raiz combinadas: (1) cada clique de "adicionar/remover" disparava sua própria gravação em segundo plano, sem esperar a anterior terminar — cliques rápidos em sequência podiam chegar ao banco fora de ordem, e o mais lento sobrescrevia o mais recente com um estado antigo; (2) sair da página (fechar a aba, recarregar, digitar outra URL) podia cancelar uma gravação ainda em andamento antes dela terminar.

**Como foi resolvido**: `updateHeroImages`/`updateHomepageImages` (`app/admin/galeria/page.tsx`) passaram a agrupar (debounce de 600ms) as gravações — cada clique novo cancela o envio anterior ainda não disparado e reagenda com o estado mais atual, então uma sequência de cliques rápidos vira uma única gravação com o resultado final correto, não várias gravações concorrentes. Além disso, um aviso do navegador (`beforeunload`) agora impede sair da página por engano enquanto uma gravação ainda está pendente, e um indicador visual "Salvando... não saia da página" aparece ao lado do título da seção.

**Lição**: qualquer ação de salvar-ao-clicar (sem um botão explícito de "Salvar") que dispare uma escrita de rede a cada clique — especialmente quando o usuário pode clicar em vários itens rapidamente — precisa agrupar essas escritas (debounce) para não gravar fora de ordem, e precisa avisar antes de permitir sair da página enquanto uma gravação está pendente. Esse padrão (`updateHeroImages`/`updateHomepageImages`) deveria ser o modelo para qualquer "salvar automático" novo que o projeto vier a ter.

## Regras de negócio descobertas depois do lançamento inicial

O commit `feat: permite cadastrar produto sem preço definido (a combinar)` é um bom lembrete de que nem toda regra de negócio é óbvia desde o primeiro dia — a necessidade de um preço opcional só foi endereçada depois do site já estar no ar, provavelmente a partir do uso real pela equipe. **Lição geral**: esperar que o sistema evolua depois do lançamento conforme a operação real revela necessidades que não estavam claras durante o planejamento inicial — e tratar isso como parte normal do processo, não como falha de especificação.
