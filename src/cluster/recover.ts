/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-08-13 10:38:05
 * @LastEditTime: 2020-08-13 10:40:36
 * @LastEditors: kay
 */

export async function recover(client: any, cid: string) {
  var path = cid ? `/pins/${cid}/recover` : '/pins/recover'
  var res = await (await client.fetch(path, {method: 'POST'})).json()
  return cid? new Array(res): res
}