# NZ Road Code 中文版

新西兰交规**理论学习**与**模拟考试**站点。纯静态、零广告、零追踪。

> 本站只做两件事：理论学习 + 模拟考试。没有广告位、没有第三方统计、
> 没有驾照翻译/教练中介/卡车摩托题库等与小型汽车驾照理论考试无关的板块。

---

## 内容

- **8 个知识分类，共 216 道中文试题**
  核心规则（28）· 驾驶行为（28）· 停车标识（25）· 紧急事故（25）·
  道路位置（25）· 交通路口（30）· 理论知识（25）· 道路标识（30）
- **逐题学习**：选完答案立刻判分，每题都有中文解析，答错的题在学习结束时汇总回顾
- **4 种模拟考试**：10 / 20 / 35 / 50 题，按分类比例随机抽题，倒计时，
  交卷后给出成绩与逐题回顾（通过线统一为 90%）

### 关于题目来源

全部题干、选项与解析均为**依据新西兰官方道路规则重新撰写的中文原创内容**
（Land Transport (Road User) Rule 2004 / NZ Road Code），
不是从任何第三方题库复制而来。

站内所有道路标志与路口示意图均为**自绘 SVG**（见 `src/images.mjs`），
不使用任何外部图片素材，因此全站没有任何图片请求。

### 免责声明

本站不是新西兰交通局（NZTA / Waka Kotahi）的官方产品。
题目表述与真实考试不完全相同，真实考试请以官方 Road Code 为准。

---

## 技术结构

```
data/*.json        题库（8 个文件，每个分类一个）
src/images.mjs     自绘 SVG 图示库：30 个道路标志 + 4 个路口场景
src/styles.css     样式表（手写，无框架）
src/app.js         前端交互：逐题学习 + 模拟考试
build.mjs          构建脚本：把题库渲染成静态站点到 dist/
dist/              构建产物（= Cloudflare 静态资源目录，已 gitignore）
tests/e2e.cjs      端到端测试（真实 Chrome + CDP，79 项断言）
wrangler.jsonc     Cloudflare Workers 部署配置
```

构建期就把每一道题渲染成了真实 HTML（含 JSON-LD 结构化数据），
所以搜索引擎能收录全部 216 个题目页；`app.js` 只是渐进增强。

### 页面

| 路径 | 说明 |
|---|---|
| `/` | 首页 |
| `/study/` | 理论学习总览（列出全部题目） |
| `/study/<分类>/` | 分类页 + 题目列表 |
| `/study/<分类>/practice/` | 逐题学习（交互） |
| `/study/question/<id>/` | 单题页（题干 + 答案 + 解析） |
| `/exam/` | 模拟考试入口 |
| `/exam/<10\|20\|35\|50>/` | 模拟考试（交互） |
| `/about/` | 关于本站 |

---

## 本地开发

```bash
npm install --include=optional     # 只需 wrangler
npm run build                      # 生成 dist/
npm run dev                        # http://127.0.0.1:8787
npm test                           # 端到端测试（需要先起 dev server）
```

### ⚠️ 改完题库要重启 dev server

`wrangler dev` 在启动时读取一次静态资源清单。如果你在它运行期间
**清空并重建 `dist/`**（`npm run build` 就是这么做的），清单会失效 ——
症状是未知路径返回**空 body 的 404**（而 `dist/404.html` 明明是好的）。
停掉 dev server 重新 `npm run dev` 即可。

---

## 部署

```bash
npm run deploy        # = node build.mjs && wrangler deploy
```

改 `wrangler.jsonc` 里的 `name` 会创建**新的** Worker，旧的不会自动删除。

构建时可用 `SITE_URL` 指定线上域名（影响 canonical / sitemap / og:url）：

```bash
SITE_URL=https://你的域名 npm run build
```

### 为什么 `not_found_handling` 用 `404-page` 而不是 `single-page-application`

本站是真实多页站点，不是哈希路由 SPA。用 `single-page-application`
会让**任意乱输的路径都返回 200 + 首页内容**，形成软 404，
稀释搜索引擎收录质量。用 `404-page` 返回真实的 404 状态码，
并在页面里带 `noindex,follow`。

### 静态资源隔离

`wrangler.jsonc` 的 `assets.directory` 指向 `./dist`，
所以源码、题库、构建脚本、测试脚本都不会被上传。
（`assets` **没有** `exclude` 字段 —— 写了会被静默忽略，靠目录分离才可靠。）

---

## 测试

`tests/e2e.cjs` 用系统已装的 Chrome/Edge 通过 CDP 跑真实浏览器验证，
不依赖 Playwright：

```bash
npm run dev            # 另开一个终端
npm test
```

覆盖：首页 / 理论学习总览 / 分类页 / 单题页 / 逐题学习交互 /
模拟考试全流程（抽题 → 作答 → 交卷 → 成绩 → 逐题回顾）/
404 状态码 / 静态资源 MIME / 移动端横向溢出 / console 错误。

截图输出在 `tests/shots/`。
