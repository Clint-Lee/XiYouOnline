import fs from 'node:fs';
const p = 'scratch/p_opus12.md';
let s = fs.readFileSync(p, 'utf8');

const from = `- \`npc_chedi_monk\`：x=576, y=704，appearance \`xuanzang\`，icon 🧘，dialogueKey \`chedi_monk_appeal\``;
const to = `- \`npc_chedi_monk\`：x=576, y=704，appearance \`stone_monkey\`（和尚形象，\`xuanzang\` 在 character.js 无专属渲染会回退天将），icon 🧘，dialogueKey \`chedi_monk_appeal\``;

const c = s.split(from).length - 1;
if (c !== 1) { console.error(`匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
s = s.replace('**注意**：`fox` / `wolf` / `tiger` / `xuanzang` 必须确认在 `js/engine/character.js` 有专属渲染分支，若没有请改用有分支的外观并在注释中说明。',
  '**注意**：`stone_monkey` / `tiger` / `fox` / `wolf` 已确认在 `js/engine/character.js` 有专属渲染分支（drawStoneMonkey / drawTiger / drawFox / drawWildWolf），不要改用其它外观。');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已修正僧人外观要求');
