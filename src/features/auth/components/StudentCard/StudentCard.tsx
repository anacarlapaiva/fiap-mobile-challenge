import { useTheme } from '@shopify/restyle';
import { ActivityIndicator } from 'react-native';
import Animated from 'react-native-reanimated';

import { Box, Card, Text } from '@/shared/components';
import type { AlunoDto } from '@/shared/dto';
import { usePulse } from '@/shared/hooks/usePulse';
import type { Theme } from '@/shared/theme';

const AnimatedBox = Animated.createAnimatedComponent(Box);

type StudentCardProps = {
  student: AlunoDto;
  selected: boolean;
  disabled: boolean;
  loading: boolean;
  onPress: () => void;
  onPulseEnd: () => void;
};

export function StudentCard({
  student,
  selected,
  disabled,
  loading,
  onPress,
  onPulseEnd,
}: StudentCardProps) {
  const { colors } = useTheme<Theme>();
  const { pulseStyle, pulse } = usePulse();
  const name = `${student.primeiroNome} ${student.sobrenome}`.toLocaleUpperCase(
    'pt-BR',
  );
  const details = `${student.turma} - RM ${student.rm} - ${student.periodo}`;

  const handlePress = () => {
    if (disabled) {
      return;
    }
    onPress();
    pulse(onPulseEnd);
  };

  return (
    <AnimatedBox style={pulseStyle}>
      <Card
        testID={`student-${student.rm}`}
        selected={selected}
        onPress={handlePress}
        paddingHorizontal="m"
        accessibilityLabel={`${name}, ${details}`}
      >
        <Box flex={1} paddingVertical="m" justifyContent="space-between">
          <Text variant="bodyMedium" numberOfLines={1}>
            {name}
          </Text>
          <Text variant="body" numberOfLines={1}>
            {details}
          </Text>
        </Box>
        {loading ? (
          <Box
            position="absolute"
            top={0}
            bottom={0}
            right={0}
            paddingRight="m"
            justifyContent="center"
          >
            <ActivityIndicator
              testID="student-loading"
              size="small"
              color={colors.accent}
            />
          </Box>
        ) : null}
      </Card>
    </AnimatedBox>
  );
}
