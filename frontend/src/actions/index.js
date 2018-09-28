export const FILE_SELECTED = 'FILE_SELECTED'
export const FILE_ADDED = 'FILE_ADDED'

export const SETTINGS_MODAL_TOGGLE = 'SETTINGS_MODAL_TOGGLE'
export const FULLSCREEN_MODE_TOGGLE = 'FULLSCREEN_MODE_TOGGLE'

export function selectFile(file) {
  return {
    type: FILE_SELECTED,
    payload: file
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
