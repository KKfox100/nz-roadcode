/* ==========================================================================
   运行时多语言层（构建产物，请勿手改）
   --------------------------------------------------------------------------
   由 build.mjs 从 src/i18n.mjs + 各语言内容模块生成。

   暴露：
     window.RC_I18N = {
       LOCALES, NATIVE, SHORT, HTML_LANG, OG,
       UI,            // locale -> { key: text }
       CATEGORY_NAME, // catId -> { locale: name }
       CATEGORY_SUMMARY,
       CONTENT,       // locale -> { qid: { q, o:[4], e } }
       get(), set(loc), t(key, vars), q(qid), catName(id), catSummary(id), apply(root)
     }

   设计要点
   --------
   * **选项顺序在每种语言里都与 data/*.json 完全一致** —— answer 是数字索引，
     直接套用。构建期的 assertComplete() 守着这条（顺序变了会报错）。
   * 语言偏好存 localStorage（key = rc-locale），刷新后保持。
   * <html lang> 与 hreflang 由构建期写好；运行时切换只改 <html lang> 与文案。
   * 站点是纯静态 SSG，切换语言**不重新请求页面**，只换 DOM 文案与题库内容。
   ========================================================================== */

(function () {
  'use strict';

  var RC = window.RC_I18N || {};

  var LOCALES = RC.LOCALES || ['zh-Hans'];
  var UI = RC.UI || {};
  var CONTENT = RC.CONTENT || {};
  var CATEGORY_NAME = RC.CATEGORY_NAME || {};
  var CATEGORY_SUMMARY = RC.CATEGORY_SUMMARY || {};
  var HTML_LANG = RC.HTML_LANG || {};
  var STORE_KEY = 'rc-locale';

  var current = 'zh-Hans';

  /* ---------- 语言偏好 ---------- */

  function detect() {
    var saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* 隐私模式 */ }
    if (saved && LOCALES.indexOf(saved) !== -1) return saved;

    // 没存过就跟浏览器语言对齐（zh-TW/HK -> 繁，zh -> 简，其余按主语言匹配）
    var list = navigator.languages || [navigator.language || 'zh-Hans'];
    for (var i = 0; i < list.length; i++) {
      var tag = String(list[i]);
      var low = tag.toLowerCase();
      if (low === 'zh-tw' || low === 'zh-hk' || low === 'zh-mo' || low === 'zh-hant') return 'zh-Hant';
      if (low.indexOf('zh') === 0) return 'zh-Hans';
      var base = low.split('-')[0];
      var hit = LOCALES.filter(function (l) { return l.split('-')[0] === base; })[0];
      if (hit && base !== 'zh') return hit;
    }
    return 'zh-Hans';
  }

  /* ---------- 文案 ---------- */

  /** t('study.catMeta', { n: 12 }) —— {name} 占位符替换。缺键时回退简体，再缺则回显键名。 */
  function t(key, vars) {
    var dict = UI[current] || {};
    var s = dict[key];
    if (s == null) s = (UI['zh-Hans'] || {})[key];
    if (s == null) return key;
    if (vars) {
      s = String(s).replace(/\{(\w+)\}/g, function (m, name) {
        return (vars[name] != null) ? String(vars[name]) : m;
      });
    }
    return s;
  }

  /** 取某题在某语言下的内容。缺内容时回退到简体。 */
  function contentFor(qid) {
    var bucket = CONTENT[current] || {};
    return bucket[qid] || (CONTENT['zh-Hans'] || {})[qid] || null;
  }

  /** 合并后的题目对象：{ q, options, answer, explanation, image, id }（另带 o/e 原始字段） */
  function q(qid) {
    var src = (window.RC_BANK && RC_INDEX && RC_INDEX[qid]) || null;
    var c = contentFor(qid);
    if (!src && !c) return null;
    if (!c) return src;
    return {
      id: qid,
      q: c.q,
      options: c.o,
      answer: src ? src.answer : 0,
      explanation: c.e,
      image: src ? src.image : undefined,
      category: src ? src.category : undefined,
      o: c.o,
      e: c.e
    };
  }

  /** 简体（canonical）的分类名/摘要不在词典里 —— 取题库源数据。 */
  function srcCat(id) {
    var bank = window.RC_BANK;
    if (!bank || !bank.categories) return null;
    return bank.categories.filter(function (c) { return c.id === id; })[0] || null;
  }

  function catName(id) {
    if (current === 'zh-Hans') {
      var s = srcCat(id);
      if (s) return s.name;
    }
    var m = CATEGORY_NAME[id];
    if (m) {
      var v = m[current] || m['zh-Hant'] || m.en;
      if (v) return v;
    }
    var s2 = srcCat(id);
    return s2 ? s2.name : id;
  }

  function catSummary(id) {
    if (current === 'zh-Hans') {
      var s = srcCat(id);
      if (s) return s.summary;
    }
    var m = CATEGORY_SUMMARY[id];
    if (m) {
      var v = m[current] || m['zh-Hant'] || m.en;
      if (v) return v;
    }
    var s2 = srcCat(id);
    return s2 ? s2.summary : '';
  }

  /* ---------- 应用 ---------- */

  var RC_INDEX = null;
  function buildIndex() {
    if (RC_INDEX) return RC_INDEX;
    RC_INDEX = {};
    var bank = window.RC_BANK;
    if (bank && bank.categories) {
      bank.categories.forEach(function (cat) {
        cat.questions.forEach(function (qq) {
          RC_INDEX[qq.id] = Object.assign({}, qq, { category: cat.id });
        });
      });
    }
    return RC_INDEX;
  }

  /** 从元素上取数据集里的数字参数（data-n / data-t / data-c）。 */
  function numVars(n) {
    var v = {};
    ['n', 't', 'c'].forEach(function (k) {
      var raw = n.getAttribute('data-' + k);
      if (raw != null) v[k] = raw;
    });
    var extra = n.getAttribute('data-i18n-vars');
    if (extra) {
      try { Object.assign(v, JSON.parse(extra)); } catch (e) { /* ignore */ }
    }
    return (v.n != null || v.t != null || v.c != null) ? v : null;
  }

  /**
   * 把所有带 data-i18n* 的节点按当前语言重写。
   * 支持的属性：
   *   data-i18n                       文本内容
   *   data-i18n-aria                  aria-label（键名）
   *   data-i18n-title                 <title>（配合 data-i18n-title-suffix）
   *   data-i18n-attr="attr:key,..."   任意属性
   *   data-i18n-cat="name|summary"    分类名/摘要（配合 data-cat）
   *   data-i18n-q                     题干（配合题目 id）
   *   data-i18n-q-opts                选项列表（按 data-opt 索引）
   *   data-i18n-q-answer              正确选项文本
   *   data-i18n-q-expl                解析
   */
  function applyStatic(root) {
    root = root || document;

    // 文本
    Array.prototype.forEach.call(root.querySelectorAll('[data-i18n]'), function (n) {
      n.textContent = t(n.getAttribute('data-i18n'), numVars(n));
    });

    // aria-label
    Array.prototype.forEach.call(root.querySelectorAll('[data-i18n-aria]'), function (n) {
      var vars = numVars(n) || {};
      // nav.backTo 的 {label} 取自紧随的 .back-target（已本地化）
      var key = n.getAttribute('data-i18n-aria');
      if (key === 'nav.backTo') {
        var tgt = n.querySelector('.back-target');
        if (tgt && vars.label == null) vars = Object.assign({}, vars, { label: tgt.textContent });
      }
      n.setAttribute('aria-label', t(key, Object.keys(vars).length ? vars : null));
    });

    // 文档标题：data-i18n-title（+ data-i18n-title-suffix）
    var titleNode = root.querySelector ? root.querySelector('[data-i18n-title]') : null;
    if (titleNode) {
      var base = t(titleNode.getAttribute('data-i18n-title'));
      // 分类标题走 cat.* 键 → 用 CATEGORY_NAME
      var cid = titleNode.getAttribute('data-cat');
      if (cid) base = catName(cid);
      document.title = base + (titleNode.getAttribute('data-i18n-title-suffix') || '');
    }

    // 任意属性
    Array.prototype.forEach.call(root.querySelectorAll('[data-i18n-attr]'), function (n) {
      n.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length === 2) n.setAttribute(bits[0].trim(), t(bits[1].trim(), numVars(n)));
      });
    });

    // 分类名 / 摘要（data-cat 可能挂在自己或最近的祖先上，如 .cat-card）
    Array.prototype.forEach.call(root.querySelectorAll('[data-i18n-cat]'), function (n) {
      var host = n.hasAttribute('data-cat') ? n : n.closest('[data-cat]');
      var cid = host && host.getAttribute('data-cat');
      if (!cid) return;
      var kind = n.getAttribute('data-i18n-cat');
      n.textContent = kind === 'summary' ? catSummary(cid) : catName(cid);
    });

    // 题目内容（单题页）
    Array.prototype.forEach.call(root.querySelectorAll('[data-i18n-q]'), function (n) {
      var c = contentFor(n.getAttribute('data-i18n-q'));
      if (c) n.textContent = c.q;
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-i18n-q-opts]'), function (list) {
      var c = contentFor(list.getAttribute('data-i18n-q-opts'));
      if (!c) return;
      Array.prototype.forEach.call(list.querySelectorAll('[data-opt]'), function (o) {
        var i = parseInt(o.getAttribute('data-opt'), 10);
        var body = o.querySelector('.opt-body');
        if (body && c.o[i] != null) body.textContent = c.o[i];
      });
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-i18n-q-answer]'), function (n) {
      var c = contentFor(n.getAttribute('data-i18n-q-answer'));
      if (!c) return;
      var src = (RC_INDEX || {})[n.getAttribute('data-i18n-q-answer')];
      var idx = src ? src.answer : 0;
      if (c.o[idx] != null) n.textContent = c.o[idx];
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-i18n-q-expl]'), function (n) {
      var c = contentFor(n.getAttribute('data-i18n-q-expl'));
      if (c) n.textContent = c.e;
    });

    // 语言切换器当前态
    Array.prototype.forEach.call(root.querySelectorAll('[data-lang]'), function (n) {
      var on = n.getAttribute('data-lang') === current;
      n.classList.toggle('is-active', on);
      if (on) n.setAttribute('aria-current', 'true');
      else n.removeAttribute('aria-current');
    });
  }

  /** 设置语言：更新偏好、<html lang>、静态文案，并通知页面重绘内容。 */
  function set(loc, opts) {
    if (LOCALES.indexOf(loc) === -1) loc = 'zh-Hans';
    current = loc;
    try { localStorage.setItem(STORE_KEY, loc); } catch (e) { /* ignore */ }
    document.documentElement.setAttribute('lang', HTML_LANG[loc] || loc);
    applyStatic();
    if (!opts || opts.silent !== true) {
      document.dispatchEvent(new CustomEvent('rc:locale', { detail: { locale: loc } }));
    }
  }

  function get() { return current; }

  /* ---------- 启动 ---------- */

  function boot() {
    buildIndex();
    set(detect(), { silent: true });

    // 顶栏语言切换器的点击
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-lang]') : null;
      if (!btn) return;
      e.preventDefault();
      var loc = btn.getAttribute('data-lang');
      if (loc && loc !== current) set(loc);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.RC_I18N = {
    LOCALES: LOCALES,
    NATIVE: RC.NATIVE || {},
    SHORT: RC.SHORT || {},
    HTML_LANG: HTML_LANG,
    OG: RC.OG || {},
    UI: UI,
    CONTENT: CONTENT,
    CATEGORY_NAME: CATEGORY_NAME,
    CATEGORY_SUMMARY: CATEGORY_SUMMARY,
    get: get,
    set: set,
    t: t,
    q: q,
    catName: catName,
    catSummary: catSummary,
    apply: applyStatic,
    index: buildIndex
  };
})();
