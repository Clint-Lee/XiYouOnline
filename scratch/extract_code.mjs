// 从 Opus 输出提取 ```js ... ``` 代码块，写入目标文件。
import fs from 'node:fs';

const [, , srcFile, outFile] = process.argv;
const text = fs.readFileSync(srcFile, 'utf8');
const fence = '```';
const start = text.indexOf(fence);
if (start < 0) { console.error('未找到代码围栏'); process.exit(2); }
const afterFence = text.indexOf('\n', start);
const end = text.indexOf(fence, afterFence);
if (end < 0) { console.error('代码围栏未闭合'); process.exit(2); }
let code = text.slice(afterFence + 1, end);
code = code.replace(/\s+$/, '') + '\n';
fs.writeFileSync(outFile, code, 'utf8');
console.log(`✓ 已写入 ${outFile} (${code.length} 字符)`);
