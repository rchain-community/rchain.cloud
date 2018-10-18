import defaultState from './files_default_state'
import { FILE_SELECTED, FILE_ADDED, FILE_RENAMED, SET_EXAMPLES } from '../actions'
import { SERVER_URL, EXAMPLES_FOLDER_NAME } from '../constants'

export default function (state = defaultState, action) {
  switch (action.type) {
    /*
        ***************
        -FILE_SELECTED-
        ***************
    */
    case FILE_SELECTED:
      /*
        If file is selected, check if file is folder or file.
        If selected file is folder, collapse/uncollapse the folder.

        action.payload: {
          file - file that is currently being selected
        }
      */
      if (!action.payload.leaf) {
        if (action.payload.collapsed) {
          action.payload.collapsed = false
        } else {
          action.payload.collapsed = true
        }
        return Object.assign({}, state)
      } else {
        // TODO First try to fetch from localstorage...
        console.log('%cTODO Try to fetch from localstorage...', 'color: orange')
        // Fetch file from server
        // Works only for files that have attribute serverStorage
        if (action.payload.serverStorage) {
          window.fetch(SERVER_URL + action.payload.path)
            .then(res => {
              return res.text()
            })
            .then(data => {
              // Display collected data
              console.log(data)
            }).catch((err) => {
              console.log('Error while fetching file: ' + action.payload.path + '; ' + err)
            })
        }
      }

      return Object.assign({}, state, { active: action.payload })

    /*
      ***************
      ---FILE_ADDED--
      ***************
    */
    case FILE_ADDED:
      /*
        Adding new file
        TODO:
        - Display alert when new file name collides with existing file
        --- Possible solution: MaterialUI Snackbar

        action.payload: {
          file - file to be added to the structure,
          path - path of the parent folder where file should be placed into
        }
      */

      if (!validateFileName(action.payload.file.module)) {
        // Invalid filename
        console.log(
          '%cFile renaming failed: New filename ' +
          '(' + action.payload.file.module + ')' +
          ' is invalid', 'color: red'
        )
        return Object.assign({}, state)
      }

      let parent = findObjectByPath(state.data, action.payload.path)
      if (parent === null) {
        return Object.assign({}, state)
      }

      // Check if filename collides with any existing files
      for (let childIdx in parent.children) {
        let child = parent.children[childIdx]
        if (child.module === action.payload.file.module) {
          console.log('%cFile creation failed: File with that name already exists inside: ' + parent.path, 'color: red')
          return Object.assign({}, state)
        }
      }

      action.payload.file.path = parent.path + action.payload.file.module
      // If file is not leaf (it's a folder in that case)
      // then append '/' to the end of the path
      if (!action.payload.file.leaf) {
        if (!action.payload.file.path.endsWith('/')) {
          action.payload.file.path = action.payload.file.path + '/'
        }
        if (!action.payload.file.children || !(action.payload.file.children instanceof Array)) {
          action.payload.file.children = []
        }
      }

      parent.children.push(action.payload.file)
      return Object.assign({}, state)

    /*
      ***************
      -FILE_RENAMED--
      ***************
    */
    case FILE_RENAMED:
      /*
        Renaming file
        TODO:
        - Display alert when new file name collides with existing file
        --- Possible solution: MaterialUI Snackbar

        action.payload: {
          file - file object to be renamed,
          newName - new file name
        }
      */
      if (!validateFileName(action.payload.newName)) {
        // Invalid filename
        console.log('%cFile renaming failed: New filename (' + action.payload.newName + ') is invalid', 'color: red')
        return Object.assign({}, state)
      }
      let currentFileName = action.payload.file.module
      let parentPath = action.payload.file.path.slice(0, -currentFileName.length)
      parent = findObjectByPath(state.data, parentPath)

      // Check if filename collides with any existing files
      for (let childIdx in parent.children) {
        let child = parent.children[childIdx]
        if (child.module === action.payload.newName) {
          console.log('%cFile renaming failed: File with that name already exists inside: ' + parent.path, 'color: red')
          return Object.assign({}, state)
        }
      }

      action.payload.file.module = action.payload.newName
      action.payload.file.path = parentPath + action.payload.newName

      // Check if file was active/selected
      if (state.active.path === parentPath + currentFileName) {
        // Change active file details to new name and path
        state.active = action.payload.file
      }

      return Object.assign({}, state)

    /*
      ***************
      -SET_EXAMPLES--
      ***************
    */
    case SET_EXAMPLES:
      /**
       * action.payload: {
       *  examples - file structure of example files
       * }
       */
      let examples = action.payload.examples.find(obj => { return obj.module === EXAMPLES_FOLDER_NAME })
      examples.fetch = true
      let currentExamplesIdx = state.data.children.findIndex((folder) => {
        return folder.module === EXAMPLES_FOLDER_NAME
      })
      if (currentExamplesIdx >= 0) {
        state.data.children[currentExamplesIdx] = examples
      } else {
        state.data.children.push(examples)
      }
      return Object.assign({}, state)
  }

  return Object.assign({}, state)
}

function findObjectByPath(file, path) {
  if (file.path === path) {
    return file
  }

  if (file.leaf) {
    return null
  }
  let found
  for (var child in file.children) {
    found = findObjectByPath(file.children[child], path)
    if (found !== null) {
      return found
    }
  }
  return null
}

function validateFileName(filename) {
  let validFilename = /^[a-z0-9_.@()-]+$/i.test(filename)
  return validFilename
}
