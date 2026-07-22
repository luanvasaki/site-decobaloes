# Uploads e Imagens

## Objetivo do documento

Explicar como fotos de produtos e da galeria são enviadas, armazenadas e exibidas — incluindo o comportamento de resiliência a falhas de upload.

## Quando deve ser utilizado

Consulte ao investigar um problema de upload de foto, ao adicionar um novo lugar no site que precise enviar/exibir imagens, ou para entender por que uma falha de upload não derruba mais o salvamento de um produto.

## Documentos referenciados

- [[03-integracoes]]
- [[06-padroes-arquiteturais]]
- [[08-api-autenticacao]]

---

## Onde as imagens ficam armazenadas

Todas as fotos do projeto — tanto as de produtos quanto as da galeria de portfólio — ficam em um único local de armazenamento de arquivos do Supabase (bucket `product-images`, apesar do nome sugerir só produtos). Dentro desse mesmo local, cada tipo de foto usa um caminho diferente para se organizar:
- Fotos de produto ficam agrupadas por identificador do produto.
- Fotos de galeria ficam agrupadas por categoria (casamentos, aniversários, etc.), com um nome de arquivo que combina data/hora e um valor aleatório para evitar colisão de nomes.

O acesso a essas imagens segue a mesma regra de segurança do restante do projeto: qualquer pessoa pode visualizar (leitura pública), mas só um usuário autenticado pode enviar, substituir ou excluir uma imagem.

## Validação de upload

A única validação de tamanho de arquivo (limite de 10MB por foto) acontece **no navegador**, no momento em que o administrador seleciona os arquivos — antes mesmo de tentar o envio. Não existe validação equivalente do lado do servidor/armazenamento: um arquivo maior nunca chega a ser enviado por conta da checagem do navegador, mas essa checagem poderia, em teoria, ser contornada por alguém enviando requisições diretamente (não é um risco alto dado que só administradores autenticados podem escrever, mas vale que um novo desenvolvedor saiba que a validação de tamanho não é reforçada no servidor).

## O que acontece quando um upload falha

Esse é um comportamento que já foi corrigido depois de causar problemas reais em produção, e vale entender bem:

**Antes**: se uma única foto falhasse ao ser enviada (por exemplo, por uma instabilidade de rede), o erro interrompia todo o processo — o produto (ou a nova foto da galeria) simplesmente não era salvo, mesmo que todos os outros dados estivessem corretos. Isso gerava uma mensagem de erro genérica que escondia o fato de que só a foto tinha falhado.

**Hoje**: cada arquivo é enviado individualmente, com sua própria captura de erro. Se uma foto falhar, ela é anotada separadamente numa lista de "falhas", mas o processo continua com as demais fotos. No final:
- O produto (ou o item da galeria) **é salvo normalmente**, com as fotos que tiveram sucesso.
- Um aviso não-bloqueante informa quais fotos especificamente falharam, sugerindo tentar novamente com um arquivo menor.

Essa mesma lógica de "falha isolada por arquivo, sem travar o restante" foi aplicada tanto ao formulário de produto quanto à tela de galeria do admin.

Um problema relacionado, que já foi corrigido também, era um erro que **travava a página inteira** ao tentar reordenar rapidamente as fotos da página inicial (uma chamada interna do React estava sendo feita em um momento indevido, dentro de uma atualização de estado). Hoje a reordenação é estável mesmo com cliques rápidos e sucessivos.

## Como as imagens são exibidas

O site usa, na maior parte dos casos, o componente de imagem otimizada do Next.js (que gera automaticamente tamanhos e formatos adequados) — isso está configurado para aceitar imagens vindas do domínio do Supabase.

Há uma exceção deliberada: nas pré-visualizações de foto **dentro do formulário de produto no admin** (tanto para fotos já existentes quanto para arquivos recém-selecionados, ainda no computador do administrador), o projeto usa uma tag de imagem simples do HTML em vez do componente otimizado do Next.js. Isso é intencional — o componente otimizado do Next.js não lida bem com imagens de tamanho desconhecido vindas diretamente do armazenamento, nem com pré-visualizações de arquivos que ainda não foram enviados a lugar nenhum.

Não existe, hoje, um tratamento visual para uma imagem "quebrada" (uma URL de foto que não carrega) — nem no site público, nem no admin. Também não há uma imagem de baixa qualidade exibida enquanto a foto principal carrega (blur placeholder).
