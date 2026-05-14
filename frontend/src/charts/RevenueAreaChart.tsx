import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useId, useMemo } from 'react';
import type { RevenueTrendRow } from '../types/api';
import { useDashboardRange } from '../hooks/useDashboardRange';
import { inRange, parseIsoDay } from '../utils/dateRange';
import { CHART_AXIS, CHART_GRID } from './chartTheme';

export function RevenueAreaChart({ data }: { data: RevenueTrendRow[] }) {
  const { range } = useDashboardRange();
  const gradId = useId().replace(/:/g, '');

  const filtered = useMemo(() => {
    if (range.preset === 'all') return data;
    return data.filter((r) =>
      inRange(parseIsoDay(r.date), range.from, range.to),
    );
  }, [data, range]);

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={filtered} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.38} />
              <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 6"
            stroke={CHART_GRID}
            className="dark:stroke-slate-700"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: CHART_AXIS }}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 11, fill: CHART_AXIS }}
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(v) =>
              new Intl.NumberFormat(undefined, {
                notation: 'compact',
                maximumFractionDigits: 1,
              }).format(Number(v))
            }
          />
          <Tooltip
            animationDuration={400}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              boxShadow: '0 18px 40px -24px rgba(15,23,42,0.45)',
            }}
            formatter={(value) => [
              new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(Number(value ?? 0)),
              'Revenue',
            ]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#0f7669"
            strokeWidth={2.2}
            fill={`url(#${gradId})`}
            isAnimationActive
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
