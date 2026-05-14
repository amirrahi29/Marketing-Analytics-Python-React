import { useAsyncData } from '../hooks/useAsyncData';
import { api } from '../services/api';
import { PageHeader, SectionLabel } from '../components/PageHeader';
import { CardHeader, CardShell } from '../components/CardShell';
import {
  SubmissionChannelChart,
  SubmissionCountryChart,
} from '../charts/SubmissionCharts';
import { ErrorPanel } from '../components/ErrorPanel';
import { ChartSkeleton } from '../components/LoadingSkeletons';

export function SubmissionAnalyticsPage() {
  const sub = useAsyncData(() => api.getSubmissionRate());

  return (
    <div>
      <PageHeader
        title="Submission analytics"
        description="Post-delivery submission yield segmented by channel and country — designed for growth and compliance reviews."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <SectionLabel>Channel conversion</SectionLabel>
          <CardShell bright className="overflow-hidden">
            <CardHeader
              title="Submission rate"
              subtitle="Submissions per delivered event, by surface."
            />
            <div className="p-4">
              {sub.loading ? (
                <ChartSkeleton className="h-[300px]" />
              ) : sub.error ? (
                <ErrorPanel message={sub.error} onRetry={sub.reload} />
              ) : sub.data?.by_channel?.length ? (
                <SubmissionChannelChart rows={sub.data.by_channel} />
              ) : null}
            </div>
          </CardShell>
        </div>
        <div>
          <SectionLabel>Geo conversion</SectionLabel>
          <CardShell className="overflow-hidden">
            <CardHeader
              title="Country yield"
              subtitle="Top twelve geographies by submission rate."
            />
            <div className="p-4">
              {sub.loading ? (
                <ChartSkeleton className="h-[300px]" />
              ) : sub.error ? (
                <ErrorPanel message={sub.error} onRetry={sub.reload} />
              ) : sub.data?.by_country?.length ? (
                <SubmissionCountryChart rows={sub.data.by_country} />
              ) : null}
            </div>
          </CardShell>
        </div>
      </div>
    </div>
  );
}
