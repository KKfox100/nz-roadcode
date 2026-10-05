'use strict';

/**
 * 线上安全检查：确认 dist/ 之外的东西没有被上传。
 *
 * `wrangler.jsonc` 的 assets.directory 指向 ./dist，理论上源码不可能泄露；
 * 但 assets 的 exclude 字段是无效的（写了会被静默忽略），所以这一条必须实测，
 * 不能靠"看起来配置对了"。
 */

const { launch } = require('./cdp-client.cjs');

const BASE = process.env.BASE || 'https://nz-roadcode.2412.workers.dev';

// 这些路径必须 404 —— 一旦 200，说明构建目录隔离失效，源码或提交历史已公开
const MUST_404 = [
  '/.git/config',
  '/.git/HEAD',
  '/.gitignore',
  '/package.json',
  '/package-lock.json',
  '/build.mjs',
  '/wrangler.jsonc',
  '/README.md',
  '/data/core.json',
  '/data/sign.json',
  '/data/topics.json',
  '/data/topic-map.json',
  '/src/app.js',
  '/src/images.mjs',
  '/src/styles.css',
  // 抓官方资料用的研究目录 + 构建辅助脚本，属于开发过程产物，不该公开
  '/research/fetch-nzta.cjs',
  '/research/fetch-kannz.cjs',
  '/research/contact-sheet.cjs',
  '/research/official-topics.json',
  '/tools/check-coverage.cjs',
  '/tools/figure-sheet.mjs',
  '/tools/shot-live.cjs',
  '/tests/e2e.cjs',
  '/tests/live-security.cjs',
  '/tests/cdp-client.cjs',
  '/node_modules/.package-lock.json',
  '/.assetsignore',
  '/.wrangler/state'
];

// 这些必须 200
const MUST_200 = [
  '/', '/study/', '/exam/', '/assets/app.js', '/assets/styles.css',
  '/sitemap.xml', '/robots.txt'
];

(async () => {
  const b = await launch({ width: 1200, height: 800 });
  const failures = [];
  try {
    await b.goto(BASE + '/');

    const res = await b.eval(`(async () => {
      const must404 = ${JSON.stringify(MUST_404)};
      const must200 = ${JSON.stringify(MUST_200)};
      const out = { leaked: [], missing: [], headers: {} };
      for (const p of must404) {
        try {
          const r = await fetch(p, { redirect: 'manual' });
          if (r.status !== 404) out.leaked.push(p + ' -> ' + r.status);
        } catch (e) { out.leaked.push(p + ' -> ERR ' + e.message); }
      }
      for (const p of must200) {
        const r = await fetch(p, { redirect: 'manual' });
        if (r.status !== 200) out.missing.push(p + ' -> ' + r.status);
        out.headers[p] = {
          cache: r.headers.get('cache-control') || '',
          type: r.headers.get('content-type') || '',
          nosniff: r.headers.get('x-content-type-options') || '',
          frame: r.headers.get('x-frame-options') || ''
        };
      }
      return out;
    })()`);

    const check = (label, cond, extra) => {
      console.log((cond ? '  ✓ ' : '  ✗ ') + label + (cond ? '' : '  → ' + extra));
      if (!cond) failures.push(label);
    };

    console.log('\n[A] 源码 / 仓库文件不得公开');
    check(`${MUST_404.length} 个敏感路径全部 404`, res.leaked.length === 0, JSON.stringify(res.leaked));

    console.log('\n[B] 站点页面正常');
    check(`${MUST_200.length} 个页面全部 200`, res.missing.length === 0, JSON.stringify(res.missing));

    console.log('\n[C] 响应头');
    const appJs = res.headers['/assets/app.js'];
    check('app.js 是 text/javascript', /javascript/.test(appJs.type), appJs.type);
    check('静态资源有长缓存', /max-age=604800/.test(appJs.cache), appJs.cache);
    check('HTML 短缓存（发版不会拿到旧页面）', /max-age=0/.test(res.headers['/'].cache), res.headers['/'].cache);
    check('有 X-Content-Type-Options: nosniff', /nosniff/.test(res.headers['/'].nosniff), res.headers['/'].nosniff);
    check('有 X-Frame-Options', /SAMEORIGIN/.test(res.headers['/'].frame), res.headers['/'].frame);
  } catch (e) {
    console.error('异常:', e && e.stack || e);
    failures.push('脚本异常');
  } finally {
    await b.close();
  }

  console.log('\n' + '='.repeat(56));
  if (failures.length) {
    console.log('失败 ' + failures.length + ' 项：');
    failures.forEach(f => console.log('  - ' + f));
    process.exit(1);
  }
  console.log('线上安全检查全部通过 ✓');
  process.exit(0);
})();
