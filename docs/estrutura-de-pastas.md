# Estrutura de pastas

A árvore descreve pastas e o papel delas. Arquivos internos não entram aqui: o código é a fonte.

```
.
├── AGENTS.md
├── android/  ios/
├── docs/
└── src/
    ├── app/                 # bootstrap, providers, navegação raiz
    │   ├── navigation/
    │   └── providers/
    ├── features/
    │   ├── splash/
    │   ├── auth/
    │   ├── schedule/
    │   └── report-card/
    ├── shared/
    │   ├── components/      # uma pasta por componente do design system
    │   ├── hooks/
    │   ├── dto/
    │   ├── validation/
    │   ├── mocks/           # fixture dos testes
    │   ├── theme/
    │   └── lib/
    └── assets/
        ├── fonts/
        ├── images/
        └── videos/
```

## Propósito de cada pasta

| Pasta                    | Propósito                                                                 | Não pode conter                                                            |
| ------------------------ | ------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `src/app/`               | Bootstrap, providers globais e navegação raiz                             | Telas e regras de negócio                                                  |
| `src/app/providers/`     | Composição dos providers (`AppProviders`)                                 | Lógica de feature                                                          |
| `src/app/navigation/`    | Navigators e rotas raiz                                                   | Telas (ficam nas features)                                                 |
| `src/features/`          | Uma pasta por domínio                                                     | Código compartilhado entre features                                        |
| `src/shared/components/` | Componentes de UI genéricos, só por props                                 | Componentes que conhecem uma feature, chamam API ou leem estado de domínio |
| `src/shared/hooks/`      | Hooks genéricos                                                           | Hooks de uma única feature                                                 |
| `src/shared/lib/`        | Utilitários e adaptadores de bibliotecas                                  | Endpoints de uma feature                                                   |
| `src/shared/theme/`      | Tokens de design                                                          | Componentes                                                                |
| `src/shared/dto/`        | Contrato externo lido por mais de uma feature (`*.dto.ts`)                | Schema Zod, regra de tela e texto de interface                             |
| `src/shared/validation/` | Schema Zod do contrato compartilhado (`*.validation.ts`)                  | Type do contrato e regra de tela                                           |
| `src/shared/mocks/`      | Fixture dos testes (JSON da FIAP). Nunca importado por código de produção | Chamada de rede, regra de tela e texto de interface                        |
| `src/assets/`            | Arquivos estáticos, em `fonts/`, `images/` e `videos/`                    | Código com lógica                                                          |
| `docs/`                  | Contrato do projeto (arquitetura, specs, ADRs, convenções)                | Código executável                                                          |

## Anatomia de uma feature

```
src/features/<nome>/
├── screens/
├── components/
├── hooks/
├── data/              # acesso ao Firebase e dados locais da feature
├── session/           # só em auth
├── validation/
├── types.ts
└── index.ts
```

Regras:

1. **`index.ts` é a API pública.** Exporta só o que outras camadas podem usar. O resto é privado.
2. **Ninguém importa arquivos internos de outra feature.** O ESLint bloqueia.
3. **Teste só o arquivo que decide**, ao lado dele, uma vez. DTO, `index.ts`, tema e quem só encaminha não levam teste. Veja [convencoes.md](convencoes.md#testes).
4. Subpastas sem conteúdo não são criadas. `index.ts` é obrigatório. Splash, por exemplo, tem só `screens/`.
5. Para criar uma feature, siga a skill [create-feature](ai/skills/create-feature/SKILL.md).
