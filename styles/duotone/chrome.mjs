// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Headless Chrome for the two-tone style's scripts: screenshots and reading values a page
// computes. A temporary profile, no visible window. CHROME overrides the browser path.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function findChrome() {
  const found = process.env.CHROME || [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    ...['PROGRAMFILES', 'PROGRAMFILES(X86)', 'LOCALAPPDATA'].filter((v) => process.env[v])
      .map((v) => path.join(process.env[v], 'Google', 'Chrome', 'Application', 'chrome.exe'))
  ].find((p) => fs.existsSync(p));
  if (!found) throw new Error('Chrome not found. Set CHROME to the browser binary.');
  return found;
}

function withPage(html, run) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'kubai-duotone-'));
  try {
    const page = path.join(work, 'page.html');
    fs.writeFileSync(page, html);
    return run(page, path.join(work, 'profile'));
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
}

/** Renders an HTML string to a PNG of the given CSS size. */
export function screenshot(html, file, { width, height, scale = 1 }) {
  withPage(html, (page, profile) => execFileSync(findChrome(), ['--headless=new', '--disable-gpu', '--hide-scrollbars',
    `--user-data-dir=${profile}`, `--force-device-scale-factor=${scale}`, `--window-size=${Math.ceil(width)},${Math.ceil(height)}`,
    `--screenshot=${path.resolve(file)}`, '--virtual-time-budget=2000', 'file://' + page], { stdio: 'ignore', timeout: 120000 }));
}

/** Loads a page whose script writes JSON into <pre id="out">, and returns that JSON. */
export function evaluate(html) {
  return withPage(html, (page, profile) => {
    const dom = execFileSync(findChrome(), ['--headless=new', '--disable-gpu', `--user-data-dir=${profile}`,
      // A full set of several hundred icons writes a page of many megabytes, and takes longer to measure.
      '--virtual-time-budget=30000', '--dump-dom', 'file://' + page], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 600000, maxBuffer: 512 * 1024 * 1024 });
    const m = dom.match(/<pre id="out">([\s\S]*?)<\/pre>/);
    if (!m) throw new Error('The measuring page wrote no result.');
    return JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
  });
}
