import { z } from 'zod';

import type { AulaDto } from '@/shared/dto/aula.dto';

export const aulaSchema = z.object({
  horario: z.string(),
  disciplina: z.string(),
}) satisfies z.ZodType<AulaDto>;
