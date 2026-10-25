# AI 会话交接文档（2026-10-25 · 供无会话记录的下一台设备/新会话直接续写）

> **本文用途**：你（接手 AI）在一个**没有历史会话记录**的新设备上接手本项目。本文自包含：项目背景、本会话用户指令原意、三批已交付内容、未完成任务、工程铁律与本轮踩过的坑。读完本文 + `NEXT_AI_HANDOFF.md` 顶部即可无缝续写，不需要追问用户。

---

## 一、项目一句话背景

《汉风西游》——纯单机 2D 神话 RPG（复刻怀旧 MRP 网游），原生 HTML5 Canvas + 零框架，入口 `index.html` → `js/app2d.js`（`src/` 是废弃镜像不参与运行）。主线闭环到平顶山第十一回。运行 `node server.js`（端口 5173）或 `pnpm dev`。**策划法典在 `rules/`，改规则必须双向同步 `rules/` + `GAME_DOCUMENTATION.md` + 代码。**

## 二、本会话用户指令要点（保留原意，供理解用户偏好）

1. 「帮我浏览全局整个游戏帮我进行优化，无论是视觉、界面、玩法、对话、以及整体的趣味性和幽默性等都可以进行优化，但**一定要是正优化而不是负优化**」→ 已按 P3/P4/P5 工作包推进，全部收官。
2. 「把这个游戏做成**适配 H5 手机端**，支持各种设备浏览器访问都能适配」→ 已落地（见下）。
3. 「很多 NPC/角色/野怪模型头像可以**重新生图**（游戏贴图，不是方方正正的矩形图）；很多地方**加背景**；章节开幕要有**画卷展开动画**」→ 画卷动画与背景氛围已落地；**生图部分已向用户说明：本环境无位图生成能力，且项目铁律要求程序化 Canvas 美术**。若用户后续提供 PNG/SVG 贴图，接入点：全身图写 `MonsterModelArtMap`、头像写 `Portraits.customMonsterImages`（参照猴族 SVG 先例 `scratch/build_monkey_models.cjs`）。
4. 「**不能出现低级 bug**，比如刚进游戏上下左右移动突然卡死一直往左走，按键点击都没反应」→ 该 P0 bug 已根治（见下），有回归测试。
5. 用户问过「做成半 3D/纯 3D 如何权衡？对阿里云轻量服务器压力大吗？」→ 结论已给：**维持 2D 管线**（回合制 RPG 收益最低、美术底座冲突、低端机性能优先）；服务器只做静态文件分发，渲染全在客户端，3D 化不增加服务器压力，唯一变量是带宽；联机阶段（rules/activities.md 储备）才是服务器压力质变点。
6. 用户习惯用「继续」推进，期望每次都有可验证的交付；**每次改码后必须 `node test_suite.js` 全绿**。

## 三、本会话已交付内容（三批，测试基线 2366 → 2683）

### 批次 1（P3 + P5.2 + P4.2 轻量版，基线 2616）
- **P3.3 物种定位标签**：`window.GAME_DATA.getSpeciesRoleProfile`（`js/data/pets.js` 末尾），同品质档内百分位判定 `耐久承伤/速度先手/物理输出/均衡成长`，纯展示不改数值；三只前期宠（硕鼠=均衡/树精=耐久/混混=速度）定位互异。
- **P3.1 加点建议**：`App2D.getAllocationAdvice` + 加点弹窗「🧭 定位参考」区块（门派分发/定位分发，明示不自动分配）；仙宠弹窗展示「实际成长 vs 物种区间」。
- **P3.2 传法指引**：`App2D.getMasterLessonGuidance` 四种准确原因（普通不可受法/差N级/已受法显技能名/已可受法指路长安神坛）。
- **P3.3 战时仙宠名册**：`App2D.openBattlePetRosterModal`，战斗蜂窝【仙宠】按钮（原来是死提示）真实打开：真实血蓝条、阵前/备战、定位、低血警示、出战位 X/Y；纯展示。
- **P5.2 舒适设置**：`openComfortSettingsModal`（折叠菜单「🌿 舒适」卡片）：演出速度 1x/2x 持久化（`xiyou_combat_speed_pref`，开战沿用）；低动态（`xiyou_reduced_motion`，跳过震屏、抖动幅度 5→2，飘字信息保留）。
- **P4.2 同伴闲谈**：`getCompanionBanterGroups`（折叠菜单「🍵 闲谈」）：高老庄/五庄观/平顶山三组按剧情解锁，2~4 句纯对白无奖励，战斗/转场中拦截。

