/* ==========================================================================
   NZ Road Code 中文版 —— 前端交互
   依赖（按顺序加载）：assets/images.js -> assets/questions.js -> 本文件
   ========================================================================== */

(function () {
  'use strict';

  var BANK = window.RC_BANK || { categories: [] };
  var IMAGES = window.RC_IMAGES || {};
  var CAPTIONS = window.RC_CAPTIONS || {};

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
    if (CAPTIONS[q.image]) box.appendChild(el('p', 'fig-cap', CAPTIONS[q.image]));
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
    var cat = CAT_BY_ID[categoryId];
    if (!cat) return;
    var list = cat.questions.slice();
    var i = 0;
    var picked = {};       // index -> 选中的选项
    var revealed = {};     // index -> true

    function render() {
      var q = list[i];
      root.innerHTML = '';

      var shell = el('div', 'quiz-shell');

      /* 进度条 */
      var bar = el('div', 'quiz-bar');
      var row1 = el('div', 'quiz-bar-row');
      row1.appendChild(backBtn(rootPrefix() + 'study/' + cat.id + '/', cat.name));
      row1.appendChild(el('span', 'quiz-count', '第 ' + (i + 1) + ' 题 / 共 ' + list.length + ' 题'));
      row1.appendChild(el('span', 'quiz-timer', cat.name));
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
        ft.textContent = ok ? '✓ 回答正确' : '✕ 回答错误';
        fb.appendChild(ft);
        if (!ok) {
          var p = el('p');
          p.innerHTML = '正确答案是 <b>' + LETTERS[q.answer] + '. ' + esc(q.options[q.answer]) + '</b>';
          fb.appendChild(p);
        }
        var lab = el('div', 'expl-label', '解析');
        fb.appendChild(lab);
        var pe = el('p', '', q.explanation);
        fb.appendChild(pe);
        card.appendChild(fb);
      }

      /* 操作区 */
      var actions = el('div', 'quiz-actions');
      var prev = el('button', 'btn btn-ghost', '上一题');
      prev.type = 'button';
      prev.disabled = i === 0;
      prev.addEventListener('click', function () { i--; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
      actions.appendChild(prev);

      if (!answered) {
        var skip = el('button', 'btn btn-quiet', '看答案');
        skip.type = 'button';
        skip.addEventListener('click', function () {
          picked[i] = -1; revealed[i] = true; render();
        });
        actions.appendChild(skip);
      }

      actions.appendChild(el('div', 'spacer'));

      var next = el('button', 'btn btn-primary', i === list.length - 1 ? '完成学习' : '下一题');
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
      card.appendChild(el('div', 'result-verdict', cat.name + ' 学习完成'));
      card.appendChild(el('div', 'result-sub', '本次共作答 ' + done + ' 题，答对 ' + correct + ' 题，答错 ' + wrongIdx.length + ' 题'));

      var grid = el('div', 'result-grid');
      [['已作答', done + ' / ' + list.length], ['答对', String(correct)], ['答错', String(wrongIdx.length)], ['正确率', pct + '%']]
        .forEach(function (pair) {
          var s = el('div', 'result-stat');
          s.appendChild(el('b', '', pair[1]));
          s.appendChild(el('span', '', pair[0]));
          grid.appendChild(s);
        });
      card.appendChild(grid);

      var acts = el('div', 'quiz-actions');
      acts.style.justifyContent = 'center';
      var again = el('a', 'btn btn-primary', '重新学习本分类');
      again.href = location.pathname;
      acts.appendChild(again);
      var home = el('a', 'btn btn-ghost', '返回首页');
      home.href = '../../';
      acts.appendChild(home);
      card.appendChild(acts);
      shell.appendChild(card);

      if (wrongIdx.length) {
        var wc = el('div', 'card card-pad');
        wc.style.marginTop = '18px';
        wc.appendChild(el('h3', '', '错题回顾（' + wrongIdx.length + ' 题）'));
        wrongIdx.forEach(function (idx) {
          var q = list[idx];
          var box = el('div');
          box.style.padding = '14px 0';
          box.style.borderTop = '1px solid var(--line)';
          var t = el('p');
          t.style.fontWeight = '700';
          t.style.marginBottom = '6px';
          t.textContent = (idx + 1) + '. ' + q.q;
          box.appendChild(t);
          var a = el('p');
          a.style.margin = '0 0 6px';
          a.style.fontSize = '.92rem';
          a.innerHTML = '正确答案：<b>' + LETTERS[q.answer] + '. ' + esc(q.options[q.answer]) + '</b>';
          box.appendChild(a);
          var e = el('p');
          e.style.margin = '0';
          e.style.fontSize = '.9rem';
          e.style.color = 'var(--ink-3)';
          e.textContent = q.explanation;
          box.appendChild(e);
          var link = el('a', 'btn btn-sm btn-quiet', '查看该题');
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

    render();
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
          node.textContent = '剩余 ' + fmtTime(Math.max(0, left));
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
      row1.appendChild(backBtn(rootPrefix() + 'exam/', '模拟考试'));
      row1.appendChild(el('span', 'quiz-count', '第 ' + (i + 1) + ' 题 / 共 ' + list.length + ' 题'));
      var answeredN = answers.filter(function (a) { return a !== null; }).length;
      row1.appendChild(el('span', 'pill', '已答 ' + answeredN + ' 题'));
      row1.appendChild(el('span', 'quiz-timer', '剩余 ' + fmtTime(Math.max(0, left))));
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
      nav.setAttribute('aria-label', '题号导航');
      list.forEach(function (_, idx) {
        var cls = idx === i ? 'is-current' : (answers[idx] !== null ? 'is-done' : '');
        var b = el('button', cls, String(idx + 1));
        b.type = 'button';
        b.setAttribute('aria-label', '第 ' + (idx + 1) + ' 题');
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
      qt.textContent = q.q;
      head.appendChild(qt);
      card.appendChild(head);

      var fig = figure(q, q.image && q.image.indexOf('sv-') === 0);
      if (fig) card.appendChild(fig);

      var opts = el('ul', 'opts');
      q.options.forEach(function (text, idx) {
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
      var prev = el('button', 'btn btn-ghost', '上一题');
      prev.type = 'button';
      prev.disabled = i === 0;
      prev.addEventListener('click', function () { i--; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
      actions.appendChild(prev);
      actions.appendChild(el('div', 'spacer'));
      if (i < list.length - 1) {
        var next = el('button', 'btn btn-primary', '下一题');
        next.type = 'button';
        next.addEventListener('click', function () { i++; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
        actions.appendChild(next);
      }
      var sub = el('button', 'btn btn-primary', '交卷');
      sub.type = 'button';
      sub.addEventListener('click', function () {
        var un = answers.filter(function (a) { return a === null; }).length;
        if (un > 0 && !confirm('还有 ' + un + ' 题未作答，确定要交卷吗？')) return;
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

      var correct = 0;
      list.forEach(function (q, idx) { if (answers[idx] === q.answer) correct++; });
      var n = list.length;
      var need = Math.ceil(n * 0.9);
      var pass = correct >= need;
      var used = Math.round((Date.now() - startedAt) / 1000);

      root.innerHTML = '';
      var shell = el('div', 'quiz-shell');

      var card = el('div', 'card result-hero');
      card.appendChild(el('div', 'result-score ' + (pass ? 'pass' : 'fail'), correct + ' / ' + n));
      card.appendChild(el('div', 'result-verdict', pass ? '通过 ✓' : '未通过'));
      card.appendChild(el('div', 'result-sub',
        (auto ? '时间到，已自动交卷。' : '') +
        '本次正确率 ' + Math.round(correct / n * 100) + '%，通过线为答对 ' + need + ' 题（90%）。'));

      var grid = el('div', 'result-grid');
      [['答对', String(correct)], ['答错', String(n - correct)], ['用时', fmtTime(used)], ['正确率', Math.round(correct / n * 100) + '%']]
        .forEach(function (pair) {
          var s = el('div', 'result-stat');
          s.appendChild(el('b', '', pair[1]));
          s.appendChild(el('span', '', pair[0]));
          grid.appendChild(s);
        });
      card.appendChild(grid);

      var acts = el('div', 'quiz-actions');
      acts.style.justifyContent = 'center';
      var again = el('a', 'btn btn-primary', '再考一次');
      again.href = location.pathname;
      acts.appendChild(again);
      var home = el('a', 'btn btn-ghost', '返回首页');
      home.href = '../../';
      acts.appendChild(home);
      card.appendChild(acts);
      shell.appendChild(card);

      // 逐题回顾
      var rev = el('div', 'card card-pad');
      rev.style.marginTop = '18px';
      rev.appendChild(el('h3', '', '答题回顾'));
      list.forEach(function (q, idx) {
        var mine = answers[idx];
        var ok = mine === q.answer;
        var box = el('div');
        box.style.padding = '16px 0';
        box.style.borderTop = '1px solid var(--line)';

        var tag = el('span', 'pill', ok ? '正确' : (mine === null ? '未作答' : '错误'));
        tag.style.background = ok ? 'var(--ok-soft)' : 'var(--bad-soft)';
        tag.style.color = ok ? 'var(--ok)' : 'var(--bad)';
        tag.style.marginRight = '8px';
        var t = el('p');
        t.style.fontWeight = '700';
        t.style.margin = '0 0 8px';
        t.appendChild(tag);
        t.appendChild(document.createTextNode(q.categoryName + ' · 第 ' + (idx + 1) + ' 题'));
        box.appendChild(t);

        var qt = el('p');
        qt.style.fontWeight = '600';
        qt.style.marginBottom = '8px';
        qt.textContent = q.q;
        box.appendChild(qt);

        var fig = figure(q, q.image && q.image.indexOf('sv-') === 0);
        if (fig) box.appendChild(fig);

        var ul = el('ul', 'opts');
        q.options.forEach(function (text, oi) {
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
        e.textContent = '解析：' + q.explanation;
        box.appendChild(e);

        rev.appendChild(box);
      });
      shell.appendChild(rev);

      root.appendChild(shell);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    render();
    startTimer();
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
