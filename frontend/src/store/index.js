import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../reducers/index'
import { loadState, saveState } from './localstorage.js'
import notificationMiddleware from './middleware/notifications.js'
import asyncDispatchMiddleware from './middleware/asyncActions.js'
import createSagaMiddleware from 'redux-saga'
import { fileSelectedWatch, saveEditorContentsWatch, addFileWatch, renameFileWatch, setExampleFilesWatch, editorCompileCodeWatch, saveFileWatch } from '../saga/sagas'

const savedLocally = loadState()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  rootReducer,
  savedLocally,
  composeEnhancers(
    applyMiddleware(asyncDispatchMiddleware, notificationMiddleware, sagaMiddleware)
  )
)

sagaMiddleware.run(fileSelectedWatch)
sagaMiddleware.run(saveEditorContentsWatch)
sagaMiddleware.run(addFileWatch)
sagaMiddleware.run(renameFileWatch)
sagaMiddleware.run(saveFileWatch)
sagaMiddleware.run(setExampleFilesWatch)
sagaMiddleware.run(editorCompileCodeWatch)
// sagaMiddleware.run(editorInputChangedWatch)

store.subscribe(() => {
  saveState(store.getState())
})

export default store
