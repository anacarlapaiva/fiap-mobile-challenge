import { useQuery, type QueryClient } from '@tanstack/react-query';

import { readGuardians } from '@/shared/mocks';

export const guardiansQueryKey = ['guardians'] as const;

const guardiansQuery = {
  queryKey: guardiansQueryKey,
  queryFn: readGuardians,
};

type GuardiansQueryOptions = {
  enabled?: boolean;
};

export function useGuardians(options?: GuardiansQueryOptions) {
  return useQuery({
    ...guardiansQuery,
    enabled: options?.enabled ?? true,
  });
}

export function ensureGuardians(queryClient: QueryClient) {
  return queryClient.ensureQueryData(guardiansQuery);
}
