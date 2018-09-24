import React from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'

import Editor from '../routes/editor'

export default class RootComponent extends React.Component {
  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Editor} />
        </Switch>
      </BrowserRouter>
    )
  }
}
