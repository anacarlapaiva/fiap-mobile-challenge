# Plano 003: Componentes globais

- **Status:** Aprovado
- **Spec:** [spec.md](spec.md)
- **Aprovado por:** Ana Carla Paiva (2026-10-24)
- **Data:** 2026-10-24

## Resumo da solução

Os componentes ficam em `src/shared/components/`, um por arquivo, exportados pelo `index.ts` da pasta, construídos sobre `Box` e `Text` do Restyle e com todos os valores vindos do tema. Componentes pressionáveis usam `Pressable` do React Native e animam a opacidade com `react-native-reanimated` (ADR 0004). Os valores de movimento (opacidade pressionada e durações) entram num objeto `motion` exportado por `src/shared/theme/`, ao lado de `sizes` e `borderWidths`.

Os ícones são componentes `react-native-svg` com o `path` exportado do Figma, sem `react-native-svg-transformer`. Um único `Icon` recebe `name`, `color` (chave de cor do tema, resolvida com `useTheme`) e `size` (altura); a largura sai da proporção do `viewBox` de cada desenho. O preenchimento sempre vem da prop `color`, nunca do arquivo exportado. O logo é a imagem PNG exportada do Figma (250 x 40), em `src/assets/images/logo.png`, exibida por `Image` com `resizeMode="contain"` nos dois tamanhos.

O `TextField` usa um `TextInput` real. No modo seguro, o texto do `TextInput` fica transparente e um `Text` sobreposto desenha um `*` por caractere; um cursor desenhado pisca ao fim dos asteriscos quando o campo tem foco. O `Dropdown` é controlado por fora quanto ao valor (`value`, `options`, `onSelect`) e guarda localmente só o estado aberto/fechado. A lista abre animada (opacidade e deslocamento) e a seta gira com `useAnimatedStyle`. Para ficar por cima do conteúdo e fechar com toque fora, a lista abre num `Modal` transparente do React Native: o campo mede sua posição na janela (`measureInWindow`), a lista é posicionada 7 abaixo dele, e um `Pressable` de tela cheia por trás da lista fecha sem selecionar. Assim a lista não depende de `zIndex` entre irmãos, que se comporta diferente no Android.

## Uso do Restyle

- Toda cor, espaçamento, raio e texto entra por props do tema; nenhum hex, número de margem ou `fontSize` nos componentes.
- `PressableBox = createBox<Theme, PressableProps>(Pressable)`: área pressionável com as props do Restyle. `AnimatedBox = Animated.createAnimatedComponent(Box)` para estilos animados.
- Variações visuais viram variants no tema: os tons do `TextButton` usam os text variants `caption` e `bodyBold` com a cor por prop do Restyle (`color="accent"`), sem estilo condicional à parte.
- Cores para APIs fora do Restyle (`Svg`, `ActivityIndicator`, `TextInput`, valores animados) vêm de `useTheme()`; tamanhos fixos vêm de `sizes`.
- `StyleSheet` só para o que o Restyle não modela (estilo animado, posição absoluta calculada em tempo de execução).

## Estrutura de arquivos

```
babel.config.js                         + plugin do react-native-worklets (último)
jest.config.js                          + setupFiles com o setup de testes do Reanimated
jest.setup.js                           novo: setup de testes do Reanimated
package.json, yarn.lock                 + react-native-svg, react-native-reanimated, react-native-worklets
ios/Podfile.lock                        (gerado pelo pod install)
src/assets/images/
├── logo.png                            logo exportado do Figma (250 x 40)
└── logo.png.d.ts                       declaração de tipo do módulo PNG, como em videos/
src/shared/theme/
├── motion.ts                           pressedOpacity, durações
├── theme.ts                            + spacing fieldLabelGap, fieldLineGap, iconGap
└── index.ts                            + motion
src/shared/components/
├── Screen.tsx        Screen.test.tsx
├── Icon.tsx          Icon.test.tsx
├── icons.ts                            path e viewBox de cada ícone
├── Logo.tsx          Logo.test.tsx
├── PressableBox.tsx                    createBox<Theme, PressableProps>(Pressable)
├── PressableOpacity.tsx  PressableOpacity.test.tsx
├── Button.tsx        Button.test.tsx
├── TextField.tsx     TextField.test.tsx
├── TextButton.tsx    TextButton.test.tsx
├── Card.tsx          Card.test.tsx
├── Dropdown.tsx      Dropdown.test.tsx
└── index.ts                            + todos os novos
```

