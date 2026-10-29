你是《汉风西游》剧情数据工程师。请按已定方案输出「车迟国」章节的剧情数据补丁。

## 已定方案（架构评审结论，严格照做）

### 阶段链（7 个，阶段名不可改）
```
chedi_arrival         受役僧人申诉
chedi_audience        王廷立约，停役与斗法条件
chedi_rain            第一轮：祈雨验术（虎力）
chedi_discern         第二轮：坐禅辨物（鹿力）
chedi_final_trial     第三轮：三仙同场决战
chedi_reward_pending  领取谢礼与关文
chedi_cleared         终态（无本章活动目标）
```

### 地图事实（已实测）
- 地图 id `chediguo`，38×28，**100% 可行走**，无需重建。
- 已有 NPC `npc_chedi_king`（国王，坐标 896,352）。
- 已有传送门：破儿洞(1152,448)、通天河(32,448)。
- 需新增 NPC：`npc_chedi_monk`（受役僧人）、`npc_chedi_tiger`（虎力）、`npc_chedi_deer`（鹿力）、`npc_chedi_sheep`（羊力）。

### 8 个对白键（键名不可改）
| 键 | 用途 |
| --- | --- |
| `chedi_monk_appeal` | 僧人对白，接受申诉 |
| `chedi_royal_terms` | 王廷立约 |
| `chedi_rain_trial` | 第一轮祈雨（带线索选项，失败可原地重试） |
| `chedi_discern_trial` | 第二轮坐禅辨物（带线索选项，失败可原地重试） |
| `chedi_final_challenge` | 第三轮挑战前 |
| `chedi_victory` | 战后 |
| `chedi_reward` | 领奖 |
| `chedi_after_clear` | 终态尾声 |

### 可用的 App2D 方法（稍后由另一方实现，你只需调用）
- `window.App2D.storyPhase = '阶段名'`
- `window.App2D.refreshMapNpcs()` / `window.App2D.saveAutoProgress()`
- `window.App2D.scheduleStoryDialogue('键', 延迟)`
- `window.App2D.triggerChediFinalBattle()` —— 三仙同场决战
- `window.App2D.claimChediReward()` —— 领奖（幂等，满包可重试）
- `window.showGameMessage('文案', 'success'|'info'|'warning', 毫秒)`
- `window.Dialogue.close()`

### 格式
对白对象：`{ steps: [ { speaker, speakerTitle, speakerIcon, text, action?, options? } ] }`
选项：`{ text, action?, nextStep? }`

## 各节点要求

### 1. `chedi_monk_appeal`（4-5 步）
- 说话人：受役僧人（「【被役沙门】」🧘，头像请用 `roleId: 'xuanzang'`）→ 威灵大将（「【护法天将】」🛡️）→ 孙悟空（🐒）
- **禁区**：僧人的饥饿、伤病、恐惧与羞辱必须严肃，不拿虚弱/求饶/衣着破败做包袱。
- 情节：僧人诉说车迟国敬道灭僧，全国僧人被迫为三大仙当苦力；国王偏信三仙，佛法被禁。
- 末步 options：
  - `text: '【接下申诉，面见国王！】'`，action：`storyPhase = 'chedi_audience'`、`refreshMapNpcs()`、`showGameMessage('🏛️ 前往王城面见国王，约定停役与斗法条件。', 'info', 4500)`

### 2. `chedi_royal_terms`（5-6 步）
- 说话人：国王（「【车迟国主】」👑）→ 三大仙（虎力「【黄毛虎力大仙】」🐯、鹿力「【白毛鹿力大仙」」🦌、羊力「【灰毛羊力大仙】」🐑）→ 威灵大将
- 情节：国王提出条件——斗法三场，胜者立为国教；悟空要求公开见证、僧人不得继续受罚。
- 国王的态度：偏信三仙（但不能写成可笑的昏君）。
- 末步 action：`storyPhase = 'chedi_rain'`、`refreshMapNpcs()`、`showGameMessage('🌧️ 第一场斗法：祈雨验术！', 'info', 4500)`

### 3. `chedi_rain_trial`（7-8 步，带线索选项，失败可原地重试）
- 说话人：虎力 → 孙悟空 → 威灵大将 → 唐僧（🧘）
- 机制：**通过对白呈现风、云、雷、雨四步**，不新增天气系统。玩家需按「先验风云 → 再验雷雨」的顺序选择。
- **线索必须明确**：悟空应提示"风不至则云不聚，云不聚则雷不响"，玩家据此判断。
- 错答（贸然要求落雨）：提示「风云未合，徒唤无雨」，用 `nextStep` 返回观察步骤，**不扣资源、不降阶段**。
- 正确：四步齐全，大雨落下，虎力失去独占国师的依据。
- 末步 action：`storyPhase = 'chedi_discern'`、`refreshMapNpcs()`、`showGameMessage('🪷 第二场斗法：坐禅辨物！', 'success', 4500)`
- **幽默位（唯一）**：可在此轮结束时加一句八戒吐槽三仙供品/清修假清高，但**不得在僧人诉苦时插入**。

