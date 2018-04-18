const request = require('request')

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
      }))
    })
  }

  static pullAllTags (image, docker) {
    DockerRegistry.getTags(image, function (tags) {
      tags.forEach(tag => {
        const imageString = image + ':' + tag
        docker.pull(imageString, function (err) {
          console.log('Pulled ' + imageString + ': ' + (err || 'OK'))
        })
      })
    })
  }
}

module.exports = DockerRegistry
