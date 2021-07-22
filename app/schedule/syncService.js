'use strict';

module.exports = app => {
  return {
    schedule: {
      interval: app.config.consul.syncInterval || '1m', // 1 分钟间隔
      immediate: true, // 配置了该参数为 true 时，这个定时任务会在应用启动并 ready 后立刻执行一次这个定时任务
      type: 'worker',
    },
    async task(ctx) {
      await ctx.app.consul.syncServices();
    },
  };
};
