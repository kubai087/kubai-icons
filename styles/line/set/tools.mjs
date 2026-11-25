// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// tools: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: hammer wrench screwdriver toolbox scissors ruler paintbrush palette paint-bucket pen-tool crop magnet flashlight wand pipette nut-bolt drill ladder
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';

// Long tools lie at 45°, working end at the bottom left, like pencil (icons.mjs): u runs along
// the tool from that end toward the top right, v across it (+v toward the bottom right).
// sh shifts the whole tool (the icon's nudge) for optical balance.
const diag = (h, sh = [0, 0]) => {
  const o = [1.7 + h * 0.8 + sh[0], 22.3 - h * 0.8 + sh[1]], k = Math.SQRT1_2;
  return ([u, v]) => [o[0] + (u + v) * k, o[1] + (v - u) * k];
};
// Points along an arc (clockwise from a0 to a1, degrees), for outlines that mix arcs and corners.
const arcPts = (cx, cy, r, a0, a1, steps = 16) => Array.from({ length: steps + 1 }, (_, i) => {
  const a = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
});
// A drop, tip up: a circle and the two lines tangent to it from the tip (centre lines).
function drop(g, cx, cy, R, tip) {
  const r = R - g.h, ty = tip + g.h * 1.3, b = Math.acos(r / (cy - ty));
  const Pt = (a) => `${n(cx + r * Math.cos(a))} ${n(cy + r * Math.sin(a))}`;
  return `M${n(cx)} ${n(ty)}L${Pt(-Math.PI / 2 - b)}A${n(r)} ${n(r)} 0 1 0 ${Pt(-Math.PI / 2 + b)}Z`;
}
// Four-point sparkle: tips rounded, the inner corners sharp.
function sparkle(g, cx, cy, R, k = 0.34) {
  const Rc = R - g.h * 1.6, pts = [];
  for (let i = 0; i < 8; i++) { const a = ((-90 + i * 45) * Math.PI) / 180, r = i % 2 ? Rc * k : Rc; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return g.polygon(pts, pts.map((_, i) => (i % 2 ? 0 : 0.8)));
}

export default {
  hammer: {
    nudge: [-0.6, 0.6],
    label: '锤子', key: 'live',
    plan: '主体：锤头（横在柄端的方块，斜放 45°，和编辑的笔同一个方向）；辅助：锤柄（一条线）。锤头重，整体向左下移 0.6',
    weights: { [P]: 0.66, [S]: 0.34 },
    light: [],
    draw(g) {
      const { h } = g, T = diag(h, [-0.6, 0.6]), U = 19, tw = 6.5, L = 12.5;
      const head = [[U - tw / 2 + h, -L / 2 + h], [U + tw / 2 - h, -L / 2 + h], [U + tw / 2 - h, L / 2 - h], [U - tw / 2 + h, L / 2 - h]].map(T);
      return [
        line(g.pl([[1.2, 0], [U - tw / 2 + h, 0]].map(T)), { n: 'handle', role: S }),
        shell(g.polygon(head, 1.25), { n: 'head', role: P })
      ];
    },
    // 敲击: the hammer is raised, then strikes past rest and settles
    fx: { t: 'keys', on: 'all', o: [4, 20], r: [-8, 5], ms: 360 }
  },
  wrench: {
    label: '扳手', key: 'live',
    plan: '主体：开口的扳手头（圆弧，开口朝右上）；辅助：扳手柄（圆头长条，和扳手头连成一体）',
    weights: { [P]: 0.5, [S]: 0.5 },
    light: [],
    draw(g, ctx) {
      const { h } = g, T = diag(h), Uc = 18.4, R = 6.5, r = R - h, w = 3, open = 52;
      const c = T([Uc, 0]), hw = w - h, ue = Uc - Math.sqrt(r * r - hw * hw);
      return [
        ctx?.variant === 'fill'
          ? shell(g.polygon([[1.5, -hw], [Uc - 2, -hw], [Uc - 2, hw], [1.5, hw]].map(T), [hw, 0, 0, hw]), { n: 'handle', role: S })
          : line(`M${g.pt(...T([ue, -hw]))}L${g.pt(...T([w, -hw]))}A${n(hw)} ${n(hw)} 0 0 0 ${g.pt(...T([w, hw]))}L${g.pt(...T([ue, hw]))}`, { n: 'handle', role: S }),
        line(g.arc(c[0], c[1], r, -45 + open, 315 - open), { n: 'head', role: P })
      ];
    },
    area: (g) => {
      const { h } = g, T = diag(h), hw = 3 - h;
      return [{ n: 'handle', d: g.polygon([[1.5, -hw], [16.4, -hw], [16.4, hw], [1.5, hw]].map(T), [hw, 0, 0, hw]) }];
    },
    // 拧: the wrench turns about the bolt in its jaw, then springs back
    fx: { t: 'keys', on: 'all', o: [15.5, 8.5], r: [11, -3], ms: 380 }
  },
  screwdriver: {
    nudge: [-1, 1],
    label: '螺丝刀', key: 'live',
    ends: 'out',
    plan: '主体：手柄（圆角长条）；辅助：刀杆（一条线，头朝左下，长，约占四成）；细节：手柄前端的一道箍。手柄重，整体向左下移 1',
    weights: { [P]: 0.48, [S]: 0.38, [D]: 0.14 },
    draw(g) {
      const { h } = g, T = diag(h, [-1, 1]), u0 = 16, u1 = 26.2, w = 3.4;
      const body = [[u0 + h, -w + h], [u1 - h, -w + h], [u1 - h, w - h], [u0 + h, w - h]].map(T);
      return [
        line(g.pl([[1.2, 0], [u0, 0]].map(T)), { n: 'shaft', role: S }),
        shell(g.polygon(body, [1.2, w - h, w - h, 1.2]), { n: 'grip', role: P }),
        line(g.pl([[u0 + 3.6 + (g.s - 2) * 0.5, -w + h], [u0 + 3.6 + (g.s - 2) * 0.5, w - h]].map(T)), { n: 'band', role: D, on: 'grip' })
      ];
    },
    // 拧螺丝: the driver pushes toward its tip twice
    fx: { t: 'keys', on: 'all', x: [-0.8, 0, -0.8], y: [0.8, 0, 0.8], ms: 520 }
  },
  toolbox: {
    anchor: 'base',
    label: '工具箱', key: 'landscape',
    ends: 'out',
    plan: '主体：箱体；辅助：提手；细节：箱盖的分隔线和中间的锁扣（实心小块）',
    weights: { [P]: 0.6, [S]: 0.12, [D]: 0.28 },
    draw(g) {
      const { h } = g, top = 8, lid = 13;
      return [
        line(arch(8 + h, 16 - h, 4 + h, top + h), { n: 'handle', role: S }),
        shell(g.box(2, top, 20, 12, 3.5), { n: 'box', role: P }),
        line(g.seg(2 + h, lid, 22 - h, lid), { n: 'lid', role: D, on: 'box' }),
        solid(g.area(10, lid - 1, 4, 4, 1), { n: 'latch', role: D, on: 'box' })
      ];
    },
    // 提起: the box is lifted by its handle and set down
    fx: { t: 'bounce', on: 'all', o: [12, 20], amp: 1.2 }
  },
  scissors: {
    allow: { sliver: '一片刀刃的间隙斜着切过另一片，切口是锐角；只在 1.75 时略超阈值，不是碎块' },
    nudge: [0, -0.5],
    label: '剪刀', key: 'square',
    light: [],
    plan: '主体：两片刀刃（交叉的两条线）；辅助：两个指环。左环连右上的刀刃，右环连左上的刀刃，两半绕交叉点开合。指环在下方偏重，整体上移 0.5',
    weights: { [P]: 0.46, [S]: 0.54 },
    draw(g) {
      const { h } = g, R = 3.5, cy = 21 - R - 0.5, lx = 3 + R, rx = 21 - R, ty = 2.5 + h, tl = 7.5, tr = 16.5;
      const blade = (cx, tx) => { const a = Math.atan2(ty - cy, tx - cx); return g.seg(cx + (R - h) * Math.cos(a), cy + (R - h) * Math.sin(a), tx, ty); };
      return [
        shell(g.ring(lx, cy, R), { n: 'ring1', role: S, part: 'a' }),
        line(blade(lx, tr), { n: 'blade1', role: P, part: 'a' }),
        shell(g.ring(rx, cy, R), { n: 'ring2', role: S, part: 'b' }),
        line(blade(rx, tl), { n: 'blade2', role: P, part: 'b', gap: true })
      ];
    },
    // 剪: the two halves close about the pivot, twice
    fx: [{ t: 'keys', on: ['ring1', 'blade1'], o: [12, 10.7], r: [-9, 0, -9], ms: 520 }, { t: 'keys', on: ['ring2', 'blade2'], o: [12, 10.7], r: [9, 0, 9], ms: 520 }]
  },
  ruler: {
    label: '直尺', key: 'landscape', fit: 'x',
    ends: 'out',
    plan: '主体：尺身（横放的长条）；细节：三道刻度（中间一道长），从上沿伸下来',
    weights: { [P]: 0.76, [D]: 0.24 },
    draw(g) {
      const { s } = g, y0 = 7, y1 = 17, top = y0 + s / 2;
      return [
        shell(g.box(2, y0, 20, y1 - y0, 2.5), { n: 'body', role: P }),
        ...[[7, 2], [12, 3.5], [17, 2]].map(([x, L], i) => line(g.seg(x, top, x, y0 + s + L - (s - 2) * 0.5), { n: `t${i}`, role: D, on: 'body' }))
      ];
    },
    // 量: the marks are drawn on one after another
    fx: { t: 'draw', on: ['t0', 't1', 't2'], stagger: 110 }
  },
  paintbrush: {
    nudge: [0.6, -0.6],
    label: '画笔', key: 'live',
    plan: '主体：笔头（刷毛，圆鼓的尖头朝左下，和编辑的笔同一个方向）；辅助：金属箍（实心窄条）和笔杆（一条线，长，墨量约六成）。笔头重，整体向右上移 0.6',
    weights: { [P]: 0.42, [S]: 0.58 },
    light: [],
    draw(g) {
      const { h, s } = g, T = diag(h, [0.6, -0.6]), W = 3.4, b = 9.2, f = 3.6;
      const tuft = [[0.9, 0], [4.2, -W + h], [b - h, -W + h], [b - h, W - h], [4.2, W - h]].map(T);
      const fw = 2.5 + (s - 2) * 0.2;
      return [
        line(g.pl([[b + f - 0.5, 0], [27.5 - h * 1.4, 0]].map(T)), { n: 'handle', role: S }),
        shell(g.polygon(tuft, [0.9, 3, 0.6, 0.6, 3]), { n: 'tuft', role: P }),
        solid(g.polygon([[b - h, -fw], [b + f, -fw], [b + f, fw], [b - h, fw]].map(T), [0, 0.8, 0.8, 0]), { n: 'ferrule', role: S, part: 'tuft' })
      ];
    },
    // 刷: the brush sweeps about the end of its handle, back and forth
    fx: { t: 'keys', on: 'all', o: [20.5, 3.5], r: [-6, 5], ms: 440 }
  },
  palette: {
    label: '调色板', key: 'circle',
    plan: '主体：调色板（圆形，右下缺一口拇指孔）；细节：三个颜料点（实心）',
    weights: { [P]: 0.86, [D]: 0.14 },
    draw(g) {
      const { h, s } = g, r = 10 - h, a0 = 14, a1 = 76, rad = (a) => (a * Math.PI) / 180;
      const p0 = [12 + r * Math.cos(rad(a0)), 12 + r * Math.sin(rad(a0))], p1 = [12 + r * Math.cos(rad(a1)), 12 + r * Math.sin(rad(a1))];
      const nc = [18.6, 18.6], nr = Math.hypot(p0[0] - nc[0], p0[1] - nc[1]);
      const d = `M${g.pt(...p1)}A${n(r)} ${n(r)} 0 1 1 ${g.pt(...p0)}A${n(nr)} ${n(nr)} 0 0 0 ${g.pt(...p1)}Z`;
      const R = 4.6, k = 0.85 - (s - 2) * 0.15;
      return [
        shell(d, { n: 'board', role: P }),
        ...[175, 235, 295].map((a, i) => solid(g.dot(12 + R * Math.cos(rad(a)), 12 + R * Math.sin(rad(a)), k), { n: `p${i}`, role: D, on: 'board', vc: i }))
      ];
    },
    // 调色: the paints light up one after another
    fx: { t: 'variable', on: ['p0', 'p1', 'p2'], mode: 'iterative' }
  },
  'paint-bucket': {
    anchor: 'base',
    label: '油漆桶', key: 'square',
    plan: '主体：桶身（上宽下窄）；辅助：提手（半圆弧）和右边的一滴油漆',
    weights: { [P]: 0.55, [S]: 0.45 },
    draw(g) {
      const { h } = g, y0 = 8, y1 = 21, xl = 3, xr = 15, inset = 1;
      return [
        line(g.arc((xl + xr) / 2, y0 + h, (xr - xl) / 2 - h, 180, 360), { n: 'handle', role: S }),
        shell(g.polygon([[xl + h, y0 + h], [xr - h, y0 + h], [xr - inset - h, y1 - h], [xl + inset + h, y1 - h]], [1.2, 1.2, 2.6, 2.6]), { n: 'bucket', role: P }),
        shell(drop(g, 18.5, 18.25, 2.75, 12), { n: 'drop', role: S })
      ];
    },
    // 倒: the bucket tips toward the drop, and the drop falls again
    fx: [{ t: 'keys', on: ['handle', 'bucket'], o: [14, 21], r: [12], ms: 300 }, { t: 'keys', on: ['drop'], y: [-3, 0], a: [0, 1], ms: 420 }]
  },
  'pen-tool': {
    label: '钢笔工具', key: 'live',
    ends: 'in',
    plan: '主体：笔尖（尖头朝左下，和编辑的笔同一个方向）；辅助：笔尖后面的笔杆（圆角短块）；细节：笔尖上的气孔（实心点）和中缝',
    weights: { [P]: 0.54, [S]: 0.3, [D]: 0.16 },
    draw(g) {
      const { h, s } = g, T = diag(h), W = 6.2, top = 16, hole = 9;
      const nib = [[0.2, 0], [9.5, -W + h], [top - h, -W * 0.62 + h], [top - h, W * 0.62 - h], [9.5, W - h]].map(T);
      const holder = [[top + 1.5 + h, -3.4 + h], [26.4 - h * 1.4, -3.4 + h], [26.4 - h * 1.4, 3.4 - h], [top + 1.5 + h, 3.4 - h]].map(T);
      return [
        shell(g.polygon(nib, [1, 2.6, 1, 1, 2.6]), { n: 'nib', role: P }),
        line(g.pl([[0.6, 0], [hole - g.dr - 0.2, 0]].map(T)), { n: 'slit', role: D, on: 'nib' }),
        solid(g.dot(...T([hole, 0]), 1 - (s - 2) * 0.5), { n: 'hole', role: D, on: 'nib' }),
        shell(g.polygon(holder, [1.4, 2, 2, 1.4]), { n: 'holder', role: S })
      ];
    },
    // 描点: the nib traces a small loop, as pencil does
    fx: { t: 'orbit', on: 'all', R: 0.8 }
  },
  crop: {
    label: '裁剪', key: 'square',
    light: [],
    plan: '主体：两个直角（交叉成裁剪框），一个物体',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, a = 7, b = 17, c = 2;
      return [
        line(`M${a} ${n(3 + h)}V${b - c}A${c} ${c} 0 0 0 ${a + c} ${b}H${n(21 - h)}`, { n: 'c1', role: P }),
        line(`M${n(3 + h)} ${a}H${b - c}A${c} ${c} 0 0 1 ${b} ${a + c}V${n(21 - h)}`, { n: 'c2', role: P })
      ];
    },
    // 裁剪: the two corners close in on the frame and spring back
    fx: [{ t: 'keys', on: ['c1'], x: [1.3], y: [-1.3], ms: 320 }, { t: 'keys', on: ['c2'], x: [-1.3], y: [1.3], ms: 320 }]
  },
  magnet: {
    label: '磁铁', key: 'square',
    plan: '主体：U 形磁铁（开口朝下，一个闭合形）；细节：两端磁极的分隔线',
    weights: { [P]: 0.85, [D]: 0.15 },
    draw(g, ctx) {
      const { h } = g, w = 6, R = 9 - h, ri = 9 - w + h, cy = 12, yb = 21 - h, pole = 16;
      // in the fill variant the pole lines cut both legs through (GUIDE.md §4.1): the ends are painted
      const e = ctx?.variant === 'fill' ? -h : h;
      const pts = [[3 + h, yb], ...arcPts(12, cy, R, 180, 360, 18), [21 - h, yb], [21 - w + h, yb], ...arcPts(12, cy, ri, 360, 180, 12), [3 + w - h, yb]];
      const rad = pts.map((_, i) => (i === 0 || i === 20 || i === 21 || i === pts.length - 1 ? 1 : 0));
      return [
        shell(g.polygon(pts, rad), { n: 'magnet', role: P }),
        line(g.seg(3 + e, pole, 3 + w - e, pole) + g.seg(21 - w + e, pole, 21 - e, pole), { n: 'poles', role: D, on: 'magnet' })
      ];
    },
    // 吸引: the magnet snaps down toward what it pulls, then settles
    fx: { t: 'keys', on: 'all', y: [1.3, -0.4], ms: 300 }
  },
  flashlight: {
    label: '手电筒', key: 'live',
    ends: 'out',
    plan: '主体：手电筒（斜放 45°，灯头宽、筒身窄，一个闭合形）；辅助：灯头前的三道光线；细节：筒身上的一道箍',
    weights: { [P]: 0.64, [S]: 0.26, [D]: 0.1 },
    draw(g) {
      const { h } = g, T = diag(h), w = 3, W = 5, a = 9, b = 12, f = 15.5, t = 0.8, r0 = f + 2.6;
      const body = [[t + h, -w + h], [a, -w + h], [b, -W + h], [f - h, -W + h], [f - h, W - h], [b, W - h], [a, w - h], [t + h, w - h]].map(T);
      const ray = (v0, u1, v1) => g.pl([[r0, v0], [u1, v1]].map(T));
      return [
        shell(g.polygon(body, [1.5, 0.8, 0.8, 1.4, 1.4, 0.8, 0.8, 1.5]), { n: 'torch', role: P }),
        line(g.pl([[6.2, -w + h], [6.2, w - h]].map(T)), { n: 'band', role: D, on: 'torch' }),
        line(ray(0, 21.6, 0) + ray(-3.8, 20.4, -5.8) + ray(3.8, 20.4, 5.8), { n: 'rays', role: S })
      ];
    },
    // 打开: the beam flickers on
    fx: { t: 'keys', on: ['rays'], a: [0.15, 1, 0.15, 1], ms: 520 }
  },
  wand: {
    allow: { optical: '星光在魔杖顶端就是这个图标的含义，不往回挪' },
    label: '魔法棒', key: 'live',
    plan: '主体：棒头的四角星（说明是魔法）；辅助：棒身（斜放的线）；细节：两颗小星点（实心）',
    weights: { [P]: 0.56, [S]: 0.32, [D]: 0.12 },
    draw(g) {
      const { h } = g, sc = [16.6, 7.4];
      return [
        line(g.seg(3.3 - (h - 1) * 0.3, 20.7 + (h - 1) * 0.3, 11.6, 12.4), { n: 'stick', role: S }),
        shell(sparkle(g, sc[0], sc[1], 7.6), { n: 'star', role: P }),
        solid(g.dot(6.2, 6.6, 0.8), { n: 'd1', role: D, vc: 0 }),
        solid(g.dot(19.6, 18, 0.8), { n: 'd2', role: D, vc: 1 })
      ];
    },
    // 施法: the wand flicks, the star twinkles
    fx: [{ t: 'wiggle', on: ['stick', 'star'], o: [3.3, 20.7], deg: 6, hz: 2.6 }, { t: 'keys', on: ['star'], o: [16.6, 7.4], s: [0.6, 1.1], ms: 420 }, { t: 'keys', on: ['d1', 'd2'], by: true, a: [0.2, 1], stagger: 120 }]
  },
  pipette: {
    label: '取色器', key: 'live',
    plan: '主体：吸管（尖头朝左下，渐宽）和胶头；辅助：中间的卡圈（一条横线，比管身宽）',
    weights: { [P]: 0.82, [S]: 0.18 },
    light: [],
    draw(g) {
      const { h } = g, T = diag(h), c = 13.4, tw = 3, bw = 3.8, end = 26.6;
      const tube = [[1, -0.9], [c, -tw + h], [c, tw - h], [1, 0.9]].map(T);
      const bulb = [[c, -bw + h], [end - h * 1.4, -bw + h], [end - h * 1.4, bw - h], [c, bw - h]].map(T);
      return [
        shell(g.polygon(tube, [0.8, 0, 0, 0.8]), { n: 'tube', role: P }),
        shell(g.polygon(bulb, [0, bw - h, bw - h, 0]), { n: 'bulb', role: P }),
        line(g.pl([[c, -5.6 + h], [c, 5.6 - h]].map(T)), { n: 'collar', role: S })
      ];
    },
    // 取色: the bulb is squeezed and lets go
    fx: { t: 'keys', on: ['bulb'], o: diag(1)([13.4, 0]), s: [0.84, 1.04], ms: 380 }
  },
  'nut-bolt': {
    label: '螺栓螺母', key: 'circle',
    plan: '主体：六角螺母（平边在上下，落在整像素上）；细节：中间穿过的螺栓（圆环，像设置的中心孔）',
    weights: { [P]: 0.74, [D]: 0.26 },
    draw(g) {
      const { h, s } = g, rc = (9 - h) / Math.cos(Math.PI / 6), pts = [];
      for (let i = 0; i < 6; i++) { const a = (i * 60 * Math.PI) / 180; pts.push([12 + rc * Math.cos(a), 12 + rc * Math.sin(a)]); }
      return [
        shell(g.polygon(pts, 2 - h * 0.5), { n: 'nut', role: P }),
        shell(g.ring(12, 12, 4.25 - (s - 2) * 0.5), { n: 'bolt', role: D, on: 'nut' })
      ];
    },
    // 拧紧: the nut turns by one face (a sixth of a turn, landing on itself)
    fx: { t: 'rotate', on: ['nut'], deg: 60, o: [12, 12] },
    allow: { keyline: '六角形按整像素放平边，上下各缩进 1' }
  },
  drill: {
    anchor: 'base',
    label: '电钻', key: 'landscape',
    plan: '主体：机身和握把（一个闭合形）；辅助：钻夹头、钻头和底部的电池（实心块）',
    weights: { [P]: 0.66, [S]: 0.34 },
    draw(g) {
      const { h } = g, x0 = 7, x1 = 22, y0 = 4, y1 = 12, gx0 = 9, gx1 = 15, yb = 18;
      const body = [[x0 + h, y0 + h], [x1 - h, y0 + h], [x1 - h, y1 - h], [gx1 - h, y1 - h], [gx1 - h, yb - h], [gx0 + h, yb - h], [gx0 + h, y1 - h], [x0 + h, y1 - h]];
      return [
        shell(g.polygon(body, [1.5, 3, 3, 0, 1, 1, 0, 1.5]), { n: 'body', role: P }),
        solid(g.area(4, 6, 4, 4, [0.8, 0, 0, 0.8]), { n: 'chuck', role: S }),
        line(g.span(2, 8, 5.5, 8), { n: 'bit', role: S }),
        solid(g.area(7, 17, 10, 3, 1), { n: 'battery', role: S })
      ];
    },
    // 钻: the drill runs and shakes
    fx: { t: 'shake', on: 'all', x: 0.5, ms: 560 }
  },
  ladder: {
    label: '梯子', key: 'portrait', fit: 'y',
    plan: '主体：两根梯柱；辅助：四级横档（两端接到梯柱上）。横档多，墨量超过梯柱，约占六成',
    weights: { [P]: 0.36, [S]: 0.64 },
    light: [],
    draw(g) {
      const { h } = g, xl = 7, xr = 17;
      return [
        line(g.span(xl, 2, xl, 22) + g.span(xr, 2, xr, 22), { n: 'rails', role: P }),
        ...[18, 14, 10, 6].map((y, i) => line(g.seg(xl, y, xr, y), { n: `r${i}`, role: S, vc: i }))
      ];
    },
    // 攀爬: the rungs light up from the bottom
    fx: { t: 'variable', on: ['r0', 'r1', 'r2', 'r3'], mode: 'cumulative', step: 130 }
  }
};
