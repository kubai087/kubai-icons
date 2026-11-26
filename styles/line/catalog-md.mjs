#!/usr/bin/env node
// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Writes CATALOG.md, the readable list of the icons, from catalog.mjs and what is drawn.
//   node catalog-md.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATALOG, CATEGORY_ZH } from './catalog.mjs';
import { ICONS } from './icons.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const drawn = (e) => Boolean(ICONS[e.name]);
const byCat = {};
for (const e of CATALOG) (byCat[e.category] = byCat[e.category] || []).push(e);
let md = `# ${CATALOG.length} 个图标清单\n\n语义取自 Kubai Icons 已有的图标（名称、中文名、分类），以及 Lucide、Hugeicons 和 SF Symbols 中常用的功能图标，并对照 SF Symbols 中含义相同的符号（只作理解语义的参考，不照搬外形）。✓ 表示已经画好。\n\n`;
md += '| 分类 | 数量 | 已画 |\n| --- | --- | --- |\n';
md += Object.entries(byCat).map(([c, l]) => `| ${CATEGORY_ZH[c]} | ${l.length} | ${l.filter(drawn).length} |`).join('\n');
md += `\n| **合计** | **${CATALOG.length}** | **${CATALOG.filter(drawn).length}** |\n`;
for (const [c, l] of Object.entries(byCat)) {
  md += `\n## ${CATEGORY_ZH[c]}（${l.length}）\n\n| 名称 | 中文 | SF Symbols | 已画 |\n| --- | --- | --- | --- |\n`;
  md += l.map((e) => `| ${e.name} | ${ICONS[e.name]?.label ?? e.zh} | ${e.sf ? '`' + e.sf + '`' : '—'} | ${drawn(e) ? '✓' : ''} |`).join('\n') + '\n';
}
fs.writeFileSync(path.join(here, 'CATALOG.md'), md);
console.log(`CATALOG.md: ${CATALOG.filter(drawn).length} of ${CATALOG.length} drawn`);
