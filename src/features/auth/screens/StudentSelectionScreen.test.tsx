import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@shopify/restyle';
import { StyleSheet, Text as NativeText, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactTestRenderer from 'react-test-renderer';

import { StudentSelectionScreen } from '@/features/auth/screens/StudentSelectionScreen';
import { SessionProvider } from '@/features/auth/session/SessionProvider';
import * as sessionStorage from '@/features/auth/session/sessionStorage';
import { showSuccessToast } from '@/shared/lib/toast';
import { theme } from '@/shared/theme';

jest.mock('@/features/auth/session/sessionStorage', () => ({
  readSession: jest.fn(() => Promise.resolve(null)),
  saveSession: jest.fn(() => Promise.resolve()),
  clearSession: jest.fn(() => Promise.resolve()),
}));

jest.mock('@/shared/lib/toast', () => ({
  showSuccessToast: jest.fn(),
}));

const showSuccessToastMock = jest.mocked(showSuccessToast);
const readSession = jest.mocked(sessionStorage.readSession);
const saveSession = jest.mocked(sessionStorage.saveSession);

const metrics = {
  frame: { x: 0, y: 0, width: 414, height: 736 },
  insets: { top: 47, bottom: 34, left: 0, right: 0 },
};

const rafael = 'RAFAEL DA SILVA, 7EF - RM 12567 - Matutino';
const joana = 'JOANA DA SILVA, 2EM - RM 12568 - Matutino';

async function settle(ms = 0) {
  for (let step = 0; step < 5; step += 1) {
    await ReactTestRenderer.act(async () => {
      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), ms);
      });
    });
  }
}

async function render() {
  readSession.mockResolvedValue({ guardianId: 1, studentRm: 12567 });
  const onClose = jest.fn();
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
              <StudentSelectionScreen onClose={onClose} />
            </SessionProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  await settle();
  const root = renderer.root;
  const pressable = (label: string) => {
    const node = root.findAll(
      item =>
        typeof item.props.onPress === 'function' &&
        item.props.accessibilityLabel === label,
    )[0];
    if (!node) {
      throw new Error(`${label} não encontrado`);
    }
    return node;
  };
  const host = (testID: string) =>
    root.findAllByType(View).find(node => node.props.testID === testID);
  const hasBorder = (rm: number) =>
    (host(`student-${rm}`)?.findAll(
      node => node.props.testID === 'card-selected-border',
    ).length ?? 0) > 0;
  const press = async (label: string) => {
    await ReactTestRenderer.act(async () => {
      pressable(label).props.onPress({});
      await Promise.resolve();
    });
  };
  const finishPulse = () => settle(theme.motion.short);
  const accessible = (label: string) =>
    root
      .findAllByType(View)
      .find(node => node.props.accessibilityLabel === label)?.props;
  return {
    root,
    onClose,
    host,
    hasBorder,
    press,
    finishPulse,
    accessible,
  };
}

function flat(node: ReactTestRenderer.ReactTestInstance | undefined) {
  return StyleSheet.flatten(node?.props.style);
}

