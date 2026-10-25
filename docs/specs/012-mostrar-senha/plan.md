# Plano: Spec 012 — Mostrar a senha

- **Status:** Aprovado
- **Spec:** [spec.md](spec.md)
- **Data:** 2026-10-25

## Abordagem

O comportamento fica todo no `TextField` de `@/shared/components`, que já decide a máscara do campo `secure`. O `LoginScreen` não muda: o campo SENHA já usa `secure`.

- `TextField` ganha o estado local `revealed` (começa `false`), usado só quando `secure`.
  - Oculto: mantém o comportamento atual (asteriscos desenhados, texto nativo transparente, cursor desenhado, `accessibilityValue` com a máscara).
  - Visível: não desenha a máscara nem o cursor, o `TextInput` mostra o texto com a cor normal e o cursor nativo. `secureTextEntry` fica `false` e `selection` deixa de ser forçada.
  - Como o estado é local, um novo render com outro valor ou com mensagem de erro não o altera (CA-04, CA-05), e reabrir o login monta um campo novo, que começa oculto (CA-06).
- Botão do olho: `PressableOpacity` com `accessibilityRole="button"` e `accessibilityLabel` "Mostrar senha" / "Ocultar senha", conforme o estado (CA-07). Ele fica dentro da caixa `value`, em posição absoluta à direita e centralizado na altura do valor, com `hitSlop` para chegar a uma área de toque de 44 pt.
  - Os textos ficam fixos no `TextField`, porque o único campo `secure` do app é a senha.
- Ícones novos `eye` e `eyeOff` em `icons.ts`, desenhados a partir de "visibility" e "visibility_off" do Material Icons (licença Apache 2.0), já que o Figma não tem esse ícone. O `Icon` usa cor `inputLine` e tamanho `m`.
- Para o valor continuar centralizado sem passar por baixo do ícone, o `TextInput` e a máscara ganham o mesmo recuo horizontal dos dois lados quando `secure`. Esse recuo é a largura do ícone mais um espaço novo do tema.
- Novas variants em `textFieldVariants` (`toggle` para a posição do botão) e, se preciso, um token de espaçamento para o recuo. Nenhum valor solto no componente.

## Arquivos

| Arquivo                                              | Mudança                                                  |
| ---------------------------------------------------- | -------------------------------------------------------- |
| `src/shared/components/Icon/icons.ts`                | Ícones `eye` e `eyeOff`                                  |
| `src/shared/theme/theme.ts`                          | Variant `toggle` em `textFieldVariants` e token de recuo |
| `src/shared/components/TextField/TextField.tsx`      | Estado `revealed`, botão do olho, recuo no modo `secure` |
| `src/shared/components/TextField/TextField.test.tsx` | Casos dos CAs                                            |
| `docs/README.md`                                     | Linha da spec 012 na tabela de specs, ao concluir        |

## Critérios de aceite cobertos

Os testes ficam todos em `TextField.test.tsx`, porque o `TextField` é quem decide. O `LoginScreen` só repassa `secure` e não ganha teste.

| CA    | Teste                                                                                                |
| ----- | ---------------------------------------------------------------------------------------------------- |
| CA-01 | Campo `secure` renderizado: máscara com asteriscos e botão com ícone `eye`                           |
| CA-02 | Toque no botão: sem máscara, `TextInput` com o valor visível e sem `secureTextEntry`, ícone `eyeOff` |
| CA-03 | Segundo toque: máscara e `secureTextEntry` de volta, ícone `eye`                                     |
| CA-04 | Visível, digitar chama `onChangeText` com o texto e o campo continua visível                         |
| CA-05 | Visível, um novo render do pai continua visível                                                      |
| CA-06 | Um campo montado de novo começa oculto (mesmo caso do CA-01, montagem nova)                          |
| CA-07 | `accessibilityRole="button"` e o rótulo "Mostrar senha" / "Ocultar senha" conforme o estado          |

## Dependências novas

Nenhuma.

## ADRs a criar

Nenhum.

## Riscos e mitigação

- **Troca de `secureTextEntry` com o campo focado:** no iOS, essa troca pode apagar o texto ou mover o cursor. A mitigação é testar no aparelho, mantendo o foco e o valor controlado pelo `value`.
- **Senha longa visível:** o texto passa da largura do campo. O `TextInput` rola na horizontal como hoje, e o recuo impede que o texto passe por baixo do ícone.
