import type { ResponsavelDto } from '@/shared/dto';

import { assessLogin, loginMessages, applyCpfMask } from './login.validation';

const gustavo: ResponsavelDto = {
  id: 1,
  cpf: '96929456004',
  email: 'gustavo-da-silva@example.com',
  senha: '123456',
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
        message: loginMessages.emptyCpf,
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

  describe('dado o CPF e a senha de um responsável do mock', () => {
    test('CA-10: quando o login é avaliado, então a sessão usa o id dele e o RM do primeiro aluno', () => {
      expect(assessLogin('969.294.560-04', '123456', [gustavo])).toEqual({
        ok: true,
        session: { guardianId: 1, studentRm: 12567 },
      });
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
