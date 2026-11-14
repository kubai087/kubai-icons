# Reviewing icons

How an icon is judged before it ships, and how to find the icons in the library that need
work. The rules themselves are in [`PROMPT.md`](../PROMPT.md); this page turns them into
measures and a checklist.

Every icon gets two passes:

1. **Measured**: `node tools/audit.mjs` checks what can be measured and gives each icon a
   score out of 100.
2. **Looked at**: the sheets from `node tools/check.mjs` are read against the visual
   checklist below. A measure only points at a likely problem; the sheet decides.

The measures live in [`scripts/measure.js`](../scripts/measure.js), which the skill's own
check (`scripts/check.mjs`, for a set made with the skill) and the library's audit share.

## Measured: `tools/audit.mjs`

```bash
npm run audit                             # every base icon
node tools/audit.mjs --only stool,yo-yo   # some icons
node tools/audit.mjs --category food --min 90
```

It runs several headless Chrome processes side by side (`--jobs n` sets how many).

It renders each icon's hover at 25 equal steps of real time (the runtime eases time, so equal
steps show how fast things really move), measures the rest and end poses in full and three moments in between for outlines (a peek, a spike or a bare edge that shows only mid-motion), and writes
`check-out/audit/report.json` and `report.md`, lowest score first. An icon starts at 100 and
loses the weight of each finding.

### Motion

| Finding | Weight | What it means | Usual fix |
| --- | --- | --- | --- |
| `error` | 40 | `draw()` throws, or writes NaN or `undefined` | Fix the code first. |
| `still` | 25 | Nothing moves on hover | Give it the action the object makes. |
| `faint` | 8 | Very few pixels ever change clearly from the rest pose | Move further, or move something larger. A thin needle can pass this and still read well; a pale colour change can fail to read and still pass, so look at the sheet too. |
| `jump` | 15 | One step changes far more than the steps around it, and the markup changes there too | Spread the change over real time with `wave()`, or tie it to a motion that hides it. |
| `abrupt` | 8 | Still moving fast at the end of the hover, so it stops dead | End every wave with zero speed: wrap the time in `settle()`, or use a `(1 - t) ** 2` envelope. |
| `leaves` | 10 | A frame reaches more than 2 units outside the canvas | Shorten the travel. |
| `endSize` | 6 | The end pose is much larger or smaller than the rest pose | Usually a rest pose that is too empty (see `small`). |

### Shape

| Finding | Weight | What it means |
| --- | --- | --- |
| `small` | 12 | The rest pose is smaller than its keyline, and takes up little room |
| `large` | 10 | The rest pose runs well past the 23 × 23 keyline |
| `offCentre` | 8 | The rest pose sits off the centre (15.5, 12.5). Leaving room for the hover (steam above a cup, toast popping up) is a reason to sit low; otherwise move the whole icon with `nudge()` from `icons/_place.js` |
| `light` / `heavy` | 6 | At 24px it covers much less or much more area than the rest of the set |
| `oneLayer` | 10 | No front piece and no large white content: only one layer. A symbol drawn on the plain disc or tile (play, check, bold, align) is exempt, as `PROMPT.md` section 3 allows |
| `strokeWidth` | 5 | A line drawn over a body uses a width other than 1.6, 2.2, 2.6, 2.0 or 1.2. A line that stands on its own and is the object itself (Wi-Fi arcs, fog) may be up to 2.8; an outlined tube (a wide outline-coloured stroke under a narrower fill stroke) is a body and is not counted |
| `tiny` | 6 | A mark or detail is under 2.4 units |
| `edgeGap` | 6 | A mark or white content leaves a sliver (under about 1.4 units) to the edge of its shape |
| `markGap` | 3 | Two marks leave a sliver between them |
| `text` | 3 | Uses `<text>`; allowed only when the glyph is the point, as on the calendar |
| `bare` | 20 | A coloured part meets the background with no outline along that edge. Usually a part that sticks out of another one but was drawn without an outline |
| `peek` | 12 | The outline of a part behind shows past the edge of the part in front: a short stretch of outline between two covered stretches |
| `joint` | 12 | A sharp corner of an outlined part sits just off another part's edge (more than 0, at most 1 away), and its mitred tip sticks out past every other part. The outlines meet in a notch or a spike |

`edgeGap` and `markGap` follow section 4 of `PROMPT.md` (touch, or keep 2 apart). The audit
flags gaps under about 1.4, because the reference icons keep content lines 1.5 from the
edge of a page. Gaps are measured from the painted shapes, so a container it picks can be
wrong; confirm each one on a sheet at `--scale 3`.

### Findings kept on purpose

Some findings describe what an icon means to do: a bin whose lid lifts off the canvas, a cup
that sits low to leave room for its steam, a date drawn as text. Once a finding is confirmed
on a sheet as intended, declare it on the icon with the reason:

```js
allow: { offCentre: 'it sits low to leave room for the steam rising on hover' },
```

An allowed finding costs no points and is listed apart, under "Allowed", with its reason, so
it stays visible. Declare only what has been looked at; never allow a finding to quiet it.

## Looked at: the visual checklist

Render the icon beside a few references:

```bash
node tools/check.mjs --only stool --with folder,mail,download
```

Read `sizes.png` first, then `sheet.png`, `frames.png` and `variants.png`.

**Object and shape**

- At 24px it reads as the object at once, and not as something else.
- It is drawn from the front or straight from the side, from rectangles, circles and arcs.
  A tilted or free-form object is a reason to look for a better one.
- It fills its keyline like its neighbours, and looks the same weight at 24px.
- Front pieces have their own top corners, so the back shows at the corners.
- Closed things are really closed; covered outlines never show through.
- Marks and white content touch an edge or keep 2 clear of it.
- No white shape without an outline sits on a light background.
- Where parts meet, there is one outline, with no notch, spike or sliver of outline sticking out.
  Check corners at `--scale 3`; a joint that looks clean at 24px can still show a spike when
  the icon is shown large.

**Motion**

- The action is one the object makes itself.
- The change is easy to see at 28px.
- It moves without a jump, and comes to rest smoothly.
- Nothing gets newly covered during the hover; rest and end poses are clean.
- A swing or a pulse ends exactly where its end pose says it should.

**Colour**

- Marks stay readable on light accents (`#F59E0B`) and on the soft palettes.

## Writing smooth motion

`wave(o, fn)` hands `fn` real time `t` from 0 to 1. Whatever `fn` returns at `t = 1` is held
from then on, so `fn` must arrive there slowly:

- A pulse or a full swing: use `bump(o)`, or write `Math.sin(Math.PI * settle(t))`.
  `settle(t)` leaves the first half alone and slows the second half to a stop.
- A damped swing: `(1 - t) * Math.sin(k * Math.PI * t)` with whole `k` already ends at zero
  speed; a cosine needs `(1 - t) ** 2`.
- A pulse inside a window, such as `span(t, a, b)`, needs `settle()` too when the window
  closes before the hover ends.
