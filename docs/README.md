# Documentação do AppFiap

Índice de toda a documentação do projeto. As regras operacionais para agentes de IA ficam em [AGENTS.md](../AGENTS.md).

## Projeto

| Documento                                        | Conteúdo                                                           |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| [arquitetura.md](arquitetura.md)                 | Visão geral, camadas, regras de dependência e diagrama             |
| [estrutura-de-pastas.md](estrutura-de-pastas.md) | Árvore completa, propósito de cada pasta e anatomia de uma feature |
| [convencoes.md](convencoes.md)                   | Nomenclatura, imports com alias, testes, commits e branches        |
| [fluxo-sdd.md](fluxo-sdd.md)                     | Ciclo de Spec-Driven Development usado no projeto                  |

## Decisões arquiteturais (ADR)

| ADR                                                 | Título                          |
| --------------------------------------------------- | ------------------------------- |
| [0000](adr/0000-template.md)                        | Template                        |
| [0001](adr/0001-arquitetura-feature-based.md)       | Arquitetura feature-based       |
| [0002](adr/0002-instrucoes-agnosticas-de-agente.md) | Instruções agnósticas de agente |

## Specs

- [specs/README.md](specs/README.md): como criar uma spec nova.
- Templates: [spec.md](specs/_templates/spec.md), [plan.md](specs/_templates/plan.md), [tasks.md](specs/_templates/tasks.md).

## Instruções para agentes de IA

[ai/README.md](ai/README.md): estratégia multi-ferramenta, fluxos, skills e tabela de adaptadores.
