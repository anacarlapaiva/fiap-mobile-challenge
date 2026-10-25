import { ThemeProvider } from '@shopify/restyle';
import { StyleSheet, Text as NativeText, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactTestRenderer from 'react-test-renderer';

import { useCurrentUser, type UserState } from '@/features/auth';
import { readGuardians } from '@/shared/mocks';
import { theme } from '@/shared/theme';

import { ScheduleScreen } from './ScheduleScreen';

jest.mock('@/features/auth', () => ({
  useCurrentUser: jest.fn(),
}));

const useCurrentUserMock = jest.mocked(useCurrentUser);

const metrics = {
  frame: { x: 0, y: 0, width: 414, height: 736 },
  insets: { top: 47, bottom: 34, left: 0, right: 0 },
};

const weekLabels = [
  '16 de março, domingo',
  '17 de março, segunda-feira',
  '18 de março, terça-feira',
  '19 de março, quarta-feira',
  '20 de março, quinta-feira',
  '21 de março, sexta-feira',
  '22 de março, sábado',
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

async function renderSchedule(
  currentUser: UserState = { status: 'ready', user: rafaelUser() },
) {
  useCurrentUserMock.mockReturnValue(currentUser);
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={metrics}>
        <ThemeProvider theme={theme}>
          <ScheduleScreen />
        </ThemeProvider>
      </SafeAreaProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  const root = renderer.root;
  const pressableById = (id: string) =>
    root
      .findAll(
        node =>
          node.props.testID === id && typeof node.props.onPress === 'function',
      )
      .slice(-1)[0];
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
      weekLabels.map(
        (_, index) =>
          root.findByProps({ testID: `dropdown-option-${index}` }).props
            .accessibilityLabel,
      ),
  };
}

describe('tela da agenda', () => {
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
    test('quando a aba abre, então só o título aparece', async () => {
      const view = await renderSchedule({ status: 'loading' });

      expect(view.labels()).toEqual(['AGENDA']);
      expect(
        view.root.findAll(node => node.props.testID === 'agenda-day'),
      ).toHaveLength(0);
    });
  });

  describe('dado o Rafael com sessão', () => {
    test('CA-01: quando a aba AGENDA abre, então aparecem o título, o primeiro dia e o Empty', async () => {
      const view = await renderSchedule();

      expect(view.labels()).toEqual(
        expect.arrayContaining([
          'AGENDA',
          '16 de março, domingo',
          'Sem aulas neste dia',
        ]),
      );
    });
  });

  describe('dado o dropdown do Rafael', () => {
    test('CA-02: quando aberto, então lista os sete dias do JSON nesta ordem', async () => {
      const view = await renderSchedule();

      await view.press('agenda-day');

      expect(view.optionLabels()).toEqual(weekLabels);
    });
  });

  describe('dado o dia 2025-03-17 do Rafael', () => {
    test('CA-03: quando selecionado, então o Empty some e as seis aulas do JSON aparecem', async () => {
      const view = await renderSchedule();

      await view.press('agenda-day');
      await view.press('dropdown-option-1');

      expect(view.labels()).toEqual([
        'AGENDA',
        '17 de março, segunda-feira',
        '07:15 - 08:00',
        'Matemática I',
        '08:00 - 08:45',
        'Língua Inglesa',
        '09:15 - 10:00',
        'Língua Inglesa',
        '10:00 - 10:45',
        'Ciências',
        '10:45 - 11:30',
        'Ciências',
        '11:30 - 12:15',
        'Coding',
      ]);
    });
  });

  describe('dado 2025-03-22 com aulas vazias', () => {
    test('CA-04: quando selecionado, então o Empty volta e o dropdown permanece', async () => {
      const view = await renderSchedule();

      await view.press('agenda-day');
      await view.press('dropdown-option-6');

      expect(view.labels()).toEqual(
        expect.arrayContaining([
          'AGENDA',
          '22 de março, sábado',
          'Sem aulas neste dia',
        ]),
      );
    });
  });

  describe('dado um aluno sem dias na agenda', () => {
    test('CA-08: quando a aba AGENDA abre, então aparecem o título e o Empty com "Nenhuma aula cadastrada."', async () => {
      const { guardian, student } = rafaelUser();
      const view = await renderSchedule({
        status: 'ready',
        user: { guardian, student: { ...student, agenda: [] } },
      });

      expect(view.labels()).toEqual(['AGENDA', 'Nenhuma aula cadastrada.']);
      expect(
        view.root.findAll(node => node.props.testID === 'agenda-day'),
      ).toHaveLength(0);
    });
  });

  describe('dado o campo do dropdown', () => {
    test('CA-06: quando renderizado, então a margem lateral é 24', async () => {
      const { root } = await renderSchedule();

      expect(
        root.findAllByType(View).some(node => {
          const style = StyleSheet.flatten(node.props.style);
          return style?.paddingHorizontal === 24 && style?.marginTop === 16;
        }),
      ).toBe(true);
    });
  });
});
