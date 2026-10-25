import { z } from 'zod';

import type { AlunoDto } from '@/shared/dto/aluno.dto';

import { agendaDiaSchema } from './agenda.validation';
import { boletimSchema } from './boletim.validation';

export const alunoSchema = z.object({
  rm: z.number(),
  turma: z.string(),
  periodo: z.string(),
  primeiroNome: z.string(),
  sobrenome: z.string(),
  agenda: z.array(agendaDiaSchema).default([]),
  boletim: z.array(boletimSchema).default([]),
}) satisfies z.ZodType<AlunoDto>;
