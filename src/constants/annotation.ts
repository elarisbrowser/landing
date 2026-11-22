/** Timing for the hand-drawn "build from source" hint next to the GitHub button. */
export const SOURCE_HINT = {
  label: 'build from source',
  delay: 1,
  letterStagger: 0.04,
  letterDuration: 0.25,
  drawDuration: 0.9,
  headDuration: 0.25,
  ease: [0.65, 0, 0.35, 1] as const,
};

/** Rubber-band feel when dragging the note: the arrow tip stays pinned and the tail stretches. */
export const SOURCE_HINT_STRETCH = {
  /** Distance (px) where resistance becomes strong; past it the note only overstretches slowly. */
  maxStretch: 48,
  /** How quickly resistance builds (lower = looser at first). */
  resistance: 0.8,
  /** Fraction of `maxStretch` at which the arrow's loop is fully untwirled. */
  unwindAt: 0.9,
  /** Spring the note rides on: slight lag while dragging, wobble on release. */
  spring: { stiffness: 380, damping: 13, mass: 0.5 },
};
