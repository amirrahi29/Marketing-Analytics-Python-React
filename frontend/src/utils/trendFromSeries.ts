import type { GeneralTrendRow } from '../types/api';

export interface SeriesPoint {
  date: string;
  value: number;
}

/** Last window vs previous window of equal length (trend %). */
export function periodDeltaPercent(series: SeriesPoint[]): number | null {
  if (series.length < 4) return null;
  const w = Math.min(14, Math.floor(series.length / 2));
  const recent = series.slice(-w);
  const prior = series.slice(-2 * w, -w);
  if (prior.length < w) return null;
  const sumR = recent.reduce((a, p) => a + p.value, 0);
  const sumP = prior.reduce((a, p) => a + p.value, 0);
  if (sumP === 0) return sumR > 0 ? 100 : 0;
  return ((sumR - sumP) / sumP) * 100;
}

function rowDate(row: GeneralTrendRow): Date {
  return new Date(`${row['Email sent date']}T00:00:00`);
}

export function sortedGeneralTrend(rows: GeneralTrendRow[]): GeneralTrendRow[] {
  return [...rows].sort(
    (a, b) => rowDate(a).getTime() - rowDate(b).getTime(),
  );
}

export function buildSparkline(
  rows: GeneralTrendRow[],
  pick: (r: GeneralTrendRow) => number,
): SeriesPoint[] {
  const sorted = sortedGeneralTrend(rows);
  const tail = sorted.slice(-16);
  return tail.map((r) => ({
    date: r['Email sent date'],
    value: pick(r),
  }));
}

export function dailyOpenRate(row: GeneralTrendRow): number {
  const d = row['Email delivered'];
  if (!d) return 0;
  return (row['Email opened'] / d) * 100;
}

export function dailyCtr(row: GeneralTrendRow): number {
  const d = row['Email delivered'];
  if (!d) return 0;
  return (row['Email clicked'] / d) * 100;
}
