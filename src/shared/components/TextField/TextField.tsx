import { createText, useTheme } from '@shopify/restyle';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import Animated, {
  cancelAnimation,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { createVariantBox } from '@/shared/lib/createVariantBox';
import { Icon } from '@/shared/components/Icon';
import { PressableOpacity } from '@/shared/components/PressableOpacity';
import { Text } from '@/shared/components/Text';
import type { Theme } from '@/shared/theme';

const ThemedTextInput = createText<Theme, TextInputProps>(TextInput);
const FieldBox = createVariantBox('textFieldVariants');
const AnimatedFieldBox = Animated.createAnimatedComponent(FieldBox);

const styles = StyleSheet.create({
  hiddenValue: { color: 'transparent' },
});

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secure?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  maxLength?: number;
  testID?: string;
};

export function TextField({
  label,
  value,
  onChangeText,
  secure = false,
  keyboardType = 'default',
  maxLength,
  testID,
}: TextFieldProps) {
  const theme = useTheme<Theme>();
  const { motion, spacing } = theme;
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const masked = secure && !revealed;
  const inset = secure ? 'fieldToggleInset' : 'none';
  const filled = useSharedValue(value.length > 0 ? 1 : 0);
  const caretOpacity = useSharedValue(0);

  useEffect(() => {
    filled.value = withTiming(value.length > 0 ? 1 : 0, {
      duration: motion.short,
    });
  }, [filled, motion.short, value]);

  useEffect(() => {
    if (masked && focused) {
      caretOpacity.value = 1;
      caretOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: motion.caretBlink }),
          withTiming(1, { duration: motion.caretBlink }),
        ),
        -1,
      );
      return () => cancelAnimation(caretOpacity);
    }
    cancelAnimation(caretOpacity);
    caretOpacity.value = 0;
  }, [caretOpacity, focused, masked, motion.caretBlink]);

  const lineStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      filled.value,
      [0, 1],
      [theme.colors.inputLine, theme.colors.inputLineFilled],
    ),
  }));

  const caretStyle = useAnimatedStyle(() => ({
    opacity: caretOpacity.value,
  }));

  const mask = '*'.repeat(value.length);
  const valueHeight = { height: theme.textVariants.inputValue.lineHeight };

  return (
    <FieldBox variant="container">
      <Text variant="inputLabel">{label}</Text>
      <FieldBox variant="value">
        {masked ? (
          <FieldBox
            variant="mask"
            paddingHorizontal={inset}
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <Text
              variant="inputValue"
              testID="text-field-mask"
              numberOfLines={1}
            >
              {mask}
            </Text>
            <AnimatedFieldBox variant="caret" style={caretStyle} />
          </FieldBox>
        ) : null}
        <ThemedTextInput
          testID={testID}
          variant="inputValue"
          padding="none"
          paddingHorizontal={inset}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType={keyboardType}
          maxLength={maxLength}
          textAlign="center"
          allowFontScaling={false}
          underlineColorAndroid="transparent"
          selectionColor={theme.colors.textPrimary}
          accessibilityLabel={label}
          autoCorrect={false}
          autoCapitalize="none"
          spellCheck={false}
          style={[valueHeight, masked ? styles.hiddenValue : undefined]}
          {...(secure
            ? {
                secureTextEntry: masked,
                caretHidden: masked,
                contextMenuHidden: true,
                autoComplete: 'off',
                textContentType: 'none',
                importantForAutofill: 'no',
              }
            : {})}
          {...(masked
            ? {
                accessibilityValue: { text: mask },
                selection: { start: value.length, end: value.length },
              }
            : {})}
        />
        {secure ? (
          <FieldBox variant="toggle">
            <PressableOpacity
              testID="text-field-toggle"
              onPress={() => setRevealed(current => !current)}
              hitSlop={spacing.m}
              accessibilityRole="button"
              accessibilityLabel={revealed ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <Icon
                name={revealed ? 'eyeOff' : 'eye'}
                color="inputLine"
                size="m"
              />
            </PressableOpacity>
          </FieldBox>
        ) : null}
      </FieldBox>
      <AnimatedFieldBox
        variant="line"
        testID="text-field-line"
        style={lineStyle}
      />
    </FieldBox>
  );
}
