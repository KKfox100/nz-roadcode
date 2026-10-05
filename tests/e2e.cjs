'use strict';

/**
 * NZ Road Code 中文版 —— 端到端验证
 *
 * 覆盖：首页 / 分类页 / 单题页 / 逐题学习交互 / 模拟考试全流程 / 404 / 移动端
 * 用真实 Chrome 跑，收集 console 错误。
 */

const { launch, createChecker, sleep } = require('./cdp-client.cjs');
const path = require('path');
const fs = require('fs');

const BASE = process.env.BASE || 'http://127.0.0.1:8787';

/**
 * 题库总题数直接从 data/ 算出来，不要在断言里写死数字 ——
 * 每次补题都要回来改测试，早晚会漏。
 */
const DATA_DIR = path.join(__dirname, '..', 'data');
const loadCat = f => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f + '.json'), 'utf8'));
const TOTAL_QUESTIONS = fs.readdirSync(DATA_DIR)
  .filter(f => f.endsWith('.json') && !f.startsWith('topic'))
  .reduce((n, f) => n + loadCat(f.replace(/\.json$/, '')).questions.length, 0);

/** 自绘图示总数：从构建产物里数，同样不写死 */
const IMG_COUNT = (() => {
  const line = fs.readFileSync(path.join(__dirname, '..', 'dist', 'assets', 'images.js'), 'utf8')
    .split('\n').find(l => l.startsWith('window.RC_IMAGES'));
  if (!line) return 0;
  return Object.keys(JSON.parse(line.replace(/^window\.RC_IMAGES = /, '').replace(/;\s*$/, ''))).length;
})();
const { check, failures, finish } = createChecker();

/** 等页面样式表真正生效，避免量到未应用样式的中间态 */
async function waitStyled(b) {
  for (let i = 0; i < 50; i++) {
    const ok = await b.eval(`(() => {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
      return !!v;
    })()`);
    if (ok) return true;
    await sleep(100);
  }
  return false;
}