### 批次 2（P0 + P4 两支线 + H5 + 视觉，基线 2665）
- **P0 卡键根治**（用户报的"开局卡死向左走"）：
  - 根因①：按住 `a` 时按 Shift 再松开 → keyup 的 `e.key='A'` → `keysDown['a']` 永不清除 → 永久左移且每帧清空点击寻路。修复：字母键小写规范化存储/清除。
  - 根因②：Alt+Tab/焦点被夺丢 keyup。修复：**失联看门狗**（按住中的键 1.2s 无任何键盘事件强制清除，`_keyEventTimes`）+ `visibilitychange` 兜底。
- **P4.1a 刘家村「谁偷了米」**：新 NPC 王大婶（liujiacun 736,384）；`initRiceThiefQuest/playRiceThiefDialogue/triggerRiceThiefBattle/claimRiceThiefReward`；状态机 `not_started→accepted→hunting→reward_ready→done` 存 `sideQuests.sq_rice_thief`；线索→二选一（后山=趣味探查可回头零损失；东墙根=2 只硕鼠短遭遇，templateId=shuo_shu 可招降）→满包重试领奖。
- **P4.1b 长安「写错的招牌」**：新 NPC 胡饼摊主老孙（changan 1152,512）；`playSignBoardDialogue/chooseSignBoardStyle`；朴实/俏皮两选一同奖（500银+300经验），选择持久化 `storyEvents.changan_sign_style`，回访念出所选文案。
- 两位 NPC 挂翠绿 side 感叹号、完成即消失，不占唯一金色主线感叹号；`Dialogue.inferRoleId` 加了大婶/摊主分支。
- **H5 适配**：viewport 加 `viewport-fit=cover` + WebApp 元信息；全局 `touch-action: manipulation`、`overscroll-behavior: none`、`-webkit-tap-highlight-color`；画布 `touch-action:none` + contextmenu/touchmove 拦截（bindInputs 内）；安全区 `env(safe-area-inset-*)`；`100dvh`；<360px 与横屏矮视口收敛。全部在 `css/style.css` 末尾统一块。
- **章节开幕画卷展开**：`showChapterOpening` 重构——左右木轴自中央舒卷（`scrollPaperUnroll/scrollRollerLeft/Right` 动画），画心用 `assets/shanhai_scroll_art.jpg` 暗化，题字随卷渐显；保留 2s/点击跳过/onComplete；低动态直接全开。
- **远景氛围层**：`renderSkyAmbience`（render() 第 0.5 步）——天色渐变+双层视差远山+流云，三套国风水色按 mapId 种子稳定；洞窟/水下（id 含 dong/gong/shuilien/xiagu）豁免；每帧仅十余次填充。

### 批次 3（P5.1 + P5.3 收官，基线 2683）
- **P5.1 反馈分级**：`_floatClassForType` 七类飘字映射（暴击/治疗/法力/闪避/**抵抗**/状态/伤害）；**抵抗独立暖橙 `float-resist`**（此前与闪避混白）；`_decorateDamageFloatText` 按 `attackResult.elementRelation` 给伤害飘字加 `⚡克制/🛡被克` 前缀。
- **P5.3 战果清点**：`_snapshotVictoryState` + `showBattleVictorySummary`（endBattle victory 分支）——快照差量渲染右上角国风卡片：🧬修为(升级/经验)、🪙银两、🎒实际入包、🎺招降得宠、🐾仙宠成长；**满包拦截提示（关键词 行囊/整理背包/腾出/装不下/暂存/保管/先由他）触发独立琥珀「📌 尚待领取」区块，与到账严格分列**；无战果不弹、点击收起、9s 自散、新战斗自动清理；对 `endBattle.call(plainFixture)` 防御。
- **测试**：`test_p3_gameplay.js`(250) / `test_p4_flavor.js`(49) / `test_p5_feedback.js`(18) 共 317 项新断言接入 test_suite.js。

