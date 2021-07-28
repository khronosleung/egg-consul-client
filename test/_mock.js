module.exports = {
  '/v1/agent/self': () => {
    return { Stats: { serf_lan: { health_score: '0' } } };
  },
  '/v1/catalog/services': () => {
    return {
      'serviceName-1': ['tag-1-1', 'tag-1-2', 'tag-1-3'],
      'serviceName-2': ['tag-2-1', 'tag-2-2', 'tag-2-3'],
    };
  },
  '/v1/health/service/serviceName-1': () => {
    return [{
      "Node": {
        "ID": "2699f173-c2fb-dd71-900d-77f4f5a2ce2c",
        "Node": "service-node-1-56fb745dbc-psbzh",
        "Address": "10.3.114.128",
        "Datacenter": "consul-dc",
        "TaggedAddresses": {
          "lan": "10.3.114.128",
          "wan": "10.3.114.128"
        },
        "Meta": {
          "consul-network-segment": ""
        },
        "CreateIndex": 13476191,
        "ModifyIndex": 13476194
      },
      "Service": {
        "ID": "serviceName-1-530f71df-f1bb-56ae-9793-d40015f7595a",
        "Service": "serviceName-1",
        "Tags": [
          "tag-1",
          "tag-2",
          "tag-3"
        ],
        "Address": "10.3.114.128",
        "Meta": null,
        "Port": 7001,
        "Weights": {
          "Passing": 1,
          "Warning": 1
        },
        "EnableTagOverride": false,
        "ProxyDestination": "",
        "Proxy": {},
        "Connect": {},
        "CreateIndex": 13476201,
        "ModifyIndex": 13476201
      },
      "Checks": [
        {
          "Node": "service-node-1-56fb745dbc-psbzh",
          "CheckID": "serfHealth",
          "Name": "Serf Health Status",
          "Status": "passing",
          "Notes": "",
          "Output": "Agent alive and reachable",
          "ServiceID": "",
          "ServiceName": "",
          "ServiceTags": [],
          "Definition": {},
          "CreateIndex": 13476191,
          "ModifyIndex": 13476191
        },
        {
          "Node": "service-node-1-56fb745dbc-psbzh",
          "CheckID": "service:serviceName-1-530f71df-f1bb-56ae-9793-d40015f7595a",
          "Name": "Service 'serviceName-1' check",
          "Status": "passing",
          "Notes": "",
          "Output": "HTTP GET http://10.3.114.128:7001/healthcheck: 200 OK Output: {\"now\":1627442810721}",
          "ServiceID": "serviceName-1-530f71df-f1bb-56ae-9793-d40015f7595a",
          "ServiceName": "serviceName-1",
          "ServiceTags": [
            "tag-1",
            "tag-2",
            "tag-3"
          ],
          "Definition": {},
          "CreateIndex": 13476201,
          "ModifyIndex": 13501746
        }
      ]
    }];
  },
  '/v1/health/service/serviceName-2': () => {
    return [{
      "Node": {
        "ID": "f9869613-5302-a0d7-b594-6fe93e44cff9",
        "Node": "service-node-2-57958d96ff-f9f7s",
        "Address": "10.3.114.118",
        "Datacenter": "consul-dc",
        "TaggedAddresses": {
          "lan": "10.3.114.118",
          "wan": "10.3.114.118"
        },
        "Meta": {
          "consul-network-segment": ""
        },
        "CreateIndex": 13474385,
        "ModifyIndex": 13474388
      },
      "Service": {
        "ID": "serviceName-2-7e4d40d7-aad0-58ad-8e16-b3905f4eda22",
        "Service": "serviceName-2",
        "Tags": [
          "tag-1",
          "tag-2",
          "tag-3"
        ],
        "Address": "10.3.114.118",
        "Meta": null,
        "Port": 7001,
        "Weights": {
          "Passing": 1,
          "Warning": 1
        },
        "EnableTagOverride": false,
        "ProxyDestination": "",
        "Proxy": {},
        "Connect": {},
        "CreateIndex": 13474394,
        "ModifyIndex": 13474394
      },
      "Checks": [
        {
          "Node": "service-node-2-57958d96ff-f9f7s",
          "CheckID": "serfHealth",
          "Name": "Serf Health Status",
          "Status": "passing",
          "Notes": "",
          "Output": "Agent alive and reachable",
          "ServiceID": "",
          "ServiceName": "",
          "ServiceTags": [],
          "Definition": {},
          "CreateIndex": 13474385,
          "ModifyIndex": 13477605
        },
        {
          "Node": "service-node-2-57958d96ff-f9f7s",
          "CheckID": "service:serviceName-2-7e4d40d7-aad0-58ad-8e16-b3905f4eda22",
          "Name": "Service 'serviceName-2' check",
          "Status": "passing",
          "Notes": "",
          "Output": "HTTP GET http://10.3.114.118:7001/healthcheck: 200 OK Output: {\"now\":1627442761919}",
          "ServiceID": "serviceName-2-7e4d40d7-aad0-58ad-8e16-b3905f4eda22",
          "ServiceName": "serviceName-2",
          "ServiceTags": [
            "tag-1",
            "tag-2",
            "tag-3"
          ],
          "Definition": {},
          "CreateIndex": 13474394,
          "ModifyIndex": 13501726
        }
      ]
    }];
  },
};
