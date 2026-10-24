import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { LayoutAnimationConfig } from 'react-native-reanimated';

import { StudentCard } from '@/features/auth/components/StudentCard';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useSession } from '@/features/auth/session/SessionProvider';
import { Box, Screen, Text, TextButton } from '@/shared/components';
import type { AlunoDto } from '@/shared/dto';
import { showSuccessToast } from '@/shared/lib/toast';

const styles = StyleSheet.create({
  list: { flex: 1 },
});

type StudentSelectionScreenProps = {
  onClose: () => void;
};

function nextFrame() {
  return new Promise<void>(resolve => {
    requestAnimationFrame(() => resolve());
  });
}

export function StudentSelectionScreen({
  onClose,
}: StudentSelectionScreenProps) {
  const { selectStudent } = useSession();
  const currentUser = useCurrentUser();
  const user = currentUser.status === 'ready' ? currentUser.user : null;
  const busy = useRef(false);
  const chosenRm = useRef<number | null>(null);
  const closed = useRef(false);
  const [pendingRm, setPendingRm] = useState<number | null>(null);
  const [switchingRm, setSwitchingRm] = useState<number | null>(null);
  const selectedRm = pendingRm ?? user?.student.rm;

  const close = useCallback(() => {
    if (closed.current) {
      return;
    }
    closed.current = true;
    onClose();
  }, [onClose]);

  const handleClose = () => {
    if (busy.current) {
      return;
    }
    busy.current = true;
    close();
  };

  const choose = (student: AlunoDto) => {
    if (busy.current) {
      return;
    }
    busy.current = true;
    chosenRm.current = student.rm;
    setPendingRm(student.rm);
  };

  const finish = async (student: AlunoDto, isCurrent: boolean) => {
    if (chosenRm.current !== student.rm) {
      return;
    }
    if (isCurrent) {
      close();
      return;
    }
    setSwitchingRm(student.rm);
    await nextFrame();
    const switched = await selectStudent(student.rm).catch(() => false);
    if (switched) {
      await nextFrame();
    }
    close();
    if (switched) {
      showSuccessToast(
        `Perfil alterado para ${student.primeiroNome.toLocaleUpperCase(
          'pt-BR',
        )}`,
      );
    }
  };

  return (
    <Screen testID="student-selection">
      <Box
        flexDirection="row"
        justifyContent="flex-end"
        paddingTop="m"
        paddingHorizontal="m"
      >
        <TextButton
          testID="close"
          label="FECHAR"
          accessibilityLabel="Fechar"
          icon="close"
          tone="accent"
          onPress={handleClose}
        />
      </Box>
      <ScrollView style={styles.list}>
        <Text
          variant="greeting"
          textAlign="center"
          marginTop="selectionTitleGap"
          accessibilityRole="header"
        >
          {'Escolha o perfil\nque você quer visualizar'}
        </Text>
        <LayoutAnimationConfig skipEntering>
          <Box
            marginTop="sectionGap"
            paddingHorizontal="m"
            paddingBottom="m"
            gap="m"
          >
            {user?.guardian.alunos.map(student => {
              const isCurrent = student.rm === user.student.rm;
              return (
                <StudentCard
                  key={student.rm}
                  student={student}
                  selected={student.rm === selectedRm}
                  disabled={pendingRm !== null}
                  loading={student.rm === switchingRm}
                  onPress={() => choose(student)}
                  onPulseEnd={() => {
                    finish(student, isCurrent).catch(() => close());
                  }}
                />
              );
            })}
          </Box>
        </LayoutAnimationConfig>
      </ScrollView>
    </Screen>
  );
}
