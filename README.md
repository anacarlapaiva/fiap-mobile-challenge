# AppFiap

Aplicativo para responsáveis da FIAP School acompanharem as aulas do dia e o boletim anual do aluno.

Feito em React Native CLI e TypeScript, com o layout do [Figma do desafio](https://www.figma.com/design/lWgkJr0vc9ZiQQylY2J4Zt/Teste-T%C3%A9cnico-Mobile---FIAP?node-id=4001-2). Os dados vêm do Firebase (Authentication + Cloud Firestore), no mesmo contrato do JSON da FIAP. O desenvolvimento seguiu Spec-Driven Development (SDD).

O projeto Firebase `app-fiap-cbb00` já está ligado aos apps Android e iOS. Depois de clonar, basta instalar e rodar.

## O que o app cobre

| Tela             | O que faz                                                                          |
| ---------------- | ---------------------------------------------------------------------------------- |
| Splash           | Reproduz o vídeo de abertura uma vez e entrega o restante do app                   |
| Login            | CPF (máscara `XXX.XXX.XXX-XX`) ou e-mail + senha; sessão persiste ao fechar o app  |
| Agenda           | Aulas de um dia, com horário e disciplina; troca de dia da semana                  |
| Boletim          | Ano, turma e trimestres; 2025 abre no 1º trimestre; anos anteriores quando existem |
| Escolha de aluno | Só aparece se o responsável tiver mais de um aluno; volta para a tela de origem    |
| Sair             | Confirmação nativa antes de encerrar a sessão                                      |

Nas telas autenticadas: cabeçalho com o responsável, o aluno (nome, RM, turma, período), TROCAR PERFIL quando houver mais de um aluno, SAIR, e abas AGENDA / BOLETIM no rodapé.

Além do corte: testes automatizados, animações, estados vazios (responsável sem alunos, dia sem aula, boletim ausente), detecção de falta de internet no login e Firebase no lugar do JSON local.

## Stack

| Item      | Escolha                                                          |
| --------- | ---------------------------------------------------------------- |
| App       | React Native 0.88 (CLI, sem Expo), React 19, TypeScript `strict` |
| UI        | `@shopify/restyle`, Reanimated, SVG, `react-native-video`        |
| Navegação | React Navigation 7 (native-stack + bottom-tabs)                  |
| Dados     | Firebase Auth + Firestore, React Query, Zod                      |
| Sessão    | `react-native-keychain`                                          |
| Qualidade | Jest, ESLint, Prettier, Husky                                    |

Gerenciador de pacotes: Yarn 3.6.4. Node.js >= 22.11.0.

## Pré-requisitos

- Node.js >= 22.11.0
- Yarn (versão fixada no repositório; `corepack enable`)
- Ambiente React Native: [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment)
- iOS: Ruby, Bundler e CocoaPods

## Como rodar

```sh
yarn install
yarn start

# em outro terminal
yarn android
# ou, no iOS (primeira vez e após mudar dependências nativas):
bundle install
cd ios && bundle exec pod install && cd ..
yarn ios
```

`yarn install` também registra o hook de pre-commit.

As fontes (Montserrat) já estão no iOS e no Android. O player de vídeo, o SVG e o Reanimated são nativos: depois de instalar dependências, rode `bundle exec pod install` em `ios/` e recompile. Recarregar o Metro não basta. Depois de instalar ou atualizar o Reanimated, inicie o Metro com `yarn start --reset-cache`.

## Acesso de teste

| Responsável                | CPF              | E-mail                          | Senha    | Alunos         |
| -------------------------- | ---------------- | ------------------------------- | -------- | -------------- |
| Gustavo da Silva           | `969.294.560-04` | `gustavo-da-silva@example.com`  | `123456` | Rafael e Joana |
| Adelaide Silveira da Costa | `508.795.670-07` | `adelaide-silveira@example.com` | `987654` | Bianca         |

O login aceita CPF ou e-mail. O Gustavo tem dois alunos (mostra TROCAR PERFIL) e boletim de 2024 e 2025 no Rafael.

## Firebase

Já configurado neste repositório (`android/app/google-services.json` e `ios/AppFiap/GoogleService-Info.plist`). Com internet, o app fala com o projeto `app-fiap-cbb00`.

- **Authentication:** e-mail/senha, com os dois usuários da tabela.
- **Cloud Firestore:** coleção `responsaveis`, documentos `1` e `2`, no formato do JSON da FIAP, **sem** o campo `senha`.
- **Regras** ([firestore.rules](firestore.rules)): o usuário autenticado lê só o documento cujo `email` é o do token; ninguém escreve pelo app.
- **Login por CPF:** o Authentication só conhece e-mail. O app traduz o CPF pelo diretório local `src/features/auth/data/loginDirectory.ts` (sem senha).
- O JSON original fica em `src/shared/mocks/responsaveis.json` só como fixture dos testes.

Para usar um projeto Firebase próprio:

1. Crie o projeto e registre os apps Android (`com.appfiap`) e iOS (`org.reactjs.native.example.AppFiap`). Substitua `google-services.json` e `GoogleService-Info.plist`.
2. Em Authentication, ative E-mail/senha e crie os usuários da tabela.
3. Em Firestore, crie a coleção `responsaveis` com um documento por responsável (id = `id`), copiando `src/shared/mocks/responsaveis.json` sem o campo `senha`.
4. Publique as regras: `firebase deploy --only firestore:rules` (Firebase CLI, com `firebase use <projeto>`).

## Arquitetura e SDD

O código em `src/` tem quatro camadas: `app`, `features` (`splash`, `auth`, `schedule`, `report-card`), `shared` e `assets`. Cada feature só exporta pelo `index.ts`. As regras de dependência são impostas pelo ESLint.

Cada fatia de produto nasceu de uma spec em `docs/specs/`, com ADRs para as escolhas de biblioteca. O mapa está em [docs/README.md](docs/README.md). As instruções usadas pelos agentes de IA estão em [AGENTS.md](AGENTS.md).

## Qualidade

```sh
yarn typecheck
yarn lint
yarn test
yarn validate          # typecheck + lint + formatação + testes
```

O pre-commit (Husky + lint-staged) verifica formatação, lint e tipos em cada commit.

## Solução de problemas

- **iOS:** o Firebase iOS 13 só vem por SPM e exige frameworks dinâmicos (já configurado no `Podfile`). Não exporte `USE_FRAMEWORKS=static`.
- **Android:** o Firebase exige Kotlin 2.4 (`kotlinVersion` em `android/build.gradle`). Se um build antigo falhar, rode `cd android && ./gradlew clean`.
- **Metro:** depois de trocar de branch ou instalar dependências, `yarn start --reset-cache`.
