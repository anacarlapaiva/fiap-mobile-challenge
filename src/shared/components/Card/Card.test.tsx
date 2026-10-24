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

describe('Card', () => {
  test('CA-12: selecionado tem borda acento de 1', async () => {
    const view = await render(
      <Card testID="card" selected paddingHorizontal="m">
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

  test('CA-12: sem seleção, sem borda e com o conteúdo na mesma posição', async () => {
    const selected = await render(
      <Card testID="card" selected paddingHorizontal="m">
        <Text>ALUNO</Text>
      </Card>,
    );
    const plain = await render(
      <Card testID="card" paddingHorizontal="m">
        <Text>ALUNO</Text>
      </Card>,
    );

    expect(plain.border).toBeUndefined();
    expect(plain.cardStyle).toEqual(selected.cardStyle);
    expect(plain.cardStyle.borderWidth).toBeUndefined();
  });

  test('CA-13: com ação, é pressionável e chama a ação', async () => {
    const onPress = jest.fn();
    const view = await render(
      <Card testID="card" onPress={onPress}>
        <Text>1º TRIMESTRE</Text>
      </Card>,
    );

    const pressable = view.pressables.slice(-1)[0];
    expect(pressable?.props.accessibilityRole).toBe('button');
    await ReactTestRenderer.act(() => {
      pressable?.props.onPress({});
    });
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('CA-13: sem ação, não é pressionável', async () => {
    const view = await render(
      <Card testID="card">
        <Text>1º TRIMESTRE</Text>
      </Card>,
    );

    expect(view.pressables).toHaveLength(0);
  });
});
