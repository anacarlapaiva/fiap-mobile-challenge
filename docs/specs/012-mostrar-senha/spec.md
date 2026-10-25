# Spec 012: Mostrar a senha

- **Status:** Em implementação
- **Autor:** Ana Carla Paiva (com Claude Code)
- **Aprovado por:** Ana Carla Paiva (2026-10-25)
- **Data:** 2026-10-25

## O quê

O campo SENHA do login ganha um botão de olho que alterna entre mostrar a senha digitada e ocultá-la com asteriscos. Complementa a spec 005, que continua valendo para o resto do login.

## Critérios de aceite

- **CA-01:** **Dado** o login aberto, **Quando** a tela aparece, **Então** a senha está oculta com um asterisco por caractere e o botão de olho aparece à direita do campo SENHA.
- **CA-02:** **Dado** a senha oculta, **Quando** o olho é tocado, **Então** a senha digitada aparece como texto e o ícone passa a ser o olho riscado.
- **CA-03:** **Dado** a senha visível, **Quando** o olho riscado é tocado, **Então** a senha volta aos asteriscos e o ícone volta a ser o olho.
- **CA-04:** **Dado** a senha visível ou oculta, **Quando** o usuário digita ou apaga, **Então** o campo continua no mesmo estado e o valor enviado ao FAZER LOGIN é o mesmo.
- **CA-05:** **Dado** a senha visível, **Quando** FAZER LOGIN é tocado e aparece um erro, **Então** a senha continua visível.
- **CA-06:** **Dado** a senha visível, **Quando** o login é reaberto (por exemplo, depois de SAIR), **Então** a senha começa oculta.
- **CA-07:** **Dado** um leitor de tela ativo, **Quando** o foco chega no botão, **Então** ele é anunciado como botão com "Mostrar senha" se a senha está oculta e "Ocultar senha" se está visível.

## Regras

- O ícone tem a cor da linha vazia do campo (`inputLine`), tamanho `m`, e fica à direita do campo, na altura do valor. O valor continua centralizado.
- Com a senha oculta, o leitor de tela continua lendo só os asteriscos.

## Fora do escopo

- Olho em outros campos além de SENHA.
- Lembrar a escolha entre aberturas do login.
- Ocultar sozinho depois de um tempo.
