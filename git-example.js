var storage = require('./')
var hyperdrive = require('hyperdrive')
var http = require('http-random-access')

var gitInterface = (file) => http(file, { url: 'https://raw.githubusercontent.com/e-e-e/base-dat-storage/master/example-dat/' })

var gitStorage = storage('/', gitInterface)
console.log('Starting Git Dat')
var archive = hyperdrive(gitStorage, {
  live: false, // keep replicating
  download: false, // download data from peers?
  upload: true, // upload data to peers?
  latest: true,
  timeout: 0
})

archive.on('ready', () => {
  console.log('Git Dat is READY')
  archive.readdir('/', (err, list) => {
    if (err) throw err
    console.log('Git Dat base directory:', list)
    archive.readFile(list[0], 'utf-8', (err, data) => {
      if (err) throw err
      console.log(list[0], 'from Git Dat:')
      console.log(data)
    })
  })
})
