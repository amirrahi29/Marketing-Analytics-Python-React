import { Link } from 'react-router-dom';
import { Crown, Medal } from 'lucide-react';
import type { TopCampaignRow } from '../types/api';
import { formatCurrency } from '../utils/format';
import { cn } from '../utils/cn';

function RankGlyph({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="size-4 text-amber-500" aria-hidden />;
  if (rank === 2) return <Medal className="size-4 text-slate-400" aria-hidden />;
  if (rank === 3)
    return <Medal className="size-4 text-amber-800/80" aria-hidden />;
  return (
    <span className="font-mono text-[11px] font-bold text-slate-400">
      #{rank}
    </span>
  );
}

export function TopCampaignsList({ rows }: { rows: TopCampaignRow[] }) {
  return (
    <ul className="space-y-2">
      {rows.map((r, i) => {
        const rank = i + 1;
        const hot = rank <= 3;
        return (
          <li key={r.campaign_id}>
            <Link
              to={`/campaigns/${encodeURIComponent(r.campaign_id)}`}
              className={cn(
                'flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800/50',
              )}
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <RankGlyph rank={rank} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {r.campaign_name}
                </p>
                <p className="truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  {r.campaign_id}
                </p>
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset',
                  hot
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white ring-transparent shadow-md shadow-teal-600/25'
                    : 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700',
                )}
              >
                {formatCurrency(r.revenue)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
