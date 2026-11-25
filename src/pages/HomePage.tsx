import { lazy, Suspense } from 'react';
import { BuiltByChip } from '../components/BuiltByChip';
import { DemoShowcase } from '../components/sections/DemoShowcase';
import { Sponsors } from '../components/sections/Sponsors';
import { hero } from '../config/content';
import { WAITLIST_SURFACE } from '../constants/waitlist';
import { Animated, loadDelay } from '../motion';

const Waitlist = lazy(() => import('../components/Waitlist'));

/** Reserves the waitlist's footprint so the hero doesn't shift while it loads. */
const waitlistPlaceholder = (
  <div aria-hidden="true" className="flex flex-col items-center">
    <div className="mb-2 h-9" />
    <div className="mt-4" style={{ height: WAITLIST_SURFACE.idle.height }} />
  </div>
);

export function HomePage() {
  return (
    <div className="flex w-full flex-col items-center gap-14 pb-28 sm:gap-20">
      <div className="flex w-full flex-col items-center gap-5 px-6 pt-16 sm:pt-24">
        <Animated preset="rise" delay={loadDelay(1)}>
          <BuiltByChip />
        </Animated>
        <Animated
          as="h1"
          preset="rise"
          delay={loadDelay(2)}
          className="home-title w-full min-w-0 font-heading text-5xl font-normal tracking-tight text-balance text-on-overlay sm:text-7xl"
        >
          {hero.title}
        </Animated>
        <Animated
          as="p"
          preset="rise"
          delay={loadDelay(3)}
          className="home-description w-full max-w-xl text-lg text-pretty text-on-overlay/80"
        >
          {hero.description}
        </Animated>
        <div className="w-full">
          <Animated
            delay={loadDelay(4)}
            className="mx-auto mb-2 flex h-9 w-fit max-w-full items-center gap-1 rounded-xl bg-overlay p-1 text-on-overlay backdrop-blur-sm"
          >
            <span className="min-w-0 px-2 text-[11px] font-medium tracking-tight">
              We’re looking for testers!
            </span>
            <a
              href="/alpha"
              className="flex h-7 shrink-0 items-center rounded-lg bg-paper px-2.5 text-[11px] font-medium text-foreground shadow-sm transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-overlay"
            >
              Apply
            </a>
          </Animated>
          <Suspense fallback={waitlistPlaceholder}>
            <Waitlist />
          </Suspense>
        </div>
      </div>
      <DemoShowcase />
      <Sponsors />
    </div>
  );
}
