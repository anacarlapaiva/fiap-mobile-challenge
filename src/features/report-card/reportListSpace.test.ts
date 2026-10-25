import {
  listEndSpace,
  scrollOffsetReady,
  subjectScrollTarget,
  termScrollTarget,
} from './reportListSpace';

describe('rolagem da lista do boletim', () => {
  describe('dado os cards fechados', () => {
    test('CA-12: quando o fim é calculado, então sobra só 16', () => {
      expect(listEndSpace(null, 400, 400, 16)).toBe(16);
    });
  });

  describe('dado o 3º trimestre com o topo em 310 numa área de 400', () => {
    test('CA-10: quando o card já cabe inteiro, então o alvo ainda é o topo do card', () => {
      expect(termScrollTarget(310, 0)).toBe(310);
    });

    test('CA-12: quando o fim é calculado, então o espaço deixa o topo encostar no alto da lista', () => {
      expect(listEndSpace(310, 400, 400, 16)).toBe(310);
    });

    test('CA-10: quando o padding novo ainda não entrou, então a rolagem espera; quando entra, então ela pode ir ao topo', () => {
      expect(scrollOffsetReady(310, 400, 400)).toBe(false);
      expect(scrollOffsetReady(310, 710, 400)).toBe(true);
    });
  });

  describe('dado o trimestre já com o topo no alto da lista', () => {
    test('CA-10: quando o alvo é calculado, então não há rolagem', () => {
      expect(termScrollTarget(0, 0)).toBeNull();
    });
  });

  describe('dado uma área rolável de 400 sem rolagem', () => {
    test('CA-11: quando a disciplina aberta cabe na área, então não há rolagem', () => {
      expect(subjectScrollTarget(100, 80, 0, 400)).toBeNull();
    });

    test('CA-11: quando a nota ficaria sob a tab bar, então rola só até o fim do bloco', () => {
      expect(subjectScrollTarget(360, 80, 0, 400)).toBe(40);
    });

    test('CA-11: quando o bloco é mais alto que a área, então o topo dele fica visível', () => {
      expect(subjectScrollTarget(120, 500, 0, 400)).toBe(120);
    });
  });
});
