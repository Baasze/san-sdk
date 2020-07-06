/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-06-19 10:54:21
 * @LastEditTime: 2020-07-02 17:14:52
 * @LastEditors: kay
 */ 

export async function* ls(client: any, cid?: string[] | string) {
  var arg = ''
  if (cid) {
    var path = Array.isArray(cid) ? cid : [cid]
    path.forEach((cid: string) => arg += 'arg=' + cid + '&')
  }
  const res = await client.fetch('/api/v0/pin/ls?' + arg)
  if (typeof process === 'object') {
    const ndjson = require('iterable-ndjson')
    for await (const pin of ndjson(res.body)) {
      if (pin.Keys) { // non-streaming response
        // eslint-disable-next-line guard-for-in
        for (const key in pin.Keys) {
          yield { cid: key, type: pin.Keys[key].Type }
        }
      } else {
        yield { cid: new pin.Cid, type: pin.Type }
      }
    }
  } else {
    var pin = await res.json()
    if (pin.Keys) { // non-streaming response
      // eslint-disable-next-line guard-for-in
      for (const key in pin.Keys) {
        yield { cid: key, type: pin.Keys[key].Type }
      }
    } else {
      yield { cid: new pin.Cid, type: pin.Type }
    }
  }
}

export async function add(client: any, cid?: string[] | string) {
  var arg = ''
  if (cid) {
    var path = Array.isArray(cid) ? cid : [cid]
    path.forEach((cid: string) => arg += 'arg=' + cid)
  }
  const res = await (await client.fetch('/api/v0/pin/add?' + arg)).json()
  return (res.Pins || []).map((cid: any) => ({ cid: cid}))
}

export async function rm(client: any, cid: string) {
  const res = await client.fetch(`/api/v0/pin/rm?arg=${cid}`)
  const data = await res.json()
  return (data.Pins || []).map((cid:string) => ({ cid: cid }))
}