import { z } from 'zod';

import type { TrimestreDto } from '@/shared/dto/trimestre.dto';

import { disciplinaSchema } from './disciplina.validation';

export const trimestreSchema = z.object({
  trimestre: z.number(),
  disciplinas: z.array(disciplinaSchema),
}) satisfies z.ZodType<TrimestreDto>;
