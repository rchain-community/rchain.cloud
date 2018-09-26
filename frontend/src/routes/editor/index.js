import React, { Component } from 'react'
import SplitPane from 'react-split-pane'
import Toolbar from '../../components/Toolbar/toolbar'
import styles from './styles.css'
import './resizer.css'
import theme from '../../theme/theme.css'

export default class Editor extends Component {
  render () {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.toolbarContainer} >
          <Toolbar />
        </div>

        <div className={styles.contentContainer}>
          <SplitPane split='vertical' style={{ position: 'relative', height: 'unset' }} minSize={150} maxSize={500} defaultSize={230}>
            <div className={[styles.sidebarContainer, theme.sidebarTheme].join(' ')}>
              <div style={{ color: 'white' }}> Sidebar placeholder </div>
            </div>
            <SplitPane split='horizontal' minSize={600} maxSize={1000}>
              <div style={{ color: 'white' }}> Code placeholder </div>
              <div className={[styles.consoleContainer, theme.consoleTheme].join(' ')} style={{ color: 'white' }}> Console placeholder </div>
            </SplitPane>
            <div>Car</div>
          </SplitPane>
        </div>
      </div >
    )
  }
}
