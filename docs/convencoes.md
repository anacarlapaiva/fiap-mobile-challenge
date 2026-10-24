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

## Estilo e design system

- Todo valor visual (cor, fonte, tamanho de fonte, espaçamento, raio, borda, tamanho fixo) vem do tema em `src/shared/theme/`. Valor do Figma que não existe no tema exige atualizar a [spec 001](specs/001-design-system/spec.md) antes.
- Use os componentes do Restyle tipados pelo tema (`Box`, `Text`, de `@/shared/components`) e as props do tema (`backgroundColor="surface"`, `padding="m"`, `variant="body"`). Tamanhos fixos e bordas entram como props do `Box` (`height={sizes.buttonHeight}`, `borderWidth={borderWidths.thin}`); `StyleSheet` só quando não houver prop equivalente.
- Texto sempre por `variant`. `fonts.*` só é usado ao criar variants no tema; o peso vem do `fontFamily`, nunca de `fontWeight`.
- Ícones só pelo `Icon` (`@/shared/components`), com `color` do tema e `size` como altura. Ícone novo entra em `icons.ts` com o `path` e o `viewBox` exportados do Figma; o preenchimento vem sempre da prop `color`.
- Tela começa com `Screen` (fundo e área segura). Área pressionável usa `PressableOpacity` (feedback de toque padrão) ou `PressableBox` (sem feedback), nunca `TouchableOpacity`.
- Animações usam `react-native-reanimated` ([ADR 0004](adr/0004-animacoes-com-reanimated.md)); durações e opacidades vêm de `motion` (`@/shared/theme`), nunca escritas no componente.
- Restyle primeiro: cores, espaçamentos, raios e textos sempre por props do tema (`backgroundColor`, `padding`, `borderRadius`, `variant`). Componente nativo que precisa dessas props é tipado com `createBox<Theme, Props>(Componente)` (como o `Pressable`); componente animado usa `Animated.createAnimatedComponent` sobre o `Box`. Cor passada para API que não é do Restyle (SVG, `ActivityIndicator`, `TextInput`) é resolvida com `useTheme()`, nunca com hex. Estilos alternativos de um mesmo componente viram variants no tema, não condicionais de estilo soltas.
- Larguras que dependem da tela vêm do layout (flex e margens), não de pixels fixos (decisão de escala na [spec 001](specs/001-design-system/spec.md#regras-de-negócio-e-validações)).

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
