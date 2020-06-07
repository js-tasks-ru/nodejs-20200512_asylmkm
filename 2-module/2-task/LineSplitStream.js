const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super({...options, decodeStrings: false});
    this.outputStrings = [];
    this.prevChuncks = '';
    this.setEncoding(options.encoding || 'utf-8');
  }

  _transform(chunk, encoding, callback) {
    this.prevChuncks += chunk;

    if (this.prevChuncks.indexOf(`${os.EOL}`) + 1) {
      this.outputStrings = this.prevChuncks.split(`${os.EOL}`);
      for (let i = 0; i < this.outputStrings.length - 1; i++) {
        this.push(this.outputStrings[i]);
      }
      this.prevChuncks = this.outputStrings[this.outputStrings.length - 1];
    }
    callback();
  }

  _flush(callback) {
    callback(null, this.prevChuncks);
  }
}

module.exports = LineSplitStream;
