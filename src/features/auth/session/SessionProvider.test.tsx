import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Pressable, Text as NativeText } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import {
  guardiansQueryKey,
  useGuardians,
} from '@/features/auth/hooks/useGuardians';
import {
  SessionProvider,
  useSession,
} from '@/features/auth/session/SessionProvider';
import * as sessionStorage from '@/features/auth/session/sessionStorage';

jest.mock('@/features/auth/session/sessionStorage', () => ({
  readSession: jest.fn(() => Promise.resolve(null)),
  saveSession: jest.fn(() => Promise.resolve()),
  clearSession: jest.fn(() => Promise.resolve()),
}));

const readSession = jest.mocked(sessionStorage.readSession);
const saveSession = jest.mocked(sessionStorage.saveSession);
const clearSession = jest.mocked(sessionStorage.clearSession);

function Harness() {
  const { session, isReady, signIn, signOut, selectStudent } = useSession();
  const guardians = useGuardians();
  return (
    <>
      <NativeText>{isReady ? 'ready' : 'loading'}</NativeText>
      <NativeText>
        {session ? `${session.guardianId}:${session.studentRm}` : 'none'}
      </NativeText>
      <NativeText>{guardians.data ? 'cached' : 'empty'}</NativeText>
      <Pressable
        testID="sign-in"
        onPress={() => {
          signIn('969.294.560-04', '123456').catch(() => undefined);
        }}
      />
      <Pressable
        testID="sign-in-invalid"
        onPress={() => {
          signIn('111.444.777-35', '123456').catch(() => undefined);
        }}
      />
      <Pressable testID="sign-out" onPress={signOut} />
      <Pressable
        testID="select-joana"
        onPress={() => {
          selectStudent(12568).catch(() => undefined);
        }}
      />
      <Pressable
        testID="select-foreign"
        onPress={() => {
          selectStudent(13752).catch(() => undefined);
        }}
      />
    </>
  );
}

async function flush() {
  for (let step = 0; step < 5; step += 1) {
    await Promise.resolve();
  }
}

async function renderProvider() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  const clear = jest.spyOn(client, 'clear');
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <QueryClientProvider client={client}>
        <SessionProvider>
          <Harness />
        </SessionProvider>
      </QueryClientProvider>,
    );
    await flush();
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  return { renderer, clear, client };
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

async function press(
  renderer: ReactTestRenderer.ReactTestRenderer,
  testID: string,
) {
  await ReactTestRenderer.act(async () => {
    renderer.root.findByProps({ testID }).props.onPress();
    await flush();
  });
  await settle();
}

function texts(renderer: ReactTestRenderer.ReactTestRenderer) {
  return renderer.root
    .findAllByType(NativeText)
    .map(node => node.props.children);
}

