# Tarefas 003: Componentes globais

- **Spec:** [spec.md](spec.md)
- **Plano:** [plan.md](plan.md)

Regras:

- Cada tarefa cabe em um commit e deixa `yarn validate` passando.
- Implemente uma tarefa por vez, na ordem, e marque `[x]` só quando ela atender à definição de pronto de [AGENTS.md](../../../AGENTS.md#definição-de-pronto).
- Cada tarefa indica os critérios de aceite que cobre, os arquivos que toca e como verificá-la.

## Tarefas

- [x] **T01: Instalar svg e Reanimated e configurar Babel, Jest e pods**

  - **Critérios de aceite:** base para CA-02 e CA-17
  - **Arquivos:** `package.json`, `yarn.lock`, `babel.config.js`, `jest.config.js`, `jest.setup.js`, `ios/Podfile.lock`, `src/shared/theme/motion.ts`, `src/shared/theme/theme.ts`, `src/shared/theme/index.ts`, `docs/specs/001-design-system/spec.md`
  - **Verificação:** teste de fumaça temporário renderiza `Svg` e uma `Animated.View` sem warnings (descartado ao fim); `bundle exec pod install` sem erro; `yarn validate` passa
  - **Documentação:** `AGENTS.md` (stack), `README.md`, `docs/convencoes.md` (animações e `motion`), `docs/estrutura-de-pastas.md` (`jest.setup.js`, `motion.ts`), spec 001 (espaçamentos 25 e 8)
  - **Commit:** `chore: adiciona react-native-svg e reanimated com tokens de movimento`

- [x] **T02: Criar Icon e Logo**

  - **Critérios de aceite:** CA-02, CA-03
  - **Arquivos:** `src/shared/components/icons.ts`, `Icon.tsx`, `Icon.test.tsx`, `Logo.tsx`, `Logo.test.tsx`, `index.ts`, `src/assets/images/logo.png`, `src/assets/images/logo.png.d.ts`
  - **Verificação:** testes conferem cor resolvida do tema, altura igual ao `size` e largura proporcional (calendário 21,43 x 24), e os dois tamanhos do logo; `yarn validate` passa
  - **Documentação:** `docs/estrutura-de-pastas.md` (`assets/images`, componentes), `docs/convencoes.md` (ícones só pelo `Icon`)
  - **Commit:** `feat(shared): cria os componentes icon e logo`

- [x] **T03: Criar Screen e PressableOpacity**

  - **Critérios de aceite:** CA-01, CA-17
  - **Arquivos:** `src/shared/components/Screen.tsx`, `Screen.test.tsx`, `PressableBox.tsx`, `PressableOpacity.tsx`, `PressableOpacity.test.tsx`, `index.ts`
  - **Verificação:** testes conferem fundo `#000000`, padding só nas `edges` pedidas, e que o toque chama a ação e anima a opacidade; `yarn validate` passa
  - **Documentação:** `docs/estrutura-de-pastas.md`, `docs/convencoes.md` (feedback de toque pelo `PressableOpacity`)
  - **Commit:** `feat(shared): cria screen e pressable com feedback de opacidade`

- [x] **T04: Criar Button**

  - **Critérios de aceite:** CA-04, CA-05, CA-06, CA-07
  - **Arquivos:** `src/shared/components/Button.tsx`, `Button.test.tsx`, `index.ts`
  - **Verificação:** testes cobrem desabilitado, habilitado, carregando e `bottomInset`; `yarn validate` passa
  - **Documentação:** `docs/estrutura-de-pastas.md`
  - **Commit:** `feat(shared): cria o componente button`

- [x] **T05: Criar TextField**

  - **Critérios de aceite:** CA-08, CA-09, CA-10
  - **Arquivos:** `src/shared/components/TextField.tsx`, `TextField.test.tsx`, `index.ts`
  - **Verificação:** testes cobrem linha vazia/preenchida, N asteriscos no modo seguro sem expor o valor e repasse do texto digitado; `yarn validate` passa
  - **Documentação:** `docs/estrutura-de-pastas.md`
  - **Commit:** `feat(shared): cria o componente text field`

- [x] **T06: Criar TextButton e Card**

  - **Critérios de aceite:** CA-11, CA-12, CA-13
  - **Arquivos:** `src/shared/components/TextButton.tsx`, `TextButton.test.tsx`, `Card.tsx`, `Card.test.tsx`, `index.ts`
  - **Verificação:** testes cobrem os dois tons do `TextButton`, borda do card selecionado sem deslocar conteúdo, e card com e sem ação; `yarn validate` passa
  - **Documentação:** `docs/estrutura-de-pastas.md`
  - **Commit:** `feat(shared): cria os componentes text button e card`

- [x] **T07: Criar Dropdown**

  - **Critérios de aceite:** CA-14, CA-15, CA-16, CA-18
  - **Arquivos:** `src/shared/components/Dropdown.tsx`, `Dropdown.test.tsx`, `index.ts`
  - **Verificação:** testes cobrem abrir com opções na ordem, selecionar e fechar, não abrir sem opções e fechar ao tocar fora sem selecionar; `yarn validate` passa
  - **Documentação:** `docs/estrutura-de-pastas.md`
  - **Commit:** `feat(shared): cria o componente dropdown`

- [ ] **T08: Conferir os componentes no iOS e no Android**
  - **Critérios de aceite:** todos (visual e animação)
  - **Arquivos:** nenhum versionado (uma vitrine temporária em `App.tsx`, descartada depois)
  - **Verificação:** em `yarn ios` e `yarn android`, medidas, cores e animações batem com o Figma e a spec
  - **Documentação:** status da spec para `Concluída`
  - **Commit:** nenhum (verificação manual)
