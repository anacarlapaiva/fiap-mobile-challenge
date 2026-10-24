import { ThemeProvider } from '@shopify/restyle';
import { StyleSheet, Text as NativeText, View } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { theme } from '@/shared/theme';

import { SubjectRow } from './SubjectRow';

function renderRow(open: boolean) {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider theme={theme}>
        <SubjectRow
          nome="Língua Portuguesa"
          nota={9.5}
          faltas={0}
          open={open}
          onPress={() => undefined}
        />
      </ThemeProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  return renderer;
}

describe('linha da disciplina', () => {
  describe('dado a disciplina fechada', () => {
    test('quando renderizada, então a linha tem altura 37 e a nota fica oculta', () => {
      const renderer = renderRow(false);
      const row = renderer.root.findAllByType(View).find(node => {
        const style = StyleSheet.flatten(node.props.style);
        return style?.height === 37;
      });
      const labels = renderer.root
        .findAllByType(NativeText)
        .map(node => node.props.children);

      expect(row).toBeDefined();
      expect(labels).toEqual(['LÍNGUA PORTUGUESA']);
    });
  });

  describe('dado a disciplina aberta', () => {
    test('quando renderizada, então mostra nota e faltas', () => {
      const renderer = renderRow(true);
      const labels = renderer.root
        .findAllByType(NativeText)
        .map(node => node.props.children);

      expect(labels).toEqual(['LÍNGUA PORTUGUESA', 'Nota: 9.5', 'Faltas: 0']);
    });
  });
});
