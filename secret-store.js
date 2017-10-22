var path = require('path')

module.exports = function (dir, randomAccessInterface) {
  if (!dir) dir = path.join('.dat', 'secret_keys')
  return function (name, opts) {
    var discKey = opts.discoveryKey
    if (!discKey) throw new Error('Discovery key required')
    if (typeof discKey !== 'string') discKey = discKey.toString('hex')

    return new Storage(
      randomAccessInterface(name),
      randomAccessInterface(path.join(dir, discKey.slice(0, 2), discKey.slice(2)))
    )
  }
}

function Storage (ownerFile, secretFile) {
  this.ownerFile = ownerFile
  this.secretFile = secretFile
}

Storage.prototype.open = function (cb) {
  if (!cb) cb = noop
  var self = this

  this.ownerFile.open(function (err) {
    if (err) return cb(err)
    self.secretFile.open(cb)
  })
}

Storage.prototype.read = function (offset, length, cb) {
  var self = this

  this.ownerFile.read(0, 1, function (err) {
    if (err) return cb(err)
    self.secretFile.read(offset, length, cb)
  })
}

Storage.prototype.write = function (offset, data, cb) {
  if (!cb) cb = noop
  cb()
}

Storage.prototype.close = function (cb) {
  if (!cb) cb = noop
  var self = this

  this.ownerFile.close(function () {
    self.secretFile.close(cb)
  })
}

function noop () {}
