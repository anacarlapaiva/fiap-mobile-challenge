import { ThemeProvider } from '@shopify/restyle';
import { Image, StyleSheet, Text as NativeText, View } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { Empty } from '@/shared/components/Empty';
import { theme } from '@/shared/theme';

async function renderEmpty(message: string) {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider theme={theme}>
        <Empty message={message} />
      </ThemeProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  return renderer.root;
}

describe('estado vazio', () => {
  describe('dado uma frase', () => {
    test('CA-20: quando renderizado, então a ilustração ocupa até 328 por 208 sem distorção e a frase usa o rótulo do campo 20 abaixo', async () => {
      const root = await renderEmpty('Sem aulas neste dia');
      const image = root.findByType(Image);
      const text = root.findByType(NativeText);

      expect(StyleSheet.flatten(image.props.style)).toEqual({
        width: '100%',
        maxWidth: 328,
        aspectRatio: 328 / 208,
      });
      expect(image.props.resizeMode).toBe('contain');
      expect(image.props.accessible).toBe(false);
      expect(StyleSheet.flatten(text.props.style)).toEqual(
        expect.objectContaining({
          fontFamily: 'Montserrat-Regular',
          fontSize: 20,
          lineHeight: 24,
          textAlign: 'center',
        }),
      );
      expect(
        root
          .findAllByType(View)
          .some(node => StyleSheet.flatten(node.props.style)?.marginTop === 20),
      ).toBe(true);
      expect(text.props.children).toBe('Sem aulas neste dia');
    });
  });
});
