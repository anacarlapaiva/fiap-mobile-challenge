import type { ResponsavelDto } from '@/shared/dto';
import { parseGuardians } from '@/shared/validation';

import guardiansMock from './responsaveis.json';

const guardians = parseGuardians(guardiansMock);

export function readGuardians(): ResponsavelDto[] {
  return guardians;
}
