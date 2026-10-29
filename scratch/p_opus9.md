你是《汉风西游》剧情数据工程师。请按已定方案输出第十二回之后的新章节「黑水河」剧情数据补丁。

## 已定方案（架构评审结论，严格照做，不要自行改动阶段名与键名）

### 阶段链（8 个，闭环到 heishui_cleared）
```
heishui_arrived         初入黑水河，船夫摆渡骗局
heishui_captives_taken  唐僧八戒被摄，寻访失府河神
heishui_scout_ready     探查水府，击退守将
heishui_aid_needed      获得鼍洁身份线索，商议请援
heishui_moang_arrived   摩昂抵达，战前交代
heishui_boss_ready      决战鼍洁
heishui_reward_pending  救人复府，领取谢礼
heishui_cleared         事毕渡河（终态）
```

### 需要输出的 10 个对白键（键名不可改）
| 键 | 用途 |
| --- | --- |
| `heishui_ferry_trap` | 摆渡骗局 |
| `heishui_rivergod_appeal` | 河神诉情 |
| `heishui_scout_challenge` | 探战入口 |
| `heishui_scout_victory` | 探战胜利 |
| `heishui_seek_west_sea_aid` | 核实身份、请援 |
| `heishui_moang_briefing` | 摩昂战前交代 |
| `heishui_tuojie_challenge` | 首领挑战 |
| `heishui_tuojie_defeated` | 擒妖救人、河神复位 |
| `heishui_reward_claim` | 领取谢礼及重试 |
| `heishui_crossing_epilogue` | 渡河尾声 |

### 可选用的 App2D 方法（稍后由另一方实现，你只需在正确位置调用）
- `window.App2D.storyPhase = '阶段名'`
- `window.App2D.refreshMapNpcs()`
- `window.App2D.saveAutoProgress()`
- `window.App2D.scheduleStoryDialogue('键', 延迟)`
- `window.App2D.triggerHeishuiScoutBattle()` —— 探战（水府守将）
- `window.App2D.triggerTuojieBattle()` —— 首领战（鼍洁）
- `window.App2D.claimHeishuiReward()` —— 领奖（幂等，满包可重试）
- `window.showGameMessage('文案', 'success'|'info'|'warning', 毫秒)`
- `window.Dialogue.close()`

### 格式约定
对白对象：`{ steps: [ { speaker, speakerTitle, speakerIcon, text, action?, options? } ] }`
选项：`{ text, action?, nextStep? }`（`nextStep` 为数字时跳转到该下标，不写则结束）

## 各节点要求

### 1. `heishui_ferry_trap`（5-6 步）
- 说话人：摆渡船夫（「【黑水渡口】」🛶）→ 唐三藏（🧘）→ 孙悟空（🐒）→ 船夫现形（「【鼍洁部下】」🐊）
- 情节：唐僧要渡河，问船资；船夫失言露出神府主人的口气；悟空觉出不对但河水太浊看不清底；船到河心船夫现形，摄走唐僧与八戒。
- **幽默点（唯一一处，放在危险显露之前）**：船夫说"这河上……咳，这船上，自然听我的。"——轻微失言兼伏笔。妖怪现形后立刻收住，不再玩笑。
- 末步 action：`storyPhase = 'heishui_captives_taken'`、`refreshMapNpcs()`、`saveAutoProgress()`、`showGameMessage('🌊 师父与八戒被摄走！速寻熟悉河情之人。', 'warning', 5000)`

### 2. `heishui_rivergod_appeal`（4-5 步）
- 说话人：失府河神（「【无处安身】」🌊）→ 沙僧（🌊）→ 孙悟空
- **禁区**：河神被夺府、被迫流落，必须严肃，**不能写成"没本事守家"的笑柄**。
- 情节：河神诉说鼍洁占了衡阳峪黑水河神府，将他赶出；鼍洁是泾河龙王第九子，其舅为西海龙王敖闰；河神指认水府入口。
- 末步 action：`storyPhase = 'heishui_scout_ready'`、`refreshMapNpcs()`、`showGameMessage('🔱 水府入口已明，随沙僧探府。', 'info', 4500)`

### 3. `heishui_scout_challenge`（3-4 步）
- 说话人：水府守将（「【黑水拦路】」🔱）→ 沙僧 → 威灵大将（「【护法天将】」🛡️）
- 情节：守将拦路，沙僧请战；玩家决定随沙僧突破。
- 末选项：`text: '【与沙僧同破水府守将！】'`，action 先 `window.Dialogue.close()` 再 `window.App2D.triggerHeishuiScoutBattle()`

