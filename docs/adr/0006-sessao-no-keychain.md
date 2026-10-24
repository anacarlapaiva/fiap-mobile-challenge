# 0006. Guardar a sessão no Keychain

- **Status:** Aceito
- **Data:** 2026-10-24
- **Decisores:** Ana Carla Paiva

## Contexto

A autenticação continua depois de fechar e reabrir o app. Se a pessoa já estiver autenticada, a primeira tela depois da splash é a aba AGENDA, não o login. A senha do JSON não deve ser gravada de novo no aparelho. O projeto é React Native CLI, sem Expo (ADR 0003). O pacote de nome Expo SecureStore (`expo-secure-store` 58.0.2) declara `expo` como peer e puxa esse runtime.

## Decisão

1. A sessão fica no armazenamento seguro do sistema, via `react-native-keychain` 10.0.0: Keychain no iOS e Keystore no Android.
2. O valor gravado é só `{ guardianId, studentRm }`. A senha não entra no disco.
3. Na leitura, o texto gravado passa pelo schema Zod (ADR 0007). Payload inválido é tratado como sessão ausente.
4. Nenhum outro armazenamento de sessão é adicionado enquanto o Keychain cobrir esse registro.

## Alternativas consideradas

| Alternativa         | Prós                        | Contras                                                        | Motivo da rejeição                                     |
| ------------------- | --------------------------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| `expo-secure-store` | API curta, nome SecureStore | Peer `expo`; traz o runtime de módulos do Expo para um app CLI | Contradiz a stack sem Expo                             |
| AsyncStorage        | Simples, só JavaScript      | Texto sem criptografia do sistema                              | A sessão pede o cofre do sistema, não um arquivo claro |
| Arquivo no app      | Sem dependência             | Mesmo problema de texto claro, e outro formato para manter     | Não usa o cofre do sistema                             |

## Consequências

- **Positivas:** a sessão sobrevive ao fechamento do app e fica no cofre do sistema; a senha do JSON não é copiada para o aparelho.
- **Negativas:** módulo nativo; iOS e Android precisam de rebuild. O Jest não tem Keychain: teste que tocar o módulo precisa de mock.
- **Ações decorrentes:** dependência em `package.json`; `ios/Podfile.lock`; uso futuro restrito à sessão, sem espalhar o Keychain por feature.
