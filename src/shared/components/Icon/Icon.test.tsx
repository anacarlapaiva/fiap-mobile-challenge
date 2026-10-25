import { ThemeProvider } from '@shopify/restyle';
import type { ReactElement } from 'react';
import Svg, { Path } from 'react-native-svg';
import ReactTestRenderer from 'react-test-renderer';

import { Icon } from '@/shared/components/Icon';
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
  return renderer.root;
}

describe('ícone', () => {
  describe('dado um ícone quadrado com cor e tamanho do tema', () => {
    test('quando renderizado, então a altura é o tamanho e o desenho usa a cor pedida', async () => {
      const root = await render(<Icon name="arrow" color="accent" size="m" />);

      const svg = root.findByType(Svg);
      expect(svg.props.width).toBe(14);
      expect(svg.props.height).toBe(14);
      expect(svg.props.viewBox).toBe('0 0 14 14');
      expect(svg.props.accessible).toBe(false);
      root.findAllByType(Path).forEach(path => {
        expect(path.props.fill).toBe(theme.colors.accent);
      });
    });
  });

  describe('dado um ícone mais largo que alto', () => {
    test('quando renderizado, então a largura acompanha a proporção do desenho', async () => {
      const root = await render(
        <Icon name="calendar" color="textPrimary" size="l" />,
      );

      const svg = root.findByType(Svg);
      expect(svg.props.height).toBe(24);
      expect(svg.props.width).toBeCloseTo(21.4311);
      expect(root.findAllByType(Path)[0]?.props.fill).toBe(
        theme.colors.textPrimary,
      );
    });
  });
});
