'use strict';

const is = require('@sindresorhus/is');

module.exports = (consulInstance, app) => {
  consulInstance.hook = {
    /**
     * 注册服务到consul agent
     * @returns {Promise<void>}
     */
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

    /**
     * 从consul agent中卸载服务
     * @returns {Promise<void>}
     */
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

    /**
     * 拉去全部注册的服务列表
     * @returns {Promise<void>}
     */
    async syncServices() {
      let serviceList = await consulInstance.catalog.service.list();
      serviceList = Object.keys(serviceList);

      if (serviceList.length < 1) {
        return {};
      }

      const servicesGroup= [];
      let stepGroupIndex = 0;
      let stepIndex = 0;
      const stepMax = 20; // 每次并发最大数
      serviceList.forEach(serviceName => {
        stepIndex += 1;
        if (stepIndex > stepMax) {
          stepIndex = 1;
          stepGroupIndex += 1;
        }

        if (is.undefined(servicesGroup[stepGroupIndex])) {
          servicesGroup[stepGroupIndex] = [];
        }

        servicesGroup[stepGroupIndex].push(
          consulInstance.health.service(serviceName)
        );
      });

      const servicesMap = {};
      for (let i = 0, len = servicesGroup.length; i < len; i++) {
        const orgResult = await Promise.all(servicesGroup[i]);

        // 二维数组降至一维，降低循环复杂度
        // [1, 2, [3, 4], 5, 6] => [1, 2, 3, 4, 5, 6]
        const result = [].concat(...orgResult);
        result.forEach((serviceItem, serviceKey) => {
          const { Service, Checks } = serviceItem;

          if (is.emptyString(Service.Address)) {
            return;
          }

          if (is.undefined(servicesMap[Service.Service])) {
            servicesMap[Service.Service] = {
              serviceHostCyclicCounter: 0, // 负载均衡计算用
              serverHosts: [],
            };
          }

          Checks.forEach(checkItem => {
            if (
              checkItem.CheckID === 'serfHealth'
              && checkItem.Status === 'passing'
              && is.nonEmptyString(Service.Address)
            ) {
              let serverHost = Service.Address;
              if (is.number(Service.Port) && Service.Port !== 80) {
                serverHost += `:${Service.Port}`;
              }
              servicesMap[Service.Service].serverHosts.push(serverHost);
              servicesMap[Service.Service].serverHosts = Array.from(new Set(servicesMap[Service.Service].serverHosts));
            }
          });
        });
      }

      return servicesMap;
    }
  };

  return consulInstance;
};
