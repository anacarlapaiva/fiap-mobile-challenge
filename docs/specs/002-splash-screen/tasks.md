# Tarefas 002: Splash screen

- **Spec:** [spec.md](spec.md)
- **Plano:** [plan.md](plan.md)

Regras:

- Cada tarefa cabe em um commit e deixa `yarn validate` passando.
- Implemente uma tarefa por vez, na ordem, e marque `[x]` só quando ela atender à definição de pronto de [AGENTS.md](../../../AGENTS.md#definição-de-pronto).
- Cada tarefa indica os critérios de aceite que cobre, os arquivos que toca e como verificá-la.

## Tarefas

- [x] **T01: Registrar o player de vídeo local**

  - **Critérios de aceite:** nenhum critério visual; prepara CA-01
  - **Arquivos:** `package.json`, `yarn.lock`, `ios/Podfile.lock`, `docs/adr/0003-reproducao-de-video-local.md`, `docs/README.md`, `AGENTS.md`
  - **Verificação:** `react-native-video` 6.19.3 está nas dependências; o pod aparece no `Podfile.lock`; `yarn validate` passa
  - **Documentação:** ADR 0003, `docs/README.md`, `AGENTS.md`
  - **Commit:** `chore: adiciona o player de vídeo local`

- [x] **T02: Reproduzir a animação na feature splash**

  - **Critérios de aceite:** CA-01, CA-02, CA-03, CA-04, CA-05
  - **Arquivos:** `src/assets/videos/splash.mp4`, `src/assets/videos/splash.mp4.d.ts`, `src/features/splash/**`
  - **Verificação:** `SplashScreen.test.tsx` cobre CA-01 a CA-05; `yarn validate` passa
  - **Documentação:** `docs/estrutura-de-pastas.md`
  - **Commit:** `feat(splash): reproduz a animação de abertura`

- [x] **T03: Exibir a splash na abertura e escurecer a tela nativa**

  - **Critérios de aceite:** CA-06, CA-07
  - **Arquivos:** `src/app/App.tsx`, `src/app/App.test.tsx`, `src/app/nativeLaunch.test.ts`, `android/build.gradle`, `android/app/src/main/res/**`, `ios/AppFiap/LaunchScreen.storyboard`, `README.md`
  - **Verificação:** `App.test.tsx` cobre CA-06; `nativeLaunch.test.ts` cobre CA-07; `yarn validate` passa
  - **Documentação:** `docs/estrutura-de-pastas.md`, `README.md`
  - **Commit:** `feat(splash): exibe a animação na abertura do app`
