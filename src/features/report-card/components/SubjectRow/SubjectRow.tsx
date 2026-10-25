import { useTheme } from '@shopify/restyle';
import { type ComponentRef, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  LinearTransition,
  useReducedMotion,
} from 'react-native-reanimated';

import {
  formatAbsences,
  formatGrade,
  formatSubjectName,
} from '@/features/report-card/formatReportCard';
import { useCaretStyle } from '@/features/report-card/hooks/useCaretStyle';
import { Box, Icon, PressableOpacity, Text } from '@/shared/components';
import type { Theme } from '@/shared/theme';

const AnimatedBox = Animated.createAnimatedComponent(Box);

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
});

type SubjectRowProps = {
  nome: string;
  nota: number | null;
  faltas: number | null;
  open: boolean;
  onPress: () => void;
  onReveal?: (node: ComponentRef<typeof View> | null) => void;
};

export function SubjectRow({
  nome,
  nota,
  faltas,
  open,
  onPress,
  onReveal,
}: SubjectRowProps) {
  const theme = useTheme<Theme>();
  const reducedMotion = useReducedMotion();
  const layout = reducedMotion
    ? undefined
    : LinearTransition.duration(theme.motion.medium);
  const caretStyle = useCaretStyle(open);
  const rowRef = useRef<ComponentRef<typeof View>>(null);

  useEffect(() => {
    if (!open || !onReveal) {
      return;
    }
    const frame = requestAnimationFrame(() => {
      onReveal(rowRef.current);
    });
    return () => cancelAnimationFrame(frame);
  }, [onReveal, open]);

  const label = formatSubjectName(nome);

  return (
    <Animated.View layout={layout}>
      <View ref={rowRef} collapsable={false}>
        <PressableOpacity
          testID={`subject-${nome}`}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ expanded: open }}
        >
          <Box
            height={theme.sizes.subjectRowHeight}
            paddingHorizontal="s"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text variant="captionMedium">{label}</Text>
            <AnimatedBox style={caretStyle} testID={`subject-${nome}-caret`}>
              <Icon name="arrow" color="accent" size="m" />
            </AnimatedBox>
          </Box>
        </PressableOpacity>
        <Animated.View layout={layout} style={styles.clip}>
          {open ? (
            <Box paddingHorizontal="s" paddingBottom="s">
              <Text variant="captionMedium">{`Nota: ${formatGrade(
                nota,
              )}`}</Text>
              <Text variant="captionMedium">{`Faltas: ${formatAbsences(
                faltas,
              )}`}</Text>
            </Box>
          ) : null}
        </Animated.View>
      </View>
    </Animated.View>
  );
}
