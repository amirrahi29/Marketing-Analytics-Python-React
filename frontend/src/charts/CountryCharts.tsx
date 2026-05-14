import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMemo } from 'react';
import type { CountryAnalyticRow } from '../types/api';
import { formatCurrency, formatNumber } from '../utils/format';
import { CHART_AXIS, CHART_GRID, PALETTE } from './chartTheme';
import { cn } from '../utils/cn';

export function CountryBarChart({ rows }: { rows: CountryAnalyticRow[] }) {
  const data = useMemo(
    () =>
      [...rows]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 12)
        .map((r, i) => ({
          code: r.country_code,
          revenue: r.revenue,
          total: r.total,
          fill: PALETTE[i % PALETTE.length],
        })),
    [rows],
  );

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 12 }}>
          <CartesianGrid
            strokeDasharray="3 6"
            stroke={CHART_GRID}
            className="dark:stroke-slate-700"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: CHART_AXIS }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) =>
              new Intl.NumberFormat(undefined, {
                notation: 'compact',
                maximumFractionDigits: 1,
              }).format(Number(v))
            }
          />
          <YAxis
            type="category"
            dataKey="code"
            width={40}
            tick={{ fontSize: 11, fill: CHART_AXIS }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(13,148,136,0.07)' }}
            formatter={(v, _name, item) => {
              const total = Number(
                (item as { payload?: { total?: number } }).payload?.total ?? 0,
              );
              return [
                `${formatCurrency(Number(v ?? 0))} · ${formatNumber(total)} events`,
                'Revenue',
              ];
            }}
            contentStyle={{ borderRadius: 10 }}
          />
          <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={14} isAnimationActive animationDuration={900}>
            {data.map((e) => (
              <Cell key={e.code} fill={e.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CountryHeatGrid({ rows }: { rows: CountryAnalyticRow[] }) {
  const maxRev = Math.max(...rows.map((r) => r.revenue), 1);
  const sorted = useMemo(
    () => [...rows].sort((a, b) => b.revenue - a.revenue),
    [rows],
  );

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      {sorted.map((r) => {
        const intensity = r.revenue / maxRev;
        return (
          <div
            key={r.country_code}
            className={cn(
              'rounded-xl border border-slate-200/80 px-2 py-3 text-center transition hover:-translate-y-0.5 dark:border-slate-700/80',
            )}
            style={{
              background: `linear-gradient(145deg, rgba(13,148,136,${0.1 + intensity * 0.38}) 0%, rgba(6,182,212,${0.06 + intensity * 0.22}) 100%)`,
              boxShadow: intensity > 0.7 ? '0 12px 30px -18px rgba(13,148,136,0.4)' : undefined,
            }}
          >
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {r.country_code}
            </p>
            <p className="mt-1 font-mono text-[11px] text-slate-600 dark:text-slate-300">
              {formatCurrency(r.revenue, true)}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {formatNumber(r.total)} ev.
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function CountryStatCards({ rows }: { rows: CountryAnalyticRow[] }) {
  const top = useMemo(
    () => [...rows].sort((a, b) => b.revenue - a.revenue).slice(0, 6),
    [rows],
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {top.map((r, i) => (
        <div
          key={r.country_code}
          className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/80"
        >
          <span className="absolute right-3 top-3 font-mono text-[10px] font-bold text-slate-400">
            #{i + 1}
          </span>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {r.country_code}
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-slate-900 dark:text-white">
            {formatCurrency(r.revenue)}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {formatNumber(r.total)} events captured
          </p>
        </div>
      ))}
    </div>
  );
}
