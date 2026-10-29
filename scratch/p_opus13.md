你是《汉风西游》剧情数据工程师。请按已定方案输出「通天河」章节的剧情数据。

## 已定方案（架构评审结论，严格照做）

### 阶段链（7 个，阶段名不可改）
```
tongtian_arrival        初见陈家长者，查明祭童之事
tongtian_vowed          明确表态"祭童的事今日为止"+ 安置孩子
tongtian_altar          悟空八戒变作替身赴约，妖怪现身冰封掳人
tongtian_rescue         探查水府入口（固定线索题），救出被困师徒
tongtian_await_guanyin  战斗胜利，等观音收妖
tongtian_reward         向陈家长者辞行领奖
tongtian_cleared        终态（无本章目标）
```

### ⚠️ 我已落地的阶段名与你不同，请以下方 7 个为准（我会统一）
旧阶段名（作废）：`tongtian_pledge` / `tongtian_offer_ready` / `tongtian_ice_battle` / `tongtian_reward_pending`

### 地图事实（已实测）
- 地图 `tongtianhe`，38×28，可行走 **89.3%**（950/1064），全 BFS 连通，无需重建。
- 已有 NPC：`npc_tongtian_yuan`（通天老鼋，坐标 832,384）。
- 已有传送门：车迟国(1152,448)、火焰山(32,448)。

### 需要的 NPC ID（我会负责落位，你只写 dialogueKey）
| ID | 用途 | dialogueKey |
|---|---|---|
| `npc_tongtian_elder` | 陈家长者（接案+领奖共用） | `tongtian_appeal` |
| `npc_tongtian_child` | 被选中的孩童（陈关保/一秤金合体叙事） | `tongtian_child_words` |
| `npc_tongtian_altar` | 河畔祭坛交互点 | `tongtian_altar_rite` |
| `npc_tongtian_watergate` | 水府入口（线索题） | `tongtian_watergate` |
| `npc_tongtian_guanyin` | 观音（仅收妖阶段） | `tongtian_guanyin_arrival` |

### 对白键清单（8 个，键名不可改）
`tongtian_appeal`、`tongtian_child_words`、`tongtian_vow`、`tongtian_altar_rite`、`tongtian_watergate`、`tongtian_victory`、`tongtian_guanyin_arrival`、`tongtian_reward`

### 可用的 App2D 方法（我会实现，你只调用）
- `window.App2D.storyPhase = '阶段名'`
- `window.App2D.refreshMapNpcs()` / `window.App2D.saveAutoProgress()`
- `window.App2D.scheduleStoryDialogue('键', 延迟)`
- `window.App2D.triggerTongtianRescueBattle()` —— 水府救援战
- `window.App2D.claimTongtianReward()` —— 领奖（幂等，满包可重试）
- `window.showGameMessage('文案', 'success'|'info'|'warning', 毫秒)`
- `window.Dialogue.close()`

### 格式
对白对象：`{ steps: [ { speaker, speakerTitle, speakerIcon, text, action?, options? } ] }`
选项：`{ text, action?, nextStep? }`

## 各节点要求

### 1. `tongtian_appeal`（4-5 步）—— 陈家长者
- 说话人：陈家长者（「【陈家庄乡老】」👴）→ 威灵大将（「【护法天将】」🛡️）→ 孙悟空（🐒）
- **绝对严肃**：说出祭童的实情——通天河灵感大王每年索要童男童女，陈家庄世代不敢违抗；今年轮到陈关保与一秤金；**家长不是认可献祭，而是长期受胁迫**。
- 可有一个"追问往年情形"的分支，追问后回到表态节点。
- **必须出现的表态选项**：`text: '【祭童的事今日为止。孩子留下，我们去见那妖怪。】'`，action：`storyPhase = 'tongtian_vowed'`、`refreshMapNpcs()`、`showGameMessage('🛡️ 已向陈家庄立约：祭童之事今日为止。', 'info', 4500)`
- **不得提供**"继续献祭换取除妖机会"的假分支；暂不接受就不推进。

### 2. `tongtian_child_words`（2-3 步）—— 孩童
- 说话人：孩童（「【被选中的祭童】」🧒）→ 威灵大将
- **禁区**：不拿儿童的恐惧做笑料，不写可爱化、萌化描写。
- 内容：孩子紧抓家长不敢出门，问"是不是我去了，别人就不用去"。玩家回答必须有担当——"从今往后，谁都不用去"。
- 最后一步 action：仅 `saveAutoProgress()`，不改阶段。

### 3. `tongtian_vow`（4-5 步）—— 安置孩子 + 替身准备
- 说话人：孙悟空 → 猪八戒 → 唐三藏 → 威灵大将
- 情节：明确说清孩子留在哪里、由谁陪护（唐僧、沙僧留守照应）；悟空八戒变作两名孩童的模样。
- **幽默边界：本章不使用幽默**。不要写八戒"太胖装不像"之类的笑话——首次接案已见到孩子，再说笑会越界。
- 最后一步 action：`storyPhase = 'tongtian_altar'`、`refreshMapNpcs()`、`showGameMessage('🎭 替身已备，前往河畔祭坛。', 'info', 4500)`

