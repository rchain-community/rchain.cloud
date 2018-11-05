import { EDITOR_VALUE_CHANGED, EDITOR_COMPILE_CODE, EDITOR_COMPILE_RESULTS } from '../actions'
import { EVALUATE_CODE_URL } from '../constants'

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
  switch (action.type) {
    case EDITOR_VALUE_CHANGED:
      state.value = action.payload.value
      return Object.assign({}, state)

    case EDITOR_COMPILE_CODE:
      window.fetch(EVALUATE_CODE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ code: state.value })
      }).then(res => {
        return res.json()
      }).then(data => {
        action.asyncDispatch({ type: EDITOR_COMPILE_RESULTS, payload: { output: data.output, evaluating: data.evaluating } })
      }).catch((err) => {
        console.log('Error while requesting code eval: ' + err)
      })
      let newState = Object.assign({}, state)
      newState.console.compiling = true
      newState.console.content.output = ''
      newState.console.content.evaluating = ''
      newState.console.content.success = false

      return newState
    case EDITOR_COMPILE_RESULTS:
      newState = Object.assign({}, state)
      newState.console.content.output = action.payload.output
      newState.console.content.evaluating = action.payload.evaluating
      newState.console.compiling = false
      newState.console.content.success = true
      return newState
    default:
      return Object.assign({}, state)
  }
}
