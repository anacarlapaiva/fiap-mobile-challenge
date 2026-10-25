import { useTheme } from '@shopify/restyle';
import Toast, {
  type ToastConfig,
  type ToastConfigParams,
} from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/shared/components/Box';
import { PressableBox } from '@/shared/components/PressableBox';
import { Text } from '@/shared/components/Text';
import { createVariantBox } from '@/shared/lib/createVariantBox';
import type { Theme } from '@/shared/theme';

const ToastBox = createVariantBox('toastVariants');

function SuccessToast({ text1, hide }: ToastConfigParams<unknown>) {
  return (
    <Box width="100%" paddingHorizontal="m">
      <PressableBox
        testID="toast-success"
        onPress={() => hide()}
        accessibilityRole="alert"
        accessibilityLabel={text1}
      >
        <ToastBox variant="container">
          <Text variant="body">{text1}</Text>
        </ToastBox>
      </PressableBox>
    </Box>
  );
}

const config: ToastConfig = {
  success: params => <SuccessToast {...params} />,
};

export function ToastHost() {
  const { spacing, motion } = useTheme<Theme>();
  const insets = useSafeAreaInsets();

  return (
    <Toast
      config={config}
      position="top"
      topOffset={insets.top + spacing.m}
      visibilityTime={motion.toastVisibility}
    />
  );
}
