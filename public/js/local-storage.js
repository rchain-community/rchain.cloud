import { myCodeMirror } from './code-mirror.js'

var storageAvailable = false;

$(document).ready(function (){
    if (typeof (Storage) !== "undefined") {
        storageAvailable = true;
    }
});


/*
  Before page unloads save the editors state to the local storage
*/
window.onbeforeunload = function (e) {
    saveEditorState();
};


// Key press listener,
/*  
    ***
    Key shorcuts related to localstorage
    ***
*/
document.onkeydown = function (e) {

    if(! $('#keyboard-shortcuts-sw').prop("checked")){
        return;
    }

    if (e.ctrlKey && e.which == 83) {
        // Ctrl + S pressed
        e.preventDefault();
        saveEditorState();
    }
};

export function getStoredCode(path){
    if (storageAvailable){
        let storedCode = window.localStorage.getItem("storage:"+path);
        if( storedCode !== null){
            storedCode = JSON.parse(storedCode);
            return storedCode.codeStorage;
        }
    }
    return null;
}

export function saveLastSelected(data, path){
    if (storageAvailable){
        let storageSelected = {
            nodeId: data.nodeId,
            fullPath: path
        }
        window.localStorage.setItem("lastSelected", JSON.stringify(storageSelected));
        return 1;
    }
    return null;
}

export function getStoredSettings(){
    if(storageAvailable){
        if(window.localStorage.getItem("sidebarSettings") !== null){
            let sidebarSettings = JSON.parse(window.localStorage.getItem("sidebarSettings"));
            return sidebarSettings;
        }
    }
    return null;   
}

export function saveSetting(key, value){
    if(storageAvailable){
        let currentSettings = getStoredSettings();
        if(currentSettings !== null){
            currentSettings[key] = value;
            window.localStorage.setItem('sidebarSettings', JSON.stringify(currentSettings));
            return 1;
        }
    }
    return null;
}

export function saveEditorFont(font){
    if(storageAvailable){
        let currentSettings = getStoredSettings();
        currentSettings['editorFont'] = font;
        window.localStorage.setItem("sidebarSettings", JSON.stringify(currentSettings));
        return 1;
    }
    return null;
}

export function getStoredEditorFont(){
    if(storageAvailable){
        let settings = getStoredSettings();
        if (settings !== null && 'editorFont' in settings){
            return settings['editorFont'];
        }
    }
    return null;
}

export function getLastSelected(){
    if(storageAvailable){
        let lastSelected = window.localStorage.getItem('lastSelected');
        if(lastSelected !== null){
            return JSON.parse(lastSelected);
        }
    }
    return null;
}


export function saveEditorState() {
    if (typeof (Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        $('#editorSaveIcon').fadeIn('slow');
        let node = $('#tree').treeview('getSelected')[0];
        let current = node;

        if (current === undefined){
            console.log("File not selected!");
            return;
        }
        let path = "";
        // Get the full path of the file
        console.log(current);
        while (typeof current.parentId !== "undefined") {
            //console.log(current);
            path = "/" + current.text + path;
            current = $('#tree').treeview('getParent', current);
        }
        path = "/" + current.text + path;

        let fileStorage = {
            nodeId: node.nodeId,
            fullPath: path,
            codeStorage: myCodeMirror.getValue()
        }


        window.localStorage.setItem("storage:" + path, JSON.stringify(fileStorage));
        setTimeout(function () {
            $('#editorSaveIcon').fadeOut("slow");
        }, 2000);
    }

}

