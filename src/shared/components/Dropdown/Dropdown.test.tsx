import { ThemeProvider } from '@shopify/restyle';
import { Modal, Text as NativeText } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { Dropdown, type DropdownOption } from '@/shared/components/Dropdown';
import { theme } from '@/shared/theme';

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
      <ThemeProvider theme={theme}>
        <Dropdown
          testID="dropdown"
          value="2025-03-17"
          options={items}
          onSelect={onSelect}
        />
      </ThemeProvider>,
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
    modalVisible: () => root.findByType(Modal).props.visible,
    optionLabels: () =>
      root
        .findByType(Modal)
        .findAllByType(NativeText)
        .map(node => node.props.children),
  };
}

describe('Dropdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('CA-14: abre com as opções na ordem e estado expandido', async () => {
    const view = await render(options);

    expect(view.modalVisible()).toBe(false);
    expect(view.field()?.props.accessibilityState).toEqual({
      expanded: false,
    });

    await view.press('dropdown');

    expect(view.modalVisible()).toBe(true);
    expect(view.optionLabels()).toEqual(options.map(option => option.label));
    expect(view.field()?.props.accessibilityState).toEqual({ expanded: true });
  });

  test('CA-15: tocar numa opção entrega a opção e fecha a lista', async () => {
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

  test('CA-16: sem opções, o campo não abre', async () => {
    const view = await render([]);

    await view.press('dropdown');

    expect(view.modalVisible()).toBe(false);
  });

  test('CA-18: tocar fora fecha sem selecionar', async () => {
    const onSelect = jest.fn();
    const view = await render(options, onSelect);

    await view.press('dropdown');
    await view.press('dropdown-backdrop');

    expect(onSelect).not.toHaveBeenCalled();
    expect(view.modalVisible()).toBe(false);
  });
});
