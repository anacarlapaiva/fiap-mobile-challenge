import type { TrimestreDto } from './trimestre.dto';

export type BoletimDto = {
  ano: string;
  turma: string;
  trimestres: TrimestreDto[];
};
