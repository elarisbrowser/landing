import { motion, useReducedMotion } from 'motion/react';
import { alphaCopy } from '../../config/alpha';
import { xLink } from '../../config/site';
import { ALPHA_MOTION } from '../../motion';

const { ease, stagger, contentDelay } = ALPHA_MOTION;

export function AlphaSuccess() {
  const shouldReduceMotion = useReducedMotion();
  const rise = (index: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 8, filter: 'blur(6px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: {
            duration: 0.5,
            ease,
            delay: contentDelay + stagger * index,
          },
        };

  return (
    <div
      className="flex flex-col items-center gap-3 py-8 text-center"
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={shouldReduceMotion ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 320,
          damping: 22,
          delay: shouldReduceMotion ? 0 : contentDelay - 0.08,
        }}
        className="alpha-success-badge"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <motion.path
            d="M6 12.5l4 4 8-9"
            stroke="currentColor"
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={shouldReduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 0.4,
              ease,
              delay: shouldReduceMotion ? 0 : contentDelay + 0.1,
            }}
          />
        </svg>
      </motion.div>
      <motion.h2
        {...rise(1)}
        className="mt-1 font-heading text-2xl tracking-tight"
      >
        {alphaCopy.successTitle}
      </motion.h2>
      <motion.p
        {...rise(2)}
        className="max-w-sm text-sm text-pretty text-on-overlay/75"
      >
        {alphaCopy.successBody}
      </motion.p>
      <motion.a
        {...rise(3)}
        href={xLink.href}
        target="_blank"
        rel="noreferrer"
        className="pressable mt-2 rounded-full border border-field-border bg-field px-4 py-2 text-sm text-on-overlay transition-colors hover:bg-overlay"
      >
        Follow @elarisbrowser on X →
      </motion.a>
    </div>
  );
}
