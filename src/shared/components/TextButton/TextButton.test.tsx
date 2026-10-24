import { ThemeProvider } from '@shopify/restyle';
import type { ReactElement } from 'react';
import { StyleSheet, Text as NativeText } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import ReactTestRenderer from 'react-test-renderer';

import { TextButton } from '@/shared/components/TextButton';
import { fonts, theme } from '@/shared/theme';

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
  const pressable = root
    .findAll(node => typeof node.props.onPressIn === 'function')
    .slice(-1)[0];
  if (!pressable) {
    throw new Error('pressable não encontrado');
  }
  return {
    root,
    pressable,
    labelStyle: StyleSheet.flatten(root.findByType(NativeText).props.style),
  };
}

describe('botão de texto', () => {
  describe('dado o tom padrão', () => {
    test('CA-11: quando renderizado, então usa a legenda branca e o ícone de 10', async () => {
      const view = await render(
        <TextButton label="SAIR" icon="logout" onPress={jest.fn()} />,
      );

      expect(view.labelStyle).toMatchObject({
        fontFamily: fonts.regular,
        fontSize: 12,
        color: theme.colors.textPrimary,
      });
      expect(view.root.findByType(Svg).props.height).toBe(theme.iconSizes.s);
      view.root.findAllByType(Path).forEach(path => {
        expect(path.props.fill).toBe(theme.colors.textPrimary);
      });
    });

    test('CA-11: quando tocado, então a ação é chamada', async () => {
      const onPress = jest.fn();
      const view = await render(
        <TextButton label="SAIR" icon="logout" onPress={onPress} />,
      );

      await ReactTestRenderer.act(() => {
        view.pressable.props.onPress({});
      });

      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('dado o tom destaque', () => {
    test('CA-11: quando renderizado, então usa o negrito acento e o ícone de 24', async () => {
      const view = await render(
        <TextButton
          label="FECHAR"
          icon="close"
          tone="accent"
          onPress={jest.fn()}
        />,
      );

      expect(view.labelStyle).toMatchObject({
        fontFamily: fonts.bold,
        fontSize: 16,
        color: theme.colors.accent,
      });
      expect(view.root.findByType(Svg).props.height).toBe(theme.iconSizes.l);
      expect(view.root.findByType(Path).props.fill).toBe(theme.colors.accent);
    });
  });

  describe('dado um botão de texto sem ícone', () => {
    test('quando renderizado, então só o texto aparece', async () => {
      const view = await render(
        <TextButton label="TROCAR PERFIL" onPress={jest.fn()} />,
      );

      expect(view.root.findAllByType(Svg)).toHaveLength(0);
    });
  });
});
