// 在 storyQuests.js 的「支线任务」注释块之前插入一段文本（纯 Node，避开 shell 编码问题）。
// 用法: node scratch/insert_huoyun.mjs <fragmentFile>
import fs from 'node:fs';

const [, , fragFile] = process.argv;
const target = 'js/data/storyQuests.js';

const lines = fs.readFileSync(target, 'utf8').split(/\r?\n/);
const frag = fs.readFileSync(fragFile, 'utf8').replace(/\r\n/g, '\n').replace(/\n+$/, '');

// 找到「// 支线任务：...苍茫三岭...」这一行的上一行（即 "  }," 之后的位置）
const anchorIdx = lines.findIndex(l => l.includes('//') && l.includes('支线任务') && l.includes('苍茫三岭'));
if (anchorIdx === -1) {
  console.error('未找到支线任务注释锚点');
  process.exit(2);
}

// 锚点上方应为  // =====  注释行，再上一行为  } 或空行。
// 从锚点往上跳过连续的 "// ====" 行，找到真正的插入点。
let insertAt = anchorIdx;
while (insertAt > 0 && lines[insertAt - 1].trim().startsWith('// ====')) insertAt--;
// 再往上应是空行或某个键的结束
console.log(`锚点行=${anchorIdx + 1}, 插入点=${insertAt + 1}`);
console.log(`插入点上一行: ${JSON.stringify(lines[insertAt - 1])}`);

const out = [
  ...lines.slice(0, insertAt),
  '',
  '  // =========================================================================',
  '  // 第十二回：号山·枯松涧火云洞（圣婴大王红孩儿）',
  '  // =========================================================================',
  ...frag.split('\n'),
  '',
  ...lines.slice(insertAt)
];

fs.writeFileSync(target, out.join('\n'), 'utf8');
console.log(`✓ 已在 ${target} 第 ${insertAt + 1} 行前插入 ${frag.split('\n').length} 行`);
