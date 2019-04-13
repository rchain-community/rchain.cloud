import { fileNameInvalid, addVerifiedFile, selectFolder, editorChangeValue, fileAlreadyExists, saveFile, exampleFilesFetched } from '../actions'
import { put, call, select } from 'redux-saga/effects'
import { loadFile } from '../store/localstorage'
import { SERVER_URL, LOCALSTORAGE_FILE_CONTENT_KEY, EXAMPLES_FOLDER_NAME } from '../constants'

function* fetchFileFromServer(action) {
  let data
  try {
    let res = yield window.fetch(SERVER_URL + action.payload.path)
    data = yield res.text()
  } catch (error) {
    console.log('Error while fetching file: ' + action.payload.path + '; ' + error)
  }
  return data
  /*
      action.asyncDispatch({ type: EDITOR_VALUE_CHANGED, payload: { value: data } })
    }).catch((err) => {
      console.log('Error while fetching file: ' + action.payload.path + '; ' + err)
      action.asyncDispatch(fileFetchError(action.payload.path))
    })
  */
}

/**
 * Function tries to fetch file from multiple sources (local storage and server),
 * if none of the sources contain the file, empty file is initialized.
 * @param {object} action redux action
 */
export function* fileSelected(action) {
  if (!action.payload.leaf) {
    // Folder selected
    yield put(selectFolder(action.payload))
  } else {
    /**
     * First try to fetch file from the local storage.
     */
    const localstorageFilePromise = new Promise((resolve, reject) => {
      let result = loadFile(action.payload)
      resolve(result)
    })
    const localstorageFile = yield localstorageFilePromise

    if (localstorageFile) {
      /**
       * File successfully fetched from local storage, dispatch new action
       */
      yield put(editorChangeValue(localstorageFile.content))
    } else if (action.payload.serverStorage) {
      /**
       * Try to fetch file from server
       * Works only for files that have attribute serverStorage
       */
      let fileContent = yield call(fetchFileFromServer, action)
      if (fileContent) {
        yield put(editorChangeValue(fileContent))
      }
    } else {
      /**
       * Selected file is empty file from user's workspace, show empty editor
       */
      yield put(editorChangeValue(''))
    }
  }
}

function* preprocessFileName(input) {
  let fileName = yield input.trim()
  // Other processing logic
  return fileName
}

/**
 * Check whether filename is valid
 * @param {string} filename Filename to check
 */
function* validateFileName(filename) {
  let validFilename = yield /^[a-z0-9_.@()-]+$/i.test(filename)
  return validFilename
}

/**
 * Function finds and returns the file object from the
 * file structure tree.
 * Function uses recursive search as the file structure
 * is represented with tree structure.
 * @param {object} file Root of the file structure tree
 * @param {*} path Path of the file to look for
 */
const findObjectByPath = function (file, path) {
  return new Promise(function (resolve) {
    function recursiveFind(file, path) {
      if (file.path === path) {
        return file
      }

      if (file.leaf) {
        return null
      }
      let found
      for (var child in file.children) {
        found = recursiveFind(file.children[child], path)
        if (found) {
          return found
        }
      }
      return null
    }

    resolve(recursiveFind(file, path))
  })
}

const checkFileNameCollisions = function (fileName, parent) {
  return new Promise(function (resolve, reject) {
    for (let childIdx in parent.children) {
      let child = parent.children[childIdx]
      if (child.module === fileName) {
        resolve({ error: `Collision detected`, file: child })
      }
    }
    resolve({ success: true })
  })
}

/**
 * Update the old file object in the local storage structure
 * @param {object} file new file object
 * @param {*} oldFile old file object
 */
function* updateLocalstorageFileName(file, oldFile) {
  try {
    const localstorageOld = yield loadFile({ path: oldFile.path })
    if (localstorageOld) {
      // Remove old file name entry
      yield window.localStorage.removeItem(LOCALSTORAGE_FILE_CONTENT_KEY + oldFile.path)
      // Save new file name entry
      yield put(saveFile(file, localstorageOld.content))
    }
  } catch (err) {
    console.log('Error while renaming local storage: ' + err)
  }
}

function* extractParentsPath(file) {
  if (file.leaf) {
    return yield file.path.slice(0, -file.module.length)
  } else {
    return yield file.path.slice(0, -(file.module.length + 1))
  }
}

function* createRenamedFileObject(file, newFileName) {
  let renamedFile = yield Object.assign({}, file)
  let parentPath = yield call(extractParentsPath, file)
  renamedFile.module = newFileName
  renamedFile.path = parentPath + newFileName
  if (!file.leaf) {
    renamedFile.path += '/'
  }
  return renamedFile
}

/**
 * This function is critical for successful folder renaming.
 * This function takes care of all children of a given folder
 * by updating it's path to the new valid one as the parent folder
 * just changed it's name. As file structure is nested tree
 * this function is recursive to reach each node and leaf of the
 * tree structure.
 * @param {object} folder New parent folder object
 * @param {*} oldFolder Old parent folder object
 */
