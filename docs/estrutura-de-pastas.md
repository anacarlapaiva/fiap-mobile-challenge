# Estrutura de pastas

## Árvore

```
.
├── AGENTS.md                  # instruções canônicas para agentes de IA
├── CLAUDE.md                  # adaptador do Claude Code (importa AGENTS.md)
├── README.md
├── index.js                   # registro do app (AppRegistry) -> src/app/App.tsx
├── app.json
├── babel.config.js            # preset RN + aliases (module-resolver)
├── jest.config.js             # preset RN + aliases (moduleNameMapper)
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
    │   ├── providers/         # composição dos providers globais
    │   └── navigation/        # navegação raiz (sem biblioteca ainda)
    ├── features/              # uma pasta por domínio (nenhuma ainda)
    ├── shared/
    │   ├── components/        # design system
    │   ├── hooks/             # hooks genéricos
    │   ├── lib/               # utilitários e wrappers de bibliotecas
    │   ├── theme/             # tokens de cor, espaçamento e tipografia
    │   ├── config/            # variáveis de ambiente e constantes
    │   └── types/             # tipos compartilhados
    └── assets/                # fontes, imagens e ícones
```

Cada pasta vazia de `src/` tem um `README.md` dizendo o que pode e o que não pode ficar ali.

## Propósito de cada pasta

| Pasta                    | Propósito                                     | Não pode conter                      |
| ------------------------ | --------------------------------------------- | ------------------------------------ |
| `src/app/`               | Bootstrap, providers globais e navegação raiz | Telas e regras de negócio            |
| `src/app/providers/`     | Composição dos providers (`AppProviders`)     | Lógica de feature                    |
| `src/app/navigation/`    | Navigators e rotas raiz                       | Telas (ficam nas features)           |
| `src/features/`          | Uma pasta por domínio                         | Código compartilhado entre features  |
| `src/shared/components/` | Componentes de UI genéricos                   | Componentes que conhecem uma feature |
| `src/shared/hooks/`      | Hooks genéricos                               | Hooks de uma única feature           |
| `src/shared/lib/`        | Utilitários e adaptadores de bibliotecas      | Endpoints de uma feature             |
| `src/shared/theme/`      | Tokens de design                              | Componentes                          |
| `src/shared/config/`     | Variáveis de ambiente e constantes            | Segredos versionados                 |
| `src/shared/types/`      | Tipos sem dono de domínio                     | Tipos de uma feature                 |
| `src/assets/`            | Arquivos estáticos                            | Código com lógica                    |
| `docs/`                  | Documentação viva do projeto                  | Código executável                    |

## Anatomia de uma feature

```
src/features/<nome>/
├── screens/       # telas (ProfileScreen.tsx)
├── components/    # componentes usados só nesta feature
├── hooks/         # hooks da feature (useProfile.ts)
├── api/           # chamadas de rede da feature
├── store/         # estado da feature
├── types.ts       # tipos da feature
└── index.ts       # API pública: única porta de entrada para outras camadas
```

Regras:

1. **`index.ts` é a API pública.** Exporta só o que outras camadas podem usar (telas para a navegação, hooks e tipos públicos). O resto é privado.
2. **Ninguém importa arquivos internos de outra feature.** `import { X } from '@/features/profile'` ✅ / `import { X } from '@/features/profile/hooks/useProfile'` ❌. O ESLint bloqueia o segundo caso.
3. **Testes ficam ao lado do arquivo testado**: `ProfileScreen.tsx` + `ProfileScreen.test.tsx`.
4. Subpastas sem conteúdo não são criadas. A feature só tem as pastas de que precisa, mas `index.ts` é obrigatório.
5. Para criar uma feature, siga a skill [create-feature](ai/skills/create-feature/SKILL.md).
