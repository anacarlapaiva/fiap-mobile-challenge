# 0005. Navegar com React Navigation

- **Status:** Aceito
- **Data:** 2026-10-24
- **Decisores:** Ana Carla Paiva

## Contexto

O PDF pede login, duas telas principais (aulas e boletim) com troca no rodapé, e uma tela de escolha de aluno fora do rodapé, que volta para a tela anterior. No Android, o botão de voltar dessa escolha fecha a escolha e não o app. Sair da sessão não pode deixar a área autenticada debaixo do login, senão o voltar reabre o app logado. O React Native 0.88 não traz um navegador. O projeto é CLI, sem Expo, com a nova arquitetura ligada. `react-native-safe-area-context` já está instalado.

## Decisão

1. A navegação usa React Navigation 7: `@react-navigation/native` 7.5.1, `@react-navigation/native-stack` 7.21.0 e `@react-navigation/bottom-tabs` 7.21.0, com `react-native-screens` 4.30.0.
2. A stack raiz tem o login e a área autenticada. Dentro da área autenticada ficam as abas Aulas e Boletim, e a escolha de aluno é outra tela dessa stack, nunca uma aba.
3. Sair da sessão faz `reset` para o login.
4. Os navegadores ficam em `src/app/navigation/`. Telas continuam nas features. A splash não é uma rota.

## Alternativas consideradas

| Alternativa                   | Prós                | Contras                                                                    | Motivo da rejeição                            |
| ----------------------------- | ------------------- | -------------------------------------------------------------------------- | --------------------------------------------- |
| Estado manual em `App`        | Nenhuma dependência | O botão de voltar do Android e o histórico da escolha de aluno ficam à mão | O PDF exige voltar à tela anterior no Android |
| React Native Navigation (Wix) | Navegação nativa    | Mais código nativo e mais atrito com a nova arquitetura do 0.88            | Peso desproporcional a quatro telas           |
| Expo Router                   | Rotas em arquivo    | Exige o runtime do Expo                                                    | O projeto é CLI sem Expo, como no ADR 0003    |

## Consequências

- **Positivas:** o voltar da escolha de aluno devolve a aba que estava aberta; o `reset` no sair impede reabrir a sessão pelo botão de voltar.
- **Negativas:** `react-native-screens` é módulo nativo; iOS e Android precisam de rebuild. Recarregar o Metro não liga o módulo.
- **Ações decorrentes:** dependências em `package.json`; `ios/Podfile.lock`; menção em `AGENTS.md`, `docs/estrutura-de-pastas.md` e na spec 004.
