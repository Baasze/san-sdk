/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-08-12 10:36:11
 * @LastEditTime: 2020-08-12 10:59:21
 * @LastEditors: kay
 */

export async function version(client: any){
  return await (await client.fetch('/version', {method: 'GET'})).json()
}