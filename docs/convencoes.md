# Convenções

## Nomenclatura

Nomes de pastas são sempre em inglês e em `kebab-case` (ex.: `src/features/user-profile/`, `docs/specs/001-email-login/`, `docs/ai/skills/create-feature/`). O conteúdo da documentação continua em português.

| Item                 | Padrão                                                                | Exemplo                                     |
| -------------------- | --------------------------------------------------------------------- | ------------------------------------------- |
| Pasta de feature     | `kebab-case` em inglês, substantivo do domínio                        | `src/features/user-profile/`                |
| Subpastas de camada  | minúsculas, plural                                                    | `screens/`, `components/`, `hooks/`         |
| Componente React     | `PascalCase.tsx`, um componente exportado por arquivo, export nomeado | `UserCard.tsx` → `export function UserCard` |
| Tela                 | `PascalCase` terminado em `Screen`                                    | `ProfileScreen.tsx`                         |
| Hook                 | `camelCase` com prefixo `use`                                         | `useProfile.ts`                             |
| Função utilitária    | `camelCase.ts`                                                        | `formatCurrency.ts`                         |
| Tipos e interfaces   | `PascalCase`, sem prefixo `I`                                         | `type UserProfile`                          |
| Constantes globais   | `UPPER_SNAKE_CASE`                                                    | `API_TIMEOUT_MS`                            |
| Arquivo de teste     | mesmo nome do arquivo testado + `.test`                               | `UserCard.test.tsx`                         |
| Barrel (API pública) | `index.ts`                                                            | `src/features/profile/index.ts`             |

Exports default só onde o framework exige (ex.: `App.tsx` registrado em `index.js`). No resto, use exports nomeados.

## Imports com alias

| Alias          | Aponta para      |
| -------------- | ---------------- |
| `@/app/*`      | `src/app/*`      |
| `@/features/*` | `src/features/*` |
| `@/shared/*`   | `src/shared/*`   |
| `@/assets/*`   | `src/assets/*`   |

Regras:

1. Use sempre o alias, inclusive dentro da própria feature: `import { Button } from '@/shared/components/Button'`, `import { useProfile } from '@/features/profile/hooks/useProfile'`.
2. Imports que sobem de pasta (`../`, `../../`) são proibidos em `src/`. O ESLint (`no-restricted-imports`) bloqueia, e o pre-commit impede o commit. Import relativo só é permitido para arquivos da mesma pasta: `import { AppProviders } from './AppProviders'`.
3. Outra feature é importada só pelo `index.ts`: `import { ProfileScreen } from '@/features/profile'`.
4. Ordem dos imports: bibliotecas externas, linha em branco, aliases `@/`, linha em branco, imports da mesma pasta (`./`).
5. Os aliases são definidos em três arquivos que precisam ficar iguais: `tsconfig.json` (`paths`), `babel.config.js` (`module-resolver`) e `jest.config.js` (`moduleNameMapper`).

## Testes

- Framework: Jest (`@react-native/jest-preset`) com `react-test-renderer`.
- O teste fica ao lado do arquivo testado: `X.tsx` + `X.test.tsx`. Não existe pasta `__tests__/`.
- Cada critério de aceite da spec (Dado/Quando/Então) vira pelo menos um caso de teste.
- Rode com `yarn test`, ou com `yarn test <caminho>` para um arquivo.

## TypeScript

- Modo `strict` com `noUncheckedIndexedAccess`; veja `tsconfig.json`.
- `any` é proibido (erro de lint). Use `unknown` e refine o tipo.
- Prefira `type` para formatos de dados e `interface` só quando precisar de extensão por declaração.

## Lint e formatação

- ESLint (`@react-native/eslint-config` + regras de camada) e Prettier (`.prettierrc.js`, `.prettierignore`).
- A formatação é verificada por `yarn format:check`, dentro do `yarn validate`, e no pre-commit. Para corrigir, rode `yarn format`.
- Código sem comentários: o código deve se explicar por nomes claros. Contexto e decisões ficam em `docs/` (veja as proibições em [AGENTS.md](../AGENTS.md#proibições)).
- Toda desativação de regra precisa de justificativa após `--`:
  `// eslint-disable-next-line react-hooks/exhaustive-deps -- efeito deve rodar só na montagem`

## Commits: Conventional Commits

Formato: `<tipo>(<escopo opcional>): <descrição no imperativo, em português, minúscula>`

| Tipo       | Uso                                            |
| ---------- | ---------------------------------------------- |
| `feat`     | nova funcionalidade                            |
| `fix`      | correção de bug                                |
| `docs`     | só documentação                                |
| `refactor` | mudança de código sem alterar comportamento    |
| `test`     | só testes                                      |
| `chore`    | configuração, dependências, build, ferramentas |
| `style`    | formatação, sem mudança de lógica              |
| `perf`     | melhoria de desempenho                         |
| `ci`       | pipelines                                      |

Exemplos: `feat(profile): adiciona tela de edição de perfil`, `chore: configura aliases`.

Código e documentação afetada entram no **mesmo commit** (veja [AGENTS.md](../AGENTS.md#documentação-viva)).

## Branches

Fluxo definido em [.github/rulesets/README.md](../.github/rulesets/README.md):

```
feat/*, fix/*, chore/*, docs/*  --squash-->  homolog  --merge commit-->  main
```

- Nome: `<tipo>/<descricao-em-kebab-case>`, com o mesmo `<tipo>` dos commits. Ex.: `feat/tela-de-login`, `fix/crash-no-logout`.
- Toda branch nasce de `homolog` atualizada e volta para ela por pull request (squash).
- `main` só recebe pull requests vindos de `homolog`.
- Push direto em `homolog` ou `main` é bloqueado pelos rulesets.
