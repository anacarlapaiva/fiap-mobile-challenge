import { z } from 'zod';

import type { AgendaDiaDto } from '@/shared/dto/agenda.dto';

import { aulaSchema } from './aula.validation';

export const agendaDiaSchema = z.object({
  dia: z.iso.date(),
  aulas: z.array(aulaSchema),
}) satisfies z.ZodType<AgendaDiaDto>;
