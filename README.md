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

## 界面与配色

全站是一套**莫兰迪色系**（低饱和、暖灰中性色）的柔和界面，移动端优先（H5）。

- 设计令牌集中在 `src/styles.css` 顶部（`--bg / --ink / --brand / --ok / --bad / --warn`
  以及圆角、阴影、间距、触摸目标），改主题只需要改那一处
- 品牌色是灰青 `#7c9c97`；8 个学习分类各有一个**同明度、同低饱和**的强调色，
  放在一起不刺眼、又能互相区分
- 阴影用暖灰 `rgba(94,84,74,…)` 而不是纯黑，避免在米白背景上发脏

H5 交互（`@media (max-width: 899px)`）：

- **底部标签栏**：首页 / 理论学习 / 模拟考试三个入口固定在屏幕底部，拇指可达；
  顶栏导航在移动端让位给它
- **答题专注模式**：进入逐题学习或模拟考试时 `<body class="is-focus">`，
  隐藏站点顶栏与页脚，把屏幕让给题目；顶部换成自带的返回按钮，
  **主操作栏固定在屏幕底部**
- **触摸目标**：所有可点控件 ≥44px（Apple HIG / WCAG 2.5.5）
- 适配 `env(safe-area-inset-*)`（刘海屏 / 手势条），`viewport-fit=cover`
- 桌面端（≥900px）自动切回顶栏导航 + 完整面包屑，隐藏标签栏

---

## 技术结构

```
data/*.json        题库（8 个文件，每个分类一个）
src/images.mjs     自绘 SVG 图示库：30 个道路标志 + 4 个路口场景
src/styles.css     样式表（手写，无框架；莫兰迪设计令牌 + H5 布局）
src/app.js         前端交互：逐题学习 + 模拟考试
build.mjs          构建脚本：把题库渲染成静态站点到 dist/
dist/              构建产物（= Cloudflare 静态资源目录，已 gitignore）
tests/e2e.cjs      端到端测试（真实 Chrome + CDP，121 项断言）
wrangler.jsonc     Cloudflare Workers 部署配置
```

构建期就把每一道题渲染成了真实 HTML（含 JSON-LD 结构化数据），
所以搜索引擎能收录全部 216 个题目页；`app.js` 只是渐进增强。

### ⚠️ 构建脚本不做批量删除

`build.mjs` 采用**原地覆盖 + 收尾清理遗留**，而不是「先清空 `dist/` 再重建」。
这不是性能优化，是唯一可行的写法 —— 宿主的"安全删除"垫片会对每一次
`unlink` 拉起一个子进程做守卫检查，并按**每一轮对话累计删除数**设了 50 的阈值，
超了就整轮拒绝删除。本站有 250 个产物文件，先清空再重建必然失败。
详见 `build.mjs` 里 `pruneStale()` 上方的注释。

顺带的好处：稳态重建从 5 分 20 秒降到 **约 0.6 秒**。

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

### ⚠️ 改完题库如果看到「空 body 的 404」就重启 dev server

`wrangler dev` 启动时会读取一次静态资源清单。构建脚本现在是**原地覆盖**
`dist/`（不清空目录），所以多数情况下改完内容它自己能跟上；但如果新增了
页面路径而 dev server 没认出来，症状是未知路径返回**空 body 的 404**
（而 `dist/404.html` 明明是好的）。停掉重新 `npm run dev` 即可。

---

## 部署

```bash
npm run deploy        # = node build.mjs && wrangler deploy
```

改 `wrangler.jsonc` 里的 `name` 会创建**新的** Worker，旧的不会自动删除。

`build.mjs` 里的 `SITE_URL` 默认是线上真实地址，会写进 canonical / sitemap /
og:url。换域名时改那一处，或用环境变量覆盖：

```bash
SITE_URL=https://你的域名 npm run build
```

⚠️ 这个值必须和真实部署地址一致 —— 写成别的域名等于让搜索引擎去收录一个
不存在的主机名。

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
404 状态码 / 静态资源 MIME / **移动端 H5（底部标签栏、专注模式、固定操作栏、
44px 触摸目标、无横向溢出）** / **莫兰迪配色（分类色饱和度上限、theme-color）** /
console 错误。

截图输出在 `tests/shots/`。

同一个脚本可以直接跑线上（把 `BASE` 指过去），验证部署结果：

```bash
BASE=https://nz-roadcode.2412.workers.dev npm test
```

另外 `tests/live-security.cjs` 专门验证**构建目录隔离**是否真的生效 ——
它会逐个请求 `.git/config`、`package.json`、`data/*.json`、`src/*` 等 18 个
不该公开的路径，全部必须返回 404；一旦有一个返回 200，说明源码或提交历史
已经挂在公网上了：

```bash
npm run test:live
```

## 线上地址

https://nz-roadcode.2412.workers.dev
