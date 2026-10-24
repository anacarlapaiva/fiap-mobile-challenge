import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useSession } from '@/features/auth/session/SessionProvider';
import { Box, Screen, Text, TextButton } from '@/shared/components';

export function LoggedScreen() {
  const { signOut } = useSession();
  const currentUser = useCurrentUser();
  const canSwitch =
    currentUser.status === 'ready' &&
    currentUser.user.guardian.alunos.length > 1;

  return (
    <Screen testID="logged-screen">
      <Box
        flexDirection="row"
        justifyContent="flex-end"
        alignItems="center"
        paddingHorizontal="m"
        paddingVertical="m"
      >
        {canSwitch ? (
          <TextButton
            testID="switch-profile"
            label="TROCAR PERFIL"
            onPress={() => undefined}
          />
        ) : null}
        <Box marginLeft="m">
          <TextButton
            testID="logout"
            label="SAIR"
            icon="logout"
            onPress={signOut}
          />
        </Box>
      </Box>
      <Box flex={1} alignItems="center" justifyContent="center">
        <Text variant="sectionTitle">LOGOU</Text>
      </Box>
    </Screen>
  );
}