### 4. `tongtian_altar_rite`（5-6 步）—— 祭坛劫人演出
- 说话人：灵感大王（「【通天河主】」🐟，**不要可爱化、不要美食化**）→ 孙悟空 → 猪八戒 → 威灵大将
- 情节：河风骤停、祭灯变冷、黑水向岸边抬升；妖怪以索取祭童的口吻发问；替身被识破；妖怪封冻近岸、转袭留守处；八戒返身护师时同唐僧被掳；悟空护住撤离中的村民。
- **敌人的报复不否定救孩子的选择，也不把灾难归咎于孩子。**
- 最后一步 action：`storyPhase = 'tongtian_rescue'`、`refreshMapNpcs()`、`saveAutoProgress()`、`showGameMessage('❄️ 师父与八戒被掳入水府！探查水府入口。', 'warning', 5000)`
- **此对白的 action 必须幂等**：若阶段已不是 `tongtian_altar`，action 内先判断再推进（防重复回调）。

### 5. `tongtian_watergate`（7-8 步）—— 固定线索题
- 说话人：孙悟空 → 沙僧 → 威灵大将 → （观察水府入口）
- **线索必须明确**：同时提供两条证据——
  - 气泡连续从未冻结的**暗流侧口**上浮
  - **主门冰层**向外吐出寒气
  正确选择：循暗流侧口进入。
- **错答**：提示"正撞冰封主门"，用 `nextStep` 返回原观察步骤，**不扣资源、不降阶段、不随机换题**。
- 可加一步追问"为何不走主门"，悟空解释主门冰层是妖怪故意留下的陷阱。
- 正确选项：`text: '【循暗流侧口潜入水府，救出师父！】'`，action 先 `window.Dialogue.close()` 再 `window.App2D.triggerTongtianRescueBattle()`
- 正确选项仍需检查阶段（action 内判断 `storyPhase === 'tongtian_rescue'`）。

### 6. `tongtian_victory`（4-5 步）—— 战后
- 说话人：孙悟空 → 猪八戒（获救）→ 唐三藏（获救）→ 威灵大将
- 情节：破开防线、救出唐僧八戒、灵感大王退回深水；**战斗胜利不等于河患解除，妖怪尚未伏法**。
- 最后一步 action：`storyPhase = 'tongtian_await_guanyin'`、`refreshMapNpcs()`、`showGameMessage('🪷 妖已退回深水，然尚未伏法。去河畔见观音。', 'info', 4500)`

### 7. `tongtian_guanyin_arrival`（5-6 步）—— 观音收妖与安抚
- 说话人：观世音菩萨（「【南海大慈大悲】」🪷）→ 灵感大王（现原形，金鱼）→ 威灵大将 → 陈家长者
- 情节：观音揭明来历（莲花池中的金鱼，每日听佛法得道，趁潮涨逃至此）；**用鱼篮收妖**；明确"祭童之事从今停止"；**认真安抚家长与孩子**。
- **严肃收束**：不使用轻松语气。
- 最后一步 action：`storyPhase = 'tongtian_reward'`、`refreshMapNpcs()`、`saveAutoProgress()`、`showGameMessage('📜 祭童已止，河患将除。向陈家长者辞行。', 'success', 5000)`

### 8. `tongtian_reward`（2-3 步）—— 领奖
- 说话人：陈家长者
- 内容：致谢，确认从今不再献祭；谢礼已备。
- 选项：`text: '【领取谢礼，渡河东去】'`，action 调 `window.App2D.claimTongtianReward()`

## 还需要输出

### A. 章节开幕配置
在 `CHAPTER_CONFIGS` 末尾追加 `'chapter_15'`：
- id: 'chapter_15'
- chapterNum: '第十五回'
- title: '第十五回 · 通天归真'
- subtitle: 七言一句（14 字，对仗），体现"通天河、祭童、观音收妖"意象
- seal: 四字，例如「通天止祭」
- triggerMap: 'tongtianhe'
- triggerPhase: 'tongtian_arrival'

## 硬性要求
- 简体中文，国风措辞，克制。
- **本章零幽默**。
- 缩进 2 空格。
- 每个对白顶层 key 顶格写（0 空格缩进），形如 `tongtian_appeal: { ... }`，不要包在数组里。
- 所有 action 调用 `window.App2D` 前先判存在。

## 输出格式
用 ```js 代码块包裹，两部分：

```js
// ===== 部分 1：8 个对白键（key 顶格，逗号结尾） =====
tongtian_appeal: {
  ...
},
tongtian_child_words: {
  ...
},
...
```

```js
// ===== 部分 2：chapter_15 配置对象字面量 =====
'chapter_15': {
  ...
}
```
