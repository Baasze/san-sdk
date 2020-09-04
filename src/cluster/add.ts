/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-07-03 11:46:20
 * @LastEditTime: 2020-09-01 09:56:07
 * @LastEditors: kay
 */ 

import multipartRequest from '../utils/multipart-request'
import toCamel from '../utils/to-camel'
import toIterable = require('../utils/iterator')
const ndjson = require('../../src/base/iterable-ndjson')

export async function* add(client: any, input: Uint8Array | string | { path: string, content: Buffer } | { path: string, content: Buffer }[] | AsyncGenerator<{ path: string; content: any; }, void, unknown>, Options?: { replication: number }) {
  var res = await client.fetch(`/add?&replication-max=${Options.replication}&replication-min=${Options.replication}`, {
    ...(
      await multipartRequest(input, null)
    )
  })
  for await (let file of ndjson(toIterable(res.body))) {
    yield toCamel(file)
  }
}