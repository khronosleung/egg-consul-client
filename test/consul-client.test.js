'use strict';

const assert = require('assert');
const mock = require('egg-mock');
const nock = require('nock');
const is = require('@sindresorhus/is');

// [ What is ? ]
// mock.app是运行在单进程中，agent和worker无法进行进程之间通信
// 解决方法：开启环境变量`SENDMESSAGE_ONE_PROCESS`，由事件主动触发通信
// see: https://github.com/eggjs/egg/issues/3989
process.env.SENDMESSAGE_ONE_PROCESS = true;

function sleep(ms = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


function setupNock(scope) {
  if (is.undefined(scope.nock)) {
    nock.disableNetConnect();
    nock.enableNetConnect(host => {
      return !(host.includes('127.0.0.1:8500'));
    });

    // Object.defineProperty(scope, 'nock', {
    //   configurable: true,
    //   enumerable: true,
    //   value: nock('http://127.0.0.1:8500'),
    // });

    Object.defineProperty(scope, 'nock', {
      configurable: true,
      enumerable: true,
      get: function () {
        return nock('http://127.0.0.1:8500');
      },
    });
  }
  return scope.nock;
}

const mockData = require('./_mock');
function getMockData(path = '') {
  return is.function(mockData[path]) ? mockData[path]() : '';
}

describe('test/consul-client.test.js', () => {
  before(() => {
    setupNock(this);
  });

  /*describe('config', () => {
    it('should has config', async () => {
      this.nock.get('/v1/agent/self')
        .reply(200, path => getMockData(path));
      this.nock.put('/v1/agent/service/register')
        .reply(200);
      this.nock.get('/v1/catalog/services')
        .reply(200, path => getMockData(path));
      this.nock.get('/v1/health/service/serviceName-1')
        .reply(200, path => getMockData(path));
      this.nock.get('/v1/health/service/serviceName-2')
        .reply(200, path => getMockData(path));

      mock.consoleLevel('NONE');
      const app = mock.app({
        baseDir: 'apps/consul-client',
        clean: true,
      });
      await app.ready();



      this.nock.put('/v1/agent/service/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .reply(200);
      this.nock.put('/v1/agent/check/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .reply(200);

      await app.close();
      nock.cleanAll();
    });
  });*/

  describe('services', () => {
    let app;
    before(async () => {
      this.nock.get('/v1/agent/self')
        .reply(200, path => getMockData(path));
      this.nock.put('/v1/agent/service/register')
        .reply(200);
      this.nock.get('/v1/catalog/services')
        .reply(200, path => getMockData(path));
      this.nock.get('/v1/health/service/serviceName-1')
        .reply(200, path => getMockData(path));
      this.nock.get('/v1/health/service/serviceName-2')
        .reply(200, path => getMockData(path));

      mock.consoleLevel('NONE');
      app = mock.app({
        baseDir: 'apps/consul-client',
        clean: true,
      });
      await app.ready();
    });
    afterEach(() => {
      mock.restore();
    });
    after(async () => {
      this.nock.put('/v1/agent/service/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .reply(200);
      this.nock.put('/v1/agent/check/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .reply(200);

      await app.close();
      nock.cleanAll();
    });

    it('get service host by service name', async () => {
      this.nock.get('/v1/catalog/services')
        .reply(200, path => getMockData(path));
      this.nock.get('/v1/health/service/serviceName-1')
        .reply(200, path => getMockData(path));
      this.nock.get('/v1/health/service/serviceName-2')
        .reply(200, path => getMockData(path));

      await sleep(5000);

      assert.deepStrictEqual(
        app.consul.getServiceHost('serviceName-1'),
        '10.3.114.128:7001'
      );
    });
    it('get service list', async () => {
      this.nock.get('/v1/catalog/services')
        .reply(200, path => getMockData(path));
      this.nock.get('/v1/health/service/serviceName-1')
        .reply(200, path => getMockData(path));
      this.nock.get('/v1/health/service/serviceName-2')
        .reply(200, path => getMockData(path));

      const services = await app.agent.consul.hook.syncServices();
      assert.notStrictEqual(Object.keys(services).length, Object.keys({}).length);
    });
  });

  describe('register service', () => {
    let app;
    before(async () => {
      this.nock.get('/v1/agent/self')
        .reply(200, path => getMockData(path));
      this.nock.get('/v1/catalog/services')
        .reply(200, path => getMockData(path));
      this.nock.get('/v1/health/service/serviceName-1')
        .reply(200, path => getMockData(path));
      this.nock.get('/v1/health/service/serviceName-2')
        .reply(200, path => getMockData(path));

      mock.consoleLevel('NONE');
      app = mock.app({
        baseDir: 'apps/consul-client',
        clean: true,
      });
      await app.ready();
    });
    afterEach(() => {
      mock.restore();
    });
    after(async () => {
      this.nock.put('/v1/agent/service/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .reply(200);
      this.nock.put('/v1/agent/check/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .reply(200);

      await app.close();
      nock.cleanAll();
    });

    it('register success', () => {
      this.nock.put('/v1/agent/service/register')
        .reply(200);
      return app.agent.consul.hook.registerService();
    });

    it('register delay connection 6s', async () => {
      this.nock.put('/v1/agent/service/register')
        .delayConnection(6000)
        .reply(200);

      try {
        await app.agent.consul.hook.registerService();
        throw new Error('should not run');
      } catch (e) {
        assert(/request timed out /.test(e.message));
      }
    });

    it('register fail from config not set client info', async () => {
      mock(app.config, 'consul', {
        ...app.config.consul,
        client: {}
      });
      this.nock.put('/v1/agent/service/register')
        .reply(200);
      try {
        await app.agent.consul.hook.registerService();
      } catch (e) {
        assert(e.message === 'client name is empty.');
      }
    });

    it('register fail from config client name is empty', async () => {
      mock(app.config, 'consul', {
        ...app.config.consul,
        client: {
          ...app.config.consul.client,
          name: '',
        }
      });
      this.nock.put('/v1/agent/service/register')
        .reply(200);
      try {
        await app.agent.consul.hook.registerService();
      } catch (e) {
        assert(e.message === 'client name is empty.');
      }
    });

    it('register fail from agent unhealthy, http code 500', async () => {
      this.nock.put('/v1/agent/service/register')
        .reply(500);
      try {
        await app.agent.consul.hook.registerService();
      } catch (e) {
        assert(e.message === 'internal server error');
      }
    });
  });

  describe('deregister service', () => {
    let app;
    before(async () => {
      this.nock.get('/v1/agent/self')
        .reply(200, path => getMockData(path));
      this.nock.get('/v1/catalog/services')
        .reply(200, path => getMockData(path));
      this.nock.get('/v1/health/service/serviceName-1')
        .reply(200, path => getMockData(path));
      this.nock.get('/v1/health/service/serviceName-2')
        .reply(200, path => getMockData(path));

      mock.consoleLevel('NONE');
      app = mock.app({
        baseDir: 'apps/consul-client',
        clean: true,
      });
      await app.ready();
    });
    afterEach(() => {
      mock.restore();
    });
    after(async () => {
      this.nock.put('/v1/agent/service/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .reply(200);
      this.nock.put('/v1/agent/check/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .reply(200);

      await app.close();
      nock.cleanAll();
    });

    it('deregister success', () => {
      this.nock.put('/v1/agent/service/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .reply(200);
      this.nock.put('/v1/agent/check/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .reply(200);
      return app.agent.consul.hook.deRegisterService();
    });

    it('deregister delay connection 6s', async () => {
      this.nock.put('/v1/agent/service/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .delayConnection(6000)
        .reply(200);
      this.nock.put('/v1/agent/check/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .delayConnection(6000)
        .reply(200);

      try {
        await app.agent.consul.hook.deRegisterService();
        throw new Error('should not run');
      } catch (e) {
        assert(/request timed out /.test(e.message));
      }
    });

    it('deregister fail from config not set client info', async () => {
      mock(app.config, 'consul', {
        ...app.config.consul,
        client: {}
      });
      this.nock.put('/v1/agent/service/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .reply(200);
      this.nock.put('/v1/agent/check/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .reply(200);
      try {
        await app.agent.consul.hook.deRegisterService();
      } catch (e) {
        assert(e.message === 'client id is empty.');
      }
    });

    it('deregister fail from config client id is empty', async () => {
      mock(app.config, 'consul', {
        ...app.config.consul,
        client: {
          ...app.config.consul.client,
          name: '',
        }
      });
      this.nock.put('/v1/agent/service/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .reply(200);
      this.nock.put('/v1/agent/check/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .reply(200);
      try {
        await app.agent.consul.hook.deRegisterService();
      } catch (e) {
        assert(e.message === 'client id is empty.');
      }
    });

    it('deregister fail from agent unhealthy, http code 500', async () => {
      this.nock.put('/v1/agent/service/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .reply(500);
      this.nock.put('/v1/agent/check/deregister/egg-consul-client-unittest-4cd4fc55fbcf6d6df3e019281be62b79')
        .reply(500);
      try {
        await app.agent.consul.hook.deRegisterService();
      } catch (e) {
        assert(e.message === 'internal server error');
      }
    });
  });
});
