/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-06-01 10:45:26
 * @LastEditTime: 2020-07-03 19:21:29
 * @LastEditors: kay
 */

// import multipartRequest from './multipart-request'
// let toIterable = require('./utils/iterator')
// import toCamel from './utils/to-camel'
import * as Interface from './san-api-interface'
// const ndjson = require('iterable-ndjson')

export class IcfsClient {
  public endpoint: string;
  public fetchBuiltin:
      (input?: Request|string, init?: any) => Promise<Response>;
  constructor(
      endpoint: string,
      args: {
        fetch?: (input?: string|Request,
                 init?: RequestInit) => Promise<Response>
      } = {},
  ) {
    this.endpoint = endpoint.replace(/\/$/, '');
    if (args.fetch) {
      this.fetchBuiltin = args.fetch;
    } else {
      this.fetchBuiltin = (global as any).fetch;
    }
  }
  
  /**
       Post `body` to `endpoint + path`. Throws detailed error information in
       `RpcError` when available.
   */
  public async fetch(path: string, options?: any) {
    let response;
    try {
      const f = this.fetchBuiltin;
      if (!options) options = {}
      let url = this.endpoint + path
      if (options.disableEndpoint) {
        url = path
      }
      response = await f(url, {
        headers: options.headers ? options.headers : {},
        body: options.body ? options.body : null,
        method: options.method ? options.method : 'POST',
        dataType: options.dataType ? options.dataType : 'text',
        responseType: options.responseType ? options.responseType : 'text',
      });
    } catch (e) {
      e.isFetchError = true;
      throw e;
    }
    console.log(await response.text())
    if (!response.ok) {
      throw new Error((await response.json()).Message);
    }
    return response;
  }
  
  public async cat(cid: string): Promise <Buffer[]> {
    const res = (await import('./cat')).cat(this, cid)
    var arr = []
    for await (const file of res) {
      arr.push(file)
    }
    return arr
  }

  public async add(input: Uint8Array | string | { path: string, content: Buffer } | { path: string, content: Buffer }[] | AsyncGenerator<{ path: string; content: any; }, void, unknown>, directory: string): Promise<Interface.addResult> {
    if (directory && typeof input != 'object') {
      throw Error('add a directory \'input\' must be object.')
    }
    const res = (await import('./add')).add(this, input)
    if (directory) {
      for await (const data of res) {
        if (data.name == directory) {
          return data.hash
        }
      }
    } else {
      for await (const data of res) {
        if (data.name == data.hash) {
          return data.hash
        }
      }
    }
  }
  // public async add(input: Uint8Array | string | {path: string, content: Buffer} | AsyncGenerator<{path: string;content: any;}, void, unknown>) {
  //   var res =  await this.fetch('/api/v0/add?pin=true', {
  //     ...(
  //       await multipartRequest(input, null)
  //     )
  //   })
  //   return res.json()
  //   // console.log(await res.json())
  //   // for await (let file of ndjson(toIterable(res.body))) {
  //   //   yield toCamel(file)
  //   // }
  //   // await multipartRequest(input, null)
  // }
  // public async *get(cid: string){
  //   var res = await this.fetch(`/api/v0/get?arg=${cid}`)
  //   // if (typeof process === 'object') {      
  //     const Tar = require('./base/it-tar/index')
  //     var extractor = Tar.extract()
  //     for await (const { header, body } of extractor(toIterable(res.body))) {
  //       if (header.type === 'directory') {
  //         yield {
  //           path: header.name
  //         }
  //       } else {
  //         yield {
  //           path: header.name,
  //           content: body
  //         }
  //       }
  //     }
  //   // } else {
  //     // var res = await this.fetch(`/api/v0/get?arg=${cid}`)
  //     // console.log(res.headers)
  //     // console.log(await res.arrayBuffer())
  //     // console.log(res.headers)
  //   // }
  // }

