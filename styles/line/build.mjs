#!/usr/bin/env node
// Builds index.html: the gallery page with its script bundled in, so it opens from disk.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
// --out dir: only the motion filmstrip page, into that folder (for checks run side by side)
const args = process.argv.slice(2), outArg = args.includes('--out') ? path.resolve(args[args.indexOf('--out') + 1]) : null;
const outDir = outArg ?? path.join(here, 'check-out');
fs.mkdirSync(outDir, { recursive: true });
if (outArg) {
  const fr = await build({ entryPoints: [path.join(here, 'frames.mjs')], bundle: true, format: 'iife', write: false, target: 'es2020' });
  fs.writeFileSync(path.join(outDir, 'frames.html'), fs.readFileSync(path.join(here, 'frames.html'), 'utf8').replace('/*JS*/', () => fr.outputFiles[0].text.replace(/<\/script/g, '<\\/script')));
  process.exit(0);
}
const { outputFiles } = await build({ entryPoints: [path.join(here, 'page.mjs')], bundle: true, format: 'iife', minify: true, write: false, target: 'es2020' });
const js = outputFiles[0].text.replace(/<\/script/g, '<\\/script');
const css = fs.readFileSync(path.join(here, 'page.css'), 'utf8');
const body = fs.readFileSync(path.join(here, 'page.html'), 'utf8');
fs.writeFileSync(path.join(here, 'index.html'), body.replace('/*CSS*/', () => css).replace('/*JS*/', () => js));
const fr = await build({ entryPoints: [path.join(here, 'frames.mjs')], bundle: true, format: 'iife', write: false, target: 'es2020' });
fs.writeFileSync(path.join(here, 'check-out', 'frames.html'), fs.readFileSync(path.join(here, 'frames.html'), 'utf8').replace('/*JS*/', () => fr.outputFiles[0].text.replace(/<\/script/g, '<\\/script')));
// The same page for publishing as an Artifact: the host supplies the document skeleton.
const inner = body.slice(body.indexOf('<body>') + 6, body.indexOf('</body>'));
fs.writeFileSync(path.join(here, 'check-out', 'artifact.html'), `<title>Kubai 线性图标</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>${css}</style>
${inner.replace('/*JS*/', () => js)}`);
console.log(`index.html ${(fs.statSync(path.join(here, 'index.html')).size / 1024).toFixed(0)} KB`);
