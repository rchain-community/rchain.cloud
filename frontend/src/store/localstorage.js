/**
 * Load state from the local storage.
 */
export const loadState = () => {
  try {
    const state = window.localStorage.getItem('state')
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
    window.localStorage.setItem('state', stateStringified)
  } catch (err) {
    console.log('Error while writing to local storage')
  }
}
