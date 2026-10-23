# AGENTS.md

Instruções para qualquer agente de IA (e pessoa) que trabalhe neste repositório. Este arquivo é a fonte única de verdade. Arquivos de ferramentas específicas apenas apontam para cá (veja [docs/ai/README.md](docs/ai/README.md)).

## Stack

| Item                         | Versão                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| React Native (CLI, sem Expo) | 0.88.0                                                                               |
| React                        | 19.3.0                                                                               |
| TypeScript (`strict`)        | 6.0                                                                                  |
| Node.js                      | >= 22.11.0                                                                           |
| Gerenciador de pacotes       | Yarn 3.6.4 (`nodeLinker: node-modules`)                                              |
| Testes                       | Jest 29 + `react-test-renderer`                                                      |
| Lint e formatação            | ESLint 8 (`@react-native/eslint-config` + `eslint-plugin-boundaries`) e Prettier 2.8 |
| Dependências de runtime      | `@shopify/restyle`, `react-native-safe-area-context`                                 |

Use sempre `yarn`. Nunca use `npm` ou `npx` para instalar pacotes.

## Comandos

| Ação                   | Comando                                                                      |
| ---------------------- | ---------------------------------------------------------------------------- |
| Instalar dependências  | `yarn install`                                                               |
| Instalar pods (iOS)    | `bundle install` (primeira vez) e `bundle exec pod install` (em `ios/`)      |
| Iniciar o Metro        | `yarn start` (`yarn start --reset-cache` após mudar a configuração do Babel) |
| Rodar no Android / iOS | `yarn android` / `yarn ios`                                                  |
| Typecheck              | `yarn typecheck`                                                             |
| Lint                   | `yarn lint` (corrigir automaticamente: `yarn lint:fix`)                      |
| Formatação             | `yarn format:check` (corrigir automaticamente: `yarn format`)                |
| Testes                 | `yarn test`                                                                  |
| Validação completa     | `yarn validate` (typecheck + lint + formatação + testes)                     |

## Arquitetura

Arquitetura feature-based com quatro camadas em `src/`: `app`, `features`, `shared` e `assets`. Detalhes e diagrama em [docs/arquitetura.md](docs/arquitetura.md); árvore e anatomia de uma feature em [docs/estrutura-de-pastas.md](docs/estrutura-de-pastas.md).

Regras (impostas pelo ESLint; violação quebra o `yarn lint`):

1. `app` importa de `features` (só pelo `index.ts`), `shared` e `assets`.
2. Uma feature importa de `shared`, `assets` e do `index.ts` de outras features. Nunca de arquivos internos de outra feature nem de `app`.
3. `shared` nunca importa de `features` nem de `app`.
4. Todo arquivo de código em `src/` pertence a uma camada.
5. Use sempre os aliases `@/app`, `@/features`, `@/shared` e `@/assets`. Imports com `../` são proibidos em `src/` (erro de lint); import relativo só para arquivos da mesma pasta (`./X`).
6. O teste fica ao lado do arquivo testado: `X.tsx` + `X.test.tsx`.

Nomenclatura, commits e branches: [docs/convencoes.md](docs/convencoes.md).

## Regras locais por pasta

Uma pasta pode ter um `AGENTS.md` próprio, que complementa este arquivo. Antes de editar arquivos de uma pasta, leia o `AGENTS.md` dela e o das pastas acima dela até a raiz, se existirem. Em caso de conflito, vale o arquivo mais próximo do código editado.

## Fluxo SDD obrigatório

O ciclo completo está em [docs/fluxo-sdd.md](docs/fluxo-sdd.md). Regras:

1. Nenhuma feature começa sem `docs/specs/NNN-nome/spec.md` com `Status: Aprovada`.
2. Nenhuma implementação começa sem `plan.md` com `Status: Aprovado` e sem `tasks.md`.
3. Implemente **uma** tarefa de `tasks.md` por vez e marque-a com `[x]` ao concluir.

Para executar cada etapa, leia e siga o arquivo correspondente:

| Etapa                                   | Arquivo                                                            |
| --------------------------------------- | ------------------------------------------------------------------ |
| Escrever uma spec                       | [docs/ai/flows/spec.md](docs/ai/flows/spec.md)                     |
| Gerar o plano                           | [docs/ai/flows/plano.md](docs/ai/flows/plano.md)                   |
| Quebrar em tarefas                      | [docs/ai/flows/tarefas.md](docs/ai/flows/tarefas.md)               |
| Implementar uma tarefa                  | [docs/ai/flows/implementar.md](docs/ai/flows/implementar.md)       |
| Sincronizar a documentação com o código | [docs/ai/flows/atualizar-docs.md](docs/ai/flows/atualizar-docs.md) |

## Documentação viva

Toda alteração de estrutura, arquitetura, convenção, dependência ou comportamento atualiza os documentos afetados em `docs/` (e este `AGENTS.md`, se for o caso) **na mesma tarefa e no mesmo commit**. Tarefa sem documentação atualizada não está concluída.

## Definição de pronto

Uma tarefa só está pronta quando:

1. `yarn validate` termina sem erros e sem warnings;
2. os documentos afetados foram atualizados (seção anterior);
3. a tarefa está marcada com `[x]` em `tasks.md`, quando fizer parte de uma spec.

## Dúvidas e decisões

- Diante de spec ambígua, incompleta ou em conflito com o código existente: **pare e pergunte**. Nunca invente requisito, endpoint, regra de negócio ou texto de interface.
- Toda decisão arquitetural nova (camada, biblioteca estrutural, padrão de estado, navegação, rede, persistência) exige um ADR em `docs/adr/` antes da implementação.

## Proibições

1. Adicionar dependência sem justificativa na seção "Dependências novas" do `plan.md` da spec.
2. Usar `any`. Use `unknown` e refine o tipo.
3. Desabilitar regra de lint sem justificativa no próprio comentário (`// eslint-disable-next-line <regra> -- <motivo>`).
4. Alterar `android/` ou `ios/` sem pedido explícito.
5. Fazer commit, push ou merge sem pedido explícito, ou commitar com `--no-verify`.
6. Importar arquivos internos de outra feature, ou contornar as regras de camada.
7. Escrever comentários em código ou configuração (`.js`, `.jsx`, `.ts`, `.tsx`). Explicações e decisões vão para `docs/`. Única exceção: a justificativa obrigatória de um `eslint-disable`.

## Skills

Instruções reutilizáveis no formato [Agent Skills](https://agentskills.io/specification), em `docs/ai/skills/`:

| Skill                                                    | Quando usar                                                           |
| -------------------------------------------------------- | --------------------------------------------------------------------- |
| [create-feature](docs/ai/skills/create-feature/SKILL.md) | Ao criar a pasta de uma feature nova, depois que o plano foi aprovado |
| [record-adr](docs/ai/skills/record-adr/SKILL.md)         | Ao tomar ou alterar uma decisão arquitetural                          |

## Manutenção destas instruções

- Ao alterar qualquer fluxo, skill ou regra, edite apenas o conteúdo canônico: este arquivo, `docs/ai/flows/` ou `docs/ai/skills/`.
- Os adaptadores de ferramentas (tabela em [docs/ai/README.md](docs/ai/README.md)) só mudam quando o caminho de um arquivo canônico mudar, ou o `name` ou a `description` de uma skill.
- Nunca copie regras para um adaptador.
