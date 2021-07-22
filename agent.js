'use strict';

class AgentBootHook {
  constructor(app) {
    this.app = app;
  }

  async configDidLoad() {
    require('./lib/consul')(this.app);
  }

  async didReady() {
    const { app } = this;
    if (app.config.consul.autoRegister) {
      await app.consul.hook.registerService();
    }
  }

  async beforeClose() {
    await this.app.consul.hook.deRegisterService();
  }
}

module.exports = AgentBootHook;
