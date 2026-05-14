import {
  endOfDay,
  startOfDay,
  subDays,
  subMonths,
  isWithinInterval,
} from 'date-fns';

export type DatePreset =
  | '7d'
  | '30d'
  | '90d'
  | '6m'
  | '12m'
  | 'all';

export function rangeFromPreset(preset: DatePreset): { from: Date; to: Date } {
  const to = endOfDay(new Date());
  if (preset === 'all') {
    return { from: new Date(0), to };
  }
  if (preset === '7d') {
    return { from: startOfDay(subDays(to, 6)), to };
  }
  if (preset === '30d') {
    return { from: startOfDay(subDays(to, 29)), to };
  }
  if (preset === '90d') {
    return { from: startOfDay(subDays(to, 89)), to };
  }
  if (preset === '6m') {
    return { from: startOfDay(subMonths(to, 6)), to };
  }
  return { from: startOfDay(subMonths(to, 12)), to };
}

export function parseIsoDay(s: string): Date {
  return new Date(`${s}T00:00:00`);
}

export function inRange(day: Date, from: Date, to: Date): boolean {
  return isWithinInterval(day, { start: from, end: to });
}
