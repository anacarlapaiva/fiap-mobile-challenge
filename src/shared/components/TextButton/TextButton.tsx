import { Box } from '@/shared/components/Box';
import { Icon } from '@/shared/components/Icon';
import type { IconName } from '@/shared/components/Icon';
import { PressableOpacity } from '@/shared/components/PressableOpacity';
import { Text } from '@/shared/components/Text';

type TextButtonTone = 'default' | 'accent';

type TextButtonProps = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  tone?: TextButtonTone;
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
  testID,
}: TextButtonProps) {
  const { textVariant, iconColor, iconSize } = tones[tone];

  return (
    <PressableOpacity
      testID={testID}
      onPress={onPress}
      flexDirection="row"
      alignItems="center"
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text variant={textVariant}>{label}</Text>
      {icon ? (
        <Box marginLeft="iconGap">
          <Icon name={icon} color={iconColor} size={iconSize} />
        </Box>
      ) : null}
    </PressableOpacity>
  );
}
