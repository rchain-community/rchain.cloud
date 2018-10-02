import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Tree from 'react-file-view'
import { selectFile, addFile, renameFile } from '../../actions/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './sidebar_tree.css'
import theme from '../../theme/theme.css'

class SidebarTree extends Component {
  fileClick(node) {
    this.props.selectFile(node)
  }

  addNewFolder(e, path) {
    e.stopPropagation()
    // eslint-disable-next-line
    let name = window.prompt('Please enter new folder name', 'new-folder')
    let newFolder = {
      module: name
    }
    this.props.createFile(newFolder, path)
  }

  addNewFile(e, path) {
    e.stopPropagation()
    // eslint-disable-next-line
    let name = window.prompt('Please enter new file name', 'new-file')
    let newFile = {
      module: name,
      leaf: true
    }
    this.props.createFile(newFile, path)
  }

  renameFile(e, file) {
    e.stopPropagation()
    // eslint-disable-next-line
    let newName = window.prompt('Please enter new file name', file.module)
    this.props.renameFile(file, newName)
  }

  renderNode = node => {
    let fileIcon
    let nodeFolder = false
    if (node.leaf) {
      fileIcon = 'file-code'
    } else if (node.collapsed) {
      fileIcon = 'folder'
    } else {
      fileIcon = 'folder-open'
      nodeFolder = true
    }

    let iconClass = [styles.icon, theme.sidebarIcon].join(' ')
    let nodeActive = false
    if (node === this.props.files.active) {
      nodeActive = true
      iconClass = [styles.icon, theme.sidebarActiveIcon].join(' ')
    }

    return (
      <span
        onClick={() => this.fileClick(node)}
        className={styles.sidebarItem}
      >
        <FontAwesomeIcon className={iconClass} icon={fileIcon} />
        <span className={[styles.sidebarItemTitle, theme.sidebarItemText].join(' ')}>
          {node.module}
        </span>
        {/*
          Show dot icon next to the node that is currently selected.
        */}
        {
          <FontAwesomeIcon
            className={[styles.circleIcon, theme.sidebarActiveIcon].join(' ')}
            icon='dot-circle'
            size='xs'
            style={nodeActive ? { display: 'block' } : { display: 'none' }}
          />
        }
        {/*
          If node is a folder show additional icons that provide
          optional functionalities such as add new file, add new
          folder, etc.
        */}
        <div className={[styles.nodeOptions, theme.sidebarIcon].join(' ')}>
          {
            nodeFolder && (
              <div>
                <FontAwesomeIcon
                  className={[styles.nodeOptionsIcons, theme.sidebarOptionIcon].join(' ')}
                  icon='folder-plus'
                  size='xs'
                  onClick={(e) => {
                    this.addNewFolder(e, node.path)
                  }}
                />
                <FontAwesomeIcon
                  className={[styles.nodeOptionsIcons, theme.sidebarOptionIcon].join(' ')}
                  icon='file-medical'
                  size='xs'
                  onClick={(e) => {
                    this.addNewFile(e, node.path)
                  }}
                />
              </div>
            )
          }
          <div>
            <FontAwesomeIcon
              className={[styles.nodeOptionsIcons, theme.sidebarOptionIcon].join(' ')}
              icon='file-signature'
              size='xs'
              onClick={(e) => {
                this.renameFile(e, node)
              }}
            />
          </div>
        </div>

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
  selectFile: PropTypes.func,
  createFile: PropTypes.func,
  renameFile: PropTypes.func
}

function mapStateToProps(state) {
  return {
    files: state.files
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    selectFile: selectFile,
    createFile: addFile,
    renameFile: renameFile

  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarTree)
