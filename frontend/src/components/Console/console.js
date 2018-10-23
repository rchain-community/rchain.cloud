import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import theme from '../../theme/theme.css'
import styles from './console.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@material-ui/core/Button'
import { editorCompileCode } from '../../actions'

class Console extends Component {
  constructor() {
    super()
    this.compileClick = this.compileClick.bind(this)
  }

  compileClick() {
    console.log('Compile: \n ' + this.props.editorState.editor.value)
  }

  render() {
    return (
      <div className={[styles.consoleContainer, theme.consoleContainer].join(' ')}>
        <div className={[styles.consoleHeader, theme.consoleHeader].join(' ')}>
          <div className={styles.consoleHeaderTitleContainer}>
            <FontAwesomeIcon className={styles.consoleHeaderIcon} icon='terminal' size='xs' />
            <span className={styles.consoleHeaderTitle}>Output</span>

            <Button className={styles.consoleHeaderRun} onClick={this.props.compileCode}>Compile</Button>
          </div>
        </div>
        <div className={[styles.consoleContent, theme.consoleText].join(' ')}>
          <h4>OUTPUT</h4>
          <span>Hello, World!</span>
          <hr />
          <h4>COMPLETED</h4>
        </div>
      </div>
    )
  }
}

Console.propTypes = {
  editorState: PropTypes.object,
  compileCode: PropTypes.func
}

/*
  Connecting component to REDUX states
  and actions.
*/
function mapStateToProps(state) {
  return {
    editorState: state.editor
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    compileCode: editorCompileCode
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Console)