describe('provider da sessão', () => {
  beforeEach(() => {
    readSession.mockReset();
    readSession.mockResolvedValue(null);
    saveSession.mockReset();
    saveSession.mockResolvedValue(undefined);
    clearSession.mockReset();
    clearSession.mockResolvedValue(undefined);
  });

  describe('dado nenhuma sessão no Keychain', () => {
    test('quando o provider fica pronto, então não há sessão', async () => {
      const { renderer } = await renderProvider();
      await settle();

      expect(texts(renderer)).toEqual(
        expect.arrayContaining(['ready', 'none']),
      );
    });
  });

  describe('dado um login aceito', () => {
    test('CA-10: quando a sessão é gravada, então ela fica disponível e o mock entra no cache', async () => {
      const { renderer, client } = await renderProvider();
      await settle();

      await ReactTestRenderer.act(async () => {
        renderer.root.findByProps({ testID: 'sign-in' }).props.onPress();
        await flush();
      });
      await settle();

      expect(saveSession).toHaveBeenCalledWith({
        guardianId: 1,
        studentRm: 12567,
      });
      expect(texts(renderer)).toContain('1:12567');
      expect(client.getQueryData(guardiansQueryKey)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 1, cpf: '96929456004' }),
        ]),
      );
    });
  });

  describe('dado uma sessão cujo responsável não está no mock', () => {
    test('CA-16: quando a leitura termina, então não há sessão e o Keychain é apagado', async () => {
      readSession.mockResolvedValue({ guardianId: 99, studentRm: 1 });
      const { renderer } = await renderProvider();
      await settle();

      expect(clearSession).toHaveBeenCalled();
      expect(texts(renderer)).toEqual(
        expect.arrayContaining(['ready', 'none']),
      );
    });

    test('CA-16: quando o Keychain falha ao apagar, então a memória mesmo assim fica sem sessão', async () => {
      readSession.mockResolvedValue({ guardianId: 99, studentRm: 1 });
      clearSession.mockRejectedValue(new Error('keychain'));
      const { renderer } = await renderProvider();
      await settle();

      expect(texts(renderer)).toEqual(
        expect.arrayContaining(['ready', 'none']),
      );
    });
  });

  describe('dado um CPF válido que não está no mock', () => {
    test('quando o login é pedido, então a sessão não é gravada', async () => {
      const { renderer } = await renderProvider();
      await settle();

      await ReactTestRenderer.act(async () => {
        renderer.root
          .findByProps({ testID: 'sign-in-invalid' })
          .props.onPress();
        await flush();
      });

      expect(saveSession).not.toHaveBeenCalled();
      expect(texts(renderer)).toContain('none');
    });
  });

  describe('dado uma sessão ativa e o mock em cache', () => {
    test('CA-13: quando a sessão sai, então o cache é limpo mesmo se o Keychain falha', async () => {
      clearSession.mockRejectedValue(new Error('keychain'));
      const { renderer, clear } = await renderProvider();
      await settle();

      await ReactTestRenderer.act(async () => {
        renderer.root.findByProps({ testID: 'sign-in' }).props.onPress();
        await flush();
      });
      await settle();
      await ReactTestRenderer.act(async () => {
        renderer.root.findByProps({ testID: 'sign-out' }).props.onPress();
        await flush();
      });
      await settle();

      expect(clear).toHaveBeenCalled();
      expect(texts(renderer)).toContain('none');
    });
  });

  describe('dado o Gustavo logado com o Rafael', () => {
    async function signedIn() {
      const view = await renderProvider();
      await settle();
      await press(view.renderer, 'sign-in');
      saveSession.mockClear();
      return view;
    }

    test('CA-09: quando a Joana é escolhida, então a sessão troca e é gravada no Keychain', async () => {
      const { renderer } = await signedIn();

      await press(renderer, 'select-joana');

      expect(saveSession).toHaveBeenCalledWith({
        guardianId: 1,
        studentRm: 12568,
      });
      expect(texts(renderer)).toContain('1:12568');
    });

    test('CA-10: quando o Keychain falha ao gravar, então a troca vale na memória', async () => {
      const { renderer } = await signedIn();
      saveSession.mockRejectedValue(new Error('keychain'));

      await press(renderer, 'select-joana');

      expect(texts(renderer)).toContain('1:12568');
    });

    test('CA-11: quando um RM de outro responsável é pedido, então nada muda e nada é gravado', async () => {
      const { renderer } = await signedIn();

      await press(renderer, 'select-foreign');

      expect(saveSession).not.toHaveBeenCalled();
      expect(texts(renderer)).toContain('1:12567');
    });

    test('CA-12: quando SAIR é tocado com a gravação em andamento, então a sessão é apagada depois dela', async () => {
      const { renderer } = await signedIn();
      let finishSave: () => void = () => undefined;
      saveSession.mockImplementation(
        () =>
          new Promise<void>(resolve => {
            finishSave = resolve;
          }),
      );

      await press(renderer, 'select-joana');
      await press(renderer, 'sign-out');
      expect(clearSession).not.toHaveBeenCalled();

      await ReactTestRenderer.act(async () => {
        finishSave();
        await flush();
      });
      await settle();

      expect(clearSession).toHaveBeenCalledTimes(1);
      expect(saveSession.mock.invocationCallOrder[0] ?? Infinity).toBeLessThan(
        clearSession.mock.invocationCallOrder[0] ?? 0,
      );
      expect(texts(renderer)).toContain('none');
    });
  });
});
