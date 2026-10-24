import { useTheme } from '@shopify/restyle';
import type { PropsWithChildren } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { createVariantBox } from '@/shared/lib/createVariantBox';
import { PressableOpacity } from '@/shared/components/PressableOpacity';
import type { Theme } from '@/shared/theme';

const CardBox = createVariantBox('cardVariants');
const AnimatedCardBox = Animated.createAnimatedComponent(CardBox);

type CardProps = PropsWithChildren<{
  selected?: boolean;
  onPress?: () => void;
  paddingHorizontal?: keyof Theme['spacing'];
  accessibilityLabel?: string;
  testID?: string;
}>;

export function Card({
  children,
  selected = false,
  onPress,
  paddingHorizontal = 'none',
  accessibilityLabel,
  testID,
}: CardProps) {
  const { motion } = useTheme<Theme>();
  const surface = (
    <CardBox
      variant="surface"
      paddingHorizontal={paddingHorizontal}
      testID={testID}
      accessibilityLabel={onPress ? undefined : accessibilityLabel}
      accessibilityState={onPress ? undefined : { selected }}
    >
      {children}
      {selected ? (
        <AnimatedCardBox
          variant="selectedOutline"
          testID="card-selected-border"
          pointerEvents="none"
          entering={FadeIn.duration(motion.medium)}
          exiting={FadeOut.duration(motion.medium)}
        />
      ) : null}
    </CardBox>
  );

  if (!onPress) {
    return surface;
  }

  return (
    <PressableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
    >
      {surface}
    </PressableOpacity>
  );
}
