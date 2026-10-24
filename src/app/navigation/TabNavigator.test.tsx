import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@shopify/restyle';
import { Text as NativeText } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactTestRenderer from 'react-test-renderer';

import { useCurrentUser } from '@/features/auth';
import { readGuardians } from '@/shared/mocks';
import { theme } from '@/shared/theme';

import { TabNavigator } from './TabNavigator';

jest.mock('@/features/auth', () => ({
  useCurrentUser: jest.fn(),
}));

const useCurrentUserMock = jest.mocked(useCurrentUser);

const metrics = {
  frame: { x: 0, y: 0, width: 414, height: 736 },
  insets: { top: 47, bottom: 34, left: 0, right: 0 },
};

function rafaelUser() {
  const guardian = readGuardians().find(item => item.id === 1);
  const student = guardian?.alunos.find(item => item.rm === 12567);
  if (!guardian || !student) {
    throw new Error('mock do Rafael ausente');
  }
  return { guardian, student };
}

let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

async function renderTabs() {
  useCurrentUserMock.mockReturnValue({
    status: 'ready',
    user: rafaelUser(),
  });
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
  };
}

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
});
