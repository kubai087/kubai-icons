#!/usr/bin/env node
// Builds every package from the icon sources:
//   packages/core/dist     kubai-icons: one ES module per icon, the runtime, the element
//   packages/react/dist    kubai-icons-react: one component per icon
//   packages/vue/dist      kubai-icons-vue: one component per icon
//   packages/static        kubai-icons-static: standalone SVG files and metadata
//   site/public/data       chunks the docs site loads
//
//   node tools/build.mjs [--only core,react,vue,static,site]
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { build, transform } from 'esbuild';
import { loadIcons, categories, root, releases, sinceMap, compareVersions } from './registry.mjs';
import { validate } from './validate.mjs';
import { renderInner, renderSVG } from '../packages/core/src/render.js';

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const targets = new Set((opt('--only') || 'core,react,vue,static,site').split(','));
const t0 = Date.now();

// --lenient builds what it can and lists what it left out, for local work in progress.
const lenient = args.includes('--lenient');
const loaded = await loadIcons({ strict: !lenient });
const { badges } = loaded;
let icons = loaded.icons;
const problems = validate(icons, badges);
if (problems.length && !lenient) {
  console.error(problems.join('\n'));
  process.exit(1);
}
if (lenient) {
  const bad = new Set([...loaded.failures.map((x) => x.name), ...problems.map((p) => p.split(/[ :]/)[0].replace(/^icons\//, '').replace(/\.js$/, ''))]);
  for (const x of loaded.failures) console.warn(`skipped ${x.name}: ${x.error}`);
  for (const p of problems) console.warn(`skipped: ${p}`);
  icons = icons.filter((ic) => !bad.has(ic.name) && !bad.has(ic.base));
}

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const pascal = (s) => camel(s).replace(/^[a-z]/, (c) => c.toUpperCase());
const rel = (from, to) => { const r = path.relative(from, to).split(path.sep).join('/'); return r.startsWith('.') ? r : `./${r}`; };
const write = (file, text) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text); };
const clean = (dir) => fs.rmSync(dir, { recursive: true, force: true });

// ---------- Render ----------
const HAN = /\p{Script=Han}/u;
const publicCategories = categories.map(({ zh, ...c }) => c);
// Published definitions carry English metadata only.
const englishOnly = (source) => source
  .replace(/^\s*zh:\s*(['"`]).*\1,?\n/m, '')
  .replace(/^(\s*tags:\s*\[)(.*)\]/m, (_, open, list) => `${open}${list.split(',').filter((t) => !HAN.test(t)).join(',')}]`);
const built = icons.map((ic) => ({ ic, markup: renderInner(ic, { k: '__K__', paint: 'css', names: true }) }));
// The release each icon first shipped in; a badged version shares its base's. Icons not yet
// released have none.
const since = sinceMap();
const meta = icons.map((ic) => ({
  name: ic.name, category: ic.category, tags: (ic.tags || []).filter((t) => !HAN.test(t)),
  ...(ic.base ? { base: ic.base, badge: ic.badge } : {}),
  ...(ic.tap ? { tap: true } : {}),
  ...(ic.by ? { by: ic.by } : {}),
  ...(since.has(ic.base ?? ic.name) ? { since: since.get(ic.base ?? ic.name) } : {})
}));
const version = JSON.parse(fs.readFileSync(path.join(root, 'packages/core/package.json'), 'utf8')).version;
console.log(`${icons.length} icons (${icons.filter((i) => !i.base).length} bases) rendered in ${Date.now() - t0}ms`);

// ---------- kubai-icons ----------
const core = path.join(root, 'packages/core');
if (targets.has('core') || targets.has('site')) {
  const src = path.join(core, 'src');
  const dist = path.join(core, 'dist');
  clean(dist);
  clean(path.join(core, '.gen'));
  const min = async (code) => (await transform(code, { minify: true, format: 'esm', target: 'es2020', legalComments: 'none' })).code;
  const read = (f) => fs.readFileSync(f, 'utf8');
  // The runtime and authoring kit, one file each, so every icon shares the same few files.
  for (const n of ['kit', 'compose', 'icon', 'color', 'motion', 'runtime', 'element']) write(path.join(dist, `${n}.js`), await min(read(path.join(src, `${n}.js`))));
  write(path.join(dist, 'api.js'), await min(read(path.join(src, 'index.js'))));
  // Icon and badge definitions, with their kit imports pointed at dist/kit.js.
  const relink = (code, up) => code.replace(/(['"])(?:\.\.\/)+packages\/core\/src\/([a-z]+)\.js\1/g, (_, q, n) => `${q}${'../'.repeat(up)}${n}.js${q}`);
  for (const n of fs.readdirSync(path.join(root, 'icons')).filter((f) => f.endsWith('.js'))) write(path.join(dist, 'defs', n), await min(relink(englishOnly(read(path.join(root, 'icons', n))), 1)));
  for (const n of fs.readdirSync(path.join(root, 'badges')).filter((f) => f.endsWith('.js'))) write(path.join(dist, 'defs', 'badges', n), await min(relink(englishOnly(read(path.join(root, 'badges', n))), 2)));
  for (const { ic, markup } of built) {
    const base = `../defs/${path.basename(ic.file)}`;
    let def;
    if (!ic.base) def = `import d from'${base}';`;
    else if (ic.badge === 'off') def = `import b from'${base}';import s from'../defs/badges/_slash.js';import{withSlash as w}from'../compose.js';const d=w(b,s);`;
    else def = `import b from'${base}';import g from'../defs/badges/${path.basename(badges.get(ic.badge).file)}';import{withBadge as w}from'../compose.js';const d=w(b,g);`;
    write(path.join(dist, 'icons', `${ic.name}.js`), `${def}import{icon as i}from'../icon.js';export default/*@__PURE__*/i(${JSON.stringify(ic.name)},${JSON.stringify(markup)},d.target,d.draw,${ic.tap ? 1 : 0}${ic.tone ? `,${JSON.stringify(ic.tone)}` : ''});\n`);
  }
  write(path.join(dist, 'index.js'), `export*from'./api.js';\n${icons.map((ic) => `export{default as ${pascal(ic.name)}}from'./icons/${ic.name}.js';`).join('\n')}\n`);
  write(path.join(dist, 'dynamic.js'), `// Loads an icon by name; each icon stays its own chunk.\nconst l={\n${icons.map((ic) => `${JSON.stringify(ic.name)}:()=>import('./icons/${ic.name}.js'),`).join('\n')}\n};\nexport const names=Object.keys(l);\nexport function loadIcon(n){return Object.hasOwn(l,n)?l[n]().then((m)=>m.default):Promise.reject(new Error('Unknown icon: '+n));}\n`);
  // The element and icons again for a <script> tag on a CDN. A browser finds each import only
  // after downloading the file before it, so the shared code is merged into one file and each
  // icon into one more. Icon files import the shared code back from the element, already loaded.
  const cdn = { bundle: true, format: 'esm', minify: true, target: 'es2020', legalComments: 'none', logLevel: 'warning' };
  await build({ ...cdn, outfile: path.join(dist, 'cdn/element.js'), stdin: { resolveDir: src, contents: `export{KubaiIconElement}from'./element.js';export*from'./kit.js';export{withBadge,withSlash}from'./compose.js';export{icon}from'./icon.js';` } });
  const shared = { name: 'shared-runtime', setup: (b) => b.onResolve({ filter: /^(\.\.\/)+(kit|compose|icon)\.js$/ }, () => ({ path: '../element.js', external: true })) };
  await build({ ...cdn, outdir: path.join(dist, 'cdn/icons'), entryPoints: built.map(({ ic }) => path.join(dist, 'icons', `${ic.name}.js`)), plugins: [shared] });
  write(path.join(dist, 'icons.json'), JSON.stringify(meta));
  write(path.join(dist, 'categories.json'), JSON.stringify(publicCategories));
  const iconType = `import type { KubaiIconData } from './types.js';\n`;
  write(path.join(dist, 'types.d.ts'), fs.readFileSync(path.join(core, 'types/types.d.ts'), 'utf8'));
  write(path.join(dist, 'index.d.ts'), `${iconType}export * from './types.js';\n${fs.readFileSync(path.join(core, 'types/api.d.ts'), 'utf8')}\n${icons.map((ic) => `/** ${ic.name} (${ic.category}) */\nexport declare const ${pascal(ic.name)}: KubaiIconData;`).join('\n')}\n`);
  write(path.join(dist, 'dynamic.d.ts'), `import type { KubaiIconData } from './types.js';\nexport type IconName =\n${icons.map((ic) => `  | ${JSON.stringify(ic.name)}`).join('\n')};\nexport declare const names: IconName[];\nexport declare function loadIcon(name: IconName | (string & {})): Promise<KubaiIconData>;\n`);
  write(path.join(dist, 'runtime.d.ts'), `export * from './types.js';\n${fs.readFileSync(path.join(core, 'types/runtime.d.ts'), 'utf8')}`);
  write(path.join(dist, 'element.d.ts'), `export declare class KubaiIconElement extends HTMLElement {}\n`);
  write(path.join(dist, 'icon.d.ts'), `export * from './types.js';\n`);
  write(path.join(dist, 'color.d.ts'), `export declare const VARIANTS: Record<'color' | 'soft', Record<string, string>>;\n`);
  write(path.join(dist, 'icons', 'index.d.ts'), '');
  // Every icon module has the same type, so one declaration serves them all and installs stay small.
  write(path.join(dist, 'icon-module.d.ts'), `import type { KubaiIconData } from './types.js';\ndeclare const icon: KubaiIconData;\nexport default icon;\n`);
  console.log(`kubai-icons → packages/core/dist`);
}

// ---------- kubai-icons-react / kubai-icons-vue ----------
for (const fw of ['react', 'vue']) {
  if (!targets.has(fw)) continue;
  const pkg = path.join(root, 'packages', fw);
  const dist = path.join(pkg, 'dist');
  clean(dist);
  fs.cpSync(path.join(pkg, 'src'), dist, { recursive: true });
  for (const ic of icons) {
    const P = pascal(ic.name);
    // React components hold motion state, so each one is a client module for React Server Components.
    write(path.join(dist, 'icons', `${ic.name}.js`), `${fw === 'react' ? "'use client';\n" : ''}import data from 'kubai-icons/icons/${ic.name}';\nimport { createKubaiIcon } from '../create.js';\nexport default /* @__PURE__ */ createKubaiIcon('${P}', data);\n`);
  }
  write(path.join(dist, 'icon-module.d.ts'), `import type { KubaiIconComponent } from './create.js';\ndeclare const icon: KubaiIconComponent;\nexport default icon;\n`);
  const lines = icons.map((ic) => { const P = pascal(ic.name); return `export { default as ${P}, default as ${P}Icon } from './icons/${ic.name}.js';`; });
  write(path.join(dist, 'index.js'), `export { createKubaiIcon, KubaiIcon } from './create.js';\nexport { setVariant, VARIANTS } from 'kubai-icons/runtime';\n${lines.join('\n')}\n`);
  write(path.join(dist, 'index.d.ts'), `export * from './create.js';\nexport { setVariant, VARIANTS } from 'kubai-icons/runtime';\nimport type { KubaiIconComponent } from './create.js';\n${icons.map((ic) => { const P = pascal(ic.name); return `/** ${ic.name} */\nexport declare const ${P}: KubaiIconComponent;\nexport declare const ${P}Icon: KubaiIconComponent;`; }).join('\n')}\n`);
  write(path.join(dist, 'dynamic.js'), fs.readFileSync(path.join(pkg, 'dynamic.template.js'), 'utf8'));
  console.log(`kubai-icons-${fw} → packages/${fw}/dist`);
}

// ---------- kubai-icons-static ----------
if (targets.has('static')) {
  const pkg = path.join(root, 'packages/static');
  for (const d of ['svg', 'svg-soft']) clean(path.join(pkg, d));
  for (const ic of icons) {
    write(path.join(pkg, 'svg', `${ic.name}.svg`), renderSVG(ic, { size: 24 }) + '\n');
    write(path.join(pkg, 'svg-soft', `${ic.name}.svg`), renderSVG(ic, { size: 24, accent: '#6F87B5', variant: 'soft' }) + '\n');
  }
  write(path.join(pkg, 'icons.json'), JSON.stringify(meta));
  write(path.join(pkg, 'categories.json'), JSON.stringify(publicCategories));
  console.log(`kubai-icons-static → packages/static (svg/, svg-soft/)`);
}

// ---------- site data ----------
/** Enough for the default grid's opening screens on a large display. */
const FIRST_SCREEN_ICONS = 144;
if (targets.has('site')) {
  const out = path.join(root, 'site/public/data');
  clean(out);
  // Pre-bundled ES modules the browser loads as icons come into view: each category's base
  // icons, and separately its badged versions, which only the detail panel and collections
  // need. _first holds the default grid's opening screens, which would otherwise touch
  // nearly every category.
  clean(path.join(root, 'site/src/generated'));
  const chunks = new Map();
  for (const ic of icons) {
    const chunk = ic.base ? `${ic.category}.badged` : ic.category;
    if (!chunks.has(chunk)) chunks.set(chunk, []);
    chunks.get(chunk).push(ic);
  }
  const firstScreens = icons.filter((ic) => !ic.base).slice(0, FIRST_SCREEN_ICONS);
  chunks.set('_first', firstScreens);
  const tmp = path.join(core, '.gen', 'site');
  clean(tmp);
  const entries = [];
  for (const [chunk, list] of chunks) {
    const file = path.join(tmp, `${chunk}.js`);
    write(file, `${list.map((ic, i) => `import i${i} from ${JSON.stringify(path.join(core, 'dist', 'icons', `${ic.name}.js`))};`).join('\n')}\nexport default [${list.map((_, i) => `i${i}`).join(',')}];\n`);
    entries.push({ in: file, out: chunk });
  }
  await build({ entryPoints: entries, outdir: path.join(out, 'icons'), bundle: true, format: 'esm', minify: true, target: 'es2020', legalComments: 'none', logLevel: 'warning' });
  clean(path.join(core, '.gen'));
  // The index the site searches. It is revalidated on every visit and carries a hash of each
  // module, which lets the modules themselves be cached indefinitely.
  const hashes = Object.fromEntries([...chunks.keys()].map((chunk) => [chunk, crypto.createHash('sha256').update(fs.readFileSync(path.join(out, 'icons', `${chunk}.js`))).digest('hex').slice(0, 10)]));
  // The site marks the icons of the latest release that added any, and those not released
  // yet, as new. The first release added every icon, so it marks none.
  const added = Object.keys(releases).sort(compareVersions);
  const fresh = added.length > 1 ? added[added.length - 1] : null;
  const siteMeta = meta.map((m) => (!m.since || m.since === fresh ? { ...m, new: true } : m));
  write(path.join(out, 'index.json'), JSON.stringify({ version, count: icons.length, bases: icons.filter((i) => !i.base).length, categories, hashes, first: firstScreens.map((ic) => ic.name), icons: siteMeta }));
  // The markup behind /api/icon/<name>.svg, in one file per first two letters, so a
  // request reads only a small part of the set.
  const shards = new Map();
  for (const ic of icons) {
    const prefix = ic.name.slice(0, 2);
    if (!shards.has(prefix)) shards.set(prefix, {});
    shards.get(prefix)[ic.name] = [renderInner(ic, { k: '__K__', paint: 'template', names: false }), ...(ic.tone ? [ic.tone] : [])];
  }
  for (const [prefix, shard] of shards) write(path.join(out, 'templates', `${prefix}.json`), JSON.stringify(shard));
  // Search keywords load separately, so the grid does not wait for them.
  const allKeywords = JSON.parse(fs.readFileSync(path.join(root, 'icons', 'keywords.json'), 'utf8'));
  write(path.join(out, 'keywords.json'), JSON.stringify(Object.fromEntries(icons.filter((i) => !i.base && allKeywords[i.name]).map((i) => [i.name, allKeywords[i.name]]))));
  // Each translated language's words for the icons, loaded only on that language's pages.
  const i18n = path.join(root, 'site/src/i18n');
  for (const { name: language } of fs.readdirSync(i18n, { withFileTypes: true }).filter((e) => e.isDirectory())) write(path.join(out, 'keywords', `${language}.json`), fs.readFileSync(path.join(i18n, language, 'icons.json'), 'utf8'));
  // Plain-text guides for language models: llms.txt says what the library is and where to
  // look, llms-full.txt adds usage and every icon's exact name, so an agent writing code
  // can find an icon without running the site's script.
  const pub = path.join(root, 'site/public');
  const SITE = 'https://icons.kubai.design';
  const bases = icons.filter((ic) => !ic.base);
  const badged = new Map();
  for (const ic of icons) if (ic.base) badged.set(ic.base, [...(badged.get(ic.base) || []), ic.name.slice(ic.base.length + 1)]);
  const intro = `# Kubai Icons

> ${icons.length.toLocaleString('en')} animated icons in one consistent style (${bases.length} objects, plus badged and slashed "off" versions), for React, Vue, plain JavaScript, web components and static SVG. MIT licensed. Current version: ${version}.

Each icon moves like the object on hover: a folder opens, an envelope unseals, a lock springs open. Every color derives from one accent through CSS, so icons follow \`currentColor\`.

Icon names are kebab-case (\`folder-plus\`). In the React, Vue and JavaScript packages each icon is exported in PascalCase (\`FolderPlus\`); React and Vue also export it with an \`Icon\` suffix (\`FolderPlusIcon\`). Only names in the icon list exist; do not guess others.
`;
  const usage = `## Packages

| Package | For |
| --- | --- |
| \`kubai-icons-react\` | React 18+ and Next.js, server rendering included |
| \`kubai-icons-vue\` | Vue 3 and Nuxt |
| \`kubai-icons\` | Any page: a framework-free API and the \`<kubai-icon>\` web component |
| \`kubai-icons-static\` | Standalone SVG files for \`<img>\`, design tools, native apps and CDNs |

## React

\`\`\`tsx
import { Folder, CalendarCheck } from "kubai-icons-react";

<Folder />                                   // 24px, follows the text color
<CalendarCheck size={32} color="#22C55E" variant="soft" badgeColor="semantic" />

<button data-kubai-trigger>                  {/* plays when the button is hovered */}
  <Folder size={18} trigger="parent" /> Open
</button>
\`\`\`

Props: \`size\`, \`color\`, \`variant\` (\`"color"\` or \`"soft"\`), \`badgeColor\` (any color or \`"semantic"\`), \`trigger\` (\`"hover"\`, \`"parent"\` or \`"none"\`), \`hover\`, \`active\` / \`defaultActive\` / \`onActiveChange\`, \`title\`, plus any SVG prop. \`DynamicIcon\` from \`kubai-icons-react/dynamic\` loads an icon by name.

## Vue

\`\`\`vue
<script setup>
import { Folder, BellOff } from "kubai-icons-vue";
</script>

<template>
  <Folder :size="28" color="#6366F1" />
  <BellOff variant="soft" title="Muted" />
</template>
\`\`\`

Props match React; \`active\` works with \`v-model:active\`. \`DynamicIcon\` from \`kubai-icons-vue/dynamic\` loads an icon by name.

## JavaScript and the web component

\`\`\`js
import { createIcon, Folder, MailPlus } from "kubai-icons";
document.body.append(createIcon(Folder, { size: 24 }), createIcon(MailPlus, { color: "#EC4899" }));
\`\`\`

With no build step:

\`\`\`html
<script type="module" src="https://cdn.jsdelivr.net/npm/kubai-icons@0/dist/cdn/element.js"></script>
<kubai-icon name="folder-plus" size="32" color="#6366F1"></kubai-icon>
\`\`\`

## Static SVG

\`\`\`html
<img src="https://cdn.jsdelivr.net/npm/kubai-icons-static@0/svg/folder.svg" width="28" height="28" alt="" />
\`\`\`

Each file includes a margin for the drop shadow, so a 28px image matches a live icon at 24px. For another color: \`${SITE}/api/icon/folder.svg?color=EC4899\`.

## Updating

New icons come out in new releases. Icons marked "since" a version need at least that version installed: \`npm install kubai-icons-react@latest\` (or the package you use).
`;
  const docs = `## Docs

- [Overview](${SITE}/docs/): install, versioning and updating
- [React](${SITE}/docs/react/)
- [Vue](${SITE}/docs/vue/)
- [JavaScript and web component](${SITE}/docs/javascript/)
- [Static SVG](${SITE}/docs/static/)
- [Customize](${SITE}/docs/customize/): color, variants, badges and triggers
- [Accessibility](${SITE}/docs/accessibility/)
- [Performance](${SITE}/docs/performance/)
- [Design](${SITE}/docs/design/): how an icon is drawn
- [Agent skill](${SITE}/skill/): draw new icons in the same style with a coding agent

## Icons

- [Every icon name, by category](${SITE}/llms-full.txt): plain text, with usage
- [Browse and search](${SITE}/icons/): one page per icon at ${SITE}/icons/<name>/
`;
  write(path.join(pub, 'llms.txt'), `${intro}\n${docs}`);
  const list = categories.filter((c) => bases.some((ic) => ic.category === c.id)).map((c) => {
    const rows = bases.filter((ic) => ic.category === c.id).map((ic) => {
      const extra = badged.get(ic.name);
      const tags = (ic.tags || []).filter((t) => !HAN.test(t) && t !== ic.name).slice(0, 6);
      const when = since.get(ic.name);
      return `- ${ic.name}${ic.zh ? ` (${ic.zh})` : ''}${tags.length ? `: ${tags.join(', ')}` : ''}${extra ? `. Also -${extra.join(', -')}` : ''}${when && added.length > 1 && when !== added[0] ? `. Since ${when}` : ''}`;
    });
    return `### ${c.en} (${c.id})\n\n${rows.join('\n')}`;
  });
  write(path.join(pub, 'llms-full.txt'), `${intro}\n${usage}\n${docs}\n## Icon list\n\nEach line is a base icon name, its Chinese name and a few search words. "Also -plus, -check" means \`<name>-plus\` and \`<name>-check\` exist too. "Since" marks icons added after the first release.\n\n${list.join('\n\n')}\n`);
  // The social card rides along as a static file.
  fs.mkdirSync(path.join(pub, 'assets'), { recursive: true });
  fs.cpSync(path.join(root, 'assets', 'og.png'), path.join(pub, 'assets', 'og.png'));
  console.log(`site data → site/public/data, site/src/generated`);
}
for (const p of ['core', 'react', 'vue', 'static']) fs.cpSync(path.join(root, 'LICENSE-ICONS'), path.join(root, 'packages', p, 'LICENSE'));
console.log(`Done in ${((Date.now() - t0) / 1000).toFixed(1)}s, version ${version}`);
