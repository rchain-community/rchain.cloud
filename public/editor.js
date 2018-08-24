var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('mirror'), {
  lineNumbers: true,
  lineWrapping: true,
  tabSize: 3,
  mode: 'rholang',
  theme: 'solarized'
})
var lastType = ''

var editorFontSize = 16;

var isDragging = false;


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
    (type !== lastType ? '<h4 class="' + type.replace(' ', '-') + '">' +
      (type === 'stdout' ? 'output' : type) + '</h4>' : '') +
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



/*
  Callback for toggling the Presentation mode.
  Simply hide the unwanted elements with jQuery.
*/
function togglePresentation(){
  if($('#runButton').is(":hidden")){
    // Presentation mode is being turned off
    // Automatically decrease previously increased font size
    editorFontSize -= 10;
    $('.CodeMirror').css('font-size', editorFontSize + 'px');
    // Show hidden elements
    $('#runButton').show();
    $('#consoleDiv').show();
    $('.header').show();
    $('#draggable').show();
    $('#editorLabelDiv').show();
    $('.program').css('top', '64px');

    /*
      If the sidebar was open before the activation of
      the presentation mode, return opacity to 0.2
    */
    if($(".drawer").hasClass("drawer-open")){
      $('.program').css('opacity', 0.2);
    }
    
  }else{
    // Presentation mode is being turned on
    // Automatically increase font size by 10px
    editorFontSize += 10;
    $('.CodeMirror').css('font-size', editorFontSize + 'px');
    // Hide the run button and console div
    $('#runButton').hide();
    $('#consoleDiv').hide();
    $('.header').hide();
    $('#draggable').hide();
    $('#editorLabelDiv').hide();
    $('.program').css('top', '0px');
    /*
      In case the presentation mode is activated while
      the sidebar was open, set opacity to 1.0 
    */
    if($(".drawer").hasClass("drawer-open")){
      $('.program').css('opacity', 1.0);
    }
  }
  $('.CodeMirror').toggleClass('CodeMirror-presentation');
  myCodeMirror.refresh();
}

/*
  Callbacks for the editorFontSize buttons.
  As the name suggests they increase/decrease
  the font size of the editor.
*/
function increaseEditorFontSize(){
  //Upper limit for the font size
  if(editorFontSize >= 200){
    console.log("Can't increase font anymore");
    return;
  }
  editorFontSize++;
  $('.CodeMirror').css('font-size', editorFontSize + 'px');
}

function decreaseEditorFontSize(){
  //Bellow 8px font is barely readable
  if(editorFontSize <= 8){
    console.log("Can't decrease font anymore");
    return;
  }
  editorFontSize--;
  $('.CodeMirror').css('font-size', editorFontSize + 'px');
}

/*
  Draggable horizontal line mouse listeners
*/
var pageWidth;
$('#draggable').mousedown(function(e){
  isDragging = true;
  pageWidth = $('body').width();
  //console.log(pageWidth);
  e.preventDefault();
});

$(document).mouseup(function(e){
  isDragging = false;
}).mousemove(function(e){
  if(isDragging){
      //console.log("PageX: " + e.pageX);
      $('#consoleDiv').css('width', pageWidth-e.pageX);
  }
})

// Key press listener
document.onkeyup = function(e) {
  //Multiple key combinations can be added here
  // 80 == 'p'
  if (e.ctrlKey && e.altKey && e.which == 80) {
    //alert("Ctrl + Alt + P pressed");
    togglePresentation(); 
    
  }
};
// Sidebar drawer init
$(document).ready(function() {
  $('.drawer').drawer();
});

$('.drawer').drawer({
  class: {
    nav: 'drawer-nav',
    toggle: 'drawer-toggle',
    overlay: 'drawer-overlay',
    open: 'drawer-open',
    close: 'drawer-close',
    dropdown: 'drawer-dropdown'
  },
  iscroll: {
    // Configuring the iScroll
    // https://github.com/cubiq/iscroll#configuring-the-iscroll
    mouseWheel: true,
    preventDefault: false
  },
  showOverlay: true
});

/*
  When opening sidebar, opacity of the main div is set to 0.2,
  and then again returned to 1.0 when sidebar closes.
*/
$('.drawer').on('drawer.opened', function(){
  $('.program').css('opacity', 0.2);
  //console.log("Drawer opening");
});

$('.drawer').on('drawer.closed', function(){
  $('.program').css('opacity', 1.0);
  //console.log("Drawer closed");
});

