// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// tools: icons of this catalogue category (catalog.mjs), drawn by the rules in GUIDE.md.
// To draw: hammer wrench screwdriver toolbox scissors ruler paintbrush palette paint-bucket pen-tool crop magnet flashlight wand pipette nut-bolt drill ladder
import { n, P, S, D, cup, arch, heart, pin, cloud, hill, flagCloth, star, gear, speaker, shell, line, solid } from '../parts.mjs';
import { slash } from '../kit.mjs';
import { off, offFill } from '../variants.mjs';

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

const SET = {
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
  },
  axe: {
    nudge: [2.5, 1],
    label: '斧头', key: 'live', fit: 'y',
    plan: '主体：斧头（横在柄的上端，向左上张开成扇形，刃口和柄平行）；辅助：斧柄（斜放的线，和锤子同一个方向）。斧头在左上，整体向右下移 2.5 和 1',
    weights: { [P]: 0.6, [S]: 0.4 },
    light: [],
    draw(g) {
      const { h } = g, T = diag(h, [2.5, 1]);
      const head = [[13.2, 2.4 - h], [17.2, 2.4 - h], [17.2, -2.6], [19.8, -9 + h], [10.6, -9 + h], [13.2, -2.6]].map(T);
      return [
        line(g.pl([[1.2, 0], [19.8, 0]].map(T)), { n: 'handle', role: S }),
        shell(g.polygon(head, [0.8, 0.8, 0, 1.4, 1.4, 0]), { n: 'head', role: P })
      ];
    },
    // 劈: the axe is raised, then chops past rest and settles
    fx: { t: 'keys', on: 'all', o: [6, 21], r: [-7, 4], ms: 360 }
  },
  shovel: {
    nudge: [0.8, -0.8],
    label: '铲子', key: 'live',
    plan: '主体：铲头（尖头朝左下的五边形）；辅助：铲柄（斜放的线）和柄端的横把。铲头重，整体向右上移 0.8',
    weights: { [P]: 0.5, [S]: 0.5 },
    light: [],
    draw(g) {
      const { h } = g, T = diag(h, [0.8, -0.8]), W = 3.8;
      const blade = [[0.4, 0], [3.4, -W + h], [9 - h, -W + h], [9 - h, W - h], [3.4, W - h]].map(T);
      return [
        line(g.pl([[9 - h, 0], [22.6, 0]].map(T)) + g.pl([[22.6, -3.2], [22.6, 3.2]].map(T)), { n: 'handle', role: S }),
        shell(g.polygon(blade, [0.9, 1.2, 1, 1, 1.2]), { n: 'blade', role: P })
      ];
    },
    // 铲: the shovel digs in toward its tip and lifts back
    fx: { t: 'keys', on: 'all', x: [-0.7, 0.2], y: [0.7, -0.2], ms: 420 }
  },
  pickaxe: {
    nudge: [-0.6, 0.6],
    label: '镐', key: 'live',
    plan: '主体：镐头（横在柄端的月牙形，两头尖）；辅助：镐柄（斜放的线）。镐头重，整体向左下移 0.6',
    weights: { [P]: 0.6, [S]: 0.4 },
    light: [],
    draw(g) {
      const { h } = g, T = diag(h, [-0.6, 0.6]), c = 10.5, R = 12 - h, r = 9 + h;
      const head = [...arcPts(c, 0, R, -52, 52, 18), ...arcPts(c, 0, r, 44, -44, 14)].map(T);
      const rad = head.map((_, i) => (i === 0 || i === 18 || i === 19 || i === head.length - 1 ? 0.7 : 0));
      return [
        line(g.pl([[1.2, 0], [c + r, 0]].map(T)), { n: 'handle', role: S }),
        shell(g.polygon(head, rad), { n: 'head', role: P })
      ];
    },
    // 挖: the pick swings down and settles
    fx: { t: 'keys', on: 'all', o: [4, 20], r: [-10, 6], ms: 360 }
  },
  'paint-roller': {
    nudge: [0, 1],
    label: '滚刷', key: 'live',
    plan: '主体：滚筒（横放的圆角长条）；辅助：从滚筒右端绕下来的支架和下方的握把（圆角竖条）。滚筒在上偏重，整体下移 1',
    weights: { [P]: 0.48, [S]: 0.52 },
    light: [],
    draw(g) {
      const { h } = g;
      return [
        line(`M${n(18 - h)} 6H19A2 2 0 0 1 21 8V11A2 2 0 0 1 19 13H14A2 2 0 0 0 12 15V16`, { n: 'arm', role: S }),
        shell(g.box(10, 16, 4, 7, 2), { n: 'grip', role: S }),
        shell(g.box(2, 3, 16, 6, 2.5), { n: 'roller', role: P })
      ];
    },
    // 刷墙: the roller runs left and right along the wall
    fx: { t: 'keys', on: 'all', x: [-1.2, 1, 0], ms: 560 }
  },
  'spray-can': {
    nudge: [-1, 0],
    label: '喷漆', key: 'square',
    plan: '主体：罐身（斜肩的圆角长条）；辅助：顶上的喷头（小方块）；细节：喷头左边喷出的三个点。罐身在右偏重，整体左移 1',
    weights: { [P]: 0.6, [S]: 0.24, [D]: 0.16 },
    draw(g) {
      const { h } = g;
      return [
        shell(g.polygon([[13 + h, 10 + h], [18 - h, 10 + h], [20 - h, 12.5], [20 - h, 21 - h], [11 + h, 21 - h], [11 + h, 12.5]], [1, 1, 0.8, 2, 2, 0.8]), { n: 'can', role: P }),
        shell(g.box(13, 3, 5, 5, 1.5), { n: 'cap', role: S }),
        solid(g.dot(8.5, 6.5, 0.8), { n: 'd0', role: D }),
        solid(g.dot(3.3, 4.3, 0.8), { n: 'd1', role: D }),
        solid(g.dot(3.3, 9.1, 0.8), { n: 'd2', role: D })
      ];
    },
    // 喷: the cap is pressed and the paint comes out, dot by dot
    fx: [{ t: 'keys', on: ['cap'], y: [0.7, 0], ms: 300 }, { t: 'keys', on: ['d0', 'd1', 'd2'], by: true, a: [0.15, 1], stagger: 90 }]
  },
  'swatch-book': {
    label: '色卡', key: 'square',
    plan: '主体：竖放的第一张色卡（底端圆，有穿孔）；辅助：转开 45° 的第二张和横放的第三张（只露出外沿）；细节：穿孔（实心点）',
    weights: { [P]: 0.46, [S]: 0.46, [D]: 0.08 },
    draw(g) {
      const { h } = g;
      return [
        line('M11 9L13.6 6.4A2.4 2.4 0 0 1 17 6.4L18.6 8A2.4 2.4 0 0 1 18.6 11.4L11 19', { n: 'card2', role: S }),
        line(`M17 13H${n(21 - h - 2)}A2 2 0 0 1 ${n(21 - h)} 15V${n(21 - h - 2)}A2 2 0 0 1 ${n(21 - h - 2)} ${n(21 - h)}H11`, { n: 'card3', role: S }),
        shell(g.box(3, 3, 9, 18, [2.5, 2.5, 4.5, 4.5]), { n: 'card1', role: P }),
        // the pin shrinks at heavy weights to keep its space from the card's sides
        solid(g.circ(7.5, 16.5, 0.9 - Math.max(0, g.s - 2) * 0.6), { n: 'hole', role: D, on: 'card1' })
      ];
    },
    // 展开: the cards fan out about the pin and close again
    fx: [{ t: 'keys', on: ['card2'], o: [7.5, 16.5], r: [-8, 2], ms: 340 }, { t: 'keys', on: ['card3'], o: [7.5, 16.5], r: [-4, 1], ms: 340 }]
  },
  stamp: {
    label: '印章', key: 'portrait',
    plan: '主体：印面（宽的圆角块）；辅助：上面的握柄（细颈和圆头，一笔）和下方的纸面（横线）',
    weights: { [P]: 0.46, [S]: 0.54 },
    draw(g) {
      const { h } = g;
      return [
        line(g.span(4, 22 - h, 20, 22 - h), { n: 'paper', role: S }),
        line('M10 12V10C10 8.5 9 8 9 6A3 3 0 0 1 15 6C15 8 14 8.5 14 10V12', { n: 'handle', role: S, part: 'stamp' }),
        shell(g.box(4, 12, 16, 6, [2.5, 2.5, 1, 1]), { n: 'pad', role: P, part: 'stamp' })
      ];
    },
    // 盖章: the stamp presses down onto the paper and lifts
    fx: { t: 'keys', on: ['handle', 'pad'], y: [1.2, -0.3], ms: 260 }
  },
  'pencil-ruler': {
    label: '铅笔和尺子', key: 'live',
    ends: 'in',
    plan: '主体：铅笔（和编辑的笔同样斜放，压在尺子前面）；辅助：尺子（沿另一条对角线）；细节：尺子两端的刻度（面性中不画，铅笔前后的尺子太短）',
    weights: { [P]: 0.66, [S]: 0.24, [D]: 0.1 },
    draw(g) {
      const { h } = g, L = 26.3, W = 6.4, tipL = 5.2, T = diag(h);
      const body = [[0, 0], [tipL, -W / 2 + h], [L - h * 1.4, -W / 2 + h], [L - h * 1.4, W / 2 - h], [tipL, W / 2 - h]].map(T);
      // the ruler along the other diagonal: w along it, z across (+z toward the top right)
      const R = ([w, z]) => [12 + (w + z) * Math.SQRT1_2, 12 + (w - z) * Math.SQRT1_2];
      const a = 9.7, b = 3;
      return [
        shell(g.polygon([[-a + h, -b + h], [a - h, -b + h], [a - h, b - h], [-a + h, b - h]].map(R), 1.2 - h * 0.5), { n: 'ruler', role: S }),
        line(g.pl([[-6.5, b - h], [-6.5, b - h - 2.2]].map(R)) + g.pl([[6.5, b - h], [6.5, b - h - 2.2]].map(R)), { n: 'ticks', role: D, on: 'ruler', only: 'outline' }),
        shell(g.polygon(body, [0.9, 0, 1.8, 1.8, 0]), { n: 'pencil', role: P, occ: true })
      ];
    },
    // 画线: the pencil traces a small loop, as pencil does
    fx: { t: 'orbit', on: ['pencil'], R: 0.8 }
  },
  'triangle-ruler': {
    nudge: [1, -1],
    label: '三角尺', key: 'square',
    plan: '主体：直角三角板（直角在左下）；细节：中间的三角形孔（三边离外沿一样远）。分量在直角一侧，整体向右上移 1',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g, ctx) {
      const { h } = g, k = 1 + Math.SQRT2;
      // the hole: each side parallel to the board's, d in from its centre line
      const d = ctx?.variant === 'fill' ? 2 * g.s + 0.75 : g.s + g.clear + 0.25, x0 = 4 + h + d, y1 = 20 - h - d;
      // the sharp corners are drawn out by what their rounding takes back
      const e = 1.6 * (1 / Math.sin(Math.PI / 8) - 1) * 0.85;
      return [
        shell(g.polygon([[4 + h, 2 + h - e], [22 - h + e, 20 - h], [4 + h, 20 - h]], [1.6, 1.6, 1.2]), { n: 'board', role: P }),
        shell(g.polygon([[x0, 2 + h + d * k], [22 - h - d * k, y1], [x0, y1]], 0.6), { n: 'hole', role: D, on: 'board' })
      ];
    },
    // 画线: the set square slides along its long edge and back
    fx: { t: 'keys', on: 'all', x: [-1, 0.3], y: [-1, 0.3], ms: 360 }
  },
  protractor: {
    label: '量角器', key: 'landscape', fit: 'x',
    ends: 'in',
    plan: '主体：半圆的量角器（平边在下）；细节：中心的半圆孔和弧边上的三道刻度（面性中不画刻度，弧边太窄）',
    weights: { [P]: 0.66, [D]: 0.34 },
    draw(g) {
      const { h } = g, cy = 16, R = 10 - h, r = 2.25;
      const tick = (deg) => { const a = (deg * Math.PI) / 180; return g.seg(12 + R * Math.cos(a), cy + R * Math.sin(a), 12 + (R - 2) * Math.cos(a), cy + (R - 2) * Math.sin(a)); };
      return [
        shell(`M${n(2 + h)} ${n(cy + 1 - h)}V${cy}A${n(R)} ${n(R)} 0 0 1 ${n(22 - h)} ${cy}V${n(cy + 1 - h)}Z`, { n: 'body', role: P }),
        line(g.arc(12, cy + 1, r + h, 180, 360), { n: 'hole', role: D, on: 'body', only: 'outline' }),
        // filled, the hole is cut out whole, through the flat edge
        shell(`M${n(12 - r)} ${n(cy + 1 + g.s)}V${cy + 1}A${r} ${r} 0 0 1 ${n(12 + r)} ${cy + 1}V${n(cy + 1 + g.s)}Z`, { n: 'hole', role: D, on: 'body', only: 'fill' }),
        line(tick(-145) + tick(-90) + tick(-35), { n: 'ticks', role: D, on: 'body', only: 'outline' })
      ];
    },
    // 量角: the ticks are drawn round the arc
    fx: { t: 'draw', on: ['ticks'] }
  },
  'compass-drawing': {
    label: '圆规', key: 'square',
    plan: '主体：顶端的铰链（圆环）和两条腿；辅助：两腿之间的弧（调节杆，两端接在腿上）',
    weights: { [P]: 0.72, [S]: 0.28 },
    draw(g) {
      const { h } = g, c = [12, 6], R = 2.75, at = (x) => { const dx = x - c[0], dy = 21 - h - c[1], L = Math.hypot(dx, dy); return [c[0] + (dx * (R - h)) / L, c[1] + (dy * (R - h)) / L]; };
      const l = at(3 + h), r = at(21 - h), deg = (x) => (Math.atan2(21 - h - c[1], x - c[0]) * 180) / Math.PI;
      return [
        line(g.seg(r[0], r[1], 21 - h, 21 - h), { n: 'right', role: P, part: 'legs' }),
        line(g.arc(12, 6, 9.5, deg(21 - h), deg(3 + h)), { n: 'bar', role: S, part: 'legs' }),
        line(g.seg(l[0], l[1], 3 + h, 21 - h), { n: 'left', role: P, part: 'legs' }),
        shell(g.ring(c[0], c[1], R), { n: 'hinge', role: P, part: 'legs' })
      ];
    },
    // 画圆: the legs open out about the hinge and close again
    fx: { t: 'rotate', on: 'all', deg: 9, o: [12, 6] }
  },
  'tape-measure': {
    anchor: 'base', nudge: [1, 0],
    label: '卷尺', key: 'landscape', fit: 'x',
    plan: '主体：尺盒（圆角方块）；辅助：从盒底拉出的尺带（末端一个钩）；细节：盒中的转轴（圆环）。尺盒在左偏重，整体右移 1',
    weights: { [P]: 0.6, [S]: 0.2, [D]: 0.2 },
    draw(g) {
      const { h } = g;
      return [
        line(`M12 ${n(20 - h)}H${n(23 - h)}V14`, { n: 'tape', role: S, part: 'case' }),
        shell(g.box(3, 5, 14, 15, 4.5), { n: 'case', role: P, part: 'case' }),
        shell(g.ring(10, 12.5, 3.5 - (g.s - 2) * 0.5), { n: 'hub', role: D, on: 'case' })
      ];
    },
    // 收卷: the tape is drawn back into the case and runs out again
    fx: { t: 'keys', on: ['tape'], x: [-2.4, 0], ms: 420 }
  },
  'spirit-level': {
    label: '水平仪', key: 'landscape', fit: 'x',
    ends: 'in',
    plan: '主体：尺身（横放的圆角长条）；细节：中间的水泡管（两道竖线，面性中不画）和水泡（实心点）',
    weights: { [P]: 0.8, [D]: 0.2 },
    draw(g) {
      // the vial's ends keep a clear space from the edges at every weight
      const y0 = 6 + g.s + g.clear + g.h;
      return [
        shell(g.box(2, 6, 20, 12, 3), { n: 'body', role: P }),
        line(g.seg(8, y0, 8, 24 - y0) + g.seg(16, y0, 16, 24 - y0), { n: 'vial', role: D, on: 'body', only: 'outline' }),
        solid(g.dot(12, 12, 0.85 - Math.max(0, g.s - 2) * 0.3), { n: 'bubble', role: D, on: 'body' })
      ];
    },
    // 找平: the bubble drifts to one side, then the other, and settles in the middle
    fx: { t: 'keys', on: ['bubble'], x: [-1.3, 1, 0], ms: 640 }
  },
  nail: {
    nudge: [-0.6, 0.6],
    label: '钉子', key: 'live',
    light: [],
    plan: '主体：钉身（斜放的线，尖朝左下，和其他工具同一个方向）和钉帽（横在上端的实心短条，比钉身宽）。钉帽重，整体向左下移 0.6',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g, T = diag(h, [-0.6, 0.6]), u0 = 21, u1 = 23.6, w = 4.6;
      return [
        line(g.pl([[0.6, 0], [u0, 0]].map(T)), { n: 'shank', role: P, part: 'nail' }),
        solid(g.polygon([[u0, -w], [u1, -w], [u1, w], [u0, w]].map(T), 1.2), { n: 'head', role: P, part: 'nail' })
      ];
    },
    // 钉入: the nail is struck toward its point twice
    fx: { t: 'keys', on: 'all', x: [-0.8, 0, -0.8], y: [0.8, 0, 0.8], ms: 460 }
  },

  hook: {
    nudge: [-1, 0],
    label: '吊钩', key: 'live', fit: 'y',
    plan: '主体：钩子（竖杆和下面的 J 形弯钩，一笔）；辅助：顶上的吊环（圆环）。吊环在右，整体左移 1',
    weights: { [P]: 0.74, [S]: 0.26 },
    light: [],
    draw(g) {
      const { h } = g, R = 2.75, r = 5.5;
      return [
        line(`M16 ${n(5 + R - h)}V15.5A${r} ${r} 0 0 1 5 15.5V12`, { n: 'hook', role: P, part: 'hook' }),
        shell(g.ring(16, 5, R), { n: 'eye', role: S, part: 'hook' })
      ];
    },
    // 吊起: the hook swings on its eye
    fx: { t: 'wiggle', on: 'all', o: [16, 3], deg: 9, hz: 2.4 }
  },
  trowel: {
    nudge: [0.8, -0.8],
    label: '抹刀', key: 'live',
    plan: '主体：刀片（尖头朝左下的菱形）；辅助：颈和握把（圆角长条，斜放，和其他工具同一个方向）。刀片重，整体向右上移 0.8',
    weights: { [P]: 0.6, [S]: 0.4 },
    light: [],
    draw(g) {
      const { h } = g, T = diag(h, [0.8, -0.8]), W = 5.6;
      const blade = [[0.2, 0], [8, -W + h], [13 - h, 0], [8, W - h]].map(T);
      const grip = [[16.5 + h, -2 + h], [26.6 - h * 1.4, -2 + h], [26.6 - h * 1.4, 2 - h], [16.5 + h, 2 - h]].map(T);
      return [
        line(g.pl([[13 - h, 0], [16.5 + h, 0]].map(T)), { n: 'neck', role: S, part: 't' }),
        shell(g.polygon(grip, 2 - h), { n: 'grip', role: S, part: 't' }),
        shell(g.polygon(blade, [0.9, 1.4, 1.4, 1.4]), { n: 'blade', role: P, part: 't' })
      ];
    },
    // 抹平: the trowel smooths back and forth
    fx: { t: 'keys', on: 'all', x: [-0.8, 0.8, 0], y: [0.8, -0.8, 0], ms: 560 }
  },
  'hard-hat': {
    anchor: 'base',
    label: '安全帽', key: 'landscape', fit: 'x',
    ends: 'in',
    plan: '主体：帽顶（半圆拱）；辅助：下面的帽檐（横线，比帽顶宽）；细节：帽顶中间的加强筋',
    weights: { [P]: 0.64, [S]: 0.24, [D]: 0.12 },
    draw(g) {
      const { h } = g, R = 8 - h;
      return [
        shell(`M${n(4 + h)} ${n(16 - h)}V13A${n(R)} ${n(R)} 0 0 1 ${n(20 - h)} 13V${n(16 - h)}Z`, { n: 'dome', role: P }),
        line(g.seg(12, 5 + h, 12, 11), { n: 'ridge', role: D, on: 'dome' }),
        line(g.span(2, 19, 22, 19), { n: 'brim', role: S })
      ];
    },
    // 戴上: the hat drops into place
    fx: { t: 'bounce', on: 'all', o: [12, 20], amp: 1.2 }
  },

  lasso: {
    label: '套索', key: 'live', fit: 'x',
    light: [],
    plan: '主体：绳圈（横放的椭圆，左下留口）；辅助：绳结（小圆环）和垂下的绳尾',
    weights: { [P]: 0.72, [S]: 0.28 },
    draw(g) {
      const { h } = g, cx = 12, cy = 9.5, rx = 10 - h, ry = 7 - h, at = (deg) => [cx + rx * Math.cos((deg * Math.PI) / 180), cy + ry * Math.sin((deg * Math.PI) / 180)];
      const p0 = at(152), p1 = at(118), k = [5.4, 15.6], R = 2.25;
      return [
        line(`M${g.pt(...p0)}A${n(rx)} ${n(ry)} 0 1 1 ${g.pt(...p1)}`, { n: 'loop', role: P, part: 'rope' }),
        shell(g.ring(k[0], k[1], R), { n: 'knot', role: S, part: 'rope' }),
        line(`M${k[0]} ${n(k[1] + R - h)}Q${k[0]} 20 ${n(k[0] + 2.6)} ${n(22 - h)}`, { n: 'tail', role: S, part: 'rope' })
      ];
    },
    // 套: the lasso swings about its knot
    fx: { t: 'wiggle', on: 'all', o: [5.4, 15.6], deg: 7, hz: 2.4 }
  },
  spline: {
    label: '曲线', key: 'square',
    plan: '主体：曲线（圆弧，凸向左上）；辅助：两端的锚点（圆环）',
    weights: { [P]: 0.42, [S]: 0.58 },
    draw(g) {
      const R = 2.75, A = 13, d = ((R + g.clear + g.h) / A) * (180 / Math.PI);
      return [
        line(g.arc(18.5, 18.5, A, 180 + d, 270 - d), { n: 'curve', role: P }),
        shell(g.ring(5.5, 18.5, R), { n: 'a', role: S }),
        shell(g.ring(18.5, 5.5, R), { n: 'b', role: S })
      ];
    },
    // 绘制路径: the curve is drawn from one anchor to the other
    fx: { t: 'draw', on: ['curve'] }
  },

  'tape-roll': {
    label: '胶带', key: 'live', fit: 'x',
    plan: '主体：胶带卷（大圆环）；辅助：从卷底拉出的一段胶带（横线）；细节：中间的纸芯（圆环）',
    weights: { [P]: 0.6, [S]: 0.16, [D]: 0.24 },
    draw(g) {
      const { h } = g;
      return [
        line(`M10.5 ${n(20 - h)}H${n(22 - h)}`, { n: 'tape', role: S, part: 'roll' }),
        shell(g.ring(10.5, 11.5, 8.5), { n: 'roll', role: P, part: 'roll' }),
        shell(g.ring(10.5, 11.5, 4 - (g.s - 2) * 0.4), { n: 'core', role: D, on: 'roll' })
      ];
    },
    // 拉出: the tape is pulled out further and runs back
    fx: { t: 'keys', on: ['tape'], x: [1.2, 0], ms: 400 }
  },
  rake: {
    label: '耙子', key: 'live',
    plan: '主体：耙头（横在柄端的横梁和向外伸出的四根耙齿）；辅助：耙柄（斜放的线，和锤子同一个方向）',
    weights: { [P]: 0.56, [S]: 0.44 },
    light: [],
    draw(g) {
      const { h } = g, T = diag(h), u = 16.8, w = 5.6, t = 20.4;
      return [
        line(g.pl([[1.2, 0], [u, 0]].map(T)), { n: 'handle', role: S, part: 'rake' }),
        line(g.pl([[u, -w], [u, w]].map(T)) + [-w, -w / 3, w / 3, w].map((v) => g.pl([[u, v], [t, v]].map(T))).join(''), { n: 'head', role: P, part: 'rake' })
      ];
    },
    // 耙地: the rake is drawn back toward its handle and pushed out again
    fx: { t: 'keys', on: 'all', x: [-1, 0.2], y: [1, -0.2], ms: 380 }
  },
  anvil: {
    anchor: 'base', nudge: [0, -1],
    label: '铁砧', key: 'landscape', fit: 'x',
    plan: '主体：铁砧（左边伸出尖角的砧面、收窄的腰和外撇的底座，一个闭合形）。整体上移 1',
    weights: { [P]: 1 },
    draw(g) {
      const { h } = g;
      const pts = [[1.6 + h, 7], [7.5, 6 + h], [22 - h, 6 + h], [22 - h, 11 - h], [16.5, 11 - h], [15.5, 14.5], [18.5 - h, 17.5], [18.5 - h, 20 - h], [5.5 + h, 20 - h], [5.5 + h, 17.5], [8.5, 14.5], [7.5, 11 - h]].map(([x, y]) => [x, y - 1]);
      return [shell(g.polygon(pts, [0.3, 1.2, 1, 1, 0.6, 0.6, 0.8, 0.8, 0.8, 0.8, 0.6, 0.8]), { n: 'anvil', role: P })];
    },
    // 锻打: the anvil takes a blow and rings
    fx: { t: 'keys', on: 'all', o: [12, 19], sy: [0.92], ms: 200 }
  },
  //NEW
};

// Variants made by rule (kit.mjs) of the icons above.
export default {
  ...SET,

  'flashlight-off': off({ ...offFill(slash(SET.flashlight, { label: '手电筒关闭' })), allow: { sliver: '斜线的间隙以 45° 切过外形，切口两侧是斜角，与线性变体的斜线一致；不是夹出来的碎块' } }, 'flashlight', { t: 'keys', on: ['rays'], a: [0.1], ms: 260 }),
  //VAR
};
