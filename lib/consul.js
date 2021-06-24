'use strict';

const os = require('os');
const crypto = require('crypto');
const assert = require('assert');
const Consul = require('consul');

const DEFAULT_CONSUL_SERVER_CONFIG = {
  promisify: true,
  secure: false,
};

function md5(str) {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex');
}

class ConsulClient {
  constructor(app, options = {}) {
    this.app = app;

    this.options = {
      server: {
        ...DEFAULT_CONSUL_SERVER_CONFIG,
        ...options.server,
      },
      client: { ...options.client },
    };

    const { server, client } = this.options;

    if (!client.id) {
      const clientId = md5(os.hostname());
      client.id = `${client.name}-${clientId}`;
    }

    assert(
      server.host
      && server.port,
      `[egg-consul-client] 'host: ${server.host}', 'port: ${server.port}' are required on config`);

    this.consulInstance = new Consul({
      ...server,
    });

    return this;
  }

  async registerService() {
    const { consulInstance, options } = this;
    const { client } = options;
    try {
      if (client) {
        await consulInstance.agent.service.register({ ...client });
      }
    } catch (error) {
      if (error instanceof Error) {
        error.function = 'ConsulClientInstance.registerService';
        error.data = options;
      }
      throw error;
    }
  }
  async deRegisterService() {
    const { consulInstance, options } = this;
    const { client } = options;
    try {
      if (client) {
        await Promise.all([
          consulInstance.agent.service.deregister(client.id),
          consulInstance.agent.check.deregister(client.id),
        ]);
      }
    } catch (error) {
      if (error instanceof Error) {
        error.function = 'ConsulClientInstance.deRegisterService';
        error.data = options;
      }
      throw error;
    }
  }
}

module.exports = ConsulClient;
