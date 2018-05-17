var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('mirror'), {
  lineNumbers: true,
  lineWrapping: true,
  tabSize: 3,
  mode: 'rholang',
  theme: 'solarized'
})
var lastType = ''

// Run event triggered by user
function run () {
  socket.emit('run', {version: config.version, body: myCodeMirror.getValue()})
  $('#runButton').text('Loading...').addClass('loading')
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
socket.on('output.done', function () { loadingDone() })

// Functions for callbacks from socket.io
function clearConsole () {
  lastType = ''
  document.getElementById('consoleLabel').style.display = 'none'
  document.getElementById('consoleText').innerHTML = '<h4 class="uploading">uploading</h4>'
}

function appendToConsole (data) {
  var message = data[0]
  var type = data[1]

  if (type === 'queued') {
    document.getElementById('consoleText').innerHTML = '<h4 class="uploading">uploading</h4>'
  }

  if (message.length < 24 && message.indexOf(':\r\n') === message.length - 3) {
    message = '<span style="color: #9a9ea2;">' + message + '</span>'
  }

  message = message.replace(/^Syntax Error,/, '<span style="color: #e63747;">Syntax Error</span>,')
  message = message.replace(/^Container Error: /, '<span style="color: #e63747;">Container Error: </span>')

  document.getElementById('consoleText').innerHTML +=
    (type !== lastType ? '<h4 class="' + type.replace(' ', '-') + '">' + type + '</h4>' : '') +
    (message.length ? '<div class="type-' + type + '">' + message + '</div>' : '')

  lastType = type
}

function showOptions () {
  document.getElementById('runOptions').className = 'modal open'
}

function hideOptions () {
  document.getElementById('runOptions').className = 'modal'
}

function loadingDone () {
  $('#runButton').text('Run').removeClass('loading')
  document.getElementById('consoleText').innerHTML += '<h4 class="completed">completed</h4>'
}

function selectVersion (select) {
  config.version = select.options[select.selectedIndex].value
}

$('.console').on('click', 'h4.storage-contents', function () {
  $('.console').toggleClass('show-storage')
})
