import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import RootComponent from './components/RootComponent'
import registerServiceWorker from './registerServiceWorker'
import reducers from './reducers'

const createStoreWithMiddleware = applyMiddleware()(createStore)

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <RootComponent />
  </Provider>
  , document.getElementById('root'))
registerServiceWorker()
