/**
 * 生成「全部道路标线」的对照页，用于一次性人工核对图示质量。
 * 用法：node tools/markings-sheet.mjs   然后打开 dist/__sheet.html
 *
 * 为什么要这个：标线图单看一张很难判断比例对不对（条纹粗细、间隔、
 * 线宽是否够看清），排成网格横向对比才看得出哪个画歪了。
 */

import { markings, thumbnails } from '../src/images.mjs';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const cell = (k, fn, note) =>
  `<figure><div class="box">${fn()}</div><figcaption>${k}<em>${note}</em></figcaption></figure>`;

const full = Object.entries(markings).map(([k, fn]) => cell(k, fn, '完整图（单题页用）')).join('\n');
const thumb = Object.entries(thumbnails).map(([k, fn]) => cell(k, fn, '加粗版（列表缩略图用）')).join('\n');

writeFileSync(join(ROOT, 'dist', '__sheet.html'), `<!DOCTYPE html>
<html lang="zh"><head><meta charset="utf-8"><title>标线图示对照</title><style>
  body{margin:0;padding:26px;background:#faf9f7;font-family:system-ui,"Microsoft YaHei",sans-serif;color:#33302c}
  h1{font-size:19px;margin:0 0 6px}
  h2{font-size:14px;margin:30px 0 14px;color:#6b665f;font-weight:600}
  p.note{margin:0 0 8px;font-size:12px;color:#8b857d}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  figure{margin:0;background:#fff;border:1px solid #e7e3dd;border-radius:10px;padding:10px}
  .box svg{display:block;width:100%;height:auto;border-radius:6px}
  figcaption{margin-top:8px;font-size:11px;color:#5f5a54;text-align:center;line-height:1.5}
  figcaption em{display:block;font-style:normal;color:#a8a29a;font-size:10px}
</style></head><body>
<h1>道路标线（俯视图）共 ${Object.keys(markings).length} 个</h1>
<p class="note">上图：单题页用的完整尺寸。下图：列表缩略图用的加粗版（缩到 54px 宽时细线会消失，所以标线描边放大 3 倍）。</p>
<h2>完整尺寸</h2>
<div class="grid">${full}</div>
<h2>缩略图加粗版</h2>
<div class="grid">${thumb}</div>
</body></html>`);

console.log(`已写出 dist/__sheet.html（${Object.keys(markings).length} 个标线 × 2 版）`);
