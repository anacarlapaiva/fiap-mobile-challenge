import { useTheme } from '@shopify/restyle';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useSession } from '@/features/auth/session/SessionProvider';
import { Box, Logo, Text, TextButton } from '@/shared/components';
import type { Theme } from '@/shared/theme';

type HeaderProps = {
  onSwitchProfile: () => void;
};

export function Header({ onSwitchProfile }: HeaderProps) {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const { signOut } = useSession();
  const currentUser = useCurrentUser();
  const ready = currentUser.status === 'ready' ? currentUser.user : null;
  const canSwitch = ready !== null && ready.guardian.alunos.length > 1;

  const topInset = { paddingTop: insets.top };

  const confirmSignOut = () => {
    Alert.alert(
      'Sair da conta?',
      'Você vai precisar entrar de novo com CPF e senha.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            signOut().catch(() => undefined);
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <Box testID="header" backgroundColor="background">
      <Box style={topInset}>
        <Box
          height={theme.sizes.actionsBarHeight}
          paddingHorizontal="m"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Logo size="small" />
          {ready ? (
            <Box flexDirection="row" alignItems="center">
              {canSwitch ? (
                <TextButton
                  testID="switch-profile"
                  label="TROCAR PERFIL"
                  onPress={onSwitchProfile}
                />
              ) : null}
              <Box marginLeft={canSwitch ? 'm' : 'none'}>
                <TextButton
                  testID="logout"
                  label="SAIR"
                  icon="logout"
                  onPress={confirmSignOut}
                />
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
      {ready ? (
        <Box paddingHorizontal="m" paddingTop="m" alignItems="center">
          <Box flexDirection="row">
            <Text variant="greeting">Olá, </Text>
            <Box flexShrink={1}>
              <Text variant="greetingName" numberOfLines={1}>
                {ready.guardian.primeiroNome.toLocaleUpperCase('pt-BR')}
              </Text>
            </Box>
          </Box>
          <Text variant="bodyMedium" marginTop="greetingGap">
            {ready.student.primeiroNome.toLocaleUpperCase('pt-BR')}
          </Text>
          <Text variant="body" marginTop="fieldLineGap">
            {`${ready.student.turma} - RM ${ready.student.rm} - ${ready.student.periodo}`}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}
