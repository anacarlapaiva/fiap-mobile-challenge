# Spec 010: Confirmar a saída

- **Status:** Concluída
- **Autor:** Ana Carla Paiva (com Claude Code)
- **Aprovado por:** Ana Carla Paiva (2026-10-24)
- **Data:** 2026-10-24

## O quê

Tocar em SAIR abre um alerta nativo do sistema que pede confirmação antes de encerrar a sessão. Substitui o item "confirmar saída" do fora do escopo da spec 005; o CA-13 da spec 005 passa a valer depois da confirmação.

## Critérios de aceite

- **CA-01:** **Dado** a área autenticada, **Quando** SAIR é tocado, **Então** aparece o alerta nativo com o título "Sair da conta?", a mensagem "Você vai precisar entrar de novo com CPF e senha." e os botões "Cancelar" e "Sair", e a sessão continua.
- **CA-02:** **Dado** o alerta aberto, **Quando** "Sair" é tocado, **Então** a sessão sai do Keychain, o cache é limpo e o login volta (CA-13 da spec 005).
- **CA-03:** **Dado** o alerta aberto, **Quando** "Cancelar" é tocado, ou no Android o toque fora do alerta ou o voltar, **Então** o alerta fecha e a sessão e a tela não mudam.

## Regras

- "Cancelar" tem o estilo de cancelamento do sistema e "Sair" o estilo destrutivo (vermelho no iOS).

## Fora do escopo

- Alerta com o visual do tema, confirmar outras ações.

## Verificação pendente

CA-03 no Android (toque fora e voltar). CA-01 e o cancelamento conferidos no simulador iOS.
