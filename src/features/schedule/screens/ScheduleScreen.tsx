import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { useCurrentUser } from '@/features/auth';
import { LessonRow } from '@/features/schedule/components/LessonRow';
import { formatAgendaDay } from '@/features/schedule/utils/formatAgendaDay';
import { Box, Dropdown, Empty, Screen, Text } from '@/shared/components';

const styles = StyleSheet.create({
  lessons: { flex: 1 },
});

export function ScheduleScreen() {
  const currentUser = useCurrentUser();
  const days =
    currentUser.status === 'ready' ? currentUser.user.student.agenda : [];
  const [pickedDia, setPickedDia] = useState<string | undefined>(undefined);
  const selectedDia =
    pickedDia !== undefined && days.some(day => day.dia === pickedDia)
      ? pickedDia
      : days[0]?.dia;
  const selectedDay = days.find(day => day.dia === selectedDia);
  const aulas = selectedDay?.aulas ?? [];

  return (
    <Screen testID="schedule-screen" edges={[]}>
      <Text variant="sectionTitle" textAlign="center" marginTop="sectionGap">
        AGENDA
      </Text>
      {selectedDia !== undefined ? (
        <Box paddingHorizontal="l" marginTop="m">
          <Dropdown
            testID="agenda-day"
            value={selectedDia}
            options={days.map(day => ({
              label: formatAgendaDay(day.dia),
              value: day.dia,
            }))}
            onSelect={option => setPickedDia(option.value)}
            textInset="m"
          />
        </Box>
      ) : null}
      {selectedDia !== undefined && aulas.length === 0 ? (
        <Empty message="Sem aulas neste dia" />
      ) : null}
      {aulas.length > 0 ? (
        <Box flex={1}>
          <ScrollView
            testID="agenda-lessons"
            style={styles.lessons}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {aulas.map((aula, index) => (
              <LessonRow
                key={`${aula.horario}-${aula.disciplina}-${index}`}
                aula={aula}
              />
            ))}
          </ScrollView>
        </Box>
      ) : null}
    </Screen>
  );
}
