/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-06-23 11:27:00
 * @LastEditTime: 2020-06-23 12:04:02
 * @LastEditors: kay
 */ 

export interface LsResult {
  name: string,
  hash: string,
  size: number,
  type: string,
  depth: number
}

export interface pinResult {
  cid: string,
  type: string
}

export interface keyResult {
  name: string,
  id: string,
}

export interface swarmPeersResult {
  addr: string,
  peer: string,
  direction: number,
}

export interface swarmAddrsResult {
  id: string,
  addrs: string[],
}

export interface dagResolveResult {
  cid: string,
  remPath: string
}

export interface dagGetResult {
  value: any,
  remainderPath: string
}

export interface namePublishResult {
  name: string,
  value: string,
}