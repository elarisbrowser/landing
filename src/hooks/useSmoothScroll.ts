import Lenis from 'lenis';
import { useReducedMotion } from 'motion/react';
import { useEffect } from 'react';
import { SMOOTH_SCROLL } from '../motion/presets';

/** Inertial page scrolling; skipped when the user prefers reduced motion. */
export function useSmoothScroll() {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    const lenis = new Lenis({ ...SMOOTH_SCROLL, autoRaf: true });
    return () => lenis.destroy();
  }, [shouldReduceMotion]);
}
