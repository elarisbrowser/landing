import sponsors from 'virtual:sponsors';
import { sponsorsCopy } from '../../config/content';
import { sponsorsConfig } from '../../config/site';
import { Animated } from '../../motion';

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';

/** Logo-wall of GitHub sponsors: evenly spaced avatars with names, then a link to join. */
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

      {sponsors.length > 0 && (
        <ul className="flex flex-wrap justify-center gap-x-12 gap-y-8 sm:gap-x-16">
          {sponsors.map((sponsor) => (
            <li key={sponsor.login}>
              <a
                href={sponsor.url}
                target="_blank"
                rel="noreferrer"
                className={`group flex w-20 flex-col items-center gap-3 rounded-outer ${focusRing}`}
              >
                <img
                  src={sponsor.avatarUrl}
                  alt=""
                  width={56}
                  height={56}
                  loading="lazy"
                  className="size-14 rounded-full bg-surface opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                />
                <span className="max-w-full truncate text-sm font-light text-on-overlay-muted transition-colors duration-300 group-hover:text-on-overlay">
                  {sponsor.login}
                </span>
              </a>
            </li>
          ))}
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
