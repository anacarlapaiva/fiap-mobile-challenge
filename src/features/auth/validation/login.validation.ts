import type { ResponsavelDto } from '@/shared/dto';

import type { Session } from '@/features/auth/types';

export const loginMessages = {
  emptyCpf: 'Informe o CPF.',
  length: 'O CPF deve ter 11 dígitos.',
  repeated: 'O CPF não pode ter todos os dígitos iguais.',
  checksum: 'O CPF informado é inválido.',
  emptyPassword: 'Informe a senha.',
  credentials: 'CPF ou senha não conferem.',
} as const;

export type LoginResult =
  | { ok: false; message: string }
  | { ok: true; session: Session };

export function applyCpfMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2');
}

function checkDigit(digits: string, startWeight: number): number {
  let total = 0;
  for (let index = 0; index < digits.length; index += 1) {
    total += Number(digits[index]) * (startWeight - index);
  }
  const remainder = total % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function assessLogin(
  cpf: string,
  password: string,
  guardians: readonly ResponsavelDto[],
): LoginResult {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length === 0) {
    return { ok: false, message: loginMessages.emptyCpf };
  }
  if (digits.length !== 11) {
    return { ok: false, message: loginMessages.length };
  }
  if (/^(\d)\1{10}$/.test(digits)) {
    return { ok: false, message: loginMessages.repeated };
  }
  const first = checkDigit(digits.slice(0, 9), 10);
  const second = checkDigit(digits.slice(0, 10), 11);
  if (first !== Number(digits[9]) || second !== Number(digits[10])) {
    return { ok: false, message: loginMessages.checksum };
  }
  if (password.length === 0) {
    return { ok: false, message: loginMessages.emptyPassword };
  }
  const guardian = guardians.find(
    item => item.cpf === digits && item.senha === password,
  );
  const student = guardian?.alunos[0];
  if (!guardian || !student) {
    return { ok: false, message: loginMessages.credentials };
  }
  return {
    ok: true,
    session: { guardianId: guardian.id, studentRm: student.rm },
  };
}
