# Spec 003: Componentes globais

- **Status:** Concluída
- **Autor:** Ana Carla Paiva (com Claude Code)
- **Aprovado por:** Ana Carla Paiva (2026-10-24)
- **Data:** 2026-10-24

## Problema

As telas do Figma (`wxBenyfshI65ffp1cYMuW4`) repetem os mesmos elementos visuais: tela preta, ícones, logo, botão de ação, campo sublinhado, dropdown, card e botão de texto com ícone. Hoje só existem `Box` e `Text` ([spec 001](../001-design-system/spec.md)). Sem componentes globais, cada feature reconstruiria esses elementos, com risco de divergência visual entre telas e com o Figma.

## Objetivo

Existir em `src/shared/components/` um conjunto de componentes genéricos, controlados só por props e sem regra de negócio, que reproduzem os elementos repetidos do Figma com fidelidade de pixel e animação fluida. Sucesso: as specs das telas montam login, agenda, boletim e seleção de aluno só com esses componentes, `Box` e `Text`, mais os componentes próprios de cada feature.

## Usuários

| Perfil                               | Necessidade principal                                                  |
| ------------------------------------ | ---------------------------------------------------------------------- |
| Pessoa desenvolvedora / agente de IA | Montar telas fiéis ao Figma sem refazer elementos repetidos            |
| Responsável (usuário final)          | Interagir com botões, campos e listas consistentes, legíveis e fluidos |

## Critério de componente global

Vai para `src/shared/components/` o elemento genérico, controlado só por props, que não conhece domínio (responsável, aluno, aula, nota). `Button` e `TextField` entram mesmo usados só no login, por serem peças básicas de design system (decisão da responsável em 2026-10-24).

Ficam nas features: cabeçalho, barra de ações, abas do rodapé, item de aula, estado "sem aulas" e accordion do boletim.

## Componentes

### Screen

- Fundo `background` em toda a tela, inclusive atrás da barra de status e do indicador de início.
- Aplica a área segura nas bordas escolhidas (`edges`); padrão: topo e base.
- Não rola. Cada tela decide sua rolagem.

### Icon

Ícones do Figma, desenhados como vetor, com cor e tamanho vindos do tema:

| Nome        | Origem no Figma                    | Proporção  | Uso                             |
| ----------- | ---------------------------------- | ---------- | ------------------------------- |
| `arrow`     | seta para baixo (dropdowns, cards) | 14 x 14    | Dropdown, trimestre, disciplina |
| `calendar`  | aba Agenda                         | 21,43 x 24 | Rodapé                          |
| `checkFile` | aba Boletim                        | 24 x 24    | Rodapé                          |
| `close`     | "FECHAR"                           | 24 x 24    | Seleção de aluno                |
| `logout`    | "SAIR"                             | 10 x 10    | Barra de ações                  |

- O Figma tem três versões da seta com larguras de 13,96, 14 e 14,61; a de 14 x 14 é a usada.
- O ícone nunca é esticado: o tamanho define a altura, e a largura segue a proporção do desenho.

### Logo

- Imagem do logo FIAP em dois tamanhos: grande (306 x 49, login) e pequeno (100 x 16, barra de ações).
- Sem distorção: a proporção do arquivo é mantida.

### Button

- Largura total, altura 60, fundo `accent`, sem raio, rótulo `button` centralizado.
- Estados:

| Estado       | Rótulo                                                                   | Toque          |
| ------------ | ------------------------------------------------------------------------ | -------------- |
| Desabilitado | visível, cor `textDisabled`                                              | ignorado       |
| Habilitado   | visível, cor `textOnAccent`                                              | dispara a ação |
| Carregando   | oculto; indicador de atividade pequeno, cor `textOnAccent`, centralizado | ignorado       |

- A altura não muda entre os estados.
- Ao ser pressionado (habilitado), o fundo fica com opacidade reduzida, com transição animada.
- Opção de estender o fundo pela área segura inferior: o rótulo continua nos 60 de altura, acima do indicador de início, e o fundo `accent` vai até a borda física da tela.
- Acessibilidade: papel de botão, estados "desabilitado" e "ocupado".

### TextField

