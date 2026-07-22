# Escolhas de Tecnologia — Stack e Alternativas

## Objetivo do documento

Documentar por que cada peça principal da stack tecnológica foi escolhida, e quais alternativas existiam para o mesmo papel — complementando [[01-decisoes-tecnicas]], que foca em decisões de arquitetura (como as peças se organizam), não na escolha das peças em si.

## Quando deve ser utilizado

Consulte antes de propor trocar uma tecnologia da stack por outra, ou ao avaliar se vale adicionar uma nova ferramenta para um papel que já tem uma solução estabelecida.

## Documentos referenciados

- [[01-decisoes-tecnicas]]
- `../02-architecture/01-stack-tecnologica.md` — o inventário completo da stack (este documento foca no "porquê", aquele no "o quê")
- [[04-decisoes-futuras]]

---

## Aviso honesto sobre a origem deste documento

O raciocínio detalhado que levou à escolha original de cada tecnologia **não foi registrado por escrito em nenhum lugar no momento em que a decisão foi tomada** — não existe uma ata de decisão nem uma discussão documentada de alternativas do início do projeto. O que este documento apresenta é uma reconstrução honesta: por que cada escolha faz sentido objetivamente para um projeto deste porte e tipo, e quais alternativas razoáveis existiam para o mesmo papel — não uma transcrição de uma deliberação real que aconteceu. **A partir de agora, qualquer escolha de tecnologia nova neste projeto deveria ser registrada aqui no momento em que é tomada**, exatamente para que este aviso não precise se repetir.

## Next.js (framework)

**Papel**: framework de aplicação — roteamento, renderização no servidor, build.

**Por que faz sentido aqui**: o projeto precisa de páginas renderizadas no servidor para SEO (o Catálogo e as páginas de produto dependem de indexação por buscadores), e também de uma área autenticada com formulários interativos (o admin) — o Next.js cobre os dois casos no mesmo framework, com Server Components e Client Components. Também integra nativamente com a Vercel, plataforma de hospedagem escolhida.

**Alternativas que também serviriam**: uma SPA em React puro (perderia SEO nativo sem trabalho extra de renderização no servidor); Remix (papel muito parecido ao Next.js, escolha seria mais uma questão de preferência do que de necessidade técnica específica deste projeto); uma solução no-code/low-code de e-commerce (descartada porque o negócio não é e-commerce tradicional — precisa de um painel administrativo customizado com regras de negócio específicas, como o preço "A combinar" e o ciclo de vida de eventos).

## Supabase (banco de dados, autenticação e armazenamento)

**Papel**: banco de dados Postgres, autenticação de usuários, armazenamento de arquivos — os três em um único serviço.

**Por que faz sentido aqui**: o projeto precisa de banco relacional (dados de produtos/eventos são bem estruturados, com relacionamentos claros), autenticação simples para uma única conta administrativa, e armazenamento de fotos — o Supabase cobre os três sem precisar orquestrar três serviços separados, e permite que o próprio front-end converse diretamente com o banco (via políticas RLS) sem precisar de um backend próprio (ver ADR 1 em [[01-decisoes-tecnicas]]).

**Alternativas que também serviriam**: Firebase (papel equivalente, mas com um banco não-relacional por padrão — menos natural para os relacionamentos deste domínio, como produto→categoria e evento→itens); um backend customizado com Postgres + um framework de API (Express/NestJS) + um serviço de armazenamento separado (ex. S3) — tecnicamente viável, mas exigiria manter um servidor próprio e reimplementar autenticação, algo que o Supabase já resolve pronto.

## Tailwind CSS (estilização)

**Papel**: escrever estilos diretamente como classes utilitárias no JSX.

**Por que faz sentido aqui**: permite construir e ajustar a identidade visual da marca (cores, espaçamentos, animações) rapidamente sem alternar entre arquivos de componente e arquivos de estilo separados — relevante para um projeto onde a aparência visual (ver `../03-design/`) é uma parte central da proposta de valor do site público.

**Alternativas que também serviriam**: CSS Modules (mais isolamento por componente, mas exige mais arquivos e não oferece o mesmo vocabulário de design tokens pronto); uma biblioteca de componentes com estilo pré-definido, como Chakra UI ou Material UI (traria componentes prontos, mas com uma identidade visual própria mais difícil de customizar até o ponto de parecer "Decobalões" e não "Material Design").

## react-hook-form + zod (formulários e validação)

**Papel**: controlar os campos dos formulários do admin e validar os dados antes de salvar.

**Por que faz sentido aqui**: os formulários do admin (Produto, Evento) são grandes, com campos condicionais e validações específicas (ex. formato brasileiro de número) — `react-hook-form` evita repetir `useState` para cada campo, e `zod` permite descrever a validação de forma declarativa e gerar mensagens de erro específicas por campo, algo que o projeto usa de forma consistente (ver `../04-development/05-convencoes-tecnicas.md`).

**Alternativas que também serviriam**: Formik + Yup (combinação equivalente, mais antiga no ecossistema React); validação manual com `useState` e funções próprias (viável para formulários pequenos, mas o formulário de evento — o mais complexo do projeto — se beneficia claramente de uma biblioteca dedicada).

## framer-motion (animação)

**Papel**: animações de entrada, transições e microinterações no site público.

**Por que faz sentido aqui**: a identidade visual do site depende de animações suaves de entrada (ver `../03-design/00-design-system.md`) — `framer-motion` oferece uma API declarativa para isso sem escrever `@keyframes` manuais para cada efeito.

**Alternativas que também serviriam**: animações só em CSS (`transition`/`@keyframes`) — mais leve em peso de JavaScript, mas exigiria mais código manual para os efeitos mais elaborados (crossfade com zoom na galeria, entrada em cascata de cartões); GSAP (biblioteca de animação mais poderosa, porém mais pesada e com uma API menos integrada ao modelo de componentes do React do que `framer-motion`).

## lucide-react (ícones)

**Papel**: biblioteca de ícones usada em todo o projeto, sem exceções.

**Por que faz sentido aqui**: um conjunto de ícones consistente e leve, com boa cobertura dos ícones necessários (setas, lixeira, editar, redes sociais) — não há necessidade real de mais de uma biblioteca de ícones em um projeto deste porte.

**Alternativas que também serviriam**: Heroicons, Phosphor Icons, react-icons (agregador de vários conjuntos) — qualquer uma resolveria o mesmo papel; a escolha entre elas tende a ser estética/preferência, não uma diferença técnica relevante para este projeto.

## Vercel (hospedagem)

**Papel**: hospedar o site e rodar o build de produção.

**Por que faz sentido aqui**: integração nativa com Next.js (a própria empresa por trás do framework), suporte a imagens otimizadas e funções de servidor sem configuração extra.

**Alternativas que também serviriam**: Netlify (papel equivalente para Next.js, com suporte um pouco menos nativo que a própria Vercel); hospedagem própria via Docker/VPS (exigiria assumir a responsabilidade de infraestrutura que a Vercel abstrai, sem benefício claro para um projeto deste porte).

## Regra para o futuro

Toda nova tecnologia adicionada à stack a partir de agora deveria ganhar uma entrada neste documento no momento da decisão — com o papel que ela cumpre, por que foi escolhida sobre as alternativas reais consideradas naquele momento, não reconstruídas meses depois.
