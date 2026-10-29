import fs from 'node:fs';
const p = 'js/app2d.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

if (s.includes('this.ensureHeishuiChapterStarted();')) { console.log('已接入'); process.exit(0); }

const lines = s.split('\n');
// 精确锚点：第 1614 行是 updateLocationHeader，第 1615 行是 updatePlayerHud（_applyMapData 内）
const anchorIdx = lines.findIndex(l => l.includes('updateLocationHeader(mapData.name, mapData.region)'));
if (anchorIdx < 0) { console.error('未找到 updateLocationHeader'); process.exit(1); }
console.log('锚点行:', anchorIdx + 1, JSON.stringify(lines[anchorIdx]));
console.log('下一行:', anchorIdx + 2, JSON.stringify(lines[anchorIdx + 1]));

// 在 updatePlayerHud() 那行之后插入
const inject = [
  '',
  '    // 章节起点初始化：只在上一个章节刚完结时触发，重复入图或后续章节回访均不回退',
  '    this.ensureHeishuiChapterStarted();',
  '    this.ensureChediChapterStarted();',
  '    this.ensureTongtianChapterStarted();',
  '    this.ensureHuoyanChapterStarted();'
];
lines.splice(anchorIdx + 2, 0, ...inject);
s = lines.join('\n');
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 四章起点已接入');
