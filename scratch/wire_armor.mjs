import fs from 'node:fs';
const p = 'js/core/battle.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');
let n = 0;

const rep = (from, to, label) => {
  const c = s.split(from).length - 1;
  if (c !== 1) { console.error(`✗ ${label}: 匹配 ${c} 处`); return false; }
  s = s.replace(from, to); n++; console.log(`✓ ${label}`); return true;
};

// 1) 玩家普攻：接入换甲物理修正
rep(
`      // 扣除目标生命值 (支持连击总伤与多段衰减)
      this.applyDamage(targetEnemy, attackRes.totalDamage);`,
`      // 扣除目标生命值 (支持连击总伤与多段衰减)
      // 黑水换甲：按目标当前姿态做物理/法术修正（不改写基础属性）
      const armorHit = BattleEngine.applyArmorMitigation(targetEnemy, attackRes.totalDamage, false);
      this.applyDamage(targetEnemy, armorHit.damage);
      if (armorHit.note) this.log(\`　└ \${armorHit.note}\`);`,
'玩家普攻接入换甲');

// 2) 敌方行动后计数：在 handleEnemyTurn 的所有正常返回路径计数有效行动。
//    找 handleEnemyTurn 的普攻结算末尾插入。
rep(
`    const didRevive = this.tryRebirth(targetAlly);`,
`    // 黑水换甲：敌方（鼍洁）完成一次有效行动后计数，用于姿态切换
    this.recordArmorAction(enemy);

    const didRevive = this.tryRebirth(targetAlly);`,
'敌方普攻后计数');

fs.writeFileSync(p, s, 'utf8');
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log(`\n共修改 ${n} 处`);
