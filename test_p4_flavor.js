/**
 * test_p4_flavor.js
 *
 * P0 输入韧性：大小写错位 keyup 不再卡键、失联按键看门狗清除超时按住键
 * P4.1a 刘家村「谁偷了米」：接取→线索→错误追查可回头→正确追查短遭遇→满包重试→修粮袋奖励→回访
 * P4.1b 长安「写错的招牌」：朴实/俏皮两选一同奖、选择持久化、回访保留、重复点击不重发
 */

module.exports = async function runP4FlavorTests(assert) {
  console.log('\n▶️ [P0 输入韧性 & P4 趣闻支线测试] 卡键根治、谁偷了米、写错的招牌');

  const app = window.App2D;

  // =========================================================================
  // P0: 输入状态韧性 (大小写规范化 + 失联看门狗)
  // =========================================================================
  {
    // 捕获 bindInputs 注册的事件处理器
    const captured = {};
    const origWindowAdd = window.addEventListener;
    window.addEventListener = (type, fn) => {
      captured[type] = captured[type] || [];
      captured[type].push(fn);
    };
    const inputApp = Object.assign(Object.create(Object.getPrototypeOf(app)), app, {
      keysDown: {},
      canvas: null,
      hasExplorationModal: () => false,
      currentBattle: null
    });
    inputApp.bindInputs();
    window.addEventListener = origWindowAdd;

    const kd = captured.keydown[captured.keydown.length - 1];
    const ku = captured.keyup[captured.keyup.length - 1];
    assert(typeof kd === 'function' && typeof ku === 'function', 'P0: 键盘事件处理器注册成功');

    const mkEv = (key) => ({ key, repeat: false, preventDefault: () => {}, target: null });

    // 场景1: 按住 a 移动期间按下 Shift，松开时 keyup 报 'A' —— 不得卡键
    kd(mkEv('a'));
    assert(inputApp.keysDown.a === true && typeof inputApp._keyEventTimes.a === 'number',
      'P0: 按下 a 正常记录按键状态与事件时间');
    ku(mkEv('A'));
    assert(inputApp.keysDown.a !== true, 'P0: 大小写错位 keyup (按 a 抬 A) 彻底清除按键，杜绝卡死移动');

    // 场景2: 方向键正常按下与释放
    kd(mkEv('ArrowLeft'));
    assert(inputApp.keysDown.ArrowLeft === true, 'P0: 方向键按下正常记录');
    ku(mkEv('ArrowLeft'));
    assert(inputApp.keysDown.ArrowLeft !== true, 'P0: 方向键释放正常清除');

    // 场景3: 失联看门狗 —— keyup 彻底丢失 (切窗/焦点被夺) 时超时自动清除
    const watchApp = Object.assign(Object.create(Object.getPrototypeOf(app)), app, {
      isPaused: false,
      isTransitioning: false,
      currentBattle: null,
      currentMapId: 'liujiacun',
      keysDown: { ArrowLeft: true },
      _keyEventTimes: { ArrowLeft: Date.now() - 2000 },
      autoMovePath: [],
      autoMoveTargetCallback: null,
      hasExplorationModal: () => false,
      playerChar: new window.Character({ x: 256, y: 448, width: 32, height: 32, speed: 3.8 }),
      mountSystem: app.mountSystem,
      camera: app.camera,
      monsters: [],
      tilemap: app.tilemap,
      clickRipples: []
    });
    const startX = watchApp.playerChar.x;
    watchApp.update(16);
    assert(watchApp.keysDown.ArrowLeft !== true && watchApp.playerChar.x === startX,
      'P0: 失联按键看门狗清除超时按住键，角色停止移动不再卡死向左');

    // 场景4: 正常按住的键 (持续有系统重复 keydown 刷新时间戳) 不被误清
    watchApp.keysDown = { ArrowRight: true };
    watchApp._keyEventTimes = { ArrowRight: Date.now() };
    watchApp.playerChar.x = 256;
    watchApp.update(16);
    assert(watchApp.keysDown.ArrowRight === true && watchApp.playerChar.x > 256,
      'P0: 正常按住的方向键不受看门狗误伤，移动照常生效');
  }

  // =========================================================================
  // P4.1a: 刘家村「谁偷了米」全链路
  // =========================================================================
  const makeRiceFixture = (slots = []) => {
    const fixture = Object.create(app);
    fixture.playerData = new window.Player({ level: 12 });
    fixture.playerData.sideQuests = {};
    fixture.inventory = new window.Inventory(slots);
    fixture.storyPhase = 'liujiacun_start';
    fixture.currentMapId = 'liujiacun';
    fixture.companions = [];
    fixture.interactedNpcSet = new Set();
    fixture.npcs = [];
    fixture.updatePlayerHud = () => { };
    fixture.saveAutoProgress = () => ({ success: true });
    fixture.refreshMapNpcs = () => { };
    fixture.start2DBattle = (enemies, onWin) => {
      fixture.battleCount = (fixture.battleCount || 0) + 1;
      fixture.lastBattleEnemies = enemies;
      onWin();
    };
    return fixture;
  };
  const captureDialogue = (fn) => {
    const orig = window.Dialogue.start;
    let script = null;
    window.Dialogue.start = (s) => { script = s; };
    try { fn(); } finally { window.Dialogue.start = orig; }
    return script;
  };

  {
    const fixture = makeRiceFixture();

    // 1. 初始化与接取
    const sq = fixture.initRiceThiefQuest();
    assert(sq && sq.step === 'not_started' && sq.title === '谁偷了米', 'P4.1a: 支线状态机初始化为未接取');
    let script = captureDialogue(() => fixture.playRiceThiefDialogue());
    const acceptOpt = script.steps[1].options.find(o => o.text.includes('接下这桩小事'));
    assert(!!acceptOpt, 'P4.1a: 王大婶提供接取选项');
    acceptOpt.action();
    assert(sq.step === 'accepted', 'P4.1a: 接取后状态推进至 accepted');

    // 2. 两条线索可读且不推进状态
    script = captureDialogue(() => fixture.playRiceThiefDialogue());
    const marksOpt = script.steps[0].options.find(o => o.text.includes('查看米袋旁的痕迹'));
    const trailOpt = script.steps[0].options.find(o => o.text.includes('跟着碎米查拖痕'));
    assert(!!marksOpt && !!trailOpt, 'P4.1a: 提供两条可选线索');
    marksOpt.action();
    trailOpt.action();
    assert(sq.cluesRead.marks === true && sq.cluesRead.trail === true && sq.step === 'accepted',
      'P4.1a: 读线索只记见闻不改阶段');

    // 3. 错误追查 (后山草窝)：可回头、无损失、不开战
    script = captureDialogue(() => fixture.playRiceThiefDialogue());
    const wrongOpt = script.steps[1].options.find(o => o.text.includes('后山草窝'));
    const backScript = captureDialogue(() => wrongOpt.action());
    assert(backScript.steps.some(s => s.text.includes('兔')) && sq.step === 'accepted' && !fixture.battleCount,
      'P4.1a: 错误追查只有趣味探查文案，可回头且无任何损失');

    // 4. 正确追查 (东墙根草垛)：短遭遇 2 只硕鼠且可招降
    script = captureDialogue(() => fixture.playRiceThiefDialogue());
    const rightOpt = script.steps[1].options.find(o => o.text.includes('东墙根草垛'));
    rightOpt.action();
    assert(fixture.battleCount === 1 && sq.step === 'reward_ready',
      'P4.1a: 正确追查触发一场短遭遇，战胜后进入待领奖');
    assert(fixture.lastBattleEnemies.length === 2 &&
      fixture.lastBattleEnemies.every(e => e.templateId === 'shuo_shu'),
      'P4.1a: 遭遇为 2 只偷粮硕鼠 (复用普通物种，可招降可记山海见闻)');

    // 5. 满包重试：领奖失败保留 reward_ready
    const fullBag = Array.from({ length: 36 }, (_, i) => ({ instanceId: 'fill_' + i, itemId: 'jinchuang_yao', count: 99 }));
    fixture.inventory = new window.Inventory(fullBag);
    fixture.inventory.maxSlots = 36;
    const silverBefore = fixture.playerData.silver;
    let fullBagMsg = null;
    const origShow = window.showGameMessage;
    window.showGameMessage = (msg) => { fullBagMsg = msg; };
    try {
      fixture.claimRiceThiefReward();
    } finally { window.showGameMessage = origShow; }
    assert(sq.step === 'reward_ready' && fixture.playerData.silver === silverBefore && fullBagMsg.includes('行囊'),
      'P4.1a: 满包领奖安全拦截，保留待领状态可重试');

    // 6. 腾格后领取成功且不可重复
    fixture.inventory.slots.splice(0, 2);
    const silverMid = fixture.playerData.silver;
    const expMid = fixture.playerData.exp;
    fixture.claimRiceThiefReward();
    assert(sq.step === 'done' && fixture.playerData.silver === silverMid + 600 &&
      fixture.inventory.getItemCount('jinchuang_yao') >= 2,
      'P4.1a: 腾出空位后一次领全谢礼 (金创药×2 + 600 银两)');
    const afterClaim = { silver: fixture.playerData.silver, slots: JSON.stringify(fixture.inventory.slots) };
    fixture.claimRiceThiefReward();
    assert(fixture.playerData.silver === afterClaim.silver && JSON.stringify(fixture.inventory.slots) === afterClaim.slots,
      'P4.1a: 重复点击领奖绝不重复发放');

    // 7. 完成后回访转为轻松短对白
    script = captureDialogue(() => fixture.playRiceThiefDialogue());
    assert(script.steps.length === 1 && script.steps[0].text.includes('米汤'),
      'P4.1a: 完成后王大婶回访只剩轻松短对白');
  }

  // =========================================================================
  // P4.1b: 长安「写错的招牌」两选一同奖与回访保留
  // =========================================================================
  {
    const makeSignFixture = () => {
      const fixture = Object.create(app);
      fixture.playerData = new window.Player({ level: 16 });
      fixture.playerData.storyEvents = {};
      fixture.inventory = new window.Inventory();
      fixture.storyPhase = 'changan_arrived';
      fixture.currentMapId = 'changan_city';
      fixture.companions = [];
      fixture.npcs = [];
      fixture.updatePlayerHud = () => { };
      fixture.saveAutoProgress = () => ({ success: true });
      fixture.refreshMapNpcs = () => { };
      return fixture;
    };

    for (const style of ['plain', 'witty']) {
      const fixture = makeSignFixture();
      let script = captureDialogue(() => fixture.playSignBoardDialogue());
      assert(script.steps[0].text.includes('天下第一饼') && script.steps[0].text.includes('一饼得道成仙'),
        `P4.1b(${style}): 老孙吐槽夸口招牌的开场文案完整`);
      const opt = script.steps[1].options.find(o =>
        style === 'plain' ? o.text.includes('现烤现卖') : o.text.includes('凌霄殿'));
      const otherOpt = script.steps[1].options.find(o =>
        style === 'plain' ? o.text.includes('凌霄殿') : o.text.includes('现烤现卖'));
      assert(!!opt && !!otherOpt && !!script.steps[1].options.find(o => o.text.includes('再想想')),
        `P4.1b(${style}): 提供朴实与俏皮两种题字及退出出口`);

      const silverBefore = fixture.playerData.silver;
      opt.action();
      assert(fixture.playerData.storyEvents.changan_sign_task === 'done' &&
        fixture.playerData.storyEvents.changan_sign_style === style &&
        fixture.playerData.silver === silverBefore + 500,
        `P4.1b(${style}): 选择【${style === 'plain' ? '朴实' : '俏皮'}】完成题字并领取等额谢礼 500 银两`);

      // 回访对白保留所选招牌文案
      script = captureDialogue(() => fixture.playSignBoardDialogue());
      const expectText = style === 'plain' ? '现烤现卖' : '凌霄殿';
      assert(script.steps.length === 1 && script.steps[0].text.includes(expectText),
        `P4.1b(${style}): 回访对白展示所选【${expectText}】招牌文案`);

      // 重复选择不重发奖励
      const silverAfter = fixture.playerData.silver;
      fixture.chooseSignBoardStyle(style === 'plain' ? 'witty' : 'plain');
      assert(fixture.playerData.silver === silverAfter &&
        fixture.playerData.storyEvents.changan_sign_style === style,
        `P4.1b(${style}): 已领谢礼后重复题字不重发奖励、不悄悄改文案`);
    }
  }

  // =========================================================================
  // P4: 两位新 NPC 的地图可见性、可达性与支线感叹号
  // =========================================================================
  {
    const liuMap = window.GAME_DATA.MAPS_2D.liujiacun;
    const changanMap = window.GAME_DATA.MAPS_2D.changan_city;
    const dashen = (liuMap.npcs || []).find(n => n.id === 'npc_liujiacun_dashen');
    const bingtan = (changanMap.npcs || []).find(n => n.id === 'npc_changan_bingtan');
    assert(!!dashen && dashen.name === '王大婶', 'P4: 刘家村新增王大婶 NPC 定义');
    assert(!!bingtan && bingtan.name === '老孙', 'P4: 长安城新增胡饼摊主老孙 NPC 定义');
    assert(!dashen.dialogueKey && !bingtan.dialogueKey, 'P4: 两位动态分发 NPC 不声明静态对白键 (由 id 派发)');

    // 可见性: 常规生活 NPC 始终驻扎
    assert(app.isNpcVisibleInStoryPhase('npc_liujiacun_dashen', 'liujiacun_start', 'liujiacun') === true,
      'P4: 王大婶在刘家村常规可见');
    assert(app.isNpcVisibleInStoryPhase('npc_changan_bingtan', 'changan_arrived', 'changan_city') === true,
      'P4: 老孙在长安城常规可见');

    // 洪水填充可达性 (从出生点到 NPC 必须连通)
    const floodReach = (mapData, fromX, fromY, toX, toY) => {
      const key = (x, y) => y * 100000 + x;
      const seen = new Set([key(fromX, fromY)]);
      const q = [[fromX, fromY]];
      while (q.length) {
        const [x, y] = q.shift();
        if (Math.abs(x - toX) < 16 && Math.abs(y - toY) < 16) return true;
        for (const [dx, dy] of [[32, 0], [-32, 0], [0, 32], [0, -32]]) {
          const nx = x + dx, ny = y + dy;
          if (seen.has(key(nx, ny))) continue;
          if (!app.tilemap.isWalkable(mapData, Math.floor(nx / 32), Math.floor(ny / 32))) continue;
          seen.add(key(nx, ny));
          q.push([nx, ny]);
        }
      }
      return false;
    };
    assert(floodReach(liuMap, liuMap.playerSpawn.x, liuMap.playerSpawn.y, dashen.x, dashen.y),
      'P4: 王大婶位置从刘家村出生点洪水填充可达');
    assert(floodReach(changanMap, changanMap.playerSpawn.x, changanMap.playerSpawn.y, bingtan.x, bingtan.y),
      'P4: 老孙位置从长安出生点洪水填充可达');

    // 支线感叹号: 未完成时翠绿 side，完成后消失；绝不占用唯一金色主线感叹号
    const origMap = app.currentMapId;
    const origPhase = app.storyPhase;
    const origNpcs = app.npcs;
    try {
      app.playerData = new window.Player({ level: 12 });
      app.playerData.sideQuests = {};
      app.storyPhase = 'liujiacun_start';
      app.interactedNpcSet = new Set();
      app.loadMap('liujiacun');
      let dashenNpc = app.npcs.find(n => n.id === 'npc_liujiacun_dashen');
      let boqinNpc = app.npcs.find(n => n.id === 'npc_liuboqin');
      assert(dashenNpc && dashenNpc.questStatus === 'side',
        'P4: 王大婶未完成支线时悬挂翠绿支线感叹号');
      assert(boqinNpc && boqinNpc.questStatus === 'available',
        'P4: 唯一金色主线感叹号仍归刘伯钦，支线不占用主线标识');

      app.playerData.sideQuests.sq_rice_thief = { id: 'sq_rice_thief', step: 'done', cluesRead: { marks: true, trail: true } };
      app.refreshMapNpcs();
      dashenNpc = app.npcs.find(n => n.id === 'npc_liujiacun_dashen');
      assert(dashenNpc && !dashenNpc.questStatus,
        'P4: 谁偷了米完成后王大婶头顶感叹号彻底消失');
    } finally {
      app.currentMapId = origMap;
      app.storyPhase = origPhase;
      app.npcs = origNpcs;
    }
  }

  // =========================================================================
  // H5 适配与视觉升级：画卷开幕结构、低动态联动、远景氛围层
  // =========================================================================
  {
    // 1. 章节开幕为画卷展开结构，且尊重低动态设置
    localStorage.setItem('xiyou_reduced_motion', '1');
    app.showChapterOpening('prologue');
    let openingEl = document.getElementById('chapter-opening-overlay');
    assert(!!openingEl, '视觉: 章回开幕遮罩正常创建');
    assert(openingEl.innerHTML.includes('chapter-scroll-stage') &&
      openingEl.innerHTML.includes('chapter-scroll-roller') &&
      openingEl.innerHTML.includes('chapter-scroll-art'),
      '视觉: 章回开幕采用画卷展开结构 (木轴 + 山海画心)');
    assert((openingEl.classList && openingEl.classList.contains && openingEl.classList.contains('reduced-motion')) ||
      (openingEl.className || '').includes('reduced-motion'),
      '视觉: 低动态模式下开幕跳过舒卷动画直接呈现');
    if (openingEl.remove) openingEl.remove();
    localStorage.removeItem('xiyou_reduced_motion');

    app.showChapterOpening('prologue');
    openingEl = document.getElementById('chapter-opening-overlay');
    assert(!(openingEl.classList && openingEl.classList.contains && openingEl.classList.contains('reduced-motion')) &&
      !(openingEl.className || '').includes('reduced-motion'),
      '视觉: 默认模式正常播放画卷舒卷动画');
    if (openingEl.remove) openingEl.remove();

    // 2. 远景氛围层：常规地图绘制天色与远山，洞窟/水下场景不叠加
    const skyCalls = { gradients: 0, fills: 0 };
    const mockCtx = {
      fillStyle: null,
      createLinearGradient: () => { skyCalls.gradients++; return { addColorStop: () => { } }; },
      fillRect: () => { skyCalls.fills++; },
      beginPath: () => { }, moveTo: () => { }, lineTo: () => { }, closePath: () => { },
      fill: () => { skyCalls.fills++; },
      ellipse: () => { }
    };
    const skyApp = Object.assign(Object.create(Object.getPrototypeOf(app)), app, {
      ctx: mockCtx,
      canvas: { width: 760, height: 580 },
      currentMapId: 'liujiacun',
      camera: app.camera || { x: 0, y: 0 }
    });
    skyApp.renderSkyAmbience();
    assert(skyCalls.gradients >= 1 && skyCalls.fills >= 3,
      `视觉: 刘家村远景氛围层绘制天色渐变与远山流云 (渐变${skyCalls.gradients}/填充${skyCalls.fills})`);

    skyCalls.gradients = 0;
    skyCalls.fills = 0;
    skyApp.currentMapId = 'baigudong';
    skyApp.renderSkyAmbience();
    assert(skyCalls.gradients === 0 && skyCalls.fills === 0,
      '视觉: 白骨洞等封闭洞窟不叠加天色氛围，保持原有洞内光照');

    // 3. H5 适配关键样式与视口声明存在
    const cssText = require('fs').readFileSync(require('path').join(__dirname, 'css/style.css'), 'utf8');
    assert(cssText.includes('touch-action: manipulation') && cssText.includes('overscroll-behavior: none'),
      'H5: 全局触摸零延迟与下拉刷新防护样式就位');
    assert(cssText.includes('safe-area-inset') && cssText.includes('100dvh'),
      'H5: 刘海屏安全区与动态视口高度适配就位');
    const htmlText = require('fs').readFileSync(require('path').join(__dirname, 'index.html'), 'utf8');
    assert(htmlText.includes('viewport-fit=cover') && htmlText.includes('mobile-web-app-capable'),
      'H5: 视口声明含 viewport-fit=cover 与全屏 WebApp 元信息');
    const appJsText = require('fs').readFileSync(require('path').join(__dirname, 'js/app2d.js'), 'utf8');
    assert(appJsText.includes("touchmove") && appJsText.includes("contextmenu"),
      'H5: 画布屏蔽长按菜单与触摸滚动干扰');
  }
};
