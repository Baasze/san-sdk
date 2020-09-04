/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-08-11 09:21:45
 * @LastEditTime: 2020-08-12 10:56:23
 * @LastEditors: kay
 */

export async function id(client: any){
  return await (await client.fetch('/id', {method: 'GET'})).json()
}
