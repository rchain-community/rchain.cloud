import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { selectFile, addFile, renameFile } from '../../actions/index'
import styles from './style.css'
import theme from '../../theme/theme.css'

class SidebarTreeItem extends Component {
  fileClick(node) {
    this.props.selectFile(node)
  }

  /*
    Prompts are disallowed by eslint but for now
    prompts are the simplest and easiest solution
    for gathering user input.
    That is why window.prompt lines of code are
    ignored by eslint.
  */
  addNewFolder(e, path) {
    e.stopPropagation()
    // eslint-disable-next-line
    let name = window.prompt('Please enter new folder name', 'new-folder')
    if (name === null || name === '') {
      return
    }
    let newFolder = {
      module: name
    }
    this.props.createFile(newFolder, path)
  }

  addNewFile(e, path) {
    e.stopPropagation()
    // eslint-disable-next-line
    let name = window.prompt('Please enter new file name', 'new-file')
    if (name === null || name === '') {
      return
    }
    let newFile = {
      module: name,
      leaf: true
    }
    this.props.createFile(newFile, path)
  }

  /*
    *******************************************
    ----- Further testing is required. --------
    *******************************************
    It is possible that problem occurs with the
    file path after renaming file/folder. Also
    renaming file will probably cause problems
    with local storage.
    Possible solution is to assign uuid to the
    files/folders and save them to the local
    storage via their uuid and not path or
    filename.
  */
  renameFile(e, file) {
    e.stopPropagation()
    // eslint-disable-next-line
    let newName = window.prompt('Please enter new file name', file.module)
    if (newName === null || newName === '') {
      return
    }
    this.props.renameFile(file, newName)
  }

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
    if (this.props.node === this.props.files.active) {
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
        icon='folder-plus'
        size='xs'
        onClick={(e) => {
          this.addNewFolder(e, this.props.node.path)
        }}
      />
    )

    let addFileDiv = (
      /*
        Container that displays icon for adding new files
      */
      <FontAwesomeIcon
        className={[styles.nodeOptionsIcons, theme.sidebarOptionIcon].join(' ')}
        icon='file-medical'
        size='xs'
        onClick={(e) => {
          this.addNewFile(e, this.props.node.path)
        }}
      />
    )

    let renameFileDiv = (
      /*
        Container that displays icon for renaming files
      */
      <FontAwesomeIcon
        className={[styles.nodeOptionsIcons, theme.sidebarOptionIcon].join(' ')}
        icon='file-signature'
        size='xs'
        onClick={(e) => {
          this.renameFile(e, this.props.node)
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
        onClick={() => this.fileClick(this.props.node)}
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
                Folder & File operations:
                -> rename file/folder
              */
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
  files: PropTypes.object,
  selectFile: PropTypes.func,
  createFile: PropTypes.func,
  renameFile: PropTypes.func
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
    createFile: addFile,
    renameFile: renameFile
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarTreeItem)
