你是《汉风西游》原生 JS 项目的代码修改工程师。请只输出补丁，严格按格式，不要解释。

## 任务
在 js/app2d.js 的 getOrdealAndQuestInfo() 中，补齐长安阶段缺失的三个分支。
当前该 if-else 链在 `sp === 'liujiacun_go_changan' || sp === 'changan_arrived'` 分支之后，直接跳到 `sp.startsWith('chentang_')` 分支，
导致 changan_meet_xuanzang / changan_meet_taizong / changan_farewell 三个阶段落到函数开头的默认值
（"第一难·两界投生 / 与刘伯钦对话"），玩家按 Q 看到的是完全错误的旧任务。

## 原文（必须逐字匹配，位于 js/app2d.js，请精确替换）
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
    } else if (sp.startsWith('chentang_') || sp.startsWith('donghai_') || sp.startsWith('longgong_')) {

## 要求
1. 在 `changan_arrived` 分支与 `chentang_` 分支之间，插入三个新的 else-if 分支，顺序为：
   changan_meet_xuanzang、changan_meet_taizong、changan_farewell。
2. 每个分支都必须完整赋值这些变量：ordealNumber、ordealName、ordealDesc、chapter、stepName、stepTarget、stepProgress、stepProgressRatio、stepHint，以及（如适用）isDone。
3. 语义要求（必须准确）：
   - changan_meet_xuanzang：去化生寺拜见玄奘法师，共商西行。进度 0/1 → 目标"前往化生寺拜见玄奘法师"。chapter 仍是「第二回 · 皇都盛世」。ordealNumber 保持【第二难·长安受戒】。
   - changan_meet_taizong：登上金銮宝殿觐见唐太宗李世民，领受通关文牒。stepName 应体现"金銮殿觐见"，stepProgress 可写"已见玄奘，待觐见太宗"，ratio 约 0.5。
   - changan_farewell：城门口与刘伯钦送行，随后西行启程。stepName 体现"城门口辞别刘伯钦"，stepProgress "待启程"，ratio 约 0.8，stepHint 提示"西行第一站：五行山"。
4. 每个分支内不要出现任何函数调用或副作用，只做变量赋值。
5. 文案风格：简体中文，国风措辞，与项目现有风格一致（参考上面原文的措辞密度）。
6. 不要修改这四个分支之外的任何代码。

## 输出格式
### FILE: js/app2d.js
<<<<<<< OLD
（上面给出的完整原文，逐字复制）
=======
（替换后的新代码，包含原文四个部分 + 新增三个分支 + chentang_ 分支的开头行）
>>>>>>> NEW
