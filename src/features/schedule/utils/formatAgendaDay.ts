const months = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const;

const weekdays = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
] as const;

export function formatAgendaDay(iso: string): string {
  const [yearPart, monthPart, dayPart] = iso.split('-');
  const year = Number(yearPart);
  const month = Number(monthPart);
  const day = Number(dayPart);
  const monthName = months[month - 1];
  const weekday = weekdays[new Date(year, month - 1, day).getDay()];

  if (monthName === undefined || weekday === undefined) {
    return iso;
  }

  return `${day} de ${monthName}, ${weekday}`;
}
