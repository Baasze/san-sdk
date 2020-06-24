<!--
 * @Description: 
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-06-01 11:27:41
 * @LastEditTime: 2020-06-05 18:35:02
 * @LastEditors: kay
--> 

# san-sdk.js 与 icbs 区块链交互

## 基本配置

``` js
const { Api, JsonRpc, JsSignatureProvider } = require('san-sdk.js');
const fetch = require('node-fetch');
const rpc = new JsonRpc('http://121.89.208.188:8888', { fetch });

const creator = 'creatortest1'; // 交易发起账户
const permission = 'active'; // 交易发起账户权限
const privateKey = "PVT_SM2_2LnHnaPp9Ktfhiqe9HtuZNP7Nm5ZAKHWGTLnsMq8g2fApC67D5"; // 交易发起账户私钥
const signatureProvider = new JsSignatureProvider([privateKey]);
const api = new Api({ rpc, signatureProvider });
```

## 交易

以新建账户为例

request:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
actions | Array | action数组 | 
actions[x].account | string | 智能合约账户名 |
actions[x].name | string | 智能合约名称 |
actions[x].authorization | Array | 交易授权 |
actions[x].authorization[x].actor | string | 交易授权账户 |
actions[x].authorization[x].permission | string | 交易授权账户权限 |
actions[x].data | object | 交易数据 | 与智能合约对应, 本例是 新建账户 智能合约
actions[x].data.creator | string | 账户创建者 |
actions[x].data.name | string | 新建账户名 |
actions[x].data.owner | object | 新建账户 owner 权限 | 
actions[x].data.owner.threshold | numeric | owner 权限阈值 | 非多签账户为 1
actions[x].data.owner.keys | Array | owner 密钥 | 非多签账户时启用
actions[x].data.owner.keys[x].key | string | owner 公钥 |
actions[x].data.owner.keys[x].weight | numeric | owner 公钥权重 |
actions[x].data.owner.accounts | Array | 多签账户数组 | 多签账户时启用
actions[x].data.owner.waits | Array | 延迟执行参数 | 
actions[x].data.active | object | 新建账户 active 权限 | 类比 owner 权限

``` js
const { Api, JsonRpc, JsSignatureProvider } = require('../../dist');
const fetch = require('node-fetch');
const rpc = new JsonRpc('http://121.89.208.188:8888', { fetch });


const creator = 'creatortest1'; // 交易发起账户
const permission = 'active'; // 交易发起账户权限
const privateKey = "PVT_SM2_2LnHnaPp9Ktfhiqe9HtuZNP7Nm5ZAKHWGTLnsMq8g2fApC67D5"; // 交易发起账户私钥
const signatureProvider = new JsSignatureProvider([privateKey]);
const api = new Api({ rpc, signatureProvider });


var newAccountName = 'xiaobaiyang4';
var newAccountPublicKey = 'PUB_SM2_5orke91do93DGFQn5dvTeqbZChWUqaeJaheFEY6GRGyeYkpCsd';
(async () => {
  let data = await api.transact({
    actions: [{
      account: 'icbs',
      name: 'newaccount',
      authorization: [{
        actor: creator,
        permission: permission,
      }],
      data: {
        creator: creator,
        name: newAccountName,
        owner: {
          threshold: 1,
          keys: [{
            key: newAccountPublicKey,
            weight: 1
          }],
          accounts: [],
          waits: []
        },
        active: {
          threshold: 1,
          keys: [{
            key: newAccountPublicKey,
            weight: 1
          }],
          accounts: [],
          waits: []
        },
      },
    },]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  console.log(data);
})();
```

response:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
transaction_id | string | 交易 id | 
processed | object | 交易处理信息 | 

``` bash
{
  transaction_id: 'f57527ea43326ca091360beadd8d51effd3aafaae4a666d8b30e3333debdf550',
  processed: {
    id: 'f57527ea43326ca091360beadd8d51effd3aafaae4a666d8b30e3333debdf550',
    block_num: 31712394,
    block_time: '2020-06-01T08:43:40.000',
    producer_block_id: null,
    receipt: { status: 'executed', cpu_usage_us: 591, net_usage_words: 25 },
    elapsed: 591,
    net_usage: 200,
    scheduled: false,
    action_traces: [ [Object] ],
    account_ram_delta: null,
    except: null,
    error_code: null
  }
}
```

## 获取区块链账户

requset:

``` js
rpc.get_account('xiaobaiyang4').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```
response:

