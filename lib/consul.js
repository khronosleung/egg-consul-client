'use strict';

const assert = require('assert');
const is = require('@sindresorhus/is');
const consul = require('consul');

const addHook = require('./hook');

const PLUGIN_LOG_TITLE = '[egg-consul-client]';

module.exports = app => {
  const { server } = app.config.consul;

  assert(server.host && server.port,
    `${PLUGIN_LOG_TITLE} 'host: ${server.host}', 'port: ${server.port}' are required on config`);

  app.coreLogger.info(
    `${PLUGIN_LOG_TITLE} connecting %s:%s`,
    server.host, server.port
  );

  const consulInstance = consul(server);
  addHook(consulInstance, app);

  app.messenger.on('consul-message-agent', async data => {
    let apiChain = app.consul;
    data.name.split('.').forEach((item) => {
      if (typeof apiChain[item] !== undefined) {
        apiChain = apiChain[item];
      }
    });

    let apiResult;
    if (is.function(apiChain) || is.promise(apiChain) || is.asyncFunction(apiChain)) {
      apiResult = await apiChain(data.param || undefined);
    } else {
      apiResult = apiChain;
    }

    app.messenger.sendTo(data.pid, 'consul-message-worker', {
      action: 'returnApiResult',
      data: {
        name: data.name, value: apiResult
      },
    });
  });

  app.beforeStart(async () => {
    try {
      const agentSelf = await app.consul.agent.self();
      if (agentSelf.Stats.serf_lan.health_score !== '0') {
        throw new Error('consul agent is unhealthy');
      }
      app.coreLogger.info(`${PLUGIN_LOG_TITLE} client connect agent success`);
    } catch (e) {
      app.coreLogger.warn(`${PLUGIN_LOG_TITLE} client connect agent fail`);
    }
  });

  Object.defineProperty(app, 'consul', {
    get() {
      return consulInstance;
    },
  });
};
