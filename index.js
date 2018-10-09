const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
var cors = require('cors');
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

// Local libs
const DockerManager = require('./lib/DockerManager')
const FileReader = require('./lib/FileReader')

// Middleware
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: function setHeaders(res, path, stat) {
    // Additional headers are needed to provide CORS support
    // for serving static files
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
  }
}))
app.use(bodyParser.urlencoded({ extended: true }))
// CORS support for express API endpoints
app.use(cors({ origin: true }))
app.options('*', cors());

// Ensure /tmp/rnode exists
try {
  fs.mkdirSync('/tmp/rnode')
} catch (e) { }
try {
  fs.unlinkSync('/tmp/rnode/rspace/data.mdb')
  fs.unlinkSync('/tmp/rnode/rspace/lock.mdb')
} catch (e) { }

// Start running container
DockerManager.startContainers('rchain/rnode')

// Load static resources
const indexHTML = fs.readFileSync(path.join(__dirname, 'views', 'index.html'), 'utf8')
const example = fs.readFileSync(path.join(__dirname, 'public', 'examples', 'hello-world.rho'), 'utf8')
const files = FileReader.readFiles()

// Set up queue
const queue = new (require('better-queue'))(function (input, cb) {
  console.log('running queue', input.data)
  DockerManager.runWithInput(input, cb)
}, { maxTimeout: 10000 })

// HTTP Routes
app.get('/', function (req, res) {
  const config = { autorun: false, version: 'latest' }
  const content = indexHTML
    .replace('{{ content }}', example)
    .replace('{{ config }}', JSON.stringify(config))
    .replace('{{ exampleFiles }}', JSON.stringify(files))

  res.send(content)
})

app.post('/', function (req, res) {
  const config = { autorun: true, version: 'latest' }
  const content = indexHTML
    .replace('{{ content }}', req.body.content || req.body.body || example)
    .replace('{{ config }}', JSON.stringify(config))

  res.send(content)
})

app.get('/v1/versions', function (req, res) {
  res.json(['latest'])
})

// API Endpoint for serving example files to the frontend
app.get('/example-files', function (req, res) {
  res.json(files)
})

// Used by load balancer to check application health
app.get('/health', function (req, res) {
  const container = DockerManager.getCurrentContainer()
  if (!container) {
    DockerManager.startContainers('rchain/rnode')
    res.status(500)
    res.send('No container started yet')
    return
  }

  container.inspect((err, data) => {
    if (err) {
      res.status(500)
      res.send('Cannot get container status')
      DockerManager.reset('rchain/rnode')
      return
    }
    if (!data.State.Running || data.State.ExitCode !== 0) {
      res.status(500)
      res.send('Container is not running')
      DockerManager.reset('rchain/rnode')
      return
    }

    res.send('OK')
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
