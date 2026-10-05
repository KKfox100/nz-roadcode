'use strict';

/**
 * 抓 roadcode.kannz.com 的题目页，提取题干与配图 URL。
 * 用途：对照参考站的示意图，检查我们自绘的场景图在「车道位置 / 车辆朝向」上是否准确。
 *
 * 用法：node research/fetch-kannz.cjs 6001 6002 6003
 *      node research/fetch-kannz.cjs --range 6001-6060
 *
 * 输出：research/kannz.json（题干 + 图片 URL），图片另存到 research/kannz-img/
 */

const { launch } = require('../tests/cdp-client.cjs');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname);
const IMG_DIR = path.join(OUT_DIR, 'kannz-img');
const BASE = 'https://roadcode.kannz.com';

function parseIds(argv) {
  const ids = [];
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--range') {
      const [from, to] = argv[i + 1].split('-').map(Number);
      for (let n = from; n <= to; n += 1) ids.push(n);
      i += 1;
    } else if (/^\d+$/.test(a)) {
      ids.push(Number(a));
    }
  }
  return ids;
}

(async () => {
  const ids = parseIds(process.argv.slice(2));
  if (!ids.length) {
    console.error('用法: node research/fetch-kannz.cjs --range 6001-6060');
    process.exit(1);
  }
  fs.mkdirSync(IMG_DIR, { recursive: true });

  const b = await launch({ width: 1280, height: 1000 });
  const out = [];
  try {
    for (const id of ids) {
      const url = `${BASE}/study/question/${id}`;
      try {
        await b.goto(url, 30000);
      } catch (err) {
        console.log('跳过', id, err.message);
        continue;
      }
      await new Promise(r => setTimeout(r, 700));

      const info = await b.eval(`(() => {
        const pick = (sel) => (document.querySelector(sel) || {}).textContent || '';
        const imgs = Array.from(document.querySelectorAll('img')).map(i => ({
          src: i.currentSrc || i.src || '',
          alt: i.alt || '',
          w: i.naturalWidth, h: i.naturalHeight,
          cls: i.className || ''
        })).filter(i => i.src && !/logo|icon|avatar|wechat|qrcode|pay/i.test(i.src + ' ' + i.cls));
        return {
          title: document.title,
          text: (document.body.innerText || '').slice(0, 900),
          imgs: imgs
        };
      })()`);

      out.push({ id, url, ...info });
      console.log(`#${id} 图 ${info.imgs.length} 张  ${(info.text.split('\\n').find(l => l.trim().length > 6) || '').slice(0, 48)}`);
    }
  } finally {
    await b.close();
  }

  fs.writeFileSync(path.join(OUT_DIR, 'kannz.json'), JSON.stringify(out, null, 2));
  const total = out.reduce((n, o) => n + o.imgs.length, 0);
  console.log(`\n写出 research/kannz.json：${out.length} 题，共 ${total} 张图`);
})();
