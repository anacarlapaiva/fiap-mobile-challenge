import type { AulaDto } from './aula.dto';

export interface AgendaDiaDto {
  dia: string;
  aulas: AulaDto[];
}
