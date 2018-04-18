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
var socket = io()
socket.on('output.clean', function () { clearConsole() })
socket.on('output.append', function (message) { appendToConsole(message) })
socket.on('output.done', function (data) { loadingDone(data) })

// Functions for callbacks from socket.io
function clearConsole () {
  document.getElementById('consoleText').innerHTML = '<span style="color: #9a9ea2;">&gt;</span>&nbsp;'
}

function appendToConsole (message) {
  console.log(JSON.stringify(message))

  if (message.length < 24 && message.indexOf(':\r\n') === message.length - 3) {
    message = '<span style="color: #9a9ea2;">' + message + '</span>'
  }

  message = message.replace('\r\n> ', '\r\n<span style="color: #9a9ea2;">&gt;</span>&nbsp;')
  document.getElementById('consoleText').innerHTML += message
}

function loadingDone (data) {
  document.getElementById('runButton').innerHTML = 'Run'
  document.getElementById('consoleText').innerHTML += '<span style="color: #9a9ea2;">' +
    'Completed in ' + data.executionTime + 's.</span>'
}
