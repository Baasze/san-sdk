/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-07-03 11:18:46
 * @LastEditTime: 2020-07-03 11:39:52
 * @LastEditors: kay
 */ 

import toIterable = require('./utils/iterator')

export async function* cat(client: any, cid: string) {
  var res = await client.fetch(`/api/v0/cat?arg=${cid}`, { responseType: 'arrayBuffer' })
  yield * toIterable(res.body)
}