function* changeSubfoldersPaths(folder, oldFolder) {
  /**
   * Recursive function that does all the work.
   * -> Updates file path
   * -> Updates file entry in the local storage
   * @param {object} file Fole that is currently being processed
   * @param {object} rootFolder New parent folder object
   * @param {object} oldFolder Old parent folder object
   */
  function* recursiveChange(file, rootFolder, oldFolder) {
    // Change file path
    if (file.path) {
      let oldFile = Object.assign({}, file)
      let pathExtension = file.path.substring(oldFolder.path.length)
      file.path = folder.path + pathExtension

      // Update local storage
      yield call(updateLocalstorageFileName, file, oldFile)
    }
    // Recursive call for each of the children of the current folder
    for (let child in file.children) {
      // New updated object
      let newChild = yield call(recursiveChange, file.children[child], folder, oldFolder)
      // Replace object
      file.children[child] = newChild
    }

    // Return updated file object
    return file
  }

  // Call recursive update for each child of the folder that just changed it's name
  for (var child in folder.children) {
    // New updated object
    let newChild = yield call(recursiveChange, folder.children[child], folder, oldFolder)
    // Replace object
    folder.children[child] = newChild
  }
}

export function* addFile(action) {
  /*
    Adding new file

    action.payload: {
      file - file to be added to the structure,
      path - path of the parent folder where file should be placed into
    }
  */
  let state = yield select(state => state.files)
  action.payload.file.module = yield call(preprocessFileName, action.payload.file.module)
  let isFileNameValid = yield call(validateFileName, action.payload.file.module)
  if (!isFileNameValid) {
    // Invalid filename
    console.log(
      '%cFile renaming failed: New filename ' +
      '(' + action.payload.file.module + ')' +
      ' is invalid', 'color: red'
    )
    yield put(fileNameInvalid(action.payload.file.module))
    return
  }
  /**
   * Find parent folder in the file structure
   */
  let parent = yield findObjectByPath(state.data, action.payload.path)
  if (parent === null) {
    // Dispatch error message
    return
  }
  /**
   * Check if filename collides with any existing files
   */
  let res = yield checkFileNameCollisions(action.payload.file.module, parent)
  if (res.error) {
    yield put(fileAlreadyExists(res.file))
    return
  }

  action.payload.file.path = parent.path + action.payload.file.module
  // If file is not leaf (it's a folder in that case)
  // then append '/' to the end of the path
  if (!action.payload.file.leaf) {
    if (!action.payload.file.path.endsWith('/')) {
      action.payload.file.path = action.payload.file.path + '/'
    }
    if (!action.payload.file.children || !(action.payload.file.children instanceof Array)) {
      action.payload.file.children = []
    }
  }

  yield parent.children.push(action.payload.file)
  yield put(addVerifiedFile(state.data))
}

export function* renameFile(action) {
  // Redux state 'files'
  let state = yield select(state => state.files)
  let newFileName = yield call(preprocessFileName, action.payload.newName)
  let isFileNameValid = yield call(validateFileName, action.payload.newName)
  if (!isFileNameValid) {
    // Invalid filename
    console.log(
      '%cFile renaming failed: New filename ' +
      '(' + action.payload.file.module + ')' +
      ' is invalid', 'color: red'
    )
    yield put(fileNameInvalid(action.payload.file.module))
    return
  }

  let oldFile = Object.assign({}, action.payload.file)
  // Extract Parent's Path
  let parentPath = yield call(extractParentsPath, action.payload.file)
  /**
   * Find parent folder in the file structure
   */
  let parent = yield findObjectByPath(state.data, parentPath)
  if (parent === null) {
    // Dispatch error message
    return
  }
  /**
   * Check if filename collides with any existing files
   */
  let res = yield checkFileNameCollisions(newFileName, parent)
  if (res.error) {
    yield put(fileAlreadyExists(res.file))
    return
  }

  // Create new file object
  let renamedFile = yield call(createRenamedFileObject, action.payload.file, newFileName)

  action.payload.file = renamedFile
  // Check if file was active/selected
  if (state.active.path === parentPath + oldFile.module) {
    // Change active file details to new name and path
    state.active = action.payload.file
  }

  /**
   *  Check if there is a localstorage data under old file's name,
   *  if there is update it's name to the new file name.
   */
  yield call(updateLocalstorageFileName, action.payload.file, oldFile)

  if (!action.payload.file.leaf) {
    yield call(changeSubfoldersPaths, action.payload.file, oldFile)
  }

  // Change file in the state structure
  let fileIdx = yield parent.children.findIndex((file) => {
    if (file.leaf) {
      return file.path === parentPath + oldFile.module
    } else {
      return file.path === parentPath + oldFile.module + '/'
    }
  })
  parent.children[fileIdx] = renamedFile
  yield put(addVerifiedFile(state.data))
}

export function* setExampleFiles(action) {
  let state = yield select(state => state.files)
  let examples = yield action.payload.examples.find(obj => { return obj.module === EXAMPLES_FOLDER_NAME })
  examples.fetch = true
  /**
   * Find if the example root folder already exists
   * in the data structure.
   */
  let currentExamplesIdx = yield state.data.children.findIndex((folder) => {
    return folder.module === EXAMPLES_FOLDER_NAME
  })
  if (currentExamplesIdx >= 0) {
    // If it does, change it to new value
    // TODO: Check if there are any changes
    state.data.children[currentExamplesIdx] = examples
  } else {
    // Example root folder does not exists, create it
    yield state.data.children.push(examples)
  }
  yield put(exampleFilesFetched())
}
