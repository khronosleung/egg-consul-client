'use strict';

module.exports = app => {
  app.consul = {};
  Object.defineProperty(app.consul, 'trigger', {
    value: (name = '', param) => {
      return new Promise(resolve => {
        app.messenger.once('consul-message-worker', message => {
          if (message.action === 'returnApiResult') {
            resolve(message.data.value);
          } else {
            resolve();
          }
        });
        app.messenger.sendToAgent('consul-message-agent', {
          action: 'triggerApi',
          name,
          param,
          pid: process.pid,
        });
      });
    }
  });
};
