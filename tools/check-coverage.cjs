'use strict';

/**
 * 覆盖度体检：官方 46 个知识点，我们题库各覆盖了多少题。
 *
 * 用法：node tools/check-coverage.cjs
 *
 * 判定「有没有遗漏」靠的是知识点，不是题目总数 ——
 * 官方每道练习题下面都链到一个 road code 章节，去重得到 46 个知识点，
 * 这些就是考纲。某个知识点 0 题 = 明确遗漏。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data');

const topics = JSON.parse(fs.readFileSync(path.join(DATA, 'topics.json'), 'utf8')).topics;
const topicMap = JSON.parse(fs.readFileSync(path.join(DATA, 'topic-map.json'), 'utf8'));

const CATEGORY_FILES = [
  'core', 'behaviour', 'parking', 'emergencies',
  'road-position', 'intersection', 'sign', 'theory'
];

// 收集全部题目
const allQuestions = [];
const catName = {};
for (const f of CATEGORY_FILES) {
  const d = JSON.parse(fs.readFileSync(path.join(DATA, f + '.json'), 'utf8'));
  catName[f] = d.name;
  for (const q of d.questions) allQuestions.push({ ...q, _cat: f });
}

// 统计每个知识点的题数
const count = new Map();
const byCat = new Map();
for (const q of allQuestions) {
  // 题目自带的 topic 字段优先（新补的题直接在题上标注），
  // 否则回落到 topic-map.json（早期题目统一标注在这份映射里）
  const t = q.topic || topicMap[q.id];
  if (!t) continue;
  count.set(t, (count.get(t) || 0) + 1);
  if (!byCat.has(t)) byCat.set(t, new Set());
  byCat.get(t).add(q._cat);
}

const missing = [];
const thin = [];
const rows = topics.map(t => {
  const n = count.get(t.id) || 0;
  if (n === 0) missing.push(t);
  else if (n <= 2) thin.push(t);
  return { ...t, n };
});

console.log('='.repeat(78));
console.log('官方知识点覆盖度体检（' + topics.length + ' 个知识点 / ' + allQuestions.length + ' 道题）');
console.log('='.repeat(78));

let lastCat = null;
for (const r of rows.sort((a, b) => a.category.localeCompare(b.category) || a.n - b.n)) {
  if (r.category !== lastCat) {
    console.log('\n【' + r.category + ' · ' + (catName[r.category] || '') + '】');
    lastCat = r.category;
  }
  const flag = r.n === 0 ? '  ✗ 遗漏' : (r.n <= 2 ? '  ⚠ 偏少' : '');
  console.log('  ' + String(r.n).padStart(3) + ' 题  ' + r.id.padEnd(24) + ' ' + r.name + flag);
}

console.log('\n' + '-'.repeat(78));
console.log('知识点总数        ' + topics.length);
console.log('有覆盖的知识点    ' + rows.filter(r => r.n > 0).length);
console.log('完全遗漏（0 题）  ' + missing.length + (missing.length ? '  → ' + missing.map(m => m.id).join(', ') : ''));
console.log('覆盖偏少（≤2 题） ' + thin.length + (thin.length ? '  → ' + thin.map(m => m.id).join(', ') : ''));
console.log('未归类题目        ' + Object.values(topicMap).filter(v => !v).length);
console.log('-'.repeat(78));

if (missing.length) {
  console.log('\n⚠ 以下知识点在题库里完全没有题目，必须补：');
  for (const m of missing) console.log('   · ' + m.name + '（' + m.path + '）');
}

process.exit(missing.length ? 1 : 0);
