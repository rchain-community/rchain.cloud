import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../reducers/index'
import { loadState, saveState } from './localstorage.js'
// import notificationMiddleware from './middleware/notifications.js'
import asyncDispatchMiddleware from './middleware/asyncActions.js'

const savedLocally = loadState()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  rootReducer,
  savedLocally,
  composeEnhancers(
    applyMiddleware(asyncDispatchMiddleware)
  )
)

store.subscribe(() => {
  saveState(store.getState())
})

export default store
