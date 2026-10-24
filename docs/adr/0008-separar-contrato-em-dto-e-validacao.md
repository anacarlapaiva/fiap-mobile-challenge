# 0008. Separar o contrato em DTO e validação

- **Status:** Aceito
- **Data:** 2026-10-24
- **Decisores:** Ana Carla Paiva

## Contexto

O JSON dos responsáveis é lido por mais de um domínio (acesso, aulas e boletim). O [ADR 0007](0007-validar-com-zod.md) já exige Zod nessa borda. O type do contrato e o schema estavam no mesmo arquivo, e o type nascia do schema. O formato do dado fica em `dto/`, escrito como interface; a checagem em runtime fica em outra pasta.

## Decisão

1. O contrato externo é uma interface com sufixo `Dto`, em um `*.dto.ts` por entidade. Fica em `src/shared/dto/` quando mais de uma feature lê o mesmo dado, ou em `src/features/<nome>/dto/` quando só uma feature é dona. O JSON dos responsáveis está em `aula`, `agenda`, `disciplina`, `trimestre`, `boletim`, `aluno` e `responsavel`.
2. O schema Zod de cada entidade fica em `*.validation.ts` de mesmo nome, na pasta `validation/` ao lado (`src/shared/validation/` ou `src/features/<nome>/validation/`).
3. O schema declara `satisfies z.ZodType<Dto>`, então ele só compila se produzir o type do DTO.
4. Quem lê o dado externo chama a função da validação (`parseGuardians`). O erro continua sendo `ZodError` (ADR 0007).

## Alternativas consideradas

| Alternativa                                            | Prós                                              | Contras                                             | Motivo da rejeição                                       |
| ------------------------------------------------------ | ------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------- |
| Type derivado com `z.infer` no mesmo arquivo do schema | Uma definição só, sem risco de os dois divergirem | Mistura o formato do dado com a checagem de runtime | O type do contrato e o schema de runtime ficam separados |
| Pasta `schemas/`                                       | Nome curto                                        | O pedido foi uma pasta de validação                 | O papel é o mesmo; o nome fica `validation/`             |

## Consequências

- **Positivas:** o DTO descreve o JSON sem Zod; a validação é a única borda que aceita `unknown`.
- **Negativas:** o type e o schema são dois arquivos. O `satisfies` segura a divergência no typecheck, não na revisão visual.
- **Ações decorrentes:** um arquivo por entidade em `src/shared/dto/` e o schema correspondente em `src/shared/validation/`; a leitura do arquivo continua em `parseGuardians`. O item 3 do ADR 0007 aponta para esta decisão.
