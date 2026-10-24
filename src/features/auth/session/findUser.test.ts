import { findUser } from '@/features/auth/session/findUser';
import { readGuardians } from '@/shared/mocks';

describe('resolução do usuário', () => {
  describe('dado uma sessão com id de responsável e RM do mock', () => {
    test('quando o usuário é resolvido, então devolve esse responsável e esse aluno', () => {
      expect(
        findUser({ guardianId: 1, studentRm: 12568 }, readGuardians()),
      ).toMatchObject({
        guardian: { primeiroNome: 'Gustavo' },
        student: { primeiroNome: 'Joana', rm: 12568 },
      });
    });
  });

  describe('dado uma sessão cujo responsável não está no mock', () => {
    test('quando o usuário é resolvido, então não há usuário', () => {
      expect(
        findUser({ guardianId: 99, studentRm: 1 }, readGuardians()),
      ).toBeNull();
    });
  });

  describe('dado uma sessão cujo RM não pertence ao responsável', () => {
    test('quando o usuário é resolvido, então não há usuário', () => {
      expect(
        findUser({ guardianId: 2, studentRm: 12567 }, readGuardians()),
      ).toBeNull();
    });
  });
});
