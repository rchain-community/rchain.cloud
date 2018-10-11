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
    Tree item contents are defined with SidebarTreeItem
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
