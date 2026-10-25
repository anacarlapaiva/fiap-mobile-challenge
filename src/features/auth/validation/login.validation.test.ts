import type { ResponsavelDto } from '@/shared/dto';

import {
  assessLogin,
  formatLoginIdentifier,
  loginMessages,
  messageForRemoteFailure,
  sessionFromGuardian,
  applyCpfMask,
} from './login.validation';

const gustavo: ResponsavelDto = {
  id: 1,
  cpf: '96929456004',
  email: 'gustavo-da-silva@example.com',
  primeiroNome: 'Gustavo',
  sobrenome: 'da Silva',
  alunos: [
    {
      rm: 12567,
      turma: '7EF',
      periodo: 'Matutino',
      primeiroNome: 'Rafael',
      sobrenome: 'da Silva',
      agenda: [],
      boletim: [],
    },
  ],
};

describe('avaliação do login', () => {
  describe('dado o campo de CPF vazio', () => {
    test('CA-04: quando o login é avaliado, então a frase pede o CPF', () => {
      expect(assessLogin('', '123456', [gustavo])).toEqual({
        ok: false,
        message: loginMessages.emptyIdentifier,
      });
    });
  });

  describe('dado um CPF com quantidade de dígitos diferente de 11', () => {
    test('CA-05: quando o login é avaliado, então a frase pede 11 dígitos', () => {
      expect(assessLogin('1234567890', '123456', [gustavo])).toEqual({
        ok: false,
        message: loginMessages.length,
      });
    });
  });

  describe('dado um CPF com 11 dígitos iguais', () => {
    test('CA-06: quando o login é avaliado, então a frase recusa os dígitos iguais', () => {
      expect(assessLogin('111.111.111-11', '123456', [gustavo])).toEqual({
        ok: false,
        message: loginMessages.repeated,
      });
    });
  });

  describe('dado um CPF cujo dígito verificador não fecha', () => {
    test('CA-07: quando o login é avaliado, então a frase diz que o CPF é inválido', () => {
      expect(assessLogin('111.444.777-36', '123456', [gustavo])).toEqual({
        ok: false,
        message: loginMessages.checksum,
      });
    });
  });

  describe('dado um CPF válido cujo dígito verificador é 9', () => {
    test('quando o login é avaliado, então o CPF passa pela conferência dos dígitos', () => {
      expect(assessLogin('111.444.709-94', '123456', [gustavo])).toEqual({
        ok: false,
        message: loginMessages.credentials,
      });
      expect(assessLogin('111.444.711-09', '123456', [gustavo])).toEqual({
        ok: false,
        message: loginMessages.credentials,
      });
    });
  });

  describe('dado um CPF válido e uma senha maior que o limite', () => {
    test('quando o login é avaliado, então o par não confere', () => {
      expect(assessLogin('969.294.560-04', '1'.repeat(129), [gustavo])).toEqual(
        {
          ok: false,
          message: loginMessages.credentials,
        },
      );
    });
  });

  describe('dado um CPF válido e a senha vazia', () => {
    test('CA-08: quando o login é avaliado, então a frase pede a senha', () => {
      expect(assessLogin('969.294.560-04', '', [gustavo])).toEqual({
        ok: false,
        message: loginMessages.emptyPassword,
      });
    });
  });

  describe('dado um CPF válido que não forma um responsável do mock', () => {
    test('CA-09: quando o login é avaliado, então a frase diz que o par não confere', () => {
      expect(assessLogin('111.444.777-35', '123456', [gustavo])).toEqual({
        ok: false,
        message: loginMessages.credentials,
      });
    });
  });

  describe('dado o CPF de um responsável e uma senha preenchida', () => {
    test('quando o login é avaliado, então a tentativa usa o e-mail desse CPF', () => {
      expect(assessLogin('969.294.560-04', '654321', [gustavo])).toEqual({
        ok: true,
        email: 'gustavo-da-silva@example.com',
        kind: 'cpf',
      });
    });
  });

  describe('dado o responsável autenticado', () => {
    test('quando a sessão é montada, então ela usa o id dele e o RM do primeiro aluno', () => {
      expect(sessionFromGuardian(gustavo, loginMessages.credentials)).toEqual({
        ok: true,
        session: { guardianId: 1, studentRm: 12567 },
      });
    });
  });

  describe('dado um responsável sem alunos', () => {
    test('CA-21: quando a sessão é montada, então a frase diz que não há aluno vinculado', () => {
      expect(
        sessionFromGuardian(
          { ...gustavo, alunos: [] },
          loginMessages.credentials,
        ),
      ).toEqual({
        ok: false,
        message: loginMessages.noStudents,
      });
    });
  });

  describe('dado um e-mail com letra maiúscula', () => {
    test('quando o login é avaliado, então a tentativa ignora a caixa do e-mail', () => {
      expect(
        assessLogin('Gustavo-Da-Silva@Example.com', '123456', [gustavo]),
      ).toEqual({
        ok: true,
        email: 'gustavo-da-silva@example.com',
        kind: 'email',
      });
      expect(
        assessLogin('ADELAIDE-SILVEIRA@example.com', '987654', []),
      ).toEqual({
        ok: true,
        email: 'adelaide-silveira@example.com',
        kind: 'email',
      });
    });
  });

  describe('dado um e-mail sem formato de endereço', () => {
    test('quando o login é avaliado, então a frase diz que o e-mail é inválido', () => {
      expect(assessLogin('gustavo', '123456', [gustavo])).toEqual({
        ok: false,
        message: loginMessages.invalidEmail,
      });
      expect(assessLogin('gustavo@example', '123456', [gustavo])).toEqual({
        ok: false,
        message: loginMessages.invalidEmail,
      });
    });
  });

  describe('dado um e-mail válido e a senha vazia', () => {
    test('quando o login é avaliado, então a frase pede a senha', () => {
      expect(
        assessLogin('gustavo-da-silva@example.com', '', [gustavo]),
      ).toEqual({
        ok: false,
        message: loginMessages.emptyPassword,
      });
    });
  });

  describe('dado um e-mail válido que a conta ainda não conferiu', () => {
    test('quando o login é avaliado, então a tentativa segue para a conta', () => {
      expect(
        assessLogin('outra-pessoa@example.com', '123456', [gustavo]),
      ).toEqual({
        ok: true,
        email: 'outra-pessoa@example.com',
        kind: 'email',
      });
    });
  });

  describe('dado uma falha da conta', () => {
    test('quando a credencial não confere, então a frase não revela qual dos dois falhou', () => {
      expect(
        messageForRemoteFailure({ code: 'auth/invalid-credential' }, 'email'),
      ).toBe(loginMessages.emailCredentials);
      expect(
        messageForRemoteFailure({ code: 'auth/user-not-found' }, 'email'),
      ).toBe(loginMessages.emailCredentials);
      expect(
        messageForRemoteFailure({ code: 'auth/wrong-password' }, 'cpf'),
      ).toBe(loginMessages.credentials);
    });

    test('quando a rede falha, então a frase avisa a falta de conexão', () => {
      expect(
        messageForRemoteFailure(
          { code: 'auth/network-request-failed' },
          'email',
        ),
      ).toBe(loginMessages.offline);
      expect(
        messageForRemoteFailure({ code: 'firestore/unavailable' }, 'cpf'),
      ).toBe(loginMessages.offline);
    });

    test('quando os dados não chegam, então a frase pede para tentar de novo', () => {
      expect(messageForRemoteFailure(new Error('parse'), 'email')).toBe(
        loginMessages.unavailable,
      );
    });
  });

  describe('dado menos de 3 dígitos', () => {
    test('quando o campo formata, então os dígitos ficam sem máscara', () => {
      expect(formatLoginIdentifier('')).toBe('');
      expect(formatLoginIdentifier('1')).toBe('1');
      expect(formatLoginIdentifier('12')).toBe('12');
      expect(formatLoginIdentifier('12.')).toBe('12');
    });
  });

  describe('dado 3 ou mais dígitos e nenhuma letra', () => {
    test('quando o campo formata, então a máscara de CPF entra', () => {
      expect(formatLoginIdentifier('123')).toBe('123');
      expect(formatLoginIdentifier('1234')).toBe('123.4');
      expect(formatLoginIdentifier('969.294.560-04')).toBe('969.294.560-04');
      expect(formatLoginIdentifier('969 294 560 04')).toBe('969.294.560-04');
    });
  });

  describe('dado um texto com letra ou @', () => {
    test('quando o campo formata, então o valor fica e-mail e a pontuação da máscara sai', () => {
      expect(formatLoginIdentifier('gustavo-da-silva@example.com')).toBe(
        'gustavo-da-silva@example.com',
      );
      expect(formatLoginIdentifier('  a@b.com  ')).toBe('a@b.com');
      expect(formatLoginIdentifier('123.4a')).toBe('1234a');
      expect(
        formatLoginIdentifier(`${'a'.repeat(300)}@example.com`),
      ).toHaveLength(254);
    });
  });

  describe('dado os dígitos de um CPF', () => {
    test('CA-03: quando a máscara é aplicada, então o campo fica no formato XXX.XXX.XXX-XX', () => {
      expect(applyCpfMask('')).toBe('');
      expect(applyCpfMask('969')).toBe('969');
      expect(applyCpfMask('9692')).toBe('969.2');
      expect(applyCpfMask('969294')).toBe('969.294');
      expect(applyCpfMask('9692945')).toBe('969.294.5');
      expect(applyCpfMask('969294560')).toBe('969.294.560');
      expect(applyCpfMask('9692945600')).toBe('969.294.560-0');
      expect(applyCpfMask('96929456004')).toBe('969.294.560-04');
      expect(applyCpfMask('969.294.560-04')).toBe('969.294.560-04');
      expect(applyCpfMask('96929456004999')).toBe('969.294.560-04');
      expect(applyCpfMask('969a294b560c04')).toBe('969.294.560-04');
    });
  });
});
