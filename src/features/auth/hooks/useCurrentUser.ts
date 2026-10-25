import { useGuardians } from '@/features/auth/hooks/useGuardians';
import { findUser } from '@/features/auth/session/findUser';
import { useSession } from '@/features/auth/session/SessionProvider';
import type { UserState } from '@/features/auth/types';

export function useCurrentUser(): UserState {
  const { session } = useSession();
  const guardians = useGuardians();

  if (!session) {
    return { status: 'anonymous' };
  }

  const retry = () => {
    guardians.refetch().catch(() => undefined);
  };

  if (guardians.data === undefined) {
    return guardians.isError && !guardians.isFetching
      ? { status: 'error', retry }
      : { status: 'loading' };
  }

  const user = findUser(session, guardians.data);
  if (!user) {
    return guardians.isFetching
      ? { status: 'loading' }
      : { status: 'error', retry };
  }
  return { status: 'ready', user };
}
