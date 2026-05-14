/** Easing curve — calm, enterprise-style deceleration */
export const easeOutExpo = [0.19, 1, 0.22, 1] as const;

export const TRANSITION_FAST = {
  duration: 0.22,
  ease: easeOutExpo,
} as const;

export const TRANSITION_PAGE = {
  duration: 0.42,
  ease: easeOutExpo,
} as const;

export const SPRING_SOFT = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 34,
  mass: 0.85,
};

export const SPRING_SNAP = {
  type: 'spring' as const,
  stiffness: 520,
  damping: 38,
};
