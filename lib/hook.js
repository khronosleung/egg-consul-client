'use strict';

module.exports = (consulInstance, app) => {
  consulInstance.hook = {
    async registerService() {
      const { client } = app.config.consul;

      app.coreLogger.info('[egg-consul-client] registerService begin.');

      try {
        if (client) {
          await consulInstance.agent.service.register({ ...client });
        }
        app.coreLogger.info('[egg-consul-client] registerService complete.');
      } catch (error) {
        app.coreLogger.warn('[egg-consul-client] registerService fail.');
        if (error instanceof Error) {
          error.function = 'ConsulClientInstance.hook.registerService';
          error.data = client;
        }
        throw error;
      }
    },

    async deRegisterService() {
      const { client } = app.config.consul;

      app.coreLogger.info('[egg-consul-client] deRegisterService begin.');

      try {
        if (client) {
          await Promise.all([
            consulInstance.agent.service.deregister(client.id || client.name),
            consulInstance.agent.check.deregister(client.id || client.name),
          ]);
        }
        app.coreLogger.info('[egg-consul-client] deRegisterService complete.');
      } catch (error) {
        app.coreLogger.warn('[egg-consul-client] deRegisterService fail.');
        if (error instanceof Error) {
          error.function = 'ConsulClientInstance.hook.deRegisterService';
          error.data = client;
        }
        throw error;
      }
    },

    // TODO: find Service
  };
  return consulInstance;
};
