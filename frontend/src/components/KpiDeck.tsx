import type { GeneralSummary, GeneralTrendRow } from '../types/api';
import {
  buildSparkline,
  dailyCtr,
  dailyOpenRate,
  periodDeltaPercent,
  sortedGeneralTrend,
} from '../utils/trendFromSeries';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  trendLabel,
} from '../utils/format';
import type { SparkDatum } from './KpiCard';
import {
  DollarSign,
  Mail,
  MousePointerClick,
  Percent,
  ScanEye,
  Send,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { KpiCard } from './KpiCard';

function toSpark(series: { date: string; value: number }[]): SparkDatum[] {
  return series.map((p, i) => ({ i, v: p.value }));
}

function avgRateDelta(
  rows: GeneralTrendRow[],
  rateFn: (r: GeneralTrendRow) => number,
): number | null {
  const sorted = sortedGeneralTrend(rows);
  if (sorted.length < 4) return null;
  const w = Math.min(14, Math.floor(sorted.length / 2));
  const recent = sorted.slice(-w);
  const prior = sorted.slice(-2 * w, -w);
  if (prior.length < w) return null;
  const avg = (arr: GeneralTrendRow[]) =>
    arr.reduce((a, r) => a + rateFn(r), 0) / Math.max(arr.length, 1);
  const ar = avg(recent);
  const ap = avg(prior);
  if (ap === 0) return ar > 0 ? 100 : 0;
  return ((ar - ap) / ap) * 100;
}

export function KpiDeck({
  summary,
  trend,
}: {
  summary: GeneralSummary;
  trend: GeneralTrendRow[];
}) {
  const bounceRate =
    (summary.Email_Bounced / Math.max(summary.Email_delivered, 1)) * 100;

  const dSent = periodDeltaPercent(
    buildSparkline(trend, (r) => r['Email sent']),
  );
  const dDel = periodDeltaPercent(
    buildSparkline(trend, (r) => r['Email delivered']),
  );
  const dOpen = avgRateDelta(trend, dailyOpenRate);
  const dCtr = avgRateDelta(trend, dailyCtr);
  const dRev = periodDeltaPercent(buildSparkline(trend, (r) => r.revenue));

  const flatSpark: SparkDatum[] = Array.from({ length: 16 }, (_, i) => ({
    i,
    v: bounceRate,
  }));

  const cards = [
    {
      label: 'Emails sent',
      value: formatNumber(summary.Email_sent),
      sublabel: 'All-time email sends',
      trendText: dSent != null ? `${trendLabel(dSent).text} vs prior` : '—',
      trendPositive: dSent != null ? dSent >= 0 : null,
      spark: toSpark(buildSparkline(trend, (r) => r['Email sent'])),
      icon: Send,
      accent: 'from-teal-500/90 via-cyan-500/70 to-transparent',
    },
    {
      label: 'Delivered',
      value: formatNumber(summary.Email_delivered),
      sublabel: `${formatPercent(summary.Email_delivery_rate)} delivery rate`,
      trendText: dDel != null ? `${trendLabel(dDel).text} vs prior` : '—',
      trendPositive: dDel != null ? dDel >= 0 : null,
      spark: toSpark(buildSparkline(trend, (r) => r['Email delivered'])),
      icon: Mail,
      accent: 'from-emerald-400/80 via-teal-500/60 to-transparent',
    },
    {
      label: 'Open rate',
      value: formatPercent(summary.Email_open_rate),
      sublabel: 'Unique opens / delivered',
      trendText: dOpen != null ? `${trendLabel(dOpen).text} avg daily` : '—',
      trendPositive: dOpen != null ? dOpen >= 0 : null,
      spark: toSpark(buildSparkline(trend, (r) => dailyOpenRate(r))),
      icon: ScanEye,
      accent: 'from-fuchsia-500/80 via-purple-500/60 to-transparent',
    },
    {
      label: 'CTR',
      value: formatPercent(summary.Email_click_percentage),
      sublabel: 'Clicks / delivered',
      trendText: dCtr != null ? `${trendLabel(dCtr).text} avg daily` : '—',
      trendPositive: dCtr != null ? dCtr >= 0 : null,
      spark: toSpark(buildSparkline(trend, (r) => dailyCtr(r))),
      icon: MousePointerClick,
      accent: 'from-sky-500/80 via-teal-600/60 to-transparent',
    },
    {
      label: 'Revenue',
      value: formatCurrency(summary.revenue),
      sublabel: 'Attributed email revenue',
      trendText: dRev != null ? `${trendLabel(dRev).text} vs prior` : '—',
      trendPositive: dRev != null ? dRev >= 0 : null,
      spark: toSpark(buildSparkline(trend, (r) => r.revenue)),
      icon: DollarSign,
      accent: 'from-amber-500/80 via-orange-500/60 to-transparent',
    },
    {
      label: 'Bounce rate',
      value: formatPercent(bounceRate),
      sublabel: 'Bounced / delivered',
      trendText: 'Snapshot · not day-seried',
      trendPositive: null,
      spark: flatSpark,
      icon: Percent,
      accent: 'from-rose-500/70 via-orange-400/50 to-transparent',
    },
  ] as const;

  const reduce = useReducedMotion();

  const items = cards.map((c) => (
    <KpiCard
      key={c.label}
      label={c.label}
      value={c.value}
      sublabel={c.sublabel}
      trendText={c.trendText}
      trendPositive={c.trendPositive}
      spark={c.spark}
      icon={c.icon}
      accentClass={c.accent}
    />
  ));

  if (reduce) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items}</div>
    );
  }

  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.085,
            delayChildren: 0.04,
          },
        },
      }}
    >
      {items}
    </motion.div>
  );
}
