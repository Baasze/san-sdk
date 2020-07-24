<!--
 * @Description: 
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-06-01 11:27:41
 * @LastEditTime: 2020-07-24 12:07:12
 * @LastEditors: kay
--> 

# san-sdk.js 与 icfs 分布式存储交互

## new Client

```js
const { IcfsClient } = require('san-sdk.js');
// 微信小程序 fetch 使用 icbsc-fetch.js
const fetch = require('node-fetch');
const client = new IcfsClient('http://icfs.baasze.com:5001', {fetch});
```

## add

1、add 文件内容

文件内容 content 可以是 String，Buffer以及流等。

以 String 形式 add:

```js
const { IcfsClient } = require('san-sdk.js');
const fetch = require('node-fetch');
const client = new IcfsClient('http://icfs:baasze.com:5001', {fetch});

(async () => {
  let content = 'my test file.';
  let result = await client.add(content);
  console.log(result)
})();
```

以流形式 add:

```js
const { IcfsClient } = require('san-sdk.js');
const fetch = require('node-fetch');
const client = new IcfsClient('http://icfs.baasze.com:5001', {fetch});
const fs = require('fs');

(async () => {
  let result = await client.add(fs.createReadStream(__dirname + '/client.test.js'));
  console.log(result);
})();
``` 

2、add 带根目录文件

```js
const { IcfsClient } = require('san-sdk.js');
const fetch = require('node-fetch');
const client = new IcfsClient('http://icfs.baasze.com:5001', {fetch});

let rootDir = 'test';
let files = [{
  path: `${rootDir}/file1.txt`,
  // content could be a stream, a url, a Buffer, a File etc
  content: 'one'
}, {
  path: `${rootDir}/file2.txt`,
  content: 'two'
}, {
  path: `${rootDir}/file3.txt`,
  content: 'three'
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
const client = new IcfsClient('http://icfs.baasze.com:5001', {fetch});
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

## get

```js
  const { map } = require('streaming-iterables');
  const path = require('path');
  const pipe = require('it-pipe');
  const fs = require('fs');
  const require = require('node-fetch');
  const toIterable = require('stream-to-it');
  const { IpfsClient }  = require('san-sdk.js');

  const client = new IpfsClient('http://icfs.baasze.com:5001', { fetch });
  let output = './';
  // 流形式 get 并存储于指定路径
  (async () => {
    // option default : {save: false}
    for await (const file of client.get(cid, {save: true})){
      const fullFilePath = path.join(output, file.path)
      if (file.content) {
        await fs.promises.mkdir(path.join(output, path.dirname(file.path)), { recursive: true })
        await pipe(
          file.content,
          map((chunk) => chunk.slice()),
          toIterable.sink(fs.createWriteStream(fullFilePath))
        )
      } else (
        await fs.promises.mkdir(fullFilePath, {recursive: true})
      )
    }

    // return {path: cid, content: BufferList}
    var fileCid = 'bafk43jqbeclzwhefsazzgyyjvch2osvxxg5h42ftwg66hhyx2r2qbkwgzy5ue'
    var res = await client.get(fileCid)
    console.log(res)
  })();
```

## cat

cat 返回的结果 buffer

```js
const { IcfsClient } = require('san-sdk.js');
const fetch = require('node-fetch');
const client = new IcfsClient('http://icfs.baasze.com:5001', {fetch});

(async () => {
  var fileCid = 'bafk43jqbealhgo5gojbtmxho44abq5fznrul722d4id36sirdpcnzceavivfw'
  const res = await client.cat(fileCid)
  console.log('cat: ', res.toString())
})();
```

## ls

```js
const { IcfsClient } = require('san-sdk.js');
const fetch = require('node-fetch');
const client = new IcfsClient('http://icfs.baasze.com:5001', {fetch});

