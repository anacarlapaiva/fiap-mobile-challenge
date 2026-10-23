# src/shared/components

Componentes de UI reutilizáveis e sem regra de negócio (design system): botões, inputs, textos, layouts.

- **Pode ficar aqui:** componentes genéricos, configurados só por props, com o teste ao lado (`Button.tsx` + `Button.test.tsx`).
- **Não pode ficar aqui:** componentes que conhecem uma feature, chamam APIs ou leem estado de domínio.
- `shared` não pode importar de `features` nem de `app` (regra imposta pelo ESLint).
