import type { ResponsavelDto } from '@/shared/dto';
import { parseResponsaveis } from '@/shared/validation';

import responsaveisMock from './responsaveis.json';

const responsaveis = parseResponsaveis(responsaveisMock);

export function readResponsaveis(): ResponsavelDto[] {
  return responsaveis;
}