- Rótulo centralizado (`inputLabel`), valor centralizado (`inputValue`) e linha de 1 abaixo do valor; margem lateral 48 vem do layout da tela.
- Linha `inputLine` com o campo vazio e `inputLineFilled` com o campo preenchido; a troca de cor é animada.
- Modo seguro (senha): exibe um `*` por caractere digitado, na fonte do valor, em vez das bolinhas do sistema. O teclado não sugere, não corrige e não oferece salvar o valor. Com o campo focado, um cursor é desenhado ao fim dos asteriscos.
- Tipo de teclado configurável (numérico para CPF e senha).
- Não formata o valor: máscaras (como a do CPF) são aplicadas por quem usa o campo.
- Acessibilidade: o rótulo do campo é o rótulo acessível; no modo seguro, o valor não é lido.

### TextButton

- Texto pressionável com ícone opcional à direita do texto, a 8 do texto.
- Dois tons:

| Tom       | Texto                    | Ícone             | Uso no Figma            |
| --------- | ------------------------ | ----------------- | ----------------------- |
| `default` | `caption`, `textPrimary` | 10, `textPrimary` | "TROCAR PERFIL", "SAIR" |
| `accent`  | `bodyBold`, `accent`     | 24, `accent`      | "FECHAR"                |

- Ao ser pressionado, opacidade reduzida com transição animada.
- Acessibilidade: papel de botão, rótulo igual ao texto.

### Card

- Fundo `card`, raio 8, altura 90, largura vinda do layout; o conteúdo é livre (definido por quem usa).
- Pressionável quando recebe uma ação; ao ser pressionado, opacidade reduzida com transição animada.
- Estado selecionado: borda de 1 na cor `accent`. Sem seleção: sem borda visível, e o conteúdo não se desloca entre os dois estados.
- Acessibilidade: papel de botão quando pressionável; estado "selecionado".

### Dropdown

- Campo fechado: fundo `surface`, raio 8, altura 45, texto `body` à esquerda, seta `arrow` 14 `accent` à direita, a 12 da borda. Margem interna esquerda configurável entre 16 (agenda) e 12 (boletim).
- Ao tocar no campo, a lista de opções abre 7 abaixo dele: fundo `surface`, raio 8, margens internas superior e inferior de 16, uma opção `body` a cada 36. A lista fica por cima do conteúdo abaixo, sem deslocá-lo.
- Aberto, a seta gira 180°. A abertura, o fechamento e a rotação são animados.
- Escolher uma opção fecha a lista e informa a opção escolhida a quem usa o componente.
- Tocar fora da lista aberta fecha a lista sem mudar o valor.
- A opção selecionada não tem destaque na lista.
- Lista vazia: o campo não abre.
- Acessibilidade: papel de botão no campo, estado "expandido"; cada opção com papel de botão.

## Valores fora do Figma

O Figma não define animação nem feedback de toque. Os valores abaixo são decisões desta spec e entram no tema ao lado dos tokens da spec 001:

| Valor                                               | Decisão |
| --------------------------------------------------- | ------- |
| Opacidade do componente pressionado                 | 0,8     |
| Duração das transições curtas (toque, cor da linha) | 150 ms  |
| Duração de abrir/fechar dropdown e girar seta       | 200 ms  |
| Intervalo de piscar do cursor do campo seguro       | 500 ms  |

## Fluxos

### Fluxo principal

1. Uma tela precisa de um elemento repetido do Figma.
2. Ela usa o componente global, passando conteúdo e estado por props.
3. O componente renderiza com os tokens do tema e anima suas transições.

### Fluxos alternativos

- O elemento só existe numa feature e conhece domínio: ele é criado dentro da feature, compondo os componentes globais.
- Um componente global precisa de um valor visual que não está no tema: o tema é atualizado antes (spec 001, ou esta spec para valores fora do Figma).

## Critérios de aceite

