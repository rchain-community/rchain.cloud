const fs = require('fs')
const uuid = require('uuid/v4')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const docker = new (require('dockerode'))()

// Local libs
const StringWritable = require('./lib/StringWritable')
const DockerRegistry = require('./lib/DockerRegistry')

// Middleware
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended: true}))

// Prep docker by pulling all tags
DockerRegistry.pullAllTags('rchain/rnode', docker)

// Load index.html content
const indexHTML = fs.readFileSync(__dirname + '/views/index.html', 'utf8')
const example = `new testResult in {
   contract @"HelloWorld"(@data) = {
     testResult!(data)
   } |
   @"HelloWorld"!(true)
}`

// HTTP Routes
app.get('/', function (req, res) {
  const config = {autorun: false, version: 'latest'}
  const content = indexHTML
    .replace('{{ content }}', example)
    .replace('{{ config }}', JSON.stringify(config))

  res.send(content)
})

app.post('/', function (req, res) {
  const config = {autorun: true, version: req.body.version || 'latest'}
  const content = indexHTML
    .replace('{{ content }}', req.body.content || req.body.body || example)
    .replace('{{ config }}', JSON.stringify(config))

  res.send(content)
})

app.get('/v1/versions', function (req, res) {
  DockerRegistry.getTags('rchain/rnode', function (tags) {
    res.send(tags)
  })
})

// Socket.io logic
io.on('connection', function (socket) {
  console.log('a user connected')

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
          const hrend = process.hrtime(hrstart)
          socket.emit('output.append', 'Container Error: ' + (err.json.message || err.message) + '\n\n')
          socket.emit('output.done', {
            executionTime: Math.round((hrend[0] + hrend[1] / 1000000000) * 1000) / 1000
          })
        })
      })
    })
  })
})

const port = process.env.PORT || 80
server.listen(port)
console.log('Server started on port', port)
