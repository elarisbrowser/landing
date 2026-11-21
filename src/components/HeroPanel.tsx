import type { ReactNode } from 'react';
import { githubLink } from '../config/site';
import { Animated, loadDelay } from '../motion';
import { GitHubIconButton, XIconButton } from './SocialLinks';

type HeroPanelProps = {
  children: ReactNode;
  contentClassName?: string;
};

export function HeroPanel({ children, contentClassName }: HeroPanelProps) {
  return (
    <div className="relative isolate grid flex-1 overflow-hidden rounded-squircle bg-page border border-hairline">
      {/* Background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-0 h-svh overflow-hidden bg-linear-to-b from-brand-iris-soft via-brand-sky-soft to-brand-mist-soft"
      >
        {/* Cloud image */}
        <img
          src="/clouds-low.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Colour/tint overlay */}
        <div className="absolute inset-0 z-20 bg-page/25" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-2/3 bg-linear-to-t from-page via-page/60 to-transparent" />
      </div>

      {/* UI */}
      <div className="relative z-30 col-start-1 row-start-1 flex flex-col">
        <header className="flex w-full items-center justify-between px-2 py-3 sm:px-4 sm:py-4">
          <Animated
            as="a"
            href="/"
            preset="rise"
            delay={loadDelay(0)}
            className="flex items-center justify-self-start"
          >
            <img
              src="/brand-kit/logo/logo-color.svg"
              alt="Elaris"
              className="size-8 drop-shadow-[0_2px_5px_rgba(20,35,90,0.35)] sm:size-9"
            />
          </Animated>

          <Animated
            preset="rise"
            delay={loadDelay(0)}
            className="flex items-center gap-1.5"
          >
            <XIconButton />
            <GitHubIconButton />
          </Animated>
        </header>

        <div className="flex flex-1 items-center justify-center">
          <div
            className={`flex w-full min-w-0 flex-col items-center gap-5 text-center ${
              contentClassName ?? ''
            }`}
          >
            {children}
          </div>
        </div>

        <footer className="flex items-center justify-between gap-4 px-5 pb-4 text-xs text-on-overlay-muted">
          <span>© 2026 Elaris</span>
          <a
            href={githubLink.href}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-on-overlay focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Open source · GPL-3.0
          </a>
        </footer>
      </div>
    </div>
  );
}
