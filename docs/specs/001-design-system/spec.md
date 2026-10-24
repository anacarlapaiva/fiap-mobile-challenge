# Spec 001: Design system (tema global)

- **Status:** Concluída
- **Autor:** Ana Carla Paiva (com Claude Code)
- **Aprovado por:** Ana Carla Paiva (2026-10-23)
- **Data:** 2026-10-23

## Problema

O app precisa reproduzir o layout do Figma do teste técnico com fidelidade de pixel (Figma: `Teste Técnico Mobile - FIAP`, cópia `wxBenyfshI65ffp1cYMuW4`). Hoje não existe tema: cada tela teria de repetir valores de cor, fonte e medida, o que gera divergência visual entre telas e com o Figma.

## Objetivo

Existir um tema global único, fonte da verdade visual do app, com todos os valores usados no Figma: cores, família tipográfica e estilos de texto, espaçamentos, raios, bordas e tamanhos fixos de elementos. Sucesso: nenhuma tela usa valor visual fora do tema, e cada valor do tema corresponde a um valor medido no Figma.

## Usuários

| Perfil                               | Necessidade principal                                     |
| ------------------------------------ | --------------------------------------------------------- |
| Pessoa desenvolvedora / agente de IA | Construir telas fiéis ao Figma sem medir o Figma de novo  |
| Responsável (usuário final)          | Ver o app com a identidade visual da FIAP School, legível |

## Fluxos

### Fluxo principal

1. Uma tela ou componente precisa de uma cor, estilo de texto ou medida.
2. Ele usa o token correspondente do tema.
3. O app renderiza com Montserrat no peso exato do Figma, em iOS e Android.

### Fluxos alternativos

- Valor do Figma que não existe no tema: o tema é atualizado (com nova aprovação desta spec) antes de a tela usá-lo.

## Valores de referência (medidos no Figma, frame base 414 x 736)

### Cores

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

Tema único escuro. O rosa aparece só dentro da imagem do logo e não é token.

### Tipografia

Família Montserrat, arquivos estáticos v9.000 (licença OFL), pesos Regular (400), Medium (500), SemiBold (600) e Bold (700). Espaçamento entre letras 0. Altura de linha igual à caixa de texto do Figma ("normal" da Montserrat).

| Estilo            | Peso     | Tamanho | Altura de linha | Onde aparece no Figma                                           |
| ----------------- | -------- | ------- | --------------- | --------------------------------------------------------------- |
| Valor do campo    | Regular  | 32      | 39              | CPF digitado e senha mascarada no login                         |
| Saudação          | Regular  | 24      | 29              | "Olá, " no cabeçalho; título "Escolha o perfil…"                |
| Saudação nome     | Bold     | 24      | 29              | "GUSTAVO" no cabeçalho                                          |
| Título de seção   | Bold     | 20      | 24              | "AGENDA", "BOLETIM"                                             |
| Rótulo do campo   | Regular  | 20      | 24              | "CPF", "SENHA"; "Sem aulas neste dia"                           |
| Botão             | Medium   | 20      | 24              | "FAZER LOGIN"                                                   |
| Corpo             | Regular  | 16      | 20              | Opções e valor dos dropdowns, turma/RM/período                  |
| Corpo médio       | Medium   | 16      | 20              | Nome do aluno no cabeçalho e no card; mensagem de erro do login |
| Corpo seminegrito | SemiBold | 16      | 20              | Disciplina na lista de aulas                                    |
| Corpo negrito     | Bold     | 16      | 20              | "1º TRIMESTRE", "FECHAR"                                        |
| Legenda           | Regular  | 12      | 15              | Horário da aula, "TROCAR PERFIL", "SAIR"                        |
| Legenda média     | Medium   | 12      | 15              | Disciplina do boletim, "Nota:", "Faltas:" e valores             |
| Rótulo da aba     | Bold     | 10      | 12              | "AGENDA", "BOLETIM" no rodapé                                   |

### Espaçamentos observados

| Valor | Onde                                                                                                                                                     |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 7     | Distância entre o dropdown e a lista de opções aberta                                                                                                    |
| 8     | Entre o valor do campo do login e a linha abaixo dele                                                                                                    |
| 12    | Margem interna esquerda do texto no dropdown e no card de trimestre do boletim                                                                           |
| 16    | Margem lateral das telas do boletim e da seleção; espaço entre cards; margens da barra de ações; margem interna do card de aluno e do dropdown da agenda |
| 24    | Margem lateral do dropdown da agenda                                                                                                                     |
| 25    | Entre o rótulo do campo do login e o valor                                                                                                               |
| 48    | Margem lateral dos campos do login                                                                                                                       |

