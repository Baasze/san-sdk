/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-07-03 11:18:46
 * @LastEditTime: 2020-07-07 09:45:07
 * @LastEditors: kay
 */ 

import toIterable = require('./utils/iterator')
const { Buffer } = require('buffer')

export async function cat(client: any, cid: string) {
  const res = await client.fetch(`/api/v0/cat?arg=${cid}`, { responseType: 'arrayBuffer' })
  const chunks = []
  for await (const chunk of toIterable(res.body)) {
    chunks.push(Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

