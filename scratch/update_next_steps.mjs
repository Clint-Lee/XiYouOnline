import fs from 'node:fs';
const p = 'NEXT_STEPS.md';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

// 更新进度表
const from = `| 第十四回 车迟国 | ✅ 闭环 | \`chedi_cleared\` |
| 通天河 / 火焰山 / 盘丝洞 / 狮驼岭 / 大雷音寺 | ❌ 地图在、无主线 | — |`;
const to = `| 第十四回 车迟国 | ✅ 闭环 | \`chedi_cleared\` |
| 第十五回 通天河 | ✅ 闭环 | \`tongtian_cleared\` |
| 火焰山 / 盘丝洞 / 狮驼岭 / 大雷音寺 | ❌ 地图在、无主线 | — |`;
const c = s.split(from).length - 1;
if (c === 1) { s = s.replace(from, to); console.log('✓ 进度表已更新'); }
else console.error(`✗ 进度表 ${c}`);

// 基线数字
s = s.replace('2078/2078 (100.0%)', '2166/2166 (100.0%)');
s = s.replace('原有 **2078 条断言全部保留并通过**', '原有 **2166 条断言全部保留并通过**');

// 更新"下一步第一件事"
const from2 = `**做通天河（第十五回）**。理由：西行出口已通、地图已存在、素材成熟、且能验证"多章节连续推进"的完整链路。`;
const to2 = `**做火焰山（第十六回）**。理由：西行出口已通（通天河 (32,448) → \`huoyanshan\`）、地图已存在、素材成熟（芭蕉扇/牛魔王/铁扇公主）。`;
const c2 = s.split(from2).length - 1;
if (c2 === 1) { s = s.replace(from2, to2); console.log('✓ 下一步已更新'); }
else console.error(`✗ 下一步 ${c2}`);

if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ NEXT_STEPS.md 已更新');
