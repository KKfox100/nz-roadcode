#!/usr/bin/env bash
# 通过 GitHub REST API 推送 / 拉取（当 git smart-HTTP 的 github.com 被代理拦时用）
#
# 背景与限制（实测于沙箱环境，2026-10-06）：
#   - 代理**按域名**拦：github.com -> 502，api.github.com -> 200。
#     所以 git push（走 github.com）必然失败，但 REST API 通畅。
#   - 沙箱里 Node **无法 spawn 任何子进程**（git/cmd/node/gh 全报 EBUSY），
#     因此不能在 Node 里跑 git —— 这里全部用 bash + curl，只让 Node 做纯计算。
#
# 用法：
#   bash scripts/push-via-api.sh --dry-run   # 只复算 tree 并打印对比，不动远端
#   GH_TOKEN=$(gh auth token) bash scripts/push-via-api.sh
#
# 默认推 HEAD -> origin main。可用环境变量覆盖：
#   RC_REPO=owner/name  RC_REMOTE=origin  RC_BRANCH=main
#
# 原理：把 HEAD 相对其父提交的差异（blobs）经 API 上传，复用父 tree 的其余条目
# 重建 tree，再建 commit、更新 ref。全程自底向上复算 SHA-1 并与 git 本地值比对，
# **任何一步对不上就终止**，绝不推错误的 tree。
set -euo pipefail

REMOTE="${RC_REMOTE:-origin}"
BRANCH="${RC_BRANCH:-main}"

# 从 remote URL 推断 owner/name
REMOTE_URL="$(git remote get-url "$REMOTE")"
DEFAULT_REPO="$(printf '%s' "$REMOTE_URL" | sed -e 's#^git@[^:]*:##' -e 's#^https\?://[^/]*/##' -e 's#\.git$##')"
REPO="${RC_REPO:-$DEFAULT_REPO}"

API="https://api.github.com"
DRY=0
[ "${1:-}" = "--dry-run" ] && DRY=1

TOKEN="${GH_TOKEN:-}"
if [ "$DRY" = "0" ] && [ -z "$TOKEN" ]; then
  echo "缺少 GH_TOKEN。用法：GH_TOKEN=\$(gh auth token) bash scripts/push-via-api.sh" >&2
  exit 1
fi

NODE_BIN="$(command -v node)"

TMP="$(mktemp -d)"
# ⚠ 某些沙箱的"安全删除"垫片会拒绝 mktemp 的路径，清理失败不影响功能。
cleanup() { rm -rf "$TMP" 2>/dev/null || true; }
trap cleanup EXIT

echo "repo      $REPO  ($REMOTE/$BRANCH)"

# ---------- 1. bash 侧采集 git 事实 ----------
HEAD_SHA="$(git rev-parse HEAD)"
PARENT_SHA="$(git rev-parse HEAD^)"
HEAD_TREE="$(git rev-parse HEAD^{tree})"
AUTHOR_NAME="$(git log -1 --format=%an)"
AUTHOR_EMAIL="$(git log -1 --format=%ae)"
AUTHOR_DATE="$(git log -1 --format=%aI)"

echo "HEAD      ${HEAD_SHA:0:7}"
echo "PARENT    ${PARENT_SHA:0:7}"
echo "TREE      $HEAD_TREE"

git diff --name-only "$PARENT_SHA" "$HEAD_SHA" > "$TMP/changed.txt"
: > "$TMP/changed.json"
while IFS= read -r f; do
  [ -z "$f" ] && continue
  sha="$(git rev-parse "HEAD:$f")"
  printf '{"path":"%s","sha":"%s"}\n' "$f" "$sha" >> "$TMP/changed.json"
done < "$TMP/changed.txt"

# ⚠ 以 **HEAD** 的 tree 条目为基准，不能用父提交的：
# 父提交里没有的「新增文件」会被整套替换法漏掉（实测踩过 —— 加了新文件却
# 重建出父 tree，幸好校验闸拦住了）。用 HEAD 的条目就能天然覆盖新增/修改，
# 未改动的文件则沿用父提交的 blob sha（直接复用远端已有对象，不重复上传）。
: > "$TMP/trees.txt"
for d in $(git ls-tree -r -d --name-only "$HEAD_SHA"); do
  echo "=== $d ===" >> "$TMP/trees.txt"
  git ls-tree "$HEAD_SHA:$d" >> "$TMP/trees.txt"
