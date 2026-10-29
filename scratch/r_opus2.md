### FILE: js/app2d.js
<<<<<<< OLD
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
=======
  executeForgeEnhance(slotKey) {
    const equip = this.playerData.equipment[slotKey];
    if (!equip) return;
    const curStar = equip.star || 0;
    const info = window.ForgeSystem.getEnhanceInfo(curStar);
    if (!info) return;

    // 前置预检：给出更友好的提示，避免委托后消息过于笼统
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

    // 定星石保护策略（最小改动，契合 UI 承诺的语义）：
    // 仅当本次强化会掉星（info.penalty !== 'none'，即 +7 及以上）
    // 且背包内定星石（dingxing_shi）数量 ≥ 1 时，自动启用保护。
    const useProtectStone =
      info.penalty !== 'none' && this.inventory.getItemCount('dingxing_shi') >= 1;

    // 统一委托 ForgeSystem.enhance 结算：材料/银两扣减、成功率、失败降星、定星石保护
    const result = window.ForgeSystem.enhance(equip, this.inventory, this.playerData, useProtectStone);

    if (!result.attempted) {
      // 未真正执行（如资源不足/拥有权校验失败）：仅提示，不播音效
      window.showGameMessage(result.msg, 'warning');
    } else if (result.success) {
      // 真正执行且升星成功
      window.Sound.playCrit();
      window.showGameMessage(result.msg, 'success', 4500);
    } else {
      // 真正执行但升星失败
      window.Sound.playFailure();
      window.showGameMessage(result.msg, 'warning', 4000);
    }

    // 无论哪种情况都刷新界面，保持原行为
    this.updatePlayerHud();
    this.openForgeModal(slotKey);
  }
>>>>>>> NEW