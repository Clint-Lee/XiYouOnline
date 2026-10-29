import fs from 'node:fs';
const p = 'js/app2d.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

if (s.includes('this.ensureHeishuiChapterStarted();')) { console.log('已接入'); process.exit(0); }

// 用 updatePlayerHud() 调用作锚点（_applyMapData 末尾唯一）
const from = `    this.updateLocationHeader(mapData.name, mapData.region);
    this.updatePlayerHud();`;
const to = `    this.updateLocationHeader(mapData.name, mapData.region);
    this.updatePlayerHud();

    // 章节起点初始化：只在上一个章节刚完结时触发，重复入图或后续章节回访均不回退
    this.ensureHeishuiChapterStarted();
    this.ensureChediChapterStarted();
    this.ensureTongtianChapterStarted();
    this.ensureHuoyanChapterStarted();`;
const c = s.split(from).length - 1;
if (c !== 1) { console.error(`匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 四章起点已接入 _applyMapData');
