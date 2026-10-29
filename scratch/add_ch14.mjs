import fs from 'node:fs';
const p = 'js/data/storyQuests.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

if (s.includes("'chapter_14': {")) { console.log('chapter_14 已存在'); process.exit(0); }

const from = `      triggerMap: 'heishuihe',
      triggerPhase: 'heishui_arrived'
    }
  };`;
const to = `      triggerMap: 'heishuihe',
      triggerPhase: 'heishui_arrived'
    },
    'chapter_14': {
      id: 'chapter_14',
      chapterNum: '第十四回',
      title: '第十四回 · 车迟斗法',
      subtitle: '车迟三仙欺佛道，护僧斗法显威灵',
      seal: '车迟显正',
      triggerMap: 'chediguo',
      triggerPhase: 'chedi_arrival'
    }
  };`;

const c = s.split(from).length - 1;
if (c !== 1) { console.error(`匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已追加 chapter_14');
