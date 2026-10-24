# Estrutura de pastas

A árvore descreve pastas e o papel delas. Arquivos internos não entram aqui: o código é a fonte.

```
.
├── AGENTS.md
├── android/  ios/
├── docs/
└── src/
    ├── app/                 # bootstrap, providers, navegação raiz
    ├── features/
    │   ├── splash/
    │   ├── auth/
    │   ├── schedule/
    │   └── report-card/
    ├── shared/
    │   ├── components/      # uma pasta por componente do design system
    │   ├── dto/
    │   ├── validation/
    │   ├── mocks/
    │   ├── theme/
    │   └── lib/
    └── assets/
        ├── fonts/
        ├── images/
        └── videos/
```

`shared/hooks/`, `shared/config/` e `shared/types/` ainda não existem. Cada uma nasce na primeira tarefa que precisar dela.

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
| `docs/`                  | Contrato do projeto (arquitetura, specs, ADRs, convenções)       | Código executável                                                          |

## Anatomia de uma feature

```
src/features/<nome>/
├── screens/
├── components/
├── hooks/
├── session/
├── api/
├── dto/
├── validation/
├── store/
├── types.ts
└── index.ts
```

Regras:

1. **`index.ts` é a API pública.** Exporta só o que outras camadas podem usar. O resto é privado.
2. **Ninguém importa arquivos internos de outra feature.** O ESLint bloqueia.
3. **Teste só o arquivo que decide**, ao lado dele, uma vez. DTO, `index.ts`, tema e quem só encaminha não levam teste. Veja [convencoes.md](convencoes.md#testes).
4. Subpastas sem conteúdo não são criadas. `index.ts` é obrigatório.
5. Para criar uma feature, siga a skill [create-feature](ai/skills/create-feature/SKILL.md).
