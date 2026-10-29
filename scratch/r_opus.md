### FILE: js/app2d.js
<<<<<<< OLD
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
=======
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
    } else if (sp === 'changan_meet_xuanzang') {
      ordealNumber = '【第二难·长安受戒】';
      ordealName = '化生古刹 · 拜见玄奘';
      ordealDesc = '初入长安，先往化生寺参拜金蝉转世的玄奘法师，共商西行取经大计，结下师徒同行之缘。';
      chapter = '第二回 · 皇都盛世';
      stepName = '前往化生寺拜见玄奘';
      stepTarget = '前往化生寺拜见玄奘法师';
      stepProgress = '0/1 前往中';
      stepProgressRatio = 0;
      stepHint = '化生寺钟声悠远，法师正于此静候';
    } else if (sp === 'changan_meet_taizong') {
      ordealNumber = '【第二难·长安受戒】';
      ordealName = '金銮宝殿 · 觐见太宗';
      ordealDesc = '既拜玄奘，再登长安金銮宝殿觐见唐太宗李世民，领受通关文牒，受命西行取回真经。';
      chapter = '第二回 · 皇都盛世';
      stepName = '金銮殿觐见唐太宗';
      stepTarget = '登金銮宝殿觐见太宗皇帝，领取通关文牒';
      stepProgress = '已见玄奘，待觐见太宗';
      stepProgressRatio = 0.5;
      stepHint = '金銮殿上太宗御座以待，文牒即将授予';
    } else if (sp === 'changan_farewell') {
      ordealNumber = '【第二难·长安受戒】';
      ordealName = '长安城门 · 辞别启程';
      ordealDesc = '文牒在手，再至长安城门口与刘伯钦依依惜别，就此告别繁华国都，踏上漫漫西行取经之路。';
      chapter = '第二回 · 皇都盛世';
      stepName = '城门口辞别刘伯钦';
      stepTarget = '前往长安城门口与刘伯钦送行辞别，随后西行启程';
      stepProgress = '待启程';
      stepProgressRatio = 0.8;
      stepHint = '西行第一站：五行山';
    } else if (sp.startsWith('chentang_') || sp.startsWith('donghai_') || sp.startsWith('longgong_')) {
>>>>>>> NEW