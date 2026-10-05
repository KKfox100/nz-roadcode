/**
 * 生成「全部图形」的对照页，用于一次性人工核对图示质量。
 *
 * 用法：node tools/figure-sheet.mjs           → dist/__sheet.html（全部图形）
 *      node tools/figure-sheet.mjs --scenes   → dist/__scenes.html（只放场景图，2 列大图）
 *
 * 为什么要这个：
 *   - 标线图单看一张很难判断比例对不对（条纹粗细、间隔、线宽是否够看清）
 *   - 场景图单看一张很难判断车在不在正确车道 —— 叠加车道参考线后，
 *     车有没有压中心线、有没有占到对向车道，一眼就能看出来
 * 排成网格横向对比才看得出哪个画歪了。
 */

import { diagrams, markings, thumbnails, diagramGuides } from '../src/images.mjs';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SCENES_ONLY = process.argv.includes('--scenes');

const cell = (k, svg, note) =>
  `<figure><div class="box">${svg}</div><figcaption>${k}<em>${note}</em></figcaption></figure>`;

/** 在场景图上叠一层参考线：道路中心线（红）+ 路缘（蓝） */
const withGuides = (key) => {
  const svg = diagrams[key]();
  const guides = diagramGuides[key];
  if (!guides) return svg;
  const marks = guides.map(g => g.axis === 'v'
    ? `<line x1="${g.at}" y1="0" x2="${g.at}" y2="300" stroke="${g.color}" stroke-width="1.5" stroke-dasharray="6 5"/>`
    : `<line x1="0" y1="${g.at}" x2="400" y2="${g.at}" stroke="${g.color}" stroke-width="1.5" stroke-dasharray="6 5"/>`
  ).join('');
  return svg.replace('</svg>', `${marks}</svg>`);
};

const scene = Object.keys(diagrams).map(k =>
  cell(k, withGuides(k), '叠加参考线：红=道路中心线，蓝=路缘')).join('\n');

const full = Object.entries(markings).map(([k, fn]) => cell(k, fn(), '完整图（单题页用）')).join('\n');
const thumb = Object.entries(thumbnails).map(([k, fn]) => cell(k, fn(), '加粗版（列表缩略图用）')).join('\n');

const CSS = `
  body{margin:0;padding:26px;background:#faf9f7;font-family:system-ui,"Microsoft YaHei",sans-serif;color:#33302c}
  h1{font-size:19px;margin:0 0 6px}
  h2{font-size:14px;margin:30px 0 14px;color:#6b665f;font-weight:600}
  p.note{margin:0 0 8px;font-size:12px;color:#8b857d;line-height:1.7}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .grid.big{grid-template-columns:repeat(2,1fr);gap:22px}
  figure{margin:0;background:#fff;border:1px solid #e7e3dd;border-radius:10px;padding:10px}
  .box svg{display:block;width:100%;height:auto;border-radius:6px}
  figcaption{margin-top:8px;font-size:11px;color:#5f5a54;text-align:center;line-height:1.5}
  figcaption em{display:block;font-style:normal;color:#a8a29a;font-size:10px}
`;

const nScene = Object.keys(diagrams).length;
const nMark = Object.keys(markings).length;

if (SCENES_ONLY) {
  writeFileSync(join(ROOT, 'dist', '__scenes.html'), `<!DOCTYPE html>
<html lang="zh"><head><meta charset="utf-8"><title>路口场景图</title><style>${CSS}</style></head><body>
<h1>路口场景图（${nScene} 个）</h1>
<p class="note">红=道路中心线，蓝=路缘。新西兰靠左行驶：北行占西半幅、东行占北半幅、南行占东半幅、西行占南半幅。</p>
<div class="grid big">${scene}</div>
</body></html>`);
  console.log(`已写出 dist/__scenes.html（场景 ${nScene} 个，2 列大图）`);
} else {
  writeFileSync(join(ROOT, 'dist', '__sheet.html'), `<!DOCTYPE html>
<html lang="zh"><head><meta charset="utf-8"><title>图示对照</title><style>${CSS}</style></head><body>
<h1>图示对照</h1>
<p class="note">场景图叠了参考线，用来核对「车在不在正确车道」——新西兰靠左行驶，北行占西半幅、东行占北半幅。</p>

<h2>路口场景图（${nScene} 个）</h2>
<div class="grid">${scene}</div>

<h2>道路标线 · 完整尺寸（${nMark} 个）</h2>
<div class="grid">${full}</div>

<h2>道路标线 · 缩略图加粗版</h2>
<p class="note">列表里只有 54px 宽，标线描边放大 3 倍才看得见。</p>
<div class="grid">${thumb}</div>
</body></html>`);
  console.log(`已写出 dist/__sheet.html（场景 ${nScene} 个 + 标线 ${nMark} 个 × 2 版）`);
}
