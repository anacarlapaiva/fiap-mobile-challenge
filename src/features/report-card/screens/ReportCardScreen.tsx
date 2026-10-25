import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useCurrentUser, UserFallback } from '@/features/auth';
import { TermSection } from '@/features/report-card/components/TermSection';
import {
  formatYearLabel,
  yearKey,
} from '@/features/report-card/formatReportCard';
import { useReportScroll } from '@/features/report-card/hooks/useReportScroll';
import { Box, Dropdown, Empty, Screen, Text } from '@/shared/components';

const styles = StyleSheet.create({
  terms: { flex: 1 },
});

function ReportTitle() {
  return (
    <Text variant="sectionTitle" textAlign="center" marginTop="sectionGap">
      BOLETIM
    </Text>
  );
}

export function ReportCardScreen() {
  const currentUser = useCurrentUser();
  const [pickedKey, setPickedKey] = useState<string | undefined>(undefined);
  const [openTerm, setOpenTerm] = useState<number | undefined>(undefined);
  const [openSubjects, setOpenSubjects] = useState<readonly string[]>([]);
  const scroll = useReportScroll(openTerm);

  if (currentUser.status !== 'ready') {
    return (
      <Screen testID="report-card-screen" edges={[]}>
        <ReportTitle />
        <UserFallback state={currentUser} />
      </Screen>
    );
  }

  const reports = currentUser.user.student.boletim;
  const selected =
    reports.find(item => yearKey(item.turma, item.ano) === pickedKey) ??
    reports[0];

  if (!selected) {
    return (
      <Screen testID="report-card-screen" edges={[]}>
        <ReportTitle />
        <Empty message="Nenhum boletim disponível." />
      </Screen>
    );
  }

  const selectedKey = yearKey(selected.turma, selected.ano);

  const selectYear = (key: string) => {
    if (key === selectedKey) {
      return;
    }
    setPickedKey(key);
    setOpenTerm(undefined);
    setOpenSubjects([]);
  };

  const toggleTerm = (trimestre: number) => {
    setOpenTerm(current => (current === trimestre ? undefined : trimestre));
    setOpenSubjects([]);
  };

  const toggleSubject = (nome: string) => {
    setOpenSubjects(current =>
      current.includes(nome)
        ? current.filter(item => item !== nome)
        : [...current, nome],
    );
  };

  return (
    <Screen testID="report-card-screen" edges={[]}>
      <ReportTitle />
      <Box paddingHorizontal="m" marginTop="m">
        <Dropdown
          testID="report-year"
          value={selectedKey}
          textInset="s"
          options={reports.map(item => ({
            label: formatYearLabel(item.turma, item.ano),
            value: yearKey(item.turma, item.ano),
          }))}
          onSelect={option => selectYear(option.value)}
        />
      </Box>
      <Box flex={1}>
        <ScrollView
          {...scroll.scrollProps}
          testID="report-terms"
          style={styles.terms}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
        >
          <View {...scroll.contentProps} collapsable={false}>
            <Box paddingHorizontal="m" paddingTop="m">
              {selected.trimestres.map((term, index) => (
                <TermSection
                  key={term.trimestre}
                  trimestre={term.trimestre}
                  disciplinas={term.disciplinas}
                  open={openTerm === term.trimestre}
                  openSubjects={openSubjects}
                  spaced={index > 0}
                  onToggle={() => toggleTerm(term.trimestre)}
                  onToggleSubject={toggleSubject}
                  onRevealSubject={scroll.revealSubject}
                  sectionRef={scroll.registerTerm(term.trimestre)}
                />
              ))}
            </Box>
          </View>
        </ScrollView>
      </Box>
    </Screen>
  );
}
