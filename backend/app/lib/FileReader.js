const path = require('path')
const sourceFolder = path.join(__dirname, '..', 'public', 'examples')
const walk = require('walk')

/**
 * Read files that have been served in the public folder
 * on the server side. Filenames are later passed to the
 * frontend and they are accessed via AJAX.
 */
class FileReader {
  static readFiles(format = false) {
    var files = []
    walk.walkSync(sourceFolder, {
      listeners: {
        file: function (root, stat, next) {
          let filePath = `${root}/${stat.name}`.substring(sourceFolder.length)
          filePath = `/examples${filePath}`
          stat.name.toLowerCase().endsWith('.rho') && files.push(filePath)
          next()
        }
      },
      followLinks: false
    })
    // Format files
    if (format === true) {
      console.log('Formating...')
    }

    return files
  }
}

module.exports = FileReader
