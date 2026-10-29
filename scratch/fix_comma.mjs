import fs from 'node:fs';
const p = 'js/data/storyQuests.js';
let s = fs.readFileSync(p, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');

const from = `        text: '陈关保，一秤金。一个七岁，一个九岁。他爹娘不是肯撒手，是河一封，全村明年就没了活路……老朽这把年纪，只盼有人能替全村把这约破掉。'
        options: [`;
const to = `        text: '陈关保，一秤金。一个七岁，一个九岁。他爹娘不是肯撒手，是河一封，全村明年就没了活路……老朽这把年纪，只盼有人能替全村把这约破掉。',
        options: [`;
const c = s.split(from).length - 1;
if (c !== 1) { console.error(`匹配 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已补逗号');
