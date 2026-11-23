import type { TargetAndTransition, Transition } from 'motion/react';

export interface MotionPreset {
  initial: TargetAndTransition;
  whileInView: TargetAndTransition;
  transition: Transition;
}

export const motionPresets = {
  rise: {
    initial: { opacity: 0, y: 16, filter: 'blur(10px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
  fadeUp: {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  fade: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { duration: 0.36, ease: 'easeOut' },
  },
} satisfies Record<string, MotionPreset>;

export type MotionPresetName = keyof typeof motionPresets;

export const SMOOTH_SCROLL = { lerp: 0.1, wheelMultiplier: 1 } as const;

/** Blur pinned to the viewport's bottom edge; fades out at the end of the page. */
export const SCROLL_EDGE_BLUR = {
  position: 'bottom',
  height: '6rem',
  strength: 2,
  layers: 4,
  curve: 'bezier',
  exponential: true,
  autoHide: true,
  duration: 0,
} as const;

/** Page-load entrance: each step waits this long after the previous one. */
export const LOAD_STAGGER = { start: 0.05, step: 0.09 } as const;

export const loadDelay = (index: number) =>
  LOAD_STAGGER.start + index * LOAD_STAGGER.step;
