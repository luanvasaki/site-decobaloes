# Auditoria de Segurança

## Objetivo do documento

Registrar os achados de uma revisão de segurança do projeto — riscos reais identificados, sua severidade e recomendações — não implementados aqui, apenas documentados para priorização futura.

## Quando deve ser utilizado

Consulte antes de expor o admin a mais pessoas, antes de lidar com dados de clientes mais sensíveis, ou periodicamente para revisar se os riscos aqui listados ainda se aplicam.

## Documentos referenciados

- `../02-architecture/08-api-autenticacao.md` — como autenticação e autorização funcionam hoje
- `../02-architecture/09-uploads-imagens.md` — validação de upload
- `../04-development/02-ambiente-local.md` — risco do banco compartilhado
- [[01-auditoria-performance]]
- [[02-auditoria-codigo]]

---

## Metodologia

Esta auditoria foi feita por leitura de código e configuração (revisão estática), mais verificação de vulnerabilidades conhecidas nas dependências (`npm audit`). Não inclui testes de penetração, varredura automatizada de vulnerabilidades web nem revisão do próprio Supabase/Vercel como plataformas.

## Achados — Risco Alto

### 1. Nenhum controle de papel/permissão dentro do admin
Qualquer conta autenticada no Supabase Auth tem acesso de leitura e escrita a **todos** os dados administrativos — produtos, categorias, eventos (incluindo dados financeiros e de clientes) e galeria. Não há distinção entre "administrador" e qualquer outro papel mais restrito.

**Impacto**: se uma conta de acesso mais limitado precisar ser criada no futuro (ex. um freelancer só para atualizar fotos), hoje isso é impossível sem dar acesso total aos dados financeiros e de clientes.

**Recomendação**: se o time crescer, avaliar introduzir um campo de papel/permissão e políticas RLS mais granulares antes de distribuir credenciais de admin a mais pessoas.

### 2. Ambiente de desenvolvimento usa as mesmas credenciais de produção
Não existe separação de projeto Supabase entre desenvolvimento, preview e produção (ver `../02-architecture/04-infraestrutura-deploy.md`). Qualquer máquina de desenvolvimento com o arquivo `.env.local` configurado tem acesso de leitura/escrita total ao banco de produção real.

**Impacto**: o risco não é só operacional (dado de teste indo para produção) — é também um risco de segurança: comprometer uma única máquina de desenvolvedor (malware, laptop roubado, `.env.local` vazado acidentalmente) equivale a comprometer a produção inteira, já que a autorização depende só da posse da chave anônima + uma sessão autenticada.

**Recomendação**: considerar um projeto Supabase separado para desenvolvimento, ao menos antes de qualquer expansão da equipe.

## Achados — Risco Médio

### 3. Política de senha fraca
A única validação de senha no login é o comprimento mínimo de 6 caracteres — sem exigência de complexidade, sem autenticação em duas etapas, sem verificação contra senhas vazadas conhecidas.

**Recomendação**: aumentar o comprimento mínimo exigido e avaliar habilitar MFA no Supabase Auth, especialmente considerando que essa conta tem acesso total a dados financeiros e de clientes.

### 4. Nenhum cabeçalho de segurança HTTP customizado
`next.config.ts` não define nenhum cabeçalho de segurança (Content-Security-Policy, X-Frame-Options, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy). O projeto depende inteiramente dos padrões da Vercel/Next.js, sem nenhuma política explícita.

**Recomendação**: avaliar adicionar cabeçalhos de segurança básicos, em especial um CSP e X-Frame-Options, para reduzir a superfície de ataques como clickjacking.

### 5. Validação de upload só existe no navegador
O limite de 10MB por arquivo de foto é verificado apenas no lado do cliente (antes do envio) — não há reforço equivalente no bucket de armazenamento do Supabase nem nenhuma validação de tipo de arquivo além do atributo `accept` do input, que é apenas uma sugestão de interface, não uma barreira real.

**Impacto**: como o upload já exige autenticação (RLS do bucket), o risco prático é baixo (limitado a quem já tem uma conta administrativa), mas ainda assim um upload malformado ou anormalmente grande poderia ser enviado por alguém com credenciais válidas, sem nenhuma barreira further.

**Recomendação**: configurar um limite de tamanho no próprio bucket de armazenamento do Supabase, não só na interface.

### 6. Vulnerabilidades conhecidas em dependências de build
`npm audit` identificou 4 vulnerabilidades na árvore de dependências (1 moderada, 3 altas), concentradas em `picomatch`, `postcss` e `ws` — pacotes usados internamente por ferramentas de build (Next.js e cadeia de dependências), não código de execução da aplicação em si.

**Impacto prático**: como são dependências de ferramentas de build/desenvolvimento e não código executado no navegador do visitante, o risco direto para o site em produção é baixo — mas a lista deve ser monitorada, já que uma atualização de versão pode alterar esse quadro a qualquer momento.

**Recomendação**: rodar `npm audit` periodicamente e manter as dependências atualizadas, especialmente `next` e ferramentas relacionadas.

## Achados — Risco Baixo

### 7. Chave anônima do Supabase exposta no navegador
A `NEXT_PUBLIC_SUPABASE_ANON_KEY` é, por natureza, pública (o prefixo `NEXT_PUBLIC_` garante isso) — isso é esperado e faz parte do modelo de segurança do Supabase (a proteção real vem das políticas RLS, não do sigilo da chave). Não é uma falha, mas reforça a importância de garantir que as políticas RLS estejam sempre corretas, já que são a única barreira real.

### 8. Sem limitação de tentativas de login (rate limiting) visível na aplicação
Não há nenhuma lógica de bloqueio após tentativas de login malsucedidas implementada no código do projeto — depende inteiramente do que o Supabase Auth aplica por padrão em sua própria infraestrutura, sem nenhuma camada adicional no lado da aplicação.

**Recomendação**: confirmar (na configuração do próprio projeto Supabase) se algum limite de tentativas está ativo; considerar adicionar uma camada própria se não estiver.

## Pontos positivos identificados

- Nenhum uso de `dangerouslySetInnerHTML`, `eval()` ou `new Function()` foi encontrado em todo o código — risco de XSS via injeção de HTML/JS é baixo.
- Não há SQL bruto em lugar nenhum — todas as consultas passam pelo query builder do Supabase, o que reduz significativamente o risco de injeção de SQL.
- Nenhum segredo/chave hardcoded foi encontrado no código-fonte (verificado por busca em todo o projeto) — todas as credenciais vêm de variáveis de ambiente.
- O arquivo `.env*` está corretamente listado no `.gitignore` — não há histórico de segredo commitado encontrado nos arquivos de configuração atuais.
- A mensagem de erro de login é deliberadamente genérica ("E-mail ou senha incorretos"), sem revelar se o problema foi o e-mail ou a senha — boa prática contra enumeração de contas.
- A `SUPABASE_SERVICE_ROLE_KEY` (que ignoraria as políticas RLS) está documentada mas **não é usada em nenhum lugar do código** — reduz a superfície de risco, já que não existe um caminho no código que contorne as políticas de segurança do banco.
