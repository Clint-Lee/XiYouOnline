import fs from 'node:fs';
const p = 'test_heishui_chapter.js';
let s = fs.readFileSync(p, 'utf8');

if (s.includes('车迟国章节断言')) { console.log('已存在'); process.exit(0); }

const from = `  console.log('  ✅ 黑水河章节断言全部通过');`;
const to = `  // ── 16. 全项目章节地图与传送门连通性 ──
  // 历史缺陷：git checkout 回滚曾一次性冲掉整张 heishuihe 地图与全部剧情数据，
  // 这条断言确保四个主线章节地图都存在、尺寸合规、连通且双向可达。
  {
    const chapters = ['huoyundong', 'heishuihe', 'chediguo'];
    for (const mid of chapters) {
      const m = window.GAME_DATA.MAPS_2D[mid];
      assert(!!m, \`主线章节地图 \${mid} 必须存在\`);
      assert(m.width === 38 && m.height === 28,
        \`\${mid} 应为 38x28，实际 \${m.width}x\${m.height}\`);
      assert(Array.isArray(m.npcs) && m.npcs.length > 0, \`\${mid} 必须有 NPC\`);
    }
    // 黑水河必须能回火云洞，火云洞必须能去黑水河
    const hy = window.GAME_DATA.MAPS_2D.huoyundong;
    const hs = window.GAME_DATA.MAPS_2D.heishuihe;
    assert((hy.portals || []).some(p => p.targetMap === 'heishuihe'),
      '火云洞必须有通往黑水河的出口');
    assert((hs.portals || []).some(p => p.targetMap === 'huoyundong'),
      '黑水河必须有返回火云洞的入口');
  }

  console.log('  ✅ 黑水河章节断言全部通过');`;

const c = s.split(from).length - 1;
if (c !== 1) { console.error(`锚点 ${c} 处`); process.exit(1); }
s = s.replace(from, to);
fs.writeFileSync(p, s, 'utf8');
console.log('✓ 已追加章节地图连通性断言');
