import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar'
import MaterialToolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
              <div className={styles.toolbarMenuItem}>
                <FontAwesomeIcon icon='cog' className={theme.icon} />
              </div>

              <a className={[styles.toolbarLink, styles.toolbarMenuItem].join(' ')} target='_blank' rel='noopener noreferrer' href='https://github.com/rchain-community/rchain.cloud'>
                <FontAwesomeIcon icon={['fab', 'github']} className={theme.icon} />
                {/*
                <Typography variant='body2' color='inherit' noWrap>
                  Github
                </Typography>
                */}
              </a>

            </div>
          </div>
        </MaterialToolbar>
      </AppBar >
    )
  }
}
export default Toolbar
