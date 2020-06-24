/*
 * @Description: 
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-03-25 12:14:16
 * @LastEditTime: 2020-06-04 16:41:10
 * @LastEditors: sandman
 */

import { Crypto, Utils, Numeric } from '../index'

describe('crypto', () => {
  Numeric.newKey
  // '0084ADE57E2B35CCA8972562FCC6D1F6F2FBF078C4F2CFB532EB4D740767C5A8
  const hexpriKey = '84ADE57E2B35CCA8972562FCC6D1F6F2FBF078C4F2CFB532EB4D740767C5A8'
  const priKey = 'PVT_SM2_1EEr5aW5162skbocDSMDgoWn9jna6HPSr1TwEMR6PNXby1DeA'
  const pubKey = 'PUB_SM2_7ePvRXa1iC982JkHpNQn9W1h5Tdp9h5mG9jksmAsHjTYUtRjfe'

  const msg = '231328432947329847'
  const msgBytes = Utils.parseUtf8StringToHex(msg)

  it('ensure decrypt', async () => {
    const encryptedString = Crypto.sm2.doEncrypt(msgBytes, pubKey)
    const decryptedBytes = Crypto.sm2.doDecrypt(encryptedString, priKey)
    const decryptedString = Utils.arrayToUtf8(decryptedBytes);
    expect(decryptedString).toEqual(msg)
  })

  it('ensure sign', async () => {
    const signatureData = Crypto.sm2.doSignature(msgBytes, priKey, { hash: true })
    const is_valid = Crypto.sm2.doVerifySignature(msgBytes, signatureData, pubKey, { hash: true })
    expect(is_valid).toEqual(true)
  })

  it('ensure hexKey to key', async () => {
    const privateKey = Numeric.HexToKey(Numeric.KeyType.sm2, hexpriKey, true)
    expect(privateKey.toString()).toEqual(priKey)
  })

  it('ensure hexKey sign', async () => {
    const privateKey = Numeric.HexToKey(Numeric.KeyType.sm2, hexpriKey, true)
    const publicKey = Numeric.privateKeyToPublicKey(privateKey)
    expect(publicKey.toString()).toEqual(pubKey)
    const signatureData = Crypto.sm2.doSignature(msgBytes, privateKey.getKey(), { hash: true })
    var is_valid = Crypto.sm2.doVerifySignature(msgBytes, signatureData, publicKey.getKey(), { hash: true })
    expect(is_valid).toEqual(true)
    is_valid = Crypto.sm2.doVerifySignature(msgBytes, signatureData, pubKey, { hash: true })
    expect(is_valid).toEqual(true)
  })
})
