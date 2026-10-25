# AppFiap

App mobile em React Native (CLI) com TypeScript. É desenvolvido com Spec-Driven Development (SDD), abordagem AI-first e arquitetura feature-based.

- Documentação do projeto: [docs/README.md](docs/README.md)
- Instruções para agentes de IA (e regras do repositório): [AGENTS.md](AGENTS.md)

## Pré-requisitos

- Node.js >= 22.11.0
- Yarn (versão fixada no repositório via `.yarn/releases`; habilite com `corepack enable`)
- Ambiente React Native configurado: [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment)
- iOS: Ruby/Bundler e CocoaPods

## Como rodar

```sh
yarn install                 # instala dependências e o hook de pre-commit
yarn start                   # inicia o Metro

# em outro terminal
yarn android
# ou, no iOS (primeira vez e após mudar dependências nativas):
bundle install
cd ios && bundle exec pod install && cd ..
yarn ios
```

As fontes já estão registradas no iOS e no Android. Para alterá-las, veja "Registrar fontes" em [AGENTS.md](AGENTS.md#comandos).

Na abertura, o app reproduz `src/assets/videos/splash.mp4` uma vez e em seguida mostra o conteúdo. A tela nativa anterior ao JavaScript é preta. O player é nativo: depois de instalar dependências, rode `bundle exec pod install` em `ios/` e recompile o app. Recarregar o Metro não basta. O mesmo vale para `react-native-svg` (ícones) e `react-native-reanimated` (animações); o Reanimated também usa um plugin no Babel, então, depois de instalar ou atualizar, inicie o Metro com `yarn start --reset-cache`.

## Acesso de teste

O app já aponta para o projeto Firebase `app-fiap-cbb00` (os arquivos `android/app/google-services.json` e `ios/AppFiap/GoogleService-Info.plist` estão no repositório). Basta clonar, instalar e rodar: os dados vêm do Firestore, em qualquer aparelho com internet.

| Responsável                | CPF              | E-mail                          | Senha    | Alunos         |
| -------------------------- | ---------------- | ------------------------------- | -------- | -------------- |
| Gustavo da Silva           | `969.294.560-04` | `gustavo-da-silva@example.com`  | `123456` | Rafael e Joana |
| Adelaide Silveira da Costa | `508.795.670-07` | `adelaide-silveira@example.com` | `987654` | Bianca         |

O login aceita CPF ou e-mail. O Gustavo tem dois alunos (mostra TROCAR PERFIL) e boletim de 2024 e 2025 no Rafael.

## Firebase

- **Authentication:** provedor E-mail/senha, com os dois usuários acima.
- **Cloud Firestore:** coleção `responsaveis`, documentos `1` e `2`, no formato do JSON da FIAP, **sem** o campo `senha`.
- **Regras** ([firestore.rules](firestore.rules)): o usuário autenticado lê só o documento cujo `email` é o do token; ninguém escreve pelo app.
- **Login por CPF:** o Authentication só conhece e-mail, então o app traduz o CPF pelo diretório local `src/features/auth/data/loginDirectory.ts` (sem senha).
- Decisões: [ADR 0010](docs/adr/0010-conectar-auth-e-firestore-com-react-native-firebase.md) e [spec 011](docs/specs/011-firebase-account/spec.md).

Para usar um projeto Firebase próprio:

1. Crie o projeto e registre os apps Android (`com.appfiap`) e iOS (`org.reactjs.native.example.AppFiap`). Substitua `google-services.json` e `GoogleService-Info.plist`.
2. Em Authentication, ative E-mail/senha e crie os usuários da tabela.
3. Em Firestore, crie a coleção `responsaveis` com um documento por responsável (id = `id`), copiando `src/shared/mocks/responsaveis.json` sem o campo `senha`.
4. Publique as regras: `firebase deploy --only firestore:rules` (Firebase CLI, com `firebase use <projeto>`).

## Solução de problemas

- **iOS:** o Firebase iOS 13 só vem por SPM e exige frameworks dinâmicos (já configurado no `Podfile`). Não exporte `USE_FRAMEWORKS=static`.
- **Android:** o Firebase exige Kotlin 2.4 (`kotlinVersion` em `android/build.gradle`). Se um build antigo falhar, rode `cd android && ./gradlew clean`.
- **Metro:** depois de trocar de branch ou instalar dependências, `yarn start --reset-cache`.

## Comandos e estrutura

- Stack e dependências: [AGENTS.md](AGENTS.md#stack).
- Typecheck, lint, formatação, testes e `yarn validate`: [AGENTS.md](AGENTS.md#comandos).
- Arquitetura e pastas: [docs/arquitetura.md](docs/arquitetura.md) e [docs/estrutura-de-pastas.md](docs/estrutura-de-pastas.md).

O pre-commit (Husky + lint-staged) verifica formatação, lint e tipos automaticamente em cada commit.
