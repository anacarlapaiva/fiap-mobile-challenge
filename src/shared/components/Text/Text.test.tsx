import { ThemeProvider } from '@shopify/restyle';
import type { ReactElement } from 'react';
import { StyleSheet, Text as NativeText } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { Text } from '@/shared/components';
import { fonts, theme } from '@/shared/theme';

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

describe('Text', () => {
  test('CA-02: aplica o variant sobre os padrões do tema', async () => {
    const style = await renderStyle(<Text variant="sectionTitle">AGENDA</Text>);

    expect(style).toMatchObject({
      fontFamily: fonts.bold,
      fontSize: 20,
      lineHeight: 24,
      letterSpacing: 0,
      includeFontPadding: false,
      color: theme.colors.accent,
    });
    expect(style).not.toHaveProperty('fontWeight');
  });

  test('CA-02: sem variant, usa o corpo', async () => {
    const style = await renderStyle(<Text>texto</Text>);

    expect(style).toMatchObject({
      fontFamily: fonts.regular,
      fontSize: 16,
      lineHeight: 20,
      color: theme.colors.textPrimary,
    });
  });
});
