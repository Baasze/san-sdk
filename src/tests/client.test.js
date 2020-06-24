/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-06-02 10:39:18
 * @LastEditTime: 2020-06-24 15:42:00
 * @LastEditors: kay
 */

const { IcfsClient }  = require('../index')
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const pipe = require('it-pipe')
const { map } = require('streaming-iterables')
const toIterable = require('stream-to-it')

describe('ICFS Client', function(){
  var client = new IcfsClient('http://icfs.baasze.com:5001', { fetch })
  
  // icfs add
  it('add test', async function () {
    // 只上传文件内容
    var dirCid
    var fileCid
    fileCid = await client.addFile('my test content')
    console.log('fileCid: ', fileCid)
    
    // 上传 url
    var urlCid = await client.addUrl('http://san.baasze.com')
    console.log('urlCid: ', urlCid)
    
    // 流形式上传文件
    var streamCid
    streamCid = await client.addFile(fs.createReadStream(__dirname + '/client.test.js'))
    console.log('streamCid: ', streamCid)

    // 上传文件内容及其对应文件名
    var fileWithNameCid
      // addFile(content, filseName)
    fileWithNameCid = await client.addFile('a', 'a.txt')
    console.log('fileWithNameCid: ', fileWithNameCid)
    
    // 上传具有根目录的文件, 返回根目录的 cid
    var rootDir = 'test'
    var files = [{
      path: `${rootDir}/file1.txt`,
      // content could be a stream, a url, a Buffer, a File etc
      content: 'one'
    }, {
      path: `${rootDir}/file2.txt`,
      content: 'two'
    }, {
      path: `${rootDir}/file3.txt`,
      content: 'three'
    },{
      // 空目录
      path: `${rootDir}/dir`
    }]
    dirCid = await client.addDir(files, rootDir)
    console.log('dirCid: ', dirCid)
  })

  // cat file
  it('cat file test', async function(){
    // cat 返回的是 Buffer
    var fileCid = 'bafk43jqbecks2cwilkrt4hq5goamjcbvya6pybl7e3kvdcqcs2joqrjxbsz2o'
    for await (const file of client.cat(fileCid)) {
      console.log('cat file content: ', file.toString())
    }
  })
  
  // icfs get
  it('get file test', async function(){
    let output = './'
    var dirCid = 'bafym3jqbedssggxrx6t5mfdyiqauxkmknpjkn35u5kgen56dagazblllin6f2'
    for await (const file of client.get(dirCid)){
      const fullFilePath = path.join(output, file.path)
      if (file.content) {
        await fs.promises.mkdir(path.join(output, path.dirname(file.path)), { recursive: true })
        await pipe(
          file.content,
          map((chunk) => chunk.slice()),
          toIterable.sink(fs.createWriteStream(fullFilePath))
        )
      } else (
        await fs.promises.mkdir(fullFilePath, {recursive: true})
      )
    }
  })

  // icfs ls test
  it('ls files test', async function () {
    var res = await client.ls("bafym3jqbedlgf7pqw6ednj4spj4yv2tgmqoeiwjfkr726gbj4tzssvn3rqqk4")
    console.log('ls: ', res)
  })

  // icfs pin test
  it('pin test', async function () {
    // pin add
    var res = await client.pinAdd("bafym3jqbedlgf7pqw6ednj4spj4yv2tgmqoeiwjfkr726gbj4tzssvn3rqqk4")
    console.log('pin add: ', res)
 
    // pin ls
    res = await client.pinLs("bafym3jqbedlgf7pqw6ednj4spj4yv2tgmqoeiwjfkr726gbj4tzssvn3rqqk4")
    console.log("pin ls: ", res)
   
    // pin rm
    res = await client.pinRm("bafym3jqbedlgf7pqw6ednj4spj4yv2tgmqoeiwjfkr726gbj4tzssvn3rqqk4")
    console.log('pin rm: ', res)
  })

  // icfs key test
  it('key test', async function () {
    // key gen
    var res = await client.keyList()
    console.log('key list:', res)

    var name = 'mykey1'
    var hasName = false
    for (let i in res) {
      if (res[i].name == name) {
        hasName = true
        break;
      }
    }
    console.log(hasName)
    if (!hasName) {
      // key
      var res = await client.keyGen(name)
      console.log('key gen: ', res)
    }

    // key list
    res = await client.keyList()
    console.log('key list:', res)
    
    //key rm
    res = await client.keyRm(name)
    console.log('key rm: ', res)
  })

  // icfs swarm test
  it('swarm test', async function () {
    // swarm peers
    var res = await client.swarmPeers()
    console.log('swarm peers: ', res);

    // swarm addrs
    res = await client.swarmAddrs()
    console.log('swram addrs: ', res)
  })

  // icfs dag test
  it('dag test', async function () {
    var obj = {
      a: 1,
      b: [1, 2, 3],
      c: {
        ca: [5, 6, 7],
        cb: 'foo'
      }
    }
    // dag put
    var cid = await client.dagPut(obj)
    console.log('dag put: ', cid)

    // dag resolve
    var res = await client.dagResolve(cid, 'a')
    console.log('dag resolve: ', res)
    
    // dag get
    res = await client.dagGet(cid, 'c/ca')
    console.log('dag get: ', res)
  })

  // icfs block test
  it('block test', async function () {
    // block get
    var res = await client.blockGet('bafym3jqbedlgf7pqw6ednj4spj4yv2tgmqoeiwjfkr726gbj4tzssvn3rqqk4')
    console.log('block get: ', res);
  })
  
  // icfs name test
  it('name test', async function () {
    // name publish
    var keyName
    var keys = await client.keyList()
    for (let i in keys) {
      if (keys[i].name == 'mykey') {
        keyName = keys[i].name
      }
    }
    if (!keyName) {
      keyName = 'mykey'
      await client.keyGen(keyName)
    }
    var res = await client.namePublish('bafym3jqbedlgf7pqw6ednj4spj4yv2tgmqoeiwjfkr726gbj4tzssvn3rqqk4', keyName)
    console.log('name publish: ', res)

    // name resolve
    res = await client.nameResolve(res.name)
    console.log('name resolve: ', res)

    // name pubsub state
    res = await client.namePubsubState()
    console.log('name pubsub state: ', res)

    // name pubsub subs
    res = await client.namePubsubSubs()
    console.log('name pubsub subs: ', res)
    
    // name pubsub cancel
    var name = 'bafzm3jqbea4ghtxynopvpr4nfdub3oy4fqcoz7wg5w3qln7fntbcx3kip5dky'
    res = await client.namePubsubCancel(name)
    console.log('name pubsub cancel: ', res)
  })

  it('bootstrap test', async function () {
    // bootstrap list
    var res = await client.bootstrapList()
    console.log('bootstrap list: ', res)

    // bootstrap add
    res = await client.bootstrapAdd('/dns4/icfs.baasze.com/tcp/4001/p2p/bafzm3jqbec7ulhfmm7s7ydt2mf32nbsjy4237mvzj5skzbkxrfxz7axghsyum')
    console.log('bootstrap add:', res)
    
    // bootstrap rm
    res = await client.bootstrapRm('/dns4/icfs.baasze.com/tcp/4001/p2p/bafzm3jqbec7ulhfmm7s7ydt2mf32nbsjy4237mvzj5skzbkxrfxz7axghsyum')
    console.log('bootstrap rm:', res)
  })
});