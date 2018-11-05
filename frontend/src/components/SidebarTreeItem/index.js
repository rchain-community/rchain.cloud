import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './style.css'
import theme from '../../theme/theme.css'
import { WORKSPACE_FOLDER_NAME } from '../../constants'
import { addNewFolderPrompt, addNewFilePrompt, renameFilePrompt, fileClick } from './file_operations'

class SidebarTreeItem extends Component {
  render() {
    let fileIcon
    let nodeFolder = false
    if (this.props.node.leaf) {
      fileIcon = 'file-code'
    } else if (this.props.node.collapsed) {
      fileIcon = 'folder'
    } else {
      fileIcon = 'folder-open'
      nodeFolder = true
    }

    let iconClass = [styles.icon, theme.sidebarIcon].join(' ')
    let nodeActive = false
    if (this.props.files.active.module &&
      this.props.node.module === this.props.files.active.module &&
      this.props.node.path === this.props.files.active.path) {
      nodeActive = true
      iconClass = [styles.icon, theme.sidebarActiveIcon].join(' ')
    }

    let activeFileIndicatorDiv = (
      /*
        Show dot icon next to the this.props.node that is currently selected.
      */
      <FontAwesomeIcon
        className={[styles.circleIcon, theme.sidebarActiveIcon].join(' ')}
        icon='dot-circle'
        size='xs'
        style={nodeActive ? { display: 'block' } : { display: 'none' }
        }
      />

    )

    let addFolderDiv = (
      /*
        Container that displays icon for adding new folders
      */
      <FontAwesomeIcon
        className={[styles.nodeOptionsIcons, theme.sidebarOptionIcon].join(' ')}
        title='New Folder'
        icon='folder-plus'
        size='xs'
        onClick={(e) => {
          e.stopPropagation()
          addNewFolderPrompt(this.props.node.path)
        }}
      />
    )

    let addFileDiv = (
      /*
        Container that displays icon for adding new files
      */
      <FontAwesomeIcon
        className={[styles.nodeOptionsIcons, theme.sidebarOptionIcon].join(' ')}
        title='New File'
        icon='file-medical'
        size='xs'
        onClick={(e) => {
          e.stopPropagation()
          addNewFilePrompt(this.props.node.path)
        }}
      />
    )

    let renameFileDiv = (
      /*
        Container that displays icon for renaming files
      */
      <FontAwesomeIcon
        className={[styles.nodeOptionsIcons, theme.sidebarOptionIcon].join(' ')}
        title='Rename'
        icon='file-signature'
        size='xs'
        onClick={(e) => {
          e.stopPropagation()
          renameFilePrompt(this.props.node)
        }}
      />
    )
    /*
      Sidebar Tree Item is organized as follows:
      -> Main Container (<span/>)
        -> FontAwesome icon, either folder or file icon (<FontAwesome/>)
        -> File/Folder Title Container (<span/>)
        -> Active File Indicator, icon that indicates that the file is currently selected (<FontAwesome/>)
        -> File/Folder Operations Container
          -> Add New Folder icon, *applied only to Folder items* (<FontAwesome/>)
          -> Add New File icon, *applied only to Folder items* (<FontAwesome/>)
          -> Rename File icon, *applied to all items* (<FontAwesome />)
    */
    return (
      <span
        onClick={() => fileClick(this.props.node)}
        className={styles.sidebarItem}
      >
        <FontAwesomeIcon className={iconClass} icon={fileIcon} />
        <span className={[styles.sidebarItemTitle, theme.sidebarItemText].join(' ')}>
          {this.props.node.module}
        </span>

        {activeFileIndicatorDiv}

        {
          /*
            --------------------FILE/FOLDER OPERATIONS-----------------------
            If this.props.node is a folder show additional icons that provide
            optional functionalities such as add new file, add new
            folder, etc.

            DON'T DISPLAY FILE/FOLDER OPERATIONS TO THE FILES/FOLDERS THAT ARE
            ASSOCIATED WITH THE EXAMPLES THAT ARE FETCHED FROM THE SERVER.
            -> It makes no sense to edit example files/folders.
          */
          !this.props.node.serverStorage &&
          <div className={[styles.nodeOptions, theme.sidebarIcon].join(' ')}>
            {
              /*
                Folder operations:
                -> create new folder (subfolder to the current folder)
                -> create new file inside the current folder
              */
              nodeFolder && (
                <div>
                  {addFolderDiv}
                  {addFileDiv}
                </div>
              )
            }
            {
              /*
                WORKSPACE FOLDER CAN'T BE RENAMED
                That's why we check for file path if it matched the path
                of the root workspace folder.
                Folder & File operations:
                -> rename file/folder
              */
              this.props.node.path !== '/' + WORKSPACE_FOLDER_NAME + '/' &&
              <div>
                {renameFileDiv}
              </div>
            }

          </div>
        }

      </span>
    )
  }
}

SidebarTreeItem.propTypes = {
  node: PropTypes.object.isRequired,
  files: PropTypes.object
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

/*
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    selectFile: selectFile,
    createFile: addFile,
    renameFile: renameFile
  }, dispatch)
}
*/

export default connect(mapStateToProps)(SidebarTreeItem)