### 4. `chedi_discern_trial`（7-8 步，带线索选项，失败可原地重试）
- 说话人：鹿力 → 孙悟空 → 威灵大将 → 国王
- 机制：**隔板辨物**。先稳住心神不回应挑衅，再听取物件线索（如"坚且凉，非木非石"），选择辨认结果。
- **线索必须支持判断**：悟空点出"鹿力以袖风暗示，此非道术，乃伎俩"。
- 错答：指出遗漏线索，返回观察步骤，**不随机换题**。
- 正确：揭穿干扰，国王开始质疑三仙。
- 末步 action：`storyPhase = 'chedi_final_trial'`、`refreshMapNpcs()`、`showGameMessage('⚔️ 三仙拒不认输，动起武来！', 'warning', 4500)`
- **幽默位（唯一）**：辨物失败后鹿力改判词、虎力圆场反而互相拆台，悟空一句收束。

### 5. `chedi_final_challenge`（4-5 步）
- 说话人：虎力 → 鹿力 → 羊力 → 威灵大将
- 情节：三仙夸术（砍头、剖腹、油锅压缩为夸术与邪术败露的叙事），玩家决定正面破除。
- **禁区**：不做血腥喜剧，用夸术、法术败露、原形显露表达。
- 末选项：`text: '【破除邪术，三仙同场决战！】'`，action 先 `window.Dialogue.close()` 再 `window.App2D.triggerChediFinalBattle()`

### 6. `chedi_victory`（5-6 步）
- 说话人：孙悟空 → 三仙现原形 → 国王 → 受役僧人（获释）
- 情节：三仙现原形、邪术消散；国王公开纠错，停止迫害、归还寺院、禁止报复。
- **禁区**：不用一句"误会了"抹掉迫害，国王必须明确纠错内容，由僧人表达自身诉求。
- 末步 action：`storyPhase = 'chedi_reward_pending'`、`refreshMapNpcs()`、`saveAutoProgress()`、`showGameMessage('📜 三仙伏诛，可向国王领取谢礼与西行关文。', 'success', 5000)`

### 7. `chedi_reward`（2-3 步）
- 说话人：国王
- 内容：国王致歉，明确停役、归还寺院、禁止报复；谢礼已备。
- 选项：`text: '【领取谢礼与西行关文】'`，action 调 `window.App2D.claimChediReward()`

### 8. `chedi_after_clear`（3-4 步）
- 说话人：国王 → 受役僧人（获释）→ 威灵大将
- 内容：本章收束，关文通行资格落定；不再推进本章阶段、不再发奖（可重复查看）。
- 最后一步 action：仅 `saveAutoProgress()`，不改阶段。

## 还需要输出

### A. 新增 NPC（4 个，插入 `js/data/maps2d.js` 的 `chediguo` 地图 `npcs` 数组内）
坐标请按以下（均在 38×28 范围内且 100% 可行走）：
- `npc_chedi_monk`：x=576, y=704，appearance `stone_monkey`（和尚形象，`xuanzang` 在 character.js 无专属渲染会回退天将），icon 🧘，dialogueKey `chedi_monk_appeal`
- `npc_chedi_tiger`：x=832, y=384，appearance `tiger`，icon 🐯，dialogueKey `chedi_rain_trial`
- `npc_chedi_deer`：x=288, y=288，appearance `fox`，icon 🦌，dialogueKey `chedi_discern_trial`
- `npc_chedi_sheep`：x=928, y=512，appearance `wolf`，icon 🐑，dialogueKey `chedi_final_challenge`

**注意**：`stone_monkey` / `tiger` / `fox` / `wolf` 已确认在 `js/engine/character.js` 有专属渲染分支（drawStoneMonkey / drawTiger / drawFox / drawWildWolf），不要改用其它外观。

### B. 章节开幕配置
在 `CHAPTER_CONFIGS` 末尾追加 `'chapter_14'`：
- id: 'chapter_14'
- chapterNum: '第十四回'
- title: '第十四回 · 车迟斗法'
- subtitle: 七言一句（14 字，对仗），体现"车迟、三仙、斗法、护僧"意象
- seal: 四字，例如「车迟显正」
- triggerMap: 'chediguo'
- triggerPhase: 'chedi_arrival'

## 硬性要求
- 简体中文，国风措辞，克制。
- 缩进 2 空格。
- 不新增 App2D 方法或改协议。
- 前两轮斗法的线索必须能从当前对白推出，不能盲猜。

## 输出格式
用 ```js 代码块包裹，分别给出三个部分，每部分前用注释标注：

```js
// ===== 部分 1：8 个对白键（完整 JS 对象字面量，可直接插入 STORY_DIALOGUES） =====
...
```

```js
// ===== 部分 2：4 个新增 NPC（完整 JS 数组元素，含在 chediguo npcs 内） =====
...
```

```js
// ===== 部分 3：chapter_14 配置对象字面量 =====
...
```
