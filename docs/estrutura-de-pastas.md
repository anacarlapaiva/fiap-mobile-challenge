# Estrutura de pastas

## Árvore

```
.
├── AGENTS.md                  # instruções canônicas para agentes de IA
├── CLAUDE.md                  # adaptador do Claude Code (importa AGENTS.md)
├── README.md
├── index.js                   # registro do app (AppRegistry) -> src/app/App.tsx
├── app.json
├── babel.config.js            # preset RN + aliases (module-resolver) + plugin do worklets (último)
├── jest.config.js             # preset RN + aliases + resolver e transform do Reanimated e do svg
├── jest.setup.js              # setup de testes do Reanimated
├── react-native.config.js     # fontes registradas pelo react-native-asset
├── tsconfig.json              # strict + paths
├── .eslintrc.js               # regras de camadas (boundaries)
├── .prettierrc.js  .prettierignore
├── lint-staged.config.js      # comandos do pre-commit
├── .husky/pre-commit
├── .agents/skills/            # adaptadores de skills (Codex, Cursor, Antigravity)
├── .claude/                   # adaptadores do Claude Code (commands, skills)
├── .gemini/settings.json      # adaptador do Gemini CLI
├── .github/
│   ├── copilot-instructions.md
│   ├── prompts/               # prompts reutilizáveis do GitHub Copilot
│   └── rulesets/              # rulesets versionados das branches
├── android/  ios/             # projetos nativos (não alterar sem pedido explícito)
├── docs/                      # documentação (veja docs/README.md)
└── src/
    ├── app/
    │   ├── App.tsx
    │   ├── App.test.tsx
    │   ├── nativeLaunch.test.ts
    │   ├── providers/         # composição dos providers globais (safe area + tema)
    │   └── navigation/        # navegação raiz (React Navigation: stack e abas, ADR 0005)
    ├── features/
    │   └── splash/            # abertura animada (SplashScreen na API pública)
    ├── shared/
    │   ├── components/        # design system (spec 001 e 003): uma pasta por componente
    │   │   ├── Button/        # Button.tsx, Button.test.tsx, index.ts
    │   │   ├── Icon/          # Icon.tsx, Icon.test.tsx, icons.ts, index.ts
    │   │   ├── …              # Box, Text, Screen, Logo, PressableBox, PressableOpacity,
    │   │   │                  # TextField, TextButton, Card, Dropdown
    │   │   └── index.ts       # API pública de todos os componentes
    │   ├── dto/               # um arquivo por entidade do JSON (ADR 0008)
    │   │   ├── aula.dto.ts
    │   │   ├── agenda.dto.ts
    │   │   ├── disciplina.dto.ts
    │   │   ├── trimestre.dto.ts
    │   │   ├── boletim.dto.ts
    │   │   ├── aluno.dto.ts
    │   │   ├── responsavel.dto.ts
    │   │   └── index.ts
    │   ├── validation/        # um schema por entidade; a leitura do arquivo fica em responsavel.validation.ts
    │   ├── mocks/             # JSON local no lugar da API (responsaveis.json + readResponsaveis)
    │   ├── hooks/             # hooks genéricos
    │   ├── lib/               # utilitários e wrappers de bibliotecas (createVariantBox do Restyle)
    │   ├── theme/             # tema do Restyle: theme.ts (tokens, variants, sizes, motion) e fonts.ts
    │   ├── config/            # variáveis de ambiente e constantes
    │   └── types/             # tipos compartilhados que não são contrato externo
    └── assets/                # fontes, imagens, ícones e vídeos
        ├── fonts/             # Montserrat (4 pesos) + OFL.txt
        ├── images/            # logo.png exportado do Figma e a declaração de tipo ao lado
        └── videos/            # splash.mp4 e a declaração de tipo ao lado
```

As pastas `app/navigation/`, `shared/hooks/`, `shared/config/` e `shared/types/` ainda não existem no repositório: o git não versiona pastas vazias. Cada uma é criada pela primeira tarefa que precisar dela, seguindo a tabela abaixo.

## Propósito de cada pasta

| Pasta                    | Propósito                                                        | Não pode conter                                                            |
| ------------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `src/app/`               | Bootstrap, providers globais e navegação raiz                    | Telas e regras de negócio                                                  |
| `src/app/providers/`     | Composição dos providers (`AppProviders`)                        | Lógica de feature                                                          |
| `src/app/navigation/`    | Navigators e rotas raiz                                          | Telas (ficam nas features)                                                 |
| `src/features/`          | Uma pasta por domínio                                            | Código compartilhado entre features                                        |
| `src/shared/components/` | Componentes de UI genéricos, só por props                        | Componentes que conhecem uma feature, chamam API ou leem estado de domínio |
| `src/shared/hooks/`      | Hooks genéricos                                                  | Hooks de uma única feature                                                 |
| `src/shared/lib/`        | Utilitários e adaptadores de bibliotecas                         | Endpoints de uma feature                                                   |
| `src/shared/theme/`      | Tokens de design                                                 | Componentes                                                                |
| `src/shared/config/`     | Ponto único de acesso às variáveis de ambiente e constantes      | Segredos versionados                                                       |
| `src/shared/dto/`        | Contrato externo lido por mais de uma feature (`*.dto.ts`)       | Schema Zod, regra de tela e texto de interface                             |
| `src/shared/validation/` | Schema Zod do contrato compartilhado (`*.validation.ts`)         | Type do contrato e regra de tela                                           |
| `src/shared/mocks/`      | Dado local que substitui a API, lido pela validação              | Chamada HTTP, regra de tela e texto de interface                           |
| `src/shared/types/`      | Tipos sem dono de domínio e que não são contrato externo         | Tipos de uma feature e o JSON dos responsáveis                             |
| `src/assets/`            | Arquivos estáticos, em `fonts/`, `images/`, `icons/` e `videos/` | Código com lógica                                                          |
| `docs/`                  | Documentação viva do projeto                                     | Código executável                                                          |

## Anatomia de uma feature

```
src/features/<nome>/
├── screens/       # telas (ProfileScreen.tsx)
├── components/    # componentes usados só nesta feature
├── hooks/         # hooks da feature (useProfile.ts)
├── api/           # chamadas de rede da feature
├── dto/           # contrato externo só desta feature (`nome.dto.ts`)
├── validation/    # schema Zod desse contrato (`nome.validation.ts`)
├── store/         # estado da feature
├── types.ts       # tipos da feature que não são o contrato externo
└── index.ts       # API pública: única porta de entrada para outras camadas
```

Regras:

1. **`index.ts` é a API pública.** Exporta só o que outras camadas podem usar (telas para a navegação, hooks e tipos públicos). O resto é privado.
2. **Ninguém importa arquivos internos de outra feature.** `import { X } from '@/features/profile'` ✅ / `import { X } from '@/features/profile/hooks/useProfile'` ❌. O ESLint bloqueia o segundo caso.
3. **Teste só no arquivo que tem comportamento**, ao lado dele: `ProfileScreen.tsx` + `ProfileScreen.test.tsx`. DTO, `index.ts` e schema que só compõe outro não levam teste. Veja [convencoes.md](convencoes.md#testes).
4. Subpastas sem conteúdo não são criadas. A feature só tem as pastas de que precisa, mas `index.ts` é obrigatório.
5. Para criar uma feature, siga a skill [create-feature](ai/skills/create-feature/SKILL.md).
