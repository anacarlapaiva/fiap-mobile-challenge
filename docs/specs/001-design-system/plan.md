# Plano 001: Design system (tema global)

- **Status:** Aprovado
- **Spec:** [spec.md](spec.md)
- **Aprovado por:** Ana Carla Paiva (2026-10-23)
- **Data:** 2026-10-23

## Resumo da solução

O tema é um objeto do Restyle (`createTheme`), em `src/shared/theme/`, com chaves separadas por tipo de token: `colors`, `spacing`, `borderRadii`, `textVariants` e `breakpoints` (obrigatório no Restyle, com um único breakpoint `phone: 0`). Os tamanhos fixos e as larguras de borda, que o Restyle não modela como tokens nativos, ficam dentro do próprio tema, em chaves próprias (`sizes`, `borderWidths`) e nos variants de componente (spec 003), lidos por `useTheme()` ou aplicados por `createVariant`. Revisão de 2026-10-24, aprovada pela responsável: antes ficavam em `sizes.ts`, fora do tema. Todos os valores são os da spec, sem arredondamento.

A Montserrat entra como quatro TTFs estáticos (v9.000, do repositório oficial `JulietaUla/Montserrat`) em `src/assets/fonts/`, com o `OFL.txt`. Cada arquivo tem o nome igual ao seu PostScript name (`Montserrat-Regular`, `Montserrat-Medium`, `Montserrat-SemiBold`, `Montserrat-Bold`, conferidos na tabela `name` dos arquivos). Assim, `fontFamily` funciona igual no iOS e no Android, e cada estilo de texto aponta para o arquivo do peso, sem usar `fontWeight`, que faria o sistema sintetizar negrito. O registro nativo usa `react-native-asset` e `react-native.config.js`, alterando `ios/` e `android/` com a autorização dada na spec.

`Box` e `Text` são criados com `createBox`/`createText` em `src/shared/components/`, tipados pelo tema, para que as telas só consigam usar valores do tema. `textVariants.defaults` define a cor, `letterSpacing: 0`, `includeFontPadding: false` e as medidas do corpo; o Restyle aplica `defaults` por baixo de todo variant, então cada variant declara só família, tamanho e altura de linha (e a cor, quando difere). O `ThemeProvider` entra em `AppProviders`. O `App.tsx` do template deixa de renderizar a `NewAppScreen` e passa a renderizar um `Box` vazio com fundo `background`, e a dependência `@react-native/new-app-screen` é removida.

## Estrutura de arquivos

```
react-native.config.js                     novo: aponta assets para ./src/assets/fonts
src/assets/fonts/
├── Montserrat-Regular.ttf
├── Montserrat-Medium.ttf
├── Montserrat-SemiBold.ttf
├── Montserrat-Bold.ttf
└── OFL.txt
src/shared/theme/
├── theme.ts                               createTheme + type Theme
├── fonts.ts                               nomes das famílias por peso
└── index.ts
src/shared/components/
├── Box.tsx                                createBox<Theme>()
├── Text.tsx                               createText<Theme>()
├── Text.test.tsx                          CA-02 (variant aplicado ao componente)
└── index.ts
src/app/providers/AppProviders.tsx         + ThemeProvider
src/app/App.tsx                            remove NewAppScreen; Box com fundo do tema
src/app/App.test.tsx                       CA-05
ios/AppFiap/Info.plist, ios/AppFiap.xcodeproj/project.pbxproj   (gerados pelo react-native-asset)
android/app/src/main/assets/fonts/*.ttf, android/link-assets-manifest.json, ios/link-assets-manifest.json   (gerados)
```

## Telas

Não se aplica: a spec não cria telas.

## Componentes

| Componente | Local    | Responsabilidade                                                                    |
| ---------- | -------- | ----------------------------------------------------------------------------------- |
| `Box`      | `shared` | `View` tipada pelo tema (cores, espaçamentos, raios)                                |
| `Text`     | `shared` | `Text` tipado pelo tema; `variant` opcional entre os estilos da spec, padrão `body` |

## Dados e tipos

Tokens (nomes em inglês, valores da spec):

Os valores ficam só na spec e no código (`theme.ts`); o plano registra os nomes e o mapeamento.

