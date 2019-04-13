export const DEFAULT_BACKEND_PORT = parseInt(process.env.EXTERNAL_BACKEND_PORT, 10) || 10000
export const IP = process.env.IP
export const PROTOCOL = process.env.HTTPS === 'true' ? 'https' : 'http'
export const SERVER_URL = PROTOCOL + '://' + IP + ':' + DEFAULT_BACKEND_PORT + '/'
export const FETCH_EXAMPLE_LIST_URL = SERVER_URL + 'example-files/'
export const EVALUATE_CODE_URL = SERVER_URL + 'v1/node/eval'
export const EVALUATE_CODE_TIMEOUT = 30000

export const EXAMPLES_FOLDER_NAME = 'examples'
export const WORKSPACE_FOLDER_NAME = 'workspace'

export const LOCALSTORAGE_APP_STATE_KEY = 'state'
export const LOCALSTORAGE_FILE_CONTENT_KEY = 'file-content'