- **CA-01:** **Dado** um `Screen`, **Quando** renderizado, **Então** o fundo é `#000000` e a área segura é aplicada só nas bordas pedidas (padrão topo e base).
- **CA-02:** **Dado** um `Icon` com nome, cor do tema e tamanho, **Quando** renderizado, **Então** desenha o vetor do Figma correspondente na cor pedida, com altura igual ao tamanho e largura proporcional ao desenho.
- **CA-03:** **Dado** um `Logo` grande ou pequeno, **Quando** renderizado, **Então** ocupa 306 x 49 ou 100 x 16, sem distorção.
- **CA-04:** **Dado** um `Button` desabilitado, **Quando** tocado, **Então** a ação não é chamada e o rótulo usa `#777777`.
- **CA-05:** **Dado** um `Button` habilitado, **Quando** tocado, **Então** a ação é chamada uma vez e o rótulo usa `#000000`.
- **CA-06:** **Dado** um `Button` carregando, **Quando** renderizado e tocado, **Então** o rótulo não aparece, um indicador de atividade `#000000` aparece, a altura continua 60 e a ação não é chamada.
- **CA-07:** **Dado** um `Button` que estende o fundo pela área segura inferior, **Quando** há indicador de início, **Então** o fundo `accent` cobre o inset inferior e a área do rótulo continua com 60.
- **CA-08:** **Dado** um `TextField` vazio, **Quando** renderizado, **Então** mostra o rótulo e a linha `#525252`; **quando** recebe um valor, **Então** a linha passa a `#FFFFFF`.
- **CA-09:** **Dado** um `TextField` seguro com valor de N caracteres, **Quando** renderizado, **Então** exibe exatamente N `*` na fonte do valor e o valor real não aparece na tela nem para a acessibilidade.
- **CA-10:** **Dado** um `TextField`, **Quando** o usuário digita, **Então** o texto digitado é entregue a quem usa o campo, sem formatação.
- **CA-11:** **Dado** um `TextButton` no tom `default` ou `accent`, **Quando** renderizado, **Então** usa o estilo de texto, a cor e o tamanho de ícone da tabela; **quando** tocado, **Então** a ação é chamada.
- **CA-12:** **Dado** um `Card` selecionado, **Quando** renderizado, **Então** tem borda de 1 `#29F4D5`; não selecionado, sem borda visível e com o conteúdo na mesma posição.
- **CA-13:** **Dado** um `Card` com ação, **Quando** tocado, **Então** a ação é chamada; sem ação, **Então** não é pressionável.
- **CA-14:** **Dado** um `Dropdown` fechado com opções, **Quando** o campo é tocado, **Então** a lista abre com as opções na ordem recebida e o estado acessível passa a "expandido".
- **CA-15:** **Dado** um `Dropdown` aberto, **Quando** uma opção é tocada, **Então** quem usa o componente recebe a opção e a lista fecha.
- **CA-16:** **Dado** um `Dropdown` sem opções, **Quando** o campo é tocado, **Então** a lista não abre.
- **CA-17:** **Dado** qualquer componente pressionável, **Quando** pressionado, **Então** a opacidade vai a 0,8 com transição animada e volta ao soltar.
- **CA-18:** **Dado** um `Dropdown` aberto, **Quando** o usuário toca fora da lista, **Então** a lista fecha e quem usa o componente não recebe nenhuma opção.

## Estados da interface

Não se aplica como tela: os estados de cada componente (desabilitado, carregando, vazio, preenchido, selecionado, aberto) estão descritos em "Componentes". Estados de tela (carregando dados, erro, sem conexão) ficam nas specs das features.

## Regras de negócio e validações

- Componentes globais não conhecem domínio, não leem estado global e não chamam API.
- Todo valor visual vem do tema; valores fora do Figma vêm da tabela "Valores fora do Figma".
- Ícones e logo vêm dos arquivos exportados do Figma, sem redesenho.
- Textos de interface ("FAZER LOGIN", "SAIR", etc.) não ficam nos componentes: são passados por quem usa.

## Fora do escopo

- Montar telas (login, agenda, boletim, seleção de aluno) e componentes de feature.
- Máscara de CPF e validação de login: ficam na spec de autenticação.
- Navegação e abas do rodapé.
- Imagem "sem aulas": entra com a spec da agenda.
- Tema claro e variantes de botão que não existem no Figma.

## Verificação pendente

Conferir no iOS e no Android que medidas, cores e animações dos componentes batem com o Figma.

## Perguntas em aberto

Nenhuma. O comportamento do dropdown aberto e as medidas de 8 (texto–ícone), 12 (seta do dropdown) e 16 (margem inferior da lista) foram propostos sem nova conferência no Figma (cota do MCP esgotada) e aceitos pela responsável em 2026-10-24.
