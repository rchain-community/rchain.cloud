const request = require('request')
const fs = require('fs')

class DockerRegistry {
  static getTags (image, callback) {
    const url = 'https://registry.hub.docker.com/v2/repositories/' + image + '/tags/'
    request(url, function (error, response, body) {
      if (error || !body) {
        return callback([])
      }

      const data = JSON.parse(body)
      callback(data.results.map(function (tag) {
        return tag.name
      }).filter(function (tag) {
        // TESTING
        return tag === 'v0.3.1'

        return tag !== 'v0.2.1' && tag !== 'ops-test'
      }))
    })
  }

  static getNetwork (docker, done) {
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

  static getOrStartContainer (docker, image, tag, done) {
    const name = 'rchain-local-version-' + tag.replace(/\./g, '')
    fs.readFile('/tmp/rnode/' + name + '.id', 'utf8', function (err, id) {
      console.log('readfile', err, id)
      if (id) {
        return done(id)
      }

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
        Cmd: ['--standalone'],
        OpenStdin: false,
        StdinOnce: false,
        HostConfig: {
          Binds: ['/tmp/rnode:/var/lib/rnode'],
          NetworkMode: 'rchain-local'
        }
      }, function (err, container) {
        console.log('create', err, container.id)
        if (!err) {
          fs.writeFile('/tmp/rnode/' + name + '.id', container.id, function (err, res) {
            console.log('writefile', err, res)
          })
        }
        container.start(function (err, res) {
          console.log('start', err, res)
          done(container.id)
        })
      })
    })
  }

  static runAllTags (image, docker) {
    DockerRegistry.getNetwork(docker, function (err, network) {
      DockerRegistry.getTags(image, function (tags) {
        tags.forEach(tag => {
          const imageString = image + ':' + tag
          docker.pull(imageString, function (err) {
            console.log('Pulled ' + imageString + ': ' + (err || 'OK'))
            if (err) {
              return
            }
            DockerRegistry.getOrStartContainer(docker, image, tag, function (container) {
              // network.connect({
              //   Container: container
              // }, function (err, res) {
              //   console.log('network connect', err, res)
              //docker.getContainer(container).start(function (err, res) {
               // console.log('start', err, res)
              //})
              // })
            })
          })
        })
      })
    })
  }
}

module.exports = DockerRegistry
