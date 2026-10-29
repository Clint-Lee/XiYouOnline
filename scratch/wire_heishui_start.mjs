import fs from 'node:fs';
const p = 'js/app2d.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

const from = `    // 🌟 检查并自动触发当前章节国风开幕动画 (每个章节每位玩家只开幕一次，持久化到存档)
    this.checkAndTriggerChapterOpening(mapId, this.storyPhase);
  }`;

const to = `    // 第十三回：首次进入黑水河时初始化章节起点（只在上一章刚完结时触发，不回退）
    this.ensureHeishuiChapterStarted();

    // 🌟 检查并自动触发当前章节国风开幕动画 (每个章节每位玩家只开幕一次，持久化到存档)
    this.checkAndTriggerChapterOpening(mapId, this.storyPhase);
  }`;

const c = s.split(from).length - 1;
if (c !== 1) { console.error(`锚点匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已接入 ensureHeishuiChapterStarted');
