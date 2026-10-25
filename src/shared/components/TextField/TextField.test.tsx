import { ThemeProvider } from '@shopify/restyle';
import type { ReactElement } from 'react';
import { StyleSheet, Text as NativeText, TextInput, View } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { TextField } from '@/shared/components/TextField';
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

describe('campo de texto', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('dado um campo vazio', () => {
    test('quando renderizado, então mostra o rótulo e a linha cinza', async () => {
      const view = await render(
        <TextField label="CPF" value="" onChangeText={jest.fn()} />,
      );

      expect(view.texts()).toContain('CPF');
      expect(view.lineColor()).toBe('rgba(82, 82, 82, 1)');
    });
  });

  describe('dado um campo que recebe valor', () => {
    test('quando o valor chega, então a linha passa a branco', async () => {
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
  });

  describe('dado um campo seguro com seis caracteres', () => {
    test('quando renderizado, então mostra um asterisco por caractere, não expõe a senha e o toque chega no campo', async () => {
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
        fontFamily: 'Montserrat-Regular',
        fontSize: 32,
      });
      const inputStyle = StyleSheet.flatten(view.input.props.style);
      expect(inputStyle.color).toBe('transparent');
      expect(inputStyle.opacity ?? 1).toBe(1);
      expect(view.input.props.secureTextEntry).toBe(true);
      expect(view.input.props.accessibilityValue).toEqual({ text: '******' });
      expect(view.texts()).not.toContain('123456');
    });
  });

  describe('dado um campo seguro com texto', () => {
    test('quando o valor muda, então o cursor nativo fica sempre no fim, junto do cursor desenhado', async () => {
      const view = await render(
        <TextField label="SENHA" value="123" onChangeText={jest.fn()} secure />,
      );

      expect(view.input.props.selection).toEqual({ start: 3, end: 3 });

      await ReactTestRenderer.act(() => {
        view.renderer.update(
          <ThemeProvider theme={theme}>
            <TextField
              label="SENHA"
              value="1234"
              onChangeText={jest.fn()}
              secure
            />
          </ThemeProvider>,
        );
      });

      expect(view.root.findByType(TextInput).props.selection).toEqual({
        start: 4,
        end: 4,
      });
    });
  });

  describe('dado um campo de CPF', () => {
    test('quando o usuário digita, então o texto chega sem formatação', async () => {
      const onChangeText = jest.fn();
      const view = await render(
        <TextField label="CPF" value="" onChangeText={onChangeText} />,
      );

      await ReactTestRenderer.act(() => {
        view.input.props.onChangeText('12345678900');
      });

      expect(onChangeText).toHaveBeenCalledWith('12345678900');
      expect(view.input.props.secureTextEntry).toBeUndefined();
      expect(view.input.props.selection).toBeUndefined();
    });
  });

  describe('dado qualquer aparelho', () => {
    test('quando o campo é renderizado, então o valor tem a altura 39 do Figma e não segue a fonte do sistema', async () => {
      const view = await render(
        <TextField label="CPF" value="" onChangeText={jest.fn()} />,
      );

      expect(StyleSheet.flatten(view.input.props.style)).toMatchObject({
        height: 39,
      });
      expect(view.input.props.allowFontScaling).toBe(false);
    });
  });
});
