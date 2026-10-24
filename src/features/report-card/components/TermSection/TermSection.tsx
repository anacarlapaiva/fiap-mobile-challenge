import { useTheme } from '@shopify/restyle';
import type { ComponentRef, Ref } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  LinearTransition,
  useReducedMotion,
} from 'react-native-reanimated';

import { SubjectRow } from '@/features/report-card/components/SubjectRow';
import { formatTrimesterLabel } from '@/features/report-card/formatReportCard';
import { useCaretStyle } from '@/features/report-card/hooks/useCaretStyle';
import { Box, Card, Icon, Text } from '@/shared/components';
import type { DisciplinaDto } from '@/shared/dto';
import type { Theme } from '@/shared/theme';

const AnimatedBox = Animated.createAnimatedComponent(Box);

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
});

type SectionNode = ComponentRef<typeof View>;

type TermSectionProps = {
  trimestre: number;
  disciplinas: readonly DisciplinaDto[];
  open: boolean;
  openSubjects: readonly string[];
  spaced: boolean;
  onToggle: () => void;
  onToggleSubject: (nome: string) => void;
  sectionRef?: Ref<SectionNode>;
  onRevealSubject?: (node: SectionNode | null) => void;
};

export function TermSection({
  trimestre,
  disciplinas,
  open,
  openSubjects,
  spaced,
  onToggle,
  onToggleSubject,
  sectionRef,
  onRevealSubject,
}: TermSectionProps) {
  const theme = useTheme<Theme>();
  const reducedMotion = useReducedMotion();
  const layout = reducedMotion
    ? undefined
    : LinearTransition.duration(theme.motion.medium);
  const caretStyle = useCaretStyle(open);
  const label = formatTrimesterLabel(trimestre);

  return (
    <AnimatedBox
      layout={layout}
      collapsable={false}
      marginTop={spaced ? 'm' : 'none'}
      testID={`term-section-${trimestre}`}
    >
      <View ref={sectionRef} collapsable={false}>
        <Card
          onPress={onToggle}
          expanded={open}
          paddingHorizontal="s"
          accessibilityLabel={label}
          testID={`term-${trimestre}`}
        >
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text variant="bodyBold" color="accent">
              {label}
            </Text>
            <AnimatedBox style={caretStyle} testID={`term-${trimestre}-caret`}>
              <Icon name="arrow" color="accent" size="m" />
            </AnimatedBox>
          </Box>
        </Card>
        <Animated.View layout={layout} style={styles.clip}>
          {open ? (
            <View>
              {disciplinas.map(disciplina => (
                <SubjectRow
                  key={disciplina.nome}
                  nome={disciplina.nome}
                  nota={disciplina.nota}
                  faltas={disciplina.faltas}
                  open={openSubjects.includes(disciplina.nome)}
                  onPress={() => onToggleSubject(disciplina.nome)}
                  onReveal={onRevealSubject}
                />
              ))}
            </View>
          ) : null}
        </Animated.View>
      </View>
    </AnimatedBox>
  );
}
