# Tarefas 001: Design system (tema global)

- **Spec:** [spec.md](spec.md)
- **Plano:** [plan.md](plan.md)

Regras:

- Cada tarefa cabe em um commit e deixa `yarn validate` passando.
- Implemente uma tarefa por vez, na ordem, e marque `[x]` só quando ela atender à definição de pronto de [AGENTS.md](../../../AGENTS.md#definição-de-pronto).
- Cada tarefa indica os critérios de aceite que cobre, os arquivos que toca e como verificá-la.

## Tarefas

- [x] **T01: Adicionar a Montserrat e registrá-la no iOS e no Android**

  - **Critérios de aceite:** CA-03 (registro nativo), CA-06
  - **Arquivos:** `src/assets/fonts/*`, `react-native.config.js`, `package.json`, `yarn.lock`, `ios/` e `android/` (gerados pelo `react-native-asset`)
  - **Verificação:** os 4 TTFs têm PostScript name igual ao nome do arquivo; `Info.plist` lista os 4 em `UIAppFonts`; `android/app/src/main/assets/fonts/` contém os 4; `yarn validate` passa
  - **Documentação:** `docs/estrutura-de-pastas.md`, `AGENTS.md` (stack e comando), `README.md`
  - **Commit:** `chore: adiciona a fonte montserrat e registra nos projetos nativos`

- [x] **T02: Criar o tema do Restyle com os tokens do Figma**

  - **Critérios de aceite:** CA-01, CA-02, CA-04
  - **Arquivos:** `src/shared/theme/theme.ts`, `fonts.ts`, `sizes.ts`, `index.ts`
  - **Verificação:** revisão de cada valor de `theme.ts` e `sizes.ts` contra as tabelas da spec (sem teste que repita as constantes); `yarn validate` passa
  - **Documentação:** `docs/estrutura-de-pastas.md`, `docs/convencoes.md`
  - **Commit:** `feat(theme): cria o tema global com os tokens do figma`

- [x] **T03: Criar Box e Text do Restyle e aplicar o tema na raiz do app**

  - **Critérios de aceite:** CA-02 (variant aplicado ao componente), CA-05
  - **Arquivos:** `src/shared/components/Box.tsx`, `Text.tsx`, `Text.test.tsx`, `index.ts`, `src/app/providers/AppProviders.tsx`, `src/app/App.tsx`, `src/app/App.test.tsx`, `package.json`, `yarn.lock`
  - **Verificação:** `Text.test.tsx` confere que um variant aplica a família e as medidas sobre os padrões do tema, sem `fontWeight` e com `includeFontPadding: false`; `App.test.tsx` confere o fundo `#000000`; `@react-native/new-app-screen` removido; `yarn validate` passa
  - **Documentação:** `docs/estrutura-de-pastas.md`, `README.md`, `AGENTS.md` (stack)
  - **Commit:** `feat(theme): aplica o tema na raiz com box e text do restyle`

- [ ] **T04: Conferir a fonte renderizada no iOS e no Android**
  - **Critérios de aceite:** CA-03
  - **Arquivos:** nenhum versionado (um `Text` temporário em `App.tsx` com os 4 pesos, descartado depois)
  - **Verificação:** em `yarn ios` e `yarn android`, os 4 pesos aparecem distintos e iguais ao Figma, sem negrito sintetizado e sem padding extra no Android
  - **Documentação:** status da spec para `Concluída`
  - **Commit:** nenhum (verificação manual)
