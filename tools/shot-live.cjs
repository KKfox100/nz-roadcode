'use strict';

/**
 * 抓页面截图，用于人工核对视觉效果（真实 Chrome + CDP，零依赖）。
 *
 * 用法：
 *   node tools/shot-live.cjs                                # 主站几个关键页面
 *   BASE=http://127.0.0.1:8794 node tools/shot-live.cjs     # 抓本地预览
 *   node tools/shot-live.cjs --questions                    # 4 道场景图题目的单题页
 *   node tools/shot-live.cjs --sheet                        # 图示对照页（先跑 figure-sheet.mjs）
 *   node tools/shot-live.cjs --scenes                       # 场景图 2 列大图
 *   node tools/shot-live.cjs --kannz                        # 参考站图片对照（先跑 research/contact-sheet.cjs）
 *
 * 视口可用 W / H 覆盖，例如 W=1180 H=700 node tools/shot-live.cjs --scenes
 * 截图落到 tests/shots/（已 gitignore）。
 */

const { launch } = require('../tests/cdp-client.cjs');

const BASE = process.env.BASE || 'https://nz-roadcode.2412.workers.dev';
const has = (f) => process.argv.includes(f);

const MODE = has('--sheet') ? 'sheet'
  : has('--scenes') ? 'scenes'
    : has('--questions') ? 'questions'
      : has('--kannz') ? 'kannz'
        : 'site';

const PAGES = {
  site: [
    ['home', '/'],
    ['mark-yellow-solid', '/study/question/core-10/'],
    ['mark-yellow-box', '/study/question/road-position-24/'],
    ['mark-bridge', '/study/question/intersection-31/'],
    ['mark-zebra', '/study/question/intersection-14/'],
    ['category-road-position', '/study/road-position/'],
    ['category-intersection', '/study/intersection/'],
  ],
  questions: [
    ['q-intersection-01', '/study/question/intersection-01/'],
    ['q-intersection-02', '/study/question/intersection-02/'],
    ['q-intersection-03', '/study/question/intersection-03/'],
    ['q-intersection-04', '/study/question/intersection-04/'],
  ],
  sheet: [['markings-sheet', '/__sheet.html']],
  scenes: [['scenes', '/__scenes.html']],
  kannz: [['kannz-sheet', '/__kannz.html']],
}[MODE];

/** 前三个模式是「对照页」，用大视口；其余按页面类型给默认值 */
const DEFAULT_SIZE = {
  sheet: [1240, 2300],
  scenes: [1240, 2300],
  kannz: [1240, 760],
  questions: [900, 900],
  site: [1280, 940],
}[MODE];

const SIZE = {
  width: Number(process.env.W || DEFAULT_SIZE[0]),
  height: Number(process.env.H || DEFAULT_SIZE[1]),
};

const PREFIX = (MODE === 'sheet' || MODE === 'scenes' || MODE === 'kannz' || MODE === 'questions') ? '' : 'live-';

(async () => {
  const b = await launch(SIZE);
  try {
    for (const [name, p] of PAGES) {
      await b.goto(BASE + p, 45000);
      await new Promise(r => setTimeout(r, 800));
      const file = `tests/shots/${PREFIX}${name}.png`;
      await b.shot(file);
      console.log('截图', file, '<-', p);
    }
  } finally {
    await b.close();
  }
})();
