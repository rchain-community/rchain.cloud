/*
  Draggable horizontal line mouse listeners
*/
var pageWidth;
var isDragging = false;
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