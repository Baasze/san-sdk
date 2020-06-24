/*
 * @Description: 
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-06-01 16:34:44
 * @LastEditTime: 2020-06-24 15:45:10
 * @LastEditors: kay
 */

const { Api, JsonRpc, JsSignatureProvider } = require('../../dist');
const fetch = require('node-fetch');
const rpc = new JsonRpc('http://121.89.208.188:8888', { fetch });
const { TextEncoder, TextDecoder } = require('util');  

const creator = 'creatortest1'; // 交易发起账户
const permission = 'active'; //  交易发起账户权限
const privateKey = "PVT_SM2_2LnHnaPp9Ktfhiqe9HtuZNP7Nm5ZAKHWGTLnsMq8g2fApC67D5";
const signatureProvider = new JsSignatureProvider([privateKey]);
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

describe('ICFS Client', function (){
  var newAccountName = '';
  // 生成一个12位的随机账户名
  var characters = 'abcdefghijklmnopqrstuvwxyz12345';
  var charactersLength = characters.length;
  for (var i = 0; i < 12; i++) {
    newAccountName += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  it("creat blockchain account", async function () {
    var newAccountPublicKey = 'PUB_SM2_5orke91do93DGFQn5dvTeqbZChWUqaeJaheFEY6GRGyeYkpCsd';
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
  }, 10000)
})