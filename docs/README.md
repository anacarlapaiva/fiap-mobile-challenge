# Documentação do AppFiap

Regras operacionais para agentes ficam em [AGENTS.md](../AGENTS.md). Esta pasta guarda o contrato do projeto, não o diário de implementação.

## Projeto

| Documento                                        | Conteúdo                                                      |
| ------------------------------------------------ | ------------------------------------------------------------- |
| [arquitetura.md](arquitetura.md)                 | Camadas, regras de dependência e diagrama                     |
| [estrutura-de-pastas.md](estrutura-de-pastas.md) | Papel de cada pasta e anatomia de uma feature                 |
| [convencoes.md](convencoes.md)                   | Nomenclatura, imports, testes, estilo, commits e branches     |
| [fluxo-sdd.md](fluxo-sdd.md)                     | Como uma feature nova nasce (spec → plano → tarefas → código) |

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

Contrato de produto. Spec concluída fica só com `spec.md`. Plano e tarefas existem apenas enquanto a spec está em implementação. Como criar uma nova: [specs/README.md](specs/README.md).

| Spec                                             | Contrato                         |
| ------------------------------------------------ | -------------------------------- |
| [001](specs/001-design-system/spec.md)           | Tema (valores do Figma)          |
| [002](specs/002-splash-screen/spec.md)           | Splash                           |
| [005](specs/005-login-e-rotas-da-sessao/spec.md) | Login, sessão e área autenticada |
| [006](specs/006-bottom-tabs/spec.md)             | Abas                             |
| [007](specs/007-schedule/spec.md)                | Agenda                           |

## Instruções para agentes de IA

[ai/README.md](ai/README.md): fluxos SDD, skills e adaptadores.
