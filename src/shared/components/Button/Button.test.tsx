import { ThemeProvider } from '@shopify/restyle';
import type { ReactElement } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text as NativeText,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactTestRenderer from 'react-test-renderer';

import { Button } from '@/shared/components/Button';
import { theme } from '@/shared/theme';

const metrics = {
  frame: { x: 0, y: 0, width: 414, height: 736 },
  insets: { top: 47, bottom: 34, left: 0, right: 0 },
};

async function render(element: ReactElement) {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={metrics}>
        <ThemeProvider theme={theme}>{element}</ThemeProvider>
      </SafeAreaProvider>,
    );
  });
  if (!renderer) {
    throw new Error('render falhou');
  }
  const root = renderer.root;
  const pressable = root
    .findAll(node => typeof node.props.onPressIn === 'function')
    .slice(-1)[0];
  if (!pressable) {
    throw new Error('pressable não encontrado');
  }
  const host = root
    .findAllByType(View)
    .find(node => node.props.testID === 'button');
  return {
    root,
    pressable,
    hostStyle: StyleSheet.flatten(host?.props.style),
    labels: root.findAllByType(NativeText),
  };
}

describe('botão', () => {
  describe('dado um botão desabilitado', () => {
    test('CA-04: quando renderizado, então o toque fica bloqueado e o rótulo fica cinza', async () => {
      const onPress = jest.fn();
      const view = await render(
        <Button
          testID="button"
          label="FAZER LOGIN"
          onPress={onPress}
          disabled
        />,
      );

      expect(view.pressable.props.disabled).toBe(true);
      expect(view.pressable.props.accessibilityState).toEqual({
        disabled: true,
        busy: false,
      });
      expect(StyleSheet.flatten(view.labels[0]?.props.style).color).toBe(
        theme.colors.textDisabled,
      );
    });
  });

  describe('dado um botão habilitado', () => {
    test('CA-05: quando tocado, então a ação é chamada uma vez e o rótulo fica preto', async () => {
      const onPress = jest.fn();
      const view = await render(
        <Button testID="button" label="FAZER LOGIN" onPress={onPress} />,
      );

      await ReactTestRenderer.act(() => {
        view.pressable.props.onPress({});
      });

      expect(onPress).toHaveBeenCalledTimes(1);
      expect(view.hostStyle.backgroundColor).toBe(theme.colors.accent);
      expect(StyleSheet.flatten(view.labels[0]?.props.style).color).toBe(
        theme.colors.textOnAccent,
      );
    });
  });

  describe('dado um botão carregando', () => {
    test('CA-06: quando renderizado, então o rótulo some, o indicador aparece e o toque fica bloqueado', async () => {
      const view = await render(
        <Button
          testID="button"
          label="FAZER LOGIN"
          onPress={jest.fn()}
          loading
        />,
      );

      const indicator = view.root.findByType(ActivityIndicator);
      expect(indicator.props.color).toBe(theme.colors.textOnAccent);
      expect(indicator.props.size).toBe('small');
      expect(view.labels).toHaveLength(0);
      expect(view.pressable.props.disabled).toBe(true);
      expect(view.pressable.props.accessibilityState).toEqual({
        disabled: true,
        busy: true,
      });
      const content = view.root
        .findAllByType(View)
        .find(
          node =>
            StyleSheet.flatten(node.props.style)?.height ===
            theme.sizes.buttonHeight,
        );
      expect(content).toBeDefined();
    });
  });

  describe('dado um botão que estende o fundo pela área segura', () => {
    test('CA-07: quando há indicador de início, então o fundo acento cobre o inset inferior', async () => {
      const view = await render(
        <Button
          testID="button"
          label="FAZER LOGIN"
          onPress={jest.fn()}
          bottomInset
        />,
      );

      expect(view.hostStyle.paddingBottom).toBe(34);
      expect(view.hostStyle.backgroundColor).toBe(theme.colors.accent);
    });
  });

  describe('dado um botão sem estender o fundo', () => {
    test('CA-07: quando renderizado, então a área segura não entra na altura', async () => {
      const view = await render(
        <Button testID="button" label="FAZER LOGIN" onPress={jest.fn()} />,
      );

      expect(view.hostStyle.paddingBottom).toBe(0);
    });
  });
});
