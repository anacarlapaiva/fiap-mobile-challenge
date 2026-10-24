# Specs

Cada feature tem uma pasta `docs/specs/NNN-nome/`. O artefato permanente é `spec.md` (o quê e por quê). `plan.md` e `tasks.md` existem só para conduzir a implementação e saem quando a spec fica `Concluída`.

```
docs/specs/NNN-nome-da-feature/
├── spec.md     # contrato (permanece)
├── plan.md     # como (só em implementação)
└── tasks.md    # checklist (só em implementação)
```

## Como criar uma spec nova

1. Liste as pastas em `docs/specs/` e use o próximo `NNN` com três dígitos. Números nunca são reaproveitados.
2. Nome em inglês, `kebab-case`, curto: `006-aulas`.
3. Copie [\_templates/spec.md](_templates/spec.md) para `spec.md`.
4. Preencha todas as seções. Seção sem conteúdo recebe "Não se aplica", com o motivo.
5. Deixe `Status: Rascunho` até a aprovação.
6. Depois da aprovação, gere `plan.md` e, aprovado o plano, `tasks.md`.

Com um agente, siga [spec](../ai/flows/spec.md), [plano](../ai/flows/plano.md) e [tarefas](../ai/flows/tarefas.md).

## Regras

- Uma spec descreve uma feature, ou uma evolução coesa.
- Critérios de aceite em Dado/Quando/Então, numerados (`CA-01`…). Cada um vira no máximo um teste, no arquivo que decide.
- Spec aprovada só muda com nova aprovação.
- Spec `Concluída`: apague `plan.md` e `tasks.md`. O código e o `spec.md` bastam.
