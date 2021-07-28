'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/healthcheck', controller.healthCheck.index);
};
