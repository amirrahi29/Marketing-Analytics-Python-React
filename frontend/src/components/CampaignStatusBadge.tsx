import { cn } from '../utils/cn';

const tones = {
  live: 'bg-emerald-500/15 text-emerald-700 ring-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300',
  draft:
    'bg-amber-500/15 text-amber-800 ring-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300',
  paused:
    'bg-slate-500/15 text-slate-700 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300',
  ended: 'bg-sky-500/15 text-sky-900 ring-sky-500/25 dark:bg-sky-500/12 dark:text-sky-300',
} as const;

function statusFromCampaign(name: string, revenue: number): keyof typeof tones {
  const n = name.toLowerCase();
  if (n.includes('draft')) return 'draft';
  if (n.includes('pause')) return 'paused';
  if (revenue === 0) return 'paused';
  if (n.includes('sunset') || n.includes('legacy')) return 'ended';
  return 'live';
}

export function CampaignStatusBadge({
  name,
  revenue,
}: {
  name: string;
  revenue: number;
}) {
  const s = statusFromCampaign(name, revenue);
  const labels: Record<keyof typeof tones, string> = {
    live: 'Active',
    draft: 'Draft',
    paused: 'Paused',
    ended: 'Wrapped',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset',
        tones[s],
      )}
    >
      {labels[s]}
    </span>
  );
}
