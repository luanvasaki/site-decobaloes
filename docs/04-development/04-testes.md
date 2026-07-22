# Estratégia de Testes

## Objetivo do documento

Deixar claro, sem meios-termos, o que existe hoje de testes automatizados neste projeto (nada) e como isso deve mudar a forma de trabalhar de quem contribui com código.

## Quando deve ser utilizado

Consulte antes de considerar uma mudança "pronta para publicar", e ao decidir se vale a pena investir em testes automatizados para uma parte específica do projeto.

## Documentos referenciados

- [[00-guia-desenvolvimento]]
- [[03-fluxo-git]]
- `../01-product/04-paginas-publicas.md` e `../01-product/05-paginas-admin.md` — para saber o que testar manualmente em cada página

---

## Estado atual: não há testes automatizados

Não existe nenhum framework de teste configurado no projeto — nem unitário, nem de integração, nem end-to-end. Não há script de teste no `package.json`, não há arquivos de teste em nenhuma pasta, e não há nenhuma etapa de CI que rode testes antes de um deploy (porque não existe CI de forma alguma neste projeto — veja [[03-fluxo-git]]). Isso não é uma lacuna momentânea a "completar depois" — é o estado real e deliberado do projeto até o momento desta documentação.

## O que isso significa na prática

- **Nenhuma mudança é verificada automaticamente antes de ir para produção.** A única forma de saber se algo quebrou é testar manualmente ou descobrir depois que já está no ar.
- **Não há rede de segurança para refatoração.** Alterar uma função usada em vários lugares (ex. `formatCurrency`, `getWhatsAppLink`) depende inteiramente de você (ou de quem revisar) lembrar de conferir manualmente todos os lugares que a usam.
- **O ambiente de desenvolvimento usa o banco de produção** (ver [[02-ambiente-local]]), então mesmo um teste manual local já é, tecnicamente, um teste "em produção".

## Como verificar uma mudança sem testes automatizados

Até que o projeto adote testes automatizados, a verificação de qualquer mudança precisa ser manual e deliberada:

1. **Rode o projeto localmente** (`npm run dev`) e navegue de verdade até a tela alterada.
2. **Teste o caminho feliz** da funcionalidade alterada (ex., se mexeu no formulário de produto, crie um produto de teste do início ao fim, incluindo upload de foto).
3. **Teste pelo menos um caso de borda relevante** — os documentos em `../01-product/04-paginas-publicas.md` e `../01-product/05-paginas-admin.md` listam, para cada página, os "estados possíveis" e "erros possíveis" conhecidos; use essa lista como um roteiro de teste manual.
4. **Verifique se a mudança quebrou algo em outro lugar** que dependa do mesmo código — especialmente funções centralizadas como as de `lib/utils.ts` ou `services/`.
5. **Teste em uma tela pequena** (celular ou o modo responsivo do navegador) além do desktop, já que não há nenhum teste visual/automático de responsividade.
6. **Rode o build de produção localmente** (`npm run build`) antes de publicar — é a única verificação "automática" disponível, e só pega erros de compilação/tipo, não erros de comportamento.
7. **Limpe qualquer dado de teste criado no banco** (ver o aviso em [[02-ambiente-local]]) antes de considerar a tarefa concluída.

## Se e quando adicionar testes automatizados

Não é algo a implementar sem alinhamento — mudar de "sem testes" para "com testes" é uma decisão de projeto, não uma tarefa isolada. Caso a equipe decida investir nisso no futuro, os pontos de maior risco do projeto (e portanto os candidatos mais valiosos a cobrir primeiro) são: a regra de preço "A combinar" (`formatCurrency`), a geração dos links de WhatsApp, as validações dos formulários do admin (especialmente as normalizações de número em formato brasileiro), e a lógica de reordenação da galeria (que já teve dois bugs de estabilidade corrigidos no passado — ver `../02-architecture/09-uploads-imagens.md`).
