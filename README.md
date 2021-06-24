# egg-consul-client

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-consul-client.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-consul-client
[travis-image]: https://img.shields.io/travis/eggjs/egg-consul-client.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-consul-client
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-consul-client.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-consul-client?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-consul-client.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-consul-client
[snyk-image]: https://snyk.io/test/npm/egg-consul-client/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-consul-client
[download-image]: https://img.shields.io/npm/dm/egg-consul-client.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-consul-client

consul-client

此插件基于 [consul](https://github.com/silas/node-consul) 实现简单的配置封装。


## 依赖说明

### 依赖的 egg 版本

egg-consul-client 版本 | egg 1.x
--- | ---
1.x | 😁
0.x | ❌

## 安装

```bash
$ npm i egg-consul-client --save
```

## 开启插件

```js
// config/plugin.js
exports.consul = {
  enable: true,
  package: 'egg-consul-client',
};
```

## 使用场景

### Why and What

Egg其中特性是能在一个应用实例里管理多个Worker进程，提高CPU使用率，但是如果把整个Consul服务注册流程放在 Worker 上实现，会导致注册了多个services，此框架改由 `agent` 实现，代表整个应用实例，实现服务注册、健康检查、KV 等功能。

更多信息请移步阅读：
- [多进程研发模式增强](https://eggjs.org/zh-cn/advanced/cluster-client.html)
- [多进程模型和进程间通讯](https://eggjs.org/zh-cn/core/cluster-and-ipc.html)
- [Egg加载器及生命周期](https://eggjs.org/zh-cn/advanced/loader.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)

### How
描述这个插件是怎样使用的，具体的示例代码，甚至提供一个完整的示例，并给出链接。

## 详细配置

请到 [config/config.default.js](config/config.default.js) 查看详细配置项说明。

```javascript
// config/config.[env].js
config.consul = {
  server: {                                            // required, consul agent 服务配置
    host: '127.0.0.1',                                 // consul agent服务IP（String, default: 127.0.0.1）
    port: 8500,                                        // consul agent服务端口（Integer, default: 8500）
    secure: true,                                      // 启用 HTTPS（Boolean, default: false）
    promisify: true,                                   // 启动 Promise 风格，默认为 Callback（Boolean|Function, optional）
  },
  client: {                                            // required, consul service 配置
    name: serviceName,                                 // 注册的服务名称（String）
    id: '',                                            // 服务注册标识（String, optional）
    tags: ['serviceTag1', 'serviceTag2'],              // 服务标签（String[], optional）
    address: '10.4.146.241',                           // 注册的服务地址（String, optional）
    port: 7001,                                        // 注册的服务端口（Integer, optional）
    check: {                                           // 健康检查配置（Object, optional）
      http: 'http://10.4.146.241:7001/healthcheck',    // 健康检查URL
      interval: '5s',                                  // 健康检查频率
      timeout: '5s',                                   // 健康检查超时时间
      status: 'critical',                              // 初始化服务状态（String, optional）
    },
    checks: [],                                          // 有多个检查的路径，可采用对象数组形式，参数参照check的（Object[], optional）
  },
};
```

## 提问交流

请到 [egg issues](https://github.com/eggjs/egg/issues) 异步交流。

## License

[MIT](LICENSE)
