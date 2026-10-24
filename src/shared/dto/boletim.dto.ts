import type { TrimestreDto } from './trimestre.dto';

export interface BoletimDto {
  ano: string;
  turma: string;
  trimestres: TrimestreDto[];
}
