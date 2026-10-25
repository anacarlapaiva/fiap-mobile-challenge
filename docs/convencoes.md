# Convenções

## Nomenclatura

Nomes de pastas são sempre em inglês e em `kebab-case` (ex.: `src/features/auth/`, `docs/specs/007-schedule/`, `docs/ai/skills/create-feature/`). Única exceção: a pasta de um componente do design system leva o nome do componente em `PascalCase` (`src/shared/components/Button/`). O conteúdo da documentação continua em português.

| Item                 | Padrão                                                                                            | Exemplo                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Pasta de feature     | `kebab-case` em inglês, substantivo do domínio                                                    | `src/features/user-profile/`                                                  |
| Subpastas de camada  | minúsculas, plural                                                                                | `screens/`, `components/`, `hooks/`                                           |
| Componente React     | `PascalCase.tsx`, um componente exportado por arquivo, export nomeado                             | `UserCard.tsx` → `export function UserCard`                                   |
| Pasta de componente  | `PascalCase`, igual ao componente; contém o componente, o teste, arquivos só dele e um `index.ts` | `src/shared/components/Button/` → `Button.tsx`, `Button.test.tsx`, `index.ts` |
| Tela                 | `PascalCase` terminado em `Screen`                                                                | `ProfileScreen.tsx`                                                           |
| Hook                 | `camelCase` com prefixo `use`                                                                     | `useProfile.ts`                                                               |
| Função utilitária    | `camelCase.ts`                                                                                    | `formatCurrency.ts`                                                           |
| Tipos e interfaces   | `PascalCase`, sem prefixo `I`                                                                     | `type UserProfile`                                                            |
| DTO                  | `kebab-case.dto.ts`; a interface termina em `Dto`                                                 | `responsavel.dto.ts` → `interface ResponsavelDto`                             |
| Validação            | `kebab-case.validation.ts`, na pasta `validation/`, ao lado do DTO                                | `responsavel.validation.ts`                                                   |
| Constantes globais   | `UPPER_SNAKE_CASE`                                                                                | `API_TIMEOUT_MS`                                                              |
| Arquivo de teste     | mesmo nome do arquivo testado + `.test`                                                           | `UserCard.test.tsx`                                                           |
| Barrel (API pública) | `index.ts`                                                                                        | `src/features/profile/index.ts`                                               |

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

- Framework: Jest (`@react-native/jest-preset`) com `react-test-renderer`. Sem Cucumber: o BDD fica no próprio Jest.
- Um comportamento, um dono, um teste. O arquivo que **decide** leva o caso. Quem só chama esse arquivo não repete o caso.
- Ninguém cria teste para completar pasta. Ficam sem teste:
  - DTO (`*.dto.ts`), barrel (`index.ts`), tipo e token de tema;
  - schema que só compõe outro; a leitura do JSON é um comportamento só, ao lado de `parseGuardians`;
  - hook que só encapsula `useQuery` ou tela/provider que só encaminha chamada já testada.
- Onde o teste existe: `X.tsx` + `X.test.tsx` ao lado. Não existe pasta `__tests__/`.
- Todo caso é **Dado** / **Quando** / **Então**. O `describe` é o Dado. O título é um Quando e um Então. O título nomeia o que se observa, não o detalhe interno.
- Cada CA unit-testável tem **um** caso, no arquivo dono, com `CA-xx` no título. Não copie o mesmo CA para tela, provider e storage. Critério só conferível no aparelho não vira teste de unidade.
- Rode com `yarn test`, ou com `yarn test <caminho>` para um arquivo.

## TypeScript

- Modo `strict` com `noUncheckedIndexedAccess`; veja `tsconfig.json`.
- `any` é proibido (erro de lint). Use `unknown` e refine o tipo.
- O DTO do contrato externo é `interface`. Nos demais formatos de dado, prefira `type`. `interface` também quando outro arquivo precisa ampliar o tipo por declaração.

## Lint e formatação

