# Performance e Boas Práticas de Desenvolvimento

## Objetivo do documento

Reunir recomendações práticas para escrever código que não degrade a performance do site, e um conjunto geral de boas práticas de desenvolvimento específicas deste projeto.

## Quando deve ser utilizado

Consulte ao escrever uma tela que busca dados, exibe imagens, ou adiciona uma biblioteca nova — antes de a mudança ir para produção.

## Documentos referenciados

- [[05-convencoes-tecnicas]]
- `../07-audits/01-auditoria-performance.md` — achados de performance já identificados no projeto (este documento foca em como evitar repeti-los)
- `../02-architecture/07-fluxo-de-dados.md`
- [[07-checklists]]

---

## Performance — o que observar ao escrever código novo

### Busca de dados

- Prefira buscar dados no Server Component da página, direto no corpo da função — evite disparar uma busca extra do navegador depois que a página já carregou, a menos que o dado realmente dependa de uma interação do usuário (como trocar de categoria na Galeria do admin).
- Se uma página precisa de vários dados independentes entre si, busque-os em paralelo (não um depois do outro) — é o padrão já usado, por exemplo, na página de Catálogo.
- Antes de adicionar uma nova consulta ao Supabase, verifique se uma função equivalente já existe em `services/` — evite duplicar a mesma busca em lugares diferentes.
- Ao listar um conjunto de dados que pode crescer (produtos, eventos, fotos), tenha em mente que hoje não existe paginação em nenhuma dessas listas — funciona bem no volume atual, mas não adicione uma lista nova sem paginação presumindo que o volume sempre será pequeno.

### Imagens

- Sempre use o componente de imagem otimizada do Next.js para fotos vindas do Supabase Storage — só use uma tag de imagem nativa nos casos já documentados como exceção (pré-visualização de arquivo ainda não enviado, no formulário de produto).
- Marque a imagem mais importante do primeiro carregamento de uma página nova (equivalente ao hero da Home) com prioridade de carregamento — impacta diretamente a métrica de carregamento da maior imagem visível.
- Não presuma que uma foto enviada pelo usuário já está em um tamanho razoável — hoje não há compressão automática antes do upload (ver `../07-audits/01-auditoria-performance.md`); ao lidar com upload de imagem em uma tela nova, considere adicionar uma etapa de redimensionamento no navegador antes de enviar.

### Fontes e ativos externos

- As fontes do projeto são carregadas via link do Google Fonts, não pelo mecanismo nativo do Next.js — um ponto de melhoria já identificado (`../07-audits/01-auditoria-performance.md`), não um padrão a replicar deliberadamente ao adicionar uma fonte nova.
- Evite adicionar novas dependências de terceiros carregadas via `<script>`/link externo sem necessidade — cada uma é uma conexão de rede extra antes da página ficar totalmente pronta.

### JavaScript no navegador

- Lembre-se de que `framer-motion` já é usado amplamente no site público — reaproveite os padrões de animação já estabelecidos (ver `../03-design/00-design-system.md`) em vez de adicionar uma segunda biblioteca de animação.
- Antes de instalar uma dependência nova, verifique se algo equivalente já está instalado e simplesmente não está em uso (ex. os componentes Radix UI do shadcn/ui) — pode ser mais barato aproveitar o que já existe do que adicionar mais uma biblioteca ao projeto.
- Componentes que não precisam de interatividade não devem ser marcados como `'use client'` "por garantia" — cada `'use client'` a mais é JavaScript extra enviado ao navegador sem necessidade.

## Boas práticas gerais de desenvolvimento

- **Teste manualmente antes de considerar pronto** — não há testes automatizados neste projeto (ver [[04-testes]]); a responsabilidade de verificar que nada quebrou é inteiramente sua.
- **Cuidado com o banco compartilhado** — o ambiente local usa o mesmo banco de dados da produção (ver [[02-ambiente-local]]); qualquer dado de teste criado deve ser identificável e removido depois.
- **Siga o padrão já estabelecido, mesmo quando parecer "menos elegante"** — por exemplo, a assimetria entre leitura centralizada (`services/`) e escrita espalhada pelos componentes é uma escolha deliberada deste projeto (ver ADR em `../06-knowledge/01-decisoes-tecnicas.md`), não um erro a corrigir silenciosamente numa mudança não relacionada.
- **Não presuma que existe um sistema de notificação (toast) disponível** — está instalado, mas não é usado; siga os padrões reais de feedback (mensagem inline, diálogo nativo, mudança de texto no botão) documentados em `../03-design/02-fluxos-ux.md`.
- **Trate erros de leitura devolvendo um estado vazio, nunca deixando a página quebrar** — e trate erros de escrita com uma mensagem local visível ao usuário, nunca silenciosamente.
- **Evite introduzir uma segunda forma de fazer algo que já tem um padrão único no projeto** — um segundo padrão de validação de formulário, uma segunda forma de buscar dados, um segundo sistema de feedback — cada padrão novo aumenta a carga cognitiva de quem vier depois.
- **Registre uma decisão técnica importante** — se você tomar uma decisão de arquitetura que vale a pena ser lembrada depois, adicione um registro em `../06-knowledge/01-decisoes-tecnicas.md`, no mesmo formato dos já existentes.
- **Não corrija "de passagem" um problema não relacionado à sua tarefa atual** — anote em vez disso (ex. em `../07-audits/02-auditoria-codigo.md` ou no roadmap) para ser tratado deliberadamente, a menos que o time combine o contrário.
