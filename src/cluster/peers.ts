/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-08-12 10:45:50
 * @LastEditTime: 2020-09-01 11:09:09
 * @LastEditors: kay
 */

export async function peersLs(client: any) {
  return await (await client.fetch('/peers', {method: 'GET'})).json()
}

// export async function peersRm(client: any, cid: string) {
//   return await (await client.fetch(`/peers/${cid}`, {method: 'DELETE'})).json()
// }
