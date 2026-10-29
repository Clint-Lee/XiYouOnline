import fs from 'node:fs';
const BT = String.fromCharCode(96);

function prepend(file, anchor, text, marker) {
  let s = fs.readFileSync(file, 'utf8');
  const crlf = s.includes('\r\n');
  if (crlf) s = s.replace(/\r\n/g, '\n');
  if (s.includes(marker)) { console.log(`（${file} 已更新）`); return; }
  const c = s.split(anchor).length - 1;
  if (c !== 1) { console.error(`✗ ${file}: 锚点 ${c} 处`); return; }
  s = s.replace(anchor, text + anchor);
  if (crlf) s = s.replace(/\n/g, '\r\n');
  fs.writeFileSync(file, s, 'utf8');
  console.log(`✓ ${file}`);
}

const docText = [
  '## 2026-10-22（四）第十四回车迟国 与 换甲接入（最新接手入口）',
  '',
  '基线 **2078/2078**。',
  '',
  '### 已落地',
  '',
  '1. **第十四回 车迟国全章闭环**：地图 ' + BT + 'chediguo' + BT + '（38×28，100% 可行走，无需重建）；7 阶段链 ' + BT + 'chedi_arrival → chedi_audience → chedi_rain → chedi_discern → chedi_final_trial → chedi_reward_pending → chedi_cleared' + BT + '；8 个对白节点；5 个 NPC（受役僧人/虎力/鹿力/羊力/国王）；终局战为三仙同场（虎力偏物攻、鹿力偏控制、羊力偏法攻）；章节奖励 ' + BT + 'chedi_ch14_clear' + BT + ' 幂等 + 满包重试；新增奖励物品 ' + BT + 'eq_nk_chedi' + BT + '（【土】车迟伏仙佩）。',
  '2. **前两轮斗法不做新系统**：按 Astra 方案用「有线索的对白选项」表达。祈雨轮必须按「风→云→雷→雨」顺序，线索由悟空明示「风不至则云不聚」；辨物轮先稳心神、再听物件线索（"坚且凉，非木非石"）。错答返回观察步骤，**不扣资源、不降阶段、不随机换题**。',
  '3. **鼍洁黑水换甲接入真实结算链**：' + BT + 'applyArmorMitigation' + BT + ' 已接入玩家普攻与敌方行动计数，并新增「真实回合中换甲生效」断言（凝鳞下 326→216）。',
  '4. **三处禁笑区写入约定**：僧人诉苦（饥饿/伤病/羞辱不得做包袱）、三仙败亡（不做血腥喜剧）、国王纠错（不得用一句"误会"抹掉二十年迫害）。',
  '5. **章节地图连通性断言**：四个主线章节地图必须存在、38×28、有 NPC、且火云洞↔黑水河双向可达。',
  '',
  '### ⚠️ 本轮事故记录（重要，后续必须避免）',
  '',
  '**' + BT + 'git checkout js/data/storyQuests.js' + BT + ' 一次性冲掉了火云洞、黑水河、车迟国全部剧情数据**（约 950 行），随后 ' + BT + 'git checkout js/data/maps2d.js' + BT + ' 又冲掉了整张 heishuihe 地图。',
  '',
  '原因：这些内容从未提交，checkout 会把未提交改动全部丢弃。已从 ' + BT + 'scratch/*_keys.txt' + BT + ' 缓存 + 原重建脚本完整恢复。',
  '',
  '**新约定：项目处于"多章节并行开发、大量未提交内容"状态时，禁止用 ' + BT + 'git checkout <file>' + BT + ' 修复单个文件。回滚必须用备份文件（' + BT + 'Copy-Item x x.bak' + BT + '）或精确的字符串替换回退。**',
  '',
  '---',
  '',
  ''
].join('\n');

prepend('GAME_DOCUMENTATION.md',
  '## 2026-10-22（三）鼍洁「黑水换甲」机制与奖励物品审计',
  docText,
  '（四）第十四回车迟国');
