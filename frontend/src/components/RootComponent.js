import React from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import Editor from '../routes/editor'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

library.add(faCog)
library.add(faGithub)

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
