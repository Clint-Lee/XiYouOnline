你是《汉风西游》原生 JS 项目的剧情数据工程师。请只输出补丁，严格按格式，不要解释。

## 任务
为第十二回「号山·火云洞」（红孩儿）补齐**主线任务数据**：章节开幕配置 + 三个剧情节点对白。
地图 `huoyundong`（号山·枯松涧火云洞，38×28）已存在，但只有土地神 `npc_haoshan_tudi` 与炎兵野怪，没有任何主线剧情。

## 项目既有约定（必须遵守）
1. 对白对象格式：`{ steps: [ { speaker, speakerTitle, speakerIcon, text, action?, options? } ] }`
2. 选项格式：`{ text, action?, nextStep? }`；`nextStep` 为数字时跳转到指定步骤下标，不写则结束对话。
3. 剧情动作统一通过 `window.App2D.<方法>()` 调用；阶段名用 snake_case。
4. 阶段链：`pingding_cleared`（平顶山已完结）→ 火云洞三阶段 → `huoyun_cleared`。
   本回三个新阶段名，请严格使用：
   - `huoyun_arrived`（初入号山，土地神预警）
   - `huoyun_redboy_ready`（红孩儿假意求救，识破后开战）
   - `huoyun_boss_ready`（再战红孩儿真身）
   - 战斗胜利后推进到 `huoyun_cleared`
5. 已存在的 App2D 方法（可直接调用）：
   - `window.App2D.storyPhase = '阶段名'`
   - `window.App2D.refreshMapNpcs()`
   - `window.App2D.scheduleStoryDialogue('对白键', 延迟毫秒)`
   - `window.App2D.triggerHuoyunScoutBattle()` / `window.App2D.triggerRedboyBattle()` / `window.App2D.claimHuoyunReward()`（这三个方法稍后由另一方实现，你只需在正确位置调用）
   - `window.showGameMessage('文案', 'success'|'info'|'warning', 毫秒)`
   - `window.Dialogue.close()`
6. 语气要求：简体中文、国风措辞、克制。幽默来自人物性格与处境反应，**不得拿受害者遭遇开玩笑**。红孩儿是孩童形貌的妖王，可用其"装哭被识破后的窘态"制造趣味，但三昧真火烧山、百姓受害必须严肃。

## 需要输出三部分

### 第一部分：章节配置
在 `window.GAME_DATA.CHAPTER_CONFIGS` 对象末尾（现有最后一个键是 `'chapter_11'`，其后是结束的 `  };`）追加 `'chapter_12'`，字段与已有章节完全一致：
- id: 'chapter_12'
- chapterNum: '第十二回'
- title: '第十二回 · 火云烈焰'
- subtitle: 一句七言（14 字，对仗），需体现"红孩儿、三昧真火、假意求救"意象
- seal: 四字印章，例如「圣婴伏火」
- triggerMap: 'huoyundong'
- triggerPhase: 'huoyun_arrived'

### 第二部分：三个对白节点
在 `window.GAME_DATA.STORY_DIALOGUES` 对象内追加以下三个键（插入位置放在 `pingdingshan_laojun_aftermath` 之后、`// 支线任务` 注释之前）：

**1. `huoyun_tudi_warning`**（土地神预警，4 步，无战斗，纯交代 + 推进阶段）
- 说话人「号山土地神」，头衔用「【受压当方土地】」，图标 🍠
- 内容要点：号山枯松涧火云洞有妖王，形貌是孩童，自称圣婴大王；他曾在火焰山修行三百年，炼成三昧真火；土地与山中百姓被其强征"火租"，洞前焦土三年不长草。提醒：见着孩童求救先看脚印与火痕，莫因年小便轻视。
- 最后一步用一个选项推进：`text: '【记下警示，前往枯松涧探看】'`，action 里设置 `storyPhase = 'huoyun_redboy_ready'` 并 `refreshMapNpcs()`，再 `showGameMessage('🔥 号山枯松涧方向火气蒸腾，前路已开。', 'warning', 4000)`

