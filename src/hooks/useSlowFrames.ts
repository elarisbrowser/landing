import { useEffect, useState } from 'react';

/** Skip the entrance and first paints, then average this many frames. */
const WARMUP_FRAMES = 180;
const SAMPLE_FRAMES = 120;
/** Average frame time above this (about 40 fps) counts as poor performance. */
const MAX_FRAME_MS = 25;

/**
 * Samples frame times once while `enabled`, after the page settles. Returns
 * true when the device can't keep up, so the caller can drop the expensive
 * effect and keep the plain look. Stops sampling after one decision.
 */
export function useSlowFrames(enabled: boolean) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    let last = 0;
    let warmed = 0;
    let samples = 0;
    let total = 0;

    const tick = (now: number) => {
      const dt = last ? now - last : 0;
      last = now;
      // Ignore stalls such as tab switches.
      if (dt > 0 && dt < 250) {
        if (warmed < WARMUP_FRAMES) {
          warmed++;
        } else {
          total += dt;
          samples++;
          if (samples === SAMPLE_FRAMES) {
            setSlow(total / samples > MAX_FRAME_MS);
            return;
          }
        }
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled]);

  return slow;
}