## Telas

Não se aplica: a spec não cria telas.

## Componentes

| Componente         | Local    | Responsabilidade                                                                                                                                 | CA                   |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| `Screen`           | `shared` | `Box flex={1} backgroundColor="background"` + padding da área segura nas `edges` (`useSafeAreaInsets`)                                           | CA-01                |
| `Icon`             | `shared` | `Svg` + `Path` do ícone pedido; `name: IconName`, `color: keyof Theme['colors']`, `size: number`                                                 | CA-02                |
| `Logo`             | `shared` | `Image` do logo; `size: 'large' \| 'small'` mapeado para `sizes.logoLarge`/`logoSmall`                                                           | CA-03                |
| `PressableOpacity` | `shared` | `Pressable` animado: opacidade 1 → `motion.pressedOpacity` no toque, com `motion.short`                                                          | CA-17                |
| `Button`           | `shared` | `label`, `onPress`, `disabled`, `loading`, `bottomInset`; `ActivityIndicator` no carregamento                                                    | CA-04 a CA-07        |
| `TextField`        | `shared` | `label`, `value`, `onChangeText`, `secure`, `keyboardType`; linha animada; máscara `*` e cursor                                                  | CA-08 a CA-10        |
| `TextButton`       | `shared` | `label`, `onPress`, `icon?: IconName`, `tone: 'default' \| 'accent'`                                                                             | CA-11, CA-17         |
| `Card`             | `shared` | `children`, `selected`, `onPress?`; `paddingHorizontal` do tema; borda de seleção numa camada absoluta por cima, para o conteúdo não se deslocar | CA-12, CA-13         |
| `Dropdown`         | `shared` | `value`, `options`, `onSelect`, `textInset: 's' \| 'm'`; estado aberto local; lista e seta animadas                                              | CA-14 a CA-16, CA-18 |

`PressableOpacity` não está na spec como componente: é a base comum do feedback de toque de `Button`, `TextButton`, `Card` e `Dropdown`, e é exportado para as features usarem o mesmo feedback.

## Dados e tipos

- `IconName = 'arrow' | 'calendar' | 'checkFile' | 'close' | 'logout'`, derivado das chaves de `icons.ts`.
- `icons.ts`: para cada nome, `viewBox` (`width`, `height`) e a lista de `path` (`d`, `fillRule` opcional). A seta usa a versão 14 x 14; o calendário mantém 21,43 x 24.
- `DropdownOption<T> = { label: string; value: T }`.
- `motion`: `pressedOpacity: 0.8`, `short: 150`, `medium: 200`, `caretBlink: 500` (ms).
- `spacing`, novos tokens (as props de espaçamento do Restyle só aceitam chaves do tema): `fieldLabelGap: 25` (rótulo → valor do campo) e `fieldLineGap: 8` (valor → linha), medidos no Figma, que exigem a atualização da spec 001 na mesma tarefa; `iconGap: 8` (texto → ícone), definido na spec 003. A margem de 12 da seta e as de 16 da lista usam `s` e `m`; o afastamento de 7 entre o dropdown e a lista usa `xs`.

## APIs

Não se aplica.

## Estado

Só estado local: aberto/fechado do `Dropdown`, foco do `TextField` e valores animados (`useSharedValue`). Nenhum estado global.

## API pública

`src/shared/components/index.ts`: `Box`, `Text`, `Screen`, `Icon`, `type IconName`, `Logo`, `PressableOpacity`, `Button`, `TextField`, `TextButton`, `Card`, `Dropdown`, `type DropdownOption`.
`src/shared/theme/index.ts`: + `motion`.
Consumidores: features `auth`, `classes`, `report-card`, seleção de aluno e `app/navigation`.

## Impacto em outras features e em `shared`

