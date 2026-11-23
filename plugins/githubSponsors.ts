import type { Plugin } from 'vite';

export type Sponsor = { login: string; avatarUrl: string; url: string };

const MODULE_ID = 'virtual:sponsors';
const RESOLVED_ID = `\0${MODULE_ID}`;

// Each sponsor on the public page is an avatar link: <a … href="/login"><img … src="…" alt="@login" /></a>
const SPONSOR_PATTERN =
  /<a[^>]*data-hovercard-type="(?:user|organization)"[^>]*href="\/([\w-]+)"[^>]*>\s*<img[^>]*src="([^"]+)"[^>]*alt="@\1"/g;

async function fetchSponsors(account: string): Promise<Sponsor[]> {
  try {
    const res = await fetch(`https://github.com/sponsors/${account}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // Only the sponsors list: the page also features the maintainers ("Meet the team").
    const html =
      (await res.text()).match(
        /<remote-pagination>([\s\S]*?)<\/remote-pagination>/,
      )?.[1] ?? '';
    const seen = new Map<string, Sponsor>();
    for (const [, login, src] of html.matchAll(SPONSOR_PATTERN)) {
      if (login === account || seen.has(login)) continue;
      const avatar = new URL(src.replaceAll('&amp;', '&'));
      avatar.searchParams.set('s', '96');
      seen.set(login, {
        login,
        avatarUrl: avatar.toString(),
        url: `https://github.com/${login}`,
      });
    }
    return [...seen.values()];
  } catch (error) {
    console.warn(`[sponsors] Could not load sponsors for ${account}:`, error);
    return [];
  }
}

/** Fetches public GitHub Sponsors once per build and exposes them as `virtual:sponsors`. */
export function githubSponsors(account: string): Plugin {
  let sponsors: Promise<Sponsor[]> | undefined;
  return {
    name: 'github-sponsors',
    resolveId: (id) => (id === MODULE_ID ? RESOLVED_ID : undefined),
    async load(id) {
      if (id !== RESOLVED_ID) return;
      sponsors ??= fetchSponsors(account);
      return `export default ${JSON.stringify(await sponsors)};`;
    },
  };
}
