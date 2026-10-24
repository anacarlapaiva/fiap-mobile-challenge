import type { AlunoDto, ResponsavelDto } from '@/shared/dto';

export type Session = {
  guardianId: number;
  studentRm: number;
};

export type User = {
  guardian: ResponsavelDto;
  student: AlunoDto;
};

export type UserState =
  | { status: 'anonymous' }
  | { status: 'loading' }
  | { status: 'ready'; user: User };
