const fs = require('fs')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

// Local libs
const DockerManager = require('./lib/DockerManager')

// Middleware
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended: true}))

// Ensure /tmp/rnode exists
try {
  fs.mkdirSync('/tmp/rnode')
} catch (e) {}
try {
  fs.unlinkSync('/tmp/rnode/rspace/data.mdb')
  fs.unlinkSync('/tmp/rnode/rspace/lock.mdb')
} catch (e) {}

// Run containers of each version
DockerManager.startContainers('rchain/rnode')

// Load index.html content
const indexHTML = fs.readFileSync(__dirname + '/views/index.html', 'utf8')
const example = `new helloWorld in {
  contract helloWorld(@name) = {
    new ack in {
      @"stdoutAck"!("Hello!", *ack) |
      for (_ <- ack) {
        @"stdout"!(name)
      }
    }
  } |
  helloWorld!("Joe")
}`

// Set up queue
const queue = new (require('better-queue'))(function (input, cb) {
  console.log('running queue', input.data)
  DockerManager.runWithInput(input, cb)
}, {maxTimeout: 10000})

// HTTP Routes
app.get('/', function (req, res) {
  const config = {autorun: false, version: 'v0.4.1'}
  const content = indexHTML
    .replace('{{ content }}', example)
    .replace('{{ config }}', JSON.stringify(config))

  res.send(content)
})

app.post('/', function (req, res) {
  const config = {autorun: true, version: 'v0.4.1'}
  const content = indexHTML
    .replace('{{ content }}', req.body.content || req.body.body || example)
    .replace('{{ config }}', JSON.stringify(config))

  res.send(content)
})

app.get('/v1/versions', function (req, res) {
  DockerManager.getTags('rchain/rnode', function (tags) {
    res.send(tags)
  })
})

// Socket.io logic
io.on('connection', function (socket) {
  console.log('a user connected')

  socket.on('run', function (data) {
    // ask client to clean output
    socket.emit('output.clean')
    if (queue.length) {
      let output = 'Added as item ' + (queue.length + 1) + ' to the queue...'
      if (queue.length > 5) {
        output += '\n(this might take a few seconds)'
      }
      socket.emit('output.append', [output, 'queued'])
    }

    console.log('queue.length: ' + queue.length)

    queue.push({
      data: data,
      socket: socket
    })
  })
})

const port = process.env.PORT || 80
server.listen(port)
console.log('server started on port', port)
