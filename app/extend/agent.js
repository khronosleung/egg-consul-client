'use strict';

const ConsulClient = require('../../lib/consul');

module.exports = {
  async initConsul() {
    const { consul } = this.config;
    return new ConsulClient(this, {
      ...consul,
    });
  },
};
