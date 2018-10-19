import store from '../../store/index'
import { selectFile, addFile, renameFile } from '../../actions/index'

/**
 * Functions located in this file are wrappers for the
 * Redux actions for file operations. Currently
 * these function invoke browser's prompts
 * to interact with the user, but in the future
 * we could introduce a custom way of interacting
 * with the user.
 * ----------------------------------------------
 * Prompts are disallowed by eslint but for now
 * prompts are the simplest and easiest solution
 * for gathering user input.
 * That is why window.prompt lines of code are
 * ignored by eslint.
 */

export function fileClick(node) {
  store.dispatch(selectFile(node))
}

/**
 * Wrapper for the Redux action addFile that adds new folder to
 * the file structure.
 * @param {*} path Path of the parent folder to which new folder is being added.
 */
export function addNewFolderPrompt(path) {
  // eslint-disable-next-line
  let name = window.prompt('Please enter new folder name', 'new-folder')
  if (name === null || name === '') {
    return
  }
  let newFolder = {
    module: name
  }
  store.dispatch(addFile(newFolder, path))
}

/**
 * Wrapper for the Redux action addFile that adds new file to
 * the file structure.
 * @param {*} path Path of the parent folder to which new file is being added.
 */
export function addNewFilePrompt(path) {
  // eslint-disable-next-line
  let name = window.prompt('Please enter new file name', 'new-file')
  if (name === null || name === '') {
    return
  }
  let newFile = {
    module: name,
    leaf: true
  }
  store.dispatch(addFile(newFile, path))
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

/**
 * Wrapper for the Redux action renameFile that renames
 * file or folder.
 * @param {*} file File object that is being renamed.
 */
export function renameFilePrompt(file) {
  // eslint-disable-next-line
  let newName = window.prompt('Please enter new file name', file.module)
  if (newName === null || newName === '') {
    return
  }
  store.dispatch(renameFile(file, newName))
}
