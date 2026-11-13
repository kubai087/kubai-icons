import { defineIcon } from '../packages/core/src/kit.js';
import { coin, coinSpin, glyph } from './_commerce-charts.js';

export default defineIcon({
  name: 'currency-dollar',
  zh: '美元',
  category: 'commerce',
  tags: ['dollar', 'usd', 'money', 'price', 'currency', '货币'],
  variants: ['plus', 'minus', 'check', 'x', 'sync'],
  // A coin struck with a dollar sign; on hover it spins once on its edge.
  svg: (u) => coin(u, glyph('M18.46 10.02C18.06 9.06 17.02 8.5 15.5 8.5C13.66 8.5 12.54 9.38 12.54 10.66C12.54 13.7 18.46 11.46 18.46 14.42C18.46 15.7 17.26 16.5 15.5 16.5C13.82 16.5 12.78 15.94 12.38 14.98M15.5 7.4V8.5M15.5 16.5V17.6')),
  target: (h) => ({ o: h ? 1 : 0 }),
  draw: coinSpin
});
