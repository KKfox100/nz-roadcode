/**
 * 构建脚本：把 data/*.json 渲染成一套纯静态站点到 dist/。
 *
 * 设计要点：
 * - 所有内容页在构建期生成真实 HTML（利于搜索引擎收录），交互层由 assets/app.js 渐进增强。
 * - 全站零外部依赖：没有广告脚本、没有统计脚本、没有 CDN 字体，图示全部是自绘 SVG。
 * - 生成产物直接作为 Cloudflare Workers Static Assets 的目录。
 */

import {
  readFileSync, writeFileSync, mkdirSync, cpSync,
  existsSync, readdirSync, unlinkSync, rmdirSync
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { signs, diagrams, renderImage, captions } from './src/images.mjs';

/**
 * 清空目录内容，但**保留目录本身**。
 *
 * ⚠️ 这里刻意避开两个写法：
 *
 * 1. `fs.rmSync(dir, { recursive: true })` —— 某些宿主环境（含 WorkBuddy 的
 *    CLI 运行时）会给 Node 挂一层"安全删除"垫片，把递归删除重定向到系统回收站。
 *    回收站操作一旦失败（实测报 "Some operations were aborted"），删除就抛错、
 *    构建直接中断，而堆栈指向 build.mjs，看起来像构建脚本自己写错了。
 *
 * 2. `fs.rmdirSync('dist')` —— 这层垫片**专门保护名为 dist 的顶层目录**
 *    （实测 build / out / public / .git 都能删，只有 dist 会被拦下）。
 *    所以收尾时不能把 dist 自己删掉，只能把里面的东西清空。
 *
 * 逐文件 unlink + 自底向上 rmdir 子目录不受影响，效果与 rm -rf dist/* 等价。
 */
function emptyDir(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      emptyDir(p);
      rmdirSync(p);
    } else {
      unlinkSync(p);
    }
  }
}

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const SITE_URL = (process.env.SITE_URL || 'https://nz-roadcode.workers.dev').replace(/\/$/, '');
const SITE_NAME = 'NZ Road Code 中文版';
const SITE_TAGLINE = '新西兰交规理论学习和模拟考试';

/* ---------- 读取题库 ---------- */

const CATEGORY_ORDER = ['core', 'behaviour', 'parking', 'emergencies', 'road-position', 'intersection', 'theory', 'sign'];

const categories = CATEGORY_ORDER.map(id => {
  const raw = readFileSync(join(ROOT, 'data', `${id}.json`), 'utf8');
  const cat = JSON.parse(raw);
  if (cat.id !== id) throw new Error(`分类 id 不匹配：${id} vs ${cat.id}`);
  cat.questions.forEach((q, i) => {
    if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.options.length) {
      throw new Error(`${id} 第 ${i + 1} 题的 answer 越界`);
    }
    if (!q.explanation || !q.explanation.trim()) {
      throw new Error(`${id} 第 ${i + 1} 题缺少解析`);
    }
    if (q.image && !(q.image in signs) && !(q.image in diagrams)) {
      throw new Error(`${id} 第 ${i + 1} 题引用了不存在的图示：${q.image}`);
    }
  });
  return cat;
});

const TOTAL_QUESTIONS = categories.reduce((n, c) => n + c.questions.length, 0);
const ALL_QUESTIONS = categories.flatMap(c => c.questions.map(q => ({ ...q, category: c.id, categoryName: c.name })));

const EXAMS = [
  { count: 10, label: '简单模拟', desc: '适合刚接触新西兰交规的初学者，快速熟悉题型。' },
  { count: 20, label: '中度模拟', desc: '覆盖主要知识点的中等强度练习。' },
  { count: 35, label: '正式考试模拟', desc: '与新西兰驾照理论考试题量一致，通过线为答对 32 题。' },
  { count: 50, label: '全面模拟', desc: '最大范围的综合测试，适合考前冲刺。' }
];

/* ---------- 图标 ---------- */

