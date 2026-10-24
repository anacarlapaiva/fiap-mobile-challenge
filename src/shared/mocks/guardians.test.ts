import { readGuardians } from './guardians';

describe('mock dos responsáveis', () => {
  describe('dado o arquivo local no lugar da API', () => {
    test('quando o mock é lido, então entram os dois responsáveis do arquivo', () => {
      const guardians = readGuardians();

      expect(guardians.map(guardian => guardian.primeiroNome)).toEqual([
        'Gustavo',
        'Adelaide',
      ]);
    });
  });
});
