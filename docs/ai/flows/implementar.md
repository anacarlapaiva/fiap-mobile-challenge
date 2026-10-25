# Fluxo: implementar uma tarefa

## Objetivo

Implementar **uma única** tarefa de `docs/specs/NNN-nome/tasks.md`, com testes e validação, e marcá-la como concluída.

## Entradas esperadas

- Caminho de `tasks.md` (ou o identificador `NNN`) e, opcionalmente, o identificador da tarefa (`T03`). Sem tarefa indicada, use a primeira ainda desmarcada.

## Passos

1. Leia `AGENTS.md` (raiz do repositório), incluindo as seções "Definição de pronto", "Documentação" e "Proibições".
2. Leia `spec.md`, `plan.md` e `tasks.md` da pasta da spec. Confirme que a spec está `Aprovada` ou `Em implementação` e o plano `Aprovado`; caso contrário, **pare** e informe o usuário.
3. Identifique a tarefa. Confirme que todas as tarefas anteriores estão marcadas `[x]`; se não estiverem, pergunte ao usuário antes de seguir.
4. Leia `docs/arquitetura.md`, `docs/convencoes.md` e o `AGENTS.md` local das pastas que vai editar, se existir.
5. Leia os arquivos de código listados na tarefa e os vizinhos deles, para seguir os padrões existentes.
6. Teste primeiro, e só no arquivo que decide o comportamento desta tarefa. Se a decisão já tem caso no dono, não crie outro. DTO, barrel, tema e encaminhamento não levam teste. Veja [docs/convencoes.md](../../convencoes.md#testes).
7. Implemente o mínimo necessário para os testes passarem, dentro do escopo da tarefa. Não implemente partes de outras tarefas.
8. Rode `yarn validate`. Corrija **todos** os erros e warnings. Repita até passar. Não altere a configuração de lint, de TypeScript ou de testes para fazer passar; respeite as "Proibições" de `AGENTS.md`.
9. Atualize `docs/` **somente** se a tarefa mudou arquitetura, convenção, ADR ou critério de aceite da spec em andamento. Não crie markdown novo e não reescreva árvore, plano ou spec por arquivo novo ou rename.
10. Marque a tarefa como `[x]` em `tasks.md`. Se for a primeira concluída, o status da spec passa a `Em implementação`. Se for a última, o status passa a `Concluída` e apague `plan.md` e `tasks.md`.
11. Apresente ao usuário: arquivos alterados, resultado de `yarn validate` e a mensagem de commit sugerida na tarefa.

## Critérios de conclusão

- A tarefa atende aos critérios de aceite. Há teste só onde esta tarefa introduziu uma decisão ainda não coberta.
- `yarn validate` passa sem erros e sem warnings.
- Tarefa marcada `[x]` em `tasks.md`, ou spec `Concluída` sem `plan.md`/`tasks.md`.

## Em caso de dúvida

- Requisito ambíguo ou em conflito com o código: **pare e pergunte**. Não invente comportamento.
- A tarefa exige dependência estrutural nova ou mudança de arquitetura: pare e proponha um ADR (`docs/ai/skills/record-adr/SKILL.md`). Outra dependência de runtime entra no `plan.md` da spec em implementação.
- `yarn validate` falha por motivo fora do escopo da tarefa: informe o usuário com a saída do erro, em vez de contornar.
