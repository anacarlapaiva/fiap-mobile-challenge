import { useQuery, type QueryClient } from '@tanstack/react-query';

import { readGuardians } from '@/shared/mocks';

const guardiansQuery = {
  queryKey: ['guardians'],
  queryFn: readGuardians,
};

export function useGuardians() {
  return useQuery(guardiansQuery);
}

export function ensureGuardians(queryClient: QueryClient) {
  return queryClient.ensureQueryData(guardiansQuery);
}