(async()=>{
  var res = await client.ls("bafym3jqbedlgf7pqw6ednj4spj4yv2tgmqoeiwjfkr726gbj4tzssvn3rqqk4");
  console.log(res)
})()
```

respose:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
name | string | 文件名 |
hash | string | 文件 cid |
size | number | 文件大小 |
type | string | 文件类型 |
depth | number | 深度 |

```js
[
  {
    name: 'blockchain.test.js',
    hash: 'bafk43jqbecoszgqzq4evnv4ixfhcycv6eegrcsv2kdyeq4iiqc5ymwdcq3v4k',
    size: 1927,
    type: 'file',
    depth: 1
  },
  {
    name: 'client.test.js',
    hash: 'bafk43jqbeamycvw7tfj4zwxcng3oanql23sqah7cup74jdmjuam2chicqe4ao',
    size: 2561,
    type: 'file',
    depth: 1
  },
  {
    name: 'crypto.test.ts',
    hash: 'bafk43jqbeakap2qyidi3utbb5d7mpprfmanfj4f25docjbuvkrrnyiuoqbwm4',
    size: 1986,
    type: 'file',
    depth: 1
  }
]
```

## pin

1、 pin add

```js
var res = await client.pinAdd("bafym3jqbedlgf7pqw6ednj4spj4yv2tgmqoeiwjfkr726gbj4tzssvn3rqqk4")
console.log('pin add: ', res)
```

response:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
cid | string | cid |

2、 pin ls

```js
res = await client.pinLs("bafym3jqbedlgf7pqw6ednj4spj4yv2tgmqoeiwjfkr726gbj4tzssvn3rqqk4")
console.log("pin ls: ", res)
```

response:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
cid | string | cid |
type | string | pin 状态 |

3、 pin rm

```js
res = await client.pinRm("bafym3jqbedlgf7pqw6ednj4spj4yv2tgmqoeiwjfkr726gbj4tzssvn3rqqk4")
console.log('pin rm: ', res)
```

response:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
cid | string | cid |

## key

1、key gen 

创建秘钥对默认 sm2

```js
var keyName = "mykey"
var res = await client.keyGen(keyName)
console.log('key gen: ', res)
```

response:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
name | string | 密钥对名称 |
id | string | key hash |

2、key list

显示所有密钥对

```js
var res = await client.keyList()
console.log('key list:', res)
```

response:

```js
[
  {
    name: 'self',
    id: 'bafzm3jqbecc3jybbwak5t7qbc6hdkv46jac2sqptfw53tl75nuwpj3ftoovbm'
  },
  {
    name: 'mykey',
    id: 'bafzm3jqbea4ghtxynopvpr4nfdub3oy4fqcoz7wg5w3qln7fntbcx3kip5dky'
  }
]
```

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
`Promise<keyResult[]>` | keyResult[] | 数组包含所有 key
keyResult.name | string | 密钥对名称 |
keyResult.id | string | key hash |

3、key rm 

删除密钥对

```js
var keyName = "mykey1"
var res = await client.keyRm(keyName)
console.log('key rm: ', res)
```

response:

```js
{
  name: 'mykey1',
  id: 'bafzm3jqbea7jvjise4xgk2eiz2at6esord4zhfqxuukcfqqj4p4wdsuzulw3u'
}
```

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
name | string | 密钥对名称 |
id | string | key hash |

## swarm

1、swarm peers

所有已经连接的 peers

```js
var res = await client.swarmPeers()
console.log('swarm peers: ', res);
```

response:

```js
[
  {
    addr: '/ip4/121.89.208.188/tcp/4001',
    peer: 'bafzm3jqbec7ulhfmm7s7ydt2mf32nbsjy4237mvzj5skzbkxrfxz7axghsyum',
    direction: 0
  }
]
```

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
`Promise<swarmPeersResult[]>` | swarmPeersResult[] | 数组包含所有连接的 peers
swarmPeersResult.addr | string | peer 地址 |
swarmPeersResult.peer | string | peer id |
swarmPeersResult.direction | number | key hash |

2、swarm addrs

所有已知 peer 的地址列表

```js
var res = await client.swarmAddrs()
console.log('swram addrs: ', res)
```

response:

```js
[
  {
    id: 'bafzm3jqbec7ulhfmm7s7ydt2mf32nbsjy4237mvzj5skzbkxrfxz7axghsyum',
    addrs: [
      '/dns4/icfs.baasze.com/tcp/4001',
      '/ip4/172.17.0.1/tcp/4001',
      '/ip4/172.26.142.75/tcp/4001'
    ]
  }
]
```

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
`Promise<swarmAddrsResult[]>` | `Array<swarmAddrsResult>` | 数组包含所有连接的 peer 的地址
swarmPeersResult.id | string | peer id |
swarmPeersResult.addrs | `Array<string>` | peer 地址|

## dag

1、dag put

`dag put` 支持带 cid 引用的 object 

Parameters:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
dagNode| Object | 遵循 IPLD 格式之一的 DAG 节点

```js
var obj = {
  z: 'icfs'
}
// dag put input 类型 object, string
var cid = await client.dagPut(obj)
console.log('dag put obj: ', cid)

