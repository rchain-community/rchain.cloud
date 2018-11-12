export const BACKEND_PORT = parseInt(process.env.FRONTEND_PORT, 10) || 3000
export const SERVER_URL = 'http://localhost:' + BACKEND_PORT + '/'
export const FETCH_EXAMPLE_LIST_URL = SERVER_URL + 'example-files/'
export const EVALUATE_CODE_URL = SERVER_URL + 'server/eval/'
export const EVALUATE_CODE_TIMEOUT = 30000

export const EXAMPLES_FOLDER_NAME = 'examples'
export const WORKSPACE_FOLDER_NAME = 'workspace'

export const LOCALSTORAGE_APP_STATE_KEY = 'state'
export const LOCALSTORAGE_FILE_CONTENT_KEY = 'file-content'
