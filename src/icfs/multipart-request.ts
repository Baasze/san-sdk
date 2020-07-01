'use strict'

const normaliseInput = require('./utils/files/normalise-input')
// const { Readable } = require('stream')
// const { nanoid } = require('nanoid')
const Buffer = require('buffer').Buffer
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
      abortController.abort(err)
    } finally {
      yield `\r\n--${boundary}--\r\n`
    }
  }
  // var data
  // var data = Buffer.from('')
  // for await (const file of streamFiles(source)) {
  //   var bf = Buffer.from(file)
  //   data = Buffer.concat([data, bf], data.length + bf.length)
  // }
  var data = ''
  for await (const file of streamFiles(source)) {
    data += file
  }  
  console.log(data)
  return {
    headers: merge(headers, {
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    }),
    dataType: 'text',
    body: data
  }
}

// function toStream (iterable:any) {
//   let reading = false
//   return new Readable({
//     async read (size: any) {
//       if (reading) return
//       reading = true

//       try {
//         while (true) {
//           const { value, done } = await iterable.next(size)
//           if (done) return this.push(null)
//           if (!this.push(value)) break
//         }
//       } catch (err) {
//         this.emit('error', err)
//         if (iterable.return) iterable.return()
//       } finally {
//         reading = false
//       }
//     }
//   })
// }

// async function multipartRequest(source: any, abortController: any, headers = {}, boundary = `-----------------------------${Math.random() * 100000}.${Math.random() * 100000}`) {
//   const files = normaliseInput(source)
//   for await (const file of files) {
//     console.log(file)
//     if (file.content) {
//       for await (const data of file.content) {
//         console.log(data)
//       }
//       //     formData.append(
//       //       `file-${i}`,
//       //       // FIXME: add a `path` property to the stream so `form-data` doesn't set
//       //       // a Content-Length header that is only the sum of the size of the
//       //       // header/footer when knownLength option (below) is null.
//       //       Object.assign(
//       //         toStream(file.content),
//       //         { path: file.path || `file-${i}` }
//       //       ),
//       //       {
//       //         filepath: file.path,
//       //         contentType: 'application/octet-stream',
//       //         knownLength: file.content.length // Send Content-Length header if known
//       //       }
//       //     )
//       //   } else {
//       //     formData.append(`dir-${i}`, Buffer.alloc(0), {
//       //       filepath: file.path,
//       //       contentType: 'application/x-directory'
//       //     })
//       //   }

//       //   i++
//       // }
//     }
//   }
// }
export default multipartRequest
