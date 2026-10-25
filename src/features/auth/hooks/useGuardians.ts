import { useQuery, type QueryClient } from '@tanstack/react-query';

import { readAccountGuardian } from '@/features/auth/data/account';
import type { ResponsavelDto } from '@/shared/dto';

async function readSignedInGuardians(): Promise<ResponsavelDto[]> {
  const guardian = await readAccountGuardian();
  return guardian ? [guardian] : [];
}

const guardiansQuery = {
  queryKey: ['guardians'],
  queryFn: readSignedInGuardians,
  retry: 2,
};

export function useGuardians() {
  return useQuery(guardiansQuery);
}

export function ensureGuardians(queryClient: QueryClient) {
  return queryClient.ensureQueryData(guardiansQuery);
}
