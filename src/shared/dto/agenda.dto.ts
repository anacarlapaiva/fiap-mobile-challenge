import type { AulaDto } from './aula.dto';

export type AgendaDiaDto = {
  dia: string;
  aulas: AulaDto[];
};
