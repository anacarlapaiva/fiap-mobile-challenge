import { ThemeProvider } from '@shopify/restyle';
import type { ReactElement } from 'react';
import { StyleSheet, Text as NativeText } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { Text } from '@/shared/components';
import { theme } from '@/shared/theme';

async function renderStyle(element: ReactElement) {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider theme={theme}>{element}</ThemeProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  return StyleSheet.flatten(renderer.root.findByType(NativeText).props.style);
}

describe('texto do tema', () => {
  describe('dado o estilo de título de seção', () => {
    test('CA-03: quando o estilo é aplicado, então o sistema não sintetiza negrito nem padding de fonte', async () => {
      const style = await renderStyle(
        <Text variant="sectionTitle">AGENDA</Text>,
      );

      expect(style).toMatchObject({ includeFontPadding: false });
      expect(style).not.toHaveProperty('fontWeight');
    });
  });

  describe('dado a fonte do sistema aumentada', () => {
    test('quando o texto é renderizado, então o tamanho continua o da tabela', async () => {
      let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
      await ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(
          <ThemeProvider theme={theme}>
            <Text allowFontScaling>AGENDA</Text>
          </ThemeProvider>,
        );
      });

      expect(renderer?.root.findByType(NativeText).props.allowFontScaling).toBe(
        false,
      );
    });
  });

  describe('dado um texto sem estilo pedido', () => {
    test('CA-02: quando renderizado, então usa o corpo da tabela', async () => {
      const style = await renderStyle(<Text>texto</Text>);

      expect(style).toMatchObject({
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        lineHeight: 20,
        color: theme.colors.textPrimary,
      });
    });
  });
});
