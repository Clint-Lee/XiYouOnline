/**
 * 汉风西游 - Badge 云存档桥 (CloudSave)
 * 登录后自动双向同步历练进度：启动时拉取云端较新存档，本地自动存档后静默推送云端。
 * 不改动游戏本体逻辑：运行时包装 SaveManager，失败一律静默降级为纯本地模式。
 */
(function () {
  'use strict';

  const KEY = 'hanfeng_xy_save_auto_progress';
  let me = null;          // 当前登录玩家（未登录为 null）
  let lastSyncAt = null;  // 最近一次成功推送时间
  let pushTimer = null;

  function localPayload() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function writeLocal(payload) {
    try { localStorage.setItem(KEY, JSON.stringify(payload)); return true; } catch { return false; }
  }

  // 启动时：云端较新则覆盖本地（刷新后由游戏读档生效）
  async function pull() {
    try {
      const res = await fetch('/api/save', { credentials: 'same-origin' });
      const data = await res.json();
      if (!data || data.empty || !data.data) return;
      const local = localPayload();
      if (!local || (data.timestamp || 0) > (local.timestamp || 0)) {
        writeLocal(data);
        console.log('[CloudSave] 已从云端恢复较新的历练进度（' + new Date(data.timestamp).toLocaleString() + '），刷新或重新进入后生效。');
      }
    } catch { /* 网络不可用时保持纯本地 */ }
  }

  // 本地存档成功后 3 秒推送云端（防抖）
  function schedulePush() {
    if (!me) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(async () => {
      const payload = localPayload();
      if (!payload) return;
      try {
        const res = await fetch('/api/save', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) { lastSyncAt = Date.now(); render(); }
      } catch { /* 静默：本地已保存，云端下次再同步 */ }
    }, 3000);
  }

  // 包装自动存档入口：本地成功后才推送
  if (window.SaveManager && typeof window.SaveManager.saveGameFullState === 'function') {
    const original = window.SaveManager.saveGameFullState;
    window.SaveManager.saveGameFullState = function (stateData) {
      const result = original.call(this, stateData);
      if (result && result.success) schedulePush();
      return result;
    };
  }

  // ── 角标 UI（不干扰游戏画面） ──
  let chip = null;
  function mountChip() {
    chip = document.createElement('div');
    chip.id = 'cloud-save-chip';
    chip.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:99999;display:flex;align-items:center;gap:6px;'
      + 'padding:6px 11px;border-radius:999px;font:12.5px/1.4 -apple-system,"PingFang SC","Microsoft YaHei",sans-serif;'
      + 'background:rgba(13,71,57,0.88);color:#d9efe6;cursor:pointer;user-select:none;'
      + 'box-shadow:0 4px 14px rgba(0,0,0,0.25);backdrop-filter:blur(4px);';
    chip.addEventListener('click', onChipClick);
    document.body.appendChild(chip);
    render();
  }

  function render() {
    if (!chip) return;
    if (me) {
      const synced = lastSyncAt ? ' · ' + new Date(lastSyncAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '';
      chip.innerHTML = '<span>☁</span><span>已同步：' + escapeText(me.nickname || me.username) + synced + '</span>';
      chip.title = '云存档已开启，进度自动同步到你的 Badge 账号。点击退出登录。';
    } else {
      chip.innerHTML = '<span>☁</span><span>使用 Badge 登录 · 进度云同步</span>';
      chip.title = '登录后历练进度自动云端保存，换设备不丢档。';
    }
  }

  function escapeText(text) {
    return String(text || '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  function onChipClick() {
    if (me) {
      if (confirm('退出 Badge 登录？本地与云端存档都会保留。')) {
        window.location.href = '/auth/logout';
      }
    } else {
      window.location.href = '/auth/badge';
    }
  }

  async function init() {
    try {
      const res = await fetch('/api/me', { credentials: 'same-origin' });
      const data = await res.json();
      me = data && !data.guest ? data.user : null;
    } catch { me = null; }
    mountChip();
    if (me) await pull();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