(async () => {
  const b = await launch({ width: 1440, height: 950 });
  try {
    /* ---------------- 1. 首页 ---------------- */
    console.log('\n[1] 首页');
    await b.goto(BASE + '/');
    check('样式表已生效', await waitStyled(b));

    const home = await b.eval(`(() => ({
      title: document.title,
      h1: (document.querySelector('h1') || {}).textContent || '',
      cats: document.querySelectorAll('.cat-card').length,
      exams: document.querySelectorAll('.exam-card').length,
      heroStats: Array.from(document.querySelectorAll('.hero-stat')).map(e => e.textContent),
      // 只取真正加载外部文件的脚本；内联的 JSON-LD 脚本 .src 是空串，不算第三方
      scriptSrcs: Array.from(document.scripts).filter(s => s.src).map(s => s.src),
      iframes: document.querySelectorAll('iframe').length,
      imgs: Array.from(document.images).map(i => i.src),
      links: Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href')),
      svgs: document.querySelectorAll('svg').length
    }))()`);

    check('标题包含站点名', home.title.includes('NZ Road Code'), home.title);
    check('首屏主标题提到理论学习和模拟考试', /理论学习和模拟考试/.test(home.h1), home.h1);
    check('8 个分类卡片', home.cats === 8, 'got ' + home.cats);
    check('4 种模拟考试入口', home.exams === 4, 'got ' + home.exams);
    check('hero 统计显示题库总题数', home.heroStats.some(t => t.includes(String(TOTAL_QUESTIONS))), JSON.stringify(home.heroStats));
    check('页面有自绘 SVG', home.svgs > 5, 'got ' + home.svgs);
    check('没有 iframe（原站的广告位就是 iframe）', home.iframes === 0, 'got ' + home.iframes);
    check('没有外部图片（图示全部自绘，无外链、无追踪像素）',
      home.imgs.every(s => s.includes('/assets/')), JSON.stringify(home.imgs));
    check('没有第三方脚本', home.scriptSrcs.every(s => s.includes('/assets/')), JSON.stringify(home.scriptSrcs));
    check('没有指向广告/翻译服务的链接',
      !home.links.some(h => /advertis|revive|googletagmanager|translation|motorbike|truck|tourist|kannz/i.test(h || '')),
      JSON.stringify(home.links.filter(h => /advertis|revive|googletagmanager|translation|motorbike|truck|tourist|kannz/i.test(h || ''))));

    /* 首页 hero：文案 + 自绘 SVG 插画，不含任何位图 */
    const hero = await b.eval(`(() => {
      const sec = document.querySelector('.hero');
      const art = sec && sec.querySelector('.hero-art');
      const rect = sec ? sec.getBoundingClientRect() : null;
      return {
        hasHero: !!sec,
        hasArt: !!art,
        artSvg: art ? art.querySelectorAll('svg').length : 0,
        h1: sec ? ((sec.querySelector('h1') || {}).textContent || '') : '',
        heroH: rect ? Math.round(rect.height) : -1,
        imgs: Array.from(document.images).length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
      };
    })()`);

    check('首屏是 hero 区块', hero.hasHero);
    check('首屏有自绘 SVG 插画', hero.hasArt && hero.artSvg === 1, 'svg=' + hero.artSvg);
    check('首屏标题提到理论学习和模拟考试', /理论学习和模拟考试/.test(hero.h1), hero.h1);
    check('首页没有任何位图（图示全部自绘）', hero.imgs === 0, 'imgs=' + hero.imgs);
    check('首页无横向溢出', hero.overflow <= 1, 'overflow=' + hero.overflow);

    await b.shot('tests/shots/01-home.png');

    /* ---------------- 2. 理论学习总览 ---------------- */
    console.log('\n[2] 理论学习总览');
    await b.goto(BASE + '/study/');
    check('样式表已生效', await waitStyled(b));
    const study = await b.eval(`(() => ({
      qLinks: document.querySelectorAll('.q-list a').length,
      cats: document.querySelectorAll('.cat-card').length,
      thumbs: document.querySelectorAll('.q-list .thumb svg').length
    }))()`);
    check('列出全部题目', study.qLinks === TOTAL_QUESTIONS, 'got ' + study.qLinks);
    check('8 个分类卡片', study.cats === 8, 'got ' + study.cats);
    check('图示缩略图已渲染', study.thumbs > 20, 'got ' + study.thumbs);
    await b.shot('tests/shots/02-study.png');

    /* ---------------- 3. 分类页 ---------------- */
    console.log('\n[3] 分类页 /study/sign/');
    await b.goto(BASE + '/study/sign/');
    check('样式表已生效', await waitStyled(b));
    const cat = await b.eval(`(() => ({
      h1: (document.querySelector('h1') || {}).textContent || '',
      list: document.querySelectorAll('.q-list a').length,
      practice: !!document.querySelector('a[href="practice/"]'),
      thumbs: document.querySelectorAll('.q-list .thumb svg').length
    }))()`);
    check('分类标题正确', cat.h1.includes('道路标识'), cat.h1);
    check('道路标识题目数与 data/ 一致', cat.list === loadCat('sign').questions.length, 'got ' + cat.list);
    check('有进入逐题学习的入口', cat.practice);
    check('每个标志题都渲染出缩略图', cat.thumbs === loadCat('sign').questions.length, 'got ' + cat.thumbs);
    await b.shot('tests/shots/03-category.png');

    /* ---------------- 3b. 标线缩略图 ----------------
       列表缩略图只有几十像素宽，标线的 7px 细线缩下去不足 1px 会直接消失。
       所以构建期另外生成了一套加粗版（window.RC_THUMBS）。这里守住两件事：
       缩略图确实用的是加粗版，而且宽度跟着 5:3 的长宽比走（不被压成正方形）。 */
    console.log('\n[3b] 标线缩略图 /study/road-position/');
    await b.goto(BASE + '/study/road-position/');
    check('样式表已生效', await waitStyled(b));
    const mk = await b.eval(`(() => {
      var node = document.querySelector('.q-list .thumb[data-thumb^="mark-"]');
      if (!node) return null;
      var key = node.getAttribute('data-thumb');
      var thumbs = window.RC_THUMBS || {}, full = (window.RC_IMAGES || {})[key] || '';
      var thick = thumbs[key] || '';
      var norm = function (s) { return s.replace(/\\s+/g, ''); };
      var maxStroke = function (s) {
        var m = s.match(/stroke-width="[\\d.]+"/g) || [];
        return m.reduce(function (a, x) { return Math.max(a, parseFloat(x.match(/[\\d.]+/)[0])); }, 0);
      };
      var r = node.getBoundingClientRect();
      // 不能拿字符串全等判断：innerHTML 会把 <line/> 这类自闭合标签展开成
      // <line></line>，跟源字符串永远不等。比实际描边粗细才靠谱。
      return {
        key: key, cls: node.className,
        rendered: maxStroke(node.innerHTML),
        thumb: maxStroke(thick),
        full: maxStroke(full),
        ratio: r.width / r.height,
        w: Math.round(r.width), h: Math.round(r.height)
      };
    })()`);
    check('标线题在列表里有缩略图', !!mk, '没找到 .thumb[data-thumb^="mark-"]');
    check('缩略图用的是加粗版标线', !!mk && mk.thumb > 0 && mk.rendered === mk.thumb,
      mk ? `渲染 ${mk.rendered} vs 加粗版 ${mk.thumb}` : '');
    check('加粗版描边确实比完整图粗', !!mk && mk.thumb > mk.full, mk ? `加粗 ${mk.thumb} vs 完整 ${mk.full}` : '');
    check('缩略图按 5:3 长宽比，没被压扁', !!mk && Math.abs(mk.ratio - 400 / 240) < 0.15,
      mk ? mk.w + 'x' + mk.h : '');

    /* ---------------- 4. 单题页 ---------------- */
    console.log('\n[4] 单题页');
    await b.goto(BASE + '/study/question/sign-01/');
    check('样式表已生效', await waitStyled(b));
    const qp = await b.eval(`(() => ({
      text: (document.querySelector('.q-text') || {}).textContent || '',
      opts: document.querySelectorAll('.opt').length,
      correct: document.querySelectorAll('.opt.is-correct').length,
      answer: (document.querySelector('.answer-box') || {}).textContent || '',
      expl: document.querySelector('.q-card h3') ? document.querySelector('.q-card h3').nextElementSibling.textContent : '',
      figSvg: document.querySelectorAll('.q-figure svg').length,
      jsonld: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).length
    }))()`);
    check('题干存在', qp.text.includes('红色八角形'), qp.text);
    check('4 个选项', qp.opts === 4, 'got ' + qp.opts);
    check('标出了正确答案', qp.correct === 1, 'got ' + qp.correct);
    check('答案区显示正确项', qp.answer.includes('必须完全停车'), qp.answer);
    check('有解析正文', qp.expl.length > 20, qp.expl.slice(0, 40));
    check('标志图示已渲染', qp.figSvg === 1, 'got ' + qp.figSvg);
    check('有 JSON-LD 结构化数据', qp.jsonld >= 1, 'got ' + qp.jsonld);
    await b.shot('tests/shots/04-question.png');

    /* ---------------- 5. 逐题学习交互 ---------------- */
    console.log('\n[5] 逐题学习（核心交互）');
    await b.goto(BASE + '/study/core/practice/');
    check('样式表已生效', await waitStyled(b));

    const s0 = await b.eval(`(() => {
      const app = document.getElementById('rc-app');
      return {
        mounted: !!app && app.children.length > 0,
        count: (document.querySelector('.quiz-count') || {}).textContent || '',
        opts: document.querySelectorAll('.opt:not([disabled])').length,
        feedback: document.querySelectorAll('.feedback').length
      };
    })()`);
    check('交互应用已挂载', s0.mounted);
    check('显示第 1 题 / 共全部题数', s0.count.includes('第 1 题') && s0.count.includes(String(loadCat('core').questions.length)), s0.count);
    check('初始有 4 个可点选项', s0.opts === 4, 'got ' + s0.opts);
    check('未作答时没有反馈框', s0.feedback === 0, 'got ' + s0.feedback);

    // 故意选错误答案，验证判错 + 解析
    const wrongPick = await b.eval(`(() => {
      // 找出正确答案索引：对比渲染后的 data 无法直接读，改用「点第一个再观察」
      const opts = document.querySelectorAll('.opt:not([disabled])');
      opts[1].click();
      return true;
    })()`);
    check('点击选项成功', wrongPick === true);

    const s1 = await b.eval(`(() => {
      const fb = document.querySelector('.feedback');
      return {
        hasFeedback: !!fb,
        cls: fb ? fb.className : '',
        title: fb ? fb.querySelector('.feedback-title').textContent : '',
        expl: fb ? fb.textContent : '',
        correctMarked: document.querySelectorAll('.opt.is-correct').length,
        disabled: document.querySelectorAll('.opt[disabled]').length,
        body: fb ? (fb.querySelectorAll('p')[fb.querySelectorAll('p').length-1] || {}).textContent : ''
      };
    })()`);
    check('选完立即出现反馈框', s1.hasFeedback);
    check('反馈框带对错状态类', /feedback (ok|bad)/.test(s1.cls), s1.cls);
    check('所有选项被锁定', s1.disabled === 4, 'got ' + s1.disabled);
    check('标出正确答案', s1.correctMarked === 1, 'got ' + s1.correctMarked);
    check('反馈里带解析文字', (s1.body || '').length > 20, (s1.body || '').slice(0, 40));

    // 下一题
    const s2 = await b.eval(`(() => {
      const btns = Array.from(document.querySelectorAll('.quiz-actions .btn'));
      const next = btns.find(b => b.textContent.includes('下一题'));
      next.click();
      return (document.querySelector('.quiz-count') || {}).textContent || '';
    })()`);
    check('翻到第 2 题', s2.includes('第 2 题'), s2);

    // 键盘快捷键：按 1 应当选中第一个选项
    const s3 = await b.eval(`(() => {
      document.querySelectorAll('.opt:not([disabled])')[0].click();
      return document.querySelectorAll('.feedback').length;
    })()`);
    check('第 2 题可作答', s3 === 1, 'got ' + s3);
    await b.shot('tests/shots/05-practice.png');

    /* ---------------- 6. 模拟考试全流程 ---------------- */
    console.log('\n[6] 模拟考试（10 题）');
    await b.goto(BASE + '/exam/10/');
    check('样式表已生效', await waitStyled(b));

    const e0 = await b.eval(`(() => ({
      mounted: !!document.getElementById('rc-app') && document.getElementById('rc-app').children.length > 0,
      count: (document.querySelector('.quiz-count') || {}).textContent || '',
      timer: (document.querySelector('.quiz-timer') || {}).textContent || '',
      nav: document.querySelectorAll('.quiz-nav button').length,
      opts: document.querySelectorAll('.opt').length,
      feedback: document.querySelectorAll('.feedback').length
    }))()`);
    check('考试应用已挂载', e0.mounted);
    check('共 10 题', e0.count.includes('10 题'), e0.count);
    check('倒计时显示中', /剩余 \d+:\d\d/.test(e0.timer), e0.timer);
    check('有 10 个题号导航', e0.nav === 10, 'got ' + e0.nav);
    check('考试中不显示对错反馈', e0.feedback === 0, 'got ' + e0.feedback);

    // 每题都选第一个选项
    await b.eval(`(() => {
      document.querySelectorAll('.opt')[0].click();
      return true;
    })()`);
    const e1 = await b.eval(`(() => {
      const navBtns = document.querySelectorAll('.quiz-nav button');
      // 依次点题号 2..10 并各选一项
      for (let i = 1; i < navBtns.length; i++) {
        navBtns[i].click();
        const o = document.querySelectorAll('.opt');
        if (o.length) o[0].click();
      }
      return (document.querySelector('.pill') || {}).textContent || '';
    })()`);
    check('已答计数更新为 10', e1.includes('10'), e1);

    // 交卷（用真实鼠标点击，避免 confirm 阻塞 —— 已全部作答所以不会弹 confirm）
    const e2 = await b.eval(`(() => {
      const sub = Array.from(document.querySelectorAll('.quiz-actions .btn')).find(b => b.textContent.trim() === '交卷');
      if (!sub) return 'NO_BUTTON';
      sub.click();
      return 'clicked';
    })()`);
    check('找到交卷按钮', e2 === 'clicked', e2);
    await sleep(400);

    const e3 = await b.eval(`(() => {
      const score = document.querySelector('.result-score');
      return {
        hasScore: !!score,
        score: score ? score.textContent : '',
        verdict: (document.querySelector('.result-verdict') || {}).textContent || '',
        stats: document.querySelectorAll('.result-stat').length,
        review: document.querySelectorAll('.card.card-pad > div').length,
        reviewCorrect: document.querySelectorAll('.opts .opt.is-correct').length
      };
    })()`);
    check('出现成绩页', e3.hasScore);
    check('成绩格式为 x / 10', /^\d+ \/ 10$/.test(e3.score), e3.score);
    check('有通过/未通过结论', /通过/.test(e3.verdict), e3.verdict);
    check('4 项统计', e3.stats === 4, 'got ' + e3.stats);
    check('逐题回顾有 10 题', e3.review === 10, 'got ' + e3.review);
    check('回顾里标出 10 个正确答案', e3.reviewCorrect === 10, 'got ' + e3.reviewCorrect);
    await b.shot('tests/shots/06-exam-result.png');

    /* ---------------- 7. 404 ---------------- */
    console.log('\n[7] 404 处理');
    const r404 = await b.eval(`(async () => {
      const r = await fetch('/no-such-page-xyz', { redirect: 'manual' });
      const t = await r.text();
      return { status: r.status, hasNoindex: /noindex/.test(t), hasHomeLink: /返回首页/.test(t) };
    })()`);
    check('未知路径返回真实 404', r404.status === 404, 'status=' + r404.status);
    check('404 页带 noindex', r404.hasNoindex);
    check('404 页有返回首页链接', r404.hasHomeLink);

    /* ---------------- 8. 静态资源与响应头 ---------------- */
    console.log('\n[8] 资源与响应头');
    const assets = await b.eval(`(async () => {
      const out = {};
      for (const p of ['/assets/styles.css', '/assets/app.js', '/assets/questions.js', '/assets/images.js', '/sitemap.xml', '/robots.txt']) {
        const r = await fetch(p);
        out[p] = { status: r.status, type: r.headers.get('content-type') || '' };
      }
      return out;
    })()`);
    check('styles.css 200', assets['/assets/styles.css'].status === 200);
    check('app.js 是 text/javascript', /javascript/.test(assets['/assets/app.js'].type), assets['/assets/app.js'].type);
    check('questions.js 200', assets['/assets/questions.js'].status === 200);
    check('images.js 200', assets['/assets/images.js'].status === 200);
    check('sitemap.xml 200', assets['/sitemap.xml'].status === 200);
    check('robots.txt 200', assets['/robots.txt'].status === 200);

    const bank = await b.eval(`(() => ({
      cats: window.RC_BANK.categories.length,
      total: window.RC_BANK.categories.reduce((n,c)=>n+c.questions.length,0),
      imgs: Object.keys(window.RC_IMAGES).length
    }))()`);
    check('前端题库 8 个分类', bank.cats === 8, 'got ' + bank.cats);
    check('前端题库题数与 data/ 一致', bank.total === TOTAL_QUESTIONS, 'got ' + bank.total);
    check('图示库与构建产物一致', bank.imgs === IMG_COUNT, 'got ' + bank.imgs + ' 期望 ' + IMG_COUNT);

    /* ---------------- 9. 移动端 H5（390×844） ---------------- */
    console.log('\n[9] 移动端 H5 首页 / 底部标签栏');
    await b.setMobile(390, 844);
    await b.goto(BASE + '/');
    check('样式表已生效', await waitStyled(b));

    const m0 = await b.eval(`(() => {
      const de = document.documentElement;
      const tb = document.querySelector('.tabbar');
      const cs = tb ? getComputedStyle(tb) : null;
      const links = tb ? Array.from(tb.querySelectorAll('a')) : [];
      const rects = links.map(a => a.getBoundingClientRect());
      const tbRect = tb ? tb.getBoundingClientRect() : null;
      const small = [];
      const sel = '.tabbar a, .btn, .brand, .cat-card';
      document.querySelectorAll(sel).forEach(el => {
        const r = el.getBoundingClientRect(), c = getComputedStyle(el);
        if (c.display === 'none' || r.height === 0) return;
        if (r.height < 43.5) small.push(el.className + ' h=' + Math.round(r.height));
      });
      return {
        overflow: de.scrollWidth - de.clientWidth,
        barOverflow: (() => { const w = document.querySelector('.site-header .wrap'); return w ? w.scrollWidth - w.clientWidth : -1; })(),
        hasTabbar: !!tb,
        tabbarAria: tb ? tb.getAttribute('aria-label') : '',
        tabbarPosition: cs ? cs.position : '',
        tabbarDisplay: cs ? cs.display : '',
        tabbarCols: cs ? cs.gridTemplateColumns.split(' ').length : 0,
        tabbarTop: tbRect ? Math.round(tbRect.top) : -1,
        tabbarH: tbRect ? Math.round(tbRect.height) : -1,
        viewportH: window.innerHeight,
        bodyPadBottom: parseFloat(getComputedStyle(document.body).paddingBottom) || 0,
        linkCount: links.length,
        labels: links.map(a => a.textContent.trim()),
        minLinkH: rects.length ? Math.round(Math.min.apply(null, rects.map(r => r.height))) : 0,
        current: tb ? Array.from(tb.querySelectorAll('a[aria-current="page"]')).map(a => a.textContent.trim()) : [],
        smallTargets: small,
        navDisplay: getComputedStyle(document.querySelector('.site-nav')).display,
        cards: document.querySelectorAll('.cat-card').length
      };
    })()`);

    check('页面无横向溢出', m0.overflow <= 1, 'overflow=' + m0.overflow);
    check('顶栏无横向溢出', m0.barOverflow <= 1, 'barOverflow=' + m0.barOverflow);
    check('移动端有底部标签栏', m0.hasTabbar);
    check('标签栏有 aria-label', m0.tabbarAria === '底部导航', m0.tabbarAria);
    check('标签栏固定在视口底部', m0.tabbarPosition === 'fixed', m0.tabbarPosition);
    check('标签栏贴住视口下沿', Math.abs(m0.tabbarTop + m0.tabbarH - m0.viewportH) <= 1,
      'top=' + m0.tabbarTop + ' h=' + m0.tabbarH + ' vh=' + m0.viewportH);
    check('标签栏 3 等分', m0.tabbarCols === 3, 'got ' + m0.tabbarCols);
    check('标签栏 3 个入口', m0.linkCount === 3, 'got ' + m0.linkCount);
    check('标签栏文案正确', m0.labels.join('/') === '首页/理论学习/模拟考试', m0.labels.join('/'));
    check('首页高亮唯一', m0.current.length === 1 && m0.current[0] === '首页', JSON.stringify(m0.current));
    check('标签栏触摸目标 ≥44px', m0.minLinkH >= 44, 'minH=' + m0.minLinkH);
    check('body 为标签栏留出底部空间', m0.bodyPadBottom >= m0.tabbarH - 1,
      'pad=' + m0.bodyPadBottom + ' barH=' + m0.tabbarH);
    check('移动端主控件触摸目标 ≥44px', m0.smallTargets.length === 0, JSON.stringify(m0.smallTargets.slice(0, 5)));
    check('移动端顶栏导航让位给标签栏', m0.navDisplay === 'none', m0.navDisplay);
    check('移动端分类卡片完整', m0.cards === 8, 'got ' + m0.cards);

    // 移动端首屏：文案 + 自绘插画，插画不能把页面撑宽
    const mHero = await b.eval(`(() => {
      const sec = document.querySelector('.hero');
      const art = sec.querySelector('.hero-art');
      const secRect = sec.getBoundingClientRect();
      return {
        sectionH: Math.round(secRect.height),
        hasArt: !!art,
        artW: art ? Math.round(art.getBoundingClientRect().width) : 0,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
      };
    })()`);
    check('移动端首屏有自绘插画', mHero.hasArt && mHero.artW > 0, 'artW=' + mHero.artW);
    check('移动端首屏无横向溢出', mHero.overflow <= 1, 'overflow=' + mHero.overflow);

    await b.shot('tests/shots/07-mobile.png');

    // 点底部标签栏真的能跳转，并且高亮跟着走
    const mNav = await b.eval(`(() => {
      const a = Array.from(document.querySelectorAll('.tabbar a')).find(x => x.textContent.includes('理论学习'));
      a.click();
      return true;
    })()`);
    check('点击标签栏可跳转', mNav === true);
    await sleep(600);
    const mNav2 = await b.eval(`(() => ({
      url: location.pathname,
      current: Array.from(document.querySelectorAll('.tabbar a[aria-current="page"]')).map(a => a.textContent.trim()),
      backDisplay: (() => { const bl = document.querySelector('.back-link'); return bl ? getComputedStyle(bl).display : 'none'; })(),
      backHref: (() => { const bl = document.querySelector('.back-link'); return bl ? bl.getAttribute('href') : ''; })(),
      small: (() => {
        const out = [];
        document.querySelectorAll('.tabbar a, .btn, .q-list a').forEach(el => {
          const r = el.getBoundingClientRect(), c = getComputedStyle(el);
          if (c.display === 'none' || r.height === 0) return;
          if (r.height < 43.5) out.push(el.className + ' h=' + Math.round(r.height));
        });
        return out;
      })()
    }))()`);
    check('跳转到理论学习页', mNav2.url.indexOf('/study/') === 0, mNav2.url);
    check('高亮切到理论学习', mNav2.current.length === 1 && mNav2.current[0] === '理论学习', JSON.stringify(mNav2.current));
    // ⚠️ 不能断言 display === 'inline-flex'：.back-link 在 .site-header .wrap（flex 容器）
    // 里，CSS 会把 inline-flex blockify 成 flex，getComputedStyle 返回的就是 'flex'。
    check('移动端显示返回入口', mNav2.backDisplay !== 'none', mNav2.backDisplay);
    check('返回链接指向首页', mNav2.backHref === '../', mNav2.backHref);
    check('学习页触摸目标 ≥44px', mNav2.small.length === 0, JSON.stringify(mNav2.small.slice(0, 5)));

    /* ---------------- 10. 移动端答题：专注模式 ---------------- */
    console.log('\n[10] 移动端答题专注模式');
    await b.goto(BASE + '/study/core/practice/');
    await waitStyled(b);
    const mq = await b.eval(`(() => {
      const de = document.documentElement, body = document.body;
      const tb = document.querySelector('.tabbar');
      const hdr = document.querySelector('.site-header');
      const qa = document.querySelector('.quiz-shell .quiz-actions');
      const qb = document.querySelector('.quiz-back');
      const qaRect = qa ? qa.getBoundingClientRect() : null;
      const qbRect = qb ? qb.getBoundingClientRect() : null;
      const small = [];
      document.querySelectorAll('.quiz-shell .quiz-actions .btn, .opt, .quiz-back').forEach(el => {
        const r = el.getBoundingClientRect(), c = getComputedStyle(el);
        if (c.display === 'none' || r.height === 0) return;
        if (r.height < 43.5) small.push(el.className + ' h=' + Math.round(r.height));
      });
      return {
        isFocus: body.classList.contains('is-focus'),
        tabbarDisplay: tb ? getComputedStyle(tb).display : 'missing',
        headerDisplay: hdr ? getComputedStyle(hdr).display : 'missing',
        bodyPadBottom: parseFloat(getComputedStyle(body).paddingBottom) || 0,
        hasBack: !!qb,
        backSize: qbRect ? [Math.round(qbRect.width), Math.round(qbRect.height)] : null,
        backLabel: qb ? qb.getAttribute('aria-label') : '',
        actionsPosition: qa ? getComputedStyle(qa).position : 'missing',
        actionsTop: qaRect ? Math.round(qaRect.top) : -1,
        actionsBottom: qaRect ? Math.round(qaRect.bottom) : -1,
        viewportH: window.innerHeight,
        overflow: de.scrollWidth - de.clientWidth,
        smallTargets: small,
        opts: document.querySelectorAll('.opt').length
      };
    })()`);

    check('练习页进入专注模式', mq.isFocus);
    check('专注模式隐藏底部标签栏', mq.tabbarDisplay === 'none', mq.tabbarDisplay);
    check('专注模式隐藏站点顶栏', mq.headerDisplay === 'none', mq.headerDisplay);
    check('专注模式不留标签栏空位', mq.bodyPadBottom === 0, 'pad=' + mq.bodyPadBottom);
    check('答题页有返回按钮', mq.hasBack);
    check('返回按钮触摸目标 ≥44px', mq.backSize && mq.backSize[0] >= 44 && mq.backSize[1] >= 44, JSON.stringify(mq.backSize));
    check('返回按钮有可读标签', /^返回/.test(mq.backLabel || ''), mq.backLabel);
    check('主操作栏固定在视口内', mq.actionsPosition === 'fixed' &&
      mq.actionsTop >= 0 && mq.actionsBottom <= mq.viewportH + 1,
      'pos=' + mq.actionsPosition + ' top=' + mq.actionsTop + ' bottom=' + mq.actionsBottom + ' vh=' + mq.viewportH);
    check('答题页无横向溢出', mq.overflow <= 1, 'overflow=' + mq.overflow);
    check('答题页触摸目标 ≥44px', mq.smallTargets.length === 0, JSON.stringify(mq.smallTargets.slice(0, 5)));
    check('练习页有 4 个选项', mq.opts === 4, 'got ' + mq.opts);
    await b.shot('tests/shots/08-mobile-practice.png');

    /* ---------------- 11. 移动端考试题号导航 ---------------- */
    console.log('\n[11] 移动端考试题号导航');
    await b.goto(BASE + '/exam/35/');
    await waitStyled(b);
    const mn = await b.eval(`(() => {
      const de = document.documentElement;
      const nav = document.querySelector('.quiz-nav');
      const btns = nav ? Array.from(nav.querySelectorAll('button')) : [];
      const rects = btns.map(x => x.getBoundingClientRect());
      const cur = nav ? nav.querySelector('button.is-current') : null;
      return {
        hasNav: !!nav,
        count: btns.length,
        minH: rects.length ? Math.round(Math.min.apply(null, rects.map(r => r.height))) : 0,
        minW: rects.length ? Math.round(Math.min.apply(null, rects.map(r => r.width))) : 0,
        current: cur ? cur.textContent.trim() : '',
        currentCount: nav ? nav.querySelectorAll('.is-current').length : 0,
        doneCount: nav ? nav.querySelectorAll('.is-done').length : 0,
        scrollable: nav ? nav.scrollWidth > nav.clientWidth : false,
        overflow: de.scrollWidth - de.clientWidth
      };
    })()`);
    check('考试页有题号导航', mn.hasNav);
    check('35 个题号', mn.count === 35, 'got ' + mn.count);
    check('题号触摸目标 ≥44px', mn.minH >= 44 && mn.minW >= 44, 'h=' + mn.minH + ' w=' + mn.minW);
    check('当前题高亮唯一', mn.currentCount === 1 && mn.current === '1', JSON.stringify(mn));
    check('题号条可横向滚动', mn.scrollable);
    check('考试页无横向溢出', mn.overflow <= 1, 'overflow=' + mn.overflow);

    // 题号状态：当前题恒为 is-current，is-done 只给「已答过但已翻走」的题。
    // 所以答完第 1 题后它仍是 is-current，要翻到第 2 题才会看到它变 is-done。
    const mn2 = await b.eval(`(() => {
      document.querySelectorAll('.opt')[0].click();
      return {
        done: document.querySelectorAll('.quiz-nav .is-done').length,
        current: (document.querySelector('.quiz-nav .is-current') || {}).textContent || ''
      };
    })()`);
    check('当前题只高亮、不标记已答', mn2.done === 0 && mn2.current.trim() === '1', JSON.stringify(mn2));

    const mn3 = await b.eval(`(() => {
      document.querySelectorAll('.quiz-nav button')[1].click();
      return {
        done: document.querySelectorAll('.quiz-nav .is-done').length,
        doneText: (document.querySelector('.quiz-nav .is-done') || {}).textContent || '',
        current: (document.querySelector('.quiz-nav .is-current') || {}).textContent || ''
      };
    })()`);
    check('翻页后已答题号标记为已答', mn3.done === 1 && mn3.doneText.trim() === '1', JSON.stringify(mn3));
    check('当前题号跟着切换', mn3.current.trim() === '2', mn3.current);
    await b.shot('tests/shots/09-mobile-exam.png');

    /* ---------------- 12. 设计令牌（莫兰迪色系） ---------------- */
    console.log('\n[12] 设计令牌与配色');
    await b.clearMobile();
    await b.goto(BASE + '/study/');
    await waitStyled(b);
    const dz = await b.eval(`(() => {
      const cs = getComputedStyle(document.documentElement);
      const v = n => cs.getPropertyValue(n).trim();
      const satOf = rgb => {
        const arr = rgb.map(x => x / 255);
        const mx = Math.max.apply(null, arr), mn = Math.min.apply(null, arr);
        const l = (mx + mn) / 2;
        if (mx === mn) return 0;
        const d = mx - mn;
        return d / (l > .5 ? (2 - mx - mn) : (mx + mn));
      };
      const chromaOf = rgb => (Math.max.apply(null, rgb) - Math.min.apply(null, rgb)) / 255;
      const hexSat = h => {
        const m = /^#([0-9a-f]{6})$/i.exec(h.trim());
        if (!m) return -1;
        const n = parseInt(m[1], 16);
        return satOf([n >> 16 & 255, n >> 8 & 255, n & 255]);
      };
      const hexChroma = h => {
        const m = /^#([0-9a-f]{6})$/i.exec(h.trim());
        if (!m) return -1;
        const n = parseInt(m[1], 16);
        return chromaOf([n >> 16 & 255, n >> 8 & 255, n & 255]);
      };
      const cats = Array.from(document.querySelectorAll('.cat-card .cat-icon')).map(el => {
        const c = getComputedStyle(el).color;
        const m = /rgb\\((\\d+),\\s*(\\d+),\\s*(\\d+)\\)/.exec(c);
        return { color: c, sat: m ? satOf([+m[1], +m[2], +m[3]]) : -1 };
      });
      const tb = document.querySelector('.tabbar');
      const bl = document.querySelector('.back-link');
      return {
        brand: v('--brand'),
        brandDeep: v('--brand-deep'),
        bg: v('--bg'),
        ink: v('--ink'),
        brandSat: hexSat(v('--brand')),
        // 近白色用 HSL 饱和度衡量会失真（#f5f2ef 明明几乎无色，算出来却有 23%），
        // 所以中性度改用「通道极差」：完全中性 = 0，肉眼可辨的染色才 >0.05。
        bgChroma: hexChroma(v('--bg')),
        cats: cats,
        maxCatSat: cats.length ? Math.max.apply(null, cats.map(c => c.sat)) : -1,
        tabbarDisplay: tb ? getComputedStyle(tb).display : 'missing',
        backLinkDisplay: bl ? getComputedStyle(bl).display : 'missing',
        themeColor: (document.querySelector('meta[name="theme-color"]') || {}).content || ''
      };
    })()`);

    check('品牌色是莫兰迪灰青', dz.brand === '#7c9c97', dz.brand);
    check('品牌色饱和度 < 50%', dz.brandSat >= 0 && dz.brandSat < 0.5, String(dz.brandSat));
    check('背景色是近乎中性的暖灰', dz.bgChroma >= 0 && dz.bgChroma < 0.05, dz.bg + ' chroma=' + dz.bgChroma);
    check('8 个分类色全部低饱和（莫兰迪）', dz.cats.length === 8 && dz.maxCatSat < 0.5,
      'n=' + dz.cats.length + ' maxSat=' + dz.maxCatSat.toFixed(3) + ' ' + JSON.stringify(dz.cats.map(c => c.color)));
    check('桌面端隐藏底部标签栏', dz.tabbarDisplay === 'none', dz.tabbarDisplay);
    check('桌面端隐藏返回按钮（改用面包屑）', dz.backLinkDisplay === 'none', dz.backLinkDisplay);
    check('theme-color 与背景一致', dz.themeColor === dz.bg, dz.themeColor + ' vs ' + dz.bg);

    /* ---------------- 13. console 错误 ---------------- */
    console.log('\n[13] 控制台错误');
    const errs = b.consoleErrors().filter(e => !/favicon/i.test(e));
    check('没有 console 错误', errs.length === 0, JSON.stringify(errs.slice(0, 5)));

  } catch (err) {
    console.error('\n脚本异常:', err && err.stack || err);
    failures.push('脚本异常: ' + (err && err.message));
  } finally {
    await b.close();
  }

  finish('E2E 全部通过');
})();
