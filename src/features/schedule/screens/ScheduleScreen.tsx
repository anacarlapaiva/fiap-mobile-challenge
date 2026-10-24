import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { useCurrentUser } from '@/features/auth';
import { LessonRow } from '@/features/schedule/components/LessonRow';
import { formatAgendaDay } from '@/features/schedule/formatAgendaDay';
import { Box, Dropdown, Empty, Screen, Text } from '@/shared/components';

const styles = StyleSheet.create({
  lessons: { flex: 1 },
});

function AgendaTitle() {
  return (
    <Text variant="sectionTitle" textAlign="center" marginTop="sectionGap">
      AGENDA
    </Text>
  );
}

export function ScheduleScreen() {
  const currentUser = useCurrentUser();
  const [pickedDia, setPickedDia] = useState<string | undefined>(undefined);

  if (currentUser.status !== 'ready') {
    return (
      <Screen testID="schedule-screen" edges={[]}>
        <AgendaTitle />
      </Screen>
    );
  }

  const days = currentUser.user.student.agenda;
  const selectedDay = days.find(day => day.dia === pickedDia) ?? days[0];

  if (!selectedDay) {
    return (
      <Screen testID="schedule-screen" edges={[]}>
        <AgendaTitle />
        <Empty message="Nenhuma aula cadastrada." />
      </Screen>
    );
  }

  const aulas = selectedDay.aulas;

  return (
    <Screen testID="schedule-screen" edges={[]}>
      <AgendaTitle />
      <Box paddingHorizontal="l" marginTop="m">
        <Dropdown
          testID="agenda-day"
          value={selectedDay.dia}
          options={days.map(day => ({
            label: formatAgendaDay(day.dia),
            value: day.dia,
          }))}
          onSelect={option => setPickedDia(option.value)}
          textInset="m"
        />
      </Box>
      {aulas.length === 0 ? (
        <Empty message="Sem aulas neste dia" />
      ) : (
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
      )}
    </Screen>
  );
}
