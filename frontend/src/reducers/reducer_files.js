import defaultState from './files_default_state'
import { FILE_SELECTED, FILE_RENAMED, FOLDER_SELECTED, FILE_ADDED_SUCCESS, EXAMPLE_FILES_FETCHED } from '../actions'

export default function (state = defaultState, action) {
  switch (action.type) {
    /*
      *****************
      -FOLDER_SELECTED-
      *****************

      Collapse/Expand the folder
    */
    case FOLDER_SELECTED:
      if (action.payload.collapsed) {
        action.payload.collapsed = false
      } else {
        action.payload.collapsed = true
      }
      return Object.assign({}, state)

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
        return Object.assign({}, state)
      }
      return Object.assign({}, state, { active: action.payload })

    /*
      ***************
      ---FILE_ADDED--
      ***************
    */
    case FILE_ADDED_SUCCESS:
      /*
        File added successfully
      */
      return Object.assign({}, state)

    /*
      ***************
      -FILE_RENAMED--
      ***************
    */
    case FILE_RENAMED:
      /*
        File renamed successfully
      */
      return Object.assign({}, state)

    /*
      ***************
      -SET_EXAMPLES--
      ***************
    */
    case EXAMPLE_FILES_FETCHED:
      /**
       * action.payload: {
       *  examples - file structure of example files
       * }
       */
      return Object.assign({}, state)
  }

  return Object.assign({}, state)
}
