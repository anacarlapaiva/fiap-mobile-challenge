import type { AlunoDto } from './aluno.dto';

export interface ResponsavelDto {
  id: number;
  cpf: string;
  email: string;
  senha: string;
  primeiroNome: string;
  sobrenome: string;
  alunos: AlunoDto[];
}
