/**
 * 汉风西游 - Badge 云存档桥与东方神话门户首页控制器 (CloudSave & Landing Portal)
 * 1. 初次访问展示《汉风西游》高定国风神话首页（以 assets/xiyou-bg.jpg 为底图），绝不强制裸跳登录。
 * 2. 点击「开始使用 · 踏入西游」时：未登录则跳转 /auth/badge 进行 Badge 通行证认证；已登录则直接进入三界。
 * 3. 登录后自动双向同步历练进度：启动时拉取云端较新存档，本地自动存档后静默推送云端。
 */
(function () {
  'use strict';

  const KEY = 'hanfeng_xy_save_auto_progress';
  const ENTERED_KEY = 'xiyou_entered_realm_v1';
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

  async function pull() {
    try {
      const res = await fetch('/api/save', { credentials: 'same-origin' });
      const data = await res.json();
      if (!data || data.empty || !data.data) return;
      const local = localPayload();
      if (!local || (data.timestamp || 0) > (local.timestamp || 0)) {
        writeLocal(data);
        console.log('[CloudSave] 已从云端恢复较新的历练进度（' + new Date(data.timestamp).toLocaleString() + '）');
      }
    } catch { /* 网络不可用时保持纯本地 */ }
  }

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

  if (window.SaveManager && typeof window.SaveManager.saveGameFullState === 'function') {
    const original = window.SaveManager.saveGameFullState;
    window.SaveManager.saveGameFullState = function (stateData) {
      const result = original.call(this, stateData);
      if (result && result.success) schedulePush();
      return result;
    };
  }

  let chip = null;
  function mountChip() {
    chip = document.createElement('div');
    chip.id = 'cloud-save-chip';
    chip.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:9990;display:flex;align-items:center;gap:6px;'
      + 'padding:6px 12px;border-radius:999px;font:12.5px/1.4 -apple-system,"PingFang SC","Microsoft YaHei",sans-serif;'
      + 'background:rgba(13,71,57,0.92);color:#d9efe6;cursor:pointer;user-select:none;border:1px solid rgba(251,191,36,0.35);'
      + 'box-shadow:0 4px 14px rgba(0,0,0,0.45);backdrop-filter:blur(6px);';
    chip.addEventListener('click', onChipClick);
    document.body.appendChild(chip);
    render();
  }

  function render() {
    if (chip) {
      if (me) {
        const synced = lastSyncAt ? ' · ' + new Date(lastSyncAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '';
        chip.innerHTML = '<span>☁</span><span>云仙籍：' + escapeText(me.nickname || me.username) + synced + '</span>';
        chip.title = '云存档已开启，进度自动同步到你的 Badge 账号。点击退出登录。';
      } else {
        chip.innerHTML = '<span>☁</span><span>未登录 · 点击通过 Badge 认证</span>';
        chip.title = '登录后历练进度自动云端保存，换设备不丢档。';
      }
    }
    syncLandingPortalUI();
  }

  function escapeText(text) {
    return String(text || '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  function onChipClick() {
    if (me) {
      if (confirm('退出 Badge 登录？本地与云端存档都会保留。')) {
        try { sessionStorage.removeItem(ENTERED_KEY); } catch {}
        window.location.href = '/auth/logout';
      }
    } else {
      try { sessionStorage.setItem(ENTERED_KEY, '1'); } catch {}
      window.location.href = '/auth/badge';
    }
  }

  function syncLandingPortalUI() {
    const portal = document.getElementById('xiyou-landing-portal');
    if (!portal) return;
    const statusPill = document.getElementById('xiyou-landing-auth-pill');
    const primaryBtnText = document.getElementById('xiyou-landing-cta-text');
    const subHint = document.getElementById('xiyou-landing-cta-sub');

    if (me) {
      const displayName = me.nickname || me.username;
      if (statusPill) {
        statusPill.textContent = '✨ 仙籍已认证 · ' + displayName;
        statusPill.classList.add('is-authed');
      }
      if (primaryBtnText) {
        primaryBtnText.textContent = '开始使用 · 进入三界 (' + displayName + ')';
      }
      if (subHint) {
        subHint.textContent = 'Badge 云端仙籍已就绪 · 跨端实时云存档同步开启';
      }
    } else {
      if (statusPill) {
        statusPill.textContent = '🛡️ Badge 统一身份通行证接入';
        statusPill.classList.remove('is-authed');
      }
      if (primaryBtnText) {
        primaryBtnText.textContent = '开始使用 · 踏入西游';
      }
      if (subHint) {
        subHint.textContent = '点击后将跳转至 Badge 统一认证中心登录，解锁完整三界历练与云存档';
      }
    }
  }

  function openLandingPortal() {
    const portal = document.getElementById('xiyou-landing-portal');
    if (!portal) return;
    portal.classList.remove('is-hidden');
    syncLandingPortalUI();
  }

  function handleStartJourney() {
    try { sessionStorage.setItem(ENTERED_KEY, '1'); } catch {}
    if (!me) {
      window.location.href = '/auth/badge';
      return;
    }
    const portal = document.getElementById('xiyou-landing-portal');
    if (portal) {
      portal.classList.add('is-hidden');
    }
  }

  window.XiYouPortal = {
    openLandingPortal,
    handleStartJourney,
    isAuthenticated: () => Boolean(me),
  };

  async function init() {
    try {
      const res = await fetch('/api/me', { credentials: 'same-origin' });
      const data = await res.json();
      me = data && !data.guest ? data.user : null;
    } catch { me = null; }

    mountChip();
    if (me) await pull();

    const portal = document.getElementById('xiyou-landing-portal');
    if (portal) {
      syncLandingPortalUI();
      let enteredBefore = false;
      try { enteredBefore = sessionStorage.getItem(ENTERED_KEY) === '1'; } catch {}
      const hasAuthedParam = window.location.search.includes('authed=1');
      if (hasAuthedParam) {
        try { sessionStorage.setItem(ENTERED_KEY, '1'); } catch {}
        try {
          const cleanSearch = window.location.search.replace(/[?&]authed=1/, '').replace(/^&/, '?');
          const cleanUrl = window.location.pathname + (cleanSearch && cleanSearch !== '?' ? cleanSearch : '');
          window.history.replaceState({}, '', cleanUrl || '/');
        } catch {}
      }
      // 若已登录且刚从 Badge 登录回调回来（或已点击过开始使用），直接进入三界游戏画布
      if (me && (enteredBefore || hasAuthedParam)) {
        portal.classList.add('is-hidden');
      } else {
        portal.classList.remove('is-hidden');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
