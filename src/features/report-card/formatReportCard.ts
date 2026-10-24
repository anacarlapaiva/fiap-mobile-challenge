export function formatYearLabel(turma: string, ano: string): string {
  return `${turma} - ${ano}`;
}

export function yearKey(turma: string, ano: string): string {
  return `${turma}-${ano}`;
}

export function formatTrimesterLabel(trimestre: number): string {
  return `${trimestre}º TRIMESTRE`;
}

export function formatSubjectName(nome: string): string {
  return nome.toLocaleUpperCase('pt-BR');
}

export function formatGrade(nota: number | null): string {
  if (nota === null) {
    return '-';
  }
  return nota.toFixed(1);
}

export function formatAbsences(faltas: number | null): string {
  if (faltas === null) {
    return '-';
  }
  return String(faltas);
}
