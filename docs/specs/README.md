# Specs

Cada feature tem uma pasta própria com três artefatos, criados nesta ordem. Cada um só começa depois que o anterior é aprovado (veja [fluxo-sdd.md](../fluxo-sdd.md)).

```
docs/specs/NNN-nome-da-feature/
├── spec.md    # o quê e por quê
├── plan.md    # como
└── tasks.md   # checklist de implementação
```

## Como criar uma spec nova

1. Liste as pastas existentes em `docs/specs/` e pegue o maior `NNN`. A nova pasta usa o próximo número com três dígitos (`001`, `002`…). Números nunca são reaproveitados.
2. Escolha um nome em inglês, em `kebab-case`, descritivo e curto: `001-email-login`.
3. Crie a pasta e copie [\_templates/spec.md](_templates/spec.md) para `spec.md`.
4. Preencha todas as seções. Seção sem conteúdo recebe "Não se aplica", com o motivo.
5. Deixe `Status: Rascunho` até a aprovação.
6. Depois da aprovação, gere `plan.md` a partir de [\_templates/plan.md](_templates/plan.md) e, aprovado o plano, `tasks.md` a partir de [\_templates/tasks.md](_templates/tasks.md).

Com um agente de IA, siga os fluxos [spec](../ai/flows/spec.md), [plano](../ai/flows/plano.md) e [tarefas](../ai/flows/tarefas.md).

## Regras

- Uma spec descreve uma feature, ou uma evolução coesa de uma feature.
- Os critérios de aceite usam o formato Dado/Quando/Então e são numerados (`CA-01`, `CA-02`…), para serem referenciados em `tasks.md` e nos testes.
- Spec aprovada só muda com nova aprovação.
