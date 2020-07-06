/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-07-03 11:18:46
 * @LastEditTime: 2020-07-06 14:10:59
 * @LastEditors: kay
 */ 

import toIterable = require('./utils/iterator')
const { Buffer } = require('buffer')

export async function cat(client: any, cid: string) {
  const res = await client.fetch(`/api/v0/cat?arg=${cid}`, { responseType: 'arrayBuffer' })
  var arr = []
  if (typeof process === 'object') {
    for await (const file of toIterable(res.body)) {
      arr.push(file)
    }
  } else {
    arr.push(Buffer.from(res.body))
  }
  return arr
}

