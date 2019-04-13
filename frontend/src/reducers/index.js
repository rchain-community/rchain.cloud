import { combineReducers } from 'redux'
import FilesReducer from './reducer_files'
import SettingsReducer from './reducer_settings'
import EditorReducer from './reducer_editor'
import { reducer as toastrReducer } from 'react-redux-toastr'

const rootReducer = combineReducers({
  files: FilesReducer,
  editor: EditorReducer,
  settings: SettingsReducer,
  toastr: toastrReducer
})

export default rootReducer
