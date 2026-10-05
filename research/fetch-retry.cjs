'use strict';

/**
 * 补抓：core 与 car-specialist 两个页面（第一次抓取时 core 被 WAF 拦了）。
 * 用法：node research/fetch-retry.cjs
 */

const { launch } = require('../tests/cdp-client.cjs');
const fs = require('fs');
const path = require('path');

const OUT = __dirname;
const GENERAL = 'https://www.nzta.govt.nz/driving-skills/learn-to-drive/roadcode/theory-test-questions/general-questions/';
const THEORY = 'https://www.nzta.govt.nz/driving-skills/learn-to-drive/roadcode/theory-test-questions/';

const PAGES = [
  ['core', GENERAL + 'core-questions'],
  ['car-specialist', THEORY + 'parking-questions-7'],
];

(async () => {
  const b = await launch({ width: 1440, height: 950 });
  try {
    for (const [name, url] of PAGES) {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await b.goto(url, 45000);
          await new Promise(r => setTimeout(r, 2500));   // 给 WAF 挑战留时间
          const html = await b.eval('document.documentElement.outerHTML');
          if (html.length < 50000) {
            console.log(`${name} 第 ${attempt} 次：只拿到 ${html.length} bytes，重试`);
            continue;
          }
          fs.writeFileSync(path.join(OUT, 'nzta-' + name + '.html'), html, 'utf8');
          const title = await b.eval('document.title');
          console.log(`${name} 第 ${attempt} 次成功：${html.length} bytes | ${title.slice(0, 60)}`);
          break;
        } catch (err) {
          console.log(`${name} 第 ${attempt} 次失败：${err && err.message}`);
        }
      }
    }
  } finally {
    await b.close();
  }
})();
