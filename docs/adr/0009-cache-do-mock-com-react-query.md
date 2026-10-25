# 0009. Cache do mock com React Query

- **Status:** Aceito (fonte de dados alterada pelo ADR 0010)
- **Data:** 2026-10-24
- **Decisores:** Ana Carla Paiva

## Contexto

O app lê o JSON local dos responsáveis no lugar de uma API. Login, a tela autenticada e o Sair precisam da mesma leitura, e o Sair tem de apagar dado privado que tenha ficado em memória. A sessão em si continua no Keychain (ADR 0006): ela decide a rota e não pode depender de um cache que some ao limpar.

## Decisão

1. O mock dos responsáveis é uma query do `@tanstack/react-query` 5.104.5, com a chave `['guardians']`.
2. A sessão `{ guardianId, studentRm }` não entra nesse cache.
3. O Sair apaga a sessão do Keychain, chama `queryClient.clear()` e volta ao login, mesmo se o Keychain falhar.
4. O `QueryClient` fica nos providers da aplicação. Queries não expiram. Desde o ADR 0010 a query `['guardians']` lê o Firestore e tenta de novo duas vezes; se ainda falhar, a tela mostra "TENTAR NOVAMENTE" e mantém o SAIR.

## Alternativas consideradas

| Alternativa                            | Prós                | Contras                                                               | Motivo da rejeição                        |
| -------------------------------------- | ------------------- | --------------------------------------------------------------------- | ----------------------------------------- |
| Ler o mock em cada tela, sem cache     | Nenhuma dependência | O Sair não tem um lugar único para apagar dado privado em memória     | O corte pede a limpeza do cache no logout |
| Guardar a sessão dentro do React Query | Um só lugar         | A rota depende de um cache que o Sair apaga, e a sessão deixa o cofre | A sessão já tem dono no ADR 0006          |

## Consequências

- **Positivas:** o mock é lido uma vez e o Sair esvazia o cache junto com a sessão.
- **Negativas:** uma dependência de runtime para um dado local. Quando existir API, a query troca a função, não a chave.
- **Ações decorrentes:** dependência em `package.json`; provider em `src/app/providers/`.
