import { AlphaForm } from '../components/alpha/AlphaForm';
import { alphaCopy } from '../config/alpha';
import { Animated, loadDelay } from '../motion';

export function AlphaPage() {
  return (
    <div className="flex w-full flex-col items-center gap-4 px-4 pt-14 pb-24 sm:px-6 sm:pt-20">
      <Animated
        as="p"
        preset="rise"
        delay={loadDelay(1)}
        className="text-xs tracking-[0.2em] text-on-overlay/75 uppercase"
      >
        {alphaCopy.eyebrow}
      </Animated>
      <Animated
        as="h1"
        preset="rise"
        delay={loadDelay(2)}
        className="home-title font-heading text-4xl font-normal tracking-tight text-balance text-on-overlay sm:text-5xl"
      >
        {alphaCopy.title}
      </Animated>
      <Animated
        as="p"
        preset="rise"
        delay={loadDelay(3)}
        className="home-description mb-4 max-w-md text-base text-pretty text-on-overlay/80"
      >
        {alphaCopy.description}
      </Animated>
      <AlphaForm />
    </div>
  );
}
