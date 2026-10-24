# Specs

Pasta `docs/specs/NNN-nome/`. O contrato permanente é `spec.md`: o quê, critérios de aceite, fora do escopo. `plan.md` e `tasks.md` só existem durante a implementação.

## Spec nova

1. Próximo `NNN` de três dígitos. Números não se reaproveitam.
2. Nome curto em inglês, `kebab-case`: `007-aulas`.
3. `spec.md` com status, o quê, CAs e fora do escopo. Sem seção vazia.
4. `Status: Rascunho` até a aprovação.

Com um agente: [spec](../ai/flows/spec.md), [plano](../ai/flows/plano.md), [tarefas](../ai/flows/tarefas.md).

## Regras

- Uma spec, uma fatia de produto (o que a pessoa vê). Lib vira ADR. Componente vira teste ao lado do código.
- Critérios em Dado/Quando/Então (`CA-01`…). Cada um vira no máximo um teste, no arquivo que decide.
- Spec aprovada só muda com nova aprovação.
- Spec `Concluída`: apague `plan.md` e `tasks.md`.
