# 0003. Reproduzir vídeo local com react-native-video

- **Status:** Aceito
- **Data:** 2026-10-23
- **Decisores:** time do AppFiap

## Contexto

A abertura do app precisa reproduzir um mp4 local (a animação da marca, sem áudio). O fundo cinza do arquivo foi nivelado para o preto do tema (`#000000`); o resultado tem 77 KB. O React Native 0.88 não tem componente de vídeo. A nova arquitetura já está ligada (`newArchEnabled=true` no Android e no `pod install` do iOS). O projeto é CLI, sem Expo. O arquivo não vira sequência de quadros.

## Decisão

1. Vídeo local é reproduzido com `react-native-video` 6.19.3.
2. O módulo nativo entra por autolinking. No iOS, `bundle exec pod install` atualiza o `Podfile.lock`. No Android, o Gradle resolve o Media3.
3. As extensões opcionais de streaming e anúncio (DASH, HLS, Smooth Streaming, RTSP e IMA) ficam desligadas em `android/build.gradle`. O caso de uso é um mp4 empacotado.
4. Nenhum outro player é adicionado enquanto este cobrir reprodução de arquivo local.

## Alternativas consideradas

| Alternativa                                   | Prós                         | Contras                                                                           | Motivo da rejeição                              |
| --------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------- |
| `expo-video` / `expo-av`                      | API pronta                   | Exige o runtime de módulos do Expo num app CLI                                    | Contradiz a stack sem Expo                      |
| WebView com vídeo HTML                        | Não cria um player dedicado  | Outro módulo nativo, pior controle de fim e de erro, mais peso na abertura        | Mais superfície para um arquivo de 6 segundos   |
| Sequência dos 183 quadros animada com `Image` | Sem biblioteca de vídeo      | Mais memória e mais bytes que o mp4 de 77 KB, e perde o tempo original do arquivo | O pedido é usar o arquivo e não deixá-lo pesado |
| Player nativo escrito em `android/` e `ios/`  | Sem dependência de terceiros | Código de duas plataformas para manter, fora da camada de features                | Custo desproporcional a uma splash              |

## Consequências

- **Positivas:** um player só, asset local via Metro (mp4 já é extensão padrão), fim e erro observáveis em JavaScript, nova arquitetura suportada pela versão 6.19.3.
- **Negativas:** o binário Android inclui o Media3 ExoPlayer mesmo sem as extensões de streaming; iOS e Android precisam de rebuild depois da instalação. Recarregar o Metro não liga o módulo nativo.
- **Ações decorrentes:** dependência em `package.json`; `ios/Podfile.lock`; flags em `android/build.gradle`; uso restrito à feature que reproduz o vídeo, importando o player direto, sem wrapper em `shared` até existir um segundo uso.
