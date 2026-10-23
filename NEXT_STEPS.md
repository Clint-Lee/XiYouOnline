# 下一步工作计划（交接用）

> 更新于 2026-10-22（四）· 基线 `node test_suite.js` **2386/2386 (100.0%)**
> 本文件是给下一位 AI 的执行清单。**先读 `GAME_DOCUMENTATION.md` 顶部最新一节和 `NEXT_AI_HANDOFF.md`，再看本文。**

---

## 一、当前进度总览

| 章节 | 状态 | 终态阶段 |
|---|---|---|
| 序章 天宫 | ✅ 闭环 | — |
| 第一回 刘家村 / 长安 | ✅ 闭环 | — |
| 第三回 陈塘关 + 东海龙宫 | ✅ 闭环 | — |
| 第四回 五行山 | ✅ 闭环 | `wuxing_freed` |
| 第五~七回 鹰愁涧 / 高老庄 / 黄风岭 | ✅ 闭环 | `huangfeng_cleared` |
| 第八回 流沙河 / 五庄观 | ✅ 闭环 | `wuzhuang_cleared` |
| 第九~十回 白虎岭 / 宝象国 | ✅ 闭环 | `baoxiang_cleared` |
| 第十一回 平顶山 | ✅ 闭环 | `pingding_cleared` |
| 第十二回 号山火云洞 | ✅ 闭环 + Boss 机制 | `huoyun_cleared` |
| 第十三回 黑水河 | ✅ 闭环 + Boss 机制 | `heishui_cleared` |
| 第十四回 车迟国 | ✅ 闭环 | `chedi_cleared` |
| 第十五回 通天河 | ✅ 闭环 | `tongtian_cleared` |
| 第十六回 火焰山 | ✅ 闭环 | huoyan_cleared |
| 第十七回 盘丝洞 | ✅ 闭环 | `pansi_cleared` |
| 狮驼岭 / 大雷音寺 | ❌ 地图在、无主线 | — |

**已实装的两种 Boss 机制样板**（后续章节应优先复用，不要再造第三类）：
- **时序型**：红孩儿五行车阵（`hh_cart_state`，蓄力→爆发→恢复，破阵/守息双路线）
- **姿态型**：鼍洁黑水换甲（`hh_armor_state`，凝鳞/散流，实时伤害修正不改写基础属性）

---

## 二、下一步：通天河（第十五回）

### 为什么是通天河
地图 `tongtianhe` 已存在，且车迟国已有通往通天河的传送门（`chediguo` 的 `(32,448)` → `tongtianhe`），西行出口已通，只缺主线。

### 原著要点
- 通天河宽八百里，住着**灵感大王**（观音莲花池里逃出的金鱼）——要吃童男童女。
- 村民每年献祭。悟空八戒变作童男童女去降妖，妖怪冰封河面抓走唐僧。
- 妖怪是观音池中金鱼，最终观音用鱼篮收妖。
- **受害者是被献祭的村民与儿童** —— 这是禁笑区。

### 设计要点（建议先让 Astra 出完整方案，再交 Opus 写数据）
1. **阶段链建议 5-6 个**：`tongtian_arrival` → `tongtian_pledge`（村民献祭背景）→ `tongtian_offer_ready`（悟空八戒化身）→ `tongtian_ice_battle` → `tongtian_reward_pending` → `tongtian_cleared`
2. **核心道德张力**：救孩子 vs 先除妖。**必须让玩家先表态"祭童的事今日为止"，再动手**。
3. **Boss 机制建议复用姿态型**：灵感大王可做"寒冰覆甲"（凝冰偏物防），或**不建议新增机制**——本章重点是叙事。
4. **禁笑区（硬约束）**：
   - 被献祭儿童的恐惧、家长的绝望 —— **绝对严肃**
   - 灵感大王以童男女为食的设定 —— **不做美食化、可爱化描写**
   - 观音收妖后的安抚 —— 严肃收束
5. **可允许的幽默位**：悟空八戒变作童男童女时的体型反差（八戒嫌自己太胖装不像），但**只在动身之前**，一旦见到孩子立刻收住。

