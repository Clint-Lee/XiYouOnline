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
  '## 2026-10-22（六）第十六回 火焰山 与 四章起点接入（最新接手入口）',
  '',
  '基线 **2266/2266**。',
  '',
  '### 已落地',
  '',
  '1. **第十六回 火焰山全章闭环**：地图 ' + BT + 'huoyanshan' + BT + ' 从 **7.1% 隧道重建为 42.7% 洞窟**（历史缺陷第二次出现——火云洞、火焰山都是单线隧道）；8 阶段链 ' + BT + 'huoyan_arrived → borrow_fan → test_fan → seek_true_fan → confront_bull → renew_request → quench_fire → huoyan_cleared' + BT + '；9 个对白节点；6 个 NPC；章节奖励 ' + BT + 'eq_nk_huoyan' + BT + '（断火芭蕉佩）幂等 + 满包重试。',
  '2. **采纳 Astra 两个关键判断**：',
  '   - **不新增第三类 Boss 机制**。理由：再写寒冰蓄力是五行车阵换皮，再写冰甲切换是黑水换甲换皮。牛魔王战用普通单 Boss + 技能分工。',
  '   - **核心张力是"悟空从取巧转向担责"**。这是本章真正的分量所在。',
  '3. **叙事红线（全部有断言保护）**：',
  '   - 铁扇公主必须表达**真实的失子之痛**（"我失去了什么，你赔得起吗"），断言禁止出现"得了正果还不知足"式驳斥。',
  '   - 悟空必须当众承认**火源在自己脚下**（八卦炉火砖）+ **变化骗扇是失信**，断言检查认责台词存在。',
  '   - 铁扇公主明确"**不是原谅你**……可山下的人没水喝，与他们无关"——**同意救灾 ≠ 原谅**，不得写成恩怨清零。',
  '   - 假扇事件：UI 只写"待验证的芭蕉扇"，不宣布"真扇到手"；固定线索题（真扇火势当减，假扇越扇越大），错答返回观察步骤，不扣资源、不降阶段。',
  '4. **熄火事实持久化**：新增 ' + BT + 'playerData.storyEvents.huoyan_fire_extinguished' + BT + '，灭火与归扇先持久化再谈领奖；满包不回滚灭火事实。',
  '5. **修掉一个长期存在的断链**：' + BT + 'ensureHeishuiChapterStarted' + BT + ' 等四个章节起点方法**从未接入 ' + BT + '_applyMapData' + BT + '**（此前三次脚本都报锚点匹配失败，被忽略）。本次用行号定位成功接入。这意味着**黑水河、车迟国、通天河、火焰山四章的"首次进入"初始化此前实际未生效**，全靠阶段推进的其他路径碰巧工作。',
  '',
  '### 教训',
  '',
  '1. **锚点匹配失败不能忽略**。前两轮有三个脚本报"锚点 0 处 / 2 处"后我直接跳过，导致章节起点一直没接上。**任何脚本报锚点异常都必须当场查明原因并修掉**，不能当作"已存在"处理。',
  '2. **' + BT + 'ash_ground' + BT + '（熄火焦土）的通行性要与表现分离**：它是"火烧过之后的地面"，应该可走；只有 ' + BT + 'lava' + BT + ' / ' + BT + 'fire_wall' + BT + ' 才是真正阻挡。第一版误把它算作阻挡，导致两个 NPC 不可达。',
  '',
  '---',
  '',
  ''
].join('\n');

prepend('GAME_DOCUMENTATION.md',
  '## 2026-10-22（五）第十五回 通天河 与 阶段命名统一（最新接手入口）',
  docText,
  '（六）第十六回 火焰山');
