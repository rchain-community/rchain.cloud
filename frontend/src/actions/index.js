export const FILE_SELECTED = 'FILE_SELECTED'

export function selectFile(file) {
  return {
    type: FILE_SELECTED,
    payload: file
  }
}