| Área afetada       | Mudança                             | Risco                                                     |
| ------------------ | ----------------------------------- | --------------------------------------------------------- |
| `babel.config.js`  | Plugin do worklets                  | Médio: exige `--reset-cache`; plugin fora de ordem quebra |
| `jest.config.js`   | `setupFiles` do Reanimated          | Baixo                                                     |
| `ios/`             | Pods do svg, reanimated e worklets  | Médio: exige `pod install` e rebuild                      |
| `android/`         | Autolinking (sem edição manual)     | Médio: exige rebuild                                      |
| `src/shared/theme` | `motion` e medidas novas em `sizes` | Baixo                                                     |
| `features/splash`  | Nenhuma                             | Nenhum                                                    |

## Dependências novas

| Pacote                    | Versão    | Por que é necessário                                                                                 | Alternativas avaliadas                                                                           | Exige ADR?                              |
| ------------------------- | --------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------- |
| `react-native-svg`        | `15.16.0` | Ícones do Figma são vetores; um desenho atende várias cores e tamanhos, nítido em qualquer densidade | PNG @1x/@2x/@3x com `tintColor` (18 arquivos, nitidez dependente da exportação); fonte de ícones | Não: renderização, não muda arquitetura |
| `react-native-reanimated` | `4.7.1`   | Animações fluidas na thread de UI, exigidas pelo teste (ADR 0004)                                    | `Animated`, `LayoutAnimation`, Lottie (ver ADR 0004)                                             | Sim: 0004                               |
| `react-native-worklets`   | `0.13.0`  | Dependência obrigatória do Reanimated 4 (peer `0.13.x`)                                              | Nenhuma: exigida pelo Reanimated                                                                 | Coberto pelo 0004                       |

Versões conferidas no registro do npm em 2026-10-24: Reanimated 4.7.1 e worklets 0.13.0 declaram `react-native: 0.86 - 0.88`; svg 15.16.0 aceita qualquer versão.

## Riscos e mitigação

| Risco                                                             | Probabilidade | Impacto | Mitigação                                                                                                             |
| ----------------------------------------------------------------- | ------------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| Logo PNG 250 x 40 borrado no tamanho 306 x 49 em telas @2x/@3x    | Alta          | Médio   | Usar o PNG agora; pedir à responsável o export @3x ou SVG pelo app do Figma (a cota do MCP acabou) e trocar o arquivo |
| Nome ou posição do plugin Babel do worklets diferente do esperado | Média         | Alto    | Conferir no README do pacote instalado antes de editar `babel.config.js`                                              |
| `react-native-svg` ou Reanimated não renderizam no Jest           | Média         | Médio   | T01 inclui um teste de fumaça com `Svg` e `Animated.View` antes de qualquer componente                                |
| Warnings do Reanimated no Jest quebram o `yarn validate`          | Média         | Médio   | Usar o setup oficial de testes; não silenciar warnings sem justificativa                                              |
| Cursor desenhado no modo seguro diferente do cursor nativo        | Média         | Baixo   | Mesma cor do texto, largura 1 e altura da linha do valor; conferido na verificação manual                             |
| Medidas não registradas (gap texto–ícone, margens do dropdown)    | Alta          | Baixo   | Valores propostos na spec; ajustar após conferência no Figma                                                          |
| `react-test-renderer` obsoleto no React 19                        | Baixa         | Baixo   | Decisão da responsável manter; interação testada chamando as props dentro de `act`                                    |

## Documentação a atualizar

- `docs/specs/001-design-system/spec.md`: espaçamentos internos do campo (25 e 8) na tabela "Espaçamentos observados".
- `docs/estrutura-de-pastas.md`: `src/assets/images/`, `jest.setup.js`, componentes de `shared/components`, `motion.ts`.
- `docs/convencoes.md`: animações com Reanimated e tokens de `motion`; ícones só pelo `Icon`; feedback de toque pelo `PressableOpacity`.
- `AGENTS.md`: tabela de stack (`react-native-svg`, `react-native-reanimated`, `react-native-worklets`).
- `README.md`: dependências novas e `pod install`.
- `docs/adr/0004-animacoes-com-reanimated.md`: status `Aceito` após aprovação.

## Decisões arquiteturais

- [ADR 0004](../../adr/0004-animacoes-com-reanimated.md): animações com Reanimated (criado como `Proposto`).
