# Releasing

Kubai Icons ships two kinds of release from this repository. They are versioned
separately and their notes are written for different readers.

| Release | Tag | Version source | Readers |
| --- | --- | --- | --- |
| npm packages (`kubai-icons`, `kubai-icons-react`, `kubai-icons-vue`, `kubai-icons-static`) | `<package>@<version>`, one per package | Changesets | Developers who install the packages |
| The skill (`kubai-icons`, `kubai-duotone`) | `v<version>` | `metadata.version` in `SKILL.md` | People who draw icons with the skill |

## Release notes, both kinds

- **Write for the user.** Say what they can now do or what behaves differently, not how
  the work was done. Leave out review rounds, measurements and internal discussion.
- **English, plain sentences.** Start each item with a verb in the imperative: Add, Fix,
  Redraw, Rename, Remove, Follow.
- **Name things exactly.** List icon names in `kebab-case` as they are imported; put file
  paths, props and commands in backticks.
- **Credit contributors, not maintainers.** Maintainers are not thanked or named. An
  outside contributor is thanked at the end of their item; the package changelog does
  this on its own, and skill notes add `thanks @name` by hand.
- **No emoji, no marketing words.** "New", "faster", "fixes" are fine; "amazing" is not.
- **Breaking changes say what to do.** Every major change names what was renamed or
  removed and what to use instead.

## npm packages

The four packages are versioned together. Merging to `master` opens or updates the
"Version packages" pull request; merging that publishes to npm and creates one GitHub
release per package from its `CHANGELOG.md` section.

### Changesets

Every pull request that changes a published package adds a changeset (`npx changeset`)
and selects all four packages.

Pick the bump by what users see:

| Change | Bump |
| --- | --- |
| Rename or remove an icon, a prop or an export path | major |
| Add icons, props or export paths | minor |
| Redraw an icon, fix a bug, change motion timing | patch |

A batch of new icons is a minor bump no matter how small the batch is.

Write the summary as one line in the form the changelog will show:

```md
---
"kubai-icons": minor
"kubai-icons-react": minor
"kubai-icons-vue": minor
"kubai-icons-static": minor
---

Add 7 two-tone icons: terminal, code, brackets, umbrella, cloud-rain, cloud-snow and backpack.
```

- One changeset per user-visible change. Splitting a large batch of icons by theme is
  fine; each summary still names its icons.
- For more than about 60 icons in one changeset, name the theme and the count and link
  the website instead of listing every name.
- A fix says what was wrong before: "Follow the reduced-motion setting as it changes.
  Icons used to read it only once, when the runtime loaded."

### Changelog format

`tools/changelog.mjs` writes each entry as the summary followed by its pull request link:

```md
## 0.14.0

### Minor Changes

- Add 7 two-tone icons: terminal, code, brackets, umbrella, cloud-rain, cloud-snow and backpack. ([#118](https://github.com/kubai087/kubai-icons/pull/118))

### Patch Changes

- Updated dependencies:
  - kubai-icons@0.14.0
```

Commit hashes are not included. Authors listed in `maintainers` in
`.changeset/config.json` are not named; anyone else is thanked after the link:
`([#62](…), thanks [@name](…))`. When a pull request has several authors, list them in
the changeset with one `author: @name` line each, above the summary.

## The skill

A skill release ships zips built from a committed revision; see
[CONTRIBUTING.md](../CONTRIBUTING.md#the-skill) for the build steps. Use the same version
for the tag, the release title and `metadata.version`.

- **Major:** a new style, or rules that change how existing icons are drawn.
- **Minor:** new rules, checks or examples that don't invalidate existing icons.
- **Patch:** corrections to wording, examples or scripts.

Title the release `Kubai Icons <version>` and use this body:

````md
One or two sentences on what this release changes for someone drawing icons.

## What's new

- **Short name of the change.** What it does and where to find it (file, command or
  section of `PROMPT.md`).

## New rules

- **The rule.** What it asks for, and the problem it prevents.

## Which zip

| Zip | For |
| --- | --- |
| `kubai-icons-v<version>.zip` | Claude Code (unzip into `~/.claude/skills/`) and claude.ai |
| `kubai-icons-v<version>-platform.zip` | Skill marketplaces that ask for `version`, `display_name` and descriptions in `SKILL.md` |

## Install

```bash
unzip kubai-icons-v<version>.zip -d ~/.claude/skills/
```

Or paste the install prompt from the [README](https://github.com/kubai087/kubai-icons#install) into Claude Code.
````

Leave out a section that has nothing in it. Add the `kubai-duotone` zips to the table when
that skill changes in the same release.
