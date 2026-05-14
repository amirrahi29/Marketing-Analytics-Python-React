import type { ChannelMix } from '../types/api';
import { CardHeader, CardShell } from './CardShell';
import {
  ChannelCards,
  ChannelMixBars,
  ChannelPieChart,
} from '../charts/ChannelMixCharts';

export function ChannelMixSection({ mix }: { mix: ChannelMix }) {
  return (
    <CardShell bright className="overflow-hidden">
      <CardHeader
        title="Channel mix"
        subtitle="Share of journey volume across engagement surfaces."
      />
      <div className="grid gap-6 p-5 lg:grid-cols-[1.1fr_minmax(0,1fr)]">
        <div>
          <ChannelPieChart mix={mix} />
        </div>
        <div className="space-y-6">
          <ChannelMixBars mix={mix} />
        </div>
      </div>
      <div className="border-t border-slate-100 px-5 py-5 dark:border-slate-800">
        <ChannelCards mix={mix} />
      </div>
    </CardShell>
  );
}
