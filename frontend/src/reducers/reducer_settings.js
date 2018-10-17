import { SETTINGS_MODAL_TOGGLE, FULLSCREEN_MODE_TOGGLE } from '../actions/index'

const defaultState = {
  modal: {
    open: false
  },
  fullscreen: {
    enabled: false
  }
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case SETTINGS_MODAL_TOGGLE:
      return Object.assign({}, state, { modal: { open: !state.modal.open } })
    case FULLSCREEN_MODE_TOGGLE:
      return Object.assign({}, state, { fullscreen: { enabled: !state.fullscreen.enabled } })
  }

  return state
}
