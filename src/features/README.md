# src/features

Uma pasta por domínio de negócio (ex.: `auth`, `profile`). Ainda não existe nenhuma feature.

- **Pode ficar aqui:** pastas de feature que seguem a anatomia padrão (`screens/`, `components/`, `hooks/`, `api/`, `store/`, `types.ts`, `index.ts`).
- **Não pode ficar aqui:** código usado por mais de uma feature (vai para `src/shared/`) e arquivos soltos fora de uma pasta de feature.
- O `index.ts` de cada feature é a única API pública dela. Importar arquivos internos de outra feature é bloqueado pelo ESLint (`boundaries/dependencies`).
- Para criar uma feature, siga [docs/ai/skills/create-feature/SKILL.md](../../docs/ai/skills/create-feature/SKILL.md).

Veja [docs/estrutura-de-pastas.md](../../docs/estrutura-de-pastas.md#anatomia-de-uma-feature).
