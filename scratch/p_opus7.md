你是《汉风西游》原生 JS 项目的战斗系统工程师。下面是 js/core/battle.js 的真实源码片段（带行号，缩进即真实缩进）。请据此生成补丁。


=== 构造函数尾部 ===
  119|     // 临时指令集
  120|     this.actions = {}; // key: ally.id -> action
  121|     this.turnQueue = []; // 全场速度队列
  122| 
  123|     // 计算初始速度序数
  124|     this.calcTurnOrders();
  125|   }
  126| 
  127|   // 安全访问接口
  128|   get playerBuffs() {
  129|     const player = this.allies.find(a => a.isPlayer);
  130|     return player ? (player.buffs || []) : [];
  131|   }
  132| 
  133|   get enemyBuffs() {
  134|     return this.enemies.map(e => e.buffs || []);
  135|   }
  136| 
  137|   setPlayerAction(action) {
  138|     const player = this.allies.find(a => a.isPlayer);
  139|     if (player) {
  140|       this.setAllyAction(player.id, action);
  141|     }
  142|   }
  143| 
  144|   log(msg) {
  145|     this.logs.push(msg);
  146|   }
  147| 
  148|   // 重构己方战斗阵列
  149|   rebuildAllies() {
  150|     const classId = this.player.classId || this.player.class || 'jingang';
  151|     // 天生抗性与装备/门派抗性必须累加，直接 Object.assign 会让 5% 门派加值覆盖 20% 天生抗性
  152|     const merged = {};
  153|     const addRes = (src) => {
  154|       if (!src || typeof src !== 'object') return;
  155|       for (const [k, v] of Object.entries(src)) {
  156|         if (!Number.isFinite(v)) continue;
  157|         merged[k] = (merged[k] || 0) + v;
  158|       }
  159|     };

=== defend 分支 （含后续 3 行）===
 1170|     if (action.type === 'defend') {
 1171|       ally.buffs.push({ id: 'defend', name: '防御', duration: 1, defRate: 0.5, appliedRound: this.round, expiresSameRound: true });
 1172|       this.log(`【${ally.name}】摆开防御架势，本回合受到伤害减半！`);
 1173|       if (cb) await cb({ type: 'defend', target: ally.id, text: '凝神防御！' });
 1174|       return;
 1175|     }
 1176| 
 1177|     // 使用药品：必须先校验持有量并真实扣除，否则战斗可无限吃药、永远打不死
 1178|     if (action.type === 'item') {
 1179|       const item = window.GAME_DATA.ITEMS[action.itemId];
 1180|       const targetAlly = this.allies.find(a => a.id === action.targetAllyId) || ally;
 1181|       const inventory = window.App2D?.inventory;
 1182|       if (!item || !item.effect) {
 1183|         this.log(`【用药失败】未识别的药品。`);
 1184|         if (cb) await cb({ type: 'message', text: '未识别的药品' });
 1185|         return;
 1186|       }
 1187|       if (inventory && typeof inventory.getItemCount === 'function' &&
 1188|         inventory.getItemCount(action.itemId) < 1) {
 1189|         this.log(`【用药失败】${ally.name} 的【${item.name}】已用尽。`);
 1190|         if (cb) await cb({ type: 'message', text: `【${item.name}】已用尽` });
 1191|         return;
 1192|       }
 1193| 
 1194|       let healed = 0;
 1195|       let restored = 0;
 1196|       if (item.effect.hp) {
 1197|         const heal = Math.max(0, Math.min(item.effect.hp, targetAlly.maxHp - targetAlly.hp));
 1198|         if (heal > 0) {
 1199|           targetAlly.hp += heal;
 1200|           healed = heal;
 1201|           this.log(`【使用药品】${ally.name} 对【${targetAlly.name}】使用了【${item.name}】，恢复了 ${heal} 点气血！`);
 1202|           BattleEngine.playSound('playMagic');
 1203|           if (cb) await cb({ type: 'heal', target: targetAlly.id, amount: heal, text: `+${heal} HP` });
 1204|         }
 1205|       }
 1206|       if (item.effect.mp) {
 1207|         const restore = Math.max(0, Math.min(item.effect.mp, targetAlly.maxMp - targetAlly.mp));
 1208|         if (restore > 0) {
 1209|           targetAlly.mp += restore;
 1210|           restored = restore;

=== attack 分支 applyDamage ===
 1309|       this.applyDamage(targetEnemy, attackRes.totalDamage);
 1310| 
 1311|       let logMsg = `【${ally.name}】挥舞神兵，轰击【${targetEnemy.name}】！`;

=== handleSkillCast 开头 ===
 1391|   async handleSkillCast(ally, action, cb) {
 1392|     const allSkills = ally.isPlayer
 1393|       ? (this.player.getSkills ? this.player.getSkills() : (this.player.skills || []))
 1394|       : (ally.skills || []);
 1395|     const skillKey = action.skillId || (typeof action.skill === 'string' ? action.skill : (action.skill?.id || action.skill?.name));
 1396|     let skill = (skillKey && allSkills.find(s => s.id === skillKey || s.name === skillKey))
 1397|       || (typeof action.skill === 'object' && action.skill ? { ...action.skill } : allSkills[0]);
 1398|     if (!skill) return;
 1399| 
 1400|     // 把真实施放的技能身份交给表现层；不能从最近一条战报猜测法术。
 1401|     const onSkillStep = cb;
 1402|     cb = onSkillStep ? (event) => onSkillStep({ ...event, skillId: skill.id, skillName: skill.name }) : null;
 1403| 
 1404|     skill.level = skill.level || 1;
 1405|     skill.mastery = (skill.mastery !== undefined) ? skill.mastery : (skill.proficiency || 0);
 1406| 
 1407|     const aliveEnemies = this.getAliveEnemies();

=== settleRoundBuffs ===
  993|   async settleRoundBuffs(cb) {
  994|     for (const unit of [...this.allies, ...this.enemies]) {
  995|       for (const buff of [...unit.buffs]) {
  996|         // 单位已阵亡时立即停止后续结算，避免对尸体反复放毒花
  997|         if (unit.hp <= 0) break;
  998|         if (buff.id === 'wandu' && buff.appliedRound < this.round && unit.hp > 0) {
  999|           const baseTick = Number(buff.poisonDmg);
 1000|           const decay = Number(buff.decayRatio);
 1001|           // NaN 防护：非法存档或旧数据会让中毒伤害变 NaN，进而把气血写成 NaN 造成"无损判胜"
 1002|           buff.poisonDmg = Math.max(1, Math.floor((Number.isFinite(baseTick) ? baseTick : 1) *
 1003|             (Number.isFinite(decay) ? decay : 0.75)));
 1004|           this.applyDamage(unit, buff.poisonDmg);
 1005|           this.log(`【毒伤】${unit.name} 损失 ${buff.poisonDmg} 点气血。`);
 1006|           if (cb) await cb({ type: 'poison_tick', ...(this.allies.includes(unit) ? { target: unit.id } : { targetIndex: unit.enemyIndex }),
 1007|             damage: buff.poisonDmg, text: `毒伤 -${buff.poisonDmg}` });
 1008|         }
 1009|         if (buff.id === 'bleed' && buff.appliedRound < this.round && unit.hp > 0) {
 1010|           const tick = Math.max(1, Math.floor(Number(buff.damagePerTurn) || 1));
 1011|           this.applyDamage(unit, tick);
 1012|           this.log(`【流血】${unit.name} 损失 ${tick} 点气血。`);
 1013|           if (cb) await cb({ type: 'poison_tick', ...(this.allies.includes(unit) ? { target: unit.id } : { targetIndex: unit.enemyIndex }),
 1014|             damage: tick, text: `流血 -${tick}` });
 1015|         }
 1016|         // 只在"施加回合之后"递减，保证后手施加的控制至少完整生效一回合。
 1017|         // 防御是"本回合内有效"的姿态：新代码用 expiresSameRound 显式标记，
 1018|         // 同时保留按名称兜底，兼容旧存档与既有断言里的裸 { name: '防御' } 写法。
 1019|         const isStanceBuff = buff.expiresSameRound === true || buff.name === '防御';
 1020|         if (buff.duration !== undefined && (isStanceBuff ||
 1021|           (buff.appliedRound !== undefined && buff.appliedRound < this.round))) buff.duration--;
 1022|       }
 1023|       // 中毒/流血致死也要走复活与死亡判定，与主动攻击链保持一致
 1024|       if (unit.hp <= 0) this.tryRebirth(unit);
 1025|       unit.buffs = unit.buffs.filter(b => b.duration === undefined || b.duration > 0);
 1026|     }
 1027|   }
 1028| 
 1029|   // 检查战斗结束
 1030|   checkBattleEnd() {

=== handleEnemyTurn 开头 ===
 1961|   async handleEnemyTurn(enemy, action, cb) {
 1962|     if (await this.handleControlState(enemy, action, cb)) return;
 1963|     const aliveAllies = this.getAliveAllies();
 1964|     if (aliveAllies.length === 0) return;
 1965| 
 1966|     const targetAlly = this.allies.find(a => a.id === action.targetId && a.hp > 0) || aliveAllies[0];


你是《汉风西游》原生 JS 项目的战斗系统工程师。请只输出补丁，严格按格式，不要解释。

## 任务
为红孩儿实现「五行车阵」Boss 机制。方案已由架构评审确定，**严格按下面的规范实现，不要自行发挥**。

## 设计规范（必须遵守）

### 阶段循环（R = 蓄力回合）
```
R   蓄力     → 红孩儿该次行动只做"蓄火"演出，不造成伤害
R+1 爆发     → 按速度队列正常行动；红孩儿行动时执行一次三昧真火群体爆发
R+2 恢复     → 只普通攻击
R+3 恢复     → 回合末建立下一轮蓄力
R+4 再蓄力
```

### 状态一律放 buff，不新增敌方运行字段
Boss 最多同时持有一条 `hh_cart_state` buff，字段：
- `id: 'hh_cart_state'`
- `name`：随阶段显示（'车阵蓄火' / '五车俱燃' / '回气' / '阵眼已破'）
- `phase: 'charge' | 'burst' | 'recovery' | 'broken'`
- `duration`：距离到期还需经过的回合末次数
- `appliedRound`：真实写入回合（**不得伪造成未来回合**）
- `activeFromRound`：允许 AI 使用该状态的起始回合
- `cycleStartRound`：本轮蓄力回合 R
- `cycleId`：`bossId + ':' + R` 稳定标识
- `eyeElement`：本轮阵眼五行（按 金→木→水→火→土 顺序轮换）
- `breakProgress`：本轮已累计有效伤害
- `breakThreshold`：本轮阈值，开始蓄力时确定
- `resolved`：爆发是否已执行或已取消

玩家守息 buff：
- `id: 'hh_cart_guard'`
- `name: '守息避火'`
- `sourceId` / `cycleId`
- `appliedRound`
- `duration`：R 获得为 2，R+1 获得为 1
- `burstDamageFactor: 0.65`
- `consumed: false`

### 数值首版
- 破阵阈值 = Boss 最大生命 × 0.05（红孩儿真身 hp 42000 → 2100）
- 车阵爆发 = 既有 G 系法术基准威力 × 1.5，对存活友方逐个结算
- 守息减伤 35%（即 `burstDamageFactor = 0.65`）
- 恢复固定 2 回合

### 破阵判定（全部满足才算）
1. `处于蓄力期`（buff.phase === 'charge' 且 activeFromRound <= 当前 round）
2. 目标为红孩儿本人
3. 来源为玩家主动攻击或伤害技能（**DOT、反伤、反击不计入**）
4. 实际扣血 > 0（闪避、零伤害不计入）
→ 实际扣血累加进 `breakProgress`
→ 当 `breakProgress >= breakThreshold` 且 `!brokenThisCycle`：立即转到 `broken`，取消本轮爆发，清除对应守息 buff，反馈只触发一次

### 守息判定
- 玩家执行 `defend` 动作时，若 Boss 处于 `charge` 或 `burst` 且本轮未 resolved → 给该执行者赋/刷新 `hh_cart_guard`（**不叠加层数**）
- 爆发伤害结算时：若 `sourceId`+`cycleId` 匹配且 `!consumed` → 应用 `burstDamageFactor` 减伤并置 `consumed = true`
- **与普通防御取"更强"而非相乘**：若该目标同时有普通防御（50%），采用 50%，不是 50%×65%

### 时序硬约束
- **首轮预告必须在玩家提交指令之前可见**（战斗初始化时就写入 charge buff 并通过 message/buff step 展示）
- 蓄力回合 R 中红孩儿**不造成伤害**
- R+1 破阵窗口关闭，不能用 R+1 的伤害追溯取消本轮爆发
- 破阵不会提前启动下一轮蓄力（避免玩家越努力越挨打）

### 不新增 step 类型
只用现有：`message`、`buff`、`cast` + `hits`、`damage`

## 需要修改的文件与位置

### 文件 1：js/core/battle.js

**(a) 新增方法 `initCartMechanic(enemy)`** —— 在构造函数初始化敌人后调用，为带 `mechanicId === 'five_element_cart'` 的敌人写入首轮 `hh_cart_state`（phase charge）。

请在构造函数中 `this.calcTurnOrders();` 之前的位置插入调用。原文锚点：
```
    // 临时指令集
    this.actions = {}; // key: ally.id -> action
    this.turnQueue = []; // 全场速度队列

    // 计算初始速度序数
    this.calcTurnOrders();
```

**(b) 新增方法组**（放在 `settleRoundBuffs` 方法之后、`checkBattleEnd` 之前）：
- `getCartState(enemy)` —— 返回该敌人的 `hh_cart_state` buff 或 null
- `initCartMechanic(enemy)` —— 写入首轮蓄力
- `advanceCartCycle(enemy)` —— 按相位推进（charge→burst→recovery×2→charge）
- `recordCartBreakDamage(attacker, target, dealt)` —— 累计破阵进度并判定破阵
- `applyCartGuard(ally)` —— 授予守息
- `resolveCartBurst(enemy, cb)` —— 执行爆发：对每个存活友方结算一次专属法术，套用守息与既有减伤链
- `cleanupCartMechanic(enemy)` —— 战斗结束/破阵后清理

**(c) 在攻击结算里接入破阵累计**
`handleAllyTurn` 的 `attack` 分支，`this.applyDamage(targetEnemy, attackRes.totalDamage);` 之后调用 `this.recordCartBreakDamage(ally, targetEnemy, attackRes.totalDamage)`。

**(d) 在伤害技能结算里接入破阵累计**
`handleSkillCast` 中，凡是 `this.applyDamage(targetEnemy, ...)` / `this.applyDamage(e, ...)` 且目标是红孩儿的位置，之后调用 `recordCartBreakDamage`。至少覆盖：舍生取义、佛光普照、如来神掌、雷霆万钧、万毒攻心、三昧真火/飞沙走石、乱魂咒、封印咒、定身咒、通用保底结算。

**(e) 防御动作授予守息**
`handleAllyTurn` 的 `defend` 分支，在 push 防御 buff 之后调用 `this.applyCartGuard(ally)`。

**(f) 回合末推进**
`settleRoundBuffs` 方法末尾，对每个敌人调用 `advanceCartCycle(enemy)`。

**(g) 敌方行动执行爆发**
`handleEnemyTurn` 开头（`handleControlState` 之后），若该敌人持有 `hh_cart_state` 且 `phase === 'burst'` 且 `activeFromRound <= this.round` 且 `!resolved` → 先 `await this.resolveCartBurst(enemy, cb)` 并 `return`（不执行普通攻击）。若 `phase === 'charge'` 且是该轮行动 → 只播放蓄火演出（`message` step）并 `return`，不造成伤害。

## 输出格式
按顺序输出多个补丁块，每块严格格式：

### FILE: js/core/battle.js
<<<<<<< OLD
（逐字精确的原文）
=======
（替换后代码）
>>>>>>> NEW

注意：
- OLD 必须能从文件中唯一匹配，含缩进，不得省略。
- 代码风格：原生 JS、中文注释、2 空格缩进。
- 不要改动与本机制无关的代码。
- 建议拆成若干小块（构造函数调用、方法组、各接入点），便于逐块核对。
