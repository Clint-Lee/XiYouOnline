import fs from 'node:fs';
const p = 'js/data/storyQuests.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

// 找 CHAPTER_CONFIGS 的结尾（chapter_11 之后）
const anchor = `      triggerMap: 'pingdingshan',
      triggerPhase: 'baoxiang_cleared'
    }
  };`;

const block = `      triggerMap: 'pingdingshan',
      triggerPhase: 'baoxiang_cleared'
    },
    'chapter_12': {
      id: 'chapter_12',
      chapterNum: '第十二回',
      title: '第十二回 · 火云烈焰',
      subtitle: '号山枯松涧火起，圣婴假意诱取经人',
      seal: '圣婴伏火',
      triggerMap: 'huoyundong',
      triggerPhase: 'huoyun_arrived'
    },
    'chapter_13': {
      id: 'chapter_13',
      chapterNum: '第十三回',
      title: '第十三回 · 黑水擒龙',
      subtitle: '黑水横流摄圣僧，龙子奉令擒妖鼍',
      seal: '黑水伏鼍',
      triggerMap: 'heishuihe',
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

const c = s.split(anchor).length - 1;
if (c !== 1) { console.error(`匹配 ${c} 处`); process.exit(1); }
s = s.replace(anchor, block);
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已追加 chapter_12/13/14');
