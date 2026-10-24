import { Empty, Screen } from '@/shared/components';

export function LoggedScreen() {
  return (
    <Screen testID="logged-screen" edges={[]}>
      <Empty message="Sem aulas neste dia" />
    </Screen>
  );
}
