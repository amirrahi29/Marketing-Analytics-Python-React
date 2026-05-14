import { NavLink } from 'react-router-dom';
import {
  Funnel,
  Globe2,
  LayoutDashboard,
  Megaphone,
  Menu,
  Smartphone,
  TrendingUp,
  Radio,
  X,
} from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { cn } from '../utils/cn';
import { TRANSITION_FAST, easeOutExpo } from '../utils/motion';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/campaigns', label: 'Campaign Analytics', icon: Megaphone },
  { to: '/revenue', label: 'Revenue Analytics', icon: TrendingUp },
  { to: '/funnel', label: 'Funnel Analytics', icon: Funnel },
  { to: '/channels', label: 'Channel Analytics', icon: Radio },
  { to: '/devices', label: 'Device Analytics', icon: Smartphone },
  { to: '/countries', label: 'Country Analytics', icon: Globe2 },
];

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[276px] flex-col border-r border-teal-950/40 bg-[#060a10] text-slate-200 shadow-[6px_0_56px_-16px_rgba(0,0,0,0.55)] transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="sidebar-glow absolute -left-24 top-16 h-80 w-80 rounded-full bg-teal-500/18 blur-3xl" />
          <div
            className="sidebar-glow absolute -right-24 bottom-28 h-64 w-64 rounded-full bg-cyan-500/14 blur-3xl"
            style={{ animationDelay: '-5s' }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(165deg,rgba(20,184,166,0.07)_0%,transparent_42%,rgba(8,145,178,0.05)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.035)_0%,transparent_28%,transparent_100%)]" />
        </div>

        <div className="relative flex h-[4.25rem] items-center gap-3 border-b border-white/[0.06] px-5">
          <motion.div
            className="relative flex size-10 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-teal-400 via-teal-600 to-cyan-700 text-base font-extrabold leading-none text-white shadow-[0_12px_32px_-8px_rgba(20,184,166,0.55)] ring-1 ring-white/20"
            whileHover={reduce ? undefined : { scale: 1.05, rotate: -2 }}
            transition={TRANSITION_FAST}
          >
            <span className="font-sans tracking-tight">R</span>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
          </motion.div>
          <div className="min-w-0 flex-1">
            <p className="truncate bg-gradient-to-r from-white to-slate-300 bg-clip-text text-[0.95rem] font-bold tracking-tight text-transparent">
              Rahi Analytics
            </p>
            <p className="truncate text-[11px] font-medium text-teal-200/45">
              Enterprise marketing intelligence
            </p>
          </div>
          <motion.button
            type="button"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
            whileTap={reduce ? undefined : { scale: 0.92 }}
          >
            <X className="size-5" />
          </motion.button>
        </div>

        <LayoutGroup id="sidebar-nav">
          <nav className="relative flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-500/35">
            Workspace
          </p>
          {nav.map((item, index) => (
            <motion.div
              key={item.to}
              initial={reduce ? undefined : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { delay: index * 0.04, duration: 0.38, ease: easeOutExpo }
              }
            >
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'bg-teal-500/[0.11] text-white shadow-[inset_0_0_0_1px_rgba(45,212,191,0.2)]'
                      : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <motion.span
                      className={cn(
                        'flex size-8 items-center justify-center rounded-lg transition-colors duration-300',
                        isActive
                          ? 'bg-teal-500/20 text-teal-100 shadow-[0_0_22px_-5px_rgba(45,212,191,0.45)]'
                          : 'bg-slate-900/80 text-slate-400 group-hover:text-teal-100',
                      )}
                      whileHover={reduce ? undefined : { scale: 1.06 }}
                      transition={TRANSITION_FAST}
                    >
                      <item.icon className="size-4" aria-hidden />
                    </motion.span>
                    <span className="truncate">{item.label}</span>
                    {isActive ? (
                      <motion.span
                        layoutId="sidebar-active-dot"
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.85)]"
                        transition={
                          reduce
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 520, damping: 34 }
                        }
                      />
                    ) : null}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>
        </LayoutGroup>

        <div className="relative border-t border-white/[0.06] p-4">
          <motion.div
            className="rounded-xl bg-gradient-to-br from-slate-900/95 to-slate-950/80 p-3.5 ring-1 ring-teal-500/15 backdrop-blur-md"
            initial={reduce ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, ...TRANSITION_FAST }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-200/50">
              Rahi workspace
            </p>
            <p className="mt-1 text-xs font-medium text-slate-100">
              Global revenue · Unified journeys
            </p>
            <p className="mt-3 text-[10px] leading-relaxed text-slate-500 dark:text-slate-500">
              Connected to your local Rahi API. This panel is informational only
              — there is no upgrade or billing here.
            </p>
          </motion.div>
        </div>
      </aside>

      <AnimatePresence>
        {open ? (
          <motion.button
            key="overlay"
            type="button"
            aria-label="Close overlay"
            className="fixed inset-0 z-30 bg-slate-950/65 backdrop-blur-md lg:hidden"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOutExpo }}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-xl border border-slate-200/90 bg-white/95 p-2.5 text-slate-700 shadow-sm backdrop-blur-sm lg:hidden dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200"
      aria-label="Open menu"
      whileHover={reduce ? undefined : { scale: 1.03 }}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      transition={TRANSITION_FAST}
    >
      <Menu className="size-5" />
    </motion.button>
  );
}
