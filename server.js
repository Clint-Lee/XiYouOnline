/**
 * 汉风西游 - 本地极速开发与游戏服务器 (Zero-Dependency Node Server)
 * 在纯静态服务之上叠加：Badge 统一登录 SSO、会话与按用户云存档。
 * 依旧零 npm 依赖；换票使用 Node 20 内置 fetch。
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');

// 自动加载 .env 配置文件（Node 20+ 内置支持）
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
  try { process.loadEnvFile(envPath); } catch {}
}

const PORT = Number(process.env.PORT) || 5173;
const HOST = process.env.HOST || '127.0.0.1';
const ROOT_DIR = __dirname;

const BADGE_URL = (process.env.BADGE_URL || 'http://localhost:8080').replace(/\/$/, '');
// 浏览器侧登录页在 Badge 门户（前端）上，API 只提供服务（生产为两个域名）。
const BADGE_PORTAL_URL = (process.env.BADGE_PORTAL_URL || 'http://localhost:5173').replace(/\/$/, '');
const CLIENT_ID = process.env.BADGE_CLIENT_ID || 'app_xiyou_game';
const CLIENT_SECRET = process.env.BADGE_CLIENT_SECRET || 'sec_xiyou_game_secret_2026';
const PUBLIC_URL = (process.env.XIYOU_PUBLIC_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const SESSION_COOKIE = 'xiyou_session';
const STATE_COOKIE = 'xiyou_badge_state';
const SESSION_TTL = 30 * 86400000;
const SAVE_DIR = path.resolve(process.env.XIYOU_SAVE_DIR || path.join(ROOT_DIR, 'saves'));
const COOKIE_SECURITY = PUBLIC_URL.startsWith('https://') ? '; Secure' : '';
const PUBLIC_ASSET_DIRECTORIES = new Set(['assets', 'css', 'js', 'rules']);
const SAVE_MAX_BYTES = 256 * 1024;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg'
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

// ── 会话：HMAC 签名 Cookie，绝不存明文凭据 ─────────────────────────
let sessionSecret = process.env.XIYOU_SESSION_SECRET || '';
if (!sessionSecret) {
  const secretFile = path.join(SAVE_DIR, '.session-secret');
  try { sessionSecret = fs.readFileSync(secretFile, 'utf8').trim(); } catch {}
  if (!sessionSecret || sessionSecret.length < 32) {
    sessionSecret = crypto.randomBytes(32).toString('hex');
    fs.mkdirSync(SAVE_DIR, { recursive: true });
    fs.writeFileSync(secretFile, sessionSecret, { mode: 0o600 });
  }
}

function sign(value) { return crypto.createHmac('sha256', sessionSecret).update(value).digest('base64url'); }
function issueSession(player) {
  const payload = Buffer.from(JSON.stringify({ u: player.key, n: player.username, exp: Date.now() + SESSION_TTL })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}
function readSession(req) {
  const raw = readCookie(req, SESSION_COOKIE);
  if (!raw) return null;
  const dot = raw.lastIndexOf('.');
  if (dot <= 0) return null;
  const payload = raw.slice(0, dot), sig = raw.slice(dot + 1);
  const expected = sign(payload);
  const a = Buffer.from(sig), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.u || !data.exp || data.exp <= Date.now()) return null;
    return data;
  } catch { return null; }
}
function readCookie(req, name) {
  return String(req.headers.cookie || '').split(';').map(v => v.trim())
    .find(v => v.startsWith(name + '='))?.slice(name.length + 1) || '';
}

// ── 玩家与云存档 ────────────────────────────────────────────────────
function playerKey(badgeUsername, badgeUserId) {
  const safe = String(badgeUsername || 'player').toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, 40);
  return `${badgeUserId || 0}_${safe}`;
}
function playerDir(key) {
  const dir = path.join(SAVE_DIR, key);
  // key 已被清洗为 [a-z0-9_-]，这里再确认不越界
  if (!path.resolve(dir).startsWith(path.resolve(SAVE_DIR) + path.sep)) throw new Error('invalid player key');
  return dir;
}
function readPlayer(key) {
  try { return JSON.parse(fs.readFileSync(path.join(playerDir(key), 'player.json'), 'utf8')); } catch { return null; }
}
function writePlayer(key, player) {
  const dir = playerDir(key);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'player.json'), JSON.stringify(player, null, 2));
}

function sendJSON(res, status, body, extraHeaders = {}) {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(text),
    ...extraHeaders,
  });
  res.end(text);
}

function readBody(req, limit = SAVE_MAX_BYTES + 4096) {
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > limit) { reject(new Error('body too large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

// Badge 换票（Node 20 内置 fetch，零依赖）
async function exchangeTicket(ticket) {
  const response = await fetch(BADGE_URL + '/api/sso/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticket, clientId: CLIENT_ID, clientSecret: CLIENT_SECRET }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body || body.code !== 200 || !body.data || !body.data.user) {
    throw new Error((body && body.message) || `换票失败（${response.status}）`);
  }
  return body.data;
}

function sameOriginOk(req) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return true;
  const origin = req.headers.origin;
  if (!origin) return true; // 同源 GET 表单/非浏览器客户端
  try { return new URL(origin).origin === new URL(PUBLIC_URL).origin; } catch { return false; }
}

function startServer(port) {
  const server = http.createServer(async (req, res) => {
    // 允许跨域读取静态资源；写接口由 sameOriginOk 保护
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const route = req.url.split('?')[0];

    try {
      // ── Badge 统一登录 ──
      if (route === '/auth/badge') {
        const state = crypto.randomBytes(16).toString('hex');
        const redirectUri = encodeURIComponent(PUBLIC_URL + '/auth/badge/callback');
        res.setHeader('Set-Cookie', `${STATE_COOKIE}=${state}; HttpOnly; SameSite=Lax${COOKIE_SECURITY}; Path=/; Max-Age=600`);
        res.writeHead(302, { Location: `${BADGE_PORTAL_URL}/login?client_id=${encodeURIComponent(CLIENT_ID)}&redirect_uri=${redirectUri}&state=${state}` });
        res.end();
        return;
      }

      if (route === '/auth/badge/callback') {
        const query = new URL(req.url, 'http://x').searchParams;
        const state = query.get('state') || '';
        const expected = readCookie(req, STATE_COOKIE);
        const ticket = query.get('ticket') || '';
        const clearState = `${STATE_COOKIE}=; HttpOnly; SameSite=Lax${COOKIE_SECURITY}; Path=/; Max-Age=0`;
        if (!expected || expected.length !== state.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(state))) {
          res.setHeader('Set-Cookie', clearState);
          res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('登录状态校验失败，请返回重新发起登录');
          return;
        }
        if (!ticket || ticket.length > 256) {
          res.setHeader('Set-Cookie', clearState);
          res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('缺少有效登录票据');
          return;
        }
        const badgeUser = await exchangeTicket(ticket);
        const key = playerKey(badgeUser.user.username, badgeUser.user.userId);
        let player = readPlayer(key);
        if (!player) {
          player = { key, badgeUserId: badgeUser.user.userId, username: badgeUser.user.username,
            nickname: badgeUser.user.appNickname || badgeUser.user.username, email: badgeUser.user.email || '',
            createdAt: new Date().toISOString() };
          writePlayer(key, player);
        }
        res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${issueSession(player)}; HttpOnly; SameSite=Lax${COOKIE_SECURITY}; Path=/; Max-Age=${SESSION_TTL / 1000}`);
        res.writeHead(302, { Location: '/' });
        res.end();
        console.log(`[Badge SSO] 玩家登录: ${player.username} (${key})`);
        return;
      }

      if (route === '/auth/logout') {
        res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax${COOKIE_SECURITY}; Path=/; Max-Age=0`);
        res.writeHead(302, { Location: '/' });
        res.end();
        return;
      }

      // ── 身份与云存档 API ──
      if (route === '/api/me') {
        const session = readSession(req);
        if (!session) { sendJSON(res, 200, { guest: true }); return; }
        const player = readPlayer(session.u);
        sendJSON(res, 200, { guest: false, user: player ? { username: player.username, nickname: player.nickname, createdAt: player.createdAt } : { username: session.n } });
        return;
      }

      if (route === '/api/save' && req.method === 'GET') {
        const session = readSession(req);
        if (!session) { sendJSON(res, 401, { success: false, message: '请先使用 Badge 登录' }); return; }
        try {
          const raw = fs.readFileSync(path.join(playerDir(session.u), 'auto_progress.json'), 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
          res.end(raw);
        } catch {
          sendJSON(res, 200, { success: true, empty: true, message: '云端暂无存档' });
        }
        return;
      }

      if (route === '/api/save' && req.method === 'POST') {
        if (!sameOriginOk(req)) { sendJSON(res, 403, { success: false, message: '拒绝跨站写入' }); return; }
        const session = readSession(req);
        if (!session) { sendJSON(res, 401, { success: false, message: '请先使用 Badge 登录' }); return; }
        const body = await readBody(req);
        if (!body || body.length > SAVE_MAX_BYTES) { sendJSON(res, 413, { success: false, message: '存档超出 256KB 上限' }); return; }
        let parsed;
        try { parsed = JSON.parse(body); } catch { sendJSON(res, 400, { success: false, message: '存档不是有效 JSON' }); return; }
        if (!parsed || typeof parsed !== 'object' || !parsed.data || !parsed.data.playerData) {
          sendJSON(res, 400, { success: false, message: '存档缺少核心数据（data.playerData）' }); return;
        }
        const dir = playerDir(session.u);
        fs.mkdirSync(dir, { recursive: true });
        const target = path.join(dir, 'auto_progress.json');
        const temp = target + '.' + crypto.randomUUID() + '.tmp';
        fs.writeFileSync(temp, JSON.stringify(parsed), { mode: 0o600 });
        fs.renameSync(temp, target);
        sendJSON(res, 200, { success: true, syncedAt: Date.now() });
        return;
      }

      if (route === '/favicon.ico') {
        res.writeHead(204); res.end();
        return;
      }

      // ── 静态资源 ──
      let reqPath = decodeURIComponent(route);
      if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
      reqPath = path.posix.normalize(reqPath);
      const segments = reqPath.split('/').filter(Boolean);
      const publicPath = reqPath === '/index.html' || PUBLIC_ASSET_DIRECTORIES.has(segments[0]);
      if (!publicPath || reqPath.includes('\\') || reqPath.includes('\0') || segments.some(segment => segment.startsWith('.'))) {
        res.writeHead(404); res.end(); return;
      }
      if (!['GET', 'HEAD'].includes(req.method)) {
        res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return;
      }


      // ── 统一登录守卫：游戏必须登录后才能进入 ──
      if (reqPath === '/index.html') {
        const session = readSession(req);
        if (!session) {
          res.writeHead(302, { Location: '/auth/badge' });
          res.end();
          return;
        }
      }

      const filePath = path.join(ROOT_DIR, reqPath);
      if (!filePath.startsWith(ROOT_DIR + path.sep)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('403 访问被拒绝');
        return;
      }

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`404 资源未找到: ${reqPath}`);
          return;
        }
        // Reject symlinks that escape the public repository boundary.
        const realPath = fs.realpathSync(filePath);
        if (!realPath.startsWith(ROOT_DIR + path.sep)) { res.writeHead(404); res.end(); return; }
        res.writeHead(200, {
          'Content-Type': getContentType(filePath),
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
        fs.createReadStream(filePath).pipe(res);
      });
    } catch (error) {
      console.error('[Server] 请求处理异常:', error.message);
      if (!res.headersSent) sendJSON(res, 500, { success: false, message: '服务内部错误' });
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && process.env.NODE_ENV === 'production') {
      console.error('Configured production port is occupied'); process.exitCode = 1; return;
    }
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ 端口 ${port} 已被占用，正在自动切换至 ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('服务器启动异常:', err);
    }
  });

  server.listen(port, HOST, () => {
    const url = `http://localhost:${port}`;
    console.log('\n======================================================');
    console.log('       🎋 汉风西游OL · 正统2D神话复刻版');
    console.log('======================================================');
    console.log(`  🌟 游戏本地服务已极速就绪！`);
    console.log(`  🔗 本地访问地址: \x1b[36m${url}\x1b[0m`);
    console.log(`  🛡️  统一登录: ${BADGE_URL} (${CLIENT_ID})`);
    console.log(`  ☁️  云存档: 已登录玩家自动同步至 saves/ 目录`);
    console.log(`  🎮 控制方式:`);
    console.log(`     • 走动移动: [W/A/S/D] 或 [↑/↓/←/→] 或 屏幕虚拟摇杆`);
    console.log(`     • 对话互动: [空格键 Space] 或 [按键 5]`);
    console.log(`     • 坐骑骑乘: [按键 7] 上下马 / [按键 3] 驯养`);
    console.log(`     • 蟠桃采摘: [按键 1] 蟠桃胜境每日吃桃升级`);
    console.log('======================================================\n');

    if (process.env.XIYOU_OPEN_BROWSER === '1') {
      const openCmd = process.platform === 'win32' ? `start ${url}` : (process.platform === 'darwin' ? 'open ' + url : 'xdg-open ' + url);
      try {
        exec(openCmd, (error) => {
          if (error) console.log(`💡 请在浏览器中手动打开地址: ${url}`);
        });
      } catch (error) {
        console.log(`💡 当前环境不允许自动打开浏览器，请访问: ${url}`);
      }
    }
  });
}

startServer(PORT);
