import React, { Component } from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import theme from '../../theme/theme.css'
import styles from './console.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Console extends Component {
  render() {
    return (
      <div className={styles.consoleContainer}>
        <div className={[styles.consoleHeader, theme.consoleHeader].join(' ')}>
          <div className={styles.consoleHeaderTitleContainer}>
            <FontAwesomeIcon className={styles.consoleHeaderIcon} icon='terminal' size='xs' />
            <span className={styles.consoleHeaderTitle}>Output</span>
          </div>
        </div>
        <div className={styles.consoleContent}>
          Console Content
        </div>
      </div>
    )
  }
}

export default Console
