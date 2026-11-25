// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// development: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: code terminal database bug git-branch git-commit git-merge git-pull-request git-fork braces brackets function variable regex cube layers puzzle component workflow network
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

// Git graphs are one family: every node is a ring of outer radius NODE on a centre whose x is
// a whole number (6, 12 or 18), so the vertical lines through them sit on whole pixels; lines
// end on the ring's centre line, so they join it at every weight. Nodes and lines are one
// part: two lines that meet at a node join through it.
const NODE = 3.25;
const node = (g, x, y, name, o = {}) => shell(g.ring(x, y, NODE), { n: name, role: P, part: 'graph', ...o });
const rim = (g) => NODE - g.h; // the ring's centre line

// Regular hexagon by its flat sides (outer edge at distance a from the centre); flat: true puts
// the flats at top and bottom, otherwise at left and right.
function hexPts(g, a, flat) {
  const rc = (a - g.h) / Math.cos(Math.PI / 6), pts = [];
  for (let i = 0; i < 6; i++) { const t = ((i * 60 + (flat ? 0 : 30)) * Math.PI) / 180; pts.push([12 + rc * Math.cos(t), 12 + rc * Math.sin(t)]); }
  return pts;
}

export default {
  code: {
    label: '代码', key: 'landscape', fit: 'x',
    light: [],
    plan: '主体：左右两个尖括号和中间的斜杠（一组字形，一个整体）',
    weights: { [P]: 1 },
    draw(g) {
      return [
        line(g.pl([[7.5, 7], [3, 12], [7.5, 17]]), { n: 'left', role: P }),
        line(g.seg(13, 4, 11, 20), { n: 'slash', role: P }),
        line(g.pl([[16.5, 7], [21, 12], [16.5, 17]]), { n: 'right', role: P })
      ];
    },
    // 写代码: the marks are written one after another
    fx: { t: 'draw', on: ['left', 'slash', 'right'], stagger: 120 }
  },
  terminal: {
    label: '终端', key: 'landscape',
    plan: '主体：窗口；细节：提示符（尖括号）和光标（短横线）',
    weights: { [P]: 0.76, [D]: 0.24 },
    draw(g, ctx) {
      // filled, the prompt's tip and the cursor keep a stroke of ink between them: at heavy
      // weights they move apart by e each
      const e = ctx?.variant === 'fill' ? Math.max(0, (Math.sqrt(Math.max(0, 4 * g.s * g.s - 9)) - 2.5) / 2) : 0;
      return [
        shell(g.box(2, 4, 20, 16, 4), { n: 'window', role: P }),
        line(g.pl([[7 - e, 9], [10 - e, 12], [7 - e, 15]]), { n: 'prompt', role: D, on: 'window' }),
        line(g.seg(12.5 + e, 15, 16.5 + e, 15), { n: 'cursor', role: D, on: 'window' })
      ];
    },
    // 等待输入: the cursor blinks
    fx: { t: 'keys', on: ['cursor'], a: [0, 1, 0, 1], ms: 720 }
  },
  database: {
    label: '数据库', key: 'portrait',
    plan: '主体：圆柱（上下两个半椭圆和两条侧边）；细节：顶面的前沿和中间一道分层弧线。两道弧和柱身一样宽，细节约占四成',
    weights: { [P]: 0.56, [D]: 0.44 },
    draw(g, ctx) {
      const { h } = g, x0 = 4 + h, x1 = 20 - h, rx = (x1 - x0) / 2, ry = 3, top = 2 + h + ry, bot = 22 - h - ry, mid = 12;
      let half = (y) => `M${n(x0)} ${n(y)}A${n(rx)} ${ry} 0 0 0 ${n(x1)} ${n(y)}`;
      if (ctx?.variant === 'fill') {
        // filled, an arc stops where a stroke of ink stays between its round end and the
        // can's edge (the ends of an ellipse arc are not moved by ends: 'in')
        const edge = [];
        for (let k = 0; k <= 48; k++) { const a = Math.PI + (Math.PI * k) / 48; edge.push([12 + rx * Math.cos(a), top + ry * Math.sin(a)], [12 - rx * Math.cos(a), bot - ry * Math.sin(a)]); }
        for (let y = top; y <= bot; y += 0.25) edge.push([x0, y], [x1, y]);
        const at = (y, a) => [12 - rx * Math.cos(a), y + ry * Math.sin(a)];
        const clear = (p) => Math.min(...edge.map(([ex, ey]) => Math.hypot(ex - p[0], ey - p[1]))) >= g.s - 1e-3;
        half = (y) => {
          let a = 0; while (a < Math.PI / 2 && !clear(at(y, a))) a += 0.005;
          const p = at(y, a), q = at(y, Math.PI - a);
          return `M${n(p[0])} ${n(p[1])}A${n(rx)} ${ry} 0 0 0 ${n(q[0])} ${n(q[1])}`;
        };
      }
      return [
        shell(`M${n(x0)} ${n(top)}A${n(rx)} ${ry} 0 0 1 ${n(x1)} ${n(top)}V${n(bot)}A${n(rx)} ${ry} 0 0 1 ${n(x0)} ${n(bot)}Z`, { n: 'can', role: P }),
        line(half(top), { n: 'r1', role: D, on: 'can' }),
        line(half(mid), { n: 'r2', role: D, on: 'can' })
      ];
    },
    // 写入: the layers are drawn on, top to bottom
    fx: { t: 'draw', on: ['r1', 'r2'], stagger: 140 }
  },
  bug: {
    nudge: [0, -0.5],
    label: '缺陷', key: 'square',
    ends: 'in',
    plan: '主体：虫身（圆头长条）；辅助：头（半圆）和三对腿（接在虫身上，中间一对平伸，前后两对斜伸，六条线墨量约占一半）；细节：背上的中缝（从头下方开始）。下方的腿偏重，整体上移 0.5',
    weights: { [P]: 0.36, [S]: 0.48, [D]: 0.16 },
    draw(g) {
      const { h } = g, x0 = 7, x1 = 17, y0 = 7.5, y1 = 20.5, R = (x1 - x0) / 2;
      const edge = (y) => { const cy = y < y0 + R ? y0 + R : y > y1 - R ? y1 - R : y; return 12 - R + (R - Math.sqrt(Math.max(R * R - (y - cy) ** 2, 0))); };
      const L = (y0p, x1, y1p) => { const x0p = edge(y0p) + 0.2; return g.seg(x0p, y0p, x1, y1p) + g.seg(24 - x0p, y0p, 24 - x1, y1p); };
      const legs = L(12, 4, 9.6) + g.span(3, 14, edge(14) + g.s, 14) + g.span(24 - edge(14) - g.s, 14, 21, 14) + L(18.1, 4, 20.5 - h);
      return [
        line(arch(9 + h, 15 - h, 2.5 + h, y0 + h), { n: 'head', role: S }),
        line(legs, { n: 'legs', role: S }),
        shell(g.box(x0, y0, x1 - x0, y1 - y0, R), { n: 'body', role: P }),
        line(g.seg(12, y0 + 4.5 + (g.s - 2) * 0.6, 12, y1 - h), { n: 'seam', role: D, on: 'body' })
      ];
    },
    // 爬: the bug sways as it walks
    fx: { t: 'wiggle', on: 'all', o: [12, 14], deg: 8, hz: 3.4 }
  },
  'git-branch': {
    nudge: [0, 0.5],
    label: '分支', key: 'square',
    plan: '主体：两个节点（圆环，和其余 git 图标同样大）；辅助：主线（竖线）和从主线分出去的弧线。节点是圆环，墨量和连线相当；上方偏重，整体下移 0.5',
    weights: { [P]: 0.53, [S]: 0.47 },
    draw(g) {
      const r = rim(g), c = 6 + r, R = 18 - c, y = 0.5;
      return [
        line(g.seg(6, 3 + g.h + y, 6, 18 - r + y), { n: 'main', role: S, part: 'graph' }),
        line(g.arc(c, c + y, R, 90, 0), { n: 'branch', role: S, part: 'graph' }),
        node(g, 18, 6 + y, 'n1'),
        node(g, 6, 18 + y, 'n2')
      ];
    },
    // 分支: the branch grows out of the main line to its node
    fx: [{ t: 'draw', on: ['branch'] }, { t: 'keys', on: ['n1'], o: [18, 6.5], s: [0.6, 1.1], ms: 320 }]
  },
  'git-commit': {
    label: '提交', key: 'landscape', fit: 'x',
    plan: '主体：节点（圆环）；辅助：穿过节点的一条横线',
    weights: { [P]: 0.52, [S]: 0.48 },
    draw(g) {
      const r = rim(g);
      return [
        line(g.seg(2 + g.h, 12, 12 - r, 12) + g.seg(12 + r, 12, 22 - g.h, 12), { n: 'line', role: S, part: 'graph' }),
        node(g, 12, 12, 'node')
      ];
    },
    // 提交: the node is set down on the line with a pop
    fx: { t: 'keys', on: ['node'], o: [12, 12], s: [0.6, 1.12], ms: 320 }
  },
  'git-merge': {
    nudge: [1, 0],
    label: '合并分支', key: 'square',
    plan: '主体：三个节点（圆环）；辅助：左边的主线，和从右边节点汇入上方节点的弧线。左边一列偏重，整体右移 1。三个节点的墨量约占四分之三',
    weights: { [P]: 0.75, [S]: 0.25 },
    draw(g) {
      const r = rim(g), R = 12 - 6 - r, x = 1;
      return [
        line(g.seg(6 + x, 6 + r, 6 + x, 18 - r), { n: 'main', role: S, part: 'graph' }),
        line(`M${n(18 + x - r)} 12H${n(6 + x + R)}` + g.arc(6 + x + R, 6 + r, R, 90, 180).replace('M', 'L'), { n: 'merge', role: S, part: 'graph' }),
        node(g, 6 + x, 6, 'n1'),
        node(g, 6 + x, 18, 'n2'),
        node(g, 18 + x, 12, 'n3')
      ];
    },
    // 合并: the branch is drawn from its node into the main line
    fx: { t: 'draw', on: ['merge'] }
  },
  'git-pull-request': {
    label: '合并请求', key: 'square',
    plan: '主体：三个节点（圆环，墨量约占七成）；辅助：左边的主线，右边从节点向上再折向左边的请求线',
    weights: { [P]: 0.69, [S]: 0.31 },
    draw(g) {
      const r = rim(g), c = 3;
      return [
        line(g.seg(6, 6 + r, 6, 18 - r), { n: 'main', role: S, part: 'graph' }),
        line(`M18 ${n(18 - r)}V${6 + c}A${c} ${c} 0 0 0 ${18 - c} 6H13`, { n: 'req', role: S, part: 'graph' }),
        node(g, 6, 6, 'n1'),
        node(g, 6, 18, 'n2'),
        node(g, 18, 18, 'n3')
      ];
    },
    // 发起请求: the request line is drawn from its node toward the main line
    fx: { t: 'draw', on: ['req'] }
  },
  'git-fork': {
    nudge: [0, 1],
    label: '派生', key: 'square',
    plan: '主体：三个节点（圆环）；辅助：从下面的节点分成两路的线。上面两个节点偏重，整体下移 1。三个节点的墨量约占七成',
    weights: { [P]: 0.72, [S]: 0.28 },
    draw(g) {
      const r = rim(g), c = 3, y0 = 1, y = 12 + y0;
      return [
        line(g.seg(12, 18 + y0 - r, 12, y), { n: 'stem', role: S, part: 'graph' }),
        line(`M6 ${n(6 + y0 + r)}V${y - c}A${c} ${c} 0 0 0 ${6 + c} ${y}H${18 - c}A${c} ${c} 0 0 0 18 ${y - c}V${n(6 + y0 + r)}`, { n: 'fork', role: S, part: 'graph' }),
        node(g, 6, 6 + y0, 'n1'),
        node(g, 18, 6 + y0, 'n2'),
        node(g, 12, 18 + y0, 'n3')
      ];
    },
    // 派生: the stem grows up from the source and splits into two
    fx: { t: 'draw', on: ['stem', 'fork'], stagger: 200 }
  },
  braces: {
    label: '花括号', key: 'square',
    light: [],
    plan: '主体：一对花括号（直线和圆弧，中间是尖）',
    weights: { [P]: 1 },
    draw(g) {
      const brace = (k) => { const x = (v) => n(12 + k * (v - 12)), sw = k < 0 ? 1 : 0; return `M${x(10)} 4H${x(9)}A2 2 0 0 ${sw} ${x(7)} 6V9A3 3 0 0 ${1 - sw} ${x(4)} 12A3 3 0 0 ${1 - sw} ${x(7)} 15V18A2 2 0 0 ${sw} ${x(9)} 20H${x(10)}`; };
      return [line(brace(1), { n: 'left', role: P }), line(brace(-1), { n: 'right', role: P })];
    },
    // 展开: the braces open out and close again
    fx: [{ t: 'keys', on: ['left'], x: [-1.2, 0.2], ms: 300 }, { t: 'keys', on: ['right'], x: [1.2, -0.2], ms: 300 }]
  },
  brackets: {
    label: '方括号', key: 'square',
    light: [],
    plan: '主体：一对方括号（圆角和花括号的上下角一致）',
    weights: { [P]: 1 },
    draw(g) {
      const bracket = (k) => { const x = (v) => n(12 + k * (v - 12)), sw = k < 0 ? 1 : 0; return `M${x(8.5)} 4H${x(6)}A2 2 0 0 ${sw} ${x(4)} 6V18A2 2 0 0 ${sw} ${x(6)} 20H${x(8.5)}`; };
      return [line(bracket(1), { n: 'left', role: P }), line(bracket(-1), { n: 'right', role: P })];
    },
    // 展开: the brackets open out and close again
    fx: [{ t: 'keys', on: ['left'], x: [-1, 0.2], ms: 300 }, { t: 'keys', on: ['right'], x: [1, -0.2], ms: 300 }]
  },
  function: {
    anchor: 'base',
    label: '函数', key: 'square',
    light: [], // one word, fx: no letter changes tone
    plan: '主体：字母 f（竖、顶部圆弧和横）；辅助：右下的字母 x，合起来是 fx。两个字母立在同一条基线上，按底边定位',
    weights: { [P]: 0.6, [S]: 0.4 },
    draw(g) {
      return [
        line(`M7 20V7A3 3 0 0 1 10 4H12`, { n: 'f', role: P }),
        line(g.span(3, 11, 11, 11), { n: 'bar', role: P }),
        line(g.seg(14, 14, 20, 20) + g.seg(20, 14, 14, 20), { n: 'x', role: S })
      ];
    },
    // 求值: the x is written after the f
    fx: { t: 'draw', on: ['f', 'bar', 'x'], stagger: 120 }
  },
  variable: {
    label: '变量', key: 'square',
    light: ['x'], // the x is the symbol inside the brackets
    plan: '主体：中间的字母 x；辅助：两侧的圆括号（圆弧）',
    weights: { [P]: 0.36, [S]: 0.64 },
    draw(g) {
      const R = 10, a = (Math.atan2(8, 6) * 180) / Math.PI;
      return [
        line(g.arc(14, 12, R, 180 - a, 180 + a), { n: 'lp', role: S }),
        line(g.arc(10, 12, R, -a, a), { n: 'rp', role: S }),
        line(g.seg(9, 9, 15, 15) + g.seg(15, 9, 9, 15), { n: 'x', role: P })
      ];
    },
    // 赋值: the x turns a quarter turn, landing on itself
    fx: { t: 'rotate', on: ['x'], deg: 90, o: [12, 12] }
  },
  regex: {
    nudge: [-1, 1],
    label: '正则表达式', key: 'square',
    light: [], // one expression, .*: no mark changes tone
    plan: '主体：星号（三条线交于一点）；辅助：左下的句点（实心圆），合起来是 .*。星号在右上偏重，整体向左下移 1',
    weights: { [P]: 0.74, [S]: 0.26 },
    draw(g) {
      const cx = 15, cy = 9.5, L = 5.5 - g.h, k = Math.cos(Math.PI / 6);
      return [
        line(g.seg(cx, cy - L, cx, cy + L) + g.seg(cx - L * k, cy - L / 2, cx + L * k, cy + L / 2) + g.seg(cx - L * k, cy + L / 2, cx + L * k, cy - L / 2), { n: 'star', role: P }),
        solid(g.dot(4.5, 19.5, 1.5), { n: 'dot', role: S })
      ];
    },
    // 匹配: the asterisk turns a sixth of a turn, landing on itself
    fx: { t: 'rotate', on: ['star'], deg: 60, o: [15, 9.5] }
  },
  cube: {
    label: '立方体', key: 'circle',
    plan: '主体：正六边形外轮廓；细节：中间的 Y 形三条棱（每条和边长一样长，约占四成）',
    weights: { [P]: 0.62, [D]: 0.38 },
    // filled, the edges stop a stroke short of the corners: cut through the round corners,
    // they would leave sharp tips of ink
    ends: 'in',
    draw(g, ctx) {
      const pts = hexPts(g, 9, false), c = [12, 12], cube = shell(g.polygon(pts, 1.5), { n: 'cube', role: P });
      const top = g.pl([pts[3], c, pts[5]]), front = g.seg(12, 12, pts[1][0], pts[1][1]);
      // filled, the front edge is its own line, so all three ends can be moved
      if (ctx?.variant === 'fill') return [cube, line(top, { n: 'edges', role: D, on: 'cube' }), line(front, { n: 'edges1', role: D, on: 'cube' })];
      return [cube, line(top + front, { n: 'edges', role: D, on: 'cube' })];
    },
    // 放下: the cube drops onto its bottom corner and settles
    fx: { t: 'bounce', on: 'all', o: [12, 21], amp: 1.2 },
    allow: { keyline: '正六边形按整像素放竖边，左右各缩进 1' }
  },
  layers: {
    label: '图层', key: 'square',
    plan: '主体：最上面的一层（扁菱形）；辅助：下面两层（只露出下沿的折线）',
    weights: { [P]: 0.5, [S]: 0.5 },
    draw(g) {
      const { h } = g, k = 0.42, hd = 4, w = hd / k, yc = 7.82, d = 4.1, xe = 4;
      const fold = (dy) => g.pl([[xe, yc + hd + dy - (12 - xe) * k], [12, yc + hd + dy], [24 - xe, yc + hd + dy - (12 - xe) * k]]);
      return [
        line(fold(2 * d), { n: 'l3', role: S }),
        line(fold(d), { n: 'l2', role: S }),
        shell(g.polygon([[12 - w, yc], [12, yc - hd], [12 + w, yc], [12, yc + hd]], [1.2, 1.5, 1.2, 1.5]), { n: 'top', role: P })
      ];
    },
    // 叠放: the layers spread apart and settle back
    fx: [{ t: 'keys', on: ['top'], y: [-1.6, 0.3], ms: 320 }, { t: 'keys', on: ['l2'], y: [-0.8, 0.15], ms: 320 }]
  },
  puzzle: {
    nudge: [1, -1],
    label: '拼图', key: 'square',
    plan: '主体：拼图块（方块，上边和右边各凸出一个圆，左边和下边各凹进一个圆，一个闭合形）。凸起在右上，整体向右上移 1',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, dx = 1, dy = -1, x0 = 3 + h + dx, x1 = 17 - h + dx, y0 = 7 + h + dy, y1 = 21 - h + dy, c = 2.5, r = 2.5, e = 1.5, hw = Math.sqrt(r * r - e * e);
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
      const d = `M${n(x0)} ${n(y0 + c)}A${c} ${c} 0 0 1 ${n(x0 + c)} ${n(y0)}H${n(mx - hw)}A${r} ${r} 0 1 1 ${n(mx + hw)} ${n(y0)}H${n(x1 - c)}A${c} ${c} 0 0 1 ${n(x1)} ${n(y0 + c)}`
        + `V${n(my - hw)}A${r} ${r} 0 1 1 ${n(x1)} ${n(my + hw)}V${n(y1 - c)}A${c} ${c} 0 0 1 ${n(x1 - c)} ${n(y1)}H${n(mx + hw)}A${r} ${r} 0 1 0 ${n(mx - hw)} ${n(y1)}`
        + `H${n(x0 + c)}A${c} ${c} 0 0 1 ${n(x0)} ${n(y1 - c)}V${n(my + hw)}A${r} ${r} 0 1 0 ${n(x0)} ${n(my - hw)}Z`;
      return [shell(d, { n: 'piece', role: P })];
    },
    // 拼上: the piece lifts out and snaps back into place
    fx: { t: 'keys', on: 'all', x: [1.2, -0.25], y: [-1.2, 0.25], ms: 300 }
  },
  component: {
    label: '组件', key: 'square',
    plan: '主体：四个菱形（转 45° 的圆角方块，排成一圈），一个整体',
    weights: { [P]: 1 },
    light: [],
    draw(g) {
      const { s } = g, o = 5.5, a = 3.1, side = 2 * a - s, c = 1.5 - g.h;
      return [[12, 12 - o], [12 + o, 12], [12, 12 + o], [12 - o, 12]].map(([x, y], i) => shell(g.rot(x, y, side, side, 45, c), { n: `d${i}`, role: P }));
    },
    // 实例: the four parts spread out and come back together
    fx: [{ t: 'keys', on: ['d0'], y: [-1], ms: 300 }, { t: 'keys', on: ['d1'], x: [1], ms: 300 }, { t: 'keys', on: ['d2'], y: [1], ms: 300 }, { t: 'keys', on: ['d3'], x: [-1], ms: 300 }]
  },
  workflow: {
    label: '工作流', key: 'square',
    plan: '主体：两个步骤（圆角方块，左上和右下）；辅助：连接两步的折线',
    weights: { [P]: 0.8, [S]: 0.2 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.box(3, 3, 8, 8, 2), { n: 'a', role: P, vc: 0 }),
        line(`M7 ${11 - h}V15A2 2 0 0 0 9 17H${13 + h}`, { n: 'link', role: S, vc: 1 }),
        shell(g.box(13, 13, 8, 8, 2), { n: 'b', role: P, vc: 2 })
      ];
    },
    // 流转: the steps light up in order along the link
    fx: { t: 'variable', on: ['a', 'link', 'b'], mode: 'cumulative', step: 180 }
  },
  network: {
    nudge: [0, -1],
    label: '网络', key: 'square',
    plan: '主体：三个节点（上面一个，下面两个，圆角方块）；辅助：把它们连起来的线。下面两个节点偏重，整体上移 1',
    weights: { [P]: 0.78, [S]: 0.22 },
    draw(g) {
      const { h } = g;
      return [
        line(`M12 ${8 - h}V11` + `M7 ${14 + h}V13A2 2 0 0 1 9 11H15A2 2 0 0 1 17 13V${14 + h}`, { n: 'links', role: S, vc: 1 }),
        shell(g.box(8, 2, 8, 6, 1.5), { n: 'top', role: P, vc: 0 }),
        shell(g.box(3, 14, 8, 6, 1.5), { n: 'left', role: P, vc: 2 }),
        shell(g.box(13, 14, 8, 6, 1.5), { n: 'right', role: P, vc: 2 })
      ];
    },
    // 连通: the signal runs from the top node down to the other two
    fx: { t: 'variable', on: ['top', 'links', ['left', 'right']], mode: 'cumulative', step: 180 }
  }
};
