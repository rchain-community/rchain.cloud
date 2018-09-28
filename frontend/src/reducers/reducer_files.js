import defaultState from './files_default_state'
import { FILE_SELECTED, FILE_ADDED } from '../actions'

export default function (state = defaultState, action) {
  switch (action.type) {
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
      }
      return Object.assign({}, state, { active: action.payload })

    case FILE_ADDED:
      /*
        Adding new file
      */
      let parent = findObjectByPath(state, action.payload.path)

      if (parent === null) {
        return Object.assign({}, state)
      }

      action.payload.file.path = parent.path + action.payload.file.module
      // If file is not leaf (it's a folder in that case)
      // then append '/' to the end of the path
      if (!action.payload.file.leaf) {
        action.payload.file.path = action.payload.file.path + '/'
      }

      if (!(parent.children instanceof Array)) {
        parent.children = []
      }
      parent.children.push(action.payload.file)
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
