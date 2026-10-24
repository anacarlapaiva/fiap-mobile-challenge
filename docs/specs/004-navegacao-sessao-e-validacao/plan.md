# Plano 004: Navegação, sessão e validação

- **Status:** Aprovado
- **Spec:** [spec.md](spec.md)
- **Aprovado por:** Ana Carla Paiva (2026-10-24)
- **Data:** 2026-10-24

## Resumo da solução

Três bibliotecas entram juntas porque as telas seguintes dependem das três. A navegação é React Navigation 7, com stack nativa e abas, mais `react-native-screens`. A sessão usa `react-native-keychain` (Keychain no iOS, Keystore no Android). O Expo SecureStore fica de fora: a versão 58.0.2 exige o peer `expo`, e o app é CLI (ADR 0003). Dado externo é conferido com Zod 4. O `react-native-safe-area-context` já está no projeto e é peer da navegação.

Nenhuma tela é ligada nesta entrega. Os módulos nativos só passam a existir no binário depois do `pod install` e de um rebuild.

## Estrutura de arquivos

```
package.json
yarn.lock
ios/Podfile.lock
docs/adr/0005-navegacao-com-react-navigation.md
docs/adr/0006-sessao-no-keychain.md
docs/adr/0007-validar-com-zod.md
docs/README.md
docs/estrutura-de-pastas.md
AGENTS.md
```

`src/app/navigation/` continua sem arquivos até a spec que montar as rotas.

## Telas

Não se aplica.

## Componentes

Não se aplica.

## Dados e tipos

Não se aplica. O formato `{ responsavelId, alunoRm }` está decidido no ADR 0006 e o schema Zod entra na spec que ler a sessão.

## APIs

Não se aplica. Não há rede.

## Estado

Não se aplica. Nada é gravado nesta entrega.

## API pública da feature (`index.ts`)

Não se aplica. Não há feature nova.

## Impacto em outras features e em `shared`

| Área afetada  | Mudança                         | Risco                         |
| ------------- | ------------------------------- | ----------------------------- |
| `ios/`        | Pods `RNScreens` e `RNKeychain` | Exige `pod install` e rebuild |
| `android/`    | Autolinking, sem edição manual  | Exige rebuild                 |
| Splash e tema | Nenhuma                         | Nenhum                        |

## Dependências novas

| Pacote                           | Versão | Por que é necessário                                                           | Alternativas avaliadas                                                | Exige ADR?    |
| -------------------------------- | ------ | ------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ------------- |
| `@react-navigation/native`       | 7.5.1  | Núcleo da navegação pedida pelo PDF                                            | Estado manual no `App`; React Native Navigation (Wix); Expo Router    | Sim, ADR 0005 |
| `@react-navigation/native-stack` | 7.21.0 | Stack do login, da área autenticada e da escolha de aluno, com voltar nativo   | Stack em JavaScript puro, sem o botão de voltar do Android            | Sim, ADR 0005 |
| `@react-navigation/bottom-tabs`  | 7.21.0 | Rodapé só entre Aulas e Boletim                                                | Abas desenhadas sem biblioteca, reimplementando o estado da aba       | Sim, ADR 0005 |
| `react-native-screens`           | 4.30.0 | Peer obrigatório da stack e das abas (`>= 4.0.0`)                              | Sem ele a navegação 7 não instala                                     | Sim, ADR 0005 |
| `react-native-keychain`          | 10.0.0 | Sessão no Keychain (iOS) e no Keystore (Android), sem gravar a senha           | `expo-secure-store` 58.0.2 (peer `expo`); AsyncStorage em texto claro | Sim, ADR 0006 |
| `zod`                            | 4.6.7  | Conferir o JSON e a sessão lida do Keychain; o erro dessa borda é o `ZodError` | Cast `as`; validação manual; Yup ou Valibot                           | Sim, ADR 0007 |

## Riscos e mitigação

| Risco                                    | Probabilidade | Impacto                        | Mitigação                                             |
| ---------------------------------------- | ------------- | ------------------------------ | ----------------------------------------------------- |
| Metro antigo não enxerga o módulo nativo | Alta          | Tela nativa ou Keychain falham | Rebuild de iOS e Android depois do `pod install`      |
| Nome do pod diferente do esperado        | Baixa         | CA-02 falso                    | Conferir `RNScreens` e `RNKeychain` no `Podfile.lock` |

## Documentação a atualizar

- `docs/adr/0005-navegacao-com-react-navigation.md`
- `docs/adr/0006-sessao-no-keychain.md`
- `docs/adr/0007-validar-com-zod.md`
- `docs/README.md`
- `docs/estrutura-de-pastas.md`
- `AGENTS.md`

## Decisões arquiteturais

- ADR 0005: navegar com React Navigation.
- ADR 0006: guardar a sessão no Keychain.
- ADR 0007: validar dados externos com Zod.
