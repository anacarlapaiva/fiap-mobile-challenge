import type { ResponsavelDto } from '@/shared/dto';

import type { Session } from '@/features/auth/types';

export const loginMessages = {
  emptyIdentifier: 'Informe seu CPF ou e-mail.',
  length: 'O CPF precisa ter 11 dígitos.',
  repeated: 'CPF inválido. Confira os números.',
  checksum: 'CPF inválido. Confira os números.',
  invalidEmail: 'E-mail inválido. Confira o endereço.',
  emptyPassword: 'Informe sua senha.',
  credentials: 'CPF ou senha incorretos.',
  emailCredentials: 'E-mail ou senha incorretos.',
  offline: 'Sem conexão com a internet. Verifique sua rede e tente novamente.',
  noStudents: 'Não encontramos alunos vinculados à sua conta.',
  unavailable: 'Não foi possível carregar seus dados. Tente novamente.',
} as const;

const EMAIL_MAX_LENGTH = 254;
const LOCAL_MAX_LENGTH = 64;
const LABEL_MAX_LENGTH = 63;

export const LOGIN_IDENTIFIER_MAX_LENGTH = EMAIL_MAX_LENGTH;
export const PASSWORD_MAX_LENGTH = 128;

export type LoginResult =
  | { ok: false; message: string }
  | { ok: true; session: Session };

export type LoginKind = 'cpf' | 'email';

export type LoginAttempt =
  | { ok: false; message: string }
  | { ok: true; email: string; kind: LoginKind };

export type LoginDirectoryEntry = {
  cpf: string;
  email: string;
};

export function applyCpfMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2');
}

function stripCpfSeparators(value: string): string {
  let result = '';
  for (let index = 0; index < value.length; index += 1) {
    const char = value.charAt(index);
    const betweenDigits =
      (char === '.' || char === '-') &&
      /\d/.test(value.charAt(index - 1)) &&
      /\d/.test(value.charAt(index + 1));
    if (!betweenDigits) {
      result += char;
    }
  }
  return result;
}

export function formatLoginIdentifier(value: string): string {
  const compact = value.replace(/\s/g, '');
  if (/[A-Za-z@]/.test(compact)) {
    return stripCpfSeparators(compact).slice(0, EMAIL_MAX_LENGTH);
  }
  const digits = compact.replace(/\D/g, '');
  if (digits.length >= 3) {
    return applyCpfMask(digits);
  }
  return digits;
}

function isEmailAddress(value: string): boolean {
  if (value.length === 0 || value.length > EMAIL_MAX_LENGTH) {
    return false;
  }
  const at = value.indexOf('@');
  if (at <= 0 || at !== value.lastIndexOf('@')) {
    return false;
  }
  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  if (
    local.length > LOCAL_MAX_LENGTH ||
    local.startsWith('.') ||
    local.endsWith('.') ||
    local.includes('..') ||
    !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)
  ) {
    return false;
  }
  const labels = domain.split('.');
  const tld = labels[labels.length - 1];
  if (!tld || tld.length < 2 || labels.length < 2) {
    return false;
  }
  return labels.every(
    label =>
      label.length > 0 &&
      label.length <= LABEL_MAX_LENGTH &&
      !label.includes('--') &&
      /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label),
  );
}

function checkDigit(digits: string, startWeight: number): number {
  let total = 0;
  for (let index = 0; index < digits.length; index += 1) {
    total += Number(digits[index]) * (startWeight - index);
  }
  const remainder = total % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function sessionFromGuardian(
  guardian: ResponsavelDto | undefined,
  mismatch: string,
): LoginResult {
  if (!guardian) {
    return { ok: false, message: mismatch };
  }
  const student = guardian.alunos[0];
  if (!student) {
    return { ok: false, message: loginMessages.noStudents };
  }
  return {
    ok: true,
    session: { guardianId: guardian.id, studentRm: student.rm },
  };
}

export function messageForRemoteFailure(
  error: unknown,
  kind: LoginKind,
): string {
  const code = remoteErrorCode(error);
  if (code.includes('network') || code.includes('unavailable')) {
    return loginMessages.offline;
  }
  if (code.startsWith('auth/')) {
    return kind === 'email'
      ? loginMessages.emailCredentials
      : loginMessages.credentials;
  }
  return loginMessages.unavailable;
}

function remoteErrorCode(error: unknown): string {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return '';
  }
  return typeof error.code === 'string' ? error.code : '';
}

function rejectPassword(
  password: string,
  mismatch: string,
): { ok: false; message: string } | null {
  if (password.length === 0) {
    return { ok: false, message: loginMessages.emptyPassword };
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return { ok: false, message: mismatch };
  }
  return null;
}

function assessEmailLogin(identifier: string, password: string): LoginAttempt {
  const email = identifier.trim().toLowerCase();
  if (!isEmailAddress(email)) {
    return { ok: false, message: loginMessages.invalidEmail };
  }
  const rejected = rejectPassword(password, loginMessages.emailCredentials);
  if (rejected) {
    return rejected;
  }
  return { ok: true, email, kind: 'email' };
}

function assessCpfLogin(
  cpf: string,
  password: string,
  directory: readonly LoginDirectoryEntry[],
): LoginAttempt {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length === 0) {
    return { ok: false, message: loginMessages.emptyIdentifier };
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
  const rejected = rejectPassword(password, loginMessages.credentials);
  if (rejected) {
    return rejected;
  }
  const entry = directory.find(item => item.cpf === digits);
  if (!entry) {
    return { ok: false, message: loginMessages.credentials };
  }
  return {
    ok: true,
    email: entry.email.trim().toLowerCase(),
    kind: 'cpf',
  };
}

export function assessLogin(
  identifier: string,
  password: string,
  directory: readonly LoginDirectoryEntry[],
): LoginAttempt {
  if (/[A-Za-z@]/.test(identifier)) {
    return assessEmailLogin(identifier, password);
  }
  return assessCpfLogin(identifier, password, directory);
}
