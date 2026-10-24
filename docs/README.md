# Documentação do AppFiap

Índice de toda a documentação do projeto. As regras operacionais para agentes de IA ficam em [AGENTS.md](../AGENTS.md).

## Projeto

| Documento                                        | Conteúdo                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------- |
| [arquitetura.md](arquitetura.md)                 | Visão geral, camadas, regras de dependência e diagrama              |
| [estrutura-de-pastas.md](estrutura-de-pastas.md) | Árvore completa, propósito de cada pasta e anatomia de uma feature  |
| [convencoes.md](convencoes.md)                   | Nomenclatura, imports com alias, testes, estilo, commits e branches |
| [fluxo-sdd.md](fluxo-sdd.md)                     | Ciclo de Spec-Driven Development usado no projeto                   |

## Decisões arquiteturais (ADR)

| ADR                                                     | Título                                |
| ------------------------------------------------------- | ------------------------------------- |
| [0000](adr/0000-template.md)                            | Template                              |
| [0001](adr/0001-arquitetura-feature-based.md)           | Arquitetura feature-based             |
| [0002](adr/0002-instrucoes-agnosticas-de-agente.md)     | Instruções agnósticas de agente       |
| [0003](adr/0003-reproducao-de-video-local.md)           | Reprodução de vídeo local             |
| [0004](adr/0004-animacoes-com-reanimated.md)            | Animações com Reanimated              |
| [0005](adr/0005-navegacao-com-react-navigation.md)      | Navegação com React Navigation        |
| [0006](adr/0006-sessao-no-keychain.md)                  | Sessão no Keychain                    |
| [0007](adr/0007-validar-com-zod.md)                     | Validar dados externos com Zod        |
| [0008](adr/0008-separar-contrato-em-dto-e-validacao.md) | Separar o contrato em DTO e validação |
| [0009](adr/0009-cache-do-mock-com-react-query.md)       | Cache do mock com React Query         |

## Specs

- [specs/README.md](specs/README.md): como criar uma spec nova.
- Templates: [spec.md](specs/_templates/spec.md), [plan.md](specs/_templates/plan.md), [tasks.md](specs/_templates/tasks.md).

## Instruções para agentes de IA

[ai/README.md](ai/README.md): estratégia multi-ferramenta, fluxos, skills e tabela de adaptadores.
