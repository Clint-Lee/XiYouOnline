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

const docText = [
  '## 2026-10-22（三）鼍洁「黑水换甲」机制与奖励物品审计',
  '',
  '基线 **1994/1994**。',
  '',
  '1. **黑水换甲（鼍洁专属）**：与红孩儿的五行车阵刻意区分——**没有蓄力、没有爆发窗口、没有即死惩罚**，核心张力是伤害类型选择。',
  '   - 凝鳞：物理防御提升（配置值 45%），法术防御正常 → 宜用法术',
  '   - 散流：法术防御提升，物理防御正常 → 宜用物理',
  '   - 每 2 次**有效行动**后切换；被封印/定身/乱魂拦下的行动不计数',
  '   - 减伤通过 ' + BT + 'applyArmorMitigation(defender, rawDamage, isSpell)' + BT + ' 实时计算，**不改写基础 def/mdef**（否则切换与重试会永久叠加）',
  '   - 抗性不设免疫，同级玩家用任一路线都能击败',
  '2. **全项目奖励物品审计**：新增断言扫描 ' + BT + 'app2d.js' + BT + ' 与 ' + BT + 'storyQuests.js' + BT + ' 里所有 ' + BT + 'itemId' + BT + ' 引用（当前 42 种），校验是否都在 ' + BT + 'GAME_DATA.ITEMS' + BT + ' 定义。此前的 ' + BT + 'eq_nk_huoyun' + BT + ' / ' + BT + 'eq_nk_heishui' + BT + ' 缺口正是这类问题。',
  '',
  '### 补充约定',
  '',
  '- Boss 机制分两类：**时序型**（车阵，蓄力→爆发→恢复，需豁免通用 duration）与**姿态型**（换甲，实时伤害修正，同样需豁免通用 duration）。两者都不新增 step 类型。',
  '- 姿态型机制的防御修正必须从基础属性**实时计算**，禁止累加到 ' + BT + 'enemy.def' + BT + ' / ' + BT + 'enemy.mdef' + BT + '。',
  '',
  '---',
  '',
  ''
].join('\n');

prepend('GAME_DOCUMENTATION.md',
  '## 2026-10-22（续）Boss 机制、地图重建与第十三回黑水河（最新接手入口）',
  docText,
  '（三）鼍洁');

const handoffText = [
  '## 最新接手说明（三）：鼍洁换甲机制（2026-10-22 收尾）',
  '',
  '基线 **1994/1994**。',
  '',
  '- 鼍洁「黑水换甲」已实装：凝鳞偏物防 / 散流偏法防，每 2 次有效行动切换，实时伤害修正不改写基础属性',
  '- 新增全项目奖励物品引用审计断言（扫描 42 种 itemId，防止"奖励发了不存在的物品"复发）',
  '',
  '**下一处优先**：黑水河实机走查 → 后续章节（车迟国 / 通天河 / 火焰山 / 盘丝洞 / 狮驼岭）',
  '',
  '---',
  '',
  ''
].join('\n');

prepend('NEXT_AI_HANDOFF.md',
  '## 最新接手说明（续）：Boss 机制、地图修复与第十三回黑水河（2026-10-22 后半段）',
  handoffText,
  '（三）：鼍洁换甲');
