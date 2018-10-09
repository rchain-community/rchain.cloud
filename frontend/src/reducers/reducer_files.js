import defaultState from './files_default_state'
import { FILE_SELECTED, FILE_ADDED, FILE_RENAMED, SET_EXAMPLES } from '../actions'
import { SERVER_URL } from '../constants'

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
            })
          console.log('Fetching from server...')
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
      */
      let parent = findObjectByPath(state.data, action.payload.path)
      if (parent === null) {
        return Object.assign({}, state)
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
      action.payload.file.module = action.payload.newName
      return Object.assign({}, state)

    /*
      ***************
      -FILE_RENAMED--
      ***************
    */
    case SET_EXAMPLES:
      let examples = action.payload.examples.find(obj => { return obj.module === 'examples' })
      examples.fetch = true
      state.data.children.push(examples)
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
