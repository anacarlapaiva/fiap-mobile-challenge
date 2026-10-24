# Spec 004: Navegação, sessão e validação

- **Status:** Aprovada
- **Autor:** Ana Carla Paiva
- **Aprovado por:** Ana Carla Paiva (2026-10-24)
- **Data:** 2026-10-24

## Problema

As telas do PDF ainda não têm como trocar de rota, guardar a sessão no cofre do sistema nem recusar dado externo inválido. Sem essas três peças, login, aulas, boletim e escolha de aluno não têm onde se apoiar.

## Objetivo

As bibliotecas decididas estão no app, nas versões dos ADR 0005, 0006 e 0007, com o módulo nativo registrado no iOS. Sucesso: `yarn validate` passa e o `Podfile.lock` lista os pods de tela nativa e de Keychain.

## Usuários

| Perfil                      | Necessidade principal                                   |
| --------------------------- | ------------------------------------------------------- |
| Pessoa desenvolvedora       | Importar navegação, Keychain e Zod sem escolher de novo |
| Responsável (usuário final) | Nenhum comportamento novo nesta spec                    |

## Fluxos

### Fluxo principal

1. A pessoa desenvolvedora instala as dependências.
2. O iOS ganha os pods nativos no `pod install`.
3. O app continua abrindo na splash, como na spec 002.

### Fluxos alternativos

- Não se aplica: esta spec não muda o que a pessoa vê.

## Critérios de aceite

- **CA-01:** **Dado** o `package.json`, **Quando** as dependências de runtime são lidas, **Então** contêm `zod` 4.6.7, `react-native-keychain` 10.0.0, `@react-navigation/native` 7.5.1, `@react-navigation/native-stack` 7.21.0, `@react-navigation/bottom-tabs` 7.21.0 e `react-native-screens` 4.30.0.
- **CA-02:** **Dado** o `ios/Podfile.lock`, **Quando** os pods são lidos, **Então** `RNScreens` e `RNKeychain` estão registrados.
- **CA-03:** **Dado** o repositório, **Quando** `yarn validate` roda, **Então** termina sem erros e sem warnings.

## Estados da interface

Não se aplica: esta spec não cria tela.

## Regras de negócio e validações

- A navegação segue o ADR 0005. A sessão segue o ADR 0006. A validação segue o ADR 0007.
- `expo-secure-store` não entra. O cofre no CLI é o `react-native-keychain`.
- Nenhuma tela, schema ou gravação de sessão é criada aqui.

## Fora do escopo

- Telas de login, aulas, boletim e escolha de aluno.
- Máscara de CPF, texto de erro e leitura do JSON.
- Gravar e ler a sessão de fato.
- Zustand, Axios e qualquer cliente HTTP.

## Perguntas em aberto

Nenhuma.
