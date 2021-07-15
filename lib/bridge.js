'use strict';

module.exports = app => {
  app.consul = {};

  Object.defineProperty(app.consul, 'getOpts', {
    value: () => {
      return new Promise(resolve => {
        const eventName = 'getOpts';

        app.messenger.once('consul-message-worker', message => {
          if (message.action === eventName) {
            resolve(message.data);
          } else {
            resolve();
          }
        });
        app.messenger.sendToAgent('consul-message-agent', {
          action: eventName,
          pid: process.pid,
        });
      });
    }
  });

  Object.defineProperty(app.consul, 'trigger', {
    value: (name = '', param) => {
      return new Promise(resolve => {
        const eventName = 'triggerApi';

        app.messenger.once('consul-message-worker', message => {
          if (message.action === eventName) {
            resolve(message.data.value);
          } else {
            resolve();
          }
        });
        app.messenger.sendToAgent('consul-message-agent', {
          action: eventName,
          pid: process.pid,
          name,
          param,
        });
      });
    }
  });
};
