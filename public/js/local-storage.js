/*
  Before page unloads save the editors state to the local storage
*/
window.onbeforeunload = function (e) {
    if (typeof (Storage) !== "undefined") {
        window.localStorage.setItem("codeStorage", myCodeMirror.getValue());
    }
};

// Key press listener
document.onkeydown = function(e) {
  if(e.ctrlKey && e.which == 83){
    // Ctrl + S pressed
    e.preventDefault();
    saveEditorState();
  }
};

/*
  We save the state of the editor 2s after the last change on the editor.
  That can be achieved with timers.
*/
//Timer object
var changeTimer = null; //setTimeout(timerCallback, 10000);

function saveEditorState() {
    if (typeof (Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        $('#editorSaveIcon').fadeIn('slow');
        window.localStorage.setItem("codeStorage", myCodeMirror.getValue());
        setTimeout(function () {
            $('#editorSaveIcon').fadeOut("slow");
        }, 2000);
    }

}

myCodeMirror.on("change", function (changeObj) {
    //console.log("Code changed! " + changeObj);
    if (changeTimer == null) {
        //Setup timer
        changeTimer = setTimeout(saveEditorState, 2000);
    } else {
        //Reset running timer
        window.clearTimeout(changeTimer);
        changeTimer = setTimeout(saveEditorState, 2000);
    }

})