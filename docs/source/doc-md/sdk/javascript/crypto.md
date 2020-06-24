<!--
 * @Description: 
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-06-01 11:27:41
 * @LastEditTime: 2020-06-05 18:35:26
 * @LastEditors: kay
--> 

# san-sdk.js 密钥管理

## sm2 密钥生成

request:

``` js
const { Numberic } = require('san-sdk.js');
const keyPair = Numeric.newKey();
console.log(keyPair);
```

response:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
priKey | string | sm2 私钥 | 
pubKey | string | sm2 公钥 |

``` bash
{
  priKey: 'PVT_SM2_2PypSP9a3vJfFMuPEckowYxwE7PCJdL6Y7R4GBguUPzLsxifxk',
  pubKey: 'PUB_SM2_6i7P9mAGehpVDvA4kwbZ77MnHuao924zzXG7sR7zC2nLp8E3WU'
}
```

## sm2 非对称加密

request:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
msgBytes | Uint8Array | 待加密数据 | 
publicKey | string | sm2 加密公钥 |
encryptData | string | 加密后密文 |
privateKey | string | sm2 解密密钥 |

``` js
const { Numberic, Utils, Crypto } = require('san-sdk.js');
const keyPair = Numeric.newKey();
console.log(keyPair);

const msg = '231328432947329847';

const msgBytes = Utils.parseUtf8StringToHex(msg);
const encryptedString = Crypto.sm2.doEncrypt(msgBytes, keyPair.pubKey);
console.log(encryptedString);

const decryptedBytes = Crypto.sm2.doDecrypt(encryptedString, keyPair.priKey);
const decryptedString = Utils.arrayToUtf8(decryptedBytes);
console.log(decryptedString);
```

response:

``` bash
{
  priKey: 'PVT_SM2_2PypSP9a3vJfFMuPEckowYxwE7PCJdL6Y7R4GBguUPzLsxifxk',
  pubKey: 'PUB_SM2_6i7P9mAGehpVDvA4kwbZ77MnHuao924zzXG7sR7zC2nLp8E3WU'
}

e4a7b614ca8e60dee87cbaeeb34664e8559964a2cc5b16f906bfa9f58062f2af77cc9dfbc9161faa538b0a85d26db28d73ba1a39e24a45665ba63d359f7779aa000000eb000000e2000000d70000000000000014000000ea0000004d0000004e323331b9323834b0323934e0333239383437

231328432947329847
```

## sm2 签名及验签

request:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
msgBytes | Uint8Array | 待签名数据 | 
priKey | string | sm2 签名私钥 |
options.hash | boolean | 是否对 msgBytes 做hash | 内部做 sm3 hash,需与验签对应
pubKey | string | sm2 验签公钥 |
signHex | string | sm2 签名数据 | doSignature 签名后为16进制字符串

``` js
const { Numberic, Utils, Crypto } = require('san-sdk.js');
const keyPair = Numeric.newKey();
console.log(keyPair);

const msg = '231328432947329847';
const msgBytes = Utils.parseUtf8StringToHex(msg);

const signatureData = Crypto.sm2.doSignature(msgBytes, keyPair.priKey, { hash: true })
console.log(signatureData)
const is_valid = Crypto.sm2.doVerifySignature(msgBytes, signatureData, keyPair.pubKey, { hash: true })
console.log(is_valid)
```

response:

``` bash
{
  priKey: 'PVT_SM2_2VCk3uPmpAtg5JkshMTmeokX8htSf4euqz11nsNX2M2M5boNeB',
  pubKey: 'PUB_SM2_5sPqFVpmSupQ7PSAFWzYWwGMTW6troMbF8wqnVXXt36cFqH2cX'
}

36a23a220d9997594d8e3a53d20e610f6303b1ed663a1daa2d261c9c3d0f6d44d8b6ac4a4af568308ce165cfcc7e7ab99b26759eab3fefb2c5b10bad3210642b

true
```