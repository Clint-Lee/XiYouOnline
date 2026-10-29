```js
  // =========================================================================
  // 剧情任务：【黑水擒龙·第十三回】对白与交互
  // =========================================================================
  heishui_ferry_trap: {
    steps: [
      {
        speaker: '摆渡船夫',
        speakerTitle: '【黑水渡口】',
        speakerIcon: '🛶',
        text: '几位客官要渡黑水河么？这河水浑得见不着底，寻常舟子不敢撑篙，唯有老汉这一条船识得水路。'
      },
      {
        speaker: '唐三藏',
        speakerTitle: '【西行取经】',
        speakerIcon: '🧘',
        text: '阿弥陀佛，正要渡河。不知船资几何？贫僧师徒四人，还望艄公行个方便。'
      },
      {
        speaker: '摆渡船夫',
        speakerTitle: '【黑水渡口】',
        speakerIcon: '🛶',
        text: '船资好说、好说。只是这河上……咳，这船上，自然听我的。客官且安坐，莫要乱动，老汉撑篙便是。'
      },
      {
        speaker: '孙悟空',
        speakerTitle: '【火眼起疑】',
        speakerIcon: '🐒',
        text: '师父，这厮话里有话。老孙总觉这河水浊得蹊跷，想看看河底是何名堂，偏生一片漆黑，照不进去。'
      },
      {
        speaker: '摆渡船夫',
        speakerTitle: '【鼍洁部下】',
        speakerIcon: '🐊',
        text: '嘿嘿，看不着便对了！船到河心——此处正是我黑水神府头上。得罪了，这两个且随我去见大王！'
      },
      {
        speaker: '孙悟空',
        speakerTitle: '【火眼起疑】',
        speakerIcon: '🐒',
        text: '不好！师父与八戒被卷下水去了！这妖浑水摄人，老孙一时追它不及。须得寻个熟知河情之人问个明白！',
        action: function() {
          window.App2D.storyPhase = 'heishui_captives_taken';
          window.App2D.refreshMapNpcs();
          window.App2D.saveAutoProgress();
          window.showGameMessage('🌊 师父与八戒被摄走！速寻熟悉河情之人。', 'warning', 5000);
        }
      }
    ]
  },
  heishui_rivergod_appeal: {
    steps: [
      {
        speaker: '失府河神',
        speakerTitle: '【无处安身】',
        speakerIcon: '🌊',
        text: '几位远来的神僧，可怜老朽！我本是这衡阳峪黑水河正神，守此一河清波已历百年，不想遭了横祸。'
      },
      {
        speaker: '失府河神',
        speakerTitle: '【无处安身】',
        speakerIcon: '🌊',
        text: '半年前来了个妖物，恃强夺我神府，将我逐出，连香火水族尽归他占。老朽告到何处都无门，只得流落河岸，栖身芦苇。'
      },
      {
        speaker: '失府河神',
        speakerTitle: '【无处安身】',
        speakerIcon: '🌊',
        text: '那妖名唤鼍洁，乃泾河龙王的第九个儿子，论起亲来，西海龙王敖闰是他嫡亲母舅。他正是倚着这门龙族声势，才敢如此横行。'
      },
      {
        speaker: '沙僧',
        speakerTitle: '【卷帘护法】',
        speakerIcon: '🌊',
        text: '师父与二师兄多半是被这鼍洁摄进水府了。老沙久在流沙河，颇识水性，愿随大师兄下水救人。老河神，那水府入口在何处？'
      },
      {
        speaker: '孙悟空',
        speakerTitle: '【急寻师父】',
        speakerIcon: '🐒',
        text: '好！老河神你指的入口，老孙记下了。沙师弟，你我这便探它个虚实，先摸清水府深浅，再作区处。',
        action: function() {
          window.App2D.storyPhase = 'heishui_scout_ready';
          window.App2D.refreshMapNpcs();
          window.showGameMessage('🔱 水府入口已明，随沙僧探府。', 'info', 4500);
        }
      }
    ]
  },
  heishui_scout_challenge: {
    steps: [
      {
        speaker: '水府守将',
        speakerTitle: '【黑水拦路】',
        speakerIcon: '🔱',
        text: '来者何人！这黑水神府岂是尔等撒野之地？大王正设宴要请那取经的和尚，闲杂人速速退去，免得送了性命！'
      },
      {
        speaker: '沙僧',
        speakerTitle: '【卷帘护法】',
        speakerIcon: '🌊',
        text: '好个助纣为虐的东西！我师父师兄正是被你家大王所摄。这水府的门，今日老沙闯定了！大师兄，容我先会会他。'
      },
      {
        speaker: '威灵大将',
        speakerTitle: '【护法天将】',
        speakerIcon: '🛡️',
        text: '沙僧勇猛可嘉，然水府守将不止一个，恐有埋伏。贫将愿同破此关——只待尊意，便可动手。'
      },
      {
        speaker: '孙悟空',
        speakerTitle: '【急寻师父】',
        speakerIcon: '🐒',
        text: '不必多言，救人要紧！沙师弟，拿出你流沙河的本事来，随我破了这班水鬼！',
        options: [
          {
            text: '【与沙僧同破水府守将！】',
            action: function() {
              window.Dialogue.close();
              window.App2D.triggerHeishuiScoutBattle();
            }
          }
        ]
      }
    ]
  },
  heishui_scout_victory: {
    steps: [
      {
        speaker: '沙僧',
        speakerTitle: '【卷帘护法】',
        speakerIcon: '🌊',
        text: '这班守将不经打，已被我等杀退。大师兄，只是越往水府深处，那妖气越盛，怕是硬闯不得。'
      },
      {
        speaker: '失府河神',
        speakerTitle: '【无处安身】',
        speakerIcon: '🌊',
        text: '神僧有所不知，鼍洁占的是水府地利，又习得一身水势妖法。在这黑水之中，纵是天兵也要折了三分，万不可力敌。'
      },
      {
        speaker: '孙悟空',
        speakerTitle: '【另谋良策】',
        speakerIcon: '🐒',
        text: '老孙晓得了。这鼍洁既是泾河龙王第九子、西海敖闰的外甥，便是龙族自家的孽障。水里斗它不占便宜，不如请它那表兄摩昂来，自家人管自家人最是便当。',
        action: function() {
          window.App2D.storyPhase = 'heishui_aid_needed';
          window.App2D.refreshMapNpcs();
          window.showGameMessage('🐒 悟空赴西海请援。', 'info', 4000);
        }
      }
    ]
  },
  heishui_seek_west_sea_aid: {
    steps: [
      {
        speaker: '失府河神',
        speakerTitle: '【无处安身】',
        speakerIcon: '🌊',
        text: '神僧要去西海请援，这路子走得对。那鼍洁虽是泾河龙王所出，自幼却养在西海，归他母舅敖闰管束，论理敖闰断难推脱这管教不严之责。'
      },
      {
        speaker: '孙悟空',
        speakerTitle: '【西海请援】',
        speakerIcon: '🐒',
        text: '正是这个理！老孙一个筋斗云往西海走一遭，当面与敖闰讲明：他外甥摄了取经人，占了河神府，这桩公案，他这做舅舅的焉能坐视？',
        action: function() {
          window.showGameMessage('🌊 悟空一筋斗云直往西海而去……', 'info', 3500);
        }
      },
      {
        speaker: '孙悟空',
        speakerTitle: '【西海请援】',
        speakerIcon: '🐒',
        text: '幸不辱命！敖闰听说此事，又惊又愧，当即差他亲儿摩昂太子领兵来擒。老孙先行回报——摩昂随后便至！'
      },
      {
        speaker: '沙僧',
        speakerTitle: '【卷帘护法】',
        speakerIcon: '🌊',
        text: '西海肯派太子出面，这便名正言顺了。大师兄，我等且在岸上列阵，静候摩昂太子到来。',
        action: function() {
          window.App2D.storyPhase = 'heishui_moang_arrived';
          window.App2D.refreshMapNpcs();
          window.showGameMessage('🐉 西海龙太子摩昂已至。', 'success', 4500);
        }
      }
    ]
  },
  heishui_moang_briefing: {
    steps: [
      {
        speaker: '摩昂',
        speakerTitle: '【奉命擒妖】',
        speakerIcon: '🐉',
        text: '在下西海龙太子摩昂，奉家父敖闰之命，特来擒拿舍表弟鼍洁。他摄劫取经圣僧、强夺河神之府，坏了龙族声名，我此来必将他押回西海，按律问罪，绝不徇私。'
      },
      {
        speaker: '摩昂',
        speakerTitle: '【奉命擒妖】',
        speakerIcon: '🐉',
        text: '鼍洁素来倚仗水势逞凶，这黑水便是他的根基。我一出面，他未必肯束手就缚，少不得要动一场手。'
      },
      {
        speaker: '威灵大将',
        speakerTitle: '【护法天将】',
        speakerIcon: '🛡️',
        text: '太子但请放心。贫将等愿为前驱，先挫其锐气、乱其水势，待他阵脚一松，便是太子下手擒拿之机。'
      },
      {
        speaker: '沙僧',
        speakerTitle: '【卷帘护法】',
        speakerIcon: '🌊',
        text: '太子大义灭亲、公道可敬。我等这便去牵制鼍洁、破他水阵，只等太子一声令下，合力拿他！',
        action: function() {
          window.App2D.storyPhase = 'heishui_boss_ready';
          window.App2D.refreshMapNpcs();
          window.showGameMessage('⚔️ 摩昂已备擒拿，可挑战鼍洁。', 'warning', 4500);
        }
      }
    ]
  },
  heishui_tuojie_challenge: {
    steps: [
      {
        speaker: '鼍洁',
        speakerTitle: '【黑水大王】',
        speakerIcon: '🐊',
        text: '哪来的毛猴秃驴，敢闯我黑水神府！这一河上下，俱是我黑水大王的天地。我摄了那和尚，正要摆宴请我母舅来尝尝唐僧肉，谁敢坏我好事？'
      },
      {
        speaker: '孙悟空',
        speakerTitle: '【当面点破】',
        speakerIcon: '🐒',
        text: '呸！什么黑水大王，不过是泾河龙王第九个孽子、西海敖闰的外甥罢了。强夺河神之府、摄劫取经之人，你那表兄摩昂，已奉旨来拿你归案了！'
      },
      {
        speaker: '威灵大将',
        speakerTitle: '【护法天将】',
        speakerIcon: '🛡️',
        text: '此妖倚水为凶，正面硬拼难奈他何。须先破他这一河水势，摩昂太子方好趁隙下手——尊意如何？'
      },
      {
        speaker: '孙悟空',
        speakerTitle: '【当面点破】',
        speakerIcon: '🐒',
        text: '不必犹疑！你摆你的水势，老孙偏要搅它个底朝天，给摩昂太子腾出手来！',
        options: [
          {
            text: '【破其水势，为摩昂创造擒拿之机！】',
            action: function() {
              window.Dialogue.close();
              window.App2D.triggerTuojieBattle();
            }
          }
        ]
      }
    ]
  },
  heishui_tuojie_defeated: {
    steps: [
      {
        speaker: '摩昂',
        speakerTitle: '【奉命擒妖】',
        speakerIcon: '🐉',
        text: '水势一破，你这孽障还有何倚仗！表弟，束手就擒罢——这一绳，是替你押回西海，交家父发落。'
      },
      {
        speaker: '鼍洁',
        speakerTitle: '【束手就擒】',
        speakerIcon: '🐊',
        text: '表……表兄！小弟一时糊涂，占府摄人实是鬼迷了心窍！你我至亲，还望在舅父面前替小弟美言几句……'
      },
      {
        speaker: '失府河神',
        speakerTitle: '【复位谢恩】',
        speakerIcon: '🌊',
        text: '苍天有眼！这黑水河神府，老朽今日总算讨得回来了！多谢众位神僧、多谢太子，为老朽伸此一冤！'
      },
      {
        speaker: '唐三藏',
        speakerTitle: '【脱险获救】',
        speakerIcon: '🧘',
        text: '阿弥陀佛……徒弟们，为师与八戒被困水府，只道此番难逃，幸得你等奋力相救。善哉，善哉。'
      },
      {
        speaker: '摩昂',
        speakerTitle: '【奉命擒妖】',
        speakerIcon: '🐉',
        text: '人也救了，府也复了，正事已毕。鼍洁——那『黑水大王』的名号，往后不必报了，报你的本名罢。押回西海，听候家父处置。',
        action: function() {
          window.App2D.storyPhase = 'heishui_reward_pending';
          window.App2D.refreshMapNpcs();
          window.App2D.saveAutoProgress();
          window.showGameMessage('🌊 河神复位，师徒脱险。可向河神领取谢礼。', 'success', 5000);
        }
      }
    ]
  },
  heishui_reward_claim: {
    steps: [
      {
        speaker: '黑水河神',
        speakerTitle: '【复位谢恩】',
        speakerIcon: '🌊',
        text: '神僧搭救、复我神府，此恩老朽没齿难忘。略备些黑水河中珍藏的谢礼，聊表寸心，还望神僧莫要嫌弃。'
      },
      {
        speaker: '黑水河神',
        speakerTitle: '【复位谢恩】',
        speakerIcon: '🌊',
        text: '谢礼已在此处备下。若神僧行囊装得满了，也不妨先行收拾，稍后再来领取便是，老朽随时恭候。',
        options: [
          {
            text: '【领取黑水河谢礼】',
            action: function() {
              window.App2D.claimHeishuiReward();
            }
          }
        ]
      }
    ]
  },
  heishui_crossing_epilogue: {
    steps: [
      {
        speaker: '唐三藏',
        speakerTitle: '【西行取经】',
        speakerIcon: '🧘',
        text: '黑水风波已平，河神复位，正好渡河。徒弟们，收拾行装，我等仍往西天去。'
      },
      {
        speaker: '沙僧',
        speakerTitle: '【卷帘护法】',
        speakerIcon: '🌊',
        text: '河神已遣了稳当的舟子相送，这一河清波再无诡谲。师父请上船，前路还长，咱们一步步走去便是。'
      },
      {
        speaker: '威灵大将',
        speakerTitle: '【护法天将】',
        speakerIcon: '🛡️',
        text: '黑水一难已了，前方山水重重，仍需谨慎。贫将暗中护持，诸位但放心前行。',
        action: function() {
          window.App2D.saveAutoProgress();
        }
      }
    ]
  },

  // =========================================================================
  // 支线任务：【苍茫三岭伏魔传】剧情与交互
  // =========================================================================
```

