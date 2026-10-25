import { ThemeProvider } from '@shopify/restyle';
import { StyleSheet, Text as NativeText, View } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { theme } from '@/shared/theme';

import { LessonRow } from './LessonRow';

describe('linha de aula', () => {
  describe('dado uma linha de aula', () => {
    test('CA-07: quando renderizada, então tem altura 59, marcador 6 e horário e disciplina do JSON', async () => {
      let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
      await ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(
          <ThemeProvider theme={theme}>
            <LessonRow
              aula={{ horario: '07:15 - 08:00', disciplina: 'Matemática I' }}
            />
          </ThemeProvider>,
        );
      });
      if (!renderer) {
        throw new Error('render falhou');
      }

      const row = renderer.root.findAllByType(View)[0];
      const bullet = renderer.root.findAllByType(View)[1];
      const labels = renderer.root
        .findAllByType(NativeText)
        .map(node => node.props.children);

      expect(StyleSheet.flatten(row?.props.style)).toMatchObject({
        height: 59,
      });
      expect(StyleSheet.flatten(bullet?.props.style)).toMatchObject({
        width: 6,
        height: 6,
      });
      expect(labels).toEqual(['07:15 - 08:00', 'Matemática I']);
      expect(row?.props.accessibilityLabel).toBe('07:15 - 08:00, Matemática I');
    });
  });
});
