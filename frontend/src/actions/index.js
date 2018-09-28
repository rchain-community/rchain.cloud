export const FILE_SELECTED = 'FILE_SELECTED'
export const SETTINGS_MODAL_TOGGLE = 'SETTINGS_MODAL_TOGGLE'

export function selectFile(file) {
  return {
    type: FILE_SELECTED,
    payload: file
  }
}

export function toggleSettingsModal() {
  return {
    type: SETTINGS_MODAL_TOGGLE
  }
}