``` bash
{
  account_name: 'xiaobaiyang4',
  head_block_num: 31718166,
  head_block_time: '2020-06-01T09:31:46.000',
  privileged: false,
  last_code_update: '1970-01-01T00:00:00.000',
  created: '2020-06-01T08:43:40.000',
  ram_quota: -1,
  net_weight: -1,
  cpu_weight: -1,
  net_limit: { used: -1, available: -1, max: -1 },
  cpu_limit: { used: -1, available: -1, max: -1 },
  ram_usage: 2996,
  permissions: [
    { perm_name: 'active', parent: 'owner', required_auth: [Object] },
    { perm_name: 'owner', parent: '', required_auth: [Object] }
  ],
  total_resources: {
    owner: 'xiaobaiyang4',
    net_weight: '0.0000 YLZ',
    cpu_weight: '0.0000 YLZ',
    ram_bytes: 0
  },
  self_delegated_bandwidth: null,
  refund_request: null,
  voter_info: null,
  rex_info: null
}
```

## 获取key对应账户

示例为上述新建账户

request:

``` js

rpc.history_get_key_accounts('PUB_SM2_5orke91do93DGFQn5dvTeqbZChWUqaeJaheFEY6GRGyeYkpCsd').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

response:

``` bash
{ account_names: [ 'xiaobaiyang4' ] }
```

## 获取账户历史操作

以上述创建账户为例

request:

``` js
rpc.history_get_actions(
  'creatortest1',    
  '',           // An absolute sequence positon -1 is the end/last action
  '20'          //The number of actions relative to pos, negative numbers return [pos-offset,pos), positive numbers return [pos,pos+offset)
).then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

response:

与上述创建账户示例返回 block_num 的一致

``` bash
{
  actions: [
    {
      global_action_seq: 31808367,
      account_action_seq: '00',
      block_num: 31712394,
      block_time: '2020-06-01T08:43:40.000',
      action_trace: [Object],
      context_free_data: []
    }
  ]
}
```

## 获取合约对应的表数据

request:

``` js
rpc.get_table_rows({
  json: true,
  code: 'icbs',
  scope: 'creatortest1',
  table: 'userres',
}).then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

response:

``` bash
{
  rows: [
    {
      owner: 'creatortest1',
      net_weight: '1.0000 YLZ',
      cpu_weight: '110.0000 YLZ',
      ram_bytes: 9311424
    }
  ],
  more: false,
  next_key: ''
}
```

## 获取网络信息

request:

``` js
const { Api, JsonRpc, JsSignatureProvider } = require('../../dist');
const fetch = require('node-fetch');
const rpc = new JsonRpc('http://121.89.208.188:8888', { fetch });

rpc.get_info().then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

response:

``` bash
{
  server_version: 'e80a363e',
  chain_id: '8f3f3d13abac8e5e1d2a1342f68a48e0cb9fb787d07b72e0061eaeb0421fd822',
  head_block_num: 31717980,
  last_irreversible_block_num: 31717979,
  last_irreversible_block_id: '01e3fa5b7147f5910c72339b2efae7e03b91adeb5706103dd6b81a0067cce5f8',
  head_block_id: '01e3fa5c8940fd09fbb53549ac63ac5483677efaafe733bb13c77263a6a73e10',
  head_block_time: '2020-06-01T09:30:13.000',
  head_block_producer: 'icbs',
  virtual_block_cpu_limit: 200000000,
  virtual_block_net_limit: 1048576000,
  block_cpu_limit: 200000,
  block_net_limit: 1048576,
  server_version_string: 'v2.0.2',
  fork_db_head_block_num: 31717980,
  fork_db_head_block_id: '01e3fa5c8940fd09fbb53549ac63ac5483677efaafe733bb13c77263a6a73e10',
  server_full_version_string: 'v2.0.2-e80a363efbfe5c7731a94f22545299b05b37b66f-dirty'
}
```

## 获取智能合约code hash

``` js
rpc.getCodeHash('icbs', (error, result) => {
  console.log(error, result)
});
```

## 获取智能合约 abi

``` js
rpc.get_abi('icbs').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

## 获取智能合约 code 和 abi

``` js
rpc.get_raw_code_and_abi('icbs').then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

## 获取区块

``` js
rpc.get_block("3833592").then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

## 获取验证交易头所需的最小状态

``` js
rpc.get_block_header_state("3833592").then(result => {
  console.log(result);
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

## 获取交易信息

```js
rpc.history_get_transaction('98ff999d1395553ba9f3eb8acf59206aece4676b406cd6389911b42378c4ccdb').then(result => {
  console.log(JSON.stringify(result, null, 2));
}).catch(e => {
  console.log(JSON.stringify(e.json, null, 2));
})
```

