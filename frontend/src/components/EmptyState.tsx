import { Inbox } from 'lucide-react';
import { cn } from '../utils/cn';

export function EmptyState({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/40',
        className,
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-xl bg-slate-200/60 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Inbox className="size-5" aria-hidden />
      </div>
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
        {title}
      </p>
      {description ? (
        <p className="max-w-sm text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
