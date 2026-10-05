'use strict';

/**
 * 抓线上页面截图，用于人工核对视觉效果。
 * 用法：node tools/shot-live.cjs
 */

const { launch } = require('../tests/cdp-client.cjs');

const BASE = process.env.BASE || 'https://nz-roadcode.2412.workers.dev';

const PAGES = [
  ['home', '/'],
  ['mark-yellow-solid', '/study/question/core-10/'],
  ['mark-yellow-box', '/study/question/road-position-24/'],
  ['mark-bridge', '/study/question/intersection-31/'],
  ['mark-zebra', '/study/question/intersection-14/'],
  ['category-road-position', '/study/road-position/'],
];

(async () => {
  const b = await launch({ width: 1280, height: 940 });
  try {
    for (const [name, p] of PAGES) {
      await b.goto(BASE + p, 45000);
      await new Promise(r => setTimeout(r, 900));
      await b.shot(`tests/shots/live-${name}.png`);
      console.log('截图', name, '<-', p);
    }
  } finally {
    await b.close();
  }
})();
