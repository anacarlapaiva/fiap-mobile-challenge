# Spec 005: Login e rotas da sessão

- **Status:** Concluída
- **Autor:** Ana Carla Paiva
- **Aprovado por:** Ana Carla Paiva
- **Data:** 2026-10-24

## Problema

Depois da splash o app fica numa tela preta. O PDF pede login com o CPF e a senha do JSON local, sessão que sobrevive ao fecho do app, e uma área que o visitante não alcança sem essa sessão.

## Objetivo

A splash entrega o login quando não há sessão e a área autenticada quando há. O login só entra com um responsável do mock. O Sair apaga a sessão e o cache e volta ao login.

## Usuários

| Perfil              | Necessidade principal                        |
| ------------------- | -------------------------------------------- |
| Responsável do mock | Entrar com CPF e senha e sair quando quiser  |
| Visitante           | Ver o login, sem alcançar a área autenticada |

## Fluxos

### Fluxo principal

1. A splash termina e a leitura da sessão também.
2. Sem sessão, o app mostra o login.
3. A pessoa digita o CPF, que ganha a máscara `XXX.XXX.XXX-XX`, e a senha.
4. No toque em FAZER LOGIN, a primeira regra que falhar mostra a frase dela.
5. Se CPF e senha são de um responsável, o app grava `{ guardianId, studentRm }` no Keychain. `studentRm` é o do primeiro aluno.
6. A área autenticada mostra LOGOU e a faixa com SAIR. TROCAR PERFIL só aparece se esse responsável tem mais de um aluno.

### Fluxos alternativos

- Já existe sessão válida: a splash entrega a área autenticada, sem passar pelo login.
- Sessão gravada inválida (texto que não é o contrato, ou id/RM que não existem no mock): equivale a não haver sessão. O Keychain é apagado; se a apagação falhar, a memória mesmo assim fica sem sessão e a tela é o login.
- Sair: apaga o Keychain, limpa o cache do React Query e mostra o login. Se o Keychain falhar, a tela mesmo assim volta ao login e o cache é limpo.
- TROCAR PERFIL não abre tela neste corte.

## Critérios de aceite

- **CA-01:** **Dado** a splash concluída e nenhuma sessão, **Quando** a rota abre, **Então** a tela é o login.
- **CA-02:** **Dado** a splash concluída e uma sessão válida, **Quando** a rota abre, **Então** a tela mostra LOGOU.
- **CA-03:** **Dado** o login, **Quando** a pessoa digita dígitos no CPF, **Então** o campo mostra a máscara `XXX.XXX.XXX-XX`.
- **CA-04:** **Dado** o login, **Quando** FAZER LOGIN é tocado com o CPF vazio, **Então** aparece "Informe o CPF.".
- **CA-05:** **Dado** um CPF com quantidade de dígitos diferente de 11, **Quando** FAZER LOGIN é tocado, **Então** aparece "O CPF deve ter 11 dígitos.".
- **CA-06:** **Dado** um CPF com 11 dígitos iguais, **Quando** FAZER LOGIN é tocado, **Então** aparece "O CPF não pode ter todos os dígitos iguais.".
- **CA-07:** **Dado** um CPF cujo dígito verificador não fecha, **Quando** FAZER LOGIN é tocado, **Então** aparece "O CPF informado é inválido.".
- **CA-08:** **Dado** um CPF válido e a senha vazia, **Quando** FAZER LOGIN é tocado, **Então** aparece "Informe a senha.".
- **CA-09:** **Dado** um CPF válido e uma senha que não formam um responsável do mock, **Quando** FAZER LOGIN é tocado, **Então** aparece "CPF ou senha não conferem.".
- **CA-10:** **Dado** o CPF e a senha de um responsável do mock, **Quando** FAZER LOGIN é tocado, **Então** a sessão gravada tem o id desse responsável e o RM do primeiro aluno, e a área autenticada abre.
- **CA-11:** **Dado** a área autenticada de um responsável com mais de um aluno, **Quando** a tela é exibida, **Então** SAIR e TROCAR PERFIL aparecem. **Quando** o responsável tem um aluno, **Então** só SAIR aparece.
- **CA-12:** **Dado** TROCAR PERFIL visível, **Quando** o botão é tocado, **Então** a tela continua em LOGOU.
- **CA-13:** **Dado** a área autenticada, **Quando** SAIR é tocado, **Então** a sessão sai do Keychain, o cache do React Query fica vazio e o login volta. **Quando** o Keychain falha, **Então** o cache ainda é limpo e o login volta.
- **CA-14:** **Dado** um texto de sessão que não é o contrato, **Quando** ele é lido, **Então** o resultado é nenhuma sessão.
- **CA-15:** **Dado** uma sessão com id de responsável e RM, **Quando** o hook de usuário é lido, **Então** ele devolve esse responsável e o aluno desse RM. **Dado** nenhuma sessão, **Quando** o hook é lido, **Então** não há usuário.
- **CA-16:** **Dado** uma sessão com o formato do contrato cujo responsável ou aluno não está no mock, **Quando** a leitura termina, **Então** não há sessão, o Keychain é apagado e a tela é o login. **Quando** o Keychain falha ao apagar, **Então** a memória mesmo assim fica sem sessão e a tela é o login.

## Estados da interface

| Estado      | Quando ocorre                                               | O que o usuário vê                                         | Ação disponível                      |
| ----------- | ----------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------ |
| Carregando  | A splash ainda não terminou, ou a sessão ainda não foi lida | A splash                                                   | Nenhuma                              |
| Vazio       | Não se aplica                                               | O mock sempre tem responsáveis                             |                                      |
| Erro        | Uma regra do login falhou                                   | A frase da primeira regra, no corpo médio, cor de destaque | Corrigir e tocar FAZER LOGIN de novo |
| Sem conexão | Não se aplica                                               | Não há rede neste fluxo                                    | Sair funciona do mesmo jeito         |
| Sucesso     | Login aceito ou sessão já gravada                           | LOGOU, SAIR e, se couber, TROCAR PERFIL                    | Sair                                 |

## Regras de negócio e validações

- A comparação do CPF usa só os dígitos.
- A ordem das frases é: vazio, quantidade, dígitos iguais, verificador, senha vazia, par que não está no mock.
- A senha não é gravada.
- O aluno da sessão é o primeiro da lista.
- O hook de usuário lê o mock em cache e devolve o responsável do `guardianId` e o aluno do `studentRm`.
- O login e a restauração da sessão leem o mock pela mesma query do React Query. Não há uma segunda leitura solta.
- A splash só entrega a rota depois que a sessão foi lida e, se havia registro, conferida contra o mock.

## Fora do escopo

- Abas Aulas e Boletim, cabeçalho completo do Figma e a tela de escolha de aluno.
- O toque em TROCAR PERFIL não navega.
- Confirmação antes de sair.

## Perguntas em aberto

Nenhuma.
