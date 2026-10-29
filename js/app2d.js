/**
 * 汉风西游 - 2D自由探索与正统西游主线调度引擎 (App2D 2.0)
 * 全面整合：
 * 1. 彻底修复对话选项全屏遮挡卡死Bug
 * 2. 彻底抛弃 Emoji，全场景与战斗采用 Portraits 国风高精立绘
 * 3. 默认 760×480 宽屏神话沉浸画卷，隐藏实体按键
 * 4. 左上角雷达小地图系统 (MiniMap) 与主线金色感叹号指引
 * 5. 场景鼠标点击 A* 避障自动寻路与智能交互 (点击空地走过去并播放金色光圈，点击NPC寻路至身旁并自动对话)
 * 6. 天庭御马监坐骑培养与蟠桃胜境吃桃升级
 */

/**
 * ============================================================================
 * 🎮 游戏全局移动速度数值配置 (GAME_SPEED_CONFIG)
 * ----------------------------------------------------------------------------
 * 集中管理玩家与野怪的基础移动速度，可直接在此处修改数值快速调控游戏节奏：
 * - PLAYER_MORTAL_SPEED: 凡尘主角基础移速 (默认: 3.8)
 * - PLAYER_HEAVEN_SPEED: 序章天界金甲大将军基础移速 (默认: 4.2)
 * - WATER_SPEED_MULTIPLIER: 水下场景 (水晶宫/龙宫/东海之滨) 辟水神诀推力倍率 (默认: 1.15，即 +15%)
 * - DEFAULT_MONSTER_SPEED: 绝大多数常规野怪巡逻漫步移速 (默认: 1.12)
 * ============================================================================
 */
const GAME_SPEED_CONFIG = {
  PLAYER_MORTAL_SPEED: 2.0,      // 凡尘主角基础移速 (直接在此修改生效)
  PLAYER_HEAVEN_SPEED: 2.6,      // 序章天界金甲大将军基础移速 (直接在此修改生效)
  WATER_SPEED_MULTIPLIER: 1.15,  // 东海/龙宫水底辟水神诀推力加成倍率 (直接在此修改生效)
  DEFAULT_MONSTER_SPEED: 1.12    // 绝大多数常规野怪巡逻漫步移速 (直接在此修改生效)
};

if (typeof window !== 'undefined') {
  window.GAME_SPEED_CONFIG = GAME_SPEED_CONFIG;
  window.GAME_DATA = window.GAME_DATA || {};
  window.GAME_DATA.SPEED_CONFIG = GAME_SPEED_CONFIG;
}

/**
 * ============================================================================
 * 📜 大世界任务悬浮动态文字与提示配置 (QUEST_BANNER_CONFIG)
 * ----------------------------------------------------------------------------
 * 统一入口：可在此直接修改大世界【主线】任务悬浮文字大小、弹跳速度与弹跳范围：
 * - FONT_SIZE: 任务描述文字大小 (单位: px，默认: 10)
 * - BOUNCE_SPEED: 弹跳速度/频率倍率 (数值越大跳跃越频繁，默认: 4)
 * - BOUNCE_RANGE: 弹跳范围/幅度 (单位: px，数值越大起伏越大，默认: 4)
 * - EXCLAMATION_SIZE: 任务感叹号【！】大小 (单位: px，默认: 18)
 * - OFFSET_Y: 距离目标头顶基准悬浮高度 (单位: px，默认: 72)
 *
 * 场景内NPC与采集物交互气泡 (如 💬空格交谈 / 🍄空格采摘)：
 * - BUBBLE_FONT_SIZE: 交互气泡文字大小 (单位: px，默认: 11)
 * - BUBBLE_BOUNCE_SPEED: 交互气泡弹跳周期 (单位: ms，越小跳得越快，默认: 180)
 * - BUBBLE_BOUNCE_RANGE: 交互气泡弹跳范围 (单位: px，默认: 2.5)
 * - BUBBLE_OFFSET_Y: 交互气泡向上偏移高度 (单位: px，默认: 22，置于顶层绝不遮挡)
 *
 * 角色/NPC/野怪头顶名称与头衔称号 (字号统一在此配置与修改)：
 * - NAME_FONT_SIZE: 玩家、NPC、野怪头顶名称字号 (单位: px，默认: 12)
 * - TITLE_FONT_SIZE: 专属头衔称号字号 (如【镇山太保】，单位: px，默认: 11)
 * ============================================================================
 */
const QUEST_BANNER_CONFIG = {
  // 1. 【主线】大世界任务悬浮卷轴 (如：【主线】向刘伯钦交付新鲜青蘑菇下锅)
  FONT_SIZE: 12,             // 任务描述文字大小 (px，可直接修改)
  BOUNCE_SPEED: 2,           // 弹跳速度/频率倍率 (加速1倍，原1->2，越大跳得越快)
  BOUNCE_RANGE: 4,           // 弹跳范围/起伏幅度 (px，可直接修改，越大起伏越大)
  EXCLAMATION_SIZE: 22,      // 任务感叹号【！】基准配置字号 (px，默认22)
  OFFSET_Y: 72,              // 悬浮距离目标垂直基准高度 (px，可直接修改)

  // 2. 角色/NPC/野怪头顶名称与头衔称号 (统一在此处配置与修改字号，+1px)
  NAME_FONT_SIZE: 13,        // 玩家、NPC、野怪头顶名称字号 (px，默认: 13，字号大1px)
  TITLE_FONT_SIZE: 12,       // 专属头衔称号字号 (如【镇山太保】，px，默认: 12，字号大1px)

  // 3. 场景NPC与物品交互提示气泡 (如：💬 空格交谈 / 🍄 空格采摘)
  BUBBLE_FONT_SIZE: 11,      // 交互气泡文字大小 (px，可直接修改)
  BUBBLE_BOUNCE_SPEED: 90,   // 交互气泡弹跳速度周期 (ms，加速1倍，原180->90跳动更灵动)
  BUBBLE_BOUNCE_RANGE: 2.5,  // 交互气泡弹跳范围 (px，数值越大起伏越大)
  BUBBLE_OFFSET_Y: 22        // 交互气泡垂直向上偏移量 (置于顶层，彻底杜绝遮挡)
};

if (typeof window !== 'undefined') {
  window.QUEST_BANNER_CONFIG = QUEST_BANNER_CONFIG;
  window.GAME_DATA = window.GAME_DATA || {};
  window.GAME_DATA.QUEST_BANNER_CONFIG = QUEST_BANNER_CONFIG;
}

class GameApp2D {
  getUnitVisualId(unit = {}) {
    if (unit.isPlayer) return this.playerChar?.appearance || this.playerData?.appearance || 'martial_hero';
    return window.VisualIdentity?.resolveUnit(unit) ||
      (window.Character ? window.Character.inferMonsterType(unit.name, unit.id) : 'martial_hero');
  }
  getNpcPortraitRoleId(npc = {}) {
    if (window.NpcArt?.ids.has(npc.appearance)) return npc.appearance;
    return window.Dialogue?.inferRoleId(npc.name, npc.title) || 'shaoxia';
  }

  hasCompletedWuzhuang(phase = this.storyPhase) {
    return ['wuzhuang_cleared', 'baihu_first_cleared', 'baihu_second_cleared', 'baihu_cleared',
      'baoxiang_seek_princess', 'baoxiang_boss_ready', 'baoxiang_cleared',
      'pingding_scout_cleared', 'pingding_silver_cleared', 'pingding_gold_cleared', 'pingding_cleared',
      'huoyun_cleared', 'poer_cleared', 'chedi_cleared', 'tongtian_cleared', 'huoyan_cleared',
      'pansi_cleared', 'shituo_cleared', 'journey_completed'].includes(phase);
  }

  getWuzhuangTreeState() {
    if (this.playerData?.storyEvents?.wuzhuang_tree_restored || this.hasCompletedWuzhuang()) return 'restored';
    return this.storyPhase === 'liusha_cleared' ? 'fallen' : 'healthy';
  }
  constructor() {
    this.canvas = null;
    this.ctx = null;

    this.tilemap = new window.TilemapEngine(32);
    this.camera = new window.Camera(760, 580);
    this.pathfinding = new window.PathfindingEngine(32);
    this.minimap = window.MiniMapEngine;

    // 主线进度: 'heaven_prologue' | 'liujiacun_start' | 'liujiacun_hunted' | 'changan_met_monk' | 'wuxingshan_ready' | 'wuxing_freed'
    this.storyPhase = 'heaven_prologue';
    this.isSealTriggered = false;
    this.isSealTriggering = false;

    this.currentMapId = 'tiangong_palace';
    this.playerData = (typeof window !== 'undefined' && window.Player) ? new window.Player({
      name: '威灵大将',
      classId: 'jingang',
      gender: 'male',
      level: 50,
      silver: 15000,
      appearance: 'heaven_general'
    }) : null;
    this.speedConfig = GAME_SPEED_CONFIG;
    this.playerChar = (typeof window !== 'undefined' && window.Character) ? new window.Character({
      id: 'player',
      name: '威灵大将',
      type: 'player',
      appearance: 'heaven_general',
      speed: GAME_SPEED_CONFIG.PLAYER_HEAVEN_SPEED
    }) : null;
    this.inventory = null;

    // 坐骑与蟠桃系统
    this.mountSystem = new window.MountSystem();
    this.peachGarden = new window.PeachGarden();

    // 实体与同伴
    this.npcs = [];
    this.monsters = [];
    this.companions = [];

    // 粒子系统
    this.particleSystem = new window.ParticleSystem();

    // 仙宠系统 (随行仙宠与出战队伍)
    this.pets = [];
    this.activeCombatPets = [];

    // 自动寻路与点击特效
    this.autoMovePath = [];
    this.autoMoveTargetCallback = null;
    this.clickRipples = [];
    this.isTransitioning = false;

    // 钟馗日常抓鬼任务
    this.ghostQuest = {
      active: false,
      completed: false,
      mapId: null,
      mapName: '',
      targetName: '',
      level: 15,
      hp: 1200,
      atk: 90,
      def: 40,
      spd: 32
    };

    // 大唐镖局运镖押送任务
    this.escortQuest = null;

    // 仙宠洗炼暂存对比
    this.tempWashResult = null;

    // 已交互/已点击 NPC 记录集合 (点击后永久消除头顶感叹号)
    this.interactedNpcSet = new Set();
    this.collectedProps = new Set();

    // 收集与击杀任务计数器 (蘑菇、枯树精、硕鼠)
    this.questKills = { mushrooms: 0, trees: 0, rats: 0 };

    // 输入与循环状态
    this.keysDown = {};
    this.isPaused = false;
    this.currentBattle = null;

    // 战斗界面全新交互状态 (轻量化、中央竖直指令与选目标直决)
    this.activeSelectedAllyId = null; // 当前正在下达指令的友方
    this.isSelectingTarget = false; // 是否处于待选目标状态
    this.pendingAction = null; // 暂存动作
    this.combatSubMenu = null; // null | 'skills' | 'items'
    this.isAnimatingCombat = false; // 是否正在播放打斗位移动画
    this.battleTargetMenuOpen = false; // 是否处于单体绝技目标选择面板状态
    this.pendingSkillAction = null; // 暂存待施展的技能信息

    // 全局防呆拦截：彻底禁用原生 alert 与 confirm，杜绝浏览器丑陋弹窗，统一国风主题
    window.alert = (msg) => {
      if (window.showGameMessage) {
        window.showGameMessage(String(msg), 'info', 3000);
      } else {
        console.log('ALERT INTERCEPTED:', msg);
      }
    };
    window.confirm = (msg) => {
      console.warn('原生 confirm 遭到拦截，请调用 App2D.showConfirmModal:', msg);
      return false;
    };
  }

  // 初始化入口
  init() {
    this.canvas = document.getElementById('game-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // 默认设置为大屏高清画质
    this.canvas.width = 760;
    this.canvas.height = 580;
    this.camera.viewportWidth = 760;
    this.camera.viewportHeight = 580;

    // 依据真实容器与设备像素比同步画布尺寸，杜绝点击偏移
    this.syncCanvasSize();

    // 初始化已播放章节记录
    this.initShownChapterSet();

    // 1. 初始化玩家数据 (序章：九重天阙威灵大将军开局，威灵大将作为50级神将配备3级技能)
    this.playerData = new window.Player({
      name: '威灵大将',
      classId: 'jingang',
      gender: 'male',
      level: 50,
      silver: 15000,
      appearance: 'heaven_general',
      skills: [
        { id: 'sk_jg_foguang', name: '佛光普照', genderReq: 'male', level: 3, mastery: 3000, maxLevel: 5, icon: '✨', desc: '男金刚专属单体玄击！造成【伤害基数 + 敌方当前生命百分比】伤害，并扣除【敌方当前法力百分比】！' },
        { id: 'sk_jg_shesheng', name: '舍生取义', genderReq: 'all', level: 3, mastery: 3000, maxLevel: 5, icon: '⚔️', desc: '金刚核心神技！以自身气血反噬换取绝杀技能伤害！' },
        { id: 'sk_jg_huti', name: '金刚护体', genderReq: 'all', level: 3, mastery: 3000, maxLevel: 5, icon: '🛡️', desc: '召唤罗汉金身护持队友，同时大幅提升物理防御与法术抗性！' }
      ]
    });

    this.inventory = new window.Inventory([
      // 装备
      { instanceId: 'it_tian1', itemId: 'eq_wp_bawangqiang', count: 1, equipData: { star: 5, sockets: ['gem_hongmanao', null, null] } },
      { instanceId: 'it_tian2', itemId: 'eq_am_huangjin', count: 1, equipData: { star: 5, sockets: ['gem_jingang', null, null] } },
      { instanceId: 'it_eq3', itemId: 'eq_hd_zijin', count: 1, equipData: { star: 3, sockets: [null, null, null] } },
      { instanceId: 'it_eq4', itemId: 'eq_bt_zhuifeng', count: 1, equipData: { star: 3, sockets: [null, null, null] } },
      // 药品
      { instanceId: 'it_tian3', itemId: 'jinchuang_yao', count: 20 },
      { instanceId: 'it_tian3_2', itemId: 'dahuan_dan', count: 5 },
      { instanceId: 'it_tian3_3', itemId: 'jiuzhuan_dan', count: 2 },
      { instanceId: 'it_tian3_4', itemId: 'foshou', count: 15 },
      // 宝石 (可镶嵌于装备，最多3孔)
      { instanceId: 'it_gem1', itemId: 'gem_jingang', count: 2 },
      { instanceId: 'it_gem2', itemId: 'gem_sheli', count: 1 },
      { instanceId: 'it_gem3', itemId: 'gem_pilei', count: 2 },
      { instanceId: 'it_gem4', itemId: 'gem_hongmanao', count: 2 },
      { instanceId: 'it_gem5', itemId: 'gem_guangmang', count: 2 },
      // 杂物与法宝 (用于野怪招降、仙宠洗炼、装备精炼等)
      { instanceId: 'it_jll1', itemId: 'jin_liu_lu', count: 6 },
      { instanceId: 'it_tie1', itemId: 'meteor_iron', count: 10 },
      { instanceId: 'it_misc1', itemId: 'silver_gourd', count: 3 },
      { instanceId: 'it_misc2', itemId: 'gold_gourd', count: 1 },
      { instanceId: 'it_tian4', itemId: 'qianghua_shi', count: 15 }
    ]);

    // 穿戴初始神兵与铠甲 (带孔位)
    this.playerData.equipItem('weapon', { itemId: 'eq_wp_bawangqiang', star: 5, sockets: ['gem_hongmanao', null, null] });
    this.playerData.equipItem('armor', { itemId: 'eq_am_huangjin', star: 5, sockets: ['gem_jingang', null, null] });

    // 初始仙宠系列 (包含金仙、散仙、普通三大品质)
    const pet1 = window.PetSystem.createPet('qitian_dasheng', false, 50);
    if (pet1) {
      pet1.skills = [{ id: 'sk_jg_shesheng', name: '舍生取义', classId: 'jingang', className: '金刚', icon: '⚔️', desc: '单体伤害巨大，自身消耗15%气血', level: 5, proficiency: 300 }];
      pet1.classId = 'jingang';
      pet1.className = '金刚';
      window.PetSystem.recalculatePet(pet1, true);
    }
    const pet2 = window.PetSystem.createPet('baihua_she', false, 15);
    if (pet2) {
      pet2.skills = [{ id: 'sk_ym_leiting', name: '雷霆万钧', classId: 'yaomo', className: '妖魔', icon: '⚡', desc: '单体九天神雷狂轰，伤害极高', level: 3, proficiency: 200 }];
      pet2.classId = 'yaomo';
      pet2.className = '妖魔';
      window.PetSystem.recalculatePet(pet2, true);
    }
    const pet3 = window.PetSystem.createPet('dahai_gui', false, 5); // 普通仙宠无技能

    this.pets = [pet1, pet2, pet3].filter(Boolean);
    this.activeCombatPets = [pet1, pet2].filter(Boolean); // 初始出战2只

    // 初始获得御马监龙马坐骑 (按R键随时自由骑乘或下马)
    this.mountSystem.addMount('xuelong_ma', '威灵踏雪龙马');
    this.mountSystem.isRiding = false;
    this.playerData.recalculateStats(false);

    // 2. 玩家 2D 实体 (天界金甲威灵大将)
    this.playerChar = new window.Character({
      id: 'player',
      name: this.playerData.name,
      type: 'player',
      appearance: 'heaven_general',
      speed: GAME_SPEED_CONFIG.PLAYER_HEAVEN_SPEED
    });

    const urlParams = new URLSearchParams(window.location.search);
    const hasExplicitParam = urlParams.get('map') || urlParams.get('combat') || urlParams.get('dialogue') || urlParams.get('modal');

    let loadedSave = false;
    let hasSave = false;
    try {
      hasSave = Boolean(window.SaveManager && window.SaveManager.hasAutoSave());
    } catch (e) {
      console.warn('检查自动存档异常:', e);
    }

    if (!hasExplicitParam && hasSave) {
      loadedSave = this.loadAutoSavedProgress();
      if (!loadedSave && window.SaveManager?.getCorruptedBackup?.()) {
        this.isSaveCorrupted = true;
        window.showGameMessage('⚠️ 检测到本地历练存档受损，已保留灾备副本，当前处于未保存临时状态。', 'warning', 6000);
      }
    }

    if (!loadedSave) {
      const initMap = urlParams.get('map') || 'tiangong_palace';
      this.loadMap(initMap);
      if (urlParams.get('px') && this.playerChar) {
        this.playerChar.x = parseInt(urlParams.get('px'));
        this.playerChar.y = parseInt(urlParams.get('py'));
        if (this.camera) {
          const map = window.GAME_DATA.MAPS_2D[this.currentMapId];
          this.camera.follow(
            this.playerChar.x,
            this.playerChar.y,
            map.width * this.tilemap.tileSize,
            map.height * this.tilemap.tileSize
          );
        }
      }
    }

    this.bindInputs();

    // 绑定离开页面、切后台、隐藏标签页多维即时自动保存与心跳静默保存
    window.addEventListener('beforeunload', () => this.saveAutoProgress());
    window.addEventListener('pagehide', () => this.saveAutoProgress());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.saveAutoProgress();
      }
    });
    // 心跳自动保存留存句柄，便于轮回重开时彻底清理，避免叠加多套定时器
    this._autoSaveTimer = setInterval(() => {
      if (this._saveDirty) {
        this._saveDirty = false;
        this.saveAutoProgress();
      }
    }, 15000);

    // 启动 60FPS 渲染主循环
    requestAnimationFrame((t) => this.gameLoop(t));

    // 支持通过 URL 快速体验任意篇章剧情或 Boss 战
    const testDialogue = urlParams.get('dialogue');
    const testCombat = urlParams.get('combat');
    const testModal = urlParams.get('modal');

    if (testModal === 'class') {
      setTimeout(() => {
        this.openClassSelectModal();
      }, 50);
    } else if (testModal === 'inventory') {
      setTimeout(() => {
        this.openInventoryModal();
      }, 50);
    } else if (testModal === 'pets') {
      setTimeout(() => {
        this.openPetManageModal();
      }, 50);
    } else if (testModal === 'forge') {
      setTimeout(() => {
        this.openForgeModal('weapon');
      }, 50);
    } else if (testModal === 'wash') {
      setTimeout(() => {
        if (!this.pets || this.pets.length === 0) {
          const pet = window.PetSystem.createPet('heixiong_jing', false, 15);
          this.pets.push(pet);
        }
        this.tempWashResult = window.PetSystem.generateWashResult(this.pets[0]);
        this.openPetWashModal(this.pets[0].instanceId);
      }, 50);
    } else if (testModal === 'quest') {
      setTimeout(() => {
        this.acceptZhongkuiGhostQuest();
        this.openQuestTrackerModal();
      }, 50);
    } else if (testModal === 'book') {
      setTimeout(() => {
        if (!this.pets || this.pets.length === 0) {
          const pet = window.PetSystem.createPet('gudai_ruishou', false, 25);
          this.pets.push(pet);
        }
        if (!this.pets[0].passives || this.pets[0].passives.length === 0) {
          window.PetSystem.learnPetSkillBook(this.pets[0], 'book_high_sneak');
        }
        if (this.inventory) {
          this.inventory.addItem('book_high_critical', 1);
          this.inventory.addItem('book_high_vampire', 1);
          this.inventory.addItem('book_high_rebirth', 1);
          this.inventory.addItem('book_high_speed', 1);
        }
        this.openPetBookModal(this.pets[0].instanceId);
      }, 50);
    } else if (testModal === 'escort') {
      setTimeout(() => {
        this.playerData.silver += 5000;
        this.acceptEscortQuest();
        this.openQuestTrackerModal();
      }, 50);
    } else if (testModal === 'baihu') {
      setTimeout(() => {
        this.loadMap('baihuling', { x: 13 * 32, y: 10 * 32 });
      }, 50);
    } else if (testModal === 'pick_peach') {
      setTimeout(() => {
        this.loadMap('tiangong_pantao', { x: 6 * 32, y: 7 * 32 });
        const mapData = window.GAME_DATA.MAPS_2D['tiangong_pantao'];
        if (mapData && mapData.peachTrees && mapData.peachTrees[0]) {
          this.confirmPickPeach(mapData.peachTrees[0]);
        }
      }, 80);
    } else if (testModal === 'dragon_shop') {
      setTimeout(() => {
        this.openDragonShopModal();
      }, 50);
    } else if (testCombat === 'donghai') {
      setTimeout(() => {
        this.triggerDonghaiTrialBattle();
      }, 50);
    } else if (testCombat === 'wild') {
      setTimeout(() => {
        if (!this.playerChar) {
          this.playerChar = { appearance: 'heaven_general' };
        }
        if (!this.activeCombatPets || this.activeCombatPets.length === 0) {
          const pet = window.PetSystem.createPet('gudai_ruishou', false, 35);
          if (pet) {
            pet.name = '齐天神灵兽';
            this.pets.push(pet);
            this.activeCombatPets = [pet];
          }
        }
        const mob1 = { id: 'mob_sanxian_2', name: '通臂灵猿', level: 25, spd: 45, hp: 1500, maxHp: 1500, quality: 'sanxian', isBoss: false };
        const mob2 = { id: 'mob_wild_1', name: '巡山野猪怪', level: 20, spd: 38, hp: 900, maxHp: 900, quality: 'ordinary', isBoss: false };
        this.start2DBattle([mob1, mob2], () => { });
      }, 50);
    } else if (testCombat === 'features') {
      setTimeout(() => {
        if (!this.playerChar) {
          this.playerChar = { appearance: 'heaven_general' };
        }
        if (!this.activeCombatPets || this.activeCombatPets.length === 0) {
          const pet = window.PetSystem.createPet('gudai_ruishou', false, 35);
          if (pet) {
            pet.name = '九尾仙狐';
            this.pets.push(pet);
            this.activeCombatPets = [pet];
          }
        }
        const mob1 = { id: 'mob_clam_1', name: '灵河巨蚌', level: 22, spd: 35, hp: 1200, maxHp: 1200, quality: 'ordinary', isBoss: false };
        const mob2 = { id: 'mob_shrimp_1', name: '巡海虾兵', level: 25, spd: 55, hp: 1400, maxHp: 1400, quality: 'ordinary', isBoss: false };
        const mob3 = { id: 'mob_snake_1', name: '盘石玄蛇', level: 24, spd: 60, hp: 1100, maxHp: 1100, quality: 'sanxian', isBoss: false };
        this.start2DBattle([mob1, mob2, mob3], () => { });
      }, 50);
    } else if (testCombat === 'ready') {
      setTimeout(() => {
        if (!this.playerChar) this.playerChar = { appearance: 'heaven_general' };
        if (!this.activeCombatPets || this.activeCombatPets.length === 0) {
          const pet = window.PetSystem.createPet('gudai_ruishou', false, 35);
          if (pet) {
            pet.name = '九尾仙狐';
            this.pets.push(pet);
            this.activeCombatPets = [pet];
          }
        }
        const mob1 = { id: 'mob_clam_1', name: '灵河巨蚌', level: 22, spd: 35, hp: 1200, maxHp: 1200, quality: 'ordinary', isBoss: false };
        const mob2 = { id: 'mob_shrimp_1', name: '巡海虾兵', level: 25, spd: 55, hp: 1400, maxHp: 1400, quality: 'ordinary', isBoss: false };
        this.start2DBattle([mob1, mob2], () => { });
        setTimeout(() => {
          if (this.currentBattle && this.currentBattle.allies && this.currentBattle.allies[0]) {
            this.confirmCurrentAllyAction(this.currentBattle.allies[0].id, { type: 'attack', target: 0 });
          }
        }, 200);
      }, 50);
    } else if (testCombat === 'v_menu') {
      setTimeout(() => {
        if (!this.playerChar) this.playerChar = { appearance: 'heaven_general' };
        this.pets = [
          { instanceId: 'p1', name: '齐天灵猴', type: 'sun_wukong', level: 35, hp: 2200, maxHp: 2200, mp: 600, maxMp: 600, spd: 58, passives: [] },
          { instanceId: 'p2', name: '九尾仙狐', type: 'fox_spirit', level: 32, hp: 1800, maxHp: 1800, mp: 850, maxMp: 850, spd: 65, passives: [] },
          { instanceId: 'p3', name: '巡海夜叉', type: 'sha_wujing', level: 30, hp: 2500, maxHp: 2500, mp: 400, maxMp: 400, spd: 42, passives: [] }
        ];
        this.activeCombatPets = [...this.pets];
        const mob1 = { id: 'mob_rat_1', name: '五行硕鼠', level: 20, spd: 35, hp: 1100, maxHp: 1100, quality: 'ordinary', isBoss: false };
        const mob2 = { id: 'mob_snake_1', name: '青花小蛇', level: 22, spd: 48, hp: 980, maxHp: 980, quality: 'ordinary', isBoss: false };
        const mob3 = { id: 'mob_fox_1', name: '赤尾野狐', level: 25, spd: 55, hp: 1400, maxHp: 1400, quality: 'sanxian', isBoss: false };
        this.start2DBattle([mob1, mob2, mob3], () => { });
        setTimeout(() => {
          this.activeSelectedAllyId = 'player';
          this.isSelectingTarget = false;
          this.pendingAction = null;
          this.combatSubMenu = null;
          this.renderBattleInterface();
        }, 150);
      }, 50);
    } else if (testCombat === 'v_target') {
      setTimeout(() => {
        if (!this.playerChar) this.playerChar = { appearance: 'heaven_general' };
        this.pets = [
          { instanceId: 'p1', name: '齐天灵猴', type: 'sun_wukong', level: 35, hp: 2200, maxHp: 2200, mp: 600, maxMp: 600, spd: 58, passives: [] },
          { instanceId: 'p2', name: '九尾仙狐', type: 'fox_spirit', level: 32, hp: 1800, maxHp: 1800, mp: 850, maxMp: 850, spd: 65, passives: [] }
        ];
        this.activeCombatPets = [...this.pets];
        const mob1 = { id: 'mob_rat_1', name: '五行硕鼠', level: 20, spd: 35, hp: 1100, maxHp: 1100, quality: 'ordinary', isBoss: false };
        const mob2 = { id: 'mob_snake_1', name: '青花小蛇', level: 22, spd: 48, hp: 980, maxHp: 980, quality: 'ordinary', isBoss: false };
        this.start2DBattle([mob1, mob2], () => { });
        setTimeout(() => {
          this.activeSelectedAllyId = 'player';
          this.chooseCombatAction('attack');
        }, 150);
      }, 50);
    } else if (testCombat === 'v_modal') {
      setTimeout(() => {
        if (!this.playerChar) this.playerChar = { appearance: 'heaven_general' };
        const mob1 = { id: 'mob_fox_1', name: '赤尾野狐', level: 25, spd: 55, hp: 1400, maxHp: 1400, quality: 'sanxian', isBoss: false };
        this.start2DBattle([mob1], () => { });
        setTimeout(() => {
          this.showConfirmModal({
            title: '招降仙宠',
            content: '确定要尝试招降野生仙兽【赤尾野狐】吗？<br><span style="color:#f59e0b;font-size:12px;">（需要消耗 1 回合行动，品质越高成功率受资质影响）</span>',
            confirmText: '确定招降',
            cancelText: '放弃',
            onConfirm: () => { }
          });
        }, 200);
      }, 50);
    } else if (testCombat === 'bailong') {
      setTimeout(() => {
        this.triggerYingchouBattle();
      }, 50);
    } else if (testCombat === 'wolf') {
      this.playerData.name = '铁扇公主';
      this.playerChar.appearance = 'tieshan';
      setTimeout(() => {
        this.triggerWolfBattle();
      }, 50);
    } else if (testCombat === 'bajie') {
      // 加入孙悟空同伴并进入猪八戒战斗
      this.companions = [{ name: '孙悟空', title: '【齐天大圣】', roleId: 'sun_wukong', hp: 3500, maxHp: 3500, atk: 450, skillName: '大闹天宫' }];
      setTimeout(() => {
        this.triggerBajieBattle();
      }, 50);
    } else if (testDialogue && window.GAME_DATA.STORY_DIALOGUES[testDialogue]) {
      setTimeout(() => {
        window.Dialogue.start(window.GAME_DATA.STORY_DIALOGUES[testDialogue]);
      }, 50);
    } else if (!loadedSave && (!urlParams.get('map') || urlParams.get('map') === 'tiangong_palace')) {
      // 仅在无存档新建时触发天宫蟠桃胜会序章开篇，确保随从绝对为空！
      this.companions = [];
      this.pets = [];
      this.activeCombatPets = [];
      setTimeout(() => {
        const introDlg = window.GAME_DATA.STORY_DIALOGUES.pantao_intro || window.GAME_DATA.STORY_DIALOGUES.taibai_intro;
        if (introDlg && window.Dialogue) {
          window.Dialogue.start(introDlg);
        }
      }, 50);
    }
  }

  // =========================================================================
  // 自动存档与断点续玩体系 (绝不让玩家进度丢失)
  // =========================================================================
  saveAutoProgress(forceOverwrite = false) {
    if (!this.playerData || !this.playerChar) return { success: false };
    if (this.isSaveCorrupted && !forceOverwrite) {
      this.updateSaveIndicator(false);
      return { success: false, reason: 'corrupted_protection', msg: '原存档损坏保护中，暂未自动覆盖。' };
    }
    try {
      const state = {        mapId: this._mapDestination?.mapId || this.currentMapId,
        playerPos: {
          x: Math.round(this._mapDestination?.spawn.x ?? this.playerChar.x),
          y: Math.round(this._mapDestination?.spawn.y ?? this.playerChar.y),
          direction: this.playerChar.direction
        },
        storyPhase: this.storyPhase,
        pendingStoryDialogue: this._pendingStoryDialogue || this._activeStoryDialogue || null,
        playerAppearance: this.playerChar.appearance,
        playerData: {
          name: this.playerData.name,
          level: this.playerData.level,
          exp: this.playerData.exp,
          silver: this.playerData.silver,
          ingots: this.playerData.ingots,
          bankSilver: this.playerData.bankSilver || 0,
          homeResidence: this.playerData.homeResidence || null,
          classId: this.playerData.classId,
          gender: this.playerData.gender,
          appearance: this.playerData.appearance,
          skills: this.playerData.skills,
          title: this.playerData.title,
          hp: this.playerData.hp,
          maxHp: this.playerData.maxHp,
          mp: this.playerData.mp,
          maxMp: this.playerData.maxMp,
          potentialPoints: this.playerData.potentialPoints || 0,
          attributes: this.playerData.attributes,
          equipment: this.playerData.equipment,
          resistances: this.playerData.resistances,
          storyRewards: this.playerData.storyRewards,
          storyEvents: this.playerData.storyEvents,
          storyBonuses: this.playerData.storyBonuses,
          sideQuests: this.playerData.sideQuests
        },
        inventorySlots: this.inventory ? this.inventory.slots : [],
        pets: this.pets || [],
        shanhai: this.getShanhai().toJSON(),
        shanhaiPursuitTarget: this.shanhaiPursuitTarget || null,
        activeCombatPetIds: (this.activeCombatPets || []).map(p => p.instanceId),
        mountState: {
          mounts: this.mountSystem.mounts,
          activeMountId: this.mountSystem.activeMountId,
          isRiding: this.mountSystem.isRiding
        },
        companions: this.companions,
        ghostQuest: this.ghostQuest,
        escortQuest: this.escortQuest,
        interactedNpcIds: Array.from(this.interactedNpcSet || []),
        collectedProps: Array.from(this.collectedProps || []),
        shownChapters: Array.from(this.shownChapterSet || []),
        questKills: this.questKills || { mushrooms: 0, trees: 0, rats: 0 }
      };
      const result = (window.SaveManager && window.SaveManager.saveGameFullState(state)) || { success: false };
      this.updateSaveIndicator(result.success === true);
      return result;
    } catch (e) {
      console.error('自动保存异常:', e);
      this.updateSaveIndicator(false);
      return { success: false };
    }
  }

  saveManualProgress() {
    this.isSaveCorrupted = false; // 手动保存表示明确提交当前状态
    const result = this.saveAutoProgress(true);
    const success = result?.success === true;
    window.showGameMessage(success ? '💾 历练进度已手动保存！' : '存档未成功，请检查浏览器存储后重试。',
      success ? 'success' : 'warning');
    return result;
  }

  loadAutoSavedProgress() {
    if (!window.SaveManager) return false;
    const state = window.SaveManager.loadGameFullState();
    if (!state || !state.mapId) return false;

    try {
      this.shanhai = new window.ShanhaiSystem(state.shanhai || {});
      if (state.shownChapters && Array.isArray(state.shownChapters)) {
        this.shownChapterSet = new Set(state.shownChapters);
      }
      if (state.collectedProps && Array.isArray(state.collectedProps)) {
        this.collectedProps = new Set(state.collectedProps);
      }
      if (state.questKills) {
        this.questKills = Object.assign({ mushrooms: 0, trees: 0, rats: 0 }, state.questKills);
      }
      if (state.interactedNpcIds && Array.isArray(state.interactedNpcIds)) {
        this.interactedNpcSet = new Set(state.interactedNpcIds);
      }
      if (state.playerData) {
        Object.assign(this.playerData, state.playerData);
      }
      if (state.ghostQuest) {
        this.ghostQuest = state.ghostQuest;
      }
      if (state.escortQuest) {
        this.escortQuest = state.escortQuest;
      }
      if (state.inventorySlots && this.inventory) {
        this.inventory.slots = state.inventorySlots;
      }
      if (state.pets && Array.isArray(state.pets)) {
        this.pets = state.pets;
        for (const pet of this.pets) {
          pet.gender = pet.gender || window.GAME_DATA.PETS[pet.templateId]?.gender || 'male';
          pet.masterLessonLearned = !!(pet.masterLessonLearned || pet.skills?.length || pet.classId);
          pet.isProtected = !!pet.isProtected;
          this.shanhai.observe(pet);
        }
        const activeIds = state.activeCombatPetIds || [];
        this.activeCombatPets = this.pets.filter(p => activeIds.includes(p.instanceId));
      }
      if (state.shanhaiPursuitTarget) {
        this.shanhaiPursuitTarget = state.shanhaiPursuitTarget;
      }
      if (state.mountState) {
        this.mountSystem.mounts = state.mountState.mounts || {};
        this.mountSystem.activeMountId = state.mountState.activeMountId || null;
        this.mountSystem.isRiding = !!state.mountState.isRiding;
      }
      if (state.storyPhase && state.storyPhase.startsWith('heaven_')) {
        this.companions = [];
      } else if (state.companions) {
        this.companions = state.companions;
      }
      if (state.storyPhase) {
        this.storyPhase = state.storyPhase;
      }
      // 旧档只根据明确的完成状态补领取键，不猜测已消耗的丹药或可选心经。
      this.playerData.storyRewards = this.playerData.storyRewards || {};
      this.playerData.storyEvents = this.playerData.storyEvents || {};
      if (this.hasCompletedWuzhuang(state.storyPhase)) {
        this.playerData.storyRewards.wuzhuang_gift = true;
        this.playerData.storyEvents.wuzhuang_tree_restored = true;
      } else if (state.storyPhase === 'liusha_cleared' && state.pendingStoryDialogue?.key === 'zhenyuanzi_post_battle') {
        // 兼容更新前停在战后对白的旧档，仍须读完救树对白才可领取。
        this.playerData.storyEvents.wuzhuang_trial_won = true;
      }
      // 旧档只对已经越过相应章节的进度补领讫标记；战后未领奖的存档保留重试资格。
      const phaseIndex = phase => ['huangfeng_cleared', 'liusha_cleared', 'wuzhuang_cleared',
        'baihu_first_cleared', 'baihu_second_cleared', 'baihu_cleared', 'baoxiang_seek_princess',
        'baoxiang_boss_ready', 'baoxiang_cleared', 'pingding_scout_cleared',
        'pingding_silver_cleared', 'pingding_gold_cleared', 'pingding_cleared',
        'huoyun_cleared', 'poer_cleared', 'chedi_cleared', 'tongtian_cleared',
        'huoyan_cleared', 'pansi_cleared', 'shituo_cleared', 'journey_completed'].indexOf(phase);
      const pastStarter = (state.storyPhase?.startsWith('liujiacun_') && state.storyPhase !== 'liujiacun_start') ||
        /^(changan_|chentang_|donghai_|longgong_|wuxing|yingchou_|gaolao_|huangfeng_|liusha_|wuzhuang_|baihu_|baoxiang_|pingding_|huoyun_|poer_|chedi_|tongtian_|huoyan_|pansi_|shituo_|journey_)/.test(state.storyPhase || '');
      if (pastStarter) this.playerData.storyRewards.liuboqin_starter = true;
      const pastGuanyin = /^(wuxing|yingchou_|gaolao_|huangfeng_|liusha_|wuzhuang_|baihu_|baoxiang_|pingding_|huoyun_|poer_|chedi_|tongtian_|huoyan_|pansi_|shituo_|journey_)/.test(state.storyPhase || '');
      if (pastGuanyin) this.playerData.storyRewards.guanyin_gift = true;
      if (pastGuanyin || ['chentang_guanyin_revelation', 'changan_meet_xuanzang',
        'changan_meet_taizong', 'changan_farewell'].includes(state.storyPhase)) {
        this.playerData.storyRewards.longgong_armor = true;
      }
      const pastTaizong = /^(wuxing|yingchou_|gaolao_|huangfeng_|liusha_|wuzhuang_|baihu_|baoxiang_|pingding_|huoyun_|poer_|chedi_|tongtian_|huoyan_|pansi_|shituo_|journey_)/.test(state.storyPhase || '') ||
        ['changan_farewell'].includes(state.storyPhase);
      if (pastTaizong) this.playerData.storyRewards.taizong_gift = true;
      if (this.inventory?.getItemCount?.('dinghai_shenzhen') > 0 ||
          this.playerData.equipment?.weapon?.itemId === 'dinghai_shenzhen') {
        this.playerData.storyRewards.donghai_trial = true;
        this.playerData.storyEvents.donghai_trial_won = true;
      }
      if (phaseIndex(state.storyPhase) >= phaseIndex('liusha_cleared')) {
        this.playerData.storyRewards.shaseng_join = true;
        this.playerData.storyEvents.shaseng_battle_won = true;
      } else if (state.pendingStoryDialogue?.key === 'shaseng_post_battle') {
        this.playerData.storyEvents.shaseng_battle_won = true;
      }
      if (phaseIndex(state.storyPhase) >= phaseIndex('baihu_cleared')) {
        this.playerData.storyRewards.baigu_final = true;
        this.playerData.storyEvents.baigu_final_won = true;
      }
      if (phaseIndex(state.storyPhase) >= phaseIndex('baoxiang_cleared')) {
        this.playerData.storyRewards.huangpao_final = true;
        this.playerData.storyEvents.huangpao_battle_won = true;
      }
      if (state.storyPhase === 'pingding_cleared') this.playerData.storyRewards.pingding_laojun = true;
      if (this.playerData.sideQuests?.sq_sanling_demon?.step === 'done') {
        this.playerData.storyRewards.sanling_completion = true;
      }
      if (state.playerAppearance) {
        this.playerChar.appearance = state.playerAppearance;
        this.playerChar.name = this.playerData.name;
        this.playerChar.title = this.playerData.title;
      }
      // R1.1: 读档保留实际气血与法力，避免刷新网页免费全恢复；缺失字段单独采用派生上限默认值
      this.playerData.recalculateStats(false);

      const targetMap = (state.mapId && window.GAME_DATA.MAPS_2D[state.mapId]) ? state.mapId : 'tiangong_palace';
      let spawn = state.playerPos || null;
      if (spawn && typeof this.ensurePlayerSafePosition === 'function') {
        const safe = this.ensurePlayerSafePosition(targetMap, spawn.x, spawn.y);
        spawn = { x: safe.x, y: safe.y, direction: spawn.direction || 'down' };
      }
      const checkpoint = state.pendingStoryDialogue;
      this.loadMap(targetMap, spawn, {
        onComplete: () => {
          if (checkpoint && checkpoint.mapId === this.currentMapId && checkpoint.phase === this.storyPhase &&
            window.GAME_DATA.STORY_DIALOGUES[checkpoint.key]) {
            this.scheduleStoryDialogue(checkpoint.key, 0);
          }
        }
      });
      if (spawn && spawn.direction) {
        this.playerChar.direction = spawn.direction;
      }
      this.playerChar.isRiding = this.mountSystem.isRiding;

      const mapName = window.GAME_DATA.MAPS_2D[targetMap]?.name || '西游三界';
      window.showGameMessage(`📜 欢迎归来！已自动载入【${mapName}】历练进度 (Lv.${this.playerData.level})`, 'success', 3500);
      return true;
    } catch (e) {
      console.error('载入存档失败:', e);
      return false;
    }
  }

  // 更新界面右上角存档指示器
  updateSaveIndicator(isSaved = true) {
    const el = document.getElementById('save-status-indicator');
    if (el) {
      el.innerHTML = isSaved ? '●' : '⏳';
      el.style.color = isSaved ? '#2ed573' : '#ffd700';
      el.title = isSaved ? '进度已保存' : '进度尚未保存成功，请尝试手动存档';
    }
  }

  // 展开或收起乾坤折叠主菜单 (快捷键 M 或界面按钮)
  toggleFoldableMenu(forceState) {
    const menuEl = document.getElementById('foldable-menu-modal');
    if (!menuEl) return;
    const shouldOpen = (forceState !== undefined) ? forceState : (menuEl.style.display === 'none' || !menuEl.classList.contains('active'));

    if (shouldOpen) {
      if (window.Dialogue) window.Dialogue.close();
      document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
      menuEl.style.display = 'flex';
      void menuEl.offsetHeight; // 强制重绘激活过渡动画
      menuEl.classList.add('active');
      this.isMenuOpen = true;
      this.updateMenuSoundLabel();
      if (window.Sound) window.Sound.playBeep();
    } else {
      menuEl.classList.remove('active');
      this.isMenuOpen = false;
      setTimeout(() => {
        if (!this.isMenuOpen) menuEl.style.display = 'none';
      }, 220);
    }
  }

  // 同步主菜单中的音效开关状态文案与图标
  updateMenuSoundLabel() {
    const labelEl = document.getElementById('menu-sound-label');
    if (labelEl && window.Sound) {
      labelEl.innerText = window.Sound.enabled ? '八音仙乐: 开' : '八音仙乐: 关';
      const card = labelEl.closest('.menu-tile-card');
      if (card) {
        const iconBox = card.querySelector('.tile-icon-box');
        if (iconBox) iconBox.innerText = window.Sound.enabled ? '🔊' : '🔇';
      }
    }
  }

  // 游戏内置国风水墨二次确认模态框
  showConfirmModal({ title = '仙界谕令', content = '', confirmText = '确认', cancelText = '取消', onConfirm = null, onCancel = null } = {}) {
    const old = document.getElementById('global-confirm-modal');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.id = 'global-confirm-modal';
    overlay.className = 'game-confirm-overlay';
    overlay.innerHTML = `
      <div class="game-confirm-box" onclick="event.stopPropagation()">
        <div class="game-confirm-header">
          <span>🏮 ${title}</span>
          <span id="confirm-modal-close" style="cursor:pointer;font-size:14px;color:#aaa;">✕</span>
        </div>
        <div class="game-confirm-body">
          ${content.replace(/\n/g, '<br/>')}
        </div>
        <div class="game-confirm-actions">
          <button class="game-confirm-btn cancel" id="confirm-modal-cancel">${cancelText}</button>
          <button class="game-confirm-btn confirm" id="confirm-modal-ok">${confirmText}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const closeSelf = () => {
      overlay.remove();
    };

    overlay.querySelector('#confirm-modal-close').onclick = () => {
      closeSelf();
      if (onCancel) onCancel();
    };
    overlay.querySelector('#confirm-modal-cancel').onclick = () => {
      closeSelf();
      if (onCancel) onCancel();
    };
    overlay.querySelector('#confirm-modal-ok').onclick = () => {
      closeSelf();
      if (onConfirm) onConfirm();
    };
  }

  // 重新启程（清空存档彻底回到序章大将军起点：天宫·南天门与凌霄宝殿）
  restartGame() {
    this.showConfirmModal({
      title: '西行轮回 · 乾坤归原',
      content: '少侠，确定要清空当前的全部西行历练存档与修为属性吗？\n\n此举将格式化清空全部金两、仙宠、神兵与任务历练，重回九重天阙威灵大将军初始篇章！',
      confirmText: '确认格式化重置',
      cancelText: '继续当前修行',
      onConfirm: () => {
        try {
          if (window.SaveManager) {
            window.SaveManager.clearProgress();
          }
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('xiyou_2d_save');
            localStorage.removeItem('xiyou_online_save_v3');
            localStorage.removeItem('xiyou_story_progress');
            localStorage.removeItem('xiyou_pet_save');
            localStorage.removeItem('hanfeng_xy_save_auto_progress');
            localStorage.removeItem('hanfeng_xy_shown_chapters');
          }
        } catch (e) {
          console.warn('清空存档异常:', e);
        }

        this.isSaveCorrupted = false;
        // 内存状态立即同步复位至天宫序章
        this.shownChapterSet = new Set();
        this.storyPhase = 'heaven_prologue';
        this.isSealTriggered = false;
        this.isSealTriggering = false;
        this.currentMapId = 'tiangong_palace';
        this.companions = [];
        this.pets = [];
        this.activeCombatPets = [];
        if (this.playerData) {
          this.playerData.name = '威灵大将';
          this.playerData.level = 50;
          this.playerData.appearance = 'heaven_general';
          this.playerData.skills = [
            { id: 'sk_jg_foguang', name: '佛光普照', genderReq: 'male', level: 3, mastery: 3000, maxLevel: 5, icon: '✨', desc: '男金刚专属单体玄击！造成【伤害基数 + 敌方当前生命百分比】伤害，并扣除【敌方当前法力百分比】！' },
            { id: 'sk_jg_shesheng', name: '舍生取义', genderReq: 'all', level: 3, mastery: 3000, maxLevel: 5, icon: '⚔️', desc: '金刚核心神技！以自身气血反噬换取绝杀技能伤害！' },
            { id: 'sk_jg_huti', name: '金刚护体', genderReq: 'all', level: 3, mastery: 3000, maxLevel: 5, icon: '🛡️', desc: '召唤罗汉金身护持队友，同时大幅提升物理防御与法术抗性！' }
          ];
          this.playerData.recalculateStats(false);
        }
        if (this.playerChar) {
          this.playerChar.name = '威灵大将';
          this.playerChar.appearance = 'heaven_general';
        }

        const originUrl = window.location && window.location.origin
          ? (window.location.origin + (window.location.pathname || ''))
          : (window.location && window.location.pathname ? window.location.pathname : '');

        if (typeof window !== 'undefined' && window.location && typeof window.location.assign === 'function') {
          window.location.href = originUrl ? (originUrl + '?map=tiangong_palace') : '?map=tiangong_palace';
        } else if (typeof window !== 'undefined' && window.location && 'href' in window.location) {
          window.location.href = originUrl ? (originUrl + '?map=tiangong_palace') : '?map=tiangong_palace';
        } else {
          this.loadMap('tiangong_palace');
        }
      }
    });
  }

  // 🛡️ 玩家安全落脚点保证：确保玩家坐标必须处于可行走平地，彻底根除出生卡水或卡墙 Bug
  ensurePlayerSafePosition(mapId, targetX, targetY) {
    const mapData = window.GAME_DATA.MAPS_2D[mapId];
    if (!mapData || !mapData.tiles) return { x: targetX, y: targetY };

    const ts = 32;
    const tileX = Math.floor(targetX / ts);
    const tileY = Math.floor(targetY / ts);

    const isTileWalkable = (tx, ty) => {
      if (this.tilemap && typeof this.tilemap.isWalkable === 'function') {
        return this.tilemap.isWalkable(mapData, tx, ty);
      }
      if (tx < 0 || ty < 0 || tx >= mapData.width || ty >= mapData.height) return false;
      if (!mapData.tiles[ty]) return false;
      const t = mapData.tiles[ty][tx];
      if (!t) return false;
      const solidTiles = [
        'cloud_void', 'heaven_pillar', 'bamboo', 'water', 'dark_water',
        'city_wall', 'hut_wall', 'palace_eaves', 'wooden_barricade',
        'blacksmith_forge', 'mountain_rock', 'demon_cave_wall',
        'ginseng_tree', 'purple_bamboo', 'tang_palace', 'tang_store',
        'stone_temple', 'two_realms_stele', 'wall', 'stone_wall', 'void', 'abyss'
      ];
      return !solidTiles.includes(t);
    };

    if (isTileWalkable(tileX, tileY)) {
      return { x: targetX, y: targetY };
    }

    console.warn(`[SafeSpawn] 检测到目标坐标 (${tileX}, ${tileY}) 不可行走，触发地脉神行自动矫正...`);

    // 螺旋扩散搜寻最近的可通行瓦片 (向外搜寻最多 10 格)
    for (let r = 1; r <= 10; r++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
          const nx = tileX + dx;
          const ny = tileY + dy;
          if (isTileWalkable(nx, ny)) {
            return { x: nx * ts + 16, y: ny * ts + 16 };
          }
        }
      }
    }

    // 终极保底：回退到地图官方 playerSpawn
    if (mapData.playerSpawn && isTileWalkable(Math.floor(mapData.playerSpawn.x / ts), Math.floor(mapData.playerSpawn.y / ts))) {
      return { x: mapData.playerSpawn.x, y: mapData.playerSpawn.y };
    }

    return { x: targetX, y: targetY };
  }

  // 📜 剧情驱动 NPC 可见性：未到达指定剧情阶段前，后续主线 NPC 绝不提前现身
  isNpcVisibleInStoryPhase(npcId, storyPhase, mapId) {
    const rawId = (typeof npcId === 'object' && npcId !== null) ? (npcId.id || '') : (npcId || '');
    storyPhase = storyPhase || this.storyPhase;
    mapId = mapId || this.currentMapId;
    npcId = String(rawId);

    // 采集品永续消隐校验：凡是已采集道具永久不可见
    if (this.collectedProps && this.collectedProps.has(npcId)) {
      return false;
    }

    const phaseWeights = {
      heaven_prologue: 0,
      liujiacun_start: 10,
      liujiacun_hunted: 20,
      changan_guided: 30,
      changan_met_monk: 30,
      wuxingshan_ready: 40,
      wuxing_freed: 50,
      yingchou_cleared: 60,
      gaolao_cleared: 70,
      huangfeng_cleared: 80,
      liusha_cleared: 90,
      wuzhuang_cleared: 100,
      baihu_first_cleared: 104,
      baihu_second_cleared: 107,
      baihu_cleared: 110,
      baoxiang_seek_princess: 112,
      baoxiang_boss_ready: 115,
      baoxiang_cleared: 120,
      pingding_scout_cleared: 124,
      pingding_silver_cleared: 126,
      pingding_gold_cleared: 128,
      pingding_cleared: 130,
      huoyun_arrived: 132,
      huoyun_redboy_ready: 134,
      huoyun_boss_ready: 136,
      huoyun_cleared: 140,
      heishui_arrived: 142,
      heishui_captives_taken: 144,
      heishui_scout_ready: 146,
      heishui_aid_needed: 148,
      heishui_moang_arrived: 150,
      heishui_boss_ready: 152,
      heishui_reward_pending: 154,
      heishui_cleared: 156,
      chedi_arrival: 158,
      chedi_audience: 160,
      chedi_rain: 162,
      chedi_discern: 164,
      chedi_final_trial: 166,
      chedi_reward_pending: 168,
      chedi_cleared: 170,
      tongtian_arrival: 172,
      tongtian_vowed: 174,
      tongtian_altar: 176,
      tongtian_rescue: 178,
      tongtian_await_guanyin: 180,
      tongtian_reward: 182,
      tongtian_cleared: 184,
      huoyan_arrived: 186,
      huoyan_borrow_fan: 188,
      huoyan_test_fan: 190,
      huoyan_seek_true_fan: 192,
      huoyan_confront_bull: 194,
      huoyan_renew_request: 196,
      huoyan_quench_fire: 198,
      huoyan_cleared: 200,
      pansi_arrived: 202,
      pansi_webbound: 204,
      pansi_huanghua: 206,
      pansi_poisoned: 208,
      pansi_seeking_rooster: 210,
      pansi_breaking_light: 212,
      pansi_restoring: 214,
      pansi_cleared: 216,
      poer_cleared: 148,
      shituo_arrived: 218,
      shituo_recon: 220,
      shituo_cave: 222,
      shituo_plea: 224,
      shituo_final: 226,
      shituo_restoring: 228,
      shituo_cleared: 230,
      journey_completed: 999
    };

    const currentWeight = phaseWeights[storyPhase] !== undefined ? phaseWeights[storyPhase] : 0;

    // 1. 五行山被压孙悟空：仅在前往五行山揭帖破封阶段 (wuxingshan_ready) 可见
    if (npcId === 'npc_wukong_sealed') {
      return storyPhase === 'wuxingshan_ready';
    }

    // 2. 蛇盘山鹰愁涧：唐僧与小白龙必须在五行山揭帖破封大圣脱困之后 (wuxing_freed 及之后) 才会到达！
    // 刚坠落凡间 (liujiacun_start)、刘家村、长安城阶段绝对不可见！
    if (npcId === 'npc_tang_seng_yingchou') {
      return currentWeight >= phaseWeights.wuxing_freed;
    }
    if (npcId === 'npc_bailong_human') {
      return currentWeight === phaseWeights.wuxing_freed;
    }

    // 3. 高老庄剧情 NPC：必须在收服白龙马之后 (yingchou_cleared 及之后) 才会出现
    if (npcId === 'npc_gaotaigong' || npcId === 'npc_gaocuilan') {
      return currentWeight >= phaseWeights.yingchou_cleared;
    }
    if (npcId === 'npc_zhubajie') {
      return currentWeight >= phaseWeights.yingchou_cleared && currentWeight < phaseWeights.gaolao_cleared;
    }

    // 4. 黄风岭剧情 NPC：必须在高老庄收猪八戒之后 (gaolao_cleared 及之后) 出现
    if (npcId === 'npc_lingji' || npcId === 'npc_huangfeng_boss') {
      return currentWeight >= phaseWeights.gaolao_cleared && currentWeight < phaseWeights.huangfeng_cleared;
    }

    // 5. 浮屠山与流沙河剧情 NPC：必须在黄风岭平息之后 (huangfeng_cleared 及之后) 出现
    if (npcId === 'npc_shawujing') {
      return currentWeight >= phaseWeights.huangfeng_cleared && currentWeight < phaseWeights.liusha_cleared;
    }
    if (npcId === 'npc_wuchao_master' || npcId === 'npc_muzhaxingzhe') {
      return currentWeight >= phaseWeights.huangfeng_cleared;
    }

    // 6. 五庄观：必须在流沙河平息之后 (liusha_cleared 及之后) 出现
    if (npcId === 'npc_zhenyuanzi') {
      return currentWeight >= phaseWeights.liusha_cleared && currentWeight < phaseWeights.wuzhuang_cleared;
    }
    if (npcId === 'npc_qingfeng' || npcId === 'npc_mingyue') {
      return currentWeight >= phaseWeights.liusha_cleared;
    }

    // 7. 白虎岭白骨夫人：必须在五庄观之后 (wuzhuang_cleared 及之后) 出现
    if (npcId === 'npc_baigujing' || npcId === 'npc_baigu_furen') {
      return currentWeight >= phaseWeights.wuzhuang_cleared && currentWeight < phaseWeights.baihu_cleared &&
        !this.playerData?.storyEvents?.baigu_final_won;
    }
    if (npcId === 'npc_baihu_wukong') {
      // 两种用途：
      //  1) 满包待领：真身已破但奖励还没入包，此处作为领取入口；
      //  2) 三打已毕：奖励到账后仍保留悟空作战后收尾对话，不再是第二个发奖点。
      const won = !!this.playerData?.storyEvents?.baigu_final_won;
      const claimed = !!this.playerData?.storyRewards?.baigu_final;
      if (storyPhase === 'baihu_second_cleared' && won && !claimed) return true;
      return storyPhase === 'baihu_cleared' && claimed;
    }

    // 8. 宝象国黄袍怪与公主：必须在三打白骨精之后 (baihu_cleared 及之后) 出现
    if (npcId === 'npc_huangpao_guai' || npcId === 'npc_huangpao_boss') {
      return storyPhase === 'baoxiang_boss_ready' && !this.playerData?.storyEvents?.huangpao_battle_won;
    }
    if (npcId === 'npc_baihuaxiu') {
      return currentWeight >= phaseWeights.baoxiang_seek_princess;
    }
    if (npcId === 'npc_baoxiang_king') {
      return currentWeight >= phaseWeights.baihu_cleared;
    }

    // 8.1 平顶山莲花洞剧情 NPC：小钻风、银角大王、金角大王、太上老君
    if (npcId === 'npc_xiaozuanfeng') {
      return currentWeight >= phaseWeights.baoxiang_cleared && currentWeight < phaseWeights.pingding_scout_cleared;
    }
    if (npcId === 'npc_yinjiao_boss') {
      return storyPhase === 'pingding_scout_cleared';
    }
    if (npcId === 'npc_jinjiao_boss') {
      return storyPhase === 'pingding_silver_cleared';
    }
    if (npcId === 'npc_taishang_laojun') {
      return currentWeight >= phaseWeights.pingding_gold_cleared;
    }

    // 8.1.1 第十二回 火云洞：土地神在号山阶段常驻接引；红孩儿按阶段显隐
    if (npcId === 'npc_haoshan_tudi') {
      return currentWeight >= phaseWeights.pingding_cleared;
    }
    if (npcId === 'npc_redboy_disguise') {
      return storyPhase === 'huoyun_redboy_ready';
    }
    if (npcId === 'npc_redboy_boss') {
      return storyPhase === 'huoyun_boss_ready';
    }

    // 8.1.6 第十七回 盘丝洞
    // 蜘蛛精代表（七女妖用一名代表承载，群体分歧由对白呈现）
    if (npcId === 'npc_pansi_spider') {
      return ['pansi_arrived', 'pansi_webbound'].includes(storyPhase);
    }
    if (npcId === 'npc_pansi_tangseng') {
      // 泉边与解缚阶段唐僧在场；中毒后被护送照护，仍可见
      return ['pansi_arrived', 'pansi_webbound', 'pansi_huanghua',
        'pansi_poisoned', 'pansi_restoring'].includes(storyPhase);
    }
    if (npcId === 'npc_pansi_huanghua') {
      // 黄花观主：解缚后至啼鸣前在场（毒茶与金光都由他发动）
      return ['pansi_huanghua', 'pansi_poisoned', 'pansi_breaking_light'].includes(storyPhase);
    }
    if (npcId === 'npc_pansi_oldwoman') {
      return storyPhase === 'pansi_poisoned';
    }
    if (npcId === 'npc_pansi_maori') {
      return ['pansi_seeking_rooster', 'pansi_breaking_light', 'pansi_restoring'].includes(storyPhase);
    }
    if (npcId === 'npc_pansi_west_exit') {
      // 西行出口只在终态放行
      return storyPhase === 'pansi_cleared';
    }

    // 8.4 狮驼岭：报信太白、巡山小钻风、洞口、获救樵夫与西行关口
    if (npcId === 'npc_taibai_warning') {
      return storyPhase === 'shituo_arrived';
    }
    if (npcId === 'npc_shituo_zuanfeng') {
      return storyPhase === 'shituo_recon';
    }
    if (npcId === 'npc_shituo_cavemouth') {
      return ['shituo_cave', 'shituo_plea', 'shituo_final'].includes(storyPhase);
    }
    if (npcId === 'npc_shituo_villager') {
      return ['shituo_restoring', 'shituo_cleared'].includes(storyPhase);
    }
    if (npcId === 'npc_shituo_west_exit') {
      return storyPhase === 'shituo_cleared';
    }

    // 8.1.5 第十六回 火焰山
    if (npcId === 'npc_huoyan_villager') {
      return ['huoyan_arrived', 'huoyan_borrow_fan', 'huoyan_test_fan',
        'huoyan_seek_true_fan', 'huoyan_confront_bull', 'huoyan_renew_request',
        'huoyan_quench_fire'].includes(storyPhase);
    }
    if (npcId === 'npc_huoyan_land') {
      return ['huoyan_arrived', 'huoyan_borrow_fan', 'huoyan_test_fan',
        'huoyan_seek_true_fan', 'huoyan_quench_fire', 'huoyan_cleared'].includes(storyPhase);
    }
    if (npcId === 'npc_huoyan_princess') {
      // 铁扇公主全章复用同一实体；试扇/对质期间留洞中（旁听对白）
      return ['huoyan_borrow_fan', 'huoyan_seek_true_fan', 'huoyan_renew_request',
        'huoyan_quench_fire', 'huoyan_cleared'].includes(storyPhase);
    }
    if (npcId === 'npc_huoyan_bull_king') {
      return ['huoyan_seek_true_fan', 'huoyan_confront_bull', 'huoyan_renew_request'].includes(storyPhase);
    }
    if (npcId === 'npc_huoyan_fan_trial') {
      return storyPhase === 'huoyan_test_fan';
    }
    if (npcId === 'npc_huoyan_fire_root') {
      // 熄火前台灭火，熄火后领谢礼
      return storyPhase === 'huoyan_quench_fire';
    }

    // 8.1.4 第十五回 通天河
    // 陈家长者：除水府救援战期间外均在场（接案、领奖共用）
    if (npcId === 'npc_tongtian_elder') {
      return storyPhase !== 'tongtian_rescue';
    }
    // 被选中的孩童：只在初到与表态阶段可见，动身即撤（不把儿童当诱饵/可交互对象）
    if (npcId === 'npc_tongtian_child') {
      return ['tongtian_arrival', 'tongtian_vowed'].includes(storyPhase);
    }
    if (npcId === 'npc_tongtian_altar') {
      return ['tongtian_vowed', 'tongtian_altar'].includes(storyPhase);
    }
    if (npcId === 'npc_tongtian_watergate') {
      return storyPhase === 'tongtian_rescue';
    }
    if (npcId === 'npc_tongtian_guanyin') {
      return ['tongtian_await_guanyin', 'tongtian_reward', 'tongtian_cleared'].includes(storyPhase);
    }

    // 8.1.3 第十四回 车迟国：三仙在决战前可见，胜利进入领奖阶段即隐藏
    if (npcId === 'npc_chedi_monk') {
      return ['chedi_arrival', 'chedi_audience', 'chedi_rain', 'chedi_discern',
        'chedi_final_trial', 'chedi_reward_pending'].includes(storyPhase);
    }
    if (npcId === 'npc_chedi_tiger') {
      return ['chedi_rain', 'chedi_discern', 'chedi_final_trial'].includes(storyPhase);
    }
    if (npcId === 'npc_chedi_deer') {
      return ['chedi_discern', 'chedi_final_trial'].includes(storyPhase);
    }
    if (npcId === 'npc_chedi_sheep') {
      return storyPhase === 'chedi_final_trial';
    }
    if (npcId === 'npc_chedi_king') {
      // 国王常驻，但决战后的纠错与领奖只在 reward_pending / cleared 显示
      return storyPhase === 'chedi_audience' || storyPhase === 'chedi_reward_pending' ||
        storyPhase === 'chedi_cleared';
    }

    // 8.1.2 第十三回 黑水河：按阶段集合严格显隐
    if (npcId === 'npc_heishui_ferryman') {
      return storyPhase === 'heishui_arrived';
    }
    if (npcId === 'npc_heishui_rivergod_exiled') {
      return ['heishui_captives_taken', 'heishui_scout_ready', 'heishui_aid_needed'].includes(storyPhase);
    }
    if (npcId === 'npc_heishui_gate_guard') {
      return storyPhase === 'heishui_scout_ready';
    }
    if (npcId === 'npc_heishui_moang') {
      return ['heishui_moang_arrived', 'heishui_boss_ready'].includes(storyPhase);
    }
    if (npcId === 'npc_heishui_tuojie') {
      return storyPhase === 'heishui_boss_ready';
    }
    if (npcId === 'npc_heishui_rivergod_restored') {
      return ['heishui_reward_pending', 'heishui_cleared'].includes(storyPhase);
    }
    if (npcId === 'npc_heishui_tangseng_rescued') {
      return ['heishui_reward_pending', 'heishui_cleared'].includes(storyPhase);
    }

    // 8.2 苍茫三岭支线伏魔 NPC 与妖物
    if (npcId && npcId.startsWith('npc_sanling_fox_')) {
      const sq = this.playerData?.sideQuests?.sq_sanling_demon;
      if (!sq || sq.step !== 'hunt_foxes') return false;
      return !sq.foxesDefeated || !sq.foxesDefeated[npcId];
    }
    if (npcId && npcId.startsWith('npc_sanling_wolf_')) {
      const sq = this.playerData?.sideQuests?.sq_sanling_demon;
      if (!sq || sq.step !== 'hunt_wolves') return false;
      return !sq.wolvesDefeated || !sq.wolvesDefeated[npcId];
    }
    if (npcId === 'npc_heifeng_shura_boss') {
      const sq = this.playerData?.sideQuests?.sq_sanling_demon;
      if (!sq) return false;
      return sq.step === 'boss_ready';
    }
    if (npcId === 'npc_yehu_hermit') {
      return true;
    }

    // 9. 东胜神洲·花果山与水帘洞：仅在天宫序章大圣反天、奉旨下界征剿阶段出现
    const isHeavenPhase = storyPhase && storyPhase.startsWith('heaven_');
    if (mapId === 'huaguoshan' || mapId === 'huaguoshan_shuilien') {
      if (!isHeavenPhase) return false;
      // 天庭前锋营神将：在花果山主山，指引大将前往水帘洞探查
      if (npcId === 'npc_tianbing_scout') {
        return storyPhase === 'heaven_saved_juanlian' || storyPhase === 'heaven_huaguoshan' || storyPhase === 'heaven_huaguoshan_shuilien';
      }
      // 赤毛马猴：在水帘洞内入口迎敌切磋
      if (npcId === 'npc_chimao_mahou' || npcId === 'npc_chimaomahou') {
        return storyPhase === 'heaven_huaguoshan_shuilien';
      }
      // 巨灵神：在水帘洞深处赶尽杀绝幼猴，大战制伏后退场
      if (npcId === 'npc_juling_shen') {
        return storyPhase === 'heaven_huaguoshan_rescue';
      }
      // 受困啼哭小猴：水帘洞中
      if (npcId === 'npc_huaguo_monkey') {
        return storyPhase === 'heaven_huaguoshan_rescue' || storyPhase === 'heaven_juling_defeated';
      }
      // 齐天大圣：在花果山主山现身决战！
      if (npcId === 'npc_wukong_huaguo' || npcId === 'npc_wukong_shadow') {
        return storyPhase === 'heaven_final_wukong';
      }
      // 通臂猿猴：水帘洞前指路老猴
      if (npcId === 'npc_tongbi_yuan' || npcId === 'npc_tongbi_monkey') {
        return true;
      }
      return true;
    }

    // 10. 天宫序章的专属神仙NPC：仅在天宫序章出现，并按三大因缘事件逐步显隐
    if (mapId === 'tiangong_palace' || mapId === 'tiangong_pantao') {
      // 蟠桃园土地公是三界常驻接引仙官，凡间随时可神行吃桃，土地公始终常驻在蟠桃园最下方！
      if (npcId === 'npc_pantao_tudi') return true;

      if (!isHeavenPhase) return false; // 贬落凡间后，天宫神仙退隐

      // 太白金星：天庭老仙，始终接引
      if (npcId === 'npc_taibai') return true;
      // 花果山人物不能因天宫地图中的旧占位配置提前登场。
      if (npcId === 'npc_juling_shen' || npcId === 'npc_huaguo_monkey') return false;

      // 事件一：天蓬调戏嫦娥（开局出现，解围后天蓬被王母降旨贬猪胎退场）
      if (npcId === 'npc_tianpeng' || npcId === 'npc_change') {
        return storyPhase === 'heaven_pantao_start';
      }

      // 事件二：卷帘失手打碎琉璃盏（救嫦娥后登场，求情免死贬流沙河后退场）
      if (npcId === 'npc_juanlian') {
        return storyPhase === 'heaven_saved_change';
      }

      // 押解大圣凯旋与玉帝发落因果阶段
      if (npcId === 'npc_wukong_heaven' || npcId === 'npc_yangjian') {
        return storyPhase === 'heaven_tiangong_trial';
      }

      if (npcId === 'npc_litianwang' || npcId === 'npc_nezha' || npcId === 'npc_leigong') {
        return storyPhase === 'heaven_prologue' || storyPhase === 'heaven_pantao_start' || storyPhase === 'heaven_saved_juanlian' || storyPhase === 'heaven_tiangong_trial';
      }

      return true;
    }

    // 11. 凡间刘家村：野生青蘑菇仅在采摘阶段可见，且已采集过的永久不再出现
    if (npcId.startsWith('prop_mushroom_')) {
      if (this.collectedProps && this.collectedProps.has(npcId)) return false;
      return storyPhase === 'liujiacun_find_mushrooms';
    }

    // 12. 东海之滨与东海龙宫主线 NPC 显隐
    if (npcId === 'npc_yecha') {
      return storyPhase === 'donghai_yecha_ready';
    }
    if (npcId === 'npc_aoguang_coast') {
      return storyPhase === 'donghai_dragon_arrived';
    }
    if (npcId === 'npc_aoguang') {
      return true;
    }

    // 13. 陈塘关主线 NPC 显隐（混混头目、观音雕像、显圣观音、侍侧龙王）
    if (npcId === 'npc_hooligan_boss') {
      return storyPhase === 'chentang_boss_ready';
    }
    if (npcId === 'npc_guanyin_statue') {
      return storyPhase === 'chentang_statue_investigate' || storyPhase === 'donghai_yecha_ready' || storyPhase === 'donghai_dragon_arrived' || storyPhase === 'longgong_visit';
    }
    if (npcId === 'npc_guanyin_pu_sa') {
      return storyPhase === 'chentang_guanyin_revelation';
    }
    if (npcId === 'npc_aoguang_chentang') {
      return storyPhase === 'chentang_guanyin_revelation';
    }

    // 14. 长安城金銮殿唐太宗与城门刘伯钦送行
    if (npcId === 'npc_tangtaizong') {
      return storyPhase === 'changan_meet_taizong';
    }
    if (npcId === 'npc_liuboqin_changan') {
      return storyPhase === 'changan_farewell';
    }
    if (npcId === 'npc_xuanzang') {
      return storyPhase === 'changan_meet_xuanzang';
    }

    // 常规市井生活 NPC（长安商人、医馆、老渔翁、茶肆阿婆、土地公等）：始终驻扎提供服务
    return true;
  }

  // 刷新当前地图 NPC 显隐与感叹号状态 (仅就地刷新NPC/怪物实例与任务标识，绝不重载地图、不黑屏过渡、不锁交互)
  refreshMapNpcs() {
    if (!this.playerChar || !this.currentMapId) return;
    const mapData = window.GAME_DATA?.MAPS_2D?.[this.currentMapId];
    if (!mapData) return;
    this._rebuildMapEntities(mapData, false);
  }

  // 载入指定地图（支持场景平滑过渡动效：走动切图约0.75s，对话剧情切图约1.0s，Node单测环境同步立即执行）
  loadMap(mapId, customSpawn = null, options = {}) {
    if (!window.GAME_DATA?.MAPS_2D?.[mapId]) return false;

    // 记录进入蟠桃胜境前的地图与坐标，供园内最下方土地公引渡返回刚才所在之处
    if (mapId === 'tiangong_pantao' && this.currentMapId && this.currentMapId !== 'tiangong_pantao') {
      this.peachGardenReturnPoint = {
        mapId: this.currentMapId,
        x: this.playerChar ? this.playerChar.x : (this.playerSpawn ? this.playerSpawn.x : 23 * 32),
        y: this.playerChar ? this.playerChar.y : (this.playerSpawn ? this.playerSpawn.y : 10 * 32)
      };
    }

    const transitionId = this._mapTransitionId = (this._mapTransitionId || 0) + 1;
    this._mapDestination = { mapId, spawn: customSpawn || window.GAME_DATA.MAPS_2D[mapId].playerSpawn };
    for (const timer of this._mapTransitionTimers || []) clearTimeout(timer);
    this._mapTransitionTimers = [];
    if (this._transitionSafetyTimer) clearTimeout(this._transitionSafetyTimer);
    this.cancelStoryDialogue();
    this.keysDown = {};
    this.autoMovePath = [];
    this.autoMoveTargetCallback = null;
    const isNodeTest = typeof process !== 'undefined' && process.release && process.release.name === 'node';
    let duration = 0;
    if (typeof options === 'number') {
      duration = options;
    } else if (options && typeof options.duration === 'number') {
      duration = options.duration;
    } else if (typeof document !== 'undefined' && options?.duration === undefined) {
      duration = (window.Dialogue && window.Dialogue.currentDialogue) ? 1.0 : 0.75;
    }

    let overlay = (typeof document !== 'undefined') ? document.getElementById('scene-transition-overlay') : null;
    if (!overlay && typeof document !== 'undefined' && document.body) {
      overlay = document.createElement('div');
      overlay.id = 'scene-transition-overlay';
      overlay.className = 'scene-transition-overlay';
      document.body.appendChild(overlay);
    }
    const targetMapData = window.GAME_DATA?.MAPS_2D?.[mapId];
    const targetName = targetMapData?.name || '未知圣境';
    const targetRegion = targetMapData?.region || '三界造化';

    if (this.currentMapId === mapId && !customSpawn && !options.forceTransition) {
      this._mapDestination = null;
      this.refreshMapNpcs();
      this.isTransitioning = false;
      overlay?.classList.remove('active', 'fade-out');
      if (typeof options.onComplete === 'function') options.onComplete();
      return true;
    }

    let completed = false;
    const complete = () => {
      if (completed || transitionId !== this._mapTransitionId) return;
      completed = true;
      overlay?.classList.remove('active', 'fade-out');
      this.isTransitioning = false;
      this._mapDestination = null;
      this.saveAutoProgress();
      if (this._transitionSafetyTimer) clearTimeout(this._transitionSafetyTimer);
      this._transitionSafetyTimer = null;
      if (typeof options.onComplete === 'function') options.onComplete();
    };
    if (overlay && duration > 0) {
      overlay.innerHTML = `
        <div class="scene-transition-banner">
          <div class="scene-transition-taichi"></div>
          <div class="scene-transition-header">✦ 腾 云 御 风 · 穿 行 圣 境 ✦</div>
          <div class="scene-transition-title"><span>入</span> ${targetName}</div>
          <div class="scene-transition-sub">界属 · ${targetRegion}</div>
        </div>
      `;

      if (!isNodeTest) {
        this.isTransitioning = true;
        this.autoMovePath = [];
        this.autoMoveTargetCallback = null;
        this.keysDown = {};

        const halfMs = Math.max(160, Math.round((duration * 1000) / 2));
        overlay.style.transition = `opacity ${halfMs / 1000}s ease-in-out`;
        overlay.classList.remove('fade-out');
        overlay.classList.add('active');

        if (window.Sound && window.Sound.playBeep) {
          try { window.Sound.playBeep(); } catch (e) { }
        }

        this._transitionSafetyTimer = setTimeout(complete, Math.max(2500, halfMs * 2 + 500));
        this._mapTransitionTimers.push(setTimeout(() => {
          if (transitionId !== this._mapTransitionId) return;
          let applied = false;
          try {
            this._applyMapData(mapId, customSpawn);
            applied = true;
          } catch (err) {
            console.error('地图加载应用数据异常:', err);
          } finally {
            if (!applied) {
              overlay.classList.remove('active', 'fade-out');
              this.isTransitioning = false;
              this._mapDestination = null;
              clearTimeout(this._transitionSafetyTimer);
              return;
            }
            this._mapTransitionTimers.push(setTimeout(() => {
              if (transitionId !== this._mapTransitionId) return;
              overlay.classList.remove('active');
              overlay.classList.add('fade-out');
              this._mapTransitionTimers.push(setTimeout(complete, halfMs));
            }, 80));
          }
        }, halfMs));
        return true;
      }
    }

    this._applyMapData(mapId, customSpawn);
    complete();
    return true;
  }

  cancelStoryDialogue() {
    if (this._storyDialogueTimer) clearTimeout(this._storyDialogueTimer);
    this._storyDialogueTimer = null;
    this._pendingStoryDialogue = null;
    this._activeStoryDialogue = null;
  }

  skipCurrentDialogue() {
    const dialogue = window.Dialogue;
    if (!dialogue?.currentDialogue) return;
    const step = dialogue.currentDialogue.steps[dialogue.currentStep];
    if (step.options?.length > 1) {
      if (dialogue.isTyping) dialogue.next();
      return;
    }
    dialogue.completeAllAndClose();
  }

  // 战后对白只归属于产生它的地图和剧情阶段；换图后不能再弹出旧剧情。
  scheduleStoryDialogue(key, delay = 500) {
    this.cancelStoryDialogue();
    this.refreshMapNpcs();
    const pending = { key, mapId: this.currentMapId, phase: this.storyPhase };
    this._pendingStoryDialogue = pending;
    this.saveAutoProgress();
    this._storyDialogueTimer = setTimeout(() => this.openPendingStoryDialogue(), delay);
  }

  openPendingStoryDialogue() {
    const pending = this._pendingStoryDialogue || this._activeStoryDialogue;
    if (!pending) return false;
    if (pending.mapId !== this.currentMapId || pending.phase !== this.storyPhase) {
      this.cancelStoryDialogue();
      return false;
    }
    // 对白键不存在时绝不静默返回：静默会让剧情永久卡死且坏档自我延续。
    const dialogueData = window.GAME_DATA?.STORY_DIALOGUES?.[pending.key];
    if (!dialogueData || !Array.isArray(dialogueData.steps) || dialogueData.steps.length === 0) {
      console.error(`[剧情断链] 找不到对白键「${pending.key}」，请检查 storyQuests.js。已解除断点以免锁死流程。`);
      if (window.showGameMessage) {
        window.showGameMessage(`⚠️ 剧情脚本缺失（${pending.key}），已跳过该段以免卡关。`, 'warning', 5000);
      }
      this.cancelStoryDialogue();
      return false;
    }
    if (this.currentBattle || this.isTransitioning || window.Dialogue?.currentDialogue) return true;
    this.cancelStoryDialogue();
    this._activeStoryDialogue = pending;
    window.Dialogue.start(dialogueData);
    return true;
  }

  finishStoryDialogue(dialogue) {
    if (this._activeStoryDialogue && window.GAME_DATA.STORY_DIALOGUES[this._activeStoryDialogue.key] === dialogue) {
      this._activeStoryDialogue = null;
    }
    this.saveAutoProgress();
  }

  // 内部执行地图数据与生灵加载
  _applyMapData(mapId, customSpawn = null) {
    const mapData = window.GAME_DATA.MAPS_2D[mapId];
    if (!mapData) {
      console.error(`未知地图编号: ${mapId}`);
      return;
    }

    this.currentMapId = mapId;
    this.autoMovePath = [];
    this.autoMoveTargetCallback = null;

    const rawSpawn = customSpawn || mapData.playerSpawn;
    const safePos = this.ensurePlayerSafePosition(mapId, rawSpawn.x, rawSpawn.y);
    this.playerChar.x = safePos.x;
    this.playerChar.y = safePos.y;
    this.playerChar.direction = rawSpawn.direction || 'down';
    if (this.camera) {
      this.camera.follow(this.playerChar.x, this.playerChar.y, mapData.width * 32, mapData.height * 32);
    }

    this._rebuildMapEntities(mapData, true);

    if (window.Sound && window.Sound.playBeep) {
      try { window.Sound.playBeep(); } catch (e) { }
    }
    this.updateLocationHeader(mapData.name, mapData.region);
    this.updatePlayerHud();

    // 章节起点初始化：只在上一个章节刚完结时触发，重复入图或后续章节回访均不回退
    this.ensureHeishuiChapterStarted();
    this.ensureChediChapterStarted();
    this.ensureTongtianChapterStarted();
    this.ensureHuoyanChapterStarted();
    this.ensurePansiChapterStarted();
    this.ensureShituoChapterStarted();

    // 每次过图或进入新场景，自动持久化历练进度
    this.saveAutoProgress();

    // 🌟 检查并自动触发当前章节国风开幕动画 (每个章节每位玩家只开幕一次，持久化到存档)
    this.checkAndTriggerChapterOpening(mapId, this.storyPhase);
  }

  // 内部仅就地重建/刷新当前地图生灵与主支线感叹号状态 (支持保留战斗存量怪物)
  _rebuildMapEntities(mapData, rebuildMonsters = false) {
    if (!mapData) return;
    const mapId = this.currentMapId || mapData.id;

    // 严格主线任务感叹号唯一制：同一时刻全游戏只允许当前唯一步骤的 1 位 NPC 拥有金色感叹号！
    const MAIN_QUEST_TARGETS = {
      // 天宫序章三大因缘
      'heaven_prologue': 'npc_taibai',
      'heaven_to_water_pavilion': null,
      'heaven_pantao_start': 'npc_tianpeng',
      'heaven_to_lingxiao': null,
      'heaven_saved_change': 'npc_juanlian',
      'heaven_saved_juanlian': 'npc_tianbing_scout',
      'heaven_huaguoshan': 'npc_tianbing_scout',
      'heaven_huaguoshan_shuilien': 'npc_chimao_mahou',
      'heaven_huaguoshan_rescue': 'npc_juling_shen',
      'heaven_final_wukong': 'npc_wukong_huaguo',
      'heaven_yangjian_capture': 'npc_litianwang',
      'heaven_tiangong_trial': 'npc_taibai',

      // 凡间刘家村
      'liujiacun_start': 'npc_liuboqin',
      'liujiacun_find_mushrooms': null,           // 采蘑菇中
      'liujiacun_mushrooms_collected': 'npc_liuboqin',
      'liujiacun_go_cut_wood': 'npc_liuboqin',
      'liujiacun_wood_gathering': null,           // 砍柴中
      'liujiacun_wood_collected': 'npc_liuboqin',
      'liujiacun_rat_hunting': null,              // 打硕鼠中
      'liujiacun_rats_cleared': 'npc_liuboqin',
      'liujiacun_go_changan': 'npc_liuboqin',

      // 长安与陈塘关东海
      'changan_arrived': 'npc_changan_tea',
      'chentang_investigate': 'npc_li_jing',
      'chentang_defeat_hooligans': null,          // 街头惩戒4名混混中(李靖头顶无感叹号)
      'chentang_hooligans_done': 'npc_li_jing',   // 复命李靖总兵
      'chentang_boss_ready': 'npc_hooligan_boss', // 迎战混混头目雷震彪(1打3决战)
      'chentang_boss_defeated': 'npc_li_jing',    // 击败头目后回总兵府领赏
      'chentang_statue_investigate': 'npc_guanyin_statue', // 查探东侧海滨沉寂观音雕像
      'donghai_yecha_ready': 'npc_yecha',
      'donghai_dragon_arrived': 'npc_aoguang_coast',
      'longgong_visit': 'npc_aoguang',
      'chentang_guanyin_revelation': 'npc_guanyin_pu_sa',
      'changan_meet_xuanzang': 'npc_xuanzang',
      'changan_meet_taizong': 'npc_tangtaizong',
      'changan_farewell': 'npc_liuboqin_changan',

      // 西行正传
      'wuxingshan_ready': 'npc_wukong_sealed',
      'wuxing_freed': 'npc_wukong_sealed',
      'yingchou_cleared': 'npc_zhubajie',
      'gaolao_cleared': 'npc_lingji',
      'huangfeng_cleared': 'npc_shawujing',
      'liusha_cleared': 'npc_zhenyuanzi',
      'wuzhuang_cleared': 'npc_baigujing',
      'baihu_first_cleared': 'npc_baigujing',
      'baihu_second_cleared': this.playerData?.storyEvents?.baigu_final_won ? 'npc_baihu_wukong' : 'npc_baigujing',
      'baihu_cleared': 'npc_baoxiang_king',
      'baoxiang_seek_princess': 'npc_baihuaxiu',
      'baoxiang_boss_ready': this.playerData?.storyEvents?.huangpao_battle_won ? 'npc_baoxiang_king' : 'npc_huangpao_boss',
      'baoxiang_cleared': 'npc_xiaozuanfeng',
      'pingding_scout_cleared': 'npc_yinjiao_boss',
      'pingding_silver_cleared': 'npc_jinjiao_boss',
      'pingding_gold_cleared': 'npc_taishang_laojun',
      // 第十二回 火云洞
      'pingding_cleared': 'npc_haoshan_tudi',
      'huoyun_arrived': 'npc_haoshan_tudi',
      'huoyun_redboy_ready': 'npc_redboy_disguise',
      'huoyun_boss_ready': 'npc_redboy_boss',
      'huoyun_cleared': null,
      // 第十三回 黑水河
      'heishui_arrived': 'npc_heishui_ferryman',
      'heishui_captives_taken': 'npc_heishui_rivergod_exiled',
      'heishui_scout_ready': 'npc_heishui_gate_guard',
      'heishui_aid_needed': 'npc_heishui_rivergod_exiled',
      'heishui_moang_arrived': 'npc_heishui_moang',
      'heishui_boss_ready': 'npc_heishui_tuojie',
      'heishui_reward_pending': 'npc_heishui_rivergod_restored',
      'heishui_cleared': 'npc_heishui_tangseng_rescued',
      // 第十四回 车迟国（终态无目标）
      'chedi_arrival': 'npc_chedi_monk',
      'chedi_audience': 'npc_chedi_king',
      'chedi_rain': 'npc_chedi_tiger',
      'chedi_discern': 'npc_chedi_deer',
      'chedi_final_trial': 'npc_chedi_sheep',
      'chedi_reward_pending': 'npc_chedi_king',
      'chedi_cleared': null,
      // 第十五回 通天河
      'tongtian_arrival': 'npc_tongtian_elder',
      'tongtian_vowed': 'npc_tongtian_altar',
      'tongtian_altar': 'npc_tongtian_altar',
      'tongtian_rescue': 'npc_tongtian_watergate',
      'tongtian_await_guanyin': 'npc_tongtian_guanyin',
      'tongtian_reward': 'npc_tongtian_elder',
      'tongtian_cleared': null,
      // 第十六回 火焰山
      'huoyan_arrived': 'npc_huoyan_villager',
      'huoyan_borrow_fan': 'npc_huoyan_princess',
      'huoyan_test_fan': 'npc_huoyan_fan_trial',
      'huoyan_seek_true_fan': 'npc_huoyan_princess',
      'huoyan_confront_bull': 'npc_huoyan_bull_king',
      'huoyan_renew_request': 'npc_huoyan_princess',
      'huoyan_quench_fire': 'npc_huoyan_fire_root',
      'huoyan_cleared': null,
      // 第十七回 盘丝洞
      'pansi_arrived': 'npc_pansi_spider',
      'pansi_webbound': 'npc_pansi_spider',
      'pansi_huanghua': 'npc_pansi_huanghua',
      'pansi_poisoned': 'npc_pansi_oldwoman',
      'pansi_seeking_rooster': 'npc_pansi_maori',
      'pansi_breaking_light': 'npc_pansi_maori',
      'pansi_restoring': 'npc_pansi_tangseng',
      'pansi_cleared': 'npc_pansi_west_exit',
      'shituo_arrived': 'npc_taibai_warning',
      'shituo_recon': 'npc_shituo_zuanfeng',
      'shituo_cave': 'npc_shituo_cavemouth',
      'shituo_plea': 'npc_shituo_cavemouth',
      'shituo_final': 'npc_shituo_cavemouth',
      'shituo_restoring': 'npc_shituo_villager',
      'shituo_cleared': 'npc_shituo_west_exit'
    };

    const shouldShowQuestExclamation = (n) => {
      // 1. 无关闲聊、或点开只是一两句空话的 NPC，绝不悬挂感叹号
      const chattyIdleNpcs = [
        'npc_changan_girl', 'npc_changan_scholar', 'npc_changan_hawker',
        'npc_changan_child', 'npc_changan_guard', 'npc_village_elder',
        'npc_qingfeng', 'npc_mingyue', 'npc_huaguo_monkey', 'npc_change',
        'npc_fisherman'
      ];
      if (chattyIdleNpcs.includes(n.id)) return false;

      // 2. 地面采摘物不显示感叹号
      if (n.id.startsWith('prop_mushroom_')) return false;

      // 3. 支线任务 NPC：如果有专属支线标识或刘家村土地公，显示翠绿碧玉支线感叹号 ('side')
      if (n.isSideQuest || n.id === 'npc_liujia_tudi') {
        const hasInteracted = this.interactedNpcSet && this.interactedNpcSet.has(n.id);
        return hasInteracted ? false : 'side';
      }
      if (n.id === 'npc_yehu_hermit') {
        const sq = this.playerData?.sideQuests?.sq_sanling_demon;
        return (!sq || sq.step !== 'done') ? 'side' : false;
      }
      // P4 趣闻小支线：未完成前展示翠绿支线感叹号，完成后彻底消失
      if (n.id === 'npc_liujiacun_dashen') {
        const rice = this.playerData?.sideQuests?.sq_rice_thief;
        return (!rice || rice.step !== 'done') ? 'side' : false;
      }
      if (n.id === 'npc_changan_bingtan') {
        return this.playerData?.storyEvents?.changan_sign_task !== 'done' ? 'side' : false;
      }
      if (n.id && (n.id.startsWith('npc_sanling_fox_') || n.id.startsWith('npc_sanling_wolf_') || n.id === 'npc_heifeng_shura_boss')) {
        return 'side';
      }

      // 4. 主线感叹号严格唯一匹配：只有当前阶段指定的唯一 NPC 显示金色感叹号 ('available')！
      const currentMainTarget = MAIN_QUEST_TARGETS[this.storyPhase];
      if (currentMainTarget && n.id === currentMainTarget) {
        return 'available';
      }

      return false;
    };

    // 实例化 NPC (拒绝 Emoji，外观配置清晰，已点击/非任务 NPC 头顶绝不乱悬浮感叹号；依据剧情进度过滤未到出场时机的人物)
    const visibleNpcList = (mapData.npcs || []).filter(n => this.isNpcVisibleInStoryPhase(n.id, this.storyPhase, mapId));
    this.npcs = visibleNpcList.map(n => new window.Character({
      id: n.id,
      name: n.id === 'npc_baigujing' ?
        (this.storyPhase === 'wuzhuang_cleared' ? '送斋饭的村姑' :
          this.storyPhase === 'baihu_first_cleared' ? '寻女的老妪' : '拄杖的老翁') : n.name,
      title: n.id === 'npc_baigujing' ? '【白虎岭行路人】' : n.title,
      type: 'npc',
      x: n.x,
      y: n.y,
      appearance: n.id === 'npc_baigujing' ?
        (this.storyPhase === 'wuzhuang_cleared' ? 'baigu_maiden' :
          this.storyPhase === 'baihu_first_cleared' ? 'baigu_granny' : 'baigu_oldman') : n.appearance,
      dialogueKey: n.dialogueKey,
      questStatus: shouldShowQuestExclamation(n) || null
    }));

    // 实例化怪物 (完整继承地图怪物全部属性、战斗技能与80%移速；若为刷新NPC则保留当前存活怪物不强制刷满)
    if (rebuildMonsters || !this.monsters || this.monsters.length === 0) {
      this.monsters = (mapData.monsters || []).map(m => {
        const mobChar = new window.Character({
          id: m.id,
          name: m.name,
          type: 'monster',
          x: m.x,
          y: m.y,
          speed: m.speed !== undefined ? m.speed : GAME_SPEED_CONFIG.DEFAULT_MONSTER_SPEED, // 绝大多数常规野怪巡逻漫步移速 (支持地图个体覆盖)
          patrolRadius: m.patrolRadius !== undefined ? m.patrolRadius : 30,
          appearance: m.appearance || (window.Character ? window.Character.inferMonsterType(m.name, m.id) : 'wild_wolf'),
          dialogue: [`【${m.name}】(Lv.${m.level || 5}) 呲牙咧嘴，凶煞逼人！`]
        });
        mobChar.level = m.level || 5;
        mobChar.hp = m.hp || 100;
        mobChar.maxHp = m.maxHp || mobChar.hp;
        mobChar.atk = m.atk || 20;
        mobChar.def = m.def || 10;
        mobChar.spd = m.spd || 20;
        mobChar.skills = m.skills || ['普通攻击'];
        mobChar.monsterData = m;
        mobChar.templateId = window.ShanhaiSystem.resolveSpecies(m, mapId);
        const species = window.GAME_DATA.PETS[mobChar.templateId];
        mobChar.element = species?.element || m.element;
        mobChar.quality = species?.quality || m.quality || 'ordinary';
        return mobChar;
      });
    }

    if (window.Sound && window.Sound.playBeep) {
      try { window.Sound.playBeep(); } catch (e) { }
    }
    this.updateLocationHeader(mapData.name, mapData.region);
    this.updatePlayerHud();

    // 每次过图或进入新场景，自动持久化历练进度
    this.saveAutoProgress();

    // 🌟 检查并自动触发当前章节国风开幕动画 (每个章节每位玩家只开幕一次，持久化到存档)
    this.checkAndTriggerChapterOpening(mapId, this.storyPhase);
  }

  updateLocationHeader(name, region) {
    const el = document.getElementById('scene-location-text');
    if (el) el.innerText = `🏯 ${name} (${region})`;
    const hudLoc = document.getElementById('hud-location-text');
    if (hudLoc) hudLoc.innerText = `📍 ${name}`;
  }

  updatePlayerHud() {
    const nameEl = document.getElementById('hud-player-name');
    if (nameEl) nameEl.innerText = `${this.playerData.name} (Lv.${this.playerData.level})`;
    const hpEl = document.getElementById('hud-hp-bar');
    if (hpEl) hpEl.style.width = `${Math.max(0, (this.playerData.hp / this.playerData.maxHp) * 100)}%`;
    const silverEl = document.getElementById('hud-silver');
    if (silverEl) silverEl.innerText = `${this.playerData.silver} 两`;

    const avatarCircleEl = document.getElementById('hud-avatar-circle');
    if (avatarCircleEl) {
      const isGeneral = this.playerData && (this.playerData.appearance === 'heaven_general' || (this.playerChar && this.playerChar.appearance === 'heaven_general'));
      const roleId = isGeneral ? 'heaven_general' : 'shaoxia';
      if (!avatarCircleEl.dataset.roleId || avatarCircleEl.dataset.roleId !== roleId) {
        avatarCircleEl.dataset.roleId = roleId;
        avatarCircleEl.innerHTML = window.Portraits ? window.Portraits.getPortraitSvg(roleId, 26) : '🧙‍♂️';
      }
    }
  }

  // 依据真实容器尺寸与设备像素比同步画布，保证 CSS 显示尺寸、画布属性尺寸与点击换算三者一致
  // canvas 不支持 object-fit，必须显式按 contain 语义计算信箱黑边偏移
  syncCanvasSize() {
    if (!this.canvas) return null;
    const viewport = this.canvas.parentElement || document.getElementById('game-viewport');
    const rect = viewport ? viewport.getBoundingClientRect() : null;
    const isHandheld = !document.body.classList.contains('modern-mode');
    // 逻辑基准分辨率：大屏 760x580，掌机 320x380
    const baseW = isHandheld ? 320 : 760;
    const baseH = isHandheld ? 380 : 580;
    const cssW = Math.max(1, Math.floor(rect && rect.width > 0 ? rect.width : baseW));
    const cssH = Math.max(1, Math.floor(rect && rect.height > 0 ? rect.height : baseH));

    const dpr = Math.min(3, Math.max(1, (typeof window !== 'undefined' && window.devicePixelRatio) || 1));
    const attrW = Math.max(1, Math.round(cssW * dpr));
    const attrH = Math.max(1, Math.round(cssH * dpr));

    if (this.canvas.width !== attrW) this.canvas.width = attrW;
    if (this.canvas.height !== attrH) this.canvas.height = attrH;

    // 记录逻辑视口与信箱偏移，供 screenToWorld 与指针换算使用
    this._canvasCssWidth = cssW;
    this._canvasCssHeight = cssH;
    this._canvasDpr = dpr;
    const scale = Math.min(cssW / baseW, cssH / baseH);
    this._canvasScale = scale > 0 ? scale : 1;
    this._canvasOffsetX = (cssW - baseW * this._canvasScale) / 2;
    this._canvasOffsetY = (cssH - baseH * this._canvasScale) / 2;

    if (this.camera && typeof this.camera.resize === 'function') {
      this.camera.resize(baseW, baseH);
    }
    this._vignetteGrad = null;
    return this._canvasScale;
  }

  // 将指针事件坐标换算为逻辑画布坐标（已含信箱黑边与设备像素比）
  getCanvasPointer(clientX, clientY) {
    if (!this.canvas) return { x: 0, y: 0 };
    const rect = this.canvas.getBoundingClientRect();
    const scale = this._canvasScale || 1;
    const offsetX = this._canvasOffsetX || 0;
    const offsetY = this._canvasOffsetY || 0;
    const localX = (clientX - rect.left - offsetX) / scale;
    const localY = (clientY - rect.top - offsetY) / scale;
    return { x: localX, y: localY };
  }

  // 输入监听
  bindInputs() {
    if (this._inputsBound) return;
    this._inputsBound = true;
    window.addEventListener('keydown', (e) => {
      // 输入框与最上层确认窗口优先处理，避免输入名字或取消献录时触发游戏指令。
      if (e.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      const confirmCancel = document.getElementById('confirm-modal-cancel');
      if (confirmCancel) {
        if (e.key === 'Escape') confirmCancel.click();
        if (e.key === ' ' || e.key === 'Enter' || e.key.startsWith('Arrow')) e.preventDefault();
        return;
      }
      if (e.key === ' ' || e.key.startsWith('Arrow')) e.preventDefault();
      if (e.repeat && !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(e.key)) return;
      if (window.Dialogue?.currentDialogue) {
        if (e.key === ' ' || e.key === 'Enter') window.Dialogue.next();
        else if (e.key === 'Escape') this.skipCurrentDialogue();
        return;
      }
      if (!this.currentBattle && this.hasExplorationModal()) {
        if (document.getElementById('shanhai-pet-picker-modal')) {
          if (e.key === 'Escape' || e.key === 'Tab') {
            e.preventDefault();
            this.closeShanhaiPetPickerModal();
          }
          return;
        }
        if (e.key !== 'Escape' && !(e.key === 'Tab' && document.getElementById('scene-roster-modal'))) return;
      }
      // 🔒 输入状态规范化：字母键统一小写存储，杜绝"按 a 抬 Shift 后 keyup 变 A"导致按键永久卡死
      const normalizedKey = (typeof e.key === 'string' && e.key.length === 1) ? e.key.toLowerCase() : e.key;
      this.keysDown[normalizedKey] = true;
      // 🔒 记录最近一次键盘事件时间，供失联看门狗判定 keyup 丢失 (切窗/焦点被夺/输入法吞事件)
      this._keyEventTimes = this._keyEventTimes || {};
      this._keyEventTimes[normalizedKey] = Date.now();
      if (this.currentBattle) {
        if (this.battleTargetMenuOpen) {
          if (e.key === 'Escape' || e.key === 'Backspace') {
            this.cancelCombatTargetSelection();
            return;
          }
          if (e.key >= '1' && e.key <= '9') {
            const targetNum = parseInt(e.key, 10) - 1;
            this.setCombatFocusedTarget(targetNum);
            return;
          }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            this.cycleCombatFocusedTarget(-1);
            return;
          }
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'Tab') {
            e.preventDefault();
            this.cycleCombatFocusedTarget(1);
            return;
          }
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.confirmCurrentCombatAction();
            return;
          }
        }
        if (e.key === ' ' || e.key === 'Enter') {
          if (this.battleSkillMenuOpen) {
            const curAllyId = this.selectedAllyId || 'player';
            const curAlly = this.currentBattle.allies.find(a => a.id === curAllyId) || this.currentBattle.allies[0];
            const skills = curAlly?.isPlayer ? this.playerData.getSkills() : (curAlly?.skills || []);
            if (skills.length > 0) this.onSkillButtonClick(skills[0].id);
          } else {
            this.initiateCombatAction('attack');
          }
          return;
        } else if (e.key === 'q' || e.key === 'Q') {
          this.toggleSkillMenu(!this.battleSkillMenuOpen);
          return;
        } else if (e.key === 'w' || e.key === 'W') {
          this.chooseCombatAction('defend');
          return;
        } else if (e.key === 'e' || e.key === 'E') {
          this.initiateCombatAction('item');
          return;
        } else if (e.key === 'r' || e.key === 'R') {
          this.initiateCombatAction('capture');
          return;
        }
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        this.toggleSceneRosterModal();
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        this.interactNearby();
      } else if (e.key === 'r' || e.key === 'R') {
        this.toggleMountRiding();
      } else if (e.key === 'm' || e.key === 'M') {
        this.toggleFoldableMenu();
      } else if (e.key === 'k' || e.key === 'K') {
        this.openClassSelectModal();
      } else if (e.key === 'c' || e.key === 'C') {
        this.openPlayerProfileModal();
      } else if (e.key === 'b' || e.key === 'B') {
        this.openInventoryModal();
      } else if (e.key === 'p' || e.key === 'P') {
        this.openPetManageModal();
      } else if (e.key === 'q' || e.key === 'Q') {
        this.openQuestTrackerModal();
      } else if (e.key === 'Escape') {
        // 主菜单开启时 Esc 只收菜单，不再顺带清空其它面板状态
        if (this.isMenuOpen) {
          this.toggleFoldableMenu(false);
          return;
        }
        this.toggleSceneRosterModal(false);
        if (window.Dialogue) window.Dialogue.close();
        document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
        document.querySelectorAll('.roster-modal-overlay').forEach(m => m.remove());
      }
    });

    window.addEventListener('keyup', (e) => {
      // 🔒 同步规范化并清理大小写两种可能的历史残留，任何情况下都保证按键被彻底释放
      const normalizedKey = (typeof e.key === 'string' && e.key.length === 1) ? e.key.toLowerCase() : e.key;
      this.keysDown[normalizedKey] = false;
      if (normalizedKey !== e.key) this.keysDown[e.key] = false;
      if (this._keyEventTimes) delete this._keyEventTimes[normalizedKey];
    });

    // 🔒 页面失焦/切后台兜底清键 (移动端 WebView 对 blur 不可靠，visibilitychange 更稳)
    window.addEventListener('blur', () => {
      this.keysDown = {};
    });
    if (typeof document.addEventListener === 'function') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.keysDown = {};
      });
    }

    // 画布鼠标点击 -> 智能触发 A* 寻路或交互 (带 contain 留白偏移校准与弹窗防护)
    if (this.canvas) {
      this.canvas.addEventListener('click', (e) => {
        if (this.hasExplorationModal()) return;
        const pt = this.getCanvasPointerPosition(e.clientX, e.clientY);
        if (!pt) return; // 点击在留白黑边处，安全忽略        this.handleClickCanvas(pt.x, pt.y);
      });

      // H5 触屏适配：屏蔽画布长按系统菜单与触摸拖动引发的页面滚动 (弹窗内部滚动不受影响)
      this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
      this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }

    // 窗口尺寸变化后重新同步画布，保证点击换算始终准确（含掌机/大屏切换与转屏）
    let resizeDebounce = null;
    window.addEventListener('resize', () => {
      if (resizeDebounce) clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        resizeDebounce = null;
        this.syncCanvasSize();
      }, 100);
    });

    // 名册顶部快捷按钮绑定
    const rosterBtn = document.getElementById('btn-scene-roster');
    if (rosterBtn) {
      rosterBtn.addEventListener('click', () => {
        this.toggleSceneRosterModal();
      });
    }

    // 模式切换按钮
    const modeBtn = document.getElementById('toggle-mode-btn');
    if (modeBtn) {
      modeBtn.addEventListener('click', () => {
        document.body.classList.toggle('modern-mode');
        const isModern = document.body.classList.contains('modern-mode');
        modeBtn.innerHTML = isModern ? '📱 切换掌机' : '💻 切换大屏';

        // 画布尺寸统一交由 syncCanvasSize 依据真实容器结算，不再硬编码
        this.syncCanvasSize();
        window.Sound.playBeep();
      });
    }

    // 掌机模式实体按键：五维方向键与九宫格数字键映射键盘状态，彻底恢复功能机手感
    const bindHoldButton = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      const press = (e) => {
        e.preventDefault();
        this.keysDown[key] = true;
      };
      const release = (e) => {
        if (e) e.preventDefault();
        this.keysDown[key] = false;
      };
      el.addEventListener('pointerdown', press);
      el.addEventListener('pointerup', release);
      el.addEventListener('pointerleave', release);
      el.addEventListener('pointercancel', release);
    };
    bindHoldButton('dpad-up', 'ArrowUp');
    bindHoldButton('dpad-down', 'ArrowDown');
    bindHoldButton('dpad-left', 'ArrowLeft');
    bindHoldButton('dpad-right', 'ArrowRight');
    bindHoldButton('key-2', 'ArrowUp');
    bindHoldButton('key-4', 'ArrowLeft');
    bindHoldButton('key-6', 'ArrowRight');
    bindHoldButton('key-8', 'ArrowDown');

    const bindTapButton = (id, handler) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', (e) => {
        e.preventDefault();
        handler();
      });
    };
    bindTapButton('dpad-ok', () => this.interactNearby());
    bindTapButton('key-5', () => this.interactNearby());
    bindTapButton('key-soft-left', () => this.interactNearby());
    bindTapButton('key-soft-right', () => {
      if (window.Dialogue && window.Dialogue.currentDialogue) {
        window.Dialogue.close();
      } else {
        document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
      }
    });

    // 音效一键开关 (默认关闭，支持随时一键开启/关闭)
    const soundBtn = document.getElementById('toggle-sound-btn');
    if (soundBtn) {
      soundBtn.innerHTML = (window.Sound && window.Sound.enabled) ? '🔊 音效:开' : '🔇 音效:关';
      soundBtn.addEventListener('click', () => {
        const enabled = window.Sound.toggle();
        soundBtn.innerHTML = enabled ? '🔊 音效:开' : '🔇 音效:关';
        this.updateMenuSoundLabel();
        if (enabled) {
          window.Sound.playBeep();
          window.showGameMessage('🔊 八音仙乐已开启', 'info');
        } else {
          window.showGameMessage('🔇 仙乐已静音关闭', 'info');
        }
      });
    }
  }

  // 集中计算实际绘制矩形，消除 object-fit: contain 居中黑边对点击造成的坐标偏移
  getCanvasPointerPosition(clientX, clientY) {
    if (!this.canvas) return null;
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    const localX = clientX - rect.left;
    const localY = clientY - rect.top;

    const isContain = document.body?.classList?.contains('modern-mode') ||
      (typeof window !== 'undefined' && window.getComputedStyle && window.getComputedStyle(this.canvas).objectFit === 'contain');

    if (isContain) {
      const scale = Math.min(rect.width / this.canvas.width, rect.height / this.canvas.height);
      const drawW = this.canvas.width * scale;
      const drawH = this.canvas.height * scale;
      const offsetX = (rect.width - drawW) / 2;
      const offsetY = (rect.height - drawH) / 2;

      // 处于留白黑边内，不属于画布有效画面，返回 null 阻止错误寻路
      if (localX < offsetX || localX > offsetX + drawW || localY < offsetY || localY > offsetY + drawH) {
        return null;
      }

      const clickX = (localX - offsetX) / scale;
      const clickY = (localY - offsetY) / scale;
      return {
        x: Math.max(0, Math.min(this.canvas.width, clickX)),
        y: Math.max(0, Math.min(this.canvas.height, clickY))
      };
    } else {
      return {
        x: Math.max(0, Math.min(this.canvas.width, (localX / rect.width) * this.canvas.width)),
        y: Math.max(0, Math.min(this.canvas.height, (localY / rect.height) * this.canvas.height))
      };
    }
  }

  // 场景鼠标点击智能分发
  handleClickCanvas(screenX, screenY) {
    if (this.isPaused || this.isTransitioning || this.currentBattle) return;
    // 弹窗、主菜单与章回开幕期间点击画布不得触发寻路或交互
    if (this.hasExplorationModal() || this.isMenuOpen) return;    if (window.Dialogue && window.Dialogue.currentDialogue) {
      // 用户点击了场景画布，直接解除对话并走完流程
      this.skipCurrentDialogue();
      return;
    }

    const worldPos = this.camera.screenToWorld(screenX, screenY);
    const mapData = window.GAME_DATA.MAPS_2D[this.currentMapId];
    if (!mapData) return;

    // 0. 是否点击在当前主线接引信标或其悬浮锦帛标语上
    const questTarget = this.minimap ? this.minimap.getCurrentQuestTarget(this.currentMapId, this.storyPhase, mapData) : null;
    if (questTarget) {
      const beaconDist = Math.hypot(questTarget.x - worldPos.x, questTarget.y - worldPos.y);
      const isBannerHit = Math.abs(worldPos.x - questTarget.x) <= 120 && (worldPos.y >= questTarget.y - 100 && worldPos.y <= questTarget.y - 30);
      if (beaconDist < 48 || isBannerHit) {
        // 如果身旁已在信标交互范围内部，直接触发到达
        const playerDist = Math.hypot(questTarget.x - this.playerChar.x, questTarget.y - this.playerChar.y);
        if (playerDist <= 140) {
          const questNpc = this.npcs.find(n => n.id === questTarget.npcId);
          if (questNpc && playerDist < questNpc.interactRadius) {
            this.triggerNpcDialogue(questNpc);
            return;
          }
          if (this.currentMapId === 'tiangong_palace' && this.storyPhase === 'heaven_to_water_pavilion') {
            this.storyPhase = 'heaven_pantao_start';
            this.refreshMapNpcs();
            window.showGameMessage('🌊 已到瑶池水阁。前方似乎有人争执，过去看看。', 'info', 3200);
            return;
          }
          if (this.currentMapId === 'tiangong_palace' && this.storyPhase === 'heaven_to_lingxiao') {
            this.storyPhase = 'heaven_saved_change';
            this.refreshMapNpcs();
            window.showGameMessage('🏛️ 已到凌霄殿前。殿中忽传琉璃碎响，快去查看！', 'info', 3200);
            return;
          }
        }
        // 规划寻路走向信标
        const path = this.pathfinding.findPath(
          mapData, this.tilemap,
          this.playerChar.x, this.playerChar.y,
          questTarget.x, questTarget.y
        );
        if (path.length > 0) {
          this.autoMovePath = path;
          const arrivalMapId = this.currentMapId;
          this.autoMoveTargetCallback = () => {
            if (this.currentMapId !== arrivalMapId) return;
            const questNpc = this.npcs.find(n => n.id === questTarget.npcId);
            if (questNpc && Math.hypot(questNpc.x - this.playerChar.x, questNpc.y - this.playerChar.y) < questNpc.interactRadius) {
              this.triggerNpcDialogue(questNpc);
              return;
            }
            const portal = (mapData.portals || []).find(p => Math.hypot(p.x - questTarget.x, p.y - questTarget.y) < 40);
            if (portal && Math.hypot(portal.x - this.playerChar.x, portal.y - this.playerChar.y) < 45) {
              this.tryEnterPortal(portal);
              return;
            }
            if (this.currentMapId === 'tiangong_palace' && this.storyPhase === 'heaven_to_water_pavilion') {
              this.storyPhase = 'heaven_pantao_start';
              this.refreshMapNpcs();
              window.showGameMessage('🌊 已到瑶池水阁。前方似乎有人争执，过去看看。', 'info', 3200);
            } else if (this.currentMapId === 'tiangong_palace' && this.storyPhase === 'heaven_to_lingxiao') {
              this.storyPhase = 'heaven_saved_change';
              this.refreshMapNpcs();
              window.showGameMessage('🏛️ 已到凌霄殿前。殿中忽传琉璃碎响，快去查看！', 'info', 3200);
            }
          };
          this.spawnClickRipple(questTarget.x, questTarget.y);
          window.Sound.playBeep();
          return;
        }
      }
    }

    // 1. 是否点击在 NPC 附近 (半径 36px)
    for (const npc of this.npcs) {
      const dist = Math.hypot(npc.x - worldPos.x, npc.y - worldPos.y);
      if (dist < 36) {
        const playerDist = Math.hypot(npc.x - this.playerChar.x, npc.y - this.playerChar.y);
        // 如果身旁已在交互范围内，立即触发对话
        if (playerDist < npc.interactRadius) {
          this.triggerNpcDialogue(npc);
          return;
        }
        // 否则规划 A* 寻路走到身旁并自动对话
        const path = this.pathfinding.findPath(
          mapData, this.tilemap,
          this.playerChar.x, this.playerChar.y,
          npc.x, npc.y
        );
        if (path.length > 0) {
          this.autoMovePath = path;
          const npcMapId = this.currentMapId;
          this.autoMoveTargetCallback = () => {
            const liveNpc = this.npcs.find(n => n.id === npc.id);
            if (this.currentMapId === npcMapId && liveNpc && Math.hypot(liveNpc.x - this.playerChar.x, liveNpc.y - this.playerChar.y) < liveNpc.interactRadius) {
              this.triggerNpcDialogue(liveNpc);
            }
          };
          this.spawnClickRipple(npc.x, npc.y);
          window.Sound.playBeep();
        }
        return;
      }
    }

    // 1.5 是否点击在蟠桃园仙树附近 (半径 42px，点击靠近自动弹出确认采摘)
    if (this.currentMapId === 'tiangong_pantao' && mapData.peachTrees) {
      for (const tree of mapData.peachTrees) {
        const dist = Math.hypot(tree.x - worldPos.x, tree.y - worldPos.y);
        if (dist < 44) {
          const playerDist = Math.hypot(tree.x - this.playerChar.x, (tree.y + 10) - this.playerChar.y);
          if (playerDist < 58) {
            this.confirmPickPeach(tree);
            return;
          }
          // 规划寻路走到树身旁下方并自动触发确认采摘
          const targetWalkY = Math.min(mapData.height * 32 - 40, tree.y + 36);
          const path = this.pathfinding.findPath(
            mapData, this.tilemap,
            this.playerChar.x, this.playerChar.y,
            tree.x, targetWalkY
          );
          if (path.length > 0) {
            this.autoMovePath = path;
            this.autoMoveTargetCallback = () => this.confirmPickPeach(tree);
            this.spawnClickRipple(tree.x, tree.y);
            window.Sound.playBeep();
          }
          return;
        }
      }
    }

    // 2. 是否点击在传送门附近
    if (mapData.portals) {
      for (const p of mapData.portals) {
        const dist = Math.hypot(p.x - worldPos.x, p.y - worldPos.y);
        if (dist < 32) {
          if (Math.hypot(p.x - this.playerChar.x, p.y - this.playerChar.y) < 45) {
            this.tryEnterPortal(p);
            return;
          }
          const path = this.pathfinding.findPath(
            mapData, this.tilemap,
            this.playerChar.x, this.playerChar.y,
            p.x, p.y
          );
          if (path.length > 0) {
            this.autoMovePath = path;
            this.autoMoveTargetCallback = () => this.tryEnterPortal(p);
            this.spawnClickRipple(p.x, p.y);
            window.Sound.playBeep();
          }
          return;
        }
      }
    }

    // 3. 点击空地 -> A* 避障自动走过去
    const path = this.pathfinding.findPath(
      mapData, this.tilemap,
      this.playerChar.x, this.playerChar.y,
      worldPos.x, worldPos.y
    );
    if (path.length > 0) {
      this.autoMovePath = path;
      this.autoMoveTargetCallback = null;
      this.spawnClickRipple(worldPos.x, worldPos.y);
      window.Sound.playBeep();
    }
  }

  // 统一传送门进入与等级门禁校验
  tryEnterPortal(p) {
    if (!p || this.isTransitioning) return;
    const orderedPhases = [
      'heaven_prologue', 'heaven_to_water_pavilion', 'heaven_pantao_start', 'heaven_to_lingxiao',
      'heaven_saved_change', 'heaven_saved_juanlian', 'heaven_huaguoshan', 'heaven_huaguoshan_shuilien',
      'heaven_huaguoshan_rescue', 'heaven_juling_defeated', 'heaven_final_wukong',
      'heaven_yangjian_capture', 'heaven_tiangong_trial',
      'liujiacun_start', 'liujiacun_find_mushrooms', 'liujiacun_mushrooms_collected',
      'liujiacun_go_cut_wood', 'liujiacun_wood_gathering', 'liujiacun_wood_collected',
      'liujiacun_rat_hunting', 'liujiacun_rats_cleared', 'liujiacun_go_changan',
      'changan_arrived', 'chentang_investigate', 'chentang_defeat_hooligans',
      'chentang_hooligans_done', 'chentang_boss_ready', 'chentang_boss_defeated',
      'chentang_statue_investigate', 'donghai_yecha_ready', 'donghai_dragon_arrived',
      'longgong_visit', 'chentang_guanyin_revelation', 'changan_meet_xuanzang',
      'changan_meet_taizong', 'changan_farewell', 'wuxingshan_ready', 'wuxing_freed',
      'yingchou_cleared', 'gaolao_cleared', 'huangfeng_cleared', 'liusha_cleared',
      'wuzhuang_cleared', 'baihu_first_cleared', 'baihu_second_cleared', 'baihu_cleared',
      'baoxiang_seek_princess', 'baoxiang_boss_ready', 'baoxiang_cleared',
      'pingding_scout_cleared', 'pingding_silver_cleared', 'pingding_gold_cleared', 'pingding_cleared'
    ];
    const requiredPhase = {
      changan_city: 'liujiacun_go_changan', chentangguan: 'chentang_investigate',
      donghai_coast: 'donghai_yecha_ready', shuijinggong: 'longgong_visit',
      longgong_palace: 'longgong_visit', wuxingshan: 'wuxingshan_ready',
      yingchoujian: 'wuxing_freed', heifengshan: 'yingchou_cleared',
      gaolaozhuang: 'yingchou_cleared', huangfengling: 'gaolao_cleared',
      futushan: 'huangfeng_cleared', liushahe: 'huangfeng_cleared',
      wuzhuangguan: 'liusha_cleared', baihuling: 'wuzhuang_cleared',
      baigudong: 'wuzhuang_cleared', baoxiangguo: 'baihu_cleared',
      pingdingshan: 'baoxiang_cleared', huoyundong: 'pingding_cleared'
    };
    const currentRank = orderedPhases.indexOf(this.storyPhase);
    const minimumRank = orderedPhases.indexOf(requiredPhase[p.targetMap]);
    const isWoodVisit = p.targetMap === 'wuxingshan' &&
      ['liujiacun_go_cut_wood', 'liujiacun_wood_gathering', 'liujiacun_wood_collected'].includes(this.storyPhase);
    if (minimumRank >= 0 && currentRank >= 0 && currentRank < minimumRank && !isWoodVisit) {
      this.autoMovePath = [];
      this.autoMoveTargetCallback = null;
      const angle = Math.atan2(this.playerChar.y - p.y, this.playerChar.x - p.x);
      const safe = this.ensurePlayerSafePosition(this.currentMapId,
        p.x + Math.cos(angle) * 30, p.y + Math.sin(angle) * 30);
      this.playerChar.x = safe.x;
      this.playerChar.y = safe.y;
      window.showGameMessage('前方道路尚未随主线开启。先完成当前任务，再来此处。', 'warning', 3500);
      return;
    }
    if (p.targetMap === 'huaguoshan' && this.currentMapId === 'tiangong_palace' &&
      !['heaven_huaguoshan', 'heaven_huaguoshan_shuilien', 'heaven_huaguoshan_rescue', 'heaven_juling_defeated', 'heaven_final_wukong'].includes(this.storyPhase)) {
      this.autoMovePath = [];
      this.playerChar.y = p.y - 30;
      window.showGameMessage('南天门尚未接到出征帅令。先完成天宫值守。', 'warning', 3000);
      return;
    }

    // 大雷音寺为西行终点：狮驼岭因果未了不得提前踏入
    if (p.targetMap === 'daleiyinsi' && this.storyPhase !== 'shituo_cleared') {
      this.autoMovePath = [];
      this.autoMoveTargetCallback = null;
      const angle = Math.atan2(this.playerChar.y - p.y, this.playerChar.x - p.x);
      const safe = this.ensurePlayerSafePosition(this.currentMapId,
        p.x + Math.cos(angle) * 30, p.y + Math.sin(angle) * 30);
      this.playerChar.x = safe.x;
      this.playerChar.y = safe.y;
      window.showGameMessage('岭上因果未了，佛门重地暂不开放。先了结狮驼岭的事，再来叩门。', 'warning', 3500);
      return;
    }

    // 关隘与练功区等级限制校验 (主线对应任务特许放行)
    const pLevel = (this.playerData && this.playerData.level) || (this.player && this.player.level) || 1;
    const isWuxingWoodPass = p.targetMap === 'wuxingshan' && (this.storyPhase === 'liujiacun_go_cut_wood' || this.storyPhase === 'liujiacun_wood_gathering');
    const isChentangStoryPass = p.targetMap === 'chentangguan' && (this.storyPhase === 'chentang_investigate' || this.storyPhase.startsWith('chentang_') || this.storyPhase.startsWith('donghai_') || this.storyPhase.startsWith('longgong_'));

    if (p.minLevel && pLevel < p.minLevel && !isWuxingWoodPass && !isChentangStoryPass) {
      // 玩家向后轻微反弹 28px 防止贴门循环触发
      const bounceAngle = Math.atan2(this.playerChar.y - p.y, this.playerChar.x - p.x);
      this.playerChar.x = p.x + Math.cos(bounceAngle) * 28;
      this.playerChar.y = p.y + Math.sin(bounceAngle) * 28;
      this.autoMovePath = []; // 中断自动寻路
      this.autoMoveTargetCallback = null;

      const targetMapData = window.GAME_DATA.MAPS_2D[p.targetMap];
      const targetName = targetMapData?.name || p.name;
      window.showGameMessage(
        `⛔【修仙警令】前方【${targetName}】妖气极盛（野怪凶险，需修行达到 Lv.${p.minLevel}），少侠当前仅 Lv.${pLevel}，恐有性命之忧，请先行历练！`,
        'warning',
        4500
      );
      if (window.Sound && window.Sound.playMiss) window.Sound.playMiss();
      return;
    }

    // 踏入长安城传送门：若当前为主线受刘伯钦之托赶赴长安阶段，自动推进至抵达长安
    if (p.targetMap === 'changan_city' && this.storyPhase === 'liujiacun_go_changan') {
      this.storyPhase = 'changan_arrived';
      window.showGameMessage('🏮 已抵达大唐王都·长安城！请前往茶肆向阿婆打探各方消息。', 'info', 4000);
    }

    this.loadMap(p.targetMap, { x: p.targetX, y: p.targetY }, { duration: 0.75 });
  }

  // 生成点击金色仙气光圈涟漪
  spawnClickRipple(worldX, worldY) {
    this.clickRipples.push({
      x: worldX,
      y: worldY,
      radius: 4,
      maxRadius: 22,
      alpha: 0.95
    });
  }

  // 游戏主循环 (按固定 60Hz 逻辑步长解耦渲染与帧率，30/60/120Hz 耗时手感一致，后台恢复不瞬移)
  gameLoop(timestamp) {
    requestAnimationFrame((t) => this.gameLoop(t));

    if (!timestamp) {
      this.update();
      this.render();
      return;
    }

    if (!this._lastLoopTimestamp) {
      this._lastLoopTimestamp = timestamp;
      this._loopAccumulator = 0;
    }

    let delta = timestamp - this._lastLoopTimestamp;
    this._lastLoopTimestamp = timestamp;

    // 后台切回或卡顿异常保护：限制单帧最大补进时间为 100ms (最多执行 6 次 16.6ms 逻辑步)
    if (delta > 100) delta = 100;
    if (delta < 0) delta = 0;

    this._loopAccumulator = (this._loopAccumulator || 0) + delta;
    const FIXED_STEP = 1000 / 60; // 16.6667ms
    let steps = 0;
    while (this._loopAccumulator >= FIXED_STEP && steps < 6) {
      this.update(FIXED_STEP);
      this._loopAccumulator -= FIXED_STEP;
      steps++;
    }

    // 若仍有过多余量，截断以防雪崩
    if (this._loopAccumulator > FIXED_STEP * 2) {
      this._loopAccumulator = 0;
    }

    this.render();
  }

  // 状态更新
  update() {
    if (this.isPaused || this.isTransitioning || (window.Dialogue && window.Dialogue.currentDialogue) || this.currentBattle) return;
    if ((this._pendingStoryDialogue || this._activeStoryDialogue) && this.openPendingStoryDialogue()) return;
    if (this.hasExplorationModal()) {
      this.keysDown = {};
      this.autoMovePath = [];
      this.autoMoveTargetCallback = null;
      return;
    }

    const mapData = window.GAME_DATA.MAPS_2D[this.currentMapId];
    if (!mapData) return;

    // 1. 敏捷移速与坐骑骑乘状态 (基础移速大幅提升，坐骑大幅加速，水中辟水神诀绝无迟滞)
    const baseSpeed = this.playerChar.appearance === 'heaven_general'
      ? GAME_SPEED_CONFIG.PLAYER_HEAVEN_SPEED
      : GAME_SPEED_CONFIG.PLAYER_MORTAL_SPEED;
    const speedBonus = this.mountSystem && this.mountSystem.getStatsBonus ? (this.mountSystem.getStatsBonus().speedBonus || 0) : 0;
    let finalSpeed = baseSpeed * (1 + speedBonus);

    // 🌊 龙宫与东海海域：辟水神诀加持，在水底如履平地，享受水流推力 +15% 极速畅游！
    if (this.currentMapId === 'shuijinggong' || this.currentMapId === 'longgong_palace' || this.currentMapId === 'donghai_coast') {
      finalSpeed = Math.max(finalSpeed, baseSpeed * GAME_SPEED_CONFIG.WATER_SPEED_MULTIPLIER * (1 + speedBonus));
    }

    this.playerChar.speed = finalSpeed;
    this.playerChar.isRiding = this.mountSystem.isRiding;

    // 🔒 失联按键看门狗：物理按住的方向/字母键会由系统持续派发 e.repeat keydown；
    // 若某"按住中"的键超过 1.2 秒未再收到任何键盘事件，判定其 keyup 已丢失
    // (Alt+Tab 切窗、焦点被弹窗/地址栏夺走、输入法拦截等)，强制清除防止角色卡死移动。
    if (this._keyEventTimes) {
      const nowMs = Date.now();
      for (const k of Object.keys(this._keyEventTimes)) {
        if (this.keysDown[k] && nowMs - (this._keyEventTimes[k] || 0) > 1200) {
          this.keysDown[k] = false;
          delete this._keyEventTimes[k];
        } else if (!this.keysDown[k]) {
          delete this._keyEventTimes[k];
        }
      }
    }

    // 2. 键盘手动移动检测
    let dx = 0;
    let dy = 0;
    if (this.keysDown['ArrowUp'] || this.keysDown['w'] || this.keysDown['W']) dy -= 1;
    if (this.keysDown['ArrowDown'] || this.keysDown['s'] || this.keysDown['S']) dy += 1;
    if (this.keysDown['ArrowLeft'] || this.keysDown['a'] || this.keysDown['A']) dx -= 1;
    if (this.keysDown['ArrowRight'] || this.keysDown['d'] || this.keysDown['D']) dx += 1;

    // 键盘有输入时，立刻打断自动寻路！
    if (dx !== 0 || dy !== 0) {
      this.autoMovePath = [];
      this.autoMoveTargetCallback = null;
      this._autoMoveStuckStartTime = 0;
      if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
      }
      this.playerChar.move(dx, dy, mapData, this.tilemap);
    } else if (this.autoMovePath.length > 0) {
      // 3. 执行 A* 自动寻路步进
      const targetPoint = this.autoMovePath[0];
      const dist = Math.hypot(targetPoint.x - this.playerChar.x, targetPoint.y - this.playerChar.y);
      const snapThreshold = Math.max(6, (this.playerChar.speed || 3.8) + 1);
      if (dist <= snapThreshold) {
        this.playerChar.x = targetPoint.x;
        this.playerChar.y = targetPoint.y;
        this.autoMovePath.shift();
        this._autoMoveStuckStartTime = 0;
        if (this.autoMovePath.length === 0 && this.autoMoveTargetCallback) {
          const cb = this.autoMoveTargetCallback;
          this.autoMoveTargetCallback = null;
          cb();
        }
      } else {
        const moveDx = (targetPoint.x - this.playerChar.x) / dist;
        const moveDy = (targetPoint.y - this.playerChar.y) / dist;
        const prevX = this.playerChar.x;
        const prevY = this.playerChar.y;
        this.playerChar.move(moveDx, moveDy, mapData, this.tilemap);
        if (Math.abs(this.playerChar.x - prevX) < 0.05 && Math.abs(this.playerChar.y - prevY) < 0.05) {
          this._autoMoveStuckFrames = (this._autoMoveStuckFrames || 0) + 1;
          const now = Date.now();
          if (!this._autoMoveStuckStartTime) this._autoMoveStuckStartTime = now;
          if (this._autoMoveStuckFrames > 8 || now - this._autoMoveStuckStartTime > 350) {
            this._autoMoveStuckFrames = 0;
            this._autoMoveStuckStartTime = 0;
            this.autoMovePath = [];
            this.autoMoveTargetCallback = null;
            window.showGameMessage('前路受阻，请换个落脚点或用方向键绕行。', 'warning');
          }
        } else {
          this._autoMoveStuckFrames = 0;
          this._autoMoveStuckStartTime = 0;
        }
      }
    }

    if (this.isTransitioning || this.currentBattle || window.Dialogue?.currentDialogue || mapData !== window.GAME_DATA.MAPS_2D[this.currentMapId]) return;
    // 3.5 移动停步检测与位置即时持久化防抖 (彻底确保玩家停下后的最新坐标100%存入本地)
    const isMovingNow = (dx !== 0 || dy !== 0 || this.autoMovePath.length > 0);
    if (this._wasPlayerMoving && !isMovingNow) {
      if (this._stopMoveSaveTimer) clearTimeout(this._stopMoveSaveTimer);
      this._stopMoveSaveTimer = setTimeout(() => {
        this.saveAutoProgress();
      }, 300);
    }
    this._wasPlayerMoving = isMovingNow;

    if (this.currentMapId === 'tiangong_palace' && this.storyPhase === 'heaven_to_water_pavilion') {
      const distToBeacon = Math.hypot(480 - this.playerChar.x, 384 - this.playerChar.y);
      if (distToBeacon <= 140 || (this.playerChar.x >= 365 && Math.abs(this.playerChar.y - 432) <= 125)) {
        this.storyPhase = 'heaven_pantao_start';
        this.refreshMapNpcs();
        window.showGameMessage('🌊 已到瑶池水阁。前方似乎有人争执，过去看看。', 'info', 3200);
      }
    }

    // 卷帘只在玩家真正走到凌霄殿前后登场；阶段可存档恢复。
    if (this.currentMapId === 'tiangong_palace' && this.storyPhase === 'heaven_to_lingxiao') {
      const distToLingxiao = Math.hypot(704 - this.playerChar.x, 384 - this.playerChar.y);
      if (distToLingxiao <= 140 || (this.playerChar.x >= 580 && Math.abs(this.playerChar.y - 432) <= 125)) {
        this.storyPhase = 'heaven_saved_change';
        this.refreshMapNpcs();
        window.showGameMessage('🏛️ 已到凌霄殿前。殿中忽传琉璃碎响，快去查看！', 'info', 3200);
      }
    }

    // 4. 摄像机跟随
    const mapPixelW = mapData.width * this.tilemap.tileSize;
    const mapPixelH = mapData.height * this.tilemap.tileSize;
    this.camera.follow(this.playerChar.x, this.playerChar.y, mapPixelW, mapPixelH);

    // 5. 怪物巡逻与碰撞
    for (const m of this.monsters) {
      m.updatePatrol(mapData, this.tilemap);
      const dist = Math.hypot(m.x - this.playerChar.x, m.y - this.playerChar.y);
      if (dist < 22 && Date.now() >= (this._encounterCooldownUntil || 0)) {
        this.triggerMonsterBattle(m);
        return;
      }
    }

    // 6. 传送门检测
    if (mapData.portals) {
      for (const p of mapData.portals) {
        const pDist = Math.hypot(p.x - this.playerChar.x, p.y - this.playerChar.y);
        if (pDist < 20) {
          this.tryEnterPortal(p);
          break;
        }
      }
    }

    // 7. 五行山金符压帖检测 (严控时空门禁：仅在西行启程后且未破封前可交互，严防死循环)
    if (this.currentMapId === 'wuxingshan' && this.storyPhase === 'wuxingshan_ready' && !this.isSealTriggered && !this.isSealTriggering) {
      const sealDist = Math.hypot(12 * 32 - this.playerChar.x, 3 * 32 - this.playerChar.y);
      if (sealDist < 26) {
        this.isSealTriggering = true;
        window.Dialogue.start(window.GAME_DATA.STORY_DIALOGUES.wuxing_seal_trigger);
      }
    }

    // 8. 更新环境粒子系统与马蹄踏云烟尘
    if (this.particleSystem && this.canvas) {
      this.particleSystem.update(this.currentMapId, this.canvas.width, this.canvas.height);
      if (this.playerChar.isMoving && this.playerChar.isRiding) {
        this.particleSystem.spawnHorseDust(this.playerChar.x, this.playerChar.y);
      }
    }

    // 9. 更新点击涟漪
    for (let i = this.clickRipples.length - 1; i >= 0; i--) {
      const rip = this.clickRipples[i];
      rip.radius += 1.2;
      rip.alpha -= 0.045;
      if (rip.alpha <= 0) {
        this.clickRipples.splice(i, 1);
      }
    }
  }

  // 附近 NPC 与场景交互
  interactNearby() {
    if (this.isPaused || this.isTransitioning || this.currentBattle) return;
    if (window.Dialogue.currentDialogue) {
      window.Dialogue.next();
      return;
    }

    const nearbyNpcs = this.npcs.filter(npc => Math.hypot(npc.x - this.playerChar.x, npc.y - this.playerChar.y) < npc.interactRadius)
      .sort((a, b) => Number(b.questStatus === 'available') - Number(a.questStatus === 'available') ||
        Math.hypot(a.x - this.playerChar.x, a.y - this.playerChar.y) - Math.hypot(b.x - this.playerChar.x, b.y - this.playerChar.y));
    for (const npc of nearbyNpcs) {
      const dist = Math.hypot(npc.x - this.playerChar.x, npc.y - this.playerChar.y);
      if (dist < npc.interactRadius) {
        this.triggerNpcDialogue(npc);
        return;
      }
    }

    // 蟠桃仙木靠近快捷采摘交互 (按空格或回车)
    const mapData = window.GAME_DATA.MAPS_2D[this.currentMapId];
    if (this.currentMapId === 'tiangong_pantao' && mapData && mapData.peachTrees) {
      for (const tree of mapData.peachTrees) {
        const dist = Math.hypot(tree.x - this.playerChar.x, (tree.y + 10) - this.playerChar.y);
        if (dist < 58) {
          this.confirmPickPeach(tree);
          return;
        }
      }
    }

    // 天宫水阁/凌霄巡视信标交互 (靠近直接按空格/点击互动均可顺畅推进剧情)
    if (this.currentMapId === 'tiangong_palace' && this.storyPhase === 'heaven_to_water_pavilion') {
      const dist = Math.hypot(480 - this.playerChar.x, 384 - this.playerChar.y);
      if (dist <= 150 || this.playerChar.x >= 360) {
        this.storyPhase = 'heaven_pantao_start';
        this.refreshMapNpcs();
        window.showGameMessage('🌊 已到瑶池水阁。前方似乎有人争执，过去看看。', 'info', 3200);
        return;
      }
    }
    if (this.currentMapId === 'tiangong_palace' && this.storyPhase === 'heaven_to_lingxiao') {
      const dist = Math.hypot(704 - this.playerChar.x, 384 - this.playerChar.y);
      if (dist <= 150 || this.playerChar.x >= 575) {
        this.storyPhase = 'heaven_saved_change';
        this.refreshMapNpcs();
        window.showGameMessage('🏛️ 已到凌霄殿前。殿中忽传琉璃碎响，快去查看！', 'info', 3200);
        return;
      }
    }
  }

  triggerNpcDialogue(npc) {
    if (!npc || this.currentBattle || this.isTransitioning || window.Dialogue?.currentDialogue) return;
    if (this.openPendingStoryDialogue()) return;
    // P4 趣闻小支线：两位生活 NPC 的对话按支线状态动态分发
    if (npc.id === 'npc_liujiacun_dashen') { this.playRiceThiefDialogue(); return; }
    if (npc.id === 'npc_changan_bingtan') { this.playSignBoardDialogue(); return; }
    // 天宫旧配置把李天王和太白都指向开场；按当前阶段选剧本，不能重放已完成事件。
    if (this.currentMapId === 'tiangong_palace') {
      if (npc.id === 'npc_taibai') {
        npc.dialogueKey = this.storyPhase === 'heaven_tiangong_trial' ? 'tiangong_banishment_scene' :
          this.storyPhase === 'heaven_prologue' ? 'pantao_intro' : 'tiangong_duty_reminder';
      } else if (npc.id === 'npc_litianwang') {
        npc.dialogueKey = 'litianwang_duty_reminder';
      } else if (npc.id === 'npc_change' && this.storyPhase !== 'heaven_pantao_start') {
        npc.dialogueKey = 'change_talk';
      }
    }
    window.Sound.playBeep();

    // 用户点击/交互过后，立即消除该 NPC 头顶的金色感叹号，并记录为已交互
    npc.questStatus = null;
    if (!this.interactedNpcSet) {
      this.interactedNpcSet = new Set();
    }
    this.interactedNpcSet.add(npc.id);

    // 狮驼岭：太白报信与小钻风仅在对应阶段开放；洞口按阶段三态派发
    if (npc.id === 'npc_taibai_warning' && this.storyPhase !== 'shituo_arrived') {
      window.Dialogue.start({ steps: [{ speaker: '太白金星', speakerTitle: '【临别清风】', text: '老夫的话已带到。岭上的账，你们自己算——老夫只看结局。' }] });
      return;
    }
    if (npc.id === 'npc_shituo_cavemouth') {
      npc.dialogueKey = this.storyPhase === 'shituo_cave' ? 'shituo_cave_intro' :
        this.storyPhase === 'shituo_plea' ? 'shituo_after_cave' : 'shituo_final_intro';
    }
    if (npc.id === 'npc_baigujing') {
      npc.dialogueKey = this.storyPhase === 'baihu_first_cleared' ? 'baigujing_second_encounter' :
        this.storyPhase === 'baihu_second_cleared' ? 'baigujing_third_encounter' : 'baigujing_encounter';
    }
    if (npc.id === 'npc_shawujing' && this.playerData.storyEvents?.shaseng_battle_won) {
      npc.dialogueKey = 'shaseng_reward_ready';
    }
    if (npc.id === 'npc_baihu_wukong') {
      // 仅当奖励尚未入包时才给"领取战利品"入口；
      // 已领奖后再对话只作战后收尾闲聊，不重复发奖。
      npc.dialogueKey = this.playerData?.storyRewards?.baigu_final
        ? 'baigujing_wukong_farewell'
        : 'baigujing_reward_ready';
    }
    if (npc.id === 'npc_zhenyuanzi' && this.storyPhase === 'liusha_cleared') {
      npc.dialogueKey = this.playerData.storyEvents?.wuzhuang_tree_restored ? 'zhenyuanzi_gift_ready' :
        this.playerData.storyEvents?.wuzhuang_trial_won ? 'zhenyuanzi_post_battle' : 'zhenyuanzi_encounter';
    }
    if (npc.id === 'npc_aoguang') {
      if (this.storyPhase === 'longgong_visit') {
        npc.dialogueKey = 'longgong_receive_armor';
      } else if (this.playerData.storyEvents?.donghai_trial_won && !this.playerData.storyRewards?.donghai_trial) {
        npc.dialogueKey = 'aoguang_trial_reward_ready';
      } else if (this.playerData.storyRewards?.donghai_trial) {
        npc.dialogueKey = 'aoguang_trial_cleared';
      } else {
        npc.dialogueKey = 'aoguang_talk';
      }
    }
    if (npc.id === 'npc_changan_tea' && this.storyPhase !== 'changan_arrived') {
      window.Dialogue.start({
        steps: [{
          speaker: '茶肆阿婆', speakerTitle: '【长安市井】',
          text: '客官又来了？这壶茶还热着。路上遇到新鲜事，回来讲给我听，茶钱算你半价。'
        }]
      });
      return;
    }
    if (this.storyPhase === 'baoxiang_cleared' && npc.id === 'npc_baihuaxiu') {
      npc.dialogueKey = 'baihuaxiu_homecoming';
    }
    if (this.storyPhase === 'baoxiang_cleared' && npc.id === 'npc_baoxiang_king') {
      npc.dialogueKey = 'baoxiang_king_reunion';
    }
    if (this.storyPhase === 'baoxiang_boss_ready' && npc.id === 'npc_baoxiang_king' &&
        this.playerData.storyEvents?.huangpao_battle_won) npc.dialogueKey = 'huangpao_reward_ready';
    if (npc.id === 'npc_huangpao_boss' && this.storyPhase !== 'baoxiang_boss_ready') {
      window.Dialogue.start({
        steps: [{
          speaker: '波月洞洞门', speakerTitle: '【妖雾锁关】',
          text: '洞中妖风与星光交错。先去王宫问明来龙去脉，再找到百花羞公主，才能直面奎木狼。'
        }]
      });
      return;
    }

    // 依据当前最新 storyPhase 动态匹配李靖总兵的剧情对话
    if (npc.id === 'npc_li_jing') {
      if (this.storyPhase === 'chentang_hooligans_done') {
        npc.dialogueKey = 'chentang_lijing_hooligans_done';
      } else if (this.storyPhase === 'chentang_boss_defeated') {
        npc.dialogueKey = 'chentang_lijing_reward';
      } else if (this.storyPhase === 'chentang_defeat_hooligans') {
        const count = (this.questKills && this.questKills.chentangHooligans) || 0;
        window.Dialogue.start({
          steps: [
            {
              speaker: '李靖总兵',
              speakerTitle: '【陈塘总兵】',
              speakerIcon: '👑',
              text: `壮士，街头作恶混混甚是猖獗，还请速速前去将其制伏！目前已惩戒 (${count}/4)。`
            }
          ]
        });
        return;
      } else if (this.storyPhase === 'chentang_boss_ready') {
        window.Dialogue.start({
          steps: [
            {
              speaker: '李靖总兵',
              speakerTitle: '【陈塘总兵】',
              speakerIcon: '👑',
              text: `壮士，混混头目雷震彪正带着随从直奔东市而来，事不宜迟，请速速前往截击将其一网打尽！`
            }
          ]
        });
        return;
      } else if (this.storyPhase === 'chentang_statue_investigate' || this.storyPhase === 'donghai_yecha_ready') {
        window.Dialogue.start({
          steps: [
            {
              speaker: '李靖总兵',
              speakerTitle: '【陈塘总兵】',
              speakerIcon: '👑',
              text: `东侧海滨那尊观音雕像佛光沉寂，无法言语对话。海潮正向东海翻涌，壮士可深入东海之滨探查一番！`
            }
          ]
        });
        return;
      } else if (this.storyPhase === 'chentang_investigate') {
        npc.dialogueKey = 'chentang_lijing_talk';
      }
    }

    // 依据当前最新 storyPhase 动态匹配刘家村刘伯钦的主线对话
    if (npc.id === 'npc_liuboqin') {
      if (this.storyPhase === 'liujiacun_start') {
        npc.dialogueKey = 'liuboqin_talk';
      } else if (this.storyPhase === 'liujiacun_find_mushrooms') {
        const mushrooms = (this.questKills && this.questKills.mushrooms) || 0;
        window.Dialogue.start({
          steps: [{
            speaker: '刘伯钦',
            speakerTitle: '【镇山太保】',
            speakerIcon: '🏹',
            text: `村中草地长有青蘑菇，认准青伞白柄，采 2 朵【野生青蘑菇】回来即可下锅。目前已采得 (${mushrooms}/2)。`
          }]
        });
        return;
      } else if (this.storyPhase === 'liujiacun_mushrooms_collected') {
        npc.dialogueKey = 'liuboqin_mushroom_done';
      } else if (this.storyPhase === 'liujiacun_go_cut_wood' || this.storyPhase === 'liujiacun_wood_gathering') {
        const trees = (this.questKills && this.questKills.trees) || 0;
        window.Dialogue.start({
          steps: [{
            speaker: '刘伯钦',
            speakerTitle: '【镇山太保】',
            speakerIcon: '🏹',
            text: `五行山脚下的【百年枯树精】挡了采樵路，请少侠前去击败 4 株收集坚韧柴木。目前已砍得 (${trees}/4) 捆。`
          }]
        });
        return;
      } else if (this.storyPhase === 'liujiacun_wood_collected') {
        npc.dialogueKey = 'liuboqin_wood_done';
      } else if (this.storyPhase === 'liujiacun_rat_hunting') {
        const rats = (this.questKills && this.questKills.rats) || 0;
        window.Dialogue.start({
          steps: [{
            speaker: '刘伯钦',
            speakerTitle: '【镇山太保】',
            speakerIcon: '🏹',
            text: `粮仓被【偷粮硕鼠】钻了洞，正偷吃乡亲们过冬的口粮，请少侠在田垄粮仓周围消灭 4 只硕鼠。目前已消灭 (${rats}/4) 只。`
          }]
        });
        return;
      } else if (this.storyPhase === 'liujiacun_rats_cleared') {
        npc.dialogueKey = 'liuboqin_rats_done';
      } else if (this.storyPhase === 'liujiacun_go_changan') {
        window.Dialogue.start({
          steps: [{
            speaker: '刘伯钦',
            speakerTitle: '【同赴长安】',
            speakerIcon: '🏹',
            text: '山货已经打点齐整。少侠，东门官道已开，咱们这就启程同赴大唐都城【长安城】吧！',
            options: [
              {
                text: '【🏮 立即与刘伯钦一同启程前往长安城】',
                action: () => {
                  if (window.Dialogue) window.Dialogue.close();
                  this.storyPhase = 'changan_arrived';
                  this.loadMap('changan_city', { x: 96, y: 544 });
                  window.showGameMessage('🏮 已抵达大唐王都·长安城！请前往茶肆向阿婆打探各方消息。', 'info', 4000);
                }
              },
              {
                text: '【我先在村中转转，稍后自行前往东门】'
              }
            ]
          }]
        });
        return;
      }
    }

    // 依据当前最新 storyPhase 动态匹配长安城茶肆阿婆的主线对话
    if (npc.id === 'npc_changan_tea') {
      if (this.storyPhase === 'changan_arrived' || this.storyPhase === 'liujiacun_go_changan') {
        npc.dialogueKey = 'changan_tea_news';
      } else {
        npc.dialogueKey = 'changan_tea_talk';
      }
    }

    if (window.Dialogue) {
      window.Dialogue.currentNpcId = npc.id;
    }

    if (npc.dialogueKey && window.GAME_DATA.STORY_DIALOGUES[npc.dialogueKey]) {
      window.Dialogue.start(window.GAME_DATA.STORY_DIALOGUES[npc.dialogueKey]);
    } else {
      window.Dialogue.start({
        steps: [
          {
            speaker: npc.name,
            speakerTitle: npc.title,
            text: Array.isArray(npc.dialogue) && npc.dialogue[0]
              ? npc.dialogue[0] : '远行辛苦。若是问路，请留意路口的指引；山间走动，也要给自己留条退路。'
          }
        ]
      });
    }
  }

  // 切换坐骑骑乘
  toggleMountRiding() {
    if (!this.mountSystem.getActiveMount()) {
      window.showGameMessage('少侠尚未获得坐骑！可在天宫【御马监】找弼马温挑选！', 'warning');
      return;
    }
    const isRiding = this.mountSystem.toggleRiding();
    this.playerChar.isRiding = isRiding;
    window.Sound.playSuccess();
    const btn = document.getElementById('quick-ride-btn');
    if (btn) btn.innerText = isRiding ? '🏇 状态:骑乘中' : '🚶 状态:步行中';
    window.showGameMessage(isRiding ? '🏇 已翻身上马疾驰，移动速度提升！' : '🚶 已翻身下马改为步行。', 'info');
  }

  // 挑选坐骑 (三大门派专属：龙马-金刚专属、飞剑-神仙专属、狮子-妖魔专属)
  showChooseMountModal() {
    if (window.Dialogue) window.Dialogue.close();
    document.querySelectorAll('.choose-mount-modal').forEach(m => m.remove());

    const playerClass = this.playerData.classId || this.playerData.class || 'jingang';
    const isClassMatched = (pClass, reqClass) => {
      if (!reqClass) return true;
      if (reqClass === pClass) return true;
      if (reqClass === 'xianren' && (pClass === 'shenxian' || pClass === 'xianren')) return true;
      return false;
    };

    const selectableMounts = [
      window.MountSystem.TEMPLATES.long_ma,
      window.MountSystem.TEMPLATES.feijian,
      window.MountSystem.TEMPLATES.yan_shi
    ].filter(Boolean);

    const modalHtml = `
      <div class="modal-overlay choose-mount-modal" onclick="this.remove()">
        <div class="modal-window" onclick="event.stopPropagation()" style="max-width:380px;background:radial-gradient(circle at 50% 10%, #2b1d14 0%, #150f0b 100%);border:2px solid #8d6b38;box-shadow:0 0 25px rgba(0,0,0,0.9);">
          <div class="modal-header" style="background:linear-gradient(90deg, #44301e, #241b16);padding:12px 14px;">
            <span class="modal-title" style="color:#fde047;font-size:15px;letter-spacing:1px;">🐎 御马监 · 挑选三界专属坐骑</span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body" style="padding:12px;">
            <div style="font-size:11px;color:#d4c4b0;margin-bottom:10px;line-height:1.6;background:rgba(0,0,0,0.35);padding:8px 10px;border-radius:6px;border:1px solid #4a331c;">
              弼马温：“天厩灵兽分为<span style="color:#f39c12;font-weight:bold;">金刚龙马</span>、<span style="color:#38bdf8;font-weight:bold;">神仙飞剑</span>与<span style="color:#ef4444;font-weight:bold;">妖魔赤狮</span>，挑选你门派的专属灵骑吧！”
            </div>
            ${selectableMounts.map(tpl => {
              const matched = isClassMatched(playerClass, tpl.reqClass);
              return `
                <div class="action-card" style="margin-bottom:10px;padding:10px;border:1.5px solid ${matched ? '#d4af37' : '#4a331c'};background:${matched ? 'rgba(50,32,18,0.7)' : 'rgba(20,15,12,0.6)'};border-radius:8px;cursor:pointer;transition:all 0.2s;box-shadow:${matched ? '0 0 10px rgba(212,175,55,0.2)' : 'none'};" onclick="window.App2D.selectInitialMount('${tpl.id}', this);">
                  <div class="action-left" style="display:flex;align-items:center;gap:12px;">
                    <div style="width:40px;height:40px;background:#24170f;border:1.5px solid ${matched ? '#ffd700' : '#665039'};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">
                      ${tpl.icon}
                    </div>
                    <div>
                      <div style="font-weight:bold;color:${matched ? '#fef08a' : '#aaa'};font-size:13px;display:flex;align-items:center;gap:6px;">
                        ${tpl.name}
                        <span style="font-size:10px;padding:1px 6px;border-radius:4px;background:${matched ? '#854d0e' : '#33271d'};color:${matched ? '#fef08a' : '#888'};border:1px solid ${matched ? '#eab308' : '#554131'};">
                          ${tpl.tier}
                        </span>
                      </div>
                      <div style="font-size:10.5px;color:#c4b5a0;margin-top:2px;">
                        气血+${tpl.baseHp} · 攻击+${tpl.baseAtk} · 移速+${Math.floor(tpl.speedBonus * 100)}%
                      </div>
                      <div style="font-size:9.5px;color:#8d7966;margin-top:2px;">
                        ${tpl.desc}
                      </div>
                    </div>
                  </div>
                  <div class="action-right" style="color:${matched ? '#ffd700' : '#887766'};font-weight:bold;font-size:12px;margin-top:6px;text-align:right;">
                    ${matched ? '选择领养' : `需【${tpl.reqClassName}】专属`}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
    const viewport = document.getElementById('game-viewport') || document.body;
    viewport.insertAdjacentHTML('beforeend', modalHtml);
  }

  selectInitialMount(templateId, clickedEl = null) {
    const tpl = window.MountSystem.TEMPLATES[templateId];
    if (!tpl) return;
    const playerClass = this.playerData.classId || this.playerData.class || 'jingang';
    const isMatched = !tpl.reqClass || tpl.reqClass === playerClass || (tpl.reqClass === 'xianren' && (playerClass === 'shenxian' || playerClass === 'xianren'));
    if (!isMatched) {
      window.Sound.playBeep();
      window.showGameMessage(`⚠️【${tpl.name}】为【${tpl.reqClassName}】职业专属坐骑！少侠当前门派无法驾驭，请选择本门专属坐骑！`, 'warning', 3500);
      return;
    }
    const mount = this.mountSystem.addMount(templateId);
    this.mountSystem.isRiding = true;
    this.playerChar.isRiding = true;
    this.playerData.recalculateStats(false);
    window.Sound.playLevelUp();
    this.updatePlayerHud();
    if (clickedEl) {
      const modal = clickedEl.closest('.modal-overlay');
      if (modal) modal.remove();
    } else {
      document.querySelectorAll('.choose-mount-modal').forEach(m => m.remove());
    }
    window.showGameMessage(`🎉 恭喜获得本门专属坐骑【${mount.name}】！气血上限+${mount.currentHp}，攻击+${mount.currentAtk}！翻身上马疾驰！`, 'success', 4000);
  }

  // 坐骑面板
  openMountModal() {
    if (window.Dialogue) window.Dialogue.close();

    const mount = this.mountSystem.getActiveMount();
    if (!mount) {
      window.showGameMessage('暂无坐骑！可前往天宫御马监找弼马温挑选！', 'warning');
      return;
    }

    const modalHtml = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-window" onclick="event.stopPropagation()" style="max-width:340px;">
          <div class="modal-header">
            <span class="modal-title">🐎 坐骑驯化与进阶</span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body">
            <div style="text-align:center;margin-bottom:8px;">
              <div style="font-size:15px;font-weight:bold;color:#f39c12;margin-bottom:2px;">${mount.name} (Lv.${mount.level}/${mount.maxLevel})</div>
              <div style="font-size:10px;color:#2ecc71;">阶位：${mount.tier} · 状态：${this.mountSystem.isRiding ? '已乘骑' : '跟随'}</div>
            </div>

            <div style="background:#1b150f;padding:8px;border-radius:6px;border:1px solid #5c4732;font-size:11px;line-height:1.7;margin-bottom:8px;">
              <div>❤️ 为主人气血加成：<span style="color:#2ecc71;font-weight:bold;">+${mount.currentHp} HP</span></div>
              <div>⚔️ 为主人攻击加成：<span style="color:#e67e22;font-weight:bold;">+${mount.currentAtk} ATK</span></div>
              <div>💨 飞奔移动速度加成：<span style="color:#3498db;font-weight:bold;">+${Math.floor(mount.speedBonus * 100)}%</span></div>
              <div>🪙 现有银两：<span style="color:#ffd700;">${this.playerData.silver} 两</span></div>
            </div>

            <div style="display:flex;gap:6px;margin-bottom:8px;">
              <button class="dialogue-opt-btn" onclick="window.App2D.trainActiveMount(1); this.closest('.modal-overlay').remove();" style="flex:1;">
                驯化提升 1 级 (${500 + mount.level * 150}两)
              </button>
              <button class="dialogue-opt-btn" onclick="window.App2D.trainActiveMount(5); this.closest('.modal-overlay').remove();" style="flex:1;background:#5c1d18;">
                精训连升 5 级 (按实际可升级数收费)
              </button>
            </div>

            <button class="dialogue-opt-btn" onclick="window.App2D.toggleMountRiding(); this.closest('.modal-overlay').remove();" style="width:100%;">
              ${this.mountSystem.isRiding ? '🚶 下马改为步行' : '🏇 翻身上马疾驰'}
            </button>
          </div>
        </div>
      </div>
    `;
    const viewport = document.getElementById('game-viewport') || document.body;
    viewport.insertAdjacentHTML('beforeend', modalHtml);
  }

  trainActiveMount(times) {
    const mount = this.mountSystem.getActiveMount();
    if (!mount) return;
    const res = this.mountSystem.trainMount(mount.id, this.playerData, times);
    this.updatePlayerHud();
    window.showGameMessage(res.msg, res.success ? 'success' : 'warning');
    if (res.success) {
      this.openMountModal();
    }
  }

  // 神行直达天宫·蟠桃胜境实景采摘
  teleportToPeachGarden() {
    if (window.Dialogue) window.Dialogue.close();
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());

    if (this.currentMapId === 'tiangong_pantao') {
      window.showGameMessage('🍑 已身在蟠桃胜境！请移步走向园中大仙树，靠近即可确认采摘！', 'info');
      return;
    }

    // 记录进入蟠桃园前的位置坐标与地图，供最下方土地公引渡传送返回
    this.peachGardenReturnPoint = {
      mapId: this.currentMapId || 'liujiacun',
      x: this.playerChar ? this.playerChar.x : (this.playerSpawn ? this.playerSpawn.x : 23 * 32),
      y: this.playerChar ? this.playerChar.y : (this.playerSpawn ? this.playerSpawn.y : 10 * 32)
    };

    window.Sound.playSuccess();
    this.loadMap('tiangong_pantao', { x: 13 * 32, y: 12 * 32 });
    window.showGameMessage('✨ 仙气腾腾！你已借遁法神行飞升进入天界【蟠桃胜境】！园中大仙树上挂有熟透仙桃，靠近确认即可采摘吞服！园子最下方有土地公可助你返回！', 'success', 4500);
  }

  // 蟠桃园土地公遁法：返回刚才来的位置、刘家村或居住地
  teleportFromPeachGarden(target = 'previous') {
    if (window.Dialogue) window.Dialogue.close();
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());

    if (target === 'previous') {
      if (this.peachGardenReturnPoint && this.peachGardenReturnPoint.mapId && this.peachGardenReturnPoint.mapId !== 'tiangong_pantao') {
        const pt = this.peachGardenReturnPoint;
        const targetMap = pt.mapId;
        const targetCoords = { x: pt.x, y: pt.y };
        if (window.Sound) window.Sound.playSuccess();
        this.loadMap(targetMap, targetCoords);
        const mapName = (window.GAME_DATA && window.GAME_DATA.MAPS_2D && window.GAME_DATA.MAPS_2D[targetMap]?.name) || targetMap;
        window.showGameMessage(`✨ 土地公念咒引动缩地金光，已将你安全送回刚才所在之地【${mapName}】！`, 'success', 3500);
      } else {
        // 无记忆位置时默认返回刘家村
        this.teleportFromPeachGarden('liujiacun');
      }
    } else if (target === 'liujiacun') {
      if (window.Sound) window.Sound.playSuccess();
      this.loadMap('liujiacun', { x: 23 * 32, y: 10 * 32 });
      window.showGameMessage('🌿 土地公念动土遁真言，已将你安然送回两界山·刘家村！', 'info', 3500);
    } else if (target === 'residence') {
      this.teleportToResidence();
    }
  }

  // 兼容旧入口：改为神行前往蟠桃园实景大仙树前采摘
  openPeachModal() {
    this.teleportToPeachGarden();
  }

  // 靠近实体大仙树弹出确认采摘交互
  confirmPickPeach(tree) {
    if (window.Dialogue) window.Dialogue.close();
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());

    const remaining = this.peachGarden.getRemainingChances();
    if (remaining <= 0) {
      window.showGameMessage('今日天庭蟠桃采摘仙露机缘已用尽（3/3次），明日卯时仙露重新滋养后再来采摘吧！', 'warning', 3500);
      return;
    }

    if (tree.isHarvested) {
      window.showGameMessage(`【${tree.name}】树上的仙桃方才已被采摘吞服，仙芽正萌润中！请移步采摘园中其他大仙树！`, 'info', 3500);
      return;
    }

    const tierInfo = window.PeachGarden.TIERS[tree.tier] || window.PeachGarden.TIERS['tier_3000'];

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-window" onclick="event.stopPropagation()" style="max-width:350px;border:2px solid #ff7675;background:linear-gradient(135deg, #2b1118 0%, #15090e 100%);">
        <div class="modal-header" style="border-bottom:1px solid #ff7675;">
          <span class="modal-title" style="color:#ff9ff3;">🍑 确认采摘先天蟠桃</span>
          <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
        </div>
        <div class="modal-body" style="text-align:center;padding:16px;">
          <div style="font-size:42px;margin-bottom:6px;animation:pulse 1.5s infinite;filter:drop-shadow(0 0 12px #ff6b81);">🍑</div>
          <div style="font-size:15px;font-weight:bold;color:#ffd700;margin-bottom:4px;">${tree.name}</div>
          <div style="font-size:11px;color:#ff9ff3;font-weight:bold;margin-bottom:8px;">${tierInfo.name}</div>
          <div style="background:rgba(0,0,0,0.45);border:1px solid #5a2636;border-radius:6px;padding:10px;margin-bottom:12px;text-align:left;font-size:11px;color:#f5cd79;line-height:1.6;">
            <div>📖 仙珍玄妙：<span style="color:#eee;">${tierInfo.desc}</span></div>
            <div>🌟 吞服收益：<span style="color:#2ecc71;font-weight:bold;">海量修为经验 +${tierInfo.baseExp} 点！</span></div>
            <div>🎁 伴生造化：<span style="color:#74b9ff;">天材地宝仙缘</span></div>
          </div>
          <div style="font-size:11px;color:#ffbe76;margin-bottom:14px;">
            今日剩余采摘吞服机缘：<span style="color:#ffd700;font-weight:bold;font-size:14px;">${remaining}</span> / 3 次
          </div>
          <div style="display:flex;gap:10px;justify-content:center;">
            <button class="dialogue-opt-btn" id="btn-do-pick-peach" style="background:linear-gradient(180deg,#e84393,#c0392b);border:1px solid #ff9ff3;padding:8px 18px;font-weight:bold;color:#fff;">
              ✨ 确认采摘并吞服
            </button>
            <button class="dialogue-opt-btn" onclick="this.closest('.modal-overlay').remove()" style="background:#34495e;padding:8px 14px;color:#ddd;">
              暂且留赏
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#btn-do-pick-peach').onclick = () => {
      modal.remove();
      this.executeEatPeach(tree);
    };
  }

  // 执行吃桃，大额增加经验与播放仙家光效
  executeEatPeach(tree) {
    const res = this.peachGarden.eatPeach(tree.tier, this.playerData, this.inventory);
    if (res.success) {
      tree.isHarvested = true;
      window.Sound.playLevelUp();
      this.updatePlayerHud();

      // 仙家祥云灵光飘落特效
      if (this.particleSystem) {
        for (let i = 0; i < 20; i++) {
          this.particleSystem.spawnCombatSpark(this.playerChar.x + (Math.random() - 0.5) * 60, this.playerChar.y + (Math.random() - 0.5) * 60);
        }
      }

      window.showGameMessage(res.msg, 'success', 5000);
      setTimeout(() => {
        window.showGameMessage('🌿 仙桃已入腹大增道行！采摘完毕可与蟠桃园土地公对话，遁法返回刘家村或居住地！', 'info', 4000);
      }, 2500);
    } else {
      window.showGameMessage(res.msg, 'warning');
    }
  }

  // =========================================================================
  // 📜 角色仙籍面板 (五维潜能自由分配、门派绝技查看、装备抗性加成)
  // =========================================================================
  // =========================================================================
  // 个人信息与状态面板 (1:1 像素级复刻图3：正统深紫褐暗纹锦缎、四极雷达罗盘、11项金菱条目)
  // =========================================================================
  openPlayerProfileModal() {
    if (window.Dialogue) window.Dialogue.close();
    document.querySelectorAll('.profile-v3-overlay, .modal-overlay').forEach(m => m.remove());

    const p = this.playerData;
    const nextExp = p.getNextLevelExp();
    const isPanda = p.name.includes('熊猫') || (this.playerChar && this.playerChar.appearance === 'panda_hero');

    const gold = Math.floor(p.silver / 1000);
    const taels = p.silver % 1000;

    const modalHtml = `
      <div class="profile-v3-overlay" onclick="this.remove()">
        <div class="profile-v3-window" onclick="event.stopPropagation()">
          <!-- 顶部金色中式门扣牌坊 -->
          <div class="profile-v3-top-crest"></div>
          <button class="profile-v3-close" onclick="this.closest('.profile-v3-overlay').remove()" title="关闭 (Esc)">✕</button>

          <!-- 1. 顶部身份与四极雷达上半区 (复刻图3左右双栏) -->
          <div class="profile-v3-header">
            <!-- 左侧身份名片 -->
            <div class="profile-v3-identity">
              <!-- 圆形金色双环发光头像 (支持点击一键切换少侠/熊猫大侠/天将造型) -->
              <div class="profile-v3-avatar-ring" onclick="window.App2D.togglePlayerAppearance()" style="cursor:pointer;" title="点击切换造型 (少侠 / 熊猫大侠 / 威灵神将)">
                <canvas id="profile-avatar-canvas" class="profile-v3-avatar-canvas" width="60" height="60"></canvas>
              </div>

              <!-- 身份文字信息 -->
              <div class="profile-v3-id-info">
                <div class="profile-v3-name">${p.name}</div>
                <div class="profile-v3-subid">ID: ${p.id || 2058}</div>
                <div class="profile-v3-subid" style="color:#ffd700;font-size:9.5px;cursor:pointer;" onclick="window.App2D.togglePlayerAppearance()">🔄 点击头像切换造型</div>
                <!-- 徽章三件套：LV胶囊 + 【仙】古印 + 五行水波印 -->
                <div class="profile-v3-badges-row">
                  <div class="profile-v3-lv-pill">
                    <span class="profile-v3-lv-txt">LV</span>
                    <span class="profile-v3-lv-num">${p.level}</span>
                  </div>
                  <div class="profile-v3-xian-seal" title="仙界正统仙籍">仙</div>
                  <div class="profile-v3-wuxing-icon" title="五行命属：天一生水">♒</div>
                </div>
                <!-- 红底金边【仙童】小牌匾 -->
                <div class="profile-v3-plaque">
                  <span class="profile-v3-plaque-dash">―</span>
                  <span class="profile-v3-plaque-text">${p.level >= 50 ? '大 将' : (p.level >= 30 ? '散 仙' : '仙 童')}</span>
                  <span class="profile-v3-plaque-dash">―</span>
                </div>
              </div>
            </div>

            <!-- 右侧四极潜能雷达罗盘 (体、力、敏、法) -->
            <div class="profile-v3-radar-box">
              <canvas id="profile-radar-canvas" class="profile-v3-radar-canvas" width="160" height="120"></canvas>
            </div>
          </div>

          <!-- 2. 下半区：11项深褐金角锦缎属性条目 (复刻图3金菱形条目) -->
          <div class="profile-v3-list">
            <!-- 🌟 待分配潜能点 (直接置于内容首行，点击即可进入四维加点分配) -->
            <div class="profile-v3-row" onclick="window.App2D.openStatAllocationModal('hero');" style="background:rgba(180,83,9,0.28);border:1.5px solid rgba(245,158,11,0.55);cursor:pointer;" title="点击立刻进行修为潜能分配">
              <span class="profile-v3-label" style="color:#fef08a;font-weight:bold;">🌟 待分配潜能: <span style="color:#00ffcc;font-size:13.5px;font-weight:bold;">${p.potentialPoints} 点</span></span>
              <span class="profile-v3-arrow" style="color:#ffd700;font-weight:bold;">点击分配 ✦</span>
            </div>
            <div class="profile-v3-row" onclick="window.App2D.toggleMountRiding(); window.App2D.openPlayerProfileModal();">
              <span class="profile-v3-label">坐骑: ${this.playerChar && this.playerChar.isRiding ? '白龙神驹 (骑乘中)' : '暂无骑乘中坐骑'}</span>
              <span class="profile-v3-arrow">✦</span>
            </div>
            <div class="profile-v3-row" onclick="window.showGameMessage('🎖️ 至尊VIP仙府特权已激活，战斗与历练获享专属庇佑！', 'info');">
              <span class="profile-v3-label">会员等级: 非会员</span>
              <span class="profile-v3-arrow">✦</span>
            </div>
            <div class="profile-v3-row">
              <span class="profile-v3-label">升级: 需${Math.max(0, nextExp - p.exp)}经验</span>
              <span class="profile-v3-arrow">✦</span>
            </div>
            <div class="profile-v3-row">
              <span class="profile-v3-label">升级效率: 104%(官方包+5%)</span>
              <span class="profile-v3-arrow">✦</span>
            </div>
            <div class="profile-v3-row">
              <span class="profile-v3-label">体力值: 正常[0]</span>
              <span class="profile-v3-arrow">✦</span>
            </div>
            <div class="profile-v3-row">
              <span class="profile-v3-label">五行属性: 水</span>
              <span class="profile-v3-arrow">✦</span>
            </div>
            <div class="profile-v3-row">
              <span class="profile-v3-label">活力值: 40</span>
              <span class="profile-v3-arrow">✦</span>
            </div>
            <div class="profile-v3-row">
              <span class="profile-v3-label">钱: ${gold}金 ${taels}两</span>
              <span class="profile-v3-arrow">✦</span>
            </div>
            <div class="profile-v3-row">
              <span class="profile-v3-label">绑银: 7400两</span>
              <span class="profile-v3-arrow">✦</span>
            </div>
            <div class="profile-v3-row">
              <span class="profile-v3-label">居住地: ${this.currentMapId === 'tiangong_palace' ? '九天凌霄' : (this.currentMapId === 'changan_city' ? '大唐长安' : '刘家村')}</span>
              <span class="profile-v3-arrow">✦</span>
            </div>
            <div class="profile-v3-row" onclick="window.showGameMessage('🚩 仙门帮派广招豪杰，可在长安城大唐行馆创建或加入仙盟！', 'info');">
              <span class="profile-v3-label">帮派: 无</span>
              <span class="profile-v3-arrow">✦</span>
            </div>
          </div>

          <!-- 3. 底部修真箴言与关闭操作 -->
          <div class="profile-v3-footer" style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;">
            <span style="font-size:10.5px;color:#a89278;">修真本心 · 历劫证道</span>
            <button class="dialogue-opt-btn" onclick="this.closest('.profile-v3-overlay').remove()" style="padding:2px 10px;font-size:11px;">关闭</button>
          </div>
        </div>
      </div>
    `;

    const v = document.body;
    v.insertAdjacentHTML('beforeend', modalHtml);
    if (window.Sound) window.Sound.playBeep();

    // 绘制头像与四极潜能雷达
    this.renderProfileV3Avatar(isPanda);
    this.renderProfileV3Radar();
  }

  // 绘制图3左上角圆形头像 (工笔重彩神级特写)
  renderProfileV3Avatar(isPanda) {
    const cvs = document.getElementById('profile-avatar-canvas');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, 60, 60);

    const isGeneral = this.playerData && (this.playerData.appearance === 'heaven_general' || (this.playerChar && this.playerChar.appearance === 'heaven_general'));
    const roleId = isPanda ? 'panda_warrior' : (isGeneral ? 'heaven_general' : 'shaoxia');

    if (window.Portraits && typeof window.Portraits.drawAvatarOnCanvas === 'function') {
      window.Portraits.drawAvatarOnCanvas(ctx, roleId, 60);
    } else {
      // 优雅保底渲染
      const grad = ctx.createRadialGradient(30, 30, 5, 30, 30, 30);
      grad.addColorStop(0, '#5a1212');
      grad.addColorStop(0.7, '#2a0a0a');
      grad.addColorStop(1, '#150505');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 60, 60);
      ctx.save();
      if (isPanda) {
        CharacterRenderer.drawPandaHero(ctx, 42, 0, 'right', false, false);
      } else {
        CharacterRenderer.drawMartialHero(ctx, 42, 0, 'right', false, false);
      }
      ctx.restore();
    }
  }

  // 点击个人面板头像一键切换角色造型 (大唐少侠 / 蜀山功夫熊猫大侠 / 威灵显赫神将)
  togglePlayerAppearance() {
    if (!this.playerChar) return;
    const cur = this.playerChar.appearance;
    let nextApp = 'panda_hero';
    let nextName = '蜀山功夫熊猫大侠 (熊猫凶猛)';
    if (cur === 'panda_hero') {
      nextApp = 'heaven_general';
      nextName = '威灵显赫金甲神将';
    } else if (cur === 'heaven_general') {
      nextApp = 'martial_hero';
      nextName = '大唐仗剑少侠';
    } else {
      nextApp = 'panda_hero';
      nextName = '蜀山功夫熊猫大侠 (熊猫凶猛)';
    }

    this.playerChar.appearance = nextApp;
    if (this.playerData) {
      this.playerData.appearance = nextApp;
    }

    const isPanda = nextApp === 'panda_hero';
    this.renderProfileV3Avatar(isPanda);

    if (window.showGameMessage) {
      window.showGameMessage(`✨ 角色外貌已切换为：【${nextName}】！`, 'success');
    }
  }

  // =========================================================================
  // 🌟 汉风西游 - 2秒国风章回体震撼开幕动画系统 (ChapterOpeningSystem)
  // 水墨展卷、金光劈空裂痕、烫金流光大字、七言绝句对联、朱砂御篆神印
  // =========================================================================
  showChapterOpening(chapterInput, onComplete = null) {
    let config = null;
    if (typeof chapterInput === 'string') {
      if (window.GAME_DATA && window.GAME_DATA.CHAPTER_CONFIGS && window.GAME_DATA.CHAPTER_CONFIGS[chapterInput]) {
        config = window.GAME_DATA.CHAPTER_CONFIGS[chapterInput];
      } else {
        config = {
          title: chapterInput,
          subtitle: '西游万古弘誓愿，荡魔诛邪踏征程',
          seal: '西游正传'
        };
      }
    } else if (typeof chapterInput === 'object' && chapterInput) {
      config = chapterInput;
    } else {
      if (typeof onComplete === 'function') onComplete();
      return;
    }

    const title = config.title || '西游正传';
    const subtitle = config.subtitle || '九万里西行求真经，荡魔斩妖立正果';
    const seal = config.seal || '西游正传';
    const duration = config.duration || 2000; // 精准 2 秒 (2000ms)

    if (typeof document === 'undefined') {
      if (typeof onComplete === 'function') onComplete();
      return;
    }

    // 移除已有开幕节点（若有）
    const existing = document.getElementById('chapter-opening-overlay');
    if (existing && existing.parentNode) {
      existing.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'chapter-opening-overlay';
    overlay.className = 'chapter-opening-overlay';
    if (this.isReducedMotionEnabled && this.isReducedMotionEnabled()) {
      overlay.classList.add('reduced-motion');
    }

    // 画卷展开式章回开幕：左右木轴自中央向两侧舒卷，画心 (山海画卷) 随之显现，题字渐显
    overlay.innerHTML = `
      <div class="chapter-opening-brand">✦ 汉 风 西 游 · 章 回 演 义 ✦</div>
      <div class="chapter-scroll-stage">
        <div class="chapter-scroll-paper">
          <div class="chapter-scroll-art"></div>
          <div class="chapter-scroll-content">
            <div class="chapter-opening-tag">✦ JOURNEY TO THE WEST ✦</div>
            <div class="chapter-opening-title">${title}</div>
            <div class="chapter-opening-poem">${subtitle}</div>
            <div class="chapter-opening-seal-wrap">
              <span class="chapter-opening-seal">【 ${seal} 】</span>
            </div>
          </div>
        </div>
        <div class="chapter-scroll-roller chapter-scroll-roller-left"><i></i><i></i></div>
        <div class="chapter-scroll-roller chapter-scroll-roller-right"><i></i><i></i></div>
        <div class="chapter-scroll-shadow"></div>
      </div>
      <div class="chapter-opening-skip">点击屏幕任意位置跳过</div>
    `;

    const viewport = document.getElementById('game-viewport') || document.querySelector('.phone-screen-frame') || document.body;
    viewport.appendChild(overlay);

    if (window.Sound) {
      try {
        if (typeof window.Sound.playSuccess === 'function') {
          window.Sound.playSuccess();
        }
      } catch (e) { }
    }

    let isClosed = false;
    const closeOpening = () => {
      if (isClosed) return;
      isClosed = true;
      overlay.classList.remove('active');
      overlay.classList.add('fade-out');
      setTimeout(() => {
        if (overlay && overlay.parentNode) {
          overlay.remove();
        }
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, 400);
    };

    // 支持点击屏幕任意位置立即跳过
    if (typeof overlay.addEventListener === 'function') {
      overlay.addEventListener('click', () => {
        closeOpening();
      });
    } else {
      overlay.onclick = () => {
        closeOpening();
      };
    }

    // 动效启动
    setTimeout(() => {
      if (!isClosed && overlay) overlay.classList.add('active');
    }, 20);

    // 持续时间到达 (1600ms 开始淡出，2000ms 彻底完成)
    const fadeOutDelay = Math.max(800, duration - 400);
    setTimeout(() => {
      closeOpening();
    }, fadeOutDelay);
  }

  // 兼容老版本调用，直接复用全新 2s 开幕动画
  showChapterBanner(title, subtitle, seal = '西游正传', duration = 2000, onComplete = null) {
    this.showChapterOpening({ title, subtitle, seal, duration }, onComplete);
  }

  // 章节自动判定与触发器 (每章节每位玩家只开幕一次，严格跟随主线剧情进度，持久化到存档)
  checkAndTriggerChapterOpening(mapId, storyPhase, onDone = null) {
    if (!this.shownChapterSet) {
      this.initShownChapterSet();
    }

    const configs = (window.GAME_DATA && window.GAME_DATA.CHAPTER_CONFIGS) || {};
    let matchedChapterKey = null;
    const currentPhase = storyPhase || this.storyPhase || '';

    // 1. 序章：天宫蟠桃盛会 (天宫初始阶段)
    if (mapId === 'tiangong_palace' && (!currentPhase || currentPhase.startsWith('heaven_') || currentPhase === 'pantao_intro' || currentPhase.startsWith('tiangong_'))) {
      if (!this.shownChapterSet.has('prologue')) {
        matchedChapterKey = 'prologue';
      }
    }
    // 2. 第一回：凡尘刘家村 (凡间初醒/刘家村初期阶段)
    else if (mapId === 'liujiacun' && (!currentPhase || currentPhase === 'tiangong_fallen' || currentPhase.startsWith('liujiacun_'))) {
      if (!this.shownChapterSet.has('chapter_1')) {
        matchedChapterKey = 'chapter_1';
      }
    }
    // 3. 第二回：大唐长安城 (受托前往长安盛京或已到长安阶段，刘家村早期绝不触发)
    else if (mapId === 'changan_city' || mapId === 'changan_shendan') {
      const isLiuEarly = currentPhase.startsWith('liujiacun_') && currentPhase !== 'liujiacun_go_changan';
      if (!isLiuEarly && !this.shownChapterSet.has('chapter_2')) {
        matchedChapterKey = 'chapter_2';
      }
    }
    // 4. 第三回：东海陈塘关与东海龙宫
    else if (mapId === 'chentangguan' || mapId === 'donghai_coast' || mapId === 'longgong_palace' || mapId === 'shuijinggong') {
      if (!this.shownChapterSet.has('chapter_3')) {
        matchedChapterKey = 'chapter_3';
      }
    }
    // 5. 第四回：两界山五行山 (核心门禁：刘家村砍柴阶段走到五行山绝不展开！必须是刘家村与刘伯钦告别、西行正式启程后初入才展开)
    else if (mapId === 'wuxingshan') {
      const isLiuEarly = currentPhase.startsWith('liujiacun_') || currentPhase.startsWith('tiangong_');
      if (!isLiuEarly && !this.shownChapterSet.has('chapter_4')) {
        matchedChapterKey = 'chapter_4';
      }
    }
    // 6. 第五回：鹰愁涧 (五行山大圣脱困破封后初入才展开)
    else if (mapId === 'yingchoujian') {
      const isPreWuxing = currentPhase.startsWith('liujiacun_') || currentPhase.startsWith('tiangong_') || currentPhase === 'wuxingshan_ready';
      if (!isPreWuxing && !this.shownChapterSet.has('chapter_5')) {
        matchedChapterKey = 'chapter_5';
      }
    }
    // 7. 第六回：高老庄 (收服小白龙后初入才展开)
    else if (mapId === 'gaolaozhuang') {
      const isPreBailong = currentPhase.startsWith('liujiacun_') || currentPhase.startsWith('tiangong_') || currentPhase === 'wuxingshan_ready';
      if (!isPreBailong && !this.shownChapterSet.has('chapter_6')) {
        matchedChapterKey = 'chapter_6';
      }
    }
    // 8. 第七回：流沙河 (兼容 liushahe 与 liushaho)
    else if (mapId === 'liushahe' || mapId === 'liushaho') {
      const isPreLiusha = currentPhase.startsWith('liujiacun_') || currentPhase.startsWith('tiangong_') || currentPhase === 'wuxingshan_ready';
      if (!isPreLiusha && !this.shownChapterSet.has('chapter_7')) {
        matchedChapterKey = 'chapter_7';
      }
    }
    // 9. 第八回：五庄观
    else if (mapId === 'wuzhuangguan') {
      if (!this.shownChapterSet.has('chapter_8')) {
        matchedChapterKey = 'chapter_8';
      }
    }
    // 10. 第九回：白虎岭
    else if (mapId === 'baihuling') {
      if (!this.shownChapterSet.has('chapter_9')) {
        matchedChapterKey = 'chapter_9';
      }
    }
    // 11. 第十一回：平顶山
    else if (mapId === 'baoxiangguo') {
      if (!this.shownChapterSet.has('chapter_10')) {
        matchedChapterKey = 'chapter_10';
      }
    }
    // 12. 第十二回：号山火云洞（圣婴大王）
    else if (mapId === 'huoyundong') {
      if (!this.shownChapterSet.has('chapter_12')) {
        matchedChapterKey = 'chapter_12';
      }
    }
    // 13. 第十三回：黑水河（鼍洁）
    else if (mapId === 'heishuihe') {
      if (!this.shownChapterSet.has('chapter_13')) {
        matchedChapterKey = 'chapter_13';
      }
    }
    // 14. 第十四回：车迟国（三仙斗法）
    else if (mapId === 'chediguo') {
      if (!this.shownChapterSet.has('chapter_14')) {
        matchedChapterKey = 'chapter_14';
      }
    }
    // 17. 第十七回：盘丝洞（七女妖/百眼魔君）
    else if (mapId === 'pansidong') {
      if (!this.shownChapterSet.has('chapter_17')) {
        matchedChapterKey = 'chapter_17';
      }
    }
    // 18. 第十八回：狮驼岭（青狮/白象/大鹏金翅雕）
    else if (mapId === 'shituoling') {
      if (!this.shownChapterSet.has('chapter_18')) {
        matchedChapterKey = 'chapter_18';
      }
    }
    // 16. 第十六回：火焰山（铁扇公主/牛魔王）
    else if (mapId === 'huoyanshan') {
      if (!this.shownChapterSet.has('chapter_16')) {
        matchedChapterKey = 'chapter_16';
      }
    }
    // 15. 第十五回：通天河（灵感大王）
    else if (mapId === 'tongtianhe') {
      if (!this.shownChapterSet.has('chapter_15')) {
        matchedChapterKey = 'chapter_15';
      }
    }

    if (matchedChapterKey && configs[matchedChapterKey]) {
      this.shownChapterSet.add(matchedChapterKey);
      this.saveShownChapterSet();
      this.showChapterOpening(configs[matchedChapterKey], onDone);
      return true;
    }

    if (typeof onDone === 'function') onDone();
    return false;
  }

  initShownChapterSet() {
    this.shownChapterSet = new Set();
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('hanfeng_xy_shown_chapters');
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) {
            arr.forEach(k => this.shownChapterSet.add(k));
          }
        }
      }
    } catch (e) { }
  }

  saveShownChapterSet() {
    try {
      if (typeof localStorage !== 'undefined' && this.shownChapterSet) {
        localStorage.setItem('hanfeng_xy_shown_chapters', JSON.stringify(Array.from(this.shownChapterSet)));
      }
    } catch (e) { }
  }

  // 绘制图3右上角四极雷达罗盘 (体、力、敏、法)
  renderProfileV3Radar() {
    const cvs = document.getElementById('profile-radar-canvas');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const w = cvs.width || 160;
    const h = cvs.height || 120;
    ctx.clearRect(0, 0, w, h);

    const cx = Math.floor(w / 2);
    const cy = Math.floor(h / 2);
    const r = Math.min(w, h) * 0.38; // 约45.6px，大方舒展

    // 1. 暗金星轨八卦同心圆背景
    ctx.strokeStyle = 'rgba(168, 120, 60, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
    ctx.stroke();

    // 虚线十字轴
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = 'rgba(168, 120, 60, 0.45)';
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx, cy + r);
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. 四极端点发光赤金圆圈与文字 (上体、右力、下敏、左法)
    const axes = [
      { label: '体', x: cx, y: cy - r, key: 'con' },
      { label: '力', x: cx + r, y: cy, key: 'str' },
      { label: '敏', x: cx, y: cy + r, key: 'dex' },
      { label: '法', x: cx - r, y: cy, key: 'int' }
    ];

    axes.forEach(axis => {
      // 外层金圈
      ctx.fillStyle = '#120b13';
      ctx.beginPath();
      ctx.arc(axis.x, axis.y, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 文字 (加大为12px加粗)
      ctx.font = 'bold 12px "Microsoft YaHei", sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(axis.label, axis.x, axis.y + 0.5);
    });

    // 3. 计算玩家属性潜能雷达多边形
    const p = this.playerData;
    const con = (p.attributes && p.attributes.con) || 20;
    const str = (p.attributes && p.attributes.str) || 20;
    const dex = (p.attributes && p.attributes.dex) || 20;
    const intVal = (p.attributes && p.attributes.int) || 20;

    const maxVal = Math.max(con, str, dex, intVal, 30);
    const getRadius = (val) => r * (0.35 + (val / maxVal) * 0.55);

    const rCon = getRadius(con);
    const rStr = getRadius(str);
    const rDex = getRadius(dex);
    const rInt = getRadius(intVal);

    // 绘制发光青蓝半透明多边形网
    ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.moveTo(cx, cy - rCon);        // 体 (上)
    ctx.lineTo(cx + rStr, cy);        // 力 (右)
    ctx.lineTo(cx, cy + rDex);        // 敏 (下)
    ctx.lineTo(cx - rInt, cy);        // 法 (左)
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;

    // 四个顶点晶莹光点
    ctx.fillStyle = '#ffffff';
    [[cx, cy - rCon], [cx + rStr, cy], [cx, cy + rDex], [cx - rInt, cy]].forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // =========================================================================
  // 🎊 升级弹框与修为潜能分配 (生·法·力·速 四维雷达与保存锁定机制)
  // =========================================================================
  showLevelUpModal(newLevel, silverGained, pointsGained) {
    if (typeof document === 'undefined' || !document.body) return;
    document.querySelectorAll('.level-up-modal-overlay').forEach(el => el.remove());

    const modalHtml = `
      <div class="level-up-modal-overlay" onclick="if(event.target===this) this.remove()">
        <div class="level-up-window" onclick="event.stopPropagation()">
          <div class="level-up-crest"></div>
          <div class="level-up-header">
            <span class="level-up-title">🎉 突破升重 · 恭喜升级</span>
            <button class="level-up-close" onclick="this.closest('.level-up-modal-overlay').remove()">✕</button>
          </div>
          <div class="level-up-body">
            <div class="level-up-badge">
              <span class="level-up-num">Lv.${newLevel}</span>
            </div>
            <div class="level-up-rewards">
              <div class="level-up-reward-row">
                <span style="color:#d4af37;">💰 银两奖励:</span>
                <span style="color:#ffd700;font-weight:bold;">+${silverGained} 两</span>
              </div>
              <div class="level-up-reward-row">
                <span style="color:#38bdf8;">🌟 获得潜能:</span>
                <span style="color:#00ffcc;font-weight:bold;">+${pointsGained} 点 (待分配)</span>
              </div>
            </div>
            <div class="level-up-prompt">
              恭喜道行大进！获得 <strong style="color:#ffd700;">${pointsGained}</strong> 属性点数待分配，是否立刻分配？
            </div>
            <div class="level-up-actions">
              <button class="level-up-btn btn-alloc" onclick="this.closest('.level-up-modal-overlay').remove(); window.App2D.openStatAllocationModal('hero');">
                立刻分配
              </button>
              <button class="level-up-btn btn-later" onclick="this.closest('.level-up-modal-overlay').remove();">
                稍后再说
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.Sound) {
      if (typeof window.Sound.playLevelUp === 'function') {
        window.Sound.playLevelUp();
      } else if (typeof window.Sound.playSuccess === 'function') {
        window.Sound.playSuccess();
      } else if (typeof window.Sound.playBeep === 'function') {
        window.Sound.playBeep();
      }
    }
  }

  // 综合属性实时计算与预览方法
  getPreviewStats(targetType = 'hero', petIndex = 0, tempAttrs = null) {
    const p = this.playerData;
    if (!p) return { growth: '1.00', hp: 100, maxHp: 100, mp: 100, maxMp: 100, atk: 30, def: 20, spd: 15 };
    if (targetType === 'pet') {
      const pets = this.pets || [];
      const pet = pets[petIndex] || (this.activeCombatPets && this.activeCombatPets[0]) || null;
      if (!pet) return { growth: '1.00', hp: 100, maxHp: 100, mp: 100, maxMp: 100, atk: 30, def: 20, spd: 15 };
      return this.getPetPreviewStats(pet, tempAttrs);
    }
    return this.getHeroPreviewStats(p, tempAttrs);
  }

  getHeroPreviewStats(p, tempAttrs = null) {
    const classData = window.GAME_DATA?.CLASSES?.[p.classId];
    const w = (classData && classData.attrWeights) || { hp: 14, atk: 2.0, def: 2.0, spd: 1.0, mp: 8, matk: 1.0 };
    const curAttrs = tempAttrs || {
      sheng: p.attributes.con,
      fa: p.attributes.int,
      li: p.attributes.str,
      su: p.attributes.dex
    };

    const sheng = curAttrs.sheng ?? (p.attributes.con ?? 10);
    const fa = curAttrs.fa ?? (p.attributes.int ?? 10);
    const li = curAttrs.li ?? (p.attributes.str ?? 10);
    const su = curAttrs.su ?? (p.attributes.dex ?? 10);

    const baseLi = p.attributes.str ?? 10;
    const baseSta = p.attributes.sta ?? 10;
    const sta = baseSta + Math.floor(li * 0.4) - Math.floor(baseLi * 0.4);

    const baseMaxHp = Math.floor(120 + p.level * 32 + sheng * w.hp + sta * 2);
    const baseMaxMp = Math.floor(240 + p.level * 22 + fa * w.mp);
    const baseAtk = Math.floor(28 + p.level * 8 + li * w.atk);
    const baseDef = Math.floor(22 + p.level * 6 + sta * w.def + sheng * 0.3);
    const baseSpd = Math.floor(12 + p.level * 2 + su * w.spd);

    // 计算玩家装备与故事属性常态加成差值
    const actualCon = p.attributes.con ?? 10;
    const actualSta = p.attributes.sta ?? 10;
    const actualInt = p.attributes.int ?? 10;
    const actualStr = p.attributes.str ?? 10;
    const actualDex = p.attributes.dex ?? 10;

    const origBaseHp = Math.floor(120 + p.level * 32 + actualCon * w.hp + actualSta * 2);
    const origBaseMp = Math.floor(240 + p.level * 22 + actualInt * w.mp);
    const origBaseAtk = Math.floor(28 + p.level * 8 + actualStr * w.atk);
    const origBaseDef = Math.floor(22 + p.level * 6 + actualSta * w.def + actualCon * 0.3);
    const origBaseSpd = Math.floor(12 + p.level * 2 + actualDex * w.spd);

    const maxHp = Math.max(1, baseMaxHp + (p.maxHp - origBaseHp));
    const maxMp = Math.max(1, baseMaxMp + (p.maxMp - origBaseMp));
    const atk = Math.max(1, baseAtk + (p.atk - origBaseAtk));
    const def = Math.max(1, baseDef + (p.def - origBaseDef));
    const spd = Math.max(1, baseSpd + (p.spd - origBaseSpd));

    return {
      growth: '1.00',
      hp: Math.min(p.hp || maxHp, maxHp),
      maxHp,
      mp: Math.min(p.mp || maxMp, maxMp),
      maxMp,
      atk,
      def,
      spd
    };
  }

  getPetPreviewStats(pet, tempAttrs = null) {
    const template = window.GAME_DATA?.PETS?.[pet.templateId] || window.GAME_DATA?.PETS?.['dahai_gui'] || {};
    const qMult = { ordinary: 1.0, baby: 1.05, variant: 1.15, sanxian: 1.25, jinxian: 1.35 }[pet.quality] || 1.0;
    const g = pet.growth || template.growth || 1.0;
    const lvl = pet.level || 1;
    const apt = pet.aptitudes || template.aptitudes || {};

    const aptitudeRatio = key => {
      const range = template?.aptitudes?.[key];
      if (!range || !Number.isFinite(apt?.[key])) return 1;
      return Math.max(0.5, Math.min(1.5, apt[key] / ((range[0] + range[1]) / 2)));
    };

    const curAttrs = tempAttrs || {
      sheng: pet.attrs?.sheng ?? (pet.attrs?.con ?? 10),
      fa: pet.attrs?.fa ?? (pet.attrs?.int ?? 10),
      li: pet.attrs?.li ?? (pet.attrs?.str ?? 10),
      su: pet.attrs?.su ?? (pet.attrs?.dex ?? 10)
    };

    const shengVal = curAttrs.sheng ?? 10;
    const faVal = curAttrs.fa ?? 10;
    const liVal = curAttrs.li ?? 10;
    const suVal = curAttrs.su ?? 10;

    const baseLi = pet.attrs?.li ?? (pet.attrs?.str ?? 10);
    const baseSta = pet.attrs?.sta ?? 10;
    const staVal = baseSta + Math.floor(liVal * 0.5) - Math.floor(baseLi * 0.5);

    const isCombatWild = (pet.isWild === false);
    const wildHpBonus = isCombatWild ? Math.floor(40 + lvl * 2) : 0;
    const wildAtkBonus = isCombatWild ? Math.floor(1 + lvl * 0.3) : 0;

    let maxHp = Math.floor((185 + lvl * 25 + shengVal * 11.5 * g * aptitudeRatio('hp')) * qMult) + wildHpBonus;
    let maxMp = Math.floor((120 + lvl * 15 + faVal * 8 * g) * qMult);
    let atk = Math.floor((18 + lvl * 5 + liVal * 2.1 * g * aptitudeRatio('atk')) * qMult) + wildAtkBonus;
    let def = Math.floor((15 + lvl * 4 + staVal * 1.8 * g * aptitudeRatio('def')) * qMult);
    let spd = Math.floor((15 + suVal * 1.8 * g * aptitudeRatio('spd')) * qMult);

    if (pet.passives && pet.passives.some(p => p.id === 'high_speed')) {
      spd += 30;
    }

    maxHp = Math.max(90, maxHp);
    maxMp = Math.max(60, maxMp);
    atk = Math.max(25, atk);
    def = Math.max(20, def);
    spd = Math.max(15, spd);

    return {
      growth: (Number(g) || 1.0).toFixed(2),
      hp: Math.min(pet.hp || maxHp, maxHp),
      maxHp,
      mp: Math.min(pet.mp || maxMp, maxMp),
      maxMp,
      atk,
      def,
      spd
    };
  }

  // 绘制四维潜能雷达图 (血、精、力、速)
  renderAllocRadar(cvsId, sheng = 20, fa = 20, li = 20, su = 20) {
    if (typeof document === 'undefined') return;
    const cvs = document.getElementById(cvsId);
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const width = cvs.width || 160;
    const height = cvs.height || 120;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) * 0.38; // 约45.6px，大气舒展

    // 1. 绘制中式八角/菱形同心网格
    ctx.lineWidth = 1;
    [0.35, 0.7, 1.0].forEach((ratio, idx) => {
      const cr = r * ratio;
      ctx.strokeStyle = idx === 2 ? '#8d6b38' : 'rgba(141, 107, 56, 0.35)';
      ctx.beginPath();
      ctx.moveTo(cx, cy - cr);
      ctx.lineTo(cx + cr, cy);
      ctx.lineTo(cx, cy + cr);
      ctx.lineTo(cx - cr, cy);
      ctx.closePath();
      ctx.stroke();
    });

    // 轴线
    ctx.strokeStyle = 'rgba(141, 107, 56, 0.4)';
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx, cy + r);
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.stroke();

    // 2. 四极端点发光标签与文字 (上血、右精、下力、左速)
    const axes = [
      { label: '血', x: cx, y: cy - r, key: 'sheng', col: '#ef4444' },
      { label: '精', x: cx + r, y: cy, key: 'fa', col: '#3b82f6' },
      { label: '力', x: cx, y: cy + r, key: 'li', col: '#f59e0b' },
      { label: '速', x: cx - r, y: cy, key: 'su', col: '#10b981' }
    ];

    axes.forEach(axis => {
      ctx.fillStyle = '#120b13';
      ctx.beginPath();
      ctx.arc(axis.x, axis.y, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = axis.col;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = 'bold 12px "Microsoft YaHei", sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(axis.label, axis.x, axis.y + 0.5);
    });

    // 3. 计算雷达多边形
    const maxVal = Math.max(sheng, fa, li, su, 25);
    const getRadius = (val) => r * (0.35 + (val / maxVal) * 0.55);

    const rSheng = getRadius(sheng);
    const rFa = getRadius(fa);
    const rLi = getRadius(li);
    const rSu = getRadius(su);

    // 绘制发光半透明多边形网
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.moveTo(cx, cy - rSheng);   // 血 (上)
    ctx.lineTo(cx + rFa, cy);       // 精 (右)
    ctx.lineTo(cx, cy + rLi);       // 力 (下)
    ctx.lineTo(cx - rSu, cy);       // 速 (左)
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;

    // 四个顶点晶莹光点
    ctx.fillStyle = '#ffffff';
    [[cx, cy - rSheng], [cx + rFa, cy], [cx, cy + rLi], [cx - rSu, cy]].forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // P3.2: 祖师传法资格指引 —— 返回每只仙宠当前传法状态与准确原因 (纯查询，不改状态)
  getMasterLessonGuidance(pet) {
    if (!pet) return null;
    if (!['sanxian', 'jinxian'].includes(pet.quality)) {
      return { status: 'ineligible', hint: '普通仙宠仅能普攻，无法受法' };
    }
    const learnedSkill = (pet.skills && pet.skills[0]) || null;
    if (pet.masterLessonLearned || learnedSkill || pet.classId) {
      const skName = learnedSkill ? learnedSkill.name : '已传法';
      const clsName = pet.className || learnedSkill?.className || '';
      return {
        status: 'learned',
        hint: `已受法：${clsName ? clsName + '·' : ''}${skName}（每只仅一次）`,
        skill: learnedSkill
      };
    }
    if ((pet.level || 1) < 10) {
      return { status: 'under_level', hint: `传法需 10 级（当前 Lv.${pet.level}，还差 ${10 - pet.level} 级）` };
    }
    return { status: 'ready', hint: '已可受法：带它到长安神坛·菩提祖师身边免费传法（每只一次）' };
  }

  // P3.1: 加点定位建议 —— 两到三种文字取向，仅说明用途，不自动分配 (纯查询)
  getAllocationAdvice(targetType = 'hero', pet = null) {
    if (targetType === 'pet') {
      const role = (pet && window.GAME_DATA.getSpeciesRoleProfile)
        ? window.GAME_DATA.getSpeciesRoleProfile(pet.templateId) : null;
      const tag = role ? role.tag : null;
      if (tag === '耐久承伤') {
        return [
          { name: '铁壁承伤', text: '主加【血】，余点给【力】——血厚防高，顶在阵前替队友挡刀' },
          { name: '稳扎稳打', text: '血力对半——保留一定出手威力，别让它只会挨打' }
        ];
      }
      if (tag === '速度先手') {
        return [
          { name: '先手压制', text: '主加【速】，次【力】——抢在敌人前出手，先打先赢' },
          { name: '敏攻游击', text: '速力并重——出手快且打得出伤害，适合收割残局' }
        ];
      }
      if (tag === '物理输出') {
        return [
          { name: '物攻主力', text: '主加【力】，次【血】——攻击拉满，做全队最稳的一把刀' },
          { name: '暴力先锋', text: '力速偏重——出手提前，赶在治疗前终结对手' }
        ];
      }
      if (tag === '均衡成长') {
        return [
          { name: '均衡过渡', text: '四维轮流加——前期先带着练，观察这只的实际成长再定型' },
          { name: '偏血保守', text: '多给【血】——活下来才有输出，新手稳妥之选' }
        ];
      }
    }
    // 本尊建议按门派分发；未选门派时给通用三向
    const classId = this.playerData?.classId;
    if (classId === 'jingang') {
      return [
        { name: '金刚铁壁', text: '主加【血】，次【力】——站得住才有输出，血量高于10%才能施展舍生取义' },
        { name: '佛门攻坚', text: '主加【力】，次【血】——走攻击路线，配合天生5%抗玄击硬撼法系' }
      ];
    }
    if (classId === 'yaomo') {
      return [
        { name: '法术轰炸', text: '主加【精】，次【速】——技能连发不缺蓝，雷霆万钧先声夺人' },
        { name: '爆发刺客', text: '主【速】，次【精】——抢先用万毒攻心压制，控住再打' }
      ];
    }
    if (classId === 'xianren') {
      return [
        { name: '先手封控', text: '主加【速】，次【精】——封印定身先出手，让敌人整轮动弹不得' },
        { name: '持久牵制', text: '主【精】，次【血】——法力充盈反复控场，站到最后一刻' }
      ];
    }
    return [
      { name: '耐久生存', text: '主加【血】——站得住才有输出' },
      { name: '物理输出', text: '主加【力】——普攻与物理技能更痛' },
      { name: '先手控场', text: '主加【速】——出手提前，掌握节奏' }
    ];
  }

  // 自由潜能点分配专用弹窗 (1:1 像素级复刻 profile-v3-window，四维血精力速雷达、实时预览与保存锁定机制)
  openStatAllocationModal(targetType = 'hero', petIndex = 0) {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('.stat-alloc-overlay').forEach(m => m.remove());

    const p = this.playerData;
    const pets = this.pets || [];
    const activePet = pets[petIndex] || (this.activeCombatPets && this.activeCombatPets[0]) || null;
    const isPet = (targetType === 'pet' && activePet);

    const baseAttrs = isPet ? {
      sheng: activePet.attrs?.sheng ?? (activePet.attrs?.con ?? 10),
      fa: activePet.attrs?.fa ?? (activePet.attrs?.int ?? 10),
      li: activePet.attrs?.li ?? (activePet.attrs?.str ?? 10),
      su: activePet.attrs?.su ?? (activePet.attrs?.dex ?? 10)
    } : {
      sheng: p.attributes.con ?? 10,
      fa: p.attributes.int ?? 10,
      li: p.attributes.str ?? 10,
      su: p.attributes.dex ?? 10
    };

    const basePoints = isPet ? (activePet.potentialPoints || 0) : (p.potentialPoints || 0);

    // 建立本次会话的属性分配会话状态
    this._allocSession = {
      targetType: isPet ? 'pet' : 'hero',
      petIndex: isPet ? petIndex : 0,
      baseAttrs: { ...baseAttrs },
      tempAttrs: { ...baseAttrs },
      basePoints,
      tempPoints: basePoints
    };

    const isPanda = !isPet && (p.name.includes('熊猫') || (this.playerChar && this.playerChar.appearance === 'panda_hero'));
    const targetName = isPet ? activePet.name : p.name;
    const targetSub = isPet ? (activePet.qualityName || '仙宠') : `ID: ${p.id || 2058}`;
    const targetLevel = isPet ? activePet.level : p.level;

    // 头像 HTML
    let avatarHtml = '';
    if (isPet) {
      avatarHtml = (window.Portraits && typeof window.Portraits.getPortraitSvg === 'function')
        ? window.Portraits.getPortraitSvg(this.getUnitVisualId(activePet), 56, { noBorder: true })
        : `<span style="font-size:26px;">${activePet.icon || '🐾'}</span>`;
    } else {
      const isGeneral = this.playerChar?.appearance === 'heaven_general' || this.playerData?.appearance === 'heaven_general';
      const roleId = isPanda ? 'panda_warrior' : (isGeneral ? 'heaven_general' : 'shaoxia');
      avatarHtml = (window.Portraits && typeof window.Portraits.getPortraitSvg === 'function')
        ? window.Portraits.getPortraitSvg(roleId, 56, { noBorder: true })
        : `<span style="font-size:26px;">👤</span>`;
    }

    const preview = this.getPreviewStats(isPet ? 'pet' : 'hero', petIndex, baseAttrs);

    const modalHtml = `
      <div class="profile-v3-overlay stat-alloc-overlay" onclick="if(event.target===this) this.remove()">
        <div class="profile-v3-window stat-alloc-window" onclick="event.stopPropagation()" style="max-width:440px;width:95%;max-height:92vh;display:flex;flex-direction:column;">
          <div class="profile-v3-top-crest"></div>
          <button class="profile-v3-close" onclick="this.closest('.profile-v3-overlay').remove()" title="关闭 (Esc)">✕</button>

          <!-- 顶部切换页签 -->
          <div style="display:flex;gap:6px;padding:12px 14px 0 14px;background:rgba(20,12,18,0.7);">
            <button class="dialogue-opt-btn" onclick="window.App2D.openStatAllocationModal('hero')"
              style="flex:1;padding:5px 8px;font-size:11.5px;${!isPet ? 'background:linear-gradient(180deg, #d97706 0%, #92400e 100%);color:#fff;border-color:#ffd700;' : 'opacity:0.75;'}">
              👤 本尊修为加点
            </button>
            ${pets.length > 0 ? `
              <button class="dialogue-opt-btn" onclick="window.App2D.openStatAllocationModal('pet', ${petIndex})"
                style="flex:1;padding:5px 8px;font-size:11.5px;${isPet ? 'background:linear-gradient(180deg, #d97706 0%, #92400e 100%);color:#fff;border-color:#ffd700;' : 'opacity:0.75;'}">
                🐾 仙宠潜能加点 (${pets.length}只)
              </button>
            ` : ''}
          </div>

          ${isPet && pets.length > 1 ? `
            <!-- 多仙宠横向切换栏 -->
            <div style="display:flex;gap:4px;overflow-x:auto;padding:6px 14px;background:rgba(15,8,12,0.85);border-bottom:1px solid #4a301c;">
              ${pets.map((pt, idx) => `
                <button class="dialogue-opt-btn" onclick="window.App2D.openStatAllocationModal('pet', ${idx})"
                  style="padding:2px 8px;font-size:10.5px;white-space:nowrap;${idx === petIndex ? 'background:#b45309;color:#fff;border-color:#f59e0b;' : 'opacity:0.65;'}">
                  ${pt.name} (Lv.${pt.level})
                </button>
              `).join('')}
            </div>
          ` : ''}

          <!-- 1. 顶部身份名片与四维雷达图 (1:1 复刻 profile-v3-window) -->
          <div class="profile-v3-header" style="border-top:1px solid #4a301c;">
            <!-- 左侧身份名片 -->
            <div class="profile-v3-identity">
              <div class="profile-v3-avatar-ring">
                ${avatarHtml}
              </div>
              <div class="profile-v3-id-info">
                <div class="profile-v3-name">${targetName}</div>
                <div class="profile-v3-subid">${targetSub}</div>
                <div class="profile-v3-badges-row">
                  <div class="profile-v3-lv-pill">
                    <span class="profile-v3-lv-txt">LV</span>
                    <span class="profile-v3-lv-num">${targetLevel}</span>
                  </div>
                  <div class="profile-v3-xian-seal">${isPet ? '宠' : '仙'}</div>
                </div>
              </div>
            </div>

            <!-- 右侧四维雷达图 (血、精、力、速) -->
            <div class="profile-v3-radar-box">
              <canvas id="stat-alloc-radar-canvas" class="profile-v3-radar-canvas" width="160" height="120"></canvas>
            </div>
          </div>

          <!-- 2. 中间加点交互面板 (滚动内容) -->
          <div style="flex:1;overflow-y:auto;padding:10px 14px;display:flex;flex-direction:column;gap:8px;">
            <!-- 待分配点数横幅 -->
            <div class="stat-alloc-banner">
              <span style="color:#fef08a;font-weight:bold;">待分配潜能点:</span>
              <span><span id="stat-alloc-remain-pts" class="alloc-points-glow">${basePoints}</span> <span style="font-size:11px;color:#cbd5e1;">点</span></span>
            </div>

            <!-- 四项加点控制器: 血、精、力、速 -->
            <div class="stat-alloc-rows-box">
              ${[
                { key: 'sheng', tag: 'tag-sheng', short: '血', name: '血 (气血)', desc: '提升最大生命值' },
                { key: 'fa', tag: 'tag-fa', short: '精', name: '精 (法力)', desc: '提升最大法力值' },
                { key: 'li', tag: 'tag-li', short: '力', name: '力 (攻击)', desc: '提升攻击与防御' },
                { key: 'su', tag: 'tag-su', short: '速', name: '速 (速度)', desc: '提升出手速度' }
              ].map(item => `
                <div class="stat-alloc-row">
                  <div class="stat-alloc-label-group">
                    <span class="stat-alloc-tag ${item.tag}">${item.short}</span>
                    <span class="stat-alloc-name">${item.name}</span>
                  </div>
                  <div class="stat-alloc-controls">
                    <button class="stat-alloc-btn" id="btn-minus-${item.key}" onclick="window.App2D.adjustAlloc('${item.key}', -1)" title="减少1点">-</button>
                    <input type="number" class="stat-alloc-input" id="alloc-input-${item.key}"
                      value="${baseAttrs[item.key]}"
                      min="${baseAttrs[item.key]}"
                      max="${baseAttrs[item.key] + basePoints}"
                      onchange="window.App2D.setAllocDirect('${item.key}', this)"
                      oninput="window.App2D.setAllocDirect('${item.key}', this)">
                    <button class="stat-alloc-btn" id="btn-plus-${item.key}" onclick="window.App2D.adjustAlloc('${item.key}', 1)" title="增加1点">+</button>
                    <div class="stat-alloc-diff" id="alloc-diff-${item.key}">
                      <span class="stat-diff-zero">(0)</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            ${(() => {
      // P3.1: 定位建议 (纯文字说明，不自动分配) 与 P3.3 物种定位标签
      const advice = this.getAllocationAdvice(isPet ? 'pet' : 'hero', isPet ? activePet : null);
      const role = isPet && window.GAME_DATA.getSpeciesRoleProfile
        ? window.GAME_DATA.getSpeciesRoleProfile(activePet.templateId) : null;
      const growthRangeText = isPet && activePet ? (() => {
        const tpl = window.GAME_DATA?.PETS?.[activePet.templateId];
        if (!tpl || !tpl.growthRange) return '';
        const actual = Number(activePet.growth || 0);
        const inRange = actual >= tpl.growthRange[0] && actual <= tpl.growthRange[1];
        return `实际成长 ${actual.toFixed(2)}（物种区间 ${tpl.growthRange[0].toFixed(2)} ~ ${tpl.growthRange[1].toFixed(2)}${inRange ? '' : '，洗炼所致区间外'}）`;
      })() : '';
      return `
            <!-- P3.1 定位建议与物种区间说明 -->
            <div class="stat-alloc-advice-box" style="background:rgba(30,20,10,0.75);border:1px solid #6b4a24;border-radius:6px;padding:6px 9px;">
              <div style="font-size:10.5px;color:#f5cd79;font-weight:bold;margin-bottom:3px;display:flex;justify-content:space-between;align-items:center;">
                <span>🧭 加点定位参考${role ? ` · 本宠物种：${role.icon}${role.tag}` : ''}</span>
                <span style="font-weight:normal;color:#a89278;font-size:9px;">仅供参照，不会自动分配</span>
              </div>
              ${growthRangeText ? `<div style="font-size:10px;color:#9fd3a8;margin-bottom:3px;">📈 ${growthRangeText}</div>` : ''}
              ${advice.map(a => `
                <div style="font-size:10px;color:#d8c9a3;line-height:1.55;">
                  <span style="color:#ffd700;">▪ ${a.name}：</span>${a.text}
                </div>
              `).join('')}
            </div>
            `;
    })()}

            <!-- 操作按钮：保存分配与重置 -->
            <div class="stat-alloc-action-bar">
              <button class="stat-alloc-save-btn" onclick="window.App2D.saveAlloc()">
                💾 确认保存分配
              </button>
              <button class="stat-alloc-reset-btn" onclick="window.App2D.resetAlloc()">
                🔄 重置修改
              </button>
            </div>

            <!-- 3. 下方角色综合属性实时计算面板 -->
            <div class="stat-alloc-details-panel">
              <div class="stat-details-title">
                <span>📊 当前角色综合属性</span>
                <span style="font-size:10px;color:#a89278;font-weight:normal;">加点实时预览</span>
              </div>
              <div class="stat-details-grid">
                <div class="stat-details-item">
                  <span>成长率:</span>
                  <span id="preview-growth" class="stat-details-val">${preview.growth}</span>
                </div>
                <div class="stat-details-item">
                  <span>速度:</span>
                  <span id="preview-spd" class="stat-details-val">${preview.spd}</span>
                </div>
                <div class="stat-details-item">
                  <span>生命值:</span>
                  <span id="preview-hp" class="stat-details-val">${preview.hp} / ${preview.maxHp}</span>
                </div>
                <div class="stat-details-item">
                  <span>防御力:</span>
                  <span id="preview-def" class="stat-details-val">${preview.def}</span>
                </div>
                <div class="stat-details-item">
                  <span>法力值:</span>
                  <span id="preview-mp" class="stat-details-val">${preview.mp} / ${preview.maxMp}</span>
                </div>
                <div class="stat-details-item">
                  <span>攻击力:</span>
                  <span id="preview-atk" class="stat-details-val">${preview.atk}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. 底部微标与返回 -->
          <div class="profile-v3-footer" style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;">
            <span style="font-size:10px;color:#a89278;">💡 保存后点数正式固化不可缩减</span>
            <button class="dialogue-opt-btn" onclick="this.closest('.profile-v3-overlay').remove(); window.App2D.openPlayerProfileModal();" style="padding:2px 10px;font-size:11px;">
              返回人物状态
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.Sound) window.Sound.playBeep();

    // 绘制初始四维雷达图
    this.renderAllocRadar('stat-alloc-radar-canvas', baseAttrs.sheng, baseAttrs.fa, baseAttrs.li, baseAttrs.su);
    this.updateAllocModalUI();
  }

  // 加点微调 (-1 / +1)
  adjustAlloc(attrKey, delta) {
    const s = this._allocSession;
    if (!s) return;
    if (delta > 0) {
      if (s.tempPoints < delta) {
        window.showGameMessage('待分配潜能点不足！', 'warning');
        return;
      }
      s.tempAttrs[attrKey] += delta;
      s.tempPoints -= delta;
    } else if (delta < 0) {
      if (s.tempAttrs[attrKey] + delta < s.baseAttrs[attrKey]) {
        window.showGameMessage('已保存锁定的点数无法撤回缩减！', 'warning');
        return;
      }
      s.tempAttrs[attrKey] += delta;
      s.tempPoints -= delta;
    }
    this.updateAllocModalUI();
  }

  // 加点直接输入
  setAllocDirect(attrKey, inputElem) {
    const s = this._allocSession;
    if (!s || !inputElem) return;
    let typed = parseInt(inputElem.value, 10);
    const minVal = s.baseAttrs[attrKey];
    const maxVal = s.tempAttrs[attrKey] + s.tempPoints;

    if (isNaN(typed) || typed < minVal) {
      typed = minVal;
    } else if (typed > maxVal) {
      typed = maxVal;
    }

    const diff = typed - s.tempAttrs[attrKey];
    s.tempAttrs[attrKey] = typed;
    s.tempPoints -= diff;

    this.updateAllocModalUI();
  }

  // 重置本次未保存的加点调整
  resetAlloc() {
    const s = this._allocSession;
    if (!s) return;
    s.tempAttrs = { ...s.baseAttrs };
    s.tempPoints = s.basePoints;
    this.updateAllocModalUI();
    window.showGameMessage('已重置本次未保存的加点调整', 'info');
  }

  // 确认保存分配 (永久生效锁定，消耗过的点数无法再退减)
  saveAlloc() {
    const s = this._allocSession;
    if (!s) return;

    const diffs = {
      sheng: s.tempAttrs.sheng - s.baseAttrs.sheng,
      fa: s.tempAttrs.fa - s.baseAttrs.fa,
      li: s.tempAttrs.li - s.baseAttrs.li,
      su: s.tempAttrs.su - s.baseAttrs.su,
    };
    const totalDiff = Object.values(diffs).reduce((a, b) => a + b, 0);
    if (totalDiff <= 0) {
      window.showGameMessage('未做任何潜能点修改', 'info');
      return;
    }

    if (s.targetType === 'hero') {
      const p = this.playerData;
      for (const [key, val] of Object.entries(diffs)) {
        if (val > 0) {
          p.allocatePoints(key, val);
        }
      }
      this.updatePlayerHud();
      s.basePoints = p.potentialPoints;
      s.baseAttrs = {
        sheng: p.attributes.con,
        fa: p.attributes.int,
        li: p.attributes.str,
        su: p.attributes.dex
      };
    } else {
      const pets = this.pets || [];
      const pet = pets[s.petIndex];
      if (!pet) return;
      for (const [key, val] of Object.entries(diffs)) {
        if (val > 0 && window.PetSystem) {
          window.PetSystem.allocatePetPoints(pet, key, val);
        }
      }
      s.basePoints = pet.potentialPoints || 0;
      s.baseAttrs = {
        sheng: pet.attrs?.sheng ?? (pet.attrs?.con ?? 10),
        fa: pet.attrs?.fa ?? (pet.attrs?.int ?? 10),
        li: pet.attrs?.li ?? (pet.attrs?.str ?? 10),
        su: pet.attrs?.su ?? (pet.attrs?.dex ?? 10)
      };
    }

    s.tempAttrs = { ...s.baseAttrs };
    s.tempPoints = s.basePoints;

    if (window.Sound) {
      if (typeof window.Sound.playSuccess === 'function') window.Sound.playSuccess();
      else if (typeof window.Sound.playBeep === 'function') window.Sound.playBeep();
    }
    window.showGameMessage('✨ 属性加点保存成功！点数已正式生效并锁定！', 'success');

    if (typeof this.saveAutoProgress === 'function') {
      this.saveAutoProgress();
    }

    this.updateAllocModalUI();
  }

  // 刷新加点弹窗交互与实时数值预览
  updateAllocModalUI() {
    const s = this._allocSession;
    if (!s || typeof document === 'undefined') return;

    // 1. 剩余点数更新
    const remainEl = document.getElementById('stat-alloc-remain-pts');
    if (remainEl) remainEl.innerText = s.tempPoints;

    // 2. 四项属性输入控件与差异更新
    ['sheng', 'fa', 'li', 'su'].forEach(key => {
      const cur = s.tempAttrs[key];
      const base = s.baseAttrs[key];
      const diff = cur - base;

      const input = document.getElementById(`alloc-input-${key}`);
      if (input && document.activeElement !== input) {
        input.value = cur;
        input.min = base;
        input.max = cur + s.tempPoints;
      }

      const diffEl = document.getElementById(`alloc-diff-${key}`);
      if (diffEl) {
        if (diff > 0) {
          diffEl.innerHTML = `<span class="stat-diff-pos">(+${diff})</span>`;
        } else {
          diffEl.innerHTML = `<span class="stat-diff-zero">(0)</span>`;
        }
      }

      const btnMinus = document.getElementById(`btn-minus-${key}`);
      if (btnMinus) {
        btnMinus.disabled = (cur <= base);
        if (btnMinus.style) {
          btnMinus.style.opacity = (cur <= base) ? '0.45' : '1';
          btnMinus.style.cursor = (cur <= base) ? 'not-allowed' : 'pointer';
        }
      }

      const btnPlus = document.getElementById(`btn-plus-${key}`);
      if (btnPlus) {
        btnPlus.disabled = (s.tempPoints <= 0);
        if (btnPlus.style) {
          btnPlus.style.opacity = (s.tempPoints <= 0) ? '0.45' : '1';
          btnPlus.style.cursor = (s.tempPoints <= 0) ? 'not-allowed' : 'pointer';
        }
      }
    });

    // 3. 重绘四维雷达图
    this.renderAllocRadar('stat-alloc-radar-canvas', s.tempAttrs.sheng, s.tempAttrs.fa, s.tempAttrs.li, s.tempAttrs.su);

    // 4. 计算并更新下方综合属性预览
    const preview = this.getPreviewStats(s.targetType, s.petIndex, s.tempAttrs);
    if (preview) {
      const gEl = document.getElementById('preview-growth');
      if (gEl) gEl.innerText = preview.growth;
      const hpEl = document.getElementById('preview-hp');
      if (hpEl) hpEl.innerText = `${preview.hp} / ${preview.maxHp}`;
      const mpEl = document.getElementById('preview-mp');
      if (mpEl) mpEl.innerText = `${preview.mp} / ${preview.maxMp}`;
      const atkEl = document.getElementById('preview-atk');
      if (atkEl) atkEl.innerText = preview.atk;
      const defEl = document.getElementById('preview-def');
      if (defEl) defEl.innerText = preview.def;
      const spdEl = document.getElementById('preview-spd');
      if (spdEl) spdEl.innerText = preview.spd;
    }
  }

  // 保持向后兼容原有接口
  allocateStat(attrKey, amount = 1, targetType = 'hero', petIndex = 0) {
    if (this._allocSession) {
      this.adjustAlloc(attrKey, amount);
      this.saveAlloc();
      return;
    }
    if (targetType === 'pet') {
      const pets = this.pets || [];
      const pet = pets[petIndex];
      if (pet && window.PetSystem && window.PetSystem.allocatePetPoints(pet, attrKey, amount)) {
        if (window.Sound) window.Sound.playBeep();
        window.showGameMessage(`✨ 仙宠【${pet.name}】加点成功！当前 ${attrKey}: ${pet.attrs[attrKey] || pet.attrs.sheng}`, 'success', 2000);
        this.openStatAllocationModal('pet', petIndex);
      } else {
        window.showGameMessage('仙宠潜能点不足！', 'warning', 2000);
      }
      return;
    }

    if (this.playerData.allocatePoints(attrKey, amount)) {
      this.updatePlayerHud();
      if (window.Sound) window.Sound.playBeep();
      const curVal = this.playerData.attributes[attrKey] || this.playerData.attributes.con;
      window.showGameMessage(`✨ 潜能分配成功！当前 ${attrKey}: ${curVal}`, 'success', 2000);
      this.openStatAllocationModal('hero');
    } else {
      window.showGameMessage('潜能点不足！', 'warning', 2000);
    }
  }

  // =========================================================================
  // 🎒 储物背包系统 (药品/装备/宝石/杂物分类、手动穿脱、3孔宝石镶嵌)
  // =========================================================================
  openInventoryModal(activeCategory = 'all') {
    if (window.Dialogue) window.Dialogue.close();
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());

    const items = this.inventory.getItemsByCategory(activeCategory);
    const eq = this.playerData.equipment;

    const parts = [
      { key: 'weapon', name: '神兵', icon: '⚔️' },
      { key: 'head', name: '冠盔', icon: '👑' },
      { key: 'armor', name: '铠甲', icon: '🥋' },
      { key: 'necklace', name: '项坠', icon: '📿' },
      { key: 'belt', name: '腰带', icon: '🎗️' },
      { key: 'boots', name: '鞋靴', icon: '👢' }
    ];

    const modalHtml = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-window inventory-panel" onclick="event.stopPropagation()">
          <div class="modal-header">
            <span class="modal-title">乾坤行囊 <small style="color:#fde047;margin-left:6px;">${this.inventory.slots.length}/${this.inventory.maxSlots} 格</small></span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body inventory-body">
            <div class="inventory-layout">
              <!-- 左侧：身上穿戴装备神位 -->
              <section class="inventory-equipment">
                <div class="inventory-equipment-inner">
                  <div class="inventory-hero-preview">
                    <div class="inventory-hero-portrait">${window.Portraits ? window.Portraits.getPortraitSvg(this.getUnitVisualId({ isPlayer: true }), 54) : '⚔️'}</div>
                    <div style="flex:1;">
                      <div style="font-weight:bold;font-size:13.5px;color:#fef08a;">${this.playerData.name}</div>
                      <div style="font-size:10px;color:#a89682;margin-top:2px;">Lv.${this.playerData.level} · 当前装束</div>
                      <div style="font-size:10.5px;color:#ffd700;margin-top:3px;font-weight:bold;">🪙 银两: ${this.playerData.silver} 两</div>
                    </div>
                  </div>
                  <div class="inventory-equipped-heading">
                    <strong>身披法宝神装</strong>
                  </div>
                  <div class="inventory-equipped-tip">点击神位可查看属性与宝石孔</div>
                  <div class="inventory-equipped-grid">
                    ${parts.map(p => {
                      const itemSlot = eq[p.key];
                      if (!itemSlot) {
                        return `
                          <div class="inventory-equipped-empty">
                            <div style="font-size:16px;opacity:0.4;">${p.icon}</div>
                            <div style="margin-top:2px;font-size:10px;color:#8d7966;">[${p.name}] 虚位</div>
                          </div>
                        `;
                      }
                      const baseIt = window.GAME_DATA.ITEMS[itemSlot.itemId] || {};
                      const sockets = itemSlot.sockets || [null, null, null];
                      const socketIcons = sockets.map(g => g ? '💎' : '⚪').join('');
                      return `
                        <button type="button" class="inventory-equipped-card" onclick="window.App2D.showEquippedDetail('${p.key}')">
                          <div class="inventory-equipped-name">
                            ${baseIt.icon || p.icon} ${baseIt.name || p.name}
                          </div>
                          <div class="inventory-equipped-stars">+${itemSlot.star || 0}星 ${socketIcons}</div>
                        </button>
                      `;
                    }).join('')}
                  </div>
                </div>
              </section>

              <!-- 右侧：百宝行囊格与分类 -->
              <section class="inventory-contents">
                <div class="inventory-section-heading">
                  行囊珍宝 <span>${items.length} 件</span>
                </div>
                <!-- 分类切换 Tabs -->
                <div class="inventory-tabs">
                  ${[
                    { id: 'all', name: '全部' },
                    { id: 'consumable', name: '💊 仙丹' },
                    { id: 'equip', name: '🛡️ 神兵' },
                    { id: 'gem', name: '💎 灵石' },
                    { id: 'misc', name: '📦 奇珍' }
                  ].map(tab => `
                    <button class="dialogue-opt-btn" style="flex:1;padding:5px 4px;font-size:10.5px;${activeCategory === tab.id ? 'background:linear-gradient(180deg,#b4833e,#825a22);color:#fff;font-weight:bold;border-color:#d4af37;' : 'background:rgba(20,15,12,0.8);color:#c4b5a0;'}" onclick="window.App2D.openInventoryModal('${tab.id}')">
                      ${tab.name}
                    </button>
                  `).join('')}
                </div>

                <!-- 物品列表格 -->
                <div class="inventory-item-grid">
                  ${items.length === 0 ? `<div style="grid-column:1/-1;text-align:center;padding:30px 10px;color:#8d7966;font-size:11px;">此分类下暂无存物</div>` : ''}
                  ${items.map(slot => {
                    const it = window.GAME_DATA.ITEMS[slot.itemId] || {};
                    const isEq = it.type === 'equip';
                    const sockets = (slot.equipData && slot.equipData.sockets) || [];
                    const sockStr = isEq ? sockets.map(g => g ? '💎' : '⚪').join('') : '';
                    return `
                      <button type="button" class="inventory-item-card" onclick="window.App2D.showInventoryItemDetail('${slot.instanceId}')" title="${it.name || '物品'}">
                        <div class="inventory-item-icon">${it.icon || '📦'}</div>
                        <div class="inventory-item-name">
                          ${it.name || '物品'}
                        </div>
                        ${slot.count > 1 ? `<span class="inventory-item-count">×${slot.count}</span>` : ''}
                        ${isEq ? `<div class="inventory-item-sockets">${sockStr}</div>` : ''}
                      </button>
                    `;
                  }).join('')}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    `;
    const v = document.getElementById('game-viewport') || document.body;
    v.insertAdjacentHTML('beforeend', modalHtml);
  }

  showInventoryItemDetail(instanceId) {
    const slot = this.inventory.slots.find(s => s.instanceId === instanceId);
    if (!slot) return;
    const it = window.GAME_DATA.ITEMS[slot.itemId];
    if (!it) return;

    let opButtons = '';
    if (it.type === 'equip') {
      opButtons = `
        <button class="dialogue-opt-btn" onclick="window.App2D.equipItemFromBag('${instanceId}'); this.closest('.modal-overlay').remove();" style="flex:1;">
          🛡️ 穿上装备
        </button>
      `;
    } else if (it.type === 'consumable') {
      opButtons = `
        <button class="dialogue-opt-btn" onclick="window.App2D.useConsumableItem('${instanceId}'); this.closest('.modal-overlay').remove();" style="flex:1;">
          💊 使用药品
        </button>
      `;
    } else if (it.type === 'gem') {
      opButtons = `
        <button class="dialogue-opt-btn" onclick="window.App2D.openGemSocketModal('${instanceId}'); this.closest('.modal-overlay').remove();" style="flex:1;background:linear-gradient(180deg,#6c3483,#4a235a);">
          💎 镶嵌宝石
        </button>
      `;
    }

    const typeNames = {
      equip: '神兵法宝',
      consumable: '仙丹妙药',
      gem: '灵石仙玉',
      misc: '天材奇珍',
      forge_item: '铸造材料',
      pet_item: '仙宠灵物',
      pet_book: '魔兽要诀',
      quest_item: '历练信物'
    };
    const typeLabel = typeNames[it.type] || '行囊奇珍';

    const qualityNames = {
      white: '凡品',
      green: '良品',
      blue: '灵品',
      purple: '宝器',
      gold: '仙器',
      orange: '神器'
    };
    const qualityColors = {
      white: '#d1d5db',
      green: '#4ade80',
      blue: '#38bdf8',
      purple: '#c084fc',
      gold: '#fde047',
      orange: '#fb923c'
    };
    const qColor = qualityColors[it.quality] || '#e2e8f0';
    const qName = qualityNames[it.quality] || '灵珍';

    const attrMap = {
      atk: '物攻',
      matk: '法攻',
      def: '物防',
      mdef: '法防',
      hp: '气血',
      mp: '法力',
      spd: '速度',
      hit: '命中',
      crit: '暴击'
    };

    const resMap = {
      phy: '抗普攻',
      shesheng: '抗舍生',
      leiting: '抗雷霆',
      feisha: '抗飞沙',
      fengyin: '抗封印',
      dingshen: '抗定身'
    };

    let attrsHtml = '';
    if (it.attrs && Object.keys(it.attrs).length > 0) {
      attrsHtml = `
        <div style="background:rgba(20,15,10,0.7);padding:8px 10px;border-radius:6px;border:1px solid #4a331c;margin-bottom:10px;">
          <div style="color:#ffd700;font-size:11px;font-weight:bold;margin-bottom:6px;letter-spacing:0.5px;">⚔️ 基础神兵属性</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            ${Object.entries(it.attrs).map(([k, v]) => `
              <div style="background:#24170f;border:1px solid #3d2a1b;border-radius:4px;padding:3px 8px;display:flex;justify-content:space-between;font-size:11px;">
                <span style="color:#c4b5a0;">${attrMap[k] || k.toUpperCase()}</span>
                <span style="color:#fef08a;font-weight:bold;">+${v}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    let bonusHtml = '';
    if (it.bonus && Object.keys(it.bonus).length > 0) {
      bonusHtml = `
        <div style="background:rgba(30,15,35,0.7);padding:8px 10px;border-radius:6px;border:1px solid #7c3aed;margin-bottom:10px;">
          <div style="color:#d8b4fe;font-size:11px;font-weight:bold;margin-bottom:6px;letter-spacing:0.5px;">💎 镶嵌孔位加持</div>
          <div style="display:grid;grid-template-columns:1fr;gap:4px;">
            ${Object.entries(it.bonus).map(([k, v]) => `
              <div style="background:#23112c;border:1px solid #5b21b6;border-radius:4px;padding:3px 8px;display:flex;justify-content:space-between;font-size:11px;">
                <span style="color:#e9d5ff;">${resMap[k.replace('res_', '')] || (attrMap[k] || k)}</span>
                <span style="color:#a7f3d0;font-weight:bold;">+${typeof v === 'number' && v < 1 ? Math.round(v * 100) + '%' : v}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    const modalHtml = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-window item-detail-modal" onclick="event.stopPropagation()" style="max-width:320px;background:radial-gradient(circle at 50% 10%, #291c13 0%, #150f0b 100%);border:2px solid #8d6b38;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.85);overflow:hidden;">
          <div class="modal-header" style="background:linear-gradient(90deg, #44301e, #241b16);padding:10px 14px;border-bottom:1.5px solid #6b4e28;display:flex;justify-content:space-between;align-items:center;">
            <span class="modal-title" style="color:#fde047;font-size:14px;font-weight:bold;display:flex;align-items:center;gap:6px;">
              ${it.icon || '📦'} ${it.name}
            </span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body" style="padding:12px;">
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px;">
              <div style="width:46px;height:46px;border-radius:8px;background:#24170f;border:1.5px solid #d4af37;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">
                ${it.icon || '📦'}
              </div>
              <div style="flex:1;">
                <div style="font-weight:bold;font-size:13.5px;color:#fef08a;">${it.name}</div>
                <div style="display:flex;gap:5px;margin-top:4px;">
                  <span style="font-size:10px;padding:1px 6px;border-radius:4px;background:#382416;color:${qColor};border:1px solid #5a3c22;">${qName}</span>
                  <span style="font-size:10px;padding:1px 6px;border-radius:4px;background:#2a1b12;color:#a89682;border:1px solid #44301f;">${typeLabel}</span>
                  ${slot.count > 1 ? `<span style="font-size:10px;padding:1px 6px;border-radius:4px;background:#3b1e1e;color:#fca5a5;border:1px solid #7f1d1d;">×${slot.count}</span>` : ''}
                </div>
              </div>
            </div>

            <div style="font-size:11px;color:#d8c6b4;background:rgba(0,0,0,0.38);border-left:3px solid #d4af37;padding:6px 9px;border-radius:0 5px 5px 0;margin-bottom:10px;line-height:1.5;">
              ${it.desc || '三界宝物。'}
            </div>

            ${attrsHtml}
            ${bonusHtml}

            <div style="display:flex;gap:8px;margin-top:8px;">
              ${opButtons}
              <button class="dialogue-opt-btn" onclick="this.closest('.modal-overlay').remove()" style="padding:6px 14px;">关闭</button>
            </div>
          </div>
        </div>
      </div>
    `;
    const v = document.getElementById('game-viewport') || document.body;
    v.insertAdjacentHTML('beforeend', modalHtml);
  }

  equipItemFromBag(instanceId) {
    const res = this.inventory.equip(instanceId, this.playerData);
    this.updatePlayerHud();
    window.showGameMessage(res.msg, res.success ? 'success' : 'warning');
    if (res.success) this.openInventoryModal('equip');
  }

  showEquippedDetail(slotKey) {
    const equip = this.playerData.equipment[slotKey];
    if (!equip) return;
    const it = window.GAME_DATA.ITEMS[equip.itemId] || {};
    const sockets = equip.sockets || [null, null, null];

    const slotNames = {
      weapon: '神兵',
      head: '冠盔',
      armor: '铠甲',
      necklace: '项坠',
      belt: '腰带',
      boots: '鞋靴'
    };
    const sName = slotNames[slotKey] || slotKey;

    const attrMap = {
      atk: '物攻',
      matk: '法攻',
      def: '物防',
      mdef: '法防',
      hp: '气血',
      mp: '法力',
      spd: '速度',
      hit: '命中',
      crit: '暴击'
    };

    let attrsHtml = '';
    if (it.attrs && Object.keys(it.attrs).length > 0) {
      attrsHtml = `
        <div style="background:rgba(20,15,10,0.7);padding:8px 10px;border-radius:6px;border:1px solid #4a331c;margin-bottom:10px;">
          <div style="color:#ffd700;font-size:11px;font-weight:bold;margin-bottom:6px;letter-spacing:0.5px;">⚔️ 装备加成属性</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            ${Object.entries(it.attrs).map(([k, v]) => `
              <div style="background:#24170f;border:1px solid #3d2a1b;border-radius:4px;padding:3px 8px;display:flex;justify-content:space-between;font-size:11px;">
                <span style="color:#c4b5a0;">${attrMap[k] || k.toUpperCase()}</span>
                <span style="color:#fef08a;font-weight:bold;">+${v}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    const modalHtml = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-window item-detail-modal" onclick="event.stopPropagation()" style="max-width:320px;background:radial-gradient(circle at 50% 10%, #291c13 0%, #150f0b 100%);border:2px solid #8d6b38;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.85);overflow:hidden;">
          <div class="modal-header" style="background:linear-gradient(90deg, #44301e, #241b16);padding:10px 14px;border-bottom:1.5px solid #6b4e28;display:flex;justify-content:space-between;align-items:center;">
            <span class="modal-title" style="color:#fde047;font-size:14px;font-weight:bold;display:flex;align-items:center;gap:6px;">
              ${it.icon || '🛡️'} ${it.name} (+${equip.star || 0}星)
            </span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body" style="padding:12px;">
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px;">
              <div style="width:46px;height:46px;border-radius:8px;background:#24170f;border:1.5px solid #d4af37;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">
                ${it.icon || '🛡️'}
              </div>
              <div style="flex:1;">
                <div style="font-weight:bold;font-size:13.5px;color:#fef08a;">${it.name} <span style="color:#ffd700;font-size:11px;font-weight:normal;">(+${equip.star || 0}星)</span></div>
                <div style="font-size:10.5px;color:#a89682;margin-top:2px;">神位部位：【${sName}】</div>
              </div>
            </div>

            <div style="font-size:11px;color:#d8c6b4;background:rgba(0,0,0,0.38);border-left:3px solid #d4af37;padding:6px 9px;border-radius:0 5px 5px 0;margin-bottom:10px;line-height:1.5;">
              ${it.desc || '护体神装。'}
            </div>

            ${attrsHtml}

            <div style="background:rgba(20,15,10,0.7);border:1px solid #6b4e28;border-radius:6px;padding:8px 10px;margin-bottom:10px;">
              <div style="color:#ffd700;font-size:11px;font-weight:bold;margin-bottom:6px;">💎 宝石镶嵌孔 (${sockets.filter(Boolean).length}/3)</div>
              ${sockets.map((gemId, idx) => {
                if (gemId) {
                  const gIt = window.GAME_DATA.ITEMS[gemId] || {};
                  return `
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;background:#24170f;padding:2px 6px;border-radius:4px;border:1px solid #3d2a1b;">
                      <span style="font-size:11px;color:#fde047;">第${idx + 1}孔: 💎 ${gIt.name}</span>
                      <button class="dialogue-opt-btn" style="padding:1px 6px;font-size:9.5px;background:#78350f;" onclick="window.App2D.unsocketEquippedGem('${slotKey}', ${idx}); this.closest('.modal-overlay').remove();">拆除</button>
                    </div>
                  `;
                }
                return `<div style="color:#887766;font-size:10.5px;padding:2px 0;">第${idx + 1}孔: ⚪ 空孔位 (可镶嵌宝石)</div>`;
              }).join('')}
            </div>

            <div style="display:flex;gap:8px;">
              <button class="dialogue-opt-btn" style="flex:1;background:linear-gradient(180deg,#991b1b,#7f1d1d);border-color:#ef4444;" onclick="window.App2D.unequipItemToBag('${slotKey}'); this.closest('.modal-overlay').remove();">
                卸下装备
              </button>
              <button class="dialogue-opt-btn" onclick="this.closest('.modal-overlay').remove()" style="padding:6px 14px;">关闭</button>
            </div>
          </div>
        </div>
      </div>
    `;
    const v = document.getElementById('game-viewport') || document.body;
    v.insertAdjacentHTML('beforeend', modalHtml);
  }

  unequipItemToBag(slotKey) {
    const res = this.inventory.unequip(slotKey, this.playerData);
    this.updatePlayerHud();
    window.showGameMessage(res.msg, res.success ? 'success' : 'warning');
    if (res.success) this.openInventoryModal('equip');
  }

  useConsumableItem(instanceId) {
    if (!this.inventory) return;
    const slot = this.inventory.slots.find(s => s.instanceId === instanceId);
    if (!slot) return;
    const item = window.GAME_DATA.ITEMS[slot.itemId];
    if (!item) return;

    // R1.3: 飞行符等瞬移类消耗品安全校验与原子执行
    if (item.effect && item.effect.teleport) {
      if (this.isTeleporting || this.isMapTransitioning) {
        window.showGameMessage('正在施法移形换位，请勿频繁点击。', 'warning');
        return;
      }
      if (this.currentBattle) {
        window.showGameMessage('战阵交锋之中，妖气封锁退路，无法施展神符！', 'warning');
        return;
      }
      if (window.Dialogue && window.Dialogue.currentDialogue) {
        window.showGameMessage('交谈尚未毕退，不可施展神符。', 'warning');
        return;
      }
      const targetMap = item.effect.teleport === 'changan' ? 'changan_city' : item.effect.teleport;
      if (this.currentMapId === targetMap) {
        window.showGameMessage('少侠已然身处长安城中，无需耗用神符。', 'info');
        return;
      }
      const isChanganUnlocked = this.storyPhase && !this.storyPhase.startsWith('heaven_') && !this.storyPhase.startsWith('liujiacun_');
      if (!isChanganUnlocked) {
        window.showGameMessage('长安剧情尚未解锁，红尘道路未开，神符暂受禁制。', 'warning');
        return;
      }

      this.isTeleporting = true;
      document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
      this.inventory.removeItem(slot.itemId, 1);
      this.autoMovePath = [];
      this.autoMoveTargetCallback = null;
      this.keysDown = {};

      const safeSpawn = { x: 640, y: 512 };
      this.loadMap(targetMap, safeSpawn, { duration: 300, forceTransition: true });
      if (window.Sound && window.Sound.playSuccess) {
        try { window.Sound.playSuccess(); } catch (_) {}
      }
      window.showGameMessage('神符光华一闪，瞬息回转【大唐王都·长安城】！', 'success', 3500);
      this.updatePlayerHud();
      setTimeout(() => { this.isTeleporting = false; }, 500);
      return;
    }

    const res = this.inventory.useItem(instanceId, this.playerData, this.activeCombatPets[0]);
    this.updatePlayerHud();
    window.showGameMessage(res.msg, res.success ? 'success' : 'warning');
    if (res.success) this.openInventoryModal('consumable');
  }

  openGemSocketModal(gemInstanceId) {
    const gemSlot = this.inventory.slots.find(s => s.instanceId === gemInstanceId);
    if (!gemSlot) return;
    const gemItem = window.GAME_DATA.ITEMS[gemSlot.itemId];
    const bagEquips = this.inventory.slots.filter(s => {
      const it = window.GAME_DATA.ITEMS[s.itemId];
      return it && it.type === 'equip';
    });

    const modalHtml = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-window" onclick="event.stopPropagation()" style="max-width:340px;">
          <div class="modal-header">
            <span class="modal-title">💎 宝石镶嵌 · 注入神力</span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body" style="font-size:11px;color:#fef0cd;line-height:1.6;">
            <div style="margin-bottom:8px;">
              即将镶嵌：<span style="color:#ffd700;font-weight:bold;">${gemItem.name}</span><br>
              请选择背包中带有空孔位的装备：
            </div>
            <div style="max-height:200px;overflow-y:auto;">
              ${bagEquips.length === 0 ? `<div style="color:#887766;text-align:center;padding:12px;">背包内暂无可镶嵌装备</div>` : ''}
              ${bagEquips.map(eqSlot => {
      const eqItem = window.GAME_DATA.ITEMS[eqSlot.itemId];
      const sockets = (eqSlot.equipData && eqSlot.equipData.sockets) || [null, null, null];
      const emptyIdx = sockets.findIndex(g => !g);
      return `
                  <div style="background:#20140b;border:1px solid #5c4732;border-radius:6px;padding:6px 8px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
                    <div>
                      <div style="color:#ffd700;font-weight:bold;">${eqItem.name}</div>
                      <div style="font-size:10px;color:#aaa;">空孔位: ${sockets.filter(g => !g).length} / 3</div>
                    </div>
                    ${emptyIdx !== -1 ? `
                      <button class="dialogue-opt-btn" style="padding:3px 8px;font-size:10px;" onclick="window.App2D.doSocketGem('${eqSlot.instanceId}', '${gemSlot.itemId}', ${emptyIdx}); this.closest('.modal-overlay').remove();">
                        镶嵌于第${emptyIdx + 1}孔
                      </button>
                    ` : `<span style="font-size:10px;color:#e74c3c;">已满孔</span>`}
                  </div>
                `;
    }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    const v = document.getElementById('game-viewport') || document.body;
    v.insertAdjacentHTML('beforeend', modalHtml);
  }

  doSocketGem(equipInstanceId, gemItemId, socketIdx) {
    const res = this.inventory.socketGem(equipInstanceId, gemItemId, socketIdx, this.playerData);
    this.updatePlayerHud();
    window.showGameMessage(res.msg, res.success ? 'success' : 'warning');
    if (res.success) this.openInventoryModal('gem');
  }

  unsocketEquippedGem(slotKey, socketIdx) {
    const equip = this.playerData.equipment[slotKey];
    if (!equip || !equip.sockets) return false;
    const gemId = equip.sockets[socketIdx];
    if (!gemId) return false;

    if (!this.inventory.canAddItems([{ itemId: gemId, count: 1 }])) {
      window.showGameMessage('背包已满，无法拆除宝石！', 'warning');
      return false;
    }
    const added = this.inventory.addItem(gemId, 1);
    if (!added) {
      window.showGameMessage('包裹空间不足，拆除宝石失败！', 'warning');
      return false;
    }
    equip.sockets[socketIdx] = null;
    this.playerData.recalculateStats(false);
    this.updatePlayerHud();
    window.Sound.playSuccess();
    window.showGameMessage(`已拆除第 ${socketIdx + 1} 孔宝石并放入背包！`, 'success');
    return true;
  }

  // =========================================================================
  // 🐾 仙宠管理系统 (普通/散仙/金仙品质、10级一键学技转职、参战上限控制)
  // =========================================================================
  openPetManageModal() {
    if (window.Dialogue) window.Dialogue.close();
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());

    const maxCombat = this.playerData.getMaxCombatPets();
    const curCombatCount = this.activeCombatPets.length;

    const modalHtml = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-window pet-panel" onclick="event.stopPropagation()">
          <div class="modal-header">
            <span class="modal-title">随行仙宠 <small>${this.pets.length} 位同伴</small></span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body pet-body">
            <!-- 参战上限提示 -->
            <div class="pet-roster-summary">
              <div>
                参战阵列：<span style="color:#ffd700;font-weight:bold;">${curCombatCount} / ${maxCombat} 只</span>
                <span style="color:#aaa;font-size:10px;">(20/30/40级分别解锁1/2/3只)</span>
              </div>
              <span style="font-size:10px;color:#2ecc71;">角色等级: Lv.${this.playerData.level}</span>
            </div>

            <!-- 仙宠列表 -->
            <div class="pet-roster-list">
              ${this.pets.length === 0 ? `<div style="text-align:center;color:#887766;padding:20px;">暂无仙宠，可前往野外使用神符或法宝招降！</div>` : ''}
              ${this.pets.map(pet => {
      const isActive = this.activeCombatPets.some(p => p.instanceId === pet.instanceId);
      const qColor = pet.quality === 'jinxian' ? '#ffd700' : (pet.quality === 'sanxian' ? '#3498db' : '#aaa');
      const hasSkill = pet.skills && pet.skills.length > 0;
      const canLearn = ['jinxian', 'sanxian'].includes(pet.quality) && pet.level >= 10 && !pet.masterLessonLearned;
      // P3.2 传法资格准确指引 与 P3.3 物种定位标签
      const lessonGuide = this.getMasterLessonGuidance(pet) || { status: 'ineligible', hint: '' };
      const roleProfile = window.GAME_DATA.getSpeciesRoleProfile
        ? window.GAME_DATA.getSpeciesRoleProfile(pet.templateId) : null;

      const getPetPortrait = (p, size = 32) => {
        if (window.VisualIdentity && window.Portraits) return window.Portraits.getPortraitSvg(this.getUnitVisualId(p), size);
        const pId = p.templateId || p.id;
        if (pId && window.Portraits?.customMonsterImages?.[pId]) {
          return window.Portraits.getPortraitSvg(pId, size);
        }
        const pName = (p.name || '').toLowerCase();
        let rId = 'rat';
        if (pName.includes('猿猴将') || pName.includes('猛猿')) rId = 'yuanhou_jiang';
        else if (pName.includes('猕猴将') || pName.includes('灵猕')) rId = 'mihou_jiang';
        else if (pName.includes('树精') || pName.includes('枯树')) rId = 'kushu_jing';
        else if (pName.includes('树妖')) rId = 'shuyao';
        else if (pName.includes('青蛇') || pName.includes('小花蛇')) rId = 'xiaohua_she';
        else if (pName.includes('蛇妖')) rId = 'sheyao';
        else if (pName.includes('啸月') || pName.includes('狼妖')) rId = 'langyao';
        else if (pName.includes('野狼') || pName.includes('山狼')) rId = 'wolf_wild';
        else if (pName.includes('龟') || pName.includes('玄武')) rId = 'turtle';
        else if (pName.includes('蛇')) rId = 'snake';
        else if (pName.includes('狐')) rId = 'fox';
        else if (pName.includes('狼')) rId = 'wolf';
        else if (pName.includes('虎')) rId = 'tiger';
        else if (pName.includes('熊')) rId = 'bear';
        else if (pName.includes('蚌')) rId = 'clam';
        else if (pName.includes('蟹')) rId = 'crab';
        else if (pName.includes('虾')) rId = 'shrimp';
        else if (pName.includes('猪')) rId = 'pig';
        else if (pName.includes('猿') || pName.includes('猴')) rId = 'ape';
        else if (pName.includes('龙')) rId = 'xiaobailong';
        return window.Portraits ? window.Portraits.getPortraitSvg(rId, size) : `<span style="font-size:20px;">${p.icon || '🐾'}</span>`;
      };

      return `
                  <div class="pet-card ${isActive ? 'is-active' : ''}">
                    <div class="pet-card-header">
                      <div class="pet-identity">
                        <div class="pet-portrait">
                          ${getPetPortrait(pet, 52)}
                        </div>
                        <div>
                          <div class="pet-name-row">
                            <span style="font-weight:bold;color:#fef0cd;font-size:12px;">${pet.name} (Lv.${pet.level})</span>
                            ${pet.isProtected ? '<span title="加锁保护中（禁止献录与放生）" style="color:#ef4444;font-size:11px;margin-left:3px;">🔒</span>' : ''}
                            <span style="color:${qColor};font-weight:bold;font-size:10px;border:1px solid ${qColor};border-radius:4px;padding:0 4px;">【${pet.qualityName || '普通'}】</span>
                            ${roleProfile ? `<span title="${roleProfile.desc}" style="color:#9fd3a8;font-size:10px;border:1px solid #4a7c59;border-radius:4px;padding:0 4px;background:rgba(20,40,25,0.6);">${roleProfile.icon}${roleProfile.tag}</span>` : ''}
                            ${pet.className && pet.className !== '无门派' ? `<span style="color:#d4af37;font-size:10px;">[${pet.className}]</span>` : ''}
                          </div>
                        </div>
                      </div>
                      <label style="display:flex;align-items:center;gap:4px;font-size:10px;cursor:pointer;">
                        <input type="checkbox" ${isActive ? 'checked' : ''} onchange="window.App2D.togglePetCombat('${pet.instanceId}', this.checked)">
                        <span style="color:${isActive ? '#2ed573' : '#aaa'};font-weight:bold;">${isActive ? '⚔️已出战' : '备战'}</span>
                      </label>
                    </div>

                    <div class="pet-vitals">
                      <div><span>气血 ${pet.hp}/${pet.maxHp}</span><i style="width:${Math.max(0, Math.min(100, pet.maxHp ? pet.hp / pet.maxHp * 100 : 0))}%;"></i></div>
                      <div><span>法力 ${pet.mp}/${pet.maxMp}</span><i style="width:${Math.max(0, Math.min(100, pet.maxMp ? pet.mp / pet.maxMp * 100 : 0))}%;"></i></div>
                    </div>

                    <!-- 属性指标 -->
                    <div class="pet-stats">
                      <div>⚔️ 攻: ${pet.atk}</div>
                      <div>🛡️ 防: ${pet.def}</div>
                      <div>💨 速: ${pet.spd}</div>
                      <div>🌟 成长: ${pet.growth}</div>
                      <div class="pet-specialty" style="color:#ffd700;">
                        ${pet.classId ? `专精: ${pet.className}技能抗性+5%` : '暂无专精'}
                      </div>
                    </div>

                    <!-- 绝技与门派技能 -->
                    <div class="pet-attributes"><span>潜能 ${pet.potentialPoints || 0} 点 · ${pet.gender === 'female' ? '女' : '男'}</span>
                      ${[['sheng', '生', 'con'], ['fa', '法', 'int'], ['li', '力', 'str'], ['su', '速', 'dex']].map(([key, label, legacy]) => `<button class="dialogue-opt-btn" ${!(pet.potentialPoints > 0) ? 'disabled' : ''}
                        onclick="App2D.allocatePetAttribute('${pet.instanceId}', '${key}')">${label} ${pet.attrs?.[key] ?? pet.attrs?.[legacy] ?? 10} ＋</button>`).join('')}
                    </div>
                    <div class="pet-skill-row">
                      <div style="color:#bbb;">
                        ${hasSkill ? `绝技: <span style="color:#ffd700;font-weight:bold;">${pet.skills[0].name}</span> ${(pet.skills[0].desc || '').slice(0, 40)}` : `
                          <span style="color:${lessonGuide.status === 'ready' ? '#9fd3a8' : '#887766'};">✨ ${lessonGuide.hint}</span>
                        `}
                      </div>
                      <div class="pet-actions">
                        <button class="dialogue-opt-btn" style="padding:2px 6px;font-size:9px;background:${pet.isProtected ? '#b91c1c' : '#334155'};color:#fff;font-weight:bold;" onclick="window.App2D.togglePetProtection('${pet.instanceId}')" title="${pet.isProtected ? '点击解除加锁保护' : '点击开启加锁保护（防止误献录与误放生）'}">
                          ${pet.isProtected ? '🔒 已保护' : '🔓 未保护'}
                        </button>
                        <button class="dialogue-opt-btn" style="padding:2px 6px;font-size:9px;background:#475569;" onclick="window.App2D.confirmReleasePet('${pet.instanceId}')" title="放生仙宠归于天地山林">
                          🍃 放生
                        </button>
                        <button class="dialogue-opt-btn" style="padding:2px 6px;font-size:9px;background:#c59b27;color:#000;font-weight:bold;" onclick="window.App2D.openPetWashModal('${pet.instanceId}')">
                          🧴 洗炼
                        </button>
                        <button class="dialogue-opt-btn" style="padding:2px 6px;font-size:9px;background:#27ae60;font-weight:bold;" onclick="window.App2D.openPetBookModal('${pet.instanceId}')">
                          📚 研习兽诀
                        </button>
                        ${(!hasSkill && canLearn) ? `
                          <button class="dialogue-opt-btn" style="padding:2px 6px;font-size:9px;background:#8e44ad;" onclick="window.App2D.learnSkillForPet('${pet.instanceId}')">
                            ✨ 祖师传法（免费一次）
                          </button>
                        ` : ''}
                      </div>
                    </div>

                    <!-- 魔兽要诀被动特技槽位 (最多4槽) -->
                    <div class="pet-passives">
                      <span style="color:#ffd700;font-weight:bold;">被动神技:</span>
                      ${[0, 1, 2, 3].map(slotIdx => {
        const pass = (pet.passives && pet.passives[slotIdx]);
        if (pass) {
          return `<span style="background:#2c3e50;border:1px solid #f39c12;border-radius:3px;padding:1px 4px;color:#f1c40f;" title="${pass.desc}">${pass.icon || '📖'} ${pass.name}</span>`;
        } else {
          return `<span style="border:1px dashed #555;border-radius:3px;padding:1px 4px;color:#666;">[空槽位]</span>`;
        }
      }).join('')}
                    </div>
                  </div>
                `;
    }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    const v = document.getElementById('game-viewport') || document.body;
    v.insertAdjacentHTML('beforeend', modalHtml);
  }

  togglePetCombat(instanceId, isChecked) {
    const pet = this.pets.find(p => p.instanceId === instanceId);
    if (!pet) return;

    if (isChecked) {
      const maxCombat = this.playerData.getMaxCombatPets();
      if (this.activeCombatPets.length >= maxCombat) {
        window.showGameMessage(`少侠当前等级最多只可携带 ${maxCombat} 只仙宠出战！(升级可扩容)`, 'warning');
        this.openPetManageModal();
        return;
      }
      if (!this.activeCombatPets.some(p => p.instanceId === instanceId)) {
        this.activeCombatPets.push(pet);
        window.showGameMessage(`【${pet.name}】已加入出战阵型！`, 'success');
      }
    } else {
      this.activeCombatPets = this.activeCombatPets.filter(p => p.instanceId !== instanceId);
      window.showGameMessage(`【${pet.name}】已转为待命备战。`, 'info');
    }
    this.openPetManageModal();
  }

  allocatePetAttribute(instanceId, attrKey) {
    if (this.currentBattle || this.isTransitioning) return;
    const pet = this.pets.find(p => p.instanceId === instanceId);
    if (window.PetSystem.allocatePetPoints(pet, attrKey, 1)) {
      this.openPetManageModal();
      this.saveAutoProgress();
    }
  }

  learnSkillForPet(instanceId) {
    const master = this.npcs?.find(n => n.id === 'npc_puti_laozu');
    if (this.currentBattle || this.isTransitioning || this.currentMapId !== 'changan_shendan' || !master ||
      Math.hypot(this.playerChar.x - master.x, this.playerChar.y - master.y) > 96) {
      window.showGameMessage('请带10级散仙或金仙前往长安旁神坛，在菩提祖师身边免费受法。', 'info');
      return;
    }
    const pet = this.pets.find(p => p.instanceId === instanceId);
    if (!pet) return;
    const res = window.PetSystem.learnSkill(pet);
    if (res.success) {
      window.Sound.playCrit();
      window.showGameMessage(res.msg, 'success', 4500);
      this.openPetManageModal();
      this.saveAutoProgress();
    } else {
      window.showGameMessage(res.msg, 'warning');
    }
  }

  // P2.3: 切换仙宠加锁保护状态 (按 instanceId 生效，不锁整个物种)
  togglePetProtection(instanceId) {
    const pet = (this.pets || []).find(p => p.instanceId === instanceId);
    if (!pet) return;
    pet.isProtected = !pet.isProtected;
    if (window.Sound && window.Sound.playBeep) window.Sound.playBeep();
    window.showGameMessage(pet.isProtected ? `🔒 【${pet.name}】已开启实例保护，禁止献录与放生！` : `🔓 【${pet.name}】已解除加锁保护。`, 'info');
    this.saveAutoProgress();
    if (document.getElementById('scene-roster-modal')) {
      this.renderSceneRosterModal();
    }
    if (document.getElementById('shanhai-pet-picker-modal')) {
      this.openShanhaiPetPickerModal(pet.templateId);
    }
    if (document.querySelector('.modal-window.pet-panel')) {
      this.openPetManageModal();
    }
  }

  // P2.3: 二次确认放生仙宠
  confirmReleasePet(instanceId) {
    const pet = (this.pets || []).find(p => p.instanceId === instanceId);
    if (!pet) return;
    if (pet.isProtected) {
      window.showGameMessage(`【${pet.name}】处于加锁保护状态，无法放生！请先在仙宠面板解除保护。`, 'warning');
      return;
    }
    if ((this.activeCombatPets || []).some(p => p.instanceId === instanceId)) {
      window.showGameMessage(`【${pet.name}】正在出战中，请先转为备战待命后再放生。`, 'warning');
      return;
    }
    this.showConfirmModal({
      title: '⚠️ 仙宠放生确认',
      confirmText: '确认放生',
      cancelText: '取消',
      content: `确定要将随行仙宠【<strong>${pet.name} (Lv.${pet.level})</strong>】放归天地山林吗？<br><br><span style="color:#ef4444;font-weight:bold;">⚠️ 郑重提醒：放生后该仙宠将永久离开队伍，不可恢复！</span>`,
      onConfirm: () => {
        const res = window.PetSystem.releasePet(this, instanceId);
        if (res.success) {
          if (window.Sound && window.Sound.playSuccess) window.Sound.playSuccess();
          window.showGameMessage(res.msg, 'info');
          this.saveAutoProgress();
          this.openPetManageModal();
        } else {
          window.showGameMessage(res.msg, 'warning');
        }
      }
    });
  }

  // =========================================================================
  // P4.2 同伴闲谈 (西行见闻·同行闲谈)
  // 三组话题按剧情进度解锁；纯对话无奖励、无主线动作，不改任何存档进度。
  // 人物口吻约定：悟空敏锐，八戒看重饭食与省力，沙僧留心行李与路况。
  // =========================================================================
  getCompanionBanterGroups() {
    const has = id => (this.companions || []).some(c => c.id === id);
    const ev = (this.playerData && this.playerData.storyEvents) || {};
    return [
      {
        id: 'banter_gaolao',
        title: '🍜 高老庄路上 · 越问越长的近路',
        members: '八戒 · 悟空',
        scene: '八戒入队之后',
        available: has('companion_bajie'),
        steps: [
          { speaker: '猪八戒', speakerTitle: '【天蓬元帅】', text: '师父，俺不是怕远。只是这条近路，怎么越问越长？' },
          { speaker: '孙悟空', speakerTitle: '【齐天大圣】', text: '问路的是你，问饭的也是你。俺老孙看这山形，绕过前面那道梁就到了。' },
          { speaker: '猪八戒', speakerTitle: '【天蓬元帅】', text: '猴哥这话在理……高家庄的炊烟都望见了，俺先记着哪家的锅大，日后好登门谢恩。' },
          { speaker: '孙悟空', speakerTitle: '【齐天大圣】', text: '呆子，先把耙子握稳。妖怪不挑饭点，你家倒是挑。' }
        ]
      },
      {
        id: 'banter_wuzhuang',
        title: '🍐 五庄观 · 人参果与赔礼',
        members: '八戒 · 沙僧 · 悟空',
        scene: '人参果树复生之后',
        available: !!ev.wuzhuang_tree_restored,
        steps: [
          { speaker: '猪八戒', speakerTitle: '【天蓬元帅】', text: '沙师弟，你说那人参果……救活一棵树，能顺手再结几个不？' },
          { speaker: '沙和尚', speakerTitle: '【卷帘大将】', text: '二师兄，树是观里的，果子也是观里的。咱们是赔礼来的，不是赴宴来的。' },
          { speaker: '孙悟空', speakerTitle: '【齐天大圣】', text: '老沙这话稳。俺只管把树医活——往后谁再嘴馋闯祸，俺老孙可不替他求方子。' },
          { speaker: '猪八戒', speakerTitle: '【天蓬元帅】', text: '……俺就是问问。俺发誓，俺问的是学问，不是果子。' }
        ]
      },
      {
        id: 'banter_pingding',
        title: '🗡️ 平顶山下 · 苔痕与脚印',
        members: '沙僧 · 悟空',
        scene: '老君收宝之后',
        available: this.storyPhase === 'pingding_cleared',
        steps: [
          { speaker: '沙和尚', speakerTitle: '【卷帘大将】', text: '大师兄，这石上的苔，刚被人擦过。先看路，再听他怎么说。' },
          { speaker: '孙悟空', speakerTitle: '【齐天大圣】', text: '老沙眼尖。方才小妖报信的脚印也新——莲花洞的家当虽被老君收走了，山里却还有惦记的。' },
          { speaker: '沙和尚', speakerTitle: '【卷帘大将】', text: '行囊俺看着，都是干粮和还魂丹，丢一样都心疼。' },
          { speaker: '孙悟空', speakerTitle: '【齐天大圣】', text: '好沙僧。你守行李，俺去山那头转一圈——有俺在，翻不出大浪。' }
        ]
      }
    ];
  }

  // 打开同行闲谈入口列表 (战斗/转场/主线对白进行中不开放)
  openCompanionBanterModal() {
    if (typeof document === 'undefined') return;
    if (this.currentBattle || this.isTransitioning) {
      window.showGameMessage('眼下不是闲聊的时候——先应付眼前这场。', 'info');
      return;
    }
    document.querySelectorAll('.banter-modal-overlay').forEach(m => m.remove());
    const allGroups = this.getCompanionBanterGroups();
    const avail = allGroups.filter(g => g.available);

    const modalHtml = `
      <div class="modal-overlay banter-modal-overlay" onclick="if(event.target===this) this.remove()">
        <div class="modal-window" onclick="event.stopPropagation()" style="max-width:360px;max-height:82vh;display:flex;flex-direction:column;">
          <div class="modal-header">
            <span class="modal-title">🍵 西行见闻 · 同行闲谈</span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body" style="overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
            ${avail.length === 0 ? `
              <div style="text-align:center;color:#887766;padding:18px;line-height:1.8;">
                同行之人尚未到齐。<br>待八戒入队、五庄观救树、平顶山收宝之后，路上便有话可聊。
              </div>
            ` : ''}
            ${avail.map(g => `
              <button class="dialogue-opt-btn" style="text-align:left;padding:7px 9px;display:block;" onclick="window.App2D.playCompanionBanter('${g.id}')">
                <div style="color:#ffd700;font-weight:bold;font-size:12px;">${g.title}</div>
                <div style="font-size:10px;color:#a89278;margin-top:2px;">${g.members} · ${g.scene} · 点击听他们闲聊</div>
              </button>
            `).join('')}
            <div style="font-size:9.5px;color:#887766;border-top:1px solid #3d2c18;padding-top:5px;">
              闲谈只是路上的调剂：不影响主线，不发奖励，可随时重温。
            </div>
          </div>
          <div style="padding:6px 10px;border-top:1px solid #3d2c18;text-align:right;">
            <button class="dialogue-opt-btn" style="padding:3px 14px;font-size:11px;" onclick="this.closest('.modal-overlay').remove()">告辞</button>
          </div>
        </div>
      </div>
    `;
    const host = document.getElementById('game-viewport') || document.body;
    host.insertAdjacentHTML('beforeend', modalHtml);
    if (window.Sound) window.Sound.playBeep();
  }

  // 播放一组同伴闲谈 (纯对话，无 action、无奖励、无状态写入)
  playCompanionBanter(groupId) {
    const group = this.getCompanionBanterGroups().find(g => g.id === groupId && g.available);
    if (!group) return;
    document.querySelectorAll('.banter-modal-overlay').forEach(m => m.remove());
    if (window.Dialogue) {
      window.Dialogue.start({ steps: group.steps.map(s => ({ ...s })) });
    }
  }

  // =========================================================================
  // P4.1a 刘家村支线「谁偷了米」 (轻量趣闻：线索→追查→短遭遇→修粮袋→小额奖励)
  // 状态: not_started → accepted → hunting → reward_ready → done；错误追查可回头，无永久损失。
  // =========================================================================
  initRiceThiefQuest() {
    if (!this.playerData) return null;
    this.playerData.sideQuests = this.playerData.sideQuests || {};
    if (!this.playerData.sideQuests.sq_rice_thief) {
      this.playerData.sideQuests.sq_rice_thief = {
        id: 'sq_rice_thief',
        title: '谁偷了米',
        step: 'not_started',
        cluesRead: { marks: false, trail: false }
      };
    }
    return this.playerData.sideQuests.sq_rice_thief;
  }

  playRiceThiefDialogue() {
    const sq = this.initRiceThiefQuest();
    if (!sq) return;
    const GRANNY = { speaker: '王大婶', speakerTitle: '【看粮人家】', roleId: 'teashop_granny' };

    if (sq.step === 'done') {
      window.Dialogue.start({
        steps: [{ ...GRANNY, text: '新粮袋系的是双股死结，山雀都解不开，多亏少侠那日眼尖。路过就进来喝碗米汤，管饱。' }]
      });
      return;
    }

    if (sq.step === 'reward_ready') {
      window.Dialogue.start({
        steps: [
          { ...GRANNY, text: '抓住了？好、好！那小贼拖米拖得辛苦，俺也不好真动气——袋子破了是袋子的事，人手闲着是人手的事。' },
          {
            ...GRANNY,
            text: '来，搭把手把这袋角缝上……好了！这点谢礼莫嫌弃，连夜烙的饼还热着。',
            options: [
              {
                text: '【收下谢礼】',
                action: () => { this.claimRiceThiefReward(); }
              },
              {
                text: '【改日再领】',
                action: () => { if (window.Dialogue) window.Dialogue.close(); }
              }
            ]
          }
        ]
      });
      return;
    }

    if (sq.step === 'hunting') {
      window.Dialogue.start({
        steps: [
          {
            ...GRANNY,
            text: '草垛就在东墙根，掀开草捆便知分晓。少侠当心，拖得动半袋米的，怕不止一只。',
            options: [
              { text: '【这就去掀草垛】', action: () => { this.triggerRiceThiefBattle(); } },
              { text: '【先做别的】', action: () => { if (window.Dialogue) window.Dialogue.close(); } }
            ]
          }
        ]
      });
      return;
    }

    if (sq.step === 'accepted') {
      const clueList = [];
      clueList.push(
        !sq.cluesRead.marks
          ? { text: '【查看米袋旁的痕迹】', action: () => { sq.cluesRead.marks = true; this.saveAutoProgress(); this.playRiceThiefDialogue(); } }
          : { text: '【痕迹】已看过：爪印细小，一列排开', action: () => { this.playRiceThiefDialogue(); } }
      );
      clueList.push(
        !sq.cluesRead.trail
          ? { text: '【跟着碎米查拖痕】', action: () => { sq.cluesRead.trail = true; this.saveAutoProgress(); this.playRiceThiefDialogue(); } }
          : { text: '【拖痕】已看过：细碎一路，往东墙根去', action: () => { this.playRiceThiefDialogue(); } }
      );

      window.Dialogue.start({
        steps: [
          {
            ...GRANNY,
            text: '少侠你看：绳结不是咬断的，是解开的；袋角也没破，米是被人捧走的。俺活了五十年，头回见这么讲究的贼。',
            options: clueList
          },
          {
            ...GRANNY,
            text: '依少侠看，该往哪儿追？',
            options: [
              {
                text: '【后山草窝】野物都爱钻林子',
                action: () => {
                  window.Dialogue.start({
                    steps: [
                      {
                        speaker: '少侠', speakerTitle: '【探查后山】',
                        text: '后山草窝里只有一窝睡眼惺忪的野兔。为首那只瞪了你一眼，翻个身又睡了——兔子的爪印又圆又钝，和米袋边那排细爪印对不上。'
                      },
                      {
                        speaker: '少侠', speakerTitle: '【探查后山】',
                        text: '那串拖痕分明一直往东墙根去。回头再选就是，兔子没丢东西，你也没白跑。',
                        options: [{ text: '【回去再想想】', action: () => { this.playRiceThiefDialogue(); } }]
                      }
                    ]
                  });
                }
              },
              {
                text: '【东墙根草垛】拖痕直指那边',
                action: () => {
                  sq.step = 'hunting';
                  this.saveAutoProgress();
                  this.triggerRiceThiefBattle();
                }
              },
              { text: '【改日再查】', action: () => { if (window.Dialogue) window.Dialogue.close(); } }
            ]
          }
        ]
      });
      return;
    }

    // not_started：接取
    window.Dialogue.start({
      steps: [
        {
          ...GRANNY,
          text: '哎哟少侠，可巧了！俺家粮袋昨夜又瘪了半袋——这月第三回了！绳子好端端解开着，米却少了，邪门不邪门？'
        },
        {
          ...GRANNY,
          text: '村里人都说去请道士。俺琢磨着，先看脚印再花钱也不迟。少侠若不赶路，帮俺瞧瞧？',
          options: [
            {
              text: '【接下这桩小事】',
              action: () => {
                sq.step = 'accepted';
                this.saveAutoProgress();
                window.Sound.playSuccess();
                window.showGameMessage('📜 已接取趣闻小任务【谁偷了米】：查看米袋旁的线索，找出偷米的小贼！', 'info', 4500);
                this.playRiceThiefDialogue();
              }
            },
            { text: '【改日再谈】', action: () => { if (window.Dialogue) window.Dialogue.close(); } }
          ]
        }
      ]
    });
  }

  triggerRiceThiefBattle() {
    if (window.Dialogue) window.Dialogue.close();
    const rats = [
      {
        id: 'rice_thief_rat_main',
        templateId: 'shuo_shu',
        name: '拖米硕鼠',
        appearance: 'giant_rat',
        modelId: 'rat',
        level: 3,
        hp: 160,
        maxHp: 160,
        mp: 60,
        maxMp: 60,
        atk: 36,
        def: 12,
        spd: 24,
        skills: ['撕咬']
      },
      {
        id: 'rice_thief_rat_sub',
        templateId: 'shuo_shu',
        name: '捧米小鼠',
        appearance: 'giant_rat',
        modelId: 'rat',
        level: 2,
        hp: 110,
        maxHp: 110,
        mp: 40,
        maxMp: 40,
        atk: 28,
        def: 10,
        spd: 20,
        skills: ['撕咬']
      }
    ];
    this.start2DBattle(rats, () => {
      const sq = this.initRiceThiefQuest();
      if (sq && sq.step === 'hunting') {
        sq.step = 'reward_ready';
        this.saveAutoProgress();
      }
      window.showGameMessage('🐀 拖米的小贼被当场按住！回村告诉王大婶，帮她把粮袋补好。', 'success', 5000);
    });
  }

  claimRiceThiefReward() {
    const sq = this.initRiceThiefQuest();
    if (!sq || sq.step !== 'reward_ready') {
      window.showGameMessage('王大婶眯眼一笑：“先抓贼，再领饼，规矩不能乱。”', 'info');
      return;
    }
    const result = this.playerData.claimStoryReward('rice_thief_done', {
      items: [{ itemId: 'jinchuang_yao', count: 2 }],
      silver: 600,
      exp: 450
    }, this.inventory);
    if (!result.success) {
      if (result.reason !== 'already_claimed') {
        window.showGameMessage('行囊装不下大婶的谢礼，整理出空位后再来，饼给你留着。', 'warning', 4500);
      }
      return;
    }
    sq.step = 'done';
    sq.status = 'completed';
    this.updatePlayerHud();
    this.saveAutoProgress();
    if (window.Sound) window.Sound.playSuccess();
    window.showGameMessage('🎉【谁偷了米】水落石出！获热饼两张(金创药×2)、600 银两与 450 经验，粮袋也补好了！', 'success', 5000);
    if (window.Dialogue) window.Dialogue.close();
    this.refreshMapNpcs();
  }

  // =========================================================================
  // P4.1b 长安趣闻「写错的招牌」 (朴实/俏皮两选一同奖，选择持久化，回访保留)
  // =========================================================================
  playSignBoardDialogue() {
    const ev = (this.playerData.storyEvents = this.playerData.storyEvents || {});
    const LAO = { speaker: '老孙', speakerTitle: '【胡饼摊主】', roleId: 'changan_hawker' };

    if (ev.changan_sign_task === 'done') {
      const signText = ev.changan_sign_style === 'plain'
        ? '老孙胡饼，现烤现卖，皮脆馅足。'
        : '老孙胡饼，一口酥到凌霄殿——本摊概不渡劫。';
      window.Dialogue.start({
        steps: [{ ...LAO, text: `招牌挂的是少侠改的那句：“${signText}”打今早起，问价的人排过了茶肆门口。回头再给俺那句渡劫的也题一幅，裱起来看！` }]
      });
      return;
    }

    window.Dialogue.start({
      steps: [
        {
          ...LAO,
          text: '少侠给评评理：俺这招牌写的是“天下第一饼，一饼得道成仙”。今早杜书生在摊前笑弯了腰，路过的人跟着笑，就是没人买饼！'
        },
        {
          ...LAO,
          text: '俺一个打饼的，实在想不出又体面又实在的话。少侠走南闯北见多识广，帮俺题一句？',
          options: [
            {
              text: '【题朴实的】“现烤现卖，皮脆馅足”',
              action: () => { this.chooseSignBoardStyle('plain'); }
            },
            {
              text: '【题俏皮的】“一口酥到凌霄殿——本摊概不渡劫”',
              action: () => { this.chooseSignBoardStyle('witty'); }
            },
            { text: '【让俺再想想】', action: () => { if (window.Dialogue) window.Dialogue.close(); } }
          ]
        }
      ]
    });
  }

  chooseSignBoardStyle(style) {
    const result = this.playerData.claimStoryReward('changan_sign_help', { silver: 500, exp: 300 }, this.inventory);
    if (!result.success) {
      if (result.reason !== 'already_claimed') {
        window.showGameMessage('老孙挠头：“谢礼是银钱，不占行囊……再试一次？”', 'warning', 4000);
      }
      return;
    }
    const ev = this.playerData.storyEvents;
    ev.changan_sign_task = 'done';
    ev.changan_sign_style = (style === 'witty') ? 'witty' : 'plain';
    this.updatePlayerHud();
    this.saveAutoProgress();
    if (window.Dialogue) window.Dialogue.close();
    if (window.Sound) window.Sound.playSuccess();
    const signText = ev.changan_sign_style === 'plain'
      ? '老孙胡饼，现烤现卖，皮脆馅足。'
      : '老孙胡饼，一口酥到凌霄殿——本摊概不渡劫。';
    window.showGameMessage(`🎉【写错的招牌】新招牌挂出：“${signText}”获 500 银两与 300 经验谢礼！`, 'success', 5000);
    this.refreshMapNpcs();
  }

  // =========================================================================
  // 钱庄与医馆系统 (存取银两、理财利息分红、一键满状态)
  // =========================================================================
  openBankModal() {
    if (window.Dialogue) window.Dialogue.close();
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());

    const bankSilver = this.playerData.bankSilver || 0;
    const modalHtml = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-window" onclick="event.stopPropagation()" style="max-width:340px;">
          <div class="modal-header">
            <span class="modal-title">💰 大唐钱庄 · 汇通天下</span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body" style="font-size:11px;color:#fef0cd;line-height:1.7;">
            <div style="background:#20140b;border:1px solid #c59b27;border-radius:6px;padding:8px;margin-bottom:8px;">
              <div>🪙 身上现有银两：<span style="color:#ffd700;font-weight:bold;">${this.playerData.silver} 两</span></div>
              <div>🏦 钱庄保险金库：<span style="color:#2ecc71;font-weight:bold;">${bankSilver} 两</span></div>
            </div>
            <div style="font-size:10px;color:#aaa;margin-bottom:8px;">
              钱庄理财：存入金库后，每次外出降妖历练皆可申领 5%~10% 的商业分红利息！
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">
              <button class="dialogue-opt-btn" onclick="window.App2D.depositSilver(1000)">存入 1000 两</button>
              <button class="dialogue-opt-btn" onclick="window.App2D.withdrawSilver(1000)">取出 1000 两</button>
              <button class="dialogue-opt-btn" onclick="window.App2D.depositSilver(window.App2D.playerData.silver)">存入全部</button>
              <button class="dialogue-opt-btn" onclick="window.App2D.withdrawSilver(window.App2D.playerData.bankSilver||0)">取出全部</button>
            </div>
            <button class="dialogue-opt-btn" style="width:100%;background:#8e44ad;" onclick="window.App2D.claimBankInterest()">
              📈 申领理财利息分红
            </button>
          </div>
        </div>
      </div>
    `;
    const v = document.getElementById('game-viewport') || document.body;
    v.insertAdjacentHTML('beforeend', modalHtml);
  }

  depositSilver(amount) {
    amount = Math.min(amount, this.playerData.silver);
    if (amount <= 0) {
      window.showGameMessage('身上没有足够银两可存入！', 'warning');
      return;
    }
    this.playerData.silver -= amount;
    this.playerData.bankSilver = (this.playerData.bankSilver || 0) + amount;
    this.updatePlayerHud();
    window.Sound.playSuccess();
    window.showGameMessage(`成功存入 ${amount} 两银两至大唐钱庄金库！`, 'success');
    this.openBankModal();
  }

  withdrawSilver(amount) {
    amount = Math.min(amount, this.playerData.bankSilver || 0);
    if (amount <= 0) {
      window.showGameMessage('钱庄金库中暂无银两可支取！', 'warning');
      return;
    }
    this.playerData.bankSilver -= amount;
    this.playerData.silver += amount;
    this.updatePlayerHud();
    window.Sound.playSuccess();
    window.showGameMessage(`成功从钱庄金库支取 ${amount} 两银两！`, 'success');
    this.openBankModal();
  }

  claimBankInterest() {
    const bank = this.playerData.bankSilver || 0;
    if (bank < 500) {
      window.showGameMessage('钱庄存款不足 500 两，暂未产生理财分红！', 'warning');
      return;
    }
    const rate = 0.08;
    const interest = Math.max(50, Math.floor(bank * rate));
    this.playerData.silver += interest;
    this.updatePlayerHud();
    window.Sound.playLevelUp();
    window.showGameMessage(`🎉 恭喜申领钱庄理财红利 ${interest} 两银两！`, 'success', 3500);
    this.openBankModal();
  }

  healAllAtDoctor() {
    if (this.playerData.silver < 50) {
      window.showGameMessage('诊金不足！妙手回春需要 50 两银两。', 'warning');
      return;
    }
    this.playerData.silver -= 50;
    this.playerData.hp = this.playerData.maxHp;
    this.playerData.mp = this.playerData.maxMp;

    this.pets.forEach(p => {
      p.hp = p.maxHp;
      p.mp = p.maxMp;
    });

    this.updatePlayerHud();
    window.Sound.playLevelUp();
    window.showGameMessage('🏥【妙手回春】老医师银针度穴！全员气血、精力已悉数全满！伤势痊愈！', 'success', 4000);
  }

  openPharmacyModal() {
    if (window.Dialogue) window.Dialogue.close();
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());

    const meds = [
      { id: 'jinchuang_yao', name: '金创药', price: 80, desc: '气血 +300' },
      { id: 'dahuan_dan', name: '大还丹', price: 350, desc: '气血 +1200' },
      { id: 'foshou', name: '佛手', price: 60, desc: '精力 +150' },
      { id: 'biling_dan', name: '碧灵丹', price: 400, desc: '精力 +600' },
      { id: 'xuelian_dan', name: '天山雪莲丹', price: 1200, desc: '气血 +3000' },
      { id: 'jiuzhuan_dan', name: '九转还魂丹', price: 2000, desc: '复活并恢复 800 HP' },
      { id: 'silver_gourd', name: '紫竹银葫芦', price: 800, desc: '招降散仙野怪 (70%概率)' },
      { id: 'gold_gourd', name: '紫金红葫芦', price: 2500, desc: '招降金仙圣兽 (60%概率)' }
    ];

    const modalHtml = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-window" onclick="event.stopPropagation()" style="max-width:360px;">
          <div class="modal-header">
            <span class="modal-title">💊 百草医馆药铺 · 救急仙药</span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body" style="font-size:11px;color:#fef0cd;line-height:1.6;">
            <div style="margin-bottom:6px;color:#ffd700;">现有银两：${this.playerData.silver} 两</div>
            <div style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
              ${meds.map(m => `
                <div style="background:#20140b;border:1px solid #5c4732;border-radius:6px;padding:6px 8px;display:flex;justify-content:space-between;align-items:center;">
                  <div>
                    <div style="color:#ffd700;font-weight:bold;">${m.name} <span style="font-size:10px;color:#2ecc71;">(${m.desc})</span></div>
                    <div style="font-size:9px;color:#aaa;">单价: ${m.price} 两</div>
                  </div>
                  <button class="dialogue-opt-btn" style="padding:3px 8px;font-size:10px;" onclick="window.App2D.buyMedicine('${m.id}', ${m.price})">购买进包</button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    const v = document.getElementById('game-viewport') || document.body;
    v.insertAdjacentHTML('beforeend', modalHtml);
  }

  buyMedicine(itemId, price) {
    if (!window.GAME_DATA.ITEMS[itemId] || !Number.isSafeInteger(price) || price < 0) return false;
    if (this.playerData.silver < price) {
      window.showGameMessage('身上银两不足！', 'warning');
      return false;
    }
    if (!this.inventory?.addItem(itemId, 1)) {
      window.showGameMessage('储物背包已满，无法容纳新物品！', 'warning');
      return false;
    }
    this.playerData.silver -= price;
    this.updatePlayerHud();
    window.Sound.playSuccess();
    const item = window.GAME_DATA.ITEMS[itemId];
    window.showGameMessage(`购买成功！获得【${item.name}】*1，已放入背包！`, 'success');
    return true;
  }

  setHomeResidence(mapId) {
    this.playerData.homeResidence = mapId;
    window.Sound.playSuccess();
    window.showGameMessage('🏛️【户籍落定】已成功将【大唐王都·长安城】登记为您的永久居住地！各地土地神处可一键直达！', 'success', 4500);
  }

  teleportToResidence() {
    const mapId = (this.playerData && this.playerData.homeResidence) ? this.playerData.homeResidence : 'liujiacun';
    const coords = (mapId === 'liujiacun') ? { x: 23 * 32, y: 10 * 32 } : { x: 3 * 32, y: 11 * 32 };
    this.loadMap(mapId, coords);
    if (window.Sound) window.Sound.playLevelUp();
    if (!this.playerData || !this.playerData.homeResidence) {
      window.showGameMessage('🏠 少侠尚未在长安户籍官处定居登记，已先行将你送回初心祖居【刘家村】！', 'info', 4000);
    } else {
      window.showGameMessage('🏠 催动归家神印！瞬息回到温馨的定居家园！', 'success', 3500);
    }
  }

  // =========================================================================
  // ☯️ 八卦乾坤引路法阵 (传送门光柱、旋转符文与悬浮云纹牌匾)
  // =========================================================================
  renderMagicPortals(portals) {
    const time = Date.now() / 1000;
    this.ctx.save();

    for (const p of portals) {
      const sx = p.x - this.camera.x;
      const sy = p.y - this.camera.y;

      // 视锥体剔除：不在视口内的传送门不渲染，防止边缘残损露字
      if (sx < -80 || sx > this.camera.viewportWidth + 80 || sy < -80 || sy > this.camera.viewportHeight + 80) {
        continue;
      }

      const isLocked = !!(p.minLevel && this.player && this.player.level < p.minLevel);

      // 1. 地面透视椭圆阴阳太极光晕
      this.ctx.save();
      this.ctx.translate(sx, sy + 6);
      this.ctx.scale(1.0, 0.45);

      const grad = this.ctx.createRadialGradient(0, 0, 4, 0, 0, 24);
      if (isLocked) {
        grad.addColorStop(0, 'rgba(255, 99, 71, 0.85)');
        grad.addColorStop(0.5, 'rgba(231, 76, 60, 0.55)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        grad.addColorStop(0, 'rgba(255, 215, 0, 0.85)');
        grad.addColorStop(0.5, 'rgba(52, 152, 219, 0.55)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 24, 0, Math.PI * 2);
      this.ctx.fill();

      // 旋转符文光圈
      this.ctx.rotate(time * 1.5);
      this.ctx.strokeStyle = isLocked ? 'rgba(255, 99, 71, 0.75)' : 'rgba(255, 215, 0, 0.75)';
      this.ctx.lineWidth = 1.8;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 18, 0, Math.PI * 2);
      this.ctx.stroke();

      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3;
        const rx = Math.cos(ang) * 18;
        const ry = Math.sin(ang) * 18;
        this.ctx.fillStyle = isLocked ? '#ff6b6b' : '#ffd700';
        this.ctx.beginPath();
        this.ctx.arc(rx, ry, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();

      // 2. 垂直上升的仙气灵珠
      for (let i = 0; i < 3; i++) {
        const offset = ((time * 30 + i * 20) % 40);
        const pAlpha = 1 - offset / 40;
        this.ctx.fillStyle = isLocked ? `rgba(255, 120, 100, ${pAlpha})` : `rgba(255, 230, 100, ${pAlpha})`;
        this.ctx.beginPath();
        this.ctx.arc(sx + Math.sin(time * 3 + i) * 8, sy - offset, 2.2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // 3. 悬浮在法阵上方 28px 的国风云纹木牌匾
      const labelText = isLocked ? `🔒 ${p.name} [需Lv.${p.minLevel}]` : p.name;
      this.ctx.font = 'bold 10px "Microsoft YaHei", sans-serif';
      const textMetrics = this.ctx.measureText(labelText);
      const boxW = textMetrics.width + 16;
      const boxH = 18;
      const boxX = sx - boxW / 2;
      const boxY = sy - 28 + Math.sin(time * 2) * 2;

      // 牌匾底框
      this.ctx.fillStyle = isLocked ? 'rgba(42, 12, 12, 0.92)' : 'rgba(25, 16, 10, 0.9)';
      this.ctx.strokeStyle = isLocked ? '#ff6b6b' : '#ffd700';
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.ctx.roundRect(boxX, boxY, boxW, boxH, 4);
      this.ctx.fill();
      this.ctx.stroke();

      // 发光金字或警示字
      this.ctx.fillStyle = isLocked ? '#ff9999' : '#ffd700';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(labelText, sx, boxY + boxH / 2);
    }

    this.ctx.restore();
  }


  // =========================================================================
  // 剧情转场与战斗系统 (彻底修复遮蔽与卡死)
  // =========================================================================

  // 1. 因缘事件一：天蓬调戏嫦娥，威灵大将出手制伏 (此时玩家随从为空，单挑醉酒天蓬，2~3回合制胜)
  triggerTianpengBattle() {
    if (window.Dialogue) {
      window.Dialogue.close();
    }

    // 确保打天蓬时随从绝对为空，只有玩家一人出战！
    this.companions = [];
    this.pets = [];
    this.activeCombatPets = [];

    const tianpengBoss = {
      id: 'tianpeng_boss',
      templateId: 'tianpeng_marshal',
      appearance: 'tianpeng_marshal',
      modelId: 'tianpeng_marshal',
      name: '天蓬元帅 (醉酒)',
      isMutated: false,
      isBoss: true,
      level: 42,
      hp: 900,       // 威灵大将Lv.50普攻约360~450，恰好2~3回合击败
      maxHp: 900,
      mp: 600,
      maxMp: 600,
      atk: 210,
      def: 60,
      matk: 80,
      mdef: 75,
      spd: 30,
      skills: ['九齿钉耙', '天罡三十六变']
    };

    this.start2DBattle([tianpengBoss], () => {
      this.storyPhase = 'heaven_to_lingxiao';
      this.scheduleStoryDialogue('tianpeng_after_battle', 500);
    }, () => {
      window.showGameMessage('天蓬元帅醉酒蛮劲十足！仙躯已抚平复原，上前可再次与其对招！', 'warning', 3500);
    });
  }

  // 2. 因缘事件三前哨：东胜神洲花果山与守山健将赤毛马猴切磋
  triggerChimaoBattle() {
    if (window.Dialogue) {
      window.Dialogue.close();
    }

    const chimaoBoss = {
      id: 'chimao_boss',
      templateId: 'chimao_mahou',
      appearance: 'chimao_mahou',
      modelId: 'chimao_mahou',
      name: '赤毛马猴 (花果山健将)',
      isMutated: false,
      isBoss: true,
      level: 40,
      hp: 2000,
      maxHp: 2000,
      mp: 500,
      maxMp: 500,
      atk: 180,
      def: 90,
      matk: 70,
      mdef: 70,
      spd: 32,
      skills: ['猴拳连打', '掷石']
    };

    this.start2DBattle([chimaoBoss], () => {
      this.storyPhase = 'heaven_huaguoshan_rescue';
      this.scheduleStoryDialogue('chimao_shuilien_after', 500);
    }, () => {
      window.showGameMessage('花果山健将身手敏捷！重整旗鼓后可再次与其切磋！', 'warning', 3500);
    });
  }

  // 3. 因缘事件三：水帘洞大战先锋巨灵神，拯救无辜幼小猴群
  triggerJulingBattle() {
    if (window.Dialogue) {
      window.Dialogue.close();
    }

    const heavenlyBoss = {
      id: 'juling_shen_boss',
      templateId: 'juling_shen',
      appearance: 'juling_shen',
      modelId: 'juling_shen',
      name: '征讨先锋·巨灵神',
      isMutated: false,
      isBoss: true,
      level: 48,
      hp: 3200,
      maxHp: 3200,
      mp: 800,
      maxMp: 800,
      atk: 220,
      def: 130,
      matk: 80,
      mdef: 80,
      spd: 35,
      skills: ['宣花开山劈', '神力狂暴']
    };

    this.start2DBattle([heavenlyBoss], () => {
      this.storyPhase = 'heaven_juling_defeated';
      this.scheduleStoryDialogue('juling_defeated_to_huaguoshan', 500);
    }, () => {
      window.showGameMessage('巨灵神天界重斧神威赫赫！回气休整后可再次拔戟交锋！', 'warning', 3500);
    });
  }

  // 4. 花果山总决战：齐天大圣神威极境，四天将大阵合围 (大圣极强打谁基本都是一下秒杀！)
  triggerWukongHavocBattle() {
    if (window.Dialogue) {
      window.Dialogue.close();
    }

    // 四天将大阵同伴出战 (玩家 + 托塔李天王、哪吒三太子、九天雷公神将)
    this.companions = [
      {
        id: 'companion_litianwang',
        name: '托塔李天王',
        roleId: 'litianwang',
        modelId: 'litianwang',
        level: 50,
        hp: 8000,
        maxHp: 8000,
        mp: 2000,
        maxMp: 2000,
        atk: 280,
        def: 160,
        spd: 36,
        skills: [{ id: 'linglong_ta', name: '玲珑宝塔', costMp: 50 }]
      },
      {
        id: 'companion_nezha',
        name: '哪吒三太子',
        roleId: 'nezha',
        modelId: 'nezha',
        level: 50,
        hp: 7500,
        maxHp: 7500,
        mp: 2500,
        maxMp: 2500,
        atk: 320,
        def: 150,
        spd: 42,
        skills: [{ id: 'sanmei_zhenhuo', name: '三昧真火', costMp: 60 }]
      },
      {
        id: 'companion_leigong',
        name: '九天雷公神将',
        roleId: 'leigong',
        modelId: 'leigong',
        level: 48,
        hp: 6800,
        maxHp: 6800,
        mp: 1800,
        maxMp: 1800,
        atk: 300,
        def: 140,
        spd: 38,
        skills: [{ id: 'leiting_wanjun', name: '五雷轰顶', costMp: 55 }]
      }
    ];

    // 齐天大圣神威极境：实力通天彻地，打谁基本都是一下！
    const wukongBoss = {
      id: 'wukong_havoc_boss',
      templateId: 'sun_wukong',
      name: '齐天大圣·孙悟空 (神威极境)',
      isMutated: false,
      isBoss: true,
      level: 99,
      hp: 999999,
      maxHp: 999999,
      mp: 99999,
      maxMp: 99999,
      atk: 99999,      // 极强神威，打谁基本都是一下秒杀！
      def: 9999,
      matk: 99999,
      mdef: 9999,
      spd: 99,
      skills: ['大闹天宫', '千钧神棒', '法天象地']
    };

    const proceedToYangjian = () => {
      this.storyPhase = 'heaven_yangjian_capture';
      this.companions = []; // 清空临时助战天将
      this.scheduleStoryDialogue('yangjian_capture_and_banishment', 600);
    };

    this.start2DBattle([wukongBoss], proceedToYangjian, proceedToYangjian);
  }

  // 兼容旧接口
  triggerWukongSparBattle() {
    this.triggerWukongHavocBattle();
  }

  triggerHeavenBattle() {
    this.triggerJulingBattle();
  }

  // 2. 贬落凡尘刘家村
  executeBanishment() {
    if (this.storyPhase === 'liujiacun_start') return;
    this.playerData.level = 1;
    this.playerData.exp = 0;
    this.playerData.potentialPoints = 0;
    this.playerData.attributes = { con: 10, str: 10, int: 10, dex: 10, sta: 10 };
    this.playerData.name = '失忆行者';
    this.playerData.unequipItem('weapon');
    this.playerData.unequipItem('armor');
    this.playerData.unequipItem('head');
    this.playerData.unequipItem('belt');
    this.playerData.unequipItem('boots');
    this.playerData.unequipItem('necklace');
    this.playerChar.name = this.playerData.name;
    this.playerChar.appearance = 'mortal_wanderer';
    this.playerChar.speed = GAME_SPEED_CONFIG.PLAYER_MORTAL_SPEED; // 敏捷行云流水凡尘移速 (基础配置)
    // 贬落凡尘刘家村：神力被封，天界神骑收回，凡尘开局无马步行
    if (this.mountSystem) {
      this.mountSystem.mounts = [];
      this.mountSystem.activeMountId = null;
      this.mountSystem.isRiding = false;
    }
    if (this.playerChar) {
      this.playerChar.isRiding = false;
    }
    if (window.GAME_DATA && typeof window.GAME_DATA.getSkillsForClassAndGender === 'function') {
      this.playerData.skills = window.GAME_DATA.getSkillsForClassAndGender(this.playerData.classId, this.playerData.gender);
    }
    this.playerData.recalculateStats(true);
    this.updatePlayerHud();

    this.storyPhase = 'liujiacun_start';
    this.questKills = { mushrooms: 0, trees: 0, rats: 0 };

    if (window.Dialogue) window.Dialogue.close();
    this.loadMap('liujiacun', null, {
      onComplete: () => {
        if (this.currentMapId === 'liujiacun' && this.storyPhase === 'liujiacun_start') {
          this.scheduleStoryDialogue('liuboqin_talk', 0);
        }
      }
    });
  }

  // 3. 采摘野生青蘑菇 (生火做饭)
  collectMushroom() {
    if (window.Dialogue) window.Dialogue.close();
    if (!this.questKills) this.questKills = { mushrooms: 0, trees: 0, rats: 0 };

    // 拾取距离玩家最近的蘑菇实体并永久移除，绝不重复刷新
    let nearestMushroom = null;
    let minDist = 9999;
    for (const n of this.npcs) {
      if (n.id.startsWith('prop_mushroom_')) {
        const d = Math.hypot(n.x - this.playerChar.x, n.y - this.playerChar.y);
        if (d < minDist) {
          minDist = d;
          nearestMushroom = n;
        }
      }
    }
    if (!nearestMushroom || !this.inventory?.addItem('item_fresh_mushroom', 1)) {
      window.showGameMessage('蘑菇还在地上；先靠近木牌旁的蘑菇，并给行囊腾出位置。', 'warning');
      return false;
    }
    this.questKills.mushrooms = (this.questKills.mushrooms || 0) + 1;
    if (window.Sound) window.Sound.playSuccess();
    if (nearestMushroom) {
      if (!this.collectedProps) this.collectedProps = new Set();
      this.collectedProps.add(nearestMushroom.id);
      this.npcs = this.npcs.filter(n => n.id !== nearestMushroom.id);
    }

    if (this.questKills.mushrooms >= 2) {
      this.storyPhase = 'liujiacun_mushrooms_collected';
      window.showGameMessage('🎉 2朵新鲜野生青蘑菇已采齐！快拿去给刘伯钦生火下锅！', 'success', 4500);
      const boqin = this.npcs.find(n => n.id === 'npc_liuboqin');
      if (boqin) boqin.questStatus = 'available';
    } else {
      window.showGameMessage(`🍄 采得野生青蘑菇！(${this.questKills.mushrooms}/2)`, 'info', 3000);
    }
    this.updatePlayerHud();
    this.saveAutoProgress();
    return true;
  }

  // 4. 刘伯钦资助
  grantStarterItems() {
    if (this.storyPhase !== 'liujiacun_start') return false;
    const result = this.playerData.claimStoryReward('liuboqin_starter', {
      items:[{itemId:'eq_wp_wood',count:1},{itemId:'eq_bt_straw',count:1},{itemId:'jinchuang_yao',count:5}]
    }, this.inventory);
    if (!result.success) {
      if (result.reason === 'already_claimed') return true;
      window.showGameMessage('行囊装不下太保的短剑与草鞋，腾出空位再来领。', 'warning');
      return false;
    }
    this.playerData.equipItem('weapon', { itemId: 'eq_wp_wood', star: 0 });
    window.Sound.playSuccess();
    this.updatePlayerHud();
    window.showGameMessage('【获得刘伯钦资助】已佩戴【青铜短剑】与【行路草鞋】，获得金创药*5！', 'success', 3500);
    return true;
  }

  // 5. 触发猛兽与恶鬼战斗 (支持砍柴伐树与刘家村除害计数)
  triggerMonsterBattle(monsterChar) {
    if (this.currentBattle || this.isTransitioning || window.Dialogue?.currentDialogue || Date.now() < (this._encounterCooldownUntil || 0)) return;
    const md = monsterChar.monsterData || {};
    const mob = {
      id: monsterChar.id,
      name: monsterChar.name,
      modelId: monsterChar.appearance || md.appearance || monsterChar.id,
      templateId: monsterChar.templateId || window.ShanhaiSystem.resolveSpecies(md, this.currentMapId),
      element: monsterChar.element || md.element,
      quality: monsterChar.quality || md.quality || 'ordinary',
      gender: md.gender,
      isMutated: !!md.isMutated,
      isBoss: !!monsterChar.isBoss || !!md.isBoss,
      level: monsterChar.level || md.level || 3,
      hp: monsterChar.maxHp || md.hp || 150,
      maxHp: monsterChar.maxHp || md.maxHp || 150,
      mp: md.mp || 50,
      maxMp: md.maxMp || 50,
      atk: monsterChar.atk || md.atk || 32,
      def: monsterChar.def || md.def || 16,
      matk: 10,
      mdef: 10,
      spd: monsterChar.spd || md.spd || 20,
      skills: md.skills || monsterChar.skills || ['连击']
    };

    // 新手剧情怪物动态数值适格化 (杜绝抓痒1点伤害，使初期战斗真实可信且充满适度压迫感)
    const isQuestRat = monsterChar.id.includes('rat') || (monsterChar.monsterData && monsterChar.monsterData.appearance === 'giant_rat') || monsterChar.name.includes('硕鼠');
    if (isQuestRat && (this.storyPhase === 'liujiacun_rat_hunting' || this.storyPhase === 'liujiacun_intro' || this.storyPhase === 'liujiacun_start')) {
      mob.level = 2;
      mob.hp = 120;
      mob.maxHp = 120;
      mob.atk = 34; // 硕鼠利齿撕咬，对凡人初期28防御造成 6~12 点有效伤害
      mob.def = 10;
      mob.spd = 24;
    }
    const isQuestTree = monsterChar.id.includes('tree') || (monsterChar.monsterData && monsterChar.monsterData.appearance === 'tree') || monsterChar.name.includes('枯树精');
    if (isQuestTree && (this.storyPhase === 'liujiacun_go_cut_wood' || this.storyPhase === 'liujiacun_wood_gathering')) {
      mob.level = 2;
      mob.hp = 130;
      mob.maxHp = 130;
      mob.atk = 36; // 枯木重击，造成 8~14 点有效伤害
      mob.def = 12;
      mob.spd = 18;
    }
    const isQuestHooligan = monsterChar.name.includes('混混') || monsterChar.id.includes('hooligan') || (monsterChar.monsterData && monsterChar.monsterData.appearance === 'hooligan');
    if (isQuestHooligan && (this.storyPhase === 'chentang_defeat_hooligans' || this.storyPhase === 'chentang_boss_ready')) {
      mob.level = 4;
      mob.hp = 220;
      mob.maxHp = 220;
      mob.atk = 52; // 街头恶霸功夫重拳，对陈塘关时期玩家造成 16~22 点有效伤害
      mob.def = 18;
      mob.spd = 24;
    }

    // 野怪战斗遇怪组规模动态缩放法则 (Req 2)
    // 一般来说除特殊野怪或Boss外，遇到的野怪都是2个及以上：
    // - 前期低级区域（刘家村、五行山、陈塘关、鹰愁涧、高老庄等）：一组2个野怪
    // - 宝象国或之前白骨精（白虎岭/宝象国）：一组3个野怪
    // - 平顶山（莲花洞、猫妖/狐妖/金银角）：一组4个野怪
    const isBossOrSpecial = monsterChar.isBoss || monsterChar.isGhostTarget || (monsterChar.id && monsterChar.id.includes('boss'));
    let groupCount = 1;
    if (!isBossOrSpecial) {
      const curMap = this.currentMapId || '';
      const mName = monsterChar.name || '';
      if (curMap.includes('pingdingshan') || curMap.includes('lianhuadong') || mName.includes('猫妖') || mName.includes('平顶山')) {
        groupCount = 4;
      } else if (curMap.includes('baihu') || curMap.includes('baoxiang') || mName.includes('白骨') || mName.includes('白虎') || mName.includes('宝象')) {
        groupCount = 3;
      } else {
        groupCount = 2;
      }
    }

    const enemies = [mob];
    const isStoryGroup = isQuestTree && ['liujiacun_go_cut_wood', 'liujiacun_wood_gathering'].includes(this.storyPhase) ||
      this.storyPhase === 'liujiacun_rat_hunting' || isQuestHooligan && this.storyPhase === 'chentang_defeat_hooligans' ||
      this.storyPhase?.startsWith('heaven_');
    for (let i = 1; i < groupCount; i++) {
      const subMob = {
        ...mob,
        id: `${mob.id}_sub_${i}`,
        name: mob.name,
        enemyIndex: i,
        hp: Math.min(mob.maxHp, Math.max(1, Math.floor(mob.hp * (0.95 + Math.random() * 0.10)))),
        maxHp: mob.maxHp,
        atk: Math.max(10, Math.floor(mob.atk * (0.95 + Math.random() * 0.10))),
        def: mob.def,
        spd: Math.max(5, mob.spd + (i % 2 === 0 ? 1 : -1))
      };
      // 后续同行怪偶遇异种；剧情砍柴、除鼠等组保持同种，计数与难度稳定。
      if (i === 1 && !isStoryGroup && !isBossOrSpecial && mob.level >= 8) {
        const roll = Math.random();
        const quality = roll < 0.03 && mob.level >= 25 ? 'jinxian' : roll < 0.13 ? 'sanxian' : roll < 0.38 ? 'ordinary' : null;
        const pool = Object.values(window.GAME_DATA.PETS).filter(p => p.quality === quality && p.reqLevel <= mob.level &&
          window.ShanhaiSystem.isCollectible(p) && (!p.habitatMapId || p.habitatMapId === this.currentMapId));
        if (pool.length) {
          const template = pool[Math.floor(Math.random() * pool.length)];
          const wild = window.PetSystem.createPet(template.id, false, mob.level, false);
          Object.assign(subMob, {
            templateId: template.id, name: template.name, quality: template.quality,
            element: template.element, gender: wild.gender, modelId: template.appearance || window.Character.inferMonsterType(template.name, template.id),
            hp: wild.hp, maxHp: wild.maxHp, mp: wild.mp, maxMp: wild.maxMp, atk: wild.atk, def: wild.def,
            matk: wild.matk, mdef: wild.mdef, spd: wild.spd, skills: ['普通攻击']
          });
        }
      }
      enemies.push(subMob);
    }

    this.start2DBattle(enemies, () => {
      this.monsters = this.monsters.filter(m => m.id !== monsterChar.id);
      if (monsterChar.isGhostTarget) {
        this.ghostQuest.completed = true;
        window.Sound.playCrit();
        window.showGameMessage(`🎉【伏魔告捷】成功诛灭作祟恶鬼【${this.ghostQuest.targetName}】！速回长安城向钟馗天师复命领赏！`, 'success', 5000);
      }

      const defeatedCount = enemies.filter(e => !e.isCaptured).length;
      const defeated = enemies.filter(e => !e.isCaptured);
      this.playerData.gainExp(defeated.reduce((sum, e) => sum + 50 + (e.level || 1) * 25, 0));
      this.playerData.silver += defeated.reduce((sum, e) => sum + 10 + (e.level || 1) * 5, 0);

      // 五行山砍柴伐树任务推进
      if (monsterChar.id.includes('tree') || (monsterChar.monsterData && monsterChar.monsterData.appearance === 'tree') || monsterChar.name.includes('枯树精')) {
        if (this.storyPhase === 'liujiacun_go_cut_wood' || this.storyPhase === 'liujiacun_wood_gathering') {
          if (!this.questKills) this.questKills = { mushrooms: 0, trees: 0, rats: 0 };
          // 满包时必须先拦下：否则计数推进到 4/4 却没有对应柴木，交差时会缺件
          const canStore = this.inventory?.canAddItems([{ itemId: 'item_dry_wood', count: defeatedCount }]);
          if (!canStore) {
            window.showGameMessage('🪵 柴木无处安放！请先整理行囊，再回来收这批坚韧柴木。', 'warning', 5000);
          } else {
            this.storyPhase = 'liujiacun_wood_gathering';
            this.inventory.addItem('item_dry_wood', defeatedCount);
            this.questKills.trees = Math.min(4, (this.questKills.trees || 0) + defeatedCount);
            if (this.questKills.trees >= 4) {
              this.storyPhase = 'liujiacun_wood_collected';
              if (window.Sound) window.Sound.playCrit();
              window.showGameMessage('🎉 4捆坚韧柴木已收集齐全！请回刘家村向刘伯钦交差！', 'success', 4500);
            } else {
              window.showGameMessage(`🪵 砍倒一组枯树精(${defeatedCount}只)！收集坚韧柴木 (${this.questKills.trees}/4)`, 'info', 3000);
            }
          }
          this.refreshMapNpcs();
        }
      }

      // 刘家村消灭硕鼠任务推进
      if (monsterChar.id.includes('rat') || (monsterChar.monsterData && monsterChar.monsterData.appearance === 'giant_rat') || monsterChar.name.includes('硕鼠')) {
        if (this.storyPhase === 'liujiacun_rat_hunting') {
          if (!this.questKills) this.questKills = { mushrooms: 0, trees: 0, rats: 0 };
          this.questKills.rats = Math.min(4, (this.questKills.rats || 0) + defeatedCount);
          if (this.questKills.rats >= 4) {
            this.storyPhase = 'liujiacun_rats_cleared';
            if (window.Sound) window.Sound.playCrit();
            window.showGameMessage('🎉 4只偷粮硕鼠已全部消灭！村中粮仓平安，快向刘伯钦交差！', 'success', 4500);
          } else {
            window.showGameMessage(`🐀 击败一组偷粮硕鼠(${defeatedCount}只) (${this.questKills.rats}/4)`, 'info', 3000);
          }
          this.refreshMapNpcs();
        }
      }

      // 陈塘关清剿 4 名作恶混混主线推进
      if (monsterChar.name.includes('混混') || monsterChar.id.includes('hooligan') || (monsterChar.monsterData && monsterChar.monsterData.appearance === 'hooligan')) {
        if (this.storyPhase === 'chentang_defeat_hooligans') {
          if (!this.questKills) this.questKills = { mushrooms: 0, trees: 0, rats: 0, chentangHooligans: 0 };
          this.questKills.chentangHooligans = Math.min(4, (this.questKills.chentangHooligans || 0) + defeatedCount);
          if (this.questKills.chentangHooligans >= 4) {
            this.storyPhase = 'chentang_hooligans_done';
            if (window.Sound) window.Sound.playCrit();
            window.showGameMessage('🎉 4名作恶混混已全部制伏！陈塘关街市初定，快回总兵府向李靖复命！', 'success', 4500);
          } else {
            window.showGameMessage(`🥋 制伏一组街头作恶混混(${defeatedCount}人) (${this.questKills.chentangHooligans}/4)`, 'info', 3000);
          }
          this.refreshMapNpcs();
        }
      }
    });
  }

  // 5.5 陈塘关混混头目 1 打 3 决战 (头目 + 两名小兵随从)
  triggerHooliganBossBattle() {
    if (window.Dialogue) {
      window.Dialogue.close();
    }
    const boss = {
      id: 'hooligan_boss',
      templateId: 'hooligan',
      appearance: 'hooligan_boss',
      modelId: 'hooligan_boss',
      name: '混混头目·雷震彪',
      isMutated: false,
      isBoss: true,
      level: 6,
      hp: 550,
      maxHp: 550,
      mp: 150,
      maxMp: 150,
      atk: 62,
      def: 22,
      matk: 15,
      mdef: 15,
      spd: 24,
      skills: ['破甲拳', '连击']
    };
    const minion1 = {
      id: 'hooligan_minion_1',
      templateId: 'hooligan',
      appearance: 'hooligan',
      modelId: 'hooligan',
      name: '地痞随从·恶犬',
      isMutated: false,
      isBoss: false,
      level: 4,
      hp: 180,
      maxHp: 180,
      mp: 50,
      maxMp: 50,
      atk: 48,
      def: 16,
      matk: 10,
      mdef: 10,
      spd: 20,
      skills: ['普通攻击']
    };
    const minion2 = {
      id: 'hooligan_minion_2',
      templateId: 'hooligan',
      appearance: 'hooligan',
      modelId: 'hooligan',
      name: '地痞随从·飞蝗',
      isMutated: false,
      isBoss: false,
      level: 4,
      hp: 180,
      maxHp: 180,
      mp: 50,
      maxMp: 50,
      atk: 48,
      def: 16,
      matk: 10,
      mdef: 10,
      spd: 20,
      skills: ['普通攻击']
    };

    this.start2DBattle([boss, minion1, minion2], () => {
      this.storyPhase = 'chentang_boss_defeated';
      if (window.Sound) window.Sound.playCrit();
      window.showGameMessage('🎉 混混头目携随从惨败求饶，落荒而逃！速回陈塘总兵帅府向李靖复命领赏！', 'success', 5000);
      this.refreshMapNpcs();
    });
  }

  // 6. 东海之滨：大战巡海夜叉李艮
  triggerYechaBattle() {
    if (window.Dialogue) {
      window.Dialogue.close();
    }
    const yechaBoss = {
      id: 'yecha_boss',
      templateId: 'yecha',
      appearance: 'yecha',
      modelId: 'yecha',
      name: '巡海夜叉·李艮',
      isMutated: false,
      isBoss: true,
      level: 8,
      hp: 650,
      maxHp: 650,
      mp: 250,
      maxMp: 250,
      atk: 52,
      def: 24,
      matk: 25,
      mdef: 25,
      spd: 26,
      skills: ['巨浪劈', '托天叉']
    };
    this.start2DBattle([yechaBoss], () => {
      this.storyPhase = 'donghai_dragon_arrived';
      this.scheduleStoryDialogue('donghai_dragon_apology', 500);
    });
  }

  // 7. 东海龙王宝库：赠送整套初级龙神战装 (武器、铠甲、头盔、靴子、项链)
  grantLonggongArmorSet() {
    if (this.storyPhase !== 'longgong_visit') return false;
    if (window.Dialogue) {
      window.Dialogue.close();
    }
    const setPieces = [
      'longgong_weapon',
      'longgong_armor',
      'longgong_helmet',
      'longgong_boots',
      'longgong_necklace'
    ];
    const result = this.playerData.claimStoryReward('longgong_armor', {
      items:setPieces.map(itemId=>({itemId,count:1})), exp:800, healToFull:true
    }, this.inventory);
    if (!result.success && result.reason !== 'already_claimed') {
      window.showGameMessage('龙王的五件战装暂放宝库，整理出五个格子后再向敖广领取。', 'warning', 5000);
      return false;
    }
    if (result.success) {
      for (const itemId of setPieces) {
        const slot = this.inventory.slots.find(s=>s.itemId===itemId);
        if (slot && this.playerData.level >= window.GAME_DATA.ITEMS[itemId].reqLevel) {
          this.inventory.equip(slot.instanceId,this.playerData);
        }
      }
    }
    this.playerData.recalculateStats(true);
    this.playerData.hp = this.playerData.maxHp;
    this.playerData.mp = this.playerData.maxMp;
    if (window.Sound) window.Sound.playCrit();
    this.updatePlayerHud();
    window.showGameMessage('💎【龙神神装全套】已领取【覆海点钢枪、龙鳞轻钢甲、碧水定海盔、踏浪穿云靴、龙珠凝霜佩】！符合等级的装备已自动穿戴。', 'success', 5000);

    this.storyPhase = 'chentang_guanyin_revelation';
    this.loadMap('chentangguan', { x: 576, y: 384 }, {
      onComplete: () => {
        if (this.currentMapId === 'chentangguan' && this.storyPhase === 'chentang_guanyin_revelation') {
          this.scheduleStoryDialogue('chentang_guanyin_revelation', 0);
        }
      }
    });
    window.showGameMessage('☁️ 返回陈塘关！天际祥云缭绕，仙乐阵阵！', 'info', 3500);
    return true;
  }

  // 8. 观音赐宝 (五行山前)
  // 正常主线在观音点化对白结束后已推进到 changan_meet_xuanzang，
  // 旧守卫只认 chentang_guanyin_revelation 会让赐宝永远领不到。
  // 允许阶段：点化当场，或已进入长安见玄奘之前（尚未破封五行山）。
  grantGuanyinGift() {
    const GIFT_PHASES = [
      'chentang_guanyin_revelation',
      'changan_meet_xuanzang',
      'changan_meet_taizong',
      'changan_farewell'
    ];
    const alreadyClaimed = this.playerData?.storyRewards?.guanyin_gift === true;
    if (!alreadyClaimed && !GIFT_PHASES.includes(this.storyPhase)) return false;
    const result = this.playerData.claimStoryReward('guanyin_gift', {
      items:[{itemId:'eq_nk_dinghun',count:1},{itemId:'feixing_fu',count:5},{itemId:'jiuzhuan_dan',count:3}]
    }, this.inventory);
    if (!result.success) {
      if (result.reason === 'already_claimed') return false;
      window.showGameMessage('菩萨的法宝先由她保管，整理行囊后再来领取。', 'warning');
      return false;
    }
    // 只有仍停留在点化阶段时才推进主线，避免从长安回访时把进度倒推或跳段
    if (this.storyPhase === 'chentang_guanyin_revelation') {
      this.storyPhase = 'wuxingshan_ready';
    }
    window.Sound.playSuccess();
    this.updatePlayerHud();
    window.showGameMessage('【菩萨赐宝】获得【九转定魂珠】、飞行神符*5、九转还魂丹*3！前往五行山解救大圣！', 'success', 4000);
    this.saveAutoProgress();
    return true;
  }

  // 9. 唐太宗御赐文牒与神丹 (长安金銮殿)
  grantTaizongGift() {
    if (this.storyPhase !== 'changan_meet_taizong') return false;
    const result = this.playerData.claimStoryReward('taizong_gift', {
      items: [
        { itemId: 'feixing_fu', count: 5 },
        { itemId: 'jiuzhuan_dan', count: 3 }
      ],
      exp: 1000,
      silver: 500
    }, this.inventory);
    if (!result.success && result.reason !== 'already_claimed') {
      window.showGameMessage('太宗御赐重宝暂由内侍监保管，整理出行囊空位后再向陛下领旨谢恩。', 'warning', 5000);
      return false;
    }
    this.storyPhase = 'changan_farewell';
    window.Sound.playSuccess();
    this.updatePlayerHud();
    window.showGameMessage('📜 获得太宗御赐通关文牒、飞行符*5、九转金丹*3、经验+1000、银两+500！', 'success', 5000);
    this.refreshMapNpcs();
    this.saveAutoProgress();
    return true;
  }

  // 6. 五行山金符揭下 (防重入、即时瓦片置换、彻底杜绝死循环)
  releaseWukong() {
    this.isSealTriggered = true;
    this.isSealTriggering = false;
    window.Sound.playCrit();
    const mapData = window.GAME_DATA.MAPS_2D['wuxingshan'];
    if (mapData && mapData.tiles && mapData.tiles[3]) {
      mapData.tiles[3][12] = 'mountain_rock';
    }

    const vp = document.getElementById('game-viewport');
    if (vp && !this.isReducedMotionEnabled()) {
      vp.classList.add('hit-shake');
      setTimeout(() => vp.classList.remove('hit-shake'), 800);
    }

    // 对白键必须与 STORY_DIALOGUES 中的实际键名一致（wukong_freed），
    // 否则会静默开不出对白、大圣永不入队、后续鹰愁涧门禁全部无法通过。
    this.scheduleStoryDialogue('wukong_freed', 600);
  }

  // 7. 齐天大圣入队
  joinWukongToParty() {
    this.storyPhase = 'wuxing_freed';
    this.isSealTriggered = true;
    this.isSealTriggering = false;
    this.npcs = this.npcs.filter(n => n.id !== 'npc_wukong_sealed');

    const wukongPet = window.PetSystem.createPet('super_wukong', false, 35);
    wukongPet.name = '齐天大圣孙悟空';
    this.companions.push(wukongPet);

    window.Sound.playLevelUp();
    this.updatePlayerHud();
    window.showGameMessage('🎉【齐天大圣孙悟空】手持如意金箍棒，正式加入护法神队！扫平一切妖邪！', 'success', 4500);
  }

  // === 第四章：鹰愁涧小白龙战 ===
  triggerYingchouBattle() {
    if (window.Dialogue) window.Dialogue.close();
    const boss = {
      id: 'boss_xiaobailong',
      name: '小白龙敖烈',
      level: 18,
      hp: 3200,
      maxHp: 3200,
      mp: 800,
      maxMp: 800,
      atk: 120,
      def: 65,
      matk: 110,
      mdef: 60,
      spd: 36,
      skills: ['水攻', '飞沙走石']
    };
    this.start2DBattle([boss], () => {
      this.scheduleStoryDialogue('bailong_post_battle');
    });
  }

  joinBailongma() {
    if (this.storyPhase === 'wuxing_freed') this.storyPhase = 'yingchou_cleared';
    this.mountSystem.addMount('bailongma', '西海玉龙·白龙马');
    this.mountSystem.isRiding = true;
    this.playerChar.isRiding = true;
    this.playerData.recalculateStats(true);
    window.Sound.playLevelUp();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.showGameMessage('🎉【小白龙敖烈】化为龙马神驹加入！气血大幅增加，坐骑奔驰如电！', 'success', 4500);
  }

  // === 经典野外演武战斗 (复刻图3：野狼 vs 铁扇公主与无敌黄飞鸿) ===
  triggerWolfBattle() {
    if (window.Dialogue) window.Dialogue.close();
    if (this.playerData) {
      this.playerData.name = '无敌黄飞鸿';
      this.playerData.level = Math.max(25, this.playerData.level);
    }
    // 添加铁扇公主为协同仙宠/同伴 (复刻图3仙宠1位)
    this.companions = [{
      id: 'companion_tieshan',
      name: '铁扇公主',
      modelId: 'tieshan',
      roleId: 'tieshan',
      level: 20,
      hp: 3600,
      maxHp: 3600,
      mp: 1200,
      maxMp: 1200,
      atk: 145,
      def: 80,
      skills: [{ id: 'bajiao_feng', name: '芭蕉狂风', costMp: 45 }]
    }];

    const wolf = {
      id: 'monster_wolf',
      modelId: 'wild_wolf',
      name: '野狼',
      level: 15,
      hp: 2200,
      maxHp: 2200,
      mp: 500,
      maxMp: 500,
      atk: 135,
      def: 65,
      matk: 40,
      mdef: 45,
      spd: 22,
      skills: ['撕咬', '扑击', '野性呼唤']
    };
    this.start2DBattle([wolf], () => {
      window.showGameMessage('🎉【斩妖降魔】降伏凶顽恶狼，获得大量修行道行与仙玉！', 'success', 3500);
    });
  }

  // === 第五章：高老庄天蓬元帅猪八戒战 ===
  triggerBajieBattle() {
    if (window.Dialogue) window.Dialogue.close();
    const boss = {
      id: 'boss_bajie',
      name: '猪刚鬣 (天蓬元帅)',
      level: 25,
      hp: 5800,
      maxHp: 5800,
      mp: 1200,
      maxMp: 1200,
      atk: 165,
      def: 90,
      matk: 80,
      mdef: 75,
      spd: 28,
      skills: ['泰山压顶', '金刚护体', '高级吸血']
    };
    this.start2DBattle([boss], () => {
      this.scheduleStoryDialogue('bajie_post_battle');
    });
  }

  joinBajieToParty() {
    if (this.storyPhase === 'yingchou_cleared') this.storyPhase = 'gaolao_cleared';
    if (this.companions.some(p => p.id === 'companion_bajie')) return;
    const bajiePet = {
      id: 'companion_bajie',
      name: '天蓬元帅猪八戒',
      portraitId: 'zhu_bajie',
      level: 25,
      hp: 3500,
      maxHp: 3500,
      mp: 800,
      maxMp: 800,
      atk: 170,
      def: 95,
      matk: 70,
      mdef: 70,
      spd: 28,
      skills: ['泰山压顶', '高级吸血', '高级必杀']
    };
    this.companions.push(bajiePet);
    window.Sound.playLevelUp();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.showGameMessage('🎉【天蓬元帅猪八戒】扛起九齿钉耙，正式加入护法神队！', 'success', 4500);
  }

  // === 第六章：黄风岭虎先锋与黄风怪 ===
  triggerHuxianfengBattle() {
    if (window.Dialogue) window.Dialogue.close();
    const boss = {
      id: 'boss_hu_xianfeng',
      name: '巡山虎先锋',
      level: 28,
      hp: 4600,
      maxHp: 4600,
      mp: 800,
      maxMp: 800,
      atk: 180,
      def: 85,
      matk: 60,
      mdef: 60,
      spd: 38,
      skills: ['高级连击', '高级必杀']
    };
    this.start2DBattle([boss], () => {
      this.npcs = this.npcs.filter(n => n.id !== 'npc_hu_xianfeng');
      window.showGameMessage('【降妖伏魔】前部先锋虎先锋已被扫灭！速进洞降伏黄风怪！', 'success', 4000);
    });
  }

  triggerHuangfengBattle() {
    if (window.Dialogue) window.Dialogue.close();
    const boss = {
      id: 'boss_huangfeng',
      name: '黄风怪 (黄风大圣)',
      appearance: 'huangfeng_guai',
      level: 34,
      hp: 9200,
      maxHp: 9200,
      mp: 2500,
      maxMp: 2500,
      atk: 210,
      def: 110,
      matk: 230,
      mdef: 120,
      spd: 42,
      skills: ['飞沙走石', '三昧真火', '封印咒']
    };
    this.start2DBattle([boss], () => {
      this.npcs = this.npcs.filter(n => n.id !== 'npc_huangfeng_boss');
      this.storyPhase = 'huangfeng_cleared';
      this.saveAutoProgress();
      window.showGameMessage('🎉【灵宝止风】灵吉护住退路，合力破除妖风！黄风大圣现回黄毛貂鼠原形伏罪！', 'success', 4500);
    });
  }

  // === 第七章：流沙河沙悟净战 ===
  triggerShasengBattle() {
    if (this.storyPhase !== 'huangfeng_cleared' || this.playerData.storyEvents?.shaseng_battle_won) return;
    if (window.Dialogue) window.Dialogue.close();
    const boss = {
      id: 'boss_shaseng',
      name: '沙悟净 (卷帘大将)',
      level: 38,
      hp: 11000,
      maxHp: 11000,
      mp: 2200,
      maxMp: 2200,
      atk: 225,
      def: 140,
      matk: 130,
      mdef: 135,
      spd: 35,
      skills: ['金刚护体', '水攻', '大闹天宫']
    };
    this.start2DBattle([boss], () => {
      this.playerData.storyEvents.shaseng_battle_won = true;
      this.saveAutoProgress();
      this.scheduleStoryDialogue('shaseng_post_battle');
    });
  }

  joinShasengToParty() {
    if (this.storyPhase !== 'huangfeng_cleared' || !this.playerData.storyEvents?.shaseng_battle_won) return false;
    const result = this.playerData.claimStoryReward('shaseng_join', {
      items: [{itemId:'qingquan_jiu',count:30}, {itemId:'liusha_speed_boots',count:1},
        {itemId:'wukong_eyelash',count:1}, {itemId:'xuelian_dan',count:5}, {itemId:'jiuzhuan_dan',count:3}],
      silver:5000, exp:45000
    }, this.inventory);
    if (!result.success && result.reason !== 'already_claimed') {
      window.showGameMessage('沙师弟已归队，战利品先由他保管。整理行囊后再找他领取，无须重新交手。', 'warning', 5000);
      return false;
    }
    const shasengPet = {
      id: 'companion_shaseng',
      name: '卷帘大将沙和尚',
      portraitId: 'sha_wujing',
      level: 38,
      hp: 4200,
      maxHp: 4200,
      mp: 1200,
      maxMp: 1200,
      atk: 210,
      def: 150,
      matk: 120,
      mdef: 140,
      spd: 35,
      skills: ['金刚护体', '水攻', '高级神佑复生']
    };
    if (!this.companions.some(p => p.id === 'companion_shaseng')) this.companions.push(shasengPet);

    this.storyPhase = 'liusha_cleared';

    window.Sound.playLevelUp();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.showGameMessage('🎉【卷帘大将沙和尚】入队！查缴战利：清泉酒×30、流沙逐风靴×1、大圣防风睫毛、金丹与银两！', 'success', 5000);
    return true;
  }

  // === 第八章：浮屠山乌巢禅师传心经 ===
  learnHeartSutra() {
    const player = this.playerData;
    const result = player.claimStoryReward('heart_sutra', {
      bonuses: { hp: 1500, mp: 800, def: 30, mdef: 30 }, healToFull: true
    });
    if (!result.success) {
      window.showGameMessage('心经已经领悟，重读可静心，修为不会重复增加。', 'info');
      return;
    }
    window.Sound.playSuccess();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.showGameMessage('📿 顿悟《般若波罗蜜多心经》！心无挂碍，最大气血+1500，最大精力+800，双抗大幅提升！', 'success', 4500);
  }

  // === 第九章：万寿山五庄观地仙之祖镇元子战 ===
  triggerZhenyuanziBattle() {
    if (this.storyPhase !== 'liusha_cleared' || this.playerData.storyEvents?.wuzhuang_trial_won) return;
    if (window.Dialogue) window.Dialogue.close();
    const boss = {
      id: 'boss_zhenyuanzi',
      name: '镇元大仙 (地仙之祖)',
      modelId: 'zhenyuanzi',
      level: 55,
      hp: 28000,
      maxHp: 28000,
      mp: 9999,
      maxMp: 9999,
      atk: 360,
      def: 220,
      matk: 380,
      mdef: 240,
      spd: 50,
      skills: ['金刚护体', '封印咒', '雷霆万钧', '大闹天宫']
    };
    this.start2DBattle([boss], () => {
      this.playerData.storyEvents.wuzhuang_trial_won = true;
      this.scheduleStoryDialogue('zhenyuanzi_post_battle');
    });
  }

  restoreWuzhuangTree() {
    if (this.storyPhase !== 'liusha_cleared' || !this.playerData.storyEvents?.wuzhuang_trial_won) return false;
    if (!this.playerData.storyEvents.wuzhuang_tree_restored) {
      this.playerData.storyEvents.wuzhuang_tree_restored = true;
      this.saveAutoProgress();
    }
    return true;
  }

  grantZhenyuanziGift() {
    if (this.storyPhase !== 'liusha_cleared' || !this.playerData.storyEvents?.wuzhuang_tree_restored) return;
    const result = this.playerData.claimStoryReward('wuzhuang_gift', {
      items: [{ itemId: 'renshen_guo', count: 2 }, { itemId: 'eq_am_hunyuan', count: 1 }],
      exp: 60000, silver: 50000
    }, this.inventory);
    if (!result.success) {
      if (result.reason !== 'already_claimed') {
        window.showGameMessage('宝树已救活，赠礼由镇元大仙替你保管。整理行囊后再来领取，不必重新交手。', 'warning', 5000);
      }
      return;
    }
    this.storyPhase = 'wuzhuang_cleared';
    this.npcs = this.npcs.filter(n => n.id !== 'npc_zhenyuanzi');
    window.Sound.playLevelUp();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.showGameMessage('🎉 获赠万寿山【草还丹·人参果】×2 与【混元一气锦襕道袍】！修为经验暴增60000，境界大幅突破！', 'success', 4500);
  }

  advanceBaoxiangStory(nextPhase, targetNpcId) {
    if (!['baoxiang_seek_princess', 'baoxiang_boss_ready'].includes(nextPhase)) return;
    const allowed = nextPhase === 'baoxiang_seek_princess' ? this.storyPhase === 'baihu_cleared' :
      this.storyPhase === 'baoxiang_seek_princess';
    if (!allowed) return;
    this.storyPhase = nextPhase;
    if (typeof this.refreshMapNpcs === 'function') this.refreshMapNpcs();
    const target = this.npcs.find(n => n.id === targetNpcId);
    if (target) target.questStatus = 'available';
    this.interactedNpcSet.delete(targetNpcId);
    this.saveAutoProgress();
  }

  // === 第十章：白虎岭白骨夫人战 ===
  triggerBaigujingBattle() {
    if (!['wuzhuang_cleared', 'baihu_first_cleared', 'baihu_second_cleared'].includes(this.storyPhase)) return;
    if (this.playerData.storyEvents?.baigu_final_won && this.storyPhase === 'baihu_second_cleared') return;
    if (window.Dialogue) window.Dialogue.close();
    const stage = this.storyPhase === 'baihu_first_cleared' ? 2 :
      this.storyPhase === 'baihu_second_cleared' ? 3 : 1;
    const boss = {
      id: 'boss_baigujing',
      name: stage === 1 ? '白骨精·村姑幻身' : stage === 2 ? '白骨精·老妪幻身' : '白骨夫人·幽冥真身',
      appearance: 'baigu_jing',
      modelId: 'baigu_jing',
      level: 42,
      hp: stage === 1 ? 6800 : stage === 2 ? 9600 : 15000,
      maxHp: stage === 1 ? 6800 : stage === 2 ? 9600 : 15000,
      mp: 3500,
      maxMp: 3500,
      atk: 250,
      def: 130,
      matk: 260,
      mdef: 140,
      spd: 45,
      skills: stage === 1 ? ['隐身咒', '连击'] :
        stage === 2 ? ['隐身咒', '三昧真火', '连击'] : ['隐身咒', '三昧真火', '连击', '白骨噬魂']
    };
    this.start2DBattle([boss], () => {
      if (stage < 3) {
        this.storyPhase = stage === 1 ? 'baihu_first_cleared' : 'baihu_second_cleared';
        const guide = this.npcs.find(n => n.id === 'npc_baigujing');
        if (guide) {
          guide.appearance = stage === 1 ? 'baigu_granny' : 'baigu_oldman';
          guide.name = stage === 1 ? '寻女的老妪' : '拄杖的老翁';
          guide.questStatus = 'available';
        }
        this.interactedNpcSet.delete('npc_baigujing');
        this.saveAutoProgress();
        this.scheduleStoryDialogue(stage === 1 ? 'baigujing_first_aftermath' : 'baigujing_second_aftermath');
        return;
      }
      this.playerData.storyEvents.baigu_final_won = true;
      this.saveAutoProgress();
      this.claimBaiguFinalReward();
    });
  }

  claimBaiguFinalReward() {
    if (this.storyPhase !== 'baihu_second_cleared' || !this.playerData.storyEvents?.baigu_final_won) return false;
    const result = this.playerData.claimStoryReward('baigu_final', {
      items: [{itemId:'eq_ring_baigu',count:1}, {itemId:'jin_liu_lu',count:2}],
      exp:45000, silver:8000
    }, this.inventory);
    if (!result.success && result.reason !== 'already_claimed') {
      if (typeof this.refreshMapNpcs === 'function') this.refreshMapNpcs();
      window.showGameMessage('白骨夫人已伏诛。悟空替你看着战利品，整理行囊后找他领取，不必重打。', 'warning', 5000);
      return false;
    }
    this.storyPhase = 'baihu_cleared';
    if (typeof this.refreshMapNpcs === 'function') this.refreshMapNpcs();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.Sound.playLevelUp();
    this.scheduleStoryDialogue('baigujing_final_aftermath');
    window.showGameMessage('🎉【三打白骨精】幽冥真身已破！获赠【千年白骨幽魂戒】与【金柳露】×2！', 'success', 5000);
    return true;
  }

  // === 第十一章：宝象国波月洞奎木狼黄袍怪战 ===
  triggerHuangpaoBattle() {
    if (this.storyPhase !== 'baoxiang_boss_ready' || this.playerData.storyEvents?.huangpao_battle_won) return;
    if (window.Dialogue) window.Dialogue.close();
    const boss = {
      id: 'boss_huangpao',
      name: '黄袍怪 (奎木狼)',
      appearance: 'huangpao_guai',
      modelId: 'huangpao_guai',
      level: 48,
      hp: 19500,
      maxHp: 19500,
      mp: 4000,
      maxMp: 4000,
      atk: 310,
      def: 165,
      matk: 240,
      mdef: 150,
      spd: 44,
      skills: ['雷霆万钧', '舍生取义', '飞沙走石']
    };
    this.start2DBattle([boss], () => {
      this.playerData.storyEvents.huangpao_battle_won = true;
      this.saveAutoProgress();
      this.claimHuangpaoReward();
    });
  }

  claimHuangpaoReward() {
    if (this.storyPhase !== 'baoxiang_boss_ready' || !this.playerData.storyEvents?.huangpao_battle_won) return false;
    const result = this.playerData.claimStoryReward('huangpao_final', {
      items: [{itemId:'eq_wp_lengyue',count:1}, {itemId:'book_high_critical',count:1}],
      exp:55000, silver:12000
    }, this.inventory);
    if (!result.success && result.reason !== 'already_claimed') {
      if (typeof this.refreshMapNpcs === 'function') this.refreshMapNpcs();
      window.showGameMessage('奎木狼已归案。宝象国国王替你保管赏赐，整理行囊后入宫领取。', 'warning', 5000);
      return false;
    }
    this.storyPhase = 'baoxiang_cleared';
    if (typeof this.refreshMapNpcs === 'function') this.refreshMapNpcs();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.Sound.playLevelUp();
    this.scheduleStoryDialogue('huangpao_aftermath');
    window.showGameMessage('🎉【大破波月洞】降伏奎木狼还朝！救出百花羞公主，获赠神兵【冷月追魂宝刀】与【高级必杀兽诀】！', 'success', 5000);
    return true;
  }

  // === 第十二回：平顶山·莲花洞主线战斗与太上道祖点化 ===
  triggerXiaozuanfengBattle() {
    // 阶段守卫：仅允许在前驱阶段开战，避免重复触发刷经验银两
    if (this.storyPhase !== 'baoxiang_cleared' || this.playerData.storyRewards?.pingding_scout) return;
    if (window.Dialogue) window.Dialogue.close();
    const enemies = [
      {
        id: 'boss_xiaozuanfeng',
        name: '巡山小钻风',
        appearance: 'changan_hawker',
        modelId: 'changan_hawker',
        level: 46,
        hp: 12000,
        maxHp: 12000,
        mp: 2500,
        maxMp: 2500,
        atk: 270,
        def: 145,
        matk: 220,
        mdef: 135,
        spd: 46,
        skills: ['隐身咒', '连击', '飞沙走石']
      },
      {
        id: 'mob_xuanfeng_1',
        name: '巡山精怪·铜锣手',
        appearance: 'hooligan',
        modelId: 'hooligan',
        level: 44,
        hp: 6500,
        maxHp: 6500,
        mp: 1200,
        maxMp: 1200,
        atk: 230,
        def: 125,
        spd: 40,
        skills: ['连击']
      },
      {
        id: 'mob_xuanfeng_2',
        name: '巡山精怪·令旗兵',
        appearance: 'hooligan',
        modelId: 'hooligan',
        level: 44,
        hp: 6500,
        maxHp: 6500,
        mp: 1200,
        maxMp: 1200,
        atk: 230,
        def: 125,
        spd: 41,
        skills: ['连击']
      }
    ];

    this.start2DBattle(enemies, () => {
      this.storyPhase = 'pingding_scout_cleared';
      this.npcs = this.npcs.filter(n => n.id !== 'npc_xiaozuanfeng');
      // 奖励走统一领取入口，保证重复回调/读档重进都不会二次发放
      const reward = this.playerData.claimStoryReward('pingding_scout',
        { exp: 35000, silver: 8000 }, this.inventory);
      if (!reward.success && reward.reason !== 'already_claimed') {
        window.showGameMessage('🎺 小钻风的战利品暂由山神代收，稍后可再来领取。', 'warning', 5000);
      }
      this.updatePlayerHud();
      this.saveAutoProgress();
      window.Sound.playLevelUp();
      setTimeout(() => {
        window.showGameMessage('🎺 小钻风丢下铜锣狼狈逃窜！山门盘道已开，二大王【银角大王】正在前方石坛移山压顶！', 'success', 5000);
      }, 500);
    });
  }

  triggerYinjiaoBattle() {
    // 阶段守卫：必须在击退小钻风之后、且尚未领取银角战利品
    if (this.storyPhase !== 'pingding_scout_cleared' || this.playerData.storyRewards?.pingding_silver) return;
    if (window.Dialogue) window.Dialogue.close();
    const boss = {
      id: 'boss_yinjiao',
      name: '银角大王',
      appearance: 'yinjiao',
      modelId: 'yinjiao',
      level: 50,
      hp: 24000,
      maxHp: 24000,
      mp: 6000,
      maxMp: 6000,
      atk: 340,
      def: 180,
      matk: 320,
      mdef: 175,
      spd: 45,
      skills: ['移山压顶', '封印咒', '飞沙走石', '三昧真火', '雷霆万钧']
    };

    this.start2DBattle([boss], () => {
      this.storyPhase = 'pingding_silver_cleared';
      this.npcs = this.npcs.filter(n => n.id !== 'npc_yinjiao_boss');
      const reward = this.playerData.claimStoryReward('pingding_silver',
        { exp: 55000, silver: 12000 }, this.inventory);
      if (!reward.success && reward.reason !== 'already_claimed') {
        window.showGameMessage('🥈 银角的战利品暂由山神代收，稍后可再来领取。', 'warning', 5000);
      }
      this.updatePlayerHud();
      this.saveAutoProgress();
      window.Sound.playLevelUp();
      setTimeout(() => {
        window.showGameMessage('🥈 大破移山压顶大阵！银角大王负伤逃回洞中，大大王【金角大王】暴怒持七星剑杀出！', 'success', 5000);
      }, 500);
    });
  }

  triggerJinjiaoBattle() {
    // 阶段守卫：必须在银角退场之后、且尚未领取金角战利品
    if (this.storyPhase !== 'pingding_silver_cleared' || this.playerData.storyRewards?.pingding_gold) return;
    if (window.Dialogue) window.Dialogue.close();
    const bosses = [
      {
        id: 'boss_jinjiao',
        name: '金角大王',
        appearance: 'jinjiao',
        modelId: 'jinjiao',
        level: 52,
        hp: 30000,
        maxHp: 30000,
        mp: 8000,
        maxMp: 8000,
        atk: 380,
        def: 210,
        matk: 350,
        mdef: 200,
        spd: 47,
        skills: ['雷霆万钧', '舍生取义', '三昧真火', '飞沙走石']
      },
      {
        id: 'mob_yinjiao_shadow',
        name: '银角幻身护卫',
        appearance: 'yinjiao',
        modelId: 'yinjiao',
        level: 48,
        hp: 10000,
        maxHp: 10000,
        mp: 3000,
        maxMp: 3000,
        atk: 260,
        def: 155,
        spd: 43,
        skills: ['封印咒', '定身咒']
      }
    ];

    this.start2DBattle(bosses, () => {
      this.storyPhase = 'pingding_gold_cleared';
      this.npcs = this.npcs.filter(n => n.id !== 'npc_jinjiao_boss');
      const goldReward = this.playerData.claimStoryReward('pingding_gold',
        { exp: 75000, silver: 16000 }, this.inventory);
      if (!goldReward.success && goldReward.reason !== 'already_claimed') {
        window.showGameMessage('⚔️ 金角的战利品暂由山神代收，稍后可再来领取。', 'warning', 5000);
      }
      this.updatePlayerHud();
      this.saveAutoProgress();
      window.Sound.playLevelUp();
      this.scheduleStoryDialogue('pingdingshan_laojun_aftermath');
    });
  }

  grantLaojunGift() {
    if (this.storyPhase === 'pingding_cleared') return;
    const result = this.playerData.claimStoryReward('pingding_laojun', {
      items: [{ itemId: 'jiuzhuan_xuandu_dan', count: 2 }, { itemId: 'eq_wp_qixing', count: 1 },
      { itemId: 'zijin_hulu', count: 1 }], exp: 80000, silver: 20000
    }, this.inventory);
    if (!result.success) {
      if (result.reason !== 'already_claimed') {
        window.showGameMessage('行囊装不下这份赠礼，请整理背包后再向老君领取。', 'warning', 5000);
      }
      return;
    }
    this.storyPhase = 'pingding_cleared';
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.Sound.playLevelUp();
    window.showGameMessage('🎉【平顶风云伏双魔】功德圆满！获赠太上老君【九转玄都金丹】×2、神兵【七星伏魔宝剑】与【紫金红葫芦·仙葫灵蕴】！', 'success', 6000);
  }

  // =========================================================================
  // 第十二回：号山·枯松涧火云洞（圣婴大王红孩儿）
  // 阶段链：pingding_cleared → huoyun_arrived → huoyun_redboy_ready
  //        → huoyun_boss_ready → huoyun_cleared
  // =========================================================================

  // 第一战：红孩儿假意求救被识破后的遭遇战（带一名火云炎兵护卫）
  triggerHuoyunScoutBattle() {
    if (this.storyPhase !== 'huoyun_redboy_ready') return;
    if (this.playerData.storyEvents?.huoyun_scout_won) return;
    if (window.Dialogue) window.Dialogue.close();

    const redboy = {
      id: 'boss_redboy_scout',
      name: '圣婴大王·红孩儿 (初试火法)',
      appearance: 'honghaier',
      modelId: 'honghaier',
      level: 54,
      hp: 26000,
      maxHp: 26000,
      mp: 7000,
      maxMp: 7000,
      atk: 360,
      def: 190,
      matk: 340,
      mdef: 185,
      spd: 48,
      skills: ['三昧真火', '飞沙走石', '封印咒']
    };
    const guard = {
      id: 'mob_huoyun_guard',
      name: '火云炎兵',
      appearance: 'yecha',
      modelId: 'yecha',
      level: 50,
      hp: 12000,
      maxHp: 12000,
      mp: 2000,
      maxMp: 2000,
      atk: 280,
      def: 150,
      spd: 42,
      skills: ['连击']
    };

    this.start2DBattle([redboy, guard], () => {
      this.playerData.storyEvents = this.playerData.storyEvents || {};
      this.playerData.storyEvents.huoyun_scout_won = true;
      this.storyPhase = 'huoyun_boss_ready';
      const reward = this.playerData.claimStoryReward('huoyun_scout', { exp: 60000, silver: 14000 }, this.inventory);
      if (!reward.success && reward.reason !== 'already_claimed') {
        window.showGameMessage('🔥 号山土地神替你先收着这批战利，稍后可再来领取。', 'warning', 5000);
      }
      this.refreshMapNpcs();
      this.updatePlayerHud();
      this.saveAutoProgress();
      window.Sound.playLevelUp();
      this.scheduleStoryDialogue('huoyun_boss_encounter');
    });
  }

  // 第二战：红孩儿真身 + 五行车阵三昧真火决战
  triggerRedboyBattle() {
    if (this.storyPhase !== 'huoyun_boss_ready') return;
    if (this.playerData.storyEvents?.huoyun_boss_won) return;
    if (window.Dialogue) window.Dialogue.close();

    const redboyTrue = {
      id: 'boss_redboy_true',
      name: '圣婴大王·三昧真身',
      appearance: 'honghaier',
      modelId: 'honghaier',
      level: 56,
      hp: 42000,
      maxHp: 42000,
      mp: 9999,
      maxMp: 9999,
      atk: 420,
      def: 215,
      matk: 400,
      mdef: 205,
      spd: 52,
      skills: ['三昧真火', '飞沙走石', '舍生取义', '定身咒'],
      // 五行车阵 Boss 机制：方案见 HANDOFF_2026-10-22.md 与 battle.js 的 hh_cart_* 实现
      mechanicId: 'five_element_cart',
      mechanicConfig: {
        breakRatio: 0.05,          // 破阵阈值 = 最大生命 × 5%（42000 → 2100）
        burstFactor: 1.5,          // 车阵爆发威力倍率
        guardFactor: 0.65,         // 守息减伤 35%
        recoveryRounds: 2,         // 恢复期回合数
        elements: ['gold', 'wood', 'water', 'fire', 'earth']
      }
    };
    const fireWheel = {
      id: 'mob_fire_wheel',
      name: '五行火车阵',
      appearance: 'yecha',
      modelId: 'yecha',
      level: 52,
      hp: 16000,
      maxHp: 16000,
      mp: 3000,
      maxMp: 3000,
      atk: 300,
      def: 160,
      spd: 46,
      skills: ['三昧真火']
    };

    this.start2DBattle([redboyTrue, fireWheel], () => {
      this.playerData.storyEvents = this.playerData.storyEvents || {};
      this.playerData.storyEvents.huoyun_boss_won = true;
      const reward = this.playerData.claimStoryReward('huoyun_boss', { exp: 90000, silver: 22000 }, this.inventory);
      if (!reward.success && reward.reason !== 'already_claimed') {
        window.showGameMessage('🔥 火云洞战利暂由土地神代管，稍后可再来领取。', 'warning', 5000);
      }
      this.updatePlayerHud();
      this.saveAutoProgress();
      window.Sound.playLevelUp();
      this.scheduleStoryDialogue('huoyun_aftermath');
    });
  }

  // 战后领奖（满包可重试）：与既有 claimStoryReward 模式一致，不重复发放
  claimHuoyunReward() {
    if (!this.playerData.storyEvents?.huoyun_boss_won || this.playerData.storyRewards?.huoyun_completion) {
      return false;
    }
    const result = this.playerData.claimStoryReward('huoyun_completion', {
      items: [
        { itemId: 'eq_nk_huoyun', count: 1 },
        { itemId: 'xuelian_dan', count: 5 },
        { itemId: 'jiuzhuan_dan', count: 3 }
      ],
      exp: 40000,
      silver: 10000
    }, this.inventory);
    if (!result.success) {
      if (result.reason === 'already_claimed') return false;
      window.showGameMessage('🔥 火云洞的谢礼暂由悟空看着，整理行囊后再来领取。', 'warning', 5000);
      return false;
    }
    this.storyPhase = 'huoyun_cleared';
    this.refreshMapNpcs();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.Sound.playLevelUp();
    window.showGameMessage('🎉【火云洞功成】获赠【火云辟火珠】、【雪莲丹】×5 与【九转还魂丹】×3！西行大道已开。', 'success', 6000);
    return true;
  }

  // =========================================================================
  // 第十三回：黑水河·衡阳峪（鼍洁）
  // 阶段链：huoyun_cleared → heishui_arrived → heishui_captives_taken
  //        → heishui_scout_ready → heishui_aid_needed → heishui_moang_arrived
  //        → heishui_boss_ready → heishui_reward_pending → heishui_cleared
  // =========================================================================

  // 首次进入黑水河：只在上一章刚刚完结时初始化，重复入图/后续章节回访均不回退
  ensureHeishuiChapterStarted() {
    if (this.currentMapId !== 'heishuihe') return false;
    if (this.storyPhase !== 'huoyun_cleared') return false;
    this.storyPhase = 'heishui_arrived';
    this.refreshMapNpcs();
    this.saveAutoProgress();
    return true;
  }

  // 探战：水府守将（含两名水卒）
  triggerHeishuiScoutBattle() {
    if (this.storyPhase !== 'heishui_scout_ready') return;
    if (this.playerData.storyEvents?.heishui_scout_won) return;
    if (window.Dialogue) window.Dialogue.close();

    const guard = {
      id: 'boss_heishui_guard',
      name: '水府守将',
      appearance: 'yecha',
      modelId: 'yecha',
      level: 58,
      hp: 20000,
      maxHp: 20000,
      mp: 4000,
      maxMp: 4000,
      atk: 400,
      def: 205,
      matk: 300,
      mdef: 195,
      spd: 46,
      skills: ['连击', '飞沙走石']
    };
    const minions = [1, 2].map(i => ({
      id: 'mob_heishui_gate_' + i,
      name: '水府甲卒',
      appearance: 'shrimp',
      modelId: 'shrimp',
      level: 55,
      hp: 9000,
      maxHp: 9000,
      mp: 1500,
      maxMp: 1500,
      atk: 320,
      def: 165,
      spd: 42,
      skills: ['连击']
    }));

    this.start2DBattle([guard, ...minions], () => {
      this.playerData.storyEvents = this.playerData.storyEvents || {};
      this.playerData.storyEvents.heishui_scout_won = true;
      // 先持久化阶段再排对白：离图导致对白取消也不能丢进展
      this.storyPhase = 'heishui_scout_ready';
      const reward = this.playerData.claimStoryReward('heishui_scout',
        { exp: 70000, silver: 15000 }, this.inventory);
      if (!reward.success && reward.reason !== 'already_claimed') {
        window.showGameMessage('🔱 战利暂由河神代管，稍后可再来领取。', 'warning', 5000);
      }
      this.refreshMapNpcs();
      this.updatePlayerHud();
      this.saveAutoProgress();
      window.Sound.playLevelUp();
      this.scheduleStoryDialogue('heishui_scout_victory');
    });
  }

  // 首领战：鼍洁（黑水换甲：凝鳞偏物防 / 散流偏法防，每 2 次有效行动切换）
  triggerTuojieBattle() {
    if (this.storyPhase !== 'heishui_boss_ready') return;
    if (this.playerData.storyEvents?.heishui_boss_won) return;
    if (window.Dialogue) window.Dialogue.close();

    const tuojie = {
      id: 'boss_tuojie',
      name: '鼍洁·黑水大王',
      appearance: 'shuiyao',
      modelId: 'shuiyao',
      level: 60,
      hp: 46000,
      maxHp: 46000,
      mp: 9000,
      maxMp: 9000,
      atk: 430,
      def: 220,
      matk: 410,
      mdef: 215,
      spd: 50,
      skills: ['三昧真火', '飞沙走石', '金刚护体'],
      // 黑水换甲：不做蓄力爆发，只切换物理/法术防护侧重
      mechanicId: 'heishui_current_armor',
      mechanicConfig: {
        startStance: 'scaled',
        switchEvery: 2,
        scaledDefBonus: 0.45,   // 凝鳞：物防 +45%
        flowingMdefBonus: 0.45  // 散流：法防 +45%
      }
    };

    this.start2DBattle([tuojie], () => {
      this.playerData.storyEvents = this.playerData.storyEvents || {};
      this.playerData.storyEvents.heishui_boss_won = true;
      this.storyPhase = 'heishui_boss_ready';
      const reward = this.playerData.claimStoryReward('heishui_boss',
        { exp: 110000, silver: 26000 }, this.inventory);
      if (!reward.success && reward.reason !== 'already_claimed') {
        window.showGameMessage('🐊 战利暂由河神代管，稍后可再来领取。', 'warning', 5000);
      }
      this.updatePlayerHud();
      this.saveAutoProgress();
      window.Sound.playLevelUp();
      this.scheduleStoryDialogue('heishui_tuojie_defeated');
    });
  }

  // 章节奖励：站在 heishui_reward_pending 才有资格，幂等，满包保留入口
  claimHeishuiReward() {
    if (this.playerData.storyRewards?.heishui_chapter_reward === true) {
      // 已领过：补齐终态，不重复发放
      if (this.storyPhase === 'heishui_reward_pending') {
        this.storyPhase = 'heishui_cleared';
        this.refreshMapNpcs();
        this.saveAutoProgress();
      }
      return false;
    }
    if (this.storyPhase !== 'heishui_reward_pending') return false;

    const result = this.playerData.claimStoryReward('heishui_chapter_reward', {
      items: [
        { itemId: 'eq_nk_heishui', count: 1 },
        { itemId: 'xuelian_dan', count: 5 },
        { itemId: 'jiuzhuan_dan', count: 3 }
      ],
      exp: 60000,
      silver: 14000
    }, this.inventory);

    if (!result.success) {
      if (result.reason === 'already_claimed') {
        this.storyPhase = 'heishui_cleared';
        this.refreshMapNpcs();
        this.saveAutoProgress();
        return false;
      }
      window.showGameMessage('🌊 谢礼暂由河神保管，整理行囊后再来领取。', 'warning', 5000);
      return false;
    }

    this.storyPhase = 'heishui_cleared';
    this.refreshMapNpcs();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.Sound.playLevelUp();
    window.showGameMessage('🎉【黑水河功成】获赠【黑水辟水佩】、【雪莲丹】×5 与【九转还魂丹】×3！河神复位，师徒渡河。', 'success', 6000);
    return true;
  }

  // =========================================================================
  // 第十四回：车迟国（虎力/鹿力/羊力三仙）
  // 阶段链：heishui_cleared → chedi_arrival → chedi_audience → chedi_rain
  //        → chedi_discern → chedi_final_trial → chedi_reward_pending → chedi_cleared
  // =========================================================================

  ensureChediChapterStarted() {
    if (this.currentMapId !== 'chediguo') return false;
    if (this.storyPhase !== 'heishui_cleared') return false;
    this.storyPhase = 'chedi_arrival';
    this.refreshMapNpcs();
    this.saveAutoProgress();
    return true;
  }

  // 终局战：三仙同场（虎力偏物、鹿力偏控、羊力偏法）
  triggerChediFinalBattle() {
    if (this.storyPhase !== 'chedi_final_trial') return;
    if (this.playerData.storyEvents?.chedi_final_won) return;
    if (window.Dialogue) window.Dialogue.close();

    const tiger = {
      id: 'boss_chedi_tiger', name: '虎力大仙', appearance: 'tiger', modelId: 'tiger',
      level: 62, hp: 48000, maxHp: 48000, mp: 9000, maxMp: 9000,
      atk: 450, def: 225, matk: 340, mdef: 210, spd: 51,
      skills: ['舍生取义', '雷霆万钧']
    };
    const deer = {
      id: 'boss_chedi_deer', name: '鹿力大仙', appearance: 'fox', modelId: 'fox',
      level: 61, hp: 42000, maxHp: 42000, mp: 11000, maxMp: 11000,
      atk: 380, def: 195, matk: 430, mdef: 235, spd: 48,
      skills: ['定身咒', '乱魂咒', '三昧真火']
    };
    const sheep = {
      id: 'boss_chedi_sheep', name: '羊力大仙', appearance: 'wolf', modelId: 'wolf',
      level: 61, hp: 44000, maxHp: 44000, mp: 10000, maxMp: 10000,
      atk: 400, def: 210, matk: 410, mdef: 220, spd: 50,
      skills: ['飞沙走石', '金刚护体', '封印咒']
    };

    this.start2DBattle([tiger, deer, sheep], () => {
      this.playerData.storyEvents = this.playerData.storyEvents || {};
      this.playerData.storyEvents.chedi_final_won = true;
      this.storyPhase = 'chedi_reward_pending';
      const reward = this.playerData.claimStoryReward('chedi_final',
        { exp: 120000, silver: 28000 }, this.inventory);
      if (!reward.success && reward.reason !== 'already_claimed') {
        window.showGameMessage('🐯 战利暂由国王代管，稍后可再来领取。', 'warning', 5000);
      }
      this.refreshMapNpcs();
      this.updatePlayerHud();
      this.saveAutoProgress();
      window.Sound.playLevelUp();
      this.scheduleStoryDialogue('chedi_victory');
    });
  }

  // 章节奖励：幂等，满包保留入口
  claimChediReward() {
    if (this.playerData.storyRewards?.chedi_ch14_clear === true) {
      if (this.storyPhase === 'chedi_reward_pending') {
        this.storyPhase = 'chedi_cleared';
        this.refreshMapNpcs();
        this.saveAutoProgress();
      }
      return false;
    }
    if (this.storyPhase !== 'chedi_reward_pending') return false;

    const result = this.playerData.claimStoryReward('chedi_ch14_clear', {
      items: [
        { itemId: 'eq_nk_chedi', count: 1 },
        { itemId: 'xuelian_dan', count: 5 },
        { itemId: 'jiuzhuan_dan', count: 3 }
      ],
      exp: 80000,
      silver: 18000
    }, this.inventory);

    if (!result.success) {
      if (result.reason === 'already_claimed') {
        this.storyPhase = 'chedi_cleared';
        this.refreshMapNpcs();
        this.saveAutoProgress();
        return false;
      }
      window.showGameMessage('📜 谢礼暂由国王保管，整理行囊后再来领取。', 'warning', 5000);
      return false;
    }

    this.storyPhase = 'chedi_cleared';
    this.refreshMapNpcs();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.Sound.playLevelUp();
    window.showGameMessage('🎉【车迟国功成】获赠【车迟伏仙佩】、【雪莲丹】×5 与【九转还魂丹】×3！西行关文通行资格已定。', 'success', 6000);
    return true;
  }

  // =========================================================================
  // 第十五回：八百里通天河（灵感大王）
  // 阶段链：chedi_cleared → tongtian_arrival → tongtian_pledge
  //        → tongtian_offer_ready → tongtian_ice_battle
  //        → tongtian_reward_pending → tongtian_cleared
  // =========================================================================

  ensureTongtianChapterStarted() {
    if (this.currentMapId !== 'tongtianhe') return false;
    if (this.storyPhase !== 'chedi_cleared') return false;
    this.storyPhase = 'tongtian_arrival';
    this.refreshMapNpcs();
    this.saveAutoProgress();
    return true;
  }

  // 冰封河面之战：灵感大王 + 两名寒冰水卒
  // 机制：姿态型「寒冰覆甲」——凝冰时物理防御提升，法术破冰有效
  triggerTongtianRescueBattle() {
    // 仅救援阶段可开战；已胜后不得重复
    if (this.storyPhase !== 'tongtian_rescue') return;
    if (this.playerData.storyEvents?.tongtian_boss_won) return;
    if (window.Dialogue) window.Dialogue.close();

    const boss = {
      id: 'boss_linggan', name: '灵感大王', appearance: 'shuiyao', modelId: 'shuiyao',
      level: 64, hp: 52000, maxHp: 52000, mp: 12000, maxMp: 12000,
      atk: 460, def: 230, matk: 450, mdef: 225, spd: 53,
      skills: ['三昧真火', '飞沙走石', '定身咒'],
      mechanicId: 'heishui_current_armor',
      mechanicConfig: {
        startStance: 'scaled',
        switchEvery: 2,
        scaledDefBonus: 0.45,
        flowingMdefBonus: 0.45
      }
    };
    const minions = [1, 2].map(i => ({
      id: 'mob_tongtian_ice_' + i, name: '寒冰水卒', appearance: 'shrimp', modelId: 'shrimp',
      level: 60, hp: 14000, maxHp: 14000, mp: 3000, maxMp: 3000,
      atk: 400, def: 200, spd: 46, skills: ["连击"]
    }));

    this.start2DBattle([boss, ...minions], () => {
      this.playerData.storyEvents = this.playerData.storyEvents || {};
      this.playerData.storyEvents.tongtian_boss_won = true;
      this.storyPhase = 'tongtian_await_guanyin';
      const reward = this.playerData.claimStoryReward('tongtian_boss',
        { exp: 140000, silver: 32000 }, this.inventory);
      if (!reward.success && reward.reason !== 'already_claimed') {
        window.showGameMessage('🐟 战利暂由陈家庄代管，稍后可再来领取。', 'warning', 5000);
      }
      this.refreshMapNpcs();
      this.updatePlayerHud();
      this.saveAutoProgress();
      window.Sound.playLevelUp();
      this.scheduleStoryDialogue('tongtian_victory');
    });
  }

  // 章节奖励：幂等，满包保留入口
  claimTongtianReward() {
    if (this.playerData.storyRewards?.tongtian_ch15_clear === true) {
      if (this.storyPhase === 'tongtian_reward') {
        this.storyPhase = 'tongtian_cleared';
        this.refreshMapNpcs();
        this.saveAutoProgress();
      }
      return false;
    }
    if (this.storyPhase !== 'tongtian_reward') return false;

    const result = this.playerData.claimStoryReward('tongtian_ch15_clear', {
      items: [
        { itemId: 'eq_nk_tongtian', count: 1 },
        { itemId: 'xuelian_dan', count: 5 },
        { itemId: 'jiuzhuan_dan', count: 3 }
      ],
      exp: 100000,
      silver: 22000
    }, this.inventory);

    if (!result.success) {
      if (result.reason === 'already_claimed') {
        this.storyPhase = 'tongtian_cleared';
        this.refreshMapNpcs();
        this.saveAutoProgress();
        return false;
      }
      window.showGameMessage('📜 谢礼暂由陈家庄保管，整理行囊后再来领取。', 'warning', 5000);
      return false;
    }

    this.storyPhase = 'tongtian_cleared';
    this.refreshMapNpcs();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.Sound.playLevelUp();
    window.showGameMessage('🎉【通天河功成】获赠【通天镇水佩】、【雪莲丹】×5 与【九转还魂丹】×3！河路复通，东去有路。', 'success', 6000);
    return true;
  }
  // =========================================================================
  // 第十六回：八百里火焰山（铁扇公主 / 牛魔王）
  // 阶段链：tongtian_cleared → huoyan_arrived → huoyan_borrow_fan → huoyan_test_fan
  //        → huoyan_seek_true_fan → huoyan_confront_bull → huoyan_renew_request
  //        → huoyan_quench_fire → huoyan_cleared
  // 不新增第三类 Boss 机制；牛魔王战用普通单 Boss 配置。
  // =========================================================================

  ensureHuoyanChapterStarted() {
    if (this.currentMapId !== 'huoyanshan') return false;
    if (this.storyPhase !== 'tongtian_cleared') return false;
    this.storyPhase = 'huoyan_arrived';
    this.refreshMapNpcs();
    this.saveAutoProgress();
    return true;
  }

  // 摩云台对质牛魔王（普通单 Boss，无 hh_* 专属状态）
  triggerHuoyanBullBattle() {
    if (this.storyPhase !== 'huoyan_confront_bull') return;
    if (this.playerData.storyEvents?.huoyan_bull_won) return;
    if (window.Dialogue) window.Dialogue.close();

    const bull = {
      id: 'boss_niumowang', name: '牛魔王', appearance: 'bull_demon', modelId: 'bull_demon',
      level: 68, hp: 56000, maxHp: 56000, mp: 14000, maxMp: 14000,
      atk: 480, def: 240, matk: 460, mdef: 235, spd: 55,
      skills: ['舍生取义', '雷霆万钧', '三昧真火']
    };

    this.start2DBattle([bull], () => {
      this.playerData.storyEvents = this.playerData.storyEvents || {};
      this.playerData.storyEvents.huoyan_bull_won = true;
      this.storyPhase = 'huoyan_renew_request';
      const reward = this.playerData.claimStoryReward('huoyan_bull',
        { exp: 150000, silver: 35000 }, this.inventory);
      if (!reward.success && reward.reason !== 'already_claimed') {
        window.showGameMessage('🐂 战利暂由土地代管，稍后可再来领取。', 'warning', 5000);
      }
      this.refreshMapNpcs();
      this.updatePlayerHud();
      this.saveAutoProgress();
      window.Sound.playLevelUp();
      this.scheduleStoryDialogue('huoyan_renew_request');
    });
  }

  // 章节奖励：幂等，满包保留入口（灭火事实不回滚）
  claimHuoyanReward() {
    if (this.playerData.storyRewards?.huoyan_chapter_reward === true) {
      if (this.storyPhase === 'huoyan_quench_fire') {
        this.storyPhase = 'huoyan_cleared';
        this.refreshMapNpcs();
        this.saveAutoProgress();
      }
      return false;
    }
    if (this.storyPhase !== 'huoyan_quench_fire') return false;

    const result = this.playerData.claimStoryReward('huoyan_chapter_reward', {
      items: [
        { itemId: 'eq_nk_huoyan', count: 1 },
        { itemId: 'xuelian_dan', count: 5 },
        { itemId: 'jiuzhuan_dan', count: 3 }
      ],
      exp: 120000,
      silver: 26000
    }, this.inventory);

    if (!result.success) {
      if (result.reason === 'already_claimed') {
        this.storyPhase = 'huoyan_cleared';
        this.refreshMapNpcs();
        this.saveAutoProgress();
        return false;
      }
      window.showGameMessage('📜 谢礼暂由百姓保管，整理行囊后再来领取。', 'warning', 5000);
      return false;
    }

    this.storyPhase = 'huoyan_cleared';
    this.refreshMapNpcs();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.Sound.playLevelUp();
    window.showGameMessage('🎉【火焰山功成】获赠【断火芭蕉佩】、【雪莲丹】×5 与【九转还魂丹】×3！西行继续。', 'success', 6000);
    return true;
  }
  // =========================================================================
  // 第十七回：盘丝岭盘丝洞（七女妖 / 黄花观百眼魔君）
  // 阶段链：huoyan_cleared → pansi_arrived → pansi_webbound → pansi_huanghua
  //        → pansi_poisoned → pansi_seeking_rooster → pansi_breaking_light
  //        → pansi_restoring → pansi_cleared
  // 叙事红线（双重责任）：八戒越界必须担责；蜘蛛精绑缚伤人也不因越界获得正当性。
  // 不新增第三类 Boss 机制；破光靠昴日星官两次啼鸣，不是打掉血条。
  // =========================================================================

  // =========================================================================
  // 第十八回：狮驼岭（阶段链与战斗口径见 storyQuests.js 狮驼对白块注释）
  // =========================================================================

  ensureShituoChapterStarted() {
    if (this.currentMapId !== 'shituoling') return false;
    if (this.storyPhase !== 'pansi_cleared') return false;
    this.storyPhase = 'shituo_arrived';
    this.refreshMapNpcs();
    this.saveAutoProgress();
    return true;
  }

  // 洞前决战：青狮精 + 白象精（战胜即因果，佛光收服走剧情）
  triggerShituoCaveBattle() {
    if (this.storyPhase !== 'shituo_cave') return;
    if (this.playerData.storyEvents?.shituo_cave_won) return;
    if (window.Dialogue) window.Dialogue.close();

    const qingshi = {
      id: 'boss_shituo_qingshi', name: '青狮精', appearance: 'heixiong_guai', modelId: 'bear',
      level: 70, hp: 52000, maxHp: 52000, mp: 12000, maxMp: 12000,
      atk: 460, def: 230, matk: 430, mdef: 225, spd: 50,
      skills: ['金刚护体', '雷霆万钧', '定身咒']
    };
    const baixiang = {
      id: 'boss_shituo_baixiang', name: '白象精', appearance: 'heixiong_guai', modelId: 'bear',
      level: 69, hp: 50000, maxHp: 50000, mp: 11000, maxMp: 11000,
      atk: 440, def: 245, matk: 410, mdef: 235, spd: 46,
      skills: ['佛光普照', '飞沙走石']
    };

    this.start2DBattle([qingshi, baixiang], () => {
      this.playerData.storyEvents = this.playerData.storyEvents || {};
      this.playerData.storyEvents.shituo_cave_won = true;
      this.storyPhase = 'shituo_plea';
      const reward = this.playerData.claimStoryReward('shituo_cave', {
        items: [{ itemId: 'jinchuang_yao', count: 2 }],
        silver: 8000, exp: 60000
      }, this.inventory);
      if (!reward.success && reward.reason !== 'already_claimed') {
        window.showGameMessage('战利先由洞中获救者代为保管——腾出行囊再来找他们领取，无须重打。', 'warning', 5000);
      }
      this.updatePlayerHud();
      this.saveAutoProgress();
      if (this.scheduleStoryDialogue) this.scheduleStoryDialogue('shituo_after_cave', 500);
    });
  }

  // 终战：大鹏金翅雕（须先得如来应允——佛光压阵是开战前提）
  triggerShituoFinalBattle() {
    if (this.storyPhase !== 'shituo_final') return;
    if (this.playerData.storyEvents?.shituo_boss_won) return;
    if (!this.playerData.storyEvents?.shituo_buddha_pledge) return;
    if (window.Dialogue) window.Dialogue.close();

    const dapeng = {
      id: 'boss_shituo_dapeng', name: '大鹏金翅雕', appearance: 'huangfeng_guai', modelId: 'huangfeng_guai',
      level: 72, hp: 62000, maxHp: 62000, mp: 14000, maxMp: 14000,
      atk: 500, def: 240, matk: 470, mdef: 235, spd: 58,
      skills: ['雷霆万钧', '三昧真火', '封印咒']
    };
    const zu1 = {
      id: 'mob_shituo_zu_1', name: '狮驼妖卒', appearance: 'wolf', modelId: 'wolf',
      level: 62, hp: 18000, maxHp: 18000, mp: 4000, maxMp: 4000,
      atk: 320, def: 160, matk: 280, mdef: 150, spd: 44,
      skills: ['撕咬']
    };
    const zu2 = { ...zu1, id: 'mob_shituo_zu_2', name: '狮驼妖卒' };

    this.start2DBattle([dapeng, zu1, zu2], () => {
      this.playerData.storyEvents = this.playerData.storyEvents || {};
      this.playerData.storyEvents.shituo_boss_won = true;
      this.storyPhase = 'shituo_restoring';
      this.updatePlayerHud();
      this.saveAutoProgress();
      if (this.scheduleStoryDialogue) this.scheduleStoryDialogue('shituo_victory', 500);
    });
  }

  // 章节谢礼：获救樵夫处领取（原子入包，满包保留可重试；成功即放行西行）
  claimShituoChapterReward() {
    // 读档断点：奖励已入账但阶段未推进（如满包时代曾领取），补推进即可，不重发
    if (this.playerData.storyRewards?.shituo_chapter_reward === true && this.storyPhase === 'shituo_restoring') {
      this.storyPhase = 'shituo_cleared';
      this.saveAutoProgress();
      this.refreshMapNpcs();
      return;
    }
    if (this.storyPhase !== 'shituo_restoring') {
      window.showGameMessage('樵夫拱手：“恩公的账在岭上已经清了，往前走吧。”', 'info');
      return;
    }
    const result = this.playerData.claimStoryReward('shituo_chapter_reward', {
      items: [{ itemId: 'eq_peishi_shituo', count: 1 }],
      silver: 12000, exp: 90000
    }, this.inventory);
    if (!result.success) {
      if (result.reason !== 'already_claimed') {
        window.showGameMessage('行囊装不下樵夫的谢礼，腾出一个装备格再来——玉佩给你留着。', 'warning', 5000);
      }
      return;
    }
    this.storyPhase = 'shituo_cleared';
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.showGameMessage('🎉【狮驼伏魔】岭上事了！获赠【狮驼辟邪玉佩】×1 与银两谢礼——西行关口已开，大雷音寺在望！', 'success', 6000);
    this.refreshMapNpcs();
  }

  ensurePansiChapterStarted() {
    if (this.currentMapId !== 'pansidong') return false;
    if (this.storyPhase !== 'huoyan_cleared') return false;
    this.storyPhase = 'pansi_arrived';
    this.refreshMapNpcs();
    this.saveAutoProgress();
    return true;
  }

  // 丝洞解缚战：蜘蛛精代表 + 两名蛛丝傀儡
  triggerPansiSpiderBattle() {
    if (this.storyPhase !== 'pansi_webbound') return;
    if (this.playerData.storyEvents?.pansi_unbound) return;
    if (window.Dialogue) window.Dialogue.close();

    const spider = {
      id: 'boss_pansi_spider', name: '盘丝七女妖', appearance: 'fox', modelId: 'fox',
      level: 66, hp: 40000, maxHp: 40000, mp: 10000, maxMp: 10000,
      atk: 420, def: 205, matk: 400, mdef: 210, spd: 50,
      skills: ['封印咒', '定身咒', '飞沙走石']
    };
    const puppets = [1, 2].map(i => ({
      id: 'mob_pansi_puppet_' + i, name: '蛛丝傀儡', appearance: 'wolf', modelId: 'wolf',
      level: 63, hp: 13000, maxHp: 13000, mp: 2500, maxMp: 2500,
      atk: 390, def: 195, spd: 45, skills: ["连击"]
    }));

    this.start2DBattle([spider, ...puppets], () => {
      this.playerData.storyEvents = this.playerData.storyEvents || {};
      this.playerData.storyEvents.pansi_unbound = true;
      this.storyPhase = 'pansi_huanghua';
      const reward = this.playerData.claimStoryReward('pansi_unbound',
        { exp: 130000, silver: 30000 }, this.inventory);
      if (!reward.success && reward.reason !== 'already_claimed') {
        window.showGameMessage('🕸️ 战利暂由师父代管，稍后可再来领取。', 'warning', 5000);
      }
      this.refreshMapNpcs();
      this.updatePlayerHud();
      this.saveAutoProgress();
      window.Sound.playLevelUp();
      this.scheduleStoryDialogue('pansi_after_unbound');
    });
  }

  // 毒茶事件：只生效一次；悟空与八戒倒下，沙僧护送撤至安全处
  triggerPansiPoisonTea() {
    if (this.storyPhase !== 'pansi_huanghua') return;
    if (this.playerData.storyEvents?.pansi_poisoned) return;
    this.playerData.storyEvents = this.playerData.storyEvents || {};
    this.playerData.storyEvents.pansi_poisoned = true;
    this.storyPhase = 'pansi_poisoned';
    this.refreshMapNpcs();
    this.saveAutoProgress();
    window.Sound.playBeep();
    this.scheduleStoryDialogue('pansi_poison_tea');
  }

  // 昴日啼鸣：两声按序完成，只提交一次；破光结果持久化
  triggerPansiRoosterCry(cryIndex) {
    if (this.storyPhase !== 'pansi_seeking_rooster' && this.storyPhase !== 'pansi_breaking_light') return;
    this.playerData.storyEvents = this.playerData.storyEvents || {};
    if (cryIndex === 1) {
      if (this.playerData.storyEvents.pansi_light_broken) return;
      this.playerData.storyEvents.pansi_light_broken = true;
      this.storyPhase = 'pansi_breaking_light';
      this.refreshMapNpcs();
      this.saveAutoProgress();
      window.showGameMessage('🐓【第一声啼鸣】金光散开，遮蔽消退！', 'success', 4500);
    } else if (cryIndex === 2) {
      if (this.playerData.storyEvents.pansi_form_revealed) return;
      if (!this.playerData.storyEvents.pansi_light_broken) return;
      this.playerData.storyEvents.pansi_form_revealed = true;
      this.saveAutoProgress();
      window.showGameMessage('🐓【第二声啼鸣】百眼失去伪装，现出蜈蚣本相！', 'success', 4500);
      this.scheduleStoryDialogue('pansi_form_revealed');
    }
  }

  // 百眼魔君最终战（普通单 Boss，无专属状态）
  triggerPansiBaiyanBattle() {
    if (this.storyPhase !== 'pansi_breaking_light') return;
    if (this.playerData.storyEvents?.pansi_boss_won) return;
    // 破光是开战前提：两声啼鸣未完成不得开战
    if (!this.playerData.storyEvents?.pansi_light_broken) return;
    if (!this.playerData.storyEvents?.pansi_form_revealed) return;
    if (window.Dialogue) window.Dialogue.close();

    const baiyan = {
      id: 'boss_baiyan', name: '百眼魔君·蜈蚣本相', appearance: 'yecha', modelId: 'yecha',
      level: 68, hp: 54000, maxHp: 54000, mp: 13000, maxMp: 13000,
      atk: 470, def: 235, matk: 450, mdef: 230, spd: 52,
      skills: ['万毒攻心', '三昧真火', '定身咒']
    };

    this.start2DBattle([baiyan], () => {
      this.playerData.storyEvents = this.playerData.storyEvents || {};
      this.playerData.storyEvents.pansi_boss_won = true;
      this.storyPhase = 'pansi_restoring';
      const reward = this.playerData.claimStoryReward('pansi_boss',
        { exp: 160000, silver: 38000 }, this.inventory);
      if (!reward.success && reward.reason !== 'already_claimed') {
        window.showGameMessage('☠️ 战利暂由昴日星官代管，稍后可再来领取。', 'warning', 5000);
      }
      this.refreshMapNpcs();
      this.updatePlayerHud();
      this.saveAutoProgress();
      window.Sound.playLevelUp();
      this.scheduleStoryDialogue('pansi_victory');
    });
  }

  // 善后完成：救治、清点、处置丝洞、清除危险
  completePansiAftercare() {
    if (this.storyPhase !== 'pansi_restoring') return false;
    if (this.playerData.storyEvents?.pansi_aftercare_done) return true;
    this.playerData.storyEvents = this.playerData.storyEvents || {};
    this.playerData.storyEvents.pansi_aftercare_done = true;
    this.saveAutoProgress();
    return true;
  }

  // 章节奖励：幂等，满包保留入口（西行出口只在终态放行）
  claimPansiReward() {
    if (this.playerData.storyRewards?.pansi_chapter_reward === true) {
      if (this.storyPhase === 'pansi_restoring') {
        this.storyPhase = 'pansi_cleared';
        this.refreshMapNpcs();
        this.saveAutoProgress();
      }
      return false;
    }
    if (this.storyPhase !== 'pansi_restoring') return false;

    const result = this.playerData.claimStoryReward('pansi_chapter_reward', {
      items: [
        { itemId: 'eq_nk_pansi', count: 1 },
        { itemId: 'xuelian_dan', count: 5 },
        { itemId: 'jiuzhuan_dan', count: 3 }
      ],
      exp: 140000,
      silver: 30000
    }, this.inventory);

    if (!result.success) {
      if (result.reason === 'already_claimed') {
        this.storyPhase = 'pansi_cleared';
        this.refreshMapNpcs();
        this.saveAutoProgress();
        return false;
      }
      window.showGameMessage('📜 谢礼暂由师父保管，整理行囊后再来领取。', 'warning', 5000);
      return false;
    }

    this.storyPhase = 'pansi_cleared';
    this.refreshMapNpcs();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.Sound.playLevelUp();
    window.showGameMessage('🎉【盘丝洞功成】获赠【盘丝辟毒佩】、【雪莲丹】×5 与【九转还魂丹】×3！西行继续。', 'success', 6000);
    return true;
  }
  // === 支线任务：【苍茫三岭伏魔传】逻辑实现 ===
  initSanlingSideQuest() {    if (!this.playerData) return null;
    this.playerData.sideQuests = this.playerData.sideQuests || {};
    if (!this.playerData.sideQuests.sq_sanling_demon) {
      this.playerData.sideQuests.sq_sanling_demon = {
        id: 'sq_sanling_demon',
        title: '苍茫三岭伏魔传',
        step: 'not_started',
        foxKills: 0,
        wolfKills: 0,
        foxesDefeated: {},
        wolvesDefeated: {}
      };
    }
    return this.playerData.sideQuests.sq_sanling_demon;
  }

  startSanlingSideQuest() {
    const sq = this.initSanlingSideQuest();
    if (!sq) return;
    if (sq.step === 'not_started') {
      sq.step = 'hunt_foxes';
      this.saveAutoProgress();
      window.Sound.playSuccess();
      window.showGameMessage('📜 已接取支线任务【苍茫三岭伏魔传】！前往野狐岭林间击败 3 只作恶的青丘妖狐！', 'success', 5000);
    }
  }

  checkSanlingSideQuestProgress() {
    const sq = this.initSanlingSideQuest();
    if (!sq) return;
    if (sq.step === 'hunt_foxes') {
      window.showGameMessage(`🦊【第一环·清剿狐患】请在野狐岭击败青丘妖狐 (当前进度: ${sq.foxKills || 0}/3)`, 'info', 4500);
    } else if (sq.step === 'hunt_wolves') {
      window.showGameMessage(`🐺【第二环·夜探狼岭】请前往郊狼岭击败阴风血狼 (当前进度: ${sq.wolfKills || 0}/3)`, 'info', 4500);
    } else if (sq.step === 'boss_ready') {
      window.showGameMessage('👹【第三环·决战魔窟】深入万妖魔窟·黑风绝壁，斩杀凶暴霸主【黑风修罗王】！', 'warn', 5000);
    } else if (sq.step === 'reward_ready') {
      window.showGameMessage('✨ 修罗王已伏诛！速速向野狐岭玄风道长复命，领受辟邪灵佩等丰厚大奖！', 'success', 5000);
    } else if (sq.step === 'done') {
      window.showGameMessage('🎉 苍茫三岭妖氛尽散，三岭百姓皆感念少侠神威！', 'success', 4500);
    }
  }

  triggerSanlingFoxBattle(npcId = 'npc_sanling_fox_1') {
    if (window.Dialogue) window.Dialogue.close();
    const enemies = [
      {
        id: 'monster_sanling_fox',
        name: '青丘妖狐',
        appearance: 'fox',
        modelId: 'fox',
        level: 28,
        hp: 3800,
        maxHp: 3800,
        mp: 1500,
        maxMp: 1500,
        atk: 180,
        def: 85,
        spd: 38,
        skills: ['隐身咒', '三昧真火']
      },
      {
        id: 'monster_fox_sub',
        name: '野狐妖仆',
        appearance: 'fox',
        modelId: 'fox',
        level: 26,
        hp: 2600,
        maxHp: 2600,
        mp: 800,
        maxMp: 800,
        atk: 140,
        def: 70,
        spd: 34,
        skills: []
      }
    ];

    this.start2DBattle(enemies, () => {
      const sq = this.initSanlingSideQuest();
      if (sq) {
        sq.foxesDefeated = sq.foxesDefeated || {};
        sq.foxesDefeated[npcId] = true;
        sq.foxKills = (sq.foxKills || 0) + 1;
        // 内丹是支线计数道具，满包时不静默吞掉，提示玩家清理后再战
        if (this.inventory && !this.inventory.canAddItems([{ itemId: 'qingqiu_hudan', count: 1 }])) {
          window.showGameMessage('🦊 妖狐已伏诛，但行囊已满，内丹暂由道长代收；整理行囊后再来领取。', 'warning', 5000);
        } else if (this.inventory) {
          this.inventory.addItem('qingqiu_hudan', 1);
        }
        if (sq.foxKills >= 3 && sq.step === 'hunt_foxes') {
          sq.step = 'hunt_wolves';
          window.Sound.playLevelUp();
          window.showGameMessage('🎉【狐患已清】成功斩获3枚青丘狐丹！第二环开启：速穿过西门进入【郊狼岭】斩杀3只阴风血狼！', 'success', 5000);
        } else {
          window.showGameMessage(`🦊 击败青丘妖狐！取得【青丘妖狐内丹】×1！(狐患进度: ${sq.foxKills}/3)`, 'success', 3500);
        }
      }
      this.npcs = this.npcs.filter(n => n.id !== npcId);
      this.playerData.gainExp(12000);
      this.playerData.silver += 2000;
      this.updatePlayerHud();
      this.saveAutoProgress();
    });
  }

  triggerSanlingWolfBattle(npcId = 'npc_sanling_wolf_1') {
    if (window.Dialogue) window.Dialogue.close();
    const enemies = [
      {
        id: 'monster_sanling_wolf',
        name: '阴风血狼',
        appearance: 'wolf',
        modelId: 'wolf',
        level: 32,
        hp: 5200,
        maxHp: 5200,
        mp: 1200,
        maxMp: 1200,
        atk: 220,
        def: 110,
        spd: 42,
        skills: ['连击', '狂暴重击']
      },
      {
        id: 'monster_wolf_sub',
        name: '嗜血幼狼',
        appearance: 'wolf',
        modelId: 'wolf',
        level: 30,
        hp: 3400,
        maxHp: 3400,
        mp: 800,
        maxMp: 800,
        atk: 170,
        def: 90,
        spd: 39,
        skills: []
      }
    ];

    this.start2DBattle(enemies, () => {
      const sq = this.initSanlingSideQuest();
      if (sq) {
        sq.wolvesDefeated = sq.wolvesDefeated || {};
        sq.wolvesDefeated[npcId] = true;
        sq.wolfKills = (sq.wolfKills || 0) + 1;
        // 行商锦囊同样属于支线计数道具，满包不得静默丢弃
        if (this.inventory && !this.inventory.canAddItems([{ itemId: 'shangren_jinnang', count: 1 }])) {
          window.showGameMessage('🐺 血狼已伏诛，但行囊已满，遗物暂存道长处；整理行囊后再来取。', 'warning', 5000);
        } else if (this.inventory) {
          this.inventory.addItem('shangren_jinnang', 1);
        }
        if (sq.wolfKills >= 3 && sq.step === 'hunt_wolves') {
          sq.step = 'boss_ready';
          window.Sound.playLevelUp();
          window.showGameMessage('⚔️【狼患荡平】成功夺回行商遗物！群魔震恐，深处【黑风绝壁】魔窟霸主【黑风修罗王】已现身迎战！', 'warn', 5500);
        } else {
          window.showGameMessage(`🐺 诛灭阴风血狼！夺回【残破的行商锦囊】×1！(狼患进度: ${sq.wolfKills}/3)`, 'success', 3500);
        }
      }
      this.npcs = this.npcs.filter(n => n.id !== npcId);
      this.playerData.gainExp(16000);
      this.playerData.silver += 3000;
      this.updatePlayerHud();
      this.saveAutoProgress();
    });
  }

  triggerHeifengShuraBattle() {
    if (window.Dialogue) window.Dialogue.close();
    const bosses = [
      {
        id: 'boss_heifeng_shura',
        name: '黑风修罗王',
        appearance: 'yecha',
        modelId: 'yecha',
        level: 38,
        hp: 16800,
        maxHp: 16800,
        mp: 4000,
        maxMp: 4000,
        atk: 290,
        def: 160,
        matk: 240,
        mdef: 145,
        spd: 44,
        skills: ['雷霆万钧', '舍生取义', '三昧真火']
      },
      {
        id: 'mob_shura_guard_1',
        name: '修罗血煞卫·左',
        appearance: 'yecha',
        modelId: 'yecha',
        level: 35,
        hp: 6000,
        maxHp: 6000,
        mp: 1500,
        maxMp: 1500,
        atk: 210,
        def: 120,
        spd: 38,
        skills: ['连击']
      },
      {
        id: 'mob_shura_guard_2',
        name: '修罗血煞卫·右',
        appearance: 'yecha',
        modelId: 'yecha',
        level: 35,
        hp: 6000,
        maxHp: 6000,
        mp: 1500,
        maxMp: 1500,
        atk: 210,
        def: 120,
        spd: 38,
        skills: ['连击']
      }
    ];

    this.start2DBattle(bosses, () => {
      const sq = this.initSanlingSideQuest();
      if (sq) {
        sq.step = 'reward_ready';
      }
      this.npcs = this.npcs.filter(n => n.id !== 'npc_heifeng_shura_boss');
      this.playerData.gainExp(35000);
      this.playerData.silver += 8000;
      this.updatePlayerHud();
      this.saveAutoProgress();
      window.Sound.playLevelUp();
      window.showGameMessage('🎉【荡平魔窟】万妖魔窟霸主【黑风修罗王】伏诛！速速返回野狐岭向【玄风道长】复命领赏！', 'success', 6000);
    });
  }

  claimSanlingSideQuestReward() {
    const sq = this.initSanlingSideQuest();
    if (!sq || sq.step !== 'reward_ready') {
      window.showGameMessage('道长抚须含笑：“三岭妖氛未绝，少侠莫急，功成自会奉上厚礼。”', 'info');
      return;
    }
    const result = this.playerData.claimStoryReward('sanling_completion', {
      items: [{ itemId: 'eq_peishi_heifeng', count: 1 }, { itemId: 'jin_liu_lu', count: 3 },
      { itemId: 'jiuzhuan_dan', count: 3 }], exp: 35000, silver: 10000
    }, this.inventory);
    if (!result.success) {
      if (result.reason !== 'already_claimed') {
        window.showGameMessage('行囊装不下道长的谢礼，请整理背包后再来复命。', 'warning', 5000);
      }
      return;
    }
    sq.step = 'done';
    sq.status = 'completed';
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.Sound.playLevelUp();
    window.showGameMessage('🎉【苍茫三岭伏魔传】支线圆满达成！获赠极品【黑风辟邪玉佩】×1、【金柳露】×3、【九转还魂丹】×3 与 10000 银两！', 'success', 6000);
  }

  // 兼容别名
  startCombat(nameOrEnemies, maybeEnemies, onVictoryCallback) {
    let enemies = [];
    let cb = onVictoryCallback;
    if (Array.isArray(nameOrEnemies)) {
      enemies = nameOrEnemies;
      cb = maybeEnemies;
    } else if (Array.isArray(maybeEnemies)) {
      enemies = maybeEnemies;
    }
    return this.start2DBattle(enemies, cb);
  }

  // 战斗桥接与全屏渲染 (彻底消除卡死，国风立绘，战术时序与动作打击)
  // 战斗桥接与全屏渲染 (经典汉风三栏布局：左敌方竖排，中操作竖排，右我方四位竖排)
  start2DBattle(enemies, onVictoryCallback, onDefeatCallback = null) {
    if (this.currentBattle || this.isTransitioning) return false;
    // P5.3: 清理上一场的战果清点面板，避免叠加
    document.querySelectorAll('.battle-summary-overlay').forEach(m => m.remove());
    this.autoMovePath = [];
    this.autoMoveTargetCallback = null;
    this.keysDown = {};
    if (window.Dialogue) {
      window.Dialogue.close();
    }

    const battleEl = document.getElementById('battle-screen-layer');
    if (!battleEl) return;
    enemies.forEach(enemy => this.getShanhai().observe(enemy, this.currentMapId));

    battleEl.style.display = 'flex';
    this.isPaused = true;

    // 仙宠出战规则：20级带1只、30级带2只、40级带3只
    const maxPets = this.playerData.getMaxCombatPets ? this.playerData.getMaxCombatPets() : 0;
    let combatAllies = [];
    if (Array.isArray(this.activeCombatPets)) {
      combatAllies = this.activeCombatPets.filter(p => this.pets?.some(owned => owned.instanceId === p.instanceId)).slice(0, maxPets);
    } else if (this.pets && this.pets.length > 0) {
      combatAllies = this.pets.slice(0, maxPets);
    }

    // 剧情协同同伴（若仙宠槽位有余且非重复则出战助威）
    if (this.companions && this.companions.length > 0) {
      for (const comp of this.companions) {
        if (!combatAllies.some(p => p.name === comp.name) && combatAllies.length < 3) {
          combatAllies.push(comp);
        }
      }
    }

    this.currentBattle = new window.BattleEngine(
      this.playerData,
      combatAllies,
      enemies
    );

    this.currentBattle.trainingPetIds = (this.pets || []).map(p => p.instanceId);
    this.selectedTargetIndex = 0;
    this.selectedAllyId = 'player';
    this.battleSkillMenuOpen = false;
    this.battleCountdown = 30;
    this.autoCombatEnabled = false;
    this.combatSpeedMultiplier = this.getCombatSpeedPref ? this.getCombatSpeedPref() : 1;
    this.battleVictoryCallback = onVictoryCallback;
    this.battleDefeatCallback = onDefeatCallback;

    this.startBattleCountdown();
    this.renderBattleInterface();
    this.startBattleLoop();
  }

  startBattleCountdown() {
    this.stopBattleCountdown();
    this.battleCountdown = 30;
    this.battleCountdownTimer = setInterval(() => {
      if (!this.currentBattle) {
        this.stopBattleCountdown();
        return;
      }
      this.battleCountdown--;
      const pillTextEl = document.getElementById('battle-acting-countdown-text');
      if (pillTextEl) {
        pillTextEl.innerText = `(${this.battleCountdown})`;
      }
      if (this.battleCountdown <= 0) {
        this.battleCountdown = 30;
        // 只有仍处于"等待玩家指令"的战斗才自动出招；
        // 若刚好在逃跑/结算瞬间，避免二次进入回合导致回调重复触发。
        if (this.currentBattle && this.currentBattle.status === 'player_input' && !this.isAnimatingCombat) {
          this.executeCombatRound();
        }
      }
    }, 1000);
  }

  stopBattleCountdown() {
    if (this.battleCountdownTimer) {
      clearInterval(this.battleCountdownTimer);
      this.battleCountdownTimer = null;
    }
  }

  startBattleLoop() {
    if (this.battleAnimId) {
      cancelAnimationFrame(this.battleAnimId);
      this.battleAnimId = null;
    }
    const loop = () => {
      if (!this.currentBattle) return;
      this.renderBattleCanvasFrame();
      if (this.currentBattle) this.battleAnimId = requestAnimationFrame(loop);
    };
    this.battleAnimId = requestAnimationFrame(loop);
  }

  stopBattleLoop() {
    if (this.battleAnimId) {
      cancelAnimationFrame(this.battleAnimId);
      this.battleAnimId = null;
    }
  }

  toggleSkillMenu(isOpen) {
    this.battleSkillMenuOpen = isOpen;
    if (!isOpen) {
      this.battleTargetMenuOpen = false;
      this.pendingSkillAction = null;
    }
    const hexSvg = document.getElementById('battle-hex-svg');
    const skillPanel = document.getElementById('battle-skill-panel');
    const targetPanel = document.getElementById('battle-target-panel');
    if (hexSvg && skillPanel) {
      hexSvg.style.display = (isOpen || this.battleTargetMenuOpen) ? 'none' : 'block';
      skillPanel.style.display = (isOpen && !this.battleTargetMenuOpen) ? 'flex' : 'none';
      if (targetPanel) targetPanel.style.display = this.battleTargetMenuOpen ? 'flex' : 'none';
      document.getElementById('battle-honeycomb-menu')?.classList.toggle('is-targeting', this.battleTargetMenuOpen);
      if (window.Sound) window.Sound.playBeep();
      return;
    }
    this.renderBattleInterface();
  }

  // 计算技能当前动态法力消耗
  getSkillMpCost(sk, curAlly = null) {
    if (!sk) return 0;
    if (sk.costMp) return sk.costMp;
    if (!window.SkillMasteryEngine) return 0;
    const lvl = sk.level || 1;
    const mastery = (sk.mastery !== undefined) ? sk.mastery : (sk.proficiency || 0);
    const sId = sk.id || '';
    const sName = sk.name || '';
    if (sId === 'sk_jg_shesheng' || sName.includes('舍生取义')) {
      return window.SkillMasteryEngine.calculateShesheng(curAlly, null, lvl, mastery).costMp;
    }
    if (sId === 'sk_jg_foguang' || sName.includes('佛光普照')) {
      return window.SkillMasteryEngine.calculateMpDrainAttack(false, curAlly, null, lvl, mastery).costMp;
    }
    if (sId === 'sk_jg_ruxiang' || sName.includes('如来神掌')) {
      return window.SkillMasteryEngine.calculateMpDrainAttack(true, curAlly, null, lvl, mastery).costMp;
    }
    if (sId === 'sk_jg_huti' || sName.includes('金刚护体')) {
      return window.SkillMasteryEngine.calculateHutiBuff(lvl, mastery).costMp;
    }
    if (sId === 'sk_ym_leiting' || sName.includes('雷霆万钧')) {
      return window.SkillMasteryEngine.calculateLeiting(curAlly, null, lvl, mastery).costMp;
    }
    if (sId === 'sk_ym_wandu' || sName.includes('万毒攻心')) {
      return window.SkillMasteryEngine.calculateWandu(curAlly, null, lvl, mastery).costMp;
    }
    if (sId === 'sk_ym_sanmei' || sName.includes('三昧真火')) {
      return window.SkillMasteryEngine.calculateGroupSpell('三昧真火', curAlly, 1, lvl, mastery).costMp;
    }
    if (sId === 'sk_ym_feisha' || sName.includes('飞沙走石')) {
      return window.SkillMasteryEngine.calculateGroupSpell('飞沙走石', curAlly, 1, lvl, mastery).costMp;
    }
    if (sId === 'sk_xr_luanhun' || sName.includes('乱魂')) {
      return window.SkillMasteryEngine.calculateControlSpell('luanhun', lvl, mastery).costMp;
    }
    if (sId === 'sk_xr_fengyin' || sName.includes('封印')) {
      return window.SkillMasteryEngine.calculateControlSpell('fengyin', lvl, mastery).costMp;
    }
    if (sId === 'sk_xr_dingshen' || sName.includes('定身')) {
      return window.SkillMasteryEngine.calculateControlSpell('dingshen', lvl, mastery).costMp;
    }
    if (sId === 'sk_xr_yinshen' || sName.includes('隐身')) {
      return window.SkillMasteryEngine.calculateControlSpell('yinshen', lvl, mastery).costMp;
    }
    return 0;
  }

  // 判定是否需要由玩家手动点选目标
  isSkillTargetSelectionNeeded(skillId) {
    if (!this.currentBattle) return false;
    const aliveEnemies = this.currentBattle.enemies.filter(e => e.hp > 0);
    const aliveAllies = (this.currentBattle.allies || []).filter(a => a.hp > 0);

    // 获取当前出招角色及该技能配置
    const curAllyId = this.selectedAllyId || 'player';
    const curAlly = this.currentBattle.allies.find(a => a.id === curAllyId) || this.currentBattle.allies[0];
    const skills = curAlly?.isPlayer ? (this.playerData?.getSkills ? this.playerData.getSkills() : (this.playerData?.skills || [])) : (curAlly?.skills || []);
    const sk = skills.find(s => s.id === skillId || s.name === skillId) || { id: skillId, name: skillId };
    const sId = sk.id || '';
    const sName = sk.name || '';

    // 1. 金刚护体等友军增益：当友方存活大于1人时需要选择目标友军
    if (sId === 'sk_jg_huti' || sName.includes('金刚护体')) {
      return aliveAllies.length > 1;
    }

    // 2. 自身专属/隐身：无需选择目标
    if (sId === 'sk_xr_yinshen' || sName.includes('隐身')) {
      return false;
    }

    // 3. 必中全场群伤神法：三昧真火、飞沙走石，必中所有敌人，无需指定单体
    if (sId === 'sk_ym_sanmei' || sName.includes('三昧真火') ||
      sId === 'sk_ym_feisha' || sName.includes('飞沙走石')) {
      return false;
    }

    // 4. 敌方单体或多目标：若敌方存活仅1人，目标无歧义，无需选择
    if (aliveEnemies.length <= 1) return false;

    // 5. 计算该技能可命中的最大目标数
    let maxTargets = 1;
    if (sId === 'sk_jg_ruxiang' || sName.includes('如来神掌')) {
      const calc = (window.SkillMasteryEngine && window.SkillMasteryEngine.calculateMpDrainAttack) ?
        window.SkillMasteryEngine.calculateMpDrainAttack(true, curAlly, aliveEnemies[0], sk.level || 1, sk.mastery || 0) : { maxTargets: 3 };
      maxTargets = calc.maxTargets || 3;
    } else if (sId === 'sk_ym_wandu' || sName.includes('万毒攻心')) {
      const calc = (window.SkillMasteryEngine && window.SkillMasteryEngine.calculateWandu) ?
        window.SkillMasteryEngine.calculateWandu(curAlly, aliveEnemies[0], sk.level || 1, sk.mastery || 0) : { maxTargets: 3 };
      maxTargets = calc.maxTargets || 3;
    } else if (sId === 'sk_xr_luanhun' || sName.includes('乱魂')) {
      const calc = (window.SkillMasteryEngine && window.SkillMasteryEngine.calculateControlSpell) ?
        window.SkillMasteryEngine.calculateControlSpell('luanhun', sk.level || 1, sk.mastery || 0) : { maxTargets: 1 };
      maxTargets = calc.maxTargets || 1;
    } else if (sId === 'sk_xr_fengyin' || sName.includes('封印')) {
      const calc = (window.SkillMasteryEngine && window.SkillMasteryEngine.calculateControlSpell) ?
        window.SkillMasteryEngine.calculateControlSpell('fengyin', sk.level || 1, sk.mastery || 0) : { maxTargets: 1 };
      maxTargets = calc.maxTargets || 1;
    } else if (sId === 'sk_xr_dingshen' || sName.includes('定身')) {
      const calc = (window.SkillMasteryEngine && window.SkillMasteryEngine.calculateControlSpell) ?
        window.SkillMasteryEngine.calculateControlSpell('dingshen', sk.level || 1, sk.mastery || 0) : { maxTargets: 1 };
      maxTargets = calc.maxTargets || 1;
    } else {
      // 舍生取义、雷霆万钧、佛光普照、天雷斩、水攻等单体爆发/控制技能
      maxTargets = 1;
    }

    // 核心准则：仅当敌方可选目标刚好等于或小于该技能目标数时无需选择直接跳过；
    // 若敌方人数多于该技能作用目标（例如敌方还有2人而释放舍生、雷霆、封印等单体技能），依然必须选择！
    if (aliveEnemies.length <= maxTargets) {
      return false;
    }

    return true;
  }

  // 技能按钮点击智能分发
  onSkillButtonClick(skillId) {
    if (!this.currentBattle || this.currentBattle.status === 'executing') return;

    const curAllyId = this.selectedAllyId || 'player';
    const curAlly = this.currentBattle.allies.find(a => a.id === curAllyId) || this.currentBattle.allies[0];
    const curSkills = curAlly?.isPlayer ? (this.playerData?.getSkills ? this.playerData.getSkills() : (this.playerData?.skills || [])) : (curAlly?.skills || []);
    const sk = curSkills.find(s => s.id === skillId || s.name === skillId) || { id: skillId, name: skillId };
    const costMp = this.getSkillMpCost(sk, curAlly);
    if (curAlly && curAlly.mp < costMp) {
      window.showGameMessage(`⚠️ 法力不足！施展【${sk.name || '该技能'}】需消耗 ${costMp} 精力 (当前: ${curAlly.mp})！`, 'warning', 2500);
      if (window.Sound && window.Sound.playFailure) window.Sound.playFailure();
      return;
    }

    if (this.isSkillTargetSelectionNeeded(skillId)) {
      this.initiateCombatAction('skill', skillId);
    } else {
      this.battleSkillMenuOpen = false;
      this.battleTargetMenuOpen = false;
      this.pendingSkillAction = null;
      this.chooseCombatAction('skill', skillId);
    }
  }

  // 核心战斗指令发起入口：严格遵循“先选指令 -> 再筛选可选目标 -> 若可选目标>1必须手动选择”
  initiateCombatAction(type, skillId = null, itemId = null) {
    if (!this.currentBattle || this.currentBattle.status === 'executing') return;
    const battle = this.currentBattle;
    const aliveEnemies = battle.enemies.filter(e => e.hp > 0);
    const aliveAllies = battle.allies.filter(a => a.hp > 0);
    const curAllyId = this.selectedAllyId || 'player';
    const curAlly = battle.allies.find(a => a.id === curAllyId) || battle.allies[0];

    // 防御与逃跑直接执行自身指令
    if (type === 'defend' || type === 'flee') {
      return this.chooseCombatAction(type);
    }

    let targetSide = 'enemy';
    let actionName = '普通攻击';
    let skill = null;

    if (type === 'attack') {
      targetSide = 'enemy';
      actionName = '普通物理攻击';
    } else if (type === 'capture') {
      targetSide = 'enemy';
      actionName = '招降收服';
    } else if (type === 'item') {
      targetSide = 'ally';
      actionName = '使用药品';
    } else if (type === 'skill') {
      const curSkills = curAlly?.isPlayer ? (this.playerData?.getSkills ? this.playerData.getSkills() : (this.playerData?.skills || [])) : (curAlly?.skills || []);
      skill = curSkills.find(s => s.id === skillId || s.name === skillId) || { id: skillId, name: skillId };
      actionName = skill.name || '门派绝技';

      const costMp = this.getSkillMpCost(skill, curAlly);
      if (curAlly && curAlly.mp < costMp) {
        window.showGameMessage(`⚠️ 法力不足！施展【${skill.name || '该技能'}】需消耗 ${costMp} 精力 (当前: ${curAlly.mp})！`, 'warning', 2500);
        if (window.Sound && window.Sound.playFailure) window.Sound.playFailure();
        return;
      }

      const sId = skill.id || '';
      const sName = skill.name || '';

      // 1. 隐身等自身专属技能：直接施展
      if (sId === 'sk_xr_yinshen' || sName.includes('隐身')) {
        this.battleSkillMenuOpen = false;
        return this.chooseCombatAction('skill', skillId);
      }
      // 2. 金刚护体等友军增益技能：只能选择友军！
      else if (sId === 'sk_jg_huti' || sName.includes('金刚护体')) {
        targetSide = 'ally';
      }
      // 3. 全体群伤神法：三昧真火、飞沙走石，直接出招
      else if (sId === 'sk_ym_sanmei' || sName.includes('三昧真火') ||
        sId === 'sk_ym_feisha' || sName.includes('飞沙走石')) {
        this.battleSkillMenuOpen = false;
        return this.chooseCombatAction('skill', skillId);
      }
      // 4. 敌方单体或多目标攻击/控制
      else {
        let maxTargets = 1;
        if (sId === 'sk_jg_ruxiang' || sName.includes('如来神掌')) {
          const calc = (window.SkillMasteryEngine && window.SkillMasteryEngine.calculateMpDrainAttack) ?
            window.SkillMasteryEngine.calculateMpDrainAttack(true, curAlly, aliveEnemies[0], skill.level || 1, skill.mastery || 0) : { maxTargets: 3 };
          maxTargets = calc.maxTargets || 3;
        } else if (sId === 'sk_ym_wandu' || sName.includes('万毒攻心')) {
          const calc = (window.SkillMasteryEngine && window.SkillMasteryEngine.calculateWandu) ?
            window.SkillMasteryEngine.calculateWandu(curAlly, aliveEnemies[0], skill.level || 1, skill.mastery || 0) : { maxTargets: 3 };
          maxTargets = calc.maxTargets || 3;
        }
        if (aliveEnemies.length <= maxTargets && maxTargets > 1) {
          // 群攻目标全覆盖，无需单选
          this.battleSkillMenuOpen = false;
          return this.chooseCombatAction('skill', skillId);
        }
        targetSide = 'enemy';
      }
    }

    const candidates = targetSide === 'enemy' ? aliveEnemies : aliveAllies;
    if (candidates.length === 0) {
      window.showGameMessage('⚠️ 当前无可作用的有效目标！', 'warning', 2000);
      return;
    }

    // 核心准则：若可选目标 > 1，严禁直接自动攻击，必须弹出目标选择面板！
    if (candidates.length > 1) {
      this.pendingCombatAction = {
        type,
        skillId,
        itemId,
        targetSide,
        actionName
      };
      this.pendingSkillAction = this.pendingCombatAction; // 保持向后兼容
      this.targetFocusIndex = 0;
      if (targetSide === 'enemy') {
        const firstEnemyIdx = candidates[0].enemyIndex !== undefined ? candidates[0].enemyIndex : 0;
        this.selectedTargetIndex = firstEnemyIdx;
      }
      this.battleSkillMenuOpen = false;
      this.battleTargetMenuOpen = true;
      if (window.Sound) window.Sound.playBeep();
      // 操作说明由目标面板提供，避免重复长提示覆盖小屏的目标标签。
      this.renderBattleInterface();
    } else {
      // 仅有 1 个可选目标时自动选定
      const soleTarget = candidates[0];
      this.battleSkillMenuOpen = false;
      this.battleTargetMenuOpen = false;
      this.pendingCombatAction = null;
      this.pendingSkillAction = null;
      if (targetSide === 'enemy') {
        const targetIdx = soleTarget.enemyIndex !== undefined ? soleTarget.enemyIndex : 0;
        this.selectedTargetIndex = targetIdx;
        this.chooseCombatAction(type, skillId, targetIdx);
      } else {
        this.chooseCombatAction(type, skillId, 0, soleTarget.id);
      }
    }
  }

  // 切换目标聚焦 (更新当前预览的单个目标状态)
  setCombatFocusedTarget(idx) {
    if (!this.currentBattle) return;
    const pending = this.pendingCombatAction || this.pendingSkillAction;
    const isAlly = pending?.targetSide === 'ally';
    const pool = isAlly
      ? (this.currentBattle.allies || []).filter(a => a.hp > 0)
      : (this.currentBattle.enemies || []).filter(en => en.hp > 0);
    const targetIdx = Number(idx);
    if (Number.isInteger(targetIdx) && targetIdx >= 0 && targetIdx < pool.length) {
      this.targetFocusIndex = targetIdx;
      if (!isAlly) {
        this.selectedTargetIndex = pool[targetIdx].enemyIndex !== undefined ? pool[targetIdx].enemyIndex : targetIdx;
      }
      if (window.Sound) window.Sound.playBeep();
      this.renderBattleInterface();
    }
  }

  // 轮转切换目标 (支持键盘左右箭头/Tab键)
  cycleCombatFocusedTarget(delta = 1) {
    if (!this.currentBattle) return;
    const pending = this.pendingCombatAction || this.pendingSkillAction;
    const isAlly = pending?.targetSide === 'ally';
    const pool = isAlly
      ? (this.currentBattle.allies || []).filter(a => a.hp > 0)
      : (this.currentBattle.enemies || []).filter(en => en.hp > 0);
    if (!pool.length) return;
    let nextIdx = (Number(this.targetFocusIndex || 0) + delta) % pool.length;
    if (nextIdx < 0) nextIdx += pool.length;
    this.setCombatFocusedTarget(nextIdx);
  }

  // 确认当前聚焦目标并执行出招
  confirmCurrentCombatAction() {
    if (!this.currentBattle || this.currentBattle.status === 'executing') return;
    const pending = this.pendingCombatAction || this.pendingSkillAction || { targetSide: 'enemy' };
    const isAlly = pending?.targetSide === 'ally';
    const pool = isAlly
      ? (this.currentBattle.allies || []).filter(a => a.hp > 0)
      : (this.currentBattle.enemies || []).filter(en => en.hp > 0);
    const focusIdx = Number(this.targetFocusIndex || 0);
    const target = pool[focusIdx] || pool[0];
    if (!target) return;
    const targetKey = isAlly ? target.id : (target.enemyIndex !== undefined ? target.enemyIndex : focusIdx);
    this.confirmCombatActionTarget(targetKey);
  }

  // 确认选定目标并执行出招 (支持敌方下标或友方ID)
  confirmCombatActionTarget(targetKey) {
    if (!this.currentBattle || this.currentBattle.status === 'executing') return;
    const pending = this.pendingCombatAction || this.pendingSkillAction || { type: 'skill', targetSide: 'enemy' };
    const { type, skillId, targetSide } = pending;
    this.battleTargetMenuOpen = false;
    this.pendingCombatAction = null;
    this.pendingSkillAction = null;
    if (window.Sound) window.Sound.playBeep();

    if (targetSide === 'ally') {
      const allyId = String(targetKey);
      this.chooseCombatAction(type, skillId, 0, allyId);
    } else {
      const targetIdx = Number(targetKey);
      this.selectedTargetIndex = Number.isFinite(targetIdx) ? targetIdx : 0;
      this.chooseCombatAction(type, skillId, this.selectedTargetIndex);
    }
  }

  // 确认选定技能目标兼容别名
  confirmCombatSkillTarget(targetIdx) {
    this.confirmCombatActionTarget(targetIdx);
  }

  // 取消目标选择并返回对应面板
  cancelCombatTargetSelection() {
    const pending = this.pendingCombatAction || this.pendingSkillAction;
    this.battleTargetMenuOpen = false;
    this.pendingCombatAction = null;
    this.pendingSkillAction = null;
    if (!pending || pending.type === 'skill') {
      this.battleSkillMenuOpen = true;
    } else {
      this.battleSkillMenuOpen = false;
    }
    if (window.Sound) window.Sound.playBeep();
    this.renderBattleInterface();
  }

  selectTarget(idx) {
    if (!this.currentBattle) return;
    this.selectedTargetIndex = idx;
    if (window.Sound) window.Sound.playBeep();
    this.renderBattleInterface();
  }

  selectAlly(allyId) {
    if (!this.currentBattle) return;
    const targetAlly = this.currentBattle.allies.find(a => a.id === allyId);
    if (!targetAlly || targetAlly.hp <= 0) return;
    this.selectedAllyId = allyId;
    this.battleSkillMenuOpen = false;
    if (window.Sound) window.Sound.playBeep();
    this.renderBattleInterface();
  }

  // P3.3: 战时仙宠名册 —— 战斗中查看全部随行仙宠的真实残血、状态、定位与出战位占用
  // (纯展示：出战阵列在开战时确定，本面板不改动战斗状态)
  openBattlePetRosterModal() {
    if (typeof document === 'undefined') return;
    if (!this.currentBattle) return;
    document.querySelectorAll('.battle-pet-roster-overlay').forEach(m => m.remove());

    const maxCombat = this.playerData.getMaxCombatPets();
    const inBattleIds = new Set(
      (this.currentBattle.allies || [])
        .filter(a => a.instanceId)
        .map(a => a.instanceId)
    );
    const pets = this.pets || [];

    const modalHtml = `
      <div class="modal-overlay battle-pet-roster-overlay" onclick="if(event.target===this) this.remove()">
        <div class="modal-window" onclick="event.stopPropagation()" style="max-width:380px;max-height:86vh;display:flex;flex-direction:column;">
          <div class="modal-header">
            <span class="modal-title">🐾 战时仙宠名册 <small>出战 ${inBattleIds.size} / ${maxCombat}</small></span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body" style="overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
            ${pets.length === 0 ? `<div style="text-align:center;color:#887766;padding:18px;">尚无随行仙宠。野外战斗中可尝试【收服】招降异兽。</div>` : ''}
            ${pets.map(pet => {
    const fighting = inBattleIds.has(pet.instanceId);
    const hpPct = pet.maxHp ? Math.max(0, Math.min(100, Math.round(pet.hp / pet.maxHp * 100))) : 0;
    const mpPct = pet.maxMp ? Math.max(0, Math.min(100, Math.round(pet.mp / pet.maxMp * 100))) : 0;
    const lowHp = pet.maxHp && pet.hp / pet.maxHp <= 0.3;
    const roleProfile = window.GAME_DATA.getSpeciesRoleProfile
      ? window.GAME_DATA.getSpeciesRoleProfile(pet.templateId) : null;
    return `
              <div style="background:rgba(25,16,10,0.85);border:1px solid ${fighting ? '#c59b27' : '#3d2c18'};border-radius:6px;padding:6px 8px;${fighting ? '' : 'opacity:0.72;'}">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                  <span style="font-size:11.5px;color:#fef0cd;font-weight:bold;">${pet.name} <span style="color:#a89278;font-weight:normal;">Lv.${pet.level}</span></span>
                  <span style="font-size:9.5px;color:${fighting ? '#2ed573' : '#887766'};border:1px solid ${fighting ? '#2ed573' : '#555'};border-radius:3px;padding:0 4px;">${fighting ? '⚔️ 阵前作战' : '🛡️ 备战待命'}</span>
                </div>
                <div style="display:flex;gap:6px;margin-top:3px;align-items:center;">
                  <div style="flex:1;font-size:9.5px;color:#bbb;">气血 ${pet.hp}/${pet.maxHp}
                    <div style="height:4px;background:#3a2020;border-radius:2px;margin-top:2px;"><div style="height:100%;width:${hpPct}%;border-radius:2px;background:${lowHp ? '#ff6b6b' : '#4caf50'};"></div></div>
                  </div>
                  <div style="flex:1;font-size:9.5px;color:#bbb;">法力 ${pet.mp}/${pet.maxMp}
                    <div style="height:4px;background:#1a2a3a;border-radius:2px;margin-top:2px;"><div style="height:100%;width:${mpPct}%;border-radius:2px;background:#4da6ff;"></div></div>
                  </div>
                </div>
                <div style="display:flex;justify-content:space-between;margin-top:3px;font-size:9.5px;">
                  ${roleProfile ? `<span style="color:#9fd3a8;" title="${roleProfile.desc}">${roleProfile.icon}${roleProfile.tag}</span>` : '<span></span>'}
                  <span style="color:#a89278;">攻${pet.atk} 防${pet.def} 速${pet.spd}${lowHp ? ' <span style="color:#ff6b6b;">⚠气血偏低</span>' : ''}</span>
                </div>
              </div>
            `;
  }).join('')}
            <div style="font-size:9.5px;color:#887766;border-top:1px solid #3d2c18;padding-top:5px;line-height:1.6;">
              出战阵列在开战时确定：战后可在仙宠面板勾选调整出战名单（20/30/40级分别解锁1/2/3位）。战斗中可对残血同伴使用药品回复，也可撤退后再战。
            </div>
          </div>
          <div style="padding:6px 10px;border-top:1px solid #3d2c18;text-align:right;">
            <button class="dialogue-opt-btn" style="padding:3px 14px;font-size:11px;" onclick="this.closest('.modal-overlay').remove()">返回战场</button>
          </div>
        </div>
      </div>
    `;
    const host = document.getElementById('battle-main-container') || document.getElementById('game-viewport') || document.body;
    host.insertAdjacentHTML('beforeend', modalHtml);
    if (window.Sound) window.Sound.playBeep();
  }

  handleHexCombatAction(action) {
    if (!this.currentBattle || this.currentBattle.status === 'executing') return;
    if (window.Sound) window.Sound.playBeep();
    if (action === 'attack') {
      this.initiateCombatAction('attack');
    } else if (action === 'skill') {
      this.toggleSkillMenu(!this.battleSkillMenuOpen);
    } else if (action === 'capture') {
      this.initiateCombatAction('capture');
    } else if (action === 'item') {
      this.initiateCombatAction('item');
    } else if (action === 'pet') {
      this.openBattlePetRosterModal();
    } else if (action === 'flee') {
      this.chooseCombatAction('flee');
    } else if (action === 'defend') {
      this.chooseCombatAction('defend');
    }
  }

  toggleAutoCombat() {
    this.autoCombatEnabled = !this.autoCombatEnabled;
    window.showGameMessage(this.autoCombatEnabled ? '⚔️ 已开启全员自动施法出招！' : '🛑 已解除自动出招', 'info');
    this.renderBattleInterface();
    if (this.autoCombatEnabled && this.currentBattle && this.currentBattle.status !== 'executing') {
      this.executeCombatRound();
    }
  }

  toggleCombatSpeed() {
    this.combatSpeedMultiplier = (this.combatSpeedMultiplier === 2) ? 1 : 2;
    this.setCombatSpeedPref(this.combatSpeedMultiplier);
    window.showGameMessage(`⏩ 战斗演武速度已切换为 ${this.combatSpeedMultiplier}x（已记住，之后战斗沿用）`, 'info');
    this.renderBattleInterface();
  }

  // P5.2 舒适设置：战斗演出速度偏好持久化 (仅影响演出等待，不影响结算与出手顺序)
  getCombatSpeedPref() {
    try {
      const v = parseInt(localStorage.getItem('xiyou_combat_speed_pref'), 10);
      return (v === 2) ? 2 : 1;
    } catch (e) { return 1; }
  }

  setCombatSpeedPref(val) {
    try { localStorage.setItem('xiyou_combat_speed_pref', String(val === 2 ? 2 : 1)); } catch (e) { /* 存储不可用时静默降级 */ }
  }

  // P5.2 舒适设置：低动态效果 (减少震屏与画面抖动，保留全部飘字与状态提示，不影响任何结算)
  isReducedMotionEnabled() {
    try { return localStorage.getItem('xiyou_reduced_motion') === '1'; } catch (e) { return false; }
  }

  setReducedMotion(enabled) {
    try { localStorage.setItem('xiyou_reduced_motion', enabled ? '1' : '0'); } catch (e) { /* 静默降级 */ }
    window.showGameMessage(enabled ? '🌿 已开启低动态效果：减少震屏与抖动，信息提示保持完整' : '✨ 已关闭低动态效果：恢复完整演出动效', 'info');
  }

  // P5.2 舒适设置面板：演出速度两档 + 低动态效果开关 (均为展示层偏好，不触碰数值与存档进度)
  openComfortSettingsModal() {
    if (typeof document === 'undefined') return;
    if (window.Dialogue) window.Dialogue.close();
    document.querySelectorAll('.comfort-settings-overlay').forEach(m => m.remove());
    const speedNow = this.getCombatSpeedPref();
    const motionNow = this.isReducedMotionEnabled();

    const modalHtml = `
      <div class="modal-overlay comfort-settings-overlay" onclick="if(event.target===this) this.remove()">
        <div class="modal-window" onclick="event.stopPropagation()" style="max-width:340px;">
          <div class="modal-header">
            <span class="modal-title">🌿 舒适设置</span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body" style="font-size:11px;color:#fef0cd;line-height:1.7;display:flex;flex-direction:column;gap:10px;">
            <div>
              <div style="color:#ffd700;font-weight:bold;margin-bottom:4px;">⏩ 战斗演出速度</div>
              <div style="display:flex;gap:6px;">
                <button class="dialogue-opt-btn" id="comfort-speed-1" onclick="window.App2D.setComfortSpeed(1)" style="flex:1;${speedNow === 1 ? 'background:#b45309;color:#fff;border-color:#ffd700;' : ''}">正常演出</button>
                <button class="dialogue-opt-btn" id="comfort-speed-2" onclick="window.App2D.setComfortSpeed(2)" style="flex:1;${speedNow === 2 ? 'background:#b45309;color:#fff;border-color:#ffd700;' : ''}">较快 ⏩</button>
              </div>
              <div style="font-size:9.5px;color:#887766;margin-top:3px;">仅改变演出等待快慢，不影响出手顺序、控制时长与任何结算结果。</div>
            </div>
            <div>
              <div style="color:#ffd700;font-weight:bold;margin-bottom:4px;">🌿 低动态效果</div>
              <button class="dialogue-opt-btn" id="comfort-motion-btn" onclick="window.App2D.toggleComfortMotion()" style="width:100%;${motionNow ? 'background:#2e7d32;color:#fff;border-color:#66bb6a;' : ''}">
                ${motionNow ? '已开启：减少震屏、闪白与抖动' : '当前关闭：完整演出动效（点击开启减动效）'}
              </button>
              <div style="font-size:9.5px;color:#887766;margin-top:3px;">伤害飘字、状态提示与全部信息保持完整；适合晕动不适或长时间游玩。</div>
            </div>
            <div style="font-size:9.5px;color:#887766;border-top:1px solid #3d2c18;padding-top:6px;">
              两项设置即时生效并自动记住（本机保存），与存档进度、音效开关互不影响。
            </div>
          </div>
          <div style="padding:6px 10px;border-top:1px solid #3d2c18;text-align:right;">
            <button class="dialogue-opt-btn" style="padding:3px 14px;font-size:11px;" onclick="this.closest('.modal-overlay').remove()">完成</button>
          </div>
        </div>
      </div>
    `;
    const host = document.getElementById('game-viewport') || document.body;
    host.insertAdjacentHTML('beforeend', modalHtml);
    if (window.Sound) window.Sound.playBeep();
  }

  setComfortSpeed(v) {
    this.combatSpeedMultiplier = (v === 2) ? 2 : 1;
    this.setCombatSpeedPref(this.combatSpeedMultiplier);
    if (this.currentBattle) this.renderBattleInterface();
    this.openComfortSettingsModal();
  }

  toggleComfortMotion() {
    this.setReducedMotion(!this.isReducedMotionEnabled());
    this.openComfortSettingsModal();
  }

  // 渲染经典MRP回合战场：顶部双龙金匾、中央全幅模型战场+六边形蜂窝阵、底部自动出招控制
  renderBattleInterface() {
    const layer = document.getElementById('battle-screen-layer');
    if (!layer || !this.currentBattle) return;

    // 智能防御死锁：若无存活敌方或己方全灭，立即执行全功能结案，杜绝卡在空壳战场
    const aliveEnemiesCheck = (typeof this.currentBattle.getAliveEnemies === 'function')
      ? this.currentBattle.getAliveEnemies()
      : (this.currentBattle.enemies || []).filter(e => e.hp > 0);
    const alivePlayerCheck = (this.currentBattle.allies || []).some(a => a.isPlayer && a.hp > 0);
    if (!this.isAnimatingCombat && this.currentBattle.status !== 'executing' && aliveEnemiesCheck.length === 0) {
      this.endBattle('victory');
      return;
    }
    if (!this.isAnimatingCombat && this.currentBattle.status !== 'executing' && !alivePlayerCheck) {
      this.endBattle('defeat');
      return;
    }

    const turnQueue = (this.currentBattle && this.currentBattle.turnQueue) || [];

    // 智能校准选定存活目标，杜绝目标死亡后挂尸打空
    if (!this.currentBattle.enemies[this.selectedTargetIndex] || this.currentBattle.enemies[this.selectedTargetIndex].hp <= 0) {
      const firstAliveIdx = this.currentBattle.enemies.findIndex(e => e.hp > 0);
      this.selectedTargetIndex = firstAliveIdx >= 0 ? firstAliveIdx : 0;
    }
    const curTarget = this.currentBattle.enemies[this.selectedTargetIndex] || this.currentBattle.enemies[0];
    const curAllyId = this.selectedAllyId || 'player';
    const curAlly = this.currentBattle.allies.find(a => a.id === curAllyId) || this.currentBattle.allies[0];
    const skills = curAlly?.isPlayer ? (this.playerData?.getSkills ? this.playerData.getSkills() : (this.playerData?.skills || [])) : (curAlly?.skills || []);

    const getBattleRoleId = (unit) => {
      if (!unit) return 'shaoxia';
      const name = unit.name || '';
      if (unit.isPlayer) {
        return this.playerChar?.appearance || this.playerData?.appearance || 'martial_hero';
      }
      const creature = this.getUnitVisualId(unit);
      if (creature) return creature;
      if (name.includes('大圣') || name.includes('悟空')) return 'sun_wukong';
      if (name.includes('八戒') || name.includes('猪刚鬣')) return 'zhu_bajie';
      if (name.includes('沙僧') || name.includes('悟净')) return 'sha_wujing';
      if (name.includes('龙马') || name.includes('小白龙') || name.includes('敖烈')) return 'xiaobailong';
      if (name.includes('白骨') || name.includes('尸魔')) return 'baigu_jing';
      if (name.includes('黄袍') || name.includes('奎木狼')) return 'huangpao_guai';
      if (name.includes('虎先锋')) return 'hu_xianfeng';
      if (name.includes('黄风')) return 'huangfeng_guai';
      if (name.includes('狼') || name.includes('郊狼')) return 'wolf';
      if (name.includes('混混') || name.includes('恶霸') || name.includes('盗') || name.includes('贼')) return 'hunhun';
      if (name.includes('蚌')) return 'clam';
      if (name.includes('蟹')) return 'crab';
      if (name.includes('虾')) return 'shrimp';
      if (name.includes('熊')) return 'bear';
      if (name.includes('蛇')) return 'snake';
      if (name.includes('狐')) return 'fox';
      if (name.includes('鼠')) return 'rat';
      if (name.includes('猪')) return 'pig';
      if (name.includes('天兵') || name.includes('天将') || name.includes('神将')) return 'heaven_general';
      return 'shaoxia';
    };

    const targetRoleId = getBattleRoleId(curTarget);
    const targetPortraitSvg = window.Portraits ? window.Portraits.getPortraitSvg(targetRoleId, 22) : '🎯';
    const allyRoleId = getBattleRoleId(curAlly);
    const allyPortraitSvg = window.Portraits ? window.Portraits.getPortraitSvg(allyRoleId, 22) : '⚡';
    const playerPortraitSvg = window.Portraits ? window.Portraits.getPortraitSvg(getBattleRoleId({ isPlayer: true }), 22) : '👤';

    layer.innerHTML = `
      <div class="battle-container" id="battle-main-container" style="width:100%;height:100%;background:#0a0c09;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;box-shadow:inset 0 0 35px #000;">

        <!-- 1. 顶部双龙金匾与战术信息横幅 (复刻图3标准并接入精致头像) -->
        <div class="battle-dragon-header-bar">
          <div class="dragon-plaque-container">
            <span class="dragon-crest-icon">🐉</span>
            <div class="dragon-plaque-text">战 斗</div>
            <span class="dragon-crest-icon" style="transform: scaleX(-1);">🐉</span>
          </div>

          <div class="battle-banner-pills-row">
            <div class="battle-banner-pill" title="当前攻击目标" style="display:inline-flex;align-items:center;gap:5px;">
              <span style="display:inline-flex;width:20px;height:20px;border-radius:50%;border:1px solid #ff4757;overflow:hidden;vertical-align:middle;flex-shrink:0;">
                ${targetPortraitSvg}
              </span>
              <span>🎯 目标:</span>
              <span style="color:#ff6b81;font-weight:bold;">${curTarget ? `[Lv.${curTarget.level || 1}] ${curTarget.name}` : '未指定'}</span>
            </div>

            <div class="battle-banner-pill acting-pill" title="当前指令角色与出招倒计时" style="display:inline-flex;align-items:center;gap:5px;">
              <span style="display:inline-flex;width:20px;height:20px;border-radius:50%;border:1px solid #ffd700;overflow:hidden;vertical-align:middle;flex-shrink:0;">
                ${allyPortraitSvg}
              </span>
              <span>⚡ ${curAlly ? `[Lv.${curAlly.level || 1}] ${curAlly.name}` : '侠士'}-出招</span>
              <span id="battle-acting-countdown-text" style="color:#ffd700;font-weight:900;">(${this.battleCountdown || 30})</span>
            </div>

            <div class="battle-banner-pill" title="指挥玩家本尊" style="display:inline-flex;align-items:center;gap:5px;">
              <span style="display:inline-flex;width:20px;height:20px;border-radius:50%;border:1px solid #2ed573;overflow:hidden;vertical-align:middle;flex-shrink:0;">
                ${playerPortraitSvg}
              </span>
              <span>${this.playerData ? `[Lv.${this.playerData.level || 1}] ${this.playerData.name}` : '侠士'}</span>
            </div>

          </div>
        </div>

        <!-- Boss 战术机制与意图预告条 (P1: 银角大王“移山压顶”等机制样板) -->
        ${(this.currentBattle?.getBossIntents?.() || []).map(intent => {
          if (intent.status === 'telegraphed') {
            return `
              <div class="boss-intent-banner" style="margin:2px 10px;padding:3px 10px;background:linear-gradient(90deg, rgba(160,20,20,0.92), rgba(60,10,10,0.92));border:1px solid #ff4757;border-radius:4px;font-size:10.5px;color:#fff;display:flex;align-items:center;justify-content:space-between;box-shadow:0 2px 6px rgba(255,71,87,0.3);">
                <span>⚠️ <strong>${intent.enemyName}</strong> 蓄力【${intent.skillName}】锁定 <strong>${intent.targetName}</strong>！下回合发动重击，防御可减轻60%伤害！</span>
                <span style="color:#ffd700;font-size:9.5px;font-weight:bold;margin-left:6px;flex-shrink:0;">[防御减伤 / 封印定身打断]</span>
              </div>
            `;
          }
          if (intent.status === 'breathing') {
            return `
              <div class="boss-intent-banner" style="margin:2px 10px;padding:2px 10px;background:rgba(20,50,25,0.88);border:1px solid #4ade80;border-radius:4px;font-size:10.5px;color:#a3e635;display:flex;align-items:center;">
                <span>🌿 <strong>${intent.enemyName}</strong> 移山真元耗竭，正在调匀气息，本回合不会施展重法！</span>
              </div>
            `;
          }
          return '';
        }).join('')}

        <!-- 战术时序速度轴 (附带各单位神级微缩头像) -->
        <div class="battle-timeline-bar" style="margin: 3px 10px 1px 10px; padding: 2px 8px; font-size: 10px; border-radius: 4px; display:flex; align-items:center; gap:6px; overflow-x:auto;">
          <span class="timeline-title" style="font-size:10px;flex-shrink:0;">📜 行动序:</span>
          ${turnQueue.map(item => {
      const rId = getBattleRoleId(item.unit || item);
      const pSvg = window.Portraits ? window.Portraits.getPortraitSvg(rId, 16) : '';
      return `
              <div class="timeline-badge ${item.side === 'ally' ? 'timeline-ally' : 'timeline-enemy'}" style="padding: 1px 6px; font-size: 10px; display:inline-flex; align-items:center; gap:4px; flex-shrink:0;">
                <span style="display:inline-block;width:14px;height:14px;border-radius:50%;overflow:hidden;border:1px solid ${item.side === 'ally' ? '#ffd700' : '#ff4757'};">
                  ${pSvg}
                </span>
                <span class="timeline-num">#${item.turnOrder}</span>
                <span class="timeline-name">[Lv.${item.level || 1}] ${item.name}</span>
              </div>
            `;
    }).join('')}
        </div>

        <!-- 动效浮层 (飘字、刀光、雷霆) -->
        <div id="battle-fx-layer" class="battle-fx-layer"></div>

        <!-- 2. 战场主舞台：Canvas模型站立阵列 + 中央六边形蜂窝操作矩阵 -->
        <div class="battle-stage-area" id="battle-stage-area" style="flex:1;position:relative;width:100%;min-height:0;display:flex;align-items:center;justify-content:center;overflow:${this.battleTargetMenuOpen ? 'visible' : 'hidden'};">
          <!-- 战场全景与角色模型 Canvas -->
          <canvas id="battle-scene-canvas"></canvas>

          <!-- 3. 中央：暗红漆金蜂窝六边形按键矩阵 (复刻图3核心按键) 与 绝技选择面板 (常驻DOM，稳定定位) -->
          <div class="battle-honeycomb-menu-container ${this.battleTargetMenuOpen ? 'is-targeting' : ''}" id="battle-honeycomb-menu" style="${this.currentBattle.status === 'executing' ? 'opacity:0.35;pointer-events:none;' : 'opacity:1;pointer-events:auto;'}">
            <!-- 常驻七蜂窝指令矩阵 -->
            <svg viewBox="0 0 148 240" class="hex-btn-cluster" id="battle-hex-svg" style="display:${(this.battleSkillMenuOpen || this.battleTargetMenuOpen) ? 'none' : 'block'};width:142px;height:230px;">
              <defs>
                <linearGradient id="lacquerRedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#b32424" />
                  <stop offset="50%" stop-color="#7a1414" />
                  <stop offset="100%" stop-color="#3d0606" />
                </linearGradient>
                <linearGradient id="lacquerRedHoverGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#d63031" />
                  <stop offset="50%" stop-color="#991b1b" />
                  <stop offset="100%" stop-color="#550c0c" />
                </linearGradient>
              </defs>

              <!-- 左列: 4个六边形 (x: 4) -->
              <!-- 攻击 -->
              <g class="hex-svg-btn" onclick="window.App2D.handleHexCombatAction('attack')" transform="translate(4, 2)">
                <polygon points="28,0 56,16 56,48 28,64 0,48 0,16" class="hex-polygon-bg"/>
                <text x="28" y="27" class="hex-btn-label">攻击</text>
                <text x="28" y="44" class="hex-btn-key">[Space]</text>
              </g>
              <!-- 收服 -->
              <g class="hex-svg-btn" onclick="window.App2D.handleHexCombatAction('capture')" transform="translate(4, 58)">
                <polygon points="28,0 56,16 56,48 28,64 0,48 0,16" class="hex-polygon-bg"/>
                <text x="28" y="27" class="hex-btn-label">收服</text>
                <text x="28" y="44" class="hex-btn-key">[R]</text>
              </g>
              <!-- 仙宠 -->
              <g class="hex-svg-btn" onclick="window.App2D.handleHexCombatAction('pet')" transform="translate(4, 114)">
                <polygon points="28,0 56,16 56,48 28,64 0,48 0,16" class="hex-polygon-bg"/>
                <text x="28" y="27" class="hex-btn-label">仙宠</text>
                <text x="28" y="44" class="hex-btn-key">🐾</text>
              </g>
              <!-- 休息 -->
              <g class="hex-svg-btn" onclick="window.App2D.handleHexCombatAction('defend')" transform="translate(4, 170)">
                <polygon points="28,0 56,16 56,48 28,64 0,48 0,16" class="hex-polygon-bg"/>
                <text x="28" y="27" class="hex-btn-label">休息</text>
                <text x="28" y="44" class="hex-btn-key">[W]</text>
              </g>

              <!-- 右列: 3个六边形 (x: 52, y偏移28) -->
              <!-- 技能 -->
              <g class="hex-svg-btn" onclick="window.App2D.handleHexCombatAction('skill')" transform="translate(52, 30)">
                <polygon points="28,0 56,16 56,48 28,64 0,48 0,16" class="hex-polygon-bg"/>
                <text x="28" y="27" class="hex-btn-label">技能</text>
                <text x="28" y="44" class="hex-btn-key">[Q]</text>
              </g>
              <!-- 物品 -->
              <g class="hex-svg-btn" onclick="window.App2D.handleHexCombatAction('item')" transform="translate(52, 86)">
                <polygon points="28,0 56,16 56,48 28,64 0,48 0,16" class="hex-polygon-bg"/>
                <text x="28" y="27" class="hex-btn-label">物品</text>
                <text x="28" y="44" class="hex-btn-key">[E]</text>
              </g>
              <!-- 逃跑 -->
              <g class="hex-svg-btn" onclick="window.App2D.handleHexCombatAction('flee')" transform="translate(52, 142)">
                <polygon points="28,0 56,16 56,48 28,64 0,48 0,16" class="hex-polygon-bg"/>
                <text x="28" y="27" class="hex-btn-label">逃跑</text>
                <text x="28" y="44" class="hex-btn-key">💨</text>
              </g>
            </svg>

            <!-- 绝技选择面板 (常驻DOM，通过display互斥，不破坏布局，杜绝重叠与重排闪烁) -->
            <div class="battle-skill-popup-panel" id="battle-skill-panel" style="display:${(this.battleSkillMenuOpen && !this.battleTargetMenuOpen) ? 'flex' : 'none'};">
              <div style="font-size:12px;font-weight:bold;color:#ffd700;border-bottom:1px solid #c59b27;padding-bottom:3px;display:flex;justify-content:space-between;align-items:center;">
                <span>✨ 施展门派绝技</span>
                <span style="font-size:10.5px;cursor:pointer;color:#ffd700;" onclick="window.App2D.toggleSkillMenu(false)">✕ 返回指令</span>
              </div>
              ${skills.length === 0 ? `<div style="font-size:10px;color:#888;text-align:center;padding:10px 0;">尚未领悟绝技</div>` : skills.map(sk => {
      const cost = this.getSkillMpCost(sk, curAlly);
      const isShort = curAlly && curAlly.mp < cost;
      return `
                <button class="battle-skill-item-btn" onclick="window.App2D.onSkillButtonClick('${sk.id}')" style="${isShort ? 'opacity:0.8;' : ''}">
                  <div>
                    <div style="color:#ffd700;font-weight:bold;font-size:11.5px;">${sk.icon || '🔥'} ${sk.name}</div>
                    <div style="font-size:9px;color:${isShort ? '#ff6b6b' : '#a8e6cf'};">消耗: ${cost ? `${cost}精力` : '无'}${isShort ? ' (不足)' : ''}</div>
                  </div>
                  <span style="font-size:10px;color:${isShort ? '#ff6b6b' : '#f5cd79'};">出招 ▶</span>
                </button>
              `;
    }).join('')}
              <button class="mrp-vertical-btn" style="padding:4px;font-size:11px;margin-top:2px;" onclick="window.App2D.toggleSkillMenu(false)">◀ 返回指令</button>
            </div>

            <!-- 目标单体选择面板 (先选指令再选目标，严格仅展示HP与MP) -->
            <div class="battle-skill-popup-panel" id="battle-target-panel" style="display:${this.battleTargetMenuOpen ? 'flex' : 'none'};">
              <div style="font-size:12px;font-weight:bold;color:#ffd700;border-bottom:1px solid #c59b27;padding-bottom:3px;display:flex;justify-content:space-between;align-items:center;">
                <span title="${this.pendingCombatAction?.actionName || '出招'}">🎯 选择目标</span>
                <span style="font-size:10.5px;cursor:pointer;color:#ffd700;" onclick="window.App2D.cancelCombatTargetSelection()">✕ 返回</span>
              </div>
              <div class="battle-target-content" style="display:flex;flex-direction:column;gap:5px;overflow-y:auto;padding:3px 0;">
                ${(() => {
        const pending = this.pendingCombatAction || this.pendingSkillAction || { targetSide: 'enemy' };
        const isAlly = (pending.targetSide === 'ally');
        const targets = isAlly
          ? (this.currentBattle.allies || []).filter(a => a.hp > 0)
          : (this.currentBattle.enemies || []).filter(e => e.hp > 0);

        if (targets.length === 0) return '<div style="font-size:10px;color:#aaa;text-align:center;padding:10px 0;">暂无存活可选目标</div>';

        let focusIdx = Number(this.targetFocusIndex || 0);
        if (focusIdx < 0 || focusIdx >= targets.length) focusIdx = 0;
        const focused = targets[focusIdx] || targets[0];
        const hp = Math.max(0, focused.hp);
        const maxHp = Math.max(1, focused.maxHp || focused.hp || 1);
        const hpPct = Math.min(100, Math.round((hp / maxHp) * 100));
        const mp = Math.max(0, focused.mp !== undefined ? focused.mp : 0);
        const maxMp = Math.max(1, focused.maxMp || (focused.mp !== undefined ? focused.mp : 100));
        const mpPct = Math.min(100, Math.round((mp / maxMp) * 100));

        return `
      <!-- 目标切换标签行 (纯文字/数字切换，绝不预先展示全员血蓝) -->
      <div class="target-picker-pills-row">
        ${targets.map((t, idx) => `
          <button class="target-picker-pill ${idx === focusIdx ? 'active' : ''}" onclick="window.App2D.setCombatFocusedTarget(${idx})" title="按数字键 ${idx + 1} 或点击切换">
            ${idx + 1}. ${t.name}
          </button>
        `).join('')}
      </div>

      <!-- 单目标聚焦状态卡片：仅展示当前选定目标的血量与法力，支持自由切换 -->
      <div class="battle-target-item-card is-focused-single ${isAlly ? 'is-ally' : ''}" aria-live="polite">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="color:#ffd700;font-weight:bold;font-size:11px;">[Lv.${focused.level || 1}] ${focused.name}</div>
          <span style="font-size:9.5px;color:#fde047;background:rgba(0,0,0,0.4);padding:1px 5px;border-radius:3px;border:1px solid ${isAlly ? '#2ed573' : '#d63031'};">🎯 当前选定</span>
        </div>
        <div class="battle-target-bar-wrap">
          <span style="color:#ff7675;flex-shrink:0;">气血</span>
          <div class="battle-target-mini-bar">
            <div class="battle-target-mini-fill-hp" style="width:${hpPct}%;"></div>
          </div>
          <span style="color:#ffb8b8;font-size:9px;flex-shrink:0;">${hp}/${maxHp}</span>
        </div>
        <div class="battle-target-bar-wrap">
          <span style="color:#74b9ff;flex-shrink:0;">法力</span>
          <div class="battle-target-mini-bar">
            <div class="battle-target-mini-fill-mp" style="width:${mpPct}%;"></div>
          </div>
          <span style="color:#cce5ff;font-size:9px;flex-shrink:0;">${mp}/${maxMp}</span>
        </div>
      </div>

    `;
      })()}
              </div>
              <button class="battle-target-confirm-btn" onclick="window.App2D.confirmCurrentCombatAction()">⚔️ 确认出招 (Enter / 空格)</button>
              <button class="mrp-vertical-btn" style="padding:4px;font-size:11px;margin-top:2px;" onclick="window.App2D.cancelCombatTargetSelection()">◀ 重新选指令 (Esc)</button>
            </div>
          </div>
        </div>

        <!-- 4. 底部状态与操作控制栏 (复刻图3：开启自动出招、快进设置与区派商世标签) -->
        <div class="battle-bottom-controls-bar">
          <button class="auto-combat-btn ${this.autoCombatEnabled ? 'auto-active' : ''}" onclick="window.App2D.toggleAutoCombat()" title="切换全员自动普攻/绝技出手">
            ⚔️ ${this.autoCombatEnabled ? '正在自动出招...' : '开启自动出招'}
          </button>

          <div style="display:flex;align-items:center;gap:6px;">
            <button class="mrp-chat-tab-btn" onclick="window.App2D.toggleCombatSpeed()" title="切换战斗打击节奏倍速">
              ⏩ ${this.combatSpeedMultiplier || 1}x
            </button>
            <button class="mrp-chat-tab-btn" onclick="window.App2D.openPlayerProfileModal()" title="角色属性">
              ⚙️
            </button>
          </div>

          <div class="mrp-chat-tabs-bar">
            <button class="mrp-chat-tab-btn active">区</button>
            <button class="mrp-chat-tab-btn">派</button>
            <button class="mrp-chat-tab-btn">商</button>
            <button class="mrp-chat-tab-btn">世</button>
          </div>
        </div>

        <!-- 实时战斗日志框 (底部极简滚动条) -->
        <div class="battle-log-box" id="battle-log-box-2d" style="background:rgba(10,8,6,0.92);border-top:1px solid #4a3824;padding:3px 12px;font-size:11px;line-height:1.5;color:#fef0cd;max-height:42px;overflow-y:auto;">
          ${((this.currentBattle && this.currentBattle.logs) || []).slice(-2).map(l => `<div>${l}</div>`).join('')}
        </div>
      </div>
    `;

    // 初始化画布与交互事件
    this.initBattleCanvas();
  }

  // 初始化战场舞台画布
  initBattleCanvas() {
    const canvas = document.getElementById('battle-scene-canvas');
    if (!canvas) return;

    const container = document.getElementById('battle-stage-area');
    if (!container) {
      canvas.width = 640;
      canvas.height = 320;
    } else {
      this.resizeBattleCanvas(canvas);
    }

    canvas.onclick = (e) => {
      if (!this.currentBattle || this.currentBattle.status === 'executing') return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;
      this.handleBattleCanvasClick(clickX, clickY);
    };
  }

  // 舞台随窗口改变，画布同步真实尺寸，避免转屏后人物和技能特效被拉伸。
  resizeBattleCanvas(canvas) {
    const rect = document.getElementById('battle-stage-area')?.getBoundingClientRect?.();
    if (!canvas || !rect || rect.width <= 0 || rect.height <= 0) return;
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    // 重绘指令面板会创建新的 Canvas，不能拿新元素默认的 300×150 缩放旧演出坐标。
    const previousWidth = this.battleCanvasWidth > 0 ? this.battleCanvasWidth : canvas.width;
    const previousHeight = this.battleCanvasHeight > 0 ? this.battleCanvasHeight : canvas.height;
    if (previousWidth !== width || previousHeight !== height) {
      const scaleX = previousWidth > 0 ? width / previousWidth : 1;
      const scaleY = previousHeight > 0 ? height / previousHeight : 1;
      for (const unit of [...(this.currentBattle?.allies || []), ...(this.currentBattle?.enemies || [])]) {
        if (unit._roundBattlePos) {
          unit._roundBattlePos.x *= scaleX;
          unit._roundBattlePos.y *= scaleY;
        }
      }
    }
    this.battleCanvasWidth = width;
    this.battleCanvasHeight = height;
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
  }

  // 点击画布判定选择目标与切换友方
  handleBattleCanvasClick(clickX, clickY) {
    if (!this.currentBattle) return;

    // 左侧区域：指定敌方目标
    if (clickX < this.battleCanvasWidth * 0.42) {
      const enemies = this.currentBattle.enemies;
      let closestIdx = -1;
      let minDis = 99999;
      enemies.forEach((e, idx) => {
        if (e.hp <= 0) return;
        const pos = e._battlePos;
        if (pos) {
          const d = Math.hypot(clickX - pos.x, clickY - pos.y);
          if (d < 65 && d < minDis) {
            minDis = d;
            closestIdx = idx;
          }
        }
      });
      if (closestIdx !== -1) {
        if (this.battleTargetMenuOpen) {
          const pending = this.pendingCombatAction || this.pendingSkillAction;
          if (pending?.targetSide !== 'ally') {
            this.setCombatFocusedTarget(enemies.filter(e => e.hp > 0).indexOf(enemies[closestIdx]));
          }
        } else {
          this.selectTarget(closestIdx);
        }
      }
    }
    // 右侧区域：切换受指派友方角色
    else if (clickX > this.battleCanvasWidth * 0.58) {
      const allies = this.currentBattle.allies;
      let closestAlly = null;
      let minDis = 99999;
      allies.forEach(a => {
        if (a.hp <= 0) return;
        const pos = a._battlePos;
        if (pos) {
          const d = Math.hypot(clickX - pos.x, clickY - pos.y);
          if (d < 65 && d < minDis) {
            minDis = d;
            closestAlly = a;
          }
        }
      });
      if (closestAlly) {
        if (this.battleTargetMenuOpen) {
          const pending = this.pendingCombatAction || this.pendingSkillAction;
          if (pending?.targetSide === 'ally') {
            this.setCombatFocusedTarget(allies.filter(a => a.hp > 0).indexOf(closestAlly));
          }
        } else {
          this.selectAlly(closestAlly.id);
        }
      }
    }
  }

  // 绘制战场Canvas全景：草地绿茵、动态自适应居中站位、极速冲锋滑步与大号令旗血条
  renderBattleCanvasFrame() {
    const canvas = document.getElementById('battle-scene-canvas');
    if (!canvas || !this.currentBattle) return;
    this.resizeBattleCanvas(canvas);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    this.battleCanvasWidth = width;
    this.battleCanvasHeight = height;

    ctx.clearRect(0, 0, width, height);

    // 1. 绘制草地/仙境自然战场背景 (复刻图3：绿茵草地与远景光影)
    const groundGrad = ctx.createLinearGradient(0, 0, 0, height);
    groundGrad.addColorStop(0, '#557c2c');
    groundGrad.addColorStop(0.3, '#436820');
    groundGrad.addColorStop(0.7, '#345217');
    groundGrad.addColorStop(1, '#1e320d');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, 0, width, height);

    // 自然草地碎斑质感
    ctx.fillStyle = 'rgba(92, 138, 48, 0.35)';
    for (let i = 12; i < width; i += 28) {
      const py = ((i * 19) % (height - 35)) + 15;
      ctx.fillRect(i, py, 14, 4.5);
    }

    // 柔和圣境天光
    const radial = ctx.createRadialGradient(width * 0.5, -20, 30, width * 0.5, height * 0.5, width * 0.7);
    radial.addColorStop(0, 'rgba(255, 255, 225, 0.16)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    // 1.5 绘制正在生效的法术全景战场环境与全屏特效背景 (舍生取义暗黑虚空、雷霆万钧暴风夜空与天雷、飞沙走石狂风树林等)
    this.renderBattleBackdropEffects(ctx, width, height);

    const animTimer = Date.now() / 150;

    // 2. 左侧：敌方阵容 (动态自适应居中排列：1人居中50%，2人居中38%与64%)
    const enemies = this.currentBattle.enemies;
    const trueAliveEnemies = enemies.filter(e => e.hp > 0);
    const trueAliveAllies = this.currentBattle.allies.filter(a => a.isPlayer && a.hp > 0);

    // 每一帧防死锁判定：非交锋状态下，若全部敌方已阵亡立即退出结算胜利；若己方全灭立即退出结算战败
    if (!this.isAnimatingCombat && this.currentBattle.status !== 'executing') {
      if (trueAliveEnemies.length === 0) {
        this.endBattle('victory');
        return;
      }
      if (!trueAliveAllies.length) {
        this.endBattle('defeat');
        return;
      }
    }

    const aliveEnemies = enemies.filter(e => e.hp > 0 || (e._displayHp !== undefined && e._displayHp > 0) || (e._defeatUntil && e._defeatUntil > Date.now()));
    const enemyX = Math.floor(width * 0.18);

    aliveEnemies.forEach((e, idx) => {
      let ey;
      if (aliveEnemies.length === 1) {
        ey = Math.floor(height * 0.50); // 1人正中央
      } else if (aliveEnemies.length === 2) {
        ey = Math.floor(height * (idx === 0 ? 0.38 : 0.64)); // 2人居中
      } else if (aliveEnemies.length === 3) {
        ey = Math.floor(height * (0.28 + idx * 0.22));
      } else {
        ey = Math.floor(height * (0.18 + idx * 0.20));
      }

      if (e._roundBattlePos && !isNaN(e._roundBattlePos.y)) ey = e._roundBattlePos.y;
      e._baseBattlePos = { x: enemyX, y: ey };
      const dX = (e._dashOffset && !isNaN(e._dashOffset.x)) ? e._dashOffset.x : 0;
      const dY = (e._dashOffset && !isNaN(e._dashOffset.y)) ? e._dashOffset.y : 0;
      const sX = (e._shakeOffset && !isNaN(e._shakeOffset.x)) ? e._shakeOffset.x : 0;
      const sY = (e._shakeOffset && !isNaN(e._shakeOffset.y)) ? e._shakeOffset.y : 0;
      const rawX = enemyX + dX + sX;
      const rawY = ey + dY + sY;
      const renderX = Math.max(30, Math.min(width - 30, isNaN(rawX) ? enemyX : rawX));
      const renderY = Math.max(30, Math.min(height - 30, isNaN(rawY) ? ey : rawY));
      e._battlePos = { x: renderX, y: renderY };
      this.renderBattleUnitStatus(ctx, e, renderX, renderY);

      const isTargeted = this.selectedTargetIndex === e.enemyIndex;

      // 若被锁定为攻击目标，脚底绘制赤金锁定法阵光环
      if (isTargeted) {
        ctx.save();
        const pulse = Math.sin(animTimer * 0.25) * 2.5;
        ctx.strokeStyle = '#ff4757';
        ctx.lineWidth = 2.4;
        ctx.shadowColor = '#ff4757';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.ellipse(renderX, renderY + 14, 25 + pulse, 10 + pulse * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(renderX, renderY + 14, 16, 7, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 处于目标选择阶段时，为所有存活敌方头顶绘制醒目点选提示
      if (this.battleTargetMenuOpen) {
        ctx.save();
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ff4757';
        ctx.shadowBlur = 6;
        ctx.fillText('🎯 点选锁定', renderX, renderY - 38);
        ctx.restore();
      }

      // 敌方全身模型派发：优先继承野外实体的原生 appearance / modelId / templateId，绝不粗暴篡改！
      let mId = e.appearance || e.modelId || e.templateId || '';
      if (e.templateId && window.GAME_DATA?.PETS?.[e.templateId]) mId = this.getUnitVisualId(e);

      // 仅在未配置外观或外观模糊时，才做精确推断，且严格区分齐天大圣与普通猴精、天蓬大将与凡间猪八戒、巨灵神与天兵
      if (!mId || mId === 'default' || mId === 'undefined') {
        const n = e.name || '';
        if (n.includes('混混') || n.includes('恶霸') || n.includes('地痞')) mId = 'hooligan';
        else if (n.includes('蚌')) mId = 'clam';
        else if (n.includes('蟹')) mId = 'crab';
        else if (n.includes('虾')) mId = 'shrimp';
        else if (n.includes('黄风') || n.includes('huangfeng')) mId = 'huangfeng_guai';
        else if (n.includes('狼') || n.includes('huangpao')) mId = 'wild_wolf';
        else if (n.includes('虎') || n.includes('huxianfeng')) mId = 'hu_xianfeng';
        else if (n.includes('蛇')) mId = 'pet_snake';
        else if (n.includes('骨') || n.includes('骷髅')) mId = 'baigu_jing';
        else if (n.includes('天蓬') && !n.includes('八戒') && !n.includes('猪')) mId = 'tianpeng_marshal';
        else if (n.includes('巨灵神')) mId = 'juling_shen';
        else if (n.includes('赤毛') || n.includes('马猴')) mId = 'chimao_mahou';
        else if (n.includes('小石猴') || n.includes('小猴') || n.includes('通臂')) mId = 'stone_monkey';
        else if (n.includes('悟空') || n.includes('齐天大圣') || n.includes('美猴王')) mId = 'sun_wukong';
        else if (n.includes('八戒') || n.includes('猪刚鬣')) mId = 'zhu_bajie';
        else if (n.includes('夜叉')) mId = 'yecha';
        else if (n.includes('树精') || n.includes('枯树')) mId = 'tree';
        else if (n.includes('狐') || n.includes('灵狐') || n.includes('野狐')) mId = 'fox';
        else if (n.includes('鼠')) mId = 'giant_rat';
        else if (n.includes('龟')) mId = 'turtle';
        else if (n.includes('沙') || n.includes('卷帘')) mId = 'sha_wujing';
        else if (n.includes('小白龙') || n.includes('敖烈')) mId = 'xiaobailong';
        else if (n.includes('龙') || n.includes('龙王')) mId = 'longwang';
        else if (n.includes('熊')) mId = 'bear';
        else if (n.includes('牛魔王')) mId = 'bull_demon';
        else if (n.includes('铁扇')) mId = 'tieshan';
        else if (n.includes('天神') || n.includes('天将') || n.includes('天兵')) mId = 'heaven_general';
        else mId = (window.Character ? window.Character.inferMonsterType(n, e.id) : 'hooligan');
      }

      // 绘制冲锋残影拖尾 (Ghost Trail)
      if (e._ghosts && e._ghosts.length > 0 && window.CharacterRenderer) {
        e._ghosts.forEach(g => {
          ctx.save();
          ctx.globalAlpha = g.alpha || 0.3;
          window.CharacterRenderer.drawModel(ctx, g.x, g.y, mId, {
            direction: 'right',
            scale: 1.35,
            animTimer: animTimer + idx,
            isActing: false
          });
          ctx.restore();
        });
      }

      ctx.save();
      if (e._dashTilt) {
        ctx.translate(renderX, renderY);
        ctx.rotate(e._dashTilt);
        ctx.translate(-renderX, -renderY);
      }
      if (window.CharacterRenderer) {
        window.CharacterRenderer.drawModel(ctx, renderX, renderY, mId, {
          direction: 'right',
          scale: 1.35,
          animTimer: animTimer + idx,
          isActing: false
        });
      }
      ctx.restore();

      // 头顶醒目姓名 (粗白字 + 纯黑描边，附带等级显示)
      const enemyDisplayName = `[Lv.${e.level || 1}] ${e.name}`;
      ctx.save();
      ctx.font = `bold ${width < 560 ? 10 : 13}px "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3.5;
      ctx.lineJoin = 'round';
      ctx.strokeText(enemyDisplayName, renderX, renderY - 30, Math.min(160, width * 0.3));
      ctx.fillStyle = isTargeted ? '#ff4757' : (e.isBoss ? '#ffd700' : '#ffffff');
      ctx.fillText(enemyDisplayName, renderX, renderY - 30, Math.min(160, width * 0.3));

      // 头顶锁定小红箭头指示
      if (isTargeted) {
        const arrowY = renderY - 48 + Math.sin(Date.now() / 150) * 3.5;
        ctx.fillStyle = '#ff4757';
        ctx.beginPath();
        ctx.moveTo(renderX, arrowY);
        ctx.lineTo(renderX - 6, arrowY - 9);
        ctx.lineTo(renderX + 6, arrowY - 9);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 脚底大号立体水晶生命条 (加宽到 68px, 高度 9px, 彻底清晰明了)
      const barW = 68;
      const barH = 9;
      const barX = renderX - barW / 2;
      const barY = renderY + 22;
      const hpPct = Math.max(0, Math.min(1, (e._displayHp ?? e.hp) / e.maxHp));

      // 底槽
      ctx.fillStyle = 'rgba(10, 8, 6, 0.9)';
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 2);
      ctx.fill();
      ctx.strokeStyle = '#5a3c22';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 鲜红生命充填 (渐变色)
      if (hpPct > 0) {
        const hpGrad = ctx.createLinearGradient(barX, barY, barX, barY + barH);
        hpGrad.addColorStop(0, '#f87171');
        hpGrad.addColorStop(0.5, '#ef4444');
        hpGrad.addColorStop(1, '#991b1b');
        ctx.fillStyle = hpGrad;
        ctx.beginPath();
        ctx.roundRect(barX + 0.5, barY + 0.5, (barW - 1) * hpPct, barH - 1, 1.5);
        ctx.fill();
        // 上层微光高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(barX + 1, barY + 1, (barW - 2) * hpPct, 2);
      }

      // 醒目大号速度时序令旗 (直径 22px 发光令旗勋章，bold 12px 大字清晰展示出招顺位)
      if (e.turnOrder) {
        const badgeX = barX - 16;
        const badgeY = barY + 4;
        ctx.save();
        ctx.fillStyle = '#b91c1c';
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 6;
        ctx.stroke();

        ctx.font = 'bold 12px "Microsoft YaHei", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText('#' + e.turnOrder, badgeX, badgeY + 0.5);
        ctx.restore();
      }
      ctx.restore();
    });

    // 3. 右侧：我方阵容 (动态自适应居中：1人居中50%，2人居中38%与64%，彻底消除任何锁槽位)
    const aliveAllies = this.currentBattle.allies.filter(a => a.hp > 0 || (a._displayHp !== undefined && a._displayHp > 0) || (a._defeatUntil && a._defeatUntil > Date.now()));
    const allyX = Math.floor(width * 0.82);

    aliveAllies.forEach((ally, idx) => {
      let ay;
      if (aliveAllies.length === 1) {
        ay = Math.floor(height * 0.50); // 1个人直接站右侧正中央！
      } else if (aliveAllies.length === 2) {
        ay = Math.floor(height * (idx === 0 ? 0.38 : 0.64)); // 2个人站2、3位置中央！
      } else if (aliveAllies.length === 3) {
        ay = Math.floor(height * (0.28 + idx * 0.22));
      } else {
        ay = Math.floor(height * (0.18 + idx * 0.20));
      }

      if (ally._roundBattlePos && !isNaN(ally._roundBattlePos.y)) ay = ally._roundBattlePos.y;
      ally._baseBattlePos = { x: allyX, y: ay };
      const dX = (ally._dashOffset && !isNaN(ally._dashOffset.x)) ? ally._dashOffset.x : 0;
      const dY = (ally._dashOffset && !isNaN(ally._dashOffset.y)) ? ally._dashOffset.y : 0;
      const sX = (ally._shakeOffset && !isNaN(ally._shakeOffset.x)) ? ally._shakeOffset.x : 0;
      const sY = (ally._shakeOffset && !isNaN(ally._shakeOffset.y)) ? ally._shakeOffset.y : 0;
      const rawX = allyX + dX + sX;
      const rawY = ay + dY + sY;
      const renderX = Math.max(30, Math.min(width - 30, isNaN(rawX) ? allyX : rawX));
      const renderY = Math.max(30, Math.min(height - 30, isNaN(rawY) ? ay : rawY));
      ally._battlePos = { x: renderX, y: renderY };
      this.renderBattleUnitStatus(ctx, ally, renderX, renderY);

      const isPlayerSlot = ally.isPlayer;
      const isActing = (this.selectedAllyId === ally.id);

      // 若为当前出招者：先在底层绘制通天神圣金黄光柱！(复刻图3震撼效果)
      if (isActing && window.CharacterRenderer) {
        window.CharacterRenderer.drawActingLightPillar(ctx, renderX, renderY, 62, 110);
      }

      // 确定角色模型 (国风大侠、熊猫道长、白龙马神将、大圣等)
      let mId = ally.modelId || ally.appearance || '';
      if (isPlayerSlot) {
        if (this.playerChar && this.playerChar.appearance) {
          mId = this.playerChar.appearance;
        } else if (ally.name.includes('熊猫') || (this.playerData && this.playerData.name.includes('熊猫'))) {
          mId = 'panda_hero';
        } else {
          mId = 'martial_hero';
        }
      } else {
        const species = this.getUnitVisualId(ally);
        if (ally.templateId || ally.entity?.templateId) mId = species;
        else if (ally.name.includes('悟空') || ally.roleId === 'sun_wukong') mId = 'sun_wukong';
        else if (ally.name.includes('八戒') || ally.name.includes('猪刚鬣') || ally.roleId === 'zhu_bajie') mId = 'zhu_bajie';
        else if (ally.name.includes('悟净') || ally.name.includes('沙僧') || ally.roleId === 'sha_wujing') mId = 'sha_wujing';
        else if (window.CreatureArt?.ids.has(species)) mId = species;
        else if (ally.name.includes('铁扇') || ally.roleId === 'tieshan' || mId.includes('tieshan')) mId = 'tieshan';
        else if (ally.name.includes('蛇') || ally.roleId === 'pet_snake' || mId.includes('she')) mId = 'pet_snake';
        else if (ally.name.includes('龟') || mId.includes('gui')) mId = 'turtle';
        else mId = mId || 'tieshan';
      }

      // 绘制冲锋残影拖尾 (Ghost Trail)
      if (ally._ghosts && ally._ghosts.length > 0 && window.CharacterRenderer) {
        ally._ghosts.forEach(g => {
          ctx.save();
          ctx.globalAlpha = g.alpha || 0.3;
          window.CharacterRenderer.drawModel(ctx, g.x, g.y, mId, {
            direction: 'left',
            scale: 1.35,
            animTimer: animTimer + 2,
            isActing: false
          });
          ctx.restore();
        });
      }

      ctx.save();
      if (ally._dashTilt) {
        ctx.translate(renderX, renderY);
        ctx.rotate(ally._dashTilt);
        ctx.translate(-renderX, -renderY);
      }
      if (window.CharacterRenderer) {
        window.CharacterRenderer.drawModel(ctx, renderX, renderY, mId, {
          direction: 'left',
          scale: 1.35,
          animTimer: animTimer + 2,
          isActing: isActing
        });
      }
      ctx.restore();

      // 头顶清晰姓名 (加粗白色 + 黑色描边，附带等级显示)
      const allyDisplayName = `[Lv.${ally.level || 1}] ${ally.name}`;
      ctx.save();
      ctx.font = `bold ${width < 560 ? 10 : 12.5}px "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3.5;
      ctx.lineJoin = 'round';
      ctx.strokeText(allyDisplayName, renderX, renderY - 28, Math.min(160, width * 0.3));
      ctx.fillStyle = isActing ? '#fffa65' : (isPlayerSlot ? '#ffeaa7' : '#f5cd79');
      ctx.fillText(allyDisplayName, renderX, renderY - 28, Math.min(160, width * 0.3));

      // 脚底大号立体水晶生命/精力槽 (宽度68px, 高度9px)
      const barW = 68;
      const barH = 9;
      const barX = renderX - barW / 2;
      const barY = renderY + 20;
      const hpPct = Math.max(0, Math.min(1, (ally._displayHp ?? ally.hp) / ally.maxHp));

      // 生命底槽
      ctx.fillStyle = 'rgba(10, 8, 6, 0.9)';
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 2);
      ctx.fill();
      ctx.strokeStyle = '#5a3c22';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 翠绿生命充填 (高质感水晶条)
      if (hpPct > 0) {
        const hpGrad = ctx.createLinearGradient(barX, barY, barX, barY + barH);
        hpGrad.addColorStop(0, '#4ade80');
        hpGrad.addColorStop(0.5, '#22c55e');
        hpGrad.addColorStop(1, '#15803d');
        ctx.fillStyle = hpGrad;
        ctx.beginPath();
        ctx.roundRect(barX + 0.5, barY + 0.5, (barW - 1) * hpPct, barH - 1, 1.5);
        ctx.fill();
        // 上层微光高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(barX + 1, barY + 1, (barW - 2) * hpPct, 2);
      }

      // 精力条 (高度 4.5px)
      if (ally.maxMp) {
        const mpPct = Math.max(0, Math.min(1, ally.mp / ally.maxMp));
        const mpY = barY + 10.5;
        ctx.fillStyle = 'rgba(10, 8, 6, 0.9)';
        ctx.beginPath();
        ctx.roundRect(barX, mpY, barW, 4.5, 1);
        ctx.fill();
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        if (mpPct > 0) {
          const mpGrad = ctx.createLinearGradient(barX, mpY, barX, mpY + 4.5);
          mpGrad.addColorStop(0, '#38bdf8');
          mpGrad.addColorStop(1, '#0284c7');
          ctx.fillStyle = mpGrad;
          ctx.fillRect(barX + 0.5, mpY + 0.5, (barW - 1) * mpPct, 3.5);
        }
      }

      // 醒目大号速度时序令旗 (直径 22px 发光令旗勋章，bold 12px 大字)
      if (ally.turnOrder) {
        const badgeX = barX + barW + 16;
        const badgeY = barY + 4;
        ctx.save();
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 6;
        ctx.stroke();

        ctx.font = 'bold 12px "Microsoft YaHei", sans-serif';
        ctx.fillStyle = '#ffd700';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText('#' + ally.turnOrder, badgeX, badgeY + 0.5);
        ctx.restore();
      }

      ctx.restore();
    });

    // 4. 绘制上层法术技能与刀光特效队列 (烈火炎柱、天雷霹雳、玄冰突刺、金刚护盾等)
    this.renderBattleCanvasEffects(ctx);
    if (this.currentBattle.status === 'executing' && this.battleCastCue && this.battleCastCue.until > Date.now()) {
      ctx.save();
      ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(20, 14, 24, 0.86)';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 110, 8, 220, 28, 8);
      ctx.fill();
      ctx.fillStyle = '#f8df9c';
      ctx.fillText(this.battleCastCue.text, width / 2, 27, 208);
      ctx.restore();
    } else if (this.currentBattle.status !== 'executing') {
      this.battleCastCue = null;
    }
  }

  // 渲染正在生效的战斗全屏与环境背景特效 (舍生取义暗黑虚空、雷霆万钧暴风夜空与天雷、飞沙走石狂风撕碎树林古木等)
  renderBattleBackdropEffects(ctx, width, height) {
    if (!this.activeBattleEffects || this.activeBattleEffects.length === 0) return;
    const now = Date.now();

    this.activeBattleEffects.forEach(fx => {
      if (fx.localOnly) return;
      const elapsed = now - fx.startTime;
      if (elapsed > fx.duration) return;
      const progress = elapsed / fx.duration;

      ctx.save();

      // 1. 舍生取义：背景变黑，并呈现横向能量光束 -> 突然缩小成射线
      if (fx.type === 'sacrifice') {
        const fade = Math.min(1, Math.sin(progress * Math.PI) * 1.35);
        ctx.fillStyle = `rgba(5, 4, 12, ${0.88 * fade})`;
        ctx.fillRect(0, 0, width, height);

        // 虚空粒子尘埃微粒
        ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
        for (let i = 0; i < 12; i++) {
          const px = ((i * 73 + progress * width * 0.8) % width);
          const py = ((i * 47) % height);
          ctx.fillRect(px, py, 2, 2);
        }

        const beamY = fx.beamY || (height * 0.5);
        // 阶段：横向有一道光束 -> 突然缩小成一道射线
        if (fx.phase ? fx.phase === 'beam_wide' : progress < 0.25) {
          // 横向宽幅能量光束 (宽 52px，白金与赤红流光交织)
          const beamH = 52 * (0.8 + Math.sin(progress * 20) * 0.2);
          const grad = ctx.createLinearGradient(0, beamY - beamH / 2, 0, beamY + beamH / 2);
          grad.addColorStop(0, 'rgba(255, 60, 80, 0)');
          grad.addColorStop(0.25, 'rgba(255, 80, 100, 0.8)');
          grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.98)');
          grad.addColorStop(0.75, 'rgba(255, 180, 50, 0.8)');
          grad.addColorStop(1, 'rgba(255, 60, 80, 0)');
          ctx.fillStyle = grad;
          ctx.shadowColor = '#ff304a';
          ctx.shadowBlur = 24;
          ctx.fillRect(0, beamY - beamH / 2, width, beamH);
        } else if (fx.phase ? ['ray_collapse', 'ray_dash'].includes(fx.phase) : progress < 0.55) {
          // 突然缩小成一道高能炽烈极细激光射线 (高度仅 3px，但散发耀眼爆鸣强光)
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3.5;
          ctx.shadowColor = '#ff2b4f';
          ctx.shadowBlur = 22;
          ctx.beginPath();
          ctx.moveTo(0, beamY);
          ctx.lineTo(width, beamY);
          ctx.stroke();

          // 核心光核脉冲
          ctx.strokeStyle = 'rgba(255, 240, 150, 0.9)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, beamY);
          ctx.lineTo(width, beamY);
          ctx.stroke();
        }
      }
      // 2. 雷霆万钧：背景变黑，夜幕雷暴云翻涌，远景闪电天光映照
      else if (fx.type === 'thunder') {
        const fade = Math.min(1, Math.sin(progress * Math.PI) * 1.35);
        ctx.fillStyle = `rgba(6, 9, 24, ${0.92 * fade})`;
        ctx.fillRect(0, 0, width, height);

        // 苍穹翻滚的墨黑劫云与电芒反光
        const cloudGrad = ctx.createLinearGradient(0, 0, 0, height * 0.4);
        cloudGrad.addColorStop(0, 'rgba(20, 24, 52, 0.95)');
        cloudGrad.addColorStop(0.7, 'rgba(15, 18, 40, 0.85)');
        cloudGrad.addColorStop(1, 'rgba(6, 9, 24, 0)');
        ctx.fillStyle = cloudGrad;
        ctx.fillRect(0, 0, width, height * 0.4);

        // 劫云电闪微光闪烁
        if (Math.sin(progress * 28) > 0.4) {
          ctx.fillStyle = 'rgba(192, 132, 252, 0.18)';
          ctx.fillRect(0, 0, width, height * 0.35);
        }
      }
      // 3. 飞沙走石：背景有一堆古木树林，突然狂风大作把树叶全刮砍没了，树木化为光秃残枝！
      else if (fx.type === 'sand') {
        const treeXList = [width * 0.10, width * 0.28, width * 0.48, width * 0.70, width * 0.90];
        const treeBaseY = height * 0.68;
        const isWindActive = progress >= 0.28;
        const leafRatio = progress < 0.28 ? 1 : Math.max(0, 1 - (progress - 0.28) / 0.34);

        // 绘制古木主干与分叉枝丫 (即使叶子被刮没了，枝干依然在狂风中剧烈晃动)
        treeXList.forEach((tx, tIdx) => {
          const trunkW = 11;
          const trunkH = 55;
          const windSway = isWindActive ? Math.sin((progress * 30) + tIdx) * (6 * (1 - leafRatio + 0.3)) : 0;

          // 树干深褐色木质纹理
          ctx.fillStyle = '#3e2415';
          ctx.beginPath();
          ctx.moveTo(tx - trunkW / 2, treeBaseY);
          ctx.lineTo(tx - trunkW * 0.35 + windSway * 0.5, treeBaseY - trunkH);
          ctx.lineTo(tx + trunkW * 0.35 + windSway * 0.5, treeBaseY - trunkH);
          ctx.lineTo(tx + trunkW / 2, treeBaseY);
          ctx.closePath();
          ctx.fill();

          // 苍劲分叉树枝
          ctx.strokeStyle = '#2d180c';
          ctx.lineWidth = 3.2;
          ctx.lineCap = 'round';
          // 左大枝
          ctx.beginPath();
          ctx.moveTo(tx + windSway * 0.5, treeBaseY - trunkH * 0.7);
          ctx.quadraticCurveTo(tx - 18 + windSway, treeBaseY - trunkH * 1.05, tx - 28 + windSway * 1.2, treeBaseY - trunkH * 1.2);
          ctx.stroke();
          // 右大枝
          ctx.beginPath();
          ctx.moveTo(tx + windSway * 0.5, treeBaseY - trunkH * 0.8);
          ctx.quadraticCurveTo(tx + 16 + windSway, treeBaseY - trunkH * 1.1, tx + 26 + windSway * 1.2, treeBaseY - trunkH * 1.25);
          ctx.stroke();
          // 顶梢直枝
          ctx.beginPath();
          ctx.moveTo(tx + windSway * 0.5, treeBaseY - trunkH);
          ctx.lineTo(tx + windSway * 1.3, treeBaseY - trunkH * 1.38);
          ctx.stroke();

          // 树叶树冠团簇 (随着风暴推进，树叶急剧减小、被狂风剥落并彻底消失)
          if (leafRatio > 0.02) {
            const leafClusters = [
              { ox: -22, oy: -trunkH * 1.15, rx: 18, ry: 13, color: '#2e7d32' },
              { ox: 20, oy: -trunkH * 1.2, rx: 17, ry: 12, color: '#388e3c' },
              { ox: 0, oy: -trunkH * 1.35, rx: 22, ry: 16, color: '#43a047' },
              { ox: -10, oy: -trunkH * 0.95, rx: 14, ry: 10, color: '#f59e0b' }
            ];

            leafClusters.forEach(c => {
              ctx.save();
              ctx.fillStyle = c.color;
              ctx.beginPath();
              ctx.ellipse(
                tx + c.ox + windSway,
                treeBaseY + c.oy,
                Math.max(0.1, c.rx * leafRatio),
                Math.max(0.1, c.ry * leafRatio),
                0.2, 0, Math.PI * 2
              );
              ctx.fill();
              ctx.restore();
            });
          }
        });

        // 狂暴风刃呼啸切过，漫天飞舞被刮飞撕碎的落叶！
        if (isWindActive) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 2.2;
          ctx.shadowColor = '#eab308';
          ctx.shadowBlur = 10;
          for (let w = 0; w < 4; w++) {
            const wy = height * (0.35 + w * 0.12);
            const wx = ((progress - 0.28) * 2.8 * width) - (w * 80);
            ctx.beginPath();
            ctx.moveTo(wx - 120, wy + (w % 2 ? 8 : -8));
            ctx.lineTo(wx, wy);
            ctx.stroke();
          }

          // 被狂风从树上刮砍拔掉、在半空中急速飞掠旋转的无数碎叶
          const flyingLeafCount = 36;
          for (let l = 0; l < flyingLeafCount; l++) {
            const baseTreeIdx = l % treeXList.length;
            const startTreeX = treeXList[baseTreeIdx];
            const leafSpeed = 1.3 + (l % 5) * 0.25;
            const lx = startTreeX + (progress - 0.28) * width * leafSpeed;
            const ly = treeBaseY - 60 + Math.sin(progress * 14 + l) * 26 + (l % 7) * 7;
            const lRot = progress * 15 + l;

            ctx.save();
            ctx.translate(lx, ly);
            ctx.rotate(lRot);
            ctx.fillStyle = (l % 3 === 0) ? '#eab308' : ((l % 3 === 1) ? '#22c55e' : '#15803d');
            ctx.beginPath();
            ctx.ellipse(0, 0, 5, 2.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }
      // 4. 如来神掌：九霄金顶佛光云海与大日金轮
      else if (fx.type === 'palm') {
        const fade = Math.min(1, Math.sin(progress * Math.PI) * 1.2);
        const skyGrad = ctx.createRadialGradient(width * 0.5, height * 0.2, 20, width * 0.5, height * 0.2, width * 0.7);
        skyGrad.addColorStop(0, `rgba(254, 240, 138, ${0.45 * fade})`);
        skyGrad.addColorStop(0.5, `rgba(245, 158, 11, ${0.28 * fade})`);
        skyGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.translate(width * 0.5, height * 0.22);
        ctx.rotate(progress * 1.5);
        ctx.strokeStyle = `rgba(253, 224, 71, ${0.65 * fade})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 48, 0, Math.PI * 2);
        ctx.stroke();
        for (let s = 0; s < 8; s++) {
          const ang = (s * Math.PI) / 4;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(ang) * 48, Math.sin(ang) * 48);
          ctx.stroke();
        }
        ctx.restore();
      }
      // 5. 三昧真火：地底烈焰熔岩裂隙与焦土地热
      else if (fx.type === 'fire') {
        const fade = Math.min(1, Math.sin(progress * Math.PI) * 1.2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${0.85 * fade})`;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 12;
        for (let cr = -2; cr <= 2; cr++) {
          const cx = fx.x + cr * 32;
          ctx.beginPath();
          ctx.moveTo(cx, fx.y + 12);
          ctx.lineTo(cx + (cr % 2 ? 14 : -14), fx.y + 24);
          ctx.lineTo(cx + (cr % 2 ? -8 : 10), fx.y + 36);
          ctx.stroke();
        }
      }
      // 6. 佛光普照：天界破晓降下万道金光
      else if (fx.type === 'buddha') {
        const fade = Math.min(1, Math.sin(progress * Math.PI) * 1.2);
        for (let ray = -3; ray <= 3; ray++) {
          const rx = fx.x + ray * 45;
          const rGrad = ctx.createLinearGradient(rx, 0, rx, height);
          rGrad.addColorStop(0, `rgba(254, 240, 138, ${0.4 * fade})`);
          rGrad.addColorStop(0.6, `rgba(250, 204, 21, ${0.15 * fade})`);
          rGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = rGrad;
          ctx.fillRect(rx - 15, 0, 30, height);
        }
      }
      // 7. 金刚护体：地面太极八卦金盘阵法
      else if (fx.type === 'shield' || fx.type === 'gold') {
        const fade = Math.min(1, Math.sin(progress * Math.PI) * 1.2);
        ctx.save();
        ctx.translate(fx.x, fx.y + 14);
        ctx.scale(1, 0.45);
        ctx.rotate(progress * 2.2);
        ctx.strokeStyle = `rgba(250, 204, 21, ${0.75 * fade})`;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(0, 0, 38, 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * 32, Math.sin(a) * 32);
          ctx.lineTo(Math.cos(a) * 38, Math.sin(a) * 38);
          ctx.stroke();
        }
        ctx.restore();
      }
      // 8. 玄冰刺：地面极寒九幽冰霜之印
      else if (fx.type === 'ice') {
        const fade = Math.min(1, Math.sin(progress * Math.PI) * 1.2);
        ctx.strokeStyle = `rgba(186, 230, 253, ${0.8 * fade})`;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const dist = 36 * progress;
          ctx.beginPath();
          ctx.moveTo(fx.x, fx.y + 12);
          ctx.lineTo(fx.x + Math.cos(a) * dist, fx.y + 12 + Math.sin(a) * (dist * 0.45));
          ctx.stroke();
        }
      }
      // 9. 万毒攻心：地底腐蚀剧毒绿雾
      else if (fx.type === 'poison') {
        const fade = Math.min(1, Math.sin(progress * Math.PI) * 1.2);
        ctx.fillStyle = `rgba(74, 222, 128, ${0.2 * fade})`;
        ctx.beginPath();
        ctx.ellipse(fx.x, fx.y + 14, 42 * progress, 14 * progress, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  // 渲染正在生效的战斗前景法术与打击特效 (普攻刀光、舍生爆开、神雷轰击、狂暴风沙等)
  renderBattleCanvasEffects(ctx) {
    if (!this.activeBattleEffects || this.activeBattleEffects.length === 0) return;
    const now = Date.now();

    this.activeBattleEffects = this.activeBattleEffects.filter(fx => {
      const elapsed = now - fx.startTime;
      if (elapsed > fx.duration) return false;
      const progress = elapsed / fx.duration;

      ctx.save();
      const x = fx.x;
      const y = fx.y;

      // 特效1：普通攻击·银白撕裂剑弧、耀眼神兵挥砍与火花迸溅
      if (fx.type === 'slash') {
        const isAlly = fx.isAllyAttacker !== undefined ? fx.isAllyAttacker : true;
        const slashAngle = isAlly ? (-Math.PI / 4 + progress * Math.PI * 0.7) : (Math.PI * 0.75 - progress * Math.PI * 0.7);
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - progress)})`;
        ctx.lineWidth = 5.5 * (1 - progress * 0.6);
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(x, y - 6, 38 * (0.5 + progress * 0.6), slashAngle - 0.75, slashAngle + 0.75);
        ctx.stroke();

        // 耀眼刀刃残影
        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, 0.8 - progress)})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(x, y - 6, 32 * (0.5 + progress * 0.6), slashAngle - 0.6, slashAngle + 0.6);
        ctx.stroke();

        // 挥舞的金色神兵轮廓 (瞬时闪现的刀剑光影)
        ctx.save();
        ctx.translate(x + (isAlly ? 10 : -10), y - 10);
        ctx.rotate(slashAngle);
        ctx.fillStyle = 'rgba(253, 224, 71, 0.9)';
        ctx.fillRect(-2, -26, 4, 30);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-6, 4, 12, 3);
        ctx.fillRect(-2, 7, 4, 9);
        ctx.restore();

        // 命中爆发的璀璨火星碎屑与十字星芒
        for (let i = 0; i < 8; i++) {
          const spAngle = (i * Math.PI) / 4 + progress * 3;
          const spDist = 12 + progress * 36;
          ctx.fillStyle = (i % 2 === 0) ? '#fde047' : '#ff4757';
          ctx.fillRect(x + Math.cos(spAngle) * spDist, y - 8 + Math.sin(spAngle) * spDist, 3, 3);
        }

        // 核心受击爆光星芒
        if (progress < 0.45) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.beginPath();
          ctx.ellipse(x, y - 8, 14 * (1 - progress * 2), 2.5, 0, 0, Math.PI * 2);
          ctx.ellipse(x, y - 8, 2.5, 14 * (1 - progress * 2), 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // 特效2：舍生取义·汇聚在目标身上的能量剧烈爆开！(Shockwave Detonation)
      else if (fx.type === 'sacrifice') {
        if (fx.phase ? fx.phase === 'energy_detonate' : progress >= 0.50) {
          const blastProg = Math.max(0, Math.min(1, fx.impactTime !== undefined
            ? (now - fx.impactTime) / (fx.blastDuration || 400) : (progress - 0.50) / 0.50));
          const blastR = 18 + blastProg * 75;
          const bGrad = ctx.createRadialGradient(x, y - 10, 0, x, y - 10, blastR);
          bGrad.addColorStop(0, `rgba(255, 255, 255, ${Math.max(0, 1 - blastProg)})`);
          bGrad.addColorStop(0.3, `rgba(255, 48, 74, ${Math.max(0, 0.9 - blastProg)})`);
          bGrad.addColorStop(0.7, `rgba(255, 215, 0, ${Math.max(0, 0.6 - blastProg)})`);
          bGrad.addColorStop(1, 'rgba(255, 48, 74, 0)');
          ctx.fillStyle = bGrad;
          ctx.beginPath();
          ctx.arc(x, y - 10, blastR, 0, Math.PI * 2);
          ctx.fill();

          // 双重剧烈向外炸开的冲击波光环
          ctx.strokeStyle = `rgba(255, 48, 74, ${Math.max(0, 1 - blastProg * 1.2)})`;
          ctx.lineWidth = 5 * (1 - blastProg);
          ctx.shadowColor = '#ff304a';
          ctx.shadowBlur = 24;
          ctx.beginPath();
          ctx.arc(x, y - 10, 16 + blastProg * 88, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = `rgba(255, 230, 100, ${Math.max(0, 1 - blastProg)})`;
          ctx.lineWidth = 3 * (1 - blastProg);
          ctx.beginPath();
          ctx.arc(x, y - 10, 10 + blastProg * 65, 0, Math.PI * 2);
          ctx.stroke();

          // 360 度四射迸溅的赤金能量箭芒与破体火花 (18 道破体神枪光芒)
          for (let s = 0; s < 18; s++) {
            const ang = (s * Math.PI) / 9 + blastProg * 1.5;
            const dist = 14 + blastProg * 92;
            const len = 18 * (1 - blastProg);
            ctx.strokeStyle = (s % 2 === 0) ? '#ff4757' : '#ffd700';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(ang) * (dist - len), y - 10 + Math.sin(ang) * (dist - len));
            ctx.lineTo(x + Math.cos(ang) * dist, y - 10 + Math.sin(ang) * dist);
            ctx.stroke();
          }

          // 目标体表交叉破甲十字血芒
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - blastProg * 1.5)})`;
          ctx.lineWidth = 4;
          for (const side of [-1, 1]) {
            ctx.beginPath();
            ctx.moveTo(x - 36, y - 10 + side * 28);
            ctx.lineTo(x + 36, y - 10 - side * 28);
            ctx.stroke();
          }
        }
      }
      // 特效3：雷霆万钧·满天雷电轰鸣 + 终极九天神雷狂暴劈落目标！
      else if (fx.type === 'thunder') {
        const stageProg = progress;
        // 前半程 (0% ~ 65%)：很多道雷电从天上往全场各处接连狂劈！
        if (stageProg < 0.65) {
          const boltPoints = [
            { ox: -140, hitGround: 0.72 },
            { ox: 110, hitGround: 0.68 },
            { ox: -60, hitGround: 0.78 },
            { ox: 170, hitGround: 0.65 },
            { ox: -210, hitGround: 0.70 },
            { ox: 50, hitGround: 0.76 },
            { ox: -100, hitGround: 0.80 },
            { ox: 140, hitGround: 0.74 }
          ];

          boltPoints.forEach((bp, bIdx) => {
            const triggerTime = bIdx * 0.07;
            if (stageProg >= triggerTime && stageProg <= triggerTime + 0.22) {
              const bAlpha = 1 - (stageProg - triggerTime) / 0.22;
              const bx = x + bp.ox;
              const bGroundY = (this.battleCanvasHeight || 420) * bp.hitGround;

              ctx.strokeStyle = `rgba(224, 231, 255, ${bAlpha})`;
              ctx.lineWidth = 3.2;
              ctx.shadowColor = '#818cf8';
              ctx.shadowBlur = 18;

              ctx.beginPath();
              ctx.moveTo(bx, 0);
              ctx.lineTo(bx + (bIdx % 2 ? 18 : -18), bGroundY * 0.3);
              ctx.lineTo(bx + (bIdx % 2 ? -15 : 15), bGroundY * 0.6);
              ctx.lineTo(bx + (bIdx % 2 ? 10 : -10), bGroundY * 0.85);
              ctx.lineTo(bx, bGroundY);
              ctx.stroke();

              ctx.fillStyle = `rgba(168, 85, 247, ${bAlpha * 0.5})`;
              ctx.beginPath();
              ctx.ellipse(bx, bGroundY, 18, 6, 0, 0, Math.PI * 2);
              ctx.fill();
            }
          });
        }

        // 后半程 (50% ~ 100%)：最终汇聚并在目标身上轰隆劈下绝世神雷！
        if (stageProg >= 0.50) {
          const finalProg = (stageProg - 0.50) / 0.50;
          const finalAlpha = Math.max(0, 1 - finalProg * 0.85);

          // 直贯天灵的九天劫雷巨柱 (宽 28px，耀眼纯白与蓝紫雷光)
          ctx.strokeStyle = `rgba(255, 255, 255, ${finalAlpha})`;
          ctx.lineWidth = 14 * (1 - finalProg * 0.5);
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 30;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, y + 10);
          ctx.stroke();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, y + 10);
          ctx.stroke();

          // 缠绕目标身躯的狂暴电弧狂澜
          for (let a = -2; a <= 2; a++) {
            ctx.strokeStyle = (a % 2 === 0) ? '#818cf8' : '#c084fc';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(x + a * 16, y - 45);
            ctx.lineTo(x + a * 8 + (Math.sin(finalProg * 25 + a) * 16), y - 15);
            ctx.lineTo(x, y + 10);
            ctx.stroke();
          }

          // 目标脚底炸开的环形雷电震波与四射电火花
          ctx.strokeStyle = `rgba(192, 132, 252, ${finalAlpha})`;
          ctx.lineWidth = 4 * (1 - finalProg);
          ctx.beginPath();
          ctx.ellipse(x, y + 10, 46 * (0.3 + finalProg * 0.7), 16 * (0.3 + finalProg * 0.7), 0, 0, Math.PI * 2);
          ctx.stroke();

          for (let p = 0; p < 12; p++) {
            const pAng = (p * Math.PI) / 6 + finalProg * 3;
            const pDist = 18 + finalProg * 48;
            ctx.fillStyle = '#e0e7ff';
            ctx.fillRect(x + Math.cos(pAng) * pDist, y + 8 + Math.sin(pAng) * (pDist * 0.4), 3, 3);
          }
        }
      }
      // 特效4：飞沙走石·落叶狂风暴风眼与乱石飞沙重创
      else if (fx.type === 'sand') {
        const isStormActive = progress >= 0.25;
        if (isStormActive) {
          const stormProg = (progress - 0.25) / 0.75;
          const stormAlpha = Math.max(0, 1 - stormProg * 0.6);

          // 狂暴横扫目标的金色神风气刃
          ctx.strokeStyle = `rgba(254, 240, 138, ${stormAlpha})`;
          ctx.lineWidth = 3.5;
          ctx.shadowColor = '#eab308';
          ctx.shadowBlur = 16;
          for (let s = -2; s <= 2; s++) {
            const sy = y + s * 16 - stormProg * 14;
            ctx.beginPath();
            ctx.moveTo(x - 75 + stormProg * 40, sy + 12);
            ctx.quadraticCurveTo(x, sy - 22, x + 72 + stormProg * 25, sy - 4);
            ctx.stroke();
          }

          // 环绕目标疯狂旋舞的碎叶暴风眼 (叶子被刮没后全在这里撕扯旋转)
          for (let l = 0; l < 22; l++) {
            const lAng = l * 0.55 + stormProg * 9;
            const lDistX = 22 + (l % 4) * 14 + stormProg * 25;
            const lDistY = (lDistX * 0.45);
            const lx = x + Math.cos(lAng) * lDistX;
            const ly = y - 10 + Math.sin(lAng) * lDistY;

            ctx.save();
            ctx.translate(lx, ly);
            ctx.rotate(lAng + Math.PI / 4);
            ctx.fillStyle = (l % 2 === 0) ? '#22c55e' : '#f59e0b';
            ctx.beginPath();
            ctx.ellipse(0, 0, 5.5, 2.8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // 漫天飞沙乱石重轰目标
          ctx.fillStyle = '#d97706';
          for (let r = 0; r < 14; r++) {
            const rx = x - 55 + ((r * 19 + stormProg * 130) % 110);
            const ry = y + (Math.sin(r * 3 + stormProg * 12) * 22) - 8;
            const rSize = 3 + (r % 4);
            ctx.fillRect(rx, ry, rSize, rSize);
          }

          // 地面弥漫的风沙土尘气旋
          ctx.fillStyle = `rgba(217, 119, 6, ${0.35 * stormAlpha})`;
          ctx.beginPath();
          ctx.ellipse(x, y + 10, 52 * (0.5 + stormProg * 0.5), 18 * (0.5 + stormProg * 0.5), 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // 特效5：如来神掌 (金刚通天巨掌压落与地底佛印破空)
      else if (fx.type === 'palm') {
        if (progress < 0.45) {
          const fallProg = progress / 0.45;
          const palmY = y - 140 + fallProg * 130;
          ctx.save();
          ctx.translate(x, palmY);
          ctx.scale(1.35, 1.35);
          ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#ffd700';
          ctx.shadowBlur = 25;

          ctx.beginPath();
          ctx.ellipse(0, 10, 24, 28, 0, 0, Math.PI * 2);
          ctx.fill(); ctx.stroke();
          for (let f = -2; f <= 2; f++) {
            const fLen = 38 - Math.abs(f) * 6;
            ctx.beginPath();
            ctx.roundRect(f * 10 - 4, -fLen, 8, fLen + 10, 4);
            ctx.fill(); ctx.stroke();
          }
          ctx.restore();

          ctx.strokeStyle = `rgba(253, 224, 71, ${0.8 * fallProg})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(x, y + 10, 48 * fallProg, 16 * fallProg, 0, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          const slamProg = (progress - 0.45) / 0.55;
          const slamAlpha = Math.max(0, 1 - slamProg * 0.85);

          ctx.save();
          ctx.translate(x, y + 10);
          ctx.scale(1.2, 0.45);
          ctx.fillStyle = `rgba(245, 158, 11, ${slamAlpha * 0.65})`;
          ctx.strokeStyle = `rgba(253, 224, 71, ${slamAlpha})`;
          ctx.lineWidth = 3;
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 24;

          ctx.beginPath();
          ctx.ellipse(0, 8, 26, 30, 0, 0, Math.PI * 2);
          ctx.fill(); ctx.stroke();
          for (let f = -2; f <= 2; f++) {
            const fLen = 36 - Math.abs(f) * 6;
            ctx.beginPath();
            ctx.roundRect(f * 11 - 4, -fLen, 9, fLen + 8, 4);
            ctx.fill(); ctx.stroke();
          }
          ctx.restore();

          for (let f = -2; f <= 2; f++) {
            const fxOffset = f * 12;
            ctx.strokeStyle = `rgba(255, 255, 255, ${slamAlpha * 0.9})`;
            ctx.lineWidth = 5 * (1 - slamProg);
            ctx.beginPath();
            ctx.moveTo(x + fxOffset, y + 5);
            ctx.lineTo(x + fxOffset, 0);
            ctx.stroke();
          }

          for (let p = 0; p < 12; p++) {
            const pAng = (p * Math.PI) / 6 + slamProg * 2;
            const pDist = 20 + slamProg * 65;
            ctx.fillStyle = '#fde047';
            ctx.fillRect(x + Math.cos(pAng) * pDist, y + 5 + Math.sin(pAng) * (pDist * 0.45), 4, 4);
          }
        }
      }
      // 特效6：三昧真火 (冲天爆裂火焰神柱与火凰赤芒)
      else if (fx.type === 'fire') {
        const pillarW = 58 * (1 - progress * 0.25);
        const pillarH = 135 * (0.3 + progress * 0.7);

        const fGrad = ctx.createLinearGradient(x, y + 12, x, y - pillarH);
        fGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        fGrad.addColorStop(0.2, 'rgba(254, 240, 138, 0.95)');
        fGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.9)');
        fGrad.addColorStop(0.85, 'rgba(220, 38, 38, 0.8)');
        fGrad.addColorStop(1, 'rgba(153, 27, 27, 0)');

        ctx.fillStyle = fGrad;
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 26;
        ctx.beginPath();
        ctx.ellipse(x, y - pillarH / 2, pillarW / 2, pillarH / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        if (progress > 0.25 && progress < 0.85) {
          const phY = y - progress * pillarH * 0.85;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x, phY);
          ctx.quadraticCurveTo(x - 32, phY - 24, x - 52, phY - 8);
          ctx.moveTo(x, phY);
          ctx.quadraticCurveTo(x + 32, phY - 24, x + 52, phY - 8);
          ctx.stroke();
        }

        for (let j = 0; j < 8; j++) {
          const fAng = j * (Math.PI / 4) + progress * 7;
          const fxX = x + Math.cos(fAng) * (pillarW * 0.75);
          const fxY = y - progress * pillarH * 0.95 + (j % 3) * 12;
          ctx.fillStyle = (j % 2 === 0) ? '#fde047' : '#ef4444';
          ctx.beginPath();
          ctx.arc(fxX, fxY, 4.5 * (1 - progress * 0.8), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // 特效7：佛光普照 (八瓣琉璃金莲与三重大日圣环)
      else if (fx.type === 'buddha') {
        const bAlpha = Math.max(0, 1 - progress);
        ctx.save();
        ctx.translate(x, y + 10);
        ctx.scale(1, 0.45);
        ctx.rotate(progress * 1.8);
        ctx.fillStyle = `rgba(254, 240, 138, ${0.85 * bAlpha})`;
        ctx.strokeStyle = `rgba(245, 158, 11, ${bAlpha})`;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 20;

        for (let p = 0; p < 8; p++) {
          const pAng = (p * Math.PI) / 4;
          ctx.beginPath();
          ctx.ellipse(Math.cos(pAng) * 26, Math.sin(pAng) * 26, 12, 6, pAng, 0, Math.PI * 2);
          ctx.fill(); ctx.stroke();
        }
        ctx.restore();

        for (let ring = 0; ring < 3; ring++) {
          const ringR = 18 + ring * 18 + progress * 42;
          ctx.strokeStyle = `rgba(255, 230, 100, ${(1 - progress) * (0.9 - ring * 0.25)})`;
          ctx.lineWidth = 3.5 - ring;
          ctx.beginPath();
          ctx.arc(x, y - 10, ringR, 0, Math.PI * 2);
          ctx.stroke();
        }

        for (let f = 0; f < 6; f++) {
          const fy = y + 5 - progress * 75 - f * 8;
          const fxPos = x + Math.sin(progress * 4 + f) * 28;
          ctx.fillStyle = '#fffa65';
          ctx.beginPath();
          ctx.arc(fxPos, fy, 3.5 * bAlpha, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // 特效8：金刚护体 (琉璃金钟罩、蜂窝结界与六枚太古梵文字符)
      else if (fx.type === 'shield' || fx.type === 'gold') {
        const ringR = 38 * (0.85 + progress * 0.2);
        const sAlpha = Math.max(0, 1 - progress * 0.5);

        ctx.strokeStyle = `rgba(250, 204, 21, ${sAlpha})`;
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 22;
        ctx.beginPath();
        ctx.arc(x, y - 8, ringR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(250, 204, 21, 0.18)';
        ctx.fill();

        ctx.save();
        ctx.translate(x, y - 8);
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
        ctx.lineWidth = 1.2;
        for (let h = 0; h < 6; h++) {
          const hAng = (h * Math.PI) / 3 + progress * 0.8;
          const hx = Math.cos(hAng) * 20;
          const hy = Math.sin(hAng) * 20;
          ctx.beginPath();
          ctx.arc(hx, hy, 9, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        for (let r = 0; r < 6; r++) {
          const rAng = (r * Math.PI) / 3 + progress * 2.5;
          const rx = x + Math.cos(rAng) * (ringR + 5);
          const ry = y - 8 + Math.sin(rAng) * (ringR * 0.5);
          ctx.fillStyle = '#fffa65';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('卍', rx, ry);
        }
      }
      // 特效9：万毒攻心 (万毒灵蛇扑咬、腐蚀飞溅毒滴与骷髅毒雾)
      else if (fx.type === 'poison') {
        const pAlpha = Math.max(0, 1 - progress);
        ctx.strokeStyle = `rgba(74, 222, 128, ${pAlpha})`;
        ctx.lineWidth = 4;
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 18;

        ctx.beginPath();
        ctx.moveTo(x - 35, y + 20);
        ctx.quadraticCurveTo(x - 25, y - 35, x, y - 15);
        ctx.stroke();

        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.moveTo(x - 12, y - 32);
        ctx.lineTo(x + 10, y - 18);
        ctx.lineTo(x - 6, y - 10);
        ctx.closePath();
        ctx.fill();

        for (let i = 0; i < 14; i++) {
          const a = i * 2.2 + progress * 6;
          const r = 10 + i * 2.8 + progress * 20;
          ctx.fillStyle = (i % 2 === 0) ? '#4ade80' : '#c084fc';
          ctx.beginPath();
          ctx.arc(x + Math.cos(a) * r, y - 10 + Math.sin(a) * r - progress * 16, 2.5 + i % 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // 特效10：封印诀 (四象降魔金符飞射锚定 + 巨型赤金封印宝印)
      else if (fx.type === 'seal') {
        const sAlpha = Math.max(0, 1 - progress);
        [-1, 1].forEach(sx => {
          [-1, 1].forEach(sy => {
            const dist = 42 * (1 - progress * 0.4);
            const fxPos = x + sx * dist;
            const fyPos = y - 10 + sy * dist * 0.7;
            ctx.save();
            ctx.translate(fxPos, fyPos);
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(-6, -11, 12, 22);
            ctx.fillStyle = '#b91c1c';
            ctx.fillRect(-3, -7, 6, 14);
            ctx.restore();

            ctx.strokeStyle = `rgba(250, 204, 21, ${0.7 * sAlpha})`;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(x, y - 10);
            ctx.lineTo(fxPos, fyPos);
            ctx.stroke();
          });
        });

        ctx.save();
        ctx.translate(x, y - 10);
        ctx.scale(1 + (1 - progress) * 0.6, 1 + (1 - progress) * 0.6);
        ctx.strokeStyle = `rgba(250, 204, 21, ${sAlpha})`;
        ctx.lineWidth = 2.8;
        ctx.strokeRect(-24, -24, 48, 48);
        ctx.strokeRect(-18, -18, 36, 36);

        ctx.font = 'bold 22px "Microsoft YaHei", sans-serif';
        ctx.fillStyle = `rgba(255, 75, 75, ${sAlpha})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('封', 0, 0);
        ctx.restore();
      }
      // 特效11：定身法 (三维螺旋缚仙金索 + 虚空琥珀定神晶体)
      else if (fx.type === 'bind') {
        const bAlpha = Math.max(0, 1 - progress);
        ctx.strokeStyle = `rgba(56, 189, 248, ${bAlpha})`;
        ctx.lineWidth = 3.2;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;

        for (let side of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(x + side * 44, y - 48);
          ctx.bezierCurveTo(x - side * 28, y - 28, x + side * 32, y - 5, x, y + 20);
          ctx.stroke();
        }

        ctx.fillStyle = `rgba(56, 189, 248, ${0.2 * bAlpha})`;
        ctx.beginPath();
        ctx.ellipse(x, y - 12, 28, 36, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.font = 'bold 26px "Microsoft YaHei", sans-serif';
        ctx.fillStyle = `rgba(255, 255, 255, ${bAlpha})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 16;
        ctx.fillText('定', x, y - 12);
        ctx.restore();
      }
      // 特效12：乱魂诀 (迷魂幽冥魅影旋转 + 眩晕金星)
      else if (fx.type === 'mind') {
        const mAlpha = Math.max(0, 1 - progress);
        for (let i = 0; i < 3; i++) {
          const a = (i * Math.PI * 2 / 3) + progress * 6;
          const mx = x + Math.cos(a) * 34;
          const my = y - 16 + Math.sin(a) * 14;

          ctx.fillStyle = (i === 0 ? '#c084fc' : (i === 1 ? '#f472b6' : '#a855f7'));
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.ellipse(mx, my, 10, 6, a, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = `rgba(192, 132, 252, ${0.6 * mAlpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(x, y - 16);
          ctx.stroke();
        }

        for (let s = 0; s < 4; s++) {
          const sa = (s * Math.PI) / 2 + progress * 8;
          const sx = x + Math.cos(sa) * 20;
          const sy = y - 38 + Math.sin(sa) * 7;
          ctx.fillStyle = '#fde047';
          ctx.fillRect(sx - 2, sy - 2, 4, 4);
        }
      }
      // 特效13：隐身术 (水墨青烟遁入虚空像素崩解)
      else if (fx.type === 'vanish') {
        const vAlpha = Math.max(0, 1 - progress);
        for (let i = 0; i < 4; i++) {
          ctx.strokeStyle = `rgba(176, 241, 239, ${vAlpha * (0.9 - i * 0.18)})`;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.ellipse(x, y - 12 - i * 10, 24 + i * 8 + progress * 14, 8 + i * 2, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        for (let b = 0; b < 16; b++) {
          const bx = x + ((b * 13) % 40) - 20;
          const by = y - 25 + ((b * 17) % 50) - 25 - progress * 30;
          ctx.fillStyle = `rgba(176, 241, 239, ${vAlpha})`;
          ctx.fillRect(bx, by, 3, 3);
        }
      }
      // 特效14：玄冰刺 (拔地而起的五道九幽冰棱晶刺与碎冰)
      else if (fx.type === 'ice') {
        const iAlpha = Math.max(0, 1 - progress);
        ctx.fillStyle = `rgba(186, 230, 253, ${0.9 * iAlpha})`;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;

        [-24, -12, 0, 12, 24].forEach((ox, i) => {
          const h = (38 + (i % 2 === 0 ? 18 : 0)) * (0.3 + progress * 0.7);
          ctx.beginPath();
          ctx.moveTo(x + ox - 8, y + 12);
          ctx.lineTo(x + ox, y + 12 - h);
          ctx.lineTo(x + ox + 8, y + 12);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        });

        for (let s = 0; s < 10; s++) {
          const sang = (s * Math.PI) / 5 + progress * 2;
          const sdist = 16 + progress * 42;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + Math.cos(sang) * sdist, y - 10 + Math.sin(sang) * (sdist * 0.5), 3, 3);
        }
      }
      // 特效15：甘露回春 (生机涌现水波与升腾翠绿灵环)
      else if (fx.type === 'heal') {
        const hAlpha = Math.max(0, 1 - progress);
        ctx.strokeStyle = `rgba(74, 222, 128, ${hAlpha})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 16;

        ctx.beginPath();
        ctx.ellipse(x, y + 10, 28 * (0.4 + progress * 0.6), 12 * (0.4 + progress * 0.6), 0, 0, Math.PI * 2);
        ctx.stroke();

        for (let l = 0; l < 3; l++) {
          const ly = y + 5 - progress * 55 - l * 12;
          ctx.beginPath();
          ctx.ellipse(x, ly, 18 * (1 - progress * 0.3), 7 * (1 - progress * 0.3), 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      // 特效16：通用秘法 (星云法球爆发)
      else {
        const aAlpha = Math.max(0, 1 - progress);
        ctx.strokeStyle = `rgba(167, 165, 255, ${aAlpha})`;
        ctx.lineWidth = 2.4;
        ctx.shadowColor = '#a7a5ff';
        ctx.shadowBlur = 16;
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4 + progress * 3;
          ctx.beginPath();
          ctx.moveTo(x, y - 10);
          ctx.lineTo(x + Math.cos(a) * (36 + progress * 15), y - 10 + Math.sin(a) * (36 + progress * 15));
          ctx.stroke();
        }
      }

      ctx.restore();
      return true;
    });
  }

  // 技能法术差异化演出标准时长 (毫秒)
  getBattleAnimationScale() {
    return this.combatSpeedMultiplier === 2 ? 0.5 : 1;
  }

  waitBattleAnimation(ms) {
    return new Promise(resolve => setTimeout(resolve, Math.round(ms * this.getBattleAnimationScale())));
  }

  async animateBattleMotion(ms, update) {
    const duration = Math.max(1, ms * this.getBattleAnimationScale());
    const started = Date.now();
    let progress = 0;
    update(0);
    while (progress < 1) {
      await new Promise(resolve => setTimeout(resolve, 16));
      progress = Math.min(1, (Date.now() - started) / duration);
      update(progress);
    }
  }

  prepareBattlePresentation(battle) {
    for (const unit of [...battle.enemies, ...battle.allies]) {
      unit._displayHp = unit.hp;
      unit._displayMp = unit.mp;
      unit._displayBuffs = [...(unit.buffs || [])];
      unit._roundBattlePos = unit._baseBattlePos ? { ...unit._baseBattlePos } : null;
    }
  }

  commitBattlePresentation(battle) {
    for (const unit of [...battle.enemies, ...battle.allies]) {
      if (unit._displayHp > 0 && unit.hp <= 0) {
        unit._defeatUntil = Date.now() + 180 * this.getBattleAnimationScale();
      }
      unit._displayHp = unit.hp;
      unit._displayMp = unit.mp;
      unit._displayBuffs = [...(unit.buffs || [])];
    }
  }

  clearBattlePresentation(battle) {
    for (const unit of [...battle.enemies, ...battle.allies]) {
      delete unit._displayHp;
      delete unit._displayMp;
      delete unit._displayBuffs;
      delete unit._roundBattlePos;
      delete unit._defeatUntil;
      unit._dashOffset = { x: 0, y: 0 };
      unit._shakeOffset = { x: 0, y: 0 };
      unit._dashTilt = 0;
      unit._ghosts = [];
    }
    if (this.currentBattle === battle) {
      this.activeBattleEffects = [];
      this.battleCastCue = null;
    }
  }

  renderBattleUnitStatus(ctx, unit, x, y) {
    const labels = { fengyin: '封', dingshen: '定', luanhun: '乱', wandu: '毒', yinshen: '隐' };
    const tags = [...new Set((unit._displayBuffs || unit.buffs || []).map(b => labels[b.id] ||
      (b.name === '金刚护体' ? '护' : b.name === '防御' ? '防' : null)).filter(Boolean))].slice(0, 4);

    const isBossLocked = (this.currentBattle?.getBossIntents?.() || []).some(i => i.targetId === unit.id && i.status === 'telegraphed');
    if (isBossLocked) {
      tags.unshift('山');
    }

    if (!tags.length) return;
    ctx.save();
    ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    tags.forEach((tag, i) => {
      const tx = x + (i - (tags.length - 1) / 2) * 20;
      ctx.fillStyle = tag === '山' ? 'rgba(180, 20, 20, 0.95)' : 'rgba(18, 15, 28, 0.9)';
      ctx.fillRect(tx - 8, y + 35, 16, 16);
      ctx.fillStyle = tag === '毒' ? '#a3e635' : (tag === '山' ? '#ff4757' : '#f8df9c');
      ctx.fillText(tag, tx, y + 47);
    });
    ctx.restore();
  }

  async playBattleStep(step, battle) {
    if (this.currentBattle !== battle) return;
    const enemyAttacker = (step.attacker || '').startsWith('enemy_');
    const selfDamage = step.attacker === 'self';
    const attacker = enemyAttacker
      ? battle.enemies.find(e => 'enemy_' + e.enemyIndex === step.attacker)
      : battle.allies.find(a => a.id === step.attacker);
    const hits = step.hits || (step.targetIds ? step.targetIds.map(target => ({ ...step, target })) : [step]);
    const entries = hits.map(hit => ({
      hit, unit: hit.targetIndex !== undefined
        ? battle.enemies[hit.targetIndex] : battle.allies.find(a => a.id === hit.target)
    }));
    const positioned = entries.filter(entry => entry.unit?._battlePos);
    const effectType = this.getBattleEffectType(step);
    const offensive = ['damage', 'revive', 'dodge', 'cast', 'sealed', 'dingshen', 'luanhun', 'boss_special_cast', 'boss_intent_interrupted', 'boss_intent_cancelled'].includes(step.type);
    const duration = this.getSkillEffectDuration(effectType);

    if (step.skillName && !selfDamage) {
      this.battleCastCue = {
        text: `${attacker?.name || '施法'} · ${step.skillName}`,
        until: Date.now() + (duration + 240) * this.getBattleAnimationScale()
      };
    }
    const impact = () => {
      if (this.currentBattle !== battle) return;
      this.commitBattlePresentation(battle);
      if ((step.isCrit || effectType === 'sacrifice' || step.type === 'boss_special_cast') && step.type !== 'dodge' && !selfDamage) {
        const stage = document.getElementById('battle-stage-area');
        if (stage && !this.isReducedMotionEnabled()) {
          stage.classList.add('arena-shake');
          setTimeout(() => stage.classList.remove('arena-shake'), 160 * this.getBattleAnimationScale());
        }
      }
      if (window.Sound && !selfDamage) {
        if (step.type === 'dodge' || step.type === 'boss_intent_cancelled') window.Sound.playFailure();
        else if (step.type === 'boss_intent_interrupted') window.Sound.playFailure();
        else if (step.isCrit || effectType === 'sacrifice' || effectType === 'thunder' || step.type === 'boss_special_cast') window.Sound.playCrit();
        else if (offensive) window.Sound.playHit();
      }
      for (const { hit, unit } of positioned) {
        // P5.1 反馈分级：抵抗与闪避视觉分离；伤害飘字附加五行克制/被克标记
        const kind = hit.type === 'resist' ? 'resist' :
          hit.type === 'dodge' ? 'dodge' :
          hit.type === 'mana' ? 'mana' : ['heal', 'revive', 'buff', 'invis'].includes(hit.type) ? 'heal' :
            ['sealed', 'dingshen', 'luanhun', 'defend', 'status_block'].includes(hit.type) ? 'status' : step.isCrit ? 'crit' : 'damage';
        let text = hit.text || step.text;
        if ((kind === 'damage' || kind === 'crit') && hit.attackResult) {
          text = this._decorateDamageFloatText(text, hit.attackResult);
        }
        if (text) this.spawnBattleFloatingTextAtCoords(unit._battlePos.x, unit._battlePos.y, text, kind);
      }
    };

    if (offensive && !selfDamage && positioned.length) {
      const primary = positioned[0].unit;
      if (attacker && (effectType === 'slash' || effectType === 'sacrifice')) {
        await this.playDashAttackAnimation(attacker, primary, !enemyAttacker, effectType, {
          isDodge: step.type === 'dodge', onImpact: impact
        });
      } else {
        positioned.forEach(({ unit }, index) => {
          this.spawnBattleSkillEffect(effectType, unit._battlePos.x, unit._battlePos.y, duration,
            { localOnly: index > 0 });
        });
        await this.waitBattleAnimation(duration * 0.5);
        if (this.currentBattle !== battle) return;
        impact();
        const successful = positioned.filter(({ hit }) => hit.type === 'damage' && hit.damage > 0);
        if (successful.length) {
          const shakeAmp = this.isReducedMotionEnabled() ? 2 : 5;
          await this.animateBattleMotion(110, t => successful.forEach(({ unit }) => {
            unit._shakeOffset = { x: Math.sin(t * Math.PI * 4) * shakeAmp * (1 - t), y: 0 };
          }));
        }
        await this.waitBattleAnimation(Math.max(0, duration * 0.5 - (successful.length ? 110 : 0)));
      }
      // 连击共享一次突进，后续伤害清晰逐段展示。
      for (const [index, damage] of (step.damages || []).slice(1).entries()) {
        await this.waitBattleAnimation(100);
        if (this.currentBattle !== battle) return;
        const pos = primary._baseBattlePos || primary._battlePos;
        this.spawnBattleSkillEffect('slash', pos.x, pos.y, 180, { localOnly: true });
        this.spawnBattleFloatingTextAtCoords(pos.x, pos.y - 12 * (index + 1), `连击 -${damage}`, 'damage');
      }
    } else if (['heal', 'mana', 'buff', 'invis', 'defend'].includes(step.type)) {
      positioned.forEach(({ unit }, index) => {
        const type = ['buff', 'defend'].includes(step.type) ? 'shield' : step.type === 'invis' ? 'vanish' : 'heal';
        this.spawnBattleSkillEffect(type, unit._battlePos.x, unit._battlePos.y, 500, { localOnly: index > 0 });
      });
      impact();
      await this.waitBattleAnimation(500);
    } else {
      impact();
    }
    if (this.currentBattle !== battle) return;
    await this.waitBattleAnimation(offensive ? 100 : 180);
  }

  getSkillEffectDuration(skillType) {
    const durations = {
      slash: 420,
      sacrifice: 980,
      thunder: 850,
      sand: 900,
      palm: 800,
      fire: 800,
      buddha: 800,
      shield: 750,
      poison: 750,
      seal: 750,
      bind: 750,
      mind: 750,
      vanish: 650,
      ice: 750,
      heal: 700,
      arcane: 600
    };
    return durations[skillType] || 600;
  }

  // 触发战斗法术差异化特效
  spawnBattleSkillEffect(type, x, y, duration = null, extra = {}) {
    this.activeBattleEffects = this.activeBattleEffects || [];
    const dur = (duration !== null ? duration : this.getSkillEffectDuration(type)) * this.getBattleAnimationScale();
    this.activeBattleEffects.push({
      type: type,
      x: x,
      y: y,
      startTime: Date.now(),
      duration: dur,
      ...extra
    });
  }

  getBattleEffectType(step) {
    const effects = {
      sk_jg_shesheng: 'sacrifice', sk_jg_foguang: 'buddha',
      sk_jg_ruxiang: 'palm', sk_jg_huti: 'shield',
      sk_ym_leiting: 'thunder', sk_ym_wandu: 'poison',
      sk_ym_sanmei: 'fire', sk_ym_feisha: 'sand',
      sk_xr_luanhun: 'mind', sk_xr_fengyin: 'seal',
      sk_xr_dingshen: 'bind', sk_xr_yinshen: 'vanish'
    };
    if (step.skillId && effects[step.skillId]) return effects[step.skillId];
    const name = step.skillName || '';
    const names = {
      '舍生取义': 'sacrifice', '佛光普照': 'buddha', '如来神掌': 'palm', '金刚护体': 'shield',
      '封印咒': 'seal', '封印诀': 'seal', '定身咒': 'bind', '定身法': 'bind',
      '乱魂咒': 'mind', '乱魂诀': 'mind', '隐身咒': 'vanish', '甘露回春': 'heal'
    };
    if (names[name]) return names[name];
    if (/雷|电/.test(name)) return 'thunder';
    if (/火|炎/.test(name)) return 'fire';
    if (/毒|瘴/.test(name)) return 'poison';
    if (/风|沙|山|岳|石|移山|压顶/.test(name)) return 'sand';
    if (/水|冰|霜|海/.test(name)) return 'ice';
    if (/斧|钉耙|棒|刀|剑|枪|撕咬|扑击/.test(name)) return 'slash';
    if (step.skillId || name) return 'arcane';
    return 'slash';
  }

  // 播放攻击者极速冲锋滑步击打与平滑归位动画 (人飘移过去 -> 武器击打 -> 飘移归位；以及舍生取义电影级演出)
  async playDashAttackAnimation(attacker, target, isAllyAttacker, skillType = 'slash', options = {}) {
    if (!attacker || !target) return;
    const start = attacker._baseBattlePos || attacker._battlePos || { x: 0, y: 0 };
    const goal = target._baseBattlePos || target._battlePos || { x: 0, y: 0 };
    const dx = goal.x + (isAllyAttacker ? 44 : -44) - start.x;
    const dy = goal.y - start.y;
    const battle = this.currentBattle;
    const stillActive = () => !battle || this.currentBattle === battle;
    const move = (t, returning = false) => {
      if (!stillActive()) return;
      const ease = returning ? (1 - t) ** 2 : Math.sin(t * Math.PI / 2);
      attacker._dashOffset = { x: dx * ease, y: dy * ease };
      attacker._dashTilt = (isAllyAttacker ? -1 : 1) * (returning ? -0.08 * (1 - t) : 0.14);
      attacker._ghosts = attacker._ghosts || [];
      attacker._ghosts.forEach(g => g.alpha *= 0.65);
      if (!returning) attacker._ghosts.push({ x: start.x + dx * ease, y: start.y + dy * ease, alpha: 0.32 });
      attacker._ghosts = attacker._ghosts.filter(g => g.alpha > 0.04).slice(-4);
    };
    let fx;
    try {
      if (skillType === 'sacrifice') {
        fx = {
          type: 'sacrifice', x: goal.x, y: goal.y, attackerX: start.x, attackerY: start.y,
          beamY: (start.y + goal.y) / 2, isAllyAttacker, startTime: Date.now(),
          duration: 980 * this.getBattleAnimationScale(), phase: 'beam_wide'
        };
        this.activeBattleEffects = this.activeBattleEffects || [];
        this.activeBattleEffects.push(fx);
        await this.waitBattleAnimation(200);
        if (!stillActive()) return;
        fx.phase = 'ray_collapse';
        await this.waitBattleAnimation(100);
        fx.phase = 'ray_dash';
      }
      await this.animateBattleMotion(180, t => move(t));
      if (!stillActive()) return;
      if (fx) {
        fx.phase = 'ray_vanish';
        await this.waitBattleAnimation(80);
        if (!stillActive()) return;
        fx.phase = 'energy_detonate';
        fx.impactTime = Date.now();
        fx.blastDuration = 400 * this.getBattleAnimationScale();
        fx.duration = fx.impactTime - fx.startTime + fx.blastDuration;
      } else if (!options.isDodge) {
        this.spawnBattleSkillEffect('slash', goal.x, goal.y, 300, { isAllyAttacker });
      }
      if (options.onImpact) options.onImpact();
      if (options.isDodge) {
        await this.animateBattleMotion(120, t => {
          target._shakeOffset = { x: Math.sin(t * Math.PI) * (isAllyAttacker ? -18 : 18), y: 0 };
        });
      } else {
        await this.animateBattleMotion(fx ? 220 : 120, t => {
          target._shakeOffset = { x: Math.sin(t * Math.PI * 4) * (fx ? 12 : 7) * (1 - t), y: 0 };
        });
      }
      await this.animateBattleMotion(160, t => move(t, true));
    } finally {
      attacker._dashOffset = { x: 0, y: 0 };
      attacker._dashTilt = 0;
      attacker._ghosts = [];
      target._shakeOffset = { x: 0, y: 0 };
    }
  }

  // 触发战斗动作动效与伤害飘字
  // P5.1 反馈分级：抵抗(resist)与闪避(dodge)、伤害、暴击、治疗、法力、状态各自独立视觉
  _floatClassForType(type = 'damage') {
    if (type === 'crit') return 'float-crit';
    if (type === 'heal') return 'float-heal';
    if (type === 'mana') return 'float-mana';
    if (type === 'dodge') return 'float-dodge';
    if (type === 'resist') return 'float-resist';
    if (type === 'status') return 'float-status';
    return 'float-damage';
  }

  // P5.1: 伤害飘字的五行克制/被克标记 (⚡克制 🛡被克)，无克制关系原样返回
  _decorateDamageFloatText(text, attackResult) {
    if (!attackResult || typeof text !== 'string') return text;
    if (attackResult.elementRelation === 'counter') return '⚡' + text;
    if (attackResult.elementRelation === 'countered') return '🛡' + text;
    return text;
  }

  spawnBattleFloatingText(targetEl, text, type = 'damage') {
    const fxLayer = document.getElementById('battle-fx-layer');
    if (!fxLayer) return;

    let posX = 150;
    let posY = 150;
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      const container = document.getElementById('battle-main-container');
      if (container) {
        const cRect = container.getBoundingClientRect();
        posX = rect.left - cRect.left + rect.width / 2 - 25;
        posY = rect.top - cRect.top + 6;
      }
    }

    const el = document.createElement('div');
    el.className = `floating-text ${this._floatClassForType(type)}`;
    el.innerText = text;
    el.style.left = `${posX}px`;
    el.style.top = `${posY}px`;

    fxLayer.appendChild(el);
    setTimeout(() => el.remove(), 850);
  }

  spawnBattleFloatingTextAtCoords(posX, posY, text, type = 'damage') {
    const fxLayer = document.getElementById('battle-fx-layer');
    if (!fxLayer) return;

    const el = document.createElement('div');
    el.className = `floating-text ${this._floatClassForType(type)}`;
    el.innerText = text;
    const canvas = document.getElementById('battle-scene-canvas');
    const canvasRect = canvas?.getBoundingClientRect?.();
    const layerRect = fxLayer.getBoundingClientRect?.();
    const scaleX = canvasRect && canvas.width ? canvasRect.width / canvas.width : 1;
    const scaleY = canvasRect && canvas.height ? canvasRect.height / canvas.height : 1;
    el.style.left = `${posX * scaleX + (canvasRect && layerRect ? canvasRect.left - layerRect.left : 0) - 20}px`;
    el.style.top = `${posY * scaleY + (canvasRect && layerRect ? canvasRect.top - layerRect.top : 0) - 30}px`;

    fxLayer.appendChild(el);
    setTimeout(() => el.remove(), 850);
  }

  // 选择当前角色的战斗指令，并自动推进或执行 (支持显式指定敌方目标下标与友方目标ID)
  chooseCombatAction(type, skillId = null, explicitTargetIdx = null, explicitAllyId = null) {
    if (!this.currentBattle || this.currentBattle.status === 'executing') return;

    this.battleSkillMenuOpen = false;
    this.battleTargetMenuOpen = false;
    this.pendingCombatAction = null;
    this.pendingSkillAction = null;

    // 确定敌方有效目标下标
    let validTargetIdx = (explicitTargetIdx !== null && explicitTargetIdx !== undefined)
      ? explicitTargetIdx
      : this.selectedTargetIndex;
    if (validTargetIdx === undefined || validTargetIdx === null || !this.currentBattle.enemies[validTargetIdx] || this.currentBattle.enemies[validTargetIdx].hp <= 0) {
      const firstAliveIdx = this.currentBattle.enemies.findIndex(e => e.hp > 0);
      validTargetIdx = firstAliveIdx >= 0 ? firstAliveIdx : 0;
      this.selectedTargetIndex = validTargetIdx;
    }

    // 默认若选择药品，优先使用金创药
    const medicineItem = this.inventory ? this.inventory.getItems().find(s => s.itemId === 'jinchuang_yao' || s.itemId === 'dahuan_dan') : null;

    const curAllyId = this.selectedAllyId || 'player';
    const curAlly = this.currentBattle.allies.find(a => a.id === curAllyId) || this.currentBattle.allies[0];

    const curAllySkills = curAlly.isPlayer
      ? (this.playerData?.getSkills ? this.playerData.getSkills() : (this.playerData?.skills || curAlly.skills || []))
      : (curAlly.skills || []);
    const defaultSkill = curAllySkills[0];
    const defaultSkillId = defaultSkill?.id || defaultSkill?.name || null;
    const finalSkillId = skillId || defaultSkillId;

    const actionData = {
      type: type,
      targetIndex: validTargetIdx,
      targetAllyId: explicitAllyId || curAlly.id,
      skillId: finalSkillId,
      itemId: medicineItem ? medicineItem.itemId : 'jinchuang_yao'
    };

    this.currentBattle.setAllyAction(curAlly.id, actionData);

    if (type === 'flee') {
      this.executeCombatRound();
      return;
    }

    // 检查是否还有存活友方未下指令
    const aliveAllies = this.currentBattle.allies.filter(a => a.hp > 0);
    const unassigned = aliveAllies.find(a => !this.currentBattle.actions[a.id]);

    if (unassigned) {
      this.selectedAllyId = unassigned.id;
      if (window.Sound) window.Sound.playBeep();
      window.showGameMessage(`👉 请为【${unassigned.name}】选择出招指令，或按【空格/攻击】全员出手！`, 'info', 2200);
      this.renderBattleInterface();
    } else {
      // 全员指令就绪，执行交锋！
      this.executeCombatRound();
    }
  }

  // 统一权威的战斗结束与界面清退总控函数，杜绝任何死锁与卡顿
  // P5.3: 战果快照 (经验/银两/等级/背包物品计数/仙宠等级)，供胜利结算差量对比
  _snapshotVictoryState() {
    const inv = {};
    for (const s of (this.inventory?.slots || [])) {
      inv[s.itemId] = (inv[s.itemId] || 0) + (s.count || 1);
    }
    const pets = {};
    for (const p of (this.pets || [])) {
      pets[p.instanceId] = { name: p.name, level: p.level };
    }
    return {
      exp: this.playerData?.exp || 0,
      silver: this.playerData?.silver || 0,
      level: this.playerData?.level || 1,
      inv,
      pets
    };
  }

  // P5.3: 胜利战果清点面板 —— 到账奖励与待领取提示严格分列，不与到账物品混排
  showBattleVictorySummary(before, battle, pendingHints = []) {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('.battle-summary-overlay').forEach(m => m.remove());

    const p = this.playerData;
    if (!p || !before) return;

    const expDelta = (p.exp || 0) - before.exp;
    const silverDelta = (p.silver || 0) - before.silver;
    const leveledUp = (p.level || 1) > before.level;

    // 实际入包差量 (只统计新增，忽略消耗)
    const itemGains = [];
    for (const s of (this.inventory?.slots || [])) {
      const now = (s.count || 1);
      const was = before.inv[s.itemId] || 0;
      if (now > was) {
        const existing = itemGains.find(g => g.itemId === s.itemId);
        const add = now - was;
        if (existing) existing.count += add;
        else itemGains.push({ itemId: s.itemId, count: add });
      }
    }

    // 仙宠升级
    const petLevelUps = [];
    for (const pet of (this.pets || [])) {
      const was = before.pets[pet.instanceId];
      if (was && pet.level > was.level) {
        petLevelUps.push({ name: pet.name, from: was.level, to: pet.level });
      }
    }

    // 招降结果
    const captured = (battle?.enemies || []).filter(e => e.isCaptured).map(e => e.name);

    if (!expDelta && !silverDelta && !leveledUp && !itemGains.length && !petLevelUps.length && !captured.length && !pendingHints.length) {
      return; // 无任何战果则不打扰玩家
    }

    const itemHtml = window.GAME_DATA?.ITEMS;
    const rows = [];
    if (leveledUp) {
      rows.push(`<div class="bs-row"><span class="bs-k">🧬 修为</span><span class="bs-v">升级至 <b>Lv.${p.level}</b>${expDelta > 0 ? ` · 经验 +${expDelta}` : ''}</span></div>`);
    } else if (expDelta > 0) {
      rows.push(`<div class="bs-row"><span class="bs-k">🧬 修为</span><span class="bs-v">经验 +${expDelta}</span></div>`);
    }
    if (silverDelta > 0) {
      rows.push(`<div class="bs-row"><span class="bs-k">🪙 银两</span><span class="bs-v">+${silverDelta} 两</span></div>`);
    }
    if (itemGains.length) {
      rows.push(`<div class="bs-row"><span class="bs-k">🎒 实际入包</span><span class="bs-v">${itemGains.map(g => {
        const name = (itemHtml && itemHtml[g.itemId] && itemHtml[g.itemId].name) || g.itemId;
        return `${name}×${g.count}`;
      }).join('、')}</span></div>`);
    }
    if (captured.length) {
      rows.push(`<div class="bs-row"><span class="bs-k">🎺 招降得宠</span><span class="bs-v">${captured.join('、')} 已入随行</span></div>`);
    }
    if (petLevelUps.length) {
      rows.push(`<div class="bs-row"><span class="bs-k">🐾 仙宠成长</span><span class="bs-v">${petLevelUps.map(u => `${u.name} Lv.${u.from}→${u.to}`).join('、')}</span></div>`);
    }

    const overlay = document.createElement('div');
    overlay.className = 'battle-summary-overlay';
    overlay.innerHTML = `
      <div class="battle-summary-card">
        <div class="battle-summary-head">🎉 对决得胜 · 战果清点</div>
        ${rows.length ? `<div class="battle-summary-rows">${rows.join('')}</div>` : ''}
        ${pendingHints.length ? `
          <div class="battle-summary-pending">
            <div class="bs-pending-title">📌 尚待领取 (未入行囊)</div>
            <div class="bs-pending-text">有奖励因行囊已满暂存于对应人物处，回访交谈、腾出空位后即可补领，不会丢失。</div>
          </div>
        ` : ''}
        <div class="battle-summary-foot">点击收起</div>
      </div>
    `;
    overlay.addEventListener('click', () => {
      if (overlay && overlay.parentNode) overlay.remove();
    });
    const host = document.getElementById('game-viewport') || document.body;
    host.appendChild(overlay);
    setTimeout(() => {
      if (overlay && overlay.parentNode) overlay.remove();
    }, 9000);
  }

  endBattle(status = 'victory') {
    if (!this.currentBattle || this.isAnimatingCombat) return false;
    // 同一场战斗只允许结算一次：倒计时与逃跑同帧竞争时不再重复触发回调与提示
    if (this._battleEnding) return false;
    if (status === 'victory' && this.currentBattle.enemies.some(e => e.hp > 0)) return false;
    if (status === 'defeat' && this.currentBattle.allies.some(a => a.isPlayer && a.hp > 0)) return false;
    if (status === 'escaped' && this.currentBattle.status !== 'escaped') return false;
    const layer = document.getElementById('battle-screen-layer');
    if (!this.currentBattle && (!layer || layer.style.display === 'none')) return;
    this._battleEnding = true;

    const battle = this.currentBattle;
    this.stopBattleLoop();
    this.stopBattleCountdown();
    this.battleSkillMenuOpen = false;
    this.battleTargetMenuOpen = false;
    this.pendingSkillAction = null;
    this.isAnimatingCombat = false;
    this.battleCastCue = null;
    this.activeBattleEffects = [];

    if (battle) {
      try {
        if (typeof battle.syncStateBack === 'function') battle.syncStateBack();
        this.clearBattlePresentation(battle);
      } catch (e) {
        console.warn('清退战场表现数据捕获异常:', e);
      }
    }

    if (layer) layer.style.display = 'none';
    this.isPaused = false;

    const vCb = this.battleVictoryCallback;
    const dCb = this.battleDefeatCallback;
    this.currentBattle = null;
    this.battleVictoryCallback = null;
    this.battleDefeatCallback = null;
    this.autoMovePath = [];
    this.autoMoveTargetCallback = null;
    this.keysDown = {};
    this._encounterCooldownUntil = Date.now() + 1800;

    if (status === 'victory') {
      // P5.3: 快照结算前状态，捕获奖励到账情况与满包待领取提示，随后展示战果清点
      // (对 endBattle.call(plainFixture) 等外部调用保持防御，快照能力缺失时静默跳过清点)
      const canSummary = (typeof this._snapshotVictoryState === 'function') && (typeof this.showBattleVictorySummary === 'function');
      const before = canSummary ? this._snapshotVictoryState() : null;
      const pendingHints = [];
      let origShowMsg = null;
      if (canSummary && typeof window.showGameMessage === 'function') {
        origShowMsg = window.showGameMessage;
        window.showGameMessage = (msg, type, dur) => {
          if (typeof msg === 'string' && /行囊|整理背包|腾出|装不下|暂存|保管|先由他/.test(msg)) {
            pendingHints.push(msg);
          }
          return origShowMsg(msg, type, dur);
        };
      }
      try {
        // 参战宠获得全额经验，备战宠半额；本场新招降的宠不追领经验。
        const petExp = battle.enemies.filter(e => !e.isCaptured).reduce((sum, e) => sum + 50 + (e.level || 1) * 25, 0);
        for (const pet of this.pets || []) {
          if (!battle.trainingPetIds?.includes(pet.instanceId)) continue;
          const participated = battle.allies.some(a => a.entity?.instanceId === pet.instanceId);
          window.PetSystem.gainExp(pet, participated ? petExp : Math.floor(petExp / 2));
        }
        if (window.Sound && window.Sound.playVictory) {
          try { window.Sound.playVictory(); } catch (e) { }
        }
        window.showGameMessage('🎉【对决得胜】敌军溃败！斩妖除魔大获全胜！', 'success', 3500);
        if (vCb) {
          try { vCb(); } catch (cbErr) { console.error('战斗胜利回调异常:', cbErr); }
        }
      } finally {
        if (origShowMsg) window.showGameMessage = origShowMsg;
      }
      if (before) this.showBattleVictorySummary(before, battle, pendingHints);
    } else if (status === 'defeat') {
      if (window.Sound && window.Sound.playFailure) {
        try { window.Sound.playFailure(); } catch (e) { }
      }
      window.showGameMessage('⚠️【气血枯竭】负伤败退，天界神泉已重新抚平体魄……', 'error', 3500);
      if (this.playerData) this.playerData.hp = this.playerData.maxHp;
      if (dCb) {
        try { dCb(); } catch (cbErr) { console.error('战斗失败回调异常:', cbErr); }
      }
    } else if (status === 'escaped') {
      if (window.Sound && window.Sound.playBeep) {
        try { window.Sound.playBeep(); } catch (e) { }
      }
      window.showGameMessage('💨【险象环生】施展遁地妙术成功脱离了战斗！', 'info', 2500);
    }
    this.updatePlayerHud();
    this.saveAutoProgress();
    // 结算完成，解除一次性哨兵；下一场战斗重新开始
    this._battleEnding = false;
    return true;
  }

  // 执行战斗交锋回合与动作打击演算
  async executeCombatRound() {
    if (!this.currentBattle || this.isAnimatingCombat || this.currentBattle.status === 'executing') return;
    // 已在结算或已分出胜负的战斗不再进入回合，避免回调重复
    if (this._battleEnding) return;
    if (['victory', 'defeat', 'escaped'].includes(this.currentBattle.status)) return;

    // 敌方若已全部阵亡，立即判定胜利结案
    const aliveEnemiesBefore = (typeof this.currentBattle.getAliveEnemies === 'function')
      ? this.currentBattle.getAliveEnemies()
      : (this.currentBattle.enemies || []).filter(e => e.hp > 0);
    if (aliveEnemiesBefore.length === 0) {
      this.endBattle('victory');
      return;
    }
    const alivePlayerBefore = (this.currentBattle.allies || []).some(a => a.isPlayer && a.hp > 0);
    if (!alivePlayerBefore) {
      this.endBattle('defeat');
      return;
    }

    this.battleSkillMenuOpen = false;
    this.battleTargetMenuOpen = false;
    this.pendingSkillAction = null;
    this.battleCastCue = null;

    // 锁定指令菜单，杜绝交锋演算期间鼠标滑过触发重排与重叠
    const menuContainer = document.getElementById('battle-honeycomb-menu');
    if (menuContainer) {
      menuContainer.style.pointerEvents = 'none';
      menuContainer.style.opacity = '0.35';
    }

    // 确保选定存活目标
    let validTargetIdx = this.selectedTargetIndex;
    if (validTargetIdx === undefined || validTargetIdx === null || !this.currentBattle.enemies[validTargetIdx] || this.currentBattle.enemies[validTargetIdx].hp <= 0) {
      const firstAliveIdx = this.currentBattle.enemies.findIndex(e => e.hp > 0);
      validTargetIdx = firstAliveIdx >= 0 ? firstAliveIdx : 0;
      this.selectedTargetIndex = validTargetIdx;
    }

    // 为未指定行动的友方默认设置普攻
    this.currentBattle.allies.forEach(a => {
      if (a.hp > 0 && !this.currentBattle.actions[a.id]) {
        this.currentBattle.setAllyAction(a.id, {
          type: 'attack',
          targetIndex: validTargetIdx
        });
      }
    });

    const battle = this.currentBattle;
    this.isAnimatingCombat = true;
    this.stopBattleCountdown();

    try {
      this.prepareBattlePresentation(battle);
      await battle.executeRound(async (step) => {
        if (this.currentBattle !== battle) return;
        // 实时更新底部战报条，无需摧毁主舞台DOM
        const logBox = document.getElementById('battle-log-box-2d');
        if (logBox && this.currentBattle && this.currentBattle.logs) {
          logBox.innerHTML = this.currentBattle.logs.slice(-2).map(l => `<div>${l}</div>`).join('');
          logBox.scrollTop = logBox.scrollHeight;
        }

        await this.playBattleStep(step, battle);
      });
    } catch (roundErr) {
      console.error('战斗演算异常捕获，已自动恢复输入状态:', roundErr);
      if (this.currentBattle === battle && battle.status === 'executing') {
        this.currentBattle.status = 'player_input';
      }
    } finally {
      this.clearBattlePresentation(battle);
      if (this.currentBattle === battle) this.isAnimatingCombat = false;
      const menuContainer = this.currentBattle === battle && document.getElementById('battle-honeycomb-menu');
      if (menuContainer) {
        menuContainer.style.pointerEvents = 'auto';
        menuContainer.style.opacity = '1';
      }
    }

    if (!this.currentBattle) return;
    if (this.currentBattle !== battle) return;

    // 智能胜负兜底保障：只要敌方全部阵亡，必须判胜并彻底清退！
    const aliveEnemiesAfter = (typeof this.currentBattle.getAliveEnemies === 'function')
      ? this.currentBattle.getAliveEnemies()
      : (this.currentBattle.enemies || []).filter(e => e.hp > 0);
    const alivePlayer = (this.currentBattle.allies || []).some(a => a.isPlayer && a.hp > 0);

    if (aliveEnemiesAfter.length === 0 || this.currentBattle.status === 'victory') {
      this.endBattle('victory');
      return;
    } else if (!alivePlayer || this.currentBattle.status === 'defeat') {
      this.endBattle('defeat');
      return;
    } else if (this.currentBattle.status === 'escaped') {
      this.endBattle('escaped');
      return;
    } else {
      this.selectedAllyId = 'player';
      this.startBattleCountdown();
      this.renderBattleInterface();

      // 若开启了自动出招，自动进入下一回合
      if (this.autoCombatEnabled) {
        setTimeout(() => {
          if (this.currentBattle === battle && this.autoCombatEnabled && !this.isAnimatingCombat && battle.status !== 'executing') {
            this.executeCombatRound();
          }
        }, 600);
      }
    }
  }

  // 兼容调用接口
  execCombat(type, skillId = null) {
    return this.chooseCombatAction(type, skillId);
  }


  // 仙宠专属：战斗中替换出战仙宠 (保留原血量)
  openSwitchPetModal(allyId) {
    const backupPets = this.pets.filter(p => !this.currentBattle.allies.some(a => a.entity?.instanceId === p.instanceId));

    const modalHtml = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-window" onclick="event.stopPropagation()" style="max-width:360px;">
          <div class="modal-header">
            <span class="modal-title">🔄 替换参战仙宠</span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body" style="font-size:11px;color:#fef0cd;line-height:1.6;">
            <div style="color:#aaa;margin-bottom:8px;">
              请选择要召唤上阵替换的随行仙宠 (出战将继承其当前血量与精力)：
            </div>
            <div style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
              ${backupPets.length === 0 ? `<div style="text-align:center;color:#887766;padding:12px;">无备战仙宠可替换</div>` : ''}
              ${backupPets.map(p => `
                <div style="background:#20140b;border:1px solid #5c4732;border-radius:6px;padding:6px 8px;display:flex;justify-content:space-between;align-items:center;">
                  <div>
                    <div style="color:#ffd700;font-weight:bold;">${p.name} (Lv.${p.level})</div>
                    <div style="font-size:10px;color:${p.hp < p.maxHp ? '#ff6b81' : '#2ecc71'};">
                      气血: ${p.hp} / ${p.maxHp} · 法力: ${p.mp} / ${p.maxMp}
                    </div>
                  </div>
                  <button class="dialogue-opt-btn" style="padding:3px 8px;font-size:10px;" onclick="window.App2D.doSwitchPetInBattle('${allyId}', '${p.instanceId}'); this.closest('.modal-overlay').remove();">
                    召唤上阵
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    const v = document.getElementById('game-viewport') || document.body;
    v.insertAdjacentHTML('beforeend', modalHtml);
  }

  doSwitchPetInBattle(allyId, petInstanceId) {
    if (!this.currentBattle) return;
    const res = this.currentBattle.switchPet(allyId, petInstanceId, this.pets);
    window.Sound.playLevelUp();
    window.showGameMessage(res.msg, res.success ? 'success' : 'warning');
    this.renderBattleInterface();
  }

  // 确认招降野怪
  confirmCaptureTarget(allyId, targetIdx) {
    if (!this.currentBattle) return;
    const targetEnemy = this.currentBattle.enemies[targetIdx];
    if (!targetEnemy) return;

    const q = targetEnemy.quality || 'ordinary';
    let reqText = '普通野怪，80% 概率招降成功！';
    if (q === 'sanxian') {
      const cnt = this.inventory.getItemCount('silver_gourd');
      reqText = `散仙级灵兽！需消耗【紫竹银葫芦】*1 (持有: ${cnt} 只)，成功率 70%！`;
    } else if (q === 'jinxian') {
      const cnt = this.inventory.getItemCount('gold_gourd');
      reqText = `金仙级圣兽！需消耗【紫金红葫芦】*1 (持有: ${cnt} 只)，成功率 60%！`;
    }

    this.showConfirmModal({
      title: '法宝招降真言',
      content: `确定要尝试招降【${targetEnemy.name}】吗？\n${reqText}`,
      confirmText: '降伏收纳',
      cancelText: '罢手收兵',
      onConfirm: () => {
        this.execAllyAction(allyId, 'capture', targetIdx);
      }
    });
  }


  // =========================================================================
  // 三大门派自由皈依与绝技研习面板 (金刚/妖魔/神仙)
  // =========================================================================
  openClassSelectModal() {
    if (window.Dialogue) window.Dialogue.close();

    const classesData = window.GAME_DATA.CLASSES || {};
    const curClassId = this.playerData.classId || 'jingang';

    const modalHtml = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-window" onclick="event.stopPropagation()" style="max-width:540px;width:92%;">
          <div class="modal-header">
            <span class="modal-title">☯️ 三界门派正统与绝技神通</span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body" style="max-height:75vh;overflow-y:auto;padding-right:6px;">
            <div style="font-size:11px;color:#c59b27;margin-bottom:12px;line-height:1.6;background:rgba(0,0,0,0.35);padding:8px;border-radius:6px;border:1px solid #5c4732;">
              三界浩瀚，道法万千。少侠可自由研习与皈依金刚、妖魔、神仙三大无上正统，各门派皆传承三门通天彻地的专属绝学！
            </div>

            ${Object.values(classesData).map(c => `
              <div style="background:rgba(20,15,10,0.85);border:1.5px solid ${c.id === curClassId ? '#ffd700' : '#5c4732'};border-radius:8px;padding:12px;margin-bottom:12px;box-shadow:0 4px 15px rgba(0,0,0,0.6);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <div>
                    <span style="font-size:15px;font-weight:bold;color:${c.id === 'jingang' ? '#f39c12' : (c.id === 'yaomo' ? '#ff4757' : '#1e90ff')};">
                      ${c.name}门派
                    </span>
                    <span style="font-size:11px;color:#ffd700;margin-left:6px;">${c.title}</span>
                  </div>
                  <div>
                    ${c.id === curClassId ? `
                      <span style="background:#27ae60;color:#fff;font-size:10px;padding:3px 8px;border-radius:4px;font-weight:bold;">已皈依当前门派</span>
                    ` : `
                      <button class="dialogue-opt-btn" onclick="window.App2D.changeClass('${c.id}'); this.closest('.modal-overlay').remove();" style="padding:4px 10px;font-size:11px;">
                        皈依入此门派 ▶
                      </button>
                    `}
                  </div>
                </div>

                <div style="font-size:11px;color:#aaa;margin-bottom:8px;line-height:1.5;">${c.desc}</div>

                <!-- 技能列表 -->
                <div style="display:grid;grid-template-columns:1fr;gap:6px;">
                  ${c.skills.map(sk => `
                    <div style="background:rgba(0,0,0,0.5);border:1px solid #443322;border-radius:6px;padding:6px 10px;display:flex;gap:10px;align-items:flex-start;">
                      <span style="font-size:18px;line-height:1;">${sk.icon || '✨'}</span>
                      <div style="flex:1;">
                        <div style="display:flex;justify-content:space-between;">
                          <span style="color:#ffd700;font-weight:bold;font-size:12px;">${sk.name}</span>
                          <span style="font-size:10px;color:#7bed9f;">
                            消耗: ${sk.costMp ? `${sk.costMp}精力` : '无'}${sk.costHpRatio ? ` + 自损${Math.floor(sk.costHpRatio * 100)}%当前HP` : ''}
                          </span>
                        </div>
                        <div style="font-size:10px;color:#eee;margin-top:2px;line-height:1.4;">${sk.desc}</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    const v3 = document.getElementById('game-viewport') || document.body;
    v3.insertAdjacentHTML('beforeend', modalHtml);
  }

  // 执行转职
  changeClass(classId) {
    const res = this.playerData.switchClass(classId);
    if (res.success) {
      this.playerChar.title = this.playerData.title;
      this.updatePlayerHud();
      window.Sound.playLevelUp();
      window.showGameMessage(`🎉 成功皈依【${res.className}】门派！已领悟全新门派通天绝技！`, 'success', 3500);
    }
  }

  // 画面主渲染
  // 视觉升级：远景氛围层 —— 天色渐变 + 双层视差远山 + 缓行流云。
  // 纯程序化绘制 (每帧十余次路径填充，零纹理加载)；洞窟/水下等封闭场景保持原有氛围不叠加。
  renderSkyAmbience() {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    if (!ctx || !W || !H) return;

    const mapId = this.currentMapId || '';
    // 封闭/水下场景不画天色 (洞窟、宫殿内景、水底保持原有光照)
    if (/dong|gong|shuilien|xiagu/i.test(mapId)) return;

    // 以地图 id 生成稳定种子：远山轮廓跨帧跨会话不抖动
    let seed = 7;
    for (let i = 0; i < mapId.length; i++) seed = (seed * 131 + mapId.charCodeAt(i)) >>> 0;
    const rand = (() => {
      let s = seed >>> 0;
      return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    })();

    // 三套国风水色 (按地图稳定选择)：青绿山水 / 晨曦金 / 暮霭蓝
    const palettes = [
      { skyTop: '#0d1712', skyBottom: '#22392b', ridgeFar: 'rgba(38,74,56,0.85)', ridgeNear: 'rgba(24,50,38,0.95)', cloud: 'rgba(180,210,190,0.07)' },
      { skyTop: '#171120', skyBottom: '#3a2b1d', ridgeFar: 'rgba(84,64,46,0.8)', ridgeNear: 'rgba(52,38,28,0.95)', cloud: 'rgba(235,205,160,0.08)' },
      { skyTop: '#0e1420', skyBottom: '#26313f', ridgeFar: 'rgba(58,72,92,0.8)', ridgeNear: 'rgba(34,44,60,0.95)', cloud: 'rgba(190,205,225,0.07)' }
    ];
    const pal = palettes[seed % palettes.length];

    // 1. 天色渐变
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, pal.skyTop);
    sky.addColorStop(1, pal.skyBottom);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // 2. 双层视差远山 (轮廓由种子正弦合成，随镜头轻微平移)
    const ridge = (baseY, amp, parallax, color, phase) => {
      ctx.beginPath();
      ctx.moveTo(0, H);
      const offX = -(this.camera?.x || 0) * parallax;
      for (let x = 0; x <= W; x += 16) {
        const wx = x - offX;
        const y = baseY
          + Math.sin(wx * 0.008 + phase) * amp
          + Math.sin(wx * 0.021 + phase * 2.7) * amp * 0.45
          + Math.sin(wx * 0.003 + phase * 0.6) * amp * 0.8;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };
    ridge(H * 0.40, H * 0.07, 0.12, pal.ridgeFar, rand() * Math.PI * 2);
    ridge(H * 0.55, H * 0.09, 0.26, pal.ridgeNear, rand() * Math.PI * 2);

    // 3. 缓行流云 (时间驱动极慢漂移，低动态模式下静止)
    const cloudDrift = this.isReducedMotionEnabled() ? 0 : (Date.now() * 0.0038);
    ctx.fillStyle = pal.cloud;
    for (let i = 0; i < 4; i++) {
      const cy = H * (0.10 + rand() * 0.22);
      const cw = W * (0.22 + rand() * 0.3);
      const speed = 0.5 + rand() * 0.7;
      const rawX = rand() * (W + cw * 2) - cloudDrift * speed;
      const cx = ((rawX % (W + cw * 2)) + (W + cw * 2)) % (W + cw * 2) - cw;
      ctx.beginPath();
      ctx.ellipse(cx, cy, cw * 0.5, H * 0.028, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  render() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const mapData = window.GAME_DATA.MAPS_2D[this.currentMapId];
    if (!mapData) return;

    // 0.5 远景氛围层：天色渐变 + 视差远山 + 缓行流云 (瓦片未覆盖的地图边缘不再是死黑)
    this.renderSkyAmbience();

    // 1. 地图瓦片
    this.tilemap.render(this.ctx, mapData, this.camera, { ginsengTree: this.getWuzhuangTreeState() });

    // 2. 主线任务世界大光柱与跳动感叹号指引
    if (this.minimap) {
      this.minimap.renderWorldQuestBeacon(this.ctx, this.camera, this.currentMapId, this.storyPhase, mapData);
    }

    // 3. 次世代动态粒子
    if (this.particleSystem) {
      this.particleSystem.render(this.ctx, this.camera);
    }

    // 4. 鼠标点击金色仙气涟漪
    this.renderClickRipples();

    // 4.5 渲染天宫·蟠桃胜境中的实体仙木与发光仙桃
    if (this.currentMapId === 'tiangong_pantao' && mapData.peachTrees) {
      this.renderPeachTrees(mapData.peachTrees);
    }

    // 5. NPC
    this.npcs.forEach(npc => {
      const isNear = Math.hypot(npc.x - this.playerChar.x, npc.y - this.playerChar.y) < npc.interactRadius;
      npc.render(this.ctx, this.camera, isNear);
    });

    // 6. 怪物
    this.monsters.forEach(m => {
      if (m.x >= this.camera.x - 32 && m.x <= this.camera.x + this.camera.viewportWidth + 32 &&
        m.y >= this.camera.y - 32 && m.y <= this.camera.y + this.camera.viewportHeight + 32) {
        this.getShanhai().observe(m, this.currentMapId);
      }
      m.render(this.ctx, this.camera, false);
    });

    // 7. 玩家
    this.playerChar.render(this.ctx, this.camera, false);

    // 8. ☯️ 八卦乾坤引路法阵 (双层旋转符文、地面太极流光投影与悬浮云纹牌匾)
    if (mapData.portals) {
      this.renderMagicPortals(mapData.portals);
    }

    // 9. 渲染左上角雷达小地图系统
    if (this.minimap) {
      this.minimap.render(this.ctx, mapData, this.playerChar, this.storyPhase);
    }

    // 10. 电影级水墨暗角景深与古典环境光 (聚拢中央视野，增强神话画卷沉浸感)
    const w = this.canvas.width;
    const h = this.canvas.height;
    const vigGrad = this.ctx.createRadialGradient(w / 2, h / 2, w * 0.38, w / 2, h / 2, w * 0.78);
    vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vigGrad.addColorStop(1, 'rgba(8, 6, 4, 0.42)');
    this.ctx.fillStyle = vigGrad;
    this.ctx.fillRect(0, 0, w, h);
  }

  // 渲染蟠桃胜境中实体大仙树与结满的仙桃
  renderPeachTrees(peachTrees) {
    if (!peachTrees || !Array.isArray(peachTrees)) return;
    const ctx = this.ctx;
    const now = Date.now();

    for (const tree of peachTrees) {
      const sx = tree.x - this.camera.x;
      const sy = tree.y - this.camera.y;

      // 视锥体剔除
      if (sx < -80 || sx > this.camera.viewportWidth + 80 || sy < -80 || sy > this.camera.viewportHeight + 80) {
        continue;
      }

      ctx.save();

      // 1. 脚下深色苍劲古树投影与仙根地脉
      ctx.fillStyle = 'rgba(12, 10, 8, 0.45)';
      ctx.beginPath();
      ctx.ellipse(sx, sy + 22, 28, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. 粗壮仙木树干 (苍劲古朴双色树干)
      ctx.fillStyle = '#4a2c16';
      ctx.beginPath();
      ctx.moveTo(sx - 8, sy + 20);
      ctx.lineTo(sx - 5, sy - 8);
      ctx.lineTo(sx + 5, sy - 8);
      ctx.lineTo(sx + 8, sy + 20);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#6b4226';
      ctx.beginPath();
      ctx.moveTo(sx - 4, sy + 18);
      ctx.lineTo(sx - 2, sy - 6);
      ctx.lineTo(sx + 3, sy - 6);
      ctx.lineTo(sx + 5, sy + 18);
      ctx.closePath();
      ctx.fill();

      // 3. 繁茂层叠仙云树冠 (依品级带不同仙光：3000青碧，6000霞粉，9000金紫)
      let foliageColor = '#27ae60';
      let auraColor = 'rgba(46, 204, 113, 0.35)';
      if (tree.tier === 'tier_6000') {
        foliageColor = '#2980b9';
        auraColor = 'rgba(232, 67, 147, 0.45)';
      } else if (tree.tier === 'tier_9000') {
        foliageColor = '#8e44ad';
        auraColor = 'rgba(255, 215, 0, 0.55)';
      }

      // 树冠祥云外光晕
      const breathe = Math.sin(now / 350) * 2.5;
      ctx.fillStyle = auraColor;
      ctx.beginPath();
      ctx.arc(sx, sy - 16, 32 + breathe, 0, Math.PI * 2);
      ctx.fill();

      // 树冠层叠圆簇
      ctx.fillStyle = foliageColor;
      ctx.beginPath();
      ctx.arc(sx - 16, sy - 14, 18, 0, Math.PI * 2);
      ctx.arc(sx + 16, sy - 14, 18, 0, Math.PI * 2);
      ctx.arc(sx, sy - 26, 22, 0, Math.PI * 2);
      ctx.fill();

      // 树冠高光
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(sx - 6, sy - 28, 12, 0, Math.PI * 2);
      ctx.fill();

      // 4. 树梢挂着的大仙桃实体
      const peachY = sy - 16 + Math.sin(now / 220) * 2;
      if (!tree.isHarvested) {
        // 仙桃金粉光环
        ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(sx, peachY, 13, 0, Math.PI * 2);
        ctx.fill();

        // 仙桃本体 (粉红渐变饱满仙桃)
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🍑', sx, peachY);

        // 绝品仙桃额外紫金星芒
        if (tree.tier === 'tier_9000') {
          ctx.fillStyle = '#fffa65';
          ctx.font = '10px sans-serif';
          ctx.fillText('✨', sx + 10, peachY - 8);
        }
      } else {
        // 仙桃已摘，枝头微露嫩绿灵芽
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🍃', sx, peachY);
      }

      // 5. 树顶称号与木牌名
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';

      const tagText = `${tree.name} ${tree.isHarvested ? '(已采摘)' : '(成熟)'}`;
      const metrics = ctx.measureText(tagText);
      const bgW = metrics.width + 12;

      // 牌匾底色
      ctx.fillStyle = 'rgba(20, 15, 12, 0.78)';
      ctx.fillRect(sx - bgW / 2, sy - 52, bgW, 16);
      ctx.strokeStyle = tree.isHarvested ? '#7f8c8d' : (tree.tier === 'tier_9000' ? '#f1c40f' : '#e84393');
      ctx.lineWidth = 1;
      ctx.strokeRect(sx - bgW / 2, sy - 52, bgW, 16);

      ctx.fillStyle = tree.isHarvested ? '#bdc3c7' : (tree.tier === 'tier_9000' ? '#ffd700' : '#ff9ff3');
      ctx.fillText(tagText, sx, sy - 38);

      // 6. 玩家靠近提示 (当玩家走至仙树附近时，头顶跳出交互指引)
      const playerDist = Math.hypot(tree.x - this.playerChar.x, (tree.y + 10) - this.playerChar.y);
      if (playerDist < 58 && !tree.isHarvested) {
        const tipY = sy - 66 + Math.sin(now / 150) * 3;
        ctx.fillStyle = '#f39c12';
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.font = 'bold 12px "Microsoft YaHei", sans-serif';
        ctx.strokeText('🍑 [点击或空格确认采摘]', sx, tipY);
        ctx.fillStyle = '#fff200';
        ctx.fillText('🍑 [点击或空格确认采摘]', sx, tipY);
      }

      ctx.restore();
    }
  }

  // 绘制鼠标点击仙气波纹
  renderClickRipples() {
    this.ctx.save();
    for (const rip of this.clickRipples) {
      const sx = rip.x - this.camera.x;
      const sy = rip.y - this.camera.y;
      this.ctx.strokeStyle = `rgba(255, 215, 0, ${rip.alpha})`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(sx, sy, rip.radius, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.strokeStyle = `rgba(243, 156, 18, ${rip.alpha * 0.6})`;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.arc(sx, sy, rip.radius * 0.6, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  // =========================================================================
  // 1. 金柳露仙宠洗炼重铸系统 (经典洗宝宝)
  // =========================================================================
  openPetWashModal(instanceId) {
    if (window.Dialogue) window.Dialogue.close();
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());

    const pet = this.pets.find(p => p.instanceId === instanceId) || this.pets[0];
    if (!pet) {
      window.showGameMessage('身上暂无随行仙宠可洗炼！', 'warning');
      return;
    }

    const jllCount = this.inventory ? this.inventory.getItemCount('jin_liu_lu') : 0;
    const wash = this.tempWashResult?.instanceId === pet.instanceId ? this.tempWashResult : null;

    const modalHtml = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-window" onclick="event.stopPropagation()" style="max-width:540px;width:95%;">
          <div class="modal-header">
            <span class="modal-title">🧴 三界通灵 · 金柳露仙宠洗炼仙鉴</span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body" style="padding:12px;font-size:11px;color:#fef0cd;line-height:1.6;">
            <!-- 头部仙宠选择与金柳露存量 -->
            <div style="background:#20140b;border:1px solid #c59b27;border-radius:6px;padding:8px 12px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
              <div style="display:flex;align-items:center;gap:10px;">
                <div style="width:42px;height:42px;border-radius:50%;border:1.8px solid #ffd700;overflow:hidden;background:#2d1a0d;box-shadow:0 0 10px rgba(255,215,0,0.4);flex-shrink:0;display:flex;align-items:center;justify-content:center;">
                  ${(() => {
        if (window.VisualIdentity && window.Portraits) return window.Portraits.getPortraitSvg(this.getUnitVisualId(pet), 42);
        const pId = pet.templateId || pet.id;
        if (pId && window.Portraits?.customMonsterImages?.[pId]) {
          return window.Portraits.getPortraitSvg(pId, 42);
        }
        const pName = (pet.name || '').toLowerCase();
        let rId = 'rat';
        if (pName.includes('猿猴将') || pName.includes('猛猿')) rId = 'yuanhou_jiang';
        else if (pName.includes('猕猴将') || pName.includes('灵猕')) rId = 'mihou_jiang';
        else if (pName.includes('树精') || pName.includes('枯树')) rId = 'kushu_jing';
        else if (pName.includes('树妖')) rId = 'shuyao';
        else if (pName.includes('青蛇') || pName.includes('小花蛇')) rId = 'xiaohua_she';
        else if (pName.includes('蛇妖')) rId = 'sheyao';
        else if (pName.includes('啸月') || pName.includes('狼妖')) rId = 'langyao';
        else if (pName.includes('野狼') || pName.includes('山狼')) rId = 'wolf_wild';
        else if (pName.includes('龟') || pName.includes('玄武')) rId = 'turtle';
        else if (pName.includes('蛇')) rId = 'snake';
        else if (pName.includes('狐')) rId = 'fox';
        else if (pName.includes('狼')) rId = 'wolf';
        else if (pName.includes('虎')) rId = 'tiger';
        else if (pName.includes('熊')) rId = 'bear';
        else if (pName.includes('蚌')) rId = 'clam';
        else if (pName.includes('蟹')) rId = 'crab';
        else if (pName.includes('虾')) rId = 'shrimp';
        else if (pName.includes('猪')) rId = 'pig';
        else if (pName.includes('猿') || pName.includes('猴')) rId = 'ape';
        else if (pName.includes('龙')) rId = 'xiaobailong';
        return window.Portraits ? window.Portraits.getPortraitSvg(rId, 42) : `<span style="font-size:24px;">${pet.icon || '🐾'}</span>`;
      })()}
                </div>
                <div>
                  <div style="font-weight:bold;font-size:13px;color:#ffd700;">${pet.name} (Lv.${pet.level})</div>
                  <div style="font-size:10px;color:#aaa;">品质: 【${pet.qualityName}】 | 门派: ${pet.className || '无'}</div>
                </div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:11px;">拥有金柳露: <span style="color:#2ed573;font-weight:bold;font-size:13px;">${jllCount}</span> 瓶</div>
                <div style="font-size:9px;color:#bbb;">每次洗炼消耗 1 瓶</div>
              </div>
            </div>

            <!-- 双栏资质对比面板 -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
              <!-- 当前资质 -->
              <div style="background:#150d06;border:1px solid #4a331c;border-radius:6px;padding:10px;">
                <div style="font-weight:bold;color:#ffd700;border-bottom:1px solid #332211;padding-bottom:4px;margin-bottom:8px;text-align:center;">
                  📜 当前资质与成长
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>等级:</span><span style="color:#aaa;">Lv.${pet.level}</span></div>
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>状态:</span><span style="color:${pet.isMutated ? '#ffd700' : '#aaa'};">${pet.isMutated ? '✨变异宝宝' : '原版灵宠'}</span></div>
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>成长率:</span><span style="color:#ffd700;font-weight:bold;">${pet.growth}</span></div>
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>气血资质:</span><span>${pet.aptitudes.hp}</span></div>
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>攻击资质:</span><span>${pet.aptitudes.atk}</span></div>
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>防御资质:</span><span>${pet.aptitudes.def}</span></div>
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>法力资质:</span><span>${pet.aptitudes.matk}</span></div>
                <div style="display:flex;justify-content:space-between;"><span>速度资质:</span><span>${pet.aptitudes.spd}</span></div>
              </div>

              <!-- 洗炼后新资质预览 -->
              <div style="background:#150d06;border:1px solid ${wash ? '#2ed573' : '#332211'};border-radius:6px;padding:10px;">
                <div style="font-weight:bold;color:${wash ? '#2ed573' : '#887766'};border-bottom:1px solid #332211;padding-bottom:4px;margin-bottom:8px;text-align:center;">
                  ✨ 洗炼预览结果
                </div>
                ${wash ? `
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>洗后等级:</span><span style="color:#2ed573;">Lv.1 幼年</span></div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>洗后形态:</span><span style="color:${wash.isMutated ? '#ffd700' : '#2ed573'};font-weight:bold;">${wash.name}</span></div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span>成长率:</span>
                    <span style="font-weight:bold;color:${wash.growth >= pet.growth ? '#2ed573' : '#ff4757'};">
                      ${wash.growth} ${wash.growth >= pet.growth ? '▲' : '▼'}
                    </span>
                  </div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span>气血资质:</span>
                    <span style="color:${wash.aptitudes.hp >= pet.aptitudes.hp ? '#2ed573' : '#ff4757'};">
                      ${wash.aptitudes.hp} ${wash.aptitudes.hp >= pet.aptitudes.hp ? '▲' : '▼'}
                    </span>
                  </div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span>攻击资质:</span>
                    <span style="color:${wash.aptitudes.atk >= pet.aptitudes.atk ? '#2ed573' : '#ff4757'};">
                      ${wash.aptitudes.atk} ${wash.aptitudes.atk >= pet.aptitudes.atk ? '▲' : '▼'}
                    </span>
                  </div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span>防御资质:</span>
                    <span style="color:${wash.aptitudes.def >= pet.aptitudes.def ? '#2ed573' : '#ff4757'};">
                      ${wash.aptitudes.def} ${wash.aptitudes.def >= pet.aptitudes.def ? '▲' : '▼'}
                    </span>
                  </div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span>法力资质:</span>
                    <span style="color:${wash.aptitudes.matk >= pet.aptitudes.matk ? '#2ed573' : '#ff4757'};">
                      ${wash.aptitudes.matk} ${wash.aptitudes.matk >= pet.aptitudes.matk ? '▲' : '▼'}
                    </span>
                  </div>
                  <div style="display:flex;justify-content:space-between;">
                    <span>速度资质:</span>
                    <span style="color:${wash.aptitudes.spd >= pet.aptitudes.spd ? '#2ed573' : '#ff4757'};">
                      ${wash.aptitudes.spd} ${wash.aptitudes.spd >= pet.aptitudes.spd ? '▲' : '▼'}
                    </span>
                  </div>
                ` : `
                  <div style="text-align:center;color:#665544;padding:40px 0;">
                    尚未洗炼<br>点击下方按钮消耗 1 瓶金柳露刷新资质！
                  </div>
                `}
              </div>
            </div>

            <!-- 操作按钮 -->
            <div style="display:flex;gap:10px;justify-content:center;">
              <button class="dialogue-opt-btn" style="flex:1;padding:8px;background:#c59b27;color:#000;font-weight:bold;font-size:12px;" onclick="window.App2D.rollPetWash('${pet.instanceId}')">
                🧴 催动金柳露洗炼 (消耗1瓶)
              </button>
              ${wash ? `
                <button class="dialogue-opt-btn" style="flex:1;padding:8px;background:#2ecc71;color:#000;font-weight:bold;font-size:12px;" onclick="window.App2D.confirmPetWash('${pet.instanceId}')">
                  ✅ 确认替换为新资质
                </button>
                <button class="dialogue-opt-btn" style="padding:8px 14px;background:#e74c3c;font-size:12px;" onclick="window.App2D.tempWashResult=null;window.App2D.openPetWashModal('${pet.instanceId}')">
                  ❌ 放弃
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    const v = document.getElementById('game-viewport') || document.body;
    v.insertAdjacentHTML('beforeend', modalHtml);
  }

  rollPetWash(instanceId) {
    const pet = this.pets.find(p => p.instanceId === instanceId);
    if (!pet) return;
    if (!this.inventory || this.inventory.getItemCount('jin_liu_lu') < 1) {
      window.showGameMessage('身上未持有【金柳露】，可前往东海龙宫珍宝阁选购！', 'warning');
      return;
    }
    this.inventory.removeItem('jin_liu_lu', 1);
    this.tempWashResult = window.PetSystem.generateWashResult(pet);
    window.Sound.playMagic();
    window.showGameMessage('🧴 金柳露甘霖洒下！仙宠灵根重塑，请检视右侧洗炼结果！', 'success');
    this.openPetWashModal(instanceId);
  }

  confirmPetWash(instanceId) {
    const pet = this.pets.find(p => p.instanceId === instanceId);
    if (!pet || !this.tempWashResult) return;
    if (!window.PetSystem.applyWashResult(pet, this.tempWashResult)) {
      window.showGameMessage('这份洗炼结果属于另一只仙宠，请返回原仙宠确认。', 'warning');
      return;
    }
    this.tempWashResult = null;
    window.Sound.playCrit();
    window.showGameMessage(`🎉 ${pet.name} 洗炼完成，成长与资质已更新。`, 'success', 4500);
    this.openPetWashModal(instanceId);
  }

  // 魔兽要诀打书研习界面
  openPetBookModal(instanceId) {
    if (window.Dialogue) window.Dialogue.close();
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());

    const pet = this.pets.find(p => p.instanceId === instanceId);
    if (!pet) return;

    if (!pet.passives) pet.passives = [];

    // 从背包中筛选所有的魔兽要诀
    const booksInBag = [];
    if (this.inventory && this.inventory.slots) {
      this.inventory.slots.forEach(s => {
        const itemDef = window.GAME_DATA.ITEMS[s.itemId];
        if (itemDef && itemDef.type === 'pet_book') {
          booksInBag.push({ def: itemDef, count: s.count || 1 });
        }
      });
    }

    const modalHtml = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-window" onclick="event.stopPropagation()" style="max-width:440px;width:94%;">
          <div class="modal-header">
            <span class="modal-title">📚 仙宠研习魔兽要诀 · 打书</span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body" style="padding:10px;font-size:11px;color:#fef0cd;line-height:1.6;">
            <!-- 当前仙宠信息 -->
            <div style="background:#20140b;border:1px solid #c59b27;border-radius:6px;padding:8px 10px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
              <div>
                <span style="font-size:18px;">${pet.icon || '🐾'}</span>
                <span style="font-weight:bold;color:#ffd700;font-size:12px;margin-left:4px;">${pet.name} (Lv.${pet.level})</span>
              </div>
              <span style="font-size:10px;color:#bbb;">已参悟: ${pet.passives.length} / 4 槽位</span>
            </div>

            <!-- 当前已学被动神技 -->
            <div style="background:#150d06;border:1px solid #4a331c;border-radius:6px;padding:6px 10px;margin-bottom:10px;">
              <div style="color:#aaa;font-size:10px;margin-bottom:4px;">当前已领悟被动神技 (打书可能顶替旧技能)：</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                ${[0, 1, 2, 3].map(i => {
      const p = pet.passives[i];
      if (p) {
        return `<span style="background:#2c3e50;border:1px solid #f39c12;border-radius:4px;padding:2px 6px;color:#f1c40f;font-size:10px;">${p.icon || '📖'} ${p.name}</span>`;
      } else {
        return `<span style="border:1px dashed #555;border-radius:4px;padding:2px 6px;color:#666;font-size:10px;">[空槽位]</span>`;
      }
    }).join('')}
              </div>
            </div>

            <!-- 背包中的要诀列表 -->
            <div style="color:#ffd700;font-weight:bold;font-size:11px;margin-bottom:6px;">📦 背包中的魔兽要诀：</div>
            <div style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
              ${booksInBag.length === 0 ? `
                <div style="text-align:center;color:#887766;padding:20px;background:#150d06;border-radius:6px;">
                  背包中暂无魔兽要诀！<br>
                  <span style="font-size:10px;color:#aaa;">可前往东海龙宫【四海珍宝阁】选购或降妖除魔获得！</span>
                </div>
              ` : booksInBag.map(b => `
                <div style="background:#1a1109;border:1px solid #4a331c;border-radius:6px;padding:6px 10px;display:flex;justify-content:space-between;align-items:center;">
                  <div>
                    <div style="font-weight:bold;color:#ffd700;font-size:11px;">
                      ${b.def.icon} ${b.def.name} <span style="color:#2ecc71;font-size:10px;">x${b.count}</span>
                    </div>
                    <div style="color:#bbb;font-size:9px;">${b.def.desc}</div>
                  </div>
                  <button class="dialogue-opt-btn" style="padding:4px 10px;font-size:10px;background:#27ae60;font-weight:bold;white-space:nowrap;" onclick="window.App2D.learnPetBook('${pet.instanceId}', '${b.def.id}')">
                    研习领悟
                  </button>
                </div>
              `).join('')}
            </div>

            <div style="display:flex;justify-content:flex-end;margin-top:10px;">
              <button class="dialogue-opt-btn" style="padding:4px 12px;background:#34495e;font-size:10px;" onclick="window.App2D.openPetManageModal()">
                返回仙宠列表
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const v = document.getElementById('game-viewport') || document.body;
    v.insertAdjacentHTML('beforeend', modalHtml);
  }

  // 研习魔兽要诀打书
  learnPetBook(instanceId, bookItemId) {
    const pet = this.pets.find(p => p.instanceId === instanceId);
    if (!pet || !this.inventory) return;

    if (this.inventory.getItemCount(bookItemId) < 1) {
      window.showGameMessage('背包中该魔兽要诀数量不足！', 'error');
      return;
    }

    const res = window.PetSystem.learnPetSkillBook(pet, bookItemId);
    if (!res.success) {
      window.showGameMessage(res.msg, 'warning');
      return;
    }

    // 扣除一本要诀
    this.inventory.removeItem(bookItemId, 1);
    window.Sound.playLevelUp();
    window.showGameMessage(res.msg, 'success', 4500);

    // 刷新打书界面
    this.openPetBookModal(instanceId);
  }
  openForgeModal(selectedSlotKey = 'weapon', useProtectStone = false) {
    if (window.Dialogue) window.Dialogue.close();
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());

    const equip = this.playerData.equipment[selectedSlotKey];
    const baseItem = equip ? window.GAME_DATA.ITEMS[equip.itemId] : null;
    const curStar = (equip && equip.star) || 0;
    const info = window.ForgeSystem.getEnhanceInfo(curStar);

    const qianghuaCount = this.inventory ? this.inventory.getItemCount('qianghua_shi') : 0;
    const meteorCount = this.inventory ? this.inventory.getItemCount('meteor_iron') : 0;
    const totalStones = qianghuaCount + meteorCount;
    const dingxingCount = this.inventory ? this.inventory.getItemCount('dingxing_shi') : 0;

    const slotNames = {
      weapon: '⚔️ 武器',
      armor: '🥋 铠甲',
      head: '👑 头盔',
      boots: '🥾 鞋靴',
      belt: '🎗️ 腰带',
      necklace: '📿 项链'
    };

    const modalHtml = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-window" onclick="event.stopPropagation()" style="max-width:560px;width:95%;">
          <div class="modal-header">
            <span class="modal-title">🔨 大唐名匠 · 神兵天成装备淬炼打造</span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body" style="padding:12px;font-size:11px;color:#fef0cd;line-height:1.6;">
            <!-- 部位切换标签 (切换部位时重置保护开关状态) -->
            <div style="display:flex;gap:4px;margin-bottom:12px;background:#150d06;padding:4px;border-radius:6px;">
              ${Object.keys(slotNames).map(k => `
                <button class="dialogue-opt-btn" style="flex:1;padding:4px;font-size:10px;${selectedSlotKey === k ? 'background:#c59b27;color:#000;font-weight:bold;' : ''}" onclick="window.App2D.openForgeModal('${k}', false)">
                  ${slotNames[k]}
                </button>
              `).join('')}
            </div>

            <!-- 装备详情与星级 -->
            <div style="background:#20140b;border:1px solid #c59b27;border-radius:6px;padding:12px;margin-bottom:12px;">
              ${equip && baseItem ? `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                  <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:32px;">${baseItem.icon || '⚔️'}</span>
                    <div>
                      <div style="font-size:14px;font-weight:bold;color:#ffd700;">
                        ${curStar > 0 ? `<span style="color:#e74c3c;font-size:16px;">+${curStar} </span>` : ''}${baseItem.name}
                      </div>
                      <div style="font-size:10px;color:#aaa;">品阶: ${baseItem.quality} | 装备槽位: ${slotNames[selectedSlotKey]}</div>
                    </div>
                  </div>
                  <div style="text-align:right;">
                    <div style="color:#ffd700;font-weight:bold;font-size:14px;">${'⭐'.repeat(Math.min(curStar, 6))}${curStar > 6 ? ` (+${curStar})` : ''}</div>
                    <div style="font-size:9px;color:#aaa;">最高可强化至 +12 星</div>
                  </div>
                </div>

                <!-- 属性与提升对比 -->
                <div style="background:#150d06;border-radius:6px;padding:8px 12px;margin-bottom:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                  <div>
                    <div style="color:#aaa;font-size:10px;border-bottom:1px solid #332211;padding-bottom:2px;margin-bottom:4px;">当前装备属性</div>
                    ${baseItem.attrs.atk ? `<div>物理攻击: <span style="color:#ffd700;">+${Math.floor(baseItem.attrs.atk * (1 + curStar * 0.12))}</span></div>` : ''}
                    ${baseItem.attrs.def ? `<div>物理防御: <span style="color:#2ecc71;">+${Math.floor(baseItem.attrs.def * (1 + curStar * 0.12))}</span></div>` : ''}
                    ${baseItem.attrs.hp ? `<div>气血加成: <span style="color:#ff6b81;">+${Math.floor(baseItem.attrs.hp * (1 + curStar * 0.12))}</span></div>` : ''}
                    ${baseItem.attrs.spd ? `<div>出手速度: <span style="color:#70a1ff;">+${Math.floor(baseItem.attrs.spd * (1 + curStar * 0.12))}</span></div>` : ''}
                  </div>
                  <div>
                    <div style="color:#2ed573;font-size:10px;border-bottom:1px solid #332211;padding-bottom:2px;margin-bottom:4px;">强化 +${curStar + 1} 后预计</div>
                    ${info ? `
                      ${baseItem.attrs.atk ? `<div style="color:#2ed573;">物理攻击: +${Math.floor(baseItem.attrs.atk * (1 + (curStar + 1) * 0.12))} (+12%)</div>` : ''}
                      ${baseItem.attrs.def ? `<div style="color:#2ed573;">物理防御: +${Math.floor(baseItem.attrs.def * (1 + (curStar + 1) * 0.12))} (+12%)</div>` : ''}
                      ${baseItem.attrs.hp ? `<div style="color:#2ed573;">气血加成: +${Math.floor(baseItem.attrs.hp * (1 + (curStar + 1) * 0.12))} (+12%)</div>` : ''}
                      ${baseItem.attrs.spd ? `<div style="color:#2ed573;">出手速度: +${Math.floor(baseItem.attrs.spd * (1 + (curStar + 1) * 0.12))} (+12%)</div>` : ''}
                    ` : `<div style="color:#ffd700;">已达天道极限满星！</div>`}
                  </div>
                </div>

                <!-- 强化消耗、成功率与定星石保护开关 -->
                ${info ? `
                  <div style="background:rgba(0,0,0,0.3);border-radius:6px;padding:8px 12px;margin-bottom:10px;font-size:11px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                      <span>淬火成功率:</span>
                      <span style="color:#ffd700;font-weight:bold;">${Math.round(info.rate * 100)}%</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                      <span>需要强化材料:</span>
                      <span style="color:${totalStones >= info.costStones ? '#2ecc71' : '#e74c3c'};font-weight:bold;">
                        强化石/陨铁: ${totalStones} / ${info.costStones} 颗
                      </span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                      <span>所需锻造银两:</span>
                      <span style="color:${this.playerData.silver >= info.costSilver ? '#2ecc71' : '#e74c3c'};">
                        ${info.costSilver} 两 (拥有: ${this.playerData.silver}两)
                      </span>
                    </div>
                    ${info.penalty !== 'none' ? `
                      <div style="color:#ff6b81;font-size:10px;margin-top:4px;">
                        ⚠️ 淬火失手惩罚：若失败将掉落 ${info.penalty === 'down_1' ? '1' : '2'} 星！                      </div>
                      <div style="margin-top:6px;padding:6px 10px;background:rgba(20,12,6,0.7);border:1px solid ${useProtectStone && dingxingCount > 0 ? '#ffd700' : '#4a331c'};border-radius:6px;display:flex;align-items:center;justify-content:space-between;">
                        <label style="display:flex;align-items:center;gap:6px;cursor:${dingxingCount > 0 ? 'pointer' : 'not-allowed'};color:${dingxingCount > 0 ? '#fff' : '#888'};font-size:11px;">
                          <input type="checkbox" id="forge-protect-toggle" ${useProtectStone && dingxingCount > 0 ? 'checked' : ''} ${dingxingCount < 1 ? 'disabled' : ''} onchange="window.App2D.openForgeModal('${selectedSlotKey}', this.checked)">
                          <span>✨ 使用【定星石】保护（失败不降星）</span>
                        </label>
                        <span style="font-size:10px;color:${dingxingCount > 0 ? '#ffd700' : '#e74c3c'};">拥有: ${dingxingCount} 颗</span>
                      </div>
                    ` : `
                      <div style="color:#2ecc71;font-size:10px;margin-top:4px;">
                        🛡️ 当前星级安全淬火：即使失败也不会降星，无需消耗定星石。
                      </div>
                    `}
                  </div>

                  <!-- 按钮 -->
                  <button class="dialogue-opt-btn" style="width:100%;padding:10px;background:#e67e22;color:#fff;font-weight:bold;font-size:13px;" onclick="window.App2D.executeForgeEnhance('${selectedSlotKey}')">
                    🔥 炉火纯青 · 立即淬炼升星
                  </button>
                ` : `
                  <div style="text-align:center;color:#ffd700;padding:10px;font-weight:bold;">✨ 此装备已达最高境界，神威盖世！</div>
                `}
              ` : `
                <div style="text-align:center;color:#887766;padding:30px;">当前部位未穿戴任何装备，请先在背包中穿戴！</div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;

    const v = document.getElementById('game-viewport') || document.body;
    v.insertAdjacentHTML('beforeend', modalHtml);
  }

  executeForgeEnhance(slotKey, explicitUseProtect = null) {
    const equip = this.playerData.equipment[slotKey];
    if (!equip) {
      window.showGameMessage('未找到对应部位的穿戴装备！', 'warning');
      return { success: false, msg: '未找到对应部位的穿戴装备！' };
    }

    const protectCheckbox = document.getElementById('forge-protect-toggle');
    const useProtect = (explicitUseProtect !== null) ? !!explicitUseProtect : (protectCheckbox ? protectCheckbox.checked : false);

    const res = window.ForgeSystem.enhance(equip, this.inventory, this.playerData, useProtect);    this.updatePlayerHud();
    window.showGameMessage(res.msg, res.success ? 'success' : 'warning');

    const remainingProtect = this.inventory ? this.inventory.getItemCount('dingxing_shi') : 0;
    this.openForgeModal(slotKey, useProtect && remainingProtect > 0);
    return res;
  }

  // =========================================================================
  // 3. 东海龙宫珍宝阁 (选购金柳露、三阶宝石、陨铁)
  // =========================================================================
  openDragonShopModal() {
    if (window.Dialogue) window.Dialogue.close();
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());

    const shopItems = [
      { id: 'jin_liu_lu', price: 1500, tag: '洗宠圣水' },
      { id: 'meteor_iron', price: 800, tag: '装备强化' },
      { id: 'silver_gourd', price: 800, tag: '招降散仙' },
      { id: 'gold_gourd', price: 2500, tag: '招降金仙' },
      { id: 'gem_jingang', price: 2500, tag: '抗物理' },
      { id: 'gem_sheli', price: 2800, tag: '抗舍生' },
      { id: 'gem_pilei', price: 2600, tag: '抗雷霆' },
      { id: 'gem_qingxin', price: 3500, tag: '抗封印' },
      { id: 'gem_dingshen', price: 3500, tag: '抗定身' },
      { id: 'book_high_critical', price: 8000, tag: '高级兽诀' },
      { id: 'book_high_vampire', price: 8500, tag: '高级兽诀' },
      { id: 'book_high_rebirth', price: 12000, tag: '高级兽诀' },
      { id: 'book_high_speed', price: 6000, tag: '高级兽诀' },
      { id: 'book_high_sneak', price: 7000, tag: '高级兽诀' }
    ];

    const modalHtml = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-window" onclick="event.stopPropagation()" style="max-width:520px;width:95%;">
          <div class="modal-header">
            <span class="modal-title">🐚 东海龙宫 · 四海珍宝阁 (龟丞相管事)</span>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body" style="padding:12px;font-size:11px;color:#fef0cd;line-height:1.6;">
            <div style="display:flex;justify-content:space-between;align-items:center;background:#150d06;padding:6px 12px;border-radius:6px;margin-bottom:10px;">
              <span>当前持有银两: <span style="color:#ffd700;font-weight:bold;">${this.playerData.silver} 两</span></span>
              <span style="color:#aaa;font-size:10px;">四海通宝，童叟无欺</span>
            </div>
            <div style="max-height:280px;overflow-y:auto;display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              ${shopItems.map(item => {
      const it = window.GAME_DATA.ITEMS[item.id];
      if (!it) return '';
      return `
                  <div style="background:#20140b;border:1px solid #4a331c;border-radius:6px;padding:8px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div>
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
                        <span style="font-size:18px;">${it.icon}</span>
                        <span style="font-weight:bold;color:#ffd700;">${it.name}</span>
                        <span style="font-size:9px;color:#2ecc71;border:1px solid #2ecc71;border-radius:3px;padding:0 2px;">${item.tag}</span>
                      </div>
                      <div style="font-size:9px;color:#bbb;margin-bottom:6px;">${it.desc.slice(0, 30)}...</div>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <span style="color:#ffd700;font-weight:bold;">${item.price} 两</span>
                      <button class="dialogue-opt-btn" style="padding:2px 8px;font-size:10px;background:#c59b27;color:#000;font-weight:bold;" onclick="window.App2D.buyDragonShopItem('${item.id}', ${item.price})">
                        购买
                      </button>
                    </div>
                  </div>
                `;
    }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    const v = document.getElementById('game-viewport') || document.body;
    v.insertAdjacentHTML('beforeend', modalHtml);
  }

  buyDragonShopItem(itemId, price) {
    if (!window.GAME_DATA.ITEMS[itemId] || !Number.isSafeInteger(price) || price < 0) return false;
    if (this.playerData.silver < price) {
      window.showGameMessage(`银两不足！购买该珍宝需 ${price} 两白银。`, 'warning');
      return false;
    }
    if (!this.inventory?.addItem(itemId, 1)) {
      window.showGameMessage('行囊已满，珍宝阁暂替你留着宝物；腾出空位再购买。', 'warning');
      return false;
    }
    this.playerData.silver -= price;
    const it = window.GAME_DATA.ITEMS[itemId];
    window.Sound.playSuccess();
    window.showGameMessage(`🎉 成功从龙宫珍宝阁购得【${it ? it.name : '宝物'}】*1！`, 'success');
    this.updatePlayerHud();
    this.openDragonShopModal();
    return true;
  }

  // =========================================================================
  // 4. 东海龙宫深海试炼 Boss 战 (战覆海蛟龙，夺定海神针)
  // =========================================================================
  claimDonghaiTrialReward() {
    if (!this.playerData.storyEvents?.donghai_trial_won || this.playerData.storyRewards?.donghai_trial) return false;
    const result = this.playerData.claimStoryReward('donghai_trial', {
      items: [
        { itemId: 'dinghai_shenzhen', count: 1 },
        { itemId: 'gold_gourd', count: 1 },
        { itemId: 'bishui_zhu', count: 1 }
      ],
      exp: 8000,
      silver: 6000
    }, this.inventory);
    if (!result.success) {
      window.showGameMessage('龙宫三件神兵重宝先由敖广保管，整理出行囊空位后再向龙王领取。', 'warning', 5000);
      return false;
    }
    if (window.Sound) window.Sound.playCrit();
    this.updatePlayerHud();
    window.showGameMessage('🎉【深海试炼通关】力斩覆海蛟龙王！龙王大喜，赠予神兵【定海神针铁·仿】、【紫金红葫芦】、【避水神珠】并赐银6000两！', 'success', 6000);
    this.saveAutoProgress();
    return true;
  }

  triggerDonghaiTrialBattle() {
    if (this.playerData.storyRewards?.donghai_trial) {
      window.showGameMessage('少侠已荡平覆海蛟龙王并领受神针重宝，深海结界安稳如初！', 'info', 4000);
      return;
    }
    if (this.playerData.storyEvents?.donghai_trial_won) {
      this.claimDonghaiTrialReward();
      return;
    }

    const jiaolong = {
      id: 'boss_jiaolong_wang',
      name: '覆海蛟龙王',
      isBoss: true,
      quality: 'jinxian',
      level: 35,
      hp: 4200,
      maxHp: 4200,
      mp: 1200,
      maxMp: 1200,
      atk: 280,
      def: 110,
      matk: 240,
      mdef: 120,
      spd: 48,
      resistances: { res_feisha: 0.15, res_leiting: 0.15, res_phy: 0.10 }
    };

    const yecha = {
      id: 'mob_kuang_yecha',
      name: '巡海狂夜叉',
      isBoss: false,
      quality: 'sanxian',
      level: 30,
      hp: 2200,
      maxHp: 2200,
      mp: 600,
      maxMp: 600,
      atk: 210,
      def: 85,
      matk: 130,
      mdef: 70,
      spd: 40
    };

    this.start2DBattle([jiaolong, yecha], () => {
      this.playerData.storyEvents = this.playerData.storyEvents || {};
      this.playerData.storyEvents.donghai_trial_won = true;
      this.claimDonghaiTrialReward();
    });
  }

  // =========================================================================
  // 5. 钟馗降妖除魔日常悬赏抓鬼系统
  // =========================================================================
  acceptZhongkuiGhostQuest() {
    if (this.ghostQuest && this.ghostQuest.active && !this.ghostQuest.completed) {
      window.showGameMessage(`你已有伏魔令在身：速往【${this.ghostQuest.mapName}】斩杀恶鬼【${this.ghostQuest.targetName}】！`, 'info', 4000);
      return;
    }

    const questPool = [
      { mapId: 'liujiacun', mapName: '两界山·刘家村', targetName: '迷途黑山恶鬼', level: 12, hp: 1000, atk: 85, def: 35, spd: 30 },
      { mapId: 'wuxingshan', mapName: '两界山·五行山', targetName: '幽冥噬魂厉鬼', level: 18, hp: 1500, atk: 125, def: 52, spd: 36 },
      { mapId: 'yingchoujian', mapName: '蛇盘山·鹰愁涧', targetName: '黑水吸髓水鬼', level: 25, hp: 2100, atk: 180, def: 75, spd: 42 },
      { mapId: 'chentangguan', mapName: '陈塘关·九湾河', targetName: '翻江巡海煞鬼', level: 30, hp: 2800, atk: 230, def: 95, spd: 45 }
    ];

    const q = questPool[Math.floor(Math.random() * questPool.length)];
    this.ghostQuest = {
      active: true,
      completed: false,
      mapId: q.mapId,
      mapName: q.mapName,
      targetName: q.targetName,
      level: q.level,
      hp: q.hp,
      atk: q.atk,
      def: q.def,
      spd: q.spd
    };

    window.Sound.playSuccess();
    window.showGameMessage(`📜【接取伏魔令】钟馗天师有令：速往【${q.mapName}】降伏作祟恶鬼【${q.targetName}】！`, 'success', 5000);

    // 若当前就在该地图，立即刷新怪物列表
    if (this.currentMapId === q.mapId) {
      this.loadMap(q.mapId);
    }
  }

  submitZhongkuiGhostQuest() {
    if (!this.ghostQuest || !this.ghostQuest.active) {
      window.showGameMessage('钟馗：“少侠尚未接取任何伏魔通缉令，可先接取任务再行除魔！”', 'warning');
      return false;
    }
    if (!this.ghostQuest.completed) {
      window.showGameMessage(`钟馗：“那【${this.ghostQuest.targetName}】仍在【${this.ghostQuest.mapName}】作恶，少侠切莫懈怠，速速前去诛之！”`, 'warning');
      return false;
    }

    if (this.inventory && !this.inventory.canAddItems([{ itemId: 'jin_liu_lu', count: 1 }])) {
      window.showGameMessage('钟馗：“少侠行囊已满，无法容纳仙水【金柳露】！请先清理背包再来领赏。”', 'warning', 4500);
      return false;
    }

    // 发放奖励
    this.playerData.gainExp(3500);
    this.playerData.silver += 2000;
    this.inventory?.addItem('jin_liu_lu', 1);
    this.ghostQuest.active = false;
    this.ghostQuest.completed = false;

    window.Sound.playCrit();
    this.updatePlayerHud();
    window.showGameMessage('🎉【伏魔圆满】钟馗奏表天庭！获得修为经验+3500、纹银+2000两，并赏赐仙家圣水【金柳露】*1！', 'success', 5500);
    return true;
  }

  trackZhongkuiGhostTarget() {
    if (!this.ghostQuest || !this.ghostQuest.active) {
      window.showGameMessage('当前暂无进行中的降妖除魔任务！', 'warning');
      return;
    }
    if (this.ghostQuest.completed) {
      this.guideToMap('changan_city', '钟馗天师');
      return;
    }

    this.guideToMap(this.ghostQuest.mapId, this.ghostQuest.targetName);
  }

  // =========================================================================
  // 5. 大唐镖局军饷押运系统 (运镖与劫镖战斗)
  // =========================================================================
  acceptEscortQuest() {
    if (this.escortQuest && this.escortQuest.active) {
      window.showGameMessage(`少侠身上已有押运任务：速将朝廷军饷送达【${this.escortQuest.targetMapName}·${this.escortQuest.targetNpcName}】！`, 'info', 4500);
      return;
    }

    if (this.playerData.silver < 1000) {
      window.showGameMessage('程咬金：“押运大唐军饷需缴纳 1000 两现银押金，少侠囊中羞涩，暂且无法领镖！”', 'warning', 4000);
      return;
    }

    const escortRoutes = [
      {
        targetMap: 'chentangguan',
        targetMapName: '东海要塞·陈塘关',
        targetNpc: 'npc_lijing_zongbing',
        targetNpcName: '李靖总兵',
        desc: '出长安南城门直达陈塘要塞李靖总兵府'
      },
      {
        targetMap: 'gaolaozhuang',
        targetMapName: '乌斯藏·高老庄',
        targetNpc: 'npc_gaotaigong',
        targetNpcName: '高太公',
        desc: '西出长安经刘家村与五行山、鹰愁涧直抵高老庄'
      },
      {
        targetMap: 'wuzhuangguan',
        targetMapName: '万寿山·五庄观',
        targetNpc: 'npc_zhenyuanzi',
        targetNpcName: '地仙之祖镇元子',
        desc: '长途跋涉历经流沙河与浮屠山直达万寿山五庄观'
      }
    ];

    const reachableRoutes = escortRoutes.filter(route=>this.isNpcVisibleInStoryPhase(route.targetNpc,this.storyPhase,route.targetMap));
    if (!reachableRoutes.length) {
      window.showGameMessage('目前没有可送达的镖路，先推进主线再来接令。', 'warning');
      return false;
    }
    if (!this.inventory?.addItem('biao_letter', 1)) {
      window.showGameMessage('行囊已满，放不下镖银凭信；腾出空位后再接令，押金尚未收取。', 'warning');
      return false;
    }
    const route = reachableRoutes[Math.floor(Math.random() * reachableRoutes.length)];
    this.playerData.silver -= 1000;

    this.escortQuest = {
      active: true,
      completed: false,
      targetMap: route.targetMap,
      targetMapName: route.targetMapName,
      targetNpc: route.targetNpc,
      targetNpcName: route.targetNpcName,
      desc: route.desc,
      deposit: 1000,
      rewardSilver: 3500,
      rewardExp: 4000
    };

    window.Sound.playSuccess();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.showGameMessage(`🚩【领取大唐军饷押运令】程咬金：“请少侠一路警惕，速将这批重金军饷送达【${route.targetMapName}】交付【${route.targetNpcName}】！”`, 'success', 5000);
    return true;
  }

  submitEscortQuest(targetNpcId) {
    if (!this.escortQuest || !this.escortQuest.active) {
      window.showGameMessage('当前并无正在护送的朝廷军饷差事！', 'warning');
      return;
    }

    if (this.escortQuest.targetNpc !== targetNpcId) {
      window.showGameMessage(`此批军饷乃朝廷所拨付，指明由【${this.escortQuest.targetNpcName}】亲启，非此地所纳！`, 'warning', 4000);
      return;
    }

    if (!this.inventory || this.inventory.getItemCount('biao_letter') < 1) {
      window.showGameMessage('身上未见【大唐朝廷军饷镖银】凭信，莫非在途中遗失了？！', 'error', 4500);
      return;
    }

    // 奖品只抽一次并写进镖令；满包重试不能换一本书。
    const bookPool = ['book_high_critical', 'book_high_vampire', 'book_high_rebirth', 'book_high_speed', 'book_high_sneak'];
    const rewardedBookId = bookPool.includes(this.escortQuest.rewardedBookId) ? this.escortQuest.rewardedBookId :
      bookPool[Math.floor(Math.random() * bookPool.length)];
    this.escortQuest.rewardedBookId = rewardedBookId;
    const draft = new window.Inventory(this.inventory.slots.map(slot=>({...slot})));
    draft.maxSlots = this.inventory.maxSlots;
    if (!draft.removeItem('biao_letter',1) || !draft.addItem(rewardedBookId,1)) {
      window.showGameMessage('凭信与军饷仍由你保管。行囊腾出空位后再向收镖人交付，押金和赏赐都不会丢。', 'warning', 5000);
      this.saveAutoProgress();
      return false;
    }
    this.inventory.slots = draft.slots;
    // 退还 1000 押金 + 额外发放 3500 赏银 = 4500 两
    this.playerData.silver += 4500;
    this.playerData.gainExp(this.escortQuest.rewardExp || 4000);
    const bookDef = window.GAME_DATA.ITEMS[rewardedBookId] || { name: '魔兽要诀·高级必杀' };

    const prevTargetName = this.escortQuest.targetNpcName;
    this.escortQuest = null;

    window.Sound.playCrit();
    this.updatePlayerHud();
    this.saveAutoProgress();
    window.showGameMessage(`🎉【押镖大功告成】${prevTargetName} 喜收军饷！退还押金1000两并赏银3500两、修行经验+4000，并重金赐予《${bookDef.name}》！`, 'success', 5500);
    return true;
  }

  checkEscortStatus() {
    if (!this.escortQuest || !this.escortQuest.active) {
      window.showGameMessage('程咬金：“少侠身上暂无押运差事，可随时支付 1000 两押金领取引信为朝廷效力！”', 'info');
      return;
    }
    window.showGameMessage(`🚩【运镖行进中】护送目标：【${this.escortQuest.targetMapName}·${this.escortQuest.targetNpcName}】！送达即享 4500 两现银与【魔兽要诀】！`, 'info', 5000);
  }

  // 触发运镖途中山贼劫镖战斗
  triggerEscortBanditBattle() {
    if (this.currentBattle || this.isPaused) return;
    const banditA = {
      id: 'mob_bandit_1',
      name: '截道响马首领',
      level: 28,
      hp: 3600,
      maxHp: 3600,
      mp: 1200,
      maxMp: 1200,
      atk: 180,
      def: 75,
      spd: 38,
      skills: ['舍生取义', '连击']
    };
    const banditB = {
      id: 'mob_bandit_2',
      name: '拦路截镖强盗',
      level: 25,
      hp: 2800,
      maxHp: 2800,
      mp: 800,
      maxMp: 800,
      atk: 140,
      def: 60,
      spd: 32,
      skills: []
    };

    window.showGameMessage('⚠️【警惕！山林劫镖】突然从道旁树丛杀出一伙截道山贼，欲抢夺大唐朝廷军饷！速速迎战！', 'warning', 4500);
    this.start2DBattle([banditA, banditB], () => {
      this.playerData.gainExp(2500);
      this.updatePlayerHud();
      window.Sound.playSuccess();
      window.showGameMessage('🎉【保镖大捷】击溃了截道山贼！镖银安然无恙，继续赶路！', 'success', 4500);
    });
  }

  // =========================================================================
  // 6. 任务卷轴追踪面板与八十一难历练功德簿 (快捷键 Q 打开)
  // =========================================================================
  getOrdealAndQuestInfo() {
    const sp = this.storyPhase || 'liujiacun_start';
    const trees = this.questKills?.trees || 0;
    const rats = this.questKills?.rats || 0;
    const mushrooms = this.questKills?.mushrooms || 0;
    const hooligans = this.questKills?.chentangHooligans || 0;

    let ordealNumber = '【第一难·两界投生】';
    let ordealName = '凡尘苏醒 · 刘家村启程';
    let ordealDesc = '从天界谪落凡尘两界山下，肉身受创，得猎户刘伯钦搭救，暂居刘家村调养。需帮刘伯钦拾柴做饭，肃清害虫，踏出取经凡尘第一步。';
    let chapter = '第一回 · 凡尘始觉';
    let stepName = '与刘伯钦对话';
    let stepTarget = '与救命恩人刘伯钦交谈，接下生火造饭差事';
    let stepProgress = '0/1';
    let stepProgressRatio = 0;
    let stepHint = '在刘家村中央与猎户刘伯钦交谈';
    let isDone = false;

    const ultimateGoal = '求取大乘真经三十五部，普度东土受苦众生，匡扶天道秩序，证得无上金身正果！';

    // 0. 优先尝试统一序章至长安主线历程查询 (R3 统一目标来源)
    if (window.GAME_DATA && typeof window.GAME_DATA.getUnifiedStoryLead === 'function') {
      const unified = window.GAME_DATA.getUnifiedStoryLead(sp, this.currentMapId, this.questKills, this.playerData);
      if (unified) {
        return {
          ordealNumber: unified.ordealNumber,
          ordealName: unified.ordealName,
          ordealDesc: unified.ordealDesc,
          chapter: unified.chapter,
          stepName: unified.stepName,
          stepTarget: unified.stepTarget,
          stepProgress: unified.stepProgress,
          stepProgressRatio: unified.stepProgressRatio,
          stepHint: unified.stepHint,
          isDone: !!unified.isDone,
          ultimateGoal
        };
      }
    }

    if (sp.startsWith('heaven_')) {
      ordealNumber = '【序章·天宫风云】';
      ordealName = '瑶池蟠桃与大闹天宫';
      ordealDesc = '天庭蟠桃胜会前夕，仙界暗潮汹涌，亲历大圣闹天宫与诸仙贬谪，勘破凡圣之谜。';
      chapter = '序章 · 仙界浩劫';
      stepName = '平息天宫风暴';
      stepTarget = '护送嫦娥离开水阁，并前往凌霄宝殿化解争端';
      stepProgress = '进行中';
      stepProgressRatio = 0.5;
      stepHint = '沿天宫走廊前行探索';
    } else if (sp === 'liujiacun_start') {
      ordealNumber = '【第一难·两界投生】';
      ordealName = '凡尘苏醒 · 刘家村启程';
      stepName = '拜见恩人刘伯钦';
      stepTarget = '与刘伯钦对话，了解当前处境并领受差事';
      stepProgress = '0/1';
      stepProgressRatio = 0;
      stepHint = '刘伯钦就在刘家村中间草屋前';
    } else if (sp === 'liujiacun_find_mushrooms') {
      ordealNumber = '【第一难·两界投生】';
      ordealName = '生火造饭 · 采摘青菇';
      stepName = '采摘野生青蘑菇';
      stepTarget = `在刘家村南草丛中采摘2朵新鲜野生青蘑菇 (${mushrooms}/2)`;
      stepProgress = `${mushrooms}/2`;
      stepProgressRatio = Math.min(1, mushrooms / 2);
      stepHint = '前往村南草丛边，点击青蘑菇即可采摘';
      isDone = mushrooms >= 2;
    } else if (sp === 'liujiacun_mushrooms_collected') {
      ordealNumber = '【第一难·两界投生】';
      ordealName = '生火造饭 · 交付青菇';
      stepName = '向刘伯钦交付青蘑菇';
      stepTarget = '青蘑菇已采齐！将蘑菇交给刘伯钦下锅';
      stepProgress = '2/2 (待交差)';
      stepProgressRatio = 1;
      stepHint = '找刘伯钦对话完成交付';
      isDone = true;
    } else if (sp === 'liujiacun_go_cut_wood' || sp === 'liujiacun_wood_gathering') {
      ordealNumber = '【第一难·两界投生】';
      ordealName = '劈柴取火 · 降伏枯树精';
      stepName = '击败枯树精取坚韧柴木';
      stepTarget = `前往五行山小径击败百年枯树精取柴 (${trees}/4)`;
      stepProgress = `${trees}/4`;
      stepProgressRatio = Math.min(1, trees / 4);
      stepHint = '从刘家村左侧路口进入五行山小径，击败一组枯树精可获得柴木';
      isDone = trees >= 4;
    } else if (sp === 'liujiacun_wood_collected') {
      ordealNumber = '【第一难·两界投生】';
      ordealName = '劈柴取火 · 交付柴木';
      stepName = '交付坚韧柴木';
      stepTarget = '4捆坚韧柴木已收集齐全！向刘伯钦复命生火';
      stepProgress = '4/4 (待交差)';
      stepProgressRatio = 1;
      stepHint = '回到刘家村与刘伯钦对话';
      isDone = true;
    } else if (sp === 'liujiacun_rat_hunting') {
      ordealNumber = '【第一难·两界投生】';
      ordealName = '粮仓守卫 · 除灭硕鼠';
      stepName = '消灭偷粮硕鼠';
      stepTarget = `在村中粮仓旁击败作祟偷粮硕鼠 (${rats}/4)`;
      stepProgress = `${rats}/4`;
      stepProgressRatio = Math.min(1, rats / 4);
      stepHint = '在刘家村粮仓附近遭遇偷粮硕鼠并战胜它们';
      isDone = rats >= 4;
    } else if (sp === 'liujiacun_rats_cleared') {
      ordealNumber = '【第一难·两界投生】';
      ordealName = '粮仓守卫 · 硕鼠剿除';
      stepName = '向刘伯钦复命';
      stepTarget = '4只偷粮硕鼠已全部消灭！回禀刘伯钦领取谢礼';
      stepProgress = '4/4 (待交差)';
      stepProgressRatio = 1;
      stepHint = '与刘伯钦对话，准备启程前往长安';
      isDone = true;
    } else if (sp === 'liujiacun_go_changan' || sp === 'changan_arrived') {
      ordealNumber = '【第二难·长安受戒】';
      ordealName = '大唐国都 · 长安拜帝';
      ordealDesc = '别过刘家村，前往盛唐繁华国都长安城，面见唐太宗李世民，拜竭金蝉转世玄奘法师，领西行取经大旨。';
      chapter = '第二回 · 皇都盛世';
      stepName = '前往长安城金銮殿';
      stepTarget = '前往长安城拜见太宗皇帝与玄奘法师';
      stepProgress = sp === 'changan_arrived' ? '1/1 已抵达' : '0/1 前往中';
      stepProgressRatio = sp === 'changan_arrived' ? 1 : 0.5;
      stepHint = '经由官道传送至长安城';
    } else if (sp === 'changan_meet_xuanzang') {
      ordealNumber = '【第二难·长安受戒】';
      ordealName = '化生古刹 · 拜见玄奘';
      ordealDesc = '初入长安，先往化生寺参拜金蝉转世的玄奘法师，共商西行取经大计，结下师徒同行之缘。';
      chapter = '第二回 · 皇都盛世';
      stepName = '前往化生寺拜见玄奘';
      stepTarget = '前往化生寺拜见玄奘法师';
      stepProgress = '0/1 前往中';
      stepProgressRatio = 0;
      stepHint = '化生寺钟声悠远，法师正于此静候';
    } else if (sp === 'changan_meet_taizong') {
      ordealNumber = '【第二难·长安受戒】';
      ordealName = '金銮宝殿 · 觐见太宗';
      ordealDesc = '既拜玄奘，再登长安金銮宝殿觐见唐太宗李世民，领受通关文牒，受命西行取回真经。';
      chapter = '第二回 · 皇都盛世';
      stepName = '金銮殿觐见唐太宗';
      stepTarget = '登金銮宝殿觐见太宗皇帝，领取通关文牒';
      stepProgress = '已见玄奘，待觐见太宗';
      stepProgressRatio = 0.5;
      stepHint = '金銮殿上太宗御座以待，文牒即将授予';
    } else if (sp === 'changan_farewell') {
      ordealNumber = '【第二难·长安受戒】';
      ordealName = '长安城门 · 辞别启程';
      ordealDesc = '文牒在手，再至长安城门口与刘伯钦依依惜别，就此告别繁华国都，踏上漫漫西行取经之路。';
      chapter = '第二回 · 皇都盛世';
      stepName = '城门口辞别刘伯钦';
      stepTarget = '前往长安城门口与刘伯钦送行辞别，随后西行启程';
      stepProgress = '待启程';
      stepProgressRatio = 0.8;
      stepHint = '西行第一站：五行山';
    } else if (sp.startsWith('chentang_') || sp.startsWith('donghai_') || sp.startsWith('longgong_')) {
      ordealNumber = '【第三难·陈塘除恶】';
      ordealName = '总兵李靖 · 平定混混';
      ordealDesc = '陈塘关街头地痞恶霸混混横行，总兵李靖下令肃清街市；东海龙宫波涛汹涌，探访定海神针异动。';
      chapter = '第三回 · 陈塘海潮';
      stepName = sp === 'chentang_defeat_hooligans' ? '制伏街头作恶混混' : '调查陈塘异动';
      stepTarget = sp === 'chentang_defeat_hooligans' ? `击败街头作恶的混混 (${hooligans}/4)` : '前往陈塘关总兵府向李靖复命或探访东海';
      stepProgress = sp === 'chentang_defeat_hooligans' ? `${hooligans}/4` : (sp === 'chentang_hooligans_done' ? '4/4 (待交差)' : '进行中');
      stepProgressRatio = sp === 'chentang_defeat_hooligans' ? Math.min(1, hooligans / 4) : 1;
      stepHint = '在陈塘关街市巡察混混踪迹';
      isDone = hooligans >= 4 || sp === 'chentang_hooligans_done';
    } else if (sp === 'wuxingshan_ready' || sp === 'wuxing_freed') {
      ordealNumber = '【第四难·五行脱困】';
      ordealName = '五指山巅 · 揭印解封';
      ordealDesc = '齐天大圣孙悟空被如来佛祖压在五行山下五百年，受尽铜汁铁丸之苦。需登上崖顶揭去六字真言神符，助大圣重获自由！';
      chapter = '第四回 · 齐天再起';
      stepName = '揭开如来神印';
      stepTarget = '登上五行山山顶绝壁，揭除【唵嘛呢叭咪吽】神符，救出孙悟空';
      stepProgress = sp === 'wuxing_freed' ? '已揭印脱困' : '待揭除神印';
      stepProgressRatio = sp === 'wuxing_freed' ? 1 : 0.5;
      stepHint = '沿五行山石阶一路登顶，触碰金光神符';
      isDone = sp === 'wuxing_freed';
    } else if (sp.startsWith('yingchou_')) {
      ordealNumber = '【第五难·鹰愁收龙】';
      ordealName = '深涧寒潭 · 白龙化马';
      ordealDesc = '西海龙王三太子因纵火烧毁明珠获罪，贬在鹰愁涧中。需降伏白龙，使其化为白龙马常伴取经人身侧。';
      chapter = '第五回 · 鹰愁飞龙';
      stepName = '战胜玉龙三太子';
      stepTarget = '在鹰愁涧深潭降伏白龙，收为坐骑';
      stepProgress = '已平复';
      stepProgressRatio = 1;
      stepHint = '鹰愁涧水阁石桥前探索';
      isDone = true;
    } else if (sp.startsWith('gaolao_')) {
      ordealNumber = '【第六难·高老招婿】';
      ordealName = '高老庄招亲 · 天蓬归正';
      ordealDesc = '福陵山云栈洞猪刚鬣强占高太公三女儿翠兰。需前去降伏八戒，化解高老庄灾厄，收天蓬为二师弟。';
      chapter = '第六回 · 高老烟云';
      stepName = '降伏猪八戒';
      stepTarget = '前往云栈洞降伏猪刚鬣，收为取经徒弟';
      stepProgress = '已收降';
      stepProgressRatio = 1;
      stepHint = '前往高老庄内宅了解详情';
      isDone = true;
    } else if (sp.startsWith('huangfeng_')) {
      ordealNumber = '【第七难·黄风三昧】';
      ordealName = '黄风山神沙 · 定风灵珠';
      ordealDesc = '黄风怪刮起漫天黄风，三昧神风吹天地暗。需往小须弥山求取定风丹，破除神风降伏恶怪。';
      chapter = '第七回 · 黄风狂卷';
      stepName = '破除三昧神风';
      stepTarget = '借得定风灵珠，降除黄风大圣';
      stepProgress = '已荡平';
      stepProgressRatio = 1;
      stepHint = '黄风岭怪石林立，借宝定风';
      isDone = true;
    } else if (sp === 'liusha_cleared') {
      const events = this.playerData.storyEvents || {};
      ordealNumber = '【第九难·五庄人参】';
      ordealName = '万寿山仙山 · 甘露救树';
      ordealDesc = '大圣一怒毁了人参果树。护人也须担责，交手之后邀观音以甘露救树，再与镇元大仙化解旧怨。';
      chapter = '第九回 · 人参果会';
      stepName = events.wuzhuang_tree_restored ? '领取五庄观赠礼' : events.wuzhuang_trial_won ? '践约救树' : '赴五庄观承担救树之责';
      stepTarget = events.wuzhuang_tree_restored ? '整理行囊，向镇元大仙领取人参果与混元道袍' :
        '与镇元大仙交谈，护住同行众人并留下相助';
      stepProgress = events.wuzhuang_tree_restored ? '宝树已复生，赠礼待领取' : events.wuzhuang_trial_won ? '交手已止，救树待议' : '待赴五庄观';
      stepProgressRatio = events.wuzhuang_tree_restored ? 0.9 : events.wuzhuang_trial_won ? 0.65 : 0.15;
      stepHint = '乌巢禅师的心经可顺路领悟；主线目标在万寿山五庄观。';
      isDone = false;
    } else if (sp.startsWith('liusha_')) {
      ordealNumber = '【第八难·流沙收徒】';
      ordealName = '流沙八百里 · 卷帘归真';
      ordealDesc = '流沙河八百里深不可测，鹅毛飘不起，芦花定底沉。降伏卷帘大将沙悟净，收为三师弟。';
      chapter = '第八回 · 流沙浩荡';
      stepName = '收服沙和尚';
      stepTarget = '降伏流沙河卷帘大将，师徒四人齐聚';
      stepProgress = '已归正';
      stepProgressRatio = 1;
      stepHint = '流沙河渡口以佛珠为舟渡过险水';
      isDone = true;
    } else if (sp.startsWith('wuzhuang_')) {
      ordealNumber = '【第九难·五庄人参】';
      ordealName = '万寿山仙山 · 甘露救树';
      ordealDesc = '万寿山五庄观人参果三千年一开花三千年一结果，大圣推倒宝树，需寻南海观音以玉净瓶甘露复活神树。';
      chapter = '第九回 · 人参果会';
      stepName = '甘露回春复活仙树';
      stepTarget = '救树践约，与镇元大仙结交，整装继续前往白虎岭';
      stepProgress = '已结义';
      stepProgressRatio = 1;
      stepHint = '五庄观大殿前与镇元大仙交谈';
      isDone = true;
    } else if (sp.startsWith('baihu_')) {
      ordealNumber = '【第十难·尸魔三戏】';
      ordealName = '白虎岭绝壁 · 三打白骨精';
      ordealDesc = '白骨夫人狡黠多变，先后化作村姑、老妪、老翁戏弄唐僧离间师徒。需火眼金睛识破幻术，三打白骨彻底除根！';
      chapter = '第十回 · 尸魔幻象';
      const rewardPending = sp === 'baihu_second_cleared' && this.playerData.storyEvents?.baigu_final_won;
      stepName = rewardPending ? '领取白骨岭战利品' : sp === 'baihu_first_cleared' ? '识破白骨老妪' : (sp === 'baihu_second_cleared' ? '识破白骨老翁' : '诛灭白骨精真身');
      stepTarget = rewardPending ? '整理行囊，到白虎岭找悟空领取白骨戒与金柳露' : '连续击破白骨夫人化身，荡平白虎岭妖氛';
      stepProgress = rewardPending ? '真身已破，战利品待领取' : sp === 'baihu_cleared' ? '妖氛已荡平' : (sp === 'baihu_second_cleared' ? '已击破2重化身' : '已击破1重化身');
      stepProgressRatio = rewardPending ? 0.9 : sp === 'baihu_cleared' ? 1 : (sp === 'baihu_second_cleared' ? 0.66 : 0.33);
      stepHint = '白虎岭怪石嶙峋，留心路旁求助者';
      isDone = sp === 'baihu_cleared';
    } else if (sp.startsWith('baoxiang_')) {
      const rewardPending = sp === 'baoxiang_boss_ready' && this.playerData.storyEvents?.huangpao_battle_won;
      ordealNumber = '【第十一难·宝象救主】';
      ordealName = '波月洞救难 · 黄袍降伏';
      ordealDesc = '二十八宿奎木狼私自下界化作黄袍怪，强掳宝象国百花羞公主十三载。降伏奎宿，解救公主与宝象国黎民。';
      chapter = '第十一回 · 宝象风云';
      stepName = rewardPending ? '入宫领取救主赏赐' : '降伏黄袍怪救回百花羞';
      stepTarget = rewardPending ? '整理行囊，找宝象国国王领取冷月宝刀与兽诀' : '攻入波月洞降伏黄袍怪，护送百花羞公主回宝象国王宫';
      stepProgress = rewardPending ? '妖王已降，赏赐待领' : sp === 'baoxiang_cleared' ? '功德圆满' : '进行中';
      stepProgressRatio = rewardPending ? 0.9 : sp === 'baoxiang_cleared' ? 1 : 0.5;
      stepHint = '宝象国王宫与波月洞之间奔行救难';
      isDone = sp === 'baoxiang_cleared';
    } else if (sp.startsWith('pingding_')) {
      ordealNumber = '【第十二难·莲花伏魔】';
      ordealName = '平顶山莲花洞 · 金银双角';
      ordealDesc = '太上老君金银童子下界为妖，携带紫金红葫芦、羊脂玉净瓶等五件至宝据守莲花洞。需收降猫妖狐众，智降老魔！';
      chapter = '第十二回 · 莲花双魔';
      stepName = '降伏金角银角大王';
      stepTarget = '智斗老魔，夺取五件道祖至宝，平息平顶山大劫';
      stepProgress = sp === 'pingding_cleared' ? '大获全胜' : '探险中';
      stepProgressRatio = sp === 'pingding_cleared' ? 1 : 0.6;
      stepHint = '平顶山林密洞深，小心猫妖围攻';
      isDone = sp === 'pingding_cleared';
    } else if (sp.startsWith('huoyun_')) {
      const bossWon = !!this.playerData?.storyEvents?.huoyun_boss_won;
      const rewardPending = bossWon && !this.playerData?.storyRewards?.huoyun_completion;
      ordealNumber = '【第十三难·火云三昧】';
      ordealName = '号山枯松涧 · 圣婴大王';
      ordealDesc = '号山火云洞妖王形貌如孩童，自称圣婴大王，在火焰山修得三昧真火，强征火租、烧焦山田三年。需辨其假意求救，破五行车阵，伏三昧真火。';
      chapter = '第十二回 · 火云烈焰';
      stepName = rewardPending ? '领取火云洞战利' :
        sp === 'huoyun_boss_ready' ? '破五行车阵，决战三昧真火' :
          sp === 'huoyun_redboy_ready' ? '识破假意求救' : '前往号山枯松涧';
      stepTarget = rewardPending ? '整理行囊，向悟空领取火云洞战利品' :
        sp === 'huoyun_boss_ready' ? '击破红孩儿真身，阻其再纵火烧山' :
          sp === 'huoyun_redboy_ready' ? '查验脚印与火痕，揭穿伪装后迎战' : '与号山土地神交谈，问明火云洞虚实';
      stepProgress = rewardPending ? '妖王已伏，战利待领' :
        sp === 'huoyun_cleared' ? '功德圆满' :
          sp === 'huoyun_boss_ready' ? '伪装已破，真身待伏' :
            sp === 'huoyun_redboy_ready' ? '已至枯松涧' : '待访土地';
      stepProgressRatio = rewardPending ? 0.9 : sp === 'huoyun_cleared' ? 1 :
        sp === 'huoyun_boss_ready' ? 0.7 : sp === 'huoyun_redboy_ready' ? 0.4 : 0.15;
      stepHint = sp === 'huoyun_cleared' ? '火云洞已平，西行大道重开' : '三昧真火非同凡火，水浇不灭，先破车阵';
      isDone = sp === 'huoyun_cleared';
    } else if (sp.startsWith('heishui_')) {
      const rewardPending = sp === 'heishui_reward_pending';
      ordealNumber = '【第十四难·黑水沉波】';
      ordealName = '衡阳峪黑水河 · 鼍洁夺府';
      ordealDesc = '泾河龙王第九子鼍洁占衡阳峪黑水河神府，赶走原河神，化作船夫摄走唐僧与八戒。需寻访失府河神、探明水府、请西海龙太子摩昂擒妖。';
      chapter = '第十三回 · 黑水擒龙';
      stepName = rewardPending ? '领取黑水河谢礼' :
        sp === 'heishui_boss_ready' ? '破其水势，为摩昂创造擒拿之机' :
          sp === 'heishui_moang_arrived' ? '听摩昂战前交代' :
            sp === 'heishui_aid_needed' ? '商议请援西海' :
              sp === 'heishui_scout_ready' ? '探查水府，击退守将' :
                sp === 'heishui_captives_taken' ? '寻访失府河神，问明河情' : '询问摆渡之法';
      stepTarget = rewardPending ? '整理行囊，向黑水河神领取谢礼' :
        sp === 'heishui_boss_ready' ? '牵制鼍洁、破其水势，由摩昂擒拿' :
          sp === 'heishui_moang_arrived' ? '与摩昂会合，确认救人及收服次序' :
            sp === 'heishui_aid_needed' ? '核实鼍洁来历，商议请西海援手' :
              sp === 'heishui_scout_ready' ? '随沙僧探查水府，击退守门水卒' :
                sp === 'heishui_captives_taken' ? '找到失府河神，问明夺府经过与水府入口' : '与渡口船夫交涉，安排过河';
      stepProgress = rewardPending ? '妖已擒，谢礼待领' :
        sp === 'heishui_cleared' ? '功德圆满' :
          sp === 'heishui_boss_ready' ? '摩昂已备，可战鼍洁' :
            sp === 'heishui_moang_arrived' ? '援军已至' :
              sp === 'heishui_aid_needed' ? '探战已胜，待请援' :
                sp === 'heishui_scout_ready' ? '入口已明' :
                  sp === 'heishui_captives_taken' ? '师父八戒失陷' : '初入黑水河';
      stepProgressRatio = rewardPending ? 0.9 : sp === 'heishui_cleared' ? 1 :
        sp === 'heishui_boss_ready' ? 0.8 : sp === 'heishui_moang_arrived' ? 0.65 :
          sp === 'heishui_aid_needed' ? 0.5 : sp === 'heishui_scout_ready' ? 0.35 :
            sp === 'heishui_captives_taken' ? 0.2 : 0.05;
      stepHint = sp === 'heishui_cleared' ? '黑水河事毕，师徒渡河东去' : '悟空不善水战，水中强攻不利，宜请援手';
      isDone = sp === 'heishui_cleared';
    } else if (sp.startsWith('chedi_')) {
      const rewardPending = sp === 'chedi_reward_pending';
      ordealNumber = '【第十五难·车迟护僧】';
      ordealName = '车迟国三清观 · 三仙欺佛';
      ordealDesc = '车迟国敬道灭僧，虎力、鹿力、羊力三大仙役使全国僧众。需解救受役沙门、与国王立约，凭祈雨、辨物两场斗法揭穿邪术，再于第三场决战破除三仙。';
      chapter = '第十四回 · 车迟斗法';
      stepName = rewardPending ? '领取谢礼与西行关文' :
        sp === 'chedi_final_trial' ? '破除邪术，三仙同场决战' :
          sp === 'chedi_discern' ? '坐禅定心，隔板辨物' :
            sp === 'chedi_rain' ? '验证求雨本领' :
              sp === 'chedi_audience' ? '面见国王，约定停役与斗法条件' : '查明僧人受役情况';
      stepTarget = rewardPending ? '向国王领取谢礼与西行关文' :
        sp === 'chedi_final_trial' ? '破除三仙邪术，保护在场众人' :
          sp === 'chedi_discern' ? '识破鹿力借干扰与暗示改判' :
            sp === 'chedi_rain' ? '依序验风云雷雨，赢下第一场' :
              sp === 'chedi_audience' ? '要求公开见证、僧人不得继续受罚' : '接受受役僧人申诉';
      stepProgress = rewardPending ? '三仙伏诛，谢礼待领' :
        sp === 'chedi_cleared' ? '功德圆满' :
          sp === 'chedi_final_trial' ? '两场已胜，决战在即' :
            sp === 'chedi_discern' ? '祈雨已胜' :
              sp === 'chedi_rain' ? '立约已成' :
                sp === 'chedi_audience' ? '申诉已接' : '初入车迟国';
      stepProgressRatio = rewardPending ? 0.9 : sp === 'chedi_cleared' ? 1 :
        sp === 'chedi_final_trial' ? 0.8 : sp === 'chedi_discern' ? 0.6 :
          sp === 'chedi_rain' ? 0.4 : sp === 'chedi_audience' ? 0.2 : 0.05;
      stepHint = sp === 'chedi_cleared' ? '车迟国事毕，关文通行资格已定' : '风不至则云不聚，云不聚则雷不响';
      isDone = sp === 'chedi_cleared';
    } else if (sp.startsWith('tongtian_')) {
      const rewardStage = sp === 'tongtian_reward';
      ordealNumber = '【第十六难·通天祭童】';
      ordealName = '八百里通天河 · 灵感大王';
      ordealDesc = '通天河灵感大王年索童男童女为祭，陈家庄世代不敢违抗。需先向乡老立约"祭童之事今日为止"、安置孩子，再与悟空八戒变作替身诱妖，循暗流侧口潜入水府救人，最终引出观音收妖。';
      chapter = '第十五回 · 通天归真';
      stepName = rewardStage ? '向陈家长者辞行，领取谢礼' :
        sp === 'tongtian_await_guanyin' ? '去河畔见观音，收妖除患' :
          sp === 'tongtian_rescue' ? '探查水府入口，救出师父与八戒' :
            sp === 'tongtian_altar' ? '以替身赴约，引妖现身' :
              sp === 'tongtian_vowed' ? '安置孩子，随悟空八戒赴祭坛' : '查明通天河祭童之困';
      stepTarget = rewardStage ? '确认从今不再献祭，领取谢礼后渡河' :
        sp === 'tongtian_await_guanyin' ? '见证观音鱼篮收妖，安抚家长与孩子' :
          sp === 'tongtian_rescue' ? '循暗流侧口进入水府，击退灵感大王' :
            sp === 'tongtian_altar' ? '引妖怪现身，护住撤离的村民' :
              sp === 'tongtian_vowed' ? '让孩子留在家长身边，由师父沙僧留守照应' : '找到陈家长者，问明祭童原委';
      stepProgress = rewardStage ? '妖已收，谢礼待领' :
        sp === 'tongtian_cleared' ? '功德圆满' :
          sp === 'tongtian_await_guanyin' ? '师父已救，待观音收妖' :
            sp === 'tongtian_rescue' ? '立约已成，探查水府' :
              sp === 'tongtian_altar' ? '替身已备' :
                sp === 'tongtian_vowed' ? '已知祭童原委' : '初至通天河';
      stepProgressRatio = rewardStage ? 0.9 : sp === 'tongtian_cleared' ? 1 :
        sp === 'tongtian_await_guanyin' ? 0.8 : sp === 'tongtian_rescue' ? 0.6 :
          sp === 'tongtian_altar' ? 0.45 : sp === 'tongtian_vowed' ? 0.25 : 0.05;
      stepHint = sp === 'tongtian_cleared' ? '通天河事毕，河路复通东去' : '先救下眼前的孩子，再谈除妖';
      isDone = sp === 'tongtian_cleared';
    } else if (sp.startsWith('huoyan_')) {
      const extinguished = !!(window.App2D && window.App2D.playerData &&
        window.App2D.playerData.storyEvents && window.App2D.playerData.storyEvents.huoyan_fire_extinguished);
      ordealNumber = '【第十七难·火焰借扇】';
      ordealName = '八百里火焰山 · 铁扇公主与牛魔王';
      ordealDesc = '火焰山火源源于五百年前大圣蹬倒八卦炉所落火砖。铁扇公主因红孩儿旧怨拒借芭蕉扇，悟空强取得假扇、再变化骗扇又为牛魔王所骗。须停止取巧、当众认责，重新议借真扇，连扇四十九下断绝火根。';
      chapter = '第十六回 · 火焰借扇';
      stepName = extinguished ? '向百姓领取谢礼' :
        sp === 'huoyan_quench_fire' ? '前往火根台断绝火根' :
          sp === 'huoyan_renew_request' ? '重新议借真扇' :
            sp === 'huoyan_confront_bull' ? '摩云台对质牛魔王' :
              sp === 'huoyan_seek_true_fan' ? '再赴芭蕉洞求取真扇' :
                sp === 'huoyan_test_fan' ? '在试扇火口验明真伪' :
                  sp === 'huoyan_borrow_fan' ? '前往芭蕉洞借扇' : '查明火焰山灾情';
      stepTarget = extinguished ? '向灾民代表领取谢礼，继续西行' :
        sp === 'huoyan_quench_fire' ? '连扇四十九下断绝火根，随后归还宝扇' :
          sp === 'huoyan_renew_request' ? '不再变化欺骗，向铁扇公主说明火源来历并担责' :
            sp === 'huoyan_confront_bull' ? '阻止牛魔王携扇离开' :
              sp === 'huoyan_seek_true_fan' ? '强取已不能解决问题，再赴芭蕉洞' :
                sp === 'huoyan_test_fan' ? '照土地所示，辨明手中扇是真是假' :
                  sp === 'huoyan_borrow_fan' ? '前往翠云山芭蕉洞，向铁扇公主借扇' : '找到灾民代表，问明受灾情形';
      stepProgress = extinguished ? '火根已绝，谢礼待领' :
        sp === 'huoyan_cleared' ? '功德圆满' :
          sp === 'huoyan_quench_fire' ? '真扇已借' :
            sp === 'huoyan_renew_request' ? '牛魔王已退' :
              sp === 'huoyan_confront_bull' ? '真扇被夺' :
                sp === 'huoyan_seek_true_fan' ? '已辨假扇' :
                  sp === 'huoyan_test_fan' ? '待验证的扇已得' :
                    sp === 'huoyan_borrow_fan' ? '已知灾情' : '初至火焰山';
      stepProgressRatio = extinguished ? 0.9 : sp === 'huoyan_cleared' ? 1 :
        sp === 'huoyan_quench_fire' ? 0.8 : sp === 'huoyan_renew_request' ? 0.7 :
          sp === 'huoyan_confront_bull' ? 0.55 : sp === 'huoyan_seek_true_fan' ? 0.45 :
            sp === 'huoyan_test_fan' ? 0.3 : sp === 'huoyan_borrow_fan' ? 0.15 : 0.05;
      stepHint = sp === 'huoyan_cleared' ? '火焰山事毕，继续西行' : '真扇火势当减，假扇越扇越大';
      isDone = sp === 'huoyan_cleared';
    } else if (sp.startsWith('pansi_')) {
      ordealNumber = '【第十八难·盘丝七难】';
      ordealName = '盘丝岭盘丝洞 · 七女妖与黄花观';
      ordealDesc = '盘丝岭七女妖于濯垢泉边设丝缚人，与黄花观百眼魔君互为同盟。八戒越界被缚，唐僧制止时同遭扣押。须先安全解缚，再往黄花观求援——却遭毒茶暗算。须寻得昴日星官，以两声啼鸣破金光、显原形，方能制服百眼、取得解药。';
      chapter = '第十七回 · 盘丝破妄';
      stepName = sp === 'pansi_cleared' ? '前往西行出口' :
        sp === 'pansi_restoring' ? '向唐僧交代救治与善后' :
          sp === 'pansi_breaking_light' ? '随昴日星官破除金光' :
            sp === 'pansi_seeking_rooster' ? '请昴日星官下山相助' :
              sp === 'pansi_poisoned' ? '向指路老妇询问破光之法' :
                sp === 'pansi_huanghua' ? '往黄花观求解毒之法' :
                  sp === 'pansi_webbound' ? '解除丝洞主缚，救出师父与八戒' : '与唐僧确认泉边边界';
      stepTarget = sp === 'pansi_cleared' ? '盘丝事了，继续西去' :
        sp === 'pansi_restoring' ? '取得解毒药、照料伤者、清点获救者、处置丝洞' :
          sp === 'pansi_breaking_light' ? '一鸣破光，二鸣显形；护住救援通路' :
            sp === 'pansi_seeking_rooster' ? '如实说明金光、毒伤与被困者' :
              sp === 'pansi_poisoned' ? '普通药物只能暂缓，须先找到克制金光之人' :
                sp === 'pansi_huanghua' ? '说明伤情，核实药物；求援不等于信任' :
                  sp === 'pansi_webbound' ? '先观察主缚与承重丝，再救人；不可直接焚烧' : '泉边有人，不得窥探；先问路，不擅入';
      stepProgress = sp === 'pansi_cleared' ? '功德圆满' :
        sp === 'pansi_restoring' ? '百眼已制服' :
          sp === 'pansi_breaking_light' ? '援手已至' :
            sp === 'pansi_seeking_rooster' ? '已得指引' :
              sp === 'pansi_poisoned' ? '毒茶事发' :
                sp === 'pansi_huanghua' ? '解缚已成' :
                  sp === 'pansi_webbound' ? '师父八戒受困' : '初至盘丝岭';
      stepProgressRatio = sp === 'pansi_cleared' ? 1 :
        sp === 'pansi_restoring' ? 0.9 : sp === 'pansi_breaking_light' ? 0.75 :
          sp === 'pansi_seeking_rooster' ? 0.6 : sp === 'pansi_poisoned' ? 0.45 :
            sp === 'pansi_huanghua' ? 0.3 : sp === 'pansi_webbound' ? 0.15 : 0.05;
      stepHint = sp === 'pansi_cleared' ? '盘丝事了，继续西去' :
        (sp === 'pansi_poisoned' || sp === 'pansi_seeking_rooster' || sp === 'pansi_breaking_light')
          ? '不是打掉血条才破金光，须先有克制金光之人' : '泉边有人，便应止步；未得应允，不可近前';
      isDone = sp === 'pansi_cleared';
    } else if (sp.startsWith('shituo_')) {
      ordealNumber = '【第十九难·狮驼绝境】';
      ordealName = '八百里狮驼岭 · 三魔与狮驼国';
      ordealDesc = '八百里狮驼岭上，青狮、白象、大鹏三魔坐地称王，洞中犹有关而未杀之人。先听太白金星报信，再从巡山小妖口中探出宝瓶与三魔底细；脱瓶、破洞、求援灵山——佛光垂岭，方伏金翅。岭上事了，西天在望。';
      chapter = '第十八回 · 狮驼伏魔';
      stepName = sp === 'shituo_cleared' ? '经西行关口，奔赴大雷音寺' :
        sp === 'shituo_restoring' ? '向获救樵夫交代善后并领取谢礼' :
          sp === 'shituo_final' ? '随佛光阵门决战大鹏金翅雕' :
            sp === 'shituo_plea' ? '静候灵山援应，整备决战' :
              sp === 'shituo_cave' ? '往狮驼洞口，迎战狮象二魔' :
                sp === 'shituo_recon' ? '向巡山小钻风探问虚实' : '听太白金星报信，应下探山';
      stepTarget = sp === 'shituo_cleared' ? '狮驼事了，灵山在望' :
        sp === 'shituo_restoring' ? '送归获救者、领取玉佩谢礼、了结岭上因果' :
          sp === 'shituo_final' ? '护住佛光阵门，不让金翅冲散阵线' :
            sp === 'shituo_plea' ? '悟空已上灵山；洞里的人还等着，不可冒进' :
              sp === 'shituo_cave' ? '先问被掳之人下落，再论刀枪' :
                sp === 'shituo_recon' ? '问话比闯门便宜；宝瓶之事务必问明' : '三句实话都记下：宝瓶、援手、西天有账可算';
      stepProgress = sp === 'shituo_cleared' ? '功德圆满' :
        sp === 'shituo_restoring' ? '金翅已伏' :
          sp === 'shituo_final' ? '佛光垂岭' :
            sp === 'shituo_plea' ? '狮象已败' :
              sp === 'shituo_cave' ? '宝瓶已脱' :
                sp === 'shituo_recon' ? '太白已别' : '初至狮驼岭';
      stepProgressRatio = sp === 'shituo_cleared' ? 1 :
        sp === 'shituo_restoring' ? 0.9 : sp === 'shituo_final' ? 0.75 :
          sp === 'shituo_plea' ? 0.6 : sp === 'shituo_cave' ? 0.4 :
            sp === 'shituo_recon' ? 0.2 : 0.05;
      stepHint = sp === 'shituo_cleared' ? '狮驼事了，灵山在望' :
        sp === 'shituo_final' ? '胜负即因果；佛光压阵，不必拼命' :
          sp === 'shituo_plea' ? '山穷水尽时，西天有账可算' : '问话比闯门便宜；进洞容易出来难';
      isDone = sp === 'shituo_cleared';
    }

    return {
      ordealNumber,
      ordealName,
      ordealDesc,
      ultimateGoal,
      chapter,
      stepName,
      stepTarget,
      stepProgress,
      stepProgressRatio,
      stepHint,
      isDone
    };
  }

  // 快捷交互：八十一难主线历练模态弹窗 (由右上角按钮或快捷键Q呼出)
  openOrdealQuestModal() {
    this.openQuestTrackerModal();
  }

  openQuestTrackerModal() {
    if (window.Dialogue) window.Dialogue.close();
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());

    const info = this.getOrdealAndQuestInfo();
    const hasGhost = this.ghostQuest && this.ghostQuest.active;
    const hasEscort = this.escortQuest && this.escortQuest.active;

    const modalHtml = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-window quest-tracker-window" onclick="event.stopPropagation()" style="max-width:540px;width:94%;background:radial-gradient(circle at 50% 8%, #2a1c12 0%, #16100b 55%, #0e0a07 100%);border:2px solid #8d6b38;box-shadow:0 0 30px rgba(0,0,0,0.9),inset 0 0 15px rgba(141,107,56,0.2);border-radius:6px;overflow:hidden;color:#f5e8d0;">
          <div class="modal-header" style="background:linear-gradient(90deg, #3d2817, #22170e);padding:12px 16px;border-bottom:1px solid #6b4e28;display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:16px;">📜</span>
              <span class="modal-title" style="color:#fde047;font-size:15px;letter-spacing:1px;font-weight:bold;">西天取经 · 八十一难功德簿</span>
            </div>
            <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div class="modal-body" style="padding:14px;font-size:11.5px;color:#f5e8d0;line-height:1.6;display:flex;flex-direction:column;gap:10px;max-height:78vh;overflow-y:auto;">

            <!-- 1. 当前属于哪一难 (主线天命核心卡片) -->
            <div style="background:rgba(28,19,13,0.9);border:1.5px solid #a3733a;border-radius:6px;padding:12px;box-shadow:inset 0 0 12px rgba(0,0,0,0.6);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <div style="display:flex;align-items:center;gap:6px;">
                  <span style="font-size:15px;">⛩️</span>
                  <span style="font-weight:bold;color:#fde047;font-size:13.5px;">【${info.ordealNumber}】</span>
                  <span style="color:#fff;font-weight:bold;font-size:13px;">${info.ordealName}</span>
                </div>
                <span style="font-size:10px;padding:2px 8px;border-radius:4px;background:#422a18;border:1px solid #8d6b38;color:#fde047;">${info.chapter}</span>
              </div>
              <div style="font-size:11px;color:#c9baa5;line-height:1.6;padding-top:2px;">
                ${info.ordealDesc}
              </div>
            </div>

            <!-- 2. 取经宏愿 -->
            <div style="background:rgba(18,13,9,0.85);border:1px solid #5a3d20;border-left:3px solid #d4af37;border-radius:4px;padding:8px 12px;display:flex;align-items:center;gap:8px;">
              <span style="color:#ffd700;font-weight:bold;font-size:12px;white-space:nowrap;">🌟 取经宏愿:</span>
              <span style="color:#e2d5c2;font-size:11px;">${info.ultimateGoal}</span>
            </div>

            <!-- 3. 当前步骤目标与追踪 -->
            <div style="background:rgba(32,22,14,0.92);border:1.5px solid #c59b27;border-radius:6px;padding:12px;box-shadow:0 0 12px rgba(197,155,39,0.15);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <div style="display:flex;align-items:center;gap:6px;">
                  <span style="font-size:14px;">🎯</span>
                  <span style="font-weight:bold;color:#fde047;font-size:12.5px;">当前步骤:</span>
                  <span style="font-weight:bold;color:#ffffff;font-size:12.5px;">${info.stepName}</span>
                </div>
                <span style="font-size:10.5px;font-weight:bold;color:${info.isDone ? '#34d399' : '#38bdf8'};background:rgba(10,8,6,0.7);padding:2px 8px;border-radius:4px;border:1px solid ${info.isDone ? '#059669' : '#0284c7'};">
                  ${info.stepProgress}
                </span>
              </div>

              <!-- 进度条 -->
              <div style="background:#1e140d;border-radius:3px;height:6px;overflow:hidden;margin-bottom:8px;border:1px solid #4a331c;">
                <div style="background:linear-gradient(90deg, #d4af37, #34d399);height:100%;width:${Math.round(info.stepProgressRatio * 100)}%;transition:width 0.3s;"></div>
              </div>

              <div style="font-size:11px;color:#d4c4b0;margin-bottom:4px;">
                <span style="color:#8d7966;">指引：</span>${info.stepTarget}
              </div>
              <div style="font-size:10.5px;color:#8d7966;margin-bottom:10px;">
                🧭 提示：${info.stepHint}
              </div>

              <div style="display:flex;justify-content:flex-end;">
                <button class="dialogue-opt-btn" style="padding:5px 18px;font-size:11.5px;background:linear-gradient(180deg, #b4833e, #825a22);color:#fff;font-weight:bold;border:1px solid #d4af37;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,0.4);" onclick="window.App2D.teleportToStoryLead(); document.querySelectorAll('.modal-overlay').forEach(m => m.remove());">
                  ✦ 立即寻路追踪 ✦
                </button>
              </div>
            </div>

            <!-- 3.5. 山海经 · 生灵寻访独立追踪 (与主线并存，不覆盖主线) -->
            ${this._renderQuestTrackerShanhaiCard()}

            <!-- 4. 每日历练与修行功德 (统一典雅暗金风格，拒绝花哨混色) -->
            <div style="font-size:11.5px;color:#d4af37;font-weight:bold;margin-top:2px;display:flex;align-items:center;gap:6px;">
              <span>🎋</span><span>三界每日修行功德</span>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <!-- 钟馗捉鬼 -->
              <div style="background:rgba(24,17,11,0.85);border:1px solid #5a3d20;border-radius:6px;padding:9px;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <span style="font-weight:bold;color:#fde047;font-size:11px;">👹 钟馗伏魔令</span>
                    <span style="font-size:9.5px;color:${hasGhost ? (this.ghostQuest.completed ? '#34d399' : '#f59e0b') : '#8d7966'};">
                      ${hasGhost ? (this.ghostQuest.completed ? '已击杀' : '除魔中') : '未接取'}
                    </span>
                  </div>
                  <div style="font-size:10px;color:#a89682;line-height:1.4;margin-bottom:6px;">
                    ${hasGhost ? `目标恶鬼：${this.ghostQuest.targetName}` : '长安化生寺拜见伏魔天师钟馗。'}
                  </div>
                </div>
                ${hasGhost ? `
                  <button class="dialogue-opt-btn" style="width:100%;padding:3px;font-size:10px;background:#6b281b;border-color:#b91c1c;" onclick="window.App2D.trackZhongkuiGhostTarget()">
                    神行除妖
                  </button>
                ` : `
                  <button class="dialogue-opt-btn" style="width:100%;padding:3px;font-size:10px;" onclick="window.App2D.guideToMap('changan_city', '钟馗天师')">
                    前往化生寺
                  </button>
                `}
              </div>

              <!-- 大唐运镖 -->
              <div style="background:rgba(24,17,11,0.85);border:1px solid #5a3d20;border-radius:6px;padding:9px;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <span style="font-weight:bold;color:#fde047;font-size:11px;">🚩 大唐军饷镖</span>
                    <span style="font-size:9.5px;color:${hasEscort ? '#34d399' : '#8d7966'};">
                      ${hasEscort ? '护送中' : '未接取'}
                    </span>
                  </div>
                  <div style="font-size:10px;color:#a89682;line-height:1.4;margin-bottom:6px;">
                    ${hasEscort ? `送达：${this.escortQuest.targetMapName}` : '长安镖局程咬金处接取军饷押运。'}
                  </div>
                </div>
                <button class="dialogue-opt-btn" style="width:100%;padding:3px;font-size:10px;" onclick="window.App2D.guideToMap('changan_city', '大唐镖局')">
                  ${hasEscort ? '查看镖途' : '前往镖局'}
                </button>
              </div>

              <!-- 每日蟠桃盛宴 -->
              <div style="background:rgba(24,17,11,0.85);border:1px solid #5a3d20;border-radius:6px;padding:9px;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                  <div style="font-weight:bold;color:#fde047;font-size:11px;margin-bottom:4px;">🍑 每日蟠桃盛宴</div>
                  <div style="font-size:10px;color:#a89682;line-height:1.4;margin-bottom:6px;">蟠桃园仙树每日采摘仙桃大增元神经验！</div>
                </div>
                <button class="dialogue-opt-btn" style="width:100%;padding:3px;font-size:10px;" onclick="window.App2D.teleportToPeachGarden()">
                  直达蟠桃园
                </button>
              </div>

              <!-- 东海借宝 -->
              <div style="background:rgba(24,17,11,0.85);border:1px solid #5a3d20;border-radius:6px;padding:9px;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                  <div style="font-weight:bold;color:#fde047;font-size:11px;margin-bottom:4px;">🌊 东海借宝试炼</div>
                  <div style="font-size:10px;color:#a89682;line-height:1.4;margin-bottom:6px;">东海龙宫大殿敖广借宝试炼，战蛟龙夺神珍！</div>
                </div>
                <button class="dialogue-opt-btn" style="width:100%;padding:3px;font-size:10px;" onclick="window.App2D.guideToMap('longgong_palace', '东海龙宫')">
                  前往龙宫大殿
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;

    const v = document.getElementById('game-viewport') || document.body;
    v.insertAdjacentHTML('beforeend', modalHtml);
  }

  // P2.2: 渲染任务簿中的山海经生灵寻访卡片（与主线完全独立，互不影响）
  _renderQuestTrackerShanhaiCard() {
    if (!this.shanhaiPursuitTarget) return '';
    const pet = window.GAME_DATA?.PETS?.[this.shanhaiPursuitTarget];
    if (!pet) return '';
    const sourceInfo = window.GAME_DATA?.getShanhaiSpeciesSource ? window.GAME_DATA.getShanhaiSpeciesSource(pet.id) : null;
    const catBadges = {
      common_wild: { text: '🌲 地图常见', color: '#34d399', border: '#10b981', bg: 'rgba(6,78,59,0.7)' },
      encounter: { text: '🎲 概率偶遇', color: '#fde047', border: '#f59e0b', bg: 'rgba(120,53,15,0.7)' },
      gift_only: { text: '🎁 赠礼专属', color: '#c084fc', border: '#8b5cf6', bg: 'rgba(76,29,149,0.7)' },
      unreachable: { text: '⏳ 尚未开放', color: '#9ca3af', border: '#6b7280', bg: 'rgba(55,65,81,0.7)' }
    };
    const badge = catBadges[sourceInfo?.category] || catBadges.common_wild;
    const isCollected = !!(this.getShanhai().entries?.[pet.id]);
    const vesselDesc = pet.quality === 'jinxian' ? '需紫金红葫芦招降' : (pet.quality === 'sanxian' ? '需收仙银壶招降' : '直接招降');

    return `
      <div style="background:rgba(20,28,18,0.92);border:1.5px solid #2e7d32;border-radius:6px;padding:12px;box-shadow:0 0 12px rgba(46,125,50,0.2);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:14px;">🐾</span>
            <span style="font-weight:bold;color:#a7f3d0;font-size:12.5px;">山海寻访:</span>
            <span style="font-weight:bold;color:#ffffff;font-size:12.5px;">【${pet.name}】</span>
            <span style="font-size:9.5px;padding:1px 6px;border-radius:3px;border:1px solid ${badge.border};background:${badge.bg};color:${badge.color};font-weight:bold;">${badge.text}</span>
          </div>
          <span style="font-size:10px;font-weight:bold;color:${isCollected ? '#34d399' : '#f59e0b'};background:rgba(10,8,6,0.7);padding:2px 8px;border-radius:4px;border:1px solid ${isCollected ? '#059669' : '#d97706'};">
            ${isCollected ? '✅ 已献录入经' : '🔍 寻访中'}
          </span>
        </div>
        <div style="font-size:11px;color:#d1fae5;line-height:1.5;margin-bottom:4px;">
          <span style="color:#6ee7b7;">栖息出没：</span>${sourceInfo?.mapName || '未知地域'} · ${sourceInfo?.conditionDesc || '游历偶遇'}
        </div>
        <div style="font-size:10.5px;color:#94a3b8;margin-bottom:8px;">
          🧭 招降要诀：${vesselDesc} · ${sourceInfo?.accessible ? '当前主线已可抵达' : '需后续主线开放场景'}
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;">
          ${sourceInfo?.accessible && sourceInfo?.mapId ? `
            <button class="dialogue-opt-btn" style="padding:4px 14px;font-size:11px;background:#065f46;border-color:#10b981;color:#fff;" onclick="window.App2D.guideToMap('${sourceInfo.mapId}', '${sourceInfo.mapName}'); document.querySelectorAll('.modal-overlay').forEach(m => m.remove());">
              🧭 规划前往【${sourceInfo.mapName}】
            </button>
          ` : ''}
          <button class="dialogue-opt-btn" style="padding:4px 10px;font-size:11px;background:#374151;border-color:#4b5563;color:#e5e7eb;" onclick="window.App2D.setShanhaiPursuitTarget(null); document.querySelectorAll('.modal-overlay').forEach(m => m.remove()); window.App2D.openQuestTrackerModal();">
            ✕ 取消寻访
          </button>
        </div>
      </div>
    `;
  }

  // 跨地图引路只规划当前场景的下一道门，绝不直接装载目标地图跳过任务。
  guideToMap(targetMapId, targetName = '目标场景') {
    if (window.Dialogue) window.Dialogue.close();
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
    if (this.currentMapId === targetMapId) {
      window.showGameMessage(`已在【${targetName}】所在场景，请查看小地图继续寻找。`, 'info', 3000);
      return;
    }
    const maps = window.GAME_DATA.MAPS_2D;
    const visited = new Set([this.currentMapId]);
    const queue = [{ mapId: this.currentMapId, firstPortal: null }];
    let nextPortal = null;
    for (let i = 0; i < queue.length && !nextPortal; i++) {
      const node = queue[i];
      for (const portal of maps[node.mapId]?.portals || []) {
        if (!maps[portal.targetMap] || visited.has(portal.targetMap)) continue;
        const firstPortal = node.firstPortal || portal;
        if (portal.targetMap === targetMapId) {
          nextPortal = firstPortal;
          break;
        }
        visited.add(portal.targetMap);
        queue.push({ mapId: portal.targetMap, firstPortal });
      }
    }
    if (!nextPortal) {
      window.showGameMessage(`尚无通往【${targetName}】的道路，请先推进当前剧情。`, 'warning', 3500);
      return;
    }
    const mapData = maps[this.currentMapId];
    const distance = Math.hypot(nextPortal.x - this.playerChar.x, nextPortal.y - this.playerChar.y);
    if (distance < 25) {
      this.tryEnterPortal(nextPortal);
      return;
    }
    const path = this.pathfinding.findPath(mapData, this.tilemap,
      this.playerChar.x, this.playerChar.y, nextPortal.x, nextPortal.y);
    if (!path || !path.length) {
      window.showGameMessage(`已找到前往【${targetName}】的方向，请沿当前场景道路前行。`, 'info', 3000);
      return;
    }
    this.autoMovePath = path;
    this.autoMoveTargetCallback = () => this.tryEnterPortal(nextPortal);
    window.showGameMessage(`已为你标出通往【${targetName}】的下一道门。`, 'info', 3000);
  }

  // 寻路追踪当前主线
  teleportToStoryLead() {
    const mapData = window.GAME_DATA.MAPS_2D[this.currentMapId];
    const tgt = this.minimap.getCurrentQuestTarget(this.currentMapId, this.storyPhase, mapData);
    if (tgt) {
      this.handleClickCanvas(tgt.x - this.camera.x, tgt.y - this.camera.y);
      window.showGameMessage(`🎯 已开启自动寻路直指主线目标：【${tgt.name}】！`, 'success');
      return;
    }

    // 优先读取统一主线跨地图指引 (R3)
    if (window.GAME_DATA && typeof window.GAME_DATA.getUnifiedStoryLead === 'function') {
      const unified = window.GAME_DATA.getUnifiedStoryLead(this.storyPhase, this.currentMapId, this.questKills, this.playerData);
      if (unified && unified.mapId && unified.mapId !== this.currentMapId) {
        this.guideToMap(unified.mapId, unified.mapName);
        return;
      }
    }

    // 跨地图逐门引路，传送门仍执行剧情与等级检查。
    const phaseMapMap = {
      heaven_prologue: { mapId: 'tiangong_palace', name: '九重天阙' },
      heaven_to_water_pavilion: { mapId: 'tiangong_palace', name: '瑶池水阁' },
      heaven_to_lingxiao: { mapId: 'tiangong_palace', name: '凌霄殿前' },
      liujiacun_start: { mapId: 'liujiacun', name: '两界山·刘家村' },
      liujiacun_hunted: { mapId: 'liujiacun', name: '刘家村东门' },
      changan_guided: { mapId: 'changan_city', name: '大唐都城长安' },
      wuxingshan_ready: { mapId: 'wuxingshan', name: '两界山·五行山' },
      wuxing_freed: { mapId: 'yingchoujian', name: '蛇盘山·鹰愁涧' },
      yingchou_cleared: { mapId: 'gaolaozhuang', name: '乌斯藏·高老庄' },
      gaolao_cleared: { mapId: 'huangfengling', name: '八百里·黄风岭' },
      huangfeng_cleared: { mapId: 'liushahe', name: '八百里·流沙河' },
      liusha_cleared: { mapId: 'wuzhuangguan', name: '万寿山·五庄观' },
      wuzhuang_cleared: { mapId: 'baihuling', name: '白虎岭' },
      baihu_first_cleared: { mapId: 'baihuling', name: '白虎岭' },
      baihu_second_cleared: { mapId: 'baihuling', name: '白虎岭' },
      baihu_cleared: { mapId: 'baoxiangguo', name: '宝象国王都' },
      baoxiang_seek_princess: { mapId: 'baoxiangguo', name: '宝象国波月洞' },
      baoxiang_boss_ready: { mapId: 'baoxiangguo', name: '宝象国波月洞' },
      baoxiang_cleared: { mapId: 'pingdingshan', name: '平顶山' }
    };

    const targetInfo = phaseMapMap[this.storyPhase];
    if (targetInfo) {
      this.guideToMap(targetInfo.mapId, targetInfo.name);
    } else {
      window.showGameMessage('当前地图暂无主线标记，请沿八卦引路法阵前往临近地图！', 'info');
    }
  }

  getShanhai() {
    if (!this.shanhai) this.shanhai = new window.ShanhaiSystem();
    return this.shanhai;
  }

  hasExplorationModal() {
    if (this.isTransitioning) return true;
    const selectors = [
      '.modal-overlay', '.roster-modal-overlay', '.game-confirm-overlay',
      '.profile-v3-overlay', '.shanhai-pet-picker-overlay',
      '.level-up-modal-overlay', '.chapter-opening-overlay'
    ].join(', ');
    if (Array.from(document.querySelectorAll(selectors)).some(el => el.getClientRects?.().length > 0)) return true;
    const transition = document.getElementById('scene-transition-overlay');
    if (transition && transition.classList.contains('active')) return true;
    return false;
  }

  renderShanhaiRewards(quality) {
    const book = this.getShanhai();
    const count = book.counts()[quality];
    const rewards = book.rewards().filter(r => r.quality === quality);
    const ready = rewards.filter(r => r.unlocked && !r.claimed);
    const next = rewards.find(r => !r.unlocked);
    return `<div class="shanhai-rewards"><div><strong>献录赠礼 · 已收录 ${count} 种</strong>
      <span>${next ? `下份赠礼：${next.threshold}种 · ${next.label}` : '本卷里程已全部达成'} · 只计不同物种</span></div>
      ${ready.length ? `<div class="shanhai-reward-actions">${ready.map(r => `<button class="dialogue-opt-btn" onclick="App2D.claimShanhaiReward('${r.key}')">领取${r.threshold}种赠礼 · ${r.label}</button>`).join('')}</div>` : ''}</div>`;
  }

  renderShanhaiCollection(template) {
    const book = this.getShanhai();
    const isCollected = !!(book.entries && book.entries[template.id]);
    if (isCollected) {
      return `
        <div class="shanhai-collection">
          <div style="display:flex;align-items:center;gap:6px;">
            <span class="shanhai-collected-badge">✅ 已收录入《山海经》· 灵韵永存</span>
          </div>
          <p style="margin-top:6px;">该物种已正式奉纳成篇。图鉴名称已点亮为绿色。再次招降的同种仙宠可以放心培养与出战。</p>
        </div>
      `;
    }
    const owned = (this.pets || []).filter(p => p.templateId === template.id && window.ShanhaiSystem.isCollectible(p));
    return `
      <div class="shanhai-collection">
        <div class="shanhai-collection-heading">
          <strong>${book.seen[template.id] ? '见闻待录' : '尚未遇见'} · 献录成篇</strong>
          <button class="shanhai-collect-trigger-btn" onclick="window.App2D.openShanhaiPetPickerModal('${template.id}')">
            📥 查看随行仙宠并献录
          </button>
        </div>
        <p style="font-size:10.5px;color:#cbd5e1;line-height:1.5;margin-bottom:6px;">💡 见闻与献录法则：野外见过会记下见闻，献录才点亮收藏；被献录的这一只会离队，其他同种仙宠完好保留。受加锁保护的仙宠不会被误献录。</p>
        ${owned.map(p => `
          <div class="shanhai-candidate" style="border: 1px solid ${p.isProtected ? '#ef4444' : '#78350f'};">
            <span>🐾 ${p.name} · Lv.${p.level} · 成长 ${p.growth || '标准'}${p.isProtected ? ' · <strong style="color:#ef4444;">[🔒已保护]</strong>' : ''}${this.activeCombatPets?.some(a => a.instanceId === p.instanceId) ? ' · [出战中]' : ''}</span>
            ${p.isProtected ? `
              <button class="dialogue-opt-btn" style="padding:1px 6px;font-size:9.5px;background:#b45309;" onclick="window.App2D.togglePetProtection('${p.instanceId}')">解锁</button>
            ` : `
              <button class="dialogue-opt-btn" onclick="window.App2D.confirmShanhaiCollection('${p.instanceId}')">选择献录</button>
            `}
          </div>
        `).join('') || '<div style="font-size:10.5px;color:#94a3b8;padding:4px 0;">当前随行仙宠中暂无该物种，可在野外战斗中招降。</div>'}
      </div>
    `;
  }

  // 打开挑选当前随行仙宠献录模态框
  openShanhaiPetPickerModal(templateId) {
    if (typeof document === 'undefined') return;
    if (this.currentBattle || this.isTransitioning) {
      window.showGameMessage('请在战斗结束、场景切换完成后献录。', 'warning');
      return;
    }
    this.closeShanhaiPetPickerModal();

    const template = window.GAME_DATA?.PETS?.[templateId] || Object.values(window.GAME_DATA?.PETS || {}).find(p => p.id === templateId);
    if (!template) {
      window.showGameMessage('未找到该物种图鉴档案！', 'warning');
      return;
    }

    if (this.getShanhai().entries[template.id]) {
      window.showGameMessage('该物种已收录，同种仙宠无需再次献录。', 'info');
      return;
    }
    this.keysDown = {};
    const allPlayerPets = this.pets || [];
    const matchingPets = allPlayerPets.filter(p => p.templateId === template.id && window.ShanhaiSystem.isCollectible(p));
    const nonMatchingPets = allPlayerPets.filter(p => !matchingPets.includes(p));

    const overlay = document.createElement('div');
    overlay.id = 'shanhai-pet-picker-modal';
    overlay.className = 'shanhai-pet-picker-overlay';
    overlay.onclick = (e) => {
      if (e.target === overlay) this.closeShanhaiPetPickerModal();
    };

    overlay.innerHTML = `
      <div class="shanhai-pet-picker-box" onclick="event.stopPropagation()">
        <div class="shanhai-picker-header">
          <span class="shanhai-picker-title">📥 挑选随行仙宠 · 献录【${template.name}】</span>
          <button class="modal-close-btn" onclick="window.App2D.closeShanhaiPetPickerModal()">✕</button>
        </div>
        <div style="padding:10px 14px 4px 14px;font-size:11px;color:#cbd5e1;line-height:1.5;">
          💡 <strong>献录法则：</strong>见过会记下见闻，献录才点亮绿色收藏；被献录的这一只会离队，其他同种仍保留。<br>
          当前随行仙宠共 <strong>${allPlayerPets.length}</strong> 只。请仔细挑选符合【<strong style="color:#ffd700;">${template.name}</strong>】的实例（同种多个实例默认不替玩家选定）：
        </div>
        <div class="shanhai-picker-body">
          ${allPlayerPets.length === 0 ? `
            <div style="text-align:center;padding:28px 10px;color:#94a3b8;font-size:12px;">
              <div style="font-size:26px;margin-bottom:8px;">🎒</div>
              <div>当前随行仙宠栏中尚无任何仙宠！</div>
            </div>
          ` : `
            ${matchingPets.length === 0 ? `
              <div style="margin:4px 0 8px 0;padding:10px;background:rgba(217,119,6,0.18);border:1.2px solid #d97706;border-radius:6px;font-size:11px;color:#fde047;line-height:1.6;">
                💡 随行仙宠中暂无【<strong>${template.name}</strong>】！<br>
                可前往其出没场景在战斗中施展【招降】收服入队后再来献录。
              </div>
            ` : ''}

            <!-- 匹配可献录仙宠 -->
            ${matchingPets.map(p => {
              const isCombat = this.activeCombatPets?.some(a => a.instanceId === p.instanceId);
              const isProtected = !!p.isProtected;
              const skillStr = p.skills && p.skills.length > 0 ? p.skills.map(s => s.name || s).join('、') : '仅普通攻击';
              return `
                <div class="shanhai-candidate-card is-match" style="border: 1px solid ${isProtected ? '#ef4444' : '#059669'};">
                  <div>
                    <div style="color:#ffd700;font-weight:bold;font-size:12px;display:flex;align-items:center;gap:4px;flex-wrap:wrap;">
                      <span>🐾 ${p.name} <span style="font-size:11px;color:#fde047;">(Lv.${p.level})</span></span>
                      ${isCombat ? '<span style="font-size:9.5px;color:#f59e0b;border:1px solid #f59e0b;padding:0 4px;border-radius:3px;">出战中</span>' : ''}
                      ${isProtected ? '<span style="font-size:9.5px;color:#ef4444;border:1px solid #ef4444;background:rgba(239,68,68,0.18);padding:0 4px;border-radius:3px;">🔒 加锁保护</span>' : '<span style="font-size:9.5px;color:#10b981;border:1px solid #10b981;padding:0 4px;border-radius:3px;">🔓 未保护</span>'}
                    </div>
                    <div style="font-size:10px;color:#6ee7b7;margin-top:2px;">
                      气血: ${p.hp}/${p.maxHp} · 法力: ${p.mp}/${p.maxMp} · 成长率: ${p.growth || '标准'}
                    </div>
                    <div style="font-size:10px;color:#cbd5e1;margin-top:2px;">
                      已学技能: ${skillStr}
                    </div>
                  </div>
                  <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end;">
                    ${isProtected ? `
                      <button class="dialogue-opt-btn" style="padding:2px 8px;font-size:9.5px;background:#b45309;color:#fff;" onclick="window.App2D.togglePetProtection('${p.instanceId}')">
                        🔓 解除保护
                      </button>
                      <button class="shanhai-collect-trigger-btn" style="opacity:0.45;cursor:not-allowed;" disabled title="受加锁保护的仙宠无法献录，请先解除保护">
                        受保护禁献
                      </button>
                    ` : `
                      <button class="dialogue-opt-btn" style="padding:2px 8px;font-size:9.5px;background:#334155;color:#cbd5e1;" onclick="window.App2D.togglePetProtection('${p.instanceId}')">
                        🔒 加锁保护
                      </button>
                      <button class="shanhai-collect-trigger-btn" onclick="window.App2D.confirmShanhaiCollection('${p.instanceId}')">
                        选择献录
                      </button>
                    `}
                  </div>
                </div>
              `;
            }).join('')}

            <!-- 不匹配的其他仙宠列表 (置灰提示不可献录) -->
            ${nonMatchingPets.map(p => `
              <div class="shanhai-candidate-card not-match">
                <div>
                  <div style="color:#94a3b8;font-size:11px;">🐾 ${p.name} (Lv.${p.level})</div>
                  <div style="font-size:9px;color:#64748b;">物种不符 (非${template.name})</div>
                </div>
                <span style="font-size:10px;color:#64748b;padding:2px 6px;">种类不符</span>
              </div>
            `).join('')}
          `}
        </div>
        <div style="padding:8px 14px;border-top:1px solid #78350f;display:flex;justify-content:space-between;align-items:center;background:rgba(20,10,5,0.6);">
          <span style="font-size:10.5px;color:#94a3b8;">仅奉纳选中的这一只 · Esc 返回</span>
          <button class="dialogue-opt-btn" onclick="window.App2D.closeShanhaiPetPickerModal()">关闭取消</button>
        </div>
      </div>
    `;

    const viewport = document.getElementById('game-viewport') || document.body;
    viewport.appendChild(overlay);
    if (window.Sound && window.Sound.playBeep) window.Sound.playBeep();
  }

  closeShanhaiPetPickerModal() {
    const el = document.getElementById('shanhai-pet-picker-modal');
    if (el) el.remove();
  }

  // 二次确认献录随行仙宠至山海经
  confirmShanhaiCollection(instanceId) {
    const pet = this.pets?.find(p => p.instanceId === instanceId);
    if (!pet) return;
    if (pet.isProtected) {
      window.showGameMessage(`【${pet.name}】处于加锁保护状态，无法献录！请先在仙宠面板解除保护。`, 'warning');
      return;
    }
    const template = window.GAME_DATA?.PETS?.[pet.templateId] || { name: pet.name, quality: 'ordinary' };
    const skillList = pet.skills && pet.skills.length > 0 ? pet.skills.map(s => s.name || s).join('、') : '仅普通物理攻击';
    const isCombat = this.activeCombatPets?.some(a => a.instanceId === pet.instanceId);
    this.showConfirmModal({
      title: '⚠️ 山海经 · 二次确认献录',
      confirmText: '确认奉纳收录',
      cancelText: '暂不献录',
      content: `确定要将随行仙宠【<strong>${pet.name} (Lv.${pet.level})</strong>】奉纳献录至《山海经》吗？<br>` +
        `<div style="font-size:11px;color:#cbd5e1;margin:6px 0;background:rgba(0,0,0,0.3);padding:6px;border-radius:4px;border:1px solid #4a331c;">` +
        `• 成长率: <strong>${pet.growth || '标准'}</strong><br>` +
        `• 已学技能: <strong>${skillList}</strong><br>` +
        `${isCombat ? '<strong style="color:#f59e0b;">• 提示：该仙宠当前正在出战队列中！</strong><br>' : ''}` +
        `</div>` +
        `<span style="color:#f87171;font-weight:bold;">⚠️ 郑重提醒（不可逆）：</span><br>` +
        `1. 献录后<strong>仅该只仙宠永久离开队伍与背包</strong>，其等级与培养化为图鉴灵韵；<br>` +
        `2. 队伍中保留的其他同种仙宠<strong>不受任何影响</strong>；<br>` +
        `3. 永久点亮山海经【<strong>${template.name}</strong>】<span style="color:#4ade80;font-weight:bold;">绿色收录</span>成就与功德里程。`,
      onConfirm: () => {
        const result = this.getShanhai().collect(this, instanceId);
        window.showGameMessage(result.msg, result.success ? 'success' : 'warning');
        if (result.success) {
          if (window.Sound && window.Sound.playLevelUp) window.Sound.playLevelUp();
          this.closeShanhaiPetPickerModal();
          if (!this.saveAutoProgress().success) window.showGameMessage('献录已完成，但本地存档失败，请手动保存。', 'warning');
          this.renderSceneRosterModal(pet.templateId, template.quality);
        }
      }
    });
  }

  claimShanhaiReward(key) {
    const result = this.getShanhai().claim(this, key);
    window.showGameMessage(result.msg, result.success ? 'success' : 'warning');
    if (result.success) {
      if (!this.saveAutoProgress().success) window.showGameMessage('赠礼已领取，但本地存档失败，请手动保存。', 'warning');
      this.renderSceneRosterModal(null, key.split('_')[0]);
    }
  }

  // P2.2: 设定或切换山海经寻访目标（单一生灵目标，不覆盖主线）
  setShanhaiPursuitTarget(templateId) {
    if (!templateId || this.shanhaiPursuitTarget === templateId) {
      this.shanhaiPursuitTarget = null;
      if (typeof window !== 'undefined' && window.showGameMessage) {
        window.showGameMessage('已取消山海经寻访目标。', 'info');
      }
    } else {
      this.shanhaiPursuitTarget = templateId;
      const petDef = window.GAME_DATA?.PETS?.[templateId];
      const name = petDef ? petDef.name : templateId;
      if (typeof window !== 'undefined' && window.showGameMessage) {
        window.showGameMessage(`已将【${name}】设为山海经寻访目标！`, 'success');
      }
    }
    this.saveAutoProgress();
    const curTab = this._currentRosterTab || 'ordinary';
    if (typeof document !== 'undefined' && document.getElementById('scene-roster-modal')) {
      this.renderSceneRosterModal(templateId, curTab);
    }
  }

  // P2.2: 设定山海图鉴筛选（all: 全部, uncollected: 未献录, collectible: 可献录）
  setShanhaiFilter(filter) {
    this._shanhaiFilter = filter || 'all';
    this._shanhaiSearchFocused = false;
    this.renderSceneRosterModal(null, this._currentRosterTab || 'ordinary');
  }

  // P2.2: 设定山海图鉴名称搜索关键字
  setShanhaiSearch(keyword) {
    this._shanhaiSearchKeyword = (keyword || '').trim();
    this._shanhaiSearchFocused = true;
    this.renderSceneRosterModal(null, this._currentRosterTab || 'ordinary');
  }

  // 切换场景生灵名册模态框 (Tab 键或右上角快捷按钮呼出)
  toggleSceneRosterModal(forceState) {
    if (typeof document === 'undefined') return;
    const existing = document.getElementById('scene-roster-modal');
    if (existing) {
      if (forceState === true) return;
      this.closeShanhaiPetPickerModal();
      this._shanhaiSearchFocused = false;
      existing.remove();
      if (window.Sound && window.Sound.playBeep) window.Sound.playBeep();
      return;
    }
    if (forceState === false) return;

    this.renderSceneRosterModal();
    if (window.Sound && window.Sound.playBeep) window.Sound.playBeep();
  }

  // 渲染场景生灵名册与三界生灵图鉴 (支持 本地生灵 / 普通野怪 / 散仙名册 / 金仙圣兽 标签切换)
  renderSceneRosterModal(selectedId = null, tab = null) {
    if (typeof document === 'undefined') return;
    let modal = document.getElementById('scene-roster-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'scene-roster-modal';
      modal.className = 'roster-modal-overlay';
      modal.onclick = (e) => {
        if (e.target === modal) this.toggleSceneRosterModal(false);
      };
      const viewport = document.getElementById('game-viewport') || document.body;
      viewport.appendChild(modal);
    }

    const previousTab = this._currentRosterTab || 'scene';
    const previousListScroll = modal.querySelector('.roster-list-panel')?.scrollTop || 0;
    if (tab) this._currentRosterTab = tab;
    const currentTab = this._currentRosterTab || 'scene'; // 'scene' | 'ordinary' | 'sanxian' | 'jinxian'

    const mapData = window.GAME_DATA?.MAPS_2D?.[this.currentMapId] || { name: '当前圣境', region: '三界' };
    const npcs = this.npcs || [];
    const rawMonsters = this.monsters || [];

    // 野怪严格去重：同种野怪只展示一个，提取纯净名称与首个实例
    const uniqueMonsters = [];
    const seenMobKeys = new Set();
    for (const m of rawMonsters) {
      const pureName = (m.name || '野怪').replace(/^[0-9一二三四五六七八九十]+号?/, '').trim();
      const mobKey = `${m.appearance || 'mob'}_${pureName}`;
      if (!seenMobKeys.has(mobKey)) {
        seenMobKeys.add(mobKey);
        uniqueMonsters.push({
          key: mobKey,
          pureName: pureName,
          instance: m
        });
      }
    }

    // 全局宠物与野怪名册图鉴数据（按品质筛选）
    const book = this.getShanhai();
    for (const pet of this.pets || []) book.observe(pet);
    const allPets = Object.values(window.GAME_DATA?.PETS || {});
    const fullCodexMobs = allPets.filter(p => p.quality === currentTab);

    // P2.2: 轻量筛选与名称搜索
    this._shanhaiFilter = this._shanhaiFilter || 'all';
    const activeFilter = this._shanhaiFilter;
    const searchKw = (this._shanhaiSearchKeyword || '').trim().toLowerCase();

    const allInTabCount = fullCodexMobs.length;
    const uncollectedInTabCount = fullCodexMobs.filter(p => !book.entries?.[p.id]).length;
    const collectibleInTabCount = fullCodexMobs.filter(p => !book.entries?.[p.id] && (this.pets || []).some(pet => pet.templateId === p.id && window.ShanhaiSystem.isCollectible(pet))).length;

    let codexMobs = fullCodexMobs;
    if (currentTab !== 'scene') {
      if (activeFilter === 'uncollected') {
        codexMobs = codexMobs.filter(p => !book.entries?.[p.id]);
      } else if (activeFilter === 'collectible') {
        codexMobs = codexMobs.filter(p => !book.entries?.[p.id] && (this.pets || []).some(pet => pet.templateId === p.id && window.ShanhaiSystem.isCollectible(pet)));
      }
      if (searchKw) {
        codexMobs = codexMobs.filter(p => (p.name || '').toLowerCase().includes(searchKw));
      }
    }

    // 确定当前选中的生灵
    let selectedType = 'npc';
    let selectedObj = null;

    if (currentTab === 'scene') {
      if (selectedId) {
        const foundNpc = npcs.find(n => n.id === selectedId);
        if (foundNpc) {
          selectedType = 'npc';
          selectedObj = foundNpc;
        } else {
          const foundMob = uniqueMonsters.find(um => um.key === selectedId || um.instance.id === selectedId);
          if (foundMob) {
            selectedType = 'monster';
            selectedObj = foundMob;
          }
        }
      }

      if (!selectedObj) {
        if (npcs.length > 0) {
          selectedType = 'npc';
          selectedObj = npcs[0];
        } else if (uniqueMonsters.length > 0) {
          selectedType = 'monster';
          selectedObj = uniqueMonsters[0];
        }
      }
    } else {
      // 图鉴标签页
      selectedType = 'pet_codex';
      if (selectedId) {
        selectedObj = codexMobs.find(p => p.id === selectedId) || null;
      }
      if (!selectedObj && codexMobs.length > 0) {
        selectedObj = codexMobs[0];
      }
    }

    const tabConfig = {
      scene: { title: '当前场景万灵名册 · 任务探寻', tag: `🏯 ${mapData.name} (${mapData.region || '大唐'})` },
      ordinary: { title: '山海经 · 凡兽卷', tag: '🐾 总体成长率 0.70 ~ 0.97' },
      sanxian: { title: '山海经 · 散仙卷', tag: '🌟 总体成长率 0.87 ~ 1.08' },
      jinxian: { title: '山海经 · 金仙卷', tag: '👑 总体成长率 0.97 ~ 1.18' }
    };
    const curTabInfo = tabConfig[currentTab] || tabConfig.scene;

    const elemColors = {
      gold: '#fbbf24',
      wood: '#4ade80',
      water: '#38bdf8',
      fire: '#f87171',
      earth: '#f59e0b'
    };

    // P2.2: 寻访目标横幅
    let pursuitBannerHtml = '';
    if (currentTab !== 'scene' && this.shanhaiPursuitTarget) {
      const pursuingPet = window.GAME_DATA?.PETS?.[this.shanhaiPursuitTarget];
      if (pursuingPet) {
        const pursuingSource = window.GAME_DATA?.getShanhaiSpeciesSource ? window.GAME_DATA.getShanhaiSpeciesSource(pursuingPet.id) : null;
        pursuitBannerHtml = `
          <div class="shanhai-pursuit-banner" style="background:rgba(35,22,12,0.95);border-bottom:1.5px solid #c59b27;padding:5px 12px;display:flex;align-items:center;justify-content:space-between;font-size:11px;flex-wrap:wrap;gap:6px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:13px;">📍</span>
              <span style="color:#fde047;font-weight:bold;">当前寻访生灵：</span>
              <span style="color:#ffffff;font-weight:bold;">【${pursuingPet.name}】</span>
              <span style="color:#38bdf8;">· 栖息地：${pursuingSource?.mapName || '未知'}</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <button class="dialogue-opt-btn" style="padding:2px 8px;font-size:10px;background:#451a03;border-color:#b45309;" onclick="window.App2D.renderSceneRosterModal('${pursuingPet.id}', '${pursuingPet.quality}')">查看档案</button>
              <button class="dialogue-opt-btn" style="padding:2px 8px;font-size:10px;background:#7f1d1d;border-color:#b91c1c;" onclick="window.App2D.setShanhaiPursuitTarget(null)">取消寻访</button>
            </div>
          </div>
        `;
      }
    }

    // P2.2: 筛选工具栏
    let filterBarHtml = '';
    if (currentTab !== 'scene') {
      filterBarHtml = `
        <div class="shanhai-subfilter-bar" style="display:flex;align-items:center;justify-content:space-between;background:#18110a;border-bottom:1px solid #4a331c;padding:5px 12px;gap:8px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:4px;">
            <span style="font-size:10.5px;color:#a89682;">筛选：</span>
            <button class="dialogue-opt-btn" onclick="window.App2D.setShanhaiFilter('all')" style="padding:2px 8px;font-size:10.5px;${activeFilter === 'all' ? 'background:#b45309;color:#fff;border-color:#f59e0b;font-weight:bold;' : 'opacity:0.75;'}">
              全部 (${allInTabCount})
            </button>
            <button class="dialogue-opt-btn" onclick="window.App2D.setShanhaiFilter('uncollected')" style="padding:2px 8px;font-size:10.5px;${activeFilter === 'uncollected' ? 'background:#b45309;color:#fff;border-color:#f59e0b;font-weight:bold;' : 'opacity:0.75;'}">
              未献录 (${uncollectedInTabCount})
            </button>
            <button class="dialogue-opt-btn" onclick="window.App2D.setShanhaiFilter('collectible')" style="padding:2px 8px;font-size:10.5px;${activeFilter === 'collectible' ? 'background:#b45309;color:#fff;border-color:#f59e0b;font-weight:bold;' : 'opacity:0.75;'}">
              可献录 (${collectibleInTabCount})
            </button>
          </div>
          <div style="display:flex;align-items:center;gap:4px;">
            <input type="text" id="shanhai-search-input" placeholder="按物种名搜索..." value="${this._shanhaiSearchKeyword || ''}" oninput="window.App2D.setShanhaiSearch(this.value)" style="background:#22150c;border:1px solid #5a3d20;color:#fde047;border-radius:4px;padding:3px 8px;font-size:10.5px;width:110px;outline:none;" />
            ${this._shanhaiSearchKeyword ? `<button onclick="window.App2D.setShanhaiSearch('')" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:11px;" title="清空搜索">✕</button>` : ''}
          </div>
        </div>
      `;
    }

    // 构建生灵与场景任务万象名册 HTML
    modal.innerHTML = `
      <div class="roster-modal-box ${currentTab !== 'scene' ? 'is-shanhai' : ''}" onclick="event.stopPropagation()">
        <!-- 顶栏双龙金匾 -->
        <div class="roster-dragon-header">
          <div class="roster-header-left">
            <span class="roster-dragon-crest">🐉</span>
            <div class="roster-header-title-box">
              <span class="roster-header-main-title">${curTabInfo.title}</span>
              <span class="roster-scene-tag">${curTabInfo.tag}</span>
            </div>
          </div>
          <div class="roster-header-right">
            <span class="roster-hotkey-tip">[Tab / Esc 关闭]</span>
            <button class="roster-close-btn" onclick="window.App2D.toggleSceneRosterModal(false)" title="关闭名册 (Esc/Tab)">✕</button>
          </div>
        </div>

        <!-- 标签栏导航 (本场景生灵 / 普通野怪 / 散仙名册 / 金仙圣兽) -->
        <div class="roster-tabs" style="display:flex;background:#18110a;border-bottom:1.5px solid #78350f;padding:4px 8px;gap:6px;overflow-x:auto;">
          <button class="dialogue-opt-btn" onclick="window.App2D.renderSceneRosterModal(null, 'scene')"
            style="padding:3px 10px;font-size:11px;${currentTab === 'scene' ? 'background:#b45309;color:#fff;border-color:#f59e0b;font-weight:bold;' : 'opacity:0.75;'}">
              📌 本地
          </button>
          <button class="dialogue-opt-btn" onclick="window.App2D.renderSceneRosterModal(null, 'ordinary')"
            style="padding:3px 10px;font-size:11px;${currentTab === 'ordinary' ? 'background:#b45309;color:#fff;border-color:#f59e0b;font-weight:bold;' : 'opacity:0.75;'}">
              🐾 凡兽卷
          </button>
          <button class="dialogue-opt-btn" onclick="window.App2D.renderSceneRosterModal(null, 'sanxian')"
            style="padding:3px 10px;font-size:11px;${currentTab === 'sanxian' ? 'background:#b45309;color:#fff;border-color:#f59e0b;font-weight:bold;' : 'opacity:0.75;'}">
              🌟 散仙卷
          </button>
          <button class="dialogue-opt-btn" onclick="window.App2D.renderSceneRosterModal(null, 'jinxian')"
            style="padding:3px 10px;font-size:11px;${currentTab === 'jinxian' ? 'background:#b45309;color:#fff;border-color:#f59e0b;font-weight:bold;' : 'opacity:0.75;'}">
              👑 金仙卷
          </button>
        </div>

        ${currentTab !== 'scene' ? this.renderShanhaiRewards(currentTab) : ''}
        ${pursuitBannerHtml}
        ${filterBarHtml}
        <!-- 主体：左侧名录 + 右侧生灵详案 -->
        <div class="roster-main-body">
          <!-- 左侧生灵两级列表 (固定宽 300px，自适应平滑滚动) -->
          <div class="roster-list-panel">
            ${currentTab === 'scene' ? `
              <!-- 1. NPC 任务仙民分组 -->
              <div class="roster-group-title">
                <span class="roster-group-icon">🏛️</span>
                <span class="roster-group-name">场景仙民 / NPC (${npcs.length}位)</span>
              </div>
              <div class="roster-items-column">
                ${npcs.length === 0 ? `<div class="roster-empty-tip">当前场景暂无往来仙民</div>` : npcs.map(n => {
      const isSelected = (selectedType === 'npc' && selectedObj && selectedObj.id === n.id);
      const roleId = this.getNpcPortraitRoleId(n);
      const portraitSvg = window.Portraits ? window.Portraits.getPortraitSvg(roleId, 32) : '👤';
      const hasQuest = (n.questStatus === 'available');
      return `
                    <div class="roster-item-card ${isSelected ? 'active' : ''}" onclick="window.App2D.renderSceneRosterModal('${n.id}', 'scene')">
                      <div class="roster-item-avatar-frame">${portraitSvg}</div>
                      <div class="roster-item-info">
                        <div class="roster-item-title-row">
                          <span class="roster-item-name-text">${n.name}</span>
                          ${hasQuest ? '<span class="roster-quest-pulse-tag">🌟 任务</span>' : ''}
                        </div>
                        <div class="roster-item-desc-text">${n.title || '驻留仙民'} · [${Math.round(n.x / 32)}, ${Math.round(n.y / 32)}]</div>
                      </div>
                    </div>
                  `;
    }).join('')}
              </div>

              <!-- 2. 野怪异兽分组 (每种严格只展示一个) -->
              <div class="roster-group-title" style="margin-top:12px;">
                <span class="roster-group-icon">🐾</span>
                <span class="roster-group-name">出没异兽 / 野怪 (${uniqueMonsters.length}种)</span>
              </div>
              <div class="roster-items-column">
                ${uniqueMonsters.length === 0 ? `<div class="roster-empty-tip">当前场景太平安谧，无恶煞出没</div>` : uniqueMonsters.map(um => {
      const m = um.instance;
      const isSelected = (selectedType === 'monster' && selectedObj && selectedObj.key === um.key);
      const mobType = m.appearance || (window.Character ? window.Character.inferMonsterType(um.pureName, m.id) : 'wild_wolf');
      const portraitSvg = window.Portraits ? window.Portraits.getPortraitSvg(mobType, 32) : '🐺';
      return `
                    <div class="roster-item-card ${isSelected ? 'active' : ''}" onclick="window.App2D.renderSceneRosterModal('${um.key}', 'scene')">
                      <div class="roster-item-avatar-frame">${portraitSvg}</div>
                      <div class="roster-item-info">
                        <div class="roster-item-title-row">
                          <span class="roster-item-name-text">${um.pureName}</span>
                          <span class="roster-mob-level-pill">Lv.${m.level || 5}</span>
                        </div>
                        <div class="roster-item-desc-text">气血: ${m.hp}/${m.maxHp} · 攻击: ${m.atk}</div>
                      </div>
                    </div>
                  `;
    }).join('')}
              </div>
            ` : `
              <!-- 图鉴模式列表 -->
              <div class="roster-group-title">
                <span class="roster-group-icon">${currentTab === 'jinxian' ? '👑' : (currentTab === 'sanxian' ? '🌟' : '🐾')}</span>
                <span class="roster-group-name">全录 ${codexMobs.length} 种 · 已收录 ${book.counts()[currentTab]} 种</span>
              </div>
              <div class="roster-items-column">
                ${codexMobs.length ? '' : '<div class="roster-empty-tip">书页尚空。去野外结识生灵，招降后可献录成篇。</div>'}
                ${codexMobs.map(p => {
      const isSelected = (selectedType === 'pet_codex' && selectedObj && selectedObj.id === p.id);
      const elemCol = elemColors[p.element] || '#ffd700';
      const isCollected = !!(book.entries && book.entries[p.id]);
      const isSeen = !isCollected && !!(book.seen && book.seen[p.id]);
      const isPursuitTarget = (this.shanhaiPursuitTarget === p.id);
      const hasCollectiblePet = !isCollected && (this.pets || []).some(pet => pet.templateId === p.id && window.ShanhaiSystem.isCollectible(pet));
      const statusClass = isCollected ? 'status-green' : (isSeen ? 'status-white' : 'status-grey');
      const statusTagHtml = isCollected
        ? '<span class="shanhai-status-tag tag-green">✓ 已收录</span>'
        : (isSeen ? '<span class="shanhai-status-tag tag-white">👁️ 已遇见</span>' : '<span class="shanhai-status-tag tag-grey">❓ 未遇见</span>');
      return `
                    <div class="roster-item-card ${isSelected ? 'active' : ''}" onclick="window.App2D.renderSceneRosterModal('${p.id}', '${currentTab}')">
                      <div class="roster-item-avatar-frame" style="display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:50%;width:34px;height:34px;flex-shrink:0;">${window.Portraits ? window.Portraits.getPortraitSvg(this.getUnitVisualId({ templateId: p.id }), 34, { noBorder: true }) : `<span style="font-size:22px;">${p.icon || '🐾'}</span>`}</div>
                      <div class="roster-item-info">
                        <div class="roster-item-title-row">
                          <span class="roster-item-name-text ${statusClass}">${p.name}</span>
                          <div style="display:flex;align-items:center;gap:3px;">
                            ${isPursuitTarget ? '<span style="font-size:9px;padding:1px 4px;border-radius:3px;background:rgba(245,158,11,0.25);border:1px solid #f59e0b;color:#fde047;font-weight:bold;">📍寻访</span>' : ''}
                            ${hasCollectiblePet ? '<span style="font-size:9px;padding:1px 4px;border-radius:3px;background:rgba(16,185,129,0.25);border:1px solid #10b981;color:#34d399;font-weight:bold;">📥可献</span>' : ''}
                            ${statusTagHtml}
                            <span style="font-size:9.5px;padding:1px 4px;border-radius:3px;border:1px solid ${elemCol};color:${elemCol};background:rgba(0,0,0,0.5);font-weight:bold;">${p.elementName || '中立'}</span>
                          </div>
                        </div>
                        <div class="roster-item-desc-text shanhai-list-growth" style="display:flex;justify-content:space-between;align-items:center;">
                          <span>成长 ${p.growthRange ? `${p.growthRange[0].toFixed(2)}~${p.growthRange[1].toFixed(2)}` : '标准'}</span>
                          ${!isCollected ? `<button class="shanhai-collect-trigger-btn" style="padding:1px 6px;font-size:9.5px;margin-left:auto;" onclick="event.stopPropagation(); window.App2D.openShanhaiPetPickerModal('${p.id}')">📥 献录</button>` : ''}
                        </div>
                      </div>
                    </div>
                  `;
    }).join('')}
              </div>
            `}
          </div>

          <!-- 右侧生灵精研档案详情 (自适应弹性填充) -->
          <div class="roster-detail-panel">
            ${selectedObj ? this._renderRosterDetailCard(selectedType, selectedObj) : `<div class="roster-empty-tip">请选择左侧生灵查阅档案详案</div>`}
          </div>
        </div>
      </div>
    `;
    const listPanel = modal.querySelector('.roster-list-panel');
    if (listPanel && previousTab === currentTab) listPanel.scrollTop = previousListScroll;

    if (this._shanhaiSearchFocused) {
      const searchInput = modal.querySelector('#shanhai-search-input');
      if (searchInput) {
        searchInput.focus();
        const len = searchInput.value.length;
        searchInput.setSelectionRange(len, len);
      }
    }
  }

  // 内部辅助：渲染名册右侧详案卡片 (国风玉简极度精细排版)
  _renderRosterDetailCard(type, obj) {
    if (type === 'npc') {
      const npc = obj;
      const roleId = this.getNpcPortraitRoleId(npc);
      const bigPortraitSvg = window.Portraits ? window.Portraits.getPortraitSvg(roleId, 68) : '👤';
      const roleSeal = window.Dialogue ? window.Dialogue.getRoleBadge(roleId, npc.name) : '<div class="dialogue-role-seal seal-mortal">人</div>';
      const coordX = Math.round(npc.x / 32);
      const coordY = Math.round(npc.y / 32);
      const hasQuest = (npc.questStatus === 'available');

      return `
        <div class="roster-card-content">
          <!-- 头部肖像与尊号 -->
          <div class="roster-card-header">
            <div class="roster-card-avatar-wrap">
              ${bigPortraitSvg}
              ${roleSeal}
            </div>
            <div class="roster-card-title-wrap">
              <div class="roster-card-name-row">
                <span class="roster-card-name">${npc.name}</span>
                <span class="roster-card-tag">${npc.title || '三界隐逸仙民'}</span>
              </div>
              <div class="roster-card-location">📍 场景罗盘坐标: [横向 ${coordX}, 纵向 ${coordY}]</div>
            </div>
          </div>

          <div class="roster-card-divider"></div>

          <!-- 任务机缘专区 -->
          <div class="roster-info-block ${hasQuest ? 'highlight-quest-block' : ''}">
            <div class="roster-block-label">
              <span>${hasQuest ? '🌟 核心任务机缘与交接' : '🎯 往来仙道机缘'}</span>
            </div>
            <div class="roster-block-desc">
              ${hasQuest
          ? '【重要提示】当前少侠正处于此人主持的剧情因缘中！与之交谈将触发关键剧情推进、领取神装或进入全新冒险章节！'
          : '闲暇神游于此方天地。少侠可前往与之探讨西行秘辛、市井风物或请教天地大道。'}
            </div>
          </div>

          <!-- 仙灵生平传记专区 -->
          <div class="roster-info-block">
            <div class="roster-block-label">
              <span>📖 仙家生平与三界因缘</span>
            </div>
            <div class="roster-block-desc">
              ${npc.dialogueKey
          ? '西游大世中举足轻重之关键神佛仙灵，一言一行牵动九重天阙与幽冥六道。'
          : '常年驻留于此的世外散仙凡灵，热心指引过往少侠历练修行。'}
            </div>
          </div>

          <!-- 底部快捷寻路按钮 -->
          <div class="roster-card-action-row">
            <button class="roster-action-nav-btn" onclick="window.App2D.navigateRosterToNpc('${npc.id}')">
              🚶 一键智能寻路前往拜会
            </button>
          </div>
        </div>
      `;
    } else if (type === 'pet_codex') {
      const p = obj;
      const elemName = p.elementName || (window.FiveElements ? window.FiveElements.NAMES[p.element] : '中立');
      const elemColors = { gold: '#fbbf24', wood: '#4ade80', water: '#38bdf8', fire: '#f87171', earth: '#f59e0b' };
      const elemColor = elemColors[p.element] || '#ffd700';
      const growthRangeStr = p.growthRange ? `${p.growthRange[0].toFixed(2)} ~ ${p.growthRange[1].toFixed(2)}` : '标准成长';
      const tierOverallStr = p.quality === 'jinxian' ? '0.97 ~ 1.18' : (p.quality === 'sanxian' ? '0.87 ~ 1.08' : '0.70 ~ 0.97');
      const skillsStr = p.skills && p.skills.length > 0 ? p.skills.join('、') : (p.quality === 'ordinary' ? '普通物理攻击' : '10级后于神坛免费传法一次：随机门派、随机适配性别的技能');
      const locationStr = p.habitat || (p.desc?.includes('】') ? p.desc.split('】')[1].split('，')[0] : '西行途中可偶遇');

      const bounds = (window.GAME_DATA?.getPetInitialBounds)
        ? window.GAME_DATA.getPetInitialBounds(p)
        : [
          { name: '📈 成长率', init: p.growthRange ? ((p.growthRange[0] + p.growthRange[1]) / 2).toFixed(2) : '0.76', range: p.growthRange ? `${p.growthRange[0].toFixed(2)} ~ ${p.growthRange[1].toFixed(2)}` : '0.70 ~ 0.85' },
          { name: '🩸 生命值', init: 55, range: '50 ~ 71' },
          { name: '✨ 法力值', init: 45, range: '42 ~ 68' },
          { name: '⚔️ 攻击力', init: 22, range: '15 ~ 38' },
          { name: '🌪️ 出手速度', init: 5, range: '2 ~ 13' }
        ];

      const captureTip = p.quality === 'jinxian'
        ? '需持有道祖至宝【紫金红葫芦】，在对战中施展【招降】指令即可收服，收服几率约 60%。'
        : (p.quality === 'sanxian'
          ? '需持有仙家法宝【收仙银壶】（紫竹银葫芦），在对战中施展【招降】指令即可收服，收服几率约 70%。'
          : '在对战中直接使用【招降】指令即可收服，成功率约 80%（建议将其气血压制在 30% 以下更易成功）。');

      const book = this.getShanhai();
      const isCollected = !!(book.entries && book.entries[p.id]);
      const isSeen = !isCollected && !!(book.seen && book.seen[p.id]);
      const statusClass = isCollected ? 'status-green' : (isSeen ? 'status-white' : 'status-grey');

      // P2.1 & P2.2: 真实来源与可达性字典查询
      const sourceInfo = window.GAME_DATA?.getShanhaiSpeciesSource ? window.GAME_DATA.getShanhaiSpeciesSource(p.id) : (p.sourceInfo || {
        category: 'common_wild',
        categoryName: '地图常见',
        mapId: p.habitatMapId || 'huaguoshan',
        mapName: locationStr,
        conditionDesc: '野外常规遇敌',
        accessible: true
      });

      const catBadges = {
        common_wild: { text: '🌲 地图常见', color: '#34d399', border: '#10b981', bg: 'rgba(6,78,59,0.7)' },
        encounter: { text: '🎲 概率偶遇', color: '#fde047', border: '#f59e0b', bg: 'rgba(120,53,15,0.7)' },
        gift_only: { text: '🎁 赠礼专属', color: '#c084fc', border: '#8b5cf6', bg: 'rgba(76,29,149,0.7)' },
        unreachable: { text: '⏳ 尚未开放', color: '#9ca3af', border: '#6b7280', bg: 'rgba(55,65,81,0.7)' }
      };
      const catBadge = catBadges[sourceInfo.category] || catBadges.common_wild;

      // 随行持有与受保护数统计
      const playerPets = this.pets || [];
      const ownedSpeciesPets = playerPets.filter(pet => pet.templateId === p.id);
      const ownedCount = ownedSpeciesPets.length;
      const protectedCount = ownedSpeciesPets.filter(pet => pet.isProtected).length;

      // 招降容器与道具持有实时核验
      const inv = this.inventory;
      const silverCount = inv?.getItemCount ? inv.getItemCount('silver_gourd') : (Array.isArray(inv) ? inv.find(i => i.id === 'silver_gourd')?.count || 0 : 0);
      const goldCount = inv?.getItemCount ? inv.getItemCount('gold_gourd') : (Array.isArray(inv) ? inv.find(i => i.id === 'gold_gourd')?.count || 0 : 0);
      let vesselText = '无需特殊容器，在对战中削弱敌方血量后使用【招降】指令即可收服，成功率约 80%';
      if (p.quality === 'sanxian') {
        vesselText = `需消耗仙家法宝【收仙银壶】招降（当前持有: <strong style="color:${silverCount > 0 ? '#34d399' : '#f87171'}">${silverCount}</strong> 个）`;
      } else if (p.quality === 'jinxian') {
        vesselText = `需消耗道祖至宝【紫金红葫芦】招降（当前持有: <strong style="color:${goldCount > 0 ? '#34d399' : '#f87171'}">${goldCount}</strong> 个）`;
      }

      // 下一档里程碑赠礼距离
      const bookRewards = book.rewards().filter(r => r.quality === p.quality);
      const nextReward = bookRewards.find(r => !r.unlocked);
      const collectedCount = book.counts()[p.quality];
      const distToNext = nextReward ? Math.max(0, nextReward.threshold - collectedCount) : 0;
      const rewardDistStr = nextReward
        ? `距下档【${nextReward.label}】赠礼还差 <strong style="color:#fde047;">${distToNext}</strong> 种新物种`
        : '🎉 本卷功德赠礼已全部达成！';

      // 寻访目标实时方向与状态
      const isPursuing = (this.shanhaiPursuitTarget === p.id);
      let directionHint = '';
      if (sourceInfo.category === 'unreachable') {
        directionHint = '该生灵尚未开放野外现身，建议先寻访其他生灵。';
      } else if (sourceInfo.category === 'gift_only') {
        directionHint = '该生灵为山海经里程碑赠礼专属，无法在野外直接招降。';
      } else if (this.currentMapId === sourceInfo.mapId) {
        directionHint = `少侠已身处栖息地【${sourceInfo.mapName}】！在野外踱步巡查即有机缘偶遇招降。`;
      } else if (sourceInfo.accessible) {
        directionHint = `自当前【${window.GAME_DATA?.MAPS_2D?.[this.currentMapId]?.name || '场景'}】沿途前往【${sourceInfo.mapName}】寻访。`;
      } else {
        directionHint = `栖息地【${sourceInfo.mapName}】暂未对当前主线开放，请先推进西行历练。`;
      }

      return `
        <div class="roster-card-content">
          <!-- 头部肖像与名称、品质与五行 -->
          <div class="roster-card-header">
            <div class="roster-card-avatar-wrap" style="display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.4);border:2px solid ${elemColor};border-radius:8px;position:relative;overflow:hidden;width:68px;height:68px;flex-shrink:0;">
              ${window.Portraits ? window.Portraits.getPortraitSvg(this.getUnitVisualId({ templateId: p.id }), 64, { noBorder: true }) : `<span style="font-size:42px;">${p.icon || '🐾'}</span>`}
              <div class="dialogue-role-seal seal-${p.quality === 'jinxian' ? 'god' : (p.quality === 'sanxian' ? 'immortal' : 'demon')}">${p.qualityName}</div>
            </div>
            <div class="roster-card-title-wrap">
              <div class="roster-card-name-row" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <span class="roster-card-name ${statusClass}">${p.name}</span>
                <span style="font-size:11px;padding:2px 8px;border-radius:10px;border:1px solid ${elemColor};color:${elemColor};background:rgba(0,0,0,0.6);font-weight:bold;">
                  【${p.qualityName} · ${elemName}行属性】
                </span>
                ${isCollected
          ? '<span class="shanhai-collected-badge">✅ 已收录至《山海经》</span>'
          : `<button class="shanhai-collect-trigger-btn" onclick="window.App2D.openShanhaiPetPickerModal('${p.id}')">📥 献录至山海经</button>`
        }
              </div>
              <div class="roster-card-location" style="color:#fde047;">📍 栖息出没：${sourceInfo.mapName || locationStr}</div>
            </div>
          </div>

          <div class="roster-card-divider"></div>

          <!-- P2.2: 真实出没与寻访指引 -->
          <div class="roster-info-block" style="background:rgba(26,17,10,0.82);border-color:#a16207;padding:8px 10px;">
            <div class="roster-block-label" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <span>🗺️ 真实出没与寻访线索</span>
              <span style="font-size:10px;padding:1px 6px;border-radius:4px;border:1px solid ${catBadge.border};background:${catBadge.bg};color:${catBadge.color};font-weight:bold;">${catBadge.text}</span>
            </div>
            <div style="font-size:11px;color:#cbd5e1;line-height:1.6;">
              <div>• 栖息场景：<strong style="color:#fde047;">${sourceInfo.mapName || '未知'}</strong> (${sourceInfo.accessible ? '<span style="color:#34d399;">✓ 当前主线可抵达</span>' : '<span style="color:#f87171;">🔒 需推进主线解锁</span>'})</div>
              <div>• 偶遇条件：<span style="color:#f5e8d0;">${sourceInfo.conditionDesc || '野外常规遇敌'}</span></div>
              <div>• 招降法门：<span style="color:#38bdf8;">${vesselText}</span></div>
              <div>• 随行持有：<span style="color:#e2d5c2;">共 <strong>${ownedCount}</strong> 只${protectedCount > 0 ? ` (其中 <strong style="color:#ef4444;">${protectedCount}</strong> 只受加锁保护)` : ''}</span></div>
              <div style="margin-top:2px;">• 献录进展：<span style="color:#a89682;">${rewardDistStr}</span></div>
            </div>

            <!-- 寻访目标按钮与方向说明 -->
            <div style="margin-top:8px;padding-top:6px;border-top:1px dashed #5a3d20;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;">
              <div style="font-size:10.5px;color:#a89682;">
                🧭 寻访指引：${directionHint}
              </div>
              <button class="dialogue-opt-btn" onclick="window.App2D.setShanhaiPursuitTarget('${p.id}')" style="padding:4px 12px;font-size:11px;${isPursuing ? 'background:#6b281b;border-color:#b91c1c;color:#fff;' : 'background:linear-gradient(180deg, #b4833e, #825a22);border-color:#d4af37;color:#fff;font-weight:bold;'}">
                ${isPursuing ? '📍 正在寻访中 · 点击取消' : '📍 设为本次寻访目标'}
              </button>
            </div>
          </div>

          <!-- 核心：初始属性与上下边界对照表 (两列展示) -->
          <div class="roster-info-block" style="background:rgba(30,18,9,0.78);border-color:#b45309;padding:6px 10px;">
            <div class="roster-block-label" style="margin-bottom:4px;">
              <span>📊 初始属性与成长边界对照表</span>
              <span style="font-size:10.5px;color:#cbd5e1;">品阶: ${p.qualityName} (${tierOverallStr})</span>
            </div>
            <table class="shanhai-stat-table">
              <thead>
                <tr>
                  <th style="width:34%;text-align:left;padding-left:12px;">属性项</th>
                  <th style="width:33%;">初始属性</th>
                  <th style="width:33%;">上下边界</th>
                </tr>
              </thead>
              <tbody>
                ${bounds.map(b => `
                  <tr>
                    <td class="shanhai-stat-name">${b.name}</td>
                    <td class="shanhai-stat-init">${b.init}</td>
                    <td class="shanhai-stat-range">${b.range}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- 如何招降法门 -->
          <div class="roster-info-block" style="background:rgba(25,15,8,0.7);border-color:#78350f;">
            <div class="roster-block-label">
              <span>📜 招降法门 (如何招降)</span>
            </div>
            <div class="roster-block-desc" style="font-size:11px;color:#fef08a;line-height:1.6;">
              ${captureTip}
            </div>
          </div>

          ${this.renderShanhaiCollection(p)}
        </div>
      `;
    } else {
      const um = obj;
      const mob = um.instance;
      const mobType = mob.appearance || (window.Character ? window.Character.inferMonsterType(um.pureName, mob.id) : 'wild_wolf');
      const bigPortraitSvg = window.Portraits ? window.Portraits.getPortraitSvg(mobType, 68) : '🐺';
      const hpPct = Math.round((mob.hp / mob.maxHp) * 100);

      return `
        <div class="roster-card-content">
          <!-- 头部肖像与等级 -->
          <div class="roster-card-header">
            <div class="roster-card-avatar-wrap">
              ${bigPortraitSvg}
              <div class="dialogue-role-seal seal-demon">妖</div>
            </div>
            <div class="roster-card-title-wrap">
              <div class="roster-card-name-row">
                <span class="roster-card-name">${um.pureName}</span>
                <span class="roster-mob-level-pill" style="font-size:12px;padding:2px 8px;">Lv.${mob.level || 5}</span>
              </div>
              <div class="roster-card-location" style="color:#ff7675;">⚔️ 巡逻警戒领地: 半径 ${mob.patrolRadius || 30} 步</div>
            </div>
          </div>

          <div class="roster-card-divider"></div>

          <!-- 气血与元神充盈度 -->
          <div class="roster-info-block">
            <div class="roster-block-label">
              <span>🩸 气血灵韵 (生命值)</span>
              <span style="font-size:11px;color:#fffa65;">${mob.hp} / ${mob.maxHp} (${hpPct}%)</span>
            </div>
            <div class="roster-bar-container">
              <div class="roster-bar-fill" style="width:${hpPct}%;"></div>
            </div>
          </div>

          <!-- 战法修持三维 -->
          <div class="roster-info-block">
            <div class="roster-block-label">
              <span>⚡ 战法修行三维能力</span>
            </div>
            <div class="roster-stats-triplet">
              <div class="roster-stat-box">
                <span class="stat-icon">⚔️</span>
                <span class="stat-name">物理攻击</span>
                <span class="stat-num" style="color:#ff6b6b;">${mob.atk}</span>
              </div>
              <div class="roster-stat-box">
                <span class="stat-icon">🛡️</span>
                <span class="stat-name">物理防御</span>
                <span class="stat-num" style="color:#48dbfb;">${mob.def}</span>
              </div>
              <div class="roster-stat-box">
                <span class="stat-icon">🌪️</span>
                <span class="stat-name">身法速度</span>
                <span class="stat-num" style="color:#1dd1a1;">${mob.spd}</span>
              </div>
            </div>
          </div>

          <!-- 掌握神通 -->
          <div class="roster-info-block">
            <div class="roster-block-label">
              <span>🔥 掌握神通武技</span>
            </div>
            <div class="roster-skills-wrap">
              ${(mob.skills || ['普通攻击']).map(sk => `<span class="roster-skill-badge">🥋 ${sk}</span>`).join('')}
            </div>
          </div>

          <!-- 异兽生息录与警示 -->
          <div class="roster-info-block">
            <div class="roster-block-label">
              <span>📜 异兽生息录</span>
            </div>
            <div class="roster-block-desc">
              ${mob.dialogue?.[0] || '游荡于此方胜境之天地凶兽精怪。斩灭可淬炼道行经验，战斗中亦可施展【收服】将其纳为护法仙宠。'}
            </div>
          </div>

          <div class="roster-card-action-row">
            <div class="roster-mob-warning-box">
              ⚠️ 靠近游荡野怪身旁将立即切入回合制对战，请备好仙药！
            </div>
          </div>
        </div>
      `;
    }
  }

  // 名册一键智能寻路到指定 NPC
  navigateRosterToNpc(npcId) {
    this.toggleSceneRosterModal(false);
    const npc = this.npcs.find(n => n.id === npcId);
    if (!npc) return;

    const mapData = window.GAME_DATA.MAPS_2D[this.currentMapId];
    if (!mapData) return;

    const playerDist = Math.hypot(npc.x - this.playerChar.x, npc.y - this.playerChar.y);
    if (playerDist < (npc.interactRadius || 42)) {
      this.triggerNpcDialogue(npc);
      return;
    }

    const path = this.pathfinding.findPath(
      mapData, this.tilemap,
      this.playerChar.x, this.playerChar.y,
      npc.x, npc.y
    );
    if (path && path.length > 0) {
      this.autoMovePath = path;
      this.autoMoveTargetCallback = () => this.triggerNpcDialogue(npc);
      this.spawnClickRipple(npc.x, npc.y);
      if (window.Sound && window.Sound.playBeep) window.Sound.playBeep();
      if (window.showGameMessage) {
        window.showGameMessage(`正在前往【${npc.name}】...`, 'info', 2000);
      }
    } else {
      if (window.showGameMessage) {
        window.showGameMessage(`已锁定【${npc.name}】方位，请径直前往！`, 'info', 2500);
      }
    }
  }

  // =========================================================================
  // 菩提老祖神坛交互：技能熟练度体系、1/5提前突破、全职业授业与仙宠10级觉醒
  // =========================================================================

  // 初始化或保障角色门派技能
  ensurePlayerClassSkills() {
    this.playerData = this.playerData || {};
    this.playerData.skills = this.playerData.skills || [];
    if (this.playerData.skills.length === 0) {
      const clsId = this.playerData.classId || this.playerData.class || 'jingang';
      const gender = this.playerData.gender || 'male';
      if (window.GAME_DATA && typeof window.GAME_DATA.getSkillsForClassAndGender === 'function') {
        this.playerData.skills = window.GAME_DATA.getSkillsForClassAndGender(clsId, gender);
      }
    }
    return this.playerData.skills;
  }

  // 拜谒菩提老祖：领悟门派道法
  learnClassSkillsFromMaster() {
    const clsId = this.playerData.classId || this.playerData.class || 'jingang';
    const gender = this.playerData.gender || 'male';
    if (window.GAME_DATA && typeof window.GAME_DATA.getSkillsForClassAndGender === 'function') {
      const newSkills = window.GAME_DATA.getSkillsForClassAndGender(clsId, gender);
      // 保留已有的熟练度和等级
      newSkills.forEach(ns => {
        const exist = (this.playerData.skills || []).find(s => s.id === ns.id);
        if (exist) {
          ns.level = exist.level || 1;
          ns.mastery = exist.mastery || 0;
        }
      });
      this.playerData.skills = newSkills;
      if (window.Sound && window.Sound.playSuccess) window.Sound.playSuccess();
      if (window.showGameMessage) {
        window.showGameMessage(`✨【老祖传道】菩提老祖拂尘点化，恭喜领悟本门三大正统神通技能！`, 'success', 4500);
      }
    }
  }

  // 祖师授法使用实际随行仙宠库，不再访问 playerData 中不存在的仙宠字段。
  awakenPetSkillAtMaster() {
    if (this.currentMapId !== 'changan_shendan' || this.currentBattle || this.isTransitioning) {
      window.showGameMessage('请在长安旁神坛拜谒菩提祖师。', 'info');
      return;
    }
    const eligible = (this.pets || []).filter(p => ['sanxian', 'jinxian'].includes(p.quality) &&
      p.level >= 10 && !p.masterLessonLearned && !p.skills?.length && !p.classId);
    if (!eligible.length) {
      window.showGameMessage('祖师道：带未受过传法的10级散仙或金仙来，每只免费传法一次。', 'info');
      return;
    }
    this.openPetManageModal();
    window.showGameMessage('请在仙宠面板选择要受法的仙宠；随机门派与技能均遵循其性别。', 'info');
  }

  // 打开【神坛·技能参悟与熟练度突破】模态框
  openSkillMasteryModal() {
    if (typeof document === 'undefined') return;
    const old = document.getElementById('skill-mastery-modal');
    if (old) old.remove();

    this.ensurePlayerClassSkills();
    const skills = this.playerData.skills || [];
    const isAtShendan = (this.currentMapId === 'changan_shendan');

    const html = `
      <div id="skill-mastery-modal" class="modal-overlay active" style="z-index:9999;display:flex;align-items:center;justify-content:center;">
        <div class="roster-modal-box" style="width:720px;max-width:96vw;height:520px;display:flex;flex-direction:column;background:radial-gradient(circle at center, #24140b 0%, #120904 100%);border:2px solid #ffd700;box-shadow:0 0 25px rgba(0,0,0,0.9), 0 0 15px rgba(255,215,0,0.3);border-radius:10px;overflow:hidden;font-family:'Noto Serif SC','SimSun',serif;">
          
          <!-- 顶栏金匾 -->
          <div class="roster-dragon-header" style="padding:10px 16px;background:linear-gradient(to right, #4a2810, #804e1c, #4a2810);border-bottom:2px solid #ffd700;display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:18px;">✨</span>
              <span style="font-size:16px;font-weight:bold;color:#ffd700;text-shadow:0 0 6px rgba(255,215,0,0.6);">长安神坛 · 菩提老祖道法参悟</span>
              <span style="font-size:11px;padding:1px 6px;border-radius:4px;background:#3a1c0c;border:1px solid #c59b27;color:#f5deb3;">五级熟练度法则</span>
            </div>
            <button onclick="document.getElementById('skill-mastery-modal').remove()" style="background:transparent;border:none;color:#ffd700;font-size:18px;cursor:pointer;">✕</button>
          </div>

          <!-- 法则提醒条 -->
          <div style="background:#1b0f07;padding:6px 16px;border-bottom:1px solid #5a3818;font-size:11px;color:#dcdcdc;display:flex;justify-content:space-between;align-items:center;">
            <span>📜 <strong>五级熟练度法则</strong>：每级跨度5000，满熟练度25000！当前品级达到 1/5(1000点) 即可找菩提老祖突破！</span>
            <span style="color:${isAtShendan ? '#2ed573' : '#ffa502'};font-weight:bold;">${isAtShendan ? '📍 现正处于长安神坛' : '⚠️ 需至长安神坛找菩提老祖突破'}</span>
          </div>

          <!-- 技能列表区 -->
          <div style="flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:12px;">
            ${skills.map(sk => {
      const lvl = sk.level || 1;
      const mastery = (sk.mastery !== undefined) ? sk.mastery : (sk.proficiency || 0);
      const isLocked = window.SkillMasteryEngine ? window.SkillMasteryEngine.isLevelLocked(lvl, mastery) : (mastery >= lvl * 5000);
      const canUp = window.SkillMasteryEngine ? window.SkillMasteryEngine.canUpgrade(lvl, mastery) : false;
      const minReq = window.SkillMasteryEngine ? window.SkillMasteryEngine.getMinMasteryForUpgrade(lvl) : 1000;
      const spanMax = lvl * 5000;
      const pct = Math.min(100, Math.floor((mastery / spanMax) * 100));

      // 预览数值
      let previewText = '';
      if (sk.name === '舍生取义' || sk.id === 'sk_jg_shesheng') {
        const c = window.SkillMasteryEngine.calculateShesheng(null, null, lvl, mastery);
        previewText = `技能绝杀: ${c.damage} | 自损反噬: ${c.selfDamage} | 耗蓝: ${c.costMp} (气血需>=10%)`;
      } else if (sk.name === '雷霆万钧' || sk.id === 'sk_ym_leiting') {
        const c = window.SkillMasteryEngine.calculateLeiting(null, null, lvl, mastery);
        previewText = `单体法伤: ${c.damage} | 耗蓝: ${c.costMp} MP (极高魔雷)`;
      } else if (sk.name === '封印咒' || sk.id === 'sk_xr_fengyin') {
        const c = window.SkillMasteryEngine.calculateControlSpell('fengyin', lvl, mastery);
        previewText = `封印硬控 | 命中率: ${(c.hitRate * 100).toFixed(1)}% | 耗蓝: ${c.costMp} MP`;
      } else if (sk.name === '定身咒' || sk.id === 'sk_xr_dingshen') {
        const c = window.SkillMasteryEngine.calculateControlSpell('dingshen', lvl, mastery);
        previewText = `定身禁锢 | 命中率: ${(c.hitRate * 100).toFixed(1)}% | 受击即苏醒 | 耗蓝: ${c.costMp} MP`;
      } else if (sk.name === '乱魂咒' || sk.id === 'sk_xr_luanhun') {
        const c = window.SkillMasteryEngine.calculateControlSpell('luanhun', lvl, mastery);
        previewText = `混乱内讧 | 命中率: ${(c.hitRate * 100).toFixed(1)}% | 耗蓝: ${c.costMp} MP`;
      } else if (sk.name === '三昧真火' || sk.name === '飞沙走石') {
        const c = window.SkillMasteryEngine.calculateGroupSpell(sk.name, null, 4, lvl, mastery);
        previewText = `群法必中 | 目标: 1~${c.maxTargets}人 | 人均: ${c.perTargetDamage} | 耗蓝: ${c.costMp} MP`;
      } else if (sk.name === '佛光普照' || sk.name === '如来神掌') {
        const c = window.SkillMasteryEngine.calculateMpDrainAttack(sk.name === '如来神掌', null, null, lvl, mastery);
        previewText = `削血: ${c.damage} | 扣蓝: ${c.mpDrain} MP | 耗蓝: ${c.costMp} MP`;
      } else {
        previewText = sk.desc;
      }

      return `
                <div style="background:#1a0f07;border:1.5px solid ${isLocked ? '#ff4757' : (canUp ? '#ffd700' : '#4a2c16')};border-radius:8px;padding:12px;display:flex;align-items:center;gap:14px;box-shadow:0 3px 8px rgba(0,0,0,0.5);">
                  <div style="font-size:32px;width:52px;height:52px;background:#2d170a;border:1px solid #c59b27;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    ${sk.icon || '⚔️'}
                  </div>
                  <div style="flex:1;min-width:0;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                      <span style="font-size:16px;font-weight:bold;color:#ffd700;">${sk.name}</span>
                      <span style="font-size:11px;padding:1px 6px;border-radius:4px;background:#502c11;color:#fff;border:1px solid #ffd700;">Lv.${lvl} / 5</span>
                      ${isLocked ? '<span style="font-size:10px;padding:1px 6px;border-radius:3px;background:#eb4d4b;color:#fff;">⚠️ 当前品级已锁级(满5000)</span>' : ''}
                      ${canUp && !isLocked ? '<span style="font-size:10px;padding:1px 6px;border-radius:3px;background:#27ae60;color:#fff;">✨ 达到1/5门槛可提前突破</span>' : ''}
                    </div>

                    <!-- 进度条 -->
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                      <div style="flex:1;height:8px;background:#0d0603;border:1px solid #5a361c;border-radius:4px;overflow:hidden;">
                        <div style="width:${pct}%;height:100%;background:linear-gradient(to right, #e67e22, #f1c40f);border-radius:4px;"></div>
                      </div>
                      <span style="font-size:11px;color:#f39c12;font-family:monospace;white-space:nowrap;">熟练度: ${mastery} / ${spanMax} (${pct}%)</span>
                    </div>

                    <div style="font-size:11px;color:#bdc3c7;display:flex;justify-content:space-between;">
                      <span>${previewText}</span>
                      <span style="color:#aaa;">升Lv.${lvl + 1}最低门槛: ${minReq || 25000}</span>
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div style="flex-shrink:0;">
                    ${lvl >= 5 ? `
                      <button disabled style="padding:6px 12px;background:#333;color:#888;border:1px solid #555;border-radius:6px;font-size:12px;">已登峰造极</button>
                    ` : (canUp ? `
                      <button onclick="window.App2D.upgradeSkillAtMaster('${sk.id}')" style="padding:6px 14px;background:linear-gradient(to bottom, #f39c12, #d35400);color:#fff;font-weight:bold;border:1px solid #ffd700;border-radius:6px;font-size:12px;cursor:pointer;box-shadow:0 0 8px rgba(243,156,18,0.6);" ${!isAtShendan ? 'title="当前未在神坛，点击将由老祖神念传道"' : ''}>
                        🌟 老祖点化突破 (升Lv.${lvl + 1})
                      </button>
                    ` : `
                      <button disabled style="padding:6px 12px;background:#221208;color:#777;border:1px solid #442512;border-radius:6px;font-size:11px;">
                        需熟练度 ${minReq}
                      </button>
                    `)}
                  </div>
                </div>
              `;
    }).join('')}
          </div>

          <!-- 底栏 -->
          <div style="padding:10px 16px;background:#140b05;border-top:1px solid #4a2810;display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:11px;color:#aaa;">长安城左上角入口直通神坛，凡技能初悟、突破与仙宠授法皆系于菩提老祖。</span>
            <button onclick="document.getElementById('skill-mastery-modal').remove()" style="padding:5px 16px;background:#3a1d0c;color:#ffd700;border:1px solid #ffd700;border-radius:4px;cursor:pointer;">关闭面板</button>
          </div>

        </div>
      </div>
    `;

    const v = document.getElementById('game-viewport') || document.body;
    v.insertAdjacentHTML('beforeend', html);
  }

  // 在菩提老祖处执行突破升级
  upgradeSkillAtMaster(skillId) {
    this.ensurePlayerClassSkills();
    const skill = (this.playerData.skills || []).find(s => s.id === skillId);
    if (!skill) return;

    if (!window.SkillMasteryEngine) return;
    const res = window.SkillMasteryEngine.upgradeSkill(skill, true);
    if (res.success) {
      if (window.Sound && window.Sound.playSuccess) window.Sound.playSuccess();
      if (window.showGameMessage) window.showGameMessage(res.message, 'success', 4500);
      this.openSkillMasteryModal(); // 刷新界面
    } else {
      if (window.showGameMessage) window.showGameMessage(res.message, 'warning', 3500);
    }
  }
}

window.App2D = new GameApp2D();
window.addEventListener('DOMContentLoaded', () => {
  window.App2D.init();
});

