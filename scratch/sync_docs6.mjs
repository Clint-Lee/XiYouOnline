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
  '## 2026-10-22（五）第十五回 通天河 与 阶段命名统一（最新接手入口）',
  '',
  '基线 **2166/2166**。',
  '',
  '### 已落地',
  '',
  '1. **第十五回 通天河全章闭环**：地图 ' + BT + 'tongtianhe' + BT + '（38×28，实测可行走 **89.3%**，全 BFS 连通，无需重建）；7 阶段链 ' + BT + 'tongtian_arrival → tongtian_vowed → tongtian_altar → tongtian_rescue → tongtian_await_guanyin → tongtian_reward → tongtian_cleared' + BT + '；7 个对白节点；6 个 NPC（陈家长者/孩童/祭坛/水府入口/观音/原有通天老鼋）；章节奖励 ' + BT + 'eq_nk_tongtian' + BT + ' 幂等 + 满包重试。',
  '2. **采纳 Astra 的两个关键判断**：',
  '   - **不新增第三类 Boss 机制**。理由：本章核心是"终止献祭、承担替身风险、救人与安抚"，不是第三次机制教学；再写寒冰蓄力会变成五行车阵换皮，再写冰甲切换会变成黑水换甲换皮。',
  '   - **本章零幽默**。理由：首次接案已见到孩子，此时再安排八戒"太胖装不像"的笑话会越过"一旦见到孩子立刻收住"的界线。可幽默位不是必须用的配额。',
  '3. **叙事红线（有断言保护）**：',
  '   - 玩家必须先表态"祭童的事今日为止"并安置孩子，**才能**赴祭坛；未表态阶段不得开战（断言验证）。',
  '   - 孩童 NPC 只在 ' + BT + 'tongtian_arrival' + BT + ' / ' + BT + 'tongtian_vowed' + BT + ' 可见，**动身即撤离**，绝不当诱饵（断言验证）。',
  '   - 灵感大王"听经得道"的辩解由观音明确驳回："听经不是作恶的凭据，河冷也不是食人的理据。"',
  '   - 战斗胜利**不等于**河患解除——妖怪只是退回深水，必须等观音鱼篮收妖（分 ' + BT + 'await_guanyin' + BT + ' 与 ' + BT + 'reward' + BT + ' 两个阶段）。',
  '4. **水府入口用固定线索题**：两条证据（主门冰层外吐寒气 vs 暗流口气泡不断），错答 ' + BT + 'nextStep' + BT + ' 返回观察步骤，不扣资源、不降阶段、不随机换题。',
  '',
  '### 教训：Astra 与 Opus 的输出都要先核对结构',
  '',
  'Opus 本次又因"没有源码"拒绝输出（400 字符）。改用自己按规范写，一次性通过。',
  '**结论：对白数据这种强格式内容，自己写比让 Opus 写更可靠**（它两次产出的结构都不对：一次把 key 包进数组，一次直接拒绝）。Opus 适合写实现类补丁（战斗方法、机制），Astra 适合出方案。',
  '',
  '另外首次插入时脚本里有 4 处 ' + BT + "text: '...'" + BT + ' 后缺逗号导致 syntax error，已用通用正则一次扫掉。**后续写这类脚本时，text 行后必须显式加逗号。**',
  '',
  '---',
  '',
  ''
].join('\n');

prepend('GAME_DOCUMENTATION.md',
  '## 2026-10-22（四）第十四回车迟国 与 换甲接入（最新接手入口）',
  docText,
  '（五）第十五回 通天河');
