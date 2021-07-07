# egg-consul-client

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-consul-client.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-consul-client
[travis-image]: https://img.shields.io/travis/kidneyleung/egg-consul-client.svg?style=flat-square
[travis-url]: https://travis-ci.org/kidneyleung/egg-consul-client
[codecov-image]: https://img.shields.io/codecov/c/github/kidneyleung/egg-consul-client.svg?style=flat-square
[codecov-url]: https://codecov.io/github/kidneyleung/egg-consul-client?branch=master
[david-image]: https://img.shields.io/david/kidneyleung/egg-consul-client.svg?style=flat-square
[david-url]: https://david-dm.org/kidneyleung/egg-consul-client
[snyk-image]: https://snyk.io/test/npm/egg-consul-client/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-consul-client
[download-image]: https://img.shields.io/npm/dm/egg-consul-client.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-consul-client

egg 框架的 consul-client 插件

此插件基于 [consul](https://github.com/silas/node-consul) 实现简单的配置封装，并增加了一些功能 hook api。


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

Egg其中特性是能在一个应用实例里管理多个Worker进程，从而提高CPU使用率，但是如果把整个Consul服务注册流程放在 Worker 上实现，会导致注册了多个services，此框架由 `agent` 实现服务注册，由 `agent` 代表整个应用实例，并可以沿用 `consul` 的API，例如：服务注册、健康检查、KV 等功能，`agent` 和 `worker` 之间通过 `IPC` 进行通信。

更多信息请移步阅读：
- [多进程研发模式增强](https://eggjs.org/zh-cn/advanced/cluster-client.html)
- [多进程模型和进程间通讯](https://eggjs.org/zh-cn/core/cluster-and-ipc.html)
- [Egg加载器及生命周期](https://eggjs.org/zh-cn/advanced/loader.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)

### 用例

#### trigger(apiName, param)

代理调用 [node-consul API](https://github.com/silas/node-consul#documentation) Api。

参数
 - apiName(String): api名
 - param(Any, optional): api参数


用例：
```javascript
await app.consul.trigger('agent.self');
```

结果：
```json
{
  "Config": {
    "Bootstrap": true,
    "Server": true,
    "Datacenter": "dc1",
    "DataDir": "/tmp/node1/data",
    "DNSRecursor": "",
    "DNSConfig": {
      "NodeTTL": 0,
      "ServiceTTL": null,
      "AllowStale": false,
      "MaxStale": 5000000000
    },
    "Domain": "consul.",
    "LogLevel": "INFO",
    "NodeName": "node1",
    "ClientAddr": "127.0.0.1",
    "BindAddr": "127.0.0.1",
    "AdvertiseAddr": "127.0.0.1",
    "Ports": {
      "DNS": 8600,
      "HTTP": 8500,
      "RPC": 8400,
      "SerfLan": 8301,
      "SerfWan": 8302,
      "Server": 8300
    },
    "LeaveOnTerm": false,
    "SkipLeaveOnInt": false,
    "StatsiteAddr": "",
    "Protocol": 2,
    "EnableDebug": false,
    "VerifyIncoming": false,
    "VerifyOutgoing": false,
    "CAFile": "",
    "CertFile": "",
    "KeyFile": "",
    "ServerName": "",
    "StartJoin": [],
    "UiDir": "",
    "PidFile": "/tmp/node1/pid",
    "EnableSyslog": false,
    "SyslogFacility": "LOCAL0",
    "RejoinAfterLeave": false,
    "CheckUpdateInterval": 300000000000,
    "Revision": "441d613e1bd96254c78c46ee7c1b35c161fc7295+CHANGES",
    "Version": "0.3.0",
    "VersionPrerelease": ""
  },
  "Member": {
    "Name": "node1",
    "Addr": "127.0.0.1",
    "Port": 8301,
    "Tags": {
      "bootstrap": "1",
      "build": "0.3.0:441d613e",
      "dc": "dc1",
      "port": "8300",
      "role": "consul",
      "vsn": "2",
      "vsn_max": "2",
      "vsn_min": "1"
    },
    "Status": 1,
    "ProtocolMin": 1,
    "ProtocolMax": 2,
    "ProtocolCur": 2,
    "DelegateMin": 2,
    "DelegateMax": 4,
    "DelegateCur": 4
  }
}
```

##### hook

基于 consul api，将一些常用api组合，进行打包封装。


##### hook.registerService

注册服务。

内部关联的Api：
 - `agent.service.register`

用例：
```javascript
await app.consul.trigger('hook.registerService');
```


##### hook.deRegisterService

注销已注册服务。

内部关联的Api：
 - `agent.service.deregister`
 - `agent.check.deregister`

用例：
```javascript
await app.consul.trigger('hook.deRegisterService');
```


## 详细配置

请到 [config/config.default.js](config/config.default.js) 查看详细配置项说明。

```javascript
// config/config.[env].js
config.consul = {
  autoRegister: true,                                  // 是否自动注册服务
  server: {                                            // required, consul agent 服务配置
    host: '127.0.0.1',                                 // consul agent服务IP（String, default: 127.0.0.1）
    port: 8500,                                        // consul agent服务端口（Integer, default: 8500）
    secure: false,                                     // 启用 HTTPS（Boolean, default: false）
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
    checks: [],                                        // 有多个检查的路径，可采用对象数组形式，参数参照check的（Object[], optional）
  },
};
```

## 提问交流

请到 [egg-consul-client issues](https://github.com/kidneyleung/egg-consul-client/issues) 异步交流。

## License

[MIT](LICENSE)
