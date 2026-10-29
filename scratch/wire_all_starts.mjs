import fs from 'node:fs';
const p = 'js/app2d.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

if (s.includes('this.ensureTongtianChapterStarted();')) { console.log('已接入'); process.exit(0); }

// 用 checkAndTriggerChapterOpening 的前一行作锚点（该方法在 _applyMapData 末尾）
const from = `    // 🌟 检查并自动触发当前章节国风开幕动画 (每个章节每位玩家只开幕一次，持久化到存档)
    this.checkAndTriggerChapterOpening(mapId, this.storyPhase);
  }`;

const to = `    // 章节起点初始化：只在上一个章节刚完结时触发，重复入图或后续章节回访均不回退
    this.ensureHeishuiChapterStarted();
    this.ensureChediChapterStarted();
    this.ensureTongtianChapterStarted();

    // 🌟 检查并自动触发当前章节国风开幕动画 (每个章节每位玩家只开幕一次，持久化到存档)
    this.checkAndTriggerChapterOpening(mapId, this.storyPhase);
  }`;

const c = s.split(from).length - 1;
if (c !== 1) { console.error(`锚点 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 三章起点已接入 _applyMapData');
