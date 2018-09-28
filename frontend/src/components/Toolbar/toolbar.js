import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar'
import MaterialToolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import Switch from 'react-toggle-switch'
import SettingsModal from '../SettingsModal/settings_modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './toolbar.css'
import theme from '../../theme/theme.css'
import { toggleSettingsModal, toggleFullscreenMode } from '../../actions'
import './switch.css'

class Toolbar extends Component {
  render() {
    return (
      <div>
        <AppBar position='relative' className={theme.secondary} style={{ minHeight: '55px' }}>
          <MaterialToolbar>
            <div className={styles.toolbarContainer}>
              <div className={styles.toolbarTitleContainer}>
                <img className={styles.toolbarLogo} src='./images/rchain_logo_red.png' />
                <Typography className={styles.toolbarTitle} variant='title' color='inherit' style={{ overflow: 'unset' }} noWrap>
                  RChain.Cloud
                </Typography>
              </div>
              <div className={styles.toolbarMenu} >
                <div className={styles.toolbarMenuItem} onClick={this.props.toggleSettingsModal}>
                  <FontAwesomeIcon icon='cog' className={theme.icon} />
                </div>

                <a className={[styles.toolbarLink, styles.toolbarMenuItem].join(' ')} target='_blank' rel='noopener noreferrer' href='https://github.com/rchain-community/rchain.cloud'>
                  <FontAwesomeIcon icon={['fab', 'github']} className={theme.icon} />
                </a>

                <Switch
                  on={this.props.settings.fullscreen.enabled}
                  onClick={this.props.toggleFullscreenMode}
                />
              </div>
            </div>
          </MaterialToolbar>
        </AppBar >

        <SettingsModal />

      </div>
    )
  }
}

Toolbar.propTypes = {
  toggleSettingsModal: PropTypes.func,
  toggleFullscreenMode: PropTypes.func,
  settings: PropTypes.object
}

function mapStateToProps(state) {
  return {
    settings: state.settings
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleSettingsModal: toggleSettingsModal,
    toggleFullscreenMode: toggleFullscreenMode
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
