import { useTheme } from '@shopify/restyle';

import { Box } from '@/shared/components/Box';
import { Icon } from '@/shared/components/Icon';
import type { IconName } from '@/shared/components/Icon';
import { PressableOpacity } from '@/shared/components/PressableOpacity';
import { Text } from '@/shared/components/Text';
import type { Theme } from '@/shared/theme';

type TextButtonTone = 'default' | 'accent';

type TextButtonProps = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  tone?: TextButtonTone;
  accessibilityLabel?: string;
  testID?: string;
};

const tones = {
  default: { textVariant: 'caption', iconColor: 'textPrimary', iconSize: 's' },
  accent: { textVariant: 'actionAccent', iconColor: 'accent', iconSize: 'l' },
} as const;

export function TextButton({
  label,
  onPress,
  icon,
  tone = 'default',
  accessibilityLabel,
  testID,
}: TextButtonProps) {
  const { spacing } = useTheme<Theme>();
  const { textVariant, iconColor, iconSize } = tones[tone];

  return (
    <PressableOpacity
      testID={testID}
      onPress={onPress}
      hitSlop={{
        top: spacing.m,
        bottom: spacing.m,
        left: spacing.xs,
        right: spacing.xs,
      }}
      flexDirection="row"
      alignItems="center"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <Text variant={textVariant} numberOfLines={1}>
        {label}
      </Text>
      {icon ? (
        <Box marginLeft="iconGap">
          <Icon name={icon} color={iconColor} size={iconSize} />
        </Box>
      ) : null}
    </PressableOpacity>
  );
}
