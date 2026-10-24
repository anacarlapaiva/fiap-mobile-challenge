# Spec 005: Login, sessão e área autenticada

- **Status:** Concluída
- **Autor:** Ana Carla Paiva
- **Aprovado por:** Ana Carla Paiva
- **Data:** 2026-10-24

## O quê

Splash entrega login sem sessão e a área autenticada com sessão. Login só com responsável do mock. Sessão `{ guardianId, studentRm }` no Keychain; `studentRm` é o primeiro aluno. Senha não é gravada. Sair apaga Keychain e cache e volta ao login. O cabeçalho é chrome do `PrivateNavigator`: logo, TROCAR PERFIL e SAIR na barra de ações; saudação abaixo. Sem lista, o Empty mostra a ilustração e a frase.

## Critérios de aceite

- **CA-01:** **Dado** a splash concluída e nenhuma sessão, **Quando** a rota abre, **Então** a tela é o login.
- **CA-02:** **Dado** a splash concluída e uma sessão válida, **Quando** a rota abre, **Então** a tela autenticada aparece.
- **CA-03:** **Dado** o login, **Quando** a pessoa digita dígitos no CPF, **Então** o campo mostra a máscara `XXX.XXX.XXX-XX`.
- **CA-04:** **Dado** o login, **Quando** FAZER LOGIN é tocado com o CPF vazio, **Então** aparece "Informe o CPF.".
- **CA-05:** **Dado** um CPF com quantidade de dígitos diferente de 11, **Quando** FAZER LOGIN é tocado, **Então** aparece "O CPF deve ter 11 dígitos.".
- **CA-06:** **Dado** um CPF com 11 dígitos iguais, **Quando** FAZER LOGIN é tocado, **Então** aparece "O CPF não pode ter todos os dígitos iguais.".
- **CA-07:** **Dado** um CPF cujo dígito verificador não fecha, **Quando** FAZER LOGIN é tocado, **Então** aparece "O CPF informado é inválido.".
- **CA-08:** **Dado** um CPF válido e a senha vazia, **Quando** FAZER LOGIN é tocado, **Então** aparece "Informe a senha.".
- **CA-09:** **Dado** um CPF válido e uma senha que não formam um responsável do mock, **Quando** FAZER LOGIN é tocado, **Então** aparece "CPF ou senha não conferem.".
- **CA-10:** **Dado** o CPF e a senha de um responsável do mock, **Quando** FAZER LOGIN é tocado, **Então** a sessão gravada tem o id desse responsável e o RM do primeiro aluno, e a área autenticada abre.
- **CA-11:** **Dado** a área autenticada de um responsável com mais de um aluno, **Quando** a tela é exibida, **Então** SAIR e TROCAR PERFIL aparecem. **Quando** o responsável tem um aluno, **Então** só SAIR aparece.
- **CA-12:** **Dado** TROCAR PERFIL visível, **Quando** o botão é tocado, **Então** a sessão permanece. A tela que abre é a da spec 009.
- **CA-13:** **Dado** a área autenticada, **Quando** SAIR é tocado, **Então** a sessão sai do Keychain, o cache do React Query fica vazio e o login volta. **Quando** o Keychain falha, **Então** o cache ainda é limpo e o login volta.
- **CA-14:** **Dado** um texto de sessão que não é o contrato, **Quando** ele é lido, **Então** o resultado é nenhuma sessão.
- **CA-15:** **Dado** uma sessão com id de responsável e RM, **Quando** o hook de usuário é lido, **Então** ele devolve esse responsável e o aluno desse RM. **Dado** nenhuma sessão, **Quando** o hook é lido, **Então** não há usuário.
- **CA-16:** **Dado** uma sessão com o formato do contrato cujo responsável ou aluno não está no mock, **Quando** a leitura termina, **Então** não há sessão, o Keychain é apagado e a tela é o login. **Quando** o Keychain falha ao apagar, **Então** a memória mesmo assim fica sem sessão e a tela é o login.
- **CA-17:** **Dado** o cabeçalho, **Quando** renderizado, **Então** a barra de ações tem altura 48, margem lateral 16 e o logo pequeno 100×16; TROCAR PERFIL e SAIR ficam nessa barra; a saudação fica abaixo.
- **CA-18:** **Dado** o Gustavo com o Rafael, **Quando** o cabeçalho é exibido, **Então** aparecem "Olá, ", "GUSTAVO", "RAFAEL", "7EF - RM 12567 - Matutino", SAIR e TROCAR PERFIL.
- **CA-19:** **Dado** a Adelaide, **Quando** o cabeçalho é exibido, **Então** aparecem "Olá, ", "ADELAIDE", "BIANCA", "1EF - RM 13752 - Tarde" e SAIR, e TROCAR PERFIL não aparece.
- **CA-20:** **Dado** o estado vazio com uma frase, **Quando** renderizado, **Então** a ilustração ocupa 328×208 (menos em tela mais estreita, na proporção) sem distorção e a frase aparece 20 abaixo, no estilo de rótulo do campo, centralizada.
- **CA-21:** **Dado** o CPF e a senha de um responsável sem alunos, **Quando** FAZER LOGIN é tocado, **Então** aparece "Nenhum aluno vinculado a este responsável." e a sessão não é gravada.
- **CA-22:** **Dado** que o Keychain falha ao gravar, **Quando** FAZER LOGIN é tocado com o CPF e a senha de um responsável do mock, **Então** a sessão vale na memória, a área autenticada abre e nenhum erro aparece.
- **CA-23:** **Dado** que o Keychain não responde à leitura, **Quando** passam 3 s, **Então** não há sessão e a tela é o login; uma resposta que chega depois é ignorada.
- **CA-24:** **Dado** uma tela que falha ao renderizar, **Quando** a falha acontece, **Então** aparece, no fundo preto, "Algo deu errado." e o botão TENTAR NOVAMENTE, que monta as telas de novo.

## Regras

- CPF compara só dígitos. Frases nesta ordem: vazio, quantidade, dígitos iguais, verificador, senha vazia, par fora do mock, responsável sem alunos.
- Login e restauração leem o mock pela mesma query. A splash só entrega a rota depois da leitura (e conferência contra o mock, se havia registro).
- Sessão inválida ou órfã = sem sessão. Keychain apagado; se falhar, a memória fica sem sessão e a tela é o login.
- Nome do responsável: primeiro nome do JSON, maiúsculas. Aluno: o da sessão.
- Empty é genérico: só a frase. Null de nota/falta não usa Empty. Sem responsável sem alunos no JSON.

## Fora do escopo

- Abas, escolha de aluno, TROCAR PERFIL navegar, confirmar saída, célula nula.
