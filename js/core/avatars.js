/**
 * 云檐趣阁 (CloudEave) · 官方高质感内置头像图库 - 汉风西游镜像
 */

const XIYOU_AVATAR_LIST = [
  {
    id: 'mythic_qinglong',
    name: '青龙灵君',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ql-bg-xy" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#144d53"/>
          <stop offset="60%" stop-color="#0b2b30"/>
          <stop offset="100%" stop-color="#06181b"/>
        </radialGradient>
        <linearGradient id="ql-gold-xy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fde047"/>
          <stop offset="50%" stop-color="#eab308"/>
          <stop offset="100%" stop-color="#ca8a04"/>
        </linearGradient>
        <linearGradient id="ql-scale-xy" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#34d399"/>
          <stop offset="100%" stop-color="#059669"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="50" fill="url(#ql-bg-xy)"/>
      <circle cx="50" cy="50" r="46" fill="none" stroke="url(#ql-gold-xy)" stroke-width="1.8" stroke-dasharray="6 3" opacity="0.6"/>
      <path d="M35 32 Q26 18 18 20 Q22 28 32 35 Z" fill="url(#ql-gold-xy)"/>
      <path d="M65 32 Q74 18 82 20 Q78 28 68 35 Z" fill="url(#ql-gold-xy)"/>
      <path d="M38 58 Q22 62 14 55 Q20 68 36 62" fill="none" stroke="#6ee7b7" stroke-width="2" stroke-linecap="round"/>
      <path d="M62 58 Q78 62 86 55 Q80 68 64 62" fill="none" stroke="#6ee7b7" stroke-width="2" stroke-linecap="round"/>
      <path d="M50 30 C38 30 34 42 34 54 C34 68 44 76 50 82 C56 76 66 68 66 54 C66 42 62 30 50 30 Z" fill="url(#ql-scale-xy)"/>
      <ellipse cx="43" cy="48" rx="4.5" ry="3" fill="#fef08a"/>
      <ellipse cx="57" cy="48" rx="4.5" ry="3" fill="#fef08a"/>
      <circle cx="43" cy="48" r="1.8" fill="#1e293b"/>
      <circle cx="57" cy="48" r="1.8" fill="#1e293b"/>
      <circle cx="50" cy="38" r="4" fill="url(#ql-gold-xy)"/>
      <circle cx="49" cy="37" r="1.2" fill="#fff"/>
    </svg>`
  },
  {
    id: 'mythic_wusheng',
    name: '凌霄武圣',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ws-bg-xy" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#451a03"/>
          <stop offset="100%" stop-color="#1c0a00"/>
        </radialGradient>
        <linearGradient id="ws-gold-xy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fbbf24"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="50" fill="url(#ws-bg-xy)"/>
      <circle cx="50" cy="50" r="46" fill="none" stroke="url(#ws-gold-xy)" stroke-width="1.5" opacity="0.5"/>
      <path d="M50 14 L55 35 L45 35 Z" fill="#ef4444"/>
      <path d="M50 10 L52 28 L48 28 Z" fill="#fde047"/>
      <path d="M30 42 C30 28 70 28 70 42 L72 58 C72 70 50 82 50 82 C50 82 28 70 28 58 Z" fill="#78350f" stroke="url(#ws-gold-xy)" stroke-width="2"/>
      <path d="M36 46 L64 46 L60 56 L40 56 Z" fill="#18181b"/>
      <rect x="40" y="49" width="7" height="2.5" rx="1" fill="#fde047"/>
      <rect x="53" y="49" width="7" height="2.5" rx="1" fill="#fde047"/>
      <path d="M34 68 L50 80 L66 68 L50 72 Z" fill="url(#ws-gold-xy)"/>
    </svg>`
  },
  {
    id: 'mythic_xianzi',
    name: '绛雪仙子',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="xz-bg-xy" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#4a044e"/>
          <stop offset="70%" stop-color="#2e0237"/>
          <stop offset="100%" stop-color="#140118"/>
        </radialGradient>
        <linearGradient id="xz-ribbon-xy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f472b6"/>
          <stop offset="100%" stop-color="#c084fc"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="50" fill="url(#xz-bg-xy)"/>
      <circle cx="50" cy="50" r="46" fill="none" stroke="#f472b6" stroke-width="1.2" opacity="0.4"/>
      <path d="M22 28 Q50 12 78 28 Q50 34 22 28" fill="none" stroke="url(#xz-ribbon-xy)" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
      <ellipse cx="50" cy="38" rx="20" ry="16" fill="#18181b"/>
      <circle cx="50" cy="24" r="10" fill="#18181b"/>
      <circle cx="34" cy="24" r="3.5" fill="#fde047"/>
      <circle cx="66" cy="24" r="3.5" fill="#fde047"/>
      <path d="M36 44 Q50 40 64 44 Q60 68 50 74 Q40 68 36 44 Z" fill="#ffe4e6"/>
      <circle cx="44" cy="53" r="1.5" fill="#3b0764"/>
      <circle cx="56" cy="53" r="1.5" fill="#3b0764"/>
      <path d="M48 64 Q50 67 52 64" stroke="#f43f5e" stroke-width="2" stroke-linecap="round"/>
      <path d="M50 43 Q48 46 50 48 Q52 46 50 43 Z" fill="#e11d48"/>
    </svg>`
  },
  {
    id: 'minimal_celestial',
    name: '云檐星轮',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mn-c-bg-xy" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#090514"/>
        </radialGradient>
        <linearGradient id="star-gold-xy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fde047"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="50" fill="url(#mn-c-bg-xy)"/>
      <circle cx="50" cy="50" r="46" fill="none" stroke="url(#star-gold-xy)" stroke-width="1.8" opacity="0.6"/>
      <polygon points="50,30 56,44 70,50 56,56 50,70 44,56 30,50 44,44" fill="url(#star-gold-xy)"/>
      <circle cx="50" cy="50" r="4" fill="#ffffff"/>
    </svg>`
  }
];

function getXiYouTianShuAvatarSvg(id) {
  const found = XIYOU_AVATAR_LIST.find(a => a.id === id);
  return (found || XIYOU_AVATAR_LIST[0]).svg;
}

if (typeof window !== 'undefined') {
  window.XiYouTianShuAvatars = {
    XIYOU_AVATAR_LIST,
    getXiYouTianShuAvatarSvg
  };
}

