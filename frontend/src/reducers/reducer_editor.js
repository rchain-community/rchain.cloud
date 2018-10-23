import { EDITOR_VALUE_CHANGED, EDITOR_COMPILE_CODE } from '../actions'
import { EVALUATE_CODE_URL } from '../constants'

const defaultState = {
  editor: {
    value: ''
  },
  console: {
    compiling: false,
    output: {
      content: ''
    }
  }
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case EDITOR_VALUE_CHANGED:
      return Object.assign({}, { editor: { value: action.payload.value } })
    case EDITOR_COMPILE_CODE:
      window.fetch(EVALUATE_CODE_URL, {
        method: 'POST',
        body: state.editor.value
      }).then(res => {
        return res.text()
      }).then(data => {
        console.log(data)
      }).catch((err) => {
        console.log('Error while requesting code eval: ' + err)
      })

      return Object.assign({}, state)
    default:
      return Object.assign({}, state)
  }
}
