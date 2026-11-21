import { motion, useReducedMotion } from 'motion/react';
import { SOURCE_HINT } from '../constants/annotation';

const {
  label,
  delay,
  letterStagger,
  letterDuration,
  drawDuration,
  headDuration,
  ease,
} = SOURCE_HINT;

// Arrow draws once the note is fully written.
const arrowDelay = delay + label.length * letterStagger + letterDuration;

/** Squiggly hand-drawn arrow + note pointing up at the GitHub icon button. */
export function SourceHint() {
  const shouldReduceMotion = useReducedMotion();
  const instant = { duration: 0 };
  const draw = (from: number, duration: number) =>
    shouldReduceMotion ? instant : { delay: from, duration, ease };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-full right-0 mt-0.5 hidden items-end text-annotation sm:flex"
    >
      <span className="mr-1.5 -mb-1 -rotate-3 whitespace-pre font-hand text-[1.625rem] leading-none tracking-wide">
        {Array.from(label, (char, i) => (
          <motion.span
            // biome-ignore lint/suspicious/noArrayIndexKey: static string, order never changes
            key={i}
            initial={{ opacity: 0, y: 3, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={draw(delay + i * letterStagger, letterDuration)}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </span>

      <svg
        viewBox="0 0 120 70"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-[70px] w-[120px]"
      >
        <motion.path
          d="M4 62 C24 66 36 44 26 38 C16 32 10 50 34 52 C62 54 100 44 104 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={draw(arrowDelay, drawDuration)}
        />
        <motion.path
          d="M98 12 L104 4 L108 13"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={draw(arrowDelay + drawDuration, headDuration)}
        />
      </svg>
    </div>
  );
}
