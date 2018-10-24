import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReduxToastr from 'react-redux-toastr'
import SplitPane from 'react-split-pane'
import Toolbar from '../../components/Toolbar/toolbar'
import Sidebar from '../../components/Sidebar/sidebar'
import Console from '../../components/Console/console'
import CodeEditor from '../../components/CodeEditor/index.js'
import styles from './styles.css'
import './resizer.css'
import theme from '../../theme/theme.css'
import { toggleFullscreenMode } from '../../actions'
// eslint-disable-next-line
import '!style-loader!css-loader!react-redux-toastr/lib/css/react-redux-toastr.min.css'
// import ToggleSwitch from '../../components/ToggleSwitch/toggle_switch'

class Editor extends Component {
  render() {
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    let codeContainerClasses = [styles.codeContainer, theme.primary].join(' ')

    if (this.props.fullscreen.enabled) {
      codeContainerClasses = [styles.codeContainer, theme.primary, styles.fullscreenCodeContainer].join(' ')
    }

    return (
      <div className={styles.mainContainer}>
        <div className={styles.toolbarContainer} >
          {/* ********************************** */}
          {/* ****** TOOLBAR PLACEHOLDER ******* */}
          {/* ********************************** */}
          <Toolbar />
        </div>

        <div className={styles.contentContainer}>
          <SplitPane
            split='vertical'
            style={{ position: 'relative', height: 'unset' }}
            minSize={30}
            maxSize={windowWidth * 0.7}
            defaultSize={windowWidth * 0.15}
          >
            <div className={[styles.sidebarContainer, theme.sidebarTheme].join(' ')}>
              {/* ********************************** */}
              {/* ****** SIDEBAR PLACEHOLDER ******* */}
              {/* ********************************** */}
              <Sidebar />
            </div>

            <SplitPane split='horizontal' minSize={windowHeight * 0.1} maxSize={windowHeight - 110} defaultSize={windowHeight * 0.65}>

              <div className={codeContainerClasses}>
                {/* ************************************* */}
                {/* ****** CODEMIRROR PLACEHOLDER ******* */}
                {/* ************************************* */}
                <CodeEditor />
              </div>

              <div className={[styles.consoleContainer, theme.consoleTheme].join(' ')} style={{ color: 'white' }}>
                {/* ********************************** */}
                {/* ****** CONSOLE PLACEHOLDER ******* */}
                {/* ********************************** */}
                <Console />
              </div>

            </SplitPane>

          </SplitPane>

        </div>

        <ReduxToastr
          timeOut={2000}
          newestOnTop
          preventDuplicates
          position='top-left'
          transitionIn='fadeIn'
          transitionOut='fadeOut'
          progressBar
          closeOnToastrClick />

      </div >
    )
  }
}

Editor.propTypes = {
  fullscreen: PropTypes.object
  // toggleFullscreen: PropTypes.func
}

function mapStateToProps(state) {
  return {
    fullscreen: state.settings.fullscreen
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleFullscreen: toggleFullscreenMode
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
