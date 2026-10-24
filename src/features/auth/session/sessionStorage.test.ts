import * as Keychain from 'react-native-keychain';
import type { UserCredentials } from 'react-native-keychain';

import { clearSession, readSession, saveSession } from './sessionStorage';

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn(),
  setGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

const getGenericPassword = jest.mocked(Keychain.getGenericPassword);
const setGenericPassword = jest.mocked(Keychain.setGenericPassword);
const resetGenericPassword = jest.mocked(Keychain.resetGenericPassword);

describe('armazenamento da sessão', () => {
  beforeEach(() => {
    getGenericPassword.mockReset();
    setGenericPassword.mockReset();
    resetGenericPassword.mockReset();
  });

  describe('dado uma sessão para gravar', () => {
    test('CA-10: quando ela é gravada, então o Keychain recebe o id e o RM', async () => {
      await saveSession({ guardianId: 1, studentRm: 12567 });

      expect(setGenericPassword).toHaveBeenCalledWith(
        'session',
        JSON.stringify({ guardianId: 1, studentRm: 12567 }),
        { service: 'br.com.fiap.school.session' },
      );
    });
  });

  describe('dado uma sessão válida no Keychain', () => {
    test('CA-02: quando ela é lida, então a sessão volta', async () => {
      getGenericPassword.mockResolvedValue({
        username: 'session',
        password: JSON.stringify({ guardianId: 2, studentRm: 13752 }),
        service: 'br.com.fiap.school.session',
        storage: 'KeystoreAESGCM_NoAuth',
      } as UserCredentials);

      await expect(readSession()).resolves.toEqual({
        guardianId: 2,
        studentRm: 13752,
      });
    });
  });

  describe('dado um texto de sessão que não é o contrato', () => {
    test('CA-14: quando ele é lido, então o resultado é nenhuma sessão', async () => {
      getGenericPassword.mockResolvedValue({
        username: 'session',
        password: '{',
        service: 'br.com.fiap.school.session',
        storage: 'KeystoreAESGCM_NoAuth',
      } as UserCredentials);

      await expect(readSession()).resolves.toBeNull();
    });
  });

  describe('dado uma sessão gravada', () => {
    test('CA-13: quando a sessão é apagada, então o Keychain remove o registro', async () => {
      await clearSession();

      expect(resetGenericPassword).toHaveBeenCalledWith({
        service: 'br.com.fiap.school.session',
      });
    });
  });
});
