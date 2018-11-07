import { EDITOR_COMPILE_RESULTS, EDITOR_VALUE_CHANGED, EDITOR_COMPILATION_INPROGRESS } from '../actions'

export const defaultState = {
  value: '',
  console: {
    compiling: false,
    content: {
      evaluating: '',
      output: '',
      storageContents: '',
      success: false
    }
  }
}

export default function (state = defaultState, action) {
  let newStateConsole = Object.assign({}, state.console)
  switch (action.type) {
    case EDITOR_VALUE_CHANGED:
      state.value = action.payload.value
      return Object.assign({}, state)

    case EDITOR_COMPILATION_INPROGRESS:
      newStateConsole.compiling = true
      return Object.assign({}, state, { console: newStateConsole })

    case EDITOR_COMPILE_RESULTS:
      newStateConsole.content.output = action.payload.output
      newStateConsole.content.evaluating = action.payload.evaluating
      newStateConsole.compiling = false
      newStateConsole.content.success = true
      return Object.assign({}, state, { console: newStateConsole })
    default:
      return Object.assign({}, state)
  }
}
