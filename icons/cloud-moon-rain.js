import { defineIcon } from '../packages/core/src/kit.js';
import { crescent } from './_weather-nature.js';
import { showers, showersTarget, showersDraw } from './_showers.js';

export default defineIcon({
  name: 'cloud-moon-rain',
  zh: '夜间阵雨',
  category: 'weather',
  tags: ['night showers', 'rain', 'moon', 'night', 'weather', 'forecast', '夜雨', '雨'],
  // Rain falls from a cloud with a crescent moon behind it; on hover the moon comes out a
  // little while the drops fall away and new ones come out of the cloud.
  svg: (u) => showers(u, crescent([10.2, 8, 5.8], [13.8, 4.6, 4.8]), 'stroke-linejoin="round"'),
  target: showersTarget,
  draw: showersDraw
});
