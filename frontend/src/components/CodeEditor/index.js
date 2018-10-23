import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Controlled as CodeMirror } from 'react-codemirror2'
import rholang from 'codemirror-rholang'
import { saveFile } from '../../store/localstorage'
// eslint-disable-next-line
import '!style-loader!css-loader!./style.css'
import { editorChangeValue } from '../../actions'

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
class CodeEditor extends React.PureComponent {
  static propTypes = {
    children: PropTypes.string
  }

  constructor(props) {
    super(props)

    // Remove line numbers in front of some of the code examples
    const regex = /^\s?\d+\s/gm
    let hasLineNumbers = false
    let value
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
      value
    }
  }

  render() {
    const { hasLineNumbers, originalValue } = this.state

    return (
      <div className='code-editor'>
        <CodeMirror
          value={this.props.state.editor.value}
          defineMode={{ name: 'rholang', fn: rholang }}
          options={{
            lineNumbers: true,
            lineWrapping: true,
            tabSize: 2,
            mode: 'rholang',
            viewportMargin: Infinity,
            theme: 'solarized',
            scrollbarStyle: 'null'
          }}
          onBeforeChange={(editor, data, value) => {
            this.props.valueChanged(value)
          }}
          onChange={(editor, data, value) => {
            saveFile(this.props.activeFile, value)
          }}
        />
      </div>
    )
  }
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
    valueChanged: editorChangeValue
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor)