done
echo "=== ROOT ===" >> "$TMP/trees.txt"
git ls-tree "$HEAD_SHA" >> "$TMP/trees.txt"

# 父提交的目录清单（用于判断某个 tree 是否含新增文件而必须重建）
git ls-tree -r -d --name-only "$PARENT_SHA" > "$TMP/parent-dirs.txt"
git ls-tree -r -d --name-only "$HEAD_SHA" > "$TMP/head-dirs.txt"

git log -1 --format=%B > "$TMP/message.txt"
echo "changed   $(tr '\n' ',' < "$TMP/changed.txt" | sed 's/,$//')"

export TMP HEAD_SHA PARENT_SHA HEAD_TREE BRANCH

# ---------- 2. 复算 tree 并校验（纯 Node 计算，读临时文件） ----------
"$NODE_BIN" - <<'NODE'
const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');
const TMP = process.env.TMP;

// git tree 对象 SHA-1：体为 <mode> <name>\0<20B sha> 排序拼接
//
// ⚠ 两个坑（都实测踩过）：
//  a) 排序：git 的 base_name_compare 把**目录名视作追加 '/'**参与比较。
//     根目录顺序是 `.gitignore README.md build.mjs data package.json ...`
//     —— `data` 排在 `build.mjs` 之后。
//  b) 模式串：`git ls-tree` 打印目录为 `040000`（6 位），但 tree 对象里**存
//     `40000`（5 位，前导零去掉）**。直接拿 ls-tree 输出拼字节会算错，
//     且**只有含子目录的 tree 才暴露**（无下级目录的 tree 看起来"正常"）。
function modeStr(mode) {
  return mode.replace(/^0+(?=.)/, '');
}
function key(e) {
  return e.type === 'tree' ? e.name + '/' : e.name;
}
function treeSha(entries) {
  const parts = [];
  for (const e of [...entries].sort((a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0))) {
    parts.push(Buffer.from(`${modeStr(e.mode)} ${e.name}\0`, 'utf8'));
    parts.push(Buffer.from(e.sha, 'hex'));
  }
  const body = Buffer.concat(parts);
  const h = createHash('sha1');
  h.update(Buffer.from(`tree ${body.length}\0`, 'utf8'));
  h.update(body);
  return h.digest('hex');
}

const TREES = {};
let cur = null;
for (const line of fs.readFileSync(path.join(TMP, 'trees.txt'), 'utf8').split('\n')) {
  const m = line.match(/^=== (.+) ===$/);
  if (m) {
    cur = m[1] === 'ROOT' ? '' : m[1];
    TREES[cur] = [];
    continue;
  }
  if (!line.trim() || cur === null) continue;
  const [meta, name] = line.split('\t');
  const [mode, type, sha] = meta.split(' ');
  TREES[cur].push({ mode, type, name, sha });
}

