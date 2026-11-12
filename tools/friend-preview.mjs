#!/usr/bin/env node
// Saves a friend's preview image for the links page:
//   site/public/friends/<slug>.webp   1200×630
//
//   node tools/friend-preview.mjs <slug> <url> [--shot]
//
// Uses the page's og:image when it is wide (1.5:1 or wider), so the site's own share card
// shows. Otherwise, or with --shot, it screenshots the page in headless Chrome. Needs
// network access, and Chrome (CHROME overrides the path) for a screenshot.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { findChrome } from './chrome.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [slug, url] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const forceShot = process.argv.includes('--shot');
if (!slug || !url || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: node tools/friend-preview.mjs <slug> <url> [--shot]   (slug: lowercase letters, digits, hyphens)');
  process.exit(1);
}
const W = 1200;
const H = 630;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';

async function ogImage() {
  const res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow' });
  if (!res.ok) return null;
  const html = await res.text();
  const tag = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*>/i)?.[0];
  const src = tag?.match(/content=["']([^"']+)["']/i)?.[1];
  if (!src) return null;
  const img = await fetch(new URL(src.replace(/&amp;/g, '&'), res.url), { headers: { 'user-agent': UA } });
  if (!img.ok) return null;
  const buf = Buffer.from(await img.arrayBuffer());
  const { width, height } = await sharp(buf).metadata();
  return width && height && width / height >= 1.5 ? buf : null;
}

function shot() {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'kubai-friend-'));
  try {
    const file = path.join(work, 'shot.png');
    execFileSync(findChrome(), ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${path.join(work, 'profile')}`,
      '--force-device-scale-factor=1', `--window-size=${W},${H}`, `--user-agent=${UA}`,
      `--screenshot=${file}`, '--virtual-time-budget=8000', url],
    { stdio: 'ignore', timeout: 120000 });
    return fs.readFileSync(file);
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
}

const og = forceShot ? null : await ogImage();
const source = og ?? shot();
const out = path.join(root, 'site/public/friends', `${slug}.webp`);
fs.mkdirSync(path.dirname(out), { recursive: true });
await sharp(source).resize(W, H, { fit: 'cover', position: 'top' }).webp({ quality: 80 }).toFile(out);
console.log(`${path.relative(root, out)}  (${og ? 'og:image' : 'screenshot'}, ${Math.round(fs.statSync(out).size / 1024)} KB)`);
