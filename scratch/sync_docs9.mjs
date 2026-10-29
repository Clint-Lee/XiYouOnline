import fs from 'node:fs';
const BT = String.fromCharCode(96);

function prepend(file, anchor, text, marker) {
  let s = fs.readFileSync(file, 'utf8');
  const crlf = s.includes('\r\n');
  if (crlf) s = s.replace(/\r\n/g, '\n');
  if (s.includes(marker)) { console.log(`（${file} 已更新）`); return; }
  const c = s.split(anchor).length - 1;
  if (c !== 1) { console.error(`✗ ${file}: 锚点 ${c} 处`); return; }
  s = s.replace(anchor, text + anchor);
  if (crlf) s = s.replace(/\n/g, '\r\n');
  fs.writeFileSync(file, s, 'utf8');
  console.log(`✓ ${file}`);
}

prepend('NEXT_AI_HANDOFF.md',
  '## 最新接手说明（六）：第十六回 火焰山（2026-10-22 收尾）',
  [
    '## 最新接手说明（七）：第十七回 盘丝洞（2026-10-22 收尾）',
    '',
    '基线 **2386/2386**。',
    '',
    '- 第十七回盘丝洞闭环：8 阶段 + 11 对白 + 5 NPC + 两场战斗',
    '- 采纳 Astra"双重责任"原则：八戒越界担责，蜘蛛精伤人也不获正当性',
    '- 不新增第三类 Boss 机制；破光靠昴日两声啼鸣，不是打血条',
    '- 改编口径：破光者为昴日星官（原著毗蓝婆）、悟空中毒茶（原著另三人）',
    '',
    '**下一处优先**：',
    '1. 狮驼岭（第十八回）——西行出口已通',
    '2. 所有章节实机走查（P0，仍是 Node 层验证）',
    '3. Boss 机制表现层演出（P1）',
    '',
    '---',
    '',
    ''
  ].join('\n'),
  '（七）：第十七回 盘丝洞');

// NEXT_STEPS 更新
{
  const p = 'NEXT_STEPS.md';
  let s = fs.readFileSync(p, 'utf8');
  s = s.replace('| 盘丝洞 / 狮驼岭 / 大雷音寺 | ❌ 地图在、无主线 | — |',
    '| 第十七回 盘丝洞 | ✅ 闭环 | `pansi_cleared` |\n| 狮驼岭 / 大雷音寺 | ❌ 地图在、无主线 | — |');
  s = s.replace('2266/2266 (100.0%)', '2386/2386 (100.0%)');
  s = s.replace('原有 **2266 条断言全部保留并通过**', '原有 **2386 条断言全部保留并通过**');
  s = s.replace('**做盘丝洞（第十七回）**。理由：西行出口已通（火焰山 → `pansidong`）、地图已存在。',
    '**做狮驼岭（第十八回）**。理由：西行出口已通（盘丝洞 → `shituoling`）、地图已存在。');
  fs.writeFileSync(p, s, 'utf8');
  console.log('✓ NEXT_STEPS.md');
}