const changed = fs
  .readFileSync(path.join(TMP, 'changed.json'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((l) => JSON.parse(l));
const changedSha = new Map(changed.map((c) => [c.path, c.sha]));

// trees.txt 是 HEAD 的条目，其 sha 已是**目标**值；这里只需确认
// 「以 HEAD 条目为基础能复算出 HEAD tree」——即校验序列化实现正确。
// 未改动文件的 sha 直接来自 HEAD，不需要回退查父提交。
function localTree(dir) {
  return treeSha(
    TREES[dir].map((e) => {
      const full = dir ? `${dir}/${e.name}` : e.name;
      if (e.type === 'tree') return { mode: e.mode, name: e.name, sha: localTree(full) };
      return { mode: e.mode, name: e.name, sha: e.sha };
    })
  );
}

const got = localTree('');
const want = process.env.HEAD_TREE;
console.log(`rebuilt   ${got}`);
console.log(`expected  ${want}`);
if (got !== want) {
  console.error('\n✗ 本地重建 tree 与 HEAD 不一致，终止（绝不推错误的 tree）');
  process.exit(1);
}
console.log('✓ tree 复算一致\n');
NODE

if [ "$DRY" = "1" ]; then
  echo "--dry-run：到此为止，未调用任何写接口。"
  exit 0
fi

# ---------- 3. 上传 blob ----------
echo "上传 blob..."
: > "$TMP/blobs.json"
# ⚠ 上传的必须是**提交里的内容**，不是工作区的文件。
# 用 `git cat-file blob HEAD:<path>` 而非直接读文件 —— 后者会把未提交的
# 本地改动一起推上去（实测踩过：编辑过工具脚本后运行，远端返回的 blob sha
# 与 HEAD 里的不符，说明推的是工作区版本）。校验比对的是 HEAD 的 sha，
# 所以读工作区会直接被那道闸拦下 —— 但正确做法是读提交内容。
while IFS= read -r line; do
  [ -z "$line" ] && continue
  p="$(printf '%s' "$line" | "$NODE_BIN" -e "process.stdout.write(JSON.parse(require('fs').readFileSync(0,'utf8')).path)")"
  want="$(printf '%s' "$line" | "$NODE_BIN" -e "process.stdout.write(JSON.parse(require('fs').readFileSync(0,'utf8')).sha)")"
  b64="$(git cat-file blob "HEAD:$p" | base64 -w0)"
  resp="$(curl -sS -X POST "$API/repos/$REPO/git/blobs" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    -d "{\"content\":\"$b64\",\"encoding\":\"base64\"}")"
  sha="$(printf '%s' "$resp" | "$NODE_BIN" -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);if(!j.sha){console.error(JSON.stringify(j));process.exit(1)}process.stdout.write(j.sha)})")"
  if [ "$sha" = "$want" ]; then
    echo "  $p  ${sha:0:9}  ✓ 与提交内容一致"
  else
    echo "  ✗ $p blob sha 不符：远端 ${sha:0:9} / 提交里 ${want:0:9}" >&2
    exit 1
  fi
  printf '{"path":"%s","remoteSha":"%s"}\n' "$p" "$sha" >> "$TMP/blobs.json"
done < "$TMP/changed.json"

# ---------- 4. 建 tree ----------
export REPO TOKEN API AUTHOR_NAME AUTHOR_EMAIL AUTHOR_DATE
# ⚠ 这里同时用了 require() 和 await。Node 从 stdin 读代码时若见到**顶层 await**
# 会猜"这是 ESM"，可又发现了 require()，于是抛 ERR_AMBIGUOUS_MODULE_SYNTAX。
# 解决：把 await 包进 async IIFE —— 顶层没有 await，判定为 CommonJS。
"$NODE_BIN" - <<'NODE'
const fs = require('fs');
const path = require('path');
const TMP = process.env.TMP;
const REPO = process.env.REPO;
const TOKEN = process.env.TOKEN;
const API = process.env.API;
const BRANCH = process.env.BRANCH;

(async () => {

const TREES = {};
let cur = null;
for (const line of fs.readFileSync(path.join(TMP, 'trees.txt'), 'utf8').split('\n')) {
  const m = line.match(/^=== (.+) ===$/);
  if (m) { cur = m[1] === 'ROOT' ? '' : m[1]; TREES[cur] = []; continue; }
  if (!line.trim() || cur === null) continue;
  const [meta, name] = line.split('\t');
  const [mode, type, sha] = meta.split(' ');
  TREES[cur].push({ mode, type, name, sha });
}

// trees.txt 是 **HEAD** 的条目（含新增文件），所以 sha 已是目标值：
//   - 变更文件的条目 sha 来自 HEAD（即新内容）
//   - 未变更文件的条目 sha 也来自 HEAD，与父提交相同 → 远端已有该对象
// 需要重建的 tree = 自身含变更文件，或**任意子孙**含变更文件。
const remote = new Map();
for (const l of fs.readFileSync(path.join(TMP, 'blobs.json'), 'utf8').trim().split('\n').filter(Boolean)) {
  const j = JSON.parse(l);
  remote.set(j.path, j.remoteSha);
}

// 哪些目录需要重算：所有「父提交没有」的目录 + 所有变更文件的祖先目录
const parentDirs = new Set(
  fs.readFileSync(path.join(TMP, 'parent-dirs.txt'), 'utf8').split('\n').filter(Boolean)
);
const headDirs = fs.readFileSync(path.join(TMP, 'head-dirs.txt'), 'utf8').split('\n').filter(Boolean);
const touched = new Set();
for (const d of headDirs) {
  // 新增目录（父提交没有）必须重建
  if (!parentDirs.has(d)) touched.add(d);
}
for (const p of remote.keys()) {
  // 变更文件的每一级祖先目录都要重建（含根 ''）
  const parts = p.split('/');
  touched.add('');
  for (let i = 0; i < parts.length - 1; i++) touched.add(parts.slice(0, i + 1).join('/'));
}
console.log('  需重建目录:', [...touched].map((d) => d || '.').join(', '));

async function api(method, p, body) {
  const res = await fetch(API + p, {
    method,
    headers: {
      Authorization: 'Bearer ' + TOKEN,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'push-via-api',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${p} -> ${res.status}\n${text.slice(0, 800)}`);
  return text ? JSON.parse(text) : null;
}

// 以 HEAD 条目为基准建 tree：变更文件换成远端 blob sha，子目录递归
async function makeTree(dir) {
  const entries = [];
  for (const e of TREES[dir]) {
    const full = dir ? `${dir}/${e.name}` : e.name;
    if (e.type === 'tree') {
      entries.push({
        path: e.name,
        mode: e.mode,
        type: 'tree',
        sha: touched.has(full) ? await makeTree(full) : e.sha,
      });
    } else {
      entries.push({ path: e.name, mode: e.mode, type: 'blob', sha: remote.get(full) || e.sha });
    }
  }
  const r = await api('POST', `/repos/${REPO}/git/trees`, { tree: entries });
  return r.sha;
}

const NEW_TREE = await makeTree('');
console.log('  远端 tree =', NEW_TREE);
if (NEW_TREE !== process.env.HEAD_TREE) {
  console.error('✗ 远端 tree 与 HEAD 不一致，终止');
  process.exit(1);
}
console.log('✓ 远端 tree 与 HEAD 一致');

// ---------- 5. 建 commit ----------
const msg = fs.readFileSync(path.join(TMP, 'message.txt'), 'utf8').replace(/\n+$/, '');
const author = {
  name: (process.env.AUTHOR_NAME || '').trim(),
  email: (process.env.AUTHOR_EMAIL || '').trim(),
  date: (process.env.AUTHOR_DATE || '').trim(),
};
const NEW_COMMIT = await api('POST', `/repos/${REPO}/git/commits`, {
  message: msg, tree: NEW_TREE, parents: [process.env.PARENT_SHA], author, committer: author,
});
console.log('远端 commit =', NEW_COMMIT.sha);

// ---------- 6. 更新 ref ----------
const ref = await api('GET', `/repos/${REPO}/git/ref/heads/${BRANCH}`);
if (ref.object.sha !== process.env.PARENT_SHA) {
  console.error(`✗ 远端 ${BRANCH} 不是期望父提交 ${process.env.PARENT_SHA.slice(0,7)}（现 ${ref.object.sha.slice(0,7)}），终止以免覆盖`);
  process.exit(1);
}
await api('PATCH', `/repos/${REPO}/git/refs/heads/${BRANCH}`, { sha: NEW_COMMIT.sha, force: false });
const after = await api('GET', `/repos/${REPO}/git/ref/heads/${BRANCH}`);
console.log(`远端 ${BRANCH}  =`, after.object.sha);
console.log(after.object.sha === NEW_COMMIT.sha ? '\n✓✓ 推送成功' : '\n⚠ 请核对');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
NODE

echo ""
echo "提示：远端 commit 的 sha 可能与本地不同（committer 元数据差异），"
echo "      但 tree 已逐字节校验一致。对齐本地："
echo "      git fetch $REMOTE $BRANCH && git reset --soft $REMOTE/$BRANCH"
