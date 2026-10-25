/**
 * R2 移动与点击一致性自动化测试：
 * R2.1: 移动按时间推进、斜走不加速、固定逻辑步长(30/60/120Hz一致)、切后台防瞬移
 * R2.2: 画布 object-fit: contain 留白偏移校准、留白点击不寻路、弹窗打开拦截
 */

module.exports = async function runR2Tests(assert) {
  console.log('\n▶️ [R2 移动与点击测试] 帧率独立移动、斜走不加速、画布留白校准与弹窗防护');

  // =========================================================================
  // R2.1: 移动按时间推进与斜向速度归一化
  // =========================================================================
  {
    const mapData = {
      width: 20,
      height: 20,
      collision: new Array(400).fill(0) // 全可行走
    };
    const mockTilemap = {
      tileSize: 32,
      isWalkable: () => true
    };

    const char = new window.Character({
      x: 100,
      y: 100,
      width: 32,
      height: 32,
      speed: 4.0
    });

    // 1. 正交单步移动距离 = speed
    char.x = 100;
    char.y = 100;
    char.move(1, 0, mapData, mockTilemap);
    const orthoDist = Math.hypot(char.x - 100, char.y - 100);
    assert(Math.abs(orthoDist - 4.0) < 0.001, 'R2.1: 正交右移单步距离精确等于 speed (4.0)');

    // 2. 斜向移动 (1, 1)：归一化后单步位移距离仍精确等于 speed (杜绝 1.414 倍加速)
    char.x = 100;
    char.y = 100;
    char.move(1, 1, mapData, mockTilemap);
    const diagDist = Math.hypot(char.x - 100, char.y - 100);
    assert(Math.abs(diagDist - 4.0) < 0.01, 'R2.1: 斜向移动归一化后位移严格等于 speed，杜绝斜走速度倍增');

    // 3. 帧率解耦：模拟 60Hz 与 120Hz 下执行 1000ms 的更新步数
    const app60 = Object.create(window.App2D);
    let updates60 = 0;
    app60.update = () => { updates60++; };
    app60.render = () => {};

    // 模拟 60Hz: 先启动初始帧 0ms，再经历 60 帧 (共 1000ms 历时)
    app60.gameLoop(0);
    for (let f = 1; f <= 60; f++) {
      app60.gameLoop(f * (1000 / 60));
    }

    const app120 = Object.create(window.App2D);
    let updates120 = 0;
    app120.update = () => { updates120++; };
    app120.render = () => {};

    // 模拟 120Hz: 先启动初始帧 0ms，再经历 120 帧 (共 1000ms 历时)
    app120.gameLoop(0);
    for (let f = 1; f <= 120; f++) {
      app120.gameLoop(f * (1000 / 120));
    }

    assert(Math.abs(updates60 - 60) <= 1, `R2.1: 60Hz 下 1 秒执行约 60 次逻辑步进 (实际: ${updates60})`);
    assert(Math.abs(updates120 - 60) <= 1, `R2.1: 120Hz 高刷屏下 1 秒依然稳定执行约 60 次逻辑步进 (实际: ${updates120})`);

    // 4. 切后台卡顿恢复保护：单帧暴增 3000ms 时，执行步数被 clamp (不超过 6 次)，绝不瞬移或穿墙
    const appLag = Object.create(window.App2D);
    let lagSteps = 0;
    appLag.update = () => { lagSteps++; };
    appLag.render = () => {};
    appLag.gameLoop(100);
    appLag.gameLoop(3100); // 间隔 3000ms (模拟后台切回)
    assert(lagSteps <= 6, `R2.1: 后台切回单帧暴增 3000ms 被安全截断至最多 6 步 (实际: ${lagSteps})，防止瞬移穿墙`);
  }

  // =========================================================================
  // R2.2: 画布 object-fit: contain 留白偏移校准与弹窗防护
  // =========================================================================
  {
    const app = Object.create(window.App2D);
    app.canvas = {
      width: 760,
      height: 580,
      getBoundingClientRect: () => ({
        left: 50,
        top: 20,
        width: 1000, // 横向存在留白: drawW = 760, offsetX = (1000 - 760)/2 = 120
        height: 580  // 纵向无留白: drawH = 580, offsetY = 0
      })
    };

    // 1. 点击左侧留白黑边 (clientX = 50 + 60 = 110 < 170): 必须返回 null，不触发寻路
    const ptInLeftPad = app.getCanvasPointerPosition(110, 100);
    assert(ptInLeftPad === null, 'R2.2: 点击画布左侧留白黑边返回 null，不触发错误寻路');

    // 2. 点击右侧留白黑边 (clientX = 50 + 950 = 1000 > 50 + 120 + 760 = 930): 返回 null
    const ptInRightPad = app.getCanvasPointerPosition(1000, 100);
    assert(ptInRightPad === null, 'R2.2: 点击画布右侧留白黑边返回 null，不触发错误寻路');

    // 3. 点击真实内容左边界 (clientX = 50 + 120 = 170): 精准映射为 x = 0
    const ptLeftEdge = app.getCanvasPointerPosition(170, 20);
    assert(ptLeftEdge && Math.abs(ptLeftEdge.x - 0) < 0.1 && Math.abs(ptLeftEdge.y - 0) < 0.1,
      'R2.2: 点击实际画面左上角精准映射为画布 (0, 0)');

    // 4. 点击实际画面正中心 (clientX = 50 + 120 + 380 = 550, clientY = 20 + 290 = 310): 精准映射为 (380, 290)
    const ptCenter = app.getCanvasPointerPosition(550, 310);
    assert(ptCenter && Math.abs(ptCenter.x - 380) < 0.1 && Math.abs(ptCenter.y - 290) < 0.1,
      'R2.2: 点击实际画面中心精准映射为画布 (380, 290)');

    // 5. 弹窗打开时拦截点击
    app.hasExplorationModal = () => true;
    let clickedHandled = false;
    app.camera = { screenToWorld: () => { clickedHandled = true; return { x: 0, y: 0 }; } };
    app.handleClickCanvas(100, 100);
    assert(clickedHandled === false, 'R2.2: 存在探索弹窗时 handleClickCanvas 立即拦截，点击不会落到地图');
  }
};
