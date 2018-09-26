import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar'
import MaterialToolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import styles from './toolbar.css'
import theme from '../../theme/theme.css'

class Toolbar extends Component {
  render () {
    return (
      <AppBar position='absolute' className={theme.secondary} style={{ minHeight: '55px' }}>
        <MaterialToolbar>
          <div className={styles.toolbarContainer}>
            <div className={styles.toolbarTitleContainer}>
              <img className={styles.toolbarLogo} src='./images/rchain_logo_red.png' />
              <Typography className={styles.toolbarTitle} variant='title' color='inherit' style={{ overflow: 'unset' }} noWrap>
                RChain.Cloud
              </Typography>
            </div>
            <div className={styles.toolbarMenu} >
              <a className={styles.toolbarLink} target='_blank' rel='noopener noreferrer' href='https://github.com/rchain-community/rchain.cloud'>
                <Typography variant='body2' color='inherit' noWrap>
                  Github
                </Typography>
              </a>
            </div>
          </div>
        </MaterialToolbar>
      </AppBar >
    )
  }
}
export default Toolbar