### 实施清单
- [ ] `js/data/maps2d.js`：确认 `tongtianhe` 尺寸 38×28、可行走 ≥35%、BFS 连通；补 NPC 与传送门
- [ ] `js/data/storyQuests.js`：新增 NPC 对话键 + `chapter_15` 开幕配置
- [ ] `js/app2d.js`：四张表（`phaseWeights` / `isNpcVisibleInStoryPhase` / `MAIN_QUEST_TARGETS` / `getOrdealAndQuestInfo`）+ `minimap.getCurrentQuestTarget` + 章节起点 + 战斗入口 + 领奖
- [ ] `js/data/items.js`：新增章节奖励物品（**必须先定义再写奖励**）
- [ ] `test_tongtian_chapter.js`：接入 `test_suite.js`
- [ ] 文档同步三处

---

## 三、待优化清单（按优先级）

### P0 — 必须先做

| 项 | 说明 |
|---|---|
| **所有章节的实机走查** | 目前全部验证都是 Node 层（数据/连通/断言）。**从未在真实浏览器跑过**。建议按 `scratch/run_presentation_qa.ps1` 的方式逐章走一遍：出生→对话→战斗→领奖→下一章 |
| **奖励物品引用审计扩展到 NPC 掉落与商店** | 现有断言只扫 `app2d.js` + `storyQuests.js` 的 `itemId`。`maps2d.js` 的怪物掉落、`shopItems` 数组尚未覆盖 |

### P1 — 应该做

| 项 | 说明 |
|---|---|
| **同伴入队后的战斗 AI** | 悟空/八戒/沙僧入队后由 AI 控制，目前 `enemyActions` 只对敌人生效。同伴是否会吃药/保护师父/集火，值得补一套轻量策略 |
| **Boss 机制的表现层演出** | 车阵蓄力/爆发、换甲切换目前只有日志文案，**没有视觉表现**。建议在 `renderBattleCanvasFrame` 加：蓄力时的阵眼光柱、换甲时的鳞甲闪光 |
| **任务目标引路的跨图体验** | 目前小地图只在本图有效。黑水河→车迟国→通天河这类跨图推进，玩家容易迷路。建议在卷轴加"当前应前往 X 地图"的提示 |
| **战斗失败后的保护** | 目前失败会被传送回城并回满血。建议确认：失败不丢任务进度、不掉已获得物品（已有断言覆盖奖励，但**未覆盖怪物掉落与临时道具**） |

### P2 — 有余力再做

| 项 | 说明 |
|---|---|
| 性能：tilemap 渐变缓存 | 小地图底图缓存已做；`tilemap.js` 每帧约 440 次 `createLinearGradient` 未优化。Astra 判断为"高收益第二优先"，但需先在移动端实测确认瓶颈 |
| 性能：NPC 文字测量缓存 | `character.js` 每 NPC 每帧 4 次 `measureText`，可按字符串缓存 |
| 幽默密度 | Astra 口径：40 节点配 8-10 处。目前已达约 6 处（刘伯钦×2、太白金星、沙僧查行李、八戒红葫芦、摩昂纠正头衔、车迟国两处），**接近上限，不要再加** |
| 后续章节 | 火焰山（芭蕉扇）、盘丝洞（蜘蛛精）、狮驼岭（三魔）、大雷音寺（终章） |

---

## 四、开发规范（必须遵守，都是踩坑换来的）

### 代码层面

