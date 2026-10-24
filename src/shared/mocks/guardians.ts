import type { ResponsavelDto } from '@/shared/dto';
import { parseGuardians } from '@/shared/validation';

import guardiansMock from './responsaveis.json';

let guardians: ResponsavelDto[] | undefined;

export function readGuardians(): ResponsavelDto[] {
  guardians ??= parseGuardians(guardiansMock);
  return guardians;
}
