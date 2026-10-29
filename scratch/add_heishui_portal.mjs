import fs from 'node:fs';
const p = 'js/data/maps2d.js';
let s = fs.readFileSync(p, 'utf8');

if (s.includes('"targetMap": "heishuihe"')) {
  console.log('已存在通往黑水河的出口，跳过');
  process.exit(0);
}

// 在 huoyundong 的 portals 数组开头插入新出口
const k = s.indexOf('"huoyundong": {');
const k2 = s.indexOf('"heishuihe": {');
if (k < 0 || k2 < 0) { console.error('地图定位失败'); process.exit(1); }

const seg = s.slice(k, k2);
const anchor = '"portals": [\r\n      {\r\n        "x": 1152,\r\n        "y": 448,';
const idx = seg.indexOf(anchor);
if (idx < 0) { console.error('portals 锚点未找到'); process.exit(1); }

const replacement = `"portals": [\r
      {\r
        "x": 1152,\r
        "y": 480,\r
        "targetMap": "heishuihe",\r
        "targetX": 160,\r
        "targetY": 224,\r
        "name": "黑水河",\r
        "minLevel": 1\r
      },\r
      {\r
        "x": 1152,\r
        "y": 448,`;

const newSeg = seg.replace(anchor, replacement);
s = s.slice(0, k) + newSeg + s.slice(k2);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ huoyundong 新增西行出口 → heishuihe');
