# 0011. Detectar a internet com NetInfo

- **Status:** Aceito
- **Data:** 2026-10-24
- **Decisores:** Ana Carla Paiva

## Contexto

O projeto Firebase `app-fiap-cbb00` já tem Authentication e Firestore. O login que depende dessa conta não consegue conferir a credencial sem saída para a internet. O Sair e a sessão já gravada no Keychain continuam locais (ADR 0006 e ADR 0009): eles têm de funcionar sem rede. O React Native CLI não traz um detector de internet. A spec 005 não tinha frase para esse caso porque o mock era só local.

## Decisão

1. A presença de internet é lida com `@react-native-community/netinfo` 12.0.1.
2. Está sem internet quando `isConnected` ou `isInternetReachable` é `false`. `null` é desconhecido e não bloqueia o login.
3. Se a leitura nativa falha, o resultado é desconhecido: o login segue.
4. No FAZER LOGIN, essa conferência acontece antes da validação de CPF, e-mail e senha. Sem internet, a frase é "Sem conexão com a internet. Verifique sua rede e tente novamente." e a sessão não é gravada.
5. Restaurar a sessão, trocar de aluno e Sair não consultam a rede.

## Alternativas consideradas

| Alternativa                       | Prós                            | Contras                                                | Motivo da rejeição                                     |
| --------------------------------- | ------------------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| Tratar só `isConnected === false` | Não depende da sonda de alcance | Wifi sem saída para a internet passa como online       | O caso pedido é falta de internet, não só de interface |
| `fetch` para um host fixo         | Sem biblioteca                  | Outro ponto de falha e sem o estado do aparelho        | O CLI já tem o adaptador de rede                       |
| Bloquear o app inteiro numa tela  | A falta de rede fica óbvia      | Sair e a sessão já gravada deixam de funcionar offline | Esses fluxos são locais de propósito                   |

## Consequências

- **Positivas:** o login avisa a falta de internet no mesmo lugar das outras frases, e o Sair continua sem rede.
- **Negativas:** uma dependência nativa; o iOS precisa de `pod install` e de um rebuild para o módulo existir no aparelho.
- **Ações decorrentes:** dependência em `package.json`; adaptador em `src/shared/lib/reachability.ts`; frase no login.
