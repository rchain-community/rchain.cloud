import { SETTINGS_MODAL_TOGGLE, FULLSCREEN_MODE_TOGGLE, ABOUT_MODAL_TOGGLE } from '../actions/index'

const defaultState = {
  modal: {
    open: false
  },
  aboutModalOpen: false,
  fullscreen: {
    enabled: false
  }
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case SETTINGS_MODAL_TOGGLE:
      return Object.assign({}, state, { modal: { open: !state.modal.open } })
    case ABOUT_MODAL_TOGGLE:
      return Object.assign({}, state, { aboutModalOpen: !state.aboutModalOpen })
    case FULLSCREEN_MODE_TOGGLE:
      return Object.assign({}, state, { fullscreen: { enabled: !state.fullscreen.enabled } })
  }

  return state
}
