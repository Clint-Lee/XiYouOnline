import fs from 'node:fs';
const p = 'js/app2d.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

const from = `  triggerTongtianRescueBattle() {
    if (this.storyPhase !== 'tongtian_ice_battle') return;
    if (this.playerData.storyEvents?.tongtian_boss_won) return;`;
const to = `  triggerTongtianRescueBattle() {
    // 仅救援阶段可开战；已胜后不得重复
    if (this.storyPhase !== 'tongtian_rescue') return;
    if (this.playerData.storyEvents?.tongtian_boss_won) return;`;
const c = s.split(from).length - 1;
if (c !== 1) { console.error(`匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);

// 领奖的守卫也要改成新阶段名
const from2 = `  claimTongtianReward() {
    if (this.playerData.storyRewards?.tongtian_ch15_clear === true) {
      if (this.storyPhase === 'tongtian_reward_pending') {`;
const to2 = `  claimTongtianReward() {
    if (this.playerData.storyRewards?.tongtian_ch15_clear === true) {
      if (this.storyPhase === 'tongtian_reward') {`;
const c2 = s.split(from2).length - 1;
if (c2 === 1) { s = s.replace(from2, to2); console.log('✓ 领奖守卫'); }
else console.error(`✗ 领奖守卫 ${c2}`);

const from3 = `    if (this.storyPhase !== 'tongtian_reward_pending') return false;

    const result = this.playerData.claimStoryReward('tongtian_ch15_clear', {`;
const to3 = `    if (this.storyPhase !== 'tongtian_reward') return false;

    const result = this.playerData.claimStoryReward('tongtian_ch15_clear', {`;
const c3 = s.split(from3).length - 1;
if (c3 === 1) { s = s.replace(from3, to3); console.log('✓ 领奖阶段守卫'); }
else console.error(`✗ 领奖阶段守卫 ${c3}`);

// 胜利回调的阶段也要改
const from4 = `      this.storyPhase = 'tongtian_reward_pending';
      const reward = this.playerData.claimStoryReward('tongtian_boss',`;
const to4 = `      this.storyPhase = 'tongtian_await_guanyin';
      const reward = this.playerData.claimStoryReward('tongtian_boss',`;
const c4 = s.split(from4).length - 1;
if (c4 === 1) { s = s.replace(from4, to4); console.log('✓ 胜利回调阶段'); }
else console.error(`✗ 胜利回调 ${c4}`);

if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 通天河阶段守卫已统一');
