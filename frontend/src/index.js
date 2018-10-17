import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import RootComponent from './components/RootComponent'
import registerServiceWorker from './registerServiceWorker'
import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <RootComponent />
  </Provider>
  , document.getElementById('root'))
registerServiceWorker()