- `colors`: um token por linha da tabela "Cores", nomeado pelo uso: `background`, `accent`, `textPrimary`, `textOnAccent`, `textDisabled`, `surface`, `card`, `inputLine`, `inputLineFilled`, `bulletBorder`.
- `spacing`: `none`, `xs`, `s`, `m`, `l`, `xl` (7 a 48). As margens de 28 e 40 do Figma (texto do boletim e das aulas) são compostas no layout (`m` + `s` e `l` + `m`) e não viram token próprio.
- `borderRadii`: `none`, `m` (dropdown, lista e cards) e `bullet` (marcador da aula).
- `textVariants`: `defaults` e um variant por linha da tabela "Tipografia": `inputValue`, `greeting`, `greetingName`, `sectionTitle`, `inputLabel`, `button`, `body`, `bodyMedium`, `bodySemiBold`, `bodyBold`, `caption`, `captionMedium`, `tabLabel`.
- `sizes`: alturas, logos, ícones, marcador e imagem "sem aulas" da tabela "Raios, bordas e tamanhos fixos", e as alturas de linha das listas (`optionRowHeight`, `subjectRowHeight`, `lessonRowHeight`): com a linha nessa altura, a distância topo a topo do Figma sai sem somar margem. Larguras que dependem da tela (campo, botão, cards) não entram: vêm do layout.
- `borderWidths`: `thin` (borda do card selecionado, linha dos campos e marcador).

## APIs

Não se aplica.

## Estado

Não se aplica: o tema é estático, sem estado.

## API pública

`src/shared/theme/index.ts`: `theme`, `type Theme`, `fonts`.
`src/shared/components/index.ts`: `Box`, `Text`.
Consumidores: `app` (provider) e todas as features futuras.

## Impacto em outras features e em `shared`

| Área afetada        | Mudança                                                  | Risco                                |
| ------------------- | -------------------------------------------------------- | ------------------------------------ |
| `src/app`           | `ThemeProvider` e raiz sem a tela do template            | Baixo                                |
| `ios/` e `android/` | Fonte registrada pelo `react-native-asset`               | Médio: exige `pod install` e rebuild |
| `package.json`      | + `react-native-asset`; − `@react-native/new-app-screen` | Baixo                                |

## Dependências novas

| Pacote               | Versão         | Por que é necessário                                                                                                                                  | Alternativas avaliadas                                                                                                       | Exige ADR?                                     |
| -------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `react-native-asset` | `^2.3.0` (dev) | Registrar fontes no iOS (Info.plist e Copy Bundle Resources) e no Android de forma reproduzível por comando, com manifesto que permite remover depois | Edição manual do `project.pbxproj` (frágil, difícil de revisar); `npx react-native-asset` sem instalar (proibido usar `npx`) | Não: ferramenta de build, não muda arquitetura |

Remoção: `@react-native/new-app-screen`, que só servia à tela padrão do template.

## Riscos e mitigação

| Risco                                         | Probabilidade | Impacto | Mitigação                                                                                   |
| --------------------------------------------- | ------------- | ------- | ------------------------------------------------------------------------------------------- |
| Nome da família diferente entre iOS e Android | Baixa         | Alto    | Arquivos com o nome igual ao PostScript name, conferido na tabela `name`                    |
| Negrito sintetizado ou peso errado            | Média         | Alto    | Um `fontFamily` por peso e nenhum `fontWeight` nos `textVariants`; conferido no `Text.test` |
| Altura de texto diferente no Android          | Média         | Médio   | `includeFontPadding: false` em `defaults` e `lineHeight` explícito em todo variant          |
| `react-native-asset` incompatível com RN 0.88 | Baixa         | Médio   | Conferir o diff gerado em `ios/` e `android/`; se falhar, parar e propor o registro manual  |
| Lint/boundaries: `.ttf` fora de camada        | Baixa         | Baixo   | `boundaries` só avalia arquivos de código; `.ttf` fica em `src/assets`                      |

## Documentação a atualizar

- `docs/estrutura-de-pastas.md`: `react-native.config.js`, `src/assets/fonts/`, arquivos do tema.
- `docs/convencoes.md`: seção "Estilo": todo valor visual vem do tema, usar `Box`/`Text`, nunca `fontWeight` com fonte customizada.
- `AGENTS.md`: tabela de stack (`react-native-asset`) e comando para registrar fontes.
- `README.md`: passo de fontes (aponta para os comandos do `AGENTS.md`).

## Decisões arquiteturais

Nenhuma. A biblioteca de estilo (Restyle) é obrigatória pelo teste, e as decisões de escala e de normalização estão registradas na spec.
