/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-06-22 09:55:59
 * @LastEditTime: 2020-06-23 09:50:22
 * @LastEditors: kay
 */

import multipartRequest from "./multipart-request"
const dagCBOR = require('ipld-dag-cbor')
const dagPB = require('ipld-dag-pb')
const raw = require('ipld-raw')

const resolvers: any = {
  'dag-cbor': dagCBOR.resolver,
  'dag-pb': dagPB.resolver,
  raw: raw.resolver
}

export async function put(client: any, input: any, options?: {format?: string, hashAlg?: string, inputEnc?: string}) {
  options = {
    format: 'dag-cbor',
    hashAlg: 'sm3-256',
    inputEnc: 'raw',
    ...options
  }

  var serialize

  if (options.format === 'dag-cbor') {
    serialize = dagCBOR.util.serialize(input)
  } else if (options.format == 'dag-pb') {
    serialize = input.serialize()
  } else {
    serialize = input
  }
  
  const res = await client.fetch(`/api/v0/dag/put?format=${options.format}&input-enc=${options.inputEnc}&hash=${options.hashAlg}`, {
    ...(
      await multipartRequest(serialize, null)
    )
  })
  const data = await res.json()
  return data.Cid['/']
}

export async function get(client: any, cid: string, path?: string) {
  const resolved = await resolve(client, cid, path)
  const block = await require('./block').get(client, resolved.cid)
  const dagResolver = resolvers[block.cid.codec]
  if (!dagResolver) {
    throw Object.assign(
      new Error(`Missing IPLD format "${block.cid.codec}"`)
    )
  }
  return dagResolver.resolve(block.data, resolved.remPath)
}

export async function resolve(client: any, cid: string, path?: string) {
  var url
  if (path) {
    const arg = new URLSearchParams()
    path = ([cid, path].join(path.startsWith('/') ? '' : '/'))
    arg.append('arg', path)
    url = '/api/v0/dag/resolve?' + arg
  } else {
    url = `/api/v0/dag/resolve?arg=${cid}`
  }
  const res = await client.fetch(url)
  const data = await res.json()

  return {cid: data.Cid['/'], remPath: data.RemPath }
}