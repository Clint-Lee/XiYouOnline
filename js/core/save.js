/**
 * 汉风西游 - 存档与持久化管理系统 (SaveManager)
 * LocalStorage 本地存储、多槽位、自动即时存档、灾备副本与容错导入
 */
class SaveManager {
  static SAVE_KEY_PREFIX = 'hanfeng_xy_save_';
  static corruptedBackup = null;

  // 检查浏览器 Storage 环境是否可用
  static isStorageAvailable() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const testKey = '__hf_storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (_) {
      return false;
    }
  }

  // 灾备留存：当检测到存档损坏时，备份原始内容，避免后续自动保存静默抹去
  static preserveCorruptedSave(sourceKey, rawData, reason) {
    try {
      this.corruptedBackup = {
        sourceKey,
        raw: rawData,
        reason,
        timestamp: Date.now()
      };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.SAVE_KEY_PREFIX + 'corrupted_backup', JSON.stringify(this.corruptedBackup));
      }
    } catch (_) {}
  }

  // 获取灾备备份
  static getCorruptedBackup() {
    if (this.corruptedBackup) return this.corruptedBackup;
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(this.SAVE_KEY_PREFIX + 'corrupted_backup');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        this.corruptedBackup = parsed;
        return parsed;
      }
    } catch (_) {}
    return null;
  }

  // 保存数据到指定槽位
  static saveGame(slotIndex = 1, stateData) {
    try {
      if (typeof localStorage === 'undefined') {
        return { success: false, reason: 'storage_unavailable', msg: '本地存储不可用。' };
      }
      const payload = {
        version: '1.0.0',
        timestamp: Date.now(),
        saveTime: new Date().toLocaleString(),
        data: stateData
      };
      localStorage.setItem(this.SAVE_KEY_PREFIX + slotIndex, JSON.stringify(payload));
      return { success: true, msg: '游戏进度已成功保存在本地！' };
    } catch (e) {
      console.error('存档失败:', e);
      return { success: false, reason: e.name || 'storage_error', msg: '存档失败，可能是存储空间已满或权限不足。' };
    }
  }

  // 加载指定槽位数据
  static loadGame(slotIndex = 1) {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(this.SAVE_KEY_PREFIX + slotIndex);
      if (!raw) return null;
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (jsonErr) {
        this.preserveCorruptedSave(slotIndex, raw, 'json_syntax_error');
        return null;
      }
      if (!parsed || typeof parsed !== 'object') {
        this.preserveCorruptedSave(slotIndex, raw, 'invalid_payload_object');
        return null;
      }
      return (parsed.data && typeof parsed.data === 'object') ? parsed.data : null;
    } catch (e) {
      console.error('读档失败:', e);
      return null;
    }
  }

  // 检查是否有指定槽位存档
  static hasSave(slotIndex = 1) {
    try {
      if (typeof localStorage === 'undefined') return false;
      return !!localStorage.getItem(this.SAVE_KEY_PREFIX + slotIndex);
    } catch (_) {
      return false;
    }
  }

  // 保存 2D 汉风西游完整历练状态 (自动存档专用)
  static saveGameFullState(stateData) {
    try {
      if (typeof localStorage === 'undefined') {
        return { success: false, reason: 'storage_unavailable', msg: '存储受限或环境不支持。' };
      }
      const payload = {
        version: '2.0.0',
        timestamp: Date.now(),
        saveTime: new Date().toLocaleString(),
        data: stateData
      };
      localStorage.setItem(this.SAVE_KEY_PREFIX + 'auto_progress', JSON.stringify(payload));
      this.corruptedBackup = null;
      return { success: true, msg: '历练进度已自动保存在本地！' };
    } catch (e) {
      console.error('自动保存异常:', e);
      return { success: false, reason: e.name || 'storage_error', msg: '存储受限或异常。' };
    }
  }

  // 加载 2D 完整历练进度
  static loadGameFullState() {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(this.SAVE_KEY_PREFIX + 'auto_progress');
      if (!raw) return null;
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (jsonErr) {
        console.error('自动读档异常 (JSON语法损坏):', jsonErr);
        this.preserveCorruptedSave('auto_progress', raw, 'json_syntax_error');
        return null;
      }
      if (!parsed || typeof parsed !== 'object') {
        this.preserveCorruptedSave('auto_progress', raw, 'invalid_payload_object');
        return null;
      }
      const stateData = (parsed.data && typeof parsed.data === 'object') ? parsed.data : null;
      if (!stateData || !stateData.mapId || !stateData.playerData) {
        this.preserveCorruptedSave('auto_progress', raw, 'missing_core_fields');
        return null;
      }
      return stateData;
    } catch (e) {
      console.error('读档异常 (存储访问受限):', e);
      return null;
    }
  }

  // 检查是否存在 2D 自动历练存档
  static hasAutoSave() {
    try {
      if (typeof localStorage === 'undefined') return false;
      return !!localStorage.getItem(this.SAVE_KEY_PREFIX + 'auto_progress');
    } catch (_) {
      return false;
    }
  }

  // 清空历练存档（重新启程）
  static clearProgress() {
    try {
      if (typeof localStorage === 'undefined') return { success: false, msg: '存储不可用。' };
      localStorage.removeItem(this.SAVE_KEY_PREFIX + 'auto_progress');
      this.corruptedBackup = null;
      return { success: true, msg: '历练存档已清空，正在为您重新开启西行长卷！' };
    } catch (e) {
      return { success: false, msg: '清空失败。' };
    }
  }

  // 清除指定槽位存档
  static deleteSave(slotIndex = 1) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.SAVE_KEY_PREFIX + slotIndex);
      }
    } catch (_) {}
  }

  // 导出存档为 JSON 字符串
  static exportSaveJson(slotIndex = 1) {
    try {
      if (typeof localStorage === 'undefined') return '';
      const key = slotIndex === 'auto' || slotIndex === 'auto_progress'
        ? this.SAVE_KEY_PREFIX + 'auto_progress'
        : this.SAVE_KEY_PREFIX + slotIndex;
      const raw = localStorage.getItem(key);
      return raw || '';
    } catch (_) {
      return '';
    }
  }

  // 导入 JSON 字符串恢复存档（包含严格结构校验，失败不伤及现有存档）
  static importSaveJson(slotIndex = 1, jsonStr) {
    try {
      if (typeof localStorage === 'undefined') {
        return { success: false, msg: '本地存储不可用，无法导入存档。' };
      }
      if (typeof jsonStr !== 'string' || !jsonStr.trim()) {
        return { success: false, msg: '存档内容为空，无法导入！' };
      }
      let parsed;
      try {
        parsed = JSON.parse(jsonStr);
      } catch (_) {
        return { success: false, msg: '导入失败，JSON 解析异常！' };
      }

      if (!parsed || typeof parsed !== 'object') {
        return { success: false, msg: '存档格式错误，无法识别核心数据！' };
      }

      // 兼容标准包装格式与原始数据格式
      const candidateState = (parsed.data && typeof parsed.data === 'object') ? parsed.data : parsed;
      const playerObj = candidateState.playerData || candidateState.player;

      if (!playerObj || typeof playerObj !== 'object') {
        return { success: false, msg: '存档校验失败：缺失玩家核心属性 (playerData)！' };
      }
      if (!candidateState.mapId || typeof candidateState.mapId !== 'string') {
        return { success: false, msg: '存档校验失败：缺失当前所在场景地图 (mapId)！' };
      }
      if (playerObj.level !== undefined && (!Number.isSafeInteger(playerObj.level) || playerObj.level < 1)) {
        return { success: false, msg: '存档校验失败：角色等级异常！' };
      }
      if (candidateState.inventorySlots && !Array.isArray(candidateState.inventorySlots)) {
        return { success: false, msg: '存档校验失败：背包数据结构损坏！' };
      }

      // 校验通过，包装规范格式并写入
      const payload = {
        version: parsed.version || '2.0.0',
        timestamp: Date.now(),
        saveTime: new Date().toLocaleString(),
        data: candidateState
      };

      const key = slotIndex === 'auto' || slotIndex === 'auto_progress'
        ? this.SAVE_KEY_PREFIX + 'auto_progress'
        : this.SAVE_KEY_PREFIX + slotIndex;

      localStorage.setItem(key, JSON.stringify(payload));
      this.corruptedBackup = null;
      return { success: true, msg: '外部历练存档导入成功！正在为您重新载入游戏……' };
    } catch (e) {
      return { success: false, msg: `导入失败: ${e.message || '存储异常'}` };
    }
  }
}

window.SaveManager = SaveManager;
