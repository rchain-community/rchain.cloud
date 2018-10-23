export const FILE_SELECTED = 'FILE_SELECTED'
export const FILE_ADDED = 'FILE_ADDED'
export const FILE_RENAMED = 'FILE_RENAMED'
export const SET_EXAMPLES = 'SET_EXAMPLES'

export const SETTINGS_MODAL_TOGGLE = 'SETTINGS_MODAL_TOGGLE'
export const FULLSCREEN_MODE_TOGGLE = 'FULLSCREEN_MODE_TOGGLE'

export const EDITOR_VALUE_CHANGED = 'EDITOR_VALUE_CHANGED'
export const EDITOR_COMPILE_CODE = 'EDITOR_COMPILE_CODE'

export function selectFile(file) {
  return {
    type: FILE_SELECTED,
    payload: file
  }
}

export function renameFile(file, newName) {
  return {
    type: FILE_RENAMED,
    payload: {
      file: file,
      newName: newName
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

export function setExamples(examples) {
  return {
    type: SET_EXAMPLES,
    payload: {
      examples: examples
    }
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
