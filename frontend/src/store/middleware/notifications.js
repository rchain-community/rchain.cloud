import { FILE_INVALID_NAME, FILE_ALREADY_EXISTS, FILE_FETCHING_ERROR, EDITOR_COMPILATION_FAILURE } from '../../actions'
import { toastr } from 'react-redux-toastr'

const notificationMiddleWare = store => next => action => {
  switch (action.type) {
    case FILE_INVALID_NAME:
      toastr.error('File name invalid', `File name "${action.payload.value}" is invalid, please enter a valid file name.`)
      break
    case FILE_ALREADY_EXISTS:
      toastr.error('File already exists', `"${action.payload.value.path}" already exists. Please consider entering a different file name.`)
      break
    case FILE_FETCHING_ERROR:
      toastr.error('Fetching error', `Error while fetching "${action.payload.value}".`)
      break
    case EDITOR_COMPILATION_FAILURE:
      toastr.error('Evaluation error', `Error while evaluating: ${action.payload.error}`)
      break
  }
  next(action)
}

export default notificationMiddleWare
