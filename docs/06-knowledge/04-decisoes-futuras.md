# Decisões Futuras (Em Aberto)

## Objetivo do documento

Registrar decisões que foram **deliberadamente adiadas**, não decididas por falta de necessidade ainda, ou identificadas como pontos que precisarão de uma escolha explícita no futuro — para que, quando o momento chegar, a decisão seja tomada com contexto, e não do zero.

## Quando deve ser utilizado

Consulte antes de assumir que "ninguém nunca pensou nisso" ao notar uma lacuna no projeto — é possível que já esteja registrada aqui como uma decisão conscientemente adiada. Também consulte periodicamente para revisar se algum gatilho de revisão já foi atingido.

## Documentos referenciados

- [[01-decisoes-tecnicas]] — decisões já tomadas (este documento é sobre decisões *ainda não* tomadas)
- [[03-licoes-aprendidas]]
- `../01-product/02-roadmap.md` — candidatos de produto (este documento foca em decisões técnicas/estruturais, não funcionalidades novas)

---

## Como usar este documento

Cada item abaixo segue o mesmo formato: **a pergunta em aberto**, **o que vale hoje enquanto a decisão não é tomada** (o "padrão" atual, por omissão) e **o gatilho** que deveria motivar revisitar a pergunta. Quando uma decisão daqui for finalmente tomada, ela deve "se formar" — ser removida deste documento e criar um ADR novo em [[01-decisoes-tecnicas]] no lugar, registrando o que foi decidido e por quê.

## 1. Separar o banco de dados de desenvolvimento/preview da produção?

**Pergunta em aberto**: vale criar um segundo projeto Supabase só para desenvolvimento e preview, ou manter o modelo atual de um banco único?

**Enquanto isso não é decidido**: o mesmo banco é usado em todos os ambientes (ver ADR 4 em [[01-decisoes-tecnicas]]) — qualquer teste local afeta dados reais.

**Gatilho para revisitar**: mais de uma pessoa desenvolvendo simultaneamente; qualquer incidente real de perda de dado causado por teste local; crescimento do volume de eventos/clientes a ponto de um erro de teste se tornar caro demais para arriscar.

## 2. Introduzir papéis/permissões no painel administrativo?

**Pergunta em aberto**: vale modelar diferentes níveis de acesso (ex. alguém que só mexe na galeria, sem ver dados financeiros de eventos)?

**Enquanto isso não é decidido**: qualquer login autenticado tem acesso total (ver ADR 3 em [[01-decisoes-tecnicas]]).

**Gatilho para revisitar**: contratação de qualquer pessoa além de Miriam com acesso ao admin; necessidade de dar acesso a um freelancer ou parceiro temporário.

## 3. Adotar testes automatizados — e por onde começar?

**Pergunta em aberto**: vale introduzir um framework de teste, e se sim, começando por qual camada (lógica pura, formulários, fluxos completos)?

**Enquanto isso não é decidido**: toda verificação é manual (ver [[04-testes]] em `../04-development/`).

**Gatilho para revisitar**: uma regressão real chegar à produção que um teste simples teria pego; o time crescer a ponto de mudanças de uma pessoa quebrarem código de outra sem ninguém perceber a tempo. Candidatos já identificados para cobrir primeiro, se essa decisão for tomada: a regra de preço "A combinar", a geração de link de WhatsApp, as validações de formulário (especialmente normalização de número em formato brasileiro) e a lógica de reordenação da galeria.

## 4. Adotar CI/CD (deploy automático a partir do repositório)?

**Pergunta em aberto**: vale conectar o repositório à Vercel para deploy automático, com ou sem uma etapa de verificação antes (lint/build/testes)?

**Enquanto isso não é decidido**: deploy é sempre um comando manual (ver ADR 5 em [[01-decisoes-tecnicas]]).

**Gatilho para revisitar**: frequência de deploy aumentar a ponto de o passo manual virar gargalo perceptível; adoção de testes automatizados (item 3) tornar um pipeline de CI mais valioso, já que passaria a ter algo relevante para rodar antes do deploy.

## 5. Completar ou abandonar a integração com shadcn/ui?

**Pergunta em aberto**: vale gerar os componentes shadcn/ui restantes e adotá-los de verdade, ou remover a configuração e as dependências não utilizadas e seguir só com Tailwind puro?

**Enquanto isso não é decidido**: o projeto fica num meio-termo — configurado para shadcn/ui, mas quase não usando (ver ADR 7 em [[01-decisoes-tecnicas]]).

**Gatilho para revisitar**: a próxima vez que uma tela precisar de um componente mais complexo (modal, select customizado, dropdown) — é o momento natural de decidir em vez de adiar de novo.

## 6. Papel de promoções/descontos no catálogo?

**Pergunta em aberto**: se a Decobalões passar a praticar promoções de forma mais estruturada, como isso deveria ser modelado (produto com preço promocional? campo de validade? destaque visual no Catálogo)?

**Enquanto isso não é decidido**: promoções não existem como funcionalidade — qualquer condição especial é tratada manualmente fora do sistema (ver `../05-business/04-precificacao-e-promocoes.md`).

**Gatilho para revisitar**: o negócio decidir rodar uma campanha promocional recorrente que hoje exigiria trabalho manual repetido.

## 7. Cache/revalidação nas páginas públicas?

**Pergunta em aberto**: vale introduzir cache com revalidação por tempo nas páginas públicas (Início, Catálogo), em vez de buscar dados frescos a cada visita?

**Enquanto isso não é decidido**: todas as rotas dinâmicas usam busca sempre-fresca (ver `../07-audits/01-auditoria-performance.md`).

**Gatilho para revisitar**: crescimento de tráfego a ponto de a carga no banco ou o tempo de resposta se tornarem perceptíveis; instalação de uma ferramenta de monitoramento (também um item em aberto, ver próximo).

## 8. Instalar alguma ferramenta de analytics/monitoramento?

**Pergunta em aberto**: vale adicionar uma ferramenta de analytics (para medir conversão do site) e/ou de monitoramento de performance (Core Web Vitals reais)?

**Enquanto isso não é decidido**: nenhuma das duas coisas é medida hoje (ver `../05-business/02-metricas.md` e `../07-audits/01-auditoria-performance.md`) — qualquer afirmação sobre tráfego ou performance percebida é suposição, não dado.

**Gatilho para revisitar**: qualquer decisão de investimento em marketing que se beneficiaria de saber a taxa de conversão real do site.
