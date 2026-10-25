import { ThemeProvider } from '@shopify/restyle';
import { StyleSheet, Text as NativeText, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactTestRenderer from 'react-test-renderer';

import { useCurrentUser, type UserState } from '@/features/auth';
import { readGuardians } from '@/shared/mocks';
import { theme } from '@/shared/theme';

import { ReportCardScreen } from './ReportCardScreen';

jest.mock('@/features/auth', () => ({
  useCurrentUser: jest.fn(),
  UserFallback: jest.requireActual('@/features/auth/components/UserFallback')
    .UserFallback,
}));

const useCurrentUserMock = jest.mocked(useCurrentUser);

const metrics = {
  frame: { x: 0, y: 0, width: 414, height: 736 },
  insets: { top: 47, bottom: 34, left: 0, right: 0 },
};

const subjectLabels = [
  'LÍNGUA PORTUGUESA',
  'PRODUÇÃO E INTERPRETAÇÃO DE TEXTOS',
  'MATEMÁTICA I',
  'MATEMÁTICA II',
  'GEOGRAFIA',
  'HISTÓRIA',
  'CIÊNCIAS',
  'LÍNGUA INGLESA',
  'ARTE',
  'PROJETO',
  'CODING',
  'EDUCAÇÃO FÍSICA',
];

function rafaelUser() {
  const guardian = readGuardians().find(item => item.id === 1);
  const student = guardian?.alunos.find(item => item.rm === 12567);
  if (!guardian || !student) {
    throw new Error('mock do Rafael ausente');
  }
  return { guardian, student };
}

let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

function hasStyle(
  node: ReactTestRenderer.ReactTestInstance,
  match: (style: ReturnType<typeof StyleSheet.flatten>) => boolean,
) {
  return [node, ...node.findAllByType(View)].some(item =>
    match(StyleSheet.flatten(item.props.style)),
  );
}

function pressableById(id: string) {
  if (!renderer) {
    return undefined;
  }
  const root = renderer.root;
  const direct = root
    .findAll(
      node =>
        node.props.testID === id && typeof node.props.onPress === 'function',
    )
    .slice(-1)[0];
  if (direct) {
    return direct;
  }
  let current = root
    .findAll(node => node.props.testID === id)
    .slice(-1)[0]?.parent;
  while (current) {
    if (typeof current.props.onPress === 'function') {
      return current;
    }
    current = current.parent;
  }
  return undefined;
}

async function renderReport(
  currentUser: UserState = { status: 'ready', user: rafaelUser() },
) {
  useCurrentUserMock.mockReturnValue(currentUser);
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={metrics}>
        <ThemeProvider theme={theme}>
          <ReportCardScreen />
        </ThemeProvider>
      </SafeAreaProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  const root = renderer.root;
  const press = async (id: string) => {
    await ReactTestRenderer.act(() => {
      pressableById(id)?.props.onPress({});
    });
    await ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(theme.motion.medium + 50);
    });
  };
  return {
    root,
    press,
    labels: () =>
      root.findAllByType(NativeText).map(node => node.props.children),
    optionLabels: () =>
      ['7EF - 2025', '6EF - 2024'].map(
        (_, index) =>
          root.findByProps({ testID: `dropdown-option-${index}` }).props
            .accessibilityLabel,
      ),
    subjects: () => {
      const labels = root
        .findAll(
          node =>
            typeof node.props.testID === 'string' &&
            node.props.testID.startsWith('subject-') &&
            !node.props.testID.endsWith('-caret') &&
            typeof node.props.onPress === 'function',
        )
        .map(node => node.props.accessibilityLabel as string);
      return labels.filter((label, index) => labels.indexOf(label) === index);
    },
  };
}

