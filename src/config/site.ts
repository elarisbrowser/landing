export const xLink = {
  label: 'X',
  href: 'https://x.com/elarisbrowser',
  external: true,
  icon: 'x',
} as const;

export const githubLink = {
  label: 'GitHub',
  href: 'https://github.com/elarisbrowser/elaris',
  external: true,
} as const;

/** Hero background: CSS planet horizon, or the WebGL shader version. */
export const heroBackdrop: 'planet' | 'shader' = 'shader';
