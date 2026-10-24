import { z } from 'zod';

import type { ResponsavelDto } from '@/shared/dto/responsavel.dto';

import { alunoSchema } from './aluno.validation';

export const responsavelSchema = z.object({
  id: z.number(),
  cpf: z.string(),
  email: z.string(),
  senha: z.string(),
  primeiroNome: z.string(),
  sobrenome: z.string(),
  alunos: z.array(alunoSchema),
}) satisfies z.ZodType<ResponsavelDto>;

export const responsaveisSchema = z.array(
  responsavelSchema,
) satisfies z.ZodType<ResponsavelDto[]>;

export function parseResponsaveis(input: unknown): ResponsavelDto[] {
  return responsaveisSchema.parse(input);
}
