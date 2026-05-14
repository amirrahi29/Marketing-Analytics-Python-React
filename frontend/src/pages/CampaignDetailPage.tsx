import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { api } from '../services/api';
import { PageHeader } from '../components/PageHeader';
import { CardShell } from '../components/CardShell';
import { ErrorPanel } from '../components/ErrorPanel';
import { formatCurrency } from '../utils/format';
import { TableSkeleton } from '../components/LoadingSkeletons';

export function CampaignDetailPage() {
  const { campaignId = '' } = useParams();
  const detail = useAsyncData(
    () => api.getCampaignDetail(campaignId),
    [campaignId],
  );

  const row = detail.data?.[0];

  return (
    <div>
      <Link
        to="/campaigns"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition hover:text-teal-500 dark:text-teal-400"
      >
        <ArrowLeft className="size-4" />
        Back to campaigns
      </Link>

      {detail.loading ? (
        <TableSkeleton rows={4} />
      ) : detail.error ? (
        <ErrorPanel message={detail.error} onRetry={detail.reload} />
      ) : row ? (
        <>
          <PageHeader
            title={String(row['Campaign Name'] ?? 'Campaign')}
            description={`Program id ${row['Campaign ID']}. Email channel KPIs and rates derived from warehouse events.`}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Emails Sent', row['Emails Sent']],
              ['Delivered', row['Emails Delivered']],
              ['Opened', row['Emails Opened']],
              ['Clicked', row['Emails Clicked']],
            ].map(([k, v]) => (
              <CardShell key={String(k)} className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {k}
                </p>
                <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 dark:text-white">
                  {typeof v === 'number' ? v : v}
                </p>
              </CardShell>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <CardShell className="p-5 lg:col-span-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Revenue
              </p>
              <p className="mt-2 font-mono text-3xl font-bold tracking-tight text-teal-600 dark:text-teal-400">
                {formatCurrency(Number(row.Revenue ?? 0))}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Attributed from linked purchase events in this cohort.
              </p>
            </CardShell>
            <CardShell className="p-5 lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Health metrics
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {[
                  ['Open rate', row['Open Rate']],
                  ['CTR', row.CTR],
                  ['Unsub rate', row['Unsubscribe Rate']],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/80"
                  >
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {label}
                    </p>
                    <p className="mt-1 font-mono text-lg font-semibold text-slate-900 dark:text-white">
                      {String(val ?? '—')}
                    </p>
                  </div>
                ))}
              </div>
            </CardShell>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <CardShell className="p-5">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Unsubscribed
              </p>
              <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 dark:text-white">
                {row.Unsubscribed}
              </p>
            </CardShell>
            <CardShell className="p-5">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Bounced
              </p>
              <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 dark:text-white">
                {row.Bounced}
              </p>
            </CardShell>
          </div>
        </>
      ) : null}
    </div>
  );
}
