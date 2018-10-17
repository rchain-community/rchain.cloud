import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Tree from 'react-file-view'
import { selectFile, setExamples } from '../../actions/index'
import pathParser from './path_parser'
import styles from './sidebar_tree.css'
import { FETCH_EXAMPLE_LIST_URL } from '../../constants'
import SidebarTreeItem from '../SidebarTreeItem'

class SidebarTree extends Component {
  componentDidMount() {
    /*
      after component mounts, fetch the example
      list from the server.
      TODO:
      Should this be done after every mounting?
      Maybe caching is not a bad idea.
    */
    window.fetch(FETCH_EXAMPLE_LIST_URL)
      .then(res => {
        return res.json()
      })
      .then(data => {
        let examples = pathParser(data)
        examples.forEach(file => { file.collapsed = 'true' })
        if (examples) {
          this.props.setExamples(examples)
        }
      })
  }

  /*
    This method is used to render individual tree items.
    Tree item contents are defined within SidebarTreeItem
    component.
  */
  renderNode = node => {
    return (<SidebarTreeItem node={node} />)
  }

  render() {
    return (
      <div className={styles.treeContainer}>
        <Tree
          tree={this.props.files.data}
          paddingLeft={20}
          renderNode={this.renderNode}
          onClickItem={this.props.selectFile}
        />
      </div>
    )
  }
}

SidebarTree.propTypes = {
  files: PropTypes.object,
  selectFile: PropTypes.func,
  setExamples: PropTypes.func
}

/*
  Connecting component to REDUX states
  and actions.
*/
function mapStateToProps(state) {
  return {
    files: state.files
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    selectFile: selectFile,
    setExamples: setExamples
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarTree)
