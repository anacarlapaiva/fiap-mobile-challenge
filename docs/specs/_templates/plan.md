# Plano NNN: Nome da feature

- **Status:** Rascunho
- **Spec:** [spec.md](spec.md)
- **Aprovado por:**
- **Data:** AAAA-MM-DD

## Resumo da solução

Dois ou três parágrafos explicando a abordagem técnica.

## Estrutura de arquivos

Caminhos que serão criados ou alterados, seguindo a anatomia de [estrutura-de-pastas.md](../../estrutura-de-pastas.md#anatomia-de-uma-feature).

```
src/features/<nome>/
├── screens/
├── …
└── index.ts
```

## Telas

| Tela | Arquivo | Critérios de aceite atendidos |
| ---- | ------- | ----------------------------- |
|      |         | CA-01                         |

## Componentes

| Componente | Local (`feature` ou `shared`) | Responsabilidade |
| ---------- | ----------------------------- | ---------------- |
|            |                               |                  |

## Dados e tipos

Modelos e tipos principais (o que vai em `types.ts`).

## APIs

| Método | Endpoint | Request | Response | Erros tratados |
| ------ | -------- | ------- | -------- | -------------- |
|        |          |         |          |                |

## Estado

O que é estado local, o que é estado da feature (`store/`) e o que é cache de servidor. Onde cada um fica.

## API pública da feature (`index.ts`)

O que será exportado e quem consome.

## Impacto em outras features e em `shared`

| Área afetada | Mudança | Risco |
| ------------ | ------- | ----- |
|              |         |       |

## Dependências novas

Toda biblioteca nova precisa de justificativa aqui. Sem justificativa, a dependência não entra.

| Pacote | Versão | Por que é necessário | Alternativas avaliadas | Exige ADR? |
| ------ | ------ | -------------------- | ---------------------- | ---------- |
|        |        |                      |                        |            |

Escreva "Nenhuma" se não houver.

## Riscos e mitigação

| Risco | Probabilidade | Impacto | Mitigação |
| ----- | ------------- | ------- | --------- |
|       |               |         |           |

## Decisões arquiteturais

ADRs que precisam ser criados em `docs/adr/`, ou "Nenhuma".
