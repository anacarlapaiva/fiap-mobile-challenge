import { ThemeProvider } from '@shopify/restyle';
import { StyleSheet, Text as NativeText, View } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { theme } from '@/shared/theme';

import { TermSection } from './TermSection';

const disciplina = {
  nome: 'Língua Portuguesa',
  nota: 9.5,
  faltas: 0,
};

function renderTerm(open: boolean) {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider theme={theme}>
        <TermSection
          trimestre={1}
          disciplinas={[disciplina]}
          open={open}
          openSubjects={[]}
          spaced={false}
          onToggle={() => undefined}
          onToggleSubject={() => undefined}
        />
      </ThemeProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  return renderer;
}

describe('card do trimestre', () => {
  describe('dado o trimestre fechado', () => {
    test('quando renderizado, então o card tem altura 90 e a disciplina fica oculta', () => {
      const renderer = renderTerm(false);
      const card = renderer.root.findAllByType(View).find(node => {
        const style = StyleSheet.flatten(node.props.style);
        return style?.height === 90;
      });
      const labels = renderer.root
        .findAllByType(NativeText)
        .map(node => node.props.children);

      expect(card).toBeDefined();
      expect(labels).toEqual(['1º TRIMESTRE']);
    });
  });

  describe('dado o trimestre aberto', () => {
    test('quando renderizado, então a disciplina aparece e a seta gira 180°', () => {
      const renderer = renderTerm(true);
      const caret = renderer.root.findByProps({ testID: 'term-1-caret' });
      const labels = renderer.root
        .findAllByType(NativeText)
        .map(node => node.props.children);

      const animated = caret.props.style as {
        initial: { value: { transform: { rotate: string }[] } };
      };

      expect(labels).toEqual(expect.arrayContaining(['LÍNGUA PORTUGUESA']));
      expect(animated.initial.value).toMatchObject({
        transform: [{ rotate: '180deg' }],
      });
    });
  });
});