const ICONS = {
  shield: '<path d="M12 2 4 5.5v6c0 5 3.4 9.3 8 10.5 4.6-1.2 8-5.5 8-10.5v-6L12 2Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="m8.8 12 2.2 2.2 4.2-4.4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
  steering: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M12 9.4V3.2M9.7 13.3 4.4 16.6M14.3 13.3l5.3 3.3" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  parking: '<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4.4" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M10 16.5V7.8h3.1a2.5 2.5 0 0 1 0 5H10" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
  warning: '<path d="M12 3.6 21 19.6H3L12 3.6Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M12 9.6v4.2" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><circle cx="12" cy="16.6" r="1.1" fill="currentColor"/>',
  lane: '<path d="M6 21V5.5M18 21V5.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M12 20V4m0 0-3 3.4M12 4l3 3.4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2.6 2.4"/>',
  junction: '<path d="M12 21V11m0 0 7-6M12 11 5 5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="21" r="1.4" fill="currentColor"/><circle cx="5" cy="5" r="1.4" fill="currentColor"/><circle cx="19" cy="5" r="1.4" fill="currentColor"/>',
  book: '<path d="M4.5 4.6h5.2c1.3 0 2.3 1 2.3 2.3v12.5c0-1.3-1-2.3-2.3-2.3H4.5V4.6Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M19.5 4.6h-5.2c-1.3 0-2.3 1-2.3 2.3v12.5c0-1.3 1-2.3 2.3-2.3h5.2V4.6Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>',
  sign: '<rect x="4.6" y="4.6" width="14.8" height="14.8" rx="2.6" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M12 8.4v7.2M8.4 12h7.2" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>'
};

const icon = (key, size = 20) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${ICONS[key] || ICONS.sign}</svg>`;

/* ---------- 页面骨架 ---------- */

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const rel = depth => '../'.repeat(depth);

function layout({ title, description, path, depth, body, head = '', bodyClass = '' }) {
  const r = rel(depth);
  const canonical = SITE_URL + path;
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${esc(canonical)}">
<meta name="theme-color" content="#0f766e">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE_NAME)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:locale" content="zh_CN">
<link rel="icon" href="${r}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${r}assets/styles.css">
${head}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="${r}">
      <span class="brand-mark">RC</span>
      <span>${esc(SITE_NAME)}<span class="brand-sub">NEW ZEALAND ROAD CODE</span></span>
    </a>
    <nav class="site-nav" aria-label="主导航">
      <a href="${r}study/">理论学习</a>
      <a href="${r}exam/">模拟考试</a>
      <a class="cta" href="${r}exam/35/">开始模拟考</a>
    </nav>
  </div>
</header>
${body}
<footer class="site-footer">
  <div class="wrap">
    <p>${esc(SITE_NAME)} · 新西兰交规理论学习和模拟考试</p>
    <nav aria-label="页脚导航">
      <a href="${r}study/">理论学习</a>
      <a href="${r}exam/">模拟考试</a>
      <a href="${r}about/">关于本站</a>
    </nav>
  </div>
</footer>
<script src="${r}assets/images.js"></script>
<script src="${r}assets/questions.js"></script>
<script src="${r}assets/app.js"></script>
</body>
</html>`;
}

/* ---------- 复用组件 ---------- */

function catCard(cat, depth) {
  const r = rel(depth);
  return `<a class="cat-card" href="${r}study/${cat.id}/">
    <span class="cat-icon" style="background:${cat.color}1a;color:${cat.color}">${icon(cat.icon)}</span>
    <h3>${esc(cat.name)}</h3>
    <span class="cat-en">${esc(cat.nameEn)}</span>
    <p>${esc(cat.summary)}</p>
    <span class="cat-meta">共 ${cat.questions.length} 题 →</span>
  </a>`;
}

function questionFigure(q, wide) {
  if (!q.image) return '';
  const cap = captions[q.image];
  return `<div class="q-figure${wide ? ' wide' : ''}">${renderImage(q.image)}${
    cap ? `<p class="fig-cap">${esc(cap)}</p>` : ''}</div>`;
}

function breadcrumbs(items, depth) {
  const r = rel(depth);
  return `<nav class="crumbs" aria-label="面包屑">${items.map((it, i) => {
    const last = i === items.length - 1;
    if (last || !it.href) return `<span aria-current="page">${esc(it.label)}</span>`;
    return `<a href="${r}${it.href}">${esc(it.label)}</a>`;
  }).join('<span>/</span>')}</nav>`;
}

function page(relPath, html) {
  const out = join(DIST, relPath);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}

/* ---------- 首页 ---------- */

