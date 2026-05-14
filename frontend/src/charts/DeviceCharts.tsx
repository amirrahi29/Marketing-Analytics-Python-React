import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { Laptop, Smartphone, Tablet, Monitor } from 'lucide-react';
import type { DeviceAnalyticRow } from '../types/api';
import { formatCurrency, formatNumber } from '../utils/format';
import { PALETTE } from './chartTheme';

function deviceIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('mobile')) return Smartphone;
  if (n.includes('tablet')) return Tablet;
  if (n.includes('desktop')) return Monitor;
  return Laptop;
}

export function DeviceDonutChart({ rows }: { rows: DeviceAnalyticRow[] }) {
  const data = useMemo(
    () =>
      rows.map((r, i) => ({
        name: r.device,
        value: r.total,
        revenue: r.revenue,
        color: PALETTE[i % PALETTE.length],
      })),
    [rows],
  );

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={68}
            outerRadius={100}
            paddingAngle={2}
            isAnimationActive
            animationDuration={900}
          >
            {data.map((e) => (
              <Cell key={e.name} fill={e.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, item) => {
              const rev = Number(
                (item as { payload?: { revenue?: number } }).payload?.revenue ??
                  0,
              );
              const v = Number(value ?? 0);
              return [`${formatNumber(v)} events · ${formatCurrency(rev)}`, String(name ?? '')];
            }}
            contentStyle={{ borderRadius: 10 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DeviceCards({ rows }: { rows: DeviceAnalyticRow[] }) {
  const total = rows.reduce((a, r) => a + r.total, 0) || 1;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map((r, i) => {
        const Icon = deviceIcon(r.device);
        const share = (r.total / total) * 100;
        const color = PALETTE[i % PALETTE.length];
        return (
          <div
            key={r.device}
            className="rounded-xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/80 p-4 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950/80"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex size-11 items-center justify-center rounded-xl text-white shadow-md"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {r.device}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatNumber(r.total)} events · {share.toFixed(1)}% share
                </p>
              </div>
              <p className="shrink-0 font-mono text-sm font-semibold text-teal-600 dark:text-teal-400">
                {formatCurrency(r.revenue, true)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
