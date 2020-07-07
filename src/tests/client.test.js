/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-06-02 10:39:18
 * @LastEditTime: 2020-07-07 10:04:51
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
    fileCid = await client.add('my test content')
    console.log('fileCid: ', fileCid)
    
    // 流形式上传文件
    var streamCid
    streamCid = await client.add(fs.createReadStream(__dirname + '/client.test.js'))
    console.log('streamCid: ', streamCid)

    // 上传文件内容及其对应文件名
    var fileWithNameCid
      // addFile(content, filseName)
    fileWithNameCid = await client.add({path: 'a.txt', content: 'a'})
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
    dirCid = await client.add(files, rootDir)
    console.log('dirCid: ', dirCid)
    
    // 上传 url
    var urlCid = await client.addUrl('http://san.baasze.com/doc-md/sdk/javascript/crypto.html#sm2')
    console.log('urlCid: ', urlCid)
  }, 30000)

  // cat file
  it('cat file test', async function(){
    // cat 返回的是 Buffer
    var fileCid = 'bafk43jqbealhgo5gojbtmxho44abq5fznrul722d4id36sirdpcnzceavivfw'
    // console.log(fileCid)
    const res = await client.cat(fileCid)
    console.log('cat: ', res.toString())
  }, 30000)
  
  // icfs get
  it('get file test', async function () {
    // save file local
    let output = './'
    var dirCid = 'bafym3jqbedssggxrx6t5mfdyiqauxkmknpjkn35u5kgen56dagazblllin6f2'
    // option default : {save: false}
    for await (const file of await client.get(dirCid, {save: true})){
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

    // return {path: cid, content: BufferList}
    var fileCid = 'bafk43jqbeclzwhefsazzgyyjvch2osvxxg5h42ftwg66hhyx2r2qbkwgzy5ue'
    var res = await client.get(fileCid)
    console.log(res)

  }, 30000)

  // icfs ls test
  it('ls files test', async function () {
    var res = await client.ls("bafym3jqbedlgf7pqw6ednj4spj4yv2tgmqoeiwjfkr726gbj4tzssvn3rqqk4")
    console.log('ls: ', res)
  }, 30000)

  // icfs pin test
  it('pin test', async function () {
    // pin add
    var date = new Date()
    var fileCid = await client.add(date.toISOString())
    var fileCid = 'bafk43jqbebtels4fzd7wfwc2uzb7xwyzq6zzqc72atkogokd3mch7ug7lnetw'
    var res = await client.pinAdd(fileCid)
    console.log('pin add: ', res)
 
    // pin ls
    res = await client.pinLs([fileCid, 'bafk43jqbed6spvsvlfe7adazqq5ohzzmbri6q7uailvcmyjqca4tkcakegiew'])
    console.log("pin ls: ", res)
   
    // pin rmr
    res = await client.pinRm(fileCid)
    console.log('pin rm: ', res)
  }, 30000)

  // icfs key test
  it('key test', async function () {
    // key gen
    var name = ''
    var characters = 'abcdefghijklmnopqrstuvwxyz12345';
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
      name += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    var res = await client.keyGen(name)
    console.log('key gen: ', res)

    // key list
    res = await client.keyList()
    console.log('key list:', res)
    
    //key rm
    res = await client.keyRm(name)
    console.log('key rm: ', res)
  }, 30000)

  // icfs swarm test
  it('swarm test', async function () {
    // swarm peers
    var res = await client.swarmPeers()
    console.log('swarm peers: ', res);

    // swarm addrs
    res = await client.swarmAddrs()
    console.log('swram addrs: ', res)
  }, 30000)

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

    var urlCid = await client.dagPutUrl('https://w3c-ccg.github.io/did-spec/contexts/did-v1.jsonld')
    console.log('dag put url: ', urlCid)

    //dag resolve
    var res = await client.dagResolve(cid, 'a')
    console.log('dag resolve: ', res)
    
    // dag get
    var res = await client.dagGet('bafy43jqbedmog7g3cijdypqujmfiqa6sjzcxmnhjh5rfqloywznaez734ltyu', 'c/ca')
    console.log('dag get: ', res)
  }, 30000)

  // icfs block test
  it('block test', async function () {
    // block get
    var res = await client.blockGet('bafym3jqbedlgf7pqw6ednj4spj4yv2tgmqoeiwjfkr726gbj4tzssvn3rqqk4')
    console.log('block get: ', res);
  }, 30000)
  
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
  }, 30000)

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
  }, 30000)
});