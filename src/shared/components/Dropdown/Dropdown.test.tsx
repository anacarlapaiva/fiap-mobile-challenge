import { ThemeProvider } from '@shopify/restyle';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text as NativeText,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactTestRenderer from 'react-test-renderer';

import { Dropdown, type DropdownOption } from '@/shared/components/Dropdown';
import { theme } from '@/shared/theme';

const metrics = {
  frame: { x: 0, y: 0, width: 414, height: 736 },
  insets: { top: 47, bottom: 34, left: 0, right: 0 },
};

const options: DropdownOption<string>[] = [
  { label: '17 de março, segunda-feira', value: '2025-03-17' },
  { label: '18 de março, terça-feira', value: '2025-03-18' },
  { label: '19 de março, quarta-feira', value: '2025-03-19' },
];

async function render(
  items: readonly DropdownOption<string>[],
  onSelect = jest.fn(),
) {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={metrics}>
        <ThemeProvider theme={theme}>
          <Dropdown
            testID="dropdown"
            value="2025-03-17"
            options={items}
            onSelect={onSelect}
          />
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
    press,
    field: () => pressableById('dropdown'),
    styleOf: (id: string) => StyleSheet.flatten(pressableById(id)?.props.style),
    modalVisible: () => root.findByType(Modal).props.visible,
    optionLabels: () =>
      root
        .findByType(Modal)
        .findAllByType(NativeText)
        .map(node => node.props.children),
    list: () => root.findByType(ScrollView),
  };
}

describe('lista de opções', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('dado um campo fechado com opções', () => {
    test('CA-14: quando o campo é tocado, então a lista abre na ordem e fica expandida', async () => {
      const view = await render(options);

      await view.press('dropdown');

      expect(view.modalVisible()).toBe(true);
      expect(view.optionLabels()).toEqual(options.map(option => option.label));
      expect(view.list()).toBeTruthy();
      expect(view.field()?.props.accessibilityState).toEqual({
        expanded: true,
      });
    });
  });

  describe('dado um campo aberto', () => {
    test('CA-15: quando uma opção é tocada, então quem usa recebe a opção e a lista fecha', async () => {
      const onSelect = jest.fn();
      const view = await render(options, onSelect);

      await view.press('dropdown');
      await view.press('dropdown-option-1');

      expect(onSelect).toHaveBeenCalledWith(options[1]);
      expect(view.modalVisible()).toBe(false);
      expect(view.field()?.props.accessibilityState).toEqual({
        expanded: false,
      });
    });

    test('CA-18: quando o toque é fora da lista, então a lista fecha e ninguém recebe opção', async () => {
      const onSelect = jest.fn();
      const view = await render(options, onSelect);

      await view.press('dropdown');
      await view.press('dropdown-backdrop');

      expect(onSelect).not.toHaveBeenCalled();
      expect(view.modalVisible()).toBe(false);
    });
  });

  describe('dado o campo do dropdown', () => {
    test('CA-06: quando renderizado, então o campo tem 45 e cada opção tem 36', async () => {
      const view = await render(options);
      await view.press('dropdown');

      expect(
        view
          .field()
          ?.findAllByType(View)
          .some(node => {
            const style = StyleSheet.flatten(node.props.style);
            return style?.height === 45 && style?.borderRadius === 8;
          }),
      ).toBe(true);
      expect(view.styleOf('dropdown-option-0')).toMatchObject({
        height: 36,
      });
    });
  });

  describe('dado um campo sem opções', () => {
    test('CA-16: quando o campo é tocado, então a lista não abre', async () => {
      const view = await render([]);

      await view.press('dropdown');

      expect(view.modalVisible()).toBe(false);
    });
  });
});
