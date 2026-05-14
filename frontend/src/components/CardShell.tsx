import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../utils/cn';
import { SPRING_SOFT, TRANSITION_FAST } from '../utils/motion';

export function CardShell({
  children,
  className,
  bright = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Subtle glass highlight on light mode */
  bright?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(
        'rounded-2xl border border-slate-200/75 bg-white/90 shadow-[var(--shadow-card)] backdrop-blur-[2px] dark:border-slate-700/70 dark:bg-slate-900/75',
        bright &&
          'border-teal-200/55 bg-gradient-to-br from-white via-white to-teal-50/35 dark:border-teal-500/18 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/28',
        'hover:border-slate-300/90 hover:shadow-[var(--shadow-soft)] dark:hover:border-slate-600/90',
        'transition-[border-color,box-shadow] duration-500 ease-out',
        className,
      )}
      initial={reduce ? undefined : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : SPRING_SOFT}
      whileHover={
        reduce
          ? undefined
          : {
              y: -3,
              boxShadow:
                '0 1px 0 rgb(15 23 42 / 0.04), 0 28px 56px -26px rgb(15 23 42 / 0.16)',
              transition: TRANSITION_FAST,
            }
      }
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100/90 px-5 py-4 dark:border-slate-800/90">
      <div>
        <h2 className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-600 bg-clip-text text-sm font-semibold tracking-tight text-transparent dark:from-white dark:via-slate-100 dark:to-slate-400">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
