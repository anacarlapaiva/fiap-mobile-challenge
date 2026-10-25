# 0007. Validar dados externos com Zod

- **Status:** Aceito
- **Data:** 2026-10-24
- **Decisores:** Ana Carla Paiva

## Contexto

O app vai ler o JSON dos responsáveis e o texto da sessão gravada no aparelho. Os dois são dados externos ao tipo do TypeScript: o compilador não confere o arquivo nem o que o Keychain devolve. Credencial inválida, trimestre sem nota (`null`) e sessão corrompida precisam falhar de um jeito só, com o erro nomeado na borda, antes de virar estado da tela.

## Decisão

1. Todo dado que entra de fora (JSON empacotado e sessão lida do Keychain) é conferido com Zod 4.6.7.
2. O erro dessa borda é o `ZodError`. A tela não interpreta o texto cru.
3. O type do contrato fica em `dto/` e o schema em `validation/` ([ADR 0008](0008-separar-contrato-em-dto-e-validacao.md)). Zod não vira camada de rede: não há API HTTP nesta decisão.

## Alternativas consideradas

| Alternativa             | Prós                 | Contras                                                | Motivo da rejeição                        |
| ----------------------- | -------------------- | ------------------------------------------------------ | ----------------------------------------- |
| Confiar no `as` do JSON | Nenhum código a mais | Aceita arquivo trocado e sessão corrompida em silêncio | O tipo mente quando o dado não bate       |
| Validar campo a campo   | Sem dependência      | Cada leitor inventa o próprio erro                     | A borda deixa de ser uma só               |
| Yup ou Valibot          | Também geram tipo    | Outra biblioteca para o mesmo trabalho                 | Zod foi a escolha explícita para os erros |

## Consequências

- **Positivas:** JSON e sessão inválidos falham antes de chegar na tela; o schema só compila se produzir o type do DTO.
- **Negativas:** uma dependência de runtime só para validar. Não substitui o estado de erro desenhado no Figma: o texto da mensagem continua na spec da tela.
- **Ações decorrentes:** dependência em `package.json`; schemas entram na tarefa que passar a ler o JSON e a sessão, não nesta decisão.
