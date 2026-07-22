# Auditoria de Código

## Objetivo do documento

Registrar os achados de uma revisão de qualidade de código — inconsistências, código morto, duplicações e riscos de manutenção — com recomendações, sem implementá-las aqui.

## Quando deve ser utilizado

Consulte antes de uma sessão de limpeza/refatoração, ou para entender riscos de manutenção antes de propor uma mudança em uma área específica.

## Documentos referenciados

- `../02-architecture/06-padroes-arquiteturais.md` — os padrões que esta auditoria usa como referência de "consistência esperada"
- `../04-development/04-testes.md` — ausência de testes automatizados (achado mais crítico desta auditoria)
- [[00-auditoria-seguranca]]
- [[01-auditoria-performance]]

---

## Achados — Prioridade Alta

### 1. Nenhum teste automatizado
Já registrado em detalhe em `../04-development/04-testes.md` — sem testes unitários, de integração ou end-to-end, e sem CI que os rodasse de qualquer forma. É o maior risco de manutenção do projeto: qualquer alteração depende inteiramente de verificação manual disciplinada para não introduzir regressões.

### 2. Tratamento de erro inconsistente em operações de escrita
Algumas chamadas de escrita ao Supabase não verificam o valor de erro retornado pela chamada — por exemplo, na reordenação de fotos da galeria e em algumas ações da tabela de produtos (alternar disponibilidade, excluir), o resultado da operação não é conferido explicitamente. Se o Supabase rejeitar a operação (ex. por uma política RLS, uma conexão instável), a falha pode passar despercebida pelo usuário, que veria a interface local já atualizada sem saber que o banco não foi de fato alterado.

**Recomendação**: revisar essas chamadas e adicionar verificação/feedback de erro explícito, seguindo o mesmo padrão já usado nos formulários principais (ProductForm, CategoryForm, EventForm).

## Achados — Prioridade Média

### 3. Definição duplicada e conflitante de uma sombra visual
A sombra `shadow-soft` está definida com valores diferentes em dois arquivos de configuração diferentes (`tailwind.config.ts` e `app/globals.css`), e uma sobrescreve a outra silenciosamente. O efeito visual final é próximo em ambos os casos (baixo impacto perceptível), mas é uma duplicação real que pode confundir quem for alterar essa sombra no futuro, sem saber qual das duas definições está de fato em vigor.

**Recomendação**: unificar em uma única definição, eliminando a duplicata.

### 4. Formulário de evento não segue o mesmo padrão de UX de erro que o formulário de produto
O `ProductForm` rola automaticamente a tela até o primeiro campo com erro ao falhar a validação; o `EventForm` (o formulário mais longo e complexo do admin) não tem esse mesmo comportamento, apesar de seguir o mesmo padrão de biblioteca de validação. Um usuário preenchendo um evento longo pode não perceber facilmente qual campo, entre várias seções, está com erro.

**Recomendação**: replicar o comportamento de rolagem automática do `ProductForm` no `EventForm`.

### 5. Grades do formulário de produto sem breakpoints responsivos
Diferente de praticamente todas as outras grades do projeto (que sempre reduzem para 1 coluna em telas pequenas), algumas grades internas do `ProductForm` (seletor de tipo de item, opções de porte de evento) ficam fixas em 2-3 colunas independentemente do tamanho da tela — já identificado também em `../03-design/00-design-system.md`.

**Recomendação**: aplicar os mesmos breakpoints responsivos (`sm:`/`md:`) já usados no restante do formulário.

### 6. Sincronização de itens de evento por "apagar tudo e reinserir", não atômica
Ao salvar um evento, a lista de itens vinculados é sincronizada apagando todos os itens antigos e inserindo a lista atual do zero, em vez de comparar e atualizar apenas o que mudou. Isso funciona corretamente no caminho feliz, mas não é uma operação atômica — uma falha exatamente entre o apagar e o inserir deixaria o evento temporariamente sem nenhum item vinculado.

**Recomendação**: baixa urgência dado o volume atual de uso, mas vale revisitar se o módulo de eventos crescer em importância ou volume — uma transação de banco resolveria o problema de atomicidade.

### 7. Checagem de tipos parcialmente desativada
O projeto roda em modo `strict` do TypeScript, mas com `noImplicitAny` desligado (permite tipos implícitos em certos casos) e um arquivo específico (`lib/supabase/server.ts`) inteiramente excluído da checagem de tipos. Isso reduz a proteção que o TypeScript deveria oferecer justamente na camada mais central de acesso a dados do servidor.

**Recomendação**: se possível, revisar por que esse arquivo precisou ser excluído da checagem e avaliar reativá-la.

## Achados — Prioridade Baixa (código morto / organização)

### 8. Componentes não utilizados em `components/home/`
`AboutSection`, `CategoryPreview`, `FeaturedProducts` e `PhotoGallery` existem no repositório mas não são importados por nenhuma página atual — resíduos de uma versão anterior do design da home.

### 9. Tabela `rentals` sem uso
Existe no banco de dados desde o schema inicial, mas nenhuma parte do código lê ou escreve nela — um modelo de locação mais simples que nunca foi conectado a uma funcionalidade real.

### 10. Variáveis de ambiente documentadas mas não utilizadas
`SUPABASE_SERVICE_ROLE_KEY` e `NEXT_PUBLIC_SITE_NAME` aparecem no arquivo de exemplo de variáveis de ambiente, mas não são lidas em nenhum lugar do código atual.

### 11. Dependências instaladas sem uso
A maior parte das dependências do Radix UI (base do shadcn/ui) e o próprio sistema de notificação toast (instalado e configurado, porém nunca chamado por nenhum componente) — ver `../06-knowledge/01-decisoes-tecnicas.md`, ADR 7.

### 12. Botões de ação sem rótulo de acessibilidade em algumas tabelas do admin
Alguns botões de ação (editar/excluir) na versão desktop de tabelas do admin dependem só do ícone visual, sem um rótulo explícito para leitor de tela — diferente da versão em lista de cartões (mobile) das mesmas telas, que tem rótulos consistentes. Já identificado em `../01-product/05-paginas-admin.md`.

**Recomendação geral para os achados de código morto**: nenhum é urgente, mas juntos representam uma boa lista de partida para uma sessão de limpeza — remover o que não é usado reduz a chance de um novo desenvolvedor perder tempo tentando entender uma tabela, componente ou dependência que não faz mais parte do produto real.

## Pontos positivos identificados

- Convenções de nome de arquivo consistentes em todo o projeto (PascalCase para componentes, kebab-case para utilitários).
- O padrão de "falha isolada por arquivo" em uploads (ver `../06-knowledge/03-licoes-aprendidas.md`) foi replicado corretamente entre as duas telas que fazem upload (produto e galeria) — mostra disciplina em propagar uma correção para todos os lugares equivalentes.
- A separação entre leitura (centralizada em `services/`) e escrita (nos próprios componentes) é aplicada de forma consistente em todo o projeto, mesmo sendo uma escolha deliberadamente assimétrica — não há leituras "perdidas" fora da camada de serviço.
- Regras de negócio centrais (formatação de moeda com a regra "A combinar", geração de link de WhatsApp, geração de slug) vivem em funções únicas e são reaproveitadas, evitando duplicação da lógica em vários lugares.
