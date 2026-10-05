'use strict';

/**
 * 把抓下来的参考站示意图（research/kannz-img/）拼成一张对照页，
 * 用于和我们的自绘场景图横向比较。只做人工核对，不参与构建。
 *
 * 用法：node research/contact-sheet.cjs   → tests/shots/__kannz.html
 *
 * ⚠️ 输出**故意不落在 dist/**：这张对照页内联了参考站的图片（版权归对方），
 * 放进 dist/ 就等于「跑完它再 deploy」会把对方的图推上线。放 tests/shots/
 * （已 gitignore）+ file:// 打开，从根上没有这条路径。
 */

const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, 'kannz-img');
const files = fs.readdirSync(IMG_DIR).filter(f => f.endsWith('.png')).sort();
if (!files.length) {
  console.error('research/kannz-img/ 里没有图片，先跑 research/fetch-kannz.cjs');
  process.exit(1);
}

const cells = files.map(f => {
  const b64 = fs.readFileSync(path.join(IMG_DIR, f)).toString('base64');
  const id = f.replace('-q.png', '');
  return `<figure><img src="data:image/png;base64,${b64}" alt="${id}"><figcaption>题 ${id}</figcaption></figure>`;
}).join('\n');

const OUT_DIR = path.join(__dirname, '..', 'tests', 'shots');
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, '__kannz.html'), `<!DOCTYPE html>
<html lang="zh"><head><meta charset="utf-8"><title>参考站示意图</title><style>
  body{margin:0;padding:24px;background:#faf9f7;font-family:system-ui,"Microsoft YaHei",sans-serif;color:#33302c}
  h1{font-size:18px;margin:0 0 16px}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  figure{margin:0;background:#fff;border:1px solid #e7e3dd;border-radius:10px;padding:8px}
  img{display:block;width:100%;height:auto;border-radius:6px}
  figcaption{margin-top:6px;font-size:11px;color:#8b857d;text-align:center}
</style></head><body>
<h1>roadcode.kannz.com 示意图（${files.length} 张）</h1>
<div class="grid">${cells}</div>
</body></html>`);

console.log(`已写出 tests/shots/__kannz.html（${files.length} 张）`);
