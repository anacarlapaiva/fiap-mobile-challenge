import type { AgendaDiaDto } from './agenda.dto';
import type { BoletimDto } from './boletim.dto';

export type AlunoDto = {
  rm: number;
  turma: string;
  periodo: string;
  primeiroNome: string;
  sobrenome: string;
  agenda: AgendaDiaDto[];
  boletim: BoletimDto[];
};