### 4. `heishui_scout_victory`（3-4 步）
- 说话人：沙僧 → 失府河神 → 孙悟空
- 情节：击退守将，得悉鼍洁身份（泾河龙王第九子、敖闰外甥）；悟空说明水中强攻不利，需请其表兄摩昂。
- 末步 action：`storyPhase = 'heishui_aid_needed'`、`refreshMapNpcs()`、`showGameMessage('🐒 悟空赴西海请援。', 'info', 4000)`

### 5. `heishui_seek_west_sea_aid`（3-4 步）
- 说话人：失府河神 → 孙悟空 → 沙僧
- 情节：核对鼍洁来历与管束归属（其舅西海龙王敖闰难辞管束之责）；**以叙事省略悟空往返西海，不新建地图**；悟空带回摩昂将至的消息。
- 末步 action：`storyPhase = 'heishui_moang_arrived'`、`refreshMapNpcs()`、`showGameMessage('🐉 西海龙太子摩昂已至。', 'success', 4500)`

### 6. `heishui_moang_briefing`（4-5 步）
- 说话人：摩昂（「【奉命擒妖】」🐉）→ 威灵大将 → 沙僧
- 情节：摩昂说明鼍洁是其表弟，此行奉父命押回问罪；请玩家牵制鼍洁、破其水势，由他出手擒拿。
- **禁区**：不能写成"有亲戚就不用担责"，摩昂押回问罪必须明确。
- 末步 action：`storyPhase = 'heishui_boss_ready'`、`refreshMapNpcs()`、`showGameMessage('⚔️ 摩昂已备擒拿，可挑战鼍洁。', 'warning', 4500)`

### 7. `heishui_tuojie_challenge`（4-5 步）
- 说话人：鼍洁（「【黑水大王】」🐊）→ 孙悟空 → 威灵大将
- 情节：鼍洁自封"黑水大王"，夸口占府；悟空点破其来历；玩家决定正面破其水势。
- 末选项：`text: '【破其水势，为摩昂创造擒拿之机！】'`，action 先 close 再 `window.App2D.triggerTuojieBattle()`

### 8. `heishui_tuojie_defeated`（5-6 步）
- 说话人：摩昂 → 鼍洁（被擒）→ 失府河神（复位）→ 唐三藏（获救）
- 情节：摩昂擒住鼍洁押回西海问罪；河神复位；唐僧八戒获救。
- **第二处幽默（放在救人复府、正式交接之后）**：摩昂平静纠正鼍洁自封的头衔，例如"『黑水大王』不必报了，报本名。"——讽刺僭越与虚荣，**不嘲弄俘虏处境**，一句结束不发展成连续斗嘴。
- 末步 action：`storyPhase = 'heishui_reward_pending'`、`refreshMapNpcs()`、`saveAutoProgress()`、`showGameMessage('🌊 河神复位，师徒脱险。可向河神领取谢礼。', 'success', 5000)`

### 9. `heishui_reward_claim`（2-3 步）
- 说话人：黑水河神（「【复位谢恩】」🌊）
- 内容：河神致谢，说明谢礼已备；若行囊满可稍后再领。
- 选项：`text: '【领取黑水河谢礼】'`，action 调用 `window.App2D.claimHeishuiReward()`

### 10. `heishui_crossing_epilogue`（3-4 步）
- 说话人：唐三藏 → 沙僧 → 威灵大将
- 内容：渡河前的收束对话，确认前路；不再推进本章阶段、不再发奖（可重复查看）。
- 最后一步 action：仅 `saveAutoProgress()`，不改阶段。

## 还需要输出：章节开幕配置
在 `window.GAME_DATA.CHAPTER_CONFIGS` 末尾（现有最后一个键是 `'chapter_12'`）追加 `'chapter_13'`：
- id: 'chapter_13'
- chapterNum: '第十三回'
- title: '第十三回 · 黑水擒龙'
- subtitle: 七言一句（14 字，对仗），需体现"黑水、摄僧、龙子擒妖"意象
- seal: 四字，例如「黑水伏鼍」
- triggerMap: 'heishuihe'
- triggerPhase: 'heishui_arrived'

## 硬性要求
- 简体中文，国风措辞，克制。
- 缩进 2 空格，与项目一致。
- 不要新增任何 App2D 方法或改协议。
- 每个对白节点的最后一个 `options[0].action` 或末步 `action` 必须能推进/触发上面指定的动作。

## 输出格式（三块）
### FILE: js/data/storyQuests.js
<<<<<<< OLD
    'chapter_12': {
=======
（chapter_13 追加 + 原 chapter_12 开头）
>>>>>>> NEW

### FILE: js/data/storyQuests.js
<<<<<<< OLD
  // =========================================================================
  // 支线任务：【苍茫三岭伏魔传】剧情与交互
  // =========================================================================
=======
（10 个对白键 + 原注释）
>>>>>>> NEW
