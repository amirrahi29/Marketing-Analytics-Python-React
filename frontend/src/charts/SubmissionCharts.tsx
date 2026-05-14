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
import type { SubmissionChannelRow, SubmissionCountryRow } from '../types/api';
import { CHART_AXIS, CHART_GRID, PALETTE } from './chartTheme';

export function SubmissionChannelChart({
  rows,
}: {
  rows: SubmissionChannelRow[];
}) {
  const data = useMemo(
    () =>
      [...rows]
        .sort((a, b) => b.submission_rate - a.submission_rate)
        .map((r, i) => ({
          channel: r.channel,
          rate: r.submission_rate,
          fill: PALETTE[i % PALETTE.length],
        })),
    [rows],
  );

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, left: 0, right: 8, bottom: 8 }}>
          <CartesianGrid
            strokeDasharray="3 6"
            stroke={CHART_GRID}
            className="dark:stroke-slate-700"
            vertical={false}
          />
          <XAxis
            dataKey="channel"
            tick={{ fontSize: 11, fill: CHART_AXIS }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: CHART_AXIS }}
            tickFormatter={(v) => `${v}%`}
            width={36}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(v) => [
              `${Number(v ?? 0).toFixed(2)}%`,
              'Submission rate',
            ]}
            contentStyle={{ borderRadius: 10 }}
          />
          <Bar dataKey="rate" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={800}>
            {data.map((e) => (
              <Cell key={e.channel} fill={e.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SubmissionCountryChart({
  rows,
}: {
  rows: SubmissionCountryRow[];
}) {
  const data = useMemo(
    () =>
      [...rows]
        .sort((a, b) => b.submission_rate - a.submission_rate)
        .slice(0, 12)
        .map((r, i) => ({
          code: r.country_code,
          rate: r.submission_rate,
          fill: PALETTE[(i + 2) % PALETTE.length],
        })),
    [rows],
  );

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 4, right: 12, top: 8, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 6"
            stroke={CHART_GRID}
            className="dark:stroke-slate-700"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: CHART_AXIS }}
            tickFormatter={(v) => `${v}%`}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="code"
            width={36}
            tick={{ fontSize: 11, fill: CHART_AXIS }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(v) => [
              `${Number(v ?? 0).toFixed(2)}%`,
              'Submission rate',
            ]}
            contentStyle={{ borderRadius: 10 }}
          />
          <Bar dataKey="rate" radius={[0, 6, 6, 0]} barSize={12} isAnimationActive animationDuration={800}>
            {data.map((e) => (
              <Cell key={e.code} fill={e.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
