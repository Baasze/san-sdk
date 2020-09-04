/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-08-13 11:09:39
 * @LastEditTime: 2020-08-13 11:26:41
 * @LastEditors: kay
 */

export async function healthGraph(client: any) {
  return await (await client.fetch('/health/graph', {method: 'GET'})).json()
}

export async function healthMetrics(client: any, type: string) {
  return await (await client.fetch(`/monitor/metrics/${type}`, {method: 'GET'})).json()
}