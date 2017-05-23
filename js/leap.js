var state = 'play';
window.onkeypress = function(e) {
  if (e.charCode == 32) { //spacebar
    if (state == 'play') {
      state = 'pausing';
    }else{
      state = 'play';
    }
  }
};
var haveLoggedFrame = false;
var controller = new Leap.Controller({enableGestures: true});
controller.loop(function(frame) {
  if (state == 'paused'){
      return
  }
  if (state == 'pausing') {
    state = 'paused';
  }else{
    if(frame.hands[0] && frame.hands[0].type === 'right'){
        var x = Math.floor((frame.hands[0].direction[0] + 1) * 128);
        var z = Math.floor ((frame.hands[0].direction[1] + 1) *  128);
        var y = Math.floor((frame.hands[0].direction[2] + 1) *  128);
        var color = 'rgb(' + x + "," + z + "," + y + ')';
        sendColor(color);
    }
  }

  if (haveLoggedFrame == false && frame.hands[0]){
    haveLoggedFrame = true;
  }

});
function sendColor(color){
    document.getElementById('box').style.backgroundColor = color;
}
