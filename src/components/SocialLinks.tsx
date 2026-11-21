import { motion, useReducedMotion } from 'motion/react';
import { githubLink, xLink } from '../config/site';
import { WAITLIST_MORPH_SPRING } from '../constants/waitlist';

export function XIconButton() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href={xLink.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Elaris on ${xLink.label}`}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
      transition={shouldReduceMotion ? { duration: 0 } : WAITLIST_MORPH_SPRING}
      className="inline-flex size-8 items-center justify-center justify-self-end rounded-inner bg-overlay text-on-overlay backdrop-blur-md transition-colors duration-300 hover:bg-overlay-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <img src="/icons/x.svg" alt="" className="size-4 brightness-0 invert" />
      <span className="sr-only">Elaris on {xLink.label}</span>
    </motion.a>
  );
}

export function GitHubIconButton() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href={githubLink.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Elaris on ${githubLink.label}`}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
      transition={shouldReduceMotion ? { duration: 0 } : WAITLIST_MORPH_SPRING}
      className="inline-flex size-8 items-center justify-center justify-self-end rounded-inner bg-overlay text-on-overlay backdrop-blur-md transition-colors duration-300 hover:bg-overlay-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <img
        src="/icons/github.svg"
        alt=""
        className="size-4.5 brightness-0 invert"
      />
      <span className="sr-only">Elaris on {githubLink.label}</span>
    </motion.a>
  );
}
