/**
 * 山海经物种归纳系统与生灵映射 (ShanhaiSpecies Canonical)
 * 严格遵照《西游OL 仙宠总表》：50普通野怪、12散仙、15金仙。
 * 地图野怪按名称与类型映射到标准物种，严禁擅增非规约物种。
 */
(function () {
  const data = window.GAME_DATA;
  if (!data || !data.PETS) return;
  const pets = data.PETS;

  const cleanName = name => String(name || '')
    .replace(/^变异/, '')
    .replace(/\s*[（(].*?[）)]/g, '')
    .replace(/[一二三四五六七八九十0-9]+号/g, '')
    .trim();

  const byName = new Map(Object.values(pets).map(p => [p.name, p.id]));
  const aliases = {
    '混混': 'hooligan_wild',
    '街头混混': 'hooligan_wild',
    '草寇': 'caokou',
    '绿林草寇': 'caokou',
    '树精': 'kushu_jing',
    '百年树精': 'kushu_jing',
    '百年枯树精': 'kushu_jing',
    '枯树精': 'kushu_jing',
    '嗜血树妖': 'shuyao',
    '树妖': 'shuyao',
    '野狼': 'wolf_wild',
    '巡山野狼': 'wolf_wild',
    '山狼': 'shanlang',
    '恶谷山狼': 'shanlang',
    '狼妖': 'langyao',
    '啸月狼妖': 'langyao',
    '虎妖': 'yinke',
    '寅客': 'yinke',
    '寅客（虎妖）': 'yinke',
    '吊睛怪': 'diaojing_guai',
    '狐狸': 'huli',
    '野狐狸': 'huli',
    '狐狸精': 'hulijing',
    '幻化狐狸精': 'hulijing',
    '青蛇': 'xiaohua_she',
    '小花蛇': 'xiaohua_she',
    '盘石小青蛇': 'xiaohua_she',
    '蛇妖': 'sheyao',
    '盘丝蛇妖': 'sheyao',
    '猕猴': 'mihou',
    '巡山小石猴': 'mihou_bing',
    '花果山小猴': 'mihou_bing',
    '猕猴兵': 'mihou_bing',
    '花果山猕猴兵': 'mihou_bing',
    '猕猴将': 'mihou_jiang',
    '花果山猕猴将': 'mihou_jiang',
    '猿猴': 'yuanhou',
    '水帘洞猿猴': 'yuanhou',
    '猿猴兵': 'yuanhou_bing',
    '水帘洞猿猴兵': 'yuanhou_bing',
    '花果山猿猴兵': 'yuanhou_bing',
    '猿猴将': 'yuanhou_jiang',
    '花果山猿猴将': 'yuanhou_jiang',
    '河蚌': 'clam_jing',
    '灵河巨蚌': 'clam_jing',
    '螃蟹': 'crab_jing',
    '浅滩螃蟹': 'crab_jing',
    '巨蟹精': 'crab_jing',
    '龙虾': 'lobster_jing',
    '赤甲龙虾': 'lobster_jing',
    '龙虾精': 'lobster_jing',
    '蚌精': 'bangjing',
    '千年蚌精': 'bangjing',
    '虾兵': 'xia_bing',
    '巡海虾兵': 'xia_bing',
    '蟹将': 'xie_jiang',
    '巡海蟹将': 'xie_jiang',
    '鱼仙': 'yuxian',
    '水妖': 'shuiyao',
    '碧波水妖': 'shuiyao',
    '红鲤鱼': 'hongliyu',
    '黑鱼': 'heiyu',
    '幽魂': 'youhun',
    '孤坟幽魂': 'youhun',
    '道士': 'daoshi',
    '游方道士': 'daoshi',
    '妖道': 'yaodao',
    '毒蝎': 'duxie',
    '铁尾毒蝎': 'duxie',
    '石怪': 'shiguai',
    '顽石怪': 'shiguai',
    '蜘蛛怪': 'zhizhuguai',
    '黑熊怪': 'heixiong_guai_mob',
    '黑风怪熊': 'heixiong_guai_mob',
    '白骨小妖': 'baigu_xiaoyao',
    '花斑蛛': 'huabanzhu',
    '灵猫': 'lingmao',
    '猫妖': 'cat_demon',
    '九命猫妖': 'cat_demon',
    '鼠妖': 'shuyao_rat',
    '坎精': 'kanjing',
    '子神': 'zishen',
    '紫晶怪': 'zijingguai',
    '花狸鼠': 'hualishu',
    '长尾妖鸡': 'changwei_yaoji',
    '黄金沙虫': 'huangjin_shachong',
    '石精': 'shijing',
    '石妖': 'shiyao',
    '大海龟': 'clam_jing',
    '巨蛙': 'shuo_shu',
    '野猪': 'shuo_shu'
  };

  data.SHANHAI_SPECIES_BY_MONSTER = {};

  if (data.MAPS_2D) {
    for (const map of Object.values(data.MAPS_2D)) {
      for (const mob of map.monsters || []) {
        if (mob.isBoss || mob.isGhostTarget) continue;
        const name = cleanName(mob.name);
        let id = (pets[mob.templateId] && mob.templateId) || byName.get(name) || aliases[name] || aliases[mob.name];
        if (!id) {
          // 智能模糊匹配到50种规约普通野怪
          if (/鼠|耗子/.test(name)) id = 'shuo_shu';
          else if (/猴|猿/.test(name)) id = 'mihou';
          else if (/蛇/.test(name)) id = 'xiaohua_she';
          else if (/狼/.test(name)) id = 'wolf_wild';
          else if (/虎/.test(name)) id = 'yinke';
          else if (/狐/.test(name)) id = 'huli';
          else if (/树|木/.test(name)) id = 'kushu_jing';
          else if (/蟹/.test(name)) id = 'crab_jing';
          else if (/虾/.test(name)) id = 'lobster_jing';
          else if (/蚌/.test(name)) id = 'clam_jing';
          else if (/鱼/.test(name)) id = 'hongliyu';
          else if (/石|岩/.test(name)) id = 'shiguai';
          else if (/骨/.test(name)) id = 'baigu_xiaoyao';
          else if (/蛛/.test(name)) id = 'zhizhuguai';
          else if (/猫/.test(name)) id = 'lingmao';
          else id = 'hooligan_wild';
        }
        data.SHANHAI_SPECIES_BY_MONSTER[map.id + ':' + mob.id] = id;
        if (pets[id] && !pets[id].habitat) {
          pets[id].habitat = map.name;
          pets[id].habitatMapId = map.id;
        }
      }
    }
  }

  // 严格同步女性神仙灵宠
  for (const id of ['dianmu', 'change', 'baigu_jing', 'tieshan_gongzhu', 'xiezi_jing']) {
    if (pets[id]) pets[id].gender = 'female';
  }

  // =========================================================================
  // P2.1: 77物种真实可达来源与出没法则 (Canonical Shanhai Species Sources)
  // 区分：地图常见 / 偶遇散仙 / 偶遇金仙 / 偶遇凡兽 / 赠礼可能获得 / 尚无可达来源
  // =========================================================================
  const sources = {
    // === 50 凡兽 ===
    shuo_shu: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'liujiacun',
      habitatName: '双叉岭·刘家村',
      habitatDetail: '北仓、南垄、西畦、东篱田垄',
      conditionText: '场景内固定漫游明怪，直接触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%（血量压低更易成功）',
      isReachable: true,
      reachabilityNote: '当前主线第一回可达'
    },
    hooligan_wild: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'chentangguan',
      habitatName: '东海雄关·陈塘关',
      habitatDetail: '东市街霸、关口地痞、码头无赖',
      conditionText: '场景明怪巡逻，直接触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第三回可达'
    },
    caokou: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'yingchoujian',
      habitatName: '蛇盘山·鹰愁涧',
      habitatDetail: '东道、西道与深岭险隘',
      conditionText: '场景明怪黑风强盗战斗中直接遭遇',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第四回可达'
    },
    kushu_jing: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'wuxingshan',
      habitatName: '两界山·五行山',
      habitatDetail: '五行山左峰、右绝、前岗、后峦古木藤蔓',
      conditionText: '场景明怪巡逻（兼砍柴任务目标），直接触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第一回可达'
    },
    shuyao: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'heifeng_juebi',
      habitatName: '万妖魔窟·黑风绝壁',
      habitatDetail: '黑风密林深谷盘踞',
      conditionText: '黑风洞外幽深密林遭遇',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第五回可达'
    },
    wolf_wild: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'heifengshan',
      habitatName: '黑风山·观音禅院',
      habitatDetail: '禅院后山左峰、右岭巡山狼群',
      conditionText: '场景明怪巡逻，直接触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第五回可达'
    },
    shanlang: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'jiaolang_ling',
      habitatName: '阴风呼啸·郊狼岭',
      habitatDetail: '前路与南峪幽影魔狼群',
      conditionText: '野外郊狼岭直接遭遇',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '郊狼荒野支线可达'
    },
    langyao: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'baoxiangguo',
      habitatName: '宝象国·波月洞',
      habitatDetail: '碗子山波月洞密径与洞哨狼妖',
      conditionText: '场景明怪或郊狼岭领主战遭遇',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第十一回可达'
    },
    yinke: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'huangfengling',
      habitatName: '八百里·黄风岭',
      habitatDetail: '黄风大峡谷东岩、西险巡山虎卒',
      conditionText: '场景明怪巡逻，直接触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第七回可达'
    },
    diaojing_guai: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇凡兽',
      habitatMapId: 'huangfengling',
      habitatName: '八百里·黄风岭',
      habitatDetail: '绝谷与狂风飞沙险道深处',
      conditionText: '黄风岭野外对战中随队概率偶遇',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第七回可达'
    },
    huli: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'wuxingshan',
      habitatName: '两界山·五行山',
      habitatDetail: '五行山松林与野狐岭前哨',
      conditionText: '场景明怪巡逻，直接触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第一回可达'
    },
    hulijing: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'yehu_ling',
      habitatName: '苍茫古林·野狐岭',
      habitatDetail: '赤尾火狐与青丘魅影狐聚集之岭',
      conditionText: '野狐岭明怪或平顶山野外遭遇',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '古林荒野支线可达'
    },
    xiaohua_she: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'wuxingshan',
      habitatName: '两界山·五行山',
      habitatDetail: '五行山幽径与崖下盘石青蛇',
      conditionText: '场景明怪巡逻，直接触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第一回可达'
    },
    sheyao: {
      sourceType: 'unreachable',
      sourceTypeName: '尚无可达来源',
      habitatMapId: 'pansidong',
      habitatName: '盘丝岭·盘丝洞',
      habitatDetail: '盘丝洞与黄花观深处毒雾',
      conditionText: '主线后续章节开放盘丝岭时实装',
      captureTip: '需在盘丝岭战斗中直接招降',
      isReachable: false,
      reachabilityNote: '主线尚未推进至此章节（当前至第十一回平顶山）'
    },
    mihou: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'huaguoshan',
      habitatName: '东胜神洲·花果山',
      habitatDetail: '花果山松柏密林林冠',
      conditionText: '花果山水帘洞外跳跃嬉戏，触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '序章天宫风云或花果山可达'
    },
    mihou_bing: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'huaguoshan',
      habitatName: '东胜神洲·花果山',
      habitatDetail: '花果山巡山先锋石猴队伍',
      conditionText: '场景明怪巡逻，直接触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '序章天宫风云或花果山可达'
    },
    mihou_jiang: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇凡兽',
      habitatMapId: 'huaguoshan',
      habitatName: '东胜神洲·花果山',
      habitatDetail: '花果山水帘洞亲军演武场',
      conditionText: '花果山高等级野外战斗中随队概率偶遇',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '花果山深处偶遇可达'
    },
    yuanhou: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'huaguoshan_shuilien',
      habitatName: '花果山·水帘洞',
      habitatDetail: '水帘洞天石桥飞瀑之间',
      conditionText: '水帘洞内巡逻明怪，触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '花果山水帘洞可达'
    },
    yuanhou_bing: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'huaguoshan_shuilien',
      habitatName: '花果山·水帘洞',
      habitatDetail: '水帘洞力士猿兵操练营',
      conditionText: '水帘洞内巡逻明怪，触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '花果山水帘洞可达'
    },
    yuanhou_jiang: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇凡兽',
      habitatMapId: 'huaguoshan_shuilien',
      habitatName: '花果山·水帘洞',
      habitatDetail: '水帘洞四健将聚义厅堂',
      conditionText: '水帘洞对战中随队概率偶遇（凡兽之冠，高初值）',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '水帘洞深处偶遇可达'
    },
    clam_jing: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'chentangguan',
      habitatName: '东海雄关·陈塘关',
      habitatDetail: '九湾河口与灵河浅滩',
      conditionText: '河畔明怪巨蚌，触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第三回可达'
    },
    crab_jing: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'chentangguan',
      habitatName: '东海雄关·陈塘关',
      habitatDetail: '入海口乱石滩与铁甲蟹巢',
      conditionText: '河畔明怪金蟹，触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第三回可达'
    },
    lobster_jing: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'donghai_coast',
      habitatName: '碧海波涛·东海之滨',
      habitatDetail: '东海浪涛岩缝与巡海虾将领地',
      conditionText: '海滨明怪巡查，触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第三回可达'
    },
    bangjing: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'chentangguan',
      habitatName: '东海雄关·陈塘关',
      habitatDetail: '灵河深渚碧水老蚌',
      conditionText: '陈塘关水域巡逻明怪，触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第三回可达'
    },
    xia_bing: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'donghai_coast',
      habitatName: '碧海波涛·东海之滨',
      habitatDetail: '东海巡海虾兵方阵',
      conditionText: '海滨明怪巡逻，触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第三回可达'
    },
    xie_jiang: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'donghai_coast',
      habitatName: '碧海波涛·东海之滨',
      habitatDetail: '东海赤甲蟹兵与蟹将巡防隘口',
      conditionText: '海滨明怪巡逻，触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第三回可达'
    },
    yuxian: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇凡兽',
      habitatMapId: 'shuijinggong',
      habitatName: '东海水底·水晶宫',
      habitatDetail: '水晶宫龙庭深水清修水域',
      conditionText: '东海水底对战中随队概率偶遇',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '东海深海水域偶遇可达'
    },
    shuiyao: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'liushahe',
      habitatName: '八百里·流沙河',
      habitatDetail: '流沙河弱水东渚、西渊旋涡',
      conditionText: '场景明怪巡逻，触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第九回可达'
    },
    hongliyu: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'liushahe',
      habitatName: '八百里·流沙河',
      habitatDetail: '流沙河沿岸水草丰茂处',
      conditionText: '流沙河水域战斗随队常见',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第九回可达'
    },
    heiyu: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'liushahe',
      habitatName: '八百里·流沙河',
      habitatDetail: '流沙河深渊黑水暗流',
      conditionText: '流沙河水域战斗随队常见',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第九回可达'
    },
    youhun: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'baihuling',
      habitatName: '白虎岭·白骨洞',
      habitatDetail: '阴风化血厉鬼与乱葬岗飘魂',
      conditionText: '场景明怪巡逻，触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第十一回可达'
    },
    daoshi: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇凡兽',
      habitatMapId: 'futushan',
      habitatName: '浮屠山·乌巢禅林',
      habitatDetail: '浮屠古径与松石禅窟旁',
      conditionText: '浮屠山野外战斗中概率偶遇游方散修',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第八回可达'
    },
    yaodao: {
      sourceType: 'unreachable',
      sourceTypeName: '尚无可达来源',
      habitatMapId: 'chediguo',
      habitatName: '车迟国·三清道观',
      habitatDetail: '三清观法坛与破儿洞',
      conditionText: '主线后续车迟国篇章实装',
      captureTip: '需在车迟国战斗中直接招降',
      isReachable: false,
      reachabilityNote: '主线尚未推进至此章节（当前至第十一回平顶山）'
    },
    duxie: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'liushahe',
      habitatName: '八百里·流沙河',
      habitatDetail: '流沙河岸沙陇与黄沙岗巨蝎',
      conditionText: '场景明怪巡逻，触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第九回可达'
    },
    shiguai: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'pingdingshan',
      habitatName: '平顶山·莲花洞',
      habitatDetail: '移山填海石怪与浮屠山顽石精',
      conditionText: '场景明怪巡逻，触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第十一回可达'
    },
    zhizhuguai: {
      sourceType: 'unreachable',
      sourceTypeName: '尚无可达来源',
      habitatMapId: 'pansidong',
      habitatName: '盘丝岭·盘丝洞',
      habitatDetail: '濯垢泉毒丝蛛巢',
      conditionText: '主线后续盘丝岭篇章实装',
      captureTip: '需在盘丝岭战斗中直接招降',
      isReachable: false,
      reachabilityNote: '主线尚未推进至此章节（当前至第十一回平顶山）'
    },
    heixiong_guai_mob: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'heifengshan',
      habitatName: '黑风山·观音禅院',
      habitatDetail: '黑风山洞府绝壁巡山怪熊',
      conditionText: '场景明怪巡逻，触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第五回可达'
    },
    baigu_xiaoyao: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'baihuling',
      habitatName: '白虎岭·白骨洞',
      habitatDetail: '阴风口与白骨残骸乱石岗',
      conditionText: '场景明怪巡逻，触碰进入战斗',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第十一回可达'
    },
    huabanzhu: {
      sourceType: 'unreachable',
      sourceTypeName: '尚无可达来源',
      habitatMapId: 'pansidong',
      habitatName: '盘丝岭·盘丝洞',
      habitatDetail: '盘丝岭幽暗密林深处',
      conditionText: '主线后续盘丝岭篇章实装',
      captureTip: '需在盘丝岭战斗中直接招降',
      isReachable: false,
      reachabilityNote: '主线尚未推进至此章节（当前至第十一回平顶山）'
    },
    lingmao: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇凡兽',
      habitatMapId: 'pingdingshan',
      habitatName: '平顶山·莲花洞',
      habitatDetail: '平顶山幽谷岩隙穿梭的花狸灵猫',
      conditionText: '平顶山野外战斗中随队概率偶遇',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第十一回可达'
    },
    cat_demon: {
      sourceType: 'common_wild',
      sourceTypeName: '地图常见',
      habitatMapId: 'pingdingshan',
      habitatName: '平顶山·莲花洞',
      habitatDetail: '莲花洞外九命通灵猫妖',
      conditionText: '平顶山野外战斗常见',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第十一回可达'
    },
    shuyao_rat: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇凡兽',
      habitatMapId: 'liujiacun',
      habitatName: '双叉岭·刘家村',
      habitatDetail: '刘家村老窖深处吞吐月华的鼠妖',
      conditionText: '两界山战斗中随队概率偶遇',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '两界山深处偶遇可达'
    },
    kanjing: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇凡兽',
      habitatMapId: 'yingchoujian',
      habitatName: '蛇盘山·鹰愁涧',
      habitatDetail: '坎水灵穴涌出之水鼠地灵',
      conditionText: '鹰愁涧/流沙河战斗中随队概率偶遇',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '水脉灵穴偶遇可达'
    },
    zishen: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇凡兽',
      habitatMapId: 'pingdingshan',
      habitatName: '平顶山·莲花洞',
      habitatDetail: '十二地支子鼠神明法相',
      conditionText: '高等级野外战斗极稀有偶遇（普通野怪速度之巅）',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '深山秘境极稀有偶遇可达'
    },
    zijingguai: {
      sourceType: 'unreachable',
      sourceTypeName: '尚无可达来源',
      habitatMapId: 'daleiyinsi',
      habitatName: '西天极乐·灵山大雷音寺',
      habitatDetail: '灵山紫晶矿脉凝灵',
      conditionText: '主线西天极乐最终篇章实装',
      captureTip: '需在灵山矿脉战斗中直接招降',
      isReachable: false,
      reachabilityNote: '主线尚未推进至此章节（当前至第十一回平顶山）'
    },
    hualishu: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇凡兽',
      habitatMapId: 'wuzhuangguan',
      habitatName: '万寿山·五庄观',
      habitatDetail: '万寿山万年松梢跳跃花狸松鼠',
      conditionText: '五庄观仙山对战中概率偶遇',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第十回可达'
    },
    changwei_yaoji: {
      sourceType: 'unreachable',
      sourceTypeName: '尚无可达来源',
      habitatMapId: 'huoyundong',
      habitatName: '号山·枯松涧火云洞',
      habitatDetail: '枯松涧烈火崖边赤羽妖禽',
      conditionText: '主线第十二回火云洞篇章实装',
      captureTip: '需在火云洞战斗中直接招降',
      isReachable: false,
      reachabilityNote: '主线尚未推进至火云洞（即将在C1章开启）'
    },
    huangjin_shachong: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇凡兽',
      habitatMapId: 'huangfengling',
      habitatName: '八百里·黄风岭',
      habitatDetail: '黄风大漠流沙地底深穴',
      conditionText: '黄风岭大漠战斗中概率偶遇',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第七回可达'
    },
    shijing: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇凡兽',
      habitatMapId: 'pingdingshan',
      habitatName: '平顶山·莲花洞',
      habitatDetail: '平顶山灵石石髓交感凝精',
      conditionText: '平顶山野外战斗中概率偶遇',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第十一回可达'
    },
    shiyao: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇凡兽',
      habitatMapId: 'pingdingshan',
      habitatName: '平顶山·莲花洞',
      habitatDetail: '平顶山万载崩山巨岩化妖',
      conditionText: '平顶山野外战斗中概率偶遇',
      captureTip: '战斗中直接使用【招降】指令即可收服，成功率约 80%',
      isReachable: true,
      reachabilityNote: '当前主线第十一回可达'
    },

    // === 12 散仙 ===
    juling_shen: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇散仙',
      habitatMapId: 'tiangong_palace',
      habitatName: '天宫·南天门与凌霄宝殿',
      habitatDetail: '南天门宣花神将威灵试炼',
      conditionText: '天界或凡间Lv.10+野外战斗约13%几率随队偶遇，或达成30种凡兽/3种散仙赠礼获得',
      captureTip: '需持有仙家法宝【收仙银壶】（紫竹银葫芦）在对战中招降，几率约 70%',
      isReachable: true,
      reachabilityNote: '需收仙银壶收服'
    },
    chiguo_tianwang: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇散仙',
      habitatMapId: 'tiangong_palace',
      habitatName: '天宫·南天门与凌霄宝殿',
      habitatDetail: '东方天王，手执碧玉琵琶',
      conditionText: 'Lv.12+野外战斗约13%几率随队偶遇，或达成山海经散仙赠礼获得',
      captureTip: '需持有仙家法宝【收仙银壶】在对战中招降，几率约 70%',
      isReachable: true,
      reachabilityNote: '需收仙银壶收服'
    },
    zengzhang_tianwang: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇散仙',
      habitatMapId: 'heifengshan',
      habitatName: '黑风山·观音禅院',
      habitatDetail: '南方天王，青云宝剑化现',
      conditionText: 'Lv.12+野外战斗约13%几率随队偶遇，或达成山海经散仙赠礼获得',
      captureTip: '需持有仙家法宝【收仙银壶】在对战中招降，几率约 70%',
      isReachable: true,
      reachabilityNote: '需收仙银壶收服'
    },
    guangmu_tianwang: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇散仙',
      habitatMapId: 'liushahe',
      habitatName: '八百里·流沙河',
      habitatDetail: '西方天王，赤龙神索护身',
      conditionText: 'Lv.12+野外战斗约13%几率随队偶遇，或达成山海经散仙赠礼获得',
      captureTip: '需持有仙家法宝【收仙银壶】在对战中招降，几率约 70%',
      isReachable: true,
      reachabilityNote: '需收仙银壶收服'
    },
    duowen_tianwang: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇散仙',
      habitatMapId: 'pingdingshan',
      habitatName: '平顶山·莲花洞',
      habitatDetail: '北方天王之首，混元珍珠伞法相',
      conditionText: 'Lv.14+野外战斗约13%几率随队偶遇，散仙巅峰成长率 (1.08)',
      captureTip: '需持有仙家法宝【收仙银壶】在对战中招降，几率约 70%',
      isReachable: true,
      reachabilityNote: '需收仙银壶收服'
    },
    sha_wujing: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇散仙',
      habitatMapId: 'donghai_coast',
      habitatName: '碧海波涛·东海之滨',
      habitatDetail: '东海巡海夜叉（注意：非流沙河卷帘金仙沙僧）',
      conditionText: '东海水域Lv.10+野外战斗约13%几率随队偶遇',
      captureTip: '需持有仙家法宝【收仙银壶】在对战中招降，几率约 70%',
      isReachable: true,
      reachabilityNote: '需收仙银壶收服'
    },
    leigong: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇散仙',
      habitatMapId: 'futushan',
      habitatName: '浮屠山·乌巢禅林',
      habitatDetail: '九天雷霆霹雳正神',
      conditionText: 'Lv.15+野外战斗约13%几率随队偶遇（高法爆速度型散仙）',
      captureTip: '需持有仙家法宝【收仙银壶】在对战中招降，几率约 70%',
      isReachable: true,
      reachabilityNote: '需收仙银壶收服'
    },
    dianmu: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇散仙',
      habitatMapId: 'futushan',
      habitatName: '浮屠山·乌巢禅林',
      habitatDetail: '瑶池闪电神君，照世极光',
      conditionText: 'Lv.15+野外战斗约13%几率随队偶遇（散仙之巅速度型，女性灵宠）',
      captureTip: '需持有仙家法宝【收仙银壶】在对战中招降，几率约 70%',
      isReachable: true,
      reachabilityNote: '需收仙银壶收服'
    },
    xihai_longwang: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇散仙',
      habitatMapId: 'shuijinggong',
      habitatName: '东海水底·水晶宫',
      habitatDetail: '西海龙主水龙法相',
      conditionText: '东海水底Lv.18+野外战斗约13%几率随队偶遇，巅峰成长率1.08',
      captureTip: '需持有仙家法宝【收仙银壶】在对战中招降，几率约 70%',
      isReachable: true,
      reachabilityNote: '需收仙银壶收服'
    },
    change: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇散仙',
      habitatMapId: 'tiangong_palace',
      habitatName: '天宫·南天门与凌霄宝殿',
      habitatDetail: '瑶池水榭与广寒月影仙子',
      conditionText: '天界仙境Lv.18+野外战斗约13%几率随队偶遇（均衡仙姿，女性灵宠）',
      captureTip: '需持有仙家法宝【收仙银壶】在对战中招降，几率约 70%',
      isReachable: true,
      reachabilityNote: '需收仙银壶收服'
    },
    chimao_mahou: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇散仙',
      habitatMapId: 'huaguoshan',
      habitatName: '东胜神洲·花果山',
      habitatDetail: '混世四猴之赤尻马猴血脉，晓阴阳会人事',
      conditionText: '花果山Lv.15+野外战斗约13%几率随队偶遇',
      captureTip: '需持有仙家法宝【收仙银壶】在对战中招降，几率约 70%',
      isReachable: true,
      reachabilityNote: '需收仙银壶收服'
    },
    tongbi_yuanhou: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇散仙',
      habitatMapId: 'huaguoshan_shuilien',
      habitatName: '花果山·水帘洞',
      habitatDetail: '混世四猴之通臂神猿，拿日月缩千山',
      conditionText: '水帘洞Lv.15+野外战斗约13%几率随队偶遇（力拔千钧）',
      captureTip: '需持有仙家法宝【收仙银壶】在对战中招降，几率约 70%',
      isReachable: true,
      reachabilityNote: '需收仙银壶收服'
    },

    // === 15 金仙 ===
    bailong_ma: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇金仙',
      habitatMapId: 'yingchoujian',
      habitatName: '蛇盘山·鹰愁涧',
      habitatDetail: '西海龙王三太子化身，八部天龙法相',
      conditionText: '鹰愁涧Lv.25+战斗约3%几率随队偶遇，或达成山海经金仙里程赠礼获得',
      captureTip: '需持有道祖至宝【紫金红葫芦】在对战中施展【招降】，收服几率约 60%',
      isReachable: true,
      reachabilityNote: '需紫金红葫芦收服'
    },
    baigu_jing: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇金仙',
      habitatMapId: 'baihuling',
      habitatName: '白虎岭·白骨洞',
      habitatDetail: '白虎岭骷髅幻化尊主，白骨夫人真灵',
      conditionText: '白虎岭Lv.25+战斗约3%几率随队偶遇，或山海经金仙赠礼获得（女性金仙）',
      captureTip: '需持有道祖至宝【紫金红葫芦】在对战中施展【招降】，收服几率约 60%',
      isReachable: true,
      reachabilityNote: '需紫金红葫芦收服'
    },
    zhu_bajie: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇金仙',
      habitatMapId: 'gaolaozhuang',
      habitatName: '乌斯藏·高老庄与云栈洞',
      habitatDetail: '天蓬统帅真灵法相',
      conditionText: '高老庄野外Lv.25+战斗约3%几率随队偶遇，或山海经金仙赠礼获得',
      captureTip: '需持有道祖至宝【紫金红葫芦】在对战中施展【招降】，收服几率约 60%',
      isReachable: true,
      reachabilityNote: '需紫金红葫芦收服'
    },
    honghai_er: {
      sourceType: 'gift_only',
      sourceTypeName: '赠礼可能获得',
      habitatMapId: 'huoyundong',
      habitatName: '号山·枯松涧火云洞',
      habitatDetail: '枯松涧圣婴大王真灵，三昧真火元神',
      conditionText: '主线第十二回火云洞未至前，可由山海经金仙里程赠礼随机抽中灵韵入队',
      captureTip: '山海经献录里程奖励赠予（达成50种凡兽/10种散仙/每3种金仙）',
      isReachable: true,
      reachabilityNote: '可通过山海经金仙赠礼获取'
    },
    tieshan_gongzhu: {
      sourceType: 'gift_only',
      sourceTypeName: '赠礼可能获得',
      habitatMapId: 'huoyanshan',
      habitatName: '八百里·火焰山·芭蕉洞',
      habitatDetail: '翠云山罗刹女仙灵（女性金仙）',
      conditionText: '主线火焰山篇章前，可由山海经金仙里程赠礼随机抽得灵韵',
      captureTip: '山海经献录里程奖励赠予（达成50种凡兽/10种散仙/每3种金仙）',
      isReachable: true,
      reachabilityNote: '可通过山海经金仙赠礼获取'
    },
    niumowang: {
      sourceType: 'gift_only',
      sourceTypeName: '赠礼可能获得',
      habitatMapId: 'huoyanshan',
      habitatName: '八百里·火焰山·芭蕉洞',
      habitatDetail: '大力牛魔王平天大圣真灵，巅峰成长率1.18',
      conditionText: '主线火焰山篇章前，可由山海经金仙里程赠礼随机抽得灵韵',
      captureTip: '山海经献录里程奖励赠予（达成50种凡兽/10种散仙/每3种金仙）',
      isReachable: true,
      reachabilityNote: '可通过山海经金仙赠礼获取'
    },
    sha_seng: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇金仙',
      habitatMapId: 'liushahe',
      habitatName: '八百里·流沙河',
      habitatDetail: '灵霄殿前卷帘大将真灵法相（注意：此为真实金仙沙僧）',
      conditionText: '流沙河Lv.25+战斗约3%几率随队偶遇，或山海经金仙赠礼获得',
      captureTip: '需持有道祖至宝【紫金红葫芦】在对战中施展【招降】，收服几率约 60%',
      isReachable: true,
      reachabilityNote: '需紫金红葫芦收服'
    },
    huangfeng_guai: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇金仙',
      habitatMapId: 'huangfengling',
      habitatName: '八百里·黄风岭',
      habitatDetail: '灵山黄毛貂鼠原身真灵，神风极速',
      conditionText: '黄风岭Lv.25+战斗约3%几率随队偶遇，或山海经金仙赠礼获得',
      captureTip: '需持有道祖至宝【紫金红葫芦】在对战中施展【招降】，收服几率约 60%',
      isReachable: true,
      reachabilityNote: '需紫金红葫芦收服'
    },
    huangpao_guai: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇金仙',
      habitatMapId: 'baoxiangguo',
      habitatName: '宝象国·波月洞',
      habitatDetail: '二十八宿奎木狼星君真灵',
      conditionText: '波月洞Lv.25+战斗约3%几率随队偶遇，或山海经金仙赠礼获得',
      captureTip: '需持有道祖至宝【紫金红葫芦】在对战中施展【招降】，收服几率约 60%',
      isReachable: true,
      reachabilityNote: '需紫金红葫芦收服'
    },
    heixiong_guai: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇金仙',
      habitatMapId: 'heifengshan',
      habitatName: '黑风山·观音禅院',
      habitatDetail: '黑风洞熊罴妖圣真灵，黑熊原身',
      conditionText: '黑风绝壁Lv.25+战斗约3%几率随队偶遇，或山海经金仙赠礼获得',
      captureTip: '需持有道祖至宝【紫金红葫芦】在对战中施展【招降】，收服几率约 60%',
      isReachable: true,
      reachabilityNote: '需紫金红葫芦收服'
    },
    nezha: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇金仙',
      habitatMapId: 'chentangguan',
      habitatName: '东海雄关·陈塘关',
      habitatDetail: '中坛元帅三头六臂莲花化身',
      conditionText: '陈塘关/东海Lv.25+战斗约3%几率随队偶遇，或山海经金仙赠礼获得',
      captureTip: '需持有道祖至宝【紫金红葫芦】在对战中施展【招降】，收服几率约 60%',
      isReachable: true,
      reachabilityNote: '需紫金红葫芦收服'
    },
    huangmei_dawang: {
      sourceType: 'gift_only',
      sourceTypeName: '赠礼可能获得',
      habitatMapId: 'daleiyinsi',
      habitatName: '小雷音寺·假西天',
      habitatDetail: '弥勒童子黄眉老祖法相，血高气沉',
      conditionText: '小雷音寺章节前，可通过山海经金仙里程赠礼随机获得灵韵',
      captureTip: '山海经献录里程奖励赠予（达成50种凡兽/10种散仙/每3种金仙）',
      isReachable: true,
      reachabilityNote: '可通过山海经金仙赠礼获取'
    },
    lijing: {
      sourceType: 'encounter',
      sourceTypeName: '偶遇金仙',
      habitatMapId: 'tiangong_palace',
      habitatName: '天宫·南天门与凌霄宝殿',
      habitatDetail: '降魔大元帅托塔天王真灵',
      conditionText: '天庭仙界Lv.25+战斗约3%几率随队偶遇，或山海经金仙赠礼获得',
      captureTip: '需持有道祖至宝【紫金红葫芦】在对战中施展【招降】，收服几率约 60%',
      isReachable: true,
      reachabilityNote: '需紫金红葫芦收服'
    },
    xiezi_jing: {
      sourceType: 'gift_only',
      sourceTypeName: '赠礼可能获得',
      habitatMapId: 'poerdong',
      habitatName: '毒敌山·琵琶洞',
      habitatDetail: '琵琶妖仙倒马毒蝎（女性金仙）',
      conditionText: '毒敌山章节前，可通过山海经金仙里程赠礼随机获得灵韵',
      captureTip: '山海经献录里程奖励赠予（达成50种凡兽/10种散仙/每3种金仙）',
      isReachable: true,
      reachabilityNote: '可通过山海经金仙赠礼获取'
    },
    jiutou_chong: {
      sourceType: 'gift_only',
      sourceTypeName: '赠礼可能获得',
      habitatMapId: 'shuijinggong',
      habitatName: '乱石山·碧波潭',
      habitatDetail: '九头妖圣真灵，巅峰成长率1.18',
      conditionText: '碧波潭章节前，可通过山海经金仙里程赠礼随机获得灵韵',
      captureTip: '山海经献录里程奖励赠予（达成50种凡兽/10种散仙/每3种金仙）',
      isReachable: true,
      reachabilityNote: '可通过山海经金仙赠礼获取'
    }
  };

  data.SHANHAI_SPECIES_SOURCES = sources;

  data.getShanhaiSpeciesSource = function (templateId) {
    const p = (window.GAME_DATA?.PETS && window.GAME_DATA.PETS[templateId]);
    const src = sources[templateId] || {
      sourceType: 'unreachable',
      sourceTypeName: '尚无可达来源',
      habitatMapId: null,
      habitatName: '未知圣境',
      habitatDetail: '暂无出没记录',
      conditionText: '当前版本暂无可达来源',
      captureTip: '暂无收服法门',
      isReachable: false,
      reachabilityNote: '尚未实装'
    };
    return {
      ...src,
      id: templateId,
      name: p?.name || templateId,
      quality: p?.quality || 'ordinary',
      element: p?.element,
      elementName: p?.elementName,
      // 兼容别名字段
      category: src.sourceType,
      categoryName: src.sourceTypeName,
      mapId: src.habitatMapId,
      mapName: src.habitatName,
      conditionDesc: src.conditionText,
      accessible: src.isReachable
    };
  };

  // 挂载各物种初始来源说明
  for (const [id, s] of Object.entries(sources)) {
    if (pets[id]) {
      pets[id].sourceInfo = data.getShanhaiSpeciesSource(id);
    }
  }

  data.cleanShanhaiSpeciesName = cleanName;
})();
