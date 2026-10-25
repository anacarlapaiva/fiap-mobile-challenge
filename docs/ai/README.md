# Instruções para agentes de IA

O desafio pede desenvolvimento com IA de forma estruturada (SDD). As regras do repositório ficam em [AGENTS.md](../../AGENTS.md). Esta pasta guarda os fluxos e as skills que os agentes executam.

## Estratégia

Decisão em [ADR 0002](../adr/0002-instrucoes-agnosticas-de-agente.md):

1. **[AGENTS.md](../../AGENTS.md)** na raiz é a fonte única das regras.
2. **Conteúdo canônico** fica aqui, em markdown puro: `flows/` (passo a passo de cada etapa do SDD) e `skills/` (formato [Agent Skills](https://agentskills.io/specification)).
3. **Adaptadores** são arquivos mínimos no formato de cada ferramenta. Só apontam para o conteúdo canônico; não duplicam regras.

## Conteúdo canônico

| Arquivo                                                          | Uso                                                       |
| ---------------------------------------------------------------- | --------------------------------------------------------- |
| [flows/spec.md](flows/spec.md)                                   | Gerar `docs/specs/NNN-nome/spec.md`                       |
| [flows/plano.md](flows/plano.md)                                 | Gerar `plan.md` a partir de uma spec aprovada             |
| [flows/tarefas.md](flows/tarefas.md)                             | Quebrar o plano em `tasks.md`                             |
| [flows/implementar.md](flows/implementar.md)                     | Implementar uma tarefa com testes e validação             |
| [flows/atualizar-docs.md](flows/atualizar-docs.md)               | Revisar contrato em `docs/` quando ele divergir do código |
| [skills/create-feature/SKILL.md](skills/create-feature/SKILL.md) | Criar a estrutura de uma feature nova                     |
| [skills/record-adr/SKILL.md](skills/record-adr/SKILL.md)         | Registrar uma decisão arquitetural                        |

## Adaptadores

| Ferramenta                 | Onde aponta para este conteúdo                                     |
| -------------------------- | ------------------------------------------------------------------ |
| Claude Code                | `CLAUDE.md`, `.claude/commands/`, `.claude/skills/`                |
| Cursor, Codex, Antigravity | `AGENTS.md`, `.agents/skills/`                                     |
| GitHub Copilot             | `AGENTS.md`, `.github/copilot-instructions.md`, `.github/prompts/` |
| Gemini CLI                 | `.gemini/settings.json` (`context.fileName: ["AGENTS.md"]`)        |

Manutenção: [AGENTS.md](../../AGENTS.md#manutenção-destas-instruções).
