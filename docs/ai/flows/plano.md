# Fluxo: gerar o plano técnico

## Objetivo

Gerar `docs/specs/NNN-nome/plan.md` a partir de uma spec aprovada, respeitando a arquitetura, e parar para revisão.

## Entradas esperadas

- Caminho da spec (`docs/specs/NNN-nome/spec.md`) ou o identificador `NNN`.

## Passos

1. Leia `AGENTS.md` (raiz do repositório).
2. Leia a spec indicada. Se o `Status` não for `Aprovada`, **pare** e informe o usuário.
3. Leia `docs/arquitetura.md`, `docs/estrutura-de-pastas.md`, `docs/convencoes.md` e os ADRs em `docs/adr/`.
4. Leia `package.json` para saber quais dependências já existem.
5. Leia o código relacionado: o `index.ts` das features que a spec toca e o conteúdo de `src/shared/` que pode ser reaproveitado.
6. Crie `docs/specs/NNN-nome/plan.md` só com o que a spec precisa: abordagem, arquivos, CAs cobertos, dependências novas (ou "Nenhuma"), ADRs a criar (ou "Nenhuma"). `Status: Rascunho`. Sem seção vazia.
7. Verifique se o plano viola alguma regra de `docs/arquitetura.md`. Se a spec só puder ser atendida violando uma regra, não viole: descreva o conflito no plano e pergunte ao usuário.
8. **Pare.** Apresente o plano ao usuário e aguarde a revisão. Não crie `tasks.md` nem código.
9. Aplique as correções pedidas. Só altere o status para `Aprovado` quando o usuário aprovar explicitamente.

## Critérios de conclusão

- O arquivo `docs/specs/NNN-nome/plan.md` existe. Seções vazias foram omitidas.
- Todos os critérios de aceite da spec estão cobertos.
- Nenhuma dependência sem justificativa e nenhuma violação de arquitetura.
- O usuário aprovou explicitamente e o status é `Aprovado`.

## Em caso de dúvida

Pergunte ao usuário. Se a spec estiver ambígua, proponha a alteração da spec em vez de decidir no plano. Se faltar uma informação técnica (contrato de API, por exemplo), registre-a em "Riscos e mitigação" e peça ao usuário.
