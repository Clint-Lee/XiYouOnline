// 生成给 Opus 的上下文：抽取 battle.js 中机制涉及的关键片段，附带行号与精确缩进。
import fs from 'node:fs';

const src = fs.readFileSync('js/core/battle.js', 'utf8').split(/\r?\n/);

function block(name, startPat, endPat, note = '') {
  const s = src.findIndex(l => l.includes(startPat));
  if (s < 0) return `\n=== ${name} ===\n[未找到: ${startPat}]\n`;
  let e = src.findIndex((l, i) => i > s && l.includes(endPat));
  if (e < 0) e = Math.min(src.length - 1, s + 40);
  const lines = src.slice(s, e + 1);
  const numbered = lines.map((l, i) => `${String(s + 1 + i).padStart(5)}| ${l}`).join('\n');
  return `\n=== ${name} ${note}===\n${numbered}\n`;
}

let out = '';
out += block('构造函数尾部', '// 临时指令集', 'this.calcTurnOrders();\n', '');
out += block('defend 分支', "if (action.type === 'defend')", 'return;\n      }', '（含后续 3 行）');
out += block('attack 分支 applyDamage', 'this.applyDamage(targetEnemy, attackRes.totalDamage);', 'let logMsg', '');
out += block('handleSkillCast 开头', 'async handleSkillCast(ally, action, cb) {', 'const aliveEnemies = this.getAliveEnemies();', '');
out += block('settleRoundBuffs', 'async settleRoundBuffs(cb) {', 'checkBattleEnd', '');
out += block('handleEnemyTurn 开头', 'async handleEnemyTurn(enemy, action, cb) {', 'const targetAlly', '');

fs.writeFileSync('scratch/battle_ctx.txt', out, 'utf8');
console.log(`已生成 scratch/battle_ctx.txt (${out.length} 字符)`);
