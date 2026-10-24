import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ThemeProvider } from '@shopify/restyle';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactTestRenderer from 'react-test-renderer';

import { TabBar } from '@/app/navigation/TabBar';
import { theme } from '@/shared/theme';

const metrics = {
  frame: { x: 0, y: 0, width: 414, height: 736 },
  insets: { top: 47, bottom: 34, left: 0, right: 0 },
};

const routes = [
  { key: 'agenda-key', name: 'Agenda', params: undefined },
  { key: 'report-card-key', name: 'ReportCard', params: undefined },
];

function createProps(index: number) {
  const emit = jest.fn(() => ({ defaultPrevented: false }));
  const navigate = jest.fn();
  const props = {
    state: { index, routes },
    navigation: { emit, navigate },
  } as unknown as BottomTabBarProps;
  return { props, emit, navigate };
}

async function render(props: BottomTabBarProps) {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={metrics}>
        <ThemeProvider theme={theme}>
          <TabBar {...props} />
        </ThemeProvider>
      </SafeAreaProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  return renderer.root;
}

function style(root: ReactTestRenderer.ReactTestInstance, testID: string) {
  return StyleSheet.flatten(
    root.findAllByType(View).find(view => view.props.testID === testID)?.props
      .style,
  );
}

async function press(
  root: ReactTestRenderer.ReactTestInstance,
  testID: string,
) {
  await ReactTestRenderer.act(() => {
    root.findByProps({ testID }).props.onPress();
  });
}

describe('rodapé das abas', () => {
  describe('dado um aparelho com área segura inferior', () => {
    test('CA-02: quando renderizado, então tem 64 de altura com o ícone a 11 do topo, o rótulo 4 abaixo e a área segura por dentro do fundo', async () => {
      const root = await render(createProps(0).props);

      expect(style(root, 'tab-bar')).toMatchObject({
        backgroundColor: theme.colors.surface,
        paddingBottom: 34,
        flexDirection: 'row',
      });
      const item = root
        .findAllByType(View)
        .find(
          view =>
            StyleSheet.flatten(view.props.style)?.height ===
            theme.sizes.tabBarHeight,
        );
      expect(StyleSheet.flatten(item?.props.style)).toMatchObject({
        paddingTop: 11,
        alignItems: 'center',
      });
      expect(
        root
          .findAllByType(View)
          .filter(
            view => StyleSheet.flatten(view.props.style)?.marginTop === 4,
          ),
      ).toHaveLength(2);
    });
  });

  describe('dado AGENDA ativa', () => {
    test('CA-03: quando exibido, então AGENDA fica em destaque e BOLETIM em branco', async () => {
      const root = await render(createProps(0).props);

      expect(style(root, 'tab-Agenda-icon-accent')).toMatchObject({
        opacity: 1,
      });
      expect(style(root, 'tab-Agenda-label-accent')).toMatchObject({
        opacity: 1,
      });
      expect(style(root, 'tab-ReportCard-icon-accent')).toMatchObject({
        opacity: 0,
      });
      expect(style(root, 'tab-ReportCard-label-accent')).toMatchObject({
        opacity: 0,
      });
    });

    test('CA-04: quando BOLETIM é tocado, então a tela do boletim abre', async () => {
      const { props, navigate } = createProps(0);
      const root = await render(props);

      await press(root, 'tab-ReportCard');

      expect(navigate).toHaveBeenCalledWith('ReportCard', undefined);
    });

    test('CA-04: quando AGENDA é tocada de novo, então a tela não muda', async () => {
      const { props, emit, navigate } = createProps(0);
      const root = await render(props);

      await press(root, 'tab-Agenda');

      expect(emit).toHaveBeenCalledWith({
        type: 'tabPress',
        target: 'agenda-key',
        canPreventDefault: true,
      });
      expect(navigate).not.toHaveBeenCalled();
    });
  });
});
