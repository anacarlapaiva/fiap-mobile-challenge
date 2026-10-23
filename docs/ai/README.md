# Instruções para agentes de IA

## Estratégia multi-ferramenta

O projeto é usado com várias ferramentas de IA. Para que todas sigam as mesmas regras sem duplicação (decisão em [ADR 0002](../adr/0002-instrucoes-agnosticas-de-agente.md)):

1. **[AGENTS.md](../../AGENTS.md)** na raiz é a fonte única das regras.
2. **Conteúdo canônico** fica neste diretório, em markdown puro:
   - `flows/`: passo a passo de cada etapa do SDD;
   - `skills/`: skills no formato aberto [Agent Skills](https://agentskills.io/specification) (pasta com `SKILL.md` e frontmatter `name` + `description`).
3. **Adaptadores** são arquivos mínimos, no formato que cada ferramenta exige, que só apontam para o conteúdo canônico. As regras de manutenção estão em [AGENTS.md](../../AGENTS.md#manutenção-destas-instruções).

Cada fluxo e cada skill é autocontido: um modelo que receba apenas o caminho do arquivo consegue executá-lo do início ao fim.

## Conteúdo canônico

| Arquivo                                                          | Uso                                                                |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| [flows/spec.md](flows/spec.md)                                   | Entrevistar o usuário e gerar `docs/specs/NNN-nome/spec.md`        |
| [flows/plano.md](flows/plano.md)                                 | Gerar `plan.md` a partir de uma spec aprovada e parar para revisão |
| [flows/tarefas.md](flows/tarefas.md)                             | Quebrar o plano em `tasks.md`                                      |
| [flows/implementar.md](flows/implementar.md)                     | Implementar uma tarefa com testes, validação e documentação        |
| [flows/atualizar-docs.md](flows/atualizar-docs.md)               | Corrigir documentação desatualizada em relação ao código           |
| [skills/create-feature/SKILL.md](skills/create-feature/SKILL.md) | Criar a estrutura de uma feature nova                              |
| [skills/record-adr/SKILL.md](skills/record-adr/SKILL.md)         | Registrar uma decisão arquitetural                                 |

## Adaptadores por ferramenta

Caminhos confirmados na documentação oficial de cada ferramenta em 2026-10-23.

| Ferramenta                              | Arquivo adaptador                                                                                | O que ele aponta                                                                 | Fonte                                                                                                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Claude Code                             | `CLAUDE.md`                                                                                      | Importa `AGENTS.md` (`@AGENTS.md`)                                               | [Memory](https://code.claude.com/docs/en/memory)                                                                                                       |
| Claude Code                             | `.claude/commands/<fluxo>.md` (`/spec`, `/plano`, `/tarefas`, `/implementar`, `/atualizar-docs`) | `docs/ai/flows/<fluxo>.md`, repassando a entrada do usuário (`$ARGUMENTS`)       | [Skills](https://code.claude.com/docs/en/skills): formato antigo, que "still works" e funciona igual às skills; `$ARGUMENTS` é documentado para skills |
| Claude Code                             | `.claude/skills/<skill>/SKILL.md`                                                                | `docs/ai/skills/<skill>/SKILL.md`                                                | [Skills](https://code.claude.com/docs/en/skills)                                                                                                       |
| Codex                                   | `AGENTS.md` (nativo)                                                                             | —                                                                                | [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)                                                                              |
| Codex                                   | `.agents/skills/<skill>/SKILL.md`                                                                | `docs/ai/skills/<skill>/SKILL.md`                                                | [Skills](https://learn.chatgpt.com/docs/build-skills)                                                                                                  |
| Cursor                                  | `AGENTS.md` (nativo, inclusive em subpastas)                                                     | —                                                                                | [Rules](https://cursor.com/docs/context/rules)                                                                                                         |
| Cursor                                  | `.agents/skills/` e `.claude/skills/` (lidos nativamente)                                        | `docs/ai/skills/<skill>/SKILL.md`                                                | [Skills](https://cursor.com/docs/context/skills)                                                                                                       |
| GitHub Copilot                          | `AGENTS.md` (nativo no VS Code, Copilot CLI e cloud agent)                                       | —                                                                                | [Suporte a instruções](https://docs.github.com/en/copilot/reference/custom-instructions-support)                                                       |
| GitHub Copilot                          | `.github/copilot-instructions.md`                                                                | `AGENTS.md` (para superfícies que não leem `AGENTS.md`)                          | [Instruções do repositório](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)                      |
| GitHub Copilot                          | `.github/prompts/<fluxo>.prompt.md`                                                              | `docs/ai/flows/<fluxo>.md`, repassando a entrada do usuário (`${input:entrada}`) | [Prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)                                                                  |
| Gemini CLI                              | `.gemini/settings.json` (`context.fileName: ["AGENTS.md"]`)                                      | `AGENTS.md`                                                                      | [GEMINI.md](https://geminicli.com/docs/cli/gemini-md/), [Configuração](https://geminicli.com/docs/reference/configuration/)                            |
| Antigravity (sucessor do Gemini CLI)    | `AGENTS.md` (nativo)                                                                             | —                                                                                | [Rules](https://antigravity.google/docs/rules)                                                                                                         |
| Antigravity                             | `.agents/skills/<skill>/SKILL.md`                                                                | `docs/ai/skills/<skill>/SKILL.md`                                                | [Skills](https://antigravity.google/docs/skills)                                                                                                       |
| Outras ferramentas que leem `AGENTS.md` | —                                                                                                | —                                                                                | —                                                                                                                                                      |

### Não configurado de propósito

| Item                                                          | Motivo                                                                                                                                                                                       |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GEMINI.md`                                                   | O Antigravity combina `GEMINI.md` e `AGENTS.md`, o que duplicaria as regras; o Gemini CLI já lê `AGENTS.md` via `.gemini/settings.json`.                                                     |
| `.cursor/commands/`                                           | O caminho não consta na documentação atual do Cursor, que orienta migrar comandos para skills. No Cursor, os fluxos são acessados pelo `AGENTS.md` ("leia e siga docs/ai/flows/<fluxo>.md"). |
| Comandos do Gemini CLI (`.gemini/commands/*.toml`) e do Codex | Os fluxos já são acessíveis pelo `AGENTS.md`; podem ser adicionados como adaptadores no futuro.                                                                                              |

### Limitações conhecidas

- **Claude Code e `AGENTS.md` em subpastas:** com um `CLAUDE.md` na raiz, o Claude Code não carrega sozinho o `AGENTS.md` de subpastas. O `AGENTS.md` raiz já exige que o agente leia o `AGENTS.md` local antes de editar uma pasta.
- **Skills duplicadas no Cursor:** o Cursor lê `.agents/skills/` e `.claude/skills/`, então cada skill pode aparecer duas vezes. As duas apontam para o mesmo conteúdo canônico.

## Como usar em qualquer ferramenta

Sem adaptador, basta pedir ao agente: "Leia e siga `docs/ai/flows/implementar.md` para a tarefa T03 de `docs/specs/001-login`".

## Adicionando um fluxo ou uma skill

Passos (as regras de manutenção estão em [AGENTS.md](../../AGENTS.md#manutenção-destas-instruções)):

1. crie o arquivo canônico em `flows/` ou `skills/<nome>/SKILL.md`;
2. crie os adaptadores correspondentes (comando do Claude Code, prompt do Copilot, skills em `.claude/skills/` e `.agents/skills/`);
3. atualize as tabelas deste arquivo e as listas de `AGENTS.md`.
