'use strict';

const assert = require('assert');
const is = require('@sindresorhus/is');

exports.getConfig = (app, data = {}) => {
  if (!data.pid) {
    assert(
      data.pid,
      `data.pid is required on getConfig`
    );
  }

  app.messenger.sendTo(data.pid, 'consul-message-worker', {
    action: 'getConfigCompleted',
    data: {
      ...app.config.consul,
      consul: {
        ...app.consul._opts,
      }
    },
  });
};

exports.syncServices = async (app) => {
  const serviceList = await app.consul.hook.syncServices();

  app.messenger.sendToApp('consul-message-worker', {
    action: 'syncServicesCompleted',
    data: serviceList
  });
};

exports.triggerApi = async (app, data = {}) => {
  if (!data.pid) {
    assert(
      data.pid,
      `data.pid is required on triggerApi`
    );
  }

  let apiChain = app.consul;

  data.name.split('.').forEach((item) => {
    if (!is.undefined(apiChain[item])) {
      apiChain = apiChain[item];
    }
  });

  let apiResult;
  if (is.promise(apiChain) || is.asyncFunction(apiChain)) {
    apiResult = await apiChain(data.param || undefined);
  } else if (is.function(apiChain)) {
    apiResult = apiChain(data.param || undefined);
  } else {
    apiResult = apiChain;
  }

  app.messenger.sendTo(data.pid, 'consul-message-worker', {
    action: 'triggerApiCompleted',
    data: {
      name: data.name, value: apiResult
    },
  });

  return apiResult;
};
