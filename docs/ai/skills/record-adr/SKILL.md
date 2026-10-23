---
name: record-adr
description: Registra uma decisão arquitetural em docs/adr/ a partir do template, com contexto, decisão, alternativas e consequências. Use ao escolher biblioteca estrutural, padrão de estado, navegação, rede ou persistência, ou ao mudar camadas e regras de dependência.
---

# Registrar ADR

## Objetivo

Criar `docs/adr/NNNN-titulo.md` documentando uma decisão arquitetural e atualizar os documentos afetados.

## Entradas esperadas

- Descrição da decisão e do problema que ela resolve.
- Opcional: alternativas já avaliadas e ADR que a nova decisão substitui.

## Passos

1. Leia `AGENTS.md` (raiz do repositório), `docs/arquitetura.md` e o template `docs/adr/0000-template.md`.
2. Liste `docs/adr/` e leia os ADRs com status `Aceito` relacionados ao tema. Se a nova decisão contradiz um deles, ela o substitui: confirme isso com o usuário.
3. Colete com o usuário o que faltar para preencher o template: contexto, restrições, pelo menos duas alternativas com prós e contras e o motivo da escolha. Não invente prós, contras ou números.
4. Determine o próximo número: maior `NNNN` existente + 1, com quatro dígitos.
5. Crie `docs/adr/NNNN-titulo-em-kebab-case.md` a partir do template, com o título no imperativo, a data de hoje (AAAA-MM-DD) e `Status: Proposto`.
6. Se substituir um ADR, altere o status do antigo para `Substituído por NNNN`, com link para o novo.
7. Adicione o ADR à tabela "Decisões arquiteturais (ADR)" de `docs/README.md`.
8. Apresente o ADR ao usuário. Só altere o status para `Aceito` com aprovação explícita.
9. Depois de aceito, aplique as ações decorrentes em `docs/arquitetura.md`, `docs/estrutura-de-pastas.md`, `docs/convencoes.md` ou `AGENTS.md`, conforme o caso. Se a decisão mudar a configuração de lint, TypeScript, Babel ou Jest, essa mudança vira uma tarefa de implementação (`docs/ai/flows/implementar.md`).

## Critérios de conclusão

- O ADR existe, segue o template e está listado em `docs/README.md`.
- O ADR substituído, se houver, está marcado.
- Status `Aceito` somente com aprovação explícita, e documentos afetados atualizados.

## Em caso de dúvida

Pergunte ao usuário. Um ADR registra uma decisão já tomada pela equipe; o agente não decide sozinho.
