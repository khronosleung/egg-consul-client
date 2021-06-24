'use strict';

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  // 配置文件加载完成
  async configDidLoad() {
    const { app } = this;
    app.consul = await app.initConsul();
    app.messenger.on('consulRegister', () => {
      app.consul.registerService();
    });
    app.messenger.on('consulDeRegister', () => {
      app.consul.deRegisterService();
    });
  }

  async didReady() {
    await this.app.consul.registerService();
  }

  async beforeClose() {
    await this.app.consul.deRegisterService();
  }
}

module.exports = AppBootHook;