## 四、接下来要做（按优先级）

0. **⚠️ 用户并行开发中的功能（非 AI 所写，2026-10-25 晚出现于工作区）**：`server.js` 已被用户重写为 **Badge 统一登录 SSO + 会话 + 按用户云存档**服务（零 npm 依赖，`/api/save` 拉取推送，saves/ 目录按用户分文件夹），并新增 `js/core/cloud.js`（云存档桥：运行时包装 SaveManager，启动拉云端较新档、自动存档后静默推送，失败静默降级纯本地），`index.html` 已挂 `<script src="js/core/cloud.js?v=1.0.0">`。**接手 AI 注意**：① 这是用户手笔，改动 server.js/cloud.js 前先与用户确认；② `saves/` 与 `.cache-xiyou.log` 已加入 `.gitignore`（运行时产物不入库）；③ 本地无 Badge 服务时走 `BADGE_URL` 等环境变量默认值，游戏仍可纯本地游玩；④ 该功能未纳入 test_suite.js（服务端与浏览器桥不在测试加载清单），若继续开发建议补回归。

1. **C1 火云洞完整一章**（下一个主任务）：规格全文见 `NEXT_GAMEPLAY_PLAN.md` §11——山路异样→假意求救→洞前受阻（机制教学战）→寻求对策→再入火云洞→善后启程；交付必须含阶段表、对白、NPC 可见性、目标追踪、机制、奖励、失败重试、满包待领、读档断点、章节回访。建议复用银角大王 Boss 意图框架（`BattleEngine.bossIntents`/`updateBossIntents`/`handleYinjiaoYishanTurn` 是现成样板）做红孩儿三昧真火机制；结局尊重红孩儿被收服的人物关系，不可直接赠送为宠。进入条件（开局样板+Boss样板+关键存档修补）均已满足。
2. **P5.1 遗留小项**：「护盾吸收单独展示」需 battle.js 伤害事件新增吸收值字段（金刚护体是双抗减算、流沙护体法力抵扣在 notes），目前数据结构无独立吸收值，需要时再扩展。
3. **实机验收**：H5 代码已就位但未真机验证——实体手机/微信 WebView 的触控手感、安全区、横竖屏、开局移动修复与战果清点面板均建议真机复测。
4. **美术储备**：若用户提供角色/野怪贴图（PNG/SVG），按 `MonsterModelArtMap`（全身）与 `Portraits.customMonsterImages`（头像）接入。
5. 长期：`rules/activities.md` 的联机储备（单机成熟后才启动，当前铁律禁联网代码）。

## 五、工程铁律（违反即失败，接手必读）

1. **每次改码后 `node test_suite.js` 必须 100% 全绿**（当前基线 **2683/2683**；改动后先跑再继续）。
2. 原生技术栈，**严禁** React/Vue/Tailwind/Phaser 及任何位图外链（美术走程序化 Canvas）；严禁联机/WebSocket。
3. 改 `css/style.css` 后校验大括号平衡：`node -e "const c=require('fs').readFileSync('css/style.css','utf8');console.log((c.match(/\{/g)||[]).length===(c.match(/\}/g)||[]).length)"`。
4. 规则/数值变更必须同步 `rules/` 对应文档 + `GAME_DOCUMENTATION.md`（本会话均为 UX/展示层改动，未动数值，故未改 rules）。
5. 用户审美红线：极厌恶简陋/Emoji 充当肖像；肖像统一走 MasterPortraitEngine；战斗三栏竖排站位与按键原地高亮（禁 transform 位移）不可动。
6. 用户说"直接改代码"时不要开浏览器调试；验收以 node 测试为准。
7. 关键区分：宠物 `sha_wujing`=巡海夜叉（散仙），金仙沙僧=`sha_seng`；孙悟空/观音/如来/玉帝**绝不可被捕捉**。
8. 写文件工具不可附加 ArtifactMetadata（仅 artifacts 目录允许）。

