# 0001. Adotar arquitetura feature-based com camadas impostas por lint

- **Status:** Aceito
- **Data:** 2026-10-23
- **Decisores:** time do AppFiap

## Contexto

O app é desenvolvido com Spec-Driven Development e abordagem AI-first: boa parte do código será escrita por agentes de IA de ferramentas diferentes, guiados por specs. Isso exige:

- uma estrutura previsível, em que cada spec mapeie para um lugar claro no código;
- isolamento entre domínios, para que uma feature possa ser alterada sem efeitos colaterais em outras;
- regras verificáveis por máquina, porque instruções em texto são seguidas de forma inconsistente por modelos e pessoas.

## Decisão

1. O código fica em `src/` e é dividido em quatro camadas: `app`, `features`, `shared` e `assets` (detalhes em [arquitetura.md](../arquitetura.md)).
2. Cada domínio de negócio é uma pasta em `src/features/<nome>/` com anatomia padrão e um `index.ts` como API pública única.
3. As regras de dependência entre camadas e o uso exclusivo do `index.ts` entre features são impostos pelo `eslint-plugin-boundaries`, com `default: 'disallow'` (tudo que não é explicitamente permitido é proibido).
4. Imports em `src/` usam sempre os aliases `@/app`, `@/features`, `@/shared` e `@/assets`, configurados em `tsconfig.json`, `babel.config.js` e `jest.config.js`; imports com `../` são bloqueados pelo ESLint (`no-restricted-imports`).
5. Husky + lint-staged rodam lint e typecheck no pre-commit, e `yarn validate` é a verificação de pronto.

## Alternativas consideradas

| Alternativa                                                                   | Prós                    | Contras                                                                                         | Motivo da rejeição                                     |
| ----------------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Organização por tipo técnico (`screens/`, `components/`, `services/` na raiz) | Simples no início       | Um domínio fica espalhado em várias pastas, acoplamento implícito, difícil mapear spec → código | Escala mal e dificulta o isolamento                    |
| Feature-Sliced Design completo (`entities`, `widgets`, `processes`…)          | Regras muito explícitas | Mais camadas do que o app precisa agora, curva de aprendizado                                   | Complexidade prematura; pode ser revisto em ADR futuro |
| Monorepo com pacotes por feature                                              | Isolamento máximo       | Custo alto de tooling em React Native CLI                                                       | Desproporcional ao tamanho atual                       |
| Regras só documentadas, sem lint                                              | Zero configuração       | Não garante nada; agentes e pessoas divergem                                                    | Contraria o objetivo de regras verificáveis            |

## Consequências

- **Positivas:** cada spec tem um destino claro; features são isoladas; violações de camada quebram o lint e o pre-commit, independentemente de quem escreve o código.
- **Negativas:** aliases precisam ser mantidos em três arquivos; o `index.ts` exige disciplina para não virar um barrel gigante; o typecheck no pre-commit roda o projeto inteiro e fica mais lento conforme o código cresce.
- **Ações decorrentes:** configuração em `.eslintrc.js`, `tsconfig.json`, `babel.config.js`, `jest.config.js`, `lint-staged.config.js` e `.husky/pre-commit`; documentação em [arquitetura.md](../arquitetura.md) e [estrutura-de-pastas.md](../estrutura-de-pastas.md).
