# Plano 002: Splash screen

- **Status:** Aprovado
- **Spec:** [spec.md](spec.md)
- **Aprovado por:** Ana Carla Paiva (2026-10-23)
- **Data:** 2026-10-23

## Resumo da solução

A splash é uma feature (`src/features/splash/`) porque é uma tela, e `src/app/` não guarda telas. `App` decide quando ela está visível e a remove ao fim. O vídeo fica em `src/assets/videos/splash.mp4`. O fundo cinza do arquivo foi trocado por `#000000`, igual ao token `background`, e a grade sumiu: resta a escrita.

O React Native não reproduz vídeo sozinho. O player é o `react-native-video` 6.19.3, registrado no [ADR 0003](../../adr/0003-reproducao-de-video-local.md). O tipo publicado do player não inclui o id de asset que o runtime aceita; a conversão fica isolada em `splashVideo.ts`.

O vídeo usa `contain`, mudo, sem controles e sem receber toque. O fundo, a cor de obturador e o fundo do player vêm de `theme.colors.background`. O progresso não encerra a splash: aos 5,8 s o logo ainda está na tela e só some por volta de 6,0 s. Quem encerra é o evento de fim. Se nada começar em 4 segundos, ou se passarem 12 segundos sem esse evento, a splash sai. Um progresso com tempo zero não conta como início. A tela nativa anterior ao JavaScript fica preta, e no Android 12+ o ícone do sistema não aparece. As extensões de streaming do Media3 (DASH, HLS, Smooth Streaming, RTSP e IMA) ficam desligadas: o arquivo é mp4 local.

## Estrutura de arquivos

```
src/assets/videos/splash.mp4
src/assets/videos/splash.mp4.d.ts
src/features/splash/
├── screens/SplashScreen.tsx
├── screens/SplashScreen.test.tsx
├── splashVideo.ts
├── types.ts
└── index.ts
src/app/App.tsx
src/app/App.test.tsx
src/app/nativeLaunch.test.ts
android/build.gradle
android/app/src/main/res/values/colors.xml
android/app/src/main/res/values/styles.xml
android/app/src/main/res/values-v31/styles.xml
android/app/src/main/res/drawable/splash_empty.xml
ios/AppFiap/LaunchScreen.storyboard
ios/Podfile.lock
```

## Telas

| Tela            | Arquivo                                                            | Critérios de aceite atendidos     |
| --------------- | ------------------------------------------------------------------ | --------------------------------- |
| Splash          | `src/features/splash/screens/SplashScreen.tsx`                     | CA-01, CA-02, CA-03, CA-04, CA-05 |
| Raiz            | `src/app/App.tsx`                                                  | CA-06                             |
| Abertura nativa | `ios/AppFiap/LaunchScreen.storyboard`, `android/app/src/main/res/` | CA-07                             |

## Componentes

| Componente     | Local     | Responsabilidade                              |
| -------------- | --------- | --------------------------------------------- |
| `SplashScreen` | `feature` | Tela cheia que reproduz o vídeo e avisa o fim |
| `Box`          | `shared`  | Fundo preto do tema                           |

O player nativo não vira componente de `shared`: só esta feature reproduz vídeo.

## Dados e tipos

`SplashScreenProps` tem só `onFinish`. Não há modelo de domínio. O id do asset é declarado em `src/assets/videos/splash.mp4.d.ts`, ao lado do arquivo.

## APIs

Não se aplica. Não há rede.

## Estado

Estado local de `App`: a splash está visível ou não. Dentro da tela, refs guardam se já concluiu, se a reprodução começou e a duração. Nada disso vai para `store/` nem para disco. Sair do segundo plano mantém o estado do processo, então a splash não reaparece.

## API pública da feature (`index.ts`)

`SplashScreen` e `SplashScreenProps`. Quem consome é `src/app/App.tsx`.

## Impacto em outras features e em `shared`

| Área afetada        | Mudança                                                     | Risco                                             |
| ------------------- | ----------------------------------------------------------- | ------------------------------------------------- |
| `src/app/App.tsx`   | Monta a splash por cima da raiz e esconde a barra de status | O teste CA-05 do tema continua vendo a raiz preta |
| `android/` e `ios/` | Fundo preto da abertura e o pod do player                   | Exige rebuild nativo; Metro sozinho não basta     |
| Tema                | Nenhuma                                                     | A splash só lê `background`                       |

## Dependências novas

| Pacote               | Versão | Por que é necessário                                                                                       | Alternativas avaliadas                                                                                                                                                   | Exige ADR?    |
| -------------------- | ------ | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| `react-native-video` | 6.19.3 | Única forma suportada de reproduzir o mp4 local no React Native CLI 0.88, com a nova arquitetura já ligada | `expo-video` puxaria o runtime do Expo; WebView acrescenta outro módulo nativo e pior controle de fim e erro; extrair os 183 quadros pesaria mais que o arquivo de 77 KB | Sim, ADR 0003 |

## Riscos e mitigação

| Risco                                 | Probabilidade                         | Impacto                     | Mitigação                                                      |
| ------------------------------------- | ------------------------------------- | --------------------------- | -------------------------------------------------------------- |
| `onEnd` não dispara em algum aparelho | Média                                 | Splash presa                | Saída aos 4 s se não começar e teto de 12 s, sem cortar o fade |
| Flash branco antes do JavaScript      | Alta, se a launch screen padrão ficar | Abertura quebrada           | Fundo nativo `#000000` e ícone vazio no Android 12+            |
| Vídeo 16:9 cortado no telefone        | Alta, com `cover`                     | Perde as linhas da animação | `contain`; as faixas usam o preto do tema                      |
| Media3 aumenta o binário Android      | Certa                                 | App maior                   | Sem DASH, HLS, Smooth Streaming, RTSP e IMA                    |
| Player não entra no binário iOS       | Certa, sem pod                        | Vídeo não toca              | `pod install` já gera o `Podfile.lock` com o módulo            |

## Documentação a atualizar

- `docs/adr/0003-reproducao-de-video-local.md`
- `docs/README.md`
- `docs/estrutura-de-pastas.md`
- `AGENTS.md` (dependência de runtime)
- `README.md`

## Decisões arquiteturais

ADR 0003: reproduzir vídeo local com `react-native-video`.
