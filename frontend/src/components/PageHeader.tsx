import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../utils/cn';
import { TRANSITION_PAGE, easeOutExpo } from '../utils/motion';

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      initial={reduce ? undefined : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { ...TRANSITION_PAGE, delay: 0.04 }}
    >
      <div className="space-y-2">
        <motion.h1
          className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[1.75rem] sm:leading-tight"
          initial={reduce ? undefined : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { delay: 0.1, duration: 0.45, ease: easeOutExpo }
          }
        >
          <span className="bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-800 bg-clip-text text-transparent dark:from-white dark:via-teal-100 dark:to-cyan-200">
            {title}
          </span>
        </motion.h1>
        {description ? (
          <motion.p
            className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={
              reduce ? { duration: 0 } : { delay: 0.18, duration: 0.4 }
            }
          >
            {description}
          </motion.p>
        ) : null}
      </div>
      {actions ? (
        <motion.div
          className="flex shrink-0 flex-wrap items-center gap-2"
          initial={reduce ? undefined : { opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={reduce ? { duration: 0 } : { delay: 0.14, duration: 0.4 }}
        >
          {actions}
        </motion.div>
      ) : null}
    </motion.div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.p
      className={cn(
        'mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400',
      )}
      initial={reduce ? undefined : { opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.35, ease: easeOutExpo }}
    >
      {children}
    </motion.p>
  );
}
