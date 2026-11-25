---
"kubai-icons": minor
"kubai-icons-react": minor
"kubai-icons-vue": minor
"kubai-icons-static": minor
---

Add the line style: 500 icons on a 24 grid in rounded strokes, each with a hover motion that acts out what it means. Import them from a `line` path, with the same names as the layered icons where both exist: `kubai-icons/line`, `kubai-icons-react/line`, `kubai-icons-vue/line`, `<kubai-icon icon-style="line">`, and `svg-line/` in `kubai-icons-static`. `strokeWidth` (`stroke-width` on the web component) takes 0.5 to 3 in steps of 0.25, default 2, and `variant` takes `outline`, `line-duo`, `fill` or `solid-tint`. The lines follow `color`; the light tone and the tint are mixed toward `--kl-bg` (white), or set with `--kl-light` and `--kl-fill`. `lineStill()` returns a standalone SVG of a line icon in fixed colours.
