import React, { Component } from 'react'
import SplitPane from 'react-split-pane'
import Toolbar from '../../components/Toolbar/toolbar'
import Sidebar from '../../components/Sidebar/sidebar'
import Console from '../../components/Console/console'
import styles from './styles.css'
import './resizer.css'
import theme from '../../theme/theme.css'

export default class Editor extends Component {
  render() {
    let windowHeight = window.innerHeight
    return (
      <div className={styles.mainContainer}>
        <div className={styles.toolbarContainer} >
          {/* ********************************** */}
          {/* ****** TOOLBAR PLACEHOLDER ******* */}
          {/* ********************************** */}
          <Toolbar />
        </div>

        <div className={styles.contentContainer}>
          <SplitPane split='vertical' style={{ position: 'relative', height: 'unset' }} minSize={150} maxSize={500} defaultSize={230}>
            <div className={[styles.sidebarContainer, theme.sidebarTheme].join(' ')}>
              {/* ********************************** */}
              {/* ****** SIDEBAR PLACEHOLDER ******* */}
              {/* ********************************** */}
              <Sidebar />
            </div>

            <SplitPane split='horizontal' minSize={400} maxSize={windowHeight - 110} defaultSize={650}>

              <div style={{ color: 'white' }}>
                {/* ************************************* */}
                {/* ****** CODEMIRROR PLACEHOLDER ******* */}
                {/* ************************************* */}
                Code placeholder
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

      </div >
    )
  }
}
