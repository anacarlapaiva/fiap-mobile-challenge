import { useTheme } from '@shopify/restyle';
import { ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createVariantBox } from '@/shared/lib/createVariantBox';
import { PressableOpacity } from '@/shared/components/PressableOpacity';
import { Text } from '@/shared/components/Text';
import type { Theme } from '@/shared/theme';

const ButtonContent = createVariantBox('buttonVariants');

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  bottomInset?: boolean;
  testID?: string;
};

export function Button({
  label,
  onPress,
  disabled = false,
  loading = false,
  bottomInset = false,
  testID,
}: ButtonProps) {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const inactive = disabled || loading;
  const insetPadding = { paddingBottom: bottomInset ? insets.bottom : 0 };

  return (
    <PressableOpacity
      testID={testID}
      backgroundColor="accent"
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={insetPadding}
    >
      <ButtonContent variant="primary">
        {loading ? (
          <ActivityIndicator
            size="small"
            color={theme.colors.textOnAccent}
            testID="button-loading"
          />
        ) : (
          <Text
            variant="button"
            color={disabled ? 'textDisabled' : 'textOnAccent'}
          >
            {label}
          </Text>
        )}
      </ButtonContent>
    </PressableOpacity>
  );
}