**2. `huoyun_redboy_trick`**（红孩儿假意求救 → 识破 → 开战，6-7 步）
- 说话人轮换：红孩儿（头衔「【枯松涧孩童】」图标 🧒）→ 孙悟空（火眼金睛）→ 威灵大将（玩家，头衔「【护法天将】」图标 🛡️）→ 红孩儿（撕破伪装，头衔「【圣婴大王】」图标 🔥）
- 情节：红孩儿吊在树上喊救命，说自己被妖风卷来、父母不见了；悟空闻出"这味儿不是人味，是火烧过的骨头味"；玩家发现地上只有一串向上的脚印、没有挣扎痕迹，且焦土是从洞口往外烧的（说明火是妖王自己放的，不是受害者逃出）；红孩儿见被识破，笑着跳下来撕掉伪装。
- 幽默点：红孩儿被拆穿后不慌，反而抱怨"哭半个时辰，嗓子都哑了，你们倒看得仔细"，随即一本正经地要求"按规矩，先报名号再打"。悟空吐槽"小小年纪，规矩倒比天庭还多"。
- 但必须有一句严肃：红孩儿提到"洞前焦土是三年火租烧出来的"，玩家回应"烧的是别人家的田，你只管自己的火"——把玩笑与罪行分开。
- 最后选项：`text: '【识破伪装，迎战圣婴大王！】'`，action 里 close dialogue 后调用 `window.App2D.triggerHuoyunScoutBattle()`

**3. `huoyun_boss_encounter`**（红孩儿真身决战前，4-5 步）
- 说话人：红孩儿（头衔「【圣婴大王·三昧真身】」）→ 孙悟空 → 威灵大将
- 情节：红孩儿推出五辆小车，按五行排列，口念咒语要放三昧真火；悟空提醒"这火不是凡火，水浇不灭，先破他的车阵"；玩家决定正面接下。
- 严肃内核：红孩儿说"这火烧过山，也烧过人，你们挡得住几回"，玩家回应"挡不住也要挡，山下的田不能再烧第二遍"。
- 最后选项：`text: '【破车阵，决战三昧真火！】'`，action 里 close dialogue 后调用 `window.App2D.triggerRedboyBattle()`

### 第三部分：战后与领奖对白
**4. `huoyun_aftermath`**（战后收束 + 观音收服，4-5 步）
- 说话人：红孩儿（力竭）→ 观音菩萨（头衔「【南海大慈大悲】」图标 🪷）→ 威灵大将 → 孙悟空
- 情节：红孩儿被收服，观音以天罡刀化莲台、金箍儿制其身，收为善财童子；观音点明"他不是生来为恶，是无人教他火该怎么用"；玩家把"赔偿山下田亩"这件事说清楚，观音应允由善财童子日后亲手偿还。
- 结尾：悟空一句轻松的收束（例如"善财童子……这名儿比圣婴大王讲理多了"），但不要消解前面赔偿的分量。
- 最后一步 action：设置 `storyPhase = 'huoyun_cleared'`、`refreshMapNpcs()`、`saveAutoProgress()`，并 `showGameMessage` 提示功德圆满、西行大道开启。

**5. `huoyun_reward_ready`**（满包待领，2 步，与既有模式一致）
- 悟空保管战利品，玩家腾出行囊后再领。
- 选项：`text: '【领取火云洞战利品】'`，action 调用 `window.App2D.claimHuoyunReward()`

## 输出格式
按下面结构输出，三个补丁块：

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
（原文 + 新增 'chapter_12' 配置）
>>>>>>> NEW

### FILE: js/data/storyQuests.js
<<<<<<< OLD
  // =========================================================================
  // 支线任务：【苍茫三岭伏魔传】剧情与交互
  // =========================================================================
=======
（五个新对白键 + 原有注释）
>>>>>>> NEW

注意：以上两块都在同一个文件内，请分别输出，我会按顺序应用。
