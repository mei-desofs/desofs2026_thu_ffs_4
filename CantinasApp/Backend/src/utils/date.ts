const START_DATE = new Date("2025-01-01");

export function getWeekFromDate(date: Date): number {
  const diffMs = date.getTime() - START_DATE.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7) + 1;
}

export function getWeekRange(week: number) {
  const start = new Date(START_DATE);
  start.setDate(start.getDate() + (week - 1) * 7);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return { start, end };
}

export function addDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}
