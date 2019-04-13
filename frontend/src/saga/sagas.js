import { call, takeEvery, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { FILE_SELECTED, FILE_ADDED, SAVE_FILE, SAVE_EDITOR_CONTENT, RENAME_FILE, SET_EXAMPLES, EDITOR_COMPILE_CODE } from '../actions'
import { saveFile } from '../store/localstorage'
import { fileSelected, addFile, renameFile, setExampleFiles } from './file_operations_saga'
import { compileCode } from './console_operations_saga'

function* saveEditorContent(action) {
  yield call(delay, 100)
  saveFile(action.payload.file, action.payload.content)
}

function* saveFileWorker(action) {
  yield saveFile(action.payload.file, action.payload.content)
}

export function* fileSelectedWatch() {
  yield takeEvery(FILE_SELECTED, fileSelected)
}

export function* saveFileWatch() {
  yield takeEvery(SAVE_FILE, saveFileWorker)
}

export function* saveEditorContentsWatch() {
  yield takeLatest(SAVE_EDITOR_CONTENT, saveEditorContent)
}

export function* addFileWatch() {
  yield takeLatest(FILE_ADDED, addFile)
}

export function* renameFileWatch() {
  yield takeEvery(RENAME_FILE, renameFile)
}

export function* setExampleFilesWatch() {
  yield takeLatest(SET_EXAMPLES, setExampleFiles)
}

export function* editorCompileCodeWatch() {
  yield takeLatest(EDITOR_COMPILE_CODE, compileCode)
}
