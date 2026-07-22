# Roadmap

## Objetivo do documento

Consolidar, em um só lugar, os próximos passos candidatos para o produto — não como um compromisso formal de datas, mas como um inventário organizado de lacunas e oportunidades já identificadas ao longo do resto da documentação.

## Quando deve ser utilizado

Consulte ao priorizar o próximo ciclo de trabalho no produto, ou ao decidir se vale a pena investir tempo em uma área específica antes de outra.

## Documentos referenciados

- `../05-business/02-metricas.md` — métricas de negócio ainda não medidas
- `../07-audits/00-auditoria-seguranca.md`, `../07-audits/01-auditoria-performance.md`, `../07-audits/02-auditoria-codigo.md` — origem técnica da maior parte destes itens
- `../06-knowledge/01-decisoes-tecnicas.md` — decisões que, se revisitadas, dariam origem a itens de roadmap maiores

---

## Sobre este documento

**Não existe, até o momento desta documentação, um roadmap formal definido pelo negócio** — nenhuma lista de funcionalidades futuras com prazo ou prioridade combinada com a Decobalões. O que este documento reúne, em vez disso, é o conjunto de lacunas, melhorias e ideias que já apareceram, de forma espalhada, no restante da pasta `docs/` (auditorias, métricas não medidas, decisões técnicas com ressalva) — organizado aqui como ponto de partida para uma conversa de priorização real, não como uma promessa.

## Candidatos de curto prazo (baixo esforço, ganho concreto)

- **Corrigir a grade responsiva do formulário de produto** no celular (`../07-audits/02-auditoria-codigo.md`, achado 5) — mudança pequena, melhora direta de uso no dia a dia da equipe.
- **Replicar a rolagem automática até o primeiro erro** do formulário de produto no formulário de evento (achado 4 da mesma auditoria) — mesmo padrão já existe em outro lugar do sistema.
- **Adicionar rótulos de acessibilidade** nos botões de ação que ainda não têm, nas tabelas do admin em desktop (achado 12).
- **Unificar a definição duplicada de sombra visual** (`shadow-soft`) em um único lugar (achado 3).
- **Remover código morto**: componentes não usados em `components/home/`, a tabela `rentals` sem uso, variáveis de ambiente não lidas (`SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_NAME`), dependências instaladas e nunca importadas.

## Candidatos de médio prazo (mais esforço, valor de negócio direto)

- **Métricas de conversão do site**: hoje não há nenhuma forma de saber quantos visitantes clicam no botão de WhatsApp ou quantos orçamentos avançam para eventos confirmados (ver `../05-business/02-metricas.md`). Instalar uma ferramenta simples de analytics seria o primeiro passo.
- **Indicadores adicionais no Dashboard**: ticket médio por evento/categoria, taxa de cancelamento, ranking de itens mais alugados, clientes recorrentes — todos calculáveis a partir de dados que já existem no banco, mas não exibidos hoje.
- **Dados estruturados de SEO** (marcação de "negócio local") na página de Contato, para melhorar a chance de aparecer com informações ricas em buscas — identificado como oportunidade não aproveitada em `../01-product/04-paginas-publicas.md`.
- **Melhoria de segurança de conta**: senha mínima maior, avaliação de autenticação em duas etapas, já que a conta de admin tem acesso total a dados financeiros e de clientes (`../07-audits/00-auditoria-seguranca.md`).

## Candidatos de longo prazo (mudanças estruturais)

- **Separar o banco de dados de desenvolvimento do de produção** — hoje é o maior risco operacional e de segurança do projeto ao mesmo tempo (ADR 4 em `../06-knowledge/01-decisoes-tecnicas.md`). Vale considerar antes de qualquer expansão de equipe técnica.
- **Introduzir papéis/permissões no admin** — necessário apenas se a equipe interna crescer além de uma única pessoa com acesso total (ADR 3 do mesmo documento).
- **Testes automatizados**, começando pelas áreas de maior risco já identificadas (`../04-development/04-testes.md`): a regra de preço "A combinar", geração de link de WhatsApp, validações de formulário e a lógica de reordenação da galeria.
- **Introduzir cache/revalidação** nas páginas públicas que não precisam de dados no segundo exato, reduzindo carga no banco (`../07-audits/01-auditoria-performance.md`).

## O que este roadmap deliberadamente não inclui

Não lista prazos, não atribui responsáveis, e não representa um compromisso da Decobalões com nenhum destes itens — é um inventário de possibilidades, para ser usado como insumo em uma conversa de priorização real entre quem entende o negócio e quem entende o sistema.
