// 为 huoyun_aftermath 的最后一步补上阶段推进 action（若尚无）。
import fs from 'node:fs';

const p = 'js/data/storyQuests.js';
let s = fs.readFileSync(p, 'utf8');

const kp = s.indexOf('huoyun_aftermath: {');
if (kp < 0) { console.error('未找到 huoyun_aftermath'); process.exit(2); }

const stepsStart = s.indexOf('steps: [', kp);
let depth = 0, i = stepsStart, endArr = -1;
for (; i < s.length; i++) {
  const c = s[i];
  if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { endArr = i; break; } }
}
if (endArr < 0) { console.error('未找到 steps 结束'); process.exit(2); }

let seg = s.slice(stepsStart, endArr);

// 若最后一步已有 action，则不重复注入
const lastObjStart = seg.lastIndexOf('      {');
const lastObj = seg.slice(lastObjStart);
if (lastObj.includes('action:')) {
  console.log('末步已存在 action，跳过');
  process.exit(0);
}

const lastObjEnd = seg.lastIndexOf('      }');
const injector = [
  ',',
  '        action: () => {',
  '          const app = window.App2D;',
  '          if (!app) return;',
  "          app.storyPhase = 'huoyun_cleared';",
  '          app.refreshMapNpcs();',
  '          app.saveAutoProgress();',
  "          window.showGameMessage('🎉【火云洞功成】三昧真火已息，号山焦土待复。西行大道重开。', 'success', 6000);",
  '        }'
].join('\n');

const newSeg = seg.slice(0, lastObjEnd) + injector + seg.slice(lastObjEnd);
s = s.slice(0, stepsStart) + newSeg + s.slice(endArr);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已为战后对白末步补上阶段推进 action');