### Raios, bordas e tamanhos fixos

| Item                                    | Valor                                    |
| --------------------------------------- | ---------------------------------------- |
| Raio de dropdown, lista e cards         | 8                                        |
| Borda do card de aluno selecionado      | 1, cor destaque                          |
| Linha dos campos do login               | 1                                        |
| Marcador da aula                        | 6 x 6, círculo, borda 1                  |
| Barra de ações (topo)                   | altura 48                                |
| Logo na barra de ações                  | 100 x 16                                 |
| Logo no login                           | 306 x 49                                 |
| Botão de login                          | altura 60, largura total, sem raio       |
| Campo do login (rótulo + valor + linha) | altura 96; margem lateral 48             |
| Dropdown fechado                        | altura 45                                |
| Card de trimestre e card de aluno       | altura 90                                |
| Linha da lista de opções do dropdown    | altura 36 (topo a topo)                  |
| Linha da disciplina fechada do boletim  | altura 37 (topo a topo)                  |
| Linha da aula                           | altura 59 (topo a topo)                  |
| Rodapé (abas)                           | altura 64                                |
| Ícones                                  | 24 (abas, fechar), 14 (setas), 10 (sair) |
| Imagem "sem aulas"                      | 328 x 208                                |

## Critérios de aceite

- **CA-01:** **Dado** o tema global, **Quando** suas cores são lidas, **Então** contêm exatamente os valores da tabela "Cores", e nenhum outro.
- **CA-02:** **Dado** o tema global, **Quando** um estilo de texto da tabela "Tipografia" é lido, **Então** ele usa a fonte Montserrat no peso indicado, com o tamanho, a altura de linha e o espaçamento entre letras 0 da tabela.
- **CA-03:** **Dado** o app rodando em iOS e em Android, **Quando** um texto usa qualquer estilo do tema, **Então** é renderizado com o arquivo Montserrat do peso correspondente, sem negrito sintetizado pelo sistema e sem padding extra de fonte no Android.
- **CA-04:** **Dado** o tema global, **Quando** espaçamentos, raios, bordas e tamanhos fixos são lidos, **Então** correspondem às tabelas "Espaçamentos observados" e "Raios, bordas e tamanhos fixos".
- **CA-05:** **Dado** o app iniciado, **Quando** qualquer tela é exibida, **Então** o tema está disponível para ela e o fundo padrão é `#000000`.
- **CA-06:** **Dado** o repositório, **Quando** os arquivos de fonte são inspecionados, **Então** existem apenas os quatro pesos usados, com o arquivo de licença OFL ao lado.

## Estados da interface

Não se aplica: esta spec não cria telas. Os estados de cada tela são definidos nas specs das features.

## Regras de negócio e validações

- Nenhum valor visual (cor, tamanho de fonte, medida) é escrito direto numa tela; tudo vem do tema.
- Os valores do tema são os medidos no Figma, sem arredondar para uma grade (4/8).
- Só os pesos da fonte usados no Figma entram no app.
- A fonte é registrada nos projetos nativos (`ios/` e `android/`), com autorização explícita da responsável em 2026-10-23.
- Os valores do tema são os do Figma em 414 de largura, sem escala proporcional. Larguras que dependem da tela (cards, dropdowns, botão) são derivadas da largura disponível menos as margens do tema, e não fixas em pixels.
- Desalinhamentos do Figma são normalizados para o valor dominante: aulas começam em 40 (o Figma tem 40, 43 e 46); o texto do card de aluno começa em 32 nas duas linhas (o Figma tem 29 na segunda linha de um card). As margens de 24 (agenda) e 16 (boletim e seleção) são mantidas, porque cada tela é consistente consigo mesma.

## Fora do escopo

- Componentes visuais globais além dos primitivos `Box` e `Text` (tela base, ícone, logo, botão, campo de texto, dropdown, card e botão de texto): ficam na spec `003-shared-components`, em `src/shared/components/`.
- Componentes de uma única feature (cabeçalho, barra de ações, abas, item de aula, accordion do boletim): ficam nas specs das telas.
- Assets de imagem e ícones (logo, "sem aulas", SVGs): entram com as telas que os usam.
- Animações.
- Tema claro.
- Splash screen.

## Verificação pendente

Conferir no iOS e no Android que os 4 pesos da Montserrat aparecem distintos e iguais ao Figma, sem negrito sintetizado e sem padding extra no Android (CA-03).

## Perguntas em aberto

Nenhuma.