## 六、本会话踩过的坑（新会话别再踩）

1. **test_suite.js 测试38 遗留 `app.start2DBattle` 实例桩未恢复**：验证真实开战链路时必须 `Object.getPrototypeOf(app).start2DBattle.call(testApp, ...)`，直接 `testApp.start2DBattle(...)` 会调到桩。
2. **test_shanhai 用普通对象调 `app.endBattle.call(fixture,...)`**：endBattle 内调用新方法前必须做能力防御（已加 `canSummary` 守卫），新会话往 endBattle 加逻辑时保持该防御模式。
3. **全局 Math.random 被固定种子**：任何新增的随机消耗（如新增地图 NPC 导致 Character 构造多抽随机数）可能让下游敏感断言漂移——五行伤害测试已补 `forceCrit:false` 根治；新写伤害类断言一律禁随机（用 `dmgFluctuate:1.0, forceCrit:false`）。
4. **新增地图 NPC 不写 `dialogueKey`**（校验器要求 key 必须存在于 STORY_DIALOGUES）；动态对话在 `triggerNpcDialogue` 开头按 `npc.id` 派发。
5. **测试 DOM mock 的 `className` 不与 `classList` 同步**：断言样式类用 `classList.contains(...)`。
6. **PETS 对象上不能挂缓存属性**（会进物种枚举计数）：`getSpeciesRoleProfile` 的缓存挂在函数属性 `_baseCache`。
7. `document.getElementById` 走 domMap，仅 `body.appendChild(有id的元素)` 或 `domMap[id]` 注册可查；弹窗断言优先临时包一层 `document.body.appendChild` 捕获或读 `innerHTML`。
8. dialogue.js `inferRoleId` 只有 `s`（合并串）没有 `t` 变量；别照抄 portraits.js 的写法。

## 七、本会话文件变更清单（推送包含）

- `js/app2d.js`：P3 全部 UI/辅助方法、战时名册、舒适设置、闲谈、P4 两支线、卡键修复、画卷开幕、`renderSkyAmbience`、P5.1 飘字分级、P5.3 战果清点。
- `js/data/pets.js`：`getSpeciesRoleProfile`；`js/data/maps2d.js`：王大婶/老孙两个 NPC；`js/engine/dialogue.js`：inferRoleId 两分支。
- `index.html`：菜单「🍵 闲谈」「🌿 舒适」卡片、viewport/WebApp 元信息；`css/style.css` 末尾三段新增（H5 块/画卷/resist+战果面板）。
- 新测试：`test_p3_gameplay.js`、`test_p4_flavor.js`、`test_p5_feedback.js`；`test_suite.js` 注册三文件 + forceCrit 修复。
- 文档：`NEXT_AI_HANDOFF.md`（顶部 2026-10-25 两节 + 任务表）、`GAME_DOCUMENTATION.md`（两条日期记录）、本文（`SESSION_HANDOFF.md`）。
- 新增 `.gitignore`（排除 saves/ 与 .cache-xiyou.log）。
- ⚠️ 本次提交**同时包含上一会话未提交的 R1/R2/R3/P1/P2 工作**（存档防御/移动帧率/统一指引/银角 Boss 意图/山海经寻访），它们均有测试覆盖且已验证；**另包含用户本人并行开发的 Badge SSO 云存档**（server.js 重写 + js/core/cloud.js，见第四节第 0 条）。

## 八、新会话开机自检（照做即可）

```bash
node test_suite.js        # 应输出 2683/2683 (100.0%)
node server.js            # 或 pnpm dev，浏览器开 http://localhost:5173/
```
然后读 `NEXT_AI_HANDOFF.md` 顶部（2026-10-25 两节）确认任务表，从 **C1 火云洞**开始；动手前用 `git log --oneline -3` 确认本提交已在。
