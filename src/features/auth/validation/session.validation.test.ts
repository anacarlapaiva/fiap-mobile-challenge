import { parseSession } from './session.validation';

describe('leitura da sessão gravada', () => {
  describe('dado um texto que não é o contrato', () => {
    test('CA-14: quando ele é lido, então o resultado é nenhuma sessão', () => {
      expect(parseSession({ guardianId: 1 })).toBeNull();
      expect(parseSession({ guardianId: 1.5, studentRm: 12567 })).toBeNull();
      expect(parseSession('sessao')).toBeNull();
    });
  });

  describe('dado o id do responsável e o RM do aluno', () => {
    test('quando o texto é lido, então a sessão volta inteira', () => {
      expect(parseSession({ guardianId: 1, studentRm: 12567 })).toEqual({
        guardianId: 1,
        studentRm: 12567,
      });
    });
  });
});
