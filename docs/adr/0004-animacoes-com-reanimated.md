# 0004. Animar a interface com react-native-reanimated

- **Status:** Aceito
- **Data:** 2026-10-24
- **Decisores:** Ana Carla Paiva

## Contexto

As telas precisam de animação fluida, sem prejudicar a performance. O Figma não define animações: elas são decisão do projeto. Os componentes globais precisam de rotação (seta do dropdown), abertura e fechamento de lista, opacidade no toque e troca de cor; o accordion do boletim e as listas precisam de transição de altura e de entrada e saída. O projeto é React Native CLI 0.88, com a nova arquitetura ligada, sem Expo.

## Decisão

1. Animações de interface usam `react-native-reanimated` 4.7.1, com `react-native-worklets` 0.13.0 (dependência obrigatória da versão 4; ambas declaram suporte ao React Native 0.86 a 0.88).
2. O plugin Babel exigido pela biblioteca entra em `babel.config.js`, como último plugin. Antes dele fica `@babel/plugin-transform-export-namespace-from`, porque o plugin do worklets não aceita `export * as` sem transformar (usado pelo `zod`). Depois de mudar a configuração do Babel, o Metro é reiniciado com `yarn start --reset-cache`.
3. O módulo nativo entra por autolinking; no iOS, `bundle exec pod install` atualiza o `Podfile.lock`. Mudança em `ios/` autorizada pela responsável em 2026-10-24.
4. O Jest usa a configuração de testes oficial da biblioteca, num arquivo de setup referenciado em `jest.config.js`.
5. Durações e opacidades das animações vêm do tema (`src/shared/theme/`), nunca escritas nos componentes.
6. A API `Animated` do React Native e a `LayoutAnimation` não são usadas para animações novas.

## Alternativas consideradas

| Alternativa                | Prós                                      | Contras                                                                                 | Motivo da rejeição                                         |
| -------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `Animated` do React Native | Sem dependência nova                      | Altura e layout não rodam no driver nativo; accordion exigiria medir altura manualmente | Transições de altura e de lista ficariam na thread de JS   |
| `LayoutAnimation`          | Sem dependência; anima mudanças de layout | Comportamento menos previsível no Android, pouco controle por elemento                  | Fluidez e controle insuficientes para o accordion e listas |
| Lottie                     | Animações desenhadas por designer         | Não há arquivos de animação no Figma; não anima componentes da interface                | Não resolve o caso de uso                                  |

## Consequências

- **Positivas:** animações na thread de UI, transições de layout prontas (entrada, saída e altura), API única para todas as telas.
- **Negativas:** duas dependências nativas a mais; plugin Babel obrigatório; rebuild de iOS e Android após a instalação; configuração extra no Jest.
- **Ações decorrentes:** dependências em `package.json`; plugin em `babel.config.js`; setup no `jest.config.js`; `ios/Podfile.lock`; tokens de movimento no tema; `AGENTS.md` (stack) e `docs/convencoes.md` (animações vêm do Reanimated e do tema).
