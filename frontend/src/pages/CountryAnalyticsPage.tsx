import { useAsyncData } from '../hooks/useAsyncData';
import { api } from '../services/api';
import { PageHeader, SectionLabel } from '../components/PageHeader';
import { CardHeader, CardShell } from '../components/CardShell';
import {
  CountryBarChart,
  CountryHeatGrid,
  CountryStatCards,
} from '../charts/CountryCharts';
import { ErrorPanel } from '../components/ErrorPanel';
import { ChartSkeleton } from '../components/LoadingSkeletons';
import { EmptyState } from '../components/EmptyState';

export function CountryAnalyticsPage() {
  const c = useAsyncData(() => api.getCountryAnalytics());

  return (
    <div>
      <PageHeader
        title="Country analytics"
        description="Geo performance matrix with a heat-style lattice, ranked bars, and executive-friendly stat tiles."
      />

      <SectionLabel>Top markets</SectionLabel>
      {c.loading ? (
        <ChartSkeleton className="h-[200px]" />
      ) : c.error ? (
        <ErrorPanel message={c.error} onRetry={c.reload} />
      ) : c.data?.length ? (
        <CountryStatCards rows={c.data} />
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <CardShell bright className="overflow-hidden">
          <CardHeader
            title="Revenue by country"
            subtitle="Top twelve territories by attributed revenue."
          />
          <div className="p-4">
            {c.loading ? (
              <ChartSkeleton className="h-[300px]" />
            ) : c.data?.length ? (
              <CountryBarChart rows={c.data} />
            ) : (
              <EmptyState title="No geo data" />
            )}
          </div>
        </CardShell>
        <CardShell className="overflow-hidden">
          <CardHeader
            title="Intensity lattice"
            subtitle="Heat-weighted cards — quickly spot your power geos."
          />
          <div className="p-4">
            {c.loading ? (
              <ChartSkeleton className="h-[300px]" />
            ) : c.data?.length ? (
              <CountryHeatGrid rows={c.data} />
            ) : null}
          </div>
        </CardShell>
      </div>
    </div>
  );
}