describe('tela do boletim', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    ReactTestRenderer.act(() => {
      renderer?.unmount();
    });
    renderer = undefined;
    jest.useRealTimers();
  });

  describe('dado o usuário ainda carregando', () => {
    test('quando a aba abre, então aparecem o título e o carregamento', async () => {
      const view = await renderReport({ status: 'loading' });

      expect(view.labels()).toEqual(['BOLETIM']);
      expect(
        view.root.findAll(node => node.props.testID === 'user-loading'),
      ).not.toHaveLength(0);
    });
  });

  describe('dado o Rafael com sessão', () => {
    test('CA-01: quando a aba BOLETIM abre, então aparecem o título, o ano e os trimestres fechados', async () => {
      const view = await renderReport();

      expect(view.labels()).toEqual(
        expect.arrayContaining([
          'BOLETIM',
          '7EF - 2025',
          '1º TRIMESTRE',
          '2º TRIMESTRE',
          '3º TRIMESTRE',
        ]),
      );
      expect(view.subjects()).toEqual([]);
    });
  });

  describe('dado o dropdown do Rafael', () => {
    test('CA-02: quando aberto, então lista os dois anos do JSON nesta ordem', async () => {
      const view = await renderReport();

      await view.press('report-year');

      expect(view.optionLabels()).toEqual(['7EF - 2025', '6EF - 2024']);
    });
  });

  describe('dado o ano 2025 do Rafael', () => {
    test('CA-03: quando o 1º trimestre abre, então lista as disciplinas fechadas nesta ordem', async () => {
      const view = await renderReport();

      await view.press('term-1');

      expect(view.subjects()).toEqual(subjectLabels);
      expect(view.labels()).not.toContain('Nota: 9.5');
    });
  });

  describe('dado o 1º trimestre de 2025 aberto', () => {
    test('CA-04: quando duas disciplinas abrem, então as duas mostram nota e falta', async () => {
      const view = await renderReport();

      await view.press('term-1');
      await view.press('subject-Língua Portuguesa');
      await view.press('subject-Matemática I');

      expect(view.labels()).toEqual(
        expect.arrayContaining([
          'Nota: 9.5',
          'Faltas: 0',
          'Nota: 7.5',
          'Faltas: 2',
        ]),
      );

      await view.press('subject-Língua Portuguesa');

      expect(view.labels()).not.toContain('Nota: 9.5');
      expect(view.labels()).toContain('Nota: 7.5');
    });
  });

  describe('dado o 1º trimestre aberto com disciplina aberta', () => {
    test('CA-05: quando o 2º abre, então o 1º fecha e a nota null vira traço', async () => {
      const view = await renderReport();

      await view.press('term-1');
      await view.press('subject-Língua Portuguesa');
      await view.press('term-2');

      expect(view.labels()).not.toContain('Nota: 9.5');
      expect(view.subjects()).toEqual(subjectLabels);

      await view.press('subject-Língua Portuguesa');

      expect(view.labels()).toEqual(
        expect.arrayContaining(['Nota: -', 'Faltas: -']),
      );
    });
  });

  describe('dado um trimestre aberto', () => {
    test('CA-06: quando o card é tocado de novo, então fecha e a altura permanece 90', async () => {
      const view = await renderReport();

      await view.press('term-1');
      await view.press('term-1');

      const card = view.root.findByProps({ testID: 'term-1' });

      expect(view.subjects()).toEqual([]);
      expect(hasStyle(card, style => style?.height === 90)).toBe(true);
    });
  });

  describe('dado o 1º trimestre de 7EF - 2025 aberto', () => {
    test('CA-07: quando o mesmo ano é escolhido, então permanece; outro ano fecha os cards', async () => {
      const view = await renderReport();

      await view.press('term-1');
      await view.press('report-year');
      await view.press('dropdown-option-0');

      expect(view.subjects()).toEqual(subjectLabels);

      await view.press('report-year');
      await view.press('dropdown-option-1');

      expect(view.labels()).toContain('6EF - 2024');
      expect(view.subjects()).toEqual([]);
      expect(view.labels()).toEqual(
        expect.arrayContaining([
          '1º TRIMESTRE',
          '2º TRIMESTRE',
          '3º TRIMESTRE',
        ]),
      );
    });
  });

  describe('dado um aluno sem boletim', () => {
    test('CA-13: quando a aba BOLETIM abre, então aparecem o título e o Empty com "Nenhum boletim disponível."', async () => {
      const { guardian, student } = rafaelUser();
      const view = await renderReport({
        status: 'ready',
        user: { guardian, student: { ...student, boletim: [] } },
      });

      expect(view.labels()).toEqual(['BOLETIM', 'Nenhum boletim disponível.']);
      expect(
        view.root.findAll(node => node.props.testID === 'report-year'),
      ).toHaveLength(0);
    });
  });

  describe('dado os cards fechados', () => {
    test('CA-12: quando a lista é exibida, então o fim fica 16 abaixo do conteúdo', async () => {
      const view = await renderReport();

      expect(
        view.root.findByProps({ testID: 'report-terms' }).props
          .contentContainerStyle,
      ).toMatchObject({ paddingBottom: theme.spacing.m });
    });
  });

  describe('dado o boletim do Rafael', () => {
    test('CA-09: quando renderizado, então a margem lateral é 16 e o card seguinte fica 16 abaixo', async () => {
      const view = await renderReport();
      const styles = view.root
        .findAllByType(View)
        .map(node => StyleSheet.flatten(node.props.style));
      const spaced = view.root.findByProps({ testID: 'term-section-2' });

      expect(
        styles.some(
          style => style?.paddingHorizontal === 16 && style?.marginTop === 16,
        ),
      ).toBe(true);
      expect(
        styles.some(
          style => style?.paddingHorizontal === 16 && style?.paddingTop === 16,
        ),
      ).toBe(true);
      expect(hasStyle(spaced, style => style?.marginTop === 16)).toBe(true);
    });
  });
});
