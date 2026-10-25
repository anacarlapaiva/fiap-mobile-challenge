import * as firestore from '@react-native-firebase/firestore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Pressable, Text as NativeText } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { primeAccountForGuardian } from '@/features/auth/data/account.mock';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { SessionProvider } from '@/features/auth/session/SessionProvider';
import * as sessionStorage from '@/features/auth/session/sessionStorage';
import type { Session } from '@/features/auth/types';

jest.mock('@/features/auth/session/sessionStorage', () => ({
  readSession: jest.fn(() => Promise.resolve(null)),
  saveSession: jest.fn(() => Promise.resolve()),
  clearSession: jest.fn(() => Promise.resolve()),
}));

const readSession = jest.mocked(sessionStorage.readSession);

function Probe() {
  const currentUser = useCurrentUser();
  if (currentUser.status === 'loading') {
    return <NativeText>loading</NativeText>;
  }
  if (currentUser.status === 'anonymous') {
    return <NativeText>none</NativeText>;
  }
  if (currentUser.status === 'error') {
    return (
      <Pressable testID="retry" onPress={currentUser.retry}>
        <NativeText>error</NativeText>
      </Pressable>
    );
  }
  return (
    <NativeText>
      {`${currentUser.user.guardian.primeiroNome}:${currentUser.user.student.primeiroNome}:${currentUser.user.student.rm}`}
    </NativeText>
  );
}

async function flush() {
  for (let step = 0; step < 5; step += 1) {
    await Promise.resolve();
  }
}

async function mountCurrentUser(session: Session | null) {
  if (session) {
    primeAccountForGuardian(session.guardianId);
  } else {
    primeAccountForGuardian(0);
  }
  readSession.mockResolvedValue(session);
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <QueryClientProvider client={client}>
        <SessionProvider>
          <Probe />
        </SessionProvider>
      </QueryClientProvider>,
    );
    await flush();
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  return renderer;
}

function readText(renderer: ReactTestRenderer.ReactTestRenderer) {
  return renderer.root
    .findAllByType(NativeText)
    .map(node => node.props.children)
    .join('');
}

async function renderCurrentUser(session: Session | null) {
  const renderer = await mountCurrentUser(session);
  for (let step = 0; step < 5; step += 1) {
    await ReactTestRenderer.act(async () => {
      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 0);
      });
    });
  }
  return readText(renderer);
}

describe('hook do usuário', () => {
  beforeEach(() => {
    readSession.mockReset();
  });

  describe('dado uma sessão com id de responsável e RM', () => {
    test('CA-15: quando o hook é lido, então devolve esse responsável e o aluno desse RM', async () => {
      await expect(
        renderCurrentUser({ guardianId: 1, studentRm: 12568 }),
      ).resolves.toBe('Gustavo:Joana:12568');
    });
  });

  describe('dado uma sessão e o Firestore fora do ar', () => {
    afterEach(() => {
      jest.restoreAllMocks();
      jest.useRealTimers();
    });

    test('quando a leitura falha, então o hook pede nova tentativa e a nova tentativa traz o usuário', async () => {
      jest.useFakeTimers();
      jest
        .spyOn(firestore, 'getDoc')
        .mockRejectedValue(new Error('unavailable'));
      const renderer = await mountCurrentUser({
        guardianId: 1,
        studentRm: 12567,
      });
      for (let step = 0; step < 6; step += 1) {
        await ReactTestRenderer.act(async () => {
          jest.runOnlyPendingTimers();
          await flush();
        });
      }
      expect(readText(renderer)).toBe('error');

      jest.restoreAllMocks();
      await ReactTestRenderer.act(async () => {
        renderer.root.findByProps({ testID: 'retry' }).props.onPress();
        await flush();
      });
      await ReactTestRenderer.act(async () => {
        jest.runOnlyPendingTimers();
        await flush();
      });

      expect(readText(renderer)).toBe('Gustavo:Rafael:12567');
    });
  });

  describe('dado nenhuma sessão', () => {
    test('CA-15: quando o hook é lido, então não há usuário', async () => {
      await expect(renderCurrentUser(null)).resolves.toBe('none');
    });
  });
});
