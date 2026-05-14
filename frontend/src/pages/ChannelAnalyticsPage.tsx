import { useAsyncData } from '../hooks/useAsyncData';
import { api } from '../services/api';
import { PageHeader } from '../components/PageHeader';
import { ChannelMixSection } from '../components/ChannelMixSection';
import { ErrorPanel } from '../components/ErrorPanel';
import { ChartSkeleton } from '../components/LoadingSkeletons';

export function ChannelAnalyticsPage() {
  const mix = useAsyncData(() => api.getChannelMix());

  return (
    <div>
      <PageHeader
        title="Channel analytics"
        description="Distribution of journey telemetry across messaging surfaces — ideal for budget swaps and cross-channel experimentation design."
      />
      {mix.loading ? (
        <ChartSkeleton className="min-h-[480px]" />
      ) : mix.error ? (
        <ErrorPanel message={mix.error} onRetry={mix.reload} />
      ) : mix.data ? (
        <ChannelMixSection mix={mix.data} />
      ) : null}
    </div>
  );
}
