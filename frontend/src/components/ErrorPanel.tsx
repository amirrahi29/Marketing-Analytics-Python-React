import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '../utils/cn';

export function ErrorPanel({
  message,
  onRetry,
  className,
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-200/70 bg-rose-50/90 px-6 py-10 text-center dark:border-rose-900/50 dark:bg-rose-950/40',
        className,
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
        <AlertTriangle className="size-5" aria-hidden />
      </div>
      <div>
        <p className="text-sm font-medium text-rose-900 dark:text-rose-100">
          Unable to load data
        </p>
        <p className="mt-1 text-xs text-rose-700/90 dark:text-rose-300/90">
          {message}
        </p>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
        >
          <RefreshCw className="size-3.5" />
          Retry
        </button>
      ) : null}
    </div>
  );
}
