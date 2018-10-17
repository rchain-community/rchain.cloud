/*
  Author: Andrijan Ostrun
  Description:
  This is a helper script that parses array of file paths into
  an object that represents that represents file tree structure.

  For input/output examples check ./path_parser_test.js.

*/
let fileStructure = []

export default function parsePaths(paths) {
  for (let pathIdx in paths) {
    let pathSplit = paths[pathIdx].split('/')
    let currentParent = fileStructure
    let currentPath = ''
    for (let pathFileIdx = 1; pathFileIdx < pathSplit.length; pathFileIdx++) {
      let file = pathSplit[pathFileIdx]
      currentPath = currentPath + '/' + file
      if (parseInt(pathFileIdx, 10) === pathSplit.length - 1) {
        // Save file to the folder
        currentParent.push({
          module: file,
          leaf: true,
          serverStorage: true,
          path: currentPath
        })
        continue
      }
      let foundFolder = checkParentFolder(currentParent, file)
      if (!foundFolder) {
        // Folder not found, create it
        foundFolder = {
          module: file,
          path: currentPath + '/',
          serverStorage: true,
          children: []
        }
        currentParent.push(foundFolder)
      } else if (!foundFolder.children) {
        // Folder found, but it doesn't have any children yet
        foundFolder.children = []
      }
      currentParent = foundFolder.children
    }
  }
  return fileStructure
}

function checkParentFolder(parentFolderObj, folderName) {
  for (let fileIdx in parentFolderObj) {
    let file = parentFolderObj[fileIdx]
    if (file.module === folderName) {
      return file
    }
  }
  return null
}
