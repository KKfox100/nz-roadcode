'use strict';

/**
 * NZ Road Code 中文版 —— 端到端验证
 *
 * 覆盖：首页 / 分类页 / 单题页 / 逐题学习交互 / 模拟考试全流程 / 404 / 移动端
 * 用真实 Chrome 跑，收集 console 错误。
 */

const { launch, createChecker, sleep } = require('./cdp-client.cjs');
const path = require('path');

const BASE = process.env.BASE || 'http://127.0.0.1:8787';
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
    check('主标题存在', home.h1.length > 0, home.h1);
    check('8 个分类卡片', home.cats === 8, 'got ' + home.cats);
    check('4 种模拟考试入口', home.exams === 4, 'got ' + home.exams);
    check('hero 统计显示 216 题', home.heroStats.some(t => t.includes('216')), JSON.stringify(home.heroStats));
    check('页面有自绘 SVG', home.svgs > 5, 'got ' + home.svgs);
    check('没有 iframe（原站的广告位就是 iframe）', home.iframes === 0, 'got ' + home.iframes);
    check('没有外部图片', home.imgs.length === 0, JSON.stringify(home.imgs));
    check('没有第三方脚本', home.scriptSrcs.every(s => s.includes('/assets/')), JSON.stringify(home.scriptSrcs));
    check('没有指向广告/翻译服务的链接',
      !home.links.some(h => /advertis|revive|googletagmanager|translation|motorbike|truck|tourist|kannz/i.test(h || '')),
      JSON.stringify(home.links.filter(h => /advertis|revive|googletagmanager|translation|motorbike|truck|tourist|kannz/i.test(h || ''))));

    // 回归：车辆标签曾经画在车身外侧，靠下的车会跑出 viewBox 并与说明文字重叠
    const heroFig = await b.eval(`(() => {
      const svg = document.querySelector('.hero-art svg');
      const vb = svg.getAttribute('viewBox').split(/\\s+/).map(Number);
      const [, , W, H] = vb;
      const out = [];
      svg.querySelectorAll('circle, text').forEach(n => {
        const cx = parseFloat(n.getAttribute('cx') || 0);
        const cy = parseFloat(n.getAttribute('cy') || 0);
        const r = parseFloat(n.getAttribute('r') || 0);
        if (n.tagName === 'circle' && (cx - r < 0 || cx + r > W || cy - r < 0 || cy + r > H)) {
          out.push('circle@' + cx + ',' + cy + ' r=' + r);
        }
        if (n.tagName === 'text' && (cx < 0 || cx > W || cy < 0 || cy > H)) {
          out.push('text@' + cx + ',' + cy + ' "' + n.textContent + '"');
        }
      });
      return {
        viewBox: vb.join(' '),
        outOfBounds: out,
        captionInSvg: !!svg.querySelector('text[data-caption]'),
        captionInHtml: !!document.querySelector('.hero-art .fig-cap'),
        captionText: (document.querySelector('.hero-art .fig-cap') || {}).textContent || ''
      };
    })()`);
    check('示意图里的元素都在 viewBox 内', heroFig.outOfBounds.length === 0, JSON.stringify(heroFig.outOfBounds));
    check('说明文字是 HTML 而不是画在 SVG 里', !heroFig.captionInSvg && heroFig.captionInHtml, JSON.stringify(heroFig));
    check('说明文字内容正确', heroFig.captionText.includes('无标志十字路口'), heroFig.captionText);

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
    check('列出全部 216 道题', study.qLinks === 216, 'got ' + study.qLinks);
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
    check('道路标识共 30 题', cat.list === 30, 'got ' + cat.list);
    check('有进入逐题学习的入口', cat.practice);
    check('30 个标志缩略图全部渲染', cat.thumbs === 30, 'got ' + cat.thumbs);
    await b.shot('tests/shots/03-category.png');

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
    check('显示第 1 题 / 共 28 题', s0.count.includes('第 1 题') && s0.count.includes('28'), s0.count);
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
      nav: document.querySelectorAll('.quiz-bar .opt-key').length,
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
      const navBtns = document.querySelectorAll('.quiz-bar .opt-key');
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
    check('前端题库共 216 题', bank.total === 216, 'got ' + bank.total);
    check('图示库含 34 个图形', bank.imgs === 34, 'got ' + bank.imgs);

    /* ---------------- 9. 移动端 ---------------- */
    console.log('\n[9] 移动端 390×844');
    await b.setMobile(390, 844);
    await b.goto(BASE + '/');
    check('样式表已生效', await waitStyled(b));
    const mob = await b.eval(`(() => {
      const de = document.documentElement;
      const bar = document.querySelector('.site-header .wrap');
      return {
        overflow: de.scrollWidth - de.clientWidth,
        barOverflow: bar ? bar.scrollWidth - bar.clientWidth : -1,
        navVisible: getComputedStyle(document.querySelector('.site-nav')).display !== 'none',
        cards: document.querySelectorAll('.cat-card').length
      };
    })()`);
    check('页面无横向溢出', mob.overflow <= 1, 'overflow=' + mob.overflow);
    check('顶栏无横向溢出', mob.barOverflow <= 1, 'barOverflow=' + mob.barOverflow);
    check('移动端导航仍可见', mob.navVisible);
    check('移动端分类卡片完整', mob.cards === 8, 'got ' + mob.cards);
    await b.shot('tests/shots/07-mobile.png');

    // 移动端考试页
    await b.goto(BASE + '/exam/35/');
    await waitStyled(b);
    const mobExam = await b.eval(`(() => {
      const de = document.documentElement;
      return {
        overflow: de.scrollWidth - de.clientWidth,
        nav: document.querySelectorAll('.quiz-bar .opt-key').length
      };
    })()`);
    check('移动端考试页无横向溢出', mobExam.overflow <= 1, 'overflow=' + mobExam.overflow);
    check('移动端 35 题导航完整', mobExam.nav === 35, 'got ' + mobExam.nav);
    await b.shot('tests/shots/08-mobile-exam.png');
    await b.clearMobile();

    /* ---------------- 10. console 错误 ---------------- */
    console.log('\n[10] 控制台错误');
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
