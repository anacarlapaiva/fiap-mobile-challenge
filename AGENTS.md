# AGENTS.md

Instruções para qualquer agente de IA (e pessoa) que trabalhe neste repositório. Este arquivo é a fonte única de verdade. Arquivos de ferramentas específicas apenas apontam para cá (veja [docs/ai/README.md](docs/ai/README.md)).

## Stack

| Item                         | Versão                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React Native (CLI, sem Expo) | 0.88.0                                                                                                                                                                                                                                                                                                                                              |
| React                        | 19.3.0                                                                                                                                                                                                                                                                                                                                              |
| TypeScript (`strict`)        | 6.0                                                                                                                                                                                                                                                                                                                                                 |
| Node.js                      | >= 22.11.0                                                                                                                                                                                                                                                                                                                                          |
| Gerenciador de pacotes       | Yarn 3.6.4 (`nodeLinker: node-modules`)                                                                                                                                                                                                                                                                                                             |
| Testes                       | Jest 29 + `react-test-renderer`                                                                                                                                                                                                                                                                                                                     |
| Lint e formatação            | ESLint 8 (`@react-native/eslint-config` + `eslint-plugin-boundaries`) e Prettier 2.8                                                                                                                                                                                                                                                                |
| Dependências de runtime      | `@shopify/restyle`, `react-native-safe-area-context`, `react-native-video`, `react-native-svg`, `react-native-reanimated` + `react-native-worklets`, React Navigation 7 (`@react-navigation/native`, `native-stack`, `bottom-tabs`) + `react-native-screens`, `react-native-keychain`, `zod`, `@tanstack/react-query`, `react-native-toast-message` |
| Fontes                       | Montserrat (4 pesos, em `src/assets/fonts/`)                                                                                                                                                                                                                                                                                                        |

Use sempre `yarn`. Nunca use `npm` ou `npx` para instalar pacotes.

## Comandos

| Ação                   | Comando                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| Instalar dependências  | `yarn install`                                                                               |
| Instalar pods (iOS)    | `bundle install` (primeira vez) e `bundle exec pod install` (em `ios/`)                      |
| Registrar fontes       | `yarn react-native-asset` (depois de alterar `src/assets/fonts/` e `react-native.config.js`) |
| Iniciar o Metro        | `yarn start` (`yarn start --reset-cache` após mudar a configuração do Babel)                 |
| Rodar no Android / iOS | `yarn android` / `yarn ios`                                                                  |
| Typecheck              | `yarn typecheck`                                                                             |
| Lint                   | `yarn lint` (corrigir automaticamente: `yarn lint:fix`)                                      |
| Formatação             | `yarn format:check` (corrigir automaticamente: `yarn format`)                                |
| Testes                 | `yarn test`                                                                                  |
| Validação completa     | `yarn validate` (typecheck + lint + formatação + testes)                                     |

## Arquitetura

Arquitetura feature-based com quatro camadas em `src/`: `app`, `features`, `shared` e `assets`. Detalhes e diagrama em [docs/arquitetura.md](docs/arquitetura.md); árvore e anatomia de uma feature em [docs/estrutura-de-pastas.md](docs/estrutura-de-pastas.md).

Regras (impostas pelo ESLint; violação quebra o `yarn lint`):