1. **禁止 `git checkout <file>`**。项目长期处于多章节并行、大量未提交的状态，checkout 会一次冲掉几千行。回滚一律用备份文件。
2. **新增章节必须同步五处**：`phaseWeights`、`isNpcVisibleInStoryPhase`、`MAIN_QUEST_TARGETS`、`getOrdealAndQuestInfo`、`minimap.getCurrentQuestTarget`。缺一处就会出现"阶段推进了但找不到人"。
3. **奖励物品必须先在 `js/data/items.js` 定义**，否则 `claimStoryReward` 返回 `invalid_items`，玩家永远领不到。
4. **常驻机制状态必须豁免 `settleRoundBuffs` 的通用 `duration` 递减与到期过滤**（车阵、换甲都踩过）。
5. **位移/防御类减益不得直接改写 `unit.spd` / `unit.def`**，必须走 buff + 实时计算，否则切换与重试会永久叠加。
6. **地图必须 38×28、可行走 ≥35%、BFS 全连通、实体不在阻挡格、传送门目标存在**。这些都有断言，不要试图放宽断言。
7. **NPC 外观必须用 `character.js` 有专属渲染分支的键**。分发用 `includes` 匹配，`xuanzang`、`dragon_king`、`shuiyao` 都**没有**分支，会回退天将。已知可用：`stone_monkey`（和尚）、`longwang`（龙王）、`tiger`、`fox`、`wolf`、`tudi_gong`、`yecha`、`shrimp`、`crab`、`fisherman`。
8. **给 `BattleEngine` 加方法后，检查 `test_suite.js` 里的 stub 夹具**（约 4950 行附近），那里手抄了一份方法清单，缺方法会直接报 `is not a function`。

### 叙事层面

1. **受害者遭遇绝对严肃**：被献祭的儿童、被囚禁的百花羞、被役使的僧人、白骨精三打的遗骸。这些地方插科打诨会破坏叙事分量。
2. **幽默来自人物性格与处境反应**，不来自玩梗。现有成功范例：沙僧查行李、八戒问"该不该纠正名号"、摩昂纠正僭越头衔。
3. **主角（威灵大将）负责克制地接话并收束**，不做连续吐槽。
4. **幽默密度已达上限**（约 6 处 / 40 节点），后续章节每章最多 1-2 处。
5. **史实/称谓**：西海龙王是**敖闰**，敖顺是北海龙王（Astra 校勘，勿再写错）。

---

## 五、中转站使用约定

- Base URL：`http://127.0.0.1:8787/v1`，API Key：`sk-local`（挂了就重启 `start_relay.bat`，等 25 秒）
- **方案/设计/审查 → Astra**（`bedrock_gpt_6_astra`）
- **代码/数据/测试 → Opus 4.8**（`bedrock_claude_opus_48`）
- Opus **没有文件访问权限**，要出补丁必须先把真实源码切片喂给它（用 `scratch/make_battle_ctx.mjs` 或 `scratch/slice.mjs` 生成带行号的片段）
- Opus 的补丁锚点经常过泛（如只给 `  // `），先用 `scratch/apply_patch.mjs --dry` 校验唯一性再应用
- 单次调用约 100-250 秒；`scratch/eazo_ask.mjs` 已用 `node:http` 直连绕开 undici 的 5 分钟头超时

## 六、常用脚本

| 脚本 | 用途 |
|---|---|
| `scratch/check_map.mjs <mapId>` | 地图可行走比例 + 实体落点校验 |
| `scratch/check_connect.mjs <mapId>` | BFS 连通性验证 |
| `scratch/apply_patch.mjs <patch> [--dry]` | 应用 Opus 的 diff 补丁（校验唯一性） |
| `scratch/apply_blocks.mjs <patch> N...` | 只应用指定块号 |
| `scratch/extract_keys.mjs <patch> <out> <前缀>` | 提取对白键为可插入片段 |
| `scratch/insert_huoyun.mjs <片段>` | 插入到 STORY_DIALOGUES 的支线注释前 |
| `scratch/audit_items.mjs` | 审计所有奖励物品引用是否已定义 |
| `scratch/eazo_ask.mjs astra\|opus --file F --out F` | 调中转站 |

## 七、下一步第一件事

**做火焰山（第十六回）**。理由：西行出口已通（通天河 (32,448) → `huoyanshan`）、地图已存在、素材成熟（芭蕉扇/牛魔王/铁扇公主）。

建议顺序：Astra 出方案 → 实测 `tongtianhe` 地图 → Opus 写数据 → 补五处表 + App2D 方法 → 写测试 → 文档同步 → **提交代码**。
