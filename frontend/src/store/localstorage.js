import { LOCALSTORAGE_APP_STATE_KEY, LOCALSTORAGE_FILE_CONTENT_KEY } from '../constants'

/**
 * Load state from the local storage.
 */
export const loadState = () => {
  try {
    const state = window.localStorage.getItem(LOCALSTORAGE_APP_STATE_KEY)
    if (state === null) {
      return undefined
    }
    const stateParsed = JSON.parse(state)
    return stateParsed
  } catch (err) {
    console.log('Error while reading from local storage')
    return undefined
  }
}

/**
 * Save the state to the local storage
 * @param {object} state Redux state of the app
 */
export const saveState = (state) => {
  try {
    const stateStringified = JSON.stringify(state)
    window.localStorage.setItem(LOCALSTORAGE_APP_STATE_KEY, stateStringified)
  } catch (err) {
    console.log('Error while writing to local storage')
  }
}

export const saveFile = (file, content) => {
  try {
    const fileObject = {
      file: file,
      content: content
    }
    const fileParsed = JSON.stringify(fileObject)

    const localstorageKey = LOCALSTORAGE_FILE_CONTENT_KEY + file.path
    window.localStorage.setItem(localstorageKey, fileParsed)
  } catch (err) {
    // TODO: Display error toast to the user
    console.log('Error while saving file ' + err)
  }
}

export const loadFile = (file) => {
  try {
    const fileObject = window.localStorage.getItem(LOCALSTORAGE_FILE_CONTENT_KEY + file.path)
    const parsedFile = JSON.parse(fileObject)

    return parsedFile
  } catch (err) {
    // TODO: Display error toast to the user
    console.log('Error while loading file ' + err)
    return undefined
  }
}