var obj1 = {
  a: 1,
  b: [1, 2, 3],
  c: {
    ca: [5, 6, 7],
    cb: {'/': cid} // cb 关联到 obj 对象
  }
}
// dag put obj1 带 links 到 obj 对象
cid = await client.dagPut(obj1)
console.log('dag put obj1: ', cid)
```

response :

```
bafy43jqbeanvradi5xifj4c656xv427lzv7kv6xcuaqfxymg5cdsflns2pa5a
```

类型 | 说明 | 备注
:-: | :-: | :-:
`Promise<string>`| cid |

2、dag resolve

Parameters:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
cid | string | cid
path | string | DAG 要解析的路径（可选）

```js
var res = await client.dagResolve('bafy43jqbeanvradi5xifj4c656xv427lzv7kv6xcuaqfxymg5cdsflns2pa5a', 'a')
console.log('dag resolve: ', res)
```

response: 

```js
{
  cid: 'bafy43jqbedmog7g3cijdypqujmfiqa6sjzcxmnhjh5rfqloywznaez734ltyu',
  remPath: 'a'
}
```

类型 | 说明 | 备注
:-: | :-: | :-:
`Promise<dagResolveResult>`| dag resolve 解析结果 |

`dagResolveResult`: 
- `cid`: 解析的结果 cid
- `remPath`: 节点无法解析路径的其余部分

3、dagGet

Parameters:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
cid | string | cid
path | string | DAG 要解析的路径（可选）

```js
var cid = 'bafy43jqbeanvradi5xifj4c656xv427lzv7kv6xcuaqfxymg5cdsflns2pa5a' // obj1 cid
var res = await client.dagGet('bafy43jqbeanvradi5xifj4c656xv427lzv7kv6xcuaqfxymg5cdsflns2pa5a', 'c/ca')
console.log('dag get "obj1.c.ca": ', res)

// dag get obj1 的 links cid 也就是 obj
res = await client.dagGet(cid, 'c/cb')
console.log('dag get "obj": ', res)

```

respose: 

```js
dag get obj1.c.ca: { "value": [ 5, 6, 7 ], "remainderPath": "" }

dag get obj: { "value": { "z": "icfs" }, "remainderPath": "" }

