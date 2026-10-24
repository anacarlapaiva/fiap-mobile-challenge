# Tarefas NNN: Nome da feature

- **Spec:** [spec.md](spec.md)
- **Plano:** [plan.md](plan.md)

Regras:

- Cada tarefa cabe em um commit e deixa `yarn validate` passando.
- Implemente uma tarefa por vez, na ordem, e marque `[x]` só quando ela atender à definição de pronto de [AGENTS.md](../../../AGENTS.md#definição-de-pronto).
- Cada tarefa indica os critérios de aceite que cobre, os arquivos que toca e como verificá-la.

## Tarefas

- [ ] **T01: Título curto no imperativo**

  - **Critérios de aceite:** CA-01
  - **Arquivos:** `src/features/<nome>/…`
  - **Verificação:** `yarn validate` passa (teste só se esta tarefa decidir algo ainda não coberto)
  - **Commit:** `feat(<nome>): …`

- [ ] **T02: …**
  - **Critérios de aceite:**
  - **Arquivos:**
  - **Verificação:**
  - **Commit:**
