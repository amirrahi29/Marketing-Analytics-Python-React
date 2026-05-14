import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { TRANSITION_PAGE } from '../utils/motion';

export function AnimatedOutlet() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? undefined : { opacity: 0, y: -12 }}
        transition={
          reduce ? { duration: 0 } : { ...TRANSITION_PAGE, duration: 0.38 }
        }
        className="w-full"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
