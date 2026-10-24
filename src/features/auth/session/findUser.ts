import type { Session, User } from '@/features/auth/types';
import type { ResponsavelDto } from '@/shared/dto';

export function findUser(
  session: Session,
  guardians: readonly ResponsavelDto[],
): User | null {
  const guardian =
    guardians.find(item => item.id === session.guardianId) ?? null;
  const student =
    guardian?.alunos.find(item => item.rm === session.studentRm) ?? null;
  if (!guardian || !student) {
    return null;
  }
  return { guardian, student };
}
