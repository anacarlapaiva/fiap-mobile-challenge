import { z } from 'zod';

import type { BoletimDto } from '@/shared/dto/boletim.dto';

import { trimestreSchema } from './trimestre.validation';

export const boletimSchema = z.object({
  ano: z.string(),
  turma: z.string(),
  trimestres: z.array(trimestreSchema),
}) satisfies z.ZodType<BoletimDto>;
