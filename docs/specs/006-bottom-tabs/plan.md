# Plano 006: Abas da área autenticada

- **Status:** Aprovado

## Abordagem

- `PrivateNavigator`: stack (`headerShown: false`) com a rota `Main`, que monta `Header` + `TabNavigator`. A escolha de aluno entra depois como rota irmã, sem cabeçalho nem rodapé. ADR 0005 item 5 ajustado.
- `TabNavigator`: `@react-navigation/bottom-tabs` com `tabBar` próprio, rotas `Agenda` (`LoggedScreen`) e `ReportCard` (`ReportCardScreen`).
- `TabBar` em `src/app/navigation/`: variants `tabBarVariants` no tema, pulso com `withSequence` e troca de cor por camadas com opacidade animada (Reanimated, `ReduceMotion.System` padrão).
- Feature nova `report-card` com `ReportCardScreen` (título da seção).
- Tema: espaçamentos 4, 11 e 64; `motion.pulseScale` 0,85. Spec 001 atualizada.

## CAs

- CA-02, CA-03, CA-04: `TabBar.test.tsx`. CA-01, CA-05, CA-06, CA-07: conferência no aparelho.

## Dependências novas

Nenhuma.

## ADRs

Nenhum novo; ajuste no 0005.
