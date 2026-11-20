#!/usr/bin/env node
// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Packs the skill for release, from a committed revision so stray local edits never ship:
//   dist/kubai-icons-v<version>.zip           the standard skill (Claude Code, claude.ai)
//   dist/kubai-icons-v<version>-platform.zip  the same skill for marketplaces that read the
//                                             metadata fields at the top of the frontmatter
//   dist/kubai-duotone-v<version>.zip         the two-tone style on its own (styles/duotone/
//   dist/kubai-duotone-v<version>-platform.zip  with the LICENSE), versioned by its own SKILL.md
//
//   node scripts/pack.mjs [--ref HEAD] [--out dist]
//
// Each version comes from metadata.version in that skill's SKILL.md. Needs git, tar and zip.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : fallback; };
const ref = opt('--ref', 'HEAD');
const out = path.resolve(opt('--out', path.join(root, 'dist')));

// What the skill needs at run time; the README media, history and repository tooling stay out.
const FILES = ['SKILL.md', 'PROMPT.md', 'LICENSE', 'README.md', 'index.html', 'src', 'scripts/check.mjs', 'scripts/measure.js', 'scripts/export.mjs', 'styles'];

const git = (...a) => execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

// Packs one skill: dir is its folder in the repository ('' for the root), files what goes in,
// extra files from elsewhere in the repository (path in the zip -> path in the repository).
function pack(name, dir, files, extra = {}) {
  const at = (f) => (dir ? `${dir}/${f}` : f);
  const skill = git('show', `${ref}:${at('SKILL.md')}`);
  const front = skill.match(/^---\n([\s\S]*?)\n---\n/);
  if (!front) throw new Error(`${at('SKILL.md')} has no frontmatter.`);
  const meta = front[1].match(/^metadata:\n((?: {2}.*\n?)+)/m);
  if (!meta) throw new Error(`${at('SKILL.md')} has no metadata block.`);
  const version = meta[1].match(/^ {2}version: "?([^"\n]+)"?$/m)?.[1];
  if (!version) throw new Error(`${at('SKILL.md')} has no metadata.version.`);

  const work = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-pack-`));
  try {
    fs.mkdirSync(out, { recursive: true });
    const base = `${name}-v${version}`;
    const standard = path.join(out, `${base}.zip`);
    const platform = path.join(out, `${base}-platform.zip`);
    fs.rmSync(standard, { force: true });
    fs.rmSync(platform, { force: true });
    // The skill's files from the committed tree, its folder becoming the zip's top folder.
    const tar = path.join(work, 'skill.tar');
    git('archive', '--format=tar', `--prefix=${name}/`, '-o', tar, dir ? `${ref}:${dir}` : ref, ...files);
    execFileSync('tar', ['-xf', tar, '-C', work]);
    fs.rmSync(tar);
    for (const [to, from] of Object.entries(extra)) fs.writeFileSync(path.join(work, name, to), git('show', `${ref}:${from}`));
    execFileSync('zip', ['-q', '-r', '-X', standard, name], { cwd: work });

    // The platform copy lifts every metadata field to the top level of the frontmatter.
    const lifted = meta[1].split('\n').filter(Boolean).map((line) => line.slice(2)).join('\n') + (meta[0].endsWith('\n') ? '\n' : '');
    fs.writeFileSync(path.join(work, name, 'SKILL.md'), skill.replace(front[0], `---\n${front[1].replace(meta[0], lifted)}\n---\n`));
    execFileSync('zip', ['-q', '-r', '-X', platform, name], { cwd: work });

    for (const file of [standard, platform]) console.log(`${path.relative(root, file)}: ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
}

pack('kubai-icons', '', FILES);
// The two-tone style as its own skill: the folder as it is in the repository, plus the license.
pack('kubai-duotone', 'styles/duotone', ['SKILL.md', 'GUIDE.md', 'CHANGELOG.md', 'kit.mjs', 'icons.mjs', 'motion.mjs', 'motions.mjs', 'check.mjs', 'export.mjs', 'chrome.mjs'], { LICENSE: 'LICENSE' });
