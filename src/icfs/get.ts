/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-07-05 20:32:00
 * @LastEditTime: 2020-08-28 09:19:41
 * @LastEditors: kay
 */

import toIterable = require('../utils/iterator')

export async function *get(client: any, cid: string){
  var res = await client.fetch(`/api/v0/get?arg=${cid}`)
  const Tar = require('../../src/base/it-tar/index')
  var extractor = Tar.extract()
  
  for await (const { header, body } of extractor(toIterable(res.body))) {
    if (header.type === 'directory') {
      yield {
        path: header.name
      }
    } else {
      yield {
        path: header.name,
        content: body
      }
    }
  }
}