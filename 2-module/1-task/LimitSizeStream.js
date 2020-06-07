const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super({...options, decodeStrings: false});
    this.setEncoding(options.encoding || 'utf-8');
    this.limit = options.limit;
    this.dataCount = 0;
  }

  _transform(chunk, encoding, callback) {
    if (this.dataCount <= this.limit && (this.dataCount + chunk.length) <= this.limit) {
      this.dataCount += chunk.length;
      callback(null, chunk);
    } else {
      callback(new LimitExceededError);
    }
  }
}

module.exports = LimitSizeStream;
