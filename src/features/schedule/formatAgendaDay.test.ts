import { formatAgendaDay } from './utils/formatAgendaDay';

describe('rótulo do dia da agenda', () => {
  describe('dado o ISO do JSON', () => {
    test('CA-02: quando formatado, então vira d de mês, weekday em pt-BR', () => {
      expect(formatAgendaDay('2025-03-16')).toBe('16 de março, domingo');
      expect(formatAgendaDay('2025-03-17')).toBe('17 de março, segunda-feira');
      expect(formatAgendaDay('2025-03-18')).toBe('18 de março, terça-feira');
      expect(formatAgendaDay('2025-03-19')).toBe('19 de março, quarta-feira');
      expect(formatAgendaDay('2025-03-20')).toBe('20 de março, quinta-feira');
      expect(formatAgendaDay('2025-03-21')).toBe('21 de março, sexta-feira');
      expect(formatAgendaDay('2025-03-22')).toBe('22 de março, sábado');
    });
  });
});
