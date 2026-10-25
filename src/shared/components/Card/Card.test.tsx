import { ThemeProvider } from '@shopify/restyle';
import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { Card } from '@/shared/components/Card';
import { Text } from '@/shared/components/Text';
import { theme } from '@/shared/theme';

async function render(element: ReactElement) {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider theme={theme}>{element}</ThemeProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  const root = renderer.root;
  const byTestId = (id: string) =>
    root.findAllByType(View).find(node => node.props.testID === id);
  return {
    root,
    cardStyle: StyleSheet.flatten(byTestId('card')?.props.style),
    border: byTestId('card-selected-border'),
    pressables: root.findAll(
      node => typeof node.props.onPressIn === 'function',
    ),
  };
}

describe('card', () => {
  describe('dado um card selecionado', () => {
    test('quando renderizado, então a borda acento tem 1', async () => {
      const view = await render(
        <Card testID="card" selected paddingHorizontal="m" onPress={jest.fn()}>
          <Text>ALUNO</Text>
        </Card>,
      );

      expect(view.cardStyle).toMatchObject({
        height: theme.sizes.cardHeight,
        borderRadius: theme.borderRadii.m,
        backgroundColor: theme.colors.card,
        paddingHorizontal: theme.spacing.m,
      });
      expect(StyleSheet.flatten(view.border?.props.style)).toMatchObject({
        position: 'absolute',
        borderWidth: 1,
        borderColor: theme.colors.accent,
      });
    });
  });

  describe('dado um card sem seleção', () => {
    test('quando renderizado, então não há borda e o conteúdo permanece no lugar', async () => {
      const selected = await render(
        <Card testID="card" selected paddingHorizontal="m" onPress={jest.fn()}>
          <Text>ALUNO</Text>
        </Card>,
      );
      const plain = await render(
        <Card testID="card" paddingHorizontal="m" onPress={jest.fn()}>
          <Text>ALUNO</Text>
        </Card>,
      );

      expect(plain.border).toBeUndefined();
      expect(plain.cardStyle).toEqual(selected.cardStyle);
    });
  });

  describe('dado um card com ação', () => {
    test('quando tocado, então a ação é chamada', async () => {
      const onPress = jest.fn();
      const view = await render(
        <Card testID="card" onPress={onPress}>
          <Text>1º TRIMESTRE</Text>
        </Card>,
      );

      const pressable = view.pressables.slice(-1)[0];
      await ReactTestRenderer.act(() => {
        pressable?.props.onPress({});
      });

      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('dado um card expansível', () => {
    test('quando aberto, então anuncia seleção e expansão', async () => {
      const view = await render(
        <Card testID="card" expanded onPress={jest.fn()}>
          <Text>1º TRIMESTRE</Text>
        </Card>,
      );

      expect(view.pressables.slice(-1)[0]?.props.accessibilityState).toEqual({
        selected: false,
        expanded: true,
      });
    });
  });
});
