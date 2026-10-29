我需要先查看现有文件的真实内容，确保 OLD 片段逐字符忠实于原文。工作区是空的——没有 `js/data/storyQuests.js`，也没有任何项目代码。

我无法输出符合硬性要求的补丁：规则要求「OLD 片段必须逐字符忠实于给定原文」，但任务中并未提供 `storyQuests.js` 的实际内容，工作区里也不存在该文件，因此我无从核对以下关键锚点是否真实存在、是否逐字符一致：

- `CHAPTER_CONFIGS` 里 `'chapter_12': {` 的确切缩进与上下文
- 既有章节配置字段顺序（`id/chapterNum/title/subtitle/seal/triggerMap/triggerPhase` 是否完整、是否还有其他字段如 `locked`、`order` 等）
- 支线注释块那三行分隔符是否与给定完全一致（空格数、`=` 数量）
- 对白对象在该文件中的书写容器（是挂在 `window.GAME_DATA.STORY_DIALOGUES` 还是别的键上，以及它的缩进层级）

如果我凭空捏造 OLD 片段，补丁将无法套用（diff 失配），反而有害。

请提供以下任一项，我就能立即产出精确补丁：