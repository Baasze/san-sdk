/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-08-12 10:38:46
 * @LastEditTime: 2020-09-01 14:08:00
 * @LastEditors: kay
 */

const { ClusterClient, IcfsClient } = require('../index')
const fetch = require('node-fetch')
const fs = require('fs')
var date = new Date()

describe('Cluster Client', function () {
  const client = new ClusterClient('http://icfs.baasze.com:9094', { fetch });
  var icfsClient = new IcfsClient('http://icfs.baasze.com:5001', { fetch })
  
  var res
  it('cluster id', async function () {
    res = await client.id()
    console.log('id: \n', res)
  }, 30000)

  it('cluster version', async function () {
    var version = await client.version()
    console.log('version: \n', version)
  }, 30000)
  
  it('cluster pins', async function () {
    var fileCid = await icfsClient.add(date.toISOString())
    // 不配置 replication，默认 cluster 的所有节点都 pin add
    res = await client.pinAdd(fileCid, {replication: 3})
    console.log('pin add: \n', res)
    res = await client.pinLs()
    console.log('pins ls: \n', res)
    res = await client.pinRm(fileCid)
    console.log('pin rm: \n', res)
  })

  it('cluster add', async function () {
    res = await client.add('cluster test content')
    console.log('fileCid: ', res)
    
    // 流形式上传文件
    res = await client.add(fs.createReadStream(__dirname + '/cluster.test.js'))
    console.log('streamCid: ', res)

    // 上传文件内容及其对应文件名
      // addFile(content, filseName)
    res = await client.add({path: 'a.txt', content: 'a'})
    console.log('fileWithNameCid: ', res)
    
    // 上传具有根目录的文件, 返回根目录的 cid
    var rootDir = 'cluster'
    var files = [{
      path: `${rootDir}/file1.txt`,
      // content could be a stream, a url, a Buffer, a File etc
      content: 'cluster one'
    }, {
      path: `${rootDir}/file2.txt`,
      content: 'cluster two'
    }, {
      path: `${rootDir}/file3.txt`,
      content: 'cluster three'
    },{
      // 空目录
      path: `${rootDir}/dir`
    }]
    res = await client.add(files, { directory: rootDir })
    console.log('dirCid: ', res)
    
    // 上传 url
    res = await client.addUrl('http://san.baasze.com/doc-md/sdk/javascript/crypto.html#sm2')
    console.log('urlCid: ', res)

    // 指定在集群中备份的副本数量
    res = await client.add(date.toISOString(), { replication: 2 })
    console.log("cluster add replication 2: ", res)
  }, 300000)

  it('cluster peers', async function () {
    res = await client.peersLs()
    console.log('peers ls: \n', res)
    // crdt consensus component cannot remove peers
    // res = await client.peersRm("12D3KooWM31NYTioAf5PiBS5yvxxuucM5WCACfxDAfRBoPRqdUev")
    // console.log('peers rm: \n', res)
  }, 30000)

  it('cluster status', async function () { 
    res = await client.status()
    console.log('status of all cids: \n', res)
    var fileCid = await icfsClient.add(date.toISOString())
    res = await client.status(fileCid)
    console.log('status of single cid: \n', res)
  }, 30000)

  it('cluster recover', async function () {
    res = await client.recover()
    console.log('recover all: \n', res)
    var fileCid = await icfsClient.add(date.toISOString())
    res = await client.recover(fileCid)
    console.log('recover a cid: \n', res[0])
  }, 30000)

  it('cluster health', async function () {
    res = await client.healthGraph()
    console.log('health graph: \n', res)

    res = await client.healthMetrics('ping')
    console.log('health metrics freespace: \n', res)

    res = await client.healthMetrics('freespace')
    console.log('health metrics ping: \n', res)
  }, 30000)
})