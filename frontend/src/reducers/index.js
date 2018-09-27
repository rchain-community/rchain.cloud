import { combineReducers } from 'redux'
import Files from './reducer_files'

const rootReducer = combineReducers({
  state: (state = {}) => state,
  files: Files
})

export default rootReducer
