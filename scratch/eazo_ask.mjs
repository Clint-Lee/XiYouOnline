// Eazo relay helper：思路/Astra，代码/Opus。
// 用 node:http 直连，彻底绕开 undici 默认 5 分钟的 headers/body 超时（大 prompt 会被误杀）。
// 用法：
//   node scratch/eazo_ask.mjs ping
//   node scratch/eazo_ask.mjs astra --file scratch/p_astra.md --out scratch/r_astra.md [--retry 2]
//   node scratch/eazo_ask.mjs opus  --file scratch/p_opus.md  --out scratch/r_opus.md
import fs from 'node:fs';
import http from 'node:http';

const HOST = process.env.EAZO_HOST || '127.0.0.1';
const PORT = Number(process.env.EAZO_PORT || 8787);
const KEY = process.env.EAZO_KEY || 'sk-local';

const MODEL = {
  astra: 'bedrock_gpt_6_astra',
  opus: 'bedrock_claude_opus_48',
};

const SYS_ASTRA = `你是资深游戏系统设计与代码审查专家（GPT 6 Astra）。
职责：只做分析、方案、排序、审查、风险判断，不写大段源码。
输出必须是简体中文，结构清晰、可执行、结论先行。不要客套，不要免责声明。`;

const SYS_OPUS = `你是资深原生 JS / Canvas 游戏工程师（Claude Opus 4.8）。
职责：按给定上下文输出可直接落地的精确代码修改。
硬性要求：
1. 只输出代码补丁，不要解释、不要客套、不要 markdown 围栏之外的空话。
2. 每个补丁必须形如：
### FILE: 相对路径
<<<<<<< OLD
<原样精确的旧代码>
=======
<替换后的新代码>
>>>>>>> NEW
3. OLD 片段必须逐字符忠实于给定原文（含缩进），不得省略、不得加省略号。
4. 保持项目现有代码风格：原生 JS、中文注释、零新增依赖。
5. 不要改动与任务无关的代码。`;

function request(path, bodyObj, timeoutMs) {
  return new Promise((resolve, reject) => {
    const payload = bodyObj ? Buffer.from(JSON.stringify(bodyObj), 'utf8') : null;
    const req = http.request({
      host: HOST,
      port: PORT,
      path,
      method: bodyObj ? 'POST' : 'GET',
      headers: Object.assign(
        { Authorization: `Bearer ${KEY}` },
        payload ? { 'Content-Type': 'application/json', 'Content-Length': payload.length } : {}
      ),
    }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${text.slice(0, 800)}`));
          return;
        }
        try { resolve(JSON.parse(text)); }
        catch (e) { reject(new Error(`JSON 解析失败: ${text.slice(0, 400)}`)); }
      });
    });
    req.setTimeout(timeoutMs, () => req.destroy(new Error(`请求超时 ${timeoutMs}ms`)));
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function chat(model, system, user, timeoutMs) {
  const started = Date.now();
  const data = await request('/v1/chat/completions', {
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    stream: false,
    temperature: 0.35,
  }, timeoutMs);
  return {
    text: String(data.choices?.[0]?.message?.content ?? ''),
    meta: { model, seconds: Math.round((Date.now() - started) / 1000), usage: data.usage || null },
  };
}

function readArgs() {
  const argv = process.argv.slice(2);
  let cmd = argv[0] || '';
  let file = null;
  let out = null;
  let retry = 2;
  let timeoutMs = 1800000;
  const inline = [];
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--file') file = argv[++i];
    else if (a === '--out') out = argv[++i];
    else if (a === '--retry') retry = Number(argv[++i]) || 0;
    else if (a === '--timeout') timeoutMs = Number(argv[++i]) || timeoutMs;
    else if (!a.startsWith('--')) inline.push(a);
  }
  return { cmd, file, out, retry, timeoutMs, inline: inline.join(' ') };
}

const { cmd, file, out, retry, timeoutMs, inline } = readArgs();

if (cmd === 'ping') {
  const j = await request('/v1/models', null, 30000);
  console.log('relay OK, models =', j?.data?.length);
} else if (cmd === 'astra' || cmd === 'opus' || cmd === 'ask' || cmd === 'code') {
  const target = (cmd === 'opus' || cmd === 'code') ? 'opus' : 'astra';
  const prompt = file ? fs.readFileSync(file, 'utf8') : inline;
  if (!prompt || !prompt.trim()) {
    console.error('空 prompt');
    process.exit(2);
  }
  let lastErr = null;
  for (let attempt = 1; attempt <= retry + 1; attempt++) {
    try {
      console.log(`[${target}] 第 ${attempt} 次尝试，prompt ${prompt.length} 字符…`);
      const res = await chat(MODEL[target], target === 'astra' ? SYS_ASTRA : SYS_OPUS, prompt, timeoutMs);
      if (!res.text || !res.text.trim()) throw new Error('上游返回空内容');
      if (out) {
        fs.writeFileSync(out, res.text, 'utf8');
        console.log(`OK -> ${out} (${res.text.length} 字符, ${res.meta.seconds}s, ${JSON.stringify(res.meta.usage)})`);
      } else {
        console.log(res.text);
        console.log(`\n---- ${res.meta.model} ${res.meta.seconds}s ${JSON.stringify(res.meta.usage)} ----`);
      }
      process.exit(0);
    } catch (e) {
      lastErr = e;
      console.error(`第 ${attempt} 次失败: ${e.message}`);
      if (attempt <= retry) {
        const wait = 5000 * attempt;
        console.error(`等待 ${wait}ms 后重试…`);
        await new Promise(r => setTimeout(r, wait));
      }
    }
  }
  console.error('全部重试失败:', lastErr?.message);
  process.exit(1);
} else {
  console.log('用法: node scratch/eazo_ask.mjs ping | astra|opus --file F [--out F] [--retry N]');
}
