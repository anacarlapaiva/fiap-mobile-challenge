import { z } from 'zod';

import type { ResponsavelDto } from '@/shared/dto/responsavel.dto';

import { alunoSchema } from './aluno.validation';

const responsavelSchema = z.object({
  id: z.number(),
  cpf: z.string(),
  email: z.string(),
  primeiroNome: z.string(),
  sobrenome: z.string(),
  alunos: z.array(alunoSchema),
}) satisfies z.ZodType<ResponsavelDto>;

const responsaveisSchema = z.array(responsavelSchema) satisfies z.ZodType<
  ResponsavelDto[]
>;

export function parseGuardian(input: unknown): ResponsavelDto {
  return responsavelSchema.parse(input);
}

export function parseGuardians(input: unknown): ResponsavelDto[] {
  return responsaveisSchema.parse(input);
}
