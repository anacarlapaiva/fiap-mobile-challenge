import { AuthNavigator } from '@/app/navigation/AuthNavigator';
import { PrivateNavigator } from '@/app/navigation/PrivateNavigator';
import { useSession } from '@/features/auth';

export function RootNavigator() {
  const { session } = useSession();
  if (session) {
    return <PrivateNavigator />;
  }
  return <AuthNavigator />;
}
