'use strict';

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async configDidLoad() {
    require('./lib/bridge')(this.app);
  }
}

module.exports = AppBootHook;
