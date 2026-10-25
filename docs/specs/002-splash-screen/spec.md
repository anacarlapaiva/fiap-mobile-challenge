# Spec 002: Splash screen

- **Status:** Concluída
- **Autor:** Ana Carla Paiva
- **Aprovado por:** Ana Carla Paiva (2026-10-23)
- **Data:** 2026-10-23

## O quê

Abertura a frio reproduz `FIAP Splash.mp4` (1280×720, 6,1 s, 30 fps, sem áudio; fundo nivelado a `#000000`) uma vez em tela cheia. Falha ou atraso não prende o app. Voltar do segundo plano não repete. Arquivo entra sem reencode.

## Critérios de aceite

- **CA-01:** **Dado** o app na abertura, **Quando** a splash é exibida, **Então** reproduz o vídeo local uma vez, quadro inteiro, sem controle, sem som, fundo `#000000`, rótulo "Animação de abertura da FIAP".
- **CA-02:** **Dado** a splash em reprodução, **Quando** o vídeo emite o fim, **Então** a conclusão é avisada uma vez. **Quando** o progresso ainda está antes do fim, inclusive no fade (5,8 s de 6,1 s), **Então** a splash continua.
- **CA-03:** **Dado** a splash, **Quando** a reprodução falha, **Então** a conclusão é avisada e nenhum erro é mostrado.
- **CA-04:** **Dado** a splash, **Quando** a reprodução não começa em 4 segundos, **Então** a conclusão é avisada.
- **CA-05:** **Dado** a splash com a reprodução já iniciada, **Quando** passam 4 segundos, **Então** ela continua; **quando** passam 12 segundos sem o fim, **Então** a conclusão é avisada.
- **CA-06:** **Dado** o app iniciado, **Quando** a splash está visível, **Então** a raiz permanece com fundo `#000000` e a barra de status fica oculta; **quando** a splash termina, **Então** a barra de status volta e a raiz continua na tela.
- **CA-07:** **Dado** os projetos nativos, **Quando** a tela de abertura do sistema é inspecionada, **Então** o fundo é `#000000` e não existem os textos "AppFiap" e "Powered by React Native".

## Regras

- Uma vez por processo. Quadro 16:9 visível; faixas pretas no retrato, sem cortar o desenho.
- Sem som, pausa, avanço ou pular. Fundo é o token `background`.
- Tela nativa de abertura (iOS e Android) faz parte desta spec (autorizado em 2026-10-23).

## Fora do escopo

- Telas depois da splash, áudio, pular, lembrar que já viu, tema claro.
