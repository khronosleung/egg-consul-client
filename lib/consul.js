'use strict';

const assert = require('assert');
const is = require('@sindresorhus/is');
const consul = require('consul');

const addHook = require('./hook');
const event = require('./event');

const PLUGIN_LOG_TITLE = '[egg-consul-client]';

module.exports = app => {
  const { server } = app.config.consul;

  assert(server.host && server.port,
    `${PLUGIN_LOG_TITLE} 'host: ${server.host}', 'port: ${server.port}' are required on config`);

  app.coreLogger.info(
    `${PLUGIN_LOG_TITLE} connecting consul agent %s:%s`,
    server.host, server.port
  );

  const consulInstance = consul(server);
  addHook(consulInstance, app);

  // 接收 worker 传递过来的消息
  app.messenger.on('consul-message-agent', async data => {
    if (
      !is.string(data.action)
      || is.emptyString(data.action)
      || !is.function(event[data.action])
    ) {
      return;
    }

    const fn = event[data.action];
    if (is.promise(fn) || is.asyncFunction(fn)) {
      await fn(app, data);
    } else {
      fn(app, data);
    }
  });

  app.beforeStart(async () => {
    try {
      const agentSelf = await app.consul.agent.self({
        timeout: 2000
      });
      if (agentSelf.Stats.serf_lan.health_score !== '0') {
        app.coreLogger.error(`${PLUGIN_LOG_TITLE} client connect agent is unhealthy, health_score value ${agentSelf.Stats.serf_lan.health_score}`);
      } else {
        app.coreLogger.info(`${PLUGIN_LOG_TITLE} client connect agent success`);
      }
    } catch (e) {
      app.coreLogger.error(`${PLUGIN_LOG_TITLE} client connect agent error`);
    }
  });

  Object.defineProperty(app, 'consul', {
    get() {
      return consulInstance;
    },
  });
};
