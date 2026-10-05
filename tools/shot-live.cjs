'use strict';

/**
 * 抓页面截图，用于人工核对视觉效果（真实 Chrome + CDP）。
 *
 * 用法：
 *   node tools/shot-live.cjs                          # 默认抓线上
 *   BASE=http://127.0.0.1:8792 node tools/shot-live.cjs   # 抓 wrangler 本地预览
 *   node tools/shot-live.cjs --sheet                  # 抓标线对照页（需先跑 tools/markings-sheet.mjs）
 *
 * 截图落到 tests/shots/（已 gitignore）。
 */

const { launch } = require('../tests/cdp-client.cjs');

const BASE = process.env.BASE || 'https://nz-roadcode.2412.workers.dev';
const SHEET = process.argv.includes('--sheet');

const PAGES = SHEET
  ? [['markings-sheet', '/__sheet.html']]
  : [
      ['home', '/'],
      ['mark-yellow-solid', '/study/question/core-10/'],
      ['mark-yellow-box', '/study/question/road-position-24/'],
      ['mark-bridge', '/study/question/intersection-31/'],
      ['mark-zebra', '/study/question/intersection-14/'],
      ['category-road-position', '/study/road-position/'],
    ];

const SIZE = SHEET ? { width: 1240, height: 2300 } : { width: 1280, height: 940 };

(async () => {
  const b = await launch(SIZE);
  try {
    for (const [name, p] of PAGES) {
      await b.goto(BASE + p, 45000);
      await new Promise(r => setTimeout(r, SHEET ? 700 : 900));
      const file = SHEET ? `tests/shots/${name}.png` : `tests/shots/live-${name}.png`;
      await b.shot(file);
      console.log('截图', file, '<-', p);
    }
  } finally {
    await b.close();
  }
})();
