import { cn } from '../utils/cn';

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-slate-200/80 dark:bg-slate-800/80',
        className,
      )}
    >
      <div
        className="animate-shimmer-bar absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent dark:via-white/[0.07]"
        aria-hidden
      />
    </div>
  );
}

export function KpiGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerBlock key={i} className="h-[132px]" />
      ))}
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return <ShimmerBlock className={className} />;
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <ShimmerBlock className="h-10 rounded-lg" />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="relative h-12 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800/50"
        >
          <div
            className="animate-shimmer-bar absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/[0.06]"
            aria-hidden
          />
        </div>
      ))}
    </div>
  );
}
