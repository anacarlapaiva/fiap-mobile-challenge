import { ThemeProvider } from '@shopify/restyle';
import { Image, StyleSheet } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { Logo } from '@/shared/components/Logo';
import { theme } from '@/shared/theme';

async function renderImage(size: 'large' | 'small') {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider theme={theme}>
        <Logo size={size} />
      </ThemeProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  return renderer.root.findByType(Image).props;
}

describe('Logo', () => {
  test('CA-03: tamanho grande sem distorção', async () => {
    const props = await renderImage('large');

    expect(StyleSheet.flatten(props.style)).toEqual({ width: 306, height: 49 });
    expect(props.resizeMode).toBe('contain');
  });

  test('CA-03: tamanho pequeno sem distorção', async () => {
    const props = await renderImage('small');

    expect(StyleSheet.flatten(props.style)).toEqual({ width: 100, height: 16 });
    expect(props.resizeMode).toBe('contain');
  });
});
