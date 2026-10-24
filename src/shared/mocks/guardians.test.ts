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

  describe('dado o boletim de 2025 do primeiro aluno', () => {
    test('quando o mock é lido, então o trimestre sem lançamento permanece com nota nula', () => {
      const boletim = readGuardians()[0]?.alunos[0]?.boletim.find(
        ano => ano.ano === '2025',
      );
      const trimestre = boletim?.trimestres.find(item => item.trimestre === 2);

      expect(trimestre?.disciplinas[0]?.nota).toBeNull();
      expect(trimestre?.disciplinas[0]?.faltas).toBeNull();
    });
  });
});
