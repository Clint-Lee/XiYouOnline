import fs from 'node:fs';

// ── GAME_DOCUMENTATION.md：顶部插入本批摘要 ──
{
  const p = 'GAME_DOCUMENTATION.md';
  let s = fs.readFileSync(p, 'utf8');
  const crlf = s.includes('\r\n');
  if (crlf) s = s.replace(/\r\n/g, '\n');

  const anchor = '## 2026-10-22 全链缺陷修复、幽默优化与第十二回火云洞续写（当前接手入口）';
  const head = `## 2026-10-22（续）Boss 机制、地图重建与第十三回黑水河（最新接手入口）

基线由 1847/1847 提升至 **1977/1977**。本节记录在本轮后半段落地的内容，与上一节合并阅读。

1. **五行车阵 Boss 机制（红孩儿专属）**：游戏内首个"可预告、可应对、失败可归因"的 Boss 机制。蓄力（不造成伤害）→ 爆发 → 两回合恢复的固定循环；两条应对路线为「抢攻累计 2100 伤害破阵」与「防御获得守息减伤 35%」；破阵窗口在爆发回合关闭；破阵后需完整喘息 ≥2 回合才重新蓄力。DOT/反伤/反击/闪避不计入破阵；守息与普通防御**取更强不叠乘**。
2. **运行时缺陷修复**：`hh_cart_state` 曾被通用 buff 到期过滤删除（机制只活一轮），且 `duration` 被通用递减与 `advanceCartCycle` 双重递减（恢复期从 2 回合缩成 1 回合）。现车阵状态豁免通用递减与到期移除，生命周期由 `advanceCartCycle` 全权管理。**这两条是单元断言覆盖不到、只有真实回合集成测试才能发现的缺陷。**
3. **火云洞地图重建**：原图是「911 格岩石中挖出一条 77 格水平直线」，可行走仅 7.2%，玩家只能左右单线移动。重建为前庭（枯松林）+ 涧道 + 主洞 + 车阵祭坛四段结构，可行走提至 **36.7%**，BFS 验证全图连通。
4. **第十三回 黑水河**：新增地图 `heishuihe`（38×28，可行走 44.8%，四段闭环：西岸渡口 / 河神旧庙 / 水下神府 / 东岸出口），八阶段链 `heishui_arrived → captives_taken → scout_ready → aid_needed → moang_arrived → boss_ready → reward_pending → heishui_cleared` 闭环，10 个对白节点，2 场战斗，章节奖励幂等 + 满包重试。
5. **章节奖励物品补齐**：`eq_nk_huoyun`（火云辟火珠）与 `eq_nk_heishui`（黑水辟水佩）此前只写进奖励却未在 `items.js` 定义，玩家会拿到 `invalid_items` 永远领不到。已补全并加断言。
6. **西行出口打通**：火云洞新增通往黑水河的传送门，玩家不再卡在章节末尾。
7. **史实修正**：按 Astra 校勘，**西海龙王为敖闰，敖顺是北海龙王**，黑水河相关对白统一采用正确称谓。

### 本批确立的新约定

- Boss 机制状态一律声明 \`mechanicId\` + \`mechanicConfig\`，运行状态放 \`enemy.buffs\`，**不得新增敌方运行字段**。
- 常驻机制状态（如车阵）必须在 \`settleRoundBuffs\` 的通用 \`duration\` 递减与到期过滤中**显式豁免**，否则会被误删或双减。
- 章节奖励的物品 ID 必须先在 \`js/data/items.js\` 定义；测试有断言防止"奖励发了不存在的物品"。
- 新地图必须满足：尺寸 38×28（长安除外）、可行走 ≥35%、BFS 全连通、实体落点不在阻挡格、传送门目标地图存在。
- 地图 NPC 外观必须使用 `Character` 渲染器有专属分支的键（分发用 `includes` 匹配，如 `longwang` 而非 `dragon_king`），否则回退天将并被断言拦截。

---

${anchor}`;

  if (!s.includes('2026-10-22（续）Boss 机制')) {
    const c = s.split(anchor).length - 1;
    if (c !== 1) { console.error(`GAME_DOC 锚点匹配 ${c} 处`); process.exit(1); }
    s = s.replace(anchor, head);
    if (crlf) s = s.replace(/\n/g, '\r\n');
    fs.writeFileSync(p, s, 'utf8');
    console.log('✓ GAME_DOCUMENTATION.md 已更新');
  } else {
    console.log('（GAME_DOCUMENTATION.md 已更新过）');
  }
}

