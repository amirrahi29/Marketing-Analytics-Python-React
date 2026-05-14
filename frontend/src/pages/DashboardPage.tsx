import { useAsyncData } from '../hooks/useAsyncData';
import { api } from '../services/api';
import { PageHeader, SectionLabel } from '../components/PageHeader';
import { KpiDeck } from '../components/KpiDeck';
import { CardHeader, CardShell } from '../components/CardShell';
import { ChannelMixSection } from '../components/ChannelMixSection';
import { FunnelVisualization } from '../components/FunnelVisualization';
import { RevenueAreaChart } from '../charts/RevenueAreaChart';
import { GeneralTrendChart } from '../charts/GeneralTrendChart';
import { TopCampaignsList } from '../components/TopCampaignsList';
import { CampaignTable } from '../components/CampaignTable';
import { ErrorPanel } from '../components/ErrorPanel';
import {
  ChartSkeleton,
  KpiGridSkeleton,
} from '../components/LoadingSkeletons';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function DashboardPage() {
  const sSummary = useAsyncData(() => api.getGeneralSummary());
  const sTrend = useAsyncData(() => api.getGeneralTrend());
  const sRev = useAsyncData(() => api.getRevenueTrend());
  const sMix = useAsyncData(() => api.getChannelMix());
  const sFunnel = useAsyncData(() => api.getDeliverFunnel());
  const sTop = useAsyncData(() => api.getTopCampaigns());
  const sCamp = useAsyncData(() => api.getGeneralCampaign());

  return (
    <div>
      <PageHeader
        title="Signal clarity for every journey"
        description="Rahi Analytics stitches delivery, engagement, and revenue into one trustworthy picture — built for teams who own growth, lifecycle, and board-ready KPIs."
      />

      <SectionLabel>Performance snapshot</SectionLabel>
      {sSummary.loading || sTrend.loading ? (
        <KpiGridSkeleton />
      ) : sSummary.error || sTrend.error ? (
        <ErrorPanel
          message={sSummary.error ?? sTrend.error ?? ''}
          onRetry={() => {
            sSummary.reload();
            sTrend.reload();
          }}
        />
      ) : sSummary.data && sTrend.data ? (
        <KpiDeck summary={sSummary.data} trend={sTrend.data} />
      ) : null}

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <CardShell className="overflow-hidden" bright>
          <CardHeader
            title="Revenue trend"
            subtitle="Daily revenue with interactive focus states."
          />
          <div className="p-4 sm:p-5">
            {sRev.loading ? (
              <ChartSkeleton className="h-[320px]" />
            ) : sRev.error ? (
              <ErrorPanel
                message={sRev.error}
                onRetry={sRev.reload}
                className="h-[320px]"
              />
            ) : sRev.data?.length ? (
              <RevenueAreaChart data={sRev.data} />
            ) : null}
          </div>
        </CardShell>

        <CardShell className="overflow-hidden" bright>
          <CardHeader
            title="Engagement trend"
            subtitle="Sent, opened, and clicked — email cohort."
          />
          <div className="p-4 sm:p-5">
            {sTrend.loading ? (
              <ChartSkeleton className="h-[320px]" />
            ) : sTrend.error ? (
              <ErrorPanel
                message={sTrend.error}
                onRetry={sTrend.reload}
                className="h-[320px]"
              />
            ) : sTrend.data?.length ? (
              <GeneralTrendChart data={sTrend.data} />
            ) : null}
          </div>
        </CardShell>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {sMix.loading ? (
          <ChartSkeleton className="min-h-[360px]" />
        ) : sMix.error ? (
          <ErrorPanel message={sMix.error} onRetry={sMix.reload} />
        ) : sMix.data ? (
          <ChannelMixSection mix={sMix.data} />
        ) : null}

        <CardShell className="overflow-hidden">
          <CardHeader
            title="Lifecycle funnel"
            subtitle="From send to bounce — volume-weighted widths."
            action={
              <Link
                to="/funnel"
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/50"
              >
                Open
                <ArrowRight className="size-3.5" />
              </Link>
            }
          />
          <div className="p-5">
            {sFunnel.loading ? (
              <ChartSkeleton className="h-[340px]" />
            ) : sFunnel.error ? (
              <ErrorPanel message={sFunnel.error} onRetry={sFunnel.reload} />
            ) : sFunnel.data ? (
              <FunnelVisualization funnel={sFunnel.data} />
            ) : null}
          </div>
        </CardShell>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_minmax(0,380px)]">
        <CardShell className="overflow-hidden">
          <CardHeader
            title="Campaign operations"
            subtitle="Drill into lifecycle programs and owned audiences."
            action={
              <Link
                to="/campaigns"
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/50"
              >
                Full table
                <ArrowRight className="size-3.5" />
              </Link>
            }
          />
          <div className="p-5">
            {sCamp.loading ? (
              <ChartSkeleton className="h-[280px]" />
            ) : sCamp.error ? (
              <ErrorPanel message={sCamp.error} onRetry={sCamp.reload} />
            ) : sCamp.data?.data?.length ? (
              <CampaignTable rows={sCamp.data.data.slice(0, 24)} />
            ) : null}
          </div>
        </CardShell>

        <CardShell className="overflow-hidden">
          <CardHeader title="Top campaigns" subtitle="Revenue leaders." />
          <div className="p-4">
            {sTop.loading ? (
              <ChartSkeleton className="h-[300px]" />
            ) : sTop.error ? (
              <ErrorPanel message={sTop.error} onRetry={sTop.reload} />
            ) : sTop.data?.length ? (
              <TopCampaignsList rows={sTop.data} />
            ) : null}
          </div>
        </CardShell>
      </div>

      <SubmissionTeaser />
    </div>
  );
}

function SubmissionTeaser() {
  const sub = useAsyncData(() => api.getSubmissionRate());

  const bestChannel = sub.data?.by_channel?.length
    ? [...sub.data.by_channel].sort(
        (a, b) => b.submission_rate - a.submission_rate,
      )[0]
    : null;

  return (
    <CardShell className="mt-10 overflow-hidden" bright>
      <CardHeader
        title="Submission analytics"
        subtitle="Channel and country conversion from delivery to submission."
        action={
          <Link
            to="/submissions"
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/50"
          >
            Open workspace
            <ArrowRight className="size-3.5" />
          </Link>
        }
      />
      <div className="grid gap-4 p-5 sm:grid-cols-3">
        {sub.loading ? (
          <ChartSkeleton className="h-20 sm:col-span-3" />
        ) : sub.error ? (
          <div className="sm:col-span-3">
            <ErrorPanel message={sub.error} onRetry={sub.reload} />
          </div>
        ) : (
          <>
            <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
               Channels tracked
              </p>
              <p className="mt-1 font-mono text-2xl font-bold text-slate-900 dark:text-white">
                {sub.data?.by_channel?.length ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Geo cohorts
              </p>
              <p className="mt-1 font-mono text-2xl font-bold text-slate-900 dark:text-white">
                {sub.data?.by_country?.length ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-teal-200/70 bg-teal-50/60 px-4 py-3 dark:border-teal-500/22 dark:bg-teal-950/35">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300">
                Top channel yield
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {bestChannel?.channel ?? '—'}
              </p>
              <p className="mt-0.5 font-mono text-xs text-teal-700 dark:text-teal-400">
                {bestChannel != null
                  ? `${bestChannel.submission_rate.toFixed(2)}%`
                  : ''}
              </p>
            </div>
          </>
        )}
      </div>
    </CardShell>
  );
}
