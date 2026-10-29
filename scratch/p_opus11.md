你是《汉风西游》原生 JS 项目的战斗系统工程师。下面是 js/core/battle.js 的真实源码片段（带行号，缩进即真实缩进），以及已实现的「五行车阵」机制作为参照样板。请据此实现新 Boss 机制。

## 任务：为鼍洁（黑水河 Boss）实现「黑水换甲」机制

### 与五行车阵的区别（务必区分，不要照抄）
五行车阵是**蓄力→爆发→恢复**的倒计时大招。黑水换甲**没有蓄力、没有爆发窗口、没有即死惩罚**，核心张力是**伤害类型选择**：

| 姿态 | 效果 | 玩家读法 |
| --- | --- | --- |
| `scaled`（凝鳞） | 物理防御 +配置值，法术防御正常 | 鳞甲紧合，宜以法术攻之 |
| `flowing`（散流） | 法术防御 +配置值，物理防御正常 | 水幕流转，宜近身破之 |

- 每完成 **2 次自身有效行动** 后切换一次；失去行动（被封印/定身/乱魂）不计数。
- 开场固定 `scaled`，让首次接触可学习。
- **抗性不能设为免疫**，必须是可通过常规伤害击败的减伤。

### 声明方式（与车阵一致）
Boss 对象带：
```js
mechanicId: 'heishui_current_armor',
mechanicConfig: {
  startStance: 'scaled',
  switchEvery: 2,
  scaledDefBonus: 0.45,   // 凝鳞：物防 +45%
  flowingMdefBonus: 0.45  // 散流：法防 +45%
}
```

### 状态承载
`enemy.buffs` 中一条 `hh_armor_state`：
- `id: 'hh_armor_state'`
- `name`：'凝鳞' / '散流'
- `stance`：'scaled' | 'flowing'
- `actionCount`：当前姿态已完成的**有效行动**数
- `appliedRound`
- **防御修正必须从基础属性实时计算，不得反复直接加 `enemy.def` / `enemy.mdef`**（否则切换与重试会永久叠加）

### 关键实现要求
1. **伤害修正入口**：新增 static 方法 `BattleEngine.applyArmorMitigation(defender, rawDamage, isSpell)`，按当前姿态返回实际伤害：
   - `scaled` 且 `isSpell === false`（物理）：`damage = rawDamage / (1 + scaledDefBonus)`
   - `flowing` 且 `isSpell === true`（法术）：`damage = rawDamage / (1 + flowingMdefBonus)`
   - 其它情况原样返回
   - 返回 `{ damage, stances, note }`，`note` 用于战报（如 '凝鳞抵住了部分兵刃伤害'）
2. **计数入口**：新增方法 `BattleEngine.recordArmorAction(enemy)`，在该敌人**真正执行完一次有效行动**后调用：
   - `actionCount++`
   - 达 `switchEvery` 时切换 stance、`actionCount` 归零、`name` 同步更新
   - 被 `handleControlState` 拦下（封印/定身/乱魂）的单位**不应**计数（因为 `handleEnemyTurn` 在控制判定后直接 return）
3. **接入点**：
   - `handleEnemyTurn` 开头调 `this.getArmorState(enemy)`，若存在则在常规攻击/技能结算时把伤害过一遍 `applyArmorMitigation`；在函数**所有正常返回路径**（普攻、元素法术、金刚护体）末尾调用 `recordArmorAction(enemy)`
   - `handleAllyTurn` 的 `attack` 分支与 `handleSkillCast` 各技能分支，在 `applyDamage(enemy, ...)` 前对**目标为鼍洁**的伤害调用 `applyArmorMitigation`
4. **清理**：新增 `cleanupArmorMechanic(enemy)`，移除 `hh_armor_state`。
5. **豁免**：`settleRoundBuffs` 的通用 `duration` 递减与到期过滤必须**跳过** `hh_armor_state`（与车阵同样处理），否则状态会被误删。
6. **初始化**：在构造函数里与 `initCartMechanic` 并列调用 `initArmorMechanic(enemy)`（仅当 `mechanicId === 'heishui_current_armor'`）。

### 代码风格
原生 JS、中文注释、2 空格缩进、不新增依赖。不要改动与机制无关的代码。

## 输出格式（多块，每块独立）
### FILE: js/core/battle.js
<<<<<<< OLD
（逐字精确的原文，必须能从文件唯一匹配）
=======
（替换后代码）
>>>>>>> NEW

请务必拆成小块（构造函数、方法组、接入点、豁免），便于逐块核对。
