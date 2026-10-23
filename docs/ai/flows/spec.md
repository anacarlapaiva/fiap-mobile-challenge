# Fluxo: escrever uma spec

## Objetivo

Transformar uma ideia de feature em `docs/specs/NNN-nome/spec.md`, sem ambiguidades, pronta para aprovação.

## Entradas esperadas

- Descrição da feature dada pelo usuário (uma frase já basta para começar).
- Opcional: links, telas de referência e restrições de negócio.

## Passos

1. Leia `AGENTS.md` (raiz do repositório), `docs/fluxo-sdd.md` e `docs/specs/README.md`.
2. Leia o template `docs/specs/_templates/spec.md`.
3. Liste `docs/specs/` e verifique se já existe spec para o mesmo assunto. Se existir, pergunte ao usuário se deve evoluir a existente ou criar uma nova.
4. Leia `docs/arquitetura.md` e os `index.ts` das features existentes em `src/features/`, para entender o que o app já faz.
5. Entreviste o usuário, **uma rodada de perguntas por vez** (no máximo 5 perguntas por rodada), cobrindo cada seção do template:
   - problema e evidência;
   - objetivo e como medir sucesso;
   - perfis de usuário;
   - fluxo principal e alternativos;
   - regras de negócio e validações;
   - estados de carregamento, vazio, erro, sem conexão e sucesso;
   - o que fica fora do escopo.
6. Repita o passo 5 até não haver nenhuma resposta vaga ("depende", "talvez", "o de sempre"). Sempre que perceber uma ambiguidade, faça uma pergunta fechada, com opções.
7. Determine o próximo `NNN` (maior número existente + 1, três dígitos) e um nome em inglês, em `kebab-case` (ex.: `001-email-login`). Confirme o nome com o usuário.
8. Crie `docs/specs/NNN-nome/spec.md` a partir do template, preenchendo todas as seções:
   - critérios de aceite numerados (`CA-01`…), no formato **Dado / Quando / Então**, cada um verificável por teste;
   - nenhuma decisão de implementação (bibliotecas, componentes, endpoints inventados);
   - `Status: Rascunho`.
9. Apresente a spec ao usuário e liste as perguntas em aberto que restarem.
10. Aplique as correções pedidas. Só altere o status para `Aprovada` quando o usuário aprovar explicitamente.

## Critérios de conclusão

- O arquivo existe em `docs/specs/NNN-nome/spec.md` e segue o template.
- Toda seção está preenchida ou marcada como "Não se aplica", com o motivo.
- "Perguntas em aberto" está vazia.
- O usuário aprovou explicitamente e o status é `Aprovada`.

## Em caso de dúvida

Pergunte ao usuário. Nunca preencha uma seção com suposição. Se o usuário não souber responder, registre o item em "Perguntas em aberto" e não marque a spec como aprovada.
