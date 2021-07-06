'use strict';

/**
 * egg-consul unittest config
 * @member Config#consul
 * @property {String} SOME_KEY - some description
 */


const os = require('os');
const crypto = require('crypto');

function md5(str) {
  const md5 = crypto.createHash('md5');
  return md5.update(str).digest('hex');
}

function getServerIpAddress() {
  const interfaces = os.networkInterfaces();
  const family = 'IPv4';

  for (const interfaceName in interfaces) {
    const items = interfaces[interfaceName];
    if (items) {
      for (let j = 0; j < items.length; j++) {
        const item = items[j];
        if (item.family === family && item.address !== '127.0.0.1' && !item.internal) {
          return item.address;
        }
      }
    }
  }

  return '';
}

const serverIpAddress = getServerIpAddress();
const serverPort = 7001;
const clientName = 'egg-consul-client-unittest';
const clientId = `${clientName}-${md5(os.hostname())}`;

exports.consul = {
  server: {
    host: '127.0.0.1',
    port: 8500,
    secure: false,
    promisify: true,
  },
  autoRegister: true,
  client: {
    name: clientName, // 服务每次
    id: clientId, // 服务Id，推荐用生成，在多实例情况下确保唯一性
    tags: [ 'egg-consul-client' ], // 标签信息
    address: serverIpAddress, // 服务地址
    port: serverPort, // 服务端口号
    check: {
      http: `http://${serverIpAddress}:${serverPort}/healthcheck`, // http服务地址
      interval: '5s', // 健康检测轮询时间
      timeout: '2s', // 超时时间
      status: 'critical', // 初始化服务状态
    },
  },
};
