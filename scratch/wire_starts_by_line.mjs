import fs from 'node:fs';
const p = 'js/app2d.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

if (s.includes('this.ensureHeishuiChapterStarted();')) { console.log('已接入'); process.exit(0); }

const lines = s.split('\n');
// 找第一处 updatePlayerHud() 前的位置（1-based 1615 → index 1614）
const idx = lines.findIndex((l, i) => i < 200 && l.trim() === 'this.updatePlayerHud();');
if (idx < 0) { console.error('未找到插入点'); process.exit(1); }

const inject = [
  '',
  '    // 章节起点初始化：只在上一个章节刚完结时触发，重复入图或后续章节回访均不回退',
  '    this.ensureHeishuiChapterStarted();',
  '    this.ensureChediChapterStarted();',
  '    this.ensureTongtianChapterStarted();',
  '    this.ensureHuoyanChapterStarted();'
];
lines.splice(idx, 0, ...inject);
s = lines.join('\n');
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log(`✓ 已插入到第 ${idx + 1} 行前`);
