<!--
 * @Description: 
 * @Author: kay
 * @Date: 2020-08-28 11:26:44
 * @LastEditTime: 2020-09-03 21:13:23
 * @LastEditors: kay
-->

# san-sdk.js 与 icfs cluster 交互

## new Cluster Client

```js
const { IcfsClient } = require('san-sdk.js');
// 微信小程序 fetch 使用 icbsc-fetch.js
const fetch = require('node-fetch');
const client = new IcfsClient('http://icfs.baasze.com:9094', {fetch});
```

## add

1、add 文件内容

文件内容 content 可以是 String，Buffer以及流等。

以 String 形式 add:

```js
const { ClusterClient } = require('san-sdk.js');
const fetch = require('node-fetch');
const client = new ClusterClient('http://icfs.baasze.com:9094', {fetch});

(async () => {
  let content = 'cluster test filse';
  let result = await client.add(content);
  console.log(result)
})();
```

以流形式 add:

```js
const { IcfsClient } = require('san-sdk.js');
const fetch = require('node-fetch');
const client = new IcfsClient('http://icfs.baasze.com:9094', {fetch});
const fs = require('fs');

(async () => {
  let result = await client.add(fs.createReadStream(__dirname + '/cluster.test.js'));
  console.log(result);
})();
``` 

2、add 带根目录文件

```js
const { IcfsClient } = require('san-sdk.js');
const fetch = require('node-fetch');
const client = new IcfsClient('http://icfs.baasze.com:9094', {fetch});

let rootDir = 'cluster';
let files = [{
  path: `${rootDir}/file1.txt`,
  // content could be a stream, a url, a Buffer, a File etc
  content: 'cluster one'
}, {
  path: `${rootDir}/file2.txt`,
  content: 'cluster two'
}, {
  path: `${rootDir}/file3.txt`,
  content: 'cluster three'
}];

(async () => {
  let dirCid = await client.add(files, rootDir);
  console.log('dirCid: ', dirCid);
})()
```

3、add Url

```js
const { IcfsClient } = require('san-sdk.js');
const fetch = require('node-fetch');
const client = new IcfsClient('http://icfs.baasze.com:9094', {fetch});
(async () => {
  var urlCid = await client.addUrl('http://san.baasze.com')
  console.log('urlCid: ', urlCid)
})()
```

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
cid | string | 文件 cid | add 带根目录文件返回的是根目录 cid

```
bafk43jqbec3jogyafk5hilvedlekzsnkmhvfh5etcromha6kn3zetetenss3q
```

4、add with replication

指定在集群中备份的副本数量, 不指定默认备份到 cluster 的节点

```js
const { ClusterClient } = require('san-sdk.js');
const fetch = require('node-fetch');
const client = new ClusterClient('http://icfs.baasze.com:9094', {fetch});

(async () => {
    var res
    // 指定在集群中备份的副本数量
    res = await client.add(date.toISOString(), { replication: 2 })
    console.log("cluster add replication 2: ", res)
})();
```

## pin

1、 pin add

```js
var cid = "bafk43jqbedlxm2c3zgnjiflvq5yc6ochhftxuqyf372b3f5ftzbwsudhm3tlk"
// 不配置 replication，默认 cluster 的所有节点都 pin add
res = await client.pinAdd(fileCid, {replication: 3})
console.log('pin add: ', res)
```

response:

```js
 {
  replication_factor_min: -1,
  replication_factor_max: -1,
  name: '',
  mode: 'recursive',
  shard_size: 0,
  user_allocations: null,
  expire_at: '0001-01-01T00:00:00Z',
  metadata: {},
  pin_update: null,
  cid: {
    '/': 'bafk43jqbedlxm2c3zgnjiflvq5yc6ochhftxuqyf372b3f5ftzbwsudhm3tlk'
  },
  type: 2,
  allocations: [],
  max_depth: -1,
  reference: null
}
```

2、 pin ls

```js
var cid = 
res = await client.pinLs()
console.log("pin ls: ", res)
```

