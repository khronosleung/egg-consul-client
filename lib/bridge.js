'use strict';

const is = require('@sindresorhus/is');

module.exports = app => {
  app.consul = {};

  // 从agent同步回来的已注册consul服务列表
  // 需全部worker同时监听
  app.messenger.on('consul-message-worker', async message => {
    if (message.action === 'syncServicesCompleted') {
      app.consul._serviceList = is.nonEmptyObject(message.data) ? { ...message.data } : {};
    }
  });

  Object.defineProperties(app.consul, {
    _serviceList: {
      value: {},
      writable: true,
      configurable: false,
      enumerable: false,
    },
    getConfig: {
      value: () => {
        return new Promise(resolve => {
          app.messenger.once('consul-message-worker', message => {
            if (message.action === 'getConfigCompleted') {
              resolve(message.data);
            } else {
              resolve();
            }
          });
          app.messenger.sendToAgent('consul-message-agent', {
            action: 'getConfig',
            pid: process.pid,
          });
        });
      }
    },
    trigger: {
      value: (name = '', param) => {
        return new Promise(resolve => {
          app.messenger.once('consul-message-worker', message => {
            if (message.action === 'triggerApiCompleted') {
              resolve(message.data.value);
            } else {
              resolve();
            }
          });
          app.messenger.sendToAgent('consul-message-agent', {
            action: 'triggerApi',
            pid: process.pid,
            name,
            param,
          });
        });
      }
    },
    syncServices: {
      value: () => {
        app.messenger.sendToAgent('consul-message-agent', {
          action: 'syncServices',
        });
      }
    },

    /**
     * 获取某个服务的address
     */
    getServiceHost: {
      value: (serviceName = '') => {
        const serviceList = app.consul._serviceList;

        let serviceHost = '';
        if (
          is.emptyObject(serviceList)
          || is.emptyString(serviceName)
          || is.emptyObject(serviceList[serviceName])
        ) {
          return serviceHost;
        }

        const { serverHosts, serviceHostCyclicCounter } = serviceList[serviceName];

        if (serverHosts.length === 1) {
          return serverHosts[0];
        }

        serviceHost = serverHosts[(serviceHostCyclicCounter % serverHosts.length)];
        if ((serviceHostCyclicCounter + 1) >= serverHosts.length) {
          serviceList[serviceName].serviceHostCyclicCounter = 0;
        } else {
          serviceList[serviceName].serviceHostCyclicCounter += 1;
        }

        return serviceHost;
      }
    }
  });
};
