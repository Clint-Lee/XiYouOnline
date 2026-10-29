你是《汉风西游》项目的测试工程师。请输出一个可直接 require 的 Node 测试模块，为「五行车阵」Boss 机制写断言。

## 运行环境（重要）
- 测试由主套件以 `await require('./test_cart_mechanic.js')(assert);` 方式调用，导出形式必须是：
```js
module.exports = async function (assert) { /* ... */ };
```
- `assert(condition, message)` 已由主套件提供，**不要自己定义**。
- 全局 `window === global`。类已挂在 `window` 上：`window.BattleEngine`、`window.Player`、`window.PetSystem`、`window.GAME_DATA`。
- 主套件已把 `Math.random` 覆写为固定序列（确定性）。**在你的测试内需要固定随机时，请自行保存并临时替换，结束时在 finally 里还原。**
- 不要依赖 DOM。

## 机制实现摘要（已存在于 battle.js）
Boss 单位带 `mechanicId: 'five_element_cart'` 与 `mechanicConfig`。状态存在 `enemy.buffs` 里的 `hh_cart_state`：
- 字段：`phase`（`charge`/`burst`/`recovery`/`broken`）、`duration`、`appliedRound`、`activeFromRound`、`cycleStartRound`、`cycleId`、`eyeElement`、`breakProgress`、`breakThreshold`、`resolved`
玩家守息 buff：`id: 'hh_cart_guard'`，字段 `sourceId`、`cycleId`、`appliedRound`、`duration`、`burstDamageFactor: 0.65`、`consumed`。

可用原型方法（均定义在 `BattleEngine.prototype`）：
- `getCartState(enemy)` → 返回 `hh_cart_state` buff 或 null
- `initCartMechanic(enemy)` → 写入首轮蓄力
- `advanceCartCycle(enemy)` → 按相位推进（charge→burst→recovery×2→charge）
- `recordCartBreakDamage(attacker, target, dealt)` → 累计破阵，达阈值转 broken
- `applyCartGuard(ally)` → 授予守息
- `resolveCartBurst(enemy, cb)` → 执行群体爆发
- `cleanupCartMechanic(enemy)` → 清理

破阵阈值 = `maxHp × 0.05`（42000 → 2100）；守息减伤 65% 承伤；恢复 2 回合。

## 请写 12 条断言（对应下列意图，每条一个 assert）

1. **预告先于输入**：`initCartMechanic` 后立刻能读到 `phase === 'charge'`，且带 `breakThreshold`（2100）与 `activeFromRound`。
2. **阶段确定性**：连续调用 `advanceCartCycle` 5 次，相位序列严格为 charge→burst→recovery→recovery→charge（用 phase 读取，不必断言中间态名称完全一致，只需保证"爆发只出现一次、恢复出现两次、之后回到 charge"）。
3. **抢攻破阵生效**：蓄力期对 Boss 累计造成 2100 伤害 → `phase` 转为 `'broken'`，且 `resolved === true`。
4. **累计边界**：累计 2099 不破阵（仍 charge），补 1 点后破阵。
5. **零伤害不计入**：`recordCartBreakDamage(ally, boss, 0)` 后 `breakProgress === 0`。
6. **守息授予**：蓄力期 `applyCartGuard(ally)` → ally.buffs 出现 `hh_cart_guard`，`burstDamageFactor === 0.65`，`consumed === false`。
7. **守息不叠加**：连续两次 `applyCartGuard` 同一 ally → 只有一条 `hh_cart_guard`。
8. **爆发执行一次**：蓄力后推进到 burst，调用 `resolveCartBurst` 一次 → 存活友方掉血；再调一次 → 不再掉血（`resolved` 生效）。
9. **守息减伤真实生效**：用固定随机、构造同血量两个 ally，一个带守息一个不带，同一波爆发后带守息者剩余血量更多。
10. **破阵后不提前重新蓄力**：破阵后连续 `advanceCartCycle` 2 次，`phase` 不为 `'charge'`（仍在 broken 或 recovery）。
11. **到期清理**：`cleanupCartMechanic(boss)` 后 `getCartState(boss) === null`，且 boss.buffs 里无 `hh_cart_state`。
12. **结构完整**：`window.BattleEngine.prototype` 上七个车阵方法均存在且为 function。

## 构造测试对象的要点
- 玩家：`new window.Player({ classId: 'jingang', level: 50 })`
- Boss 对象示例（供参考，字段需完整）：
```js
const boss = {
  id: 'boss_redboy_test', name: '红孩儿测试体', level: 56,
  hp: 42000, maxHp: 42000, mp: 9999, maxMp: 9999,
  atk: 420, def: 215, matk: 400, mdef: 205, spd: 52, skills: [],
  mechanicId: 'five_element_cart',
  mechanicConfig: { breakRatio: 0.05, burstFactor: 1.5, guardFactor: 0.65, recoveryRounds: 2,
    elements: ['gold','wood','water','fire','earth'] }
};
const battle = new window.BattleEngine(player, [], [boss]);
```
- 注意 `BattleEngine` 构造函数会规范化敌人字段并调用 `initCartMechanic`，所以构造后车阵状态可能已存在。
- 若需要 ally 参与爆发结算，可用 `battle.allies`（玩家会自动加入）。

## 约束
- 每条断言 message 用简体中文，清晰说明在验证什么。
- 数字与阈值不要硬编码到与实现冲突；阈值请从 `cartState.breakThreshold` 读取。
- 全部用 async/await，函数外层包 try/finally 还原 Math.random。
- 不要修改任何非本测试文件。
- 代码风格：2 空格缩进、中文注释、原生 JS。

## 输出格式
直接输出完整的 `test_cart_mechanic.js` 文件内容，用下面的标记包裹：

### FILE: test_cart_mechanic.js
```js
（完整文件内容）
```
