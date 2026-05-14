import { useMemo } from 'react';
import { useAsyncData } from '../hooks/useAsyncData';
import { api } from '../services/api';
import { PageHeader } from '../components/PageHeader';
import { CardHeader, CardShell } from '../components/CardShell';
import { RevenueAreaChart } from '../charts/RevenueAreaChart';
import { ErrorPanel } from '../components/ErrorPanel';
import { ChartSkeleton } from '../components/LoadingSkeletons';
import { useDashboardRange } from '../hooks/useDashboardRange';
import { inRange, parseIsoDay } from '../utils/dateRange';
import { formatCurrency } from '../utils/format';

export function RevenueAnalyticsPage() {
  const rev = useAsyncData(() => api.getRevenueTrend());
  const { range } = useDashboardRange();

  const stats = useMemo(() => {
    if (!rev.data?.length) return null;
    const rows =
      range.preset === 'all'
        ? rev.data
        : rev.data.filter((r) =>
            inRange(parseIsoDay(r.date), range.from, range.to),
          );
    const sum = rows.reduce((a, r) => a + r.revenue, 0);
    const avg = sum / Math.max(rows.length, 1);
    const peak = rows.reduce(
      (m, r) => (r.revenue > m.revenue ? r : m),
      rows[0],
    );
    return { sum, avg, peak, days: rows.length };
  }, [rev.data, range]);

  return (
    <div>
      <PageHeader
        title="Revenue analytics"
        description="Timing and pacing of realized revenue across the entire event stream. Range selector refines the series and summary tiles below."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {stats ? (
          <>
            <CardShell className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Range total
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(stats.sum)}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {stats.days} day bucket{stats.days === 1 ? '' : 's'}
              </p>
            </CardShell>
            <CardShell className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Daily average
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(stats.avg)}
              </p>
            </CardShell>
            <CardShell className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Peak day
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(stats.peak.revenue)}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {stats.peak.date}
              </p>
            </CardShell>
          </>
        ) : null}
      </div>

      <CardShell bright className="overflow-hidden">
        <CardHeader
          title="Revenue curve"
          subtitle="Area emphasis with smooth entry animations."
        />
        <div className="p-5">
          {rev.loading ? (
            <ChartSkeleton className="h-[360px]" />
          ) : rev.error ? (
            <ErrorPanel message={rev.error} onRetry={rev.reload} />
          ) : rev.data?.length ? (
            <RevenueAreaChart data={rev.data} />
          ) : null}
        </div>
      </CardShell>
    </div>
  );
}
