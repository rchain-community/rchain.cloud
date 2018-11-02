import { FILE_INVALID_NAME, FILE_ALREADY_EXISTS, FILE_FETCHING_ERROR } from '../../actions'
import { toastr } from 'react-redux-toastr'

const notificationMiddleWare = store => next => action => {
  switch (action.type) {
    case FILE_INVALID_NAME:
      toastr.error('File name invalid', `File name "${action.payload.value}" is invalid, please enter valid file name.`)
      break
    case FILE_ALREADY_EXISTS:
      toastr.error('File already exists', `File "${action.payload.value.path}" already exists. Please consider entering different file name.`)
      break
    case FILE_FETCHING_ERROR:
      toastr.error('Fetching error', `Error while fetching "${action.payload.value}".`)
      break
  }
  next(action)
}

export default notificationMiddleWare
