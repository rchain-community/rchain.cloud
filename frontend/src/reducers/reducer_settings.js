import { SETTINGS_MODAL_TOGGLE } from '../actions/index'

const defaultState = {
  modal: {
    open: false
  }
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case SETTINGS_MODAL_TOGGLE:
      return Object.assign({}, state, { modal: { open: !state.modal.open } })
  }

  return state
}
