import { createStore } from 'redux'
import rootReducer from '../reducers/index'
import { loadState, saveState } from './localstorage.js'

const savedLocally = loadState()

const store = createStore(
  rootReducer,
  savedLocally,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

store.subscribe(() => {
  saveState(store.getState())
})

export default store
