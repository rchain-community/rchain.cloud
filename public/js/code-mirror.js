/**
 * This module encapsulates code connected with 
 * codemirror 
 */

import { saveEditorState } from './local-storage.js'

export var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('mirror'), {
    lineWrapping: true,
    tabSize: 3,
    lineNumbers: true,
    mode: 'rholang',
    theme: 'solarized'
})



/*
  We save the state of the editor 2s after the last change on the editor.
  That can be achieved with timers.
*/
//Timer object
var changeTimer = null; //setTimeout(timerCallback, 10000);

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