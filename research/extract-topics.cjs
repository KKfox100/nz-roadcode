'use strict';

/**
 * 从官方题目页里提取「题目 → 官方知识点链接」的对应关系，
 * 汇总出官方考纲覆盖的全部知识点（去重）。
 *
 * 官方每道题下面都有一条链接指向对应的 road code 章节，
 * 这就是考纲的最小知识点单元 —— 比题目数量更能说明"有没有遗漏"。
 *
 * 用法：node research/extract-topics.cjs
 */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const PREFIX = '/driving-skills/learn-to-drive/roadcode/general-road-code/';

const FILES = [
  ['core', 'core'],
  ['parking', 'parking'],
  ['emergency', 'emergency'],
  ['signs', 'signs'],
  ['road-position', 'road-position'],
  ['behaviour', 'behaviour'],
  ['intersection', 'intersection'],
  ['car-specialist', 'car-specialist'],
];

const all = new Map();   // topicUrl -> { title, files:Set, count }

for (const [file, label] of FILES) {
  const p = path.join(DIR, 'nzta-' + file + '.html');
  if (!fs.existsSync(p)) { console.log('缺文件', p); continue; }
  const html = fs.readFileSync(p, 'utf8')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');

  // 正文里所有指向 general-road-code 章节的链接。
  // 注意：href 是相对路径；同时要排掉站点导航（带 menu__link class）。
  const re = /<a(?![^>]*menu__link)[^>]*href="(\/driving-skills\/learn-to-drive\/roadcode\/general-road-code\/[^"#]+)[^"]*"[^>]*>([\s\S]{0,200}?)<\/a>/g;
  let m;
  while ((m = re.exec(html))) {
    const url = m[1].replace(/\/$/, '');
    const title = m[2].replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
    if (!title || title.length > 90) continue;
    if (!all.has(url)) all.set(url, { title, files: new Set(), count: 0 });
    const e = all.get(url);
    e.files.add(label);
    e.count++;
  }
}

const rows = [...all.entries()].map(([url, v]) => ({
  url,
  path: url.replace(PREFIX, ''),
  title: v.title,
  files: [...v.files],
  count: v.count,
})).sort((a, b) => a.path.localeCompare(b.path));

console.log('官方知识点总数（去重后）：' + rows.length + '\n');
for (const r of rows) {
  console.log('  ' + r.path.padEnd(52) + ' | ' + r.files.join(',').padEnd(14) + ' | ' + r.title.slice(0, 42));
}

fs.writeFileSync(path.join(DIR, 'official-topics.json'), JSON.stringify(rows, null, 2), 'utf8');
console.log('\n已写入 research/official-topics.json');
