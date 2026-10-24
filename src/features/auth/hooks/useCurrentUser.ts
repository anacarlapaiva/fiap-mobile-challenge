import { useGuardians } from '@/features/auth/hooks/useGuardians';
import { findUser } from '@/features/auth/session/findUser';
import { useSession } from '@/features/auth/session/SessionProvider';
import type { UserState } from '@/features/auth/types';

export function useCurrentUser(): UserState {
  const { session } = useSession();
  const guardians = useGuardians({ enabled: session !== null });

  if (!session) {
    return { status: 'anonymous' };
  }
  if (guardians.isPending) {
    return { status: 'loading' };
  }

  const user = findUser(session, guardians.data ?? []);
  if (!user) {
    return { status: 'loading' };
  }
  return { status: 'ready', user };
}
