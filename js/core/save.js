/**
 * 汉风西游 - 存档与持久化管理系统 (SaveManager)
 * LocalStorage 本地存储、多槽位、自动即时存档、导出与导入 JSON
 */
class SaveManager {
  static SAVE_KEY_PREFIX = 'hanfeng_xy_save_';

  // 隐私模式 / 禁用存储 / iframe sandbox 下 localStorage 访问本身会抛 SecurityError，
  // 任何一处未兜底都会让 App2D 构造中断导致白屏，因此统一走这个探测入口。
  static get storage() {
    if (this._storageChecked) return this._storage || null;
    this._storageChecked = true;
    try {
      if (typeof localStorage === 'undefined' || !localStorage) {
        this._storage = null;
        return null;
      }
      const probe = '__hanfeng_xy_probe__';
      localStorage.setItem(probe, '1');
      localStorage.removeItem(probe);
      this._storage = localStorage;
    } catch (e) {
      console.warn('本地存储不可用，进度将仅在本次会话内保留：', e?.name || e);
      this._storage = null;
    }
    return this._storage;
  }

  // 保存数据到指定槽位
  static saveGame(slotIndex = 1, stateData) {
    try {
      const ls = this.storage;
      if (!ls) return { success: false, msg: '当前浏览器环境不支持本地存储，进度暂无法保存。' };
      const payload = {
        version: '1.0.0',
        timestamp: Date.now(),
        saveTime: new Date().toLocaleString(),
        data: stateData
      };
      ls.setItem(this.SAVE_KEY_PREFIX + slotIndex, JSON.stringify(payload));
      return { success: true, msg: '游戏进度已成功保存在本地！' };
    } catch (e) {
      console.error('存档失败:', e);
      return { success: false, msg: '存档失败，可能是存储空间已满或权限不足。' };
    }
  }

  // 加载指定槽位数据
  static loadGame(slotIndex = 1) {
    try {
      const ls = this.storage;
      if (!ls) return null;
      const raw = ls.getItem(this.SAVE_KEY_PREFIX + slotIndex);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      return (parsed.data && typeof parsed.data === 'object') ? parsed.data : null;
    } catch (e) {
      console.error('读档失败:', e);
      return null;
    }
  }

  // 检查是否有存档
  static hasSave(slotIndex = 1) {
    try {
      const ls = this.storage;
      return !!(ls && ls.getItem(this.SAVE_KEY_PREFIX + slotIndex));
    } catch (e) {
      return false;
    }
  }

  // 保存 2D 汉风西游完整历练状态 (自动存档专用)
  static saveGameFullState(stateData) {
    try {
      const ls = this.storage;
      if (!ls) return { success: false, msg: '当前浏览器环境不支持本地存储，进度暂无法保存。' };
      const payload = {
        version: '2.0.0',
        timestamp: Date.now(),
        saveTime: new Date().toLocaleString(),
        data: stateData
      };
      ls.setItem(this.SAVE_KEY_PREFIX + 'auto_progress', JSON.stringify(payload));
      return { success: true, msg: '历练进度已自动保存在本地！' };
    } catch (e) {
      console.error('自动保存异常:', e);
      return { success: false, msg: '存储受限或异常。' };
    }
  }

  // 加载 2D 完整历练进度
  static loadGameFullState() {
    try {
      const ls = this.storage;
      if (!ls) return null;
      const raw = ls.getItem(this.SAVE_KEY_PREFIX + 'auto_progress');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      return (parsed.data && typeof parsed.data === 'object') ? parsed.data : null;
    } catch (e) {
      console.error('读档异常:', e);
      return null;
    }
  }

  // 检查是否存在 2D 自动历练存档
  static hasAutoSave() {
    try {
      const ls = this.storage;
      return !!(ls && ls.getItem(this.SAVE_KEY_PREFIX + 'auto_progress'));
    } catch (e) {
      return false;
    }
  }

  // 清空历练存档（重新启程）
  static clearProgress() {
    try {
      const ls = this.storage;
      if (ls) ls.removeItem(this.SAVE_KEY_PREFIX + 'auto_progress');
      return { success: true, msg: '历练存档已清空，正在为您重新开启西行长卷！' };
    } catch (e) {
      return { success: false, msg: '清空失败。' };
    }
  }

  // 清除指定槽位存档
  static deleteSave(slotIndex = 1) {
    try {
      const ls = this.storage;
      if (ls) ls.removeItem(this.SAVE_KEY_PREFIX + slotIndex);
    } catch (e) {
      console.warn('删除存档失败:', e);
    }
  }

  // 导出存档为 JSON 字符串（默认导出真正被 2D 读取的自动历练档）
  static exportSaveJson(slotIndex = 'auto_progress') {
    try {
      const ls = this.storage;
      if (!ls) return '';
      const key = (slotIndex === 'auto_progress') ? 'auto_progress' : slotIndex;
      return ls.getItem(this.SAVE_KEY_PREFIX + key) || '';
    } catch (e) {
      return '';
    }
  }

  // 导入 JSON 字符串恢复存档
  // 默认写入 auto_progress：2D 主线只读这个键，写槽位键会造成"导入成功但进度没变"。
  static importSaveJson(slotIndex = 'auto_progress', jsonStr) {
    try {
      const ls = this.storage;
      if (!ls) return { success: false, msg: '当前环境不支持本地存储，无法导入。' };
      const parsed = JSON.parse(jsonStr);
      if (!parsed || typeof parsed !== 'object' || !parsed.data || typeof parsed.data !== 'object') {
        return { success: false, msg: '存档格式错误，无法识别核心数据！' };
      }
      if (!parsed.data.mapId || typeof parsed.data.mapId !== 'string') {
        return { success: false, msg: '存档结构不完整（缺少地图信息），可能不是本版本导出的档。' };
      }
      const key = (slotIndex === 'auto_progress') ? 'auto_progress' : slotIndex;
      ls.setItem(this.SAVE_KEY_PREFIX + key, jsonStr);
      return { success: true, msg: '外部存档导入成功！正在为您重新载入游戏……' };
    } catch (e) {
      const quota = e && (e.name === 'QuotaExceededError' || e.code === 22);
      return {
        success: false,
        msg: quota ? '存储空间不足，导入失败！' : '导入失败，JSON 解析异常！'
      };
    }
  }
}

window.SaveManager = SaveManager;
