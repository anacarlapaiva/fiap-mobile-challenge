# Fluxo: sincronizar a documentação com o código

## Objetivo

Comparar o estado real do repositório com `docs/` e `AGENTS.md` e corrigir o que estiver desatualizado, sem mudar código.

## Entradas esperadas

- Opcional: escopo (uma pasta, uma feature ou um documento específico). Sem escopo, revise tudo.

## Passos

1. Leia `AGENTS.md` (raiz do repositório) e `docs/README.md`.
2. Levante o estado real:
   - árvore de `src/` (pastas e arquivos `index.ts`);
   - `package.json` (versões, scripts, dependências);
   - `tsconfig.json`, `babel.config.js`, `jest.config.js`, `.eslintrc.js`, `lint-staged.config.js`, `.husky/`;
   - pastas em `docs/specs/` e `docs/adr/`;
   - adaptadores de ferramentas listados em `docs/ai/README.md`.
3. Compare cada documento com o estado real:

   | Documento                     | Verificar                                                                  |
   | ----------------------------- | -------------------------------------------------------------------------- |
   | `AGENTS.md`                   | versões da stack, comandos, lista de fluxos e skills                       |
   | `docs/arquitetura.md`         | camadas e regras de dependência iguais às de `.eslintrc.js`                |
   | `docs/estrutura-de-pastas.md` | árvore igual à real                                                        |
   | `docs/convencoes.md`          | aliases iguais aos três arquivos de configuração                           |
   | `docs/README.md`              | todos os documentos e ADRs listados                                        |
   | `docs/ai/README.md`           | todos os adaptadores existentes listados e apontando para caminhos válidos |
   | `docs/specs/*/tasks.md`       | tarefas marcadas coerentes com o código existente                          |

4. Verifique se todos os links relativos dos arquivos `.md` apontam para arquivos existentes.
5. Verifique se nenhum adaptador de ferramenta contém regras (só ponteiros, além do `name` e da `description` das skills).
6. Liste as divergências encontradas ao usuário, separando:
   - **documentação desatualizada**: corrija o documento;
   - **código fora da regra documentada**: não corrija o código; informe o usuário e sugira uma spec ou tarefa.
7. Corrija os documentos desatualizados.
8. Rode `yarn validate` para garantir que nada além de documentação mudou e que tudo continua passando.

## Critérios de conclusão

- Nenhuma divergência restante entre documentação e código, exceto as reportadas como "código fora da regra".
- Todos os links relativos são válidos.
- O usuário recebeu a lista do que foi corrigido e do que foi apenas reportado.

## Em caso de dúvida

Se não estiver claro se o correto é o código ou o documento, não altere nenhum dos dois: pergunte ao usuário. Decisões arquiteturais registradas em `docs/adr/` prevalecem sobre o código.
