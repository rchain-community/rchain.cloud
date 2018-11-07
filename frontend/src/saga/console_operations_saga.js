import { editorCompilationDone, editorCompilationInProgress } from '../actions'
import { put, select } from 'redux-saga/effects'
import { EVALUATE_CODE_URL } from '../constants'

export function* compileCode() {
  let state = yield select(state => state.editor)
  let payload = yield JSON.stringify({ code: state.value })
  try {
    yield put(editorCompilationInProgress())
    let response = yield window.fetch(EVALUATE_CODE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: payload
    })
    let resJSON = yield response.json()
    yield put(editorCompilationDone(resJSON.evaluating, '', resJSON.output))
  } catch (error) {
    console.log('Error while requesting code eval: ' + error)
  }
}
