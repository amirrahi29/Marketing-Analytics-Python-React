import { useMemo } from 'react';
import { ArrowRight, TrendingDown } from 'lucide-react';
import type { DeliverFunnel } from '../types/api';
import { formatCurrency, formatNumber } from '../utils/format';
import { cn } from '../utils/cn';

const ORDER: (keyof Omit<DeliverFunnel, 'revenue'>)[] = [
  'sent',
  'delivered',
  'opened',
  'clicked',
  'bounced',
];

const labels: Record<string, string> = {
  sent: 'Sent',
  delivered: 'Delivered',
  opened: 'Opened',
  clicked: 'Clicked',
  bounced: 'Bounced',
};

export function FunnelVisualization({ funnel }: { funnel: DeliverFunnel }) {
  const steps = useMemo(() => {
    const sentCount = funnel.sent.count || 1;
    return ORDER.map((key, idx) => {
      const step = funnel[key];
      const next = ORDER[idx + 1] ? funnel[ORDER[idx + 1]] : null;
      const convToNext = next
        ? next.count === 0
          ? 0
          : (next.count / Math.max(step.count, 1)) * 100
        : null;
      const drop =
        next && step.count > 0
          ? ((step.count - next.count) / step.count) * 100
          : null;

      const widthPct = (step.count / sentCount) * 100;

      return {
        key,
        label: labels[key] ?? key,
        count: step.count,
        pctOfTotal: step.percentage,
        widthPct,
        convToNext,
        drop,
      };
    });
  }, [funnel]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-800/60">
        <span className="text-slate-600 dark:text-slate-300">
          Attributed revenue
        </span>
        <span className="font-mono font-semibold text-teal-600 dark:text-teal-400">
          {formatCurrency(funnel.revenue)}
        </span>
      </div>

      <div className="space-y-5">
        {steps.map((s, i) => (
          <div key={s.key} className="relative">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {s.label}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {s.pctOfTotal} of all events · {formatNumber(s.count)} rows
                  </p>
                </div>
              </div>
              <div className="text-right">
                {s.convToNext != null ? (
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Step yield{' '}
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {s.convToNext.toFixed(1)}%
                    </span>
                  </p>
                ) : null}
                {s.drop != null && s.drop > 0 ? (
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                    <TrendingDown className="size-3.5" />
                    Drop-off {s.drop.toFixed(1)}%
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-3 h-11 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800/80">
              <div
                className={cn(
                  'flex h-full items-center justify-end rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 px-3 text-xs font-semibold text-white shadow-inner transition-all duration-700',
                )}
                style={{
                  width: `${Math.max(8, Math.min(100, s.widthPct))}%`,
                  filter: 'saturate(1.05)',
                }}
              >
                {formatNumber(s.count)}
              </div>
            </div>
            {i < steps.length - 1 ? (
              <div className="mt-3 flex justify-center text-slate-400 dark:text-slate-500">
                <ArrowRight className="size-4 rotate-90 sm:rotate-0" aria-hidden />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