response:

```js
[
  {
    replication_factor_min: -1,
    replication_factor_max: -1,
    name: '',
    mode: 'recursive',
    shard_size: 0,
    user_allocations: null,
    expire_at: '0001-01-01T00:00:00Z',
    metadata: null,
    pin_update: null,
    cid: {
      '/': 'bafk43jqbediebwlhj3p4ohzcctx2trgyywmsdr7a3n2son65wtijztdee5aso'
    },
    type: 2,
    allocations: [],
    max_depth: -1,
    reference: null
  },
  ...
]
```

3、 pin rm

```js
res = await client.pinRm("bafk43jqbedlxm2c3zgnjiflvq5yc6ochhftxuqyf372b3f5ftzbwsudhm3tlk")
console.log('pin rm: ', res)
```

response:

```js
 {
  replication_factor_min: -1,
  replication_factor_max: -1,
  name: '',
  mode: 'recursive',
  shard_size: 0,
  user_allocations: null,
  expire_at: '0001-01-01T00:00:00Z',
  metadata: {},
  pin_update: null,
  cid: {
    '/': 'bafk43jqbedlxm2c3zgnjiflvq5yc6ochhftxuqyf372b3f5ftzbwsudhm3tlk'
  },
  type: 2,
  allocations: [],
  max_depth: -1,
  reference: null
}
```

## peers

1、peers ls

列出所有的 cluster peer 

```js
res = await client.peersLs()
console.log('peers ls: ', res)
```

response:

```js
 [
  {
    id: 'bafzm3jqbeb76p4ovvrkmievnxn3ik6stl7zpgnhpqlfmrvocjnajmfldwx2gq',
    addresses: [
      '/ip4/127.0.0.1/tcp/9096/p2p/bafzm3jqbeb76p4ovvrkmievnxn3ik6stl7zpgnhpqlfmrvocjnajmfldwx2gq',
      '/ip4/192.168.100.107/tcp/9096/p2p/bafzm3jqbeb76p4ovvrkmievnxn3ik6stl7zpgnhpqlfmrvocjnajmfldwx2gq'
    ],
    cluster_peers: [
      'bafzm3jqbeb76p4ovvrkmievnxn3ik6stl7zpgnhpqlfmrvocjnajmfldwx2gq'
    ],
    cluster_peers_addresses: [],
    version: '0.13.0+git4f23851ee4746debc5416e50c86affd877fc758a',
    commit: '',
    rpc_protocol_version: '/icfscluster/0.12/rpc',
    error: '',
    icfs: {
      id: 'bafzm3jqbed7ly5l5a7oegff6f7dcsb5euyopwjyirgyp5u3zivh7wlusbgf6u',
      addresses: [Array],
      error: ''
    },
    peername: 'haha'
  }
]
```

2、peers rm

删除 cluster peer

```js
var peersId = "bafzm3jqbed7ly5l5a7oegff6f7dcsb5euyopwjyirgyp5u3zivh7wlusbgf6u"
res = await client.peersRm(peersId)
console.log('peers rm: ', res)
```

## status

```js
res = await client.status()
console.log('status of all cids: \n', res)
var fileCid = await icfsClient.add(date.toISOString())
res = await client.status(fileCid)
console.log('status of single cid: \n', res)
```

response:

```js
status of all cids: 
 [
  {
    cid: {
      '/': 'bafym3jqbedvaiq2sopkcwgkcuohjwiastjgluslnqecdsedirbvntyl2wmxty'
    },
    name: '',
    peer_map: {
      bafzm3jqbeb76p4ovvrkmievnxn3ik6stl7zpgnhpqlfmrvocjnajmfldwx2gq: [Object]
    }
  },
  ...
 ]

status of single cid: 
 [
  {
    cid: {
      '/': 'bafk43jqbedlxm2c3zgnjiflvq5yc6ochhftxuqyf372b3f5ftzbwsudhm3tlk'
    },
    name: '',
    peer_map: {
      bafzm3jqbeb76p4ovvrkmievnxn3ik6stl7zpgnhpqlfmrvocjnajmfldwx2gq: [Object]
    }
  }
]
```

