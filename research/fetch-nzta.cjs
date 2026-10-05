'use strict';

/**
 * 抓取 NZTA 官方理论考试题目页，用于核对题库覆盖度。
 *
 * 直接 curl / WebFetch 会被 Incapsula WAF 拦（有的页面能过、有的不行），
 * 所以走真实 Chrome。抓下来的 HTML 存到 research/ 下，供本地解析统计。
 *
 * 用法：node research/fetch-nzta.cjs
 */

const { launch } = require('../tests/cdp-client.cjs');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'research');

const GENERAL = 'https://www.nzta.govt.nz/driving-skills/learn-to-drive/roadcode/theory-test-questions/general-questions/';
const THEORY = 'https://www.nzta.govt.nz/driving-skills/learn-to-drive/roadcode/theory-test-questions/';
const ROADCODE = 'https://www.nzta.govt.nz/driving-skills/learn-to-drive/roadcode/general-road-code/';

/** [本地文件名, URL] —— 官方 7 类 general 题 + car specialist */
const PAGES = [
  ['core', GENERAL + 'core-questions'],
  ['parking', GENERAL + 'parking-questions'],
  ['emergency', GENERAL + 'emergency-questions'],
  ['signs', GENERAL + 'signs-and-markings-questions'],
  ['road-position', GENERAL + 'parking-questions-4'],
  ['behaviour', GENERAL + 'parking-questions-5'],
  ['intersection', GENERAL + 'parking-questions-6'],
  ['car-specialist', THEORY + 'parking-questions-7'],

  // 标志章节：这里才有官方标志图，需要拿到图片 URL 与分类
  ['signs-main-types', ROADCODE + 'about-signs/main-types-of-signs'],
  ['signs-vehicle-mounted', ROADCODE + 'about-signs/vehicle-mounted-signs'],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await launch({ width: 1440, height: 950 });
  try {
    for (const [name, url] of PAGES) {
      try {
        await b.goto(url, 45000);
        // 等 WAF 挑战 / 懒加载过去
        await new Promise(r => setTimeout(r, 1200));
        const info = await b.eval(`(() => ({
          html: document.documentElement.outerHTML,
          title: document.title,
          bodyLen: (document.body ? document.body.innerText : '').length,
        }))()`);

        const file = path.join(OUT, 'nzta-' + name + '.html');
        fs.writeFileSync(file, info.html, 'utf8');
        console.log(
          name.padEnd(22),
          String(info.html.length).padStart(7), 'bytes |',
          String(info.bodyLen).padStart(6), 'text |',
          info.title.slice(0, 60)
        );
      } catch (err) {
        console.log(name.padEnd(22), '失败:', err && err.message);
      }
    }
  } finally {
    await b.close();
  }
})();