- ESLint (`@react-native/eslint-config` + regras de camada) e Prettier (`.prettierrc.js`, `.prettierignore`).
- A formatação é verificada por `yarn format:check`, dentro do `yarn validate`, e no pre-commit. Para corrigir, rode `yarn format`.
- Código sem comentários: o código deve se explicar por nomes claros. Contexto e decisões ficam em `docs/` (veja as proibições em [AGENTS.md](../AGENTS.md#proibições)).
- Toda desativação de regra precisa de justificativa após `--`:
  `// eslint-disable-next-line react-hooks/exhaustive-deps -- efeito deve rodar só na montagem`

## Estilo e design system

- Todo valor visual (cor, fonte, tamanho de fonte, espaçamento, raio, borda, tamanho fixo) vem do tema em `src/shared/theme/`. Valor do Figma que não existe no tema exige atualizar a [spec 001](specs/001-design-system/spec.md) antes.
- Tudo o que é visual vive dentro do `createTheme` (`src/shared/theme/theme.ts`), que é a fonte única entregue pelo `ThemeProvider`. Não existem constantes visuais exportadas fora do tema.
  - Tokens nativos do Restyle: `colors`, `spacing`, `borderRadii`, `breakpoints` e `textVariants`, usados por props (`backgroundColor="surface"`, `padding="m"`, `borderRadius="m"`, `variant="body"`).
  - Variants de componente (`buttonVariants`, `cardVariants`, `dropdownVariants`, `textFieldVariants`, `logoVariants`): cada parte visual de um componente é um variant, aplicado com `createVariant` + `createRestyleComponent` (`createVariantBox` em `@/shared/lib/createVariantBox`). Medidas fixas (altura, borda) ficam dentro do variant.
  - Chaves próprias do tema para valores que vão para APIs fora do Restyle: `sizes`, `iconSizes`, `borderWidths` e `motion`. São lidas sempre por `useTheme()`, nunca importadas.
- Componente nativo que precisa das props do Restyle é tipado com `createBox<Theme, Props>(Componente)` (como `PressableBox`) ou `createText<Theme, Props>(Componente)` (como o `TextInput` do `TextField`); componente animado usa `Animated.createAnimatedComponent` sobre um componente do Restyle.
- Cor, tamanho ou duração passados para API que não é do Restyle (SVG, `ActivityIndicator`, `TextInput`, Reanimated) vêm de `useTheme()`, nunca de hex ou número solto.
- `style` só para valores calculados em tempo de execução (área segura, posição medida, estilo animado). `StyleSheet` não é usado em `src/shared/components`.
- Texto sempre pelo `Text` de `@/shared/components`, que respeita a escala de fonte do sistema (acessibilidade); o `TextInput` também leva `allowFontScaling`. Texto sempre por `variant`. `fonts.*` só é usado ao criar variants no tema; o peso vem do `fontFamily`, nunca de `fontWeight`.
- Ícones só pelo `Icon` (`@/shared/components`), com `color` do tema e `size` como chave de `iconSizes` (altura). Ícone novo entra em `icons.ts` com o `path` e o `viewBox` exportados do Figma; o preenchimento vem sempre da prop `color`.
- Tela começa com `Screen` (fundo e área segura). Área pressionável usa `PressableOpacity` (feedback de toque padrão) ou `PressableBox` (sem feedback), nunca `TouchableOpacity`.
- Animações usam `react-native-reanimated` ([ADR 0004](adr/0004-animacoes-com-reanimated.md)); durações e opacidades vêm de `theme.motion` (via `useTheme()`), nunca escritas no componente.
- Larguras que dependem da tela vêm do layout (flex e margens), não de pixels fixos (decisão de escala na [spec 001](specs/001-design-system/spec.md#regras)).

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

Código e documentação afetada entram no **mesmo commit** (veja [AGENTS.md](../AGENTS.md#documentação)). Só há documentação afetada se a tarefa mudou contrato (arquitetura, convenção, ADR ou spec em implementação).

## Branches

Fluxo definido em [.github/rulesets/README.md](../.github/rulesets/README.md):

```
feat/*, fix/*, chore/*, docs/*  --squash-->  homolog  --merge commit-->  main
```

- Nome: `<tipo>/<descricao-em-kebab-case>`, com o mesmo `<tipo>` dos commits. Ex.: `feat/tela-de-login`, `fix/crash-no-logout`.
- Toda branch nasce de `homolog` atualizada e volta para ela por pull request (squash).
- `main` só recebe pull requests vindos de `homolog`.
- Push direto em `homolog` ou `main` é bloqueado pelos rulesets.
