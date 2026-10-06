/* ==========================================================================
   NZ Road Code 中文版 —— 前端交互
   依赖（按顺序加载）：
     assets/i18n.js        多语言词典（构建产物）
     assets/i18n-runtime.js 语言切换与文案层
     assets/images.js      图示库
     assets/questions.js   题库
     本文件
   ========================================================================== */

(function () {
  'use strict';

  var BANK = window.RC_BANK || { categories: [] };
  var IMAGES = window.RC_IMAGES || {};
  var CAPTIONS = window.RC_CAPTIONS || {};

  /* ---------- 多语言 ---------- */

  var I18N = window.RC_I18N;
  /** 取 UI 文案。i18n-runtime 没加载时退化为键名，不至于把界面搞崩。 */
  function t(key, vars) { return I18N ? I18N.t(key, vars) : key; }
  /** 取当前语言下某题的内容（题干/选项/解析）。 */
  function qtext(qid) { return I18N ? I18N.q(qid) : null; }
  function catName(id) { return I18N ? I18N.catName(id) : id; }
  function catSummary(id) { return I18N ? I18N.catSummary(id) : ''; }
  /** 当前语言的分类对象（名字/摘要随语言变化，题目内容是本地化的）。 */
  function localizedCat(cat) {
    if (!I18N) return cat;
    return Object.assign({}, cat, {
      name: catName(cat.id),
      summary: catSummary(cat.id),
      questions: cat.questions.map(function (q) { return localQuestion(q, cat.id); })
    });
  }
  /** 把一道源题翻译成当前语言下的题（选项顺序保持与源一致 —— answer 索引复用）。 */
  function localQuestion(q, catId) {
    var c = qtext(q.id);
    if (!c) return q;
    return Object.assign({}, q, {
      q: c.q,
      options: c.options,
      explanation: c.explanation,
      category: catId != null ? catId : q.category
    });
  }
  /** 题目对象（ALL 里的条目）本地化，供考试/练习等逐题渲染用。 */
  function lq(q) { return localQuestion(q, q.category); }

  var ALL = [];
  BANK.categories.forEach(function (cat) {
    cat.questions.forEach(function (q) {
      ALL.push(Object.assign({}, q, {
        category: cat.id,
        categoryName: cat.name,
        categoryColor: cat.color
      }));
    });
  });

  var CAT_BY_ID = {};
  BANK.categories.forEach(function (c) { CAT_BY_ID[c.id] = c; });

  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  /* ---------- 工具 ---------- */

  function $(sel, root) { return (root || document).querySelector(sel); }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function fmtTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  /** 从当前路径推出到站点根的相对前缀：/study/core/practice/ -> ../../../ */
  function rootPrefix() {
    var p = location.pathname;
    var segs = p.split('/').filter(Boolean);
    var levels = /\/$/.test(p) ? segs.length : Math.max(segs.length - 1, 0);
    return '../'.repeat(Math.max(levels, 1));
  }

  /** 答题界面左上角的返回按钮（专注模式下站点顶栏被隐藏，需要自带返回入口） */
  function backBtn(href, label) {
    var a = el('a', 'quiz-back');
    a.href = href;
    a.setAttribute('aria-label', '返回' + label);
    a.innerHTML = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">'
      + '<path d="M15 5.6 8.6 12 15 18.4" fill="none" stroke="currentColor" stroke-width="2" '
      + 'stroke-linecap="round" stroke-linejoin="round"/></svg>';
    return a;
  }

  function figure(q, wide) {
    if (!q.image || !IMAGES[q.image]) return null;
    var box = el('div', 'q-figure' + (wide ? ' wide' : ''));
    box.innerHTML = IMAGES[q.image];
    // 场景图注按当前语言取（cap.<key>）；没有对应语言键时回退源注
    var cap = t('cap.' + q.image);
    if (cap === 'cap.' + q.image) cap = CAPTIONS[q.image];
    if (cap) box.appendChild(el('p', 'fig-cap', cap));
    return box;
  }

  /* ---------- 首页 / 分类页：题目预览列表由构建期生成，这里只补图示缩略图 ---------- */

  function hydrateThumbs() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-thumb]'), function (node) {
      var key = node.getAttribute('data-thumb');
      // 缩略图优先用加粗版：标线在几十像素宽下细线会消失
      var svg = (window.RC_THUMBS || {})[key] || IMAGES[key];
      if (svg) node.innerHTML = svg;
    });
  }

  /* ---------- 理论学习模式 ---------- */

  function Study(root, categoryId) {
    var cat0 = CAT_BY_ID[categoryId];
    if (!cat0) return;
    var list = [];
    var i = 0;
    var picked = {};       // index -> 选中的选项
    var revealed = {};     // index -> true

    /** 切换语言后重取题目内容，但保留作答进度（选项顺序不变，索引仍对得上）。 */
    function reload() {
      list = cat0.questions.map(function (q) { return localQuestion(q, cat0.id); });
    }

    function render() {
      var q = list[i];
      root.innerHTML = '';

      var shell = el('div', 'quiz-shell');

      /* 进度条 */
      var bar = el('div', 'quiz-bar');
      var row1 = el('div', 'quiz-bar-row');
      row1.appendChild(backBtn(rootPrefix() + 'study/' + cat0.id + '/', catName(cat0.id)));
      row1.appendChild(el('span', 'quiz-count', t('study.qCount', { i: i + 1, n: list.length })));
      row1.appendChild(el('span', 'quiz-timer', catName(cat0.id)));
      bar.appendChild(row1);
      var row2 = el('div', 'quiz-bar-row');
      var prog = el('div', 'progress');
      var fill = el('i');
      fill.style.width = ((i + 1) / list.length * 100) + '%';
      prog.appendChild(fill);
      row2.appendChild(prog);
      bar.appendChild(row2);
      shell.appendChild(bar);

      /* 题卡 */
      var card = el('div', 'card q-card');
      var head = el('div', 'q-head');
      head.appendChild(el('div', 'q-index', String(i + 1)));
      var qt = el('p', 'q-text');
      qt.innerHTML = esc(q.q);
      head.appendChild(qt);
      card.appendChild(head);

      var fig = figure(q, q.image && q.image.indexOf('sv-') === 0);
      if (fig) card.appendChild(fig);

      var opts = el('ul', 'opts');
      var answered = revealed[i];
      q.options.forEach(function (text, idx) {
        var li = el('li');
        var btn = el('button', 'opt');
        btn.type = 'button';
        btn.appendChild(el('span', 'opt-key', LETTERS[idx]));
        btn.appendChild(el('span', 'opt-body', text));
        if (answered) {
          btn.disabled = true;
          if (idx === q.answer) btn.classList.add('is-correct');
          else if (idx === picked[i]) btn.classList.add('is-wrong');
          else btn.classList.add('is-muted');
        } else {
          btn.addEventListener('click', function () { choose(idx); });
        }
        li.appendChild(btn);
        opts.appendChild(li);
      });
      card.appendChild(opts);

      if (answered) {
        var ok = picked[i] === q.answer;
        var fb = el('div', 'feedback ' + (ok ? 'ok' : 'bad'));
        var ft = el('div', 'feedback-title');
        ft.textContent = ok ? t('result.correct') : t('result.wrong');
        fb.appendChild(ft);
        if (!ok) {
          var p = el('p');
          p.innerHTML = esc(t('result.correctAnswerIs')) + ' <b>' + LETTERS[q.answer] + '. ' + esc(q.options[q.answer]) + '</b>';
          fb.appendChild(p);
        }
        var lab = el('div', 'expl-label', t('common.explanation'));
        fb.appendChild(lab);
        var pe = el('p', '', q.explanation);
        fb.appendChild(pe);
        card.appendChild(fb);
      }

      /* 操作区 */
      var actions = el('div', 'quiz-actions');
      var prev = el('button', 'btn btn-ghost', t('common.prev'));
      prev.type = 'button';
      prev.disabled = i === 0;
      prev.addEventListener('click', function () { i--; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
      actions.appendChild(prev);

      if (!answered) {
        var skip = el('button', 'btn btn-quiet', t('common.seeAnswer'));
        skip.type = 'button';
        skip.addEventListener('click', function () {
          picked[i] = -1; revealed[i] = true; render();
        });
        actions.appendChild(skip);
      }

      actions.appendChild(el('div', 'spacer'));

      var next = el('button', 'btn btn-primary', i === list.length - 1 ? t('common.finishStudy') : t('common.next'));
      next.type = 'button';
      next.addEventListener('click', function () {
        if (i === list.length - 1) { finish(); }
        else { i++; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      });
      actions.appendChild(next);
      card.appendChild(actions);

      shell.appendChild(card);
      root.appendChild(shell);
    }

    function choose(idx) {
      picked[i] = idx;
      revealed[i] = true;
      render();
    }

    function finish() {
      var done = Object.keys(revealed).length;
      var correct = 0;
      Object.keys(revealed).forEach(function (k) {
        if (picked[k] === list[Number(k)].answer) correct++;
      });
      var wrongIdx = [];
      Object.keys(revealed).forEach(function (k) {
        if (picked[k] !== list[Number(k)].answer) wrongIdx.push(Number(k));
      });
      wrongIdx.sort(function (a, b) { return a - b; });

      root.innerHTML = '';
      var shell = el('div', 'quiz-shell');
      var card = el('div', 'card result-hero');
      var pct = done ? Math.round(correct / done * 100) : 0;
      var score = el('div', 'result-score ' + (pct >= 90 ? 'pass' : 'fail'), pct + '%');
      card.appendChild(score);
      card.appendChild(el('div', 'result-verdict', t('result.studyDone', { cat: catName(cat0.id) })));
      card.appendChild(el('div', 'result-sub', t('result.studySub', { done: done, correct: correct, wrong: wrongIdx.length })));

      var grid = el('div', 'result-grid');
      [[t('result.answered'), done + ' / ' + list.length], [t('result.correctN'), String(correct)],
       [t('result.wrongN'), String(wrongIdx.length)], [t('result.rate'), pct + '%']]
        .forEach(function (pair) {
          var s = el('div', 'result-stat');
          s.appendChild(el('b', '', pair[1]));
          s.appendChild(el('span', '', pair[0]));
          grid.appendChild(s);
        });
      card.appendChild(grid);

      var acts = el('div', 'quiz-actions');
      acts.style.justifyContent = 'center';
      var again = el('a', 'btn btn-primary', t('result.retryCat'));
      again.href = location.pathname;
      acts.appendChild(again);
      var home = el('a', 'btn btn-ghost', t('common.backHome'));
      home.href = '../../';
      acts.appendChild(home);
      card.appendChild(acts);
      shell.appendChild(card);

      if (wrongIdx.length) {
        var wc = el('div', 'card card-pad');
        wc.style.marginTop = '18px';
        wc.appendChild(el('h3', '', t('result.wrongReview', { n: wrongIdx.length })));
        wrongIdx.forEach(function (idx) {
          var q = list[idx];
          var box = el('div');
          box.style.padding = '14px 0';
          box.style.borderTop = '1px solid var(--line)';
          var tp = el('p');
          tp.style.fontWeight = '700';
          tp.style.marginBottom = '6px';
          tp.textContent = (idx + 1) + '. ' + q.q;
          box.appendChild(tp);
          var a = el('p');
          a.style.margin = '0 0 6px';
          a.style.fontSize = '.92rem';
          a.innerHTML = esc(t('common.correctAnswer')) + '：<b>' + LETTERS[q.answer] + '. ' + esc(q.options[q.answer]) + '</b>';
          box.appendChild(a);
          var e = el('p');
          e.style.margin = '0';
          e.style.fontSize = '.9rem';
          e.style.color = 'var(--ink-3)';
          e.textContent = q.explanation;
          box.appendChild(e);
          var link = el('a', 'btn btn-sm btn-quiet', t('common.viewQuestion'));
          link.href = '../../question/' + q.id + '/';
          link.style.marginTop = '8px';
          box.appendChild(link);
          wc.appendChild(box);
        });
        shell.appendChild(wc);
      }

      root.appendChild(shell);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    reload();
    render();
    document.addEventListener('rc:locale', function () { reload(); render(); });
  }

  /* ---------- 模拟考试模式 ---------- */

  function pickExam(count) {
    // 按分类占比抽样，保证题目覆盖面，再整体打乱顺序
    var buckets = BANK.categories.map(function (c) { return shuffle(c.questions.map(function (q) {
      return Object.assign({}, q, { category: c.id, categoryName: c.name, categoryColor: c.color });
    })); });
    var total = ALL.length;
    var picked = [];
    var guard = 0;
    while (picked.length < count && guard < 5000) {
      guard++;
      for (var b = 0; b < buckets.length && picked.length < count; b++) {
        var quota = Math.max(1, Math.round(count * buckets[b].length / total));
        var already = picked.filter(function (q) { return q.category === BANK.categories[b].id; }).length;
        if (buckets[b].length && already < quota) picked.push(buckets[b].pop());
      }
      if (buckets.every(function (x) { return !x.length; })) break;
    }
    // 补齐（分类题量不足时）
    var flat = shuffle(ALL);
    for (var i = 0; i < flat.length && picked.length < count; i++) {
      if (!picked.some(function (q) { return q.id === flat[i].id; })) picked.push(flat[i]);
    }
    return shuffle(picked).slice(0, count);
  }

  function Exam(root, count) {
    var list = pickExam(count);
    var answers = new Array(list.length).fill(null);
    var i = 0;
    var submitted = false;
    var limitSec = Math.max(300, Math.round(count * 54));  // 35 题约 30 分钟
    var left = limitSec;
    var timer = null;
    var startedAt = Date.now();

    function startTimer() {
      timer = setInterval(function () {
        left--;
        var node = $('.quiz-timer', root);
        if (node) {
          node.textContent = t('exam.remaining', { t: fmtTime(Math.max(0, left)) });
          node.classList.toggle('is-low', left <= 60);
        }
        if (left <= 0) { clearInterval(timer); timer = null; submit(true); }
      }, 1000);
    }

    function render() {
      var q = list[i];
      root.innerHTML = '';

      var shell = el('div', 'quiz-shell');

      var bar = el('div', 'quiz-bar');
      var row1 = el('div', 'quiz-bar-row');
      row1.appendChild(backBtn(rootPrefix() + 'exam/', t('exam.title')));
      row1.appendChild(el('span', 'quiz-count', t('study.qCount', { i: i + 1, n: list.length })));
      var answeredN = answers.filter(function (a) { return a !== null; }).length;
      row1.appendChild(el('span', 'pill', t('exam.answered', { n: answeredN })));
      row1.appendChild(el('span', 'quiz-timer', t('exam.remaining', { t: fmtTime(Math.max(0, left)) })));
      bar.appendChild(row1);

      var row2 = el('div', 'quiz-bar-row');
      var prog = el('div', 'progress');
      var fill = el('i');
      fill.style.width = ((i + 1) / list.length * 100) + '%';
      prog.appendChild(fill);
      row2.appendChild(prog);
      bar.appendChild(row2);

      /* 题号导航：移动端横向滚动，当前题自动滚到可视区中间 */
      var nav = el('div', 'quiz-nav');
      nav.setAttribute('aria-label', t('exam.nav'));
      list.forEach(function (_, idx) {
        var cls = idx === i ? 'is-current' : (answers[idx] !== null ? 'is-done' : '');
        var b = el('button', cls, String(idx + 1));
        b.type = 'button';
        b.setAttribute('aria-label', t('exam.questionN', { n: idx + 1 }));
        b.addEventListener('click', function () { i = idx; render(); });
        nav.appendChild(b);
      });
      bar.appendChild(nav);
      shell.appendChild(bar);

      requestAnimationFrame(function () {
        var cur = nav.querySelector('.is-current');
        if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest', inline: 'center' });
      });

      var card = el('div', 'card q-card');
      var head = el('div', 'q-head');
      head.appendChild(el('div', 'q-index', String(i + 1)));
      var qt = el('p', 'q-text');
      qt.textContent = lq(q).q;
      head.appendChild(qt);
      card.appendChild(head);

      var fig = figure(q, q.image && q.image.indexOf('sv-') === 0);
      if (fig) card.appendChild(fig);

      var opts = el('ul', 'opts');
      lq(q).options.forEach(function (text, idx) {
        var li = el('li');
        var btn = el('button', 'opt' + (answers[i] === idx ? ' is-selected' : ''));
        btn.type = 'button';
        btn.appendChild(el('span', 'opt-key', LETTERS[idx]));
        btn.appendChild(el('span', 'opt-body', text));
        btn.addEventListener('click', function () { answers[i] = idx; render(); });
        li.appendChild(btn);
        opts.appendChild(li);
      });
      card.appendChild(opts);

      var actions = el('div', 'quiz-actions');
      var prev = el('button', 'btn btn-ghost', t('common.prev'));
      prev.type = 'button';
      prev.disabled = i === 0;
      prev.addEventListener('click', function () { i--; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
      actions.appendChild(prev);
      actions.appendChild(el('div', 'spacer'));
      if (i < list.length - 1) {
        var next = el('button', 'btn btn-primary', t('common.next'));
        next.type = 'button';
        next.addEventListener('click', function () { i++; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
        actions.appendChild(next);
      }
      var sub = el('button', 'btn btn-primary', t('exam.submit'));
      sub.type = 'button';
      sub.addEventListener('click', function () {
        var un = answers.filter(function (a) { return a === null; }).length;
        if (un > 0 && !confirm(t('exam.confirmSubmit', { n: un }))) return;
        submit(false);
      });
      actions.appendChild(sub);
      card.appendChild(actions);
      shell.appendChild(card);
      root.appendChild(shell);
    }

    function submit(auto) {
      if (submitted) return;
      submitted = true;
      if (timer) { clearInterval(timer); timer = null; }
      submit.auto = !!auto;
      var correct = 0;
      list.forEach(function (q, idx) { if (answers[idx] === q.answer) correct++; });
      submit.correct = correct;
      submit.used = Math.round((Date.now() - startedAt) / 1000);
      paintResult();
    }

    /* 结果页：可重绘（切换语言时重新生成文案，不改变成绩） */
    function paintResult() {
      var auto = submit.auto;
      var correct = submit.correct;
      var used = submit.used;
      var n = list.length;
      var need = Math.ceil(n * 0.9);
      var pass = correct >= need;

      root.innerHTML = '';
      var shell = el('div', 'quiz-shell');

      var card = el('div', 'card result-hero');
      card.appendChild(el('div', 'result-score ' + (pass ? 'pass' : 'fail'), correct + ' / ' + n));
      card.appendChild(el('div', 'result-verdict', pass ? t('exam.passed') : t('exam.failed')));
      card.appendChild(el('div', 'result-sub',
        (auto ? t('exam.timeUp') : '') +
        t('exam.resultSub', { pct: Math.round(correct / n * 100), need: need })));

      var grid = el('div', 'result-grid');
      [[t('exam.statCorrect'), String(correct)], [t('exam.statWrong'), String(n - correct)], [t('exam.statUsed'), fmtTime(used)], [t('exam.statRate'), Math.round(correct / n * 100) + '%']]
        .forEach(function (pair) {
          var s = el('div', 'result-stat');
          s.appendChild(el('b', '', pair[1]));
          s.appendChild(el('span', '', pair[0]));
          grid.appendChild(s);
        });
      card.appendChild(grid);

      var acts = el('div', 'quiz-actions');
      acts.style.justifyContent = 'center';
      var again = el('a', 'btn btn-primary', t('exam.retake'));
      again.href = location.pathname;
      acts.appendChild(again);
      var home = el('a', 'btn btn-ghost', t('common.backHome'));
      home.href = '../../';
      acts.appendChild(home);
      card.appendChild(acts);
      shell.appendChild(card);

      // 逐题回顾
      var rev = el('div', 'card card-pad');
      rev.style.marginTop = '18px';
      rev.appendChild(el('h3', '', t('exam.review')));
      list.forEach(function (q, idx) {
        var mine = answers[idx];
        var ok = mine === q.answer;
        var box = el('div');
        box.style.padding = '16px 0';
        box.style.borderTop = '1px solid var(--line)';

        var tag = el('span', 'pill', ok ? t('exam.tagCorrect') : (mine === null ? t('exam.tagUnanswered') : t('exam.tagWrong')));
        tag.style.background = ok ? 'var(--ok-soft)' : 'var(--bad-soft)';
        tag.style.color = ok ? 'var(--ok)' : 'var(--bad)';
        tag.style.marginRight = '8px';
        var t2 = el('p');
        t2.style.fontWeight = '700';
        t2.style.margin = '0 0 8px';
        t2.appendChild(tag);
        t2.appendChild(document.createTextNode(catName(q.category) + ' · ' + t('exam.questionN', { n: idx + 1 })));
        box.appendChild(t2);

        var qt = el('p');
        qt.style.fontWeight = '600';
        qt.style.marginBottom = '8px';
        qt.textContent = lq(q).q;
        box.appendChild(qt);

        var fig = figure(q, q.image && q.image.indexOf('sv-') === 0);
        if (fig) box.appendChild(fig);

        var ul = el('ul', 'opts');
        var lq2 = lq(q);
        lq2.options.forEach(function (text, oi) {
          var li = el('li');
          var d = el('div', 'opt');
          d.style.cursor = 'default';
          if (oi === q.answer) d.classList.add('is-correct');
          else if (oi === mine) d.classList.add('is-wrong');
          else d.classList.add('is-muted');
          d.appendChild(el('span', 'opt-key', LETTERS[oi]));
          d.appendChild(el('span', 'opt-body', text));
          li.appendChild(d);
          ul.appendChild(li);
        });
        box.appendChild(ul);

        var e = el('p');
        e.style.margin = '10px 0 0';
        e.style.fontSize = '.9rem';
        e.style.color = 'var(--ink-2)';
        e.textContent = t('common.explanation') + '：' + lq(q).explanation;
        box.appendChild(e);

        rev.appendChild(box);
      });
      shell.appendChild(rev);

      root.appendChild(shell);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    render();
    startTimer();
    document.addEventListener('rc:locale', function () { if (submitted) paintResult(); else render(); });
  }

  /* ---------- 启动 ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    hydrateThumbs();
    var root = document.getElementById('rc-app');
    if (!root) return;
    var mode = root.getAttribute('data-mode');
    if (mode === 'study') Study(root, root.getAttribute('data-category'));
    else if (mode === 'exam') Exam(root, parseInt(root.getAttribute('data-count'), 10) || 35);
  });

  /* 键盘快捷键：理论学习模式下 1-4 选项 / 左右翻页 */
  document.addEventListener('keydown', function (e) {
    if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    var opts = document.querySelectorAll('.opt:not([disabled])');
    if (/^[1-6]$/.test(e.key) && opts.length) {
      var idx = parseInt(e.key, 10) - 1;
      if (opts[idx]) { opts[idx].click(); e.preventDefault(); }
    }
  });
})();
