import type { DisciplinaDto } from './disciplina.dto';

export interface TrimestreDto {
  trimestre: number;
  disciplinas: DisciplinaDto[];
}
