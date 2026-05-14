import { ChevronDown, Moon, Search, Sun } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/cn';
import { useDashboardRange, type DashboardRange } from '../hooks/useDashboardRange';
import type { DatePreset } from '../utils/dateRange';
import { useTheme } from '../hooks/useTheme';
import { MobileMenuButton } from './Sidebar';

const presets: { id: DatePreset; label: string }[] = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: '6m', label: 'Last 6 months' },
  { id: '12m', label: 'Last 12 months' },
  { id: 'all', label: 'All time' },
];

function formatRange(range: DashboardRange) {
  if (range.preset === 'all') return 'All activity';
  const opts: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return `${range.from.toLocaleDateString(undefined, opts)} → ${range.to.toLocaleDateString(undefined, opts)}`;
}

export function TopNavbar({
  onOpenMenu,
  title,
}: {
  onOpenMenu: () => void;
  title?: string;
}) {
  const { range, setPreset } = useDashboardRange();
  const { theme, toggle } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="nav-accent-line sticky top-0 z-20 border-b border-slate-200/75 bg-slate-50/85 backdrop-blur-2xl backdrop-saturate-150 dark:border-slate-800/80 dark:bg-slate-950/75">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <MobileMenuButton onClick={onOpenMenu} />

        <div className="hidden min-w-0 flex-1 lg:block">
          {title ? (
            <p className="truncate text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {title}
            </p>
          ) : null}
          <p className="hidden text-[11px] text-slate-500 dark:text-slate-400 sm:block">
            {formatRange(range)}
          </p>
        </div>

        <div className="relative flex flex-1 lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search metrics, campaigns, IDs…"
            className="w-full rounded-xl border border-slate-200/90 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-inner outline-none ring-teal-500/0 transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-500/45"
          />
        </div>

        <div className="relative ml-auto flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              className={cn(
                'flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600',
              )}
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-400 opacity-35" />
                <span className="relative inline-flex size-2 rounded-full bg-teal-500" />
              </span>
              <span className="hidden sm:inline">Live sync</span>
              <ChevronDown className="size-3.5 text-slate-400" />
            </button>
            {notifOpen ? (
              <div className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-xl border border-slate-200 bg-white p-3 text-left shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Notifications
                </p>
                <ul className="mt-2 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="rounded-lg bg-slate-50 px-2 py-2 dark:bg-slate-800/80">
                    Revenue pacing <span className="font-semibold">+4.1%</span>{' '}
                    vs target this week.
                  </li>
                  <li className="rounded-lg px-2 py-2">
                    Deliverability stable across email cohorts.
                  </li>
                </ul>
              </div>
            ) : null}
          </div>

          <select
            aria-label="Date range"
            value={range.preset}
            onChange={(e) => setPreset(e.target.value as DatePreset)}
            className="hidden cursor-pointer rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-slate-800 shadow-sm outline-none transition hover:border-slate-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 sm:block dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={toggle}
            className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="size-[18px]" />
            ) : (
              <Moon className="size-[18px]" />
            )}
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/90 py-1 pl-1 pr-2 shadow-sm backdrop-blur-md dark:border-slate-700/90 dark:bg-slate-900/85">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 via-cyan-600 to-sky-600 text-[11px] font-bold text-white shadow-md shadow-teal-900/25 ring-1 ring-white/25">
              RA
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                Amir Rahi
              </p>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                Lead · Growth Analytics
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200/60 px-4 pb-3 dark:border-slate-800/60 sm:hidden">
        <select
          aria-label="Date range"
          value={range.preset}
          onChange={(e) => setPreset(e.target.value as DatePreset)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
