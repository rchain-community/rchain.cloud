const path = require('path')
const sourceFolder = path.join(__dirname, '..', 'public', 'examples')
const walk = require('walk')

/**
 * Read files that have been served in the public folder
 * on the server side. Filenames are later passed to the
 * frontend and they are accessed via AJAX.
 */
class FileReader {
  static readFiles () {
    var files = []
    walk.walkSync(sourceFolder, {
      listeners: {
        file: function (root, stat, next) {
          stat.name.endsWith('.rho') && files.push(stat.name)
          next()
        }
      },
      followLinks: false
    })

    return files
  }
}

module.exports = FileReader
