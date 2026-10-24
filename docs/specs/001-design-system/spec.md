# Spec 001: Design system (tema global)

- **Status:** Concluída
- **Autor:** Ana Carla Paiva (com Claude Code)
- **Aprovado por:** Ana Carla Paiva (2026-10-23)
- **Data:** 2026-10-23

## O quê

Tema único com os valores do Figma (`wxBenyfshI65ffp1cYMuW4`, frame 414×736). Nenhuma tela usa valor visual fora do tema.

## Cores

| Uso                                                         | Valor     |
| ----------------------------------------------------------- | --------- |
| Fundo de todas as telas e da barra de ações                 | `#000000` |
| Destaque (botão, títulos de seção, aba ativa, erro, ícones) | `#29F4D5` |
| Texto principal                                             | `#FFFFFF` |
| Texto sobre o botão habilitado                              | `#000000` |
| Texto do botão desabilitado                                 | `#777777` |
| Superfície: dropdown, lista de opções, rodapé (abas)        | `#262626` |
| Card: trimestre, aluno                                      | `#4D4D4D` |
| Linha do campo vazio                                        | `#525252` |
| Linha do campo preenchido                                   | `#FFFFFF` |
| Borda do marcador da aula                                   | `#CCCCCC` |

Tema único escuro. O rosa aparece só na imagem do logo.

## Tipografia

Montserrat v9.000 (OFL), pesos 400, 500, 600 e 700. Letter-spacing 0. Altura de linha igual à caixa do Figma.

| Estilo            | Peso     | Tamanho | Altura de linha | Onde                                    |
| ----------------- | -------- | ------- | --------------- | --------------------------------------- |
| Valor do campo    | Regular  | 32      | 39              | CPF e senha no login                    |
| Saudação          | Regular  | 24      | 29              | "Olá, "; título "Escolha o perfil…"     |
| Saudação nome     | Bold     | 24      | 29              | "GUSTAVO"                               |
| Título de seção   | Bold     | 20      | 24              | "AGENDA", "BOLETIM"                     |
| Rótulo do campo   | Regular  | 20      | 24              | "CPF", "SENHA"; "Sem aulas neste dia"   |
| Botão             | Medium   | 20      | 24              | "FAZER LOGIN"                           |
| Corpo             | Regular  | 16      | 20              | Dropdowns, turma/RM/período             |
| Corpo médio       | Medium   | 16      | 20              | Nome do aluno; erro do login            |
| Corpo seminegrito | SemiBold | 16      | 20              | Disciplina na lista de aulas            |
| Corpo negrito     | Bold     | 16      | 20              | "1º TRIMESTRE", "FECHAR"                |
| Legenda           | Regular  | 12      | 15              | Horário; "TROCAR PERFIL", "SAIR"        |
| Legenda média     | Medium   | 12      | 15              | Boletim: disciplina, "Nota:", "Faltas:" |
| Rótulo da aba     | Bold     | 10      | 12              | "AGENDA", "BOLETIM" no rodapé           |

## Espaçamentos

| Valor | Onde                                                                                      |
| ----- | ----------------------------------------------------------------------------------------- |
| 4     | Ícone e rótulo da aba                                                                     |
| 7     | Dropdown e lista aberta                                                                   |
| 8     | Valor do campo do login e a linha                                                         |
| 11    | Topo do rodapé e o ícone da aba                                                           |
| 12    | Texto no dropdown e no card de trimestre                                                  |
| 16    | Margem lateral do boletim e da seleção; espaço entre cards; barra de ações; card de aluno |
| 20    | Imagem "sem aulas" e a frase                                                              |
| 24    | Margem lateral do dropdown da agenda                                                      |
| 25    | Rótulo e valor do campo do login                                                          |
| 31    | Linha da senha e a frase de erro do login                                                 |
| 36    | Saudação e nome do aluno no cabeçalho                                                     |
| 39    | Linha do CPF e o rótulo da senha                                                          |
| 48    | Margem lateral dos campos do login                                                        |
| 64    | Fim do cabeçalho e o título de seção                                                      |
| 80    | Logo e o rótulo do CPF no login                                                           |
| 100   | Topo da área segura e o logo do login                                                     |

## Raios, bordas e tamanhos

| Item                                    | Valor                                    |
| --------------------------------------- | ---------------------------------------- |
| Raio de dropdown, lista e cards         | 8                                        |
| Borda do card de aluno selecionado      | 1, cor destaque                          |
| Linha dos campos do login               | 1                                        |
| Marcador da aula                        | 6×6, círculo, borda 1                    |
| Barra de ações (topo)                   | altura 48                                |
| Logo na barra de ações                  | 100×16                                   |
| Logo no login                           | 306×49                                   |
| Botão de login                          | altura 60, largura total, sem raio       |
| Campo do login (rótulo + valor + linha) | altura 96; margem lateral 48             |
| Largura mínima do campo do login        | 260 (cabe o CPF mais largo em 32)        |
| Dropdown fechado                        | altura 45                                |
| Card de trimestre e card de aluno       | altura 90                                |
| Linha da lista de opções do dropdown    | altura 36                                |
| Linha da disciplina fechada do boletim  | altura 37                                |
| Linha da aula                           | altura 59                                |
| Rodapé (abas)                           | altura 64                                |
| Ícones                                  | 24 (abas, fechar), 14 (setas), 10 (sair) |
| Imagem "sem aulas"                      | 328×208                                  |

## Regras

- Valor visual só pelo tema. Sem arredondar para grade 4/8.
- Medidas do Figma em 414 de largura, sem escala proporcional. Larguras de tela = espaço disponível menos as margens do tema.
- Tela estreita: a margem lateral do login encolhe só o bastante para o campo manter 260; a imagem "sem aulas" encolhe na proporção abaixo de 328 de largura.
- O texto não acompanha o tamanho de fonte do sistema: as caixas do Figma têm altura fixa.
- Desalinhamentos do Figma: aulas começam em 40; texto do card de aluno em 32 nas duas linhas. Margens 24 (agenda) e 16 (boletim/seleção) ficam.
- Só os quatro pesos usados. Fonte registrada em `ios/` e `android/` (autorizado em 2026-10-23).

## Critérios de aceite

- **CA-01:** **Dado** o tema, **Quando** as cores são lidas, **Então** são exatamente as da tabela "Cores".
- **CA-02:** **Dado** o tema, **Quando** um estilo de texto é lido, **Então** usa Montserrat no peso, tamanho, altura de linha e letter-spacing 0 da tabela.
- **CA-03:** **Dado** o app em iOS e Android, **Quando** um texto usa estilo do tema, **Então** o arquivo Montserrat do peso correspondente é o que renderiza, sem negrito sintetizado e sem padding extra no Android.
- **CA-04:** **Dado** o tema, **Quando** espaçamentos, raios, bordas e tamanhos são lidos, **Então** batem com as tabelas acima.
- **CA-05:** **Dado** o app iniciado, **Quando** qualquer tela é exibida, **Então** o tema está disponível e o fundo padrão é `#000000`.
- **CA-06:** **Dado** o repositório, **Quando** as fontes são inspecionadas, **Então** existem só os quatro pesos, com a licença OFL ao lado.

## Fora do escopo

- Telas, splash, tema claro. Peças visuais ficam em `src/shared/components/` e nos testes ao lado delas.

## Verificação pendente

CA-03 no aparelho (iOS e Android).
