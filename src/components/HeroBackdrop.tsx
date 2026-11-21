import { useRef } from 'react';
import { heroBackdrop } from '../config/site';
import { useHorizonShader } from '../hooks/useHorizonShader';

const frame =
  'pointer-events-none absolute inset-x-0 top-0 z-0 h-svh overflow-hidden bg-page';

/** CSS planet horizon; also the fallback when WebGL is unavailable. */
function PlanetBackdrop() {
  return (
    <div aria-hidden="true" className={frame}>
      <div className="hero-planet" />
    </div>
  );
}

/** WebGL horizon with shimmering atmosphere and stars. */
function ShaderBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const supported = useHorizonShader(canvasRef);
  if (!supported) return <PlanetBackdrop />;

  return (
    <div aria-hidden="true" className={frame}>
      <canvas ref={canvasRef} className="hero-shader size-full" />
    </div>
  );
}

export function HeroBackdrop() {
  return heroBackdrop === 'shader' ? <ShaderBackdrop /> : <PlanetBackdrop />;
}
