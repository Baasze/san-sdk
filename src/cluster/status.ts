/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-08-13 10:44:54
 * @LastEditTime: 2020-08-13 10:48:53
 * @LastEditors: kay
 */

export async function status(client: any, cid: string) {
  var path = cid ? `/pins/${cid}` : '/pins'
  var res = await (await client.fetch(path, {method: 'GET'})).json()
  return cid? new Array(res): res
}