import { combineReducers } from 'redux'
import FilesReducer from './reducer_files'
import SettingsReducer from './reducer_settings'

const rootReducer = combineReducers({
  state: (state = {}) => state,
  files: FilesReducer,
  settings: SettingsReducer
})

export default rootReducer
