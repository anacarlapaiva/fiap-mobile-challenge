# Fluxo: implementar uma tarefa

## Objetivo

Implementar **uma única** tarefa de `docs/specs/NNN-nome/tasks.md`, com testes, validação e documentação atualizada, e marcá-la como concluída.

## Entradas esperadas

- Caminho de `tasks.md` (ou o identificador `NNN`) e, opcionalmente, o identificador da tarefa (`T03`). Sem tarefa indicada, use a primeira ainda desmarcada.

## Passos

1. Leia `AGENTS.md` (raiz do repositório), incluindo as seções "Definição de pronto", "Documentação viva" e "Proibições".
2. Leia `spec.md`, `plan.md` e `tasks.md` da pasta da spec. Confirme que a spec está `Aprovada` e o plano `Aprovado`; caso contrário, **pare** e informe o usuário.
3. Identifique a tarefa. Confirme que todas as tarefas anteriores estão marcadas `[x]`; se não estiverem, pergunte ao usuário antes de seguir.
4. Leia `docs/arquitetura.md`, `docs/convencoes.md` e o `AGENTS.md` local das pastas que vai editar, se existir.
5. Leia os arquivos de código listados na tarefa e os vizinhos deles, para seguir os padrões existentes.
6. Escreva os testes primeiro, derivados dos critérios de aceite da tarefa: cada `CA-xx` vira pelo menos um caso de teste em `X.test.tsx`, ao lado do arquivo testado. Cubra também os estados de erro, vazio e carregamento descritos na spec.
7. Implemente o mínimo necessário para os testes passarem, dentro do escopo da tarefa. Não implemente partes de outras tarefas.
8. Rode `yarn validate`. Corrija **todos** os erros e warnings. Repita até passar. Não altere a configuração de lint, de TypeScript ou de testes para fazer passar; respeite as "Proibições" de `AGENTS.md`.
9. Atualize a documentação:
   - os arquivos listados em "Documentação" da tarefa;
   - qualquer outro documento de `docs/` (ou `AGENTS.md`) que tenha ficado desatualizado pela mudança.
10. Marque a tarefa como `[x]` em `tasks.md`. Se for a primeira tarefa concluída, altere o status da spec para `Em implementação`; se for a última, para `Concluída`.
11. Apresente ao usuário: arquivos alterados, resultado de `yarn validate` e a mensagem de commit sugerida na tarefa.

## Critérios de conclusão

- A tarefa atende aos critérios de aceite indicados e tem testes para eles.
- `yarn validate` passa sem erros e sem warnings.
- Documentação atualizada.
- Tarefa marcada `[x]` em `tasks.md`.

## Em caso de dúvida

- Requisito ambíguo ou em conflito com o código: **pare e pergunte**. Não invente comportamento.
- A tarefa exige algo fora do plano (dependência nova, mudança de arquitetura, alteração em `android/` ou `ios/`): pare e proponha a atualização do `plan.md`. Se for decisão arquitetural, proponha também um ADR (`docs/ai/skills/record-adr/SKILL.md`).
- `yarn validate` falha por motivo fora do escopo da tarefa: informe o usuário com a saída do erro, em vez de contornar.
