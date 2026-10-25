# AppFiap

Aplicativo para responsáveis da FIAP School acompanharem as aulas do dia e o boletim anual do aluno.

Feito em React Native CLI e TypeScript, com o layout do [Figma do desafio](https://www.figma.com/design/lWgkJr0vc9ZiQQylY2J4Zt/Teste-T%C3%A9cnico-Mobile---FIAP?node-id=4001-2), em Restyle. Os dados vêm do Firebase (Authentication + Cloud Firestore), no mesmo contrato do JSON da FIAP. O desenvolvimento seguiu Spec-Driven Development (SDD).

O projeto Firebase `app-fiap-cbb00` já está ligado aos apps Android e iOS. Depois de clonar, basta instalar e rodar.

<p align="center">
  <img src="docs/demo/01-login.png" alt="Login" width="180" />
  <img src="docs/demo/02-agenda-aulas.png" alt="Agenda com aulas" width="180" />
  <img src="docs/demo/04-boletim-aberto.png" alt="Boletim com trimestre aberto" width="180" />
  <img src="docs/demo/05-trocar-perfil.png" alt="Escolha de aluno" width="180" />
</p>
<p align="center"><sub>Login · Agenda · Boletim · Troca de aluno (emulador Android)</sub></p>

## Telas

| Tela             | O que faz                                                                         |
| ---------------- | --------------------------------------------------------------------------------- |
| Splash           | Reproduz o vídeo de abertura uma vez e entrega o restante do app                  |
| Login            | CPF (máscara `XXX.XXX.XXX-XX`) ou e-mail + senha; sessão persiste ao fechar o app |
| Agenda           | Aulas de um dia, com horário e disciplina; troca de dia da semana                 |
| Boletim          | Ano, turma e trimestres; 2025 no 1º trimestre; anos anteriores quando existem     |
| Escolha de aluno | Só aparece se o responsável tiver mais de um aluno; volta para a tela de origem   |
| Sair             | Confirmação nativa antes de encerrar a sessão                                     |

Nas telas autenticadas: cabeçalho com o responsável, o aluno (nome, RM, turma, período), TROCAR PERFIL quando houver mais de um aluno, SAIR, e abas AGENDA / BOLETIM no rodapé.

## Regras de negócio

### Autenticação

- O login aceita **CPF ou e-mail**. Digitando letras ou `@`, o campo trata como e-mail; só dígitos viram CPF com máscara `XXX.XXX.XXX-XX`.
- CPF é validado de verdade: 11 dígitos, rejeita sequência repetida (`111.111.111-11`) e confere os dois dígitos verificadores.
- Ordem das frases no CPF: vazio → quantidade → dígitos iguais → verificador → senha vazia → credencial recusada.
- Credencial recusada **não diz** se o erro foi o CPF, o e-mail ou a senha (`CPF ou senha incorretos.` / `E-mail ou senha incorretos.`).
- Não há cadastro nem recuperação de senha (fora do corte).
- A senha nunca é gravada no aparelho nem no Firestore. O Authentication é e-mail/senha; o CPF é traduzido localmente para o e-mail daquele responsável, sem senha.

### Sessão

- Sessão `{ guardianId, studentRm }` no Keychain. Fecha o app e abre de novo: vai para a agenda, não para o login.
- No primeiro acesso, o aluno da sessão é o **primeiro** da lista.
- TROCAR PERFIL só existe quando há mais de um aluno. Adelaide vê só SAIR; Gustavo vê os dois.
- SAIR pede confirmação nativa. Cancelar (ou toque fora / voltar no Android) mantém a sessão.
- Confirmar o SAIR apaga Keychain, cache do React Query e a conta do Firebase, mesmo se o Keychain falhar.
- Sessão órfã ou inválida (responsável/aluno que não existem mais) é apagada e volta ao login.
- Se o Keychain falhar ao gravar, a sessão vale na memória e a área autenticada abre mesmo assim.
- Se a leitura do Keychain não responder em 3 s, o app trata como sem sessão.

### Offline e rede

O login **precisa de internet**. Sair, restaurar sessão já gravada e trocar de aluno **não**.

| Situação                                           | O que o app faz                                                                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Sem internet no FAZER LOGIN                        | `"Sem conexão com a internet. Verifique sua rede e tente novamente."` — nem avalia CPF/senha           |
| Firebase recusa a conta                            | Credencial genérica, sem apontar o campo                                                               |
| Conta ok, documento não chega ou quebra o contrato | `"Não foi possível carregar seus dados. Tente novamente."` — sessão **não** é gravada                  |
| Leitura do Firestore falha na área autenticada     | `"Não foi possível carregar seus dados. Tente novamente."` + **TENTAR NOVAMENTE** (até 2 retentativas) |
| Responsável sem alunos                             | `"Não encontramos alunos vinculados à sua conta."` — sessão **não** é gravada                          |
| Tela quebra ao renderizar                          | Fundo preto, `"Algo deu errado."` e **TENTAR NOVAMENTE**                                               |
| App já autenticado, rede cai                       | Agenda, boletim, troca de aluno e SAIR continuam; a sessão no Keychain não depende da nuvem            |

### Agenda

- Mostra só o aluno da sessão, um dia por vez. O dia inicial é o primeiro da lista.
- O dia escolhido vive na tela, não na sessão. Sair volta ao primeiro dia.
- Dia com `aulas: []`: ilustração + `"Sem aulas neste dia"`. Dropdown permanece.
- Aluno sem agenda: `"Nenhuma aula cadastrada."`, sem dropdown.
- Cada objeto de `aulas` vira uma linha, na ordem do documento, mesmo com disciplina repetida.

### Boletim

- Abre no primeiro ano da lista (nos dados da FIAP, 2025). Anos anteriores aparecem no dropdown quando existem — caso do Rafael (`7EF - 2025` e `6EF - 2024`).
- Um trimestre aberto por vez; várias disciplinas podem ficar abertas.
- Nota com uma casa decimal (`9` → `9.0`). Falta inteira. `null` vira `-`. Empty não substitui nota nem falta.
- Aluno sem boletim: `"Nenhum boletim disponível."`, sem dropdown.
- Ano, trimestre e disciplinas abertas vivem na tela. Trocar de aluno zera esse estado.

### Escolha de aluno

- Fora do rodapé. Fecha e devolve a aba de origem (agenda ou boletim).
- Card com nome completo, turma, RM e período. O aluno da sessão vem com borda de destaque.
- Escolher outro aluno regrava a sessão, mostra `Perfil alterado para JOANA` e zera dia/ano das abas.
- Tocar no aluno já selecionado só fecha a tela.

## Acesso de teste

| Responsável                | CPF              | E-mail                          | Senha    | Alunos         |
| -------------------------- | ---------------- | ------------------------------- | -------- | -------------- |
| Gustavo da Silva           | `969.294.560-04` | `gustavo-da-silva@example.com`  | `123456` | Rafael e Joana |
| Adelaide Silveira da Costa | `508.795.670-07` | `adelaide-silveira@example.com` | `987654` | Bianca         |

O Gustavo tem dois alunos (mostra TROCAR PERFIL) e boletim de 2024 e 2025 no Rafael.

## Stack

| Item      | Escolha                                                          |
| --------- | ---------------------------------------------------------------- |
| App       | React Native 0.88 (CLI, sem Expo), React 19, TypeScript `strict` |
| UI        | `@shopify/restyle`, Reanimated, SVG, `react-native-video`        |
| Navegação | React Navigation 7 (native-stack + bottom-tabs)                  |
| Dados     | Firebase Auth + Firestore, React Query, Zod                      |
| Sessão    | `react-native-keychain`                                          |
| Rede      | `@react-native-community/netinfo`                                |
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
