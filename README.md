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

## Comandos e estrutura

- Typecheck, lint, formatação, testes e `yarn validate`: [AGENTS.md](AGENTS.md#comandos).
- Arquitetura e pastas: [docs/arquitetura.md](docs/arquitetura.md) e [docs/estrutura-de-pastas.md](docs/estrutura-de-pastas.md).

O pre-commit (Husky + lint-staged) verifica formatação, lint e tipos automaticamente em cada commit.
