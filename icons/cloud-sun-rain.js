import { defineIcon, circ } from '../packages/core/src/kit.js';
import { showers, showersTarget, showersDraw } from './_showers.js';

export default defineIcon({
  name: 'cloud-sun-rain',
  zh: '阵雨',
  category: 'weather',
  tags: ['showers', 'rain', 'sun', 'sunny spells', 'weather', 'forecast', '晴转阵雨', '雨'],
  // Rain falls from a cloud with the sun behind it; on hover the sun comes out a little
  // while the drops fall away and new ones come out of the cloud.
  svg: (u) => showers(u, circ(10.2, 7.6, 5)),
  target: showersTarget,
  draw: showersDraw
});
