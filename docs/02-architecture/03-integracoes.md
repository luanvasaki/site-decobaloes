# Integrações Externas

## Objetivo do documento

Listar todos os serviços de terceiros que o projeto depende e como cada integração funciona.

## Quando deve ser utilizado

Consulte ao investigar uma falha relacionada a um serviço externo, ou antes de adicionar uma nova integração (para seguir o mesmo nível de simplicidade do projeto).

## Documentos referenciados

- [[08-api-autenticacao]]
- [[09-uploads-imagens]]
- [[04-infraestrutura-deploy]]

---

## Supabase — a única integração de backend

O projeto tem uma única dependência de infraestrutura de dados: o **Supabase**, usado para três funções ao mesmo tempo:

1. **Banco de dados** (Postgres) — ver [[02-modelo-dados]].
2. **Autenticação** (Supabase Auth, e-mail/senha) — ver [[08-api-autenticacao]].
3. **Armazenamento de arquivos** (Supabase Storage, bucket `product-images`) — ver [[09-uploads-imagens]].

Não há um backend próprio entre o Next.js e o Supabase — a aplicação se conecta diretamente ao projeto Supabase usando a URL e a chave pública (anônima) do projeto. A autorização de quem pode escrever dados é decidida pelas políticas de segurança do próprio banco (RLS), não por um servidor intermediário.

## WhatsApp — o canal de conversão do site

Não é uma integração de API no sentido tradicional — não há chave de acesso, webhook ou SDK do WhatsApp. O site apenas monta links `wa.me/<número>` com uma mensagem de texto pré-preenchida (função `getWhatsAppLink`, em `lib/whatsapp.ts`) e abre esse link em uma nova aba. O número de telefone vem de uma variável de ambiente. Isso funciona porque o WhatsApp interpreta esse formato de link publicamente, sem necessidade de credenciais.

Esse é o único mecanismo de conversão do site público — não existe formulário de contato nem carrinho de compras (ver [[00-visao-arquitetura]] na pasta `00-vision` para o contexto de negócio).

## Google Fonts

As fontes do site (Nunito e Playfair Display) são carregadas via tags `<link>` apontando para os servidores do Google Fonts, e não pelo mecanismo `next/font` nativo do Next.js (que hospedaria as fontes localmente). Isso é uma pequena dependência externa em tempo de carregamento da página — se os servidores do Google Fonts estiverem indisponíveis, o texto ainda aparece, mas com a fonte padrão do navegador.

## Vercel

A Vercel não é uma "integração" no sentido de biblioteca no código — é a plataforma de hospedagem do site. Detalhes de como o deploy funciona (manual, via CLI) estão em [[04-infraestrutura-deploy]].

## O que **não** existe

Vale registrar explicitamente, para evitar suposições erradas: não há integração de pagamento (nenhum gateway como Stripe/Mercado Pago), não há serviço de e-mail transacional, não há ferramenta de analytics/rastreamento configurada no código, e não há serviço de CI/CD conectado ao repositório.
