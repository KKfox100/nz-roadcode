#!/usr/bin/env node
/**
 * 从 src/img/_hero-source.jpg 生成首屏照片的多尺寸 / 多格式版本。
 *
 * ⚠️ 这是一个**手动运行**的一次性工具，不在构建流程里 —— 构建只负责把
 * src/img/ 里已经生成好的文件拷进 dist/。这样部署不依赖 sharp
 * （原生模块，装起来慢，还得跟平台对版本）。
 *
 * 换图时：
 *   1. 把新图存成 src/img/_hero-source.jpg
 *      （`_` 前缀 = 源图，buildAssets 会跳过，不会传上 CDN）
 *   2. 跑这个脚本
 *   3. 提交 src/img/ 下的产物
 *
 * 运行（sharp 装在 WorkBuddy 托管的 node 工作区里，不要装到项目里）：
 *   NODE_PATH="C:/Users/jack/.workbuddy-ai/binaries/node/workspace/node_modules" \
 *     node tools/make-hero-images.mjs
 *
 * 实测收益：277KB 的源 JPEG → 1140 avif 77KB / webp 120KB，
 * 移动端实际只会下 720 avif（42KB）。
 */

import { createRequire } from 'node:module';
import { existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'src', 'img');
const SRC = join(IMG, '_hero-source.jpg');

/* 宽度档位要和 build.mjs 里的 HERO.widths 保持一致。
 *
 * 为什么是 640 / 800 / 1140：
 * 首屏图用 sizes="100vw"，浏览器按「视口宽 × DPR」挑最小的够用档。
 *   - 1× 手机（390 CSS）→ 需要 390 → 拿 640
 *   - 2× 手机（390 CSS）→ 需要 780 → 拿 800（只有 720 的话它会跳到 1140，多下 30KB）
 *   - 1× 桌面（1440 CSS）→ 需要 1440 → 拿最大的 1140（源图就只有 1140 宽）
 */
const WIDTHS = [640, 800, 1140];
const AVIF_QUALITY = 52;
const WEBP_QUALITY = 76;
const JPEG_QUALITY = 82;

const kb = p => (statSync(p).size / 1024).toFixed(0) + 'KB';

if (!existsSync(SRC)) {
  console.error(`✗ 找不到源图：${SRC}`);
  process.exit(1);
}

const meta = await sharp(SRC).metadata();
console.log(`源图 ${meta.width}×${meta.height} (${meta.format}, ${kb(SRC)})`);

if (Math.max(...WIDTHS) > meta.width) {
  console.warn(`⚠ 最大档位 ${Math.max(...WIDTHS)} 超过源图宽度 ${meta.width}，` +
    `再大的档位只是放大、不会更清晰。`);
}

for (const w of WIDTHS) {
  for (const fmt of ['avif', 'webp']) {
    const out = join(IMG, `hero-${w}.${fmt}`);
    await sharp(SRC)
      .resize({ width: w })
      .toFormat(fmt, { quality: fmt === 'avif' ? AVIF_QUALITY : WEBP_QUALITY })
      .toFile(out);
    console.log(`  ✓ hero-${w}.${fmt}  ${kb(out)}`);
  }
}

/* jpeg 兜底：给不支持 avif/webp 的浏览器（现在基本只剩很老的 Safari） */
const jpgOut = join(IMG, `hero-${Math.max(...WIDTHS)}.jpg`);
await sharp(SRC)
  .resize({ width: Math.max(...WIDTHS) })
  .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
  .toFile(jpgOut);
console.log(`  ✓ hero-${Math.max(...WIDTHS)}.jpg  ${kb(jpgOut)}`);

console.log('\n完成。记得同步更新 build.mjs 里的 HERO.widths 和首页 <img> 的尺寸。');
