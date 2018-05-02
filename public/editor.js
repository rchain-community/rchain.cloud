var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('mirror'), {
  lineNumbers: true,
  lineWrapping: true,
  tabSize: 3,
  mode: 'rholang',
  theme: 'solarized'
})

// Run event triggered by user
function run () {
  socket.emit('run', {version: config.version, body: myCodeMirror.getValue()})
  document.getElementById('runButton').innerHTML = 'Loading...'
}

// Socket.io stuff
var socket = io()
socket.on('connect', function () {
  if (config.autorun) {
    run()
  }
})
socket.on('output.clean', function () { clearConsole() })
socket.on('output.append', function (message) { appendToConsole(message) })
socket.on('output.done', function (data) { loadingDone(data) })

// Functions for callbacks from socket.io
function clearConsole () {
  document.getElementById('consoleText').innerHTML = '<span style="color: #757a84;">&gt;</span>&nbsp;'
}

function appendToConsole (message) {
  if (message.length < 24 && message.indexOf(':\r\n') === message.length - 3) {
    message = '<span style="color: #9a9ea2;">' + message + '</span>'
  }

  message = message.replace('\r\n> ', '\r\n<span style="color: #757a84;">&gt;</span>&nbsp;')
  message = message.replace(/^Syntax Error,/, '<span style="color: #e63747;">Syntax Error</span>,')
  document.getElementById('consoleText').innerHTML += message
}

function showOptions () {
  document.getElementById('runOptions').className = 'modal open'
}

function hideOptions () {
  document.getElementById('runOptions').className = 'modal'
}

function loadingDone (data) {
  document.getElementById('runButton').innerHTML = 'Run'
  document.getElementById('consoleText').innerHTML += '<span style="color: #757a84;">' +
    'Completed in ' + data.executionTime + 's.</span>'
}

function selectVersion (select) {
  config.version = select.options[select.selectedIndex].value
}

fetch('/v1/versions').then(function (response) {
  response.json().then(function (data) {
    data.forEach(function (version) {
      if (version !== 'latest') {
        document.getElementById('selectVersion').innerHTML += '<option value="' + version + '">' +
          version + '</option>'
      }
    })
  })
})
