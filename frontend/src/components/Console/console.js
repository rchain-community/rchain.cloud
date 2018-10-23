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
    console.log('Compile: \n ' + this.props.editorState.value)
  }

  render() {
    let output
    if (this.props.editorState.console.compiling) {
      output = (
        <hr className={styles.hrCompile} />
      )
    } else {
      output = (
        <div>
          <h4>EVALUATING</h4>
          <span>{this.props.editorState.console.content.evaluating}</span>
          <hr />
          <h4>OUTPUT</h4>
          <span>{this.props.editorState.console.content.output}</span>
          <hr />
        </div>
      )
    }

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
          {output}
          {this.props.editorState.console.content.success && <h4>COMPLETED</h4>}
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
