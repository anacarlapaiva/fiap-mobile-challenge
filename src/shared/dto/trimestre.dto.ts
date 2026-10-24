import type { DisciplinaDto } from './disciplina.dto';

export type TrimestreDto = {
  trimestre: number;
  disciplinas: DisciplinaDto[];
};
