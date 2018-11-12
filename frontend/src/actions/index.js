export const FILE_SELECTED = 'FILE_SELECTED'
export const FOLDER_SELECTED = 'FOLDER_SELECTED'
export const FILE_ADDED = 'FILE_ADDED'
export const FILE_ADDED_SUCCESS = 'FILE_ADDED_SUCCESS'
export const RENAME_FILE = 'RENAME_FILE'
export const FILE_RENAMED = 'FILE_RENAMED'
export const SET_EXAMPLES = 'SET_EXAMPLES'
export const EXAMPLE_FILES_FETCHED = 'EXAMPLE_FILES_FETCHED'

export const SETTINGS_MODAL_TOGGLE = 'SETTINGS_MODAL_TOGGLE'
export const FULLSCREEN_MODE_TOGGLE = 'FULLSCREEN_MODE_TOGGLE'

export const EDITOR_VALUE_CHANGED = 'EDITOR_VALUE_CHANGED'
export const EDITOR_VALUE_CHANGED_DEBOUNCED = 'EDITOR_VALUE_CHANGED_DEBOUNCED'
export const EDITOR_COMPILE_CODE = 'EDITOR_COMPILE_CODE'
export const EDITOR_COMPILATION_INPROGRESS = 'EDITOR_COMPILATION_INPROGRESS'
export const EDITOR_COMPILATION_FAILURE = 'EDITOR_COMPILATION_FAILURE'
export const EDITOR_COMPILE_RESULTS = 'EDITOR_COMPILE_RESULTS'
export const SAVE_FILE = 'SAVE_FILE'
export const SAVE_EDITOR_CONTENT = 'SAVE_EDITOR_CONTENT'

export const FILE_INVALID_NAME = 'FILE_INVALID_NAME'
export const FILE_ALREADY_EXISTS = 'FILE_ALREADY_EXISTS'

export const FILE_FETCHING_ERROR = 'FILE_FETCHING_ERROR'

export function selectFile(file) {
  return {
    type: FILE_SELECTED,
    payload: file
  }
}

export function selectFolder(folder) {
  return {
    type: FOLDER_SELECTED,
    payload: folder
  }
}

export function renameFile(file, newName) {
  return {
    type: RENAME_FILE,
    payload: {
      file: file,
      newName: newName
    }
  }
}

export function fileRenamed(file) {
  return {
    type: FILE_RENAMED,
    payload: {
      file: file
    }
  }
}

export function addVerifiedFile(data) {
  return {
    type: FILE_ADDED_SUCCESS,
    payload: {
      data: data
    }
  }
}

export function addFile(file, path) {
  return {
    type: FILE_ADDED,
    payload: {
      file: file,
      path: path
    }
  }
}

export function saveEditorContent(file, content) {
  return {
    type: SAVE_EDITOR_CONTENT,
    payload: {
      file: file,
      content: content
    }
  }
}

export function saveFile(file, content) {
  return {
    type: SAVE_FILE,
    payload: {
      file: file,
      content: content
    }
  }
}

export function setExamples(examples) {
  return {
    type: SET_EXAMPLES,
    payload: {
      examples: examples
    }
  }
}

export function exampleFilesFetched(examples) {
  return {
    type: EXAMPLE_FILES_FETCHED
  }
}

export function toggleSettingsModal() {
  return {
    type: SETTINGS_MODAL_TOGGLE
  }
}

export function toggleFullscreenMode() {
  return {
    type: FULLSCREEN_MODE_TOGGLE
  }
}

export function editorChangeValueDebounced(newValue) {
  return {
    type: EDITOR_VALUE_CHANGED_DEBOUNCED,
    payload: {
      value: newValue
    }
  }
}

export function editorChangeValue(newValue) {
  return {
    type: EDITOR_VALUE_CHANGED,
    payload: {
      value: newValue
    }
  }
}

export function editorCompileCode() {
  return {
    type: EDITOR_COMPILE_CODE
  }
}

export function editorCompilationInProgress() {
  return {
    type: EDITOR_COMPILATION_INPROGRESS
  }
}

export function editorCompilationFailed(error) {
  return {
    type: EDITOR_COMPILATION_FAILURE,
    payload: {
      error: error
    }
  }
}

export function editorCompilationDone(evaluating, storageContents, output) {
  return {
    type: EDITOR_COMPILE_RESULTS,
    payload: {
      output: output,
      evaluating: evaluating,
      storageContents: storageContents
    }
  }
}

export function fileNameInvalid(invalidFileName) {
  return {
    type: FILE_INVALID_NAME,
    payload: {
      value: invalidFileName
    }
  }
}

export function fileAlreadyExists(existingFile) {
  return {
    type: FILE_ALREADY_EXISTS,
    payload: {
      value: existingFile
    }
  }
}

export function fileFetchError(fileName) {
  return {
    type: FILE_FETCHING_ERROR,
    payload: {
      value: fileName
    }
  }
}
