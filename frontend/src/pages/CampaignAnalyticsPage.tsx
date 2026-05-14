import { useAsyncData } from '../hooks/useAsyncData';
import { api } from '../services/api';
import { PageHeader, SectionLabel } from '../components/PageHeader';
import { CampaignTable } from '../components/CampaignTable';
import { TopCampaignsList } from '../components/TopCampaignsList';
import { CardHeader, CardShell } from '../components/CardShell';
import { ErrorPanel } from '../components/ErrorPanel';
import { TableSkeleton } from '../components/LoadingSkeletons';

export function CampaignAnalyticsPage() {
  const campaigns = useAsyncData(() => api.getGeneralCampaign());
  const top = useAsyncData(() => api.getTopCampaigns());

  return (
    <div>
      <PageHeader
        title="Campaign analytics"
        description="Owned-program performance across sends, engagement, and revenue realization. Click any row to inspect KPIs."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <SectionLabel>Programs</SectionLabel>
          <CardShell>
            <CardHeader title="All campaigns" subtitle="Sortable & searchable grid." />
            <div className="p-5">
              {campaigns.loading ? (
                <TableSkeleton />
              ) : campaigns.error ? (
                <ErrorPanel
                  message={campaigns.error}
                  onRetry={campaigns.reload}
                />
              ) : campaigns.data?.data?.length ? (
                <CampaignTable rows={campaigns.data.data} />
              ) : null}
            </div>
          </CardShell>
        </div>
        <div>
          <SectionLabel>Leaders</SectionLabel>
          <CardShell>
            <CardHeader
              title="Top by revenue"
              subtitle="Auto-ranked from dataset."
            />
            <div className="p-4">
              {top.loading ? (
                <div className="h-64 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
              ) : top.error ? (
                <ErrorPanel message={top.error} onRetry={top.reload} />
              ) : top.data?.length ? (
                <TopCampaignsList rows={top.data} />
              ) : null}
            </div>
          </CardShell>
        </div>
      </div>
    </div>
  );
}
