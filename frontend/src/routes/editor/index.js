import React, { Component } from 'react'
import Toolbar from '../../components/Toolbar/toolbar'
import styles from './styles.css'

export default class Editor extends Component {
  render () {
    return (
      <div>
        <Toolbar />
        <div className={styles.example}>Editor</div>
      </div>
    )
  }
}
