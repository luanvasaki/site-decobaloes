# Personas

## Objetivo do documento

Descrever, de forma concreta, como cada tipo de usuário navega e usa as páginas do sistema — conectando os perfis de público-alvo do negócio às páginas e jornadas reais documentadas nesta pasta.

## Quando deve ser utilizado

Consulte ao desenhar uma tela nova, para verificar se ela atende bem a pelo menos uma destas personas, ou ao decidir a prioridade de uma melhoria de UX.

## Documentos referenciados

- `../00-vision/02-publico-alvo.md` — a versão de negócio destes mesmos perfis
- [[04-paginas-publicas]]
- [[05-paginas-admin]]
- [[06-fluxos-navegacao]] — as jornadas completas que cada persona percorre

---

## Persona 1 — A mãe/pai organizando o aniversário do filho

**Quem é**: está planejando uma festa infantil, provavelmente comparando 2-3 fornecedores de decoração ao mesmo tempo, com pouco tempo disponível entre trabalho e a rotina da criança.

**O que busca no site**: referência visual rápida (fotos de festas parecidas com o que imagina), uma ideia de faixa de preço, e um jeito rápido de perguntar disponibilidade sem precisar preencher um formulário longo.

**Páginas que mais usa**: Início → Catálogo (tema Festa Infantil) → Produto → WhatsApp. Raramente visita Sobre ou Contato — decide rápido, pelo visual.

**O que o sistema já atende bem**: navegação por tema no Catálogo, fotos de trabalhos realizados, botão de WhatsApp em um clique a partir de qualquer produto.

**Onde pode encontrar atrito**: se o preço do item que mais gostou for "A combinar", precisa iniciar uma conversa sem saber a faixa de valor — pode desistir se estiver só "olhando preços" nesse momento.

## Persona 2 — Noivos organizando o casamento

**Quem é**: um casal (ou um dos dois, representando a decisão) planejando um evento de maior porte e maior investimento emocional/financeiro do que uma festa infantil comum.

**O que busca no site**: confiança antes de qualquer coisa — quer ver anos de experiência, volume de festas realizadas, e uma decoração que pareça sofisticada, não genérica.

**Páginas que mais usa**: Início (lê as estatísticas de experiência) → Sobre (busca a história da marca) → Catálogo (tema Casamentos) → Produto (examina detalhes como paleta de cores e porte do evento) → WhatsApp. É a persona com a jornada mais longa antes de converter — ver Jornada 2 em [[06-fluxos-navegacao]].

**O que o sistema já atende bem**: a página Sobre foi desenhada especificamente para esse tipo de decisão mais ponderada (estatísticas de experiência, história da fundadora); os detalhes de decoração (paleta de cores, porte do evento) na página de produto ajudam a avaliar adequação sem precisar perguntar.

**Onde pode encontrar atrito**: a página Sobre é a única página pública sem título/descrição de SEO próprios (ver [[04-paginas-publicas]]) — se essa persona chega por busca ("decoração de casamento perto de mim"), a página que mais reforçaria a decisão dela é a que tem menos chance de aparecer bem indexada.

## Persona 3 — Organizador de evento corporativo/diverso

**Quem é**: alguém organizando um chá de bebê, formatura, ou evento fora do padrão "festa infantil/casamento", com necessidades mais específicas.

**O que busca no site**: confirmar que a Decobalões atende ao tipo de evento dele antes de gastar tempo perguntando — e, possivelmente, itens avulsos para alugar (mesa, cadeira) além da decoração.

**Páginas que mais usa**: Catálogo, alternando entre a aba Decorações (tema mais próximo do seu evento) e a aba Materiais.

**O que o sistema já atende bem**: a separação clara entre "Decorações" e "Aluguel de Materiais" no Catálogo permite essa persona encontrar rapidamente o que precisa mesmo sem um tema exato para o seu tipo de evento.

**Onde pode encontrar atrito**: se a aba Materiais ainda tiver poucos itens cadastrados, essa persona vê o estado "Em breve" e pode não voltar — é a persona mais sensível ao tamanho real do catálogo de materiais hoje.

## Persona 4 — Miriam (dona do negócio, usuária do admin)

**Quem é**: a fundadora e decoradora, responsável por toda a operação do negócio e pela única conta administrativa em uso hoje.

**O que busca no sistema**: manter o catálogo e a galeria atualizados com o mínimo de esforço técnico, e ter uma visão clara e rápida da situação financeira e da agenda de eventos, sem depender de planilhas paralelas.

**Páginas que mais usa**: Dashboard (todo dia, como visão geral) → Eventos (o módulo mais usado no dia a dia — registrar orçamentos, acompanhar status) → Galeria (depois de cada evento realizado, para atualizar o portfólio) → Produtos/Categorias (com menos frequência, só quando o catálogo muda).

**Jornadas típicas**: ver Jornadas 3, 4 e 5 em [[06-fluxos-navegacao]] — registrar um orçamento do primeiro contato à confirmação, atualizar o portfólio depois de um evento, cadastrar um produto novo.

**O que o sistema já atende bem**: o Dashboard reúne receita, eventos e agenda em uma tela só; a reordenação de fotos por setas (sem exigir arrastar-e-soltar) é simples de operar mesmo sem familiaridade técnica; o padrão de "falha isolada por foto" no upload evita que um problema de rede a impeça de salvar um produto inteiro.

**Onde pode encontrar atrito**: formulários mais longos (Evento) não têm o mesmo suporte de "rolar até o erro" que o formulário de Produto tem (ver `../07-audits/02-auditoria-codigo.md`); e, como é a única usuária, qualquer ausência (férias, indisponibilidade) hoje significa que ninguém mais consegue operar o sistema, já que não há distinção de papéis para delegar acesso parcial a outra pessoa.

## Como estas personas se relacionam com o restante da documentação

As personas 1 a 3 são versões mais operacionais/de produto dos perfis já descritos em `../00-vision/02-publico-alvo.md` (a diferença é que lá o foco é "por que compram", aqui o foco é "como usam as telas"). A persona 4 é a mesma "equipe interna" descrita tanto em `../00-vision/02-publico-alvo.md` quanto em `../05-business/01-stakeholders.md`, detalhada aqui do ponto de vista de uso real do produto.
