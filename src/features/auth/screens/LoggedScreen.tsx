import { Empty, Screen } from '@/shared/components';

export function LoggedScreen() {
  return (
    <Screen testID="logged-screen" edges={['bottom']}>
      <Empty message="Sem aulas neste dia" />
    </Screen>
  );
}