```

类型 | 说明 | 备注
:-: | :-: | :-:
`Promise<dagGetResult>`| dag get 结果|

`dagGetResult`: 
- `value`: dag get 获取的值
- `remainderPath`: 节点无法解析路径的其余部分

4、dag put url

Parameters:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
dagNode| Object | 遵循 IPLD 格式之一的 DAG 节点

```js
// dag put url
var url = 'https://w3c-ccg.github.io/did-spec/contexts/did-v1.jsonld'
var cid = await client.dagPut(url)
console.log('dag put url: ', cid)
```

response :

```
bafy43jqbedcfikcertnxzdkg2zlnpnfh2747nhkaukdr236cffboyfxu3u7zi
```

类型 | 说明 | 备注
:-: | :-: | :-:
`Promise<string>`| cid |

## name

1、name publish

发布 IPNS 名称

Parameters:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
path | string | 发布内容的 cid
key | string | 使用的 key 名称（可选, 默认为"self"）

```js
var res = await client.namePublish("bafym3jqbedlgf7pqw6ednj4spj4yv2tgmqoeiwjfkr726gbj4tzssvn3rqqk4", "mykey")
console.log('name publish: ', res)
```

reponse:

```js
name publish:  {
  name: 'bafzm3jqbea4ghtxynopvpr4nfdub3oy4fqcoz7wg5w3qln7fntbcx3kip5dky',
  value: '/ipfs/bafym3jqbedlgf7pqw6ednj4spj4yv2tgmqoeiwjfkr726gbj4tzssvn3rqqk4'
}
```

类型 | 说明 | 备注
:-: | :-: | :-:
`Promise<namePublishResult>`| name publish 结果|

`namePublishResult`:
- `name`: 内容发布的名称
- `value`: 名称指向的真实的地址

类型 | 说明 | 备注
:-: | :-: | :-:
`Promise<{Path: string}[]>`| name resolve 结果|

Array<{Path: string}>:
- `Path`: 解析出来的真实的地址

2、name pubsub state

```js
var res = await client.namePubsubState()
console.log('name pubsub state: ', res)
```

response: 

```js
{ enabled: true }
```

类型 | 说明 | 备注
:-: | :-: | :-:
`Promise<{enabled: Boolean}>`| pubsub 的状态|

3、name pubsub subs

```js
var res = await client.namePubsubSubs()
console.log('name pubsub subs: ', res)
```

response: 

```js
[
  '/ipns/bafzm3jqbecc3jybbwak5t7qbc6hdkv46jac2sqptfw53tl75nuwpj3ftoovbm',
  '/ipns/bafzm3jqbea4ghtxynopvpr4nfdub3oy4fqcoz7wg5w3qln7fntbcx3kip5dky'
]
```

类型 | 说明 | 备注
:-: | :-: | :-:
`Promise<string[]>`| 当前所有订阅 |

4、name pubsub cancel

Parameters:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
name | string | 需要取消订阅的名称

```js
var name = 'bafzm3jqbea4ghtxynopvpr4nfdub3oy4fqcoz7wg5w3qln7fntbcx3kip5dky'
var res = await client.namePubsubCancel(name)
console.log('name pubsub cancel: ', res)
```

response:

```js
{ canceled: true }
```

类型 | 说明 | 备注
:-: | :-: | :-:
`Promise<{canceled: Boolean}>`| 取消状态 |

## bootstrap

1、bootstrap list

```js
var res = await client.bootstrapList()
console.log("bootstrap list:", res)
```

response:

```js
{
  Peers: [
    '/dns4/icfs.baasze.com/tcp/4001/p2p/bafzm3jqbec7ulhfmm7s7ydt2mf32nbsjy4237mvzj5skzbkxrfxz7axghsyum'
  ]
}
```

类型 | 说明 | 备注
:-: | :-: | :-:
`Promise<{Peers: string[]}>`| 所有 bootstrap 地址 |

2、bootstrap add

Parameters:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
peer | string | peer 地址

```js
var res = await client.bootstrapAdd('/dns4/icfs.baasze.com/tcp/4001/p2p/bafzm3jqbec7ulhfmm7s7ydt2mf32nbsjy4237mvzj5skzbkxrfxz7axghsyum')
console.log('bootstrap add:', res)
```

response:

```js
{
  Peers: [
    '/dns4/icfs.baasze.com/tcp/4001/p2p/bafzm3jqbec7ulhfmm7s7ydt2mf32nbsjy4237mvzj5skzbkxrfxz7axghsyum'
  ]
}
```

类型 | 说明 | 备注
:-: | :-: | :-:
`Promise<{Peers: string[]}>`| 所有已加入的 bootstrap 地址 |

3、bootstrap rm

Parameters:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
peer | string | peer 地址

```js
var res = await client.bootstrapRm('/dns4/icfs.baasze.com/tcp/4001/p2p/bafzm3jqbec7ulhfmm7s7ydt2mf32nbsjy4237mvzj5skzbkxrfxz7axghsyum')
console.log('bootstrap add:', res)
```

response:

```js
{
  Peers: [
    '/dns4/icfs.baasze.com/tcp/4001/p2p/bafzm3jqbec7ulhfmm7s7ydt2mf32nbsjy4237mvzj5skzbkxrfxz7axghsyum'
  ]
}
```

类型 | 说明 | 备注
:-: | :-: | :-:
`Promise<{Peers: string[]}>`| 所有删除的 bootstrap 地址 |

## pubsub

1、ls

节点订阅的 topicIDs 列表

```js
var res = await client.pubsubLs()
console.log("pubsub ls :", res)
```

response:

```json
[
  "/record/L2lwbnMvzaYBIPWGbKznrINMM9lCx8IPfU4qonFl5B9Fzcg23CWfkf1T",
  "/record/L2lwbnMvzaYBIFEaz_DrtO31Rrx1WSpTLW585nRT_3Kcw91SopLgy2ic"
]
```

2、peers

订阅了 `topic` 的 peer ID 的列表

```js
var topic = 'fly to the moon'
var res = await client.pubsubPeers(topic)
console.log('pubsub peers', res)
```

response:

```json
[ "bafzm3jqbec7ulhfmm7s7ydt2mf32nbsjy4237mvzj5skzbkxrfxz7axghsyum" ]
```

3、pub

```js
console.log('pubsub pub')
await client.pubsubPub(topic, 'to the moon')
```

response: 

`Promise<void>` , 否则抛出异常

4、sub

订阅功能只支持在 node 端使用，不支持小程序

```js
// sub 的回调处理 msg type {from: Buffer, data: Buffer, seqno: Buffer, topicIDs: Array}
function handler (msg){
  console.log(msg)
}
// sub topic 
await client.pubsubSub(topic, handler)
```

handler msg:

```js
{
  "from": <Buffer cd a6 01 20 51 1a cf f0 eb b4 ed f5 46 bc 75 59 2a 53 2d 6e 7c e6 74 53 ff 72 9c c3 dd 52 a2 92 e0 cb 68 9c>,
  "data": <Buffer 68 61 68 61>,
  "seqno": <Buffer 16 24 58 8c ff 42 8d fb>,
  "topicIDs": [ "fly to the moon" ]
}
```

5、unsub

取消订阅 `topic`

```js
// sub 的回调处理 msg type {from: Buffer, data: Buffer, seqno: Buffer, topicIDs: Array}
function handler (msg){
  console.log(msg)
}
// sub topic 
await client.pubsubUnsub(topic, handler)
```

response:

`Promise<void>` , 否则抛出异常