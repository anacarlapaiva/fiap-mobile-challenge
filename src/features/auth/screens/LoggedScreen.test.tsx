import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@shopify/restyle';
import { Text as NativeText } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactTestRenderer from 'react-test-renderer';

import { LoggedScreen } from '@/features/auth/screens/LoggedScreen';
import { SessionProvider } from '@/features/auth/session/SessionProvider';
import * as sessionStorage from '@/features/auth/session/sessionStorage';
import type { Session } from '@/features/auth/types';
import { theme } from '@/shared/theme';

jest.mock('@/features/auth/session/sessionStorage', () => ({
  readSession: jest.fn(() => Promise.resolve(null)),
  saveSession: jest.fn(() => Promise.resolve()),
  clearSession: jest.fn(() => Promise.resolve()),
}));

const readSession = jest.mocked(sessionStorage.readSession);

const metrics = {
  frame: { x: 0, y: 0, width: 414, height: 736 },
  insets: { top: 47, bottom: 34, left: 0, right: 0 },
};

async function flush() {
  for (let step = 0; step < 5; step += 1) {
    await Promise.resolve();
  }
}

async function renderLogged(session: Session) {
  readSession.mockResolvedValue(session);
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={metrics}>
        <QueryClientProvider client={client}>
          <ThemeProvider theme={theme}>
            <SessionProvider>
              <LoggedScreen />
            </SessionProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>,
    );
    await flush();
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  return { renderer };
}

async function settle() {
  for (let step = 0; step < 5; step += 1) {
    await ReactTestRenderer.act(async () => {
      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 0);
      });
    });
  }
}

describe('área autenticada', () => {
  beforeEach(() => {
    readSession.mockReset();
  });

  describe('dado a área autenticada sem lista de aulas neste corte', () => {
    test('CA-21: quando a tela é exibida, então o estado vazio mostra Sem aulas neste dia', async () => {
      const { renderer } = await renderLogged({
        guardianId: 1,
        studentRm: 12567,
      });
      await settle();

      expect(
        renderer.root
          .findAllByType(NativeText)
          .map(node => node.props.children),
      ).toContain('Sem aulas neste dia');
    });
  });
});
