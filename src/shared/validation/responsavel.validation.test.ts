import { ZodError } from 'zod';

import { parseGuardians } from './responsavel.validation';

const guardian = {
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
      agenda: [
        { dia: '2025-03-16', aulas: [] },
        {
          dia: '2025-03-17',
          aulas: [{ horario: '07:15 - 08:00', disciplina: 'Matemática I' }],
        },
      ],
      boletim: [
        {
          ano: '2025',
          turma: '7EF',
          trimestres: [
            {
              trimestre: 1,
              disciplinas: [
                { nome: 'Língua Portuguesa', nota: 9.5, faltas: 0 },
              ],
            },
            {
              trimestre: 2,
              disciplinas: [
                { nome: 'Língua Portuguesa', nota: null, faltas: null },
              ],
            },
          ],
        },
        {
          ano: '2024',
          turma: '6EF',
          trimestres: [
            {
              trimestre: 1,
              disciplinas: [{ nome: 'História', nota: 8, faltas: 1 }],
            },
          ],
        },
      ],
    },
  ],
};

const guardianWithoutGrade = {
  ...guardian,
  alunos: [
    {
      ...guardian.alunos[0],
      boletim: [
        {
          ano: '2025',
          turma: '7EF',
          trimestres: [
            {
              trimestre: 1,
              disciplinas: [{ nome: 'História', faltas: 0 }],
            },
          ],
        },
      ],
    },
  ],
};

describe('leitura do JSON de responsáveis', () => {
  describe('dado um responsável com boletim de 2024 e de 2025', () => {
    test('quando o JSON é lido, então a turma do boletim de 2024 permanece', () => {
      const parsed = parseGuardians([guardian]);

      expect(parsed[0]?.alunos[0]?.boletim[1]?.turma).toBe('6EF');
    });
  });

  describe('dado uma disciplina com nota decimal', () => {
    test('quando o JSON é lido, então a nota permanece com a casa decimal', () => {
      const parsed = parseGuardians([guardian]);

      expect(
        parsed[0]?.alunos[0]?.boletim[0]?.trimestres[0]?.disciplinas[0]?.nota,
      ).toBe(9.5);
    });
  });

  describe('dado um trimestre ainda sem lançamento', () => {
    test('quando o JSON é lido, então nota e faltas permanecem nulas', () => {
      const parsed = parseGuardians([guardian]);

      expect(
        parsed[0]?.alunos[0]?.boletim[0]?.trimestres[1]?.disciplinas[0],
      ).toEqual({ nome: 'Língua Portuguesa', nota: null, faltas: null });
    });
  });

  describe('dado um boletim cuja disciplina não informa a nota', () => {
    test('quando o JSON é lido, então a leitura é recusada', () => {
      expect(() => parseGuardians([guardianWithoutGrade])).toThrow(ZodError);
    });
  });
});