/*
  This works faster then using the events of the drawer
  but this only works then the nav bar button is pressed.
  This doesn't work when the bar is open and user clicks 
  randomly on the screen to close the sidebar.
*/
function drawerClick(){
  if($(".drawer").hasClass("drawer-open")){
    $('.program').css('opacity', 1.0);

  }else{
    $('.program').css('opacity', 0.2);
  }
}


/*
  Format example file data to the format specified 
  by the TreeView docs. Example is shown bellow.
*/
function getTree(){

  var paths = [];
  /*
    For each file path remove the root folder "./public/..."
    as the web server doesn't store the static files with 
    the "/public/" folder as it's root.
  */
  window.exampleFiles.forEach(file =>{
    file = file.substring(8, file.length);
    paths.push(file);
    //console.log(file.split("/"));
    //console.log(file);
  })
  
  /*
    Recursive function that creates the tree structure from
    multiple file paths. This is best explained with the example.
    e.g. File paths:
    "/root/file1"
    "/root/dir1/file2"
    "/root/dir2/file3"
    "/root/dir2/file4"

    Output:
    {
      text: "root",
      nodes: [
        {
          text: "file1"
        },
        {
          text: "dir1",
          nodes: [
            {
              text: "file2"
            }
          ]
        },
        {
          text: "dir2",
          nodes:[
            {
              text: "file3"
            },
            {
              text: "file4"
            }
          ]
        }
      ]
    }
  */
  function insert(children = [], [head, ...tail]) {
    let child = children.find(child => child.text === head);
    if (!child) children.push(child = {text: head, nodes: []});
    if (tail.length > 0) insert(child.nodes, tail);
    return children;
  }
  
  let filesArray = paths
    .map(path => path.split('/').slice(1))
    .reduce((children, path) => insert(children, path), []);


  /*
    Recursive function that iterates over the tree structure
    and finds the nodes that are actually folders, not files.
    For each folder node we add the folder icon ("far fa-folder-open")
    and we declare that node as unselectable (only files can be selected).
  */
  function treeIterate(current, depth){
    var children = current.nodes;
    if(children.length > 0){
      current.icon = "far fa-folder-open";
      current.selectable = false;
      //console.log(current);
    }else{
      current.icon = "far fa-file-code";
    }
    for(var i = 0, len = children.length; i < len; i++){
      if(children[i]){
        treeIterate(children[i], depth+1);
      }
    }
  }
  
  treeIterate(filesArray[0], 0);
  
  
  /*
    Source data for the TreeView has to be organized
    in the format illustrated with the example bellow.

  var tree = [
    {
      text: "Parent 1",
      nodes: [
        {
          text: "Child 1",
          nodes: [
            {
              text: "Grandchild 1"
            },
            {
              text: "Grandchild 2"
            }
          ]
        },
        {
          text: "Child 2"
        }
      ]
    },
    {
      text: "Parent 2"
    },
    {
      text: "Parent 3"
    },
    {
      text: "Parent 4"
    },
    {
      text: "Parent 5"
    }
  ];
  */

  return filesArray;
}


/*
  TreeView init
*/
$('#tree').treeview({
  data: getTree(),
  levels: 5
});

/*
  Select listener for Rholang examples from the sidebar
*/
$('#tree').on('nodeSelected', function(event, data) {
  $('.drawer').drawer('close');
  var current = data;
  var path = "";
  /*
    Traverse up the tree to find the full path of the selected file,
    basically leaf of the tree is the filename itself and going up
    the tree each node is a parent directory/subdirectory of the file.
    e.g. /example/dir1/dir2/HelloWorld.rho
    HelloWorld.rho -> /dir2/HelloWorld.rho -> /dir1/dir2/HelloWorld.rho
    -> example/dir1/dir2/HelloWorld.rho
  */
  while(typeof current.parentId !== "undefined"){
    //console.log(current);
    path = "/" + current.text + path;
    current = $('#tree').treeview('getParent', current);
    //debugger;
  }
  path = "/" + current.text + path;

  // AJAX file path
  /*
    Send the AJAX request and set the editor
    code as the file content
  */
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if(this.readyState == 4){
      if(this.status == 200){
        //console.log(this.responseText);
        myCodeMirror.setValue(this.responseText);
      }else{
        console.log("Error: ", xhttp.statusText);
      }
      
    }
  };
  xhttp.open("GET", path, true);
  xhttp.send();

});