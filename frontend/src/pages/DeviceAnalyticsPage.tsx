import { useAsyncData } from '../hooks/useAsyncData';
import { api } from '../services/api';
import { PageHeader, SectionLabel } from '../components/PageHeader';
import { CardHeader, CardShell } from '../components/CardShell';
import { DeviceCards, DeviceDonutChart } from '../charts/DeviceCharts';
import { ErrorPanel } from '../components/ErrorPanel';
import { ChartSkeleton } from '../components/LoadingSkeletons';
import { EmptyState } from '../components/EmptyState';

export function DeviceAnalyticsPage() {
  const dev = useAsyncData(() => api.getDeviceAnalytics());

  return (
    <div>
      <PageHeader
        title="Device analytics"
        description="Conversion-relevant device mix with revenue overlay — perfect for responsive QA and creative testing."
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_minmax(0,1fr)]">
        <CardShell bright className="overflow-hidden">
          <CardHeader
            title="Share of events"
            subtitle="Volume-based donut with revenue-inclusive tooltip."
          />
          <div className="p-5">
            {dev.loading ? (
              <ChartSkeleton className="h-[300px]" />
            ) : dev.error ? (
              <ErrorPanel message={dev.error} onRetry={dev.reload} />
            ) : dev.data?.length ? (
              <DeviceDonutChart rows={dev.data} />
            ) : (
              <EmptyState title="No device rows" />
            )}
          </div>
        </CardShell>
        <div>
          <SectionLabel>Profiles</SectionLabel>
          {dev.loading ? (
            <ChartSkeleton className="h-[200px]" />
          ) : dev.data?.length ? (
            <DeviceCards rows={dev.data} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
