# 0012. Identificar o responsável no Firestore pelo UID da conta

- **Status:** Aceito
- **Data:** 2026-10-25
- **Decisores:** Ana Carla Paiva

## Contexto

O ADR 0010 ligou Auth e Firestore com documentos `1` e `2` e leitura por e-mail. A sessão e o JSON da FIAP continuam usando o campo numérico `id`. A regra por e-mail depende da caixa do endereço e exige uma query. O UID da conta já identifica o usuário autenticado e não muda se o e-mail mudar.

## Decisão

1. O id do documento em `responsaveis` é o UID do Firebase Authentication.
2. O campo `id` do documento permanece `1` ou `2`, no contrato do JSON da FIAP. A sessão no Keychain continua `{ guardianId, studentRm }` com esse `id` (ADR 0006).
3. A leitura no app é `getDoc` do documento cujo id é `currentUser.uid`.
4. Regras: o usuário autenticado lê só `/responsaveis/{uid}` quando `request.auth.uid == uid`. Ninguém escreve pelo cliente.
5. O login por CPF continua no diretório local (ADR 0010). O Authentication permanece e-mail/senha.

## Alternativas consideradas

| Alternativa                        | Prós                       | Contras                                             | Motivo da rejeição                  |
| ---------------------------------- | -------------------------- | --------------------------------------------------- | ----------------------------------- |
| Manter documentos `1`/`2` e e-mail | Sem migração               | Query extra; regra acoplada ao e-mail               | O UID já é a identidade da conta    |
| Guardar o UID só num campo `uid`   | Não muda o id do documento | Continua precisando de query ou de regra por e-mail | O id do documento já pode ser o UID |

## Consequências

- **Positivas:** uma leitura por `getDoc`; a regra não depende do e-mail; o contrato numérico da FIAP permanece no campo `id`.
- **Negativas:** os documentos atuais `1` e `2` precisam ser copiados para o UID de cada conta e apagados depois.
- **Ações decorrentes:** publicar as regras; migrar os dois documentos; trocar a leitura em `account.ts`.
