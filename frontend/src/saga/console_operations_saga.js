import { editorCompilationDone, editorCompilationInProgress, editorCompilationFailed } from '../actions'
import { put, select } from 'redux-saga/effects'
import { EVALUATE_CODE_URL, EVALUATE_CODE_TIMEOUT } from '../constants'

function timeout(ms, promise) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error('Request timeout'))
    }, ms)
    promise.then(resolve, reject)
  })
}

export function* compileCode() {
  let state = yield select(state => state.editor)
  let payload = yield JSON.stringify({ code: state.value })
  try {
    yield put(editorCompilationInProgress())
    let response = yield timeout(EVALUATE_CODE_TIMEOUT, window.fetch(EVALUATE_CODE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: payload
    }))
    let resJSON = yield response.json()
    yield put(editorCompilationDone(resJSON.evaluating, '', resJSON.output))
  } catch (error) {
    console.log('Error while requesting code eval: ' + error)
    yield put(editorCompilationFailed(error))
  }
}
