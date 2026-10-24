# Fluxo: escrever uma spec

## Objetivo

Gerar `docs/specs/NNN-nome/spec.md` curto, pronto para aprovação.

## Passos

1. Leia `AGENTS.md` e `docs/fluxo-sdd.md`.
2. Se já existir spec do mesmo assunto, pergunte se evolui a existente.
3. Pergunte só o que falta para os critérios de aceite e o fora do escopo. Uma rodada, no máximo 5 perguntas.
4. Próximo `NNN` (três dígitos) e nome em `kebab-case`. Confirme o nome.
5. Escreva `spec.md`:

```
# Spec NNN: Nome

- **Status:** Rascunho
- **Autor:**
- **Aprovado por:**
- **Data:** AAAA-MM-DD

## O quê

Uma ou duas frases.

## Critérios de aceite

- **CA-01:** **Dado** … **Quando** … **Então** …

## Fora do escopo

- …
```

Critérios verificáveis. Sem decisão de implementação. Sem seção vazia. Tabela ou regra só se o contrato precisar. 6. Mostre a spec. Só passe a `Aprovada` com aprovação explícita.

## Conclusão

Arquivo curto, critérios verificáveis, fora do escopo listado, status `Aprovada`.