1. `app` importa de `features` (só pelo `index.ts`), `shared` e `assets`.
2. Uma feature importa de `shared`, `assets` e do `index.ts` de outras features. Nunca de arquivos internos de outra feature nem de `app`.
3. `shared` nunca importa de `features` nem de `app`.
4. Todo arquivo de código em `src/` pertence a uma camada.
5. Use sempre os aliases `@/app`, `@/features`, `@/shared` e `@/assets`. Imports com `../` são proibidos em `src/` (erro de lint); import relativo só para arquivos da mesma pasta (`./X`).
6. Teste só o arquivo que **decide** o comportamento, uma vez, ao lado dele. Quem só chama código já testado não ganha teste. DTO, barrel, tema e arquivo sem decisão própria não levam teste (veja [docs/convencoes.md](docs/convencoes.md#testes)).

Nomenclatura, commits e branches: [docs/convencoes.md](docs/convencoes.md).

## Regras locais por pasta

Uma pasta pode ter um `AGENTS.md` próprio, que complementa este arquivo. Antes de editar arquivos de uma pasta, leia o `AGENTS.md` dela e o das pastas acima dela até a raiz, se existirem. Em caso de conflito, vale o arquivo mais próximo do código editado.

## Fluxo SDD obrigatório

O ciclo está em [docs/fluxo-sdd.md](docs/fluxo-sdd.md). Regras:

1. Nenhuma feature começa sem `docs/specs/NNN-nome/spec.md` com `Status: Aprovada`.
2. Nenhuma implementação começa sem `plan.md` com `Status: Aprovado` e sem `tasks.md`.
3. Implemente **uma** tarefa de `tasks.md` por vez e marque-a com `[x]` ao concluir.
4. Spec `Concluída` fica só com `spec.md`. Apague `plan.md` e `tasks.md`.

| Etapa              | Arquivo                                                      |
| ------------------ | ------------------------------------------------------------ |
| Escrever uma spec  | [docs/ai/flows/spec.md](docs/ai/flows/spec.md)               |
| Gerar o plano      | [docs/ai/flows/plano.md](docs/ai/flows/plano.md)             |
| Quebrar em tarefas | [docs/ai/flows/tarefas.md](docs/ai/flows/tarefas.md)         |
| Implementar        | [docs/ai/flows/implementar.md](docs/ai/flows/implementar.md) |

## Documentação

`docs/` guarda o contrato (arquitetura, convenções, ADRs, specs). Não é diário de sessão. Não crie arquivo novo em `docs/` e não reescreva árvore, plano ou spec porque um arquivo de código nasceu, mudou de nome ou ganhou um detalhe interno.

Atualize documentação **somente** quando a tarefa alterar:

- camada, regra de dependência ou pasta de camada;
- convenção;
- decisão arquitetural (ADR novo ou mudança de um existente);
- critério de aceite de uma spec ainda em implementação.

## Definição de pronto

Uma tarefa só está pronta quando:

1. `yarn validate` termina sem erros e sem warnings;
2. se a tarefa mudou arquitetura, convenção, ADR ou contrato da spec em andamento, esses documentos foram atualizados;
3. a tarefa está marcada com `[x]` em `tasks.md`, quando a spec ainda tem esse arquivo.

## Dúvidas e decisões

- Diante de spec ambígua, incompleta ou em conflito com o código existente: **pare e pergunte**. Nunca invente requisito, endpoint, regra de negócio ou texto de interface.
- Toda decisão arquitetural nova (camada, biblioteca estrutural, padrão de estado, navegação, rede, persistência) exige um ADR em `docs/adr/` antes da implementação.

## Proibições

1. Adicionar dependência estrutural (navegação, estado, rede, persistência) sem ADR, ou outra dependência de runtime sem constar no `plan.md` da spec em implementação.
2. Usar `any`. Use `unknown` e refine o tipo.
3. Desabilitar regra de lint sem justificativa no próprio comentário (`// eslint-disable-next-line <regra> -- <motivo>`).
4. Alterar `android/` ou `ios/` sem pedido explícito.
5. Fazer commit, push ou merge sem pedido explícito, ou commitar com `--no-verify`.
6. Importar arquivos internos de outra feature, ou contornar as regras de camada.
7. Escrever comentários em código ou configuração (`.js`, `.jsx`, `.ts`, `.tsx`). Única exceção: a justificativa obrigatória de um `eslint-disable`.
8. Criar teste, spec, ADR ou outro arquivo em `docs/` só para completar pasta ou registrar o que o código já diz.

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
