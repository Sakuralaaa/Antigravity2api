import logger from './logger.js';

/**
 * 空闲模式管理器
 * 在没有请求时降低内存使用，减少后台活动
 */
class IdleManager {
  constructor() {
    this.lastRequestTime = Date.now();
    // 可通过环境变量调整空闲超时（默认15秒）
    this.idleTimeout = parseInt(process.env.IDLE_TIMEOUT_MS) || 15 * 1000;
    this.isIdle = false;
    this.gcInterval = null;
    this.checkInterval = null;

    // 启动空闲检查
    this.startIdleCheck();

    // 5秒后立即检查是否应该进入空闲模式
    setTimeout(() => {
      const idleTime = Date.now() - this.lastRequestTime;
      if (idleTime > this.idleTimeout) {
        this.enterIdleMode();
      }
    }, 5000);
  }

  /**
   * 记录请求活动
   */
  recordActivity() {
    this.lastRequestTime = Date.now();

    // 如果之前是空闲状态，现在恢复活跃
    if (this.isIdle) {
      this.exitIdleMode();
    }
  }

  /**
   * 启动空闲检查
   */
  startIdleCheck() {
    // 每10秒检查一次是否应该进入空闲模式
    this.checkInterval = setInterval(() => {
      const idleTime = Date.now() - this.lastRequestTime;

      if (!this.isIdle && idleTime > this.idleTimeout) {
        this.enterIdleMode();
      }
    }, 10000); // 每10秒检查一次（更积极的内存管理）

    // 不阻止进程退出
    this.checkInterval.unref();
  }

  /**
   * 进入空闲模式
   */
  enterIdleMode() {
    if (this.isIdle) return;

    logger.info('⏸️  进入空闲模式 - 降低资源使用');
    this.isIdle = true;

    // 触发垃圾回收
    if (global.gc) {
      global.gc();
      logger.info('🗑️  已触发垃圾回收');
    } else {
      // 如果没有启用 --expose-gc，尝试通过其他方式释放内存
      logger.warn('⚠️  未启用 --expose-gc，建议使用 node --expose-gc 启动以获得更好的内存优化');
    }

    // 在空闲模式下定期进行垃圾回收（可通过环境变量调整，默认1分钟）
    const idleGcIntervalMs = parseInt(process.env.IDLE_GC_INTERVAL_MS) || 60 * 1000;
    this.gcInterval = setInterval(() => {
      if (global.gc) {
        global.gc();
        logger.info('🗑️  空闲模式：定期垃圾回收');
      }
    }, idleGcIntervalMs);

    // 不阻止进程退出
    this.gcInterval.unref();
  }

  /**
   * 退出空闲模式
   */
  exitIdleMode() {
    if (!this.isIdle) return;

    logger.info('▶️  退出空闲模式 - 恢复正常运行');
    this.isIdle = false;

    // 清除空闲模式的定时器
    if (this.gcInterval) {
      clearInterval(this.gcInterval);
      this.gcInterval = null;
    }

    // 触发一次垃圾回收，清理空闲期间的内存
    if (global.gc) {
      global.gc();
    }
  }

  /**
   * 获取当前状态
   */
  getStatus() {
    const idleTime = Date.now() - this.lastRequestTime;
    return {
      isIdle: this.isIdle,
      idleTimeSeconds: Math.floor(idleTime / 1000),
      lastRequestTime: new Date(this.lastRequestTime).toISOString()
    };
  }

  /**
   * 清理资源
   */
  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    if (this.gcInterval) {
      clearInterval(this.gcInterval);
    }
  }
}

const idleManager = new IdleManager();
export default idleManager;
