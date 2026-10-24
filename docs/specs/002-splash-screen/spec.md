# Spec 002: Splash screen

- **Status:** Concluída
- **Autor:** Ana Carla Paiva
- **Aprovado por:** Ana Carla Paiva (2026-10-23)
- **Data:** 2026-10-23

## Problema

Ao abrir o app, a pessoa vê a tela branca padrão do sistema, com os textos "AppFiap" e "Powered by React Native", e em seguida uma tela preta vazia. A abertura não apresenta a animação da marca. O arquivo entregue para isso é `FIAP Splash.mp4`: 1280×720, 6,1 segundos, 30 fps, sem faixa de áudio. O fundo cinza do arquivo foi nivelado para `#000000`, o mesmo preto do tema, e ficou só a escrita FIAP.

## Objetivo

Em toda abertura a frio, a pessoa vê essa animação em tela cheia e, ao fim, o app. Sucesso: o quadro inteiro do vídeo aparece uma vez, a splash não prende o app se a reprodução falhar, e o arquivo entra no app sem ser reencodado nem convertido em sequência de imagens.

## Usuários

| Perfil                      | Necessidade principal                                          |
| --------------------------- | -------------------------------------------------------------- |
| Responsável (usuário final) | Ver a abertura da FIAP antes do conteúdo do app                |
| Pessoa desenvolvedora       | Trocar só o arquivo de vídeo, sem espalhar a regra de abertura |

## Fluxos

### Fluxo principal

1. A pessoa abre o app (processo novo).
2. Antes do JavaScript, a tela do sistema é preta, sem texto de placeholder.
3. A animação começa sozinha, centralizada, com o quadro inteiro visível, sem som e sem controles.
4. Quando a animação termina, a splash sai e o conteúdo do app aparece. A barra de status volta.
5. Se a pessoa só volta do segundo plano, a splash não reaparece.

### Fluxos alternativos

- A reprodução falha: a splash sai na hora e o conteúdo aparece. Não há mensagem de erro.
- A reprodução não começa em 4 segundos: a splash sai e o conteúdo aparece.
- A reprodução começou e não sinaliza o fim: a splash sai aos 12 segundos.

## Critérios de aceite

- **CA-01:** **Dado** o app na abertura, **Quando** a splash é exibida, **Então** ela reproduz o vídeo local da abertura uma vez, com o quadro inteiro visível, sem controle, sem som, sobre o fundo `#000000`, com o rótulo de acessibilidade "Animação de abertura da FIAP".
- **CA-02:** **Dado** a splash em reprodução, **Quando** o vídeo emite o fim, **Então** a conclusão é avisada uma única vez. **Quando** o progresso ainda está antes do fim, inclusive no fade (5,8 s de um vídeo de 6,1 s), **Então** a splash continua.
- **CA-03:** **Dado** a splash, **Quando** a reprodução falha, **Então** a conclusão é avisada e nenhum erro é mostrado.
- **CA-04:** **Dado** a splash, **Quando** a reprodução não começa em 4 segundos, **Então** a conclusão é avisada.
- **CA-05:** **Dado** a splash com a reprodução já iniciada, **Quando** passam 4 segundos, **Então** ela continua; **quando** passam 12 segundos sem o fim, **Então** a conclusão é avisada.
- **CA-06:** **Dado** o app iniciado, **Quando** a splash está visível, **Então** a raiz permanece com fundo `#000000` e a barra de status fica oculta; **quando** a splash termina, **Então** a barra de status volta e a raiz continua na tela.
- **CA-07:** **Dado** os projetos nativos, **Quando** a tela de abertura do sistema é inspecionada, **Então** o fundo é `#000000` e não existem os textos "AppFiap" e "Powered by React Native".

## Estados da interface

| Estado       | Quando ocorre                           | O que o usuário vê                      | Ação disponível |
| ------------ | --------------------------------------- | --------------------------------------- | --------------- |
| Carregando   | Do toque no ícone até o primeiro quadro | Tela preta                              | Nenhuma         |
| Reproduzindo | O vídeo começou                         | A animação, quadro inteiro, fundo preto | Nenhuma         |
| Sucesso      | O vídeo terminou                        | O conteúdo do app                       | A do app        |
| Erro         | Falha, atraso de 4 s ou teto de 12 s    | O conteúdo do app, sem mensagem         | A do app        |
| Vazio        | Não se aplica                           | O vídeo vai no pacote do app            | —               |
| Sem conexão  | Não se aplica                           | O vídeo é local                         | —               |

## Regras de negócio e validações

- A splash ocorre a cada abertura do processo. Voltar do segundo plano não a repete.
- A animação toca uma vez e não recomeça.
- O quadro inteiro permanece visível. O arquivo é 16:9 e o telefone é retrato: as faixas acima e abaixo usam o preto do tema, sem cortar o desenho nem as linhas da animação.
- Não há som, pausa, avanço nem pular.
- A barra de status fica oculta enquanto a splash está visível.
- O fundo é o token `background` do tema (`#000000`). Nenhum valor visual novo entra no tema.
- O arquivo de vídeo não vira sequência de quadros. O fundo dele é `#000000`, igual ao da tela, para não aparecer um retângulo cinza.
- A alteração da tela nativa de abertura (iOS e Android) faz parte desta spec, para a passagem até o vídeo ser preta. Autorizada pelo pedido de fazer a splash funcionar, em 2026-10-23.

## Fora do escopo

- Telas depois da splash. Ela revela o que o app já mostra.
- Áudio, legenda, streaming e anúncio.
- Botão de pular.
- Guardar que a pessoa já viu a abertura.
- Tema claro.

## Perguntas em aberto

Nenhuma.
