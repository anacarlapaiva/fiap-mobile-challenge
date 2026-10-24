import { ThemeProvider } from '@shopify/restyle';
import type { ReactElement } from 'react';
import { StyleSheet, Text as NativeText, TextInput, View } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { TextField } from '@/shared/components/TextField';
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
  return {
    root,
    renderer,
    input: root.findByType(TextInput),
    lineColor: () =>
      root.findAllByType(View).find(n => n.props.testID === 'text-field-line')
        ?.props.jestAnimatedStyle?.value.backgroundColor,
    texts: () =>
      root.findAllByType(NativeText).map(node => node.props.children),
  };
}

describe('TextField', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('CA-08: vazio mostra o rótulo e a linha cinza', async () => {
    const view = await render(
      <TextField label="CPF" value="" onChangeText={jest.fn()} />,
    );

    expect(view.texts()).toContain('CPF');
    expect(view.lineColor()).toBe('rgba(82, 82, 82, 1)');
  });

  test('CA-08: preenchido passa a linha para branco', async () => {
    const view = await render(
      <TextField label="CPF" value="" onChangeText={jest.fn()} />,
    );

    await ReactTestRenderer.act(() => {
      view.renderer.update(
        <ThemeProvider theme={theme}>
          <TextField label="CPF" value="1" onChangeText={jest.fn()} />
        </ThemeProvider>,
      );
    });
    await ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(theme.motion.short + 50);
    });

    expect(view.lineColor()).toBe('rgba(255, 255, 255, 1)');
  });

  test('CA-09: modo seguro mostra um asterisco por caractere sem expor o valor', async () => {
    const view = await render(
      <TextField
        label="SENHA"
        value="123456"
        onChangeText={jest.fn()}
        secure
      />,
    );

    const mask = view.root
      .findAllByType(NativeText)
      .find(node => node.props.testID === 'text-field-mask');
    expect(mask?.props.children).toBe('******');
    expect(StyleSheet.flatten(mask?.props.style)).toMatchObject({
      fontFamily: fonts.regular,
      fontSize: 32,
    });
    expect(StyleSheet.flatten(view.input.props.style).opacity).toBe(0);
    expect(view.input.props.accessibilityValue).toEqual({ text: '******' });
    expect(view.input.props.secureTextEntry).toBeFalsy();
    expect(view.input.props.autoCorrect).toBe(false);
    expect(view.input.props.autoComplete).toBe('off');
    expect(view.texts()).not.toContain('123456');
  });

  test('CA-10: entrega o texto digitado sem formatar', async () => {
    const onChangeText = jest.fn();
    const view = await render(
      <TextField
        label="CPF"
        value=""
        onChangeText={onChangeText}
        keyboardType="number-pad"
      />,
    );

    await ReactTestRenderer.act(() => {
      view.input.props.onChangeText('12345678900');
    });

    expect(onChangeText).toHaveBeenCalledWith('12345678900');
    expect(view.input.props.keyboardType).toBe('number-pad');
    expect(view.input.props.accessibilityLabel).toBe('CPF');
  });
});
