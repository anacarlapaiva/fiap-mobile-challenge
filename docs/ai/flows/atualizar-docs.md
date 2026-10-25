# Fluxo: sincronizar a documentação com o código

## Objetivo

Corrigir contrato desatualizado em `docs/` e `AGENTS.md`. Não é etapa de toda tarefa. Use quando arquitetura, convenção, ADR ou spec divergirem do código, ou quando o usuário pedir uma revisão.

## Entradas esperadas

- Opcional: escopo (uma pasta, uma feature ou um documento). Sem escopo, revise o contrato, não a árvore arquivo a arquivo.

## Passos

1. Leia `AGENTS.md` e `docs/README.md`.
2. Compare só o que é contrato:

   | Documento                     | Verificar                                                |
   | ----------------------------- | -------------------------------------------------------- |
   | `AGENTS.md`                   | stack, comandos, fluxos e skills                         |
   | `docs/arquitetura.md`         | camadas iguais às de `.eslintrc.js`                      |
   | `docs/estrutura-de-pastas.md` | pastas de camada e anatomia da feature, não cada arquivo |
   | `docs/convencoes.md`          | aliases iguais aos três arquivos de configuração         |
   | `docs/adr/`                   | decisões ainda verdadeiras                               |
   | `docs/specs/*/spec.md`        | critérios de aceite ainda descrevem o produto            |

3. Não recrie `plan.md` nem `tasks.md` de spec `Concluída`.
4. Liste divergências ao usuário: documentação errada (corrija) versus código fora da regra (não altere o código; sugira spec ou ADR).
5. Corrija só o contrato desatualizado.
6. Rode `yarn validate`.

## Critérios de conclusão

- Contrato alinhado ao código, ou divergência reportada como "código fora da regra".
- O usuário recebeu o que foi corrigido e o que só foi reportado.

## Em caso de dúvida

Se não estiver claro se o correto é o código ou o documento, pergunte. ADR prevalece sobre o código.
