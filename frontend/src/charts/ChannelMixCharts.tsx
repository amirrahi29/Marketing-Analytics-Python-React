import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { Mail, MessageSquare, Bell, Phone } from 'lucide-react';
import type { ChannelMix } from '../types/api';
import { parsePercentString } from '../utils/format';
import { cn } from '../utils/cn';
import { PALETTE } from './chartTheme';

const channelIcons: Record<string, typeof Mail> = {
  Email: Mail,
  SMS: MessageSquare,
  'Push Notifications': Bell,
  WhatsApp: Phone,
};

export function ChannelPieChart({ mix }: { mix: ChannelMix }) {
  const data = useMemo(
    () =>
      Object.entries(mix).map(([name, pct], i) => ({
        name,
        value: parsePercentString(pct),
        color: PALETTE[i % PALETTE.length],
      })),
    [mix],
  );

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={56}
            outerRadius={88}
            paddingAngle={2}
            isAnimationActive
            animationDuration={900}
          >
            {data.map((e) => (
              <Cell key={e.name} fill={e.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            formatter={(v, n) => [
              `${Number(v ?? 0).toFixed(2)}%`,
              String(n ?? ''),
            ]}
            contentStyle={{ borderRadius: 10 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChannelMixBars({
  mix,
  className,
}: {
  mix: ChannelMix;
  className?: string;
}) {
  const entries = useMemo(
    () =>
      Object.entries(mix).map(([name, pct], i) => ({
        name,
        value: parsePercentString(pct),
        color: PALETTE[i % PALETTE.length],
      })),
    [mix],
  );
  const max = Math.max(...entries.map((e) => e.value), 1);

  return (
    <ul className={cn('space-y-3', className)}>
      {entries.map((e) => (
        <li key={e.name}>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {e.name}
            </span>
            <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
              {e.value.toFixed(1)}%
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-700"
              style={{
                width: `${(e.value / max) * 100}%`,
                opacity: 0.85,
                background: `linear-gradient(90deg, ${e.color}, ${e.color}aa)`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ChannelCards({ mix }: { mix: ChannelMix }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Object.entries(mix).map(([name, pct], i) => {
        const Icon = channelIcons[name] ?? Mail;
        const v = parsePercentString(pct);
        const color = PALETTE[i % PALETTE.length];
        return (
          <div
            key={name}
            className="rounded-xl border border-slate-200/90 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/80"
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className="flex size-10 items-center justify-center rounded-xl text-white shadow-inner"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
              >
                <Icon className="size-5" aria-hidden />
              </div>
              <p
                className="font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-white"
              >
                {v.toFixed(1)}%
              </p>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              {name}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Share of all tracked journey events in dataset.
            </p>
          </div>
        );
      })}
    </div>
  );
}
