import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@shopify/restyle';
import { useSyncExternalStore } from 'react';
import { Text as NativeText } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactTestRenderer from 'react-test-renderer';

import { useCurrentUser } from '@/features/auth';
import { readGuardians } from '@/shared/mocks';
import { theme } from '@/shared/theme';

import { TabNavigator, tabSceneAnimation } from './TabNavigator';

jest.mock('@/features/auth', () => ({
  useCurrentUser: jest.fn(),
}));

const useCurrentUserMock = jest.mocked(useCurrentUser);

const metrics = {
  frame: { x: 0, y: 0, width: 414, height: 736 },
  insets: { top: 47, bottom: 34, left: 0, right: 0 },
};

function gustavoWith(rm: number) {
  const guardian = readGuardians().find(item => item.id === 1);
  const student = guardian?.alunos.find(item => item.rm === rm);
  if (!guardian || !student) {
    throw new Error(`mock do aluno ${rm} ausente`);
  }
  return { status: 'ready' as const, user: { guardian, student } };
}

let activeUser = gustavoWith(12567);
const userListeners = new Set<() => void>();

function subscribeUser(listener: () => void) {
  userListeners.add(listener);
  return () => {
    userListeners.delete(listener);
  };
}

function readActiveUser() {
  return activeUser;
}

async function switchStudent(rm: number) {
  await ReactTestRenderer.act(() => {
    activeUser = gustavoWith(rm);
    userListeners.forEach(listener => listener());
  });
}

let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

async function renderTabs() {
  activeUser = gustavoWith(12567);
  useCurrentUserMock.mockImplementation(() =>
    useSyncExternalStore(subscribeUser, readActiveUser),
  );
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={metrics}>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            <TabNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  const root = renderer.root;
  const pressableById = (id: string) => {
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
  };
  const press = async (id: string) => {
    await ReactTestRenderer.act(() => {
      pressableById(id)?.props.onPress({});
    });
    await ReactTestRenderer.act(async () => {
      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), theme.motion.medium + 50);
      });
    });
  };
  return {
    press,
    labels: () =>
      root.findAllByType(NativeText).map(node => node.props.children),
    selected: (id: string) =>
      root.findAll(
        node =>
          node.props.testID === id &&
          node.props.accessibilityState?.selected === true,
      ).length > 0,
  };
}

describe('troca de aba', () => {
  describe('dado reduzir movimento desligado', () => {
    test('quando a cena troca, então a transição é fade', () => {
      expect(tabSceneAnimation(false)).toBe('fade');
    });
  });

  describe('dado reduzir movimento ligado', () => {
    test('quando a cena troca, então não anima', () => {
      expect(tabSceneAnimation(true)).toBe('none');
    });
  });
});

describe('abas com a agenda', () => {
  afterEach(async () => {
    await ReactTestRenderer.act(async () => {
      renderer?.unmount();
      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 0);
      });
    });
    renderer = undefined;
  });

  describe('dado o dia 2025-03-17 selecionado', () => {
    test('CA-05: quando a pessoa vai ao BOLETIM e volta à AGENDA, então o dia permanece', async () => {
      const view = await renderTabs();

      await view.press('agenda-day');
      await view.press('dropdown-option-1');
      await view.press('tab-ReportCard');
      await view.press('tab-Agenda');

      expect(view.labels()).toEqual(
        expect.arrayContaining(['17 de março, segunda-feira', 'Matemática I']),
      );
    });
  });

  describe('dado 7EF - 2025 com o 1º trimestre e Língua Portuguesa abertos', () => {
    test('CA-08: quando a pessoa vai à AGENDA e volta ao BOLETIM, então o ano e a nota permanecem', async () => {
      const view = await renderTabs();

      await view.press('tab-ReportCard');
      await view.press('term-1');
      await view.press('subject-Língua Portuguesa');
      await view.press('tab-Agenda');
      await view.press('tab-ReportCard');

      expect(view.labels()).toEqual(
        expect.arrayContaining([
          '7EF - 2025',
          'LÍNGUA PORTUGUESA',
          'Nota: 9.5',
        ]),
      );
    });
  });

  describe('dado o Rafael no BOLETIM com o 1º trimestre de 7EF - 2025 aberto e a AGENDA em 2025-03-17', () => {
    test('CA-06: quando a Joana é escolhida, então o BOLETIM continua aberto no primeiro ano com os cards fechados e a AGENDA volta ao primeiro dia', async () => {
      const view = await renderTabs();

      await view.press('agenda-day');
      await view.press('dropdown-option-1');
      await view.press('tab-ReportCard');
      await view.press('term-1');
      expect(view.labels()).toContain('LÍNGUA PORTUGUESA');

      await switchStudent(12568);

      expect(view.selected('tab-ReportCard')).toBe(true);
      expect(view.labels()).toContain('2EM - 2025');
      expect(view.labels()).not.toContain('LÍNGUA PORTUGUESA');

      await view.press('tab-Agenda');

      expect(view.labels()).toContain('16 de março, domingo');
      expect(view.labels()).not.toContain('17 de março, segunda-feira');
    });
  });
});
