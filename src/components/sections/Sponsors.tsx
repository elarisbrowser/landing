import sponsors from 'virtual:sponsors';
import { sponsorsCopy } from '../../config/content';
import { manualSponsors, sponsorsConfig } from '../../config/site';
import { Animated } from '../../motion';

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';

const avatarClass =
  'size-14 rounded-full bg-surface opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0';

type SponsorEntry = {
  key: string;
  name: string;
  url?: string;
  avatarUrl?: string;
};

const entries: SponsorEntry[] = [
  ...sponsors.map((s) => ({
    key: `github:${s.login}`,
    name: s.login,
    url: s.url,
    avatarUrl: s.avatarUrl,
  })),
  ...manualSponsors.map((s) => ({
    key: `manual:${s.name}`,
    name: s.name,
    url: s.url,
    avatarUrl: s.avatarUrl,
  })),
];

function SponsorAvatar({ avatarUrl }: { avatarUrl?: string }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        width={56}
        height={56}
        loading="lazy"
        className={avatarClass}
      />
    );
  }
  return (
    <span className={`flex items-center justify-center ${avatarClass}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-6 fill-none stroke-current stroke-[1.5] text-on-overlay-muted"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/** Logo-wall of sponsors (GitHub-fetched and manual): evenly spaced avatars with names, then a link to join. */
export function Sponsors() {
  return (
    <Animated
      as="section"
      preset="rise"
      aria-labelledby="sponsors-heading"
      className="flex w-full max-w-3xl flex-col items-center gap-10 px-6"
    >
      <h2
        id="sponsors-heading"
        className="text-xs font-light tracking-[0.2em] text-on-overlay-muted uppercase"
      >
        {sponsorsCopy.label}
      </h2>

      {entries.length > 0 && (
        <ul className="flex flex-wrap justify-center gap-x-12 gap-y-8 sm:gap-x-16">
          {entries.map((sponsor) => {
            const content = (
              <>
                <SponsorAvatar avatarUrl={sponsor.avatarUrl} />
                <span className="max-w-full truncate text-sm font-light text-on-overlay-muted transition-colors duration-300 group-hover:text-on-overlay">
                  {sponsor.name}
                </span>
              </>
            );
            const className = `group flex w-20 flex-col items-center gap-3 rounded-outer ${focusRing}`;
            return (
              <li key={sponsor.key}>
                {sponsor.url ? (
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noreferrer"
                    className={className}
                  >
                    {content}
                  </a>
                ) : (
                  <div className={className}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <a
        href={sponsorsConfig.href}
        target="_blank"
        rel="noreferrer"
        className={`group inline-flex items-center gap-1 rounded-sm text-sm font-light text-on-overlay transition-colors hover:text-brand-mist ${focusRing}`}
      >
        {sponsorsCopy.cta}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-3.5 fill-none stroke-current stroke-[1.5] transition-transform duration-300 group-hover:translate-x-0.5"
        >
          <path d="m6 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </Animated>
  );
}
