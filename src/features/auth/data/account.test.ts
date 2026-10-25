import * as firestore from '@react-native-firebase/firestore';

import { readAccountGuardian, signInAccount, signOutAccount } from './account';

describe('leitura do responsável autenticado', () => {
  afterEach(async () => {
    jest.restoreAllMocks();
    await signOutAccount();
  });

  describe('dado a conta do Gustavo', () => {
    test('quando a leitura termina, então chega só o documento desse e-mail, sem a senha', async () => {
      await signInAccount('gustavo-da-silva@example.com', '123456');

      const guardian = await readAccountGuardian();

      expect(guardian?.primeiroNome).toBe('Gustavo');
      expect(guardian?.alunos.map(aluno => aluno.primeiroNome)).toEqual([
        'Rafael',
        'Joana',
      ]);
      expect(guardian).not.toHaveProperty('senha');
    });
  });

  describe('dado nenhuma conta', () => {
    test('quando a leitura termina, então não há responsável', async () => {
      await expect(readAccountGuardian()).resolves.toBeNull();
    });
  });

  describe('dado uma conta sem documento', () => {
    test('quando a leitura termina, então não há responsável', async () => {
      await signInAccount('outra-pessoa@example.com', '123456');

      await expect(readAccountGuardian()).resolves.toBeNull();
    });
  });

  describe('dado um documento que não é o contrato', () => {
    test('quando a leitura termina, então ela é recusada', async () => {
      jest.spyOn(firestore, 'getDoc').mockResolvedValue({
        exists: () => true,
        data: () => ({ email: 'gustavo-da-silva@example.com' }),
      } as unknown as Awaited<ReturnType<typeof firestore.getDoc>>);
      await signInAccount('gustavo-da-silva@example.com', '123456');

      await expect(readAccountGuardian()).rejects.toThrow();
    });
  });
});
