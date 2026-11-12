#!/usr/bin/env node
// Saves friends' preview images for the links page:
//   site/public/friends/<slug>.webp   1200×630
//
//   node tools/friend-preview.mjs <slug> <url> [--shot]       one friend
//   node tools/friend-preview.mjs --all [--og-only] [--live <site>]
//                                                             every friend in site/src/lib/friends.json
//
// Uses the page's og:image when it is wide (1.5:1 or wider), so the site's own share card
// shows. Otherwise, or with --shot, it screenshots the page in headless Chrome (CHROME
// overrides the path).
//
// --all never fails a deploy: a friend whose site cannot be read keeps the image it has.
// A friend marked "ownImage" keeps the image in the repository and is never refreshed.
// --og-only skips screenshots, which differ a little every time; friends without a wide
// share image then keep the image live on --live, or the one in the repository.
// --live <site> also compares each fresh share image with the one that site serves now, and
// writes changed=true|false to $GITHUB_OUTPUT, so a scheduled check redeploys only when a
// friend's image has changed.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { findChrome } from './chrome.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'site/public/friends');
const W = 1200;
const H = 630;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const TIMEOUT = 20000;

const get = (url) => fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT) });

/** The page's share image when it is wide enough to fill a card, or null. */
async function ogImage(url) {
  const res = await get(url);
  if (!res.ok) return null;
  const html = await res.text();
  const tag = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*>/i)?.[0];
  const src = tag?.match(/content=["']([^"']+)["']/i)?.[1];
  if (!src) return null;
  const img = await get(new URL(src.replace(/&amp;/g, '&'), res.url));
  if (!img.ok) return null;
  const buf = Buffer.from(await img.arrayBuffer());
  const { width, height } = await sharp(buf).metadata();
  return width && height && width / height >= 1.5 ? buf : null;
}

function shot(url) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'kubai-friend-'));
  try {
    const file = path.join(work, 'shot.png');
    // CI runners on Ubuntu 24.04 block the sandbox's user namespaces; the deploy job checks
    // out without stored credentials and holds no secrets while this runs.
    const sandbox = process.env.CI ? ['--no-sandbox'] : [];
    execFileSync(findChrome(), ['--headless=new', '--disable-gpu', '--hide-scrollbars', ...sandbox, `--user-data-dir=${path.join(work, 'profile')}`,
      '--force-device-scale-factor=1', `--window-size=${W},${H}`, `--user-agent=${UA}`,
      `--screenshot=${file}`, '--virtual-time-budget=8000', url],
    { stdio: 'ignore', timeout: 120000 });
    return fs.readFileSync(file);
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
}

const encode = (source) => sharp(source).resize(W, H, { fit: 'cover', position: 'top' }).webp({ quality: 80 }).toBuffer();
const kb = (buf) => `${Math.round(buf.length / 1024)} KB`;

/** The image a site serves now for this friend, or null. */
async function liveImage(site, slug) {
  try {
    const res = await get(`${site.replace(/\/$/, '')}/friends/${slug}.webp`);
    return res.ok ? Buffer.from(await res.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

const args = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });

if (!args.includes('--all')) {
  const [slug, url] = args.filter((a) => !a.startsWith('--'));
  if (!slug || !url || !/^[a-z0-9-]+$/.test(slug)) {
    console.error('Usage: node tools/friend-preview.mjs <slug> <url> [--shot]   (slug: lowercase letters, digits, hyphens)\n       node tools/friend-preview.mjs --all [--og-only] [--live <site>]');
    process.exit(1);
  }
  const og = args.includes('--shot') ? null : await ogImage(url);
  const out = await encode(og ?? shot(url));
  fs.writeFileSync(path.join(outDir, `${slug}.webp`), out);
  console.log(`site/public/friends/${slug}.webp  (${og ? 'og:image' : 'screenshot'}, ${kb(out)})`);
  process.exit(0);
}

const ogOnly = args.includes('--og-only');
const liveAt = args.includes('--live') ? args[args.indexOf('--live') + 1] : null;
const friends = JSON.parse(fs.readFileSync(path.join(root, 'site/src/lib/friends.json'), 'utf8'));
const changed = [];

for (const f of friends) {
  const file = path.join(outDir, `${f.slug}.webp`);
  if (f.ownImage) {
    console.log(`${f.slug}: kept its own image`);
    continue;
  }
  const url = f.preview ?? f.site;
  let out = null;
  let how = '';
  try {
    const og = await ogImage(url);
    if (og) [out, how] = [await encode(og), 'og:image'];
  } catch (error) {
    console.warn(`${f.slug}: could not read ${url} (${error.message})`);
  }
  if (!out && !ogOnly) {
    try {
      [out, how] = [await encode(shot(url)), 'screenshot'];
    } catch (error) {
      console.warn(`${f.slug}: screenshot failed (${error.message})`);
    }
  }
  const live = liveAt ? await liveImage(liveAt, f.slug) : null;
  if (out) {
    fs.writeFileSync(file, out);
    if (liveAt && how === 'og:image' && !(live && live.equals(out))) changed.push(f.slug);
  } else if (live) {
    fs.writeFileSync(file, live);
    how = 'kept the live image';
  } else {
    how = fs.existsSync(file) ? 'kept the image in the repository' : 'no image';
  }
  console.log(`${f.slug}: ${how}${out ? `, ${kb(out)}` : ''}`);
}

if (liveAt) {
  console.log(changed.length ? `Changed since the last deploy: ${changed.join(', ')}` : 'No share image changed since the last deploy.');
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed.length > 0}\n`);
}
