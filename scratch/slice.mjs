// 把指定文件的行区间抽取到 out 文件，避免代码经过主上下文。
// 用法: node scratch/slice.mjs <srcFile> <startLine> <endLine> <outFile> [--marker 文本]
import fs from 'node:fs';

const [, , src, startArg, endArg, out, ...rest] = process.argv;
const start = Number(startArg);
const end = Number(endArg);
const lines = fs.readFileSync(src, 'utf8').split(/\r?\n/);
const slice = lines.slice(start - 1, end).join('\n');

let marker = '';
const mi = rest.indexOf('--marker');
if (mi !== -1) marker = rest[mi + 1] || '';

if (out && out !== '-') {
  fs.appendFileSync(out, (marker ? `\n${marker}\n` : '\n') + slice + '\n', 'utf8');
  console.log(`appended ${src}:${start}-${end} (${slice.length} chars) -> ${out}`);
} else {
  console.log(slice);
}
