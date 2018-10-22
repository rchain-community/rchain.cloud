import { EDITOR_VALUE_CHANGED } from '../actions'

export default function (state = { editor: { value: 'test' } }, action) {
  switch (action.type) {
    case EDITOR_VALUE_CHANGED:
      return Object.assign({}, { editor: { value: action.payload.value } })
    default:
      return Object.assign({}, state)
  }
}
