import { Animated } from '../motion';

export function AboutPage() {
  return (
    <>
      <Animated
        as="h1"
        preset="rise"
        delay={0.1}
        className="font-heading text-4xl font-normal tracking-tight text-balance text-on-overlay sm:text-6xl"
      >
        About Elaris
      </Animated>
      <Animated
        as="p"
        preset="rise"
        delay={0.2}
        className="max-w-xl text-lg text-on-overlay/80"
      >
        Elaris is an independent browser built on Ladybird. We’re making it
        fast, private, and focused on a better web.
      </Animated>
    </>
  );
}
