/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-06-22 10:00:44
 * @LastEditTime: 2020-06-22 15:53:32
 * @LastEditors: kay
 */ 
const Block = require('ipld-block')
const CID = require('cids')

export async function get(client: any, cid: string) {
  const res = await client.fetch(`/api/v0/block/get?arg=${cid}`)
  var Cid = new CID(cid)
  return new Block(Buffer.from(await res.arrayBuffer()), Cid)
}