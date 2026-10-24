import type { PropsWithChildren } from 'react';

import { createVariantBox } from '@/shared/lib/createVariantBox';
import { PressableOpacity } from '@/shared/components/PressableOpacity';
import type { Theme } from '@/shared/theme';

const CardBox = createVariantBox('cardVariants');

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
        <CardBox
          variant="selectedOutline"
          testID="card-selected-border"
          pointerEvents="none"
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
