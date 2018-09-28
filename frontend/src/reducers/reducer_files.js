import defaultState from './files_default_state'
import { FILE_SELECTED } from '../actions'

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
  }

  return state
}
