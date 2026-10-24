import { useTheme } from '@shopify/restyle';
import type { ComponentRef, Ref } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { SubjectRow } from '@/features/report-card/components/SubjectRow';
import { formatTrimesterLabel } from '@/features/report-card/formatReportCard';
import { useCaretStyle } from '@/features/report-card/useCaretStyle';
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
  const caretStyle = useCaretStyle(open);
  const label = formatTrimesterLabel(trimestre);

  return (
    <Box
      collapsable={false}
      marginTop={spaced ? 'm' : 'none'}
      testID={`term-section-${trimestre}`}
    >
      <View ref={sectionRef} collapsable={false}>
        <Card
          onPress={onToggle}
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
        <Animated.View
          layout={LinearTransition.duration(theme.motion.medium)}
          style={styles.clip}
        >
          {open
            ? disciplinas.map(disciplina => (
                <SubjectRow
                  key={disciplina.nome}
                  nome={disciplina.nome}
                  nota={disciplina.nota}
                  faltas={disciplina.faltas}
                  open={openSubjects.includes(disciplina.nome)}
                  onPress={() => onToggleSubject(disciplina.nome)}
                  onReveal={onRevealSubject}
                />
              ))
            : null}
        </Animated.View>
      </View>
    </Box>
  );
}
