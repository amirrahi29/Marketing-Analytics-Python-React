import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
} from 'recharts';
import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../utils/cn';
import { TRANSITION_FAST } from '../utils/motion';

export interface SparkDatum {
  i: number;
  v: number;
}

export function KpiCard({
  label,
  value,
  sublabel,
  trendText,
  trendPositive,
  spark,
  icon: Icon,
  accentClass,
}: {
  label: string;
  value: string;
  sublabel?: string;
  trendText: string;
  trendPositive: boolean | null;
  spark: SparkDatum[];
  icon: LucideIcon;
  accentClass: string;
}) {
  const neutral = trendPositive === null;
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-[1px] shadow-[var(--shadow-card)] dark:border-slate-700/90 dark:bg-slate-900',
      )}
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: reduce
            ? { duration: 0 }
            : { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
        },
      }}
      whileHover={
        reduce
          ? undefined
          : {
              y: -5,
              scale: 1.01,
              boxShadow:
                '0 0 0 1px rgba(13,148,136,0.15), 0 24px 56px -28px rgba(13,148,136,0.30)',
              transition: TRANSITION_FAST,
            }
      }
      whileTap={reduce ? undefined : { scale: 0.995 }}
    >
      {/* Sheen — enterprise glass accent */}
      <div
        className={cn(
          'pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100',
          'bg-gradient-to-br from-white/40 via-transparent to-teal-500/8 dark:from-white/5 dark:to-cyan-400/10',
        )}
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-[15px] bg-gradient-to-br from-white via-white to-slate-50/55 p-4 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950/85 sm:p-5">
        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r opacity-90',
            accentClass,
          )}
        />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">
              {value}
            </p>
            {sublabel ? (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {sublabel}
              </p>
            ) : null}
          </div>
          <motion.div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-100/90 text-slate-600 shadow-sm dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-300',
            )}
            whileHover={reduce ? undefined : { rotate: [0, -4, 4, 0], scale: 1.06 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
          >
            <Icon className="size-5" aria-hidden />
          </motion.div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <motion.div
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
              neutral &&
                'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
              !neutral &&
                trendPositive &&
                'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
              !neutral &&
                !trendPositive &&
                'bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
            )}
            initial={reduce ? undefined : { scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.12, ...TRANSITION_FAST }}
          >
            {neutral ? (
              <Minus className="size-3.5" aria-hidden />
            ) : trendPositive ? (
              <ArrowUpRight className="size-3.5" aria-hidden />
            ) : (
              <ArrowDownRight className="size-3.5" aria-hidden />
            )}
            {trendText}
          </motion.div>
          <div className="h-10 w-[104px] shrink-0 opacity-90 transition duration-300 group-hover:opacity-100">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spark} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="currentColor"
                  className={cn(
                    neutral && 'text-slate-400',
                    !neutral && trendPositive && 'text-emerald-500',
                    !neutral && !trendPositive && 'text-rose-500',
                  )}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive
                  animationDuration={1200}
                />
                <RTooltip
                  contentStyle={{ display: 'none' }}
                  cursor={{ stroke: '#94a3b8', strokeWidth: 1, opacity: 0.3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
