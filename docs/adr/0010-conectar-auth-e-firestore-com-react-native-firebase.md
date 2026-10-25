# 0010. Conectar Auth e Firestore com React Native Firebase

- **Status:** Aceito
- **Data:** 2026-10-24
- **Decisores:** Ana Carla Paiva

## Contexto

O corte do desafio pede Firebase Authentication e Cloud Firestore no lugar do JSON local. O app já é React Native CLI 0.88, sem Expo. Android e iOS já têm `google-services.json` e `GoogleService-Info.plist` do projeto `app-fiap-cbb00`. O login atual usa CPF; o PDF aceita e-mail no Firebase. A senha do mock não pode ir para o Firestore. Nova biblioteca estrutural de rede exige ADR antes do código.

## Decisão

1. O backend do app é o projeto Firebase `app-fiap-cbb00`, região `southamerica-east1`, plano Spark.
2. Authentication usa só o provedor E-mail/senha. Os usuários de demonstração são `gustavo-da-silva@example.com` / `123456` e `adelaide-silveira@example.com` / `987654`.
3. Cloud Firestore guarda a coleção `responsaveis` no mesmo formato do mock, sem o campo `senha`. O id do documento é o UID da conta (ADR 0012); o campo `id` do JSON permanece no documento.
4. Regras: o usuário autenticado lê só o documento cujo id é o UID do token (ADR 0012); ninguém escreve pelo cliente.
5. No app, a rede usa `@react-native-firebase/app`, `@react-native-firebase/auth` e `@react-native-firebase/firestore`. A query `['guardians']` (ADR 0009) troca o `queryFn` do JSON local pela leitura do Firestore e tenta de novo duas vezes se a leitura falhar. A sessão continua só no Keychain (ADR 0006).
6. A tela de login continua aceitando CPF ou e-mail. O Authentication é e-mail/senha: um CPF válido entra com o e-mail daquele responsável, achado num diretório local CPF → e-mail (`src/features/auth/data/loginDirectory.ts`), sem senha. O JSON da FIAP fica só como fixture dos testes e não entra no bundle.

## Alternativas consideradas

| Alternativa                            | Prós                  | Contras                                                    | Motivo da rejeição                             |
| -------------------------------------- | --------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| Continuar só com o JSON local          | Sem nativo, sem conta | O PDF exige Auth e Firestore                               | Fora do corte                                  |
| Chamar REST do Firebase sem SDK nativo | Menos Gradle/Pods     | Auth e Firestore no app nativo ficam manuais e frágeis     | O projeto já tem os arquivos nativos de config |
| Firebase JS SDK no React Native CLI    | Uma lib web           | Sem os módulos nativos que o CLI espera com os plists/JSON | Não é o caminho do RN CLI                      |

## Consequências

- **Positivas:** o app fala com o mesmo backend que o console; o JSON local vira fixture de teste, não fonte da verdade em runtime.
- **Negativas:** Gradle, Pods e rebuild nativo; o MCP/CLI do Firebase precisa de `firebase login` uma vez.
- **Android:** o Firebase Android BoM do RNFirebase 27 é compilado com Kotlin 2.4, então `kotlinVersion` em `android/build.gradle` é 2.4.0.
- **iOS:** o Firebase iOS 13 só é distribuído por SPM e exige `use_frameworks! :linkage => :dynamic` no `Podfile`.
- **Ações decorrentes:** aceitar este ADR; spec de login por e-mail; instalar os três pacotes com Yarn; ligar o plugin do Google Services no Android e o Pod no iOS (pedido explícito na implementação); trocar o `queryFn` de `['guardians']`; publicar regras e documentos no Firestore.
