import fs from 'node:fs';

const src = fs.readFileSync('js/data/storyQuests.js', 'utf8').split(/\r?\n/);
const out = [];

const grab = (label, startPat, count) => {
  const s = src.findIndex(l => l.includes(startPat));
  if (s < 0) { out.push(`\n=== ${label} ===\n[未找到]`); return; }
  out.push(`\n=== ${label}（行 ${s + 1} 起）===`);
  out.push(src.slice(s, s + count).map((l, i) => `${String(s + 1 + i).padStart(5)}| ${l}`).join('\n'));
};

// 1) 章节配置尾部
grab('CHAPTER_CONFIGS 尾部（chapter_12）', "'chapter_12': {", 20);
// 2) 支线注释锚点
grab('支线任务注释锚点', '支线任务：【苍茫三岭伏魔传】剧情与交互', 6);
// 3) 一个对白对象样例（供格式参考）
grab('对白对象样例 pingdingshan_laojun_aftermath', 'pingdingshan_laojun_aftermath: {', 12);
// 4) 火云洞对白样例（含 action 与 options 写法）
grab('火云洞对白样例 huoyun_tudi_warning', 'huoyun_tudi_warning: {', 26);

fs.writeFileSync('scratch/sq_ctx.txt', out.join('\n'), 'utf8');
console.log('已生成 scratch/sq_ctx.txt', out.join('\n').length, '字符');
