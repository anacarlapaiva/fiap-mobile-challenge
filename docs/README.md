# Documentação do AppFiap

Contrato do produto e das decisões. Para instalar e rodar, use o [README da raiz](../README.md).

## Produto (specs)

Todas as specs estão `Concluída` e ficam só com `spec.md`. Os números 003 e 004 não foram usados.

| Spec                                             | Contrato                              |
| ------------------------------------------------ | ------------------------------------- |
| [001](specs/001-design-system/spec.md)           | Tema (valores do Figma)               |
| [002](specs/002-splash-screen/spec.md)           | Splash                                |
| [005](specs/005-login-e-rotas-da-sessao/spec.md) | Login, sessão e área autenticada      |
| [006](specs/006-bottom-tabs/spec.md)             | Abas                                  |
| [007](specs/007-schedule/spec.md)                | Agenda                                |
| [008](specs/008-report-card/spec.md)             | Boletim                               |
| [009](specs/009-student-selection/spec.md)       | Escolha de aluno                      |
| [010](specs/010-logout-confirmation/spec.md)     | Confirmar a saída                     |
| [011](specs/011-firebase-account/spec.md)        | Conta Firebase e dados do responsável |

## Decisões (ADRs)

| ADR                                                                     | Título                                     |
| ----------------------------------------------------------------------- | ------------------------------------------ |
| [0001](adr/0001-arquitetura-feature-based.md)                           | Arquitetura feature-based                  |
| [0002](adr/0002-instrucoes-agnosticas-de-agente.md)                     | Instruções agnósticas de agente            |
| [0003](adr/0003-reproducao-de-video-local.md)                           | Reprodução de vídeo local                  |
| [0004](adr/0004-animacoes-com-reanimated.md)                            | Animações com Reanimated                   |
| [0005](adr/0005-navegacao-com-react-navigation.md)                      | Navegação com React Navigation             |
| [0006](adr/0006-sessao-no-keychain.md)                                  | Sessão no Keychain                         |
| [0007](adr/0007-validar-com-zod.md)                                     | Validar dados externos com Zod             |
| [0008](adr/0008-separar-contrato-em-dto-e-validacao.md)                 | Separar o contrato em DTO e validação      |
| [0009](adr/0009-cache-do-mock-com-react-query.md)                       | Cache dos responsáveis com React Query     |
| [0010](adr/0010-conectar-auth-e-firestore-com-react-native-firebase.md) | Auth e Firestore com React Native Firebase |
| [0011](adr/0011-detectar-internet-com-netinfo.md)                       | Detectar a internet com NetInfo            |
| [0012](adr/0012-identificar-responsavel-pelo-uid.md)                    | Identificar o responsável pelo UID         |

## Arquitetura

| Documento                                        | Conteúdo                                                  |
| ------------------------------------------------ | --------------------------------------------------------- |
| [arquitetura.md](arquitetura.md)                 | Camadas, regras de dependência e diagrama                 |
| [estrutura-de-pastas.md](estrutura-de-pastas.md) | Papel de cada pasta e anatomia de uma feature             |
| [convencoes.md](convencoes.md)                   | Nomenclatura, imports, testes, estilo, commits e branches |

## Spec-Driven Development

O desafio pede desenvolvimento com IA de forma estruturada. O ciclo spec → plano → tarefas → código está em [fluxo-sdd.md](fluxo-sdd.md). As regras e a stack usadas pelos agentes ficam em [AGENTS.md](../AGENTS.md). Fluxos e skills canônicos: [ai/README.md](ai/README.md).
