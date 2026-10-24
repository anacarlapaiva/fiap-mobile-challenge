# Fluxo: quebrar o plano em tarefas

## Objetivo

Gerar `docs/specs/NNN-nome/tasks.md` com uma checklist de tarefas pequenas, ordenadas e verificáveis, a partir de um plano aprovado.

## Entradas esperadas

- Caminho do plano (`docs/specs/NNN-nome/plan.md`) ou o identificador `NNN`.

## Passos

1. Leia `AGENTS.md` (raiz do repositório).
2. Leia `spec.md` e `plan.md` da pasta indicada. Se o `Status` do plano não for `Aprovado`, **pare** e informe o usuário.
3. Quebre o plano em tarefas seguindo estas regras:
   - cada tarefa cabe em um único commit e, ao final, deixa `yarn validate` passando;
   - cada tarefa toca poucos arquivos e tem um resultado observável;
   - teste novo só se a tarefa decidir algo que ainda não tem caso no arquivo dono;
   - a ordem respeita as dependências: primeiro a estrutura da feature (skill `docs/ai/skills/create-feature/SKILL.md`), depois tipos, `api`, `store`, `hooks`, `components`, `screens` e, por último, a integração em `src/app/`;
   - ADRs listados no plano viram tarefas anteriores às que dependem deles;
   - cada tarefa lista critérios de aceite cobertos, arquivos, forma de verificação e mensagem de commit no padrão de `docs/convencoes.md`.
4. Confira a cobertura: todo `CA-xx` da spec aparece em pelo menos uma tarefa. ADR listado no plano vira tarefa própria, antes das que dependem dele.
5. Crie `docs/specs/NNN-nome/tasks.md`. Cada item: título, CAs, arquivos, verificação, mensagem de commit. Tarefas desmarcadas (`- [ ]`).
6. Apresente a lista ao usuário e aplique os ajustes pedidos.

## Critérios de conclusão

- O arquivo `tasks.md` existe.
- Todos os critérios de aceite estão cobertos.
- Nenhuma tarefa depende de outra que vem depois dela.
- O usuário revisou a lista.

## Em caso de dúvida

Se uma parte do plano não puder ser quebrada em tarefas verificáveis, o plano está incompleto: aponte o trecho ao usuário e proponha a correção do `plan.md`. Não invente tarefas fora do plano.
