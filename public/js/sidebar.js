import { saveLastSelected, getStoredSettings, getLastSelected, getStoredCode, saveSetting } from './local-storage.js'
import { myCodeMirror } from './code-mirror.js'

/*
    TreeView init
*/
$('#tree').treeview({
    data: getTree(),
    levels: 5,
    multiSelect: false
});

// Sidebar drawer init
$(document).ready(function () {
    $('.drawer').drawer();

    if (typeof (Storage) !== "undefined") {
        //console.log("Local storage available");

        let sidebarSettings = getStoredSettings();
        if (sidebarSettings !== null){
            $('#keyboard-shortcuts-sw').prop("checked", sidebarSettings['keyboardShortcuts']);
        }
        let lastSelected = getLastSelected();
        if( lastSelected !== null){
            $('#tree').treeview('selectNode', [ lastSelected.nodeId, { silent: true } ]);
        }

        let storedCode = getStoredCode(lastSelected.fullPath);
        if (storedCode !== null) {
            // Set the editor code to the local storage content
            myCodeMirror.setValue(storedCode);
        }

    } else {
        // No Web Local Storage support..
        /*
          Basically all modern browsers support local storage so 
          this shouldn't present any problems.
          Alternative to the Local Storage can be standard cookies 
          but they are very limited in storage capacity.
        */
        console.log("Local storage not available");
    }

});

$('#keyboard-shortcuts-sw').change(updateSidebarSettings); 

function updateSidebarSettings(){
    // Add more in the future
    saveSetting("keyboardShortcuts", $('#keyboard-shortcuts-sw').prop("checked"));
}

/*
  Sidebar init
*/
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
$('.drawer').on('drawer.opened', function () {
    $('.program').css('opacity', 0.2);
    //console.log("Drawer opening");
});

$('.drawer').on('drawer.closed', function () {
    $('.program').css('opacity', 1.0);
    //console.log("Drawer closed");
});

/*
  This works faster then using the events of the drawer
  but this only works then the nav bar button is pressed.
  This doesn't work when the bar is open and user clicks 
  randomly on the screen to close the sidebar.
*/
$('#drawerButton').on('click', function drawerClick() {
    if ($(".drawer").hasClass("drawer-open")) {
        setTimeout(function () {
            $('.program').css('opacity', 1.0);
        }, 300);
    } else {
        $('.program').css('opacity', 0.2);
    }
});


/*
Format example file data to the format specified 
by the TreeView docs. Example is shown bellow.
*/
function getTree() {

    var paths = [];
    /*
      For each file path remove the root folder "./public/..."
      as the web server doesn't store the static files with 
      the "/public/" folder as it's root.
    */
    window.exampleFiles.forEach(file => {
        file = file.substring(8, file.length);
        if(file.toUpperCase().endsWith(".RHO")){
            paths.push(file);
            //console.log(file);
        }
        //console.log(file.split("/"));
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
        if (!child) children.push(child = { text: head, nodes: [] });
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
    function treeIterate(current, depth) {
        var children = current.nodes;
        if (children.length > 0) {
            current.icon = "far fa-folder-open";
            current.selectable = false;
            //console.log(current);
        } else {
            current.icon = "far fa-file-code";
        }
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i]) {
                treeIterate(children[i], depth + 1);
            }
        }
    }

    treeIterate(filesArray[0], 0);

    /**
     * Manually add file entries to the sidebar here
     */

    let workspace = {
        text: "Workspace",
        icon: "far fa-folder-open",
        selectable: false,
        nodes: [
            {
                text: "Untitled.rho",
                icon: "far fa-file-code",
                selectable: true
            }
        ]
    };

    filesArray.unshift(workspace);

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

/**
 * Once node(file) is selected it can not be selected again.
 * We can accomplish this behavior by using 'nodeUnselected' as the 
 * event that actually selects the node. It may be counter intuitive 
 * at the first glance but it actually works pretty nicely.
 * When the node is selected, 'nodeSelect' event is triggered, that event
 * then calls the 'nodeUnselect' on that node which basically selects the node.
 * Selecting the node in 'nodeUnselected' is called with silent option turned 
 * on so that it doesn't trigger 'nodeSelected' event, that would cause recursion.
 */
$('#tree').on('nodeUnselected', function(event, data){
    $('#tree').treeview('selectNode', [data.nodeId, { silent: true }]);
    //console.log(data);
});


/*
  Select listener for Rholang examples from the sidebar
*/
$('#tree').on('nodeSelected', function (event, data) {
    $('.drawer').drawer('close');
    console.log(data);
    $('#tree').treeview('unselectNode', [data.nodeId, { silent: false }]);
    //$('#tree').treeview('disableNode', [ data.nodeId, { silent: true } ]);
    data.selectable = false;
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
    while (typeof current.parentId !== "undefined") {
        //console.log(current);
        path = "/" + current.text + path;
        current = $('#tree').treeview('getParent', current);
        //debugger;
    }
    path = "/" + current.text + path;

    
    saveLastSelected(data, path);

    // Check if the file is in local storage
    let storedCode = getStoredCode(path);
    
    if(storedCode !== null){
        myCodeMirror.setValue(storedCode);
        // Stop here
        return;
    }

    if(path.toUpperCase().startsWith("/WORKSPACE")){
        // File can not be pulled via AJAX
        myCodeMirror.setValue("");
    }else{
        // AJAX file path
        /*
        Send the AJAX request and set the editor
        code as the file content
        */
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    //console.log(this.responseText);
                    myCodeMirror.setValue(this.responseText);
                } else {
                    console.log("Error: ", xhttp.statusText);
                }

            }
        };
        xhttp.open("GET", path, true);
        xhttp.send();
    }
    
    

});