import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { CampaignRow } from '../types/api';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { formatCurrency, formatNumber } from '../utils/format';
import { cn } from '../utils/cn';

type SortKey = keyof CampaignRow;
type Dir = 'asc' | 'desc';

export function CampaignTable({ rows }: { rows: CampaignRow[] }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('revenue');
  const [dir, setDir] = useState<Dir>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.campaign_name.toLowerCase().includes(q) ||
        String(r.campaign_id).toLowerCase().includes(q),
    );
  }, [rows, search]);

  const sorted = useMemo(() => {
    const mul = dir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * mul;
      }
      return String(av).localeCompare(String(bv)) * mul;
    });
  }, [filtered, sortKey, dir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const pageRows = sorted.slice(
    (pageSafe - 1) * pageSize,
    pageSafe * pageSize,
  );

  const toggleSort = (k: SortKey) => {
    setPage(1);
    if (k === sortKey) setDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(k);
      setDir('desc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Filter campaigns…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none ring-teal-500/0 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing {pageRows.length} of {sorted.length} campaigns
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
        <table className="min-w-[920px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <th className="px-4 py-3">Campaign</th>
              <th className="px-4 py-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-100"
                  onClick={() => toggleSort('sent')}
                >
                  Sent
                  <ArrowUpDown className="size-3" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-100"
                  onClick={() => toggleSort('delivered')}
                >
                  Deliv.
                  <ArrowUpDown className="size-3" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-100"
                  onClick={() => toggleSort('opened')}
                >
                  Opens
                  <ArrowUpDown className="size-3" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-100"
                  onClick={() => toggleSort('clicked')}
                >
                  Clicks
                  <ArrowUpDown className="size-3" />
                </button>
              </th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-100"
                  onClick={() => toggleSort('revenue')}
                >
                  Revenue
                  <ArrowUpDown className="size-3" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => (
              <tr
                key={r.campaign_id}
                className="border-b border-slate-50 transition last:border-0 hover:bg-slate-50/80 dark:border-slate-800/80 dark:hover:bg-slate-800/40"
              >
                <td className="px-4 py-3">
                  <Link
                    to={`/campaigns/${encodeURIComponent(r.campaign_id)}`}
                    className="group block"
                  >
                    <p className="font-medium text-slate-900 group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-300">
                      {r.campaign_name}
                    </p>
                    <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {r.campaign_id}
                    </p>
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-slate-700 dark:text-slate-200">
                  {formatNumber(r.sent)}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-slate-700 dark:text-slate-200">
                  {formatNumber(r.delivered)}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-slate-700 dark:text-slate-200">
                  {formatNumber(r.opened)}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-slate-700 dark:text-slate-200">
                  {formatNumber(r.clicked)}
                </td>
                <td className="px-4 py-3">
                  <CampaignStatusBadge name={r.campaign_name} revenue={r.revenue} />
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(r.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <p className="text-slate-500 dark:text-slate-400">
          Page {pageSafe} / {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={pageSafe <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
            )}
          >
            <ChevronLeft className="size-4" />
            Prev
          </button>
          <button
            type="button"
            disabled={pageSafe >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
            )}
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
