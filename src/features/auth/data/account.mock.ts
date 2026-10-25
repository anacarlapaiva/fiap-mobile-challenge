import { readGuardians } from '@/shared/mocks';

import { accountState } from './accountState';

export function primeAccount(email: string | null) {
  accountState.email = email?.toLowerCase() ?? null;
}

export function primeAccountForGuardian(guardianId: number) {
  const guardian = readGuardians().find(item => item.id === guardianId);
  accountState.email = guardian?.email.toLowerCase() ?? null;
}
