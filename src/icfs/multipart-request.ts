'use strict'

const normaliseInput = require('./utils/files/normalise-input')
const { Readable } = require('readable-stream-miniprogram')
// const pro = require('./base/readable-stream-miniprogram/pro')
// const { nanoid } = require('nanoid')
import modeToString from './utils/mode-to-string'
import mtimeToObject from './utils/mtime-to-object'
const merge = require('merge-options').bind({ ignoreUndefined: true })

async function multipartRequest(source: any, abortController: any, headers = {}, boundary = `-----------------------------${Math.random() * 100000}.${Math.random() * 100000}`) {
  async function* streamFiles(source: any) {
    try {
      let index = 0

      for await (const { content, path, mode, mtime } of normaliseInput(source)) {
        let fileSuffix = ''
        const type = content ? 'file' : 'dir'

        if (index > 0) {
          yield '\r\n'

          fileSuffix = `-${index}`
        }

        yield `--${boundary}\r\n`
        yield `Content-Disposition: form-data; name="${type}${fileSuffix}"; filename="${encodeURIComponent(path)}"\r\n`
        yield `Content-Type: ${content ? 'application/octet-stream' : 'application/x-directory'}\r\n`

        if (mode !== null && mode !== undefined) {
          yield `mode: ${modeToString(mode)}\r\n`
        }

        if (mtime != null) {
          const {
            secs, nsecs
          } = mtimeToObject(mtime)

          yield `mtime: ${secs}\r\n`

          if (nsecs != null) {
            yield `mtime-nsecs: ${nsecs}\r\n`
          }
        }

        yield '\r\n'

        if (content) {
          yield* content
        }

        index++
      }
    } catch (err) {
      // workaround for https://github.com/node-fetch/node-fetch/issues/753
      console.log(err)
      abortController.abort(err)
    } finally {
      yield `\r\n--${boundary}--\r\n`
    }
  }
  var data = '' 
  for await (const file of streamFiles(source)) {
    data += file
  }
  // console.log(data.length)
  // if (typeof process === 'object') {
    // console.log(Stream)
    var toStream = function (iterable:any) {
      let reading = false
      return new Readable({
        async read (size: any) {
          if (reading) return
          reading = true
    
          try {
            while (true) {
              const { value, done } = await iterable.next(size)
              // console.log('value:', value)
              if (done) return this.push(null)
              if (!this.push(value)) break
            }
          } catch (err) {
            this.emit('error', err)
            if (iterable.return) iterable.return()
          } finally {
            reading = false
          }
        }
      })
    }
    return {
      headers: merge(headers, {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      }),
      // body: toStream(streamFiles(source))
      body: data
    }
  // } else {
  //   var data = ''
  //   for await (const file of streamFiles(source)) {
  //     data += file
  //   }
  //   return {
  //     headers: merge(headers, {
  //       'Content-Type': `multipart/form-data; boundary=${boundary}`
  //     }),
  //     body: data
  //   }
  // }
}

export default multipartRequest
