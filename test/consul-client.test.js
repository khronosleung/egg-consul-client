'use strict';

const mock = require('egg-mock');
// const nock = require('nock');
//
// function setupNock(scope) {
//   if (scope._nockSetuped) {
//     return;
//   }
//
//   scope._nockSetuped = true;
//
//   Object.defineProperty(scope, 'nock', {
//     configurable: true,
//     enumerable: true,
//     get() {
//       nock.disableNetConnect();
//       const nockInstance = nock('http://127.0.0.1:8500');
//       nockInstance.get(uri => {
//         console.log(uri);
//       });
//       return nockInstance;
//     },
//   });
// }

describe('test/consul-client.test.js', () => {
  // setupNock(this);
  // this.nock.get(uri => {
  //   console.log(uri);
  //   return true;
  // }).reply(200, { ok: true });
  // this.nock.get('/v1/agent/self').reply(200, { ok: true });
  // this.nock.get('/v1/agent/service/register').reply(200, { ok: true });

  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/consul-client-test',
      clean: true,
    });
    return app.ready();
  });

  after(() => {
    app.close();
  });

  beforeEach(() => {

  });

  afterEach(() => {
    // nock.cleanAll();
    mock.restore();
  });

  it('should GET /healthcheck', () => {
    // this.nock.get(uri => {
    //   console.log(uri);
    //   return true;
    // }).reply(200, { ok: true });
    return app.httpRequest()
      .get('/healthcheck')
      .expect('ok')
      .expect(200);
  });
});
