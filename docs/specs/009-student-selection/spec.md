# Spec 009: Escolha de aluno

- **Status:** Concluída
- **Autor:** Ana Carla Paiva
- **Aprovado por:** Ana Carla Paiva (2026-10-24)
- **Data:** 2026-10-24

## O quê

TROCAR PERFIL abre, por cima da área autenticada, a tela "Escolha o perfil / que você quer visualizar" (Figma `2:5`), com um card por aluno do responsável. Escolher um aluno troca o aluno da sessão, regrava a sessão no Keychain, volta para a aba em que a pessoa estava e confirma a troca com uma mensagem de sucesso. Substitui o CA-12 da spec 005: TROCAR PERFIL agora navega.

## Critérios de aceite

- **CA-01:** **Dado** o Gustavo com o Rafael, **Quando** TROCAR PERFIL é tocado, **Então** a tela de escolha sobe de baixo para cima em tela cheia, sem cabeçalho e sem rodapé, e mostra "FECHAR" com o ícone X, o título "Escolha o perfil" / "que você quer visualizar" e, nesta ordem, os cards `RAFAEL DA SILVA` / `7EF - RM 12567 - Matutino` e `JOANA DA SILVA` / `2EM - RM 12568 - Matutino`.
- **CA-02:** **Dado** a tela de escolha, **Quando** exibida, **Então** só o card do aluno da sessão tem a borda de 1 na cor de destaque.
- **CA-03:** **Dado** a tela de escolha, **Quando** renderizada, **Então** FECHAR fica a 16 do topo da área segura e 16 da direita; o título fica 169 abaixo da linha do FECHAR, centralizado, no estilo de saudação; o primeiro card fica 64 abaixo do título; os cards têm altura 90, raio 8, margem lateral 16 e 16 entre eles; o texto do card fica a 16 da esquerda, do topo e da base, com o nome em corpo médio e a linha `turma - RM nº - período` em corpo.
- **CA-04:** **Dado** a tela de escolha, **Quando** FECHAR é tocado, o voltar do Android é usado ou a tela é arrastada para baixo no iOS, **Então** a tela desce, a sessão não muda e a aba anterior continua.
- **CA-05:** **Dado** a tela de escolha com o Rafael na sessão, **Quando** o card da Joana é tocado, **Então** a borda passa do Rafael para a Joana com fade e o card pulsa (escala 0,85 e volta, 150 ms em cada sentido), sem trocar a sessão durante o pulso. Ao fim do pulso, o card da Joana mostra um indicador de carregamento até a troca terminar; então a tela desce. O cabeçalho mostra `JOANA` e `2EM - RM 12568 - Matutino`, a sessão gravada no Keychain é `{ guardianId: 1, studentRm: 12568 }` e a aba anterior continua aberta.
- **CA-06:** **Dado** o Rafael no BOLETIM com o `1º TRIMESTRE` de `7EF - 2025` aberto e a AGENDA em `17 de março, segunda-feira`, **Quando** a Joana é escolhida, **Então** o BOLETIM continua aberto, em `2EM - 2025`, com os cards fechados e a lista no topo; a AGENDA volta ao primeiro dia. Um ano que a Joana não tem (`6EF - 2024`) também não sobra.
- **CA-07:** **Dado** a tela de escolha, **Quando** o card do aluno da sessão é tocado, **Então** o card pulsa e a tela desce, sem gravar a sessão, sem zerar as abas e sem mensagem.
- **CA-08:** **Dado** um card tocado, **Quando** outro card ou FECHAR é tocado antes de a tela fechar, **Então** o toque é ignorado: a sessão troca uma vez e a tela fecha uma vez.
- **CA-09:** **Dado** a Joana escolhida, **Quando** o app é fechado e aberto de novo, **Então** a área autenticada abre com a Joana.
- **CA-10:** **Dado** que o Keychain falha ao gravar, **Quando** a Joana é escolhida, **Então** a troca vale na memória e nenhum erro aparece.
- **CA-11:** **Dado** um RM que não é de um aluno do responsável da sessão, **Quando** a troca é pedida, **Então** nada muda e nada é gravado.
- **CA-12:** **Dado** uma troca com a gravação no Keychain ainda em andamento, **Quando** SAIR é tocado, **Então** a sessão é apagada só depois dessa gravação e o app reaberto vai para o login.
- **CA-13:** **Dado** "Reduzir movimento" ligado, **Quando** um card é tocado, **Então** não há pulso nem fade, e a tela fecha logo em seguida.
- **CA-14:** **Dado** a tela de escolha, **Quando** lida por leitor de tela, **Então** o título é cabeçalho, FECHAR é botão com o rótulo "Fechar" e cada card é botão com o rótulo `RAFAEL DA SILVA, 7EF - RM 12567 - Matutino`, com estado selecionado só no aluno da sessão.
- **CA-15:** **Dado** a troca para a Joana concluída, **Quando** a tela desce, **Então** aparece no topo, abaixo da área segura, a mensagem `Perfil alterado para JOANA` (primeiro nome em maiúsculas), que some sozinha em 2,5 s ou ao ser tocada. A mensagem tem fundo `#262626`, raio 8, barra de 4 na cor de destaque à esquerda, texto em corpo branco, margem lateral 16 e padding 16.

## Regras

- Ordem dos cards: a do JSON. Nome: `primeiroNome sobrenome` em maiúsculas pt-BR. Linha: `turma - RM rm - periodo`, igual ao cabeçalho.
- A borda do selecionado só aparece com fade em uma troca; ao abrir a tela ela já está no lugar.
- Título e cards rolam se não couberem; FECHAR fica fixo.
- Trocar de aluno zera o estado das duas abas (dia, ano, trimestre, disciplinas, rolagem). A aba ativa não muda.
- Desalinhamento do Figma (linha do 2º card em 29) normalizado em 16 dentro do card.
- Pulso igual ao das abas, compartilhado.
- Ordem da troca: borda e pulso na tela de escolha; troca da sessão (e remontagem das abas) ainda com a tela de escolha por cima; a tela desce; a mensagem aparece. Nada pesado roda durante o pulso.
- A gravação no Keychain não segura a tela: a troca termina quando a memória muda.

## Fora do escopo

- Responsável sem alunos, adicionar ou remover aluno, confirmar a troca, lembrar a aba ou o dia por aluno.
