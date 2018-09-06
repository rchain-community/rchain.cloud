const request = require('request')
const fs = require('fs')
const uuid = require('uuid/v4')
const StringWritable = require('./StringWritable')
const docker = new (require('dockerode'))()

const currentVersion = 'latest'
let currentContainer = null

class DockerManager {
  static getTags (image, callback) {
    const url = 'https://registry.hub.docker.com/v2/repositories/' + image + '/tags/'
    request(url, function (error, response, body) {
      if (error || !body) {
        return callback ([])
      }

      const data = JSON.parse(body)
      callback(data.results.map(function (tag) {
        return tag.name
      }).filter(function (tag) {
        return tag !== 'v0.2.1' && tag !== 'ops-test'
      }))
    })
  }

  static getNetwork (done) {
    const network = docker.getNetwork('rchain-local')
    network.inspect(function (err) {
      if (err) {
        docker.createNetwork({
          'Name': 'rchain-local',
          'Driver': 'bridge',
          'IPAM': {
            'Config': [{
              'Subnet': '172.20.0.0/16',
              'IPRange': '172.20.10.0/24',
              'Gateway': '172.20.10.11'
            }]
          }
        }, function (err, network) {
          done(err, network)
        })
        return
      }
      done(err, network)
    })
  }

  static getCurrentContainer () {
    if (!currentContainer) {
      return
    }
    return docker.getContainer(currentContainer)
  }

  static getOrStartContainer (image, tag, done) {
    const name = 'rchain-local-v6-version-' + tag.replace(/\./g, '')
    fs.readFile('/tmp/rnode/' + name + '.id', 'utf8', function (err, id) {
      if (!err && id) {
        currentContainer = id
        console.log('starting existing container...')
        const container = docker.getContainer(id)
        container.start(function (err, res) {
          if (!err) {
            console.log('started container')
            return
          }

          if (err.reason === 'container already started') {
            return
          }

          console.log(err)
          const name = 'rchain-local-v6-version-' + tag.replace(/\./g, '')
          fs.unlink('/tmp/rnode/' + name + '.id', () => {})
          DockerManager.getOrStartContainer(image, tag, done)
        })

        return done && done(container.id)
      }

      console.log('creating container...')

      docker.createContainer({
        Image: image + ':' + tag,
        Hostname: name,
        Domainname: name,
        ExposedPorts: {
          '50000/tcp': {}
        },
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        Cmd: ['run'],
        OpenStdin: false,
        StdinOnce: false,
        HostConfig: {
          Binds: ['/tmp/rnode:/var/lib/rnode'],
          NetworkMode: 'rchain-local'
        }
      }, function (err, container) {
        console.log('create', err, container ? container.id : null)
        if (!err) {
          currentContainer = container.id
          fs.writeFile('/tmp/rnode/' + name + '.id', container.id, function (err, res) {
            console.log('writefile', err, res)
          })
        }
        console.log('starting container...')
        container.start(function (err, res) {
          console.log('start', err, res)
          currentContainer = container.id
          done && done(container.id)
        })
      })
    })
  }

  static startContainers (image) {
    DockerManager.getNetwork(function (err) {
      if (err) {
        console.log(err)
      }

      const tag = currentVersion
      const imageString = image + ':' + tag
      docker.pull(imageString, function (err, stream) {
        if (err) {
          console.log(err)
          return
        }
        docker.modem.followProgress(stream, onFinished, function () {})
        function onFinished (err, output) {
          console.log('pulled ' + imageString + ': ' + (err || 'ok'))
          if (err) {
            return
          }
          DockerManager.getOrStartContainer(image, tag)
        }
      })
    })
  }

  static runWithInput (input, cb) {
    let socket = input.socket
    let data = input.data

    // first temporarily store file
    const id = uuid()
    const dir = '/tmp/rnode/' + id
    const filename = 'input.rho'
    const path = dir + '/' + filename

    let contents = 'new stdout(`rho:io:stdout`) in {' +
      'new stdoutAck(`rho:io:stdoutAck`) in {\n\n' + data.body + '\n\n}}'

    fs.mkdir(dir, 0o777, function () {
      fs.writeFile(path, contents, 'utf8', function () {
        // run docker
        const version = currentVersion
        const image = 'rchain/rnode:' + version
        let prevChunk = ''
        let prev2Chunk = ''
        let type = 'evaluating'
        const streamo = new StringWritable(chunk => {
          if (chunk.indexOf('NEvaluating from ') >= 0) {
            return
          }

          const trimmed = chunk.trim()
          if (trimmed.length) {
            chunk = trimmed
          }

          if (prev2Chunk === 'Evaluating:' || prevChunk.indexOf('Evaluating:\r\n') === 0) {
            type = 'stdout'
            if (!trimmed.length) {
              return
            }
          }

          if (chunk.indexOf('Storage Contents:') >= 0) {
            type = 'storage contents'
            chunk = chunk.replace(/^[^S]+Storage Contents:\n /, '')
          }

          prev2Chunk = prevChunk
          prevChunk = chunk

          if (chunk.indexOf('Result for /var/lib/rnode/') >= 0) {
            return
          }

          if (chunk.indexOf('] INFO') >= 0) {
            return
          }

          if (chunk === 'Evaluating:') {
            socket.emit('output.clean')
            return
          }

          if (chunk.indexOf('Evaluating:\r\n') === 0) {
            chunk = chunk.replace('Evaluating:\r\n', '')
            socket.emit('output.clean')
          }

          if (type !== 'stdout' && !trimmed.length) {
            return
          }

          socket.emit('output.append', [chunk, type])
        })
        console.log('Running ' + image + ' with: ' + path)
        DockerManager.getOrStartContainer('rchain/rnode', version, function (containerId) {
          const container = docker.getContainer(containerId)
          console.log('attaching')
          container.start(function () {
            container.exec({
              Cmd: ['bin/rnode', 'eval', '/var/lib/rnode/' + id + '/' + filename],
              AttachStdout: true
            }, function (err, exec) {
              if (err) {
                socket.emit('output.append', 'Container Error: ' +
                  (err.json ? err.json.message || err.message : err.message) + '\n\n')
                socket.emit('output.done')
                fs.unlink(path, () => {})

                // We probably need to reset the docker container we're using here
                const name = 'rchain-local-v6-version-' + version.replace(/\./g, '')
                fs.unlink('/tmp/rnode/' + name + '.id', () => {})

                cb()
                return
              }

              container.attach({stream: true, stdout: true, stderr: true}, function (err, stream) {
                if (err) {
                  socket.emit('output.append', 'Container Error: ' +
                    (err.json ? err.json.message || err.message : err.message) + '\n\n')
                  socket.emit('output.done')
                  fs.unlink(path, () => {})
                  cb()
                }
                stream.pipe(streamo)
              })

              exec.start({hijack: true}, function (err, stream) {
                if (err) {
                  socket.emit('output.append', 'Container Error: ' +
                    (err.json ? err.json.message || err.message : err.message) + '\n\n')
                  socket.emit('output.done')
                  fs.unlink(path, () => {})
                  cb()
                  return
                }
                stream.pipe(streamo, {
                  end: true
                })

                stream.on('end', function () {
                  socket.emit('output.done')
                  fs.unlink(path, () => {})
                  cb()
                })
              })
            })
          })
        })
      })
    })
  }
}

module.exports = DockerManager
