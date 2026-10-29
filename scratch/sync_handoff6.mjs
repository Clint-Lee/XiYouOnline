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
  '## 最新接手说明（三）：鼍洁换甲机制（2026-10-22 收尾）',
  [
    '## 最新接手说明（六）：第十六回 火焰山（2026-10-22 收尾）',
    '',
    '基线 **2266/2266**。',
    '',
    '- 第十六回火焰山闭环：8 阶段 + 9 对白 + 6 NPC + 地图 7.1%→42.7% 重建',
    '- 核心张力"悟空从取巧转向担责"已落实且有断言',
    '- **修掉四章起点未接入的断链**（此前 ensure*ChapterStarted 从未被调用）',
    '',
    '**下一处优先**：',
    '1. 盘丝洞（第十七回）——西行出口已通',
    '2. 所有章节实机走查（P0，仍是 Node 层验证）',
    '3. Boss 机制表现层演出（P1，目前只有日志无视觉）',
    '',
    '---',
    '',
    ''
  ].join('\n'),
  '（六）：第十六回 火焰山');
