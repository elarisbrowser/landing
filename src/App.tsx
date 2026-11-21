import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { GradualBlur } from './components/GradualBlur';
import { HeroPanel } from './components/HeroPanel';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { SCROLL_EDGE_BLUR } from './motion';
import { HomePage } from './pages/HomePage';

const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((module) => ({
    default: module.AboutPage,
  })),
);
const RoadmapPage = lazy(() =>
  import('./pages/RoadmapPage').then((module) => ({
    default: module.RoadmapPage,
  })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({
    default: module.NotFoundPage,
  })),
);

function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  // Only animate page swaps after navigation; the first load uses per-element entrances.
  const [hasNavigated, setHasNavigated] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  useSmoothScroll();
  const route =
    pathname === '/'
      ? 'home'
      : pathname === '/about'
        ? 'about'
        : pathname === '/roadmap'
          ? 'roadmap'
          : 'not-found';

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
      setHasNavigated(true);
    };
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (
        !(anchor instanceof HTMLAnchorElement) ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download')
      ) {
        return;
      }

      const destination = new URL(anchor.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname === window.location.pathname
      ) {
        return;
      }

      event.preventDefault();
      window.history.pushState({}, '', destination.href);
      window.scrollTo({ top: 0 });
      setPathname(destination.pathname);
      setHasNavigated(true);
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <main className="site-shell flex min-h-svh min-w-0 bg-page p-4">
      <GradualBlur target="page" {...SCROLL_EDGE_BLUR} />
      <HeroPanel>
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={
              shouldReduceMotion || !hasNavigated ? false : { opacity: 0, x: 8 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={transition}
            className="flex w-full flex-col items-center gap-5 px-6 data-[route=home]:px-0"
            data-route={route}
          >
            <Suspense fallback={null}>
              {route === 'home' ? (
                <HomePage />
              ) : route === 'about' ? (
                <AboutPage />
              ) : route === 'roadmap' ? (
                <RoadmapPage />
              ) : (
                <NotFoundPage />
              )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </HeroPanel>
    </main>
  );
}

export default App;