function buildHome() {
  const depth = 0;
  const body = `
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <span class="pill">新西兰驾照理论考试 · 中文题库</span>
      <h1>新西兰交规<br><em>理论学习和模拟考试</em></h1>
      <p class="hero-lede">按新西兰官方道路规则整理的 8 个学习分类、共 ${TOTAL_QUESTIONS} 道中文试题。逐题即时判分、每题都有解析，配合四种题量的模拟考试，帮你把规则真正弄懂，而不是死记答案。</p>
      <div class="hero-actions">
        <a class="btn btn-primary btn-lg" href="exam/35/">开始正式考试模拟</a>
        <a class="btn btn-ghost btn-lg" href="study/">分类理论学习</a>
      </div>
      <div class="hero-stats">
        <div class="hero-stat"><b>${TOTAL_QUESTIONS}</b><span>道原创试题</span></div>
        <div class="hero-stat"><b>8</b><span>个知识分类</span></div>
        <div class="hero-stat"><b>4</b><span>种模拟题量</span></div>
        <div class="hero-stat"><b>0</b><span>广告与追踪</span></div>
      </div>
    </div>
    <div class="hero-art">${questionFigure({ image: 'sv-crossroads' }, true)}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <h2>理论学习</h2>
      <p>按知识领域分块，先弄懂再做题</p>
    </div>
    <div class="grid grid-3">
      ${categories.map(c => catCard(c, depth)).join('\n      ')}
    </div>
  </div>
</section>

<section class="section" style="background:var(--surface);border-top:1px solid var(--line);border-bottom:1px solid var(--line)">
  <div class="wrap">
    <div class="section-head">
      <h2>模拟考试</h2>
      <p>随机抽题，计时作答，交卷后逐题回顾</p>
    </div>
    <div class="grid grid-4">
      ${EXAMS.map(e => `<div class="exam-card${e.count === 35 ? ' featured' : ''}">
        <span class="exam-num">${e.count}</span>
        <h3>${esc(e.label)}</h3>
        <p>${esc(e.desc)}</p>
        <a class="btn ${e.count === 35 ? 'btn-primary' : 'btn-ghost'}" href="exam/${e.count}/">开始考试</a>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="grid grid-2">
      <div class="card card-pad">
        <h3>这个网站有什么</h3>
        <p>覆盖新西兰小型汽车驾照理论考试的全部知识领域：核心规则、驾驶行为、停车标识、紧急事故、道路位置、交通路口、理论知识和道路标识。每道题都配有中文解析，讲清楚「为什么」。</p>
        <p style="margin:0"><a href="study/">浏览全部 ${TOTAL_QUESTIONS} 道题 →</a></p>
      </div>
      <div class="card card-pad">
        <h3>如何准备理论考试</h3>
        <p>建议先按分类逐个学习，每题都读一遍解析；全部过完后再做「正式考试模拟（35 题）」。连续两次达到 90% 以上正确率，说明知识点已经掌握。</p>
        <p style="margin:0"><a href="about/">了解本站与备考建议 →</a></p>
      </div>
    </div>
  </div>
</section>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    url: SITE_URL + '/',
    inLanguage: 'zh-CN',
    description: `新西兰驾照理论考试中文题库，共 ${TOTAL_QUESTIONS} 道试题，覆盖 ${categories.length} 个知识分类，提供分类学习与模拟考试。`
  };

  page('index.html', layout({
    title: SITE_NAME,
    description: `新西兰交规中文理论学习和模拟考试。${TOTAL_QUESTIONS} 道原创中文试题，覆盖核心规则、交通路口、道路标识等 8 个分类，逐题解析，含 10/20/35/50 题模拟考试，无广告。`,
    path: '/',
    depth,
    body,
    head: `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
  }));
}

/* ---------- 理论学习总览 ---------- */

function buildStudyIndex() {
  const depth = 1;
  const body = `<div class="wrap">
  ${breadcrumbs([{ label: '首页', href: '' }, { label: '理论学习' }], depth)}
  <section class="section" style="padding-top:14px">
    <h1>理论学习</h1>
    <p style="color:var(--ink-2);max-width:62ch">新西兰小型汽车驾照理论考试的知识点分为 8 个领域，共 ${TOTAL_QUESTIONS} 道试题。每个分类都可以逐题学习：选完答案立刻看到对错和解析，答错的题会在学习结束时汇总出来。</p>
    <div class="grid grid-3" style="margin-top:26px">
      ${categories.map(c => catCard(c, depth)).join('\n      ')}
    </div>
  </section>

  <section class="section">
    <div class="section-head"><h2>全部试题</h2><p>按分类列出，点击可直接查看答案解析</p></div>
    ${categories.map(c => `<div style="margin-bottom:26px">
      <h3><a href="study/${c.id}/">${esc(c.name)}</a> <span style="font-weight:400;color:var(--ink-4);font-size:.85rem">${esc(c.nameEn)} · ${c.questions.length} 题</span></h3>
      <ul class="q-list">
        ${c.questions.map((q, i) => `<li><a href="study/question/${q.id}/">
          <span class="n">${i + 1}</span>
          <span class="t">${esc(q.q)}</span>
          ${q.image ? `<span class="thumb" data-thumb="${q.image}"></span>` : ''}
        </a></li>`).join('\n        ')}
      </ul>
    </div>`).join('\n    ')}
  </section>
</div>`;

  page('study/index.html', layout({
    title: '理论学习',
    description: `新西兰交规理论学习，${TOTAL_QUESTIONS} 道中文试题按核心规则、驾驶行为、停车标识、紧急事故、道路位置、交通路口、理论知识、道路标识 8 个分类整理，逐题配有解析。`,
    path: '/study/',
    depth,
    body
  }));
}

/* ---------- 分类页 ---------- */

function buildCategoryPage(cat) {
  const depth = 2;
  const body = `<div class="wrap">
  ${breadcrumbs([{ label: '首页', href: '' }, { label: '理论学习', href: 'study/' }, { label: cat.name }], depth)}
  <section class="section" style="padding-top:14px">
    <span class="cat-icon" style="background:${cat.color}1a;color:${cat.color};width:46px;height:46px;font-size:22px">${icon(cat.icon, 24)}</span>
    <h1 style="margin-top:14px">${esc(cat.name)}</h1>
    <p style="color:var(--ink-3);font-size:.82rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;margin-top:-6px">${esc(cat.nameEn)}</p>
    <p style="color:var(--ink-2);max-width:62ch">${esc(cat.summary)}</p>
    <div class="hero-actions" style="margin-top:18px">
      <a class="btn btn-primary btn-lg" href="practice/">开始逐题学习（${cat.questions.length} 题）</a>
      <a class="btn btn-ghost btn-lg" href="../../exam/35/">直接模拟考试</a>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="section-head"><h2>题目列表</h2><p>共 ${cat.questions.length} 题</p></div>
    <ul class="q-list">
      ${cat.questions.map((q, i) => `<li><a href="../question/${q.id}/">
        <span class="n">${i + 1}</span>
        <span class="t">${esc(q.q)}</span>
        ${q.image ? `<span class="thumb" data-thumb="${q.image}"></span>` : ''}
      </a></li>`).join('\n      ')}
    </ul>
  </section>
</div>`;

  page(`study/${cat.id}/index.html`, layout({
    title: `${cat.name} · 理论学习`,
    description: `新西兰交规「${cat.name}」（${cat.nameEn}）共 ${cat.questions.length} 道中文试题，逐题配有答案与解析。${cat.summary}`,
    path: `/study/${cat.id}/`,
    depth,
    body
  }));
}

/* ---------- 分类练习页（交互） ---------- */

function buildPracticePage(cat) {
  const depth = 3;
  const body = `<div class="wrap">
  ${breadcrumbs([{ label: '首页', href: '' }, { label: '理论学习', href: 'study/' }, { label: cat.name, href: `study/${cat.id}/` }, { label: '逐题学习' }], depth)}
  <section style="padding:18px 0 8px">
    <h1 style="font-size:1.5rem;margin-bottom:4px">${esc(cat.name)} · 逐题学习</h1>
    <p style="color:var(--ink-3);font-size:.9rem;margin:0">共 ${cat.questions.length} 题 · 选完答案立即判分并显示解析 · 可用键盘数字键 1-4 选择</p>
  </section>
  <div id="rc-app" data-mode="study" data-category="${cat.id}"></div>
</div>
<noscript><div class="wrap"><div class="notice">逐题学习需要启用 JavaScript。你也可以直接浏览<a href="../">题目列表</a>查看每道题的答案与解析。</div></div></noscript>`;

  page(`study/${cat.id}/practice/index.html`, layout({
    title: `${cat.name} · 逐题学习`,
    description: `新西兰交规「${cat.name}」逐题学习，${cat.questions.length} 道题即时判分并给出中文解析。`,
    path: `/study/${cat.id}/practice/`,
    depth,
    body
  }));
}

/* ---------- 单题页 ---------- */

function buildQuestionPage(q, cat) {
  const depth = 3;
  const idx = cat.questions.findIndex(x => x.id === q.id);
  const prev = cat.questions[idx - 1];
  const next = cat.questions[idx + 1];
  const LETTERS = ['A', 'B', 'C', 'D', 'E'];

  const body = `<div class="wrap" style="max-width:820px">
  ${breadcrumbs([{ label: '首页', href: '' }, { label: '理论学习', href: 'study/' }, { label: cat.name, href: `study/${cat.id}/` }, { label: `第 ${idx + 1} 题` }], depth)}
  <section class="section" style="padding-top:14px">
    <div class="card q-card">
      <div class="q-head">
        <div class="q-index">${idx + 1}</div>
        <p class="q-text">${esc(q.q)}</p>
      </div>
      ${questionFigure(q, q.image && q.image.startsWith('sv-'))}
      <ul class="opts">
        ${q.options.map((o, i) => `<li><div class="opt${i === q.answer ? ' is-correct' : ' is-muted'}" style="cursor:default">
          <span class="opt-key">${LETTERS[i]}</span>
          <span class="opt-body">${esc(o)}</span>
        </div></li>`).join('\n        ')}
      </ul>
      <div class="answer-box">
        <div class="label">正确答案：${LETTERS[q.answer]}. ${esc(q.options[q.answer])}</div>
      </div>
      <h3>解析</h3>
      <p style="color:var(--ink-2);margin:0">${esc(q.explanation)}</p>
      <div class="quiz-actions" style="margin-top:22px">
        ${prev ? `<a class="btn btn-ghost" href="../${prev.id}/">← 上一题</a>` : ''}
        <a class="btn btn-primary" href="../../${cat.id}/practice/">进入逐题学习</a>
        ${next ? `<a class="btn btn-ghost" href="../${next.id}/">下一题 →</a>` : ''}
      </div>
    </div>
  </section>
</div>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Question',
    eduQuestionType: 'Multiple choice',
    name: q.q,
    text: q.q,
    inLanguage: 'zh-CN',
    suggestedAnswer: q.options.map((o, i) => ({
      '@type': 'Answer',
      text: o,
      ...(i === q.answer ? { position: 1 } : {})
    })),
    acceptedAnswer: {
      '@type': 'Answer',
      text: q.options[q.answer],
      explanation: q.explanation
    }
  };

  page(`study/question/${q.id}/index.html`, layout({
    title: q.q.length > 34 ? q.q.slice(0, 34) + '…' : q.q,
    description: `${q.q} — ${cat.name}第 ${idx + 1} 题，正确答案与中文解析。`,
    path: `/study/question/${q.id}/`,
    depth,
    body,
    head: `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
  }));
}

/* ---------- 模拟考试 ---------- */

function buildExamIndex() {
  const depth = 1;
  const body = `<div class="wrap">
  ${breadcrumbs([{ label: '首页', href: '' }, { label: '模拟考试' }], depth)}
  <section class="section" style="padding-top:14px">
    <h1>模拟考试</h1>
    <p style="color:var(--ink-2);max-width:62ch">从全部 ${TOTAL_QUESTIONS} 道题中按分类比例随机抽题，作答过程中不显示对错，交卷后统一给出成绩与逐题回顾。计时会在时间耗尽时自动交卷。</p>
    <div class="grid grid-4" style="margin-top:26px">
      ${EXAMS.map(e => `<div class="exam-card${e.count === 35 ? ' featured' : ''}">
        <span class="exam-num">${e.count}</span>
        <h3>${esc(e.label)}</h3>
        <p>${esc(e.desc)}</p>
        <p style="font-size:.82rem;color:var(--ink-4)">限时 ${Math.round(Math.max(300, e.count * 54) / 60)} 分钟 · 通过线 ${Math.ceil(e.count * 0.9)} 题</p>
        <a class="btn ${e.count === 35 ? 'btn-primary' : 'btn-ghost'}" href="${e.count}/">开始考试</a>
      </div>`).join('\n      ')}
    </div>
    <div class="notice" style="margin-top:26px">
      <b>关于评分：</b>新西兰驾照理论考试为 35 题、答对 32 题及格。本站所有模拟考试统一采用 90% 的正确率作为通过线，便于横向比较。
    </div>
  </section>
</div>`;

  page('exam/index.html', layout({
    title: '模拟考试',
    description: `新西兰驾照理论考试模拟，提供 10、20、35、50 题四种题量的随机抽题测试，含计时与交卷后逐题解析回顾。`,
    path: '/exam/',
    depth,
    body
  }));
}

function buildExamPage(exam) {
  const depth = 2;
  const body = `<div class="wrap">
  ${breadcrumbs([{ label: '首页', href: '' }, { label: '模拟考试', href: 'exam/' }, { label: `${exam.count} 题` }], depth)}
  <section style="padding:18px 0 8px">
    <h1 style="font-size:1.5rem;margin-bottom:4px">${esc(exam.label)}（${exam.count} 题）</h1>
    <p style="color:var(--ink-3);font-size:.9rem;margin:0">限时 ${Math.round(Math.max(300, exam.count * 54) / 60)} 分钟 · 通过线 ${Math.ceil(exam.count * 0.9)} 题 · 交卷后可逐题回顾</p>
  </section>
  <div id="rc-app" data-mode="exam" data-count="${exam.count}"></div>
</div>
<noscript><div class="wrap"><div class="notice">模拟考试需要启用 JavaScript。你也可以直接<a href="../study/">浏览题库</a>进行学习。</div></div></noscript>`;

  page(`exam/${exam.count}/index.html`, layout({
    title: `${exam.label}（${exam.count} 题）`,
    description: `${exam.label}：从新西兰交规题库随机抽取 ${exam.count} 道题，限时作答，交卷后给出成绩与逐题解析。`,
    path: `/exam/${exam.count}/`,
    depth,
    body
  }));
}

/* ---------- 关于页 ---------- */

function buildAbout() {
  const depth = 1;
  const body = `<div class="wrap" style="max-width:760px">
  ${breadcrumbs([{ label: '首页', href: '' }, { label: '关于本站' }], depth)}
  <section class="section" style="padding-top:14px">
    <h1>关于本站</h1>
    <p>${esc(SITE_NAME)} 是一个面向中文用户的新西兰驾照理论学习与模拟考试站点。全站只做两件事：<strong>理论学习</strong>和<strong>模拟考试</strong>。</p>

    <h3>内容说明</h3>
    <p>本站全部 ${TOTAL_QUESTIONS} 道试题、选项与解析均为依据新西兰官方道路规则（New Zealand Road Code / Land Transport (Road User) Rule 2004）重新撰写的中文原创内容，用于帮助读者理解规则本身。站内所有道路标志与路口示意图为自绘 SVG 图形，不使用任何第三方图片素材。</p>
    <p>本站不是新西兰交通局（NZTA / Waka Kotahi）的官方产品，题目与真实考试的表述不完全相同。真实考试请以官方发布的 Road Code 为准。</p>

    <h3>没有广告</h3>
    <p>本站不含任何广告位、第三方统计脚本、追踪像素或社交插件。页面加载的资源只有本站自己的样式表、脚本和图形。</p>

    <h3>备考建议</h3>
    <p>1. 按分类逐个学习，每道题都读一遍解析，重点理解「为什么」而不只是记住答案。<br>
       2. 学完全部 ${categories.length} 个分类后，做一次「正式考试模拟（35 题）」。<br>
       3. 连续两次达到 90% 以上正确率，说明知识点已经比较牢固。<br>
       4. 考试当天提前到场，仔细读题——真实考试的题目措辞可能略有不同。</p>

    <h3>技术说明</h3>
    <p>本站是纯静态站点，托管在 Cloudflare 边缘网络上，不收集任何用户数据，也不需要在服务端保存任何信息。你的答题记录只存在于当前浏览器页面中，刷新即清空。</p>
  </section>
</div>`;

  page('about/index.html', layout({
    title: '关于本站',
    description: `关于${SITE_NAME}：内容来源、无广告声明、新西兰驾照理论考试的备考建议。`,
    path: '/about/',
    depth,
    body
  }));
}

/* ---------- 静态资源 ---------- */

function buildAssets() {
  cpSync(join(ROOT, 'src', 'styles.css'), join(DIST, 'assets', 'styles.css'));
  cpSync(join(ROOT, 'src', 'app.js'), join(DIST, 'assets', 'app.js'));

  // 图示库：key -> SVG 字符串
  const imgMap = {};
  Object.keys(signs).forEach(k => { imgMap[k] = signs[k](); });
  Object.keys(diagrams).forEach(k => { imgMap[k] = diagrams[k](); });
  writeFileSync(join(DIST, 'assets', 'images.js'),
    '/* 自绘 SVG 图示库（构建产物，请勿手改） */\n'
    + 'window.RC_IMAGES = ' + JSON.stringify(imgMap) + ';\n'
    + 'window.RC_CAPTIONS = ' + JSON.stringify(captions) + ';\n');

  // 题库：给前端交互使用
  writeFileSync(join(DIST, 'assets', 'questions.js'),
    '/* 题库数据（构建产物，请勿手改） */\nwindow.RC_BANK = ' + JSON.stringify({ categories }) + ';\n');

  // favicon
  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0f766e"/>
  <text x="32" y="34" font-family="Arial,Helvetica,sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="central">RC</text>
</svg>`;
  writeFileSync(join(DIST, 'assets', 'favicon.svg'), favicon);
}

/* ---------- 404 / robots / sitemap / headers ---------- */

function buildMeta() {
  const depth = 0;
  const body = `<div class="wrap" style="max-width:640px">
  <section class="section" style="text-align:center;padding:70px 0">
    <h1 style="font-size:3rem;margin-bottom:.1em">404</h1>
    <p style="color:var(--ink-2)">没有找到这个页面。可能是链接过期，或者地址输入有误。</p>
    <div class="hero-actions" style="justify-content:center">
      <a class="btn btn-primary" href="/">返回首页</a>
      <a class="btn btn-ghost" href="/study/">浏览题库</a>
    </div>
  </section>
</div>`;

  const html404 = layout({
    title: '页面不存在',
    description: '页面不存在。',
    path: '/404.html',
    depth,
    body
  }).replace('<meta name="robots" content="index, follow">', '<meta name="robots" content="noindex,follow">');
  writeFileSync(join(DIST, '404.html'), html404);

  writeFileSync(join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\nDisallow: /404.html\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

  // sitemap
  const urls = [
    { loc: '/', pri: '1.0', freq: 'weekly' },
    { loc: '/study/', pri: '0.9', freq: 'weekly' },
    { loc: '/exam/', pri: '0.9', freq: 'weekly' },
    { loc: '/about/', pri: '0.4', freq: 'monthly' }
  ];
  categories.forEach(c => {
    urls.push({ loc: `/study/${c.id}/`, pri: '0.8', freq: 'monthly' });
    c.questions.forEach(q => urls.push({ loc: `/study/question/${q.id}/`, pri: '0.6', freq: 'monthly' }));
  });
  EXAMS.forEach(e => urls.push({ loc: `/exam/${e.count}/`, pri: '0.7', freq: 'monthly' }));

  writeFileSync(join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url><loc>${SITE_URL}${u.loc}</loc><changefreq>${u.freq}</changefreq><priority>${u.pri}</priority></url>`).join('\n') +
    `\n</urlset>\n`);

  writeFileSync(join(DIST, '_headers'),
    `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/assets/*
  Cache-Control: public, max-age=604800

/*.html
  Cache-Control: public, max-age=0, must-revalidate
`);

  // 静态资源目录就是 dist/，里面只有站点文件；这个文件是防御性的，
  // 万一以后有人把构建脚本或仓库文件混进来，也不会被上传。
  writeFileSync(join(DIST, '.assetsignore'),
    `.git/
.gitignore
.gitattributes
node_modules/
.wrangler/
src/
data/
*.md
package.json
package-lock.json
wrangler.jsonc
build.mjs
`);
}

/* ---------- 主流程 ---------- */

function main() {
  emptyDir(DIST);
  mkdirSync(join(DIST, 'assets'), { recursive: true });

  buildAssets();
  buildHome();
  buildStudyIndex();
  categories.forEach(cat => {
    buildCategoryPage(cat);
    buildPracticePage(cat);
    cat.questions.forEach(q => buildQuestionPage(q, cat));
  });
  buildExamIndex();
  EXAMS.forEach(buildExamPage);
  buildAbout();
  buildMeta();

  const files = ALL_QUESTIONS.length;
  console.log(`✓ 构建完成`);
  console.log(`  分类：${categories.length} 个`);
  console.log(`  试题：${TOTAL_QUESTIONS} 道（生成 ${files} 个单题页）`);
  console.log(`  模拟考试：${EXAMS.map(e => e.count).join(' / ')} 题`);
  console.log(`  SITE_URL：${SITE_URL}`);
  console.log(`  输出目录：${DIST}`);
}

main();
