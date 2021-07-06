'use strict';

class AgentBootHook {
  constructor(app) {
    this.app = app;
  }

  async configDidLoad() {
    const { app } = this;
    require('./lib/consul')(app);
  }

  async didReady() {
    if (this.app.config.consul.autoRegister) {
      await this.app.consul.hook.registerService();
    }
  }

  async beforeClose() {
    await this.app.consul.hook.deRegisterService();
  }
}

module.exports = AgentBootHook;
