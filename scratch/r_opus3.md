### FILE: js/data/storyQuests.js
<<<<<<< OLD
    'chapter_11': {
      id: 'chapter_11',
      chapterNum: '第十一回',
      title: '第十一回 · 平顶风云',
      subtitle: '移山压顶智胜妖，五件至宝降双魔',
      seal: '莲花伏魔',
      triggerMap: 'pingdingshan',
      triggerPhase: 'baoxiang_cleared'
    }
  };
=======
    'chapter_11': {
      id: 'chapter_11',
      chapterNum: '第十一回',
      title: '第十一回 · 平顶风云',
      subtitle: '移山压顶智胜妖，五件至宝降双魔',
      seal: '莲花伏魔',
      triggerMap: 'pingdingshan',
      triggerPhase: 'baoxiang_cleared'
    },
    'chapter_12': {
      id: 'chapter_12',
      chapterNum: '第十二回',
      title: '第十二回 · 火云烈焰',
      subtitle: '圣婴假哭诱西客，三昧真火燎号山',
      seal: '圣婴伏火',
      triggerMap: 'huoyundong',
      triggerPhase: 'huoyun_arrived'
    }
  };
>>>>>>> NEW

### FILE: js/data/storyQuests.js
<<<<<<< OLD
  // =========================================================================
  // 支线任务：【苍茫三岭伏魔传】剧情与交互
  // =========================================================================
