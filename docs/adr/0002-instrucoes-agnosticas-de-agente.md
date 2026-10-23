# 0002. Manter instruções para agentes neutras, com adaptadores finos por ferramenta

- **Status:** Aceito
- **Data:** 2026-10-23
- **Decisores:** time do AppFiap

## Contexto

O projeto será desenvolvido com várias ferramentas de IA (Claude Code, Codex, Cursor, GitHub Copilot, Gemini CLI, Antigravity e outras). Cada uma procura instruções, comandos e skills em caminhos e formatos próprios. Copiar as regras para cada formato gera divergência: uma regra é atualizada em um lugar e esquecida nos outros.

## Decisão

1. **Fonte única de verdade:** [AGENTS.md](../../AGENTS.md) na raiz, em markdown puro, sem sintaxe exclusiva de ferramenta. Ele é lido nativamente por Codex, Cursor, GitHub Copilot e Antigravity.
2. **Conteúdo canônico** dos fluxos e skills em [docs/ai/](../ai/README.md): fluxos em `docs/ai/flows/*.md` e skills no formato aberto [Agent Skills](https://agentskills.io/specification) em `docs/ai/skills/<nome>/SKILL.md`.
3. **Adaptadores finos**: cada ferramenta recebe só o mínimo para descobrir o conteúdo canônico (um import, um ponteiro "Leia e siga <caminho>" ou uma configuração). Adaptadores nunca contêm regras.
4. Os caminhos dos adaptadores foram confirmados na documentação oficial de cada ferramenta. A tabela fica em [docs/ai/README.md](../ai/README.md).
5. **Única duplicação aceita:** os adaptadores de skill copiam o `name` e a `description` do frontmatter da skill canônica, porque as ferramentas descobrem skills por esses campos. Portanto um adaptador só muda quando o caminho, o nome ou a descrição da skill canônica mudar.

## Alternativas consideradas

| Alternativa                                                                    | Prós                                     | Contras                                                                                 | Motivo da rejeição                   |
| ------------------------------------------------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------ |
| Arquivos completos por ferramenta (`CLAUDE.md`, `.cursor/rules`, `GEMINI.md`…) | Usa todos os recursos de cada ferramenta | Regras duplicadas, divergência garantida                                                | Custo de manutenção e inconsistência |
| Apenas `AGENTS.md`, sem adaptadores                                            | Zero duplicação                          | Ferramentas sem leitura nativa ficam sem contexto; sem comandos nem skills descobríveis | Perde descoberta de fluxos e skills  |
| Links simbólicos para AGENTS.md                                                | Um único arquivo físico                  | Suporte inconsistente no Windows, em clones e entre ferramentas                         | Frágil                               |

## Consequências

- **Positivas:** uma regra é alterada em um único lugar e vale para todas as ferramentas; trocar ou adicionar ferramenta custa só um adaptador.
- **Negativas:** recursos exclusivos (ex.: hooks do Claude Code, regras com glob do Cursor) não são usados no conteúdo canônico; o frontmatter das skills é duplicado; ferramentas que leem `.agents/skills` e `.claude/skills` (ex.: Cursor) podem listar a mesma skill duas vezes.
- **Ações decorrentes:** manter a tabela de adaptadores em [docs/ai/README.md](../ai/README.md) e revisar os caminhos quando uma ferramenta mudar a sua convenção.