chapter_13 配置（追加到 CHAPTER_CONFIGS 末尾）：

```js
    'chapter_12': {
      id: 'chapter_12',
      chapterNum: '第十二回',
      title: '第十二回 · 火云烈焰',
      subtitle: '圣婴假哭诱西客，三昧真火燎号山',
      seal: '圣婴伏火',
      triggerMap: 'huoyundong',
      triggerPhase: 'huoyun_arrived'
    },
    'chapter_13': {
      id: 'chapter_13',
      chapterNum: '第十三回',
      title: '第十三回 · 黑水擒龙',
      subtitle: '黑水摄僧沉宝筏，龙子奉旨擒妖鼍',
      seal: '黑水伏鼍',
      triggerMap: 'heishuihe',
      triggerPhase: 'heishui_arrived'
    }
```

两块已按你的插入需求备好：第一块是 10 个对白键（末尾保留原支线注释锚点，直接整体替换该注释即可），第二块是在 `'chapter_12'` 之后追加的 `'chapter_13'`。

说明几处设计取舍：
- **幽默唯二**：船夫"这河上……咳，这船上"的失言伏笔，现形后立即收住；`heishui_tuojie_defeated` 末步摩昂"『黑水大王』不必报了，报你的本名"——讽僭越，不嘲俘虏。
- **禁区规避**：河神全程以"遭横祸、告状无门"立场呈现（非无能），摩昂"大义灭亲、押回问罪"明确不徇私。
- **叙事省略西海往返**：`heishui_seek_west_sea_aid` 中段用一句 `showGameMessage` 过场 + 悟空独白带回"摩昂随后便至"，不新建地图。
- **阶段推进/触发**：每个节点末步 `action` 或末选项 `action` 均严格对应你给定的阶段名与 App2D 方法；探战/首领战的选项先 `window.Dialogue.close()` 再触发战斗；领奖调 `claimHeishuiReward()`（幂等重试）；尾声仅 `saveAutoProgress()` 不改阶段。

subtitle「黑水摄僧沉宝筏，龙子奉旨擒妖鼍」为七言对仗，含黑水、摄僧、龙子擒妖三重意象（如需更贴原著可改末字「鼍」为「龙」，但你指定了「擒龙」回目，故保留「鼍」以免与回目末字重复）。