=======
    // =========================================================================
    // 第十二回「号山·火云洞」——红孩儿主线
    // =========================================================================

    // 1. 土地神预警（初入号山）
    'huoyun_tudi_warning': {
      steps: [
        {
          speaker: '号山土地神',
          speakerTitle: '【受压当方土地】',
          speakerIcon: '🍠',
          text: '天将且住！此处唤作号山枯松涧，涧尽头便是火云洞。洞里盘踞一位妖王，形貌是个总角孩童，自称圣婴大王，可莫要被那张娃娃脸哄了去。'
        },
        {
          speaker: '号山土地神',
          speakerTitle: '【受压当方土地】',
          speakerIcon: '🍠',
          text: '他早年在火焰山修行三百年，炼成一身三昧真火，水浇不灭，土掩不熄。如今霸着这一方山场，连我这当方土地，并山中百姓，都被他强征"火租"，不缴便放火烧田。'
        },
        {
          speaker: '号山土地神',
          speakerTitle: '【受压当方土地】',
          speakerIcon: '🍠',
          text: '那洞前方圆数里，焦土三年不长一根草。前头纵有孩童哭喊求救，天将也先低头看一看——脚下是寻常脚印，还是踏过火痕的焦印。莫因他年小，便轻慢了。'
        },
        {
          speaker: '号山土地神',
          speakerTitle: '【受压当方土地】',
          speakerIcon: '🍠',
          text: '老朽言尽于此，枯松涧的路，这便为天将开了。',
          options: [
            {
              text: '【记下警示，前往枯松涧探看】',
              action: function() {
                window.App2D.storyPhase = 'huoyun_redboy_ready';
                window.App2D.refreshMapNpcs();
                window.showGameMessage('🔥 号山枯松涧方向火气蒸腾，前路已开。', 'warning', 4000);
                window.Dialogue.close();
              }
            }
          ]
        }
      ]
    },

    // 2. 红孩儿假意求救 → 识破 → 开战
    'huoyun_redboy_trick': {
      steps: [
        {
          speaker: '红孩儿',
          speakerTitle: '【枯松涧孩童】',
          speakerIcon: '🧒',
          text: '救命啊——过路的神仙救命啊！我被一阵妖风卷到这树上，爹娘也不见了，吊了半日，手脚都麻了……快放我下来吧，呜呜呜……'
        },
        {
          speaker: '孙悟空',
          speakerTitle: '【斗战齐天】',
          speakerIcon: '🐵',
          text: '（抽动鼻子）老孙这火眼金睛看不真，这鼻子却嗅得清——这味儿哪里是人味？分明是火烧过的骨头味。树上吊着的，怕不是个真孩子。'
        },
        {
          speaker: '威灵大将',
          speakerTitle: '【护法天将】',
          speakerIcon: '🛡️',
          text: '（俯身看地）更蹊跷的是这脚印——只一串，还是朝上攀的，哪有半分被风卷来、落地挣扎的痕迹？再看这焦土，是从洞口往外烧的。火不是逃出来的人带的，是洞里的主人自个儿放的。'
        },
        {
          speaker: '红孩儿',
          speakerTitle: '【圣婴大王】',
          speakerIcon: '🔥',
          text: '（一松手跳下树，拍拍衣襟）唉，露馅了。我哭了足足半个时辰，嗓子都哑了，你们倒看得这般仔细。'
        },
        {
          speaker: '红孩儿',
          speakerTitle: '【圣婴大王】',
          speakerIcon: '🔥',
          text: '（一本正经）既然识破了，那便按规矩来——先报名号，再动手。本大王乃号山火云洞圣婴大王是也，手握三昧真火，你们可记清了？'
        },
        {
          speaker: '孙悟空',
          speakerTitle: '【斗战齐天】',
          speakerIcon: '🐵',
          text: '（嗤笑）小小年纪，规矩倒比天庭还多。又是报名号，又是讲章程，怎么烧人家田的时候，没见你讲这份规矩？'
        },
        {
          speaker: '威灵大将',
          speakerTitle: '【护法天将】',
          speakerIcon: '🛡️',
          text: '洞前那片焦土，是你三年"火租"烧出来的罢。烧的是别人家的田，你只管自己的火——这笔账，今日该清了。',
          options: [
            {
              text: '【识破伪装，迎战圣婴大王！】',
              action: function() {
                window.Dialogue.close();
                window.App2D.triggerHuoyunScoutBattle();
              }
            }
          ]
        }
      ]
    },

    // 3. 红孩儿真身决战前
    'huoyun_boss_encounter': {
      steps: [
        {
          speaker: '红孩儿',
          speakerTitle: '【圣婴大王·三昧真身】',
          speakerIcon: '🔥',
          text: '（推出五辆小车，依五行方位摆开）好，这回是真章了。东木、南火、西金、北水、中土——五车列定，看本大王的三昧真火！'
        },
        {
          speaker: '孙悟空',
          speakerTitle: '【斗战齐天】',
          speakerIcon: '🐵',
          text: '（压声）当心！这火不是凡火，水浇不灭，愈浇愈烈。他的根子在这车阵上——先破了车阵，这火才有的治。'
        },
        {
          speaker: '红孩儿',
          speakerTitle: '【圣婴大王·三昧真身】',
          speakerIcon: '🔥',
          text: '这火烧过山，也烧过人。三百年修出来的本事，你们挡得住几回？'
        },
        {
          speaker: '威灵大将',
          speakerTitle: '【护法天将】',
          speakerIcon: '🛡️',
          text: '挡不住也要挡。山下的田，不能再烧第二遍。',
          options: [
            {
              text: '【破车阵，决战三昧真火！】',
              action: function() {
                window.Dialogue.close();
                window.App2D.triggerRedboyBattle();
              }
            }
          ]
        }
      ]
    },

    // 4. 战后收束 + 观音收服
    'huoyun_aftermath': {
      steps: [
        {
          speaker: '红孩儿',
          speakerTitle: '【圣婴大王·力竭】',
          speakerIcon: '🔥',
          text: '（火势渐熄，瘫坐于地）我的三昧真火……竟也有烧尽的一刻。这一身本事，到头来……'
        },
        {
          speaker: '观音菩萨',
          speakerTitle: '【南海大慈大悲】',
          speakerIcon: '🪷',
          text: '（祥云落下，天罡刀化作莲台托住其身，金箍儿环其手足）孽障，你的火太盛，是因心里无人给你指过路。你不是生来为恶，只是从没人教过你，这火该怎么用。'
        },
        {
          speaker: '威灵大将',
          speakerTitle: '【护法天将】',
          speakerIcon: '🛡️',
          text: '菩萨慈悲。只是山下那些被烧的田亩人家，三年苦楚，总要有个着落。收他可以，这笔债不能一笔勾了。'
        },
        {
          speaker: '观音菩萨',
          speakerTitle: '【南海大慈大悲】',
          speakerIcon: '🪷',
          text: '天将说得是。我今日收他为善财童子，这偿还山下田亩的事，便交由他日后一处一处亲手去还——还清了，才算真学会了这火的用处。'
        },
        {
          speaker: '孙悟空',
          speakerTitle: '【斗战齐天】',
          speakerIcon: '🐵',
          text: '善财童子……嘿，这名儿倒比"圣婴大王"讲理多了。走罢，账记下了，路还长着呢。',
          options: [
            {
              text: '【功德圆满，续往西行】',
              action: function() {
                window.App2D.storyPhase = 'huoyun_cleared';
                window.App2D.refreshMapNpcs();
                window.App2D.saveAutoProgress();
                window.showGameMessage('🪷 火云洞火息，圣婴归善，西行大道再开。', 'success', 4000);
                window.Dialogue.close();
              }
            }
          ]
        }
      ]
    },

    // 5. 满包待领
    'huoyun_reward_ready': {
      steps: [
        {
          speaker: '孙悟空',
          speakerTitle: '【斗战齐天】',
          speakerIcon: '🐵',
          text: '火云洞里的东西，老孙先替你收着。你这行囊都塞满了，腾出两格地方，再来寻我领。'
        },
        {
          speaker: '孙悟空',
          speakerTitle: '【斗战齐天】',
          speakerIcon: '🐵',
          text: '腾挪妥当了？那便点一点，一件件收进去。',
          options: [
            {
              text: '【领取火云洞战利品】',
              action: function() {
                window.App2D.claimHuoyunReward();
              }
            }
          ]
        }
      ]
    },

  // =========================================================================
  // 支线任务：【苍茫三岭伏魔传】剧情与交互
  // =========================================================================
>>>>>>> NEW