## recover

```js
res = await client.recover()
console.log('recover all: \n', res)
var fileCid = await icfsClient.add(date.toISOString())
res = await client.recover(fileCid)
console.log('recover a cid: \n', res[0])
```

response:

```js
recover all: 
 [
  {
    cid: {
      '/': 'bafym3jqbebxv343poabtolx55y5xup2amephqb5rk35fxncikfyfnghqfk5uk'
    },
    name: '',
    peer_map: {
      bafzm3jqbeb76p4ovvrkmievnxn3ik6stl7zpgnhpqlfmrvocjnajmfldwx2gq: [Object]
    }
  },
  ...
 ]

recover a cid: 
 {
  cid: {
    '/': 'bafk43jqbedlxm2c3zgnjiflvq5yc6ochhftxuqyf372b3f5ftzbwsudhm3tlk'
  },
  name: '',
  peer_map: {
    bafzm3jqbeb76p4ovvrkmievnxn3ik6stl7zpgnhpqlfmrvocjnajmfldwx2gq: {
      peername: 'bafzm3jqbeb76p4ovvrkmievnxn3ik6stl7zpgnhpqlfmrvocjnajmfldwx2gq',
      status: 'unpinned',
      timestamp: '2020-08-28T11:24:56.3076+08:00',
      error: ''
    }
  }
 }
```

## health

1、health graph

```js
res = await client.healthGraph()
console.log('health graph: \n', res)
```

response:

```js
 {
  cluster_id: 'bafzm3jqbeb76p4ovvrkmievnxn3ik6stl7zpgnhpqlfmrvocjnajmfldwx2gq',
  id_to_peername: {
    bafzm3jqbeb76p4ovvrkmievnxn3ik6stl7zpgnhpqlfmrvocjnajmfldwx2gq: 'haha'
  },
  icfs_links: {
    bafzm3jqbed7ly5l5a7oegff6f7dcsb5euyopwjyirgyp5u3zivh7wlusbgf6u: [
      'bafzm3jqbebirvt7q5o2o35kgxr2vskstfvxhzztukp7xfhgd3vjkfexaznujy',
      'bafzm3jqbec7ulhfmm7s7ydt2mf32nbsjy4237mvzj5skzbkxrfxz7axghsyum'
    ]
  },
  cluster_links: {
    bafzm3jqbeb76p4ovvrkmievnxn3ik6stl7zpgnhpqlfmrvocjnajmfldwx2gq: []
  },
  cluster_trust_links: {
    bafzm3jqbeb76p4ovvrkmievnxn3ik6stl7zpgnhpqlfmrvocjnajmfldwx2gq: true
  },
  cluster_to_icfs: {
    bafzm3jqbeb76p4ovvrkmievnxn3ik6stl7zpgnhpqlfmrvocjnajmfldwx2gq: 'bafzm3jqbed7ly5l5a7oegff6f7dcsb5euyopwjyirgyp5u3zivh7wlusbgf6u'
  }
}
```

2、health metrics freespace

```js
res = await client.healthMetrics('freespace')
console.log('health metrics ping: \n', res)
```

response:

```js
 [
  {
    name: 'ping',
    peer: 'bafzm3jqbeb76p4ovvrkmievnxn3ik6stl7zpgnhpqlfmrvocjnajmfldwx2gq',
    value: '',
    expire: 1598585116008818000,
    valid: true,
    received_at: 1598585086011756000
  }
]
```

3、health metrics ping

```js
res = await client.healthMetrics('ping')
console.log('health metrics freespace: \n', res)
```

response:

```js
[
  {
    name: 'freespace',
    peer: 'bafzm3jqbeb76p4ovvrkmievnxn3ik6stl7zpgnhpqlfmrvocjnajmfldwx2gq',
    value: '0',
    expire: 1598585126213765000,
    valid: true,
    received_at: 1598585096216854000
  }
]
```