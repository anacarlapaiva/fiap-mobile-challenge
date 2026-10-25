# Spec 008: Boletim

- **Status:** Concluída
- **Autor:** Ana Carla Paiva
- **Aprovado por:** Ana Carla Paiva (2026-10-24)
- **Data:** 2026-10-24

## O quê

A aba BOLETIM mostra o boletim do aluno da sessão, um ano por vez, a partir do documento do responsável (mesmo contrato do JSON da FIAP, via Firestore — spec 011). Título e dropdown de ano ficam visíveis. Cada trimestre é um card; as disciplinas abrem abaixo dele.

## Critérios de aceite

- **CA-01:** **Dado** o Rafael com sessão, **Quando** a aba BOLETIM abre, **Então** aparecem "BOLETIM", o dropdown em `7EF - 2025` e os cards fechados `1º TRIMESTRE`, `2º TRIMESTRE` e `3º TRIMESTRE`, sem nome de disciplina e sem Empty.
- **CA-02:** **Dado** o dropdown do Rafael, **Quando** aberto, **Então** lista, nesta ordem: `7EF - 2025`; `6EF - 2024`. A lista fica 7 abaixo do campo, na mesma largura, por cima do conteúdo.
- **CA-03:** **Dado** o ano `2025` do Rafael, **Quando** o `1º TRIMESTRE` abre, **Então** os outros trimestres ficam fechados e as disciplinas aparecem fechadas, nesta ordem: LÍNGUA PORTUGUESA; PRODUÇÃO E INTERPRETAÇÃO DE TEXTOS; MATEMÁTICA I; MATEMÁTICA II; GEOGRAFIA; HISTÓRIA; CIÊNCIAS; LÍNGUA INGLESA; ARTE; PROJETO; CODING; EDUCAÇÃO FÍSICA.
- **CA-04:** **Dado** o `1º TRIMESTRE` de 2025 aberto, **Quando** LÍNGUA PORTUGUESA e MATEMÁTICA I abrem, **Então** as duas mostram nota e faltas ao mesmo tempo: `9.5` e `0`; `7.5` e `2`. **Quando** LÍNGUA PORTUGUESA fecha, **Então** MATEMÁTICA I continua aberta.
- **CA-05:** **Dado** o `1º TRIMESTRE` aberto com disciplina aberta, **Quando** o `2º TRIMESTRE` abre, **Então** o 1º fecha, as disciplinas dele somem e o 2º lista só os nomes. **Quando** LÍNGUA PORTUGUESA desse 2º abre, **Então** nota e faltas são `-`.
- **CA-06:** **Dado** um trimestre aberto, **Quando** o card dele é tocado de novo, **Então** fecha, a altura volta a 90 e nenhuma disciplina permanece visível.
- **CA-07:** **Dado** o `1º TRIMESTRE` de `7EF - 2025` aberto, **Quando** `7EF - 2025` é escolhido de novo, **Então** o trimestre continua aberto. **Quando** `6EF - 2024` é escolhido, **Então** o dropdown mostra esse ano e os três cards nascem fechados.
- **CA-08:** **Dado** `7EF - 2025` com o `1º TRIMESTRE` e LÍNGUA PORTUGUESA abertos, **Quando** a pessoa vai à AGENDA e volta ao BOLETIM, **Então** o dropdown, o trimestre e a nota `9.5` permanecem.
- **CA-09:** **Dado** o campo do dropdown, **Quando** renderizado, **Então** tem altura 45, raio 8 e margem lateral 16. Cada opção tem altura 36. O card de trimestre tem altura 90. A disciplina fechada tem altura 37. O espaço entre cards é 16.
- **CA-10:** **Dado** o `3º TRIMESTRE` colado no rodapé, **Quando** abre, **Então** o título e o dropdown permanecem visíveis e a lista rola o mínimo para o topo desse card encostar no topo da área rolável, acima da tab bar.
- **CA-11:** **Dado** uma disciplina cuja nota ficaria sob a tab bar, **Quando** abre, **Então** a lista rola só o bastante para nota e faltas ficarem acima da tab bar. Se o bloco for mais alto que a área rolável, o topo do que abriu fica visível.
- **CA-12:** **Dado** os cards fechados, **Quando** a lista é rolada até o fim, **Então** ela para 16 abaixo do último card. **Dado** um trimestre aberto, **Quando** a lista é rolada até o fim, **Então** o espaço abaixo do conteúdo é só o necessário para o topo desse trimestre encostar no topo da área rolável (no mínimo 16).
- **CA-13:** **Dado** um aluno com `boletim` vazio ou ausente no JSON, **Quando** a aba BOLETIM abre, **Então** aparecem "BOLETIM" e o Empty com "Nenhum boletim disponível.", sem dropdown.

## Regras

- Fonte: `boletim` do aluno da sessão no documento do responsável. Sem spinner.
- Ano inicial: primeiro item da lista. Ano, trimestre aberto e disciplinas abertas vivem na tela, não na sessão. Sair volta ao primeiro ano, com os cards fechados.
- Rótulo do ano: `turma - ano` (`7EF - 2025`). Rótulo do trimestre: `nº TRIMESTRE`. Nome da disciplina em maiúsculas pt-BR (`Língua Portuguesa` → `LÍNGUA PORTUGUESA`).
- Nota com uma casa decimal (`8` → `8.0`, `9.5` → `9.5`, `10` → `10.0`). Falta inteira. `null` de nota ou falta vira `-`. Empty não substitui nota nem falta.
- Ordem de ano, trimestre e disciplina: a do JSON.
- Um trimestre aberto por vez. Várias disciplinas podem ficar abertas. Fechar o trimestre, abrir outro ou trocar de ano apaga as disciplinas abertas. Reabrir o trimestre mostra só os nomes.
- Na entrada da aba nada anima. Abrir ou fechar anima a altura do miolo e gira a seta 180°, na duração medium do tema. Sem fade por linha.
- Título e dropdown ficam fora da lista.

## Fora do escopo

- Agenda, escolha de aluno, persistir o ano no disco, editar nota, alterar o cabeçalho.
