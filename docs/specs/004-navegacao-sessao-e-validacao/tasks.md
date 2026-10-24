# Tarefas 004: Navegação, sessão e validação

- **Spec:** [spec.md](spec.md)
- **Plano:** [plan.md](plan.md)

Regras:

- Cada tarefa cabe em um commit e deixa `yarn validate` passando.
- Implemente uma tarefa por vez, na ordem, e marque `[x]` só quando ela atender à definição de pronto de [AGENTS.md](../../../AGENTS.md#definição-de-pronto).
- Cada tarefa indica os critérios de aceite que cobre, os arquivos que toca e como verificá-la.

## Tarefas

- [x] **T01: Registrar navegação, Keychain e Zod**

  - **Critérios de aceite:** CA-01, CA-02, CA-03
  - **Arquivos:** `package.json`, `yarn.lock`, `ios/Podfile.lock`, `docs/adr/0005-navegacao-com-react-navigation.md`, `docs/adr/0006-sessao-no-keychain.md`, `docs/adr/0007-validar-com-zod.md`, `docs/README.md`, `docs/estrutura-de-pastas.md`, `AGENTS.md`
  - **Verificação:** as seis versões estão em `package.json`; `Podfile.lock` contém `RNScreens` e `RNKeychain`; `yarn validate` passa
  - **Documentação:** ADRs 0005 a 0007, `docs/README.md`, `docs/estrutura-de-pastas.md`, `AGENTS.md`
  - **Commit:** `chore: adiciona navegacao, keychain e zod`
