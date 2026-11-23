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

export const sponsorsConfig = {
  account: 'elarisbrowser',
  href: 'https://github.com/sponsors/elarisbrowser',
} as const;

export type ManualSponsor = {
  name: string;
  /** Profile link. Omit for no link. */
  url?: string;
  /** Avatar image. Omit to show a generic avatar icon. */
  avatarUrl?: string;
};

/** Sponsors added by hand, shown alongside the ones fetched from GitHub. */
export const manualSponsors: ManualSponsor[] = [
  { name: 'Max Farrel', url: 'https://x.com/maxffarrell' },
];
