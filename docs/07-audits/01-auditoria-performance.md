# Auditoria de Performance

## Objetivo do documento

Registrar os achados de uma revisão de performance do projeto — pontos que afetam velocidade de carregamento, carga no banco de dados e peso de JavaScript enviado ao navegador — com recomendações, sem implementá-las aqui.

## Quando deve ser utilizado

Consulte ao investigar lentidão percebida no site, antes de escalar o volume de produtos/eventos/fotos, ou ao revisar se vale a pena investir em otimizações antes de crescer o tráfego.

## Documentos referenciados

- `../02-architecture/07-fluxo-de-dados.md` — como os dados são buscados hoje
- `../02-architecture/09-uploads-imagens.md` — como as imagens são processadas
- [[00-auditoria-seguranca]]
- [[02-auditoria-codigo]]

---

## Metodologia

Revisão estática de código e configuração — não inclui medições reais de campo (Core Web Vitals de usuários reais), já que não há nenhuma ferramenta de monitoramento de performance instalada no projeto (ver achado abaixo).

## Achados — Impacto Alto

### 1. Nenhuma rota dinâmica usa cache — toda visita busca dados frescos no banco
Todas as páginas com dados dinâmicos (Início, Catálogo, Produto, Dashboard do admin) estão marcadas para nunca usar cache — cada visita de cada usuário dispara uma nova consulta ao Supabase, mesmo que o conteúdo não tenha mudado desde a última visita alguns segundos antes.

**Impacto**: garante que o conteúdo esteja sempre atualizado (positivo), mas custa tempo de resposta em cada requisição e gera carga desnecessária no banco em picos de tráfego — especialmente na Home, que faz múltiplas buscas (configurações, fotos, categorias) a cada carregamento.

**Recomendação**: avaliar introduzir cache com revalidação por tempo (ex. alguns minutos) nas páginas públicas, que não precisam de dados no segundo exato — o conteúdo do catálogo não muda com essa frequência. Reservar o comportamento sempre-fresco para dados que realmente precisam disso.

### 2. Nenhuma ferramenta de monitoramento de performance instalada
Não há analytics, Real User Monitoring (RUM) nem qualquer captura de métricas de Core Web Vitals em produção. Isso significa que qualquer afirmação sobre "o site está rápido/lento" hoje é uma suposição, não um dado medido.

**Recomendação**: considerar instalar uma ferramenta leve de monitoramento antes de investir esforço em otimizações — para confirmar quais páginas realmente têm um problema de performance percebido pelos usuários reais, em vez de otimizar às cegas.

## Achados — Impacto Médio

### 3. Fontes carregadas via link do Google Fonts, não pelo mecanismo nativo do Next.js
As duas fontes do projeto (Nunito, Playfair Display) são carregadas por uma tag de link apontando para os servidores do Google, em vez do sistema de otimização de fontes embutido no Next.js (que hospedaria os arquivos de fonte localmente, eliminando uma conexão externa e melhorando o carregamento).

**Impacto**: uma conexão de rede extra até os servidores do Google antes do texto poder ser exibido corretamente, e nenhuma garantia automática de comportamento durante o carregamento da fonte (a página tem um estilo de reserva inline como contorno parcial, mas não é equivalente à otimização nativa).

**Recomendação**: migrar para o mecanismo de fontes nativo do Next.js.

### 4. Nenhuma paginação nas listas de dados
As funções de busca de produtos, eventos e fotos (camada `services/`) trazem todos os registros de uma vez, sem limite nem paginação.

**Impacto**: hoje, com um catálogo pequeno, não é perceptível. Conforme o número de produtos, eventos ou fotos crescer, o tempo de carregamento dessas páginas (e o volume de dados transferido) crescerá proporcionalmente, sem limite.

**Recomendação**: não é urgente no volume atual, mas vale revisitar se o catálogo ou o histórico de eventos crescer significativamente.

### 5. Fotos não são comprimidas/redimensionadas antes do upload
Uma foto de até 10MB pode ser enviada como está, sem nenhuma compressão no navegador antes do envio ao armazenamento. A otimização de imagem do Next.js reduz o impacto no momento da exibição (gera versões redimensionadas sob demanda), mas o arquivo original grande ainda precisa ser transferido e processado a cada nova variação de tamanho solicitada.

**Recomendação**: considerar comprimir/redimensionar a imagem no navegador antes do envio, reduzindo o tamanho do arquivo original armazenado.

## Achados — Impacto Baixo

### 6. Bibliotecas instaladas mas não usadas no código
Diversas dependências do Radix UI (base do shadcn/ui) estão instaladas no projeto, mas não são importadas por nenhum componente (ver `../02-architecture/01-stack-tecnologica.md`). Como não são importadas, não deveriam entrar no pacote final enviado ao navegador (o processo de build do Next.js remove código não utilizado) — o impacto real em performance de carregamento é baixo, mas essas dependências ainda pesam no tempo de instalação e no tamanho do repositório.

**Recomendação**: remover as dependências realmente não utilizadas em uma limpeza futura, mais por organização do que por ganho de performance.

### 7. `framer-motion` usado de forma ampla no site público
A biblioteca de animação é importada em muitos componentes do site público (16 arquivos). Isso adiciona peso de JavaScript nas páginas públicas em troca das animações de entrada/interação que fazem parte da identidade visual do site (ver `../03-design/00-design-system.md`).

**Impacto**: é uma escolha consciente de experiência sobre peso mínimo de página — não necessariamente um problema, mas vale ter em mente ao avaliar tempo de carregamento em conexões mais lentas.

## Pontos positivos identificados

- As imagens vindas do Supabase Storage usam o componente de imagem otimizada do Next.js, que gera automaticamente tamanhos e formatos adequados ao dispositivo.
- A imagem principal do hero da Home usa a marcação de prioridade de carregamento (`priority`), uma boa prática para a maior imagem visível no primeiro carregamento (relevante para a métrica de Largest Contentful Paint).
- Não há bibliotecas pesadas desnecessárias para funcionalidades simples — por exemplo, o gráfico de receita do dashboard é construído sem uma biblioteca de gráficos, e o calendário sem uma biblioteca de datas, mantendo esse peso fora do pacote.
