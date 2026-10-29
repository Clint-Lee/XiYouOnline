# 任务：《汉风西游》H5 单机 RPG — 缺陷修复批次规划（只出方案，不写代码）

## 项目事实
原生 JS + Canvas2D 单机西游 RPG，入口 index.html → js/。零第三方框架。
主线闭环到"平顶山第十一回"。测试基线 node test_suite.js 1747/1747，改动后必须全绿。
规模：app2d.js 12513 行（主调度）、battle.js 2046（战斗）、storyQuests.js 3160（剧情）、petSystem.js 773、inventory.js 409、player.js 413、skills.js 567、tilemap.js 1789、character.js 6394、minimap.js 805。

## 已确认缺陷（有代码证据，勿再质疑真伪）

剧情链：
- A1[P0] app2d.js 曾 scheduleStoryDialogue('wuxing_freed')，但对白库只有 wukong_freed → Dialogue.start(undefined) 静默返回 → 大圣永不入队 → storyPhase 永久停在 wuxingshan_ready → 鹰愁涧之后门禁全不通过 → 主线整体中断，坏档自我延续。**已修**。
- A3[P1] minimap.js 砍柴阶段信标指向刘家村空地，枯树精实际在 wuxingshan 地图，玩家走到光柱下无反应。
- A4[P1] minimap.js 东海之滨战后仍静态指向已退场夜叉。
- A5[P1] minimap.js 天宫三阶段兜底落到"天蓬元帅"旧目标。
- A6[P1] app2d.js 任务卷轴缺 changan_meet_xuanzang/taizong/farewell 三分支，落到默认"第一难·与刘伯钦对话"。
- A7[P1] grantGuanyinGift 守卫只认 chentang_guanyin_revelation，但流程此时已推进到 changan_meet_xuanzang → 观音赐宝永不可达。
- A9[P1] 平顶山三场战斗奖励直发 gainExp/silver，未走 claimStoryReward，且 trigger 无 storyPhase 守卫 → 可能重复刷。
- A10[P1] storyQuests.js 守卫只认 changan_arrived，与 app2d.js 两阶段接受不一致 → 非正常进城路径静默无反应。
- A12[P2] npc_baihu_wukong 领奖 NPC 因胜战回调直接发奖而永不可见。

战斗：
- B5[P0] appliedRound 初始化在 executeRound 两处冲突，后手施加的封印/定身/乱魂时长 ±1 回合。**部分已修**（改为只在 appliedRound < round 时递减）。
- B7[P1] battle.js 调 avatar.def.getReductionRatio/getMpDrainRatio/getSlowRate，但 petSystem.js 15 条天赋都没定义这三个方法 → 金角逆御、银角吸魂、黄风断速三条链失效。
- B8[P1] 黄风断速直接覆写 target.spd 且无还原点 → 受害者永久低速。
- B9[P1] 黄眉虚弱 weakenRatio 写进 buff 但全库无消费方 → 天赋形同虚设。
- B10[P1] 隐身 dodgeBonus / hideAttributes 无消费方 → 隐身咒无效。
- B12[P1] 倒计时归零瞬间逃跑，可能二次进入 executeCombatRound → 回调重复。
- B14[P1] 敌人金刚护体 buff 未设 appliedRound。

物品/数值：
- C5[P1] mountSystem 按原始等级一次收满 times 费用，但循环逐级判断 maxLevel → 精训连升5级可能只涨2级。
- C6[P1] 洗炼后 level 被重置为 1，高等级宠物掉回 1 级仍保留技能。
- C7[P1] player.js 宝石抗性只处理 6 个键，res_sanmei/res_wandu/res_xuanji 被静默丢弃。
- C8[P1] gainExp 无 level 上限，一次 80000 经验可越界升级。
- C9[P1] forge.js 的 ForgeSystem.enhance 是完整实现（含 isOwned 与定星石保护）但无调用方；app2d.js 另写一套且不读定星石 → 面板承诺的保护不生效。

渲染/性能：
- D6[P2] tilemap 约 440 瓦片/帧各建渐变；character 每 NPC 每帧 3 渐变 + 4 次 measureText；minimap 每帧全图逐格 fillRect（长安 936 次）；particleSystem 每粒子每帧径向渐变；同帧 3 次 getCurrentQuestTarget。

## 请输出（不要写代码，只要方案）
1. **批次划分**：把 A/B/C/D 重组为 3 个可独立验收的批次，标明每批目标、包含条目、验收方式。指出哪几条必须同批改（例如 B7 与 B8 都动 spd 语义，C7 与已修的抗性键名相关）。
2. **每条的策略**：一句话"改哪里 / 用什么手法 / 有什么连带副作用要一并处理"。特别标注哪些会触碰现有 1747 条断言、需要同步改断言而不是改代码。
3. **风险排序**：按"改动风险 × 玩家影响"给一个必须先做 / 可以缓做的排序，指出最不该动的部分及原因。
4. **测试策略**：针对 A7、A9、B7、B8、C5、C6、C9 各写一句断言意图（中文描述即可）。
5. **性能优化取舍**：D6 里哪些收益最大、哪些属于过度优化不值得做，给出你的判断与理由。
