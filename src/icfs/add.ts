/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-07-03 11:46:20
 * @LastEditTime: 2020-07-03 14:34:45
 * @LastEditors: kay
 */ 

import multipartRequest from './multipart-request'
import toCamel from './utils/to-camel'
import toIterable = require('./utils/iterator')
const ndjson = require('iterable-ndjson')

export async function *add(client: any, input: Uint8Array | string | {path: string, content: Buffer} | {path: string, content: Buffer}[] |AsyncGenerator<{path: string;content: any;}, void, unknown>) {
  var res =  await client.fetch('/api/v0/add?pin=true', {
    ...(
      await multipartRequest(input, null)
    )
  })
  for await (let file of ndjson(toIterable(res.body))) {
    yield toCamel(file)
  }
}

export async function addUrl(client: any, url: string) {
  return this.add(urlSource(client, url))
}

async function* urlSource(client: any, url: string) {
  const respose = await client.fetch(url, { method: 'GET', disableEndpoint: true })
  yield {
    path: decodeURIComponent(new URL(url).pathname.split('/').pop() || ''),
    content: toIterable(respose.body)
  }
}