describe('escolha de aluno', () => {
  beforeEach(() => {
    readSession.mockReset();
    saveSession.mockReset();
    saveSession.mockResolvedValue(undefined);
    showSuccessToastMock.mockReset();
  });

  describe('dado o Gustavo com o Rafael na sessão', () => {
    test('CA-01: quando a tela abre, então mostra FECHAR, o título e os dois alunos na ordem do JSON', async () => {
      const view = await render();

      expect(
        view.root.findAllByType(NativeText).map(node => node.props.children),
      ).toEqual([
        'FECHAR',
        'Escolha o perfil\nque você quer visualizar',
        'RAFAEL DA SILVA',
        '7EF - RM 12567 - Matutino',
        'JOANA DA SILVA',
        '2EM - RM 12568 - Matutino',
      ]);
    });

    test('CA-02: quando exibida, então só o card do Rafael tem a borda', async () => {
      const view = await render();

      expect(view.hasBorder(12567)).toBe(true);
      expect(view.hasBorder(12568)).toBe(false);
    });

    test('CA-03: quando renderizada, então FECHAR, título e cards seguem as medidas do Figma', async () => {
      const view = await render();
      const closeRow = view.root
        .findAllByType(View)
        .find(
          node =>
            flat(node)?.justifyContent === 'flex-end' &&
            flat(node)?.paddingTop === theme.spacing.m,
        );
      const title = view.root
        .findAllByType(NativeText)
        .find(node => node.props.accessibilityRole === 'header');
      const list = view.root
        .findAllByType(View)
        .find(node => flat(node)?.marginTop === theme.spacing.sectionGap);
      const content = view
        .host('student-12567')
        ?.findAllByType(View)
        .find(node => flat(node)?.paddingVertical === theme.spacing.m);

      expect(flat(closeRow)).toMatchObject({
        paddingTop: 16,
        paddingHorizontal: 16,
      });
      expect(flat(closeRow)?.paddingBottom).toBeUndefined();
      expect(flat(closeRow)?.padding).toBeUndefined();
      expect(flat(title)).toMatchObject({
        marginTop: 169,
        textAlign: 'center',
        fontSize: 24,
        lineHeight: 29,
      });
      expect(flat(list)).toMatchObject({
        paddingHorizontal: 16,
        gap: 16,
      });
      expect(flat(view.host('student-12567'))).toMatchObject({
        height: 90,
        borderRadius: 8,
        paddingHorizontal: 16,
      });
      expect(flat(content)).toMatchObject({
        flex: 1,
        justifyContent: 'space-between',
      });
    });

    test('CA-05: quando a Joana é tocada, então a borda passa para ela no toque e a sessão só troca ao fim do pulso, antes de a tela fechar', async () => {
      const view = await render();

      await view.press(joana);
      await settle();
      expect(view.hasBorder(12568)).toBe(true);
      expect(view.hasBorder(12567)).toBe(false);
      expect(saveSession).not.toHaveBeenCalled();
      expect(view.onClose).not.toHaveBeenCalled();

      await view.finishPulse();

      expect(saveSession).toHaveBeenCalledWith({
        guardianId: 1,
        studentRm: 12568,
      });
      expect(view.onClose).toHaveBeenCalledTimes(1);
      expect(saveSession.mock.invocationCallOrder[0] ?? Infinity).toBeLessThan(
        view.onClose.mock.invocationCallOrder[0] ?? 0,
      );
    });

    test('CA-15: quando a troca para a Joana termina, então a mensagem de sucesso é mostrada', async () => {
      const view = await render();

      await view.press(joana);
      await view.finishPulse();

      expect(showSuccessToastMock).toHaveBeenCalledTimes(1);
      expect(showSuccessToastMock).toHaveBeenCalledWith(
        'Perfil alterado para JOANA',
      );
    });

    test('CA-07: quando o Rafael é tocado, então a tela fecha sem gravar a sessão', async () => {
      const view = await render();

      await view.press(rafael);
      await view.finishPulse();

      expect(saveSession).not.toHaveBeenCalled();
      expect(showSuccessToastMock).not.toHaveBeenCalled();
      expect(view.hasBorder(12567)).toBe(true);
      expect(view.onClose).toHaveBeenCalledTimes(1);
    });

    test('CA-08: quando outro card e FECHAR são tocados durante o pulso, então a troca e o fechamento acontecem uma vez', async () => {
      const view = await render();

      await view.press(joana);
      await view.press(rafael);
      await view.press('Fechar');
      await view.finishPulse();

      expect(saveSession).toHaveBeenCalledTimes(1);
      expect(saveSession).toHaveBeenCalledWith({
        guardianId: 1,
        studentRm: 12568,
      });
      expect(view.hasBorder(12568)).toBe(true);
      expect(view.onClose).toHaveBeenCalledTimes(1);
    });

    test('CA-04: quando FECHAR é tocado, então a tela fecha e a sessão não muda', async () => {
      const view = await render();

      await view.press('Fechar');

      expect(view.onClose).toHaveBeenCalledTimes(1);
      expect(saveSession).not.toHaveBeenCalled();
    });

    test('CA-14: quando lida por leitor de tela, então título é cabeçalho, FECHAR e cards são botões e só o Rafael está selecionado', async () => {
      const view = await render();

      expect(
        view.root
          .findAllByType(NativeText)
          .filter(node => node.props.accessibilityRole === 'header'),
      ).toHaveLength(1);
      expect(view.accessible('Fechar')).toMatchObject({
        accessibilityRole: 'button',
      });
      expect(view.accessible(rafael)).toMatchObject({
        accessibilityRole: 'button',
        accessibilityState: { selected: true },
      });
      expect(view.accessible(joana)).toMatchObject({
        accessibilityRole: 'button',
        accessibilityState: { selected: false },
      });
    });
  });
});