// ── NEXT_AI_HANDOFF.md：顶部插入 ──
{
  const p = 'NEXT_AI_HANDOFF.md';
  let s = fs.readFileSync(p, 'utf8');
  const crlf = s.includes('\r\n');
  if (crlf) s = s.replace(/\r\n/g, '\n');
  const anchor = '## 最新接手说明：全链缺陷修复、幽默优化与第十二回火云洞续写（2026-10-22 更新）';

  const head = `## 最新接手说明（续）：Boss 机制、地图修复与第十三回黑水河（2026-10-22 后半段）

基线 **1977/1977**。上一节之后又完成：

- 红孩儿「五行车阵」机制（含真实回合集成断言，抓到两个单元测试覆盖不到的运行时缺陷）
- 火云洞地图从 7.2% 隧重建为 36.7% 洞窟
- 第十三回黑水河全章（地图 + 八阶段 + 10 对白 + 2 战斗 + 奖励闭环）
- 补齐 \`eq_nk_huoyun\` / \`eq_nk_heishui\` 两个章节奖励物品
- 火云洞通往黑水河的西行出口

**下一处优先**：
1. 鼍洁「黑水换甲」机制实装（方案已定：凝鳞偏物防 / 散流偏法防，每 2 次有效行动切换；不设免疫，须用现有伤害公式校准）
2. 黑水河实机走查（数据与连通性已验证，未跑浏览器）
3. 后续章节：车迟国、通天河、火焰山、盘丝洞、狮驼岭

---

${anchor}`;

  if (!s.includes('（续）：Boss 机制')) {
    const c = s.split(anchor).length - 1;
    if (c !== 1) { console.error(`NEXT_AI 锚点匹配 ${c} 处`); process.exit(1); }
    s = s.replace(anchor, head);
    if (crlf) s = s.replace(/\n/g, '\r\n');
    fs.writeFileSync(p, s, 'utf8');
    console.log('✓ NEXT_AI_HANDOFF.md 已更新');
  } else {
    console.log('（NEXT_AI_HANDOFF.md 已更新过）');
  }
}

// ── OPTIMIZATION_ROADMAP.md：追加日志行 ──
{
  const p = 'OPTIMIZATION_ROADMAP.md';
  let s = fs.readFileSync(p, 'utf8');
  const crlf = s.includes('\r\n');
  if (crlf) s = s.replace(/\r\n/g, '\n');
  const anchor = `| 2026-10-22 | 按两份审计结论修复 A/B/C/D 四组缺陷`;
  if (s.includes('五行车阵') && s.includes('黑水河')) {
    console.log('（OPTIMIZATION_ROADMAP.md 已更新过）');
  } else {
    const idx = s.indexOf(anchor);
    if (idx < 0) { console.error('roadmap 锚点未找到'); }
    else {
      const row = `| 2026-10-22（续） | 实现红孩儿「五行车阵」Boss 机制（蓄力/爆发/双回合恢复、抢攻破阵与守息减伤双路线）；修复车阵状态被通用 buff 过滤误删与 duration 双重递减；重建火云洞地形（7.2%→36.7%）；新建第十三回黑水河全章（38×28 地图、44.8% 可行走、八阶段闭环、10 对白、2 战斗、奖励幂等）；补齐 eq_nk_huoyun / eq_nk_heishui 奖励物品；打通火云洞→黑水河西行出口 | \`node test_suite.js\` **1977/1977 (100.0%)**；新增 test_cart_mechanic.js（16 条）与 test_heishui_chapter.js（约 100 条） | 鼍洁「黑水换甲」机制实装；黑水河实机走查；后续章节 |
`;
      s = s.slice(0, idx) + row + s.slice(idx);
      if (crlf) s = s.replace(/\n/g, '\r\n');
      fs.writeFileSync(p, s, 'utf8');
      console.log('✓ OPTIMIZATION_ROADMAP.md 已追加日志');
    }
  }
}
