const {Writable} = require('stream')
const {StringDecoder} = require('string_decoder')

class StringWritable extends Writable {
  constructor (cb) {
    super()
    this.cb = cb
    const state = this._writableState
    this._decoder = new StringDecoder(state.defaultEncoding)
  }

  _write (chunk, encoding, callback) {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk)
    }
    this.cb(chunk)
    callback()
  }

  _final (callback) {
    const chunk = this._decoder.end()
    this.cb(chunk)
    callback()
  }
}

module.exports = StringWritable
