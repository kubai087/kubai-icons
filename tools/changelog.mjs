// Changelog generator for Changesets, set in .changeset/config.json.
//
// Each entry is the changeset summary followed by its pull request link (or the commit link
// when there is no pull request). Authors are thanked only when they are not maintainers:
//
//   - Add 7 two-tone icons: terminal, code and brackets. ([#118](https://github.com/...))
//   - Add five icons: `cars` and `car-crash`. ([#62](https://github.com/...), thanks [@name](https://github.com/name))
//
// Options: { repo: "owner/name", maintainers: ["login"] }. The packages are versioned
// together, so a dependency bump lists only the new versions.
import github from '@changesets/changelog-github';

const SEP = '\u0000';
const USER_LINK = /\[@([^\]]+)\]\([^)]+\)/g;

export default {
  async getReleaseLine(changeset, type, options = {}) {
    const { maintainers = [], ...rest } = options;
    const raw = await github.getReleaseLine(changeset, type, {
      ...rest,
      template: ['{summary}', '{pull}', '{commit}', '{authors}'].join(SEP),
    });
    const newline = raw.indexOf('\n');
    const [summary, pull, commit, authors] = raw.slice(0, newline).split(SEP);
    const continuation = raw.slice(newline + 1);

    const skip = new Set(maintainers.map((m) => m.toLowerCase()));
    const thanked = [...authors.matchAll(USER_LINK)].filter((m) => !skip.has(m[1].toLowerCase())).map((m) => m[0]);
    const refs = [pull || commit, thanked.length ? `thanks ${thanked.join(', ')}` : ''].filter(Boolean);
    return `- ${summary}${refs.length ? ` (${refs.join(', ')})` : ''}\n${continuation}`;
  },
  async getDependencyReleaseLine(_changesets, dependenciesUpdated) {
    if (!dependenciesUpdated.length) return '';
    return ['- Updated dependencies:', ...dependenciesUpdated.map((d) => `  - ${d.name}@${d.newVersion}`)].join('\n');
  },
};
