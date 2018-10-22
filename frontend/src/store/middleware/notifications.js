// import { toastr } from 'react-redux-toastr'

const notificationMiddleWare = store => next => action => {
  next(action)
  /*
  console.log(action)
  action.type === 'FILE_SELECTED' && toastr.success('Title', 'Success')
  next(action)
  */
}

export default notificationMiddleWare
