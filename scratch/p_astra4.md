# 任务：《汉风西游》第十三回 黑水河 章节设计（只出方案，不写代码）

## 项目现状
- 第十二回 号山·枯松涧火云洞（红孩儿）已完整闭环，阶段终态 `huoyun_cleared`。
- 下一站按原著顺序应为**黑水河**（衡阳峪黑水河神府 / 泾河龙王第九子鼍洁）。
- 地图 `heifeng_juebi`、`poerdong` 等已在数据中，但**黑水河地图尚未建立**（需新建）。
- 现有地图命名风格：`huoyundong` / `pingdingshan` / `baihuling` / `baoxiangguo`。
- 现有阶段命名风格：`huoyun_arrived` / `huoyun_redboy_ready` / `huoyun_boss_ready` / `huoyun_cleared`。

## 可复用的机制与设施（必须基于这些，不要发明新系统）
1. **阶段门槛四张表**（新章节必须同步）：
   - `phaseWeights`（`isNpcVisibleInStoryPhase` 内的权重表，用于 `>=` 比较）
   - `isNpcVisibleInStoryPhase` 的 NPC 显隐分支
   - `MAIN_QUEST_TARGETS`（主线金色感叹号唯一指向）
   - `getOrdealAndQuestInfo`（任务卷轴分支）
   - 地图侧还需 `minimap.getCurrentQuestTarget`
2. **奖励**：一律走 `playerData.claimStoryReward(key, {items, exp, silver, bonuses, healToFull}, inventory)`，返回 `{success, reason}`，`reason` 含 `already_claimed` / `inventory_full`。满包时必须保留领取入口，不得重复发放。
3. **对白**：`STORY_DIALOGUES[key] = { steps: [{ speaker, speakerTitle, speakerIcon, text, action, options }] }`，选项 `{text, action, nextStep}`。
4. **战后对白**：`scheduleStoryDialogue(key, delay)`，带 mapId + storyPhase 双校验；键名必须在 STORY_DIALOGUES 里存在（否则会报错跳出）。
5. **战斗**：`start2DBattle(enemies, onVictory, onDefeat)`；敌人对象需 `{id, name, appearance, modelId, level, hp, maxHp, mp, maxMp, atk, def, matk, mdef, spd, skills}`。
6. **Boss 机制样板**（红孩儿已实现，可参考但不要照抄）：蓄力→爆发→恢复的阶段机，状态挂在 `enemy.buffs`，用 `mechanicId` + `mechanicConfig` 声明。
7. **章节开幕**：`CHAPTER_CONFIGS.chapter_13 = { id, chapterNum, title, subtitle(七言), seal(四字), triggerMap, triggerPhase }`。
8. **测试基线**：`node test_suite.js` 目前 1883/1883 全绿，必须保持。

## 原著素材（供你取舍）
- 唐僧师徒到黑水河，河宽水黑。妖怪化作船夫，把唐僧与八戒摄走。
- 妖怪是**泾河龙王第九子鼍洁**（小鼍龙），其舅是**西海龙王敖顺**（敖闰之子）。他占了衡阳峪黑水河神府，赶走原河神。
- 悟空不善水战，让八戒、沙僧下水；最后由**西海龙太子摩昂**（敖顺之子，鼍洁表兄）出面擒获。
- 原河神（黑水河神）被夺府后无处安身，曾向悟空诉苦。
- 结局：鼍洁被摩昂押回西海问罪，河神复位，师徒渡河。

## 请输出（只要方案，不写代码）

### 1. 阶段链设计
给出完整阶段名（snake_case，沿用 `heishui_` 前缀）与每阶段：进入条件、可见 NPC、主线目标、任务卷轴文案要点、退出到下一阶段的触发点。要求闭环到 `heishui_cleared`。

### 2. 地图设计建议
黑水河需要新建地图。请给出：
- 地图 id 与中文名、region
- 尺寸建议（参考：火云洞 38×28，可行走约 36%）
- 结构分区（如：河岸渡口 / 河神旧庙 / 水下神府 / 出口）
- 必须落位的关键实体（NPC、传送门、野怪）及其大致坐标或格位，**要保证 BFS 连通**
- 可行走比例目标（不要做成一条直线隧道，这是历史缺陷）

### 3. Boss 机制：鼍洁（可选，但建议有）
若要设计，请复用红孩儿那套基础但**机制必须不同**。给出：
- 机制名与核心张力（不能用"蓄力→爆发"重复）
- 玩家可用的两种应对
- 状态如何挂在 buff 上
- 失败后果与可归因反馈

### 4. 三条禁笑区与幽默位
按既有约定（不拿受害者遭遇开玩笑；不拿囚禁/伤亡当笑料；主角不承担连续逗嘴），给出：
- 本章 1-2 处适合的幽默位置与来源
- 必须严肃处理的地方

### 5. Node 断言清单
给出 10-14 条断言意图（中文），覆盖：阶段链推进、对白键存在、奖励幂等与满包重试、地图连通性（可行走比例与实体落点）、NPC 显隐、主线感叹号唯一性、小地图目标、战斗入口阶段守卫。

### 6. 实施顺序
按依赖关系排列落地步骤，指出哪些必须同批完成，哪些可后置。
