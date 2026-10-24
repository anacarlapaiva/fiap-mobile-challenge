# Spec 006: Abas da área autenticada

- **Status:** Concluída
- **Autor:** Ana Carla Paiva (com Claude Code)
- **Aprovado por:** Ana Carla Paiva (2026-10-24)
- **Data:** 2026-10-24

## O quê

Rodapé com as abas AGENDA e BOLETIM abaixo do cabeçalho, idêntico ao Figma (normalizado). AGENDA mostra o conteúdo atual; BOLETIM mostra só o título da seção até a spec do boletim.

## Critérios de aceite

- **CA-01:** **Dado** a área autenticada, **Quando** ela abre, **Então** o rodapé mostra AGENDA e BOLETIM, AGENDA ativa, e o cabeçalho fica acima das abas.
- **CA-02:** **Dado** o rodapé, **Quando** renderizado, **Então** tem fundo `#262626` até a borda física, 64 de altura acima da área segura, e cada aba ocupa metade da largura com o ícone 24 a 11 do topo e o rótulo 4 abaixo, centralizados.
- **CA-03:** **Dado** uma aba ativa, **Quando** exibida, **Então** ícone e rótulo ficam na cor de destaque; a inativa fica branca.
- **CA-04:** **Dado** uma aba inativa, **Quando** tocada, **Então** a tela dela abre e o cabeçalho continua. **Quando** a aba ativa é tocada, **Então** a tela não muda.
- **CA-05:** **Dado** qualquer aba, **Quando** tocada, **Então** o ícone pulsa e a cor troca em 150 ms; com "Reduzir movimento" ligado, sem animação.
- **CA-06:** **Dado** a aba BOLETIM, **Quando** aberta, **Então** "BOLETIM" aparece no estilo de título de seção, centralizado, 64 abaixo do cabeçalho.
- **CA-07:** **Dado** a aba BOLETIM no Android, **Quando** o voltar é tocado, **Então** AGENDA volta.

## Regras

- Desalinhamentos do Figma normalizados: o grupo de BOLETIM está 1 abaixo do de AGENDA (vale 11) e os centros 98/310 viram metades iguais.

## Fora do escopo

- Conteúdo da agenda e do boletim, escolha de aluno, desabilitar aba.

## Verificação pendente

CA-05 (pulso e troca de cor) no aparelho e CA-07 no Android.
