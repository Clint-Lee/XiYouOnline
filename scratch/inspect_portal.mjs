import fs from 'node:fs';
const s = fs.readFileSync('js/data/maps2d.js', 'utf8');
const k = s.indexOf('"huoyundong": {');
const k2 = s.indexOf('"heishuihe": {');
const seg = s.slice(k, k2);
const i = seg.indexOf('"portals"');
console.log('--- huoyundong portals 片段 ---');
console.log(JSON.stringify(seg.slice(i - 30, i + 300)));
