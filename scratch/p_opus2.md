你是《汉风西游》原生 JS 项目的代码修改工程师。请只输出补丁，严格按格式，不要解释。

## 背景
项目里存在两套装备强化逻辑：
1. `js/core/forge.js` 的 `ForgeSystem.enhance()` —— 完整实现，含拥有权校验（isOwned）、材料扣减、定星石保护、失败降星。**但全项目没有任何调用方，是死代码。**
2. `js/app2d.js` 的 `executeForgeEnhance(slotKey)` —— 实际被 UI 调用的版本。它先扣强化石/陨铁/银两，再掷成功率；**完全不读定星石**，但强化面板 UI 明确向玩家承诺"可使用定星石保护"（见 app2d.js 里 `info.penalty !== 'none'` 那段提示）。

结果：玩家付了成本却拿不到承诺的保护。

## 任务
把 `executeForgeEnhance` 改为委托 `ForgeSystem.enhance` 统一结算，并让定星石保护真正生效。

## 原文（必须逐字匹配，位于 js/app2d.js）
  executeForgeEnhance(slotKey) {
    const equip = this.playerData.equipment[slotKey];
    if (!equip) return;
    const curStar = equip.star || 0;
    const info = window.ForgeSystem.getEnhanceInfo(curStar);
    if (!info) return;

    if (this.playerData.silver < info.costSilver) {
      window.showGameMessage(`银两不足！需要 ${info.costSilver} 两银子。`, 'warning');
      return;
    }

    const qCount = this.inventory.getItemCount('qianghua_shi');
    const mCount = this.inventory.getItemCount('meteor_iron');
    if (qCount + mCount < info.costStones) {
      window.showGameMessage(`强化材料不足！需要 ${info.costStones} 颗强化石或天外陨铁。`, 'warning');
      return;
    }

    // 优先扣强化石，不足扣天外陨铁
    let need = info.costStones;
    if (qCount > 0) {
      const takeQ = Math.min(qCount, need);
      this.inventory.removeItem('qianghua_shi', takeQ);
      need -= takeQ;
    }
    if (need > 0 && mCount > 0) {
      this.inventory.removeItem('meteor_iron', need);
    }
    this.playerData.silver -= info.costSilver;

    const isSuccess = Math.random() < info.rate;
    const baseItem = window.GAME_DATA.ITEMS[equip.itemId];
    const equipName = baseItem ? baseItem.name : '装备';

    if (isSuccess) {
      equip.star = curStar + 1;
      this.playerData.recalculateStats(false);
      window.Sound.playCrit();
      window.showGameMessage(`🎉【神兵淬火通灵】金石激荡！【${equipName}】成功升星至 +${equip.star}！基础属性大幅飙升！`, 'success', 4500);
    } else {
      if (info.penalty === 'down_1') equip.star = Math.max(0, curStar - 1);
      if (info.penalty === 'down_2') equip.star = Math.max(0, curStar - 2);
      this.playerData.recalculateStats(false);
      window.Sound.playFailure();
      window.showGameMessage(`【淬火失手】炉温不均，强化失败！装备星级变为 +${equip.star}`, 'warning', 4000);
    }

    this.updatePlayerHud();
    this.openForgeModal(slotKey);
  }

## 要求
1. 新实现必须调用 `window.ForgeSystem.enhance(equip, this.inventory, this.playerData, useProtectStone)`，不再自己扣材料/银两/掷随机。
2. 定星石使用策略：当 `info.penalty !== 'none'`（即 +7 及以上会掉星）且玩家背包里 `dingxing_shi` 数量 ≥ 1 时，**自动启用保护**（useProtectStone = true）。这是最小改动，且符合 UI 已承诺的语义。请在注释里写明这一策略。
3. `enhance()` 返回 `{ success, attempted, star, msg }`。注意它的 `success` 表示"是否升星成功"，`attempted` 表示"是否真的执行了强化"。因此：
   - 若 `result.attempted === false`（未执行，如资源不足/拥有权校验失败）→ 直接 `window.showGameMessage(result.msg, 'warning')`，**不要**打开面板刷新以外的事情，也不要播音效。
   - 若 `result.attempted === true && result.success === true` → `window.Sound.playCrit()`，用 success 类型提示 result.msg。
   - 若 `result.attempted === true && result.success === false` → `window.Sound.playFailure()`，用 warning 类型提示 result.msg。
4. 无论哪种情况，最后都要 `this.updatePlayerHud()` 并 `this.openForgeModal(slotKey)` 刷新界面（保持原行为）。
5. 先做前置预检，给出更友好的提示（避免委托后消息过于笼统）：
   - 银两不足 → `银两不足！需要 ${info.costSilver} 两银子。`
   - 强化石+陨铁总数不足 → `强化材料不足！需要 ${info.costStones} 颗强化石或天外陨铁。`
   预检通过后再委托，避免玩家点了没反应。
6. 不要修改 forge.js，也不要修改 openForgeModal。
7. 代码风格：原生 JS、中文注释、缩进 2 空格、与项目现有风格一致。

## 输出格式
### FILE: js/app2d.js
<<<<<<< OLD
（上面给出的完整原文，逐字复制）
=======
（新的 executeForgeEnhance 实现）
>>>>>>> NEW
