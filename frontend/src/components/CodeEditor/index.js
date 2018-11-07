import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Controlled as CodeMirror } from 'react-codemirror2'
import rholang from 'codemirror-rholang'
// eslint-disable-next-line
import '!style-loader!css-loader!./style.css'
import { editorChangeValue, saveEditorContent } from '../../actions'
import 'codemirror/addon/edit/closebrackets.js'

/* eslint-disable */
import '!style-loader!css-loader!codemirror/lib/codemirror.css'
import '!style-loader!css-loader!codemirror/theme/material.css'
import '!style-loader!css-loader!codemirror/theme/neat.css'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/javascript/javascript.js'


// import RunButton from './RunButton'

/**
 * CodeMirror is Controller by Redux, that's why we use Controlled variant
 * of CodeMirror instead of Uncontrolled.
 */
class CodeEditor extends React.Component {
  constructor(props) {
    super(props)
    // Remove line numbers in front of some of the code examples
    const regex = /^\s?\d+\s/gm
    let hasLineNumbers = false
    let value
    let cursor
    if (props.children) {
      value = props.children
      hasLineNumbers = value.match(regex)
      if (hasLineNumbers) {
        value = props.children.replace(regex, '')
      }
    }

    this.state = {
      originalValue: value,
      hasLineNumbers,
      value,
      cursor
    }
  }
  /*
  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextState)
    return nextProps.state.value !== this.props.state.value
  }
  
  componentWillUpdate(nextProps, nextState) {
    console.log(nextState)
  }
  */
  cursorChanged(newState) {
    this.setState({ cursor: newState })
  }

  render() {
    const { hasLineNumbers, originalValue } = this.state

    let cursorData
    if (this.state.cursor) {
      cursorData = 'Ln: ' + (this.state.cursor.line + 1) + ' Col: ' + (this.state.cursor.ch + 1)
    }

    return (
      <div className='code-editor'>
        <CodeMirror
          value={this.props.state.value}
          defineMode={{ name: 'rholang', fn: rholang }}
          options={{
            lineNumbers: true,
            lineWrapping: true,
            autoCloseBrackets: true,
            tabSize: 2,
            mode: 'rholang',
            viewportMargin: Infinity,
            theme: 'solarized',
            scrollbarStyle: 'null'
          }}

          onBeforeChange={(editor, data, value) => {
            this.props.valueChanged(value)
            //this.setState({ originalValue: value })
          }}

          onChange={(editor, data, value) => {
            this.props.saveFile(this.props.activeFile, value)
          }}
          onCursorActivity={(editor, data, value) => {
            this.cursorChanged(editor.getDoc().getCursor())
          }}
        />

        <div className='cursor-data'>
          {cursorData}
        </div>
      </div>
    )
  }
}

CodeEditor.propTypes = {
  state: PropTypes.object,
  activeFile: PropTypes.object
}

/*
  Connecting component to REDUX states
  and actions.
*/
function mapStateToProps(state) {
  return {
    state: state.editor,
    activeFile: state.files.active
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    valueChanged: editorChangeValue,
    saveFile: saveEditorContent
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor)
