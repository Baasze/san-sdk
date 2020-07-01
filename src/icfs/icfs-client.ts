/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-06-01 10:45:26
 * @LastEditTime: 2020-07-01 23:00:24
 * @LastEditors: kay
 */

import multipartRequest from './multipart-request'
import toIterable from './utils/iterator'
// import toCamel from './utils/to-camel'
import * as Interface from './san-api-interface'
// const Tar = require('it-tar')
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
    console.log(response)
    if (!response.ok) {
      throw new Error((await response.json()).Message);
    }
    return response;
  }
  
  public async* cat(cid: string){
    var res = await this.fetch(`/api/v0/cat?arg=${cid}`)
    yield * toIterable(res.body)
  }

  public async add(input: Uint8Array | string | object) {
    var res =  await this.fetch('/api/v0/add?pin=true', {
      ...(
        await multipartRequest(input, null)
      )
    })
    return await res.json() 
    // console.log(await res.json())
    // for await (let file of ndjson(toIterable(res.body))) {
    //   yield toCamel(file)
    // }
    // await multipartRequest(input, null)
  }
  // public async* get(cid: string){
  //   var res = await this.fetch(`/api/v0/get?arg=${cid}`)
  //   var extractor = Tar.extract()
  //   for await (const { header, body } of extractor(toIterable(res.body))) {
  //     if (header.type === 'directory') {
  //       yield {
  //         path: header.name
  //       }
  //     } else {
  //       yield {
  //         path: header.name,
  //         content: body
  //       }
  //     }
  //   }
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

  // public async addUrl(url: string) {
  //   var arr: Array<string> = new Array<string>()
  //   for await (const file of this.add(this.urlSource(url)))
  //     arr.push(file.hash)
  //   return arr
  // }
  
  public async ls(cid: string): Promise<Interface.LsResult[]>{
    let arr = []
    for await (const file of require('./ls')(this, cid)) {
      arr.push(file)
    }
    return arr
  }

  private async pin(option: string, cid?: string[] | string): Promise<Interface.pinResult[]>{
    const pin = require('./pin')
    var arr = []
    switch (option) {
      case 'ls':
        for await (const file of pin.ls(this, cid)) {
          arr.push(file)
        }
        return arr
      case 'add':
        return pin.add(this, cid)
      case 'rm':
        return pin.rm(this, cid)
      default:
        throw new Error("wrong pin option")
    }

  }

  public async pinLs(cid?: string[] | string) {
    return this.pin('ls', cid);
  }

  public async pinAdd(cid?: string[] | string) {
    return this.pin('add', cid);
  }

  public async pinRm(cid: string) {
    return this.pin('rm', cid)
  }

  private async key(option: string, name?: string) : Promise<Interface.keyResult[]>{
    const key = require('./key')
    switch (option) {
      case 'gen':
        return key.gen(this, name)
      case 'list':
        return key.list(this)
      case 'rm':
        return key.rm(this, name)
      default:
        throw new Error('wrong key option')
    }
  }
  
  public async keyGen(name: string) {
    return this.key('gen', name)
  }

  public async keyList() {
    return this.key('list')
  }
  
  public async keyRm(name: string) {
    return this.key('rm', name)
  }

  private async swarm(option: string) {
    const swarm = require('./swarm')
    switch (option) {
      case 'peers':
        return swarm.peers(this)
      case 'addrs':
        return swarm.addrs(this)
      default:
        throw new Error("wrong swarm option")
    }
  }

  public async swarmPeers(): Promise<Interface.swarmPeersResult[]> {
    return this.swarm('peers')
  }

  public async swarmAddrs(): Promise<Interface.swarmAddrsResult[]> {
    return this.swarm('addrs')
  }

  private async dag(option: string, input?: any) {
    const dag = require('./dag')
    switch (option) {
      // case 'put':
      //   return dag.put(this, input)
      case 'resolve':
        return dag.resolve(this, input.cid, input.path)
      case 'get':
        return dag.get(this, input.cid, input.path)
      default:
        throw new Error("wrong dag option")
    }
  }

  // public async dagPut(input: any): Promise<string> {
  //   return this.dag('put', input);
  // }
  public async dagGet(cid: string, path: string): Promise<Interface.dagGetResult> {
    return this.dag('get', {cid: cid, path: path})
  }
  public async dagResolve(cid: string, path?: string): Promise<Interface.dagResolveResult> {
    return this.dag('resolve', {cid: cid, path: path})
  }

  public async * urlSource(url: string) {
    const respose = await this.fetch(url, { method: 'GET', disableEndpoint: true })
    yield {
      path: decodeURIComponent(new URL(url).pathname.split('/').pop() || ''),
      content: toIterable(respose.body)
    }
    
  }

  private async block(option: string, input?: any) {
    const block = require('./block')
    switch (option) {
      case 'get':
        return block.get(this, input)
      default :
        throw new Error("wrong block options")
    }
  }

  public async blockGet(cid: string) {
    return this.block('get', cid)
  }

  private async name(option: string, input?: any) {
    const name = require('./name')
    switch (option) {
      case 'publish': 
        return name.publish(this, input.path, { key: input.key })
      case 'resolve':
        return name.resolve(this, input)
      case 'subs':
        return name.pubsub.subs(this)
      case 'state':
        return name.pubsub.state(this)
      case 'cancel':
        return name.pubsub.cancel(this, input)
      default: 
        throw new Error('wrong name option')
    }
  }

  public async namePublish(path: string, key?: string) : Promise <Interface.namePublishResult>{
    return this.name('publish', {path: path, key: key})
  }

  public async nameResolve(path: string): Promise<{ Path: string }[]> {
    var arr: Array<{ Path: string }> = new Array<{ Path: string }>()
    let res = await this.name('resolve', path)
    for await (const path of res) {
      arr.push({Path: path})
    }
    return arr
  }
  
  public async namePubsubSubs(): Promise<string[]> {
    return this.name('subs')
  }

  public async namePubsubState(): Promise<{ enabled: Boolean }> {
    return this.name('state')
  }

  public async namePubsubCancel(name: string): Promise<{ canceled: Boolean }>{
    return this.name('cancel', name)
  }

  private async bootstrap(option: string, peer?: string): Promise<{Peers: string[]}> {
    const bootstrap = require('./bootstrap')
    switch (option) {
      case 'list':
        return bootstrap.list(this);
      case 'add':
        return bootstrap.add(this, peer);
      case 'rm':
        return bootstrap.rm(this, peer)
    }
  }

  public async bootstrapList(){
    return this.bootstrap('list')
  }

  public async bootstrapAdd(peer: string){
    return this.bootstrap('add', peer)
  }

  public async bootstrapRm(peer: string){
    return this.bootstrap('rm', peer)
  }
}

