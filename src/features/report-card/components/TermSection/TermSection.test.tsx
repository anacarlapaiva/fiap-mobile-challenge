import { ThemeProvider } from '@shopify/restyle';
import { Text as NativeText } from 'react-native';
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
    test('quando renderizado, então só o rótulo do trimestre aparece', () => {
      const renderer = renderTerm(false);
      const labels = renderer.root
        .findAllByType(NativeText)
        .map(node => node.props.children);

      expect(labels).toEqual(['1º TRIMESTRE']);
    });
  });

  describe('dado o trimestre aberto', () => {
    test('quando renderizado, então a disciplina aparece', () => {
      const renderer = renderTerm(true);
      const labels = renderer.root
        .findAllByType(NativeText)
        .map(node => node.props.children);

      expect(labels).toEqual(expect.arrayContaining(['LÍNGUA PORTUGUESA']));
    });
  });
});
