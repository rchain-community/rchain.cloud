const fs = require('fs')
const uuid = require('uuid/v4')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const docker = new (require('dockerode'))()

const StringWritable = require('./lib/StringWritable')
const DockerRegistry = require('./lib/DockerRegistry')

DockerRegistry.pullAllTags('rchain/rnode', docker)

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html')
})

app.get('/v1/versions', function (req, res) {
  DockerRegistry.getTags('rchain/rnode', function (tags) {
    res.send(tags)
  })
})

io.on('connection', function (socket) {
  console.log('a user connected')

  socket.on('disconnect', function () {
    console.log('user disconnected')
  })

  socket.on('run', function (data) {
    // ask client to clean output
    socket.emit('output.clean')

    // first temporarily store file
    const id = uuid()
    const dir = '/tmp/' + id
    const filename = 'input.rho'
    const path = dir + '/' + filename
    const hrstart = process.hrtime()
    console.time('run')
    fs.mkdir(dir, 0o777, function () {
      fs.writeFile(path, data.body, 'utf8', function () {
        // run docker
        const image = 'rchain/rnode:' + (data.version || 'latest')
        const stream = new StringWritable(chunk => {
          socket.emit('output.append', chunk)
        })
        console.log('Running ' + image + ' with: ' + path)
        docker.run(image, ['--eval', path], stream, {
          Binds: [dir + ':' + dir]
        }).then(function (container) {
          const hrend = process.hrtime(hrstart)
          socket.emit('output.done', {
            executionTime: Math.round((hrend[0] + hrend[1] / 1000000000) * 1000) / 1000
          })
          console.timeEnd('run')
          console.log(container.output)
          fs.unlink(path, () => {})
        }).catch(function (err) {
          console.log(err)
        })
      })
    })
  })
})

const port = process.env.PORT || 80
server.listen(port)
console.log('Server started on port', port)
