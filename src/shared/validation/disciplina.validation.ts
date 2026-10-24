import { z } from 'zod';

import type { DisciplinaDto } from '@/shared/dto/disciplina.dto';

export const disciplinaSchema = z.object({
  nome: z.string(),
  nota: z.number().nullable(),
  faltas: z.number().nullable(),
}) satisfies z.ZodType<DisciplinaDto>;
