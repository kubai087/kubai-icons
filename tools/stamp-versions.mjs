#!/usr/bin/env node
// Records the icons a release adds. Runs after `changeset version` has raised the package
// version: every base icon not yet listed in icons/versions.json is listed under the new
// version, so the site can mark it as new and say which version it needs.
//
//   node tools/stamp-versions.mjs
import fs from 'node:fs';
import path from 'node:path';
import { loadIcons, releases, root, sinceMap } from './registry.mjs';

const version = JSON.parse(fs.readFileSync(path.join(root, 'packages/core/package.json'), 'utf8')).version;
const since = sinceMap();
const { bases } = await loadIcons({ composites: false });
const added = bases.map((ic) => ic.name).filter((n) => !since.has(n));
if (!added.length) {
  console.log('No new icons to record.');
} else {
  releases[version] = [...new Set([...(releases[version] || []), ...added])].sort();
  fs.writeFileSync(path.join(root, 'icons', 'versions.json'), JSON.stringify(releases, null, 2) + '\n');
  console.log(`Recorded ${added.length} icons as added in ${version}: ${added.join(', ')}`);
}
