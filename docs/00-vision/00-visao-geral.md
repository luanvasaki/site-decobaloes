# Visão Geral do Projeto

## Objetivo do documento

Este documento apresenta uma visão completa do negócio por trás do site Decobalões, para que qualquer pessoa — mesmo sem nenhum contato prévio com o projeto — entenda o que ele é, para quem existe e o que ele resolve.

## Quando deve ser utilizado

Use este documento como primeiro contato com o projeto: ao integrar uma nova pessoa no time, ao apresentar o negócio para um parceiro ou fornecedor, ou sempre que for preciso relembrar o "porquê" por trás das decisões de produto.

## Documentos referenciados

- [[01-objetivos]] — Objetivos e Metas
- [[02-publico-alvo]] — Público-Alvo

---

## Propósito

O Decobalões é o site institucional e catálogo digital de uma empresa de decoração de festas com balões, sediada em São Miguel Arcanjo — SP, comandada por Miriam. O site existe para apresentar o trabalho da empresa, exibir o catálogo de decorações e itens disponíveis para locação, e conduzir potenciais clientes até um atendimento direto via WhatsApp, onde a negociação e o fechamento do pedido realmente acontecem.

Além da vitrine pública, o site conta com uma área administrativa que funciona como o "escritório digital" da empresa: nela, a equipe cadastra produtos, organiza fotos do portfólio e acompanha cada evento contratado, do orçamento até a realização da festa.

## Problema Resolvido

Antes de um site como este, uma empresa de decoração de festas depende quase inteiramente de redes sociais e boca a boca para mostrar seu trabalho, e de anotações soltas (papel, planilhas, conversas de WhatsApp) para controlar orçamentos, sinais pagos e status de cada evento.

O Decobalões resolve dois problemas ao mesmo tempo:

1. **Para o cliente final**: dificuldade de descobrir rapidamente o que a empresa oferece, quais são os preços (quando aplicável) e como entrar em contato. O site organiza esse catálogo de forma visual e direciona o contato para o WhatsApp com uma mensagem já pronta, reduzindo o atrito entre "ver algo que gostei" e "pedir informação".
2. **Para a empresa (Miriam e sua equipe)**: falta de um lugar único para organizar produtos, fotos de trabalhos realizados e o andamento de cada festa contratada (do orçamento ao pagamento final). A área administrativa cumpre esse papel de sistema de gestão simples, sem precisar de planilhas paralelas.

## Diferenciais

- **Preço flexível**: produtos podem ser cadastrados sem preço fixo, exibindo "A combinar" — reflete a realidade do negócio, onde muitos orçamentos dependem de detalhes do evento.
- **Catálogo por tema/categoria**: os itens podem ser filtrados por categoria e por tema de decoração, facilitando a busca por parte do cliente.
- **Contato direto e sem fricção**: cada produto e cada chamada para ação do site leva o visitante direto a uma conversa de WhatsApp com mensagem pré-preenchida, sem formulários longos ou processos de compra online.
- **Gestão de eventos integrada**: diferente de um site "vitrine" comum, o Decobalões inclui um painel administrativo com acompanhamento de orçamentos, confirmação, sinal pago, status de pagamento e status do evento (do orçamento até a conclusão), com indicadores de negócio (receita mensal, eventos por categoria, calendário de próximos eventos).
- **Curadoria manual do portfólio**: a equipe controla manualmente quais fotos aparecem na home e na galeria, e em que ordem, garantindo que a primeira impressão do site mostre sempre os melhores trabalhos.

## Limites do Projeto

- O site **não realiza vendas online**: não há carrinho de compras, checkout ou pagamento pela internet. Toda negociação comercial acontece fora da plataforma, via WhatsApp.
- O site **não é um sistema financeiro completo**: o controle de pagamentos existe apenas como acompanhamento de status (pendente, parcial, pago) dentro de cada evento, não como um módulo de contabilidade, emissão de nota fiscal ou conciliação bancária.
- O site **não atende múltiplas empresas**: foi construído para um único negócio (Decobalões / Miriam), sem suporte a múltiplos vendedores, lojas ou franquias.
- A área administrativa **não é pública**: é de uso exclusivo da equipe interna da empresa, protegida por login.

## Funcionalidades Principais

- Catálogo público de produtos (decorações e itens para locação), com fotos, descrição e preço (quando definido).
- Página de detalhe de cada produto, com botão de contato via WhatsApp já preenchido com uma mensagem sobre aquele item.
- Filtro de catálogo por categoria e por tema de decoração.
- Galeria/portfólio de fotos de trabalhos já realizados, organizada por categoria.
- Página institucional "Sobre" e página de "Contato" com dados da empresa.
- Área administrativa para cadastro e edição de produtos e categorias.
- Gerenciamento da galeria de fotos: upload, exclusão, escolha da foto de destaque (hero) da home e reordenação manual das fotos.
- Edição dos títulos dos cartões de serviço exibidos na página inicial.
- Módulo de eventos: cadastro de orçamentos, acompanhamento de confirmação, sinal pago, status de pagamento e status do evento até a conclusão.
- Painel com indicadores de negócio: receita mensal, receita por categoria de evento, calendário de próximos eventos e total de pagamentos pendentes.

## Funcionalidades que NÃO fazem parte

- Carrinho de compras e finalização de pedido (checkout) dentro do site.
- Pagamento online (cartão, Pix automatizado, boleto) integrado à plataforma.
- Emissão de nota fiscal ou integração contábil.
- Cadastro ou login de clientes finais no site público.
- Avaliações, comentários ou área de conta do cliente.
- Suporte a múltiplas empresas, lojas ou vendedores dentro do mesmo sistema.
- Aplicativo mobile dedicado (o site é acessado pelo navegador, inclusive no celular).

## Regras de Negócio de Alto Nível

- Um produto pode não ter preço definido; nesse caso, o site mostra "A combinar" em vez de um valor.
- Existem dois grandes tipos de produto: decorações (montagens para eventos, com paleta de cores e porte do evento) e materiais (itens físicos disponíveis para locação, com controle de quantidade em estoque).
- Todo contato comercial iniciado pelo site acontece via WhatsApp — o site nunca processa um pedido diretamente.
- Um evento contratado passa por um ciclo de vida: orçamento → confirmado → em andamento → concluído (ou cancelado a qualquer momento).
- O pagamento de um evento é acompanhado por status (pendente, parcial, pago), incluindo o valor e a data do sinal pago.
- Apenas a equipe interna (usuários autenticados na área administrativa) pode alterar produtos, categorias, fotos da galeria e eventos — o público apenas visualiza o catálogo e entra em contato.
- A ordem de exibição das fotos na home e na galeria é definida manualmente pela equipe, e não por data de upload ou algoritmo automático.
