import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMemo } from 'react';
import type { GeneralTrendRow } from '../types/api';
import { useDashboardRange } from '../hooks/useDashboardRange';
import { sortedGeneralTrend } from '../utils/trendFromSeries';
import { inRange, parseIsoDay } from '../utils/dateRange';
import { CHART_AXIS, CHART_GRID, PALETTE } from './chartTheme';

export function GeneralTrendChart({ data }: { data: GeneralTrendRow[] }) {
  const { range } = useDashboardRange();

  const filtered = useMemo(() => {
    const sorted = sortedGeneralTrend(data);
    if (range.preset === 'all') {
      return sorted.map((r) => ({
        ...r,
        day: r['Email sent date'],
      }));
    }
    return sorted
      .filter((r) =>
        inRange(parseIsoDay(r['Email sent date']), range.from, range.to),
      )
      .map((r) => ({
        ...r,
        day: r['Email sent date'],
      }));
  }, [data, range]);

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filtered} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid
            strokeDasharray="3 6"
            stroke={CHART_GRID}
            className="dark:stroke-slate-700"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: CHART_AXIS }}
            tickLine={false}
            axisLine={false}
            minTickGap={28}
          />
          <YAxis
            tick={{ fontSize: 11, fill: CHART_AXIS }}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip
            animationDuration={350}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #e2e8f0',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="Email sent"
            stroke={PALETTE[0]}
            strokeWidth={2}
            dot={false}
            isAnimationActive
            animationDuration={1000}
          />
          <Line
            type="monotone"
            dataKey="Email opened"
            stroke={PALETTE[2]}
            strokeWidth={2}
            dot={false}
            isAnimationActive
            animationDuration={1100}
          />
          <Line
            type="monotone"
            dataKey="Email clicked"
            stroke={PALETTE[4]}
            strokeWidth={2}
            dot={false}
            isAnimationActive
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
