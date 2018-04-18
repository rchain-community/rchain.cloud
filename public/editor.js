var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('mirror'), {
  lineNumbers: true,
  lineWrapping: true,
  tabSize: 3,
  mode: 'php',
  theme: 'solarized'
})
// Run event triggered by user
function run () {
  socket.emit('run', {version: 'latest', body: myCodeMirror.getValue()})
  document.getElementById('runButton').innerHTML = 'Loading...'
}
// Socket.io stuff
var socket = io('http://rchain.cloud/')
socket.on('output.clean', function () { clearConsole() })
socket.on('output.append', function (message) { appendToConsole(message) })
socket.on('output.done', function (message) { loadingDone() })
// Functions for callbacks from socket.io
function clearConsole () {
  document.getElementById('consoleText').innerHTML = ''
}

function appendToConsole (message) {
  document.getElementById('consoleText').innerHTML += message
}

function loadingDone () {
  document.getElementById('runButton').innerHTML = 'Run'
}
