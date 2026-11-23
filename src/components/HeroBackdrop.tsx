import { heroBackdrop } from '../config/site';

const frame =
  'pointer-events-none absolute inset-x-0 top-0 z-0 h-svh overflow-hidden bg-page';

/** CSS planet horizon. */
function PlanetBackdrop() {
  return (
    <div aria-hidden="true" className={frame}>
      <div className="hero-planet" />
    </div>
  );
}

/** Pre-rendered horizon (the WebGL shader, exported as a still). */
function ImageBackdrop() {
  return (
    <div aria-hidden="true" className={frame}>
      <img
        src="/hero/horizon-1920x1080.webp"
        alt=""
        width={1920}
        height={1080}
        fetchPriority="high"
        className="hero-horizon size-full object-cover"
      />
    </div>
  );
}

export function HeroBackdrop() {
  return heroBackdrop === 'image' ? <ImageBackdrop /> : <PlanetBackdrop />;
}
