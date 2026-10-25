# Spec 007: Agenda

- **Status:** Concluída
- **Autor:** Ana Carla Paiva
- **Aprovado por:** Ana Carla Paiva (2026-10-24)
- **Data:** 2026-10-24

## O quê

A aba AGENDA mostra as aulas do aluno da sessão, um dia por vez, a partir do JSON. Título e dropdown de dia ficam visíveis; sem aulas no dia, o Empty ocupa só a lista.

## Critérios de aceite

- **CA-01:** **Dado** o Rafael com sessão, **Quando** a aba AGENDA abre, **Então** aparecem "AGENDA", o dropdown em `16 de março, domingo` (`2025-03-16`) e o Empty com "Sem aulas neste dia".
- **CA-02:** **Dado** o dropdown do Rafael, **Quando** aberto, **Então** lista, nesta ordem: `16 de março, domingo`; `17 de março, segunda-feira`; `18 de março, terça-feira`; `19 de março, quarta-feira`; `20 de março, quinta-feira`; `21 de março, sexta-feira`; `22 de março, sábado`. A lista fica 7 abaixo do campo, na mesma largura, por cima do conteúdo.
- **CA-03:** **Dado** o dia `2025-03-17` do Rafael, **Quando** selecionado, **Então** o Empty some e as linhas são, nesta ordem: `07:15 - 08:00` Matemática I; `08:00 - 08:45` Língua Inglesa; `09:15 - 10:00` Língua Inglesa; `10:00 - 10:45` Ciências; `10:45 - 11:30` Ciências; `11:30 - 12:15` Coding.
- **CA-04:** **Dado** `2025-03-16` ou `2025-03-22` (`aulas: []`), **Quando** selecionado, **Então** o Empty mostra "Sem aulas neste dia" e o dropdown permanece.
- **CA-05:** **Dado** o dia `2025-03-17` selecionado, **Quando** a pessoa vai ao BOLETIM e volta à AGENDA, **Então** o dropdown continua nesse dia e a lista desse dia permanece.
- **CA-06:** **Dado** o campo do dropdown, **Quando** renderizado, **Então** tem altura 45, raio 8, margem lateral 24, e cada opção da lista tem altura 36.
- **CA-07:** **Dado** uma linha de aula, **Quando** renderizada, **Então** tem altura 59, marcador 6×6, o `horario` do JSON em legenda e a `disciplina` em corpo seminegrito abaixo.
- **CA-08:** **Dado** um aluno com `agenda` vazia ou ausente no JSON, **Quando** a aba AGENDA abre, **Então** aparecem "AGENDA" e o Empty com "Nenhuma aula cadastrada.", sem dropdown.

## Regras

- Fonte: `agenda` do aluno da sessão no JSON. Sem HTTP. Sem spinner de agenda.
- Dia inicial: primeiro `dia` da lista. Dia escolhido vive na tela, não na sessão; Sair volta ao primeiro dia.
- Rótulo: `d de mês, weekday` em pt-BR, sem ano, a partir do ISO (`2025-03-16` → `16 de março, domingo`).
- Empty só substitui a lista. Cabeçalho não muda.
- Cada objeto em `aulas` é uma linha, na ordem do JSON, mesmo com disciplina repetida.

## Fora do escopo

- Boletim, escolha de aluno, persistir o dia no disco, alterar o cabeçalho, Firebase/API.