  // public async* add(input: any){
  //   var res =  await this.fetch('/api/v0/add?pin=true', {
  //     ...(
  //       await multipartRequest(input, null)
  //     )
  //   })
  //   for await (let file of ndjson(toIterable(res.body))) {
  //     yield toCamel(file)
  //   }
  // }

  // public async addDir(input: object, directory: string) {
  //   for await (const data of this.add(input)) {
  //     if (data.name == directory) {
  //       return data.hash
  //     }
  //   }
  // }
  // // fileName 等同于 icfs -w
  // public async addFile(input: string | Buffer | Uint8Array, fileName?: string): Promise<string> {
  //   var file = {
  //     path: fileName? `${fileName}/${fileName}`: '',
  //     content: input
  //   }
  //   if (fileName) {
  //     return this.addDir(file, fileName)
  //   } else {
  //     for await (const data of this.add(file)) {
  //       if (data.name == data.hash) {
  //         return data.hash
  //       }
  //     }
  //   }
  // }

  // ls
  public async ls(cid: string): Promise<Interface.LsResult[]>{
    var res = (await import('./ls'))(this, cid)
    let arr = []
    for await (const file of res) {
      arr.push(file)
    }
    return arr
  }

  // pin
  public async pinLs(cid?: string[] | string) {
    var res = (await import('./pin')).ls(this, cid)
    var arr = []
    for await (const file of res) {
      arr.push(file)
    }
    return arr
  }

  public async pinAdd(cid?: string[] | string) {
    return (await import('./pin')).add(this, cid)
  }

  public async pinRm(cid: string) {
    return (await import('./pin')).rm(this, cid)
  }

  // key
  public async keyGen(name: string) {
    return (await import('./key')).gen(this, name)
  }

  public async keyList() {
    return (await import('./key')).list(this)
  }
  
  public async keyRm(name: string) {
    return (await import('./key')).rm(this, name)
  }

  // swarm
  public async swarmPeers(): Promise<Interface.swarmPeersResult[]> {
    return (await import('./swarm')).peers(this)
  }

  public async swarmAddrs(): Promise<Interface.swarmAddrsResult[]> {
    return (await import('./swarm')).addrs(this)
  }
  
  // dag
  public async dagPut(input: any): Promise<string> {
    return (await import('./dag')).put(this, input)
  }
  public async dagGet(cid: string, path: string): Promise<Interface.dagGetResult> {
    return (await import('./dag')).get(this, cid, path)
  }
  public async dagResolve(cid: string, path?: string): Promise<Interface.dagResolveResult> {
    return (await import('./dag')).resolve(this, cid, path)
  }
  
  // block
  public async blockGet(cid: string) {
    return (await import('./block')).get(this, cid)
  }

  // name
  public async namePublish(path: string, key?: string): Promise<Interface.namePublishResult>{
    return (await import('./name')).publish(this, path, {key: key})
  }

  public async nameResolve(path: string): Promise<{ Path: string }[]> {
    var arr: Array<{ Path: string }> = new Array<{ Path: string }>()
    let res = (await import('./name')).resolve(this, path)
    for await (const path of res) {
      arr.push({Path: path})
    }
    return arr
  }
  
  public async namePubsubSubs(): Promise<string[]> {
    return (await import('./name')).pubsub.subs(this)
  }

  public async namePubsubState(): Promise<{ enabled: Boolean }> {
    return (await import('./name')).pubsub.state(this)
  }

  public async namePubsubCancel(name: string): Promise<{ canceled: Boolean }>{
    return (await import('./name')).pubsub.cancel(this, name)
  }

  // boootstrap
  public async bootstrapList() {
    return (await import('./bootstrap')).list(this)
  }

  public async bootstrapAdd(peer: string) {
    return (await import('./bootstrap')).add(this, peer)
  }

  public async bootstrapRm(peer: string) {
    return (await import('./bootstrap')).rm(this, peer)
  }
}

