import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Tree from 'react-ui-tree'
import { selectFile } from '../../actions/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './sidebar_tree.css'
import theme from '../../theme/theme.css'

class SidebarTree extends Component {
  fileClick(node) {
    this.props.selectFile(node)
  }

  renderNode = node => {
    let fileIcon
    if (node.leaf) {
      fileIcon = 'file-code'
    } else if (node.collapsed) {
      fileIcon = 'folder'
    } else {
      fileIcon = 'folder-open'
    }

    let iconClass = [styles.icon, theme.sidebarIcon].join(' ')
    let nodeActive = false
    if (node === this.props.files.active) {
      nodeActive = true
      iconClass = [styles.icon, theme.sidebarActiveIcon].join(' ')
    }

    return (
      <span
        /* onMouseDown={function (e) { e.stopPropagation() }} */
        onClick={() => this.fileClick(node)}
        className={styles.sidebarItem}
      >
        <FontAwesomeIcon className={iconClass} icon={fileIcon} />
        <span className={[styles.sidebarItemTitle, theme.sidebarItemText].join(' ')}>
          {node.module}
        </span>
        {
          nodeActive && <FontAwesomeIcon className={[styles.circleIcon, theme.sidebarActiveIcon].join(' ')} icon='dot-circle' size='xs' />
        }
      </span>
    )
  }

  render() {
    return (
      <div className={styles.treeContainer}>
        <Tree
          tree={this.props.files}
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
  selectFile: PropTypes.func
}

function mapStateToProps(state) {
  return {
    files: state.files
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    selectFile: selectFile
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarTree)
