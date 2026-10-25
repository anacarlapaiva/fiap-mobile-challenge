# Spec 011: Conta Firebase e dados do responsável

- **Status:** Concluída
- **Autor:** Ana Carla Paiva
- **Aprovado por:** Ana Carla Paiva
- **Data:** 2026-10-24

## O quê

Quem entra com o e-mail e a senha da conta, ou com o CPF de um responsável conhecido e a senha, recebe o documento desse e-mail no Firestore. Agenda, boletim e alunos vêm desse documento. A senha é conferida só pelo Firebase Authentication. Nem o app nem o documento guardam senha: o login por CPF usa um diretório local CPF → e-mail, sem senha.

## Critérios de aceite

- **CA-01:** **Dado** um CPF conhecido e uma senha preenchida, **Quando** o login é avaliado, **Então** a tentativa usa o e-mail desse CPF.
- **CA-02:** **Dado** um e-mail válido, **Quando** o login é avaliado, **Então** a tentativa segue para a conta, em minúsculas.
- **CA-03:** **Dado** a conta recusa a credencial, **Quando** a falha chega, **Então** a frase é "CPF ou senha incorretos." ou "E-mail ou senha incorretos.", sem dizer qual dos dois falhou.
- **CA-04:** **Dado** a rede falha depois da conferência local, **Quando** a falha chega, **Então** a frase é "Sem conexão com a internet. Verifique sua rede e tente novamente."
- **CA-05:** **Dado** a conta aceita e o documento não chega ou não é o contrato, **Quando** a leitura termina, **Então** a frase é "Não foi possível carregar seus dados. Tente novamente." e a sessão não fica gravada.
- **CA-06:** **Dado** a conta do Gustavo, **Quando** a leitura termina, **Então** chega só o documento desse e-mail, com alunos e sem a senha.
- **CA-07:** **Dado** um documento do responsável autenticado, **Quando** a sessão é montada, **Então** ela usa o id dele e o RM do primeiro aluno. **Dado** um responsável sem alunos, **Quando** a sessão é montada, **Então** a frase é "Não encontramos alunos vinculados à sua conta."
- **CA-08:** **Dado** a sessão aberta e a rede indisponível ao ler o documento, **Quando** a agenda ou o boletim mostra o erro, **Então** a frase é "Sem conexão com a internet. Verifique sua rede e tente novamente." Com rede, a frase continua "Não foi possível carregar seus dados. Tente novamente."

## Fora do escopo

- Cadastro de conta nova, recuperação de senha e escrita no Firestore.
- Trocar as frases de CPF, e-mail vazio e senha vazia da spec 005.
