import { useAsyncData } from '../hooks/useAsyncData';
import { api } from '../services/api';
import { PageHeader } from '../components/PageHeader';
import { CardHeader, CardShell } from '../components/CardShell';
import { FunnelVisualization } from '../components/FunnelVisualization';
import { ErrorPanel } from '../components/ErrorPanel';
import { ChartSkeleton } from '../components/LoadingSkeletons';

export function FunnelAnalyticsPage() {
  const funnel = useAsyncData(() => api.getDeliverFunnel());

  return (
    <div>
      <PageHeader
        title="Funnel analytics"
        description="Delivery funnel with cohort conversion yields and inter-step drop-off indicators."
      />
      <CardShell bright className="overflow-hidden">
        <CardHeader
          title="Send → click journey"
          subtitle="Widths normalized against sent volume for quick bottleneck scanning."
        />
        <div className="p-5 sm:p-8">
          {funnel.loading ? (
            <ChartSkeleton className="h-[420px]" />
          ) : funnel.error ? (
            <ErrorPanel message={funnel.error} onRetry={funnel.reload} />
          ) : funnel.data ? (
            <FunnelVisualization funnel={funnel.data} />
          ) : null}
        </div>
      </CardShell>
    </div>
  );
}
