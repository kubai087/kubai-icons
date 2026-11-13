// Moves a whole icon, so an object whose drawing sits off the canvas centre (a tool drawn on
// a slant, a kettle with its spout to one side) is centred by its outer bounds.
export const nudge = (def, dx, dy) => ({
  ...def,
  svg: (u) => `<g transform="translate(${dx} ${dy})">${def.svg(u)}</g>`
});
