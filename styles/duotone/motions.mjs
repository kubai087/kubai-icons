// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// The hover motion of every example (GUIDE.md section 11). The runtime is motion.mjs.
//
// Each motion acts out what the icon means, the way the object would do it: a lid swings open
// on its hinge, a page is torn off, an arrow flies out and comes back in, lines are written one
// after another, the lights of a building come on floor by floor. Parts may leave and come back
// (a: opacity, w: a stroke drawn on), and a motion may bring in a part that isn't there at rest
// (add, with rest: { a: 0 }): the flash of a camera, the waves of a microphone, a letter
// dropping into an inbox. Moves are generous: 1.5–4 on the 16 grid, turns up to 30°.
//
// MOTION[name] = { say, moves, copy?, add?, ms? }; see motion.mjs for the keys.
import { K, D, W, Bt, rr, circ, pill, L } from './kit.mjs';
import { ICONS } from './icons.mjs';

const hidden = { rest: { a: 0 } };
const same = (keys, pose) => Object.fromEntries(keys.map((k) => [k, pose]));

export const MOTION = {
  folder: { say: '从文件夹里抽出一张纸', moves: { 0: { y: [-5.5, -4.5] } } },
  'file-text': {
    say: '三行字依次写出来',
    moves: { 1: { sx: [0, 1, 1, 1], o: [5, 5.875] }, 2: { sx: [0, 0, 1, 1], o: [5, 8.5] }, 3: { sx: [0, 0, 0, 1], o: [5, 11.125] } }
  },
  calendar: {
    say: '撕下一页，往下滑落淡出，下面是新的一页',
    copy: [{ of: [0, 1], at: 2 }],
    moves: same(['c0', 'c1'], { y: [0.5, 1.5], r: [3, 6], a: [0.7, 0], o: [14, 3.5] })
  },
  camera: {
    say: '按下快门：镜头一收一放，闪光灯闪一下',
    add: [{ layer: L('M12.5 2.75V1.5M13.5 3.25L14.5 2.25', { sw: D }) }],
    moves: { 1: { s: [0.82, 1.1, 1], o: [8, 9] }, a0: { ...hidden, a: [1, 1, 0] } }
  },
  lock: { say: '锁梁弹起，绕右脚转开', moves: { 0: { y: [-0.5, -0.5], r: [10, 10], o: [11.25, 6.5] } } },
  user: { say: '抬头', moves: { 0: { y: [-1.25, -1] }, 1: { y: [-0.5, -0.4] } } },
  'id-card': { say: '拿起来出示', moves: { all: { y: -1.25, r: -10 } } },
  building: {
    say: '天黑亮灯：窗户从下往上逐层亮起',
    moves: { 1: { a: [0.2, 1, 1, 1] }, 2: { a: [0.2, 0.2, 1, 1] }, 3: { a: [0.2, 0.2, 0.2, 1] } }
  },
  'book-open': { say: '翻过一页', copy: [{ of: [1, 3] }], moves: same(['c0', 'c1'], { sx: [-0.9, -1] }) },
  bell: { say: '绕顶钮摇响，摆几下停住', moves: { all: { r: [7, -6, 4, -2, 0], o: [8, 2] } } },
  trash: { say: '盖子绕左端掀开', moves: { 0: { y: [-0.25, -0.25], r: [-6, -6], o: [2, 4] } } },
  gift: { say: '盒盖连同蝴蝶结掀起', moves: same([0, 1, 2, 4], { y: [-1, -1], r: [-4, -4], o: [8, 7.75] }) },
  smile: { say: '笑得眯起眼', moves: { 1: { sy: 0.35, o: [8, 6.25] }, 2: { sx: 1.3, sy: 1.25, o: [8, 9.25] } } },
  'message-square': {
    say: '新消息弹出来，字一行行打出来',
    moves: { all: { s: [0.85, 1.08, 1], o: [1, 14] }, 1: { sx: [0, 1, 1], o: [4, 6.625] }, 2: { sx: [0, 0, 1], o: [4, 9.625] } }
  },
  clock: { say: '分针走一圈，时针走一格', moves: { 1: { r: 360 }, 2: { r: 30 } } },
  image: { say: '太阳从山后升起', moves: { 2: { y: [-2.5, -2] } } },
  ticket: { say: '票根撕开，往下垂落', moves: { 1: { y: [1.25, 1], r: [6, 4], o: [12, 2.5] } } },
  wallet: {
    say: '从钱包里抽出一张卡',
    add: [{ layer: L(rr(2.5, 4, 9, 6, 1)), at: 0 }],
    moves: { a0: { y: [-4, -4] } }
  },
  headphones: { say: '耳罩向里夹紧', moves: { 1: { x: 1 }, 2: { x: -1 } } },
  mic: {
    say: '开始收音，两侧画出声波',
    add: [{ layer: L('M1.75 0.75A4 4 0 0 0 1.75 3.5', { sw: D }) }, { layer: L('M14.25 0.75A4 4 0 0 1 14.25 3.5', { sw: D }) }],
    moves: { 0: { s: [1.06, 1], o: [8, 5] }, ...same(['a0', 'a1'], { rest: { a: 0, w: 0 }, a: 1, w: 1 }) }
  },
  cloud: { say: '风吹云散，太阳露出来', moves: { 0: { x: [0.75, 0.75], y: [-1, -1] }, 1: { x: [-0.75, -0.75] } } },
  'shopping-bag': { say: '提起来，绕提手晃一晃', moves: { all: { y: [-0.75, -0.75, -0.75, -0.75], r: [8, -6, 3, 0], o: [8, 2] } } },
  'battery-full': { say: '接上电，一格一格充满', moves: { 1: { a: [0.15, 1, 1, 1] }, 2: { a: [0.15, 0.15, 1, 1] }, 3: { a: [0.15, 0.15, 0.15, 1] } } },
  archive: { say: '盖子掀起', moves: { 0: { y: [-0.75, -0.75], r: [-4, -4], o: [8, 4] } } },
  mail: {
    // The closed envelope drops 1.5 to make room and a light sheet with a blue line (as in inbox
    // and file-text) rises out from behind it; the envelope's knockout keeps them a gap apart.
    say: '一封信从信封里抽出来',
    add: [{ layer: L(rr(3.5, 4, 9, 8, 1), Bt), at: 0 }, { layer: L(pill(5.5, 5.25, 5, D)), at: 1 }],
    moves: { ...same([0, 1], { y: [1.5, 1.5] }), ...same(['a0', 'a1'], { y: [-3.5, -3.5] }) }
  },
  printer: { say: '进纸，出纸', moves: { 0: { y: [0.75, 0] }, 2: { y: [1.2, 1.2] } } },
  home: { say: '门推开，又关上', moves: { 1: { sx: [-0.6, -0.6, 1], o: [6.5, 12] } } },
  search: { say: '放大镜四处移动查看', moves: { all: { x: [-0.75, 0.75, -0.4, 0], y: [0.75, -0.75, 0.4, 0] } } },
  settings: { say: '齿轮转半圈', moves: { 0: { r: 180 } } },
  tv: { say: '开机，画面从一条线展开', moves: { 1: { sy: [0.05, 1.08, 1], a: [0.3, 1, 1], o: [8, 6.75] } } },
  bookmark: { say: '丝带被往下拉', moves: { 1: { sy: [1.5, 1.35], o: [8.5, 1] } } },
  download: { say: '箭头从上往下长进盒子', moves: { 1: { sy: [0, 1], o: [8, 2] } } },
  upload: { say: '箭头从盒子里往上长出来', moves: { 1: { sy: [0, 1], o: [8, 11.5] } } },
  share: {
    say: '箭杆从盒子里画出来，画到头箭头弹出',
    moves: { 1: { w: [0, 1, 1] }, 2: { a: [0, 0, 1], s: [0.4, 0.4, 1], o: [11, 4.15] } }
  },
  'pencil': { say: '笔尖来回书写', moves: { all: { r: [-7, 5, -3, 1, 0], o: [2, 14] } } },
  heart: { say: '心跳', moves: { all: { s: [1.1, 0.94, 1.06, 1.06], o: [8, 8.5] } } },
  play: { say: '按下播放，三角向前一推', moves: { all: { s: [0.85, 1.05, 1] }, 1: { x: [1.5, 0] } } },
  phone: {
    say: '来电振动，两侧出现振动线',
    ms: 900,
    add: [{ layer: L('M1 5.5V10.5M15 5.5V10.5', { sw: K }) }],
    moves: { all: { r: [-12, 12, -10, 10, -6, 6, 0] }, a0: { ...hidden, a: [1, 1, 1, 1, 1, 1, 0] } }
  },
  laptop: { say: '屏幕合上一点再打开', moves: { 0: { sy: [0.25, 1.06, 1], o: [8, 10.5] } } },
  'map-pin': {
    say: '准星收紧锁定，波纹向外扩散',
    add: [{ layer: L(circ(8, 8, 2.75), { sw: D }), at: 2 }],
    moves: { 1: { s: 0.75 }, 2: { s: [1.5, 1.2] }, a0: { ...hidden, s: [1, 2.2], a: [1, 0] } }
  },
  music: { say: '音符随节拍跳起', moves: { all: { y: [-0.75, -0.6], r: [-6, -5] } } },
  link: { say: '链环拉开，连杆再接上', moves: { 0: { sx: [1.08, 1] }, 1: { sx: [0, 1] } } },
  'shopping-cart': { say: '向前推，车筐颠一下', moves: { all: { x: [0.75, -0.4, 0] }, 0: { y: [-0.75, 0] } } },
  'circle-check': { say: '对勾重新写一遍', moves: { 1: { w: [0, 1] } } },
  'circle-plus': { say: '先写竖，再写横', moves: { 1: { w: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  'circle-x': { say: '两笔划出叉号', moves: { 1: { w: [0, 1, 1] }, 2: { w: [0, 0, 1] } } },
  info: { say: '上面的点落下，竖笔被压得一沉', moves: { 2: { y: [-2.5, 0.5, 0] }, 1: { sy: [1, 0.85, 1], o: [8, 12.375] } } },
  'circle-alert': { say: '感叹号左右摇晃示警', ms: 800, moves: same([1, 2], { r: [-18, 14, -9, 5, 0], o: [8, 12.375] }) },
  'circle-help': { say: '问号歪向一边再回正', moves: same([1, 2], { r: [-22, 8, 0], o: [8, 12.375] }) },
  eye: { say: '眨眼，再左右看看', moves: { all: { sy: [0.08, 1] }, 1: { x: [0, 1.75, -1.75, 0] } } },
  flag: { say: '旗面迎风飘动', moves: { 1: { sx: [0.8, 1.08, 0.92, 1], sy: [1, 0.94, 1.04, 1], o: [4.5, 4] } } },
  key: { say: '插进锁孔，转一下', moves: { all: { x: [0.75, 0.75, 0.75], sy: [1, 0.35, 1] } } },
  'credit-card': { say: '刷一下卡', moves: { all: { x: [0.9, -0.9, 0] } } },
  shield: { say: '挡下一击，对勾重新写上', moves: { all: { y: [1, -0.5, 0], s: [0.9, 1.04, 1], o: [8, 15] }, 1: { w: [0, 0, 1] } } },
  lightbulb: {
    // The glass lights up in the primary, with a light glint over it in place of the blue one.
    say: '通电，整个灯泡亮起来',
    add: [
      { layer: L('M5.5 11V10.33A5 5 0 1 1 10.5 10.33V11Z'), at: 1 },
      { layer: L('M5.25 6A2.75 2.75 0 0 1 8 3.25', { sw: D, ...Bt }) }
    ],
    moves: same(['a0', 'a1'], { ...hidden, a: [1, 0.5, 1] })
  },
  video: {
    say: '开始录制：镜头伸出，录制灯闪烁',
    add: [{ layer: L(circ(4, 5.5, 1.125)) }],
    moves: { 1: { x: [1, 0.75] }, a0: { ...hidden, a: [1, 0, 1] } }
  },
  users: { say: '后面的人探出身来', moves: { 0: { x: [1, 0.75], y: [-1.25, -1] } } },
  globe: { say: '地球自转一圈', moves: { 1: { sx: [-1, 1] } } },
  calculator: { say: '按下按键，屏幕刷新', moves: { 2: { y: [0.5, 0] }, 1: { a: [0.3, 1, 0.3, 1] } } },
  history: { say: '箭头往回一拨，分针倒退一圈，时针倒退一格', moves: { ...same([0, 1], { r: [-20, 0] }), 2: { r: -360 }, 3: { r: -30 } } },
  'log-out': { say: '箭头从门里往外长出来', moves: { 1: { sx: [0, 1], o: [5, 8] } } },
  database: { say: '顶层弹开，又合上', moves: { 1: { y: [-0.9, 0] } } },
  server: { say: '硬盘读写，指示灯闪烁', moves: { 2: { x: [1, 0] }, 3: { a: [0.1, 1, 0.1, 1] } } },
  wifi: {
    // Blue copies of the two light bands fade in, inner then outer, over the light ones.
    say: '信号一格一格变满',
    add: [{ layer: { ...ICONS.wifi.layers[1], tone: 'a' }, at: 2 }, { layer: { ...ICONS.wifi.layers[0], tone: 'a' }, at: 1 }],
    moves: { 3: { s: [1.2, 1], o: [8, 13] }, a0: { ...hidden, a: [0, 1, 1] }, a1: { ...hidden, a: [0, 0, 1] } }
  },
  power: { say: '按下电源键，开机标记重新画上', moves: { all: { s: [0.88, 1.04, 1] }, 1: { w: [0, 1] } } },
  sliders: { say: '两个滑块各自滑到另一头', moves: { 1: { x: -3 }, 2: { x: 3 } } },
  copy: { say: '复制出来，两张纸错开', moves: { 1: { x: [-1, -0.9], y: [0.75, 0.75] }, 0: { x: [0.75, 0.75], y: [-0.75, -0.75] } } },
  clipboard: {
    say: '夹子夹紧，字一行行写上',
    moves: { 1: { y: [-0.75, 0] }, 2: { sx: [0, 1, 1], o: [5, 7.875] }, 3: { sx: [0, 0, 1], o: [5, 10.5] } }
  },
  inbox: {
    // A light sheet with a line drops in between the tray's back and its blue front, which hides
    // its lower edge.
    say: '一封信落进托盘',
    add: [{ layer: L(rr(4.5, 4.5, 7, 6, 1), { ...Bt, gap: W }), at: 1 }, { layer: L(pill(6, 6.5, 4, D)), at: 2 }],
    moves: { ...same(['a0', 'a1'], { rest: { a: 0, y: -5 }, a: 1, y: 0 }), 1: { y: [0, 0, 0.75, 0] } }
  },
  receipt: { say: '账单送出来，最后一行打上', moves: { all: { y: [-0.75, 0] }, 2: { sx: [0, 1], o: [5, 10.125] } } },
  package: { say: '箱盖连同胶带弹起', moves: same([0, 2], { y: [-1, -1], r: [-3, -3], o: [8, 3.75] }) },
  store: { say: '遮阳篷被风吹得一鼓一收', moves: { 0: { sy: [1.35, 0.95, 1.05, 1], o: [8, 2] } } },
  'lock-open': { say: '像挂在钥匙圈上一样转一圈', moves: { all: { sx: [-1, 1] } } },
  menu: {
    say: '菜单展开：三条线从左往右依次伸出',
    moves: { 0: { w: [0, 1, 1, 1] }, 1: { w: [0, 0, 1, 1] }, 2: { w: [0, 0, 0, 1] } }
  },
  grid: {
    // Blue copies of the tiles, one diagonal at a time, light up and go out again from the top
    // left to the bottom right.
    say: '高亮从左上角斜着扫过整个网格',
    add: [0, 1, 2, 3, 4].map((k) => ({
      layer: L([0, 1, 2].flatMap((i) => [0, 1, 2].filter((j) => i + j === k).map((j) => rr(2 + (i * 13) / 3, 2 + (j * 13) / 3, 10 / 3, 10 / 3, 1))).join(''))
    })),
    moves: Object.fromEntries([0, 1, 2, 3, 4].map((k) => [`a${k}`, { ...hidden, a: [0, 1, 2, 3, 4, 5].map((f) => (f === k ? 1 : 0)) }]))
  },
  list: {
    say: '列表项一行行排出来',
    moves: { 1: { sx: [0, 1, 1, 1], o: [4.5, 3.25] }, 2: { sx: [0, 0, 1, 1], o: [4.5, 8] }, 3: { sx: [0, 0, 0, 1], o: [4.5, 12.75] } }
  },
  sun: { say: '光芒先收拢，再向外放出，转过一格', moves: same([1, 2], { s: [0.75, 1], r: [0, 45] }) },
  'rotate-cw': {
    say: '圆弧顺时针画一圈，画到头箭头弹出',
    moves: { 0: { w: [0, 1, 1] }, 1: { a: [0, 0, 1], s: [0.4, 0.4, 1], o: [12.243, 3.757] } }
  },
  'chart-bar': {
    say: '柱子从底部依次长起来',
    moves: { 0: { sy: [0, 1, 1, 1], o: [8, 14] }, 1: { sy: [0, 0, 1, 1], o: [8, 14] }, 2: { sy: [0, 0, 0, 1], o: [8, 14] } }
  },
  'chart-pie': { say: '蓝色的一块从饼图中拉出来', moves: { 1: { x: 0.75, y: -0.75 } } },
  filter: {
    say: '三条线由长到短依次展开',
    moves: { 1: { sx: [0, 1, 1, 1] }, 2: { sx: [0, 0, 1, 1] }, 3: { sx: [0, 0, 0, 1] } }
  },
  briefcase: { say: '提起来，绕提手晃一晃', moves: { all: { y: [-0.75, -0.75, -0.75, -0.75], r: [4, -3, 1.5, 0], o: [8, 2] } } },
  keyboard: {
    say: '按键一排排按下去',
    moves: { 1: { y: [0.5, 0, 0, 0] }, 2: { y: [0, 0.5, 0, 0] }, 3: { y: [0, 0, 0.5, 0] } }
  },
  toggle: {
    // The knob slides to the right end; the track fills with blue and the knob turns light, as a
    // switch turned on.
    say: '开关拨到右边，轨道亮起，打开',
    add: [{ layer: L(pill(1, 4, 14, 8)), at: 1 }, { layer: L(circ(5, 8, 3), Bt) }],
    moves: { 1: { x: 6 }, a0: { ...hidden, a: 1 }, a1: { ...hidden, a: 1, x: 6 } }
  }
};

// Variants (GUIDE.md section 12): the badge does the motion, turning or scaling about its own
// centre; the object keeps still unless its own motion says the same thing.
const mark = (name) => { const ls = ICONS[name].layers; return { i: ls.length - 1, o: ls.at(-1).at }; };
const spin = (name) => { const { i, o } = mark(name); return { [i]: { r: 90, o } }; };
const draw = (name) => ({ [mark(name).i]: { w: [0, 1] } });
const twinkle = (name) => { const { i, o } = mark(name); return { [i]: { s: [0.5, 1.15, 1], r: [0, 90, 90], o } }; };
Object.assign(MOTION, {
  'folder-plus': { say: '加号转一圈，新建一个', moves: spin('folder-plus') },
  'calendar-check': { say: '对勾重新打上', moves: draw('calendar-check') },
  'clipboard-check': { say: '对勾重新打上', moves: draw('clipboard-check') },
  'user-check': { say: '抬头，对勾重新打上', moves: { ...MOTION.user.moves, ...draw('user-check') } },
  'search-sparkle': { say: '星光一闪', moves: twinkle('search-sparkle') },
  'image-sparkle': { say: '星光一闪', moves: twinkle('image-sparkle') },
  'bell-off': { say: '斜线重新划过', moves: draw('bell-off') },
  'eye-off': { say: '斜线重新划过', moves: draw('eye-off') }
});
