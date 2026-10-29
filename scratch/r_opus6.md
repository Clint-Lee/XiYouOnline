我需要先读取实际文件内容，确保补丁的 OLD 片段逐字精确匹配。工作区里没有这个项目。`/workspace/project` 为空，也找不到 `js/core/battle.js`。

我无法输出你要求格式的补丁，因为硬性要求规定「OLD 片段必须逐字符忠实于给定原文」且「OLD 必须能从文件中唯一匹配」——但当前环境里根本不存在 `js/core/battle.js`（`/workspace` 下只有一个空的 `project/` 目录，全盘搜索也无结果）。

凭空编造 OLD 片段会违反你最关键的约束（锚点必须与真实文件逐字一致），一旦哪怕一个空格对不上，补丁就无法应用，反而更糟。

请帮我把项目接入进来，二选一：

- **把《汉风西游》项目放进 `/workspace/project/`**（或告诉我它所在的路径 / 给我仓库地址），我读到真实的 `js/core/battle.js` 后再按锚点精确生成补丁；
- 或者**直接把 `js/core/battle.js` 全文（或至少任务涉及的构造函数、`handleAllyTurn`、`handleSkillCast`、`handleEnemyTurn`、`settleRoundBuffs`、`checkBattleEnd` 这几段）贴给我**，我据此输出补丁。

你倾向哪种方式？