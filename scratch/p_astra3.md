# 任务：《汉风西游》Boss 专属机制设计（只出方案，不写代码）

## 背景
原生 JS + Canvas2D 回合制单机西游 RPG。当前项目所有 Boss 都只有"技能名列表"，由敌方 AI 随机挑选、再走通用法术结算公式。**没有任何 Boss 拥有可预告、可应对、失败有明确反馈的专属机制**。这是交接文档里连续三轮标记但未完成的缺口。

## 现有可复用的基础设施（必须基于这些设计，不要发明新框架）
1. **战斗回合流程**（`js/core/battle.js` 的 `executeRound`）：
   - 回合初：`runAvatarTransforms()`（金仙变身判定）→ 早于速度重排
   - 敌方 AI：`enemyActions[id] = { type: 'skill'|'attack', skill, targetId }`
   - 按速度降序执行 `queue`，每个 actor 前 `checkBattleEnd()`
   - 回合末：`settleRoundBuffs()`（DOT）→ `tickAvatars()`（变身递减）
2. **演出步骤协议**（`onStepCallback(step)`，由 `App2D.playBattleStep` 消费）：
   - 已有 step 类型：`damage`、`dodge`、`heal`、`mana`、`buff`、`cast`、`cast`+`hits`、`status_block`、`reflect`、`counter`、`avatar_transform`、`poison_tick`、`capture_success/fail`、`flee_success/fail`、`message`
   - 每个 step 带 `attacker`、`targetIndex` / `target`、`damage`、`text`、`skillName` 等字段
3. **状态系统**：单位有 `buffs` 数组，每条 `{ id, name, duration, appliedRound, ...effects }`；`settleRoundBuffs` 每回合末统一递减 duration，到期移除
4. **减伤链**：`applyAvatarMitigation(defender, rawDamage)` 顺序为「法力抵扣 → 逆御免伤 → 画皮移伤」
5. **伤害公式**：`calculateAttackDamage(attacker, target, options)`，`options` 支持 `forceDodge`/`forceCrit`/`forceFatal`/`forceCombo`/`dmgFluctuate` 等注入（测试用）
6. **玩家指令集**：`{ type: 'attack' | 'skill' | 'capture' | 'item' | 'defend' | 'flee' }`，技能再带 `skillId`，物品带 `itemId`
7. **测试基线**：`node test_suite.js` 目前 1847/1847 全绿，任何改动必须保持全绿

## 目标 Boss：红孩儿（第十二回 火云洞）
设定：孩童形貌的妖王，炼成三昧真火，推出**五辆小车按五行排列**作为施法阵基。原作里悟空请龙王降水，凡水浇不灭三昧真火，反被烟熏伤眼。

### 请设计「五行车阵」机制，要求
1. **可预告**：玩家在遭受致命一击前，必须能提前看到明确信号（提示文案 + 视觉线索 + 日志），且预告位置能让玩家在当回合做出应对。
2. **可应对**：玩家至少有两种不同的应对方式（不能只有唯一解），且应对手段必须落在现有指令集内（攻击/技能/防御/用药/招降/逃跑）。
3. **失败有明确反馈**：如果玩家没应对，后果必须清晰、可归因，而不是"莫名其妙被打死"。
4. **状态驱动**：机制实现应尽量复用 `buffs` 数组 + `appliedRound` 计时，而不是在 `executeRound` 里写一堆特例分支。
5. **可测试**：能用固定随机数、强制注入等方式在 Node 单元测试里稳定复现三个阶段（蓄力 → 爆发 → 恢复）。

### 请输出
- **阶段机设计**：列出车阵的完整状态（如待机/蓄力/爆发/破阵），每个状态的进入条件、持续回合、对外可见信号、玩家可做的应对、以及状态之间如何转移。
- **数据结构**：建议在敌方单位上挂哪些字段、`buffs` 里放什么 id 与字段，才能让 `settleRoundBuffs` 与 AI 决策自然驱动它。
- **应对判定规则**：玩家做了 A 动作时阵法如何响应（例如打破某辆车需要什么条件），用布尔判断描述，不写代码。
- **伤害与减伤**：爆发回合的伤害应该走 `calculateAttackDamage` 还是独立公式？如果独立，如何与既有抗性/减伤链保持一致以免出现"无视一切防御"的不公平感。
- **失败反馈文案方向**：给出 3-4 句符合人物口吻的战报文案（简体中文，红孩儿是孩童形貌但语气狠辣，悟空会吐槽）。
- **断言清单**：为 Node 测试列出 8-12 条断言意图（中文描述），覆盖预告可见、两种应对各自生效、未应对的后果、阵法破除后强度回落、状态到期清理、读档后不残留。

## 约束
- 不要发明新的回合阶段或新的顶层事件系统；一切挂到现有 `buffs` / `appliedRound` / `onStepCallback` 上。
- 不要改玩家指令集。
- 不要把机制做成"只要按防御就无伤"这种一刀切。
- 保持数值克制：红孩儿是真身战（当前 hp 42000、atk 420、matk 400），机制应提升战术压力，不是无限拉高血量。

请直接给结论与表格，不要复述我的背景，不要写代码。
