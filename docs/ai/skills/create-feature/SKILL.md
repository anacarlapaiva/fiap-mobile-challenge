---
name: create-feature
description: Cria a estrutura de pastas e a API pública (index.ts) de uma feature nova em src/features/, seguindo a anatomia padrão do projeto. Use quando uma spec aprovada exigir um domínio novo, antes de implementar telas ou lógica.
---

# Criar feature

## Objetivo

Criar `src/features/<nome>/` com a anatomia padrão e o `index.ts` como API pública, sem implementar funcionalidade.

## Entradas esperadas

- Nome da feature.
- Opcional: caminho do `plan.md` que define as subpastas necessárias.

## Passos

1. Leia `AGENTS.md` (raiz do repositório) e a seção "Anatomia de uma feature" de `docs/estrutura-de-pastas.md`.
2. Normalize o nome para inglês, em `kebab-case`, singular ou plural conforme o domínio (`profile`, `user-settings`). Confirme o nome com o usuário se ele não foi dado nesse formato.
3. Verifique se `src/features/<nome>/` já existe. Se existir, **pare** e informe o usuário.
4. Defina as subpastas a criar:
   - com `plan.md`: só as subpastas previstas na seção "Estrutura de arquivos";
   - sem `plan.md`: pergunte ao usuário quais das subpastas padrão (`screens/`, `components/`, `hooks/`, `data/`, `session/`, `validation/`) são necessárias.
5. Crie as subpastas escolhidas. Pastas vazias não são versionadas pelo git; deixe a pasta vazia e inclua o primeiro arquivo nela na tarefa que for usá-la, sem criar arquivos de exemplo.
6. Crie `src/features/<nome>/types.ts` contendo só `export {};`, sem comentários (proibição 7 do `AGENTS.md`).
7. Crie `src/features/<nome>/index.ts` contendo só `export {};`. Outras camadas só podem importar a feature por este arquivo (`@/features/<nome>`).
8. Rode `yarn validate` e corrija o que falhar.
9. Se a feature for um domínio novo, acrescente o nome dela em `docs/estrutura-de-pastas.md` na lista de `features/`. Não inventarie arquivos.
10. Informe ao usuário os arquivos criados.

## Critérios de conclusão

- `src/features/<nome>/index.ts` e `types.ts` existem.
- Só as subpastas necessárias foram criadas.
- `yarn validate` passa.

## Em caso de dúvida

Pergunte ao usuário. Não crie telas, componentes, hooks ou código de exemplo: isso pertence às tarefas da spec.
