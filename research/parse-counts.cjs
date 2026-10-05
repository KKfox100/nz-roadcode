'use strict';

/**
 * 解析 research/nzta-*.html，统计官方每类题目的实际数量。
 *
 * 官方页面用 <strong>P1</strong> 这样的编号标记每道题，
 * 前缀区分类别。取每个前缀下的最大编号 = 该类题数。
 */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;

/** 已知的题号前缀（从官方页面观察得到，可扩展） */
const KNOWN_PREFIXES = ['C', 'P', 'E', 'S', 'SM', 'RP', 'B', 'I', 'R', 'G', 'T', 'V', 'W', 'D', 'L', 'A', 'M', 'H', 'N', 'F', 'K', 'J', 'Q', 'U', 'X', 'Y', 'Z'];

function analyze(file) {
  const html = fs.readFileSync(path.join(DIR, file), 'utf8');
  // 去掉脚本/样式，避免误匹配
  const clean = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                    .replace(/<style[\s\S]*?<\/style>/gi, '');

  // 收集 <strong>XX12</strong> 形式。注意官方题号后面常跟 &nbsp; 或空格，
  // 必须一起吃掉，否则会漏掉大量题目（第一次统计就栽在这里）。
  const re = /<strong>\s*([A-Z]{1,3})(\d{1,3})(?:&nbsp;|&#160;|\s)*<\/strong>/g;
  const found = new Map();   // prefix -> Set(numbers)
  let m;
  while ((m = re.exec(clean))) {
    const p = m[1], n = parseInt(m[2], 10);
    if (!found.has(p)) found.set(p, new Set());
    found.get(p).add(n);
  }

  return found;
}

const files = fs.readdirSync(DIR).filter(f => /^nzta-.*\.html$/.test(f)).sort();

console.log('文件'.padEnd(30), '前缀分布');
console.log('-'.repeat(78));

for (const f of files) {
  const found = analyze(f);
  const parts = [];
  for (const [p, nums] of [...found.entries()].sort((a, b) => b[1].size - a[1].size)) {
    const max = Math.max(...nums);
    const gaps = [];
    for (let i = 1; i <= max; i++) if (!nums.has(i)) gaps.push(i);
    parts.push(`${p}: ${nums.size} 题（最大号 ${max}${gaps.length ? '，缺号 ' + gaps.join(',') : ''}）`);
  }
  console.log(f.replace('nzta-', '').replace('.html', '').padEnd(30), parts.join(' | ') || '（未匹配到题号）');
}
