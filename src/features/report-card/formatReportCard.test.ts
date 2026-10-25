import {
  formatAbsences,
  formatGrade,
  formatSubjectName,
  formatTrimesterLabel,
  formatYearLabel,
} from './formatReportCard';

describe('rótulos do boletim', () => {
  describe('dado turma e ano do JSON', () => {
    test('quando formatados, então viram turma - ano', () => {
      expect(formatYearLabel('7EF', '2025')).toBe('7EF - 2025');
    });
  });

  describe('dado o número do trimestre', () => {
    test('quando formatado, então vira n° trimestre em maiúsculas', () => {
      expect(formatTrimesterLabel(1)).toBe('1º TRIMESTRE');
    });
  });

  describe('dado o nome da disciplina', () => {
    test('quando formatado, então fica em maiúsculas pt-BR', () => {
      expect(formatSubjectName('Língua Portuguesa')).toBe('LÍNGUA PORTUGUESA');
    });
  });

  describe('dado nota e falta', () => {
    test('quando formatadas, então a nota tem uma casa e o null vira traço', () => {
      expect(formatGrade(8)).toBe('8.0');
      expect(formatGrade(9.5)).toBe('9.5');
      expect(formatGrade(10)).toBe('10.0');
      expect(formatGrade(null)).toBe('-');
      expect(formatAbsences(0)).toBe('0');
      expect(formatAbsences(2)).toBe('2');
      expect(formatAbsences(null)).toBe('-');
    });
  });
});
