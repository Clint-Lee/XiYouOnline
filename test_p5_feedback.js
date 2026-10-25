/**
 * test_p5_feedback.js
 *
 * P5.1 战斗反馈分级：抵抗与闪避视觉分离、伤害飘字五行克制/被克标记
 * P5.3 胜利战果清点：到账 (经验/银两/入包/招降/仙宠成长) 与待领取严格分列、无战果不打扰
 */

module.exports = async function runP5FeedbackTests(assert) {
  console.log('\n▶️ [P5 反馈分级与战果清点测试] 抵抗/闪避分离、五行标记、到账与待领取分列');

  const app = window.App2D;

  // =========================================================================
  // P5.1: 飘字分级
  // =========================================================================
  {
    assert(app._floatClassForType('resist') === 'float-resist', 'P5.1: 抵抗拥有独立飘字样式 float-resist');
    assert(app._floatClassForType('dodge') === 'float-dodge', 'P5.1: 闪避保持 float-dodge 与抵抗分离');
    assert(app._floatClassForType('crit') === 'float-crit' && app._floatClassForType('heal') === 'float-heal' &&
      app._floatClassForType('mana') === 'float-mana' && app._floatClassForType('status') === 'float-status' &&
      app._floatClassForType('damage') === 'float-damage', 'P5.1: 暴击/治疗/法力/状态/伤害映射保持不变');

    assert(app._decorateDamageFloatText('-120', { elementRelation: 'counter' }).startsWith('⚡'),
      'P5.1: 克制关系伤害飘字前缀 ⚡ 标记');
    assert(app._decorateDamageFloatText('-80', { elementRelation: 'countered' }).startsWith('🛡'),
      'P5.1: 被克关系伤害飘字前缀 🛡 标记');
    assert(app._decorateDamageFloatText('-50', { elementRelation: null }) === '-50' &&
      app._decorateDamageFloatText('-50', null) === '-50',
      'P5.1: 中立与无关系伤害飘字保持原样不加标记');

    // 真实生成一颗抵抗飘字并校验样式类
    const fxLayer = global.document.createElement('div');
    fxLayer.id = 'battle-fx-layer';
    global.document.body.appendChild(fxLayer);
    const layerEl = global.document.getElementById('battle-fx-layer');
    const childCount = layerEl.children.length;
    app.spawnBattleFloatingTextAtCoords(100, 100, '封印未中', 'resist');
    const lastChild = layerEl.children[layerEl.children.length - 1];
    assert(lastChild && (lastChild.className || '').includes('float-resist') && lastChild.innerText === '封印未中',
      'P5.1: 抵抗飘字真实渲染为独立样式类');
  }

  // =========================================================================
  // P5.3: 胜利战果清点
  // =========================================================================
  const captureSummary = (runVictory) => {
    const fixture = Object.create(app);
    fixture.playerData = new window.Player({ level: 1 });
    fixture.inventory = new window.Inventory();
    fixture.pets = [];
    fixture.currentBattle = {
      enemies: [
        { name: '拖米硕鼠', level: 5, hp: 0, isCaptured: false }
      ],
      allies: [
        { id: 'player', isPlayer: true, hp: 100 }
      ],
      trainingPetIds: [],
      syncStateBack: () => { }
    };
    fixture.isAnimatingCombat = false;
    fixture.keysDown = {};
    fixture.battleVictoryCallback = runVictory ? (fixture.victoryCb = () => { }) : null;
    fixture.stopBattleLoop = () => { };
    fixture.stopBattleCountdown = () => { };
    fixture.clearBattlePresentation = () => { };
    fixture.updatePlayerHud = () => { };
    fixture.saveAutoProgress = () => ({ success: true });

    let capturedEl = null;
    const origAppend = global.document.body.appendChild;
    global.document.body.appendChild = (child) => {
      if (child && (child.className || '').includes('battle-summary-overlay')) capturedEl = child;
      return origAppend(child);
    };
    try {
      fixture.endBattle('victory');
    } finally {
      global.document.body.appendChild = origAppend;
    }
    return { fixture, capturedEl };
  };

  {
    // 1. 战果丰富的胜利：到账分列展示，绝不与待领取混排
    const { fixture, capturedEl } = (() => {
      const f = Object.create(app);
      f.playerData = new window.Player({ level: 1 });
      f.inventory = new window.Inventory();
      f.pets = [window.PetSystem.createPet('shuo_shu', false, 1)];
      f.currentBattle = {
        enemies: [
          { name: '拖米硕鼠', level: 5, hp: 0, isCaptured: false },
          { name: '捧米小鼠', level: 2, hp: 0, isCaptured: true }
        ],
        allies: [
          { id: 'player', isPlayer: true, hp: 100 },
          { id: 'pet_1', entity: { instanceId: f.pets[0].instanceId } }
        ],
        trainingPetIds: [f.pets[0].instanceId],
        syncStateBack: () => { }
      };
      f.isAnimatingCombat = false;
      f.keysDown = {};
      f.battleVictoryCallback = () => {
        f.playerData.silver += 500;
        f.playerData.gainExp(600);
        f.inventory.addItem('jinchuang_yao', 2);
      };
      f.stopBattleLoop = () => { };
      f.stopBattleCountdown = () => { };
      f.clearBattlePresentation = () => { };
      f.updatePlayerHud = () => { };
      f.saveAutoProgress = () => ({ success: true });
      let captured = null;
      const origAppend = global.document.body.appendChild;
      global.document.body.appendChild = (child) => {
        if (child && (child.className || '').includes('battle-summary-overlay')) captured = child;
        return origAppend(child);
      };
      try {
        f.endBattle('victory');
      } finally {
        global.document.body.appendChild = origAppend;
      }
      return { fixture: f, capturedEl: captured };
    })();

    assert(!!capturedEl, 'P5.3: 胜利后展示战果清点面板');
    const html = capturedEl.innerHTML;
    assert(html.includes('战果清点'), 'P5.3: 面板标题为战果清点');
    assert(html.includes('升级至') && html.includes(`Lv.`), 'P5.3: 修为行展示升级结果');
    assert(/🪙 银两<\/span><span class="bs-v">\+\d+ 两/.test(html), 'P5.3: 银两到账差量展示 (含升级犒赏合并结算)');
    assert(html.includes('金创药×2') && html.includes('实际入包'), 'P5.3: 实际入包物品精确列出');
    assert(html.includes('招降得宠') && html.includes('捧米小鼠'), 'P5.3: 招降结果单独一行展示');
    assert(html.includes('仙宠成长') && html.includes('Lv.1→'), 'P5.3: 仙宠升级成长变化展示');
    assert(!html.includes('尚待领取'), 'P5.3: 无满包拦截时不出现待领取区块');

    // 2. 满包待领取：与到账严格分列
    const pendingFixture = Object.create(app);
    pendingFixture.playerData = new window.Player({ level: 12 });
    pendingFixture.inventory = new window.Inventory();
    pendingFixture.pets = [];
    pendingFixture.currentBattle = {
      enemies: [{ name: '枯树精', level: 2, hp: 0, isCaptured: false }],
      allies: [{ id: 'player', isPlayer: true, hp: 100 }],
      trainingPetIds: [],
      syncStateBack: () => { }
    };
    pendingFixture.isAnimatingCombat = false;
    pendingFixture.keysDown = {};
    pendingFixture.stopBattleLoop = () => { };
    pendingFixture.stopBattleCountdown = () => { };
    pendingFixture.clearBattlePresentation = () => { };
    pendingFixture.updatePlayerHud = () => { };
    pendingFixture.saveAutoProgress = () => ({ success: true });
    pendingFixture.battleVictoryCallback = () => {
      window.showGameMessage('行囊装不下道长的谢礼，请整理背包后再来复命。', 'warning', 5000);
    };
    let pendingEl = null;
    const origAppend2 = global.document.body.appendChild;
    global.document.body.appendChild = (child) => {
      if (child && (child.className || '').includes('battle-summary-overlay')) pendingEl = child;
      return origAppend2(child);
    };
    try {
      pendingFixture.endBattle('victory');
    } finally {
      global.document.body.appendChild = origAppend2;
    }
    assert(!!pendingEl && pendingEl.innerHTML.includes('尚待领取') && pendingEl.innerHTML.includes('不会丢失'),
      'P5.3: 满包拦截时展示待领取提示与补领入口说明');
    assert(!pendingEl.innerHTML.includes('实际入包'),
      'P5.3: 待领取不冒充入包，与到账奖励严格分列');

    // 3. 无任何战果的普通野战 (无奖励回调、无宠物培养) 不弹面板
    const plain = captureSummary(false);
    assert(!plain.capturedEl, 'P5.3: 无战果时保持安静，不打扰玩家');
  }
};
