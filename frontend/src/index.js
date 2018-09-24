import React from 'react'
import ReactDOM from 'react-dom'
import RootComponent from './components/RootComponent'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<RootComponent />, document.getElementById('root'))
registerServiceWorker()
