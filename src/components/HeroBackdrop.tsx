/** Dark sky over a planet horizon with a thin brand-coloured atmosphere. */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-svh overflow-hidden bg-page"
    >
      <div className="hero-planet" />
    </div>
  